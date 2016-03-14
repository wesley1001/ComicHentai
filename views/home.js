/**
 * 主页
 * @type {ReactNative|exports|module.exports}
 */
var React = require('react-native');
var Util = require('./util');
//需要调用到ItemBlock 也就是部门条
var ItemBlock = require('./home/itemblock');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
    } = React;

var Home = React.createClass({
    //初始化
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        //计算整个屏幕的宽度
        var width = Math.floor(((Util.size.width - 20) - 50) / 4);
        //初始化item并传入ItemBlock
        var items = [
            {
                id: 1,
                title: '研发',
                partment: '框架研发',
                color: '#126AFF',
            },
            {
                id: 2,
                title: '研发',
                partment: 'BU研发',
                color: '#FFD600',
            },
            {
                id: 3,
                title: '产品',
                partment: '公共产品',
                color: '#F80728',
            },
            {
                id: 4,
                title: '产品',
                partment: 'BU产品',
                color: '#05C147',
            },
            {
                id: 5,
                title: '产品',
                partment: '启明星',
                color: '#FF4EB9',
            },
            {
                id: 6,
                title: '项目',
                partment: '项目管理',
                color: '#EE810D',
            }
        ];

        /**
         * return width and items
         */
        return {
            items: items,
            width: width
        };
    },

    render: function () {
        var Items1 = [];
        var Items2 = [];
        //得到当前初始化的部门列表
        var items = this.state.items;

        /**
         * 第一排渲染
         */
        for (var i = 0; i < 4; i++) {
            Items1.push(
                <ItemBlock
                    key={items[i].id}
                    title={items[i].title}
                    partment={items[i].partment}
                    //获得宽度
                    width={this.state.width}
                    color={items[i].color}
                    //将跳转器复制
                    nav={this.props.navigator}
                />
            );
        }

        for (var i = 4; i < items.length; i++) {
            Items2.push(
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
            //滚动列表展示2排
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

//导出模块
module.exports = Home;