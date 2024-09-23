import React from 'react';
import {ScrollView, Image, StyleSheet, View, TouchableOpacity, Alert, Platform} from 'react-native';
import {map} from "yaml/dist/schema/common/map";
import {StoryBranch} from "@/src/models/StoryBranch";
import {StoryNode} from "@/src/models/StoryNode";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";

const rootnode = new StoryNode({
  storyText: "Welcome to TextGame",
  storyImageId: 'TEST_MAP',
  nodeBranches: [
    { linkedNodeId: "", storyPrompt: "Prompt 1" },
    { linkedNodeId: "", storyPrompt: "Prompt 2" },
    { linkedNodeId: "", storyPrompt: "Prompt 3" },
  ]
});

const mapSize = {
  width: 2048,
  height: 1317,
}

export default function MapScreen() {
  const handleWaypointPress = (waypoint: string) => {
    Alert.alert(`Waypoint ${waypoint} pressed!`);
    // Perform your desired action here
  };

  return (
      <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
          scrollEnabled={true}
          persistentScrollbar={true}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          bounces={false} // Prevents bounce effect on web
          pinchGestureEnabled={Platform.OS !== 'web'} // Disable pinch-zoom for web
          minimumZoomScale={0}
          maximumZoomScale={100}
          scrollToOverflowEnabled={true}
          scrollsToTop={false}
      >
        <Image
            source={rootnode.map?.image}
            style={styles.map}
        />
        {/* Example Waypoints */}
        <TouchableOpacity
            style={[styles.waypoint, { top: 100, left: 150 }]} // Adjust coordinates for your specific waypoint
            onPress={() => handleWaypointPress('1')}
        />
        <TouchableOpacity
            style={[styles.waypoint, { top: 200, left: 250 }]} // Adjust coordinates for your specific waypoint
            onPress={() => handleWaypointPress('2')}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden', // Prevents scrollbars from hiding the content
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