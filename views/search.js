/**
 * Search View
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
var Item = require('./message/item');
var Detail = require('./message/detail');
var Service = require('./service');
var Home = require('./home');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    } = React;

var REQUEST_COMIC_URL = Service.host + Service.searchComic;
var PAGE = 0;
var Search = React.createClass({

    getInitialState: function () {
        return ({
            hasKeyWord: false
        })
    },

    renderNormalScreen: function () {
        return (
            <View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                <Text style={{marginBottom:80}}>
                    这里将来是一堆标签的按钮
                </Text>
                <Text>
                    这里是搜素记录
                </Text>
            </View>);
    },

    renderSearchResult: function () {
        return (<View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
            <Home
                navigator={this.props.navigator}
                requestUrl={REQUEST_COMIC_URL}
            />
        </View>);
    },

    render: function () {
        var content = this.renderNormalScreen();
        if (this.state.hasKeyWord) {
            content = this.renderSearchResult();
        }
        return (
            <View style={styles.container}>
                <View style={{height:50,padding:7,}}>
                    <TextInput style={styles.search} placeholder="搜索漫画/标签/作者..."/>
                </View>
                {content}
            </View>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    search: {
        height: 35,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Search;