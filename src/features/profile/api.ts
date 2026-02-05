import { api } from "@/lib/api";
import {
  UserProfile,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/types/blog";

export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (data: {
  name?: string;
  headline?: string;
  avatar?: File | null;
}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.headline) formData.append("headline", data.headline);
  if (data.avatar) formData.append("avatar", data.avatar);

  const res = await api.patch("/users/profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  const res = await api.patch<ChangePasswordResponse>(
    "users/password",
    payload,
  );
  return res.data;
}
