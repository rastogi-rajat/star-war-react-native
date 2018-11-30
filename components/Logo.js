import React from 'react';
import { Image } from 'react-native';

export default (props) => {
    return <Image {...props} source={require('../assets/images/logo.png')} />
}