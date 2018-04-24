/*
 * @Author: mikey.dongqizhen 
 * @Date: 2018-04-17 16:43:52 
 * @Last Modified by: mikey.dongqizhen
 * @Last Modified time: 2018-04-17 17:33:46
 */
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');// 自动写入将引用写入html
const CleanWebpackPlugin = require("clean-webpack-plugin");// 删除文件
const path = require('path');
const PurifyCssWebpack = require('purifycss-webpack'); 
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');// 拷贝文件

module.exports = {
    entry: __dirname + '/app/main.js',
    output: {
        path: path.resolve(__dirname, "bulid"), //打包后的文件存放的地方
        filename: "bundle-[hash].js" //打包后输出文件的文件名
    },
    devtool: "source-map",
    mode: 'development',
    optimization: {
        splitChunks: {
			minSize: 1,
            chunks: "initial",
			name:"vendor"
		},
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true 
          }),
          new OptimizeCSSAssetsPlugin({})  // use OptimizeCSSAssetsPlugin
        ]
    },
    devServer: {
        contentBase: "./bulid", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        inline: true, //实时刷新
        hot: true,//模块热更新
        port: "8080",//设置端口号
        open:false//自动拉起浏览器
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/, //一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
                use: {
                    loader: "babel-loader", //loader的名称（必须）
                },
                exclude: /node_modules/ //{include/exclude} 手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
            }, 
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                     fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            url:false,
                            minimize:true,
                            sourceMap:true,
                            modules: true, // 指定启用css modules
                            localIdentName: "[name]__[local]--[hash:base64:5]" // 指定css的类名格式
                        }
                    }, {
                        loader: "postCss-loader"
                    }]
                })
            },
            {  
                test:/\.(sass|scss)$/, //处理sass  
                use:['style-loader','css-loader','sass-loader']  
            },
            {  
                test:/\.(png|jpg|gif)$/, // 处理图片  
                use: [{  
                    loader:'url-loader',  
                    options:{   // 这里的options选项参数可以定义多大的图片转换为base64
                        limit:5000, // 表示小于50kb的图片转为base64,大于50kb的是路径  
                        outputPath: 'images' //图片打包出去的目录  
                    }  
                }]  
            } 
        ]
    },
    plugins: [
        new CleanWebpackPlugin('bulid/*.*', {
            root: __dirname,
            verbose: true,// Write logs to console.
            dry: false,//不要删除任何东西，主要用于测试.
            exclude: ["files","to","ignore","app","package.json"]//排除不删除的目录，主要用于避免删除公用的文件
        }),
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new HtmlWebpackPlugin({ //这个插件的作用是依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html。这在每次生成的js文件名称不同时非常有用（比如添加了hash值）
            filename: 'index.html',//定义生成的页面的名称  
            template: __dirname + "/app/index.html", //new 一个这个插件的实例，并传入相关的参数
            title:"这里是设置HTML title",
            minify:{  
                collapseWhitespace:true //压缩html空白代码  
            }, 
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(), //为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
       // new webpack.optimize.UglifyJsPlugin(), //压缩JS代码
        new ExtractTextPlugin("css/style.css"), //分离CSS和JS文件
        new PurifyCssWebpack({ // 消除冗余css代码  
            paths:glob.sync(path.join(__dirname,'app/*.html')) //path.join合并路径  
        }), 
        new CopyWebpackPlugin([{ // 静态文件输出 也就是复制粘贴  
            from:path.resolve(__dirname,'app/assets'), //将哪里的文件  
            to:'./bulid' // 复制到哪里  
        }]),
    ],

}