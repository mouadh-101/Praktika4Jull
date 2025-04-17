package org.esprit.student.client;

import org.esprit.student.controller.dto.UserData;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="user", url = "http://localhost:8082/api/users")

public interface UserClient {
    @GetMapping("/userByIdd/{id}")
    UserData getUserData(@PathVariable("id") String id);
}
