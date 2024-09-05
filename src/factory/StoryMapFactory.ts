
const mapRegistry: { [key: string]: any } = {
    TEST_MAP: require('@maps/testMap.png'),
};

export class StoryMapFactory {
    public static getStoryMap(mapId: string) {
        return mapRegistry[mapId];
    }
}