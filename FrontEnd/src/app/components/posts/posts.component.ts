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
  newPost = { description: '', datePost: '', image: '',name:'' };
  editedPost = { idPost: null, description: '', image: '',name:'',datePost: '' };  // Variables pour modifier un post
  idme:number=0;
isChatVisible: any;

  constructor(private service: PostService, private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadPosts()
  }
  name: string = '';
  date: string = '';


  searchPosts(): void {
    this.service.filterPosts(this.name, this.date).subscribe(response => {
      this.posts = response;
    });
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
        this.newPost = { description: '', datePost: '', image: '',name:'' };

        this.loadPosts();  // Recharge les posts après l'ajout
        this.closePostModal();
      });
    }
  }

  // Modifier un post
  submitEditPost(editPostForm: any) {
    if (editPostForm.valid) {
      this.service.updatePost(this.idme,this.editedPost).subscribe(() => {
        this.editedPost={description:'',name:'',image:'',idPost:null,datePost:''}
        this.loadPosts();  // Recharge les posts après la mise à jour
        this.closeEditModal();
      });
    }
  }

  // Supprimer un post
  del(id: number) {
    this.service.deletePost(id).subscribe(() => {
      this.loadPosts();
    });
  }

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
        alert('Comment added successfully');
        this.newComment=""
          this.loadPosts();  // Recharge les posts après l'ajout
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
        alert('Comment deleted successfully');
        this.newComment=""
        this.loadPosts();
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }
  currentPage: number = 0;
  pageSize: number = 5; // Nombre de posts par page
  totalPages: number = 0;
  loadPosts(): void {
    this.service.getPostspage(this.currentPage, this.pageSize).subscribe((response:any) => {
      console.log(response);
      
      this.posts = response.content; // Récupère les posts de la page actuelle
      this.totalPages = response.totalPages; // Nombre total de pages
    });
  }

  // Passer à la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPosts();
    }
  }

  // Revenir à la page précédente
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPosts();
    }
  }
}
