import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TextOverlayProps {
    defaultText: string;
    onCancel: (text: string) => void;
    onSubmit: (text: string) => void;
}

const TextOverlay = ({ defaultText, onCancel, onSubmit }: TextOverlayProps) => {
    const [text, setText] = useState(defaultText);
    const insets = useSafeAreaInsets(); // For padding adjustments

    return (
        <Modal transparent={true} animationType="fade">
            <View style={[styles.modalBackground, { paddingBottom: insets.bottom }]}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        multiline
                        textAlignVertical="top"
                        value={text}
                        onChangeText={setText}
                        placeholder="Type your text here"
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={() => onCancel(defaultText)} />
                        <Button title="Submit" onPress={() => onSubmit(text)} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10,
    },
    textInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default TextOverlay;
