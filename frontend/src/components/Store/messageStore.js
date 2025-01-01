// src/store/messageStore.js
import { create } from "zustand";

const useMessageStore = create((set) => ({
  activeChat: null,
  receiverId: null,
  messageInput: "",
  reciever: null,
  messages: [],
  initialChats: [],
  conversations: [],

  setActiveChat: (chatId) => set({ activeChat: chatId }),
  setReceiverId: (id) => set({ receiverId: id }),
  setMessageInput: (input) => set({ messageInput: input }),
  setReciever: (reciever) => set({ reciever }),
  setMessages: (messages) => set({ messages }),
  setInitialChats: (chats) => set({ initialChats: chats }),
  setConversations: (conversations) => set({ conversations }),

  fetchMessages: async (activeChat) => {
    if (!activeChat) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/message/${activeChat}`
      );
      const data = await response.json();
      set({ messages: data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  },
}));

export default useMessageStore;
