import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/src/components/Themed';
import { StoryNodeFactory } from '@/src/factory/StoryNodeFactory';
import { StoryNodeTracker } from "@/src/StoryNodeTracker";

const initialNode = StoryNodeFactory.getStoryNodeById('cave');
const nodeTracker = new StoryNodeTracker(initialNode);

export default function StoryScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [storyStack, setStoryStack] = useState<string[]>(nodeTracker.nodeTexts);

    useEffect(() => {
        scrollToBottom(); // Ensure we scroll to the bottom after loading the initial node
    }, []);

    const handleBranchClick = (branchIndex: number) => {
        const currentNode = nodeTracker.currentNode;
        const selectedBranch = currentNode.nodeBranches[branchIndex];

        if (selectedBranch) {
            const nextNode = selectedBranch.node;
            if (nextNode) {
                nodeTracker.addNode(nextNode);
                setStoryStack([...nodeTracker.nodeTexts]);
                scrollToBottom(); // Scroll to the bottom after updating the stack
            }
        }
    };

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.storyBox}
                contentContainerStyle={styles.storyBoxContent}
                ref={scrollViewRef} // Attach the ref to the ScrollView
            >
                {storyStack.map((text, index) => (
                    <Text key={index} style={styles.storyText}>{text}</Text>
                ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
                {nodeTracker.currentNode && nodeTracker.currentNode.nodeBranches.length > 0 ? (
                    nodeTracker.currentNode.nodeBranches.map((branch, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={() => handleBranchClick(index)}
                        >
                            <Text style={styles.buttonText}>{branch.prompt}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.storyText}>No options available</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: '5%', // Adjust for phone margins
        paddingHorizontal: 20,
        backgroundColor: 'black',
    },
    storyBox: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: '30%',
        backgroundColor: 'transparent',
    },
    storyBoxContent: {
        justifyContent: 'flex-end', // Push content to the bottom
        flexGrow: 1,
        backgroundColor: 'transparent',
    },
    storyText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '20%',
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
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
