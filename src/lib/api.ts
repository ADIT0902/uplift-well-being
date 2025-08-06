const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async register(data: { email: string; password: string; fullName: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data: { fullName?: string; username?: string }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(data: { email: string }) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: { token: string; password: string }) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Mood endpoints
  async createMoodEntry(data: { moodLevel: number; emotions: string[]; notes?: string }) {
    return this.request('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMoodEntries(params?: { limit?: number; page?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/mood${queryString}`);
  }

  async updateMoodEntry(id: string, data: { moodLevel: number; emotions: string[]; notes?: string }) {
    return this.request(`/mood/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMoodEntry(id: string) {
    return this.request(`/mood/${id}`, {
      method: 'DELETE',
    });
  }

  // Journal endpoints
  async createJournalEntry(data: { title: string; content: string; moodRating?: number; isPrivate?: boolean }) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getJournalEntries(params?: { limit?: number; page?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/journal${queryString}`);
  }

  async updateJournalEntry(id: string, data: { title: string; content: string; moodRating?: number; isPrivate?: boolean }) {
    return this.request(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJournalEntry(id: string) {
    return this.request(`/journal/${id}`, {
      method: 'DELETE',
    });
  }

  // Meditation endpoints
  async createMeditationSession(data: { sessionType: string; durationMinutes: number; completed?: boolean; notes?: string }) {
    return this.request('/meditation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMeditationSessions(params?: { limit?: number; page?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/meditation${queryString}`);
  }

  async updateMeditationSession(id: string, data: { sessionType: string; durationMinutes: number; completed?: boolean; notes?: string }) {
    return this.request(`/meditation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMeditationSession(id: string) {
    return this.request(`/meditation/${id}`, {
      method: 'DELETE',
    });
  }

  // Goals endpoints
  async createWellnessGoal(data: { title: string; description?: string; targetFrequency?: number }) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWellnessGoals() {
    return this.request('/goals');
  }

  async updateWellnessGoal(id: string, data: { title?: string; description?: string; targetFrequency?: number; currentStreak?: number; isCompleted?: boolean }) {
    return this.request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWellnessGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Community endpoints
  async createCommunityPost(data: { title: string; content: string; category?: string; isAnonymous?: boolean }) {
    return this.request('/community', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCommunityPosts(params?: { category?: string; limit?: number; page?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request(`/community${queryString}`);
  }

  async updateCommunityPost(id: string, data: { title: string; content: string; category?: string; isAnonymous?: boolean }) {
    return this.request(`/community/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCommunityPost(id: string) {
    return this.request(`/community/${id}`, {
      method: 'DELETE',
    });
  }

  async likeCommunityPost(id: string) {
    return this.request(`/community/${id}/like`, {
      method: 'POST',
    });
  }

  // Crisis endpoints
  async getCrisisResources() {
    return this.request('/crisis');
  }

  // AI endpoints
  async aiChat(data: { messages: Array<{ role: string; content: string }> }) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);