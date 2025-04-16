package esprit.microservice1.services;


import esprit.microservice1.entities.Like;
import esprit.microservice1.entities.Post;
import esprit.microservice1.entities.User;
import esprit.microservice1.repositories.LikeRepository;
import esprit.microservice1.repositories.PostRepo;
import esprit.microservice1.repositories.UserRepo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepo postRepository;
    private final UserRepo userRepository;

    public String likePost(Integer postId, Integer userId) {
        Optional<Post> post = postRepository.findById(postId);
        Optional<User> user = userRepository.findById(userId);

        if (post.isPresent() && user.isPresent()) {
            Optional<Like> existingLike = likeRepository.findByUserAndPost(user.get(), post.get());

            if (existingLike.isPresent()) {
                likeRepository.delete(existingLike.get());
                return "Like removed!";
            } else {
                Like like = new Like();
                like.setPost(post.get());
                like.setUser(user.get());
                likeRepository.save(like);
                return "Post liked!";
            }
        }
        return "Post or User not found!";
    }

    public long countLikes(Integer postId) {
        Optional<Post> post = postRepository.findById(postId);
        return post.map(likeRepository::countByPost).orElse(0L);
    }
}
