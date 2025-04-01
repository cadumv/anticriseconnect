
export type PostType = 'post' | 'technical_article' | 'service' | 'opportunity';

export interface PostMetadata {
  type: PostType;
  title?: string;
  author?: string;
  company?: string;
  summary?: string;
  mainContent?: string;
  conclusions?: string;
  tags?: string[];
  image_urls?: string[];
  // Service-specific fields
  content?: string;
  // Opportunity-specific fields
  location?: string;
  partnerCount?: string;
  deadline?: string;
  skills?: string[];
  engineeringType?: string;
}

export interface PostData {
  content: string;
  image_url?: string | null;
  user_id: string;
  metadata: PostMetadata;
}
