import {StoryNode} from "@/src/models/StoryNode";
import * as Test from "node:test";
import {StoryCommand, StoryCommandRequest, StoryCommandType} from "@/src/models/StoryCommand";
import {CustomFieldType} from "@/src/models/CustomFields";

const MAX_NODES = 10;

export interface ParseCommandResponse {
    commandsParsed: number,
    newText: string
}

export class StoryNodeTracker {
    private storyNodeStack: StoryNode[] = [];

    constructor(rootNode: StoryNode) {
        this.addNode(rootNode);
    }

    public get currentNode(): StoryNode {
        return this.storyNodeStack[this.storyNodeStack.length-1];
    }

    public addNode(storyNode: StoryNode) {
        storyNode.text = parseCommands(storyNode.text).newText
        this.storyNodeStack.push(storyNode);

        if (this.storyNodeStack.length > MAX_NODES) {
            this.storyNodeStack.shift();
        }
    }

    public get nodeTexts(): string[] {
        return this.storyNodeStack.map(node => node.text);
    }
}

export function parseCommands(storyText: string): ParseCommandResponse {
    const regex = /<([^>]+)>/g;
    let commandsParsed = 0;

    // Replace all occurrences and execute the commands.
    const newText = storyText.replace(regex, (match, command) => {
        commandsParsed += 1;
        return StoryCommand.resolveCommand(getStoryCommandRequest(command));
    });

    return { commandsParsed, newText }
}

export function getStoryCommandRequest(commandString: string): StoryCommandRequest {
    // Split the commandString into parts
    const parts = commandString.trim().split(/\s+/);

    if (parts.length < 3) {
        throw new Error("Invalid command string format.");
    }

    // Parse the command type (SET, GET, ADD, SUBTRACT)
    const commandTypeString = parts[0].toUpperCase();
    let commandType: StoryCommandType;
    switch (commandTypeString) {
        case "SET":
            commandType = StoryCommandType.SET;
            break;
        case "GET":
            commandType = StoryCommandType.GET;
            break;
        case "ADD":
            commandType = StoryCommandType.ADD;
            break;
        case "SUBTRACT":
            commandType = StoryCommandType.SUBTRACT;
            break;
        default:
            throw new Error(`Invalid command type: ${commandTypeString}`);
    }

    // Parse the field type (NUMBER, STRING)
    const fieldTypeString = parts[1].toUpperCase();
    let fieldType: CustomFieldType;
    switch (fieldTypeString) {
        case "NUMBER":
            fieldType = CustomFieldType.NUMBER;
            break;
        case "STRING":
            fieldType = CustomFieldType.STRING;
            break;
        case "IMAGE":
            fieldType = CustomFieldType.IMAGE;
            break;
        default:
            throw new Error(`Invalid field type: ${fieldTypeString}`);
    }

    // Parse the field name
    const fieldName = parts[2];
    if (!fieldName) {
        throw new Error("Field name cannot be empty.");
    }

    // Parse the optional field value (only for SET, ADD, SUBTRACT commands)
    let fieldValue: string | undefined;
    if (commandType !== StoryCommandType.GET && parts.length > 3) {
        fieldValue = parts[3];
    }

    // Ensure valid fieldValue for number fields in ADD and SUBTRACT commands
    if ((commandType === StoryCommandType.ADD || commandType === StoryCommandType.SUBTRACT) &&
        fieldType === CustomFieldType.NUMBER) {
        if (isNaN(Number(fieldValue))) {
            throw new Error(`Invalid number value for command: ${fieldValue}`);
        }
    }

    return {
        commandType,
        fieldType,
        fieldName,
        fieldValue
    };
}

