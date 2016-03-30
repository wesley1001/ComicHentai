/**
 * Created by vczero on 15/7/12.
 */

var React = require('react-native');
var Util = require('./util');
var ItemBlock = require('./home/itemblock');
var Service = require('./service')

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    } = React;

var Home = React.createClass({
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(Util.size.width);
        //获取真正的漫画数据

        var path = Service.host + Service.getComic;
        var that = this;
        Util.post(path, {
            key: Util.key
        }, function (data) {
            that.setState({
                items: items
            });
        });

        return {
            items: items,
            width: width
        };
    },

    render: function () {
        var Items1 = [];
        var items = this.state.items;
        console.log("当前漫画");
        console.log(items);

        for (var i = 0; i < 4; i++) {
            Items1.push(
                <ItemBlock
                    key={items[i].id}
                    title={items[i].title}
                    partment={items[i].partment}
                    width={this.state.width}
                    color={items[i].color}
                    nav={this.props.navigator}
                />
            );
        }
        return (
            <ScrollView style={styles.container}>
                {Items1}
            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    }
});

module.exports = Home;
