import {StoryNode} from "@/src/models/StoryNode";
import {StoryNodeFactory} from "@/src/factory/StoryNodeFactory";

export interface StoryBranchProps {
    readonly nodeId: string;
    readonly prompt: string;
}

export class StoryBranch {
    private readonly nodeId: string;
    private storyNode: StoryNode | undefined;

    readonly prompt: string;

    constructor(props: StoryBranchProps) {
        this.nodeId = props.nodeId;
        this.prompt = props.prompt;
    }

    public get node() {
        if (this.storyNode === undefined) {
            this.storyNode = StoryNodeFactory.getStoryNodeById(this.nodeId);
        }
        return this.storyNode
    }
}