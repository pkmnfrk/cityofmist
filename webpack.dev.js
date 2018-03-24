const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	mode: 'development',
	devServer: {
		contentBase: './dist',
		proxy: {
			"/api": "http://localhost:8000"
		},
		host: "0.0.0.0",
		overlay: {
			warnings: true,
			errors: true
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
});