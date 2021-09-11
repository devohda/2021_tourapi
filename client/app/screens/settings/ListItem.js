import React, { memo, useState } from 'react';
import { View, Image, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../components/AppText';

import hereIcon from '../../assets/images/appicon.png';

const ListItem = props => {
    const {colors} = useTheme();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };

    return(
    <>
    {
        props.index === 1 || props.index === 2 ?
            <View style={props.index === 1 ? {...styles.list_style, ...styles.list_style_version1} : {...styles.list_style, ...styles.list_style_version2}}>
                {props.index === 1 && <Image source={hereIcon} style={{width: 24, height: 24, marginEnd: 9}}></Image>}
                <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                {props.index === 2 && <Switch
                        trackColor={{false: colors.gray[6], true: colors.mainColor}}
                        thumbColor={colors.defaultColor}
                        ios_backgroundColor={colors.gray[6]}
                        onChange={toggleSwitch}
                        value={isEnabled}
                    />}
            </View> :
            <View style={{...styles.list_style}}>
                {
                    props.index === 4 ?
                    <AppText style={{color: props.data === '로그아웃' ? colors.gray[5] : colors.red[3], fontSize: 16, lineHeight: 20}}>{props.data}</AppText> :
                    <AppText style={{color: colors.mainColor, fontSize: 16, lineHeight: 20}}>{props.data}</AppText>
                }
            </View>
    }
    </>
)};

const areEqual = (prevProps, nextProps) => {
    const { isSelected } = nextProps;
    const { isSelected: prevIsSelected } = prevProps;
    
    /*if the props are equal, it won't update*/
    const isSelectedEqual = isSelected === prevIsSelected;
  
    return isSelectedEqual;
};

const styles = StyleSheet.create({
    header_text: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 19.2,
        marginTop: 16
    },
    list_style: {
        marginBottom: 32
    },
    list_style_version1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    list_style_version2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default memo(ListItem, areEqual);