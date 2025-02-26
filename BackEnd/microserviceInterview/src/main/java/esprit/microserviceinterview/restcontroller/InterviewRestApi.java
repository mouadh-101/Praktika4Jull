package esprit.microserviceinterview.restcontroller;
import esprit.microserviceinterview.entities.Interview;
import esprit.microserviceinterview.services.IServiceInterview;
import esprit.microserviceinterview.services.InterviewService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.function.EntityResponse;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/Interview")
public class InterviewRestApi {
    @Autowired
    InterviewService serviceInterview;
    @PostMapping(path = "/AddInterview")
    Interview ajouterInterview (@RequestBody Interview interview) {return serviceInterview.ajouterInterview(interview);}
    @DeleteMapping(path = "/Interview/{id}")
    void supprimerInterview(@PathVariable Long id)
    {
        serviceInterview.supprimerInterview(id);
    }
    @PutMapping(path = "/Interview/update")
    Interview updateInterview(@RequestBody Interview interview)
    {
        return serviceInterview.updateInterview(interview);
    }
    @GetMapping(path = "/Interview/{id}")
    Optional<Interview> chercherInterview(@PathVariable Long id)
    {return serviceInterview.chercherInterview(id);}
    @GetMapping("/list")
    public ResponseEntity<List<Interview>> getAll() {
        return new ResponseEntity<>(serviceInterview.getAll(), HttpStatus.CREATED);
    }
}

