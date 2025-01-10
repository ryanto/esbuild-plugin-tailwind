import * as esbuild from "esbuild";

async function main() {
  let ctx = await esbuild.context({
    entryPoints: ["src/plugin.ts"],
    target: "",
    outdir: "www",
    external: ["tailwindcss"],
  });
}

main();
