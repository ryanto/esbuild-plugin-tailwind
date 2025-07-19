import * as esbuild from "esbuild";
import { esbuildPluginTailwind } from "./src/plugin";

async function main() {
  let ctx = await esbuild.context({
    entryPoints: ["demo/app.ts"],
    bundle: true,
    outdir: "www",
    external: ["tailwindcss"],
    plugins: [
      esbuildPluginTailwind({
        base: process.cwd(),
        minify: true,
      }),
    ],
  });

  await ctx.watch();

  let { host, port } = await ctx.serve({
    servedir: "www",
  });

  console.log(`Serving on http://${host}:${port}`);
}

main();
