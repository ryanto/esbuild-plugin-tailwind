import { Plugin } from "esbuild";
import { readFile } from "node:fs/promises";
import { compile } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { Features, transform } from "lightningcss";

type Options = {
  base?: string;
  minify?: boolean;
};

export function esbuildPluginTailwind(options?: Options): Plugin {
  let base = options?.base ?? process.cwd();
  let minify = options?.minify ?? false;

  let plugin: Plugin = {
    name: "tailwind",
    async setup(build) {
      build.onLoad({ filter: /\.css$/ }, async ({ path }) => {
        let css = await readFile(path, "utf8");

        let compiler = await compile(css, {
          base,
          onDependency(path: string) {
            // TODO: track path as a dependency, if it changes we
            // know that we need to regenerate the compiler.
          },
        });

        let candidates: string[] = [];
        if (compiler.features > 0) {
          let sources = [...compiler.globs];
          if (compiler.root === null) {
            sources.push({ base, pattern: "**/*" });
          }
          let scanner = new Scanner({
            sources,
          });

          // TODO: instead of doing a full scan, we can only scan the files that
          // changed. see scanFiles.
          candidates = scanner.scan();
        }

        let compiled = compiler.build(candidates);

        let optimized = optimizeCss(compiled, {
          file: path,
          minify,
        });

        return {
          contents: optimized,
          loader: "css",
        };
      });
    },
  };

  return plugin;
}

// using Tailwind's optimize function
// source: https://github.com/tailwindlabs/tailwindcss/blob/next/packages/%40tailwindcss-cli/src/commands/build/index.ts#L431
function optimizeCss(
  input: string,
  {
    file = "input.css",
    minify = false,
  }: { file?: string; minify?: boolean } = {},
) {
  // Running Lightning CSS twice to ensure that adjacent rules are merged after
  // nesting is applied. This creates a more optimized output.
  function optimize(code: Buffer | Uint8Array) {
    return transform({
      filename: file,
      code,
      minify,
      sourceMap: false,
      drafts: {
        customMedia: true,
      },
      nonStandard: {
        deepSelectorCombinator: true,
      },
      include: Features.Nesting,
      exclude:
        Features.LogicalProperties | Features.DirSelector | Features.LightDark,
      targets: {
        safari: (16 << 16) | (4 << 8),
        ios_saf: (16 << 16) | (4 << 8),
        firefox: 128 << 16,
        chrome: 111 << 16,
      },
      errorRecovery: true,
    }).code;
  }

  return optimize(optimize(Buffer.from(input))).toString();
}
