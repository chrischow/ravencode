const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    webpack: {
        plugins: {
            add: [
                [new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 1
                })],
                [new MonacoEditorWebpackPlugin({
                    filename: "[name].worker.txt",
                    publicPath: "/rsaf/RDO/devtools/main/"
                }), "append"]
            ]
        },
        configure: (webpackConfig, {
            env,
            paths
        }) => {

            webpackConfig.plugins.forEach(plugin => {
                if (plugin instanceof InlineChunkHtmlPlugin) {
                    plugin.tests = [/.+[.]js/]
                }
            })

            const oneOfRuleIdx = webpackConfig.module.rules.findIndex(rule => !!rule.oneOf);
            webpackConfig.module.rules[oneOfRuleIdx].oneOf.push({
                test: /\.ttf$/,
                type: 'asset/inline'
                // this is not working. must be something in react-scripts
                // that is not inlining the file. work-around in postbuild.sh
            })
            
            webpackConfig.module.rules[oneOfRuleIdx].oneOf.forEach(loader => {
                if (loader.test && loader.test.test && (loader.test.test("test.module.css") || loader.test.test("test.module.scss"))) {
                    loader.use.forEach(use => {
                        if (use.loader && use.loader.includes('mini-css-extract-plugin')) {
                            use.loader = require.resolve('style-loader');
                        }
                    })
                }
            })
            return webpackConfig
        }
    },
}