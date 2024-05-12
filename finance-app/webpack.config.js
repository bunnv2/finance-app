const path = require('path');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/index.js', // Adjust this path to your entry JavaScript file
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    plugins: [
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
};
