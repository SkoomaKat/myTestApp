import {ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Text, View } from '@/src/components/Themed';
import {router} from "expo-router";
import {Persistence} from "@/src/persistance/Persistence";
import {CUR_NODE, NodeTracker, PROFILE} from "@/src/app/storyScreenConstants";
import {StoryNodeTracker} from "@/src/StoryNodeTracker";
import {StoryNodeFactory} from "@/src/factory/StoryNodeFactory";
import {CustomFields} from "@/src/persistance/CustomFields";

export default function MainMenu() {
  const navigation = useNavigation();

  return (
      <ImageBackground
          source={{ uri: 'https://thumbs.dreamstime.com/b/cool-wallpapers-backgrounds-check-out-our-68126782.jpg' }} // Replace with your image URL or require('./path/to/image')
          style={styles.background}
      >
        <View style={styles.container}>
          <TouchableOpacity
              style={styles.button}
              onPress={() => {router.push('../StoryScreen')}}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Load</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('../Editor/NodeEditorScreen')}
          >
            <Text style={styles.buttonText}>Editor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'gray',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
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
