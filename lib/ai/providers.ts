import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

const google = !isTestEnvironment
  ? createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    })
  : null;

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": google!("models/gemini-flash-latest"),
        "chat-model-reasoning": google!("models/gemini-2.5-pro"),
        "title-model": google!("models/gemini-flash-lite-latest"),
        "artifact-model": google!("models/gemini-flash-lite-latest"),
      },
    });
