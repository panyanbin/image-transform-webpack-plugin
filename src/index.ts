import sharp from "sharp";
import { WebpackPluginInstance, Compiler, Compilation } from "webpack";
import path from "path";
import {
  ImageTransformConfig,
  ImageTransformOption,
  ImageTransformOutput,
  ImageTransformPlugin,
} from "image-transform-plugin";
import normalizePath from "normalize-path";
import { WebpackLogger } from "./logger";

class ImageTransformWebpackPlugin extends ImageTransformPlugin implements WebpackPluginInstance {
  webpackContext!: string;
  webpackLogger!: WebpackLogger;
  compiler!: Compiler;
  compilation!: Compilation;

  constructor(configs: ImageTransformConfig | ImageTransformConfig[], option?: ImageTransformOption) {
    super(configs, option);
  }

  getContext() {
    return this.webpackContext;
  }

  getLogger(): WebpackLogger {
    return this.webpackLogger;
  }

  /**
   * 仅用于webpack plugin自调用
   * @param complier
   */
  apply(compiler: Compiler) {
    const ID = "ImageTransformWebpackPlugin";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compiler.hooks.thisCompilation.tap(ID, (compilation: Compilation) => {
      const logger = WebpackLogger.getLogger(compilation);
      this.webpackContext = compiler.context;
      this.webpackLogger = logger;
      this.compiler = compiler;
      this.compilation = compilation;

      try {
        this.transform();
      } catch (error) {
        logger.error(error);
      }
    });
  }

  async store(sharpData: sharp.Sharp, output: ImageTransformOutput, config: ImageTransformConfig): Promise<boolean> {
    const { compilation, compiler } = this;
    const filePath = output.file;
    const existingAsset = compilation.getAsset(filePath);
    const { RawSource } = compiler.webpack.sources;
    const context = this.getContext();

    const absoluteFilename = path.resolve(context, config.input);
    const sourceFilename = normalizePath(path.relative(context, absoluteFilename));

    return sharpData
      .toBuffer()
      .then((data: Buffer) => {
        const source = new RawSource(data);
        if (existingAsset) {
          compilation.updateAsset(filePath, source, {
            sourceFilename,
          });
        } else {
          compilation.emitAsset(filePath, source, {
            sourceFilename,
          });
        }
        return true;
      })
      .catch((err) => {
        const logger = this.getLogger();
        logger.error(err);
        return true;
      });
  }
}

export { ImageTransformWebpackPlugin };
