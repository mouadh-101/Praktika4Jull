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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
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
    public Page<Post> findAllPost(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "datePost"));
        return postRepo.findAll(pageable);
    }
    @Override
    public List<Post> filterPosts(String name, LocalDate date) {
        return postRepo.searchByNameAndDate(name, date);
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
        post.setName(postDetails.getName());
        post.setDatePost(postDetails.getDatePost());
        return postRepo.save(post);
    }
}
