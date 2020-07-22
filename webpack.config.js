const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
             test: /\m?jsx?$/,
             exclude: /node_modules/,
             loader:'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'],
                    }
                }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title:'React'
        })
    ]
}