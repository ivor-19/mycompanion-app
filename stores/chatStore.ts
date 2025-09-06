import { create } from 'zustand';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  initializeChat: () => void;
}

const initialMessage: Message = {
  id: '1', 
  text: 'Hey! I\'m Eunoia, your friendly psychological chatbot 🤗. This is a safe, judgment-free space where you can share what\'s on your mind anytime. I\'m here to listen, support, and help you feel a little lighter. So, how are you feeling today?', 
  isUser: false,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [initialMessage],
  
  addMessage: (message: Message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),
  
  setMessages: (messages: Message[]) => 
    set({ messages }),
  
  clearMessages: () => 
    set({ messages: [initialMessage] }),
  
  initializeChat: () => {
    const currentMessages = get().messages;
    // Only initialize if messages are empty or only contain initial message
    if (currentMessages.length === 0) {
      set({ messages: [initialMessage] });
    }
  }
}));