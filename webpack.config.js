var path = require( 'path' );

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		path: './dist',
		publicPath: '/dist/',
		filename: 'bundle.js'
	},
	resolve: {
		alias: {
			src: path.resolve( __dirname, 'src' )
		},
		extensions: [ '', '.js' ]
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	devtool: '#inline-source-map'
};
