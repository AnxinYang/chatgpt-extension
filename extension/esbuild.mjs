import * as esbuild from "esbuild";
const config = {
  entryPoints: ["contentScript.ts"],
  bundle: true,
  minify: true,
  outdir: "dist",
};

if (process.env.NODE_ENV === "production") {
  console.log("Building for production");
  await esbuild.build(config);
} else {
  console.log("Building for development");
  config.minify = false;
  const ctx = await esbuild.context(config);
  await ctx.watch();
}
