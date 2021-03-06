import React, {useState} from 'react';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AppText from './AppText';
import BackIcon from '../assets/images/back-icon.svg';
// ** customize 한 스택 네비게이션 헤더 입니다.
// ** props 로 navigation(navigation 객체), title(String) 을 받습니다.

const NavigationTop = props => {
    const {colors} = useTheme();

    return (
        <View flexDirection="row" style={[{
            height: 24,
            marginBottom: 20,
            marginHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center'
        }, Platform.OS === 'android' ? {marginTop: 20} : {marginTop: 10}]}>
            <View style={{position: 'absolute', left: 0}}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} activeOpacity={0.8}>
                    <BackIcon width={24} height={24} style={{color: colors.mainColor}}/>
                </TouchableOpacity>
            </View>
            <AppText style={{color: colors.mainColor, fontSize: 16, fontWeight: 'bold'}}>
                {props.title}
            </AppText>
        </View>
    );
};

export default NavigationTop;