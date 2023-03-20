import { generateMessages } from "./prompt";

export const getChatCompletion = async (message: string): Promise<string> => {
  // Send the input to the Deno server and display the response
  try {
    const messages = generateMessages(message);
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response.trim();
    } else {
      return "Error sending request to the server.";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Error sending request to the server.";
  }
};
