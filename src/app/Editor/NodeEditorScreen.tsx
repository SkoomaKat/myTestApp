import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    PanResponder,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView, Platform
} from 'react-native';
import { Text, View } from '@/src/components/Themed';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface StoryBranch {
    linkedNodeId: string;
    storyPrompt: string;
}

interface Node {
    id: string;
    storyText: string;
    storyImageId?: string;
    nodeBranches: StoryBranch[];
    x: number;
    y: number;
}

export default function NodeEditorScreen() {
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: 'cave',
            storyText: 'You find yourself at the cave entrance.',
            storyImageId: 'caveImage', // Optional image ID
            nodeBranches: [
                { linkedNodeId: 'forest', storyPrompt: 'Go to the forest' },
                { linkedNodeId: 'caveInterior', storyPrompt: 'Enter the cave' }
            ],
            x: 100,
            y: 100,
        },
        {
            id: 'forest',
            storyText: 'You are in a dark forest.',
            storyImageId: 'forestImage',
            nodeBranches: [
                { linkedNodeId: 'cave', storyPrompt: 'Return to the cave' }
            ],
            x: 300,
            y: 200,
        },
    ]);

    const [editingNode, setEditingNode] = useState<string | null>(null); // Track node being edited
    const [fieldBeingEdited, setFieldBeingEdited] = useState<{ nodeId: string, branchIndex?: number, field: string } | null>(null); // Track which field is being edited

    const handleFieldChange = (nodeId: string, newValue: string, field: string, branchIndex?: number) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === nodeId) {
                    if (branchIndex !== undefined) {
                        const updatedBranches = node.nodeBranches.map((branch, index) =>
                            index === branchIndex ? { ...branch, [field]: newValue } : branch
                        );
                        return { ...node, nodeBranches: updatedBranches };
                    } else {
                        return { ...node, [field]: newValue };
                    }
                }
                return node;
            })
        );
    };

    const handleDeleteBranch = (nodeId: string, branchIndex: number) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === nodeId) {
                    const updatedBranches = node.nodeBranches.filter((_, index) => index !== branchIndex);
                    return { ...node, nodeBranches: updatedBranches };
                }
                return node;
            })
        );
    };

    const handleDeleteNode = (nodeId: string) => {
        setNodes((prevNodes) =>
            prevNodes.filter((node) => {
                return node.id !== nodeId;
            })
        );
    };

    const panResponder = (nodeId: string) =>
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                setNodes((prevNodes) =>
                    prevNodes.map((node) =>
                        node.id === nodeId
                            ? { ...node, x: node.x + gestureState.dx, y: node.y + gestureState.dy }
                            : node
                    )
                );
            },
        });

    const findNodeById = (id: string) => nodes.find((node) => node.id === id);

    const handleDoubleClick = (nodeId: string, field: string, branchIndex?: number) => {
        setEditingNode(nodeId);
        setFieldBeingEdited({ nodeId, branchIndex, field });
    };

    const handleBlur = () => {
        setEditingNode(null);
        setFieldBeingEdited(null);
    };

    return (
        <ScrollView
            style={styles.container}
            scrollEnabled={true}
            persistentScrollbar={true}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            bounces={true} // Prevents bounce effect on web
            pinchGestureEnabled={Platform.OS !== 'web'} // Disable pinch-zoom for web
            minimumZoomScale={0.5}
            maximumZoomScale={10}
            scrollToOverflowEnabled={true}
            scrollsToTop={false}
        >
            {/* SVG Lines for Branches */}
            <Svg height={height} width={width} style={styles.svg}>
                {nodes.map((node) =>
                    node.nodeBranches.map((branch, index) => {
                        const toNode = findNodeById(branch.linkedNodeId);
                        if (!toNode) return null; // Skip if linked node not found
                        return (
                            <Line
                                key={index}
                                x1={node.x + 50} // Adjust offset for center of the node
                                y1={node.y + 25}
                                x2={toNode.x + 50}
                                y2={toNode.y + 25}
                                stroke="black"
                                strokeWidth="2"
                            />
                        );
                    })
                )}
            </Svg>

            {/* Render Nodes */}
            {nodes.map((node) => (
                <View
                    key={node.id}
                    {...panResponder(node.id).panHandlers}
                    style={[styles.node, { left: node.x, top: node.y }]}
                >
                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={() => handleDeleteNode(node.id)}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                    {/* Double-click to edit NodeId */}
                    <TouchableWithoutFeedback
                        onPress={() => handleDoubleClick(node.id, 'id')}
                        delayLongPress={300}
                    >
                        {editingNode === node.id && fieldBeingEdited?.field === 'id' ? (
                            <TextInput
                                style={styles.editableField}
                                value={node.id}
                                onChangeText={(text) => handleFieldChange(node.id, text, 'id')}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Text style={styles.storyText}>NodeId: {node.id}</Text>
                        )}
                    </TouchableWithoutFeedback>

                    {/* Double-click to edit ImageId */}
                    <TouchableWithoutFeedback
                        onPress={() => handleDoubleClick(node.id, 'storyImageId')}
                        delayLongPress={300}
                    >
                        {editingNode === node.id && fieldBeingEdited?.field === 'storyImageId' ? (
                            <TextInput
                                style={styles.editableField}
                                value={node.storyImageId}
                                onChangeText={(text) => handleFieldChange(node.id, text, 'storyImageId')}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Text style={styles.storyText}>ImageId: {node.storyImageId}</Text>
                        )}
                    </TouchableWithoutFeedback>

                    {/* Double-click to edit StoryText */}
                    <TouchableWithoutFeedback
                        onPress={() => handleDoubleClick(node.id, 'storyText')}
                        delayLongPress={300}
                    >
                        {editingNode === node.id && fieldBeingEdited?.field === 'storyText' ? (
                            <TextInput
                                style={styles.editableField}
                                value={node.storyText}
                                onChangeText={(text) => handleFieldChange(node.id, text, 'storyText')}
                                onBlur={handleBlur}
                            />
                        ) : (
                            <Text style={styles.storyText}>Text: {node.storyText}</Text>
                        )}
                    </TouchableWithoutFeedback>

                    {/* Branches/Prompts */}
                    {node.nodeBranches.map((branch, index) => (
                        <View key={index} style={{ marginTop: 10 }}>
                            <View style={styles.branchContainer}>
                                {/* Delete Button */}
                                <TouchableOpacity
                                    onPress={() => handleDeleteBranch(node.id, index)}
                                    style={styles.deleteButton}
                                ><Text style={styles.deleteButtonText}>X</Text>
                                </TouchableOpacity>

                                <Text style={styles.branchPrompt}>Branch {index + 1}</Text>

                                {/* Double-click to edit storyPrompt */}
                                <TouchableWithoutFeedback
                                    onPress={() => handleDoubleClick(node.id, 'storyPrompt', index)}
                                    delayLongPress={300}
                                >
                                    {editingNode === node.id && fieldBeingEdited?.field === 'storyPrompt' && fieldBeingEdited?.branchIndex === index ? (
                                        <TextInput
                                            style={styles.editableField}
                                            value={branch.storyPrompt}
                                            onChangeText={(text) => handleFieldChange(node.id, text, 'storyPrompt', index)}
                                            onBlur={handleBlur}
                                        />
                                    ) : (
                                        <Text style={styles.branchPrompt}>Text: {branch.storyPrompt}</Text>
                                    )}
                                </TouchableWithoutFeedback>

                                {/* Double-click to edit linkedNodeId */}
                                <TouchableWithoutFeedback
                                    onPress={() => handleDoubleClick(node.id, 'linkedNodeId', index)}
                                    delayLongPress={300}
                                >
                                    {editingNode === node.id && fieldBeingEdited?.field === 'linkedNodeId' && fieldBeingEdited?.branchIndex === index ? (
                                        <TextInput
                                            style={styles.editableField}
                                            value={branch.linkedNodeId}
                                            onChangeText={(text) => handleFieldChange(node.id, text, 'linkedNodeId', index)}
                                            onBlur={handleBlur}
                                        />
                                    ) : (
                                        <Text style={styles.branchPrompt}>LinkedNodeId: {branch.linkedNodeId}</Text>
                                    )}
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    node: {
        position: 'absolute',
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        minWidth: 300,
        maxWidth: 600,
        alignItems: 'flex-start',
    },
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
    storyText: {
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
    },
    branchPrompt: {
        color: 'black',
        marginTop: 5,
        fontSize: 14,
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
