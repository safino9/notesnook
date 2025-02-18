/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const Repack = require("@callstack/repack");

/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.netlify.app/
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native CLI
 *            when running with `react-native start/bundle`.
 */
module.exports = (env) => {
  const {
    mode = "development",
    context = __dirname,
    entry = "./index.js",
    platform,
    minimize = mode === "production",
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = path.join(__dirname, "../node_modules/react-native"),
  } = env;

  if (!platform) {
    throw new Error("Missing platform");
  }

  /**
   * Depending on your Babel configuration you might want to keep it.
   * If you don't use `env` in your Babel config, you can remove it.
   *
   * Keep in mind that if you remove it you should set `BABEL_ENV` or `NODE_ENV`
   * to `development` or `production`. Otherwise your production code might be compiled with
   * in development mode by Babel.
   */
  process.env.BABEL_ENV = mode;

  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    /**
     * `getInitializationEntries` will return necessary entries with setup and initialization code.
     * If you don't want to use Hot Module Replacement, set `hmr` option to `false`. By default,
     * HMR will be enabled in development mode.
     */
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),

      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      alias: {
        'react-native': reactNativePath,
        "react": path.join(__dirname, "../node_modules/react"),
        "react-dom": path.join(__dirname, "../node_modules/react-dom"),
        "@notesnook": path.join(__dirname, "../../../packages"),
        "showdown": path.join(__dirname, "../node_modules/showdown"),
        "qclone": path.join(__dirname, "../node_modules/qclone"),
      },
    },
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      path: path.join(__dirname, "build/generated", platform),
      filename: "index.bundle",
      chunkFilename: "[name].chunk.bundle",
      publicPath: Repack.getPublicPath({ platform, devServer }),
    },
    /**
     * Configures optimization of the built bundle.
     */
    optimization: {
      /** Enables minification based on values passed from React Native CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          /**
           * Prevents emitting text file with comments, licenses etc.
           * If you want to gather in-file licenses, feel free to remove this line or configure it
           * differently.
           */
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: "named",
    },
    module: {
      /**
       * This rule will process all React Native related dependencies with Babel.
       * If you have a 3rd-party dependency that you need to transpile, you can add it to the
       * `include` list.
       *
       * You can also enable persistent caching with `cacheDirectory` - please refer to:
       * https://github.com/babel/babel-loader#options
       */
      rules: [
        {
          test: /\.mjs$|cjs$|js$|jsx$|ts$|tsx$/,
          include: [
            /node_modules(.*[/\\])+react/,
            /node_modules(.*[/\\])+@react-native/,
            /node_modules(.*[/\\])+@react-navigation/,
            /node_modules(.*[/\\])+@react-native-community/,
            /node_modules(.*[/\\])+@expo/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+metro/,
            /node_modules(.*[/\\])+abort-controller/,
            /node_modules(.*[/\\])+@callstack[/\\]repack/,
            /node_modules(.*[/\\])+pretty-format/,
            /node_modules(.*[/\\])+@react-native-masked-view\/masked-view/,
            /node_modules(.*[/\\])+toggle-switch-react-native/,
            /node_modules(.*[/\\])+rn-fetch-blob/,
            /node_modules(.*[/\\])+@streetwriters[/\\]notesnook-core/,
            /node_modules(.*[/\\])+@microsoft/,
            /node_modules(.*[/\\])+@msgpack/,
            /node_modules(.*[/\\])+liqe/,
            /node_modules(.*[/\\])+selderee/,
            /node_modules(.*[/\\])+html-to-text/,
            /node_modules(.*[/\\])+buffer/,
            /node_modules(.*[/\\])+readable-stream/,
            /node_modules(.*[/\\])+react-native-fingerprint-scanner/,
            /node_modules(.*[/\\])+@streetwriters[/\\]logger/,
          ],
          use: {
            loader: "babel-loader",
            options: {
              configFile: false,
              cacheDirectory: path.join(
                __dirname,
                "node_modules/.webpack-cache"
              ),
              babelrc: false,
              presets: ["module:metro-react-native-babel-preset"],
              plugins: [
                "react-native-reanimated/plugin",
                "@babel/plugin-transform-named-capturing-groups-regex",
              ],
            },
          },
        },
        /**
         * Here you can adjust loader that will process your files.
         *
         * You can also enable persistent caching with `cacheDirectory` - please refer to:
         * https://github.com/babel/babel-loader#options
         */
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              configFile: false,
              cacheDirectory: path.join(
                __dirname,
                "node_modules/.webpack-cache"
              ),
              babelrc: false,
              presets: [["module:metro-react-native-babel-preset"]],
              plugins:
                devServer && devServer.hmr
                  ? [
                      "module:react-refresh/babel",
                      "react-native-reanimated/plugin",
                    ]
                  : [
                      "react-native-reanimated/plugin",
                      `@babel/plugin-transform-named-capturing-groups-regex`,
                      "transform-remove-console",
                    ],
            },
          },
        },
        /**
         * This loader handles all static assets (images, video, audio and others), so that you can
         * use (reference) them inside your application.
         *
         * If you wan to handle specific asset type manually, filter out the extension
         * from `ASSET_EXTENSIONS`, for example:
         * ```
         * Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
         * ```
         */
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter((ext) => ext !== "svg")
          ),
          use: {
            loader: "@callstack/repack/assets-loader",
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              /**
               * Defines which assets are scalable - which assets can have
               * scale suffixes: `@1x`, `@2x` and so on.
               * By default all images are scalable.
               */
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                native: true,
                dimensions: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
        extraChunks: [
          {
            type: "local",
            include: /.*/,
          },
        ],
      }),
    ],
  };
};
