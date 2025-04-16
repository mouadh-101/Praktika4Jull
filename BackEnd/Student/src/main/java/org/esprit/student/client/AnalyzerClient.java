package org.esprit.student.client;

import org.esprit.student.controller.dto.ASIDto;
import org.esprit.student.controller.dto.AnalyzeDto;
import org.esprit.student.controller.dto.ApplicationDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "analyze-Ai", url = "http://localhost:5000")
public interface AnalyzerClient {

    @PostMapping("/analyze")
    AnalyzeDto analyzeApplication(@RequestBody ASIDto asiDto);
}