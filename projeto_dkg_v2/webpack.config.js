const path = require("path")
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');
 
module.exports = {
    mode:"development",
    devtool:"cheap-module-source-map",   
    entry: {
        popup: path.resolve("./src/popup/popup.tsx"),
        options: path.resolve("./src/options/options.tsx"),
        "content-script": path.resolve("./src/content-script/content-script.ts"),
        background: path.resolve("./src/background/background.ts")
      },    
      module:{
        rules:[
            {
                use:"ts-loader",
                test:/\.tsx?$/,
                exclude:/node_modules/
            },
            {
                use:['style-loader','css-loader'],
                test:/\.css$/i
            },
            {
                use:"file-loader",
                test:/\.png$/
            }
        ]
    },
    resolve: {
        extensions: [".tsx",".ts",".js"]
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            {
                from: path.resolve('src/assets/manifest.json'), 
                to: path.resolve("dist")
            },
            {
                from: path.resolve('src/assets/icon.png'), 
                to: path.resolve("dist")
            }
          ],
        }),
        ...getHtmlPlugin([
            'popup',
            'options'
        ])

      ],

      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
      }   
}

function getHtmlPlugin(chunks){
    return chunks.map(chunk => new HtmlPlugin({
        title:"React extension",
        filename:`${chunk}.html`,
        chunks:[chunk]
    }))
}