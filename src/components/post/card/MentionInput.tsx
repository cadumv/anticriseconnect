
import React, { useRef, useState, forwardRef, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { insertMentionAtCursor } from "./commentUtils";

interface User {
  id: string;
  name: string;
}

// Fixed interface to correctly use a ChangeEvent
interface MentionInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  users: User[];
  value: string;
  onChange: (value: string) => void;
}

export const MentionInput = forwardRef<HTMLTextAreaElement, MentionInputProps>(
  ({ users, value, onChange, ...props }, ref) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    // Handle text changes in the textarea
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      
      // Check if we're typing a mention (@)
      const currentCursorPos = e.target.selectionStart;
      const textBeforeCursor = newValue.substring(0, currentCursorPos);
      
      // Find the @ symbol that might be starting a mention
      const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
      
      if (atSymbolIndex !== -1 && atSymbolIndex === currentCursorPos - 1) {
        // Just typed @, show all suggestions
        setSearchTerm("");
        setShowSuggestions(true);
      } else if (atSymbolIndex !== -1 && !textBeforeCursor.substring(atSymbolIndex).includes(' ')) {
        // In the middle of typing a username after @
        const searchString = textBeforeCursor.substring(atSymbolIndex + 1);
        setSearchTerm(searchString.toLowerCase());
        setShowSuggestions(true);
      } else {
        // Not typing a mention
        setShowSuggestions(false);
      }
      
      setCursorPosition(currentCursorPos);
    };
    
    // Handle selecting a user from the suggestions
    const handleSelectUser = (username: string) => {
      if (textAreaRef.current) {
        const newText = insertMentionAtCursor(textAreaRef.current, username);
        onChange(newText);
        setShowSuggestions(false);
        
        // Focus back on the textarea
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.focus();
          }
        }, 10);
      }
    };
    
    // Filter users based on search term
    const filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
    
    return (
      <div className="relative w-full">
        <Textarea
          {...props}
          ref={(node) => {
            // Handle both the forwarded ref and the local ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            textAreaRef.current = node;
          }}
          value={value}
          onChange={handleChange}
          className="w-full min-h-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ resize: 'none', overflow: 'auto' }}
        />
        
        {showSuggestions && filteredUsers.length > 0 && (
          <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg border">
            <ul className="py-1">
              {filteredUsers.map(user => (
                <li
                  key={user.id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                  onClick={() => handleSelectUser(user.name)}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center mr-2">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

MentionInput.displayName = "MentionInput";
