import * as React from 'react';
import {useState, useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, Platform} from "react-native";
import {Icon} from 'react-native-elements';
import RBSheet from "react-native-raw-bottom-sheet";

import MainPageNavigator from "./MainPageNavigator";
import MyPageScreen from "../screens/MyPageScreen";
import MakeDirectoryBtn from '../screens/MakeDirectoryBtn';
import { color } from 'react-native-elements/dist/helpers';

const Tab = createBottomTabNavigator();

export default function HomeNavigator({navigation,route}) {
        return (
            <Tab.Navigator tabBarOptions={Platform.OS === 'ios' ? {keyboardHidesTabBar: false} : {keyboardHidesTabBar: true}}>
                <Tab.Screen name="main" component={MainPageNavigator} options={{
                    tabBarIcon:({focused})=>(
                    <Image source={focused? require('../assets/images/home_filled_click.png') : require('../assets/images/home_filled_nonclick.png')} style={{marginBottom: 5}}></Image>),
                    tabBarLabel:()=>{return null}
                }}/>
                <Tab.Screen name="directory" component={MakeDirectoryBtn} options={{title:'', tabBarIcon:()=>(
                    MakeDirectoryBtn({navigation}))
                }}/>
                <Tab.Screen name="mypage" component={MyPageScreen} options={{title: '마이페이지',
                    tabBarIcon:({focused})=>(
                    <Image source={focused ? require('../assets/images/record_voice_over_click.png') : require('../assets/images/record_voice_over_nonclick.png')} style={{marginBottom: 5}}></Image>),
                    tabBarLabel:()=>{return null}
                }}/>
            </Tab.Navigator>
        );
}