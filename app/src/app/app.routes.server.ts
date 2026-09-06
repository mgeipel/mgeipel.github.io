import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { PostsService } from './posts/posts.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'posts/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return inject(PostsService)
        .allPosts()
        .map((post) => ({ id: post.id }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
