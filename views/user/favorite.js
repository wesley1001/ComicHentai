/**
 * 收藏页
 * Created by hope6537 on 16/4/6.
 */
var React = require('react-native');
var Util = require('../util');
var Home = require('../home');
var Service = require('./../service');
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


var REQUEST_FAVORITE_URL = Service.host + Service.getUserFavorite;
var Favorite = React.createClass({

    render: function () {
        return (<View style={{flex: 1,marginBottom:80,backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
            <Home
                navigator={this.props.navigator}
                requestUrl={REQUEST_FAVORITE_URL}
                keyWord={""}
                canLoadNext={false}
                canFilter={true}
            />
        </View>);
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 80,
    },
    noColor: {
        fontSize: 12,
        marginLeft: 5
    },
    link: {
        color: '#1BB7FF',
        marginTop: 2,
    },
    unColor: {
        color: '#575656',
        marginTop: 8,
        fontSize: 12,
        marginLeft: 5
    }
});

module.exports = Favorite;