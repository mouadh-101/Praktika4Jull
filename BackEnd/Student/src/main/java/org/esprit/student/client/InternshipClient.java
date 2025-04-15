package org.esprit.student.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name="internship-server")
public interface InternshipClient {
}
