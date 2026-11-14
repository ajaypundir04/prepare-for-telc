package com.preparefortelc.shared.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:}")
    private String driverClassName;

    public HikariConfig createHikariConfig() {
        HikariConfig config = new HikariConfig();
        config.setPoolName("TelcHikariCP");
        config.setMaximumPoolSize(15);
        config.setMinimumIdle(5);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setConnectionTimeout(30000);
        config.setInitializationFailTimeout(30000);

        String jdbcUrl = (rawUrl != null) ? rawUrl.trim() : "";

        if (jdbcUrl.isEmpty()) {
            jdbcUrl = "jdbc:h2:mem:prepare_for_telc;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL";
            config.setDriverClassName("org.h2.Driver");
            config.setUsername("telc_admin");
            config.setPassword("");
            log.info("No datasource URL provided. Defaulting to in-memory H2 database: {}", jdbcUrl);
        } else if (jdbcUrl.startsWith("postgres://") || jdbcUrl.startsWith("postgresql://") || jdbcUrl.startsWith("jdbc:postgres://")) {
            try {
                // Strip existing jdbc: prefix if present before URI parsing
                String uriString = jdbcUrl.startsWith("jdbc:") ? jdbcUrl.substring(5) : jdbcUrl;
                if (uriString.startsWith("postgres://")) {
                    uriString = "postgresql://" + uriString.substring("postgres://".length());
                }
                URI uri = new URI(uriString);

                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath(); // e.g. /prepare_for_telc_production
                String database = (path != null && path.length() > 1) ? path.substring(1) : "";

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;
                config.setDriverClassName("org.postgresql.Driver");

                if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    config.setUsername(userInfo[0]);
                    if (userInfo.length > 1) {
                        config.setPassword(userInfo[1]);
                    }
                } else {
                    if (username != null && !username.isBlank()) config.setUsername(username);
                    if (password != null && !password.isBlank()) config.setPassword(password);
                }
                log.info("Transformed Render PostgreSQL URL to JDBC: jdbc:postgresql://{}:{}/{}", host, port, database);
            } catch (Exception e) {
                log.warn("Failed to parse PostgreSQL URI: {}, falling back to 'jdbc:' prefix", jdbcUrl, e);
                jdbcUrl = "jdbc:" + jdbcUrl;
            }
        } else {
            if (username != null && !username.isBlank()) config.setUsername(username);
            if (password != null && !password.isBlank()) config.setPassword(password);
            if (driverClassName != null && !driverClassName.isBlank()) {
                config.setDriverClassName(driverClassName);
            }
        }

        config.setJdbcUrl(jdbcUrl);
        return config;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        return new HikariDataSource(createHikariConfig());
    }
}
