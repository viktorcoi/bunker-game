const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {'pg-native': false},
    },
    entry: './src/server/electron/main.ts',
    target: 'electron-main',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, '../build/server/electron'),
        filename: '[name].js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets/icons',
                    to: '../../icons'
                }
            ]
        }),
    ],
};
