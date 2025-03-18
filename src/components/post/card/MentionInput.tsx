import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { insertMentionAtCursor } from "./commentUtils";

interface User {
  id: string;
  name: string;
}

interface MentionInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MentionInput = forwardRef<HTMLTextAreaElement, MentionInputProps>(({
  users,
  value,
  onChange,
  placeholder,
  className,
  ...rest
}, ref) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [caretPosition, setCaretPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Pass the ref to the parent and keep our local ref as well
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else {
        ref.current = textareaRef.current;
      }
    }
  }, [ref]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Check if we're typing a mention
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    
    // Find the last @ symbol before cursor
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      // Check if there's a space between the last @ and cursor
      const textBetweenAtAndCursor = textBeforeCursor.substring(lastAtSymbol + 1);
      
      if (!textBetweenAtAndCursor.includes(' ')) {
        // We're in a mention
        setMentionQuery(textBetweenAtAndCursor);
        
        // Filter users based on query
        const filtered = users.filter(user => 
          user.name.toLowerCase().includes(textBetweenAtAndCursor.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions
        
        setFilteredUsers(filtered);
        
        if (filtered.length > 0) {
          setShowSuggestions(true);
          
          // Calculate position for suggestions
          calculateSuggestionsPosition(lastAtSymbol);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };
  
  const calculateSuggestionsPosition = (atPosition: number) => {
    if (!textareaRef.current) return;
    
    // Create a temporary element to calculate the position
    const textarea = textareaRef.current;
    const text = textarea.value;
    
    // Calculate position based on text content
    const textBeforeAt = text.substring(0, atPosition);
    const lines = textBeforeAt.split('\n');
    const lineCount = lines.length;
    const lastLineLength = lines[lines.length - 1].length;
    
    // Approximate position
    const lineHeight = 20; // This is an approximation, might need adjustment
    const charWidth = 8; // Approximation of character width
    
    const top = (lineCount - 1) * lineHeight + textarea.offsetTop + 30;
    const left = lastLineLength * charWidth + textarea.offsetLeft + 15;
    
    setCaretPosition({ top, left });
  };
  
  const selectUser = (user: User) => {
    if (!textareaRef.current) return;
    
    // Insert the mention
    const newText = insertMentionAtCursor(textareaRef.current, user.name);
    onChange(newText);
    
    // Close suggestions
    setShowSuggestions(false);
    
    // Focus back on textarea
    textareaRef.current.focus();
  };
  
  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        {...rest}
      />
      
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 w-64 max-h-60 overflow-y-auto"
          style={{
            top: `${caretPosition.top}px`,
            left: `${caretPosition.left}px`
          }}
        >
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectUser(user)}
            >
              <span className="font-medium">@{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MentionInput.displayName = "MentionInput";
