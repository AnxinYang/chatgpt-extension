// main.ts
import { Application, Router, OpenAI, oakCors, send } from "./deps.ts";
import { originChecker } from "./origin-checker.ts";
import { rateLimiter } from "./rate-limiter.ts";
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Create a new router
const router = new Router();
router.post("/api/chat", async (ctx) => {
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
        max_tokens: Deno.env.get("MAX_TOKENS") || 100,
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
});

// Create a new application
const app = new Application();
app.use(oakCors());

// Add the rate limiter middleware
app.use(
  rateLimiter({
    maxRequests: 5, // Maximum number of requests allowed in the time frame
    windowMs: 60 * 1000, // Time frame in milliseconds (60 * 1000 ms = 1 minute)
  })
);

// Add the origin checker middleware
app.use(originChecker(["gzip"]));

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = 8000;
console.log(`Server listening on port ${port}`);
await app.listen({ port });
