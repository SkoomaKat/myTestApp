import {StoryMap} from "@/src/models/StoryMap";
import {StoryBranch, StoryBranchProps} from "@/src/models/StoryBranch";


export interface StoryNodeProps {
    readonly mapId?: string;
    readonly text: string;
    readonly storyBranchProps: StoryBranchProps[];
}

export class StoryNode {
    readonly map: StoryMap | null;
    private _text: string;
    readonly nodeBranches: StoryBranch[] = [];

    constructor(props: StoryNodeProps) {
        this._text = props.text;
        props.storyBranchProps.forEach( (storyBranchProp) => {
            this.nodeBranches.push(new StoryBranch(storyBranchProp))
        })

        this.map = props.mapId === undefined ? null :
            new StoryMap({mapId: props.mapId});
    }

    public set text(text : string) {
        this._text = text;
    }

    public get text() { return this._text }
}