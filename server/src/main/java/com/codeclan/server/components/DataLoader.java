package com.codeclan.server.components;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("!test") //Run every time EXCEPT Tests
//@Component //comment this out once db has been seeded
public class DataLoader implements ApplicationRunner {

    public DataLoader() {

    }

    public void run(ApplicationArguments args) {

    }
}
