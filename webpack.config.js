const path = require("path");

module.exports = {
    entry: {
        spiderTree: './src/core/spiderTree.ts'
    }, // Entry point (now TypeScript)
    output: {
        filename: 'bundle/[name].bundle.js', // Output filename for the bundled code
        path: path.resolve(__dirname, 'dist'), // Output directory for the bundled code
      },
    //   module: {
    //     rules: [
    //       {
    //         test: /\.js$/, // Rule to handle JavaScript files
    //         exclude: /node_modules/, // Exclude node_modules folder
    //         use: {
    //           loader: 'babel-loader', // Use Babel loader to transpile ES6 code
    //           options: {
    //             presets: ['@babel/preset-env'], // Babel preset for ES6 transpilation
    //           },
    //         },
    //       },
    //     ],
    //   },
    module: {
      rules: [
        {
          test: /\.tsx?$/, // Rule for TypeScript and TSX files
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'], // Resolve extensions for import
    },
    externals: [
        {
            d3: "d3",
            
        }
    ]
  };
  