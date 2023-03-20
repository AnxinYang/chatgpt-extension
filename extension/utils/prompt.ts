const template = `
You are a chrome extension. Here are the content of current tab:[<<content>>].
Here are you previous messages:[<<history>>].
And here is the prompt from user:[<<prompt>>].
Please generate a response for the user.
`;

const history: string[] = [];

export const addToHistory = (message: string) => {
  history.push(message);
  if (history.length > 10) {
    history.shift();
  }
};

function getPageContent() {
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll("h1, h2, h3, h4, h5, h6, p")
  );

  const content = elements
    .map((element) => element.innerText)
    .filter((text) => text.trim().length > 0)
    .join("\n\n");

  return content;
}

export const generatePrompt = (prompt: string): string => {
  addToHistory(prompt);
  let promptTemplate = template.replace(
    "[<<content>>]",
    `[${getPageContent()}]`
  );
  promptTemplate = promptTemplate.replace(
    "[<<history>>]",
    `[${history.join(", ")}]`
  );
  return promptTemplate.replace("[<<prompt>>]", `[${prompt}]`);
};
