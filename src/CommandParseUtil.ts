import {StoryCommand, StoryCommandRequest, StoryCommandType} from "@/src/models/StoryCommand";
import {CustomFieldType} from "@/src/persistance/CustomFields";

export interface ParseCommandResponse {
    commandsParsed: number,
    newText: string
}

export class CommandParseUtil {
    static parseCommands(storyText: string, wrapped: boolean = false): ParseCommandResponse {
        const regex = /<([^>]+)>/g;
        let commandsParsed = 0;

        // Replace all occurrences and execute the commands.
        const newText = storyText.replace(regex, (command) => {
            commandsParsed += 1;
            return StoryCommand.resolveCommand(this.getStoryCommandRequest(command), wrapped);
        });

        return { commandsParsed, newText }
    }

    private static getStoryCommandRequest(commandString: string): StoryCommandRequest {
        commandString = commandString.replaceAll(/[<>]/g, '');
        console.log(`getStoryCommandRequest(${commandString})`);

        const parts = commandString.trim().split(/\s+/);

        if (parts.length < 3) {
            throw new Error("Invalid command string format.");
        }

        const commandTypeString = parts[0].toUpperCase();
        const fieldTypeString = parts[1].toUpperCase();
        const fieldName = parts[2];

        const commandType = this.getStoryCommandType(commandTypeString);
        const fieldType = this.getCustomFieldType(fieldTypeString);
        const fieldValue = (commandType !== StoryCommandType.GET && parts.length > 3) ? parts[3] : undefined;

        if (this.requiresNumber(commandType)) {
            if (isNaN(Number(fieldValue))) {
                throw new Error(`Invalid value: ${fieldValue} for StoryCommandType.${commandType}`);
            }
        }

        return {
            commandType,
            fieldType,
            fieldName,
            fieldValue
        };
    }

    private static requiresNumber(storyCommandType: StoryCommandType) {
        return (storyCommandType === StoryCommandType.ADD || storyCommandType === StoryCommandType.SUBTRACT);
    }

    private static getStoryCommandType(key: string): StoryCommandType {
        if (key in StoryCommandType) {
            return StoryCommandType[key as keyof typeof StoryCommandType];
        } else {
            throw new Error(`Invalid StoryCommandType: ${key}`);
        }
    }

    private static getCustomFieldType(key: string): CustomFieldType {
        if (key in CustomFieldType) {
            return CustomFieldType[key as keyof typeof CustomFieldType];
        } else {
            throw new Error(`Invalid CustomFieldType: ${key}`);
        }
    }
}
