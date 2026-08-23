import { Injectable, signal } from '@angular/core';
import { Post } from './post.model';

const POSTS: Post[] = [
  {
    id: 'agentic-coding',
    title: "Agentic Software Development: Take the Director's Chair",
    description:
      "Why 'coding agent' undersells the job, and what it means to direct rather than micromanage AI-assisted development.",
    date: '2026-08-03',
    pdfUrl: '/post-files/agentic-coding/agentic-coding.pdf',
    contentUrl: '/post-files/agentic-coding/agentic-coding.html',
  },
  {
    id: 'how-much-data-do-you-need',
    title: 'How Much Data Do You Need?',
    description:
      'Data only has value in combination with a problem — why the amount of data you need depends on model complexity, not on collecting as much as possible.',
    date: '2026-08-23',
    pdfUrl: '/post-files/how-much-data-do-you-need/how-much-data-do-you-need.pdf',
    contentUrl: '/post-files/how-much-data-do-you-need/how-much-data-do-you-need.html',
  },
];

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly posts = signal<Post[]>([...POSTS].sort((a, b) => b.date.localeCompare(a.date)));

  readonly allPosts = this.posts.asReadonly();

  getPost(id: string): Post | undefined {
    return this.posts().find((post) => post.id === id);
  }
}
