package esprit.microservice1.services;

import esprit.microservice1.entities.Comment;
import esprit.microservice1.entities.Post;
import esprit.microservice1.repositories.CandidatRepo;
import esprit.microservice1.repositories.CommentRepo;
import esprit.microservice1.repositories.PostRepo;
import esprit.microservice1.repositories.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;

import java.util.List;

@org.springframework.stereotype.Service
@Slf4j
@AllArgsConstructor
public class Service implements IService{

PostRepo postRepo;
CommentRepo commentRepo;
UserRepo userRepo;


    @Override
    public Comment addCommentandAffectToPost(Integer id, Comment comment) {

        Post post = postRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));
        comment.setPost(post);
        return commentRepo.save(comment);
    }

    @Override
    public List<Comment> findAll() {
        return commentRepo.findAll();
    }

    @Override
    public void delete(Integer id) {
        commentRepo.deleteById(id);
    }

    @Override
    public Comment updateComment(Integer id, Comment commentDetails) {
        Comment comment = commentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + id));
        comment.setDescriptionComment(commentDetails.getDescriptionComment());
        comment.setRating(commentDetails.getRating());
        return commentRepo.save(comment);
    }





/////////////******Post*****////////////
    @Override
    public Post addPost(Post post) {
        return postRepo.save(post);
    }

    @Override
    public List<Post> findAllPost() {
        return postRepo.findAll(Sort.by(Sort.Direction.ASC, "datePost"));
    }

    @Override
    public void deletePost(Integer id) {
        postRepo.deleteById(id);
    }


    @Override
    public Post updatePost(Integer id, Post postDetails) {
        Post post = postRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with ID: " + id));
        post.setImage(postDetails.getImage());
        post.setDescription(postDetails.getDescription());
        post.setDatePost(postDetails.getDatePost());
        return postRepo.save(post);
    }
}
