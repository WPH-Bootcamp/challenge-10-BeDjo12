export interface loginpayload {
  email: string;
  password: string;
}

export interface Registerpayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface PostsSearch {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface SearchResponse {
  data: PostsSearch[];
  total: number;
  page: number;
  lastPage: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
}

export interface PostItem {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface PostResponse {
  data: PostItem[];
  total: number;
  page: number;
  lastPage: number;
  user?: UserProfile;
}

export interface CommentRequest {
  postId: number;
  name: string;
  content: string;
}

export interface CommentResponse {
  id: number;
  postId: number;
  name: string;
  content: string;
  createdAt: string;
  author?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  tags: string[] | { name: string }[];
  createdAt: string;
}

export interface SinglePostResponse {
  data: Post;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  statusCode?: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image: File | null;
  tags: string;
}
