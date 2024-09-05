import {Image, ImageResolvedAssetSource} from "react-native";
import {StoryMapFactory} from "@/src/factory/StoryMapFactory";

export interface StoryMapProps {
    readonly mapId: string;
}

export class StoryMap {
    private readonly mapId: string;
    private mapImage: ImageResolvedAssetSource | undefined;

    constructor(props: StoryMapProps) {
        this.mapId = props.mapId;
    }

    public get image() {
        if (this.mapImage === undefined) {
            this.mapImage = Image.resolveAssetSource(StoryMapFactory.getStoryMap(this.mapId));
        }
        return this.mapImage
    }
}