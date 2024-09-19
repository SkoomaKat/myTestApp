import {StoryNode} from "@/src/models/StoryNode";
import {StoryNodeFactory} from "@/src/factory/StoryNodeFactory";

export interface StoryBranchProps {
    readonly condition?: string;
    readonly linkedNodeId: string;
    readonly storyPrompt: string;
}

export class StoryBranch {
    private readonly _nodeId: string;
    private storyNode: StoryNode | undefined;

    readonly prompt: string;
    readonly condition?: string;

    constructor(props: StoryBranchProps) {
        this._nodeId = props.linkedNodeId;
        this.prompt = props.storyPrompt;
        this.condition = props.condition
    }

    public get node() {
        if (this.storyNode === undefined) {
            this.storyNode = StoryNodeFactory.getStoryNodeById(this.nodeId);
        }
        return this.storyNode
    }

    public get nodeId() {
        return this._nodeId;
    }
}