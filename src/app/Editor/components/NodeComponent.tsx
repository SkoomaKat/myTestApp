import React from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, StyleSheet } from 'react-native';
import EditableField from "@/src/app/Editor/components/EditableField";
import BranchComponent from "@/src/app/Editor/components/BranchComponent";

interface Branch {
    linkedNodeId: string;
    storyPrompt: string;
}

interface NodeProps {
    node: {
        id: string;
        storyText: string;
        storyImageId?: string;
        nodeBranches: Branch[];
        x: number;
        y: number;
    };
    panHandlers: any;
    editingNode: string | null;
    fieldBeingEdited: { nodeId: string, branchIndex?: number, field: string } | null;
    handleFieldChange: (nodeId: string, newValue: string, field: string, branchIndex?: number) => void;
    handleDoubleClick: (nodeId: string, field: string, branchIndex?: number) => void;
    handleDeleteNode: (nodeId: string) => void;
    handleDeleteBranch: (nodeId: string, branchIndex: number) => void;
    handleBlur: () => void;
}

const NodeComponent: React.FC<NodeProps> = ({
                                                node, panHandlers, editingNode, fieldBeingEdited, handleFieldChange, handleDoubleClick, handleDeleteNode, handleDeleteBranch, handleBlur
                                            }) => {
    return (
        <View style={[styles.node, { left: node.x, top: node.y }]} {...panHandlers}>
            {/* Delete Node Button */}
            <TouchableOpacity onPress={() => handleDeleteNode(node.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>

            {/* Editable NodeId */}
            <EditableField
                fieldValue={node.id}
                fieldName="id"
                editingNode={editingNode}
                fieldBeingEdited={fieldBeingEdited}
                nodeId={node.id}
                handleFieldChange={handleFieldChange}
                handleDoubleClick={handleDoubleClick}
                handleBlur={handleBlur}
            />

            {/* Editable ImageId */}
            <EditableField
                fieldValue={node.storyImageId || ''}
                fieldName="storyImageId"
                editingNode={editingNode}
                fieldBeingEdited={fieldBeingEdited}
                nodeId={node.id}
                handleFieldChange={handleFieldChange}
                handleDoubleClick={handleDoubleClick}
                handleBlur={handleBlur}
            />

            {/* Editable StoryText */}
            <EditableField
                fieldValue={node.storyText}
                fieldName="storyText"
                editingNode={editingNode}
                fieldBeingEdited={fieldBeingEdited}
                nodeId={node.id}
                handleFieldChange={handleFieldChange}
                handleDoubleClick={handleDoubleClick}
                handleBlur={handleBlur}
            />

            {/* Render Branches */}
            {node.nodeBranches.map((branch, index) => (
                <BranchComponent
                    key={index}
                    branch={branch}
                    index={index}
                    nodeId={node.id}
                    editingNode={editingNode}
                    fieldBeingEdited={fieldBeingEdited}
                    handleFieldChange={handleFieldChange}
                    handleDoubleClick={handleDoubleClick}
                    handleDeleteBranch={handleDeleteBranch}
                    handleBlur={handleBlur}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    node: {
        position: 'absolute',
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        minWidth: 300,
        maxWidth: 600,
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
});

export default NodeComponent;
