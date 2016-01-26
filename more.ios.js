/**
 * Created by hope6537 on 16/1/26.
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

class More extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    This could be your second tab
                </Text>
            </View>
        );
    }
}

module.exports = More;