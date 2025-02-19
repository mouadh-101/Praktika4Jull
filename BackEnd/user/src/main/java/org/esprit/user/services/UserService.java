package org.esprit.user.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.esprit.user.entities.User;
import org.esprit.user.repositories.UserRepository;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final Keycloak keycloak;
    @Autowired
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    private static final String KEYCLOAK_TOKEN_URL = "http://localhost:8080/realms/Auth/protocol/openid-connect/token";
    private static final String CLIENT_ID = "praktika-Auth";
    private static final String CLIENT_SECRET = "BWWUc61P29hXkdaIc0QLW5OVT4qDQh9w";
    private static final String KEYCLOAK_LOGOUT_URL = "http://localhost:8080/realms/Auth/protocol/openid-connect/logout";


    public UserService() {
        this.keycloak = Keycloak.getInstance(
                "http://localhost:8080/", // Keycloak server URL
                "master", // Realm name (use 'master' for admin access)
                "admin1", // Admin username
                "admin1", // Admin password
                "admin-cli" // Client ID
        );
    }

    public String registerUser(User userDTO) {
        try {

            // Create a new user in Keycloak
            UserRepresentation user = new UserRepresentation();
            user.setUsername(userDTO.getEmail());
            user.setEmail(userDTO.getEmail());
            user.setFirstName(userDTO.getName());
            user.setEnabled(true);

            // Set credentials
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(userDTO.getPassword());
            credential.setTemporary(false);
            user.setCredentials(Collections.singletonList(credential));

            // Add the user to the realm
            keycloak.realm("Auth").users().create(user);
            userRepository.save(userDTO);
            return "User registered successfully!";
        } catch (Exception e) {
            return "Error registering user: " + e.getMessage();
        }
    }
    public String authenticateUser(String email, String password) {
        // Verify credentials against the MySQL database
        User user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            return "invalid Cridentiel";
        }

        // Obtain token from Keycloak
        try {

            return getKeycloakToken(email, password);
        } catch (Exception e) {
            return "Error obtaining token: " + e.getMessage();
        }
    }

    public String logoutUser(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Prepare request body for logout
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-www-form-urlencoded");

            // Include the token to be revoked
            String requestBody = String.format(
                    "client_id=%s&client_secret=%s&token=%s",
                    CLIENT_ID, CLIENT_SECRET, token
            );

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            // Call Keycloak logout endpoint
            ResponseEntity<Map> response = restTemplate.exchange(
                    KEYCLOAK_LOGOUT_URL,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            // Check if logout was successful
            if (response.getStatusCode().is2xxSuccessful()) {
                return "User logged out successfully!";
            } else {
                return "Error during logout: " + response.getBody().get("error");
            }
        } catch (Exception e) {
            return "Error during logout: " + e.getMessage();
        }
    }

    private String getKeycloakToken(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare request body
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        String requestBody = String.format(
                "grant_type=password&client_id=%s&client_secret=%s&username=%s&password=%s",
                CLIENT_ID, CLIENT_SECRET, username, password
        );

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        // Call Keycloak token endpoint
        ResponseEntity<Map> response = restTemplate.exchange(
                KEYCLOAK_TOKEN_URL,
                HttpMethod.POST,
                request,
                Map.class
        );

        // Extract access token
        return (String) response.getBody().get("access_token");
    }
    public User getUser(String email)
    {
        return userRepository.findByEmail(email);
    }
}