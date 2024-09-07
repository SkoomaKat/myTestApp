import {Image, ImageResolvedAssetSource} from "react-native";
import {StoryImageFactory} from "@/src/factory/StoryImageFactory";

export interface StoryMapProps {
    readonly mapId: string;
}

export class StoryMap {
    private readonly mapId: string;
    private mapImage: ImageResolvedAssetSource | undefined;

    constructor(props: StoryMapProps) {
        this.mapId = props.mapId;
    }

    public get image(): ImageResolvedAssetSource {
        if (this.mapImage === undefined) {
            this.mapImage = StoryImageFactory.getStoryMap(this.mapId);
        }
        return this.mapImage
    }
}