/**
 * Created by hope6537 on 16/1/26.
 * 用户页
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
    Component
    } = React;

var styles = StyleSheet.create({
    description: {
        fontSize: 20,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66CCFF',
    }
});

class User extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    这是正在施工的个人页
                </Text>
            </View>
        );
    }
}

module.exports = User;
