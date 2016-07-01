var path = require( 'path' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		path: './dist',
		publicPath: '/',
		filename: 'bundle.js'
	},
	resolve: {
		alias: {
			root: path.resolve( __dirname ),
			src: path.resolve( __dirname, 'src' )
		},
		extensions: [ '', '.js' ]
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
		]
	},
	plugins: [
		new HtmlWebpackPlugin( {
			template: './index.html',
			inject: 'body'
		} )
	],
	devtool: '#inline-source-map'
};
