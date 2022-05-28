const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    webpack: {
        plugins: {
            add: [
                [new MonacoEditorWebpackPlugin({
                    filename: "/static/js/[name].worker.js",
                    publicPath: "/static/js/"
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
                use:['file-loader']
            })
            // 
            // webpackConfig.module.rules[oneOfRuleIdx].oneOf.forEach(loader => {
            //     if (loader.test && loader.test.test && (loader.test.test("test.module.css") || loader.test.test("test.module.scss"))) {
            //         loader.use.forEach(use => {
            //             if (use.loader && use.loader.includes('mini-css-extract-plugin')) {
            //                 use.loader = require.resolve('style-loader');
            //             }
            //         })
            //     }
            // })
            return webpackConfig
        }
    },
}