import {ImageResolvedAssetSource} from "react-native";

const mapRegistry: { [key: string]: any } = {
    TEST_MAP: require('@maps/testMap.png'),
};

const imageRegistry: { [key: string]: any } = {
    TEST_IMAGE: require('@maps/testMap.png'),
};

export class StoryImageFactory {
    public static getStoryMap(mapId: string): ImageResolvedAssetSource {
        return mapRegistry[mapId];
    }

    public static getStoryImage(imageId: string): ImageResolvedAssetSource {
        return imageRegistry[imageId];
    }
}