'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ConversationInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ConversationInput({ onSend, disabled, placeholder }: ConversationInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-end gap-3 bg-[#12121a] border border-[#2a2a3a] rounded-2xl px-4 py-3 focus-within:border-[#E07A5F]/30 transition-colors">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Say something..."}
          rows={1}
          className="
            flex-1 bg-transparent text-[#e8e4df] text-[15px]
            placeholder:text-[#555] resize-none
            focus:outline-none
            disabled:opacity-50
            min-h-[24px] max-h-[200px]
          "
        />

        <motion.button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-2 rounded-xl transition-all duration-200
            ${message.trim() && !disabled
              ? 'bg-[#E07A5F] text-white hover:bg-[#d06a4f]'
              : 'bg-[#2a2a3a] text-[#555] cursor-not-allowed'
            }
          `}
        >
          <Send size={18} />
        </motion.button>
      </div>

      {/* Subtle hint */}
      <div className="mt-2 text-center">
        <span className="text-[11px] text-[#444] font-mono">
          Press Enter to send. Shift+Enter for new line.
        </span>
      </div>
    </div>
  );
}
