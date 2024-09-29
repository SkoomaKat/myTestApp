import {Platform, StyleSheet} from "react-native";

export const isWeb = Platform.OS == 'web';
export const CUR_NODE = "ISE_CUR_NODE";
export const CUR_CHAPTER = "ISE_CUR_CHAPTER";
export const STORY_STACK = "ISE_STORY_STACK";
export const CUR_MAP = 'ISE_CUR_MAP';
export const IS_MAP_NODE = "ISE_IS_MAP_NODE"


export const storyScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    navbarContainer: {
        pointerEvents: 'box-none',
        height: '100%',
        width: '100%',
        position:'absolute',
        flexDirection: 'row-reverse',
        alignContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    navbarBackground: {
        pointerEvents: 'box-none',
        marginLeft: 'auto',
        flexDirection: 'row',
    },
    navbar: {
        pointerEvents: 'box-none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
        paddingLeft: 25
    },
    optionsButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 5,
        width: 50,
        height: 50,
        paddingBottom: 100
    },
    navbarButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: 'white',
        borderWidth: 0.5,
        borderStyle: 'dotted',
        borderRadius: 5,
        marginBottom: 30,
        width: '100%',
        alignItems: 'center'
    },
    navbarButtonText: {
        color: 'white',
        fontFamily: 'TangerineBold',
        fontSize: 30
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
    noAvailableNodesText: {
        color: 'white',
        fontSize: isWeb ? 24 : 20,
        fontStyle: 'italic',
        marginTop: isWeb ? 24 : 20,
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
        height: '100%',
        alignItems: 'center',
        verticalAlign: 'middle'
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