const HtmlWebPackPlugin = require("html-webpack-plugin");
const { webpack, DefinePlugin } = require("webpack");
const Dotenv = require("dotenv-webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { EnvironmentPlugin} = require('webpack');

const deps = require("./package.json").dependencies;
module.exports = (_, argv) => ({
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    headers: { "X-Frame-Options": "SAMEORIGIN"   },
  },
  
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "dragonfly",
      filename: "remoteEntry.js",
       remotes: {
          ServiceRepository: "DragonFly_MFE_Component_3080@https://ey-genai-studio-dev.azurewebsites.net/mfes/service-repository/dist/remoteEntry.js",
        },
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      templateParameters: {
        REACT_APP_SERVICE_REPO_PATH: 'https://ey-genai-studio-dev.azurewebsites.net',
        REACT_APP_DOCUMENT_REPO_PATH: 'https://dragonflydev.blob.core.windows.net',
      },
    }),
    new Dotenv({
      path: "./.env", // Make sure to point to the correct file
      safe: true, // If true, load .env.example (defaults to "false")
      systemvars: true, // Load all the predefined "process.env" variables which will trump anything local per dotenv specs.
      silent: true,
    }),
    new EnvironmentPlugin({
      REACT_APP_BLOB_PATH: 'https://ey-genai-studio-dev.azurewebsites.net/mfes',
      // REACT_APP_APPLET_SUPPLIER_MANAGEMNET:'https://dragonfly-test.azurewebsites.net/#/supplier-applet'
    }) 
  ],
});
