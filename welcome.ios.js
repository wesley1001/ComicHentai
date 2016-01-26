/**
 * Created by hope6537 on 16/1/26.
 */
'use strict';

var React = require('react-native');
var { Icon, } = require('react-native-icons');
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

class Welcome extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Welcome to your React Native Start Component!
                </Text>
                <Icon
                    name='ion|beer'
                    size={150}
                    color='#887700'
                    style={styles.beer}
                />
            </View>
        );
    }
}

module.exports = Welcome;