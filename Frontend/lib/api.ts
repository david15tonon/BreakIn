// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://breakin-r2eq.onrender.com";

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  pseudonym: string;
}

export async function signupUser(userData: SignupData): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Signup failed");
  }

  return res.json();
}

export async function getUser(pseudonym: string): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/user/${pseudonym}`);
  if (!res.ok) {
    throw new Error("User not found");
  }
  return res.json();
}