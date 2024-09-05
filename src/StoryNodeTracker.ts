import {StoryNode} from "@/src/models/StoryNode";

const MAX_NODES = 10;

export class StoryNodeTracker {
    private storyNodeStack: StoryNode[] = [];

    constructor(rootNode: StoryNode) {
        this.addNode(rootNode);
    }

    public get currentNode(): StoryNode {
        return this.storyNodeStack[this.storyNodeStack.length-1];
    }

    public addNode(storyNode: StoryNode) {
        this.storyNodeStack.push(storyNode);

        if (this.storyNodeStack.length > MAX_NODES) {
            this.storyNodeStack.shift();
        }
    }

    public get nodeTexts(): string[] {
        return this.storyNodeStack.map(node => node.text);
    }
}