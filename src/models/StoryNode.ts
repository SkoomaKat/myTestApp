import {StoryMap} from "@/src/models/StoryMap";
import {StoryBranch, StoryBranchProps} from "@/src/models/StoryBranch";


export interface StoryNodeProps {
    readonly storyImageId?: string;
    readonly storyText: string;
    readonly nodeBranches: StoryBranchProps[];
}

export class StoryNode {
    readonly map: StoryMap | null;
    private _text: string;
    readonly nodeBranches: StoryBranch[] = [];

    constructor(props: StoryNodeProps) {
        this._text = props.storyText;
        props.nodeBranches.forEach( (storyBranchProp) => {
            this.nodeBranches.push(new StoryBranch(storyBranchProp))
        })

        this.map = props.storyImageId === undefined ? null :
            new StoryMap({mapId: props.storyImageId});
    }

    public set text(text : string) {
        this._text = text;
    }

    public get text() { return this._text }
}