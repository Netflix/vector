'use strict'
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let config = {
    mode: 'development',
    entry: {
        javascript: './src/app/index.module.js'
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'scripts/bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                  { loader: 'babel-loader', query: { presets: [ 'es2015' ] } },
                ]
            },
            {
                test: /\.html$/,
                exclude: [
                  path.resolve(__dirname, 'src/index.html'),
                ],
                use: [
                    { loader: "ngtemplate-loader", query: { relativeTo: 'src/app/' } },
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
    resolve: {
        alias: {
            'malhar-angular-dashboard': 'malhar-angular-dashboard/dist/malhar-angular-dashboard',
            'jquery': 'jquery/dist/jquery',
            'angular': 'angular/angular',
            'angular-route': 'angular-route/angular-route',
            'angular-ui-bootstrap': 'angular-ui-bootstrap/dist/ui-bootstrap-tpls',
            'lodash': 'lodash/lodash',
            'angular-toastr': 'angular-toastr/dist/angular-toastr.tpls',
            'moment': 'moment/moment',
            'jquery-ui': 'jquery-ui-dist/jquery-ui',
            'angular-ui-sortable': 'angular-ui-sortable/dist/sortable',
            'd3': 'd3/d3',
            'nvd3': 'nvd3/build/nv.d3',
            'angular-santize': 'angular-sanitize/angular-sanitize.js'
        }
    },
    devtool: 'source-map',
    plugins: [
        // the html, which will have the bundle.js script tag injected
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: 'head'
        }),
        // copy static assets
        new CopyWebpackPlugin([
            { from: 'src/lib/d3-heatmap2', to: 'lib/d3-heatmap2' },
            { from: 'src/favicon.ico', to: 'favicon.ico' },
            { from: 'vector.png', to: 'assets/images/vector_owl.png' }
        ]),
        // configure jquery, needed by angular and other components that assume jQuery or other strings
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            moment: 'moment'
        })
    ]
}

module.exports = config
