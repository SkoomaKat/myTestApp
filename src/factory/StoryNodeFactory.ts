import {StoryNode, StoryNodeProps} from "@/src/models/StoryNode";
import {Persistence} from "@/src/persistance/Persistence";
import {CustomFields} from "@/src/persistance/CustomFields";
import {CUR_CHAPTER} from "@/src/app/storyScreenConstants";

const ChapterRegistry: { [key: string]: any } = {
    CHAPTER_1: require('@nodeData/nodes.json'),
    CHAPTER_2: require('@nodeData/chapter_2.json')
};

export type NodeData = {
    [key: string]: StoryNodeProps;
};

export class StoryNodeFactory {
    private static nodes: NodeData = ChapterRegistry.CHAPTER_1;

    public static setChapter(chapterId: string) {
        console.log(`StoryNodeFactory.setChapter(${chapterId})`);
        this.nodes = ChapterRegistry[chapterId];
    }

    public static getStoryNodeById(nodeId: string) {
        let node = undefined;

        const splitId = nodeId.split(".");
        if (splitId.length > 1) {
            const chapter = splitId[0];

            CustomFields.setString(CUR_CHAPTER, chapter);
            this.setChapter(chapter);
            node = this.nodes[splitId[1]];
        } else {
            node = this.nodes[nodeId];
        }

        return new StoryNode({
            storyText: node.storyText,
            storyImageId: node.storyImageId,
            nodeBranches: node.nodeBranches
        });
    }
}