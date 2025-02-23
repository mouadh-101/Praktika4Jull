package org.esprit.user.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.esprit.user.entities.User;
import org.esprit.user.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;


    public String registerUser(User userDTO) {
        try {
            System.out.println(userDTO.toString());
            userRepository.save(userDTO);
            return "User registered successfully!";
        } catch (Exception e) {
            return "Error registering user: " + e.getMessage();
        }
    }
}