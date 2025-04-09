
// Utility to format message date for display
export const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Check if message contains email or phone number
export const containsEmailOrPhone = (text: string) => {
  // Email regex pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  
  // Phone regex patterns (Brazilian format and international formats)
  const phonePatterns = [
    /(\(?\d{2}\)?\s?)(\d{4,5}[-\s]?\d{4})/g, // Brazilian format
    /\+\d{1,3}\s?\(\d{1,3}\)\s?\d{3,4}[-\s]?\d{4}/g, // International format
    /\d{3}[-\s]?\d{3}[-\s]?\d{4}/g, // Simple format
  ];
  
  if (emailPattern.test(text)) {
    return true;
  }
  
  for (const pattern of phonePatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  return false;
};
