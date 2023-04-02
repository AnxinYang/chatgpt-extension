import { RouterContext } from "https://deno.land/x/oak@v12.1.0/router.ts";
import { ClientMessage, Message } from "../types.ts";

export default async function getChatSummary(
  ctx: RouterContext<"/api/summary">
) {
  const { messages }: { messages: ClientMessage[] } = await ctx.request.body()
    .value;
  messages.push({
    role: "user",
    content: "Summarize above conversation.",
    tokenUsage: 0,
  });
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages.map((message) => {
          return {
            role: message.role,
            content: message.content,
          };
        }),
        max_tokens: +(Deno.env.get("MAX_MEMORY") || 500),
        stream: false,
      }),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );

    if (!response.body) throw new Error("No response body");

    // Send back the data (in chunks) as it comes in
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.headers.set("Cache-Control", "no-cache");
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Methods", "*");
    ctx.response.headers.set("allow", "*");
    ctx.response.status = 200;
    ctx.response.body = response.body;
  } catch (error) {
    console.error(error);
    ctx.response.status = 500;
    ctx.response.body = { error: `Error processing request.` };
  }
}
