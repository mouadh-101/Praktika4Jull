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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
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
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");

        return ResponseEntity.ok(response);
    }
    @GetMapping("/")
    public List<User> fndAll() {
        return userRepository.findAll();
    }
    @GetMapping("/userById")
    public User userByID(@RequestHeader("userId") String userId)
    {
        return userRepository.findById(userId).orElse(null);
    }

}