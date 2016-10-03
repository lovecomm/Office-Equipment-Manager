import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import autoprefixer from 'autoprefixer'

const LAUNCH_COMMAND = process.env.npm_lifecycle_event

const isProduction = LAUNCH_COMMAND === 'production'
process.env.BABEL_ENV = LAUNCH_COMMAND

const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'dist'),
}

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: PATHS.app + '/index.html',
	filename: 'index.html',
	inject: 'body',
})

const productionPlugin = new webpack.DefinePlugin({
	'process.env': {
		NODE_ENV: JSON.stringify('production'),
	},
})

const base = {
	entry: [
		PATHS.app,
	],
	output: {
		path: PATHS.build,
		filename: 'index_bundle.js',
		publicPath: '/',
	},
	module: {
		loaders: [
			{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}, {
				test: /(\.scss|\.css)$/,
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'),
			},
			{ test: /\.json$/, loader: 'json-loader' },
		],
	},
	postcss: [autoprefixer],
	sassLoader: {
		data: '@import "theme/_theme.scss";',
		includePaths: [path.resolve(__dirname, './app')],
	},
	resolve: {
		extensions: ['', '.scss', '.css', '.js', '.json'],
		modulesDirectories: [
			'node_modules',
			path.resolve(__dirname, './node_modules'),
		],
		root: path.resolve('./app'),
	},
}

const developmentConfig = {
	devtool: 'cheap-module-inline-source-map',
	devServer: {
		contentBase: PATHS.build,
		hot: true,
		inline: true,
		progress: true,
	},
	plugins: [
		HTMLWebpackPluginConfig,
		new ExtractTextPlugin('bundle.css', { allChunks: true }),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
}

const productionConfig = {
	devtool: 'cheap-module-source-map',
	plugins: [HTMLWebpackPluginConfig, productionPlugin],
}

export default Object.assign({}, base, isProduction === true ? productionConfig : developmentConfig)
