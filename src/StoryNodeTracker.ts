import {StoryNode} from "@/src/models/StoryNode";
import {CustomFields} from "@/src/persistance/CustomFields";
import {CUR_NODE, STORY_STACK} from "@/src/app/storyScreenConstants";
import {Persistence} from "@/src/persistance/Persistence";
import {StoryNodeFactory} from "@/src/factory/StoryNodeFactory";
import {CommandParseUtil} from "@/src/CommandParseUtil";
import {StringUtils} from "@/tst/util/utils";

const MAX_NODES = 10;

export interface ParseCommandResponse {
    commandsParsed: number,
    newText: string
}

export class StoryNodeTracker {
    private static storyNodeStack: StoryNode[] = [];

    public static clear() {
        this.storyNodeStack = [];
    }

    public static get curStoryNodeStack(): StoryNode[] {
        return this.storyNodeStack;
    }

    public static get currentNode(): StoryNode {
        return this.storyNodeStack[this.storyNodeStack.length-1];
    }

    public static addNode(storyNode: StoryNode, nodeId: string) {
        console.log(`StoryNodeTracker.addNode(NodeId: ${nodeId} )}`);
        console.log(`StoryNodeBranches: [ ${storyNode.nodeBranches.map((branch) => branch.nodeId)} ]`)

        const parseResult  = CommandParseUtil.parseCommands(storyNode.text)

        if (parseResult.commandsParsed > 0) {
            storyNode.text = parseResult.newText;
        }

        this.storyNodeStack.push(storyNode)

        if (this.storyNodeStack.length > MAX_NODES) {
            this.storyNodeStack.shift();
        }
    }

    public static get nodeTexts(): string[] {
        return this.storyNodeStack.map(node => node.text);
    }

    public static setNodeTexts(nodeTexts: string[]) {
        this.storyNodeStack = [...nodeTexts.map((text) => new StoryNode({nodeBranches: [], storyText: text})), this.storyNodeStack[this.storyNodeStack.length - 1]]
    }

    public static async selectBranch(branchIndex: number, saveGame: boolean = true) {
        const selectedBranch = this.currentNode.nodeBranches[branchIndex];
        console.log(`Branch Clicked, NodeId: ${selectedBranch.nodeId}`)

        if (selectedBranch) {
            const nextNode = StoryNodeFactory.getStoryNodeById(selectedBranch.nodeId);

            if (nextNode) {
                this.addNode(nextNode, selectedBranch.nodeId);

                CustomFields.setString(CUR_NODE, selectedBranch.nodeId);
                CustomFields.setString(STORY_STACK, JSON.stringify([...this.nodeTexts]))

                if (saveGame){
                    await Persistence.saveGame();
                    return;
                }
            }
        }
    }
}
