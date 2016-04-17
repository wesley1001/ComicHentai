var React = require('react-native');
var Util = require('../util');
var ActionSheetIOS = require('ActionSheetIOS');
var Service = require('./../service');
var Home = require('./../home')
var RESTFulService = require('./../rest')
var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableHighlight,
    LinkingIOS,
    AlertIOS,
    } = React;


/**
 * 专题具体内容
 */
var Detail = React.createClass({

    render: function () {
        return (<View style={{flex: 1,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
            <Home
                navigator={this.props.navigator}
                requestUrl={RESTFulService.host+RESTFulService.classification.comic.detail}
                otherParam={{
                    classified:{id:this.props.id}
                }}
                canRefresh={false}
                canLoadNext={false}
                canFilter={true}
            />
        </View>);
    }

});

var styles = StyleSheet.create({
    row: {
        height: 80,
        borderBottomWidth: Util.pixel,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E30082',
    },
    part: {
        marginLeft: 5,
        flex: 1,
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
    }, search: {
        height: 35,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    }
});

module.exports = Detail;