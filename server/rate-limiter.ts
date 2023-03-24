// rateLimiter.ts
import { Middleware, Context } from "https://deno.land/x/oak/mod.ts";

type RateLimiterOptions = {
  maxRequests: number;
  windowMs: number;
};

const clients = new Map<string, { requests: number; time: number }>();

export const rateLimiter = (options: RateLimiterOptions): Middleware => {
  return async (ctx: Context, next) => {
    const ip = ctx.request.ip;

    const client = clients.get(ip);
    const currentTime = Date.now();

    if (client) {
      const elapsedTime = currentTime - client.time;

      if (elapsedTime <= options.windowMs) {
        if (client.requests < options.maxRequests) {
          client.requests += 1;
        } else {
          ctx.response.status = 429;
          ctx.response.body = "Too Many Requests";
          return;
        }
      } else {
        client.time = currentTime;
        client.requests = 1;
      }
    } else {
      clients.set(ip, { time: currentTime, requests: 1 });
    }

    await next();
  };
};
