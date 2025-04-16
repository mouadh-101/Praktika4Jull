package esprit.microservice1.controller;
import esprit.microservice1.services.ChatbotService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @GetMapping("/ask")
    public String askChatbot(@RequestParam String message) {
        return chatbotService.getChatbotResponse(message);
    }
}
