import React, {useRef, useState} from 'react';
import {
    PanResponder,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView, Platform, Button, Alert
} from 'react-native';
import {Text, View} from '@/src/components/Themed';
import Svg, {Line} from 'react-native-svg';
import {editorStyles} from "@/src/app/Editor/components/editorStyles";
import {
    addBranch,
    deleteBranch,
    deleteNode,
    getNodeHeight,
    updateNodeField,
    updateNodeId
} from "@/src/app/Editor/components/editorUtil";
import {
    branchContainerHeight,
    branchContainerWidth,
    nodeContainerHeight, nodeContainerWidth
} from "@/src/app/Editor/components/constants";
import TextOverlay from "@/src/app/Editor/components/TextOverlay";
import {StoryNodeProps} from "@/src/models/StoryNode";
import {StoryBranchProps} from "@/src/models/StoryBranch";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const {width, height} = Dimensions.get('window');

export interface Node {
    id: string;
    storyText: string;
    storyImageId?: string;
    nodeBranches: StoryBranchProps[];
    x: number;
    y: number;
}

// EditableField component to handle text inputs
const EditableField = ({value, onEdit, onChangeText, isEditing, onBlur, fieldLabel}: {
    value: string;
    onEdit: () => void;
    onChangeText: (text: string) => void;
    isEditing: boolean;
    onBlur: () => void;
    fieldLabel: string;
}) => (
    <TouchableWithoutFeedback onPress={onEdit} delayLongPress={300}>
        {isEditing ? (
            <TextInput style={editorStyles.editableField} value={value} onChangeText={onChangeText} onBlur={onBlur}/>
        ) : (<Text style={editorStyles.storyText}>{`${fieldLabel}: ${value}`}</Text>)}
    </TouchableWithoutFeedback>
);

