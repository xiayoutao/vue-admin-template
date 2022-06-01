const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // css压缩
const TerserPlugin = require('terser-webpack-plugin'); // js压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin"); // gzip压缩
const path = require('path');
const resolve = dir => path.join(__dirname, dir);

// const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const useCDN = process.env.VUE_APP_USE_CDN === 'true';

function toFill(num) {
  if (num < 10) {
    return '0' + num;
  }
  return num;
}

function getVersion () {
  const d = new Date();
  // const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hour = d.getHours();
  const minu = d.getMinutes();
  return `${toFill(month)}${toFill(date)}_${toFill(hour)}${toFill(minu)}`;
}

const version = getVersion();

module.exports = {
  publicPath: "",
  lintOnSave: false,
  productionSourceMap: false,
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        //本地服务接口地址
        target: process.env.VUE_APP_BASE_URL,
        //远程演示服务地址,可用于直接启动项目
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  },
  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/variables.scss";'
      },
    }
  },
  chainWebpack: config => {
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');

    const entry = config.entry('app');
    entry.add('@/mock').end();
  },
  configureWebpack: {
    devtool: isDevelopment ? 'eval-source-map' : '',
    output: {
      filename: `js/[name].${version}.js`,
      chunkFilename: `js/[name].${version}.js`,
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@cps': resolve('src/components'),
      }
    },
    externals: useCDN ? {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
    } : {},
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 2000,
        minChunks: 1,
        maxInitialRequests: 4,
        name: true,
        cacheGroups: {
          'element-ui': {
            name: 'element-ui',
            test: /[\\/]node_modules[\\/]element-ui[\\/]/,
            priority: -10,
          },
          'umy-ui': {
            name: 'umy-ui',
            test: /[\\/]node_modules[\\/]umy-ui|umy-table[\\/]/,
            priority: -10,
          },
          'echarts': {
            name: 'echarts',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: -10,
          },
          'components': {
            name: 'components',
            test: /[\\/]src[\\/]components[\\/]/,
            priority: -10,
          },
          'mock': {
            name: 'mock',
            test: /[\\/]src[\\/]mock[\\/]/,
            priority: -10,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
            reuseExistingChunk: true
          },
        }
      },
      minimize: !isDevelopment, // 启用压缩
      minimizer: [
        // 压缩es6
        new TerserPlugin({
          parallel: true, // 并行压缩
          cache: true, // 缓存
          sourceMap: false,
          terserOptions: {
            minify: TerserPlugin.uglifyJsMinify,
            ie8: false,
            extractComments: false,
            format: {
              comments: false, // 删除注释
            },
            compress: {
              warnings: false, // 删除没有用到的代码时不输出警告
              pure_funcs: ['console.log'],
              drop_console: true, // 移除console
              drop_debugger: true, // 移除debugger
            },
          },
        }),
        // 压缩提取的CSS,删除来自不同组件重复的css
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            safe: true,
            discardComments: {
              removeAll: true,
            },
          },
        }),
      ],
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			new StyleLintPlugin({
				files: ['**/*.{vue,html,css,less,scss,sass}'],
				fix: true,
				failOnError: false,
			}),
      // 下面是下载的插件的配置
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['css', 'js'].join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }),
    ],
  },
};