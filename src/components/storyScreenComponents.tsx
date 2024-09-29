import {ImageBackground, TouchableOpacity, View} from "react-native";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {isWeb, storyScreenStyles} from "@/src/app/storyScreenConstants";
import {Text} from "@/src/components/Themed";
import React from "react";

type StoryButtonProps = {
    buttonIndex: number;
    buttonText: string;
    isOptionsSelected: boolean;
    onPress: () => void;
}

export function StoryButton(props: StoryButtonProps) {
    return <View key={props.buttonIndex}
                 style={{
                     alignItems: 'center',
                     justifyContent: 'center',
                     alignContent: 'center',
                     overflow: 'visible',
                     height: 50,
                     width: '80%'
                 }}
    >
        <ImageBackground
            key={props.buttonIndex}
            source={StoryImageFactory.getStoryImage('BUTTON_1')}
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                overflow: 'visible',
                height: '100%',
                width: '100%'
            }}
            resizeMode='stretch'
        >
            <TouchableOpacity style={storyScreenStyles.button}
                              activeOpacity={props.isOptionsSelected ? 1 : 0.2}
                              onPress={props.onPress}>
                <Text style={storyScreenStyles.buttonText}>{props.buttonText}</Text>
            </TouchableOpacity>
        </ImageBackground>
    </View>
}