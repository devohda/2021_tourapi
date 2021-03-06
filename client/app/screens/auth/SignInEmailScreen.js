//전역 선언 방법 찾아보기
import React, {useContext, useState} from 'react';
import {Button, StyleSheet, TextInput, TouchableOpacity, View, Alert, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {useIsSignedIn} from '../../contexts/SignedInContextProvider';
import ScreenContainer from '../../components/ScreenContainer';
import ScreenContainerView from '../../components/ScreenContainerView';
import NavigationTop from '../../components/NavigationTop';
import AppText from '../../components/AppText';

import * as SecureStore from 'expo-secure-store';
import {useToken} from '../../contexts/TokenContextProvider';

const SignInEmailScreen = ({appNavigation, navigation}) => {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [isSignedIn, setIsSignedIn] = useIsSignedIn();
    const [showPassword, setShowPassword] = useState(true);
    const [token, setToken] = useToken();

    const {colors} = useTheme();

    const styles = StyleSheet.create({
        button: {
            left: 312,
            width: 67,
            height: 24,
            fontWeight: 'normal',
            top: 44,
        },
        loginText: {
            color: colors.defaultColor,
            textAlign: 'center',
            padding: 14,
            fontSize: 16,
            fontWeight: 'bold'
        },
        password_box: {
            borderBottomWidth: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 11
        },
    });

    const signIn = async () => {
        try {
            fetch('http://34.64.185.40/auth/loginJWT', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password
                    }
                })
            }).then(res => res.json())
                .then(async (response) => {
                    switch (response.status) {
                    case 'NOT EXIST' :
                        Alert.alert('', '가입되지 않은 이메일입니다.');
                        break;
                    case 'NOT MATCHED' :
                        Alert.alert('', '비밀번호가 올바르지 않습니다.');
                        break;
                    case 'OK' :
                        await SecureStore.setItemAsync('accessToken', response.accessToken);
                        setToken(response.accessToken);
                        setIsSignedIn(true);
                        break;
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <ScreenContainer backgroundColor={colors.backgroundColor}>
            <NavigationTop navigation={navigation}/>
            <ScreenContainerView>
                <View style={{marginTop: 60}}>
                    <View>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>나만의 <AppText
                            style={{fontSize: 28, color: colors.mainColor, fontWeight: 'bold'}}>공간
                            보관함</AppText>을</AppText>
                        <AppText style={{fontSize: 28, color: colors.mainColor}}>채워볼까요?</AppText>
                    </View>
                    <TextInput style={{
                        marginTop: 38,
                        fontSize: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.gray[5],
                        marginBottom: 16,
                        paddingBottom: 11,
                        color: colors.mainColor
                    }}
                    placeholder="이메일 주소를 입력해주세요"
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                    />
                    <View style={{marginBottom: 27}}>
                        <View flexDirection="row" style={{...styles.password_box, borderColor: colors.gray[5]}}>
                            <TextInput flex={1} style={{fontSize: 16, color: colors.mainColor}}
                                autoCorrect={false}
                                placeholder="비밀번호를 입력해주세요" secureTextEntry={showPassword}
                                onChangeText={(text) => setPassword(text)}
                                autoCapitalize="none"
                                placeholderTextColor={colors.gray[5]}/>
                            <Pressable style={{marginLeft: 5}} onPress={() => {
                                setShowPassword(!showPassword);
                            }}>
                                {
                                    showPassword ?
                                        <Icon style={{marginTop: 3, marginRight: 5}} name={'eye'} type="ionicon"
                                            size={18} color={colors.gray[9]}></Icon>
                                        :
                                        <Icon style={{marginTop: 3, marginRight: 5}} name={'eye-off'} type="ionicon"
                                            size={18} color={colors.gray[9]}></Icon>
                                }
                            </Pressable>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[{
                            height: 52,
                            borderRadius: 10,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }, email && password ? {backgroundColor: colors.mainColor} : {backgroundColor: colors.gray[6]}]}
                        disabled={email && password ? false : true}
                        onPress={() => signIn()}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.loginText}>로그인</AppText>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 24, alignSelf: 'center'}}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpEmail')} style={{marginRight: 29}} activeOpacity={0.8}>
                            <AppText>회원가입</AppText>
                        </TouchableOpacity>
                        <AppText style={{marginRight: 29, color: colors.gray[8]}}>|</AppText>
                        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} activeOpacity={0.8}>
                            <AppText>비밀번호 재설정</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainerView>
        </ScreenContainer>
    );
};

export default SignInEmailScreen;