import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList {
  private readonly postsService = inject(PostsService);

  protected readonly posts = this.postsService.allPosts;
}
