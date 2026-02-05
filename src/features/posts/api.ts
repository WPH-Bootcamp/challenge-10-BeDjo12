import { api } from "@/lib/api";
import {
  SearchResponse,
  PostResponse,
  SinglePostResponse,
  CommentResponse,
  UserProfile,
  CreatePostPayload,
} from "@/types/blog";

export async function fetchSearch(query: string, limit = 10, page = 1) {
  const res = await api.get<SearchResponse>("/posts/search", {
    params: { query, limit, page },
  });
  return res.data;
}

export async function fetchRecommendedPosts(limit = 10, page = 1) {
  const res = await api.get<PostResponse>("/posts/recommended", {
    params: { limit, page },
  });
  return res.data;
}

export async function fetchMostLikedPosts(limit = 10, page = 1) {
  const res = await api.get<PostResponse>("/posts/most-liked", {
    params: { limit, page },
  });
  return res.data;
}

export async function fetchPostById(id: string) {
  const res = await api.get<SinglePostResponse>(`/posts/${id}`);
  return res.data;
}

export async function fetchCommentsByPostId(postId: string) {
  const res = await api.get<CommentResponse[]>(`/comments/${postId}`);
  return res.data;
}

export async function createComment(
  postId: string | number,
  data: { content: string },
) {
  const res = await api.post(`/comments/${postId}`, data);
  return res.data;
}

export async function fetchPostsByAuthor(
  authorId: string | number,
  limit = 10,
  page = 1,
) {
  const res = await api.get<PostResponse>(`/posts/by-user/${authorId}`, {
    params: { limit, page },
  });
  return res.data;
}

export async function fetchAuthorDetails(authorId: string | number) {
  const res = await api.get<{ data: UserProfile }>(`/users/${authorId}`);
  return res.data;
}

export const createPost = async (payload: CreatePostPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("tags", payload.tags);
  if (payload.image) {
    formData.append("image", payload.image);
  }

  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export async function fetchMyPosts(limit = 10, page = 1) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await api.get<PostResponse>("/posts/my-posts", {
    params: { limit, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deletePost(postId: number) {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
}
export const updatePost = async (id: number, payload: any) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("tags", payload.tags);

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  const response = await api.patch(`/posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
