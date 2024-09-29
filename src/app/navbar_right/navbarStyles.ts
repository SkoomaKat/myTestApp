import {StyleSheet} from "react-native";

export const navbarStyles = StyleSheet.create({
    greyedOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        zIndex: 1,
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
    }
});