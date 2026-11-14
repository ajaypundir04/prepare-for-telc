package com.preparefortelc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.preparefortelc")
@EntityScan(basePackages = "com.preparefortelc")
@EnableJpaRepositories(basePackages = "com.preparefortelc")
public class PrepareForTelcApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrepareForTelcApplication.class, args);
    }
}
