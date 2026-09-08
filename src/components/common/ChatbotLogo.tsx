import React from 'react';

interface ChatbotLogoProps {
  className?: string;
  size?: number | string;
  onClick?: () => void;
}

export const ChatbotLogo: React.FC<ChatbotLogoProps> = ({
  className = '',
  size = 56,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer focus:outline-hidden transition-transform duration-200 hover:scale-110 active:scale-95 bg-transparent p-0 border-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Open AI Assistant Chat"
      title="AI Assistant Chat"
    >
      <img
        src="/ai-assistant-clean.png"
        alt="AI Assistant"
        className="w-full h-full object-contain filter drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
      />
    </button>
  );
};
