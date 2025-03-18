
/**
 * Format the comment text to highlight mentions and render images
 * 
 * @param text The comment text
 * @returns Formatted HTML string with highlighted mentions and images
 */
export const formatCommentText = (text: string): string => {
  // Replace mentions (@username) with a styled span
  let formattedText = text.replace(
    /@(\w+)/g, 
    '<span class="text-blue-600 font-medium">@$1</span>'
  );
  
  // Handle image tags that may be in the comment text (improved regex to better match image tags)
  formattedText = formattedText.replace(
    /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*class="([^"]*)"[^>]*\/?>/g,
    (match, src, alt, className) => {
      return `<div class="mt-2"><img src="${src}" alt="${alt}" class="max-h-60 max-w-full rounded-md object-contain ${className}" /></div>`;
    }
  );
  
  return formattedText;
};

/**
 * Insert a mention at the current cursor position in a textarea
 * 
 * @param textAreaRef Reference to the textarea element
 * @param username Username to mention
 */
export const insertMentionAtCursor = (textAreaRef: HTMLTextAreaElement, username: string): string => {
  const cursorPos = textAreaRef.selectionStart;
  const textBefore = textAreaRef.value.substring(0, cursorPos);
  const textAfter = textAreaRef.value.substring(cursorPos);
  
  // Add a space before the mention if there isn't one already
  const separator = textBefore.length > 0 && !textBefore.endsWith(' ') ? ' ' : '';
  
  // Add the mention
  const newText = `${textBefore}${separator}@${username} ${textAfter}`;
  
  return newText;
};

/**
 * Generate a shareable link for a post
 * 
 * @param postId The ID of the post
 * @returns A full URL to the post
 */
export const generateShareableLink = (postId: string): string => {
  return `${window.location.origin}/post/${postId}`;
};

/**
 * Process a comment text that contains base64 image data and convert it to a simpler img tag
 * 
 * @param text The comment text that may contain image data
 * @returns Processed text with proper img tags
 */
export const processCommentImages = (text: string): string => {
  // Check if there's an image tag in the text
  if (!text.includes('<img')) {
    return text;
  }
  
  // First handle any complex image tags and convert them to consistent format
  let processedText = text.replace(
    /<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*class="([^"]*)"[^>]*\/?>/g,
    (match, src, alt, className) => {
      return `<img src="${src}" alt="${alt}" class="${className}" />`;
    }
  );
  
  // Then handle simple image tags
  processedText = processedText.replace(
    /<img src="(data:image\/[^;]+;base64,[^"]+|https?:\/\/[^"]+)" alt="([^"]*)" class="([^"]*)"(\/| \/)>/g,
    (match, src, alt, className) => {
      return `<img src="${src}" alt="${alt}" class="${className}" />`;
    }
  );
  
  return processedText;
};
