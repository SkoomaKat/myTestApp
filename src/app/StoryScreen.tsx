import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, View, Image} from 'react-native';
import {Text} from '@/src/components/Themed';
import {StoryNodeFactory} from '@/src/factory/StoryNodeFactory';
import {parseCommands, StoryNodeTracker} from "@/src/StoryNodeTracker";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {StringUtils} from "@/src/util/utils";
import {CUR_CHAPTER, CUR_NODE, STORY_STACK, storyScreenStyles} from "@/src/app/storyScreenConstants";
import {CustomFields} from "@/src/persistance/CustomFields";
import {Persistence} from "@/src/persistance/Persistence";

const defaultNodeId = "0";
let nodeTracker: StoryNodeTracker;

export default function StoryScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [storyStack, setStoryStack] = useState<string[]>([]); // Story text stack
    const [isLoading, setIsLoading] = useState(true); // Loading state


    useEffect(() => {
        const loadNodeTracker = async () => {
            try {
                await Persistence.loadGame();
            } catch (error) {
                console.error("Error loading game data:", error)
            } finally {
                const nodeIdToUse = CustomFields.getString(CUR_NODE) || defaultNodeId;
                StoryNodeFactory.setChapter(CustomFields.getString(CUR_CHAPTER) || "CHAPTER_1");

                nodeTracker = new StoryNodeTracker(StoryNodeFactory.getStoryNodeById(nodeIdToUse), nodeIdToUse);
                const loadedStoryStack = CustomFields.getString(STORY_STACK);

                if (loadedStoryStack) {
                    console.log(`Setting story stack: ${loadedStoryStack}`)
                    nodeTracker.setNodeTexts(JSON.parse(loadedStoryStack));
                    setStoryStack(JSON.parse(loadedStoryStack));
                } else {
                    setStoryStack([...nodeTracker.nodeTexts]);
                }

                setStoryStack([...nodeTracker.nodeTexts]);
                scrollToBottom();
                setIsLoading(false);

            }
        };

        loadNodeTracker()
    }, []);

    const handleBranchClick = async (branchIndex: number) => {
        const currentNode = nodeTracker.currentNode;
        const selectedBranch = currentNode.nodeBranches[branchIndex];

        console.log(`Branch Clicked, NodeId: ${selectedBranch.nodeId}`)

        if (selectedBranch) {
            const nextNode = selectedBranch.node;

            if (nextNode) {
                nodeTracker.addNode(nextNode, selectedBranch.nodeId);
                setStoryStack([...nodeTracker.nodeTexts]);
                scrollToBottom(); // Scroll to the bottom after updating the stack

                CustomFields.setString(CUR_NODE, selectedBranch.nodeId);
                CustomFields.setString(STORY_STACK, JSON.stringify(storyStack))
                await Persistence.saveGame();
            }
        }
    };

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    };

    if (isLoading) {
        return <Text>Loading...</Text>; // Show loading text while data is being fetched
    }

    return (
        <View style={storyScreenStyles.container}>

            <View style={storyScreenStyles.navbar}>
                <TouchableOpacity style={storyScreenStyles.navbarButton}>
                    <Text style={storyScreenStyles.navbarButtonText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={storyScreenStyles.navbarButton}>
                    <Text style={storyScreenStyles.navbarButtonText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={storyScreenStyles.navbarButton}>
                    <Text style={storyScreenStyles.navbarButtonText}>3</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={storyScreenStyles.storyBox}
                scrollEnabled={true}
                overScrollMode={"never"}
                contentContainerStyle={storyScreenStyles.storyBoxContent}
                ref={scrollViewRef} // Attach the ref to the ScrollView
            >
                {storyStack.map((text, index) => {
                    const imagePattern = /<IMAGE (\S+)>/;
                    const match = text.match(imagePattern);

                    if (match)
                        return <Image
                            key={index}
                            style={storyScreenStyles.inlineImage}
                            source={StoryImageFactory.getStoryImage(match[1])}
                        />
                    else {
                        let textStyle = {};

                        if (index == storyStack.length - 1) {
                            textStyle = storyScreenStyles.latestStoryText;
                        } else if (index == storyStack.length - 2) {
                            const lastNodeIsImage = storyStack[storyStack.length - 1].match(imagePattern);

                            if (lastNodeIsImage) {
                                textStyle = storyScreenStyles.latestStoryText;
                            } else {
                                textStyle = storyScreenStyles.storyText;
                            }
                        } else {
                            textStyle = storyScreenStyles.storyText;
                        }

                        return <Text onLayout={() => scrollToBottom()} key={index} style={textStyle}>{text}</Text>
                    }
                })}
            </ScrollView>

            <View style={storyScreenStyles.buttonContainer}>
                {nodeTracker.currentNode && nodeTracker.currentNode.nodeBranches.length > 0 ? (
                    nodeTracker.currentNode.nodeBranches.map((branch, index) => {
                        const useBranch = branch.condition?
                            eval(parseCommands(branch.condition, true).newText) : true;
                        if (useBranch) {
                            if (StringUtils.isNullOrEmpty(branch.prompt)) {
                                handleBranchClick(index);
                            } else return (
                                <TouchableOpacity key={index} style={storyScreenStyles.button} onPress={() => handleBranchClick(index)}>
                                    <Text style={storyScreenStyles.buttonText}>{branch.prompt}</Text>
                                </TouchableOpacity>
                            )
                        }
                    })
                ) : (
                    <Text style={storyScreenStyles.storyText}>No options available</Text>
                )}
            </View>
        </View>
    );
}
