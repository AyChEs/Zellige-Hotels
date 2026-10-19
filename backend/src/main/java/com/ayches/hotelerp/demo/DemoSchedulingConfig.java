package com.ayches.hotelerp.demo;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Scheduling exists only for the demo refresher, so it is switched on with it. */
@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "app.demo.refresh", havingValue = "true")
class DemoSchedulingConfig {
}
