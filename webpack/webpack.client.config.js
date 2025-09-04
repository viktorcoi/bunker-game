const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    entry: './src/client/index.tsx',
    target: 'web',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.module\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            esModule: false,
                            modules: {
                                getLocalIdent: (context, localIdentName, localName) => {
                                    const fileName = path.basename(context.resourcePath, '.module.scss');
                                    const hash = require('crypto')
                                        .createHash('md5')
                                        .update(context.resourcePath + localName)
                                        .digest('base64')
                                        .slice(0, 5)
                                        .replace(/[^a-zA-Z0-9]/g, '');
                                    return `${fileName}__${localName}--${hash}`;
                                },
                                namedExport: false,
                                exportLocalsConvention: "asIs",
                            }
                        }
                    },
                    'sass-loader',
                ]
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '../build/client'),
        },
        historyApiFallback: true,
        compress: true,
        hot: true,
        port: 7357,
        client: {
            overlay: false,
        },
    },
    output: {
        path: path.resolve(__dirname, '../build/client'),
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/index.html",
        }),
    ],
};
