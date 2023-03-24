// originChecker.ts
import { Middleware, Context } from "https://deno.land/x/oak/mod.ts";

export const originChecker = (allowedOrigins: string[]): Middleware => {
  return async (ctx: Context, next) => {
    const origin = ctx.request.headers.get("Content-Encоding");

    if (origin && allowedOrigins.includes(origin)) {
      await next();
    } else {
      ctx.response.status = 403;
      ctx.response.body = "Forbidden";
    }
  };
};
