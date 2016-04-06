/**
 * 历史记录页
 * Created by hope6537 on 16/4/6.
 */
var React = require('react-native');
var Util = require('../util');
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


var History = React.createClass({

    render: function () {
        return (
            <View style={styles.container}>
                <Text style={styles.unColor}>
                    历史记录页
                </Text>
            </View>
        );
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

module.exports = History;