# esbuild-plugin-tailwind

A plugin to compile Tailwind CSS v4 with esbuild.

## Usage

```text
npm install @ryanto/esbuild-plugin-tailwind
```

```js
import { build } from "esbuild";
import { esbuildPluginTailwind } from "@ryanto/esbuild-plugin-tailwind";

await build({
  // ...
  plugins: [esbuildPluginTailwindCSS()],
});
```

## Work in progress

This plugin is a work in progress and has some limitations.

- Incremental builds are not yet supported. It does a full rebuild every time.

## Options

You can pass optional options to the plugin.

```js
await build({
  // ...
  plugins: [
    esbuildPluginTailwindCSS({
      base: "/my/app", // the base directory
      minify: true, // minify the output
    }),
  ],
});
```

### `options.base`

The directory to scan for utility classes. Defaults to `process.cwd()`.

### `options.minify`

Minify the output. Defaults to `false`.

## Get in touch

If you have any questions or feedback, feel free to reach out to me on [Twitter](https://twitter.com/ryantotweets).
