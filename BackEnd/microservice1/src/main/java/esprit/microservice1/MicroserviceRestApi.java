package esprit.microservice1;

import esprit.microservice1.entities.Comment;
import esprit.microservice1.entities.Post;
import esprit.microservice1.services.IService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@AllArgsConstructor
public class MicroserviceRestApi {
    @Autowired
    IService service;
////////////////*********CRUD POST*********////////////
    @PostMapping("/ajouterPost")
    Post addPost(@RequestBody Post post) {
        return  service.addPost(post);
    }


    @GetMapping("/post_list")
    public List<Post> findAllPost() {
        return service.findAllPost();
    }


    @DeleteMapping("/deletepost/{id}")
    public String deletePost(@PathVariable Integer id) {
        service.deletePost(id);
        return "Post deleted successfully";
    }


    @PutMapping ("/updatePost/{id}")
    Post updatePost(@PathVariable Integer id, @RequestBody Post post) {
        return  service.updatePost(id, post);
    }

///////////////*****crud comment*****////////////
    @PostMapping("/ajouterComment/{id}")
    Comment addCommentandAffectToPost(@PathVariable Integer id,@RequestBody Comment comment) {
        return  service.addCommentandAffectToPost(id,comment);
    }


    @GetMapping("/comment_list")
    public List<Comment> findAll() {
        return service.findAll();
    }


    @DeleteMapping("/deleteComment/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Comment deleted successfully";
    }


    @PutMapping ("/updateComment/{id}")
    Comment updateComment(@PathVariable Integer id, @RequestBody Comment comment) {
        return  service.updateComment(id, comment);
    }


}
