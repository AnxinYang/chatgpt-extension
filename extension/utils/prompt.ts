export interface Message {
  role: "user" | "assistant";
  content: string;
}
const getMessageForCurrentTab = (): Message => {
  return {
    role: "user",
    content: `The user are visiting [${
      window.location.href
    }], here are the content of current webpage:[${getPageContent()}]. Keep the answer short and simple.`,
  };
};

let history: Message[] = [];

export const addToHistory = (message: string, role: "user" | "assistant") => {
  history.push({
    role,
    content: message,
  });
  if (history.length > 10) {
    history.shift();
  }
};

export const clearHistory = () => {
  history = [];
};

function removeAttributesAndScripts(htmlString: string) {
  // Remove script tags
  const scriptTagPattern =
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const cleanedScriptTags = htmlString.replace(scriptTagPattern, "");
  const attributeRegex =
    /<([a-z][a-z0-9]*)(?:\s+[a-z0-9:-]+=(?:\"[^\"]*\"|\'[^\']*\'|[^\s>]+))*\s*/gi;
  const cleanedHtmlString = cleanedScriptTags.replace(attributeRegex, "<$1");
  return cleanedHtmlString;
}

function getPageContent() {
  const content = removeAttributesAndScripts(document.body.innerText);
  const truncated = `${content.slice(0, 4096)}...`;

  return truncated;
}

export const generateMessages = (prompt: string): Message[] => {
  const messages = [
    getMessageForCurrentTab(),
    ...history,
    { role: "user", content: prompt } as Message,
  ];
  return messages;
};
