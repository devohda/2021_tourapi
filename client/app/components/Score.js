import React from "react";
import {View, Text} from "react-native";
import AppText from "./AppText";

const Score = (props) => {
    return (
        <View style={{marginVertical: 8, alignItems: 'center'}}>
            <View width={70}>
                <AppText style={{
                    fontWeight: 'bold',
                    fontSize: props.fontSize,
                    color: props.color,
                    textAlign: props.textAlign,
                    marginBottom: props.marginBottom,
                    color: props.textColor,
                }}>{props.name}</AppText>
            </View>
            {props.children}
        </View>
    )
}

export default Score;