// Type declarations for MCP tool files that execute in Deno at runtime.
// The `process.env` reads work because the emitted function runs on Deno
// which polyfills Node globals; this file only satisfies the TS compiler.
declare const process: {
  env: Record<string, string | undefined>;
};
