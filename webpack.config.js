var 	webpack				= require("webpack"),
		path				= require('path'),
		ExtractTextPlugin	= require('extract-text-webpack-plugin');

module.exports = {
	entry: "./source/js/init",
	resolve: {
		root: [
			path.resolve('./source')
		],
		modulesDirectories: [
			'node_modules',
			'source/js',
			'source'
		]
	},
	stats: {
		children: false // not showing chatty logs from Child plugin
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					"presets": ["react"],
					"plugins": [
						"transform-es2015-arrow-functions",     // allowing arrow functions
						"check-es2015-constants",               // checking const expressions to be really const
						"transform-es2015-block-scoping",       // allowing block scope features
						"transform-es2015-template-literals"    // allow string interpolation
					]
				}
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('css!sass')
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css', {
			allChunks: true
		})
	],
	output: {
		publicPath: 'dist/',					// specifies the public URL address of the output files when referenced in a browser
		path: 		path.resolve('./dist'),		// storing all results in this folder
		filename: 	'bundle.js'					// with names like this
	}
};
