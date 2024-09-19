import {ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Text, View } from '@/src/components/Themed';
import {router} from "expo-router";

export default function MainMenu() {
  const navigation = useNavigation();

  return (
      <ImageBackground
          source={{ uri: 'https://thumbs.dreamstime.com/b/cool-wallpapers-backgrounds-check-out-our-68126782.jpg' }} // Replace with your image URL or require('./path/to/image')
          style={styles.background}
      >
        <View style={styles.container}>

          <TouchableOpacity style={styles.button}
              onPress={() => {router.navigate('../StoryScreen')}}
          ><Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}
                            onPress={() => {router.push('../ProfileSelection')}}
          ><Text style={styles.buttonText}>Profiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('../Editor/NodeEditorScreen')}
          ><Text style={styles.buttonText}>Editor</Text>
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
