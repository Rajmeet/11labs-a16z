import { create } from 'zustand';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Store {
  messages: Message[];
  openAiKey: string;
  elevenLabsKey: string;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setOpenAiKey: (key: string) => void;
  setElevenLabsKey: (key: string) => void;
}

export const useStore = create<Store>((set) => ({
  messages: [],
  openAiKey: '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',
  elevenLabsKey: 'sk_90f2ae27f7411db4de26aead2bc3f8dcdbda82c92783c405',
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setOpenAiKey: (key) => set({ openAiKey: key }),
  setElevenLabsKey: (key) => set({ elevenLabsKey: key }),
}));