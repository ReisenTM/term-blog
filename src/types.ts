export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  content: string;
  codeSnippet?: string;
  metrics: {
    nodes: string;
    throughput: string;
    load: number;
    wordCount: number;
    readingTime: string;
  };
}

export type ViewState = 'loading' | 'list' | 'article' | 'archive' | 'tags' | 'profile';
