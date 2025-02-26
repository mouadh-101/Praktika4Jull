package esprit.microservice1.services;

import esprit.microservice1.entities.Comment;
import esprit.microservice1.entities.Post;

import java.util.List;

public interface IService {
    Comment addCommentandAffectToPost(Integer id, Comment comment);

    List<Comment> findAll();
    void delete(Integer id);
    Comment updateComment(Integer id , Comment commentDetails);


    Post addPost( Post post);
    List<Post> findAllPost();
    void deletePost(Integer id);

    Post updatePost(Integer id , Post postDetails);
}
