// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://breakin-r2eq.onrender.com";
const TIMEOUT = 10000; // 10 seconds

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  pseudonym: string;
  token?: string;
}

export class ApiError extends Error {
  status?: number;
  data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function fetchWithTimeout(resource: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = {detail: 'default error'};
      try {
        errorData = await response.json();
      } catch (e) {
        // Si la réponse n'est pas du JSON valide
        errorData = { detail: 'Invalid response from server' };
      }
      throw new ApiError(
        errorData.detail || 'Request failed',
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw new ApiError(error.message || 'Network error');
    }

    throw new ApiError('An unknown error occurred');
  }
}

export async function signupUser(userData: SignupData): Promise<UserResponse> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Signup error:', error.message, error.status, error.data);
      throw error;
    }
    console.error('Unexpected error during signup:', error);
    throw new ApiError('An unexpected error occurred');
  }
}

export async function getUser(pseudonym: string, token?: string): Promise<UserResponse> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/user/${pseudonym}`, {
      headers,
    });
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Get user error:', error.message, error.status);
      throw error;
    }
    console.error('Unexpected error getting user:', error);
    throw new ApiError('An unexpected error occurred');
  }
}

export async function loginUser(
  email: string, 
  password: string
): Promise<{ user: UserResponse; token: string }> {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('Login error:', error.message, error.status);
      throw error;
    }
    console.error('Unexpected login error:', error);
    throw new ApiError('An unexpected error occurred during login');
  }
}