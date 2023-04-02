import { RouterContext } from "https://deno.land/x/oak@v12.1.0/router.ts";
import { Message } from "../types.ts";

export default async function getChatCompletion(
  ctx: RouterContext<"/api/chat">
) {
  const { messages }: { messages: Message[] } = await ctx.request.body().value;
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: +(Deno.env.get("MAX_TOKENS") || 100),
        stream: true,
      }),
    };
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );

    if (!response.body) throw new Error("No response body");

    // Send back the data (in chunks) as it comes in
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.headers.set("Transfer-Encoding", "chunked");
    ctx.response.headers.set("Connection", "keep-alive");
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
