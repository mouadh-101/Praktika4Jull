package esprit.microservice1.services;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotService {

    private final WebClient webClient;
    private static final String API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = "";

    public ChatbotService() {
        this.webClient = WebClient.builder()
                .baseUrl(API_URL)
                .defaultHeader("Authorization", "Bearer " + API_KEY)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
    private static final int MAX_RETRIES = 3;

    public String getChatbotResponse(String prompt) {
        return Mono.defer(() -> callOpenAI(prompt))
                .retryWhen(Retry.backoff(MAX_RETRIES, Duration.ofSeconds(2)))
                .block();
    }

    private Mono<String> callOpenAI(String prompt) {
        return webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + API_KEY)
                .header("Content-Type", "application/json")
                .bodyValue(Map.of(
                        "model", "gpt-4o-mini",
                        "messages", List.of(Map.of("role", "user", "content", prompt)),
                        "max_tokens", 50
                ))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class).flatMap(errorBody -> {
                            System.err.println("Erreur API OpenAI : " + errorBody);
                            return Mono.error(new RuntimeException("API OpenAI erreur: " + errorBody));
                        })
                )
                .bodyToMono(String.class);
    }



}
