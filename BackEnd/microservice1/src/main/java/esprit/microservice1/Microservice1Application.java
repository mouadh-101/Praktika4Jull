package esprit.microservice1;

import esprit.microservice1.entities.Comment;
import esprit.microservice1.repositories.CandidatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAspectJAutoProxy
@EnableDiscoveryClient
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class Microservice1Application {

	public static void main(String[] args) {
		SpringApplication.run(Microservice1Application.class, args);
	}


}
