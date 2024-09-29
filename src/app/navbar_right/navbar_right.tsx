import {ImageBackground, ImageSourcePropType, TouchableOpacity, View} from "react-native";
import {Text} from "@/src/components/Themed";
import React from "react";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {router} from "expo-router";
import {navbarStyles} from "@/src/app/navbar_right/navbarStyles";


export enum StoryPage {
    MAIN_MENU,
    STORY_SCREEN,
    MAP_SCREEN
}

export const NavbarRight = ({storyPage, toggleSelected, toggleSetter}: {
    storyPage: StoryPage;
    toggleSelected: boolean;
    toggleSetter: () => void;
}) => {
    let buttons = [];

    buttons.push(
        <NavbarButton
            key={buttons.length}
            source={StoryImageFactory.getStoryImage('OPTIONS_LINES')}
            onPress={toggleSetter}
            buttonStyle={navbarStyles.optionsButton}
        ></NavbarButton>
    )

    buttons.push(
        <NavbarButton
            key={buttons.length}
            buttonText={'~ Main Menu ~'}
            onPress={() => router.replace('/')}
            buttonStyle={navbarStyles.navbarButton}
            condition={toggleSelected}
        ></NavbarButton>
    )

    if (storyPage == StoryPage.STORY_SCREEN) buttons.push(
        <NavbarButton
            key={buttons.length}
            buttonText={'~        Map        ~'}
            onPress={() => {
                toggleSetter();
                router.navigate('/MapScreen')
            }}
            buttonStyle={navbarStyles.navbarButton}
            condition={toggleSelected}
        ></NavbarButton>
    )

    if (storyPage == StoryPage.MAP_SCREEN) buttons.push(
        <NavbarButton
            key={buttons.length}
            buttonText={'~    Story View    ~'}
            onPress={() => router.navigate('/StoryScreen')}
            buttonStyle={navbarStyles.navbarButton}
            condition={toggleSelected}
        ></NavbarButton>
    )

    return (
        <View style={navbarStyles.navbarContainer}>
            <View style={{
                ...navbarStyles.navbarBackground,
                backgroundColor: toggleSelected ? 'black' : 'transparent',
                borderColor: 'gray',
                borderLeftWidth: toggleSelected ? 1 : 0,
            }}>
                <View style={navbarStyles.navbar}>
                    {[...buttons]}
                </View>
            </View>
        </View>
    )
}

const NavbarButton = ({source, buttonText, onPress, condition, buttonStyle}: {
    source?: ImageSourcePropType;
    buttonText?: string;
    onPress: () => void;
    condition?: boolean;
    buttonStyle: any;
}) => {
    if (condition || condition === undefined) {
        if (source != undefined) {
            return (
                <ImageBackground
                    source={source}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'visible'
                    }}
                    resizeMode='contain'
                >
                    <TouchableOpacity
                        style={buttonStyle}
                        onPress={onPress}
                    >
                    </TouchableOpacity>
                </ImageBackground>
            )
        } else if (buttonText != undefined) {
            return (
                <TouchableOpacity
                    style={buttonStyle}
                    onPress={onPress}
                ><Text style={navbarStyles.navbarButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            )
        }
    }
    return;
};