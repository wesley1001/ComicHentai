/**
 * 主页 展现IndexTab 由TabBar来控制其他的Page
 */
'use strict';
var React = require('react-native');
var {
    AppRegistry,
    NavigatorIOS,
    StyleSheet,
    View
    } = React;
var SearchScreen = require('./SearchScreen');
var IndexTab = require('./IndexTab');
var ComicHentai = React.createClass({
    render: function () {
        return (
            <View style={styles.container}>
                <IndexTab/>
            </View>
        );
    }
});
var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

AppRegistry.registerComponent('ComicHentai', () => ComicHentai);
module.exports = ComicHentai;