export default function NodeEditorScreen() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);

    const [editingNode, setEditingNode] = useState<string | null>(null);
    const [fieldBeingEdited, setFieldBeingEdited] = useState<{
        nodeId: string,
        branchIndex?: number,
        field: string
    } | null>(null);
    const [temporaryNodeIds, setTemporaryNodeIds] = useState<{ [key: string]: string }>({}); // Temporary state for nodeId
    const [nodeBeingEdited, setNodeBeingEdited] = useState<string | null>(null);
    const [currentNodeStoryText, setCurrentNodeStoryText] = useState<string>('');
    const [showTextOverlay, setShowTextOverlay] = useState<boolean>(false);


    const panResponder = (nodeId: string) =>
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                setNodes((prevNodes) =>
                    prevNodes.map((node) =>
                        node.id === nodeId
                            ? {...node, x: node.x + gestureState.dx, y: node.y + gestureState.dy}
                            : node
                    )
                );
            },
        });

    const handleEditStoryText = (node: Node) => {
        setNodeBeingEdited(node.id);
        setCurrentNodeStoryText(node.storyText);
        setShowTextOverlay(true);  // Show the text overlay
    };

    const handleCancelEdit = (defaultText: string) => {
        setShowTextOverlay(false);
    };

    const handleSubmitEdit = (newText: string) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === nodeBeingEdited ? {...node, storyText: newText} : node
            )
        );
        setShowTextOverlay(false);
    };

    const handleDoubleClick = (nodeId: string, field: string, branchIndex?: number) => {
        setEditingNode(nodeId);
        setFieldBeingEdited({nodeId, branchIndex, field});

        if (field === 'id') {
            setTemporaryNodeIds((prev) => ({...prev, [nodeId]: nodeId})); // Store temp nodeId for the specific node
        }
    };

    const handleBlur = (nodeId: string, field: string) => {
        if (field === 'id' && temporaryNodeIds[nodeId]) {
            setNodes((prevNodes) => updateNodeId(prevNodes, nodeId, temporaryNodeIds[nodeId]))
        }
        setEditingNode(null);
        setFieldBeingEdited(null);
    };

    const findNodeById = (id: string) => nodes.find((node) => node.id === id);

    function transformNodes(nodes: Node[]): Map<string, StoryNodeProps> {
        const transformedNodes = new Map<string, StoryNodeProps>;

        nodes.forEach(node => {
            const data = {
                storyText: node.storyText,
                storyImageId: node.storyImageId,
                nodeBranches: node.nodeBranches
            }

            transformedNodes.set(node.id, data)
        });

        return transformedNodes;
    }

    const saveGameJson = () => {
        const jsonData = JSON.stringify(Object.fromEntries(transformNodes(nodes)));

        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // Let the user specify the file name
        const fileName = prompt("Enter file name", "nodes.json");
        if (fileName) {
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const saveEditorJson = () => {
        const jsonData = JSON.stringify(nodes);

        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // Let the user specify the file name
        const fileName = prompt("Enter file name", "nodes_edit.json");
        if (fileName) {
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const loadJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newNodes: Node[] = JSON.parse(e.target?.result as string);
                setNodes(newNodes); // Assuming the JSON structure matches the expected nodes format
            } catch (error) {
                Alert.alert('Invalid JSON', 'The file you selected is not a valid JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const handleLoadClick = () => {
        fileInputRef.current?.click(); // Trigger the file input click programmatically
    };

    const maxX = Math.max(...nodes.map(node => node.x + 1000)) + branchContainerWidth;
    const maxY = Math.max(...nodes.map(node => node.y + 1000)) + nodeContainerHeight;

    return (
        <View style={editorStyles.mainContainer}>
            <View style={editorStyles.navbar}>
                <TouchableOpacity style={editorStyles.navbarButton}
                                  onPress={() => saveEditorJson()}>
                    <Text style={editorStyles.navbarButtonText}>Save Editable File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={editorStyles.navbarButton}
                                  onPress={() => saveGameJson()}>
                    <Text style={editorStyles.navbarButtonText}>Save Playable File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={editorStyles.navbarButton}
                                  onPress={() => setNodes((prevNodes) => [...prevNodes,
                                      {
                                          id: `${prevNodes.length}`, storyText: '', nodeBranches: [],
                                          x: prevNodes[prevNodes.length-1].x, y: prevNodes[prevNodes.length-1].y + 150
                                      }])}>
                    <Text style={editorStyles.navbarButtonText}>New Node</Text>
                </TouchableOpacity>
                <TouchableOpacity style={editorStyles.navbarButton} onPress={handleLoadClick}>
                    <Text style={editorStyles.navbarButtonText}>Load</Text>
                </TouchableOpacity>
                {/* Hidden file input for loading JSON */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{display: 'none'}}
                    onChange={loadJsonFile}
                />
            </View>
            <ScrollView
                style={editorStyles.container}
                scrollEnabled={true}
                persistentScrollbar={true}
                showsVerticalScrollIndicator={true}
                bounces={true}
                pinchGestureEnabled={Platform.OS !== 'web'}
            >
                <ScrollView
                    style={editorStyles.container}
                    persistentScrollbar={true}
                    showsHorizontalScrollIndicator={true}
                    scrollEnabled={true}
                    horizontal={true}
                    contentContainerStyle={{
                        width: Math.max(maxX),  // Dynamically set width based on content
                        height: Math.max(maxY),  // Dynamically set height based on content
                    }}
                >
                    {nodes.map((node) => (
                        <View
                            key={node.id}
                            {...panResponder(node.id).panHandlers}
                            style={[editorStyles.node, {left: node.x, top: node.y, height: getNodeHeight(node)}]}
                        >
                            <TouchableOpacity
                                onPress={() => setNodes((prevNodes) => deleteNode(prevNodes, node.id))}
                                style={editorStyles.deleteButton}
                            >
                                <Text style={editorStyles.deleteButtonText}>X</Text>
                            </TouchableOpacity>

                            <EditableField
                                value={temporaryNodeIds[node.id] ?? node.id} // Use tempNodeId if editing, otherwise actual nodeId
                                onEdit={() => handleDoubleClick(node.id, 'id')}
                                onChangeText={(text) => setTemporaryNodeIds((prev) => ({...prev, [node.id]: text}))}
                                isEditing={editingNode === node.id && fieldBeingEdited?.field === 'id'}
                                onBlur={() => handleBlur(node.id, 'id')}
                                fieldLabel="NodeId"
                            />

                            <EditableField
                                value={node.storyImageId || ''}
                                onEdit={() => handleDoubleClick(node.id, 'storyImageId')}
                                onChangeText={(text) => setNodes((prevNodes) => updateNodeField(prevNodes, node.id, text, 'storyImageId'))}
                                isEditing={editingNode === node.id && fieldBeingEdited?.field === 'storyImageId'}
                                onBlur={() => handleBlur(node.id, 'storyImageId')}
                                fieldLabel="ImageId"
                            />


                            {/* Story Text Field with Text Overlay */}
                            <TouchableOpacity onPress={() => handleEditStoryText(node)}>
                                <Text style={editorStyles.storyText}>{`StoryText: \n${node.storyText}`}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setNodes((prevNodes) => addBranch(prevNodes, node.id))}
                                style={editorStyles.newBranchButton}
                            >
                                <Text style={editorStyles.newBranchButtonText}>Add Branch</Text>
                            </TouchableOpacity>


                            {node.nodeBranches.map((branch, index) => (
                                <View
                                    key={index}
                                    style={[
                                        editorStyles.branchContainer,
                                        {top: (index * branchContainerHeight) + nodeContainerHeight},
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => setNodes((prevNodes) => deleteBranch(prevNodes, node.id, index))}
                                        style={editorStyles.deleteButton}
                                    >
                                        <Text style={editorStyles.deleteButtonText}>X</Text>
                                    </TouchableOpacity>

                                    <Text style={editorStyles.branchPrompt}>Branch {index + 1}</Text>

                                    <EditableField
                                        value={branch.condition || ""}
                                        onEdit={() => handleDoubleClick(node.id, 'condition', index)}
                                        onChangeText={(text) =>
                                            setNodes((prevNodes) => updateNodeField(prevNodes, node.id, text, 'condition', index))
                                        }
                                        isEditing={editingNode === node.id && fieldBeingEdited?.field === 'condition' && fieldBeingEdited?.branchIndex === index}
                                        onBlur={() => handleBlur(node.id, 'condition')}
                                        fieldLabel="Condition"
                                    />

                                    <EditableField
                                        value={branch.storyPrompt}
                                        onEdit={() => handleDoubleClick(node.id, 'storyPrompt', index)}
                                        onChangeText={(text) =>
                                            setNodes((prevNodes) => updateNodeField(prevNodes, node.id, text, 'storyPrompt', index))
                                        }
                                        isEditing={editingNode === node.id && fieldBeingEdited?.field === 'storyPrompt' && fieldBeingEdited?.branchIndex === index}
                                        onBlur={() => handleBlur(node.id, 'storyPrompt')}
                                        fieldLabel="Prompt"
                                    />

                                    <EditableField
                                        value={branch.linkedNodeId}
                                        onEdit={() => handleDoubleClick(node.id, 'linkedNodeId', index)}
                                        onChangeText={(text) =>
                                            setNodes((prevNodes) => updateNodeField(prevNodes, node.id, text, 'linkedNodeId', index))
                                        }
                                        isEditing={editingNode === node.id && fieldBeingEdited?.field === 'linkedNodeId' && fieldBeingEdited?.branchIndex === index}
                                        onBlur={() => handleBlur(node.id, 'linkedNodeId')}
                                        fieldLabel="LinkedNodeId"
                                    />
                                </View>
                            ))}
                        </View>
                    ))}

                    <Svg height={Math.max(height, maxY)} width={Math.max(width, maxX)} style={editorStyles.svg}>
                        {nodes.map((node) =>
                            node.nodeBranches.map((branch, index) => {
                                const toNode = findNodeById(branch.linkedNodeId);
                                if (!toNode) return null;

                                // Calculate dynamic positions for lines based on node's and branch's positions
                                const branchX = node.x + branchContainerWidth + 10; // Adjust based on the center of the branch relative to node
                                const branchY = node.y + ((index + 1) * branchContainerHeight) + nodeContainerHeight - branchContainerHeight / 2; // Adjust spacing based on branch index

                                return (
                                    <Line
                                        key={`${node.id}-${index}`}
                                        x1={branchX}
                                        y1={branchY}
                                        x2={toNode.x} // Center of the target node
                                        y2={toNode.y + (nodeContainerHeight / 2)} // Center of the target node
                                        stroke="black"
                                        strokeWidth="2"
                                    />
                                );
                            })
                        )}
                    </Svg>

                    {/* Text Overlay Modal for Editing Story Text */}
                    {showTextOverlay && (
                        <TextOverlay
                            defaultText={currentNodeStoryText}
                            onCancel={handleCancelEdit}
                            onSubmit={handleSubmitEdit}
                        />
                    )}
                </ScrollView>
            </ScrollView>
        </View>
    );
}


const initialNodes = [
    {
        id: 'root', storyText: 'You find yourself at the cave entrance.',
        storyImageId: 'caveImage',
        nodeBranches: [
            {linkedNodeId: 'forest', storyPrompt: 'Go to the forest', condition: ""},
            {linkedNodeId: 'caveInterior', storyPrompt: 'Enter the cave', condition: ""}
        ],
        x: 100, y: 100
    },
    {
        id: 'forest', storyText: 'You are in a dark forest.',
        storyImageId: 'forestImage',
        nodeBranches: [
            {linkedNodeId: 'cave', storyPrompt: 'Return to the cave', condition: ""}
        ],
        x: 300, y: 200
    },
]