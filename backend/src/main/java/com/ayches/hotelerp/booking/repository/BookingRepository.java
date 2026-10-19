package com.ayches.hotelerp.booking.repository;

import com.ayches.hotelerp.booking.domain.Booking;
import com.ayches.hotelerp.booking.domain.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    Page<Booking> findByClientId(Long clientId, Pageable pageable);

    Page<Booking> findByClientUserEmail(String email, Pageable pageable);

    boolean existsByCode(String code);

    long countByStatus(BookingStatus status);

    long countByCheckInDateBetweenAndStatusNot(LocalDate from, LocalDate to, BookingStatus status);

    @Query("select b.id from Booking b where b.notes = :notes order by b.checkInDate, b.id")
    List<Long> findIdsByNotesOrderByCheckIn(@Param("notes") String notes);

    /** Active bookings overlapping [checkIn, checkOut) for a room (half-open: same-day turnover ok). */
    @Query("""
            select count(b) > 0 from Booking b
            where b.room.id = :roomId
              and b.status in (
                  com.ayches.hotelerp.booking.domain.BookingStatus.PENDING,
                  com.ayches.hotelerp.booking.domain.BookingStatus.CONFIRMED,
                  com.ayches.hotelerp.booking.domain.BookingStatus.CHECKED_IN)
              and b.checkInDate < :checkOut
              and b.checkOutDate > :checkIn
            """)
    boolean existsOverlapping(@Param("roomId") Long roomId,
                              @Param("checkIn") LocalDate checkIn,
                              @Param("checkOut") LocalDate checkOut);
}
