const webpack = require('webpack');
const path = require('path');

export default (config, env, helpers) => {
	// Disabled CSS modules
	let styles = helpers.getLoadersByName(config, 'css-loader');
	styles[0].loader.options.modules = false;
};
