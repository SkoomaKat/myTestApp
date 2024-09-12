import {StoryNode, StoryNodeProps} from "@/src/models/StoryNode";

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
        this.nodes = ChapterRegistry[chapterId];
    }

    public static getStoryNodeById(nodeId: string) {
        let node = undefined;

        const splitId = nodeId.split(".");
        if (splitId.length > 1) {
            this.setChapter(splitId[0])
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