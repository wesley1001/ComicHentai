var React = require('react-native');
var {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    } = React;

/**
 * 单个漫画的详情页
 */

var Detail = React.createClass({
    render: function () {
        //前面的页面传过来的信息
        var content = this.props.content;
        return (
            <ScrollView>

                <View style={styles.content}>
                    <Text style={{lineHeight:20,}}>{content.comicTitle}</Text>
                </View>

                <View style={[styles.luokuan, {marginTop:25}]}>
                    <View style={{flex:1}}></View>
                    <Text style={[styles.text, {color:'#007AFF'}]}>{content.author}</Text>
                </View>

                <View style={styles.luokuan}>
                    <View style={{flex:1}}></View>
                    <Text style={[styles.text, {color:'#3BC1FF'}]}>{content.updatedContent}</Text>
                </View>

            </ScrollView>
        );
    }
});

var styles = StyleSheet.create({
    content: {
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
        opacity: 0.85,
    },
    luokuan: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 20,
    },
    text: {
        lineHeight: 20,
        width: 90
    }
});

module.exports = Detail;