package com.preparefortelc;

import com.preparefortelc.shared.config.DatabaseConfig;
import com.zaxxer.hikari.HikariConfig;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseConfigTests {

    @Test
    void testRenderPostgresUrlNormalization() {
        DatabaseConfig config = new DatabaseConfig();
        ReflectionTestUtils.setField(config, "rawUrl", "postgres://telc_admin:SecretPass123!@dpg-c1234567-a.oregon-postgres.render.com:5432/prepare_for_telc_production");

        HikariConfig hikariConfig = config.createHikariConfig();
        assertEquals("jdbc:postgresql://dpg-c1234567-a.oregon-postgres.render.com:5432/prepare_for_telc_production", hikariConfig.getJdbcUrl());
        assertEquals("telc_admin", hikariConfig.getUsername());
        assertEquals("SecretPass123!", hikariConfig.getPassword());
        assertEquals("org.postgresql.Driver", hikariConfig.getDriverClassName());
    }

    @Test
    void testPostgresqlSchemeWithoutPort() {
        DatabaseConfig config = new DatabaseConfig();
        ReflectionTestUtils.setField(config, "rawUrl", "postgresql://telc_user:password@pg-host/my_db");

        HikariConfig hikariConfig = config.createHikariConfig();
        assertEquals("jdbc:postgresql://pg-host:5432/my_db", hikariConfig.getJdbcUrl());
        assertEquals("telc_user", hikariConfig.getUsername());
        assertEquals("password", hikariConfig.getPassword());
    }

    @Test
    void testStandardJdbcUrlPassedThrough() {
        DatabaseConfig config = new DatabaseConfig();
        ReflectionTestUtils.setField(config, "rawUrl", "jdbc:postgresql://localhost:5432/testdb");
        ReflectionTestUtils.setField(config, "username", "admin");
        ReflectionTestUtils.setField(config, "password", "pass");

        HikariConfig hikariConfig = config.createHikariConfig();
        assertEquals("jdbc:postgresql://localhost:5432/testdb", hikariConfig.getJdbcUrl());
        assertEquals("admin", hikariConfig.getUsername());
        assertEquals("pass", hikariConfig.getPassword());
    }

    @Test
    void testEmptyUrlFallsBackToH2() {
        DatabaseConfig config = new DatabaseConfig();
        ReflectionTestUtils.setField(config, "rawUrl", "");

        HikariConfig hikariConfig = config.createHikariConfig();
        assertTrue(hikariConfig.getJdbcUrl().startsWith("jdbc:h2:mem:prepare_for_telc"));
        assertEquals("telc_admin", hikariConfig.getUsername());
    }
}
