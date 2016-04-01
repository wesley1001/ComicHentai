/**
 * Search View
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
var Item = require('./message/item');
var Detail = require('./message/detail');
var Service = require('./service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    } = React;

var Search = React.createClass({
    render: function () {

        return (
            <ScrollView style={styles.container}>
                <View style={{height:50,padding:7,}}>
                    <TextInput style={styles.search} placeholder="搜索"/>
                </View>
                <View style={{backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                    <Text>
                        搜素出来的信息-ListView
                    </Text>
                </View>
            </ScrollView>
        );
    }

});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column'
    },
    search: {
        height: 35,
        borderWidth: Util.pixel,
        borderColor: '#ccc',
        paddingLeft: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    }
});

module.exports = Search;