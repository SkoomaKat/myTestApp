import {StyleSheet} from "react-native";
import {
    branchContainerHeight,
    branchContainerWidth,
    nodeContainerHeight
} from "@/src/app/Editor/components/constants";

export const editorStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        width: '100%',
        height: '100%',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: "none",
    },
    node: {
        position: 'absolute',
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 14,
        minWidth: 300,
        maxWidth: 600,
        minHeight: nodeContainerHeight,
        alignItems: 'flex-start',
        borderStyle: "solid",
        borderWidth: 1
    },
    branchContainer: {
        height: branchContainerHeight,
        position: 'absolute',
        flexDirection: 'column',
        width: branchContainerWidth,
        alignItems: 'flex-start',
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "black",
    },
    deleteButton: {
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%',
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12,
    },
    storyText: {
        color: 'black',
        fontSize: 14,
    },
    branchPrompt: {
        color: 'black',
        fontSize: 14,
        marginTop: 5,
    },
    editableField: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 14,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
});