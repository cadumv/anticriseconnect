
export interface Post {
  id: string;
  title?: string;
  author?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
  type?: 'achievement' | 'post' | 'service' | 'technical_article' | 'opportunity';
  achievementId?: string;
  timestamp: string;
  imageUrl?: string;
  image_url?: string;
  summary?: string;
  conclusions?: string;
  mainContent?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
  user_id?: string;
  metadata?: any;
  liked_by?: Array<{id: string, name: string}>;
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
  type?: 'service' | 'technical_article' | 'opportunity';
  timestamp: string;
  imageUrl?: string;
  image_url?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  company?: string;
  likes?: number;
  saves?: number;
  shares?: number;
  user_id?: string;
  metadata?: any;
  liked_by?: Array<{id: string, name: string}>;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  timestamp: string;
  parentId?: string | null;
  likes?: number;
  liked_by?: Array<{id: string, name: string}>;
  replies?: Comment[];
  post_id?: string;
}

export interface OpportunityPost extends StandardPost {
  type: 'opportunity';
  metadata?: {
    location?: string;
    partnerCount?: string;
    deadline?: string;
    skills?: string[];
    engineeringType?: string;
    image_urls?: string[];
  };
}
