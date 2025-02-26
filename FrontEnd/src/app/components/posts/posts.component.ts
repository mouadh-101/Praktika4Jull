import { Component, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  isModalOpen = false;
  isEditModalOpen = false;  // Nouvelle variable pour gérer la modal de modification
  newPost = { description: '', datePost: '', image: '' };
  editedPost = { idPost: null, description: '', image: '' };  // Variables pour modifier un post
  idme:number=0;
  constructor(private service: PostService, private commentService: CommentService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  // Récupérer tous les posts
  getAllPosts() {
    this.service.getPosts().subscribe(
      data => {
        console.log('Posts récupérés:', data);
        this.posts = data;
      },
      error => {
        console.error('Erreur lors de la récupération des posts:', error);
      }
    );
  }

  // Ouvrir la modal pour créer un post
  openPostModal() {
    this.isModalOpen = true;
    this.newPost.datePost = new Date().toISOString().split('T')[0];
  }

  // Fermer la modal de création de post
  closePostModal() {
    this.isModalOpen = false;
  }

  // Ouvrir la modal pour modifier un post
  openEditModal(id:number,post: any) {
    this.editedPost = { ...post };  // Précharger les données du post dans le formulaire de modification
    this.isEditModalOpen = true;
    this.idme=id;
  }

  // Fermer la modal de modification de post
  closeEditModal() {
    this.isEditModalOpen = false;
  }

  // Ajouter un post
  submitPost(postForm: any) {
    if (postForm.valid) {
      this.service.addPost(this.newPost).subscribe(() => {
        this.getAllPosts();  // Recharge les posts après l'ajout
        this.closePostModal();
      });
    }
  }

  // Modifier un post
  submitEditPost(editPostForm: any) {
    if (editPostForm.valid) {
      this.service.updatePost(this.idme,this.editedPost).subscribe(() => {
        this.getAllPosts();  // Recharge les posts après la mise à jour
        this.closeEditModal();
      });
    }
  }

  // Supprimer un post
  del(id: number) {
    this.service.deletePost(id).subscribe(() => {
      this.getAllPosts();
    });
  }
  isChatVisible: boolean = false;

  // Fonction pour basculer la visibilité de l'iframe
  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  // Ajouter un commentaire
  newComment: string = '';
  addComment(postId: number): void {
    const commentContent = this.newComment;
    if (commentContent) {
      const newComment: any = {
        descriptionComment: commentContent,
        post: { idPost: postId }
      };
      this.commentService.addComment(postId, newComment).subscribe(
        (data) => {
          console.log('Comment added successfully', data);
          this.getAllPosts();  // Recharge les posts après l'ajout
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }

  // Supprimer un commentaire
  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe(
      () => {
        console.log('Comment deleted successfully');
        this.getAllPosts();
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }
}
