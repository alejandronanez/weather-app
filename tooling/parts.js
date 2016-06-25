/* eslint-disable */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.devServer = function devServer(options) {
	return {
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			stats: 'errors-only',
			host: options.host,
			port: options.port
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin({
				multistep: true
			})
		]
	};
};

exports.setupCSS = function setupCSS(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.css$/,
					loaders: ['style', 'css?sourceMap', 'postcss'],
					include: paths
				}
			]
		}
	};
};

exports.setupSCSS = function setupSCSS(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.scss$/,
					loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap'],
					include: paths
				}
			]
		}
	};
};

exports.setupPOSTCSS = function setupPOSTCSS() {
	return {
		postcss: function postcss() {
			return [autoprefixer];
		}
	};
};

exports.minify = function minify() {
	return {
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	};
};

exports.setFreeVariable = function setFreeVariable(key, value) {
	const env = {};
	env[key] = JSON.stringify(value);

	return {
		plugins: [
			new webpack.DefinePlugin(env)
		]
	};
};

exports.extractBundle = function extractBundle(options) {
	const entry = {};
	entry[options.name] = options.entries;

	return {
		entry: entry,
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				names: [options.name, 'manifest']
			})
		]
	};
};

exports.clean = function clean(path) {
	return {
		plugins: [
			new CleanWebpackPlugin([path], {
				root: process.cwd()
			})
		]
	};
};

exports.extractCSS = function extractCSS(paths) {
	return {
		module: {
			loaders: [
				// Extract css during build
				{
					test: /\.css$/,
					// .extract('style', 'css!postcss!..!...!')
					loader: ExtractTextPlugin.extract('style', 'css'),
					include: paths
				}
			]
		},
		plugins: [
			new ExtractTextPlugin('[name].[chunkhash].css')
		]
	};
};

exports.purifyCSS = function purifyCSS(paths) {
	return {
		plugins: [
			new PurifyCSSPlugin({
				basePath: process.cwd(),
				paths: paths
			})
		]
	};
};

exports.lintJS = function lintJS(paths) {
	return {
		module: {
			preLoaders: [
				{
					test: /\.jsx?$/,
					loaders: ['eslint'],
					include: paths
				}
			]
		}
	};
};

exports.resolve = function resolve(rootFolder) {
	return {
		resolve: {
			extensions: ['', '.js', '.jsx'],
			root: rootFolder
		}
	}
};

exports.setupBabel = function setupBabel(paths) {
	return {
		module: {
			loaders: [
				{
					test: /\.jsx?/,
					loaders: ['babel?cacheDirectory'],
					include: paths
				}
			]
		}
	};
};

exports.setupFonts = function setupFonts(path) {
	return {
		module: {
			loaders: [
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'url',
					query: {
						mimetype: 'application/font-woff',
						name: './font/[hash].[ext]'
					},
  					include: path
				},
				{
					test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					query: {
						name: './font/[hash].[ext]'
					},
					loader: 'url',
					include: path
				}
			]
		}
	}
}
