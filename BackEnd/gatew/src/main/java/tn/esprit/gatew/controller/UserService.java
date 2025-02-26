package tn.esprit.gatew.controller;


import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.gatew.User;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final Keycloak keycloak;
    PasswordEncoder passwordEncoder;
    private static final String KEYCLOAK_TOKEN_URL = "http://localhost:8180/realms/Auth/protocol/openid-connect/token";
    private static final String CLIENT_ID = "praktika-Auth";
    private static final String KEYCLOAK_LOGOUT_URL = "http://localhost:8180/realms/Auth/protocol/openid-connect/logout";
    private static final String url = "http://localhost:8222/api";


    public UserService() {
        this.keycloak = Keycloak.getInstance(
                "http://localhost:8180/", // Keycloak server URL
                "master", // Realm name (use 'master' for admin access)
                "admin1", // Admin username
                "admin1", // Admin password
                "admin-cli" // Client ID
        );
    }

    public ResponseEntity<Map<String,String>> registerUser(User userDTO) {
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
            keycloak.realm("Auth").users().create(user);
            String userId = getUserIdByUsername(keycloak, userDTO.getEmail());
            System.out.println(userId);
            if (userId!=null)
            {
                userDTO.setUserId(userId);
                System.out.println(userDTO.toString());
                if (userDTO.getRole().equals("Student"))
                {
                    sendUserData(userDTO,"/Student/add");
                    sendUserData(userDTO,"/users/signup");
                }

            }
            return ResponseEntity.ok(Map.of("massage","User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("massage","Error registering user: " + e.getMessage()));
        }
    }
    public static String getUserIdByUsername(Keycloak keycloak, String username) {
        List<UserRepresentation> users = keycloak.realm("Auth").users().searchByUsername(username, true);
        if(!users.isEmpty())
        {
            return users.get(0).getId();
        }
        return null;
    }
    public void sendUserData(User userDto,String endPoint) {
        String urlS=url+endPoint;
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<User> requestEntity = new HttpEntity<>(userDto, headers);

        restTemplate.exchange(urlS, HttpMethod.POST, requestEntity, Void.class);
    }
    public ResponseEntity<Map<String, String>> authenticateUser(String email, String password) {
        try {
            return ResponseEntity.ok(Map.of("token", getKeycloakToken(email, password)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Error obtaining token: " + e.getMessage()));
        }
    }

    public ResponseEntity<Map<String, String>> logoutUser(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Prepare request body for logout
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-www-form-urlencoded");

            // Include the token to be revoked
            String requestBody = String.format(
                    "client_id=%s&token=%s",
                    CLIENT_ID, token
            );

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            // Call Keycloak logout endpoint
            ResponseEntity<String> response = restTemplate.exchange(
                    KEYCLOAK_LOGOUT_URL,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            // Check if logout was successful
            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(Map.of("message","User logged out successfully!"));
            } else {
                return ResponseEntity.status(400).body(Map.of("message","Error during logout: " + response.getBody()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message","Error during logout: " + e.getMessage()));
        }
    }

    private String getKeycloakToken(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        // Prepare request body
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        // Adjusted for public client (no client secret)
        String requestBody = String.format(
                "grant_type=password&client_id=%s&username=%s&password=%s",
                CLIENT_ID, username, password
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

}