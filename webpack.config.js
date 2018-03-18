const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		index: './src/index.js',
		gm: './src/gm.js'
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'development',
	//mode: 'production',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		proxy: {
			"/api": "http://localhost:8000"
		}
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
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|gif|jpg|svg)$/,
				use: [
					'file-loader'
				]
			}
		]
	}
	/*,optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
				    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
				}
			}
		}
	}*/
};