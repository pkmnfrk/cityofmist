const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebappWebpackPlugin  = require('webapp-webpack-plugin');

module.exports = {
	entry: {
		index: './src/index.js',
		gm: './src/gm.js'
	},
	output: {
		filename: '[name].[chunkhash].js',
		chunkFilename: '[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: "City of Mist",
			template: "index.html",
			filename: "index.html",
			favicon: "src/images/city-tiny.png",
			chunks: ["index"]
		}),
		new HtmlWebpackPlugin({
			title: "City of Mist GM",
			template: "index.html",
			filename: "gm.html",
			favicon: "src/images/city-tiny-gm.png",
			chunks: ["gm"]
		}),
		new WebappWebpackPlugin ({
			logo: './src/images/city.png',
			prefix: 'icon-[hash]',
			persistentCache: true,
			inject: true,
			favicons: {
				background: '#000',
				appName: 'cityofmist',
				appDescription: "City of Mist",
				developerName: "Mike Caron",
				developerURL: null,
				icons: {
					coast: false,
					yandex: false,
					firefox: false,
					windows: false,
					appleStartup: false
				}
				
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.(png|gif|jpg|svg)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
};