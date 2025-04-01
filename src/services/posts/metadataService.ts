
type PostType = 'post' | 'technical_article' | 'service' | 'opportunity';

interface PostMetadata {
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

/**
 * Prepares post metadata based on post type
 */
export const preparePostMetadata = (
  postType: PostType, 
  data: Record<string, any>, 
  imageUrls: string[],
  userName?: string,
  userEngineeringType?: string
): PostMetadata => {
  // Common metadata for all post types
  const metadata: PostMetadata = {
    type: postType,
    image_urls: imageUrls
  };

  // Add metadata specific to post type
  switch (postType) {
    case 'technical_article':
      return {
        ...metadata,
        title: data.title,
        summary: data.summary,
        mainContent: data.mainContent,
        conclusions: data.conclusions,
        tags: data.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) || [],
        author: data.author?.trim() || userName || "Anônimo",
        company: data.company || userEngineeringType || "Engenheiro"
      };
    
    case 'service':
      return {
        ...metadata,
        title: data.serviceArea,
        content: data.serviceDescription,
        author: userName || "Anônimo",
        company: userEngineeringType || "Engenheiro"
      };
    
    case 'opportunity':
      return {
        ...metadata,
        title: data.title,
        location: data.location,
        partnerCount: data.partnerCount,
        deadline: data.deadline,
        skills: data.skills?.split(',').map((skill: string) => skill.trim()).filter(Boolean) || [],
        engineeringType: data.engineeringType
      };
    
    default:
      return metadata;
  }
};
