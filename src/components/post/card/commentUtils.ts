
/**
 * Format the comment text to highlight mentions
 * 
 * @param text The comment text
 * @returns Formatted HTML string with highlighted mentions
 */
export const formatCommentText = (text: string): string => {
  // Replace mentions (@username) with a styled span
  const formattedText = text.replace(
    /@(\w+)/g, 
    '<span class="text-blue-600 font-medium">@$1</span>'
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
