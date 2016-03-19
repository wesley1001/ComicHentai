/**
 * Created by hope6537 on 16/3/19.
 */
/**
 * Created by vczero on 15/7/12.
 */

var React = require('react-native');
var Util = require('./util');
var Item = require('./explore/item');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    } = React;

var Explore = React.createClass({
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(((Util.size.width - 20) - 50) / 4);
        var items = [
            {
                id: 1,
                title: '专题1',
                color: '#126AFF',
            },
            {
                id: 2,
                title: '专题2',
                color: '#FFD600',
            },
            {
                id: 3,
                title: '专题3',
                color: '#F80728',
            },
            {
                id: 4,
                title: '专题4',
                color: '#05C147',
            },
            {
                id: 5,
                title: '专题5',
                color: '#FF4EB9',
            },
            {
                id: 6,
                title: '专题6',
                color: '#EE810D',
            }
        ];

        return {
            items: items,
            width: width
        };
    },

    render: function () {
        var Items1 = [];
        var Items2 = [];
        var items = this.state.items;

        for (var i = 0; i < 4; i++) {
            Items1.push(
                <Item
                    key={items[i].id}
                    title={items[i].title}
                    width={this.state.width}
                    color={items[i].color}
                    nav={this.props.navigator}
                />
            );
        }

        for (var i = 4; i < items.length; i++) {
            Items2.push(
                <Item
                    key={items[i].id}
                    title={items[i].title}
                    width={this.state.width}
                    color={items[i].color}
                    nav={this.props.navigator}
                />
            );
        }

        return (
            <ScrollView style={styles.container}>
                <View style={styles.itemRow}>
                    {Items1}
                </View>
                <View style={styles.itemRow}>
                    {Items2}
                </View>

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

module.exports = Explore;