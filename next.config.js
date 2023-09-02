const withExportImages = require('next-export-optimize-images')

module.exports = withExportImages({
  // write your next.js configuration values.
})


/* module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_HOST_NAME: process.env.HOST,
  }
} */
/* const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  [optimizedImages, {
  }],

  // your other plugins here

]);



module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  }
}; */

/* module.exports = {
    // https://github.com/vercel/next.js/issues/21079
    // Remove this workaround whenever the issue is fixed
    images: {
      loader: 'imgix',
      path: '/',
    },
  } */