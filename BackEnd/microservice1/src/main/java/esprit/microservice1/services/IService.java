package esprit.microservice1.services;

import esprit.microservice1.entities.Comment;
import esprit.microservice1.entities.Post;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface IService {
    Comment addCommentandAffectToPost(Integer id, Comment comment);

    List<Comment> findAll();
    void delete(Integer id);
    Comment updateComment(Integer id , Comment commentDetails);


    Post addPost( Post post);
    public Page<Post> findAllPost(int page, int size);
    void deletePost(Integer id);
    public List<Post> filterPosts(String name, LocalDate date);
    Post updatePost(Integer id , Post postDetails);
}
