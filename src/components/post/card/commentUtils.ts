
/**
 * Format the comment text to highlight mentions
 * 
 * @param text The comment text
 * @returns Formatted HTML string with highlighted mentions
 */
export const formatCommentText = (text: string): string => {
  // Replace mentions (@username) with a styled span
  const mentionRegex = /@(\w+)/g;
  return text.replace(
    mentionRegex, 
    '<span class="text-blue-600 font-medium">@$1</span>'
  );
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
