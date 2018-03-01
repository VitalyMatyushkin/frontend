const 	webpack					= require("webpack"),
		path					= require('path'),
		ExtractTextPlugin		= require('extract-text-webpack-plugin'),
		HtmlWebpackPlugin		= require('html-webpack-plugin'),
		BundleAnalyzerPlugin	= require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
		autoprefixer			= require('autoprefixer');

const babelPluginsList = [
	"transform-es2015-arrow-functions",     // allowing arrow functions
	"check-es2015-constants",               // checking const expressions to be really const
	"transform-es2015-block-scoping",       // allowing block scope features
	"transform-es2015-template-literals",   // allow string interpolation
	"transform-es2015-classes",				// allow class syntax
	"transform-class-properties",
	"transform-es2015-parameters",			// transforming default values
	"transform-es2015-spread",
	"transform-es2015-shorthand-properties",
	"transform-object-rest-spread",
	"transform-es2015-destructuring",
	"transform-es2015-computed-properties"
];

/*
 * White list of modules which should be transpiled with babel.
 * This list is required to transpile some modules which are definitely not ES5
 * @type {Array}
 */
const nodeModulesBabelWhiteList = [
	path.join('node_modules', 'propz')
];

/** Check whether provided value is in white list */
nodeModulesBabelWhiteList.isWhiteListed = function(value) {
	return this.findIndex(whiteItem => value.includes(whiteItem)) !== -1;
};

module.exports = {
	entry: "./source/js/init",
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'source/js'),	// do we need both?
			path.resolve(__dirname, 'source')
		],
		extensions: ['.ts', '.tsx', '.js', '.json'],
		alias: {
			director: path.resolve(__dirname, 'node_modules/director/build/director')
		}
	},
	stats: {
		children: false // not showing chatty logs from Child plugin
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: value => {
					/* exclude if not whitelisted and in node_modules */
					if(nodeModulesBabelWhiteList.isWhiteListed(value)) {
						return false;
					} else {
						return /(node_modules)/.test(value);
					}
				},
				use: [
					{ loader: 'babel-loader', options: {
							"presets": ["react"],
							"plugins": babelPluginsList
					}},
					{ loader: 'ts-loader', options: { transpileOnly: false } }
				]
			},
			{	// js -> eslint -> tsc(to check whats going on) -> babel
				test: /\.(js)$/,
				exclude: value => {
					/* exclude if not whitelisted and in node_modules */
					if(nodeModulesBabelWhiteList.isWhiteListed(value)) {
						return false;
					} else {
						return /(node_modules)/.test(value);
					}
				},
				use: [
					{ loader: 'babel-loader', options: {
						"presets": ["react"],
						"plugins": babelPluginsList
					}},
					{ loader: 'ts-loader', options: { transpileOnly: false } },
					{ loader: 'eslint-loader' }
				]
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'postcss-loader','sass-loader']
				})
			}
		],
	},
	devtool: 'source-map',
	plugins: [
		//new webpack.optimize.UglifyJsPlugin({
			//mangle:		false,	// I'm not sure if mangling can be enabled safely. So disabling it for a while
			//sourceMap:	true
		//}),
		// new BundleAnalyzerPlugin(), /* uncomment to watch stats */
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
	},
	devServer: {
		disableHostCheck: true,
		port:	8080
	}
};
