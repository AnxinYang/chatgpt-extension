import * as esbuild from "esbuild";

const ctx = await esbuild.context({
  entryPoints: ["contentScript.ts"],
  bundle: true,
  outdir: "dist",
});

await ctx.watch();
