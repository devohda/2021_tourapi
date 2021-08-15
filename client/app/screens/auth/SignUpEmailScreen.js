import React, {useState, useEffect} from 'react';
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';

// 네비게이션
const Stack = createStackNavigator()
const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'transparent'
    },
};

import AuthTab from "../../components/AuthTab";

const styles = StyleSheet.create({
    yellowRect: {
        width: 28,
        height: 8,
        backgroundColor: '#fff0B4',
        borderRadius: 6,
        top: 0,
        marginLeft: 12,
    },
    grayRect: {
        width: 8,
        height: 8,
        backgroundColor: '#dcdcdc',
        borderRadius: 6,
        top: 0,
        marginLeft: 12,
    },
    button: {
        left: 300,
        width: 67,
        height: 24,
        fontWeight: 'normal',
        backgroundColor: '#fff',
        borderColor: '#fff',
        top: 44,
        flexDirection: 'row'
    },
    container: {
        margin: 10,
        fontSize: 28,
        fontWeight: "400",
        top: 36,
        left: 16,
        width: 343,
    },
    textInput: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        marginBottom: 27,
        paddingBottom: 11
    }
});

const tabData = {
    btnStyles: [
        [styles.yellowRect, styles.grayRect, styles.grayRect],
        [styles.grayRect, styles.yellowRect, styles.grayRect],
        [styles.grayRect, styles.grayRect, styles.yellowRect],
    ],
    question: ['이메일', '비밀번호', '닉네임'],
    placeHolder: ['hiddenJewel@gmail.com', '대/소문자 및 숫자 포함 8자리 이상', '2자 이상 10자 미만으로 한글, 영문 대소문자 가능'],
    nextBtnText: ['계속하기', '계속하기', '회원가입']
}

const getTabData = (num) => {
    return {
        btnStyles: tabData.btnStyles[num],
        question: tabData.question[num],
        placeHolder: tabData.placeHolder[num],
        nextBtnText: tabData.nextBtnText[num]
    }
}


const signUp = async (user_email, user_password, user_nickname) => {
    try {
        let url = 'http://localhost:3000/auth/makeAccount';
        let options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                userInfo: {
                    user_email,
                    user_password,
                    user_nickname
                }
            })
        };
        let response = await fetch(url, options);
        let responseOK = response && response.ok;
        if (responseOK) {
            let data = await response.json();
            alert(data)
        }
    } catch (e) {
        console.log(e.toString())
    }
}

const CompletedTab = ({navigation, data}) => {
    return (
        <>
            <View style={styles.button}></View>
            <View style={styles.container}>
                <Text style={{fontSize: 26, lineHeight: 45}}>
                    <Text><Text style={{fontWeight: "bold"}}>회원가입</Text><Text>이 완료되었습니다!</Text></Text>
                    <Text>{"\n"}히든쥬얼을 마음껏 즐겨보세요.</Text>
                </Text>
                <Text style={{
                    fontSize: 16,
                    marginTop: 67,
                    marginBottom: 12
                }}></Text>
                {/* {data.email + data.password + data.nickname} */}
                <TextInput style={{fontSize: 16, marginBottom: 27, paddingBottom: 11}}/>
            </View>
            <TouchableOpacity
                style={{backgroundColor: '#DCDCDC', height: 52, borderRadius: 10, margin: 16, marginTop: 293}}
                onPress={() => {
                    signUp(data.email, data.password, data.nickname)
                    navigation.navigate('SignIn')
                }}><Text
                style={{textAlign: 'center', padding: 14, fontSize: 16, color: '#fff', fontWeight: 'bold'}}>로그인 화면으로
                돌아가기</Text>
            </TouchableOpacity>
        </>
    )
}

const SignUpEmailScreen = (props) => {
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [nickname, setNickname] = useState(null)

    const FirstTab = AuthTab(getTabData(0), setStep, setEmail, email)
    const SecondTab = AuthTab(getTabData(1), setStep, setPassword, password)
    const ThirdTab = AuthTab(getTabData(2), setStep, setNickname, nickname)

    const tab = [FirstTab, SecondTab, ThirdTab]

    return (
        <>
            {step < 3 ?
                tab[step] :
                <CompletedTab navigation={props.navigation} data={{email, password, nickname}}/>
            }
        </>
    );
};

export default SignUpEmailScreen;
