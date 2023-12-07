package com.mapstone.mapstone;

import com.mapstone.mapstone.services.UserDetailsLoader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private UserDetailsLoader usersLoader;

    public SecurityConfiguration(UserDetailsLoader usersLoader) {
        this.usersLoader = usersLoader;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http

                .authorizeHttpRequests((requests) -> requests
                        /* Pages that do not require authentication
                         * anyone can visit the home page, register, login, and view ads */
                        .requestMatchers("/", "/login", "/sign-up","/viewprofile/*","/viewprofile/**","/search","/api/**", "/country","/users/viewprofile/*").permitAll()
                        /* Pages that require authentication
                         * only authenticated users can create and edit ads */
                        .requestMatchers("/profile", "/update", "/update/*", "/reset", "/reset/*", "/profile-picture","/viewprofile", "/test","/comment","url-images").authenticated()

                        // allow loading of static resources
                        .requestMatchers("/js/**", "/assets/**", "/css/**", "/data/**", "/api/**", "/media/**", "/images/*").permitAll()

                )
                /* Login configuration */
                .formLogin((login) -> login.loginPage("/login").defaultSuccessUrl("/profile"))
//                TODO GENERATE LOGIN FROM REGISTRATION PAGE
//                .formLogin((login) -> login.loginPage("/sign-up").defaultSuccessUrl("/welcome"))
                /* Logout configuration */
                .logout((logout) -> logout.logoutSuccessUrl("/"));
//                .httpBasic(withDefaults());
        return http.build();
    }

}

