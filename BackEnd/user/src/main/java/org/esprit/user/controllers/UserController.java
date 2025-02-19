package org.esprit.user.controllers;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.esprit.user.entities.LoginRequest;
import org.esprit.user.entities.User;
import org.esprit.user.repositories.UserRepository;
import org.esprit.user.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
        userService.registerUser(user);

        // Return JSON response instead of plain text
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");

        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String token = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        String role=userRepository.findByEmail(loginRequest.getEmail()).getRole().toString();
        // Return token inside a JSON object
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role",role);

        return ResponseEntity.ok(response);
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/")
    public List<User> fndAll() {
        return userRepository.findAll();
    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body("Token is required for logout.");
            }

            // Call the logout method in UserService
            userService.logoutUser(token);

            return ResponseEntity.ok("Logged out successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during logout: " + e.getMessage());
        }
    }
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user/{email}")
    public User getUserByEmail(@PathVariable("email") String email)
    {
        return userService.getUser(email);
    }
}