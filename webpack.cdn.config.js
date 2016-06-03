var webpack = require('webpack'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');


module.exports = {
    entry: {
        app: [
            './index.js'
        ],
    },
    output: {
        path: path.join(__dirname, 'build', 'cdn'),
        publicPath: '',
        filename: 'knotisapi.js',
        crossOriginLoading:"anonymous",
        pathInfo: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
        ]
    },
    resolve: {
        root: srcPath,
        extensions: [
            '',
            '.js'
        ],
        modulesDirectories: [
            'node_modules',
        ],
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    debug: false,
    node: {
        fs: "empty"
    }
};
