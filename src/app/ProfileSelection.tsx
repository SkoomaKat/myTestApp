import React, {useEffect, useState} from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '@/src/components/Themed';
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {Persistence, Profile} from "@/src/persistance/Persistence";
import {router, useNavigation} from "expo-router";

export default function ProfileSelection() {
    const [deleteSelected, setdeleteSelected] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                color: 'transparent'
            },
            headerShown: false
        });
    }, [navigation]);

    const getDeleteButton = () => {
        const deleteButtonStyle = {
            ...profileSelectionStyles.deleteButton,
            backgroundColor: deleteSelected ? 'gold' : 'gray'
        }

        const deleteText = deleteSelected ?
            <Text>WARN - DELETING</Text> :
            <Text>Select to Delete</Text>;

        return (
            <TouchableOpacity style={deleteButtonStyle} onPress={() => {
                setdeleteSelected(!deleteSelected);
            }}>
                {deleteText}
            </TouchableOpacity>
        )
    }

    const onPressProfile = async (profile: Profile) => {
        const curProfile = Persistence.cur_profile;
        Persistence.setProfile(profile);
        await Persistence.loadGame()

        if (deleteSelected) {
            Persistence.delete_profile();
            Persistence.setProfile(curProfile);
            setdeleteSelected(!deleteSelected);
        } else {
            router.replace('/');
        }
    }

    return (
        <View style={profileSelectionStyles.profile_page_container}>

            <View style={profileSelectionStyles.delete_button_container}>
                {getDeleteButton()}
            </View>

            <View style={profileSelectionStyles.profile_container}>

                <View style={profileSelectionStyles.profile_row}>
                    <TouchableOpacity style={profileSelectionStyles.navbarButton} onPress={() => {
                        onPressProfile(Profile.P1)
                    }}>
                        <ImageBackground source={StoryImageFactory.getStoryImage('PROFILE')}
                                         style={profileSelectionStyles.imageBackground}>
                            <Text style={profileSelectionStyles.navbarButtonText}>Profile 1</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={profileSelectionStyles.navbarButton} onPress={() => {
                        onPressProfile(Profile.P2)
                    }}>
                        <ImageBackground source={StoryImageFactory.getStoryImage('PROFILE')}
                                         style={profileSelectionStyles.imageBackground}>
                            <Text style={profileSelectionStyles.navbarButtonText}>Profile 2</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <View style={profileSelectionStyles.profile_row}>
                    <TouchableOpacity style={profileSelectionStyles.navbarButton} onPress={() => {
                        onPressProfile(Profile.P3)
                    }}>
                        <ImageBackground source={StoryImageFactory.getStoryImage('PROFILE')}
                                         style={profileSelectionStyles.imageBackground}>
                            <Text style={profileSelectionStyles.navbarButtonText}>Profile 3</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={profileSelectionStyles.navbarButton} onPress={() => {
                        onPressProfile(Profile.P4)
                    }}>
                        <ImageBackground source={StoryImageFactory.getStoryImage('PROFILE')}
                                         style={profileSelectionStyles.imageBackground}>
                            <Text style={profileSelectionStyles.navbarButtonText}>Profile 4</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const profileSelectionStyles = StyleSheet.create({
    profile_page_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
    },
    delete_button_container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    profile_container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
    },
    deleteButton: {
        borderWidth: 1,
        borderRadius: 5,
        color: 'gold',
        margin: 10,
        padding: 10,
        overflow: 'hidden',
    },
    profile_row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    navbarButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    navbarButtonText: {
        textAlign: 'center',
        textShadowColor: 'black',
        shadowOpacity: 1,
        color: 'white',
        fontWeight: 'bold',
    },
    imageBackground: {
        resizeMode: 'stretch',
        objectFit: 'fill',
        justifyContent: 'center',
        width: 100,
        height: 100,
    },
})
