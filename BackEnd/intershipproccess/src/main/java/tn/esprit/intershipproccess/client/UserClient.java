package tn.esprit.intershipproccess.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="user" , url = "${application.config.users-url}")
public interface UserClient {
    @GetMapping("/allusersId")
    List<String> findALLUsersId();
    @GetMapping("/userEmail/{userId}")
    String getUserEmail(@PathVariable("userId") String userId);
}
