import nodeData from "@nodeData/nodes.json";
import {StoryNode, StoryNodeProps} from "@/src/models/StoryNode";


export type NodeData = {
    [key: string]: StoryNodeProps;
};

export class StoryNodeFactory {
    private static readonly nodes: NodeData = nodeData;

    public static getStoryNodeById(nodeId: string) {
        const node = this.nodes[nodeId];

        if (!nodeData) {
            throw new Error(`Node with id ${nodeId} not found.`);
        }

        // Create and return a new StoryNode using the data
        return new StoryNode({
            text: node.text,
            mapId: node.mapId,
            storyBranchProps: node.storyBranchProps
        });
    }
}