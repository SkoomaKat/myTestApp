import React, {useEffect, useRef} from 'react';
import {ScrollView, Image, StyleSheet, View, TouchableOpacity, Alert, Platform} from 'react-native';
import {map} from "yaml/dist/schema/common/map";
import {StoryBranch} from "@/src/models/StoryBranch";
import {StoryNode} from "@/src/models/StoryNode";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";

const map_img = StoryImageFactory.getStoryMap(('REGION_ICE'));

const mapSize = {
  width: 1728,
  height: 847,
}

export default function MapScreen() {
  const scrollViewRef = useRef<ScrollView>(null);

  const waypointX = 565;
  const waypointY = 477;

  const handleWaypointPress = (waypoint: string) => {
    Alert.alert(`Waypoint ${waypoint} pressed!`);
  };

  useEffect(() => {
    const scrollToX = Math.max(waypointX, 0);
    const scrollToY = Math.max(waypointY, 0);

  }, []);

  return (
      <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
          scrollEnabled={true}
          persistentScrollbar={true}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          bounces={false}
          pinchGestureEnabled={Platform.OS !== 'web'}
          minimumZoomScale={1}
          maximumZoomScale={10}
          scrollToOverflowEnabled={true}
          scrollsToTop={false}
      >
        <Image
            source={StoryImageFactory.getStoryMap(('REGION_ICE'))}
            style={styles.map}
        />
        {/* Example Waypoints */}
        <TouchableOpacity
            style={[styles.waypoint, { top: 477 - 15, left: 565 - 15 }]} // Adjust coordinates for your specific waypoint
            onPress={() => handleWaypointPress('1')}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'black'
  },
  contentContainer: mapSize,
  map: {
    width: mapSize.width, // Adjust to your image width
    height: mapSize.height, // Adjust to your image height
    resizeMode: 'contain', // Ensures the map image scales correctly
  },
  waypoint: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0, 0, 255, 0.5)', // Semi-transparent blue for visibility
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});