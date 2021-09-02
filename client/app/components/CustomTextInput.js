import React from "react";
import {TextInput} from "react-native";

// ** 비밀번호 input box 를 제외한 나머지 input component
// ** autoCapitalize 와 autoCorrect 를 끈 TextInput 입니다.

const CustomTextInput = (props) => {
    return (
        <TextInput style={props.style}
                   placeholder={props.placeholder}
                   onChangeText={props.onChangeText}
                   autoCapitalize="none"
                   autoCorrect={false}
                   onFocus={props.onFocus}
        >
            {props.children}
        </TextInput>
    )
}

export default CustomTextInput;