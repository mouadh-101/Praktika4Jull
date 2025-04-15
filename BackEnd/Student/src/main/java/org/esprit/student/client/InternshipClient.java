package org.esprit.student.client;



import org.esprit.student.controller.dto.InternshipDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "internship-server")
public interface InternshipClient {

    @GetMapping("/findInternshipById/{id}")
    InternshipDto getInternshipById(@PathVariable("id") int id);
}
