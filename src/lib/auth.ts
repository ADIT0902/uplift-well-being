import { apiClient } from './api';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  avatarUrl?: string;
  emailConfirmed: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private listeners: Array<(state: AuthState) => void> = [];
  private state: AuthState = {
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: false
  };

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        apiClient.setToken(token);
        const response: any = await apiClient.getProfile();
        this.setState({
          user: response,
          token,
          isAuthenticated: true
        });
      } catch (error) {
        // Token is invalid, clear it
        this.signOut();
      }
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Immediately call with current state
    listener(this.state);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthState {
    return this.state;
  }

  async signUp(email: string, password: string, fullName: string) {
    try {
      const response: any = await apiClient.register({ email, password, fullName });
      
      if (response.token) {
        apiClient.setToken(response.token);
        this.setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const response: any = await apiClient.login({ email, password });
      
      if (response.token) {
        apiClient.setToken(response.token);
        this.setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    apiClient.setToken(null);
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  async updateProfile(data: { fullName?: string; username?: string }) {
    try {
      const response: any = await apiClient.updateProfile(data);
      this.setState({
        user: response.user
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    return apiClient.forgotPassword({ email });
  }

  async resetPassword(token: string, password: string) {
    return apiClient.resetPassword({ token, password });
  }
}

export const authManager = new AuthManager();