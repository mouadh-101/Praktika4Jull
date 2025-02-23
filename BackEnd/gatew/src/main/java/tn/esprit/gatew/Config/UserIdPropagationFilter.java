package tn.esprit.gatew.Config;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;


// Gateway's UserIdPropagationFilter.java
@Component
@Slf4j
public class UserIdPropagationFilter implements WebFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        log.info("🔍 Entering KeycloakUserFilter...");

        return exchange.getPrincipal()
                .cast(Authentication.class)
                .flatMap(auth -> {
                    log.info("✅ Authentication found: {}", auth.getClass().getSimpleName());

                    if (auth instanceof JwtAuthenticationToken) {
                        log.info("✅ JwtAuthenticationToken detected!");

                        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) auth;
                        Jwt jwt = jwtAuth.getToken();
                        String userId = jwt.getClaimAsString("sub");

                        log.info("🆔 Extracted User ID: {}", userId);

                        ServerWebExchange modifiedExchange = exchange.mutate()
                                .request(request -> request.header("userId", userId))
                                .build();

                        return chain.filter(modifiedExchange);
                    } else {
                        log.warn("⚠️ Unrecognized authentication type: {}", auth.getClass().getSimpleName());
                    }

                    return chain.filter(exchange);
                })
                .doOnError(error -> log.error("❌ Error in KeycloakUserFilter: ", error))
                .switchIfEmpty(chain.filter(exchange).doOnTerminate(() -> log.warn("⚠️ No authentication context found.")));
    }



}


