import type { Message, Project, Service } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Contact API
export const contactAPI = {
  submit: async (formData: Omit<Message, '_id' | 'createdAt' | 'status'>) => {
    return apiCall<Message>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
  getAll: async () => {
    return apiCall<Message[]>('/messages');
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    return apiCall<Service[]>('/services');
  },
  create: async (service: Omit<Service, '_id' | 'createdAt'>) => {
    return apiCall<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }
};

// Projects API
export const projectsAPI = {
  getAll: async (category?: string) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return apiCall<Project[]>(`/projects${query}`);
  },
  create: async (project: Omit<Project, '_id'>) => {
    return apiCall<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    return apiCall('/testimonials');
  },
  create: async (testimonial: {
    name: string;
    role?: string;
    content: string;
    rating?: number;
  }) => {
    return apiCall('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  },
};

// Careers API
export const careersAPI = {
  getAll: async () => {
    return apiCall('/careers');
  },
};

// Case studies API
export const caseStudiesAPI = {
  getAll: async () => {
    return apiCall('/case-studies');
  },
};

