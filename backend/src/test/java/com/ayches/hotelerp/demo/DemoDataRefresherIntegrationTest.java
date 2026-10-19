package com.ayches.hotelerp.demo;

import com.ayches.hotelerp.booking.domain.BookingStatus;
import com.ayches.hotelerp.booking.repository.BookingRepository;
import com.ayches.hotelerp.dashboard.StatsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Runs against its own database with only the reference migrations (no db/dev seed),
 * so it starts with zero bookings and does not share rows with the other test classes.
 */
@SpringBootTest(properties = "app.demo.refresh=true")
class DemoDataRefresherIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine")
                    .withDatabaseName("hotelerp_demo")
                    .withUsername("test")
                    .withPassword("test");

    static {
        POSTGRES.start();
    }

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("spring.flyway.locations", () -> "classpath:db/migration");
    }

    @Autowired DemoDataRefresher refresher;
    @Autowired BookingRepository bookings;
    @Autowired StatsService stats;

    private long activeInWindow() {
        LocalDate today = LocalDate.now();
        return bookings.countByCheckInDateBetweenAndStatusNot(
                today.minusDays(30), today.plusDays(30), BookingStatus.CANCELLED);
    }

    @Test
    void startupFillsTheWindowAndTheMonthHasRevenue() {
        // The ApplicationRunner already ran on startup against an empty booking table.
        assertThat(activeInWindow()).isGreaterThanOrEqualTo(15);
        assertThat(bookings.findIdsByNotesOrderByCheckIn(DemoData.NOTE)).isNotEmpty();
        assertThat(stats.summary().revenueThisMonth()).isGreaterThan(BigDecimal.ZERO);
        assertThat(stats.summary().bookingsThisMonth()).isGreaterThan(0);
    }

    @Test
    void runningItAgainDoesNotDuplicate() {
        long before = bookings.count();

        DemoDataRefresher.Result again = refresher.refresh();
        refresher.refresh();

        assertThat(again.created()).isZero();
        assertThat(bookings.count()).isEqualTo(before);
    }
}
