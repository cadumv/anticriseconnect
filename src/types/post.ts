
export interface Post {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
  type?: 'achievement' | 'post' | 'service' | 'technical_article';
  achievementId?: string;
  timestamp: string;
  imageUrl?: string;
  summary?: string;
  conclusions?: string;
  mainContent?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
  user_id?: string;
  metadata?: any;
  liked_by?: Array<{id: string, name: string}>; // Add liked_by field
}

export interface AchievementPost {
  id: string;
  content?: string;
  timestamp: string;
  type: 'achievement';
}

export interface StandardPost {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  type?: 'service' | 'technical_article';
  timestamp: string;
  imageUrl?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
  user_id?: string;
  metadata?: any;
  liked_by?: Array<{id: string, name: string}>; // Add liked_by field
}
