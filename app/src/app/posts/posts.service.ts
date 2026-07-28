import { Injectable, signal } from '@angular/core';
import { Post } from './post.model';

const MOCK_POSTS: Post[] = [
  {
    id: 'signals-are-not-magic',
    title: 'Signals Are Not Magic (But They Are Close)',
    date: '2026-07-21',
    pdfUrl: '#',
  },
  {
    id: 'why-i-rewrote-my-blog-again',
    title: 'Why I Rewrote My Blog Again',
    date: '2026-06-30',
    pdfUrl: '#',
  },
  {
    id: 'notes-on-standalone-everything',
    title: 'Notes on Standalone Everything',
    date: '2026-06-02',
    pdfUrl: '#',
  },
];

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly posts = signal<Post[]>(MOCK_POSTS);

  readonly allPosts = this.posts.asReadonly();

  getPost(id: string): Post | undefined {
    return this.posts().find((post) => post.id === id);
  }
}
