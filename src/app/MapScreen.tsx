import React, {useEffect, useRef, useState} from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground, View, ImageResolvedAssetSource
} from 'react-native';
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import PanPinchView from "react-native-pan-pinch-view";
import {CustomFields} from "@/src/persistance/CustomFields";
import {CUR_MAP, IS_MAP_NODE} from "@/src/app/storyScreenConstants";
import {Text} from "@/src/components/Themed";
import {StoryNodeTracker} from "@/src/StoryNodeTracker";
import {StringUtils} from "@/src/util/utils";
import {router, useNavigation} from "expo-router";
import {navbarStyles} from "@/src/app/navbar_right/navbarStyles";
import {NavbarRight, StoryPage} from "@/src/app/navbar_right/navbar_right";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function MapScreen() {
    const panPinchViewRef = useRef<any>(null);
    const [isOptionsSelected, setOptionsSelected] = useState<boolean>(false);
    const [curMap, setCurMap] = useState<ImageResolvedAssetSource>(StoryImageFactory.getStoryMap(CustomFields.getStringOrElse(CUR_MAP, 'REGION_ICE')))
    const [playerX, setPlayerX] = useState<number>(CustomFields.getNumberOrElse('MAP_X', 600));
    const [playerY, setPlayerY] = useState<number>(CustomFields.getNumberOrElse('MAP_Y', 460));


    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                color: 'transparent'
            },
            headerShown: false
        });
    }, [navigation]);

    const mapSize = {
        width: curMap.width,
        height: curMap.height
    }

    useEffect(() => {
        setCurMap(StoryImageFactory.getStoryMap(CustomFields.getStringOrElse(CUR_MAP, 'REGION_ICE')));
        setPlayerX(CustomFields.getNumberOrElse('MAP_X', 600));
        setPlayerY(CustomFields.getNumberOrElse('MAP_Y', 460));

    }, [StoryNodeTracker.curStoryNodeStack]);

    const handleWaypointPress = async (branchIndex: number) => {
        CustomFields.setNumber(IS_MAP_NODE, 0);

        await StoryNodeTracker.selectBranch(branchIndex);

        if (CustomFields.getNumberOrElse(IS_MAP_NODE, 0) != 1) {
            router.replace('/StoryScreen');
        }
    };

    useEffect(() => {
        const offsetX = playerX - screenWidth / 2;
        const offsetY = playerY - screenHeight / 2;

        if (panPinchViewRef.current) {
            panPinchViewRef.current.translateTo(-offsetX, -offsetY, true);
        }
    }, [panPinchViewRef]);

    const toggleOptionsMenu = () => { setOptionsSelected(!isOptionsSelected) }

    const renderWaypoints = () => {
        const hasMapBranches = (StoryNodeTracker.currentNode && StoryNodeTracker.currentNode.nodeBranches.length > 0);

        if (CustomFields.getNumberOrElse(IS_MAP_NODE, 0) == 0) {
            console.log("Not on map node, not rendering waypoints.")
            return;
        } else if (!hasMapBranches) {
            console.log("No waypoints to render.")
            return;
        }

        return StoryNodeTracker.currentNode.nodeBranches.map((branch, index) => ({branch, index}))
            .filter(({branch}) => (branch.isWaypoint && branch.evaluatedCondition))
            .map(({branch, index}) => {

                if (StringUtils.isNullOrEmpty(branch.prompt)) {
                    return;
                } else {
                    console.log(`Adding ${branch.prompt} to map`)
                    return (
                        <ImageBackground
                            key={index}
                            source={StoryImageFactory.getStoryImage('FLAG_RED')}
                            style={{
                                ...styles.waypoint_image,
                                top: (branch.mapY || 0) - 45,
                                left: (branch.mapX || 0) - 25
                            }}
                            resizeMode='contain'
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    top: '44%',
                                    left: '53%',
                                    width: '35%',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 2.3}}>{branch.prompt}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.waypoint}
                                onPress={() => handleWaypointPress(index)}
                            />
                        </ImageBackground>
                    )
                }

            })
    }

    return (
        <View style={{flex: 1, backgroundColor: 'transparent'}}>
            <PanPinchView
                ref={panPinchViewRef}
                minScale={(screenHeight / mapSize.height)}
                maxScale={10}
                initialScale={(screenHeight / mapSize.height)}
                containerDimensions={{
                    width: screenWidth,
                    height: screenHeight
                }}
                contentDimensions={{width: mapSize.width, height: mapSize.height}}
            >
                <View style={isOptionsSelected ? navbarStyles.greyedOutOverlay : {}}/>
                <Image
                    style={{
                        ...styles.map,
                        width: mapSize.width,
                        height: mapSize.height
                    }}
                    source={curMap}
                />
                <ImageBackground
                    source={StoryImageFactory.getStoryImage('PLAYER_ARROW')}
                    style={{
                        ...styles.waypoint_image,
                        top: playerY - styles.player_location.height,
                        left: playerX - (styles.player_location.width / 2)
                    }}
                    resizeMode='contain'
                >
                    <TouchableOpacity
                        style={styles.player_location}
                    />
                </ImageBackground>

                {renderWaypoints()}
            </PanPinchView>

            <NavbarRight
                storyPage={StoryPage.MAP_SCREEN}
                toggleSelected={isOptionsSelected}
                toggleSetter={toggleOptionsMenu}>
            </NavbarRight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    map: {
        resizeMode: 'contain',
        backgroundColor: 'black'
    },
    imageViewer: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'black'
    },
    waypoint_image: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        position: 'absolute',
        resizeMode: 'contain',
    },
    player_location: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: 25,
        height: 25,
    },
    waypoint: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        width: 50,
        height: 50,
    },
});