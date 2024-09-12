import {StyleSheet} from "react-native";
import {
    branchContainerHeight,
    branchContainerWidth,
    nodeContainerHeight, nodeContainerWidth
} from "@/src/app/Editor/components/constants";

export const editorStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#333',
        alignItems: 'center',
    },
    navbarButton: {
        padding: 10,
        backgroundColor: '#555',
        borderRadius: 5,
    },
    navbarButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: 'gray'
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
        width: nodeContainerWidth,
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
        overflow: "scroll"
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
    newBranchButton: {
        backgroundColor: 'blue',
        height: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2%',
    },
    newBranchButtonText: {
        color: 'white',
        fontSize: 14,
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