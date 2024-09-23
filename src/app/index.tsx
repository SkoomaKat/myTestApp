import {ImageBackground, BackHandler, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '@/src/components/Themed';
import {Href, router, useNavigation} from "expo-router";
import {isWeb} from "@/src/app/storyScreenConstants";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";
import {useEffect} from "react";


export default function index() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        color: 'transparent'
      },
      headerShown: false
    });
  }, [navigation]);

  const Button = (text: string, pressAction: any) => {
    return (
        <TouchableOpacity
            onPress={pressAction}
            style={styles.button}
            activeOpacity={0.75}
        >
          <ImageBackground
              source={StoryImageFactory.getStoryImage('BUTTON_1')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
                height: 65,
                width: '100%'
              }}
              resizeMode='stretch'
          >
            <Text style={styles.buttonText}>{text}</Text>
          </ImageBackground>
        </TouchableOpacity>
    );
  }

  const EditorButton = () => {
    if (isWeb) {
      return Button('Editor', () => router.replace('../Editor/NodeEditorScreen'));
    }
  }

  return (
      <ImageBackground
          source={StoryImageFactory.getStoryImage('ABANDONED_LIBRARY_01')}
          style={styles.background}
          resizeMode="cover"
      >
        <View style={styles.container}>

          {Button('Play', () => (router.replace('../StoryScreen')))}
          {Button('Profiles', () => (router.replace('../ProfileSelection')))}
          {EditorButton()}

        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    alignContent: 'center',
  },
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    width: isWeb ? '40%' : '90%',
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  buttonImage: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    height: 65,
  },
  buttonText: {
    color: 'black',
    shadowOpacity: 0.5,
    fontFamily: 'TangerineBold',
    fontSize: 32,
  },
});
