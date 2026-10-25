package com.ayches.hotelerp.demo;

import com.ayches.hotelerp.booking.domain.BoardType;
import com.ayches.hotelerp.booking.domain.BookingStatus;
import com.ayches.hotelerp.booking.dto.BookingCreateRequest;
import com.ayches.hotelerp.booking.dto.BookingDto;
import com.ayches.hotelerp.booking.repository.BookingRepository;
import com.ayches.hotelerp.booking.service.BookingService;
import com.ayches.hotelerp.common.exception.BusinessRuleException;
import com.ayches.hotelerp.common.exception.ConflictException;
import com.ayches.hotelerp.invoice.domain.InvoiceStatus;
import com.ayches.hotelerp.invoice.domain.PaymentMethod;
import com.ayches.hotelerp.invoice.dto.GenerateInvoiceRequest;
import com.ayches.hotelerp.invoice.dto.InvoiceDto;
import com.ayches.hotelerp.invoice.service.InvoiceService;
import com.ayches.hotelerp.person.domain.Client;
import com.ayches.hotelerp.person.domain.ClientType;
import com.ayches.hotelerp.person.repository.ClientRepository;
import com.ayches.hotelerp.room.domain.Room;
import com.ayches.hotelerp.room.domain.RoomStatus;
import com.ayches.hotelerp.room.repository.RoomRepository;
import com.ayches.hotelerp.task.domain.TaskStatus;
import com.ayches.hotelerp.task.domain.TaskType;
import com.ayches.hotelerp.task.dto.TaskDto;
import com.ayches.hotelerp.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Keeps the public demo alive: tops up bookings around today and walks past ones through
 * the real lifecycle (confirm, check-in, check-out, invoice, payment) so the dashboard never
 * shows an empty month. Only active with {@code app.demo.refresh=true}.
 *
 * <p>Everything goes through the existing services, so pricing, board supplements, state
 * transitions and the no-overlap rule (service check + EXCLUDE constraint) all apply.
 * Each service call runs in its own transaction: a rejected booking is skipped, not fatal.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.demo.refresh", havingValue = "true")
public class DemoDataRefresher implements ApplicationRunner {

    /** Active bookings with check-in in [today - 30, today + 30] that count as "enough". */
    static final int MIN_BOOKINGS_IN_WINDOW = 15;
    /** When topping up, aim a bit higher so a daily run does not create one booking at a time. */
    static final int TARGET_BOOKINGS_IN_WINDOW = 24;
    static final int WINDOW_DAYS = 30;
    private static final int MAX_ATTEMPTS = 60;

    private static final String[][] DEMO_CLIENTS = {
            {"DEMO-0001", "Lucía", "Ortega Ruiz", "Sevilla"},
            {"DEMO-0002", "Karim", "Bennani", "Fez"},
            {"DEMO-0003", "Marta", "Puig Soler", "Girona"},
            {"DEMO-0004", "Hugo", "Navarro Gil", "Madrid"},
            {"DEMO-0005", "Salma", "Idrissi", "Rabat"},
            {"DEMO-0006", "Jordi", "Vidal Mas", "Tarragona"},
    };
    private static final String DEMO_CLIENT_EMAIL = "client@hotel-erp.dev";
    private static final BoardType[] BOARDS = BoardType.values();
    private static final PaymentMethod[] PAYMENTS = PaymentMethod.values();

    private final BookingService bookingService;
    private final InvoiceService invoiceService;
    private final TaskService taskService;
    private final BookingRepository bookings;
    private final RoomRepository rooms;
    private final ClientRepository clients;
    private final TransactionTemplate tx;

    @Override
    public void run(ApplicationArguments args) {
        refresh();
    }

    /** Daily at 04:15 server time, so the window keeps moving with the calendar. */
    @Scheduled(cron = "0 15 4 * * *")
    public void scheduledRefresh() {
        refresh();
    }

    /** Idempotent: creates nothing when the window already has enough bookings. */
    public synchronized Result refresh() {
        LocalDate today = LocalDate.now();
        int created = topUp(today);
        int advanced = advanceLifecycle(today);
        log.info("Demo data refresh: {} bookings created, {} advanced, {} active in the window",
                created, advanced, activeInWindow(today));
        return new Result(created, advanced);
    }

    long activeInWindow(LocalDate today) {
        return bookings.countByCheckInDateBetweenAndStatusNot(
                today.minusDays(WINDOW_DAYS), today.plusDays(WINDOW_DAYS), BookingStatus.CANCELLED);
    }

    // ---------- creation ----------

