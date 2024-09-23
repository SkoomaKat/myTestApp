import {Platform, StyleSheet} from "react-native";

export const isWeb = Platform.OS == 'web';
export const CUR_NODE = "CUR_NODE";
export const CUR_CHAPTER = "CUR_CHAPTER";
export const STORY_STACK = "STORY_STACK";


export const storyScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    navbar: {
        marginTop: 60,
        width: '100%',
        position:'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    navbarButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 5,
        width: 75,
        height: 75
    },
    navbarButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    storyBox: {
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    storyBoxContent: {
        alignItems: "center",
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        flexGrow: 1,
    },
    storyText: {
        color: '#3b3b3b',
        shadowOpacity: 0.2,
        fontSize: isWeb ? 18 : 16,
    },
    latestStoryText: {
        color: 'black',
        shadowOpacity: 0.2,
        fontSize: isWeb ? 18 : 16,
    },
    oldPage: {
        resizeMode: 'cover',
        minWidth: isWeb ? "70%" : "85%",
        maxWidth: isWeb ? "70%" : "85%",
        marginTop: 1,
        padding: '5%'
    },
    latestPage: {
        resizeMode: 'cover',
        marginTop: 5,
        maxWidth: isWeb ? "75%" : "90%",
        marginBottom: isWeb ? 20 : 10,
        padding: '5%'
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 100,
        paddingTop: '5%',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    button: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 5,
        minWidth: isWeb ? '80%' : '90%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        color: 'black',
        fontSize: isWeb ? 18 : 16,
        fontWeight: 'bold',
    },
    inlineImage: {
        resizeMode: 'cover',
        alignContent: 'center',
        marginTop: 1,
        minWidth: isWeb ? "70%" : "85%",
        maxWidth: isWeb ? "70%" : "85%",
        maxHeight: "60%",
    },
});