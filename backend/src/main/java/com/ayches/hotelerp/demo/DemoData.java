package com.ayches.hotelerp.demo;

import com.ayches.hotelerp.booking.domain.Booking;

/** Marker shared by the demo refresher and the mail service. */
public final class DemoData {

    /** Notes of every booking created by {@link DemoDataRefresher}. */
    public static final String NOTE = "[demo]";

    private DemoData() {
    }

    /** Demo bookings never send emails: they are not real guests. */
    public static boolean isDemo(Booking booking) {
        return NOTE.equals(booking.getNotes());
    }
}
