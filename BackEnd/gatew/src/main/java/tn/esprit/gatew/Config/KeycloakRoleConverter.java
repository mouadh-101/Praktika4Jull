package tn.esprit.gatew.Config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        // Extract "realm_access" from the JWT claims, which is expected to be a Map
        Map<String, Object> realmAccess = (Map<String, Object>) source.getClaims().get("realm_access");

        // Extract the list of roles from the "realm_access" map
        List<String> roles = (List<String>) realmAccess.get("roles");

        // Convert the roles to GrantedAuthority, prefix them with "ROLE_"
        return roles.stream()
                .map(role -> "ROLE_" + role) // Prefix roles with "ROLE_"
                .map(SimpleGrantedAuthority::new) // Convert to GrantedAuthority
                .collect(Collectors.toList());
    }

    @Override
    public <U> Converter<Jwt, U> andThen(Converter<? super Collection<GrantedAuthority>, ? extends U> after) {
        return Converter.super.andThen(after);
    }
}
