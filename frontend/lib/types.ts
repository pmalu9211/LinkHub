interface Post {
  id: number;
  title: string;
  description?: string;
  link: string;
  userVote: number | null;
  createdAt: string;
  voteCount: number;
}

interface User {
  id: number;
  name?: string;
  username: string;
}

export type { Post, User };
