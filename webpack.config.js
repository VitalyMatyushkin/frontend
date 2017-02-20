var 	webpack				= require("webpack"),
		path				= require('path'),
		ExtractTextPlugin	= require('extract-text-webpack-plugin'),
		HtmlWebpackPlugin	= require('html-webpack-plugin'),
		autoprefixer		= require('autoprefixer');

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
		preLoaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'eslint'
			}
		],
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					"presets": ["react"],
					"plugins": [
						"transform-flow-strip-types",
						"transform-es2015-arrow-functions",     // allowing arrow functions
						"check-es2015-constants",               // checking const expressions to be really const
						"transform-es2015-block-scoping",       // allowing block scope features
						"transform-es2015-template-literals",   // allow string interpolation
						"transform-es2015-classes",				// allow class syntax
						"transform-class-properties"
					]
				}
			}, {
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract('css!postcss!sass')
			}
		]
	},
	postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
	plugins: [
		new ExtractTextPlugin('styles.css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: 'index.html.ejs',
			inject: 'body',
			hash: true,
			filename: '../index.html'	// index.html is in root directory
		})
	],
	output: {
		publicPath: 'dist/',					// specifies the public URL address of the output files when referenced in a browser
		path: 		path.resolve('./dist'),		// storing all results in this folder
		filename: 	'bundle.js'					// with names like this
	}
};
