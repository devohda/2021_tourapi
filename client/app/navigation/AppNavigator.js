import HomeNavigator from "./HomeNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";
import React, {useState} from "react";
import {useIsSignedIn} from "../contexts/SignedInContextProvider";
import {createStackNavigator} from "@react-navigation/stack";
import SearchScreen from "../screens/SearchScreen";
import PlaceScreen from "../screens/PlaceScreen";
import MakeFreeDirectory from "../screens/MakeFreeDirectory";
import FreeDirectory from "../screens/collection/FreeDirectory";

const MainStack = createStackNavigator()

const AppNavigator = () => {
    const [isSignedIn, setIsSignedIn] = useIsSignedIn()

    return (
        <MainStack.Navigator screenOptions={{headerShown: false, defaultComponent : 'App'}}>
            {!isSignedIn ?
                <MainStack.Screen name="Authentication" component={AuthenticationNavigator}/> :
                <>
                    <MainStack.Screen name="App" children={({navigation}) => <HomeNavigator navigation={navigation}/>}/>
                    <MainStack.Screen name="Search" children={SearchScreen}/>
                    <MainStack.Screen name="Place" component={PlaceScreen}/>
                    <MainStack.Screen name="Directory" component={MakeFreeDirectory}/>
                    <MainStack.Screen name="ShowFreeDir" component={FreeDirectory} />
                </>
            }
        </MainStack.Navigator>
    )
}

export default AppNavigator;