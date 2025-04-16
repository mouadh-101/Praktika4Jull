package tn.esprit.gatew.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import tn.esprit.gatew.User;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String,String>> registerUser(@RequestBody User userDTO) {
        return userService.registerUser(userDTO);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateUser(@RequestBody User userDTO)
    {
       return userService.authenticateUser(userDTO.getEmail(),userDTO.getPassword());
    }
    @PostMapping("/logout")
    public ResponseEntity<Map<String,String>> logout(@RequestBody String token) {
        return userService.logoutUser(token);
    }
    @GetMapping("/me")
    public String getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return  jwt.getClaimAsString("preferred_username");
    }

}
