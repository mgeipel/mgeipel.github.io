import { Injectable, signal } from '@angular/core';
import { Post } from './post.model';

const POSTS: Post[] = [
  {
    id: 'agentic-coding',
    title: "Agentic Software Development: Take the Director's Chair",
    description:
      "Why 'coding agent' undersells the job, and what it means to direct rather than micromanage AI-assisted development.",
    date: '2026-08-03',
    pdfUrl: '/post-files/agentic-coding.pdf',
    contentUrl: '/post-files/agentic-coding.html',
  },
];

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly posts = signal<Post[]>(POSTS);

  readonly allPosts = this.posts.asReadonly();

  getPost(id: string): Post | undefined {
    return this.posts().find((post) => post.id === id);
  }
}
