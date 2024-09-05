import React from 'react';
import { Text, TextInput, TouchableWithoutFeedback, StyleSheet } from 'react-native';

interface EditableFieldProps {
    fieldValue: string;
    fieldName: string;
    editingNode: string | null;
    fieldBeingEdited: { nodeId: string, branchIndex?: number, field: string } | null;
    nodeId: string;
    branchIndex?: number;
    handleFieldChange: (nodeId: string, newValue: string, field: string, branchIndex?: number) => void;
    handleDoubleClick: (nodeId: string, field: string, branchIndex?: number) => void;
    handleBlur: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
                                                         fieldValue, fieldName, editingNode, fieldBeingEdited, nodeId, branchIndex, handleFieldChange, handleDoubleClick, handleBlur
                                                     }) => {
    return (
        <TouchableWithoutFeedback onPress={() => handleDoubleClick(nodeId, fieldName, branchIndex)} delayLongPress={300}>
            {editingNode === nodeId && fieldBeingEdited?.field === fieldName && fieldBeingEdited?.branchIndex === branchIndex ? (
                <TextInput
                    style={styles.editableField}
                    value={fieldValue}
                    onChangeText={(text) => handleFieldChange(nodeId, text, fieldName, branchIndex)}
                    onBlur={handleBlur}
                />
            ) : (
                <Text style={styles.text}>{fieldName}: {fieldValue}</Text>
            )}
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    editableField: {
        backgroundColor: 'white',
        color: 'black',
        fontSize: 14,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    text: {
        color: 'black',
        fontSize: 14,
    },
});

export default EditableField;
