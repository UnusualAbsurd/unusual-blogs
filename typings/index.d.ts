export type DBUser = {
  username: string;
  avatar: string;
  token: string;
  password: string;
  blogs: string[];
};

export type User = {
  username: string;
  avatar: string;
  token: string;
  blogs: string[];
};

export type Blog = {
  title: string;
  subtitle: string;
  content: string;
  _id: string;
  private_blog: boolean | null;
  views: number;
};
