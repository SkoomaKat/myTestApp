import {ImageResolvedAssetSource} from "react-native";

const mapRegistry: { [key: string]: any } = {
    TEST_MAP: require('@maps/testMap.png'),
};

const imageRegistry: { [key: string]: any } = {
    PROFILE: require('@images/profile.jpg'),
    BARREN_1: require('@images/BARREN_1.jpg'),
    TAVERN_1: require('@images/TAVERN_1.jpg'),
    ENDING_FROZEN: require('@images/ENDING_FROZEN.jpg'),
    WINDOW_ROOM: require('@images/WINDOW_ROOM.jpg')
};

export class StoryImageFactory {
    public static getStoryMap(mapId: string): ImageResolvedAssetSource {
        return mapRegistry[mapId];
    }

    public static getStoryImage(imageId: string): ImageResolvedAssetSource {
        return imageRegistry[imageId];
    }
}