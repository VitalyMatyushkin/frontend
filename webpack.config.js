var 	webpack				= require("webpack"),
		path				= require('path'),
		ExtractTextPlugin	= require('extract-text-webpack-plugin'),
		HtmlWebpackPlugin	= require('html-webpack-plugin'),
		autoprefixer		= require('autoprefixer');

var babelPluginsList = [
	"transform-flow-strip-types",
	"transform-es2015-arrow-functions",     // allowing arrow functions
	"check-es2015-constants",               // checking const expressions to be really const
	"transform-es2015-block-scoping",       // allowing block scope features
	"transform-es2015-template-literals",   // allow string interpolation
	"transform-es2015-classes",				// allow class syntax
	"transform-class-properties",
	"transform-es2015-parameters",			// transforming default values
	"transform-es2015-shorthand-properties"
];


module.exports = {
	entry: "./source/js/init",
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'source/js'),	// do we need both?
			path.resolve(__dirname, 'source')
		]
	},
	stats: {
		children: false // not showing chatty logs from Child plugin
	},
	module: {
		rules: [
			// {
			// 	test: /\.js$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	loader: 'eslint-loader',
			// 	enforce: "pre"
			// },
			// {
			// 	test: /\.js$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	loader: 'babel-loader',
			// 	query: {
			// 		"presets": ["react"],
			// 		"plugins": babelPluginsList
			// 	}
			// },
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{ loader: 'eslint-loader' },
					{ loader: 'babel-loader', options: {
							"presets": ["react"],
							"plugins": babelPluginsList
					}}
				]
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader'/*, 'postcss-loader'*/,'sass-loader']
				})
			}
		],
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'styles.css',
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