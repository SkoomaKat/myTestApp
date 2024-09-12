import {Platform, StyleSheet} from "react-native";

export const isWeb = Platform.OS == 'web';
export const PROFILE = "profile1"
export const CUR_NODE = "CUR_NODE";


export const storyScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '5%', // Adjust for phone margins
        paddingHorizontal: 20,
        backgroundColor: 'black',
    },
    storyBox: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: 'transparent',
    },
    storyBoxContent: {
        alignItems: "center",
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        flexGrow: 1,
    },
    storyText: {
        color: '#d4d4d4',
        fontSize: isWeb ? 18 : 16,
        marginBottom: isWeb ? 20 : 10,
        width: isWeb ? "70%" : "85%",
    },
    latestStoryText: {
        color: 'white',
        fontSize: isWeb ? 18 : 16,
        marginBottom: isWeb ? 20 : 10,
        width: isWeb ? "75%" : "90%",
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
        backgroundColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 5,
        minWidth: isWeb ? '80%' : '90%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        color: 'white',
        fontSize: isWeb ? 18 : 16,
        fontWeight: 'bold',
    },
    inlineImage: {
        resizeMode: "contain",
        alignContent: 'center',
        maxWidth: '90%',
        maxHeight: "60%",
    },
});