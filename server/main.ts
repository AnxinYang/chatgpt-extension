// main.ts
import getChatCompletion from "./apis/chat.ts";
import getChatSummary from "./apis/summary.ts";
import { Application, Router, OpenAI, oakCors, send } from "./deps.ts";
import { originChecker } from "./origin-checker.ts";
import { rateLimiter } from "./rate-limiter.ts";

// Create a new router
const router = new Router();

// Set up the API routes
router.post("/api/chat", getChatCompletion);
router.post("/api/summary", getChatSummary);

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
console.log("Max tokens: ", Deno.env.get("MAX_TOKENS") || "100");
console.log("Max memory: ", Deno.env.get("MAX_MEMORY") || "500");
await app.listen({ port });
