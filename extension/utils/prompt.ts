import { getChatSummary } from "./api";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const getMessageForCurrentTab = (): readonly Message[] => {
  return [
    {
      role: "system",
      content: "You are a charming AI assistant that help people read webpage.",
    },
    {
      role: "system",
      content: `The user is visiting [${
        window.location.href
      }], here is the content of the current webpage: [${getPageContent()}]. Keep the answer short and simple.`,
    },
    {
      role: "system",
      content:
        "If the information is not available on page, use the best of your knowledge to answer.",
    },
    {
      role: "system",
      content:
        "Always answer in the last language that the user used in prompt.",
    },
  ];
};

let history: Message[] = [];

export const addToHistory = (
  message: string,
  role: "user" | "assistant"
): void => {
  history.push({
    role,
    content: message,
  });
  if (role === "assistant" && history.length > 10) {
    getChatSummary(history)
      .then((summary) => {
        history = [
          {
            role: "system",
            content: `Here is a summary of the conversation so far: ${summary}`,
          },
        ];
      })
      .catch((error) => {
        console.log("Failed to get summary", error);
        history.shift();
      });
  }
  if (history.length > 15) {
    history.shift();
  }
};

export const clearHistory = (): void => {
  history = [];
};

const stripAttributesAndScripts = (htmlString: string): string => {
  const scriptTagPattern = /<script\b[^<]*<\/script>/gi;
  const attributeRegex = /<([a-z][a-z0-9]*)\b[^>]*>/gi;
  const cleanedScriptTags = htmlString.replace(scriptTagPattern, "");
  const cleanedHtmlString = cleanedScriptTags.replace(attributeRegex, "<$1>");
  return cleanedHtmlString;
};

const getPageContent = (): string => {
  const content = stripAttributesAndScripts(document.body.innerText);
  const truncated = `${content.slice(0, 4096)}...`;
  return truncated;
};

export const generateMessages = (prompt: string): Message[] => {
  const messages: Message[] = [
    ...getMessageForCurrentTab(),
    ...history,
    { role: "user", content: prompt },
  ];
  return messages;
};
