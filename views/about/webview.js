/**
 * 用于展示Web界面
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var {
    //引入WebView
    WebView,
    ScrollView,
    Text,
    View,
    } = React;


//创建WebView Module 通过React.createClass来创建
var webview = React.createClass({
    render: function () {
        return (
            //渲染方式是直接在View里添加WebView UI
            <View style={{flex:1}}>
                <WebView url={this.props.url}/>
            </View>
        );
    }

});
//最后导出
module.exports = webview;
