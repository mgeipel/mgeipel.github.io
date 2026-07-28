import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-detail',
  imports: [RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail {
  private readonly postsService = inject(PostsService);

  readonly id = input.required<string>();

  protected readonly post = computed(() => this.postsService.getPost(this.id()));
}
