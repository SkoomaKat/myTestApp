import {CommandParseUtil} from "@/src/CommandParseUtil";

export interface StoryBranchProps {
    readonly condition?: string;
    readonly linkedNodeId: string;
    readonly storyPrompt: string;
    readonly mapX?: number;
    readonly mapY?: number;
}

export class StoryBranch {
    private readonly _nodeId: string;
    private _evaluatedCondition?: boolean;
    readonly mapX?: number;
    readonly mapY?: number;
    readonly prompt: string;
    readonly condition?: string;

    constructor(props: StoryBranchProps) {
        this._nodeId = props.linkedNodeId;
        this.prompt = props.storyPrompt;
        this.condition = props.condition
        this.mapX = props.mapX;
        this.mapY = props.mapY;
    }

    public get nodeId() {
        return this._nodeId;
    }

    public get evaluatedCondition() {
        if (this._evaluatedCondition != undefined) return this._evaluatedCondition;

        this._evaluatedCondition = this.condition? eval(CommandParseUtil.parseCommands(this.condition, true).newText) : true;
        return this._evaluatedCondition;
    }

    public get isWaypoint(): boolean {
        return (this.mapX != undefined && this.mapY != undefined)
    }
}