    private int topUp(LocalDate today) {
        if (activeInWindow(today) >= MIN_BOOKINGS_IN_WINDOW) {
            return 0;
        }
        List<Long> clientIds = demoClientIds();
        List<Room> bookable = rooms.findAll(Sort.by("id")).stream()
                .filter(r -> r.getStatus() != RoomStatus.OUT_OF_SERVICE
                        && r.getStatus() != RoomStatus.MAINTENANCE)
                .toList();
        if (bookable.isEmpty() || clientIds.isEmpty()) {
            return 0;
        }

        // Deterministic per day: same input, same plan, but the plan shifts as days pass.
        long seed = today.toEpochDay();
        int created = 0;
        for (int i = 0; i < MAX_ATTEMPTS && activeInWindow(today) < TARGET_BOOKINGS_IN_WINDOW; i++) {
            long n = seed + i * 7L;
            Room room = bookable.get(Math.floorMod(n * 3 + i, bookable.size()));
            int offset = Math.floorMod(n * 11 + i * 5, 2 * WINDOW_DAYS) - WINDOW_DAYS;
            int nights = 1 + Math.floorMod(n + i, 4);
            short guests = (short) Math.max(1, Math.min(room.getCapacity(), 1 + Math.floorMod(n, 3)));
            LocalDate checkIn = today.plusDays(offset);
            var request = new BookingCreateRequest(room.getId(),
                    clientIds.get(Math.floorMod(n + i, clientIds.size())),
                    checkIn, checkIn.plusDays(nights), guests,
                    BOARDS[Math.floorMod(n + 2L * i, BOARDS.length)], DemoData.NOTE);
            try {
                bookingService.create(request);
                created++;
            } catch (ConflictException | BusinessRuleException | DataIntegrityViolationException e) {
                // Overlap or capacity: the real rules said no, so this demo booking is skipped.
                log.debug("Demo booking skipped: {}", e.getMessage());
            } catch (RuntimeException e) {
                log.warn("Demo booking skipped after an unexpected error: {}", e.getMessage());
            }
        }
        return created;
    }

    private List<Long> demoClientIds() {
        List<Long> ids = new ArrayList<>();
        clients.findByUserEmail(DEMO_CLIENT_EMAIL).ifPresent(c -> ids.add(c.getId()));
        for (String[] data : DEMO_CLIENTS) {
            Long id = tx.execute(status -> clients.findByDocumentId(data[0])
                    .orElseGet(() -> clients.save(newClient(data))).getId());
            ids.add(id);
        }
        return ids;
    }

    private static Client newClient(String[] data) {
        Client client = new Client();
        client.setDocumentId(data[0]);
        client.setFirstName(data[1]);
        client.setLastName(data[2]);
        client.setAddress(data[3]);
        client.setClientType(ClientType.REGULAR);
        return client; // no login account: a walk-in client, no password and no emails
    }

    // ---------- lifecycle ----------

    private int advanceLifecycle(LocalDate today) {
        int advanced = 0;
        for (Long id : bookings.findIdsByNotesOrderByCheckIn(DemoData.NOTE)) {
            try {
                if (advance(bookingService.findById(id), today)) {
                    advanced++;
                }
            } catch (RuntimeException e) {
                // Someone (or a test) moved it by hand: leave it where it is.
                log.warn("Demo booking {} not advanced: {}", id, e.getMessage());
            }
        }
        return advanced;
    }

    /** Moves one demo booking to where its dates say it should be. Returns true if it changed. */
    private boolean advance(BookingDto booking, LocalDate today) {
        BookingStatus status = booking.status();
        if (status == BookingStatus.CANCELLED || status == BookingStatus.CHECKED_OUT) {
            return false;
        }
        boolean finished = !booking.checkOutDate().isAfter(today);
        boolean ongoing = !booking.checkInDate().isAfter(today) && !finished;
        boolean soon = !ongoing && !finished && !booking.checkInDate().isAfter(today.plusDays(7));
        if (!finished && !ongoing && !soon) {
            return false;
        }

        boolean invoiced = booking.invoiceId() != null;
        if (ongoing && status == BookingStatus.CHECKED_IN && invoiced) {
            return false; // already where it should be until check-out day
        }
        if (status == BookingStatus.CONFIRMED && soon) {
            return false;
        }

        if (status == BookingStatus.PENDING) {
            bookingService.confirm(booking.id());
        }
        if (finished || ongoing) {
            if (status != BookingStatus.CHECKED_IN) {
                bookingService.checkIn(booking.id());
            }
            InvoiceDto invoice = invoiced
                    ? invoiceService.findById(booking.invoiceId())
                    : invoiceService.generate(new GenerateInvoiceRequest(booking.id(),
                            PAYMENTS[Math.floorMod(booking.id(), PAYMENTS.length)]));
            if (finished) {
                bookingService.checkOut(booking.id());
                if (invoice.status() == InvoiceStatus.ISSUED) {
                    invoiceService.markPaid(invoice.id());
                }
                closeTurnover(booking);
            }
        }
        return true;
    }

    /** Housekeeping did its job: close the automatic cleaning task and free the room. */
    private void closeTurnover(BookingDto booking) {
        List<TaskDto> pending = taskService.search(booking.hotelId(), TaskStatus.PENDING,
                TaskType.CLEANING, null, PageRequest.of(0, 200)).content();
        for (TaskDto task : pending) {
            if (task.description() != null && task.description().contains(booking.code())) {
                taskService.changeStatus(task.id(), TaskStatus.DONE);
            }
        }
        tx.executeWithoutResult(status -> rooms.findById(booking.roomId()).ifPresent(room -> {
            if (room.getStatus() == RoomStatus.CLEANING) {
                room.setStatus(RoomStatus.AVAILABLE);
            }
        }));
    }

    public record Result(int created, int advanced) {
    }
}
