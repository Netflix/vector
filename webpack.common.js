'use strict'
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAutoInjectVersion = require('webpack-auto-inject-version')

module.exports = {
    entry: {
        javascript: './src/app/App.jsx'
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'scripts/bundle.js',
        publicPath: ''
    },
    externals: {
        config: 'config'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                exclude: [ /node_modules/, /src\/\_app/ ],
                use: [
                  { loader: 'eslint-loader' }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [ /node_modules/, /src\/\_app/ ],
                use: [
                  { loader: 'babel-loader', options: { babelrc: true }}
                ]
            },
            {
                test: /\.html$/,
                exclude: [
                  path.resolve(__dirname, 'src/index.html'),
                ],
                use: [
                    { loader: "html-loader" }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                ]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?name=fonts/[name].[ext]&limit=10000',
            },
            {
                test: /\.(png)(\?[\s\S]+)?$/,
                use: 'file-loader?name=images/[name].[ext]',
            },
            {
                test: /\.(ttf|eot|svg|otf)(\?[\s\S]+)?$/,
                use: 'file-loader?name=fonts/[name].[ext]',
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" }, // creates style nodes from JS strings
                    { loader: "css-loader" }, // translates CSS into CommonJS
                    { loader: "sass-loader" } // compiles Sass to CSS
                ]
            }
        ]
    },
    plugins: [
        // needs to go first to insert the file in js
        new WebpackAutoInjectVersion({
          components: {
            AutoIncreaseVersion: false,
            InjectAsComment: false,
            InjectByTag: true
          }
        }),
        // the html, which will have the bundle.js script tag injected
        new HtmlWebpackPlugin({
            template: 'src/app/index.html',
            inject: 'body'
        }),
        // copy static assets
        new CopyWebpackPlugin([
            { from: 'src/config.js', to: 'config.js' },
            { from: 'src/favicon.ico', to: 'favicon.ico' },
            { from: 'src/assets/images/vector_owl.png', to: 'assets/images/vector_owl.png' }
        ])
    ]
}
