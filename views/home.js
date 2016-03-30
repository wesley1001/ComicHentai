/**
 * Created by vczero on 15/7/12.
 */
var React = require('react-native');
var Util = require('./util');
var Item = require('./home/item');
var Detail = require('./home/detail');
var Service = require('./service');

var {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    } = React;

var Home = React.createClass({
    getInitialState: function () {
        //减去paddingLeft && paddingRight && space
        var width = Math.floor(((Util.size.width - 20) - 50) / 4);
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

        return {
            items: items,
            width: width
        };
    },


    render: function(){
        var contents = [];
        var items = [];
        contents = this.state.items;

        for(var i = 0; i < contents.length; i++){
            console.log(contents);
            items.push(
                <Item
                    data={contents[i]}
                    nav={this.props.navigator}
                    component={Detail}
                    key={contents[i].comicTitle}
                    text={contents[i].message}
                    name={contents[i].username}
                    date={contents[i].time}/>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <View style={{height:50,padding:7,}}>
                    <TextInput style={styles.search} placeholder="搜索"/>
                </View>
                <View style={{backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#ddd'}}>
                    {items}
                    <View style={{height:35}}></View>
                </View>
            </ScrollView>
        );
    }

    /*render: function () {
        var Items1 = [];
        var Items2 = [];
        var items = this.state.items;

        for (var i = 0; i < 4; i++) {
            Items1.push(
                <Item
                    data={contents[i]}
                    nav={this.props.navigator}
                    component={Detail}
                    key={contents[i].messageid}
                    text={contents[i].message}
                    name={contents[i].username}
                    date={contents[i].time}/>

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
            <ScrollView style={styles.container}>
                <View style={styles.itemRow}>
                    {Items1}
                </View>
                <View style={styles.itemRow}>
                    {Items2}
                </View>

            </ScrollView>
        );
    }*/
});


var styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        flexDirection:'column'
    },
    search:{
        height:35,
        borderWidth:Util.pixel,
        borderColor:'#ccc',
        paddingLeft:10,
        borderRadius:6,
        backgroundColor:'#fff',
    }
});

module.exports = Home;



