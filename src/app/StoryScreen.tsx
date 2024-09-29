import React, {useEffect, useRef, useState} from 'react';
import {Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '@/src/components/Themed';
import {StoryNodeFactory} from '@/src/factory/StoryNodeFactory';
import {StoryNodeTracker} from "@/src/StoryNodeTracker";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {StringUtils} from "@/src/util/utils";
import {CUR_CHAPTER, CUR_NODE, IS_MAP_NODE, STORY_STACK, storyScreenStyles} from "@/src/app/storyScreenConstants";
import {Persistence} from "@/src/persistance/Persistence";
import {CustomFields} from "@/src/persistance/CustomFields";
import {router, useNavigation} from "expo-router";
import {NavbarRight, StoryPage} from "@/src/app/navbar_right/navbar_right";
import {navbarStyles} from "@/src/app/navbar_right/navbarStyles";
import {StoryButton} from "@/src/components/storyScreenComponents";

const defaultNodeId = "0";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export default function StoryScreen() {
    const scrollViewRef = useRef<ScrollView>(null);
    const [isOptionsSelected, setOptionsSelected] = useState<boolean>(false);
    const [storyStack, setStoryStack] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                color: 'transparent'
            },
            headerShown: false
        });
    }, [navigation]);

    useEffect(() => {
        const loadNodeTracker = async () => {
            try {
                await Persistence.loadGame();
            } catch (error) {
                console.error("Error loading game data:", error)
            } finally {
                const nodeIdToUse = CustomFields.getStringOrElse(CUR_NODE, defaultNodeId);
                StoryNodeFactory.setChapter(CustomFields.getStringOrElse(CUR_CHAPTER, "CHAPTER_1"));

                StoryNodeTracker.clear();
                StoryNodeTracker.addNode(StoryNodeFactory.getStoryNodeById(nodeIdToUse), nodeIdToUse)
                const loadedStoryStack = CustomFields.getStringOrElse(STORY_STACK, undefined);

                if (loadedStoryStack) {
                    console.log(`Setting story stack: ${loadedStoryStack}`)
                    StoryNodeTracker.setNodeTexts(JSON.parse(loadedStoryStack));
                    setStoryStack(JSON.parse(loadedStoryStack));
                } else {
                    setStoryStack([...StoryNodeTracker.nodeTexts]);
                }

                scrollToBottom();
                setIsLoading(false);
            }
        };

        loadNodeTracker()
    }, []);

    const handleBranchClick = async (branchIndex: number, msDelay: number = 0) => {
        await delay(msDelay);

        await StoryNodeTracker.selectBranch(branchIndex).then(() => {
            setStoryStack([...StoryNodeTracker.nodeTexts]);

            scrollToBottom();
        })
    };

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({animated: true});
        }
    };

    const toggleOptionsMenu = () => {
        setOptionsSelected(!isOptionsSelected)
    }

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <View style={storyScreenStyles.container}>
                <View style={isOptionsSelected ? navbarStyles.greyedOutOverlay : {}}/>
                <ScrollView
                    style={storyScreenStyles.storyBox}
                    scrollEnabled={!isOptionsSelected}
                    overScrollMode={"never"}
                    contentContainerStyle={storyScreenStyles.storyBoxContent}
                    ref={scrollViewRef}
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
                            let pageStyle = {};

                            if (index == storyStack.length - 1) {
                                textStyle = storyScreenStyles.latestStoryText;
                                pageStyle = storyScreenStyles.latestPage;
                            } else if (index == storyStack.length - 2) {
                                const lastNodeIsImage = storyStack[storyStack.length - 1].match(imagePattern);

                                if (lastNodeIsImage) {
                                    textStyle = storyScreenStyles.latestStoryText;
                                    pageStyle = storyScreenStyles.latestPage;
                                } else {
                                    textStyle = storyScreenStyles.storyText;
                                    pageStyle = storyScreenStyles.oldPage;
                                }
                            } else {
                                textStyle = storyScreenStyles.storyText;
                                pageStyle = storyScreenStyles.oldPage;
                            }

                            if (StringUtils.isNullOrEmpty(text)) return;

                            return (
                                <ImageBackground
                                    key={index}
                                    source={StoryImageFactory.getStoryImage('PAGE_1')}
                                    style={pageStyle}
                                    resizeMethod='resize'
                                >
                                    <Text onLayout={() => scrollToBottom()} key={index} style={textStyle}>{text}</Text>
                                </ImageBackground>
                            )
                        }
                    })}
                </ScrollView>


                <View style={storyScreenStyles.buttonContainer}>
                    {
                        StoryNodeTracker.currentNode && StoryNodeTracker.currentNode.nodeBranches.length > 0 ? (
                            StoryNodeTracker.currentNode.nodeBranches.map((branch, index) => ({branch, index}))
                                .filter(({branch}) => branch.evaluatedCondition)
                                .map(({branch, index}) => {
                                    if (branch.mapX && branch.mapY) {
                                        if (index == 0) {
                                            return (
                                                <StoryButton
                                                    key={index}
                                                    buttonIndex={index}
                                                    buttonText={'Continue on Map'}
                                                    isOptionsSelected={isOptionsSelected}
                                                    onPress={() => router.navigate('/MapScreen')}
                                                ></StoryButton>
                                            )
                                        }
                                    } else if (StringUtils.isNullOrEmpty(branch.prompt)) {
                                        handleBranchClick(index, 1000);
                                    } else return (
                                        <StoryButton
                                            key={index}
                                            buttonIndex={index}
                                            buttonText={branch.prompt}
                                            isOptionsSelected={isOptionsSelected}
                                            onPress={() => handleBranchClick(index)}
                                        ></StoryButton>
                                    )
                                })
                        ) : (
                            <Text style={storyScreenStyles.noAvailableNodesText}>No Options Available</Text>
                        )
                    }
                </View>
            </View>

            <NavbarRight
                storyPage={StoryPage.STORY_SCREEN}
                toggleSelected={isOptionsSelected}
                toggleSetter={toggleOptionsMenu}>
            </NavbarRight>
        </View>
    );
}
