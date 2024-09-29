import { Image } from 'react-native';
import {ImageResolvedAssetSource} from "react-native";

const mapRegistry: { [key: string]: any } = {
    TEST_MAP: require('@maps/testMap.png'),
    REGION_ICE: require('@maps/Region_Map_Ice.png')
};

const storyImages: { [key: string]: any } = {
    BARREN_1: require('@images/BARREN_1.jpeg'),
    TAVERN_1: require('@images/TAVERN_1.jpg'),
    ENDING_FROZEN: require('@images/ENDING_FROZEN.jpg'),
    WINDOW_ROOM: require('@images/WINDOW_ROOM.jpeg')
};

const uiImages: { [key: string]: any } = {
    ABANDONED_LIBRARY_01: require('@images/UI/TITLE_SCREEN.jpeg'),
    PROFILE: require('@images/UI/PROFILE.jpg'),
    BUTTON_1: require('@images/UI/PAGE_BUTTON.png'),
    PAGE_1: require('@images/UI/PAGE_1.jpg'),
    MAP_ICON: require('@images/UI/MAP_ICON.png'),
    HOME_MENU: require('@images/UI/HOME_ICON.png'),
    PLAYER_ARROW: require('@images/UI/PLAYER_ARROW.png'),
    FLAG_WHITE: require('@images/UI/FLAG_WHITE.png'),
    FLAG_RED: require('@images/UI/FLAG_RED.png'),
    OPTIONS_LINES: require('@images/UI/OPTIONS_LINES.png')
};

const imageRegistry: { [key: string]: any } = {
    ...storyImages,
    ...uiImages
};

export class StoryImageFactory {
    public static getStoryMap(mapId: string): ImageResolvedAssetSource {
        return Image.resolveAssetSource(mapRegistry[mapId]);
    }

    public static getStoryImage(imageId: string): ImageResolvedAssetSource {
        return Image.resolveAssetSource(imageRegistry[imageId]);
    }
}