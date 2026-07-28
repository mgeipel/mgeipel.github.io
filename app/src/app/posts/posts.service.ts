import { Injectable, signal } from '@angular/core';
import { Post } from './post.model';

const MOCK_POSTS: Post[] = [
  {
    id: 'signals-are-not-magic',
    title: 'Signals Are Not Magic (But They Are Close)',
    description: 'A look at what makes signals click, and where the illusion breaks down.',
    date: '2026-07-21',
    pdfUrl: '#',
  },
  {
    id: 'why-i-rewrote-my-blog-again',
    title: 'Why I Rewrote My Blog Again',
    description: 'The third rewrite in as many years, and what stuck this time.',
    date: '2026-06-30',
    pdfUrl: '#',
  },
  {
    id: 'notes-on-standalone-everything',
    title: 'Notes on Standalone Everything',
    description: 'Dropping NgModules across a real app and what actually changed.',
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
