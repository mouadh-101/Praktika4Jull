package esprit.microserviceinterview.Client;

import esprit.microserviceinterview.Client.Dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name="user", url = "http://localhost:8082/api/users")
public interface UserClient {
    @GetMapping("/userById")
    public UserDto getUserByUserId(String userId);

}
