const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require('webpack');

module.exports = (env) => {
  // style files regexes
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;
  const cssModuleLocalIdent = "[hash:base64:6]";

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve("css-loader"),
        options: {
          url: false,
          ...cssOptions,
        },
      },
      {
        loader: require.resolve("postcss-loader"),
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
      });
    }
    return loaders;
  };
  return {
    mode: "production",

    performance: {
      hints: false,
    },

    optimization: {
      minimize: true
    },

    devtool: undefined,

    context: path.resolve(__dirname, "src"),

    entry: {
      index: './library',
    },

    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
      library: 'Slider',
      libraryTarget: 'umd',
      globalObject: 'this',
      umdNamedDefine: true,
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      compress: true
    },
    module: {
      rules: [
        {
          test: /\.?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: ['lodash'],
              presets: ["@babel/preset-env", "@babel/preset-react", { modules: false, targets: { node: 4 } }],
            },
          },
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: {
            loader: "ts-loader",
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
            },
          },
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            modules: {
              compileType: "icss",
            },
          }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            modules: {
              compileType: "module",
              localIdentName: cssModuleLocalIdent,
            },
          }),
        },
        // Opt-in support for SASS (using .scss or .sass extensions).
        // By default we support SASS Modules with the
        // extensions .module.scss or .module.sass
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                compileType: "icss",
              },
            },
            "sass-loader"
          ),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },
        // Adds support for CSS Modules, but using SASS
        // using the extension .module.scss or .module.sass
        {
          test: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                compileType: "module",
                localIdentName: cssModuleLocalIdent,
              },
            },
            "sass-loader"
          ),
        }
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: "../tsconfig.json",
        },
      }),
      new MiniCssExtractPlugin({
        filename: "./Slider/styles.css",
      })
    ].filter(function (plugin) { return plugin !== false; }),

    resolve: {
      alias: {
        app: path.resolve(__dirname, "./src/"),
        library: path.resolve(__dirname, "./src/library/"),
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
      fallback: { timers: false },
    },
    externals: {
      'react': {
        'commonjs': 'react',
        'commonjs2': 'react',
        'amd': 'react',
        // React dep should be available as window.React, not window.react
        'root': 'React'
      },
      'react-dom': {
        'commonjs': 'react-dom',
        'commonjs2': 'react-dom',
        'amd': 'react-dom',
        'root': 'ReactDOM'
      }
    }
  };
};