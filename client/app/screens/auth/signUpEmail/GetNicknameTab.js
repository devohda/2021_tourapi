import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, Alert} from 'react-native';
import styled from 'styled-components/native';
import AppText from '../../../components/AppText';
import { useTheme } from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';

const ProgressBar = styled(View)`
  flexDirection: row;
  width: 100%;
  justify-content: flex-end;
  height: 8px;
`;

const Form = styled(View)`
  margin-top: 63px;
`;

const InputBox = styled(TextInput)`
  fontSize: 16px;
  borderBottomWidth: 1px;
  borderBottomColor: #C5C5C5;
  marginBottom: 27px;
  paddingBottom: 11px;
`;

const signUp = async (user_email, user_password, user_nickname) => {
    try {
        let url = 'http://34.64.185.40/auth/account';
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
        const result = await fetch(url, options)
            .then(res => res.json())
            .then(response => {
                return response.code === 200;
            })
            .catch(error => console.log(error));

        return result;
    } catch (e) {
        console.log(e.toString());
    }
};

const GetNicknameTab = ({route, navigation}) => {
    const {email, password} = route.params;
    const [isValid, setIsValid] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isNicknameDuplicated, setIsNicknameDuplicated] = useState(false);
    const { colors } = useTheme();
    const [color, setColor] = useState(colors.gray[5]);
    const patterns = /[~!@#$%^&*()_+|<>?:{}]/;

    const findSameNickname = async (nickname) => {
        try {
            const result = await fetch('http://34.64.185.40/auth/sameNickname', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nickname})
            }).then(res => res.json())
                .then(response => {
                    setIsNicknameDuplicated(response.data.isDuplicated === true);
                    return response.data.isDuplicated === true;
                })
                .catch(error => console.log(error));
            return result;
        } catch (err) {
            console.error(err);
        }
    };

    const checkIsValid = async () => {
        if(isNicknameDuplicated) {
            Alert.alert('', '?????? ?????? ?????? ??????????????????.');
        } else {
            navigation.navigate('keywordTab', {email, password, nickname})
        }
    };

    const styles = StyleSheet.create({
        progress: {
            height: 8,
            borderRadius: 6,
            top: 0,
            marginLeft: 12,
        },
        progress_active: {
            width: 28,
            backgroundColor: colors.mainColor
        },
        progress_inactive: {
            width: 8,
            backgroundColor: colors.gray[5]
        },
        title_text: {
            fontSize: 30,
            color: colors.mainColor,
            lineHeight: 44,
        },
        continue_btn: {
            backgroundColor: nickname && nickname.length <= 12 && !patterns.test(nickname) ? colors.mainColor : colors.gray[6],
            height: 48,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

    return (
        <>
            <View flex={1}>
                <ProgressBar>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                    <View style={{...styles.progress, ...styles.progress_active}}></View>
                    <View style={{...styles.progress, ...styles.progress_inactive}}></View>
                </ProgressBar>
                <Form>
                    <View>
                        <AppText style={styles.title_text}><AppText
                            style={{fontWeight: 'bold'}}>?????????</AppText><AppText>???</AppText></AppText>
                        <AppText style={styles.title_text}>??????????????????</AppText>
                    </View>
                    <CustomTextInput
                        placeholder="??????, ??????, ?????? ?????? ??????(?????? ?????? 12??? ??????)"
                        autoCapitalize="none"
                        style={{
                            marginTop : 40,
                            fontSize: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: color,
                            marginBottom: 6,
                            paddingBottom: 11
                        }}
                        onChangeText={async (text) => {
                            await findSameNickname(text);
                            if(text.length > 12) {
                                setColor(colors.red[2]);
                            }

                            if(patterns.test(text)) {
                                setColor(colors.red[2]);
                            }

                            if(text === '') setColor(colors.gray[5]);
                            if(text.length <= 12 && !patterns.test(text)){
                                setColor(colors.gray[5]);
                            } 
                            setNickname(text);
                        }}
                    />
                    <AppText style={{color: colors.red[2],
                        display: nickname && nickname.length > 12 ? 'flex' : 'none'
                    }}>
                        ???????????? ?????? ?????????. (?????? ?????? 12??? ??????)
                    </AppText>
                    <AppText style={{color: colors.red[2],
                        display: nickname && patterns.test(nickname) ? 'flex' : 'none'
                    }}>
                        ??????????????? ????????? ??? ?????????.
                    </AppText>
                </Form>
            </View>
            <View style={{marginBottom: 20}}>
                <TouchableOpacity
                    style={styles.continue_btn}
                    onPress={() => checkIsValid()}
                    disabled={nickname && nickname.length <= 12 && !patterns.test(nickname) ? false : true}
                    activeOpacity={0.8}
                >
                    <AppText style={{color: colors.defaultColor, fontSize: 16, fontWeight: 'bold'}}>????????????</AppText>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default GetNicknameTab;