var path = require('path');
var webpack = require('webpack');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
	entry : [ 
		"webpack/hot/dev-server",	// // [webpack-dev-server config] hot module refresh require
		"./app/main.js"
	],
	output : {
		path : BUILD_PATH,
		publicPath: "/assets/",		// [webpack-dev-server config]
		filename : "[name].js"
	},
	module : {
		loaders : [ {
			test : /\.js$/,
			exclude : /node_modules/,
			loader : 'babel-loader'
		}, {
			test : /\.html$/,
			loader : "html-loader"
		}, {
			test : [ /\.vert$/, /\.frag$/ ],
			loader : "raw-loader"
		}]
	},
	"devtool" : "eval",
	"debug" : true,
	resolve : {
		extensions : [ '', '.js', '.json' ]
	},
	plugins : [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin()	// // [webpack-dev-server config] hot module refresh require
	]
};