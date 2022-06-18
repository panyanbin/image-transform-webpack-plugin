import { Logger } from "image-transform-plugin";
import { Compilation } from "webpack";

const stringify = (data: unknown) => {
  return JSON.stringify(data, null, 2);
};

export class WebpackLogger implements Logger {
  static getLogger(compilation: Compilation) {
    return new WebpackLogger(compilation);
  }

  compilation: Compilation;

  constructor(compilation: Compilation) {
    this.compilation = compilation;
  }

  info(msg: string | Error | unknown): void {
    if (typeof msg !== "string") {
      msg = stringify(msg);
    }
    console.log(msg);
  }
  warn(msg: string | Error | unknown): void {
    if (typeof msg !== "string") {
      msg = stringify(msg);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.compilation.warnings.push(msg as any);
  }
  error(msg: string | Error | unknown): void {
    if (typeof msg !== "string") {
      msg = stringify(msg);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.compilation.errors.push(msg as any);
  }
}
