import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./posts/post-list/post-list').then((m) => m.PostList),
  },
  {
    path: 'posts/:id',
    loadComponent: () => import('./posts/post-detail/post-detail').then((m) => m.PostDetail),
  },
];
