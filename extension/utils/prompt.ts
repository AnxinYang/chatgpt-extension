export interface Message {
  role: "user" | "assistant";
  content: string;
}
const getMessageForCurrentTab = (): Message => {
  return {
    role: "user",
    content: `You are a chrome extension. The user are visiting [${
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

function getPageContent() {
  const main = document.querySelector("main");

  const elements: HTMLElement[] = Array.from(
    (main ?? document).querySelectorAll("h1, h2, h3, h4, h5, h6, a, p")
  );

  const content = elements
    .map((element) => element.innerText)
    .filter((text) => text.trim().length > 0)
    .join("|");
  console.log(content);
  const truncated = `${content.slice(0, 2048)}...`;

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
