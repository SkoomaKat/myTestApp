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
    ABANDONED_LIBRARY_01: require('@images/0_UI/Abandoned_Library.jpeg'),
    PROFILE: require('@images/0_UI/profile.jpg'),
    BUTTON_1: require('@images/0_UI/Button.png'),
    PAGE_1: require('@images/0_UI/Page.jpg'),
    MAP_ICON: require('@images/0_UI/map.png'),
    HOME_MENU: require('@images/0_UI/home.png')
};

const imageRegistry: { [key: string]: any } = {
    ...storyImages,
    ...uiImages
};

export class StoryImageFactory {
    public static getStoryMap(mapId: string): ImageResolvedAssetSource {
        return mapRegistry[mapId];
    }

    public static getStoryImage(imageId: string): ImageResolvedAssetSource {
        return imageRegistry[imageId];
    }
}