export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  createdAt: string;
  status?: 'read' | 'unread' | 'archived';
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  client?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  featured?: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
