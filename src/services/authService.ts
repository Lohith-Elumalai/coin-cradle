
// Service to handle authentication
import { toast } from "@/hooks/use-toast";

export enum AuthProvider {
  GOOGLE = "google",
  // Add more providers as needed
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  isAuthenticated: boolean;
}

class AuthService {
  // This would connect to your backend in a real application
  // For this demo, we'll simulate authentication
  private user: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('user');
      }
    }
  }

  // For demo purposes, simulate Google OAuth
  async signInWithGoogle(): Promise<User> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      this.user = {
        id: "user123",
        name: "Lohith E",
        email: "lohith.elu@gmail.com",
        photoURL: '/../../public/assets/image.png',
        isAuthenticated: true
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(this.user));
      
      // Notify listeners
      this.notifyListeners();
      
      toast({
        title: "Successfully signed in",
        description: `Welcome back, ${this.user.name}!`,
      });
      
      return this.user;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear user data
      this.user = null;
      localStorage.removeItem('user');
      
      // Notify listeners
      this.notifyListeners();
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "Please try again later",
        variant: "destructive",
      });
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.user.isAuthenticated;
  }

  // Subscribe to auth changes
  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    listener(this.user);
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.user));
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
