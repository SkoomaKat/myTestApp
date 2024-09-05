import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import EditableField from "@/src/app/Editor/components/EditableField";

interface BranchProps {
    branch: {
        linkedNodeId: string;
        storyPrompt: string;
    };
    index: number;
    nodeId: string;
    editingNode: string | null;
    fieldBeingEdited: { nodeId: string, branchIndex?: number, field: string } | null;
    handleFieldChange: (nodeId: string, newValue: string, field: string, branchIndex?: number) => void;
    handleDoubleClick: (nodeId: string, field: string, branchIndex?: number) => void;
    handleDeleteBranch: (nodeId: string, branchIndex: number) => void;
    handleBlur: () => void;
}

const BranchComponent: React.FC<BranchProps> = ({
                                                    branch, index, nodeId, editingNode, fieldBeingEdited, handleFieldChange, handleDoubleClick, handleDeleteBranch, handleBlur
                                                }) => {
    return (
        <View style={styles.branchContainer}>
            {/* Delete Branch Button */}
            <TouchableOpacity onPress={() => handleDeleteBranch(nodeId, index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.branchPrompt}>Branch {index + 1}</Text>

            {/* Editable storyPrompt */}
            <EditableField
                fieldValue={branch.storyPrompt}
                fieldName="storyPrompt"
                editingNode={editingNode}
                fieldBeingEdited={fieldBeingEdited}
                nodeId={nodeId}
                branchIndex={index}
                handleFieldChange={handleFieldChange}
                handleDoubleClick={handleDoubleClick}
                handleBlur={handleBlur}
            />

            {/* Editable linkedNodeId */}
            <EditableField
                fieldValue={branch.linkedNodeId}
                fieldName="linkedNodeId"
                editingNode={editingNode}
                fieldBeingEdited={fieldBeingEdited}
                nodeId={nodeId}
                branchIndex={index}
                handleFieldChange={handleFieldChange}
                handleDoubleClick={handleDoubleClick}
                handleBlur={handleBlur}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    branchContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    deleteButton: {
        backgroundColor: 'red',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "2%",
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12,
    },
    branchPrompt: {
        color: 'black',
        marginTop: 5,
        fontSize: 14,
    },
});

export default BranchComponent;
