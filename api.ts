const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  businessName: string;
  userType: 'vendor' | 'supplier';
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    userType: 'vendor' | 'supplier';
    businessName: string;
  };
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log(`🌐 Making API request to: ${url}`);
      console.log('📤 Request data:', options.body);
      
      const response = await fetch(url, config);
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || errorData.details || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...signupData } = data;
    
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  // User profile methods
  async getProfile(): Promise<any> {
    return this.request('/vendors/profile');
  }

  async updateProfile(data: any): Promise<any> {
    return this.request('/vendors/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Suppliers methods
  async getSuppliers(params?: {
    category?: string;
    pincode?: string;
    radius?: number;
    minRating?: number;
    limit?: number;
    page?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/suppliers?${queryParams.toString()}`);
  }

  async getSupplierById(id: string): Promise<any> {
    return this.request(`/suppliers/${id}`);
  }

  // Orders methods
  async getOrders(params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/orders?${queryParams.toString()}`);
  }

  async getOrderById(id: string): Promise<any> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any): Promise<any> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Search methods
  async searchProducts(params?: {
    query?: string;
    category?: string;
    maxPrice?: number;
    minRating?: number;
    pincode?: string;
    limit?: number;
    page?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return this.request(`/search/products?${queryParams.toString()}`);
  }

  // Analytics methods
  async getAnalytics(period?: string): Promise<any> {
    return this.request(`/vendors/analytics?period=${period || 'month'}`);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  setAuthData(token: string, user: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBa5-PR5qFI7ssAVYI3VKWRRaGu6uSvLtQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Hugging Face API for voice-to-text
const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are BazaarBandhu AI, an agricultural assistant. Help users with mandi prices, supplier information, group orders, and farming advice. Be helpful and concise. User query: ${prompt}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

export const convertVoiceToText = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_HUGGING_FACE_TOKEN || 'hf_xxx'}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Voice-to-text API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Voice-to-text error:', error);
    return '';
  }
};

export const apiService = new ApiService();
export default apiService; 