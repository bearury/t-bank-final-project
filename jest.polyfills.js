const { ReadableStream } = require("node:stream/web");

Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
});