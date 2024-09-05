import {StoryMap} from "@/src/models/StoryMap";
import {StoryBranch, StoryBranchProps} from "@/src/models/StoryBranch";


export interface StoryNodeProps {
    readonly mapId?: string;
    readonly text: string;
    readonly storyBranchProps: StoryBranchProps[];
}

export class StoryNode {
    readonly map: StoryMap | null;
    readonly text: string;
    readonly nodeBranches: StoryBranch[] = [];

    constructor(props: StoryNodeProps) {
        this.text = props.text;
        props.storyBranchProps.forEach( (storyBranchProp) => {
            this.nodeBranches.push(new StoryBranch(storyBranchProp))
        })

        this.map = props.mapId === undefined ? null :
            new StoryMap({mapId: props.mapId});
    }
}