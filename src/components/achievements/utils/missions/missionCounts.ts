
/**
 * Helper function to count user's technical articles
 */
export function getTechnicalArticlesCount(userId: string): number {
  try {
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      if (Array.isArray(parsedPublications)) {
        return parsedPublications.filter(pub => pub.type === 'technical_article').length;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting technical articles:', error);
    return 0;
  }
}

/**
 * Helper function to count user's service publications
 */
export function getServicePublicationCount(userId: string): number {
  try {
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      if (Array.isArray(parsedPublications)) {
        return parsedPublications.filter(pub => pub.type === 'service').length;
      }
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting service publications:', error);
    return 0;
  }
}

/**
 * Helper function to count all user publications (for backward compatibility)
 */
export function getPublicationCount(userId: string): number {
  try {
    // Check user publications
    const publicationsKey = `user_publications_${userId}`;
    const userPublications = localStorage.getItem(publicationsKey);
    
    if (userPublications) {
      const parsedPublications = JSON.parse(userPublications);
      return Array.isArray(parsedPublications) ? parsedPublications.length : 0;
    }
    
    return 0;
  } catch (error) {
    console.error('Error counting publications:', error);
    return 0;
  }
}

/**
 * Helper function to count user connections
 */
export function getConnectionCount(userId: string): number {
  let connectionCount = 0;
  
  try {
    // Check connections made by the user
    const userConnectionKey = `connection_requests_${userId}`;
    const userRequests = localStorage.getItem(userConnectionKey);
    
    if (userRequests) {
      const parsedUserRequests = JSON.parse(userRequests);
      // Count accepted connection requests
      connectionCount += parsedUserRequests.filter((request: any) => 
        request.status === 'accepted'
      ).length;
    }
    
    // Check connections received by the user
    const allUsers = JSON.parse(localStorage.getItem('all_users') || '[]');
    
    for (const otherUserId of allUsers) {
      if (otherUserId === userId) continue;
      
      const connectionKey = `connection_requests_${otherUserId}`;
      const existingRequests = localStorage.getItem(connectionKey);
      
      if (existingRequests) {
        const requests = JSON.parse(existingRequests);
        const acceptedRequests = requests.filter((req: any) => 
          req.targetId === userId && req.status === 'accepted'
        );
        
        connectionCount += acceptedRequests.length;
      }
    }
    
    return connectionCount;
  } catch (error) {
    console.error('Error counting connections:', error);
    return 0;
  }
}
