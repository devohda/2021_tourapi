import * as React from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SearchScreen from "../screens/SearchScreen";

function HomeScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home!</Text>
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="home" component={HomeScreen} options={{title: '홈'}}/>
            <Tab.Screen name="directory" component={SearchScreen} options={{title: ''}}/>
            <Tab.Screen name="mypage" component={SettingsScreen} options={{title: '마이페이지'}}/>
        </Tab.Navigator>
    );
}