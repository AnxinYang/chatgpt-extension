// main.ts
import { Application, Router, config, OpenAI, oakCors } from "./deps.ts";

// Load environment variables
const env = config();

// Initialize OpenAI client
const openAIClient = new OpenAI(env.OPENAI_API_KEY);

// Create a new router
const router = new Router();
router.post("/api/chat", async (ctx) => {
  const { prompt }: { prompt: string } = await ctx.request.body().value;
  try {
    const response = await openAIClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    const responseBodyString = JSON.stringify({
      response: response.choices[0].message.content,
    });
    ctx.response.headers.set("Content-Type", "application/json");
    ctx.response.headers.set(
      "Content-Length",
      responseBodyString.length.toString()
    );
    ctx.response.body = responseBodyString;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Error processing request." };
  }
});

// Create a new application
const app = new Application();
app.use(oakCors());

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
const port = 8000;
console.log(`Server listening on port ${port}`);
await app.listen({ port });
