import React from 'react';
import 'react-native-gesture-handler';
import {createStackNavigator} from '@react-navigation/stack';

import SignInEmailScreen from '../screens/auth/SignInEmailScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import SignUpSocialScreen from '../screens/auth/SignUpSocialScreen';
import SignUpEmailScreen from '../screens/auth/SignUpEmailScreen';

const Stack = createStackNavigator();

export default function AuthenticationNavigator({navigation : appNavigation}) {
    return (
        <Stack.Navigator initialRouteName="SignUpSocial" screenOptions={{headerShown: false}}>
            <Stack.Screen name="SignUpSocial" component={SignUpSocialScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInEmail" children={({navigation}) => <SignInEmailScreen navigation={navigation} appNavigation={appNavigation}/> }/>
            <Stack.Screen name="SignUpEmail" component={SignUpEmailScreen}/>
            <Stack.Screen name="ChangePassword" children={({navigation}) => <ChangePasswordScreen navigation={navigation} appNavigation={appNavigation}/> }/>
        </Stack.Navigator>
    );
}
