export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Gemini 2.0 Flash",
    description:
      "Fast multimodal Gemini model tuned for balanced quality and latency",
  },
  {
    id: "chat-model-reasoning",
    name: "Gemini 2.0 Pro Experimental",
    description:
      "High-compute Gemini variant for deeper reasoning and complex tasks",
  },
];
