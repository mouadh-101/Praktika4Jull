package org.esprit.student.client;

import org.esprit.student.controller.dto.InternshipDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="internship-server", url = "http://localhost:8087/api/internships")
public interface InternshipClient {
    @GetMapping("/findInternshipById/{id}")
    InternshipDto getInternshipById(@PathVariable("id") int id);
    @GetMapping("/listById/{id}")
    List<InternshipDto> getInternshipsByCompanyId(@PathVariable("id") String userId);
}
