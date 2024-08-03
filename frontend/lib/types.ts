interface Post {
  id: number;
  title: string;
  description?: string;
  link: string;
  voteCount: number;
  userVote: number | null;
}

export type { Post };
