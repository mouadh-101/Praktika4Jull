package esprit.microservice1.controller;


import esprit.microservice1.services.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{postId}/user/{userId}")
    public ResponseEntity<String> likePost(@PathVariable Integer postId, @PathVariable Integer userId) {
        return ResponseEntity.ok(likeService.likePost(postId, userId));
    }

    @GetMapping("/{postId}/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Integer postId) {
        return ResponseEntity.ok(likeService.countLikes(postId));
    }
}
