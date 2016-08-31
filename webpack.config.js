var webpack = require('webpack'),
    path = require('path'),
    libraryName = 'knotisapi',
    target, libraryTarget = 'umd',
    outputFile = libraryName + '.js',
    env = process.env.WEBPACK_ENV,
    entry = __dirname + '/src/index.js',
    plugins = [], entry, outputFile,
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

if (env === 'web') {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
    plugins.push(new webpack.ProvidePlugin({
        'Promise': 'imports?this=>global!exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }));
    outputFile = libraryName + '.min.js';
    target = 'web';

} else {
    outputFile = libraryName + '.js';
    entry = __dirname + '/src/index.js';
    target = 'node';

}


var config = {
    entry: entry,
    devtool: 'source-map',
    output: {
        path: __dirname + '/dist',
        filename: outputFile,
        library: libraryName,
        libraryTarget: libraryTarget,
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.js$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js']
    },
    plugins: plugins,
    target: target
};

module.exports = config;
