import React from 'react';
import { Dimensions } from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useTheme} from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
const totalWidth = Dimensions.get('screen').width;

import SearchPlace from '../screens/search/SearchPlace';
import SearchCollection from '../screens/search/SearchCollection';
import SearchUser from '../screens/search/SearchUser';


const SearchTabNavigator = ({navigation}) => {
    const {colors} = useTheme();
    return (
        <Tab.Navigator
            sceneContainerStyle={{
                backgroundColor: colors.backgroundColor,
                //만약 검색 결과가 존재하지 않으면 '검색 결과가 존재하지 않습니다' 띄우면 될것
                // height: 72 * placeList.length
            }}
            screenOptions={({route}) => {
                const tabWidth = (totalWidth - 40) / 3;
                const textWidth = route.name.length * 12 + 5;

                return ({
                    tabBarActiveTintColor: colors.mainColor,
                    tabBarInactiveTintColor: colors.gray[5],
                    tabBarLabelStyle: {fontSize: 16, fontWeight: '700'},
                    tabBarStyle: {
                        backgroundColor: colors.backgroundColor,
                        elevation: 0,
                        shadowOpacity: 0,
                        justifyContent : 'center',
                        height : 56
                    },
                    
                    tabBarIndicatorStyle: {
                        position: 'absolute',
                        bottom: 14,
                        left: (tabWidth - textWidth) / 2,
                        width: textWidth,
                        backgroundColor: colors.red[3],
                        borderRadius: 6,
                        height: 2
                    },
                });
            }}
        >
            <Tab.Screen name={'공간'} children={() => <SearchPlace navigation={navigation}/>}/>
            <Tab.Screen name={'보관함'} children={() => <SearchCollection navigation={navigation}/>}/>
            <Tab.Screen name={'유저'} children={() => <SearchUser navigation={navigation}/>}/>
        </Tab.Navigator>
    );
};

export default SearchTabNavigator;