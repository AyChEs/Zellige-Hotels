package com.ayches.hotelerp.demo;

import com.ayches.hotelerp.support.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

/** Default configuration: the demo refresher must not exist (production unchanged). */
class DemoDataDisabledIntegrationTest extends AbstractIntegrationTest {

    @Autowired ApplicationContext context;

    @Test
    void refresherIsOffByDefault() {
        assertThat(context.getBeansOfType(DemoDataRefresher.class)).isEmpty();
        assertThat(context.getBeansOfType(DemoSchedulingConfig.class)).isEmpty();
    }
}
