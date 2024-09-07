import {CustomFields, CustomFieldType} from "@/src/models/CustomFields";


export interface StoryCommandRequest {
    commandType: StoryCommandType,
    fieldType: CustomFieldType,
    fieldName: string,
    fieldValue?: string
}

export class StoryCommand {

    static resolveCommand(commandRequest: StoryCommandRequest): string {
        // For SET, ADD, and SUBTRACT, ensure a field value is provided
        if ((commandRequest.commandType === StoryCommandType.SET ||
                commandRequest.commandType === StoryCommandType.ADD ||
                commandRequest.commandType === StoryCommandType.SUBTRACT)
            && commandRequest.fieldValue === undefined) {
            throw new Error("Cannot modify CustomField without a value");
        }

        // Handling the NUMBER field type
        if (commandRequest.fieldType === CustomFieldType.NUMBER) {
            if (commandRequest.commandType !== StoryCommandType.GET) {
                const value = parseInt(commandRequest.fieldValue || "");
                if (isNaN(value)) {
                    throw new Error(`Invalid number: ${commandRequest.fieldValue}`);
                }

                switch (commandRequest.commandType) {
                    case StoryCommandType.SET:
                        CustomFields.setNumber(commandRequest.fieldName, value);
                        break;

                    case StoryCommandType.ADD:
                        const currentValueAdd = CustomFields.getNumber(commandRequest.fieldName);
                        if (typeof currentValueAdd !== "number") {
                            throw new Error(currentValueAdd); // Handle "WARN: key UNDEFINED"
                        }
                        CustomFields.setNumber(commandRequest.fieldName, currentValueAdd + value);
                        break;

                    case StoryCommandType.SUBTRACT:
                        const currentValueSubtract = CustomFields.getNumber(commandRequest.fieldName);
                        if (typeof currentValueSubtract !== "number") {
                            throw new Error(currentValueSubtract); // Handle "WARN: key UNDEFINED"
                        }
                        CustomFields.setNumber(commandRequest.fieldName, currentValueSubtract - value);
                        break;
                }
            } else {
                return CustomFields.getNumber(commandRequest.fieldName).toString();
            }

            // Handling the STRING field type
        } else if (commandRequest.fieldType === CustomFieldType.STRING) {
            switch (commandRequest.commandType) {
                case StoryCommandType.GET:
                    return CustomFields.getString(commandRequest.fieldName);

                case StoryCommandType.SET:
                    CustomFields.setString(commandRequest.fieldName, commandRequest.fieldValue || "");
                    break;

                case StoryCommandType.ADD:
                case StoryCommandType.SUBTRACT:
                    throw new Error(`Cannot perform ${commandRequest.commandType} operation on STRING type.`);
            }

            // Handling the IMAGE field type, only GET is allowed
        } else if (commandRequest.fieldType === CustomFieldType.IMAGE) {
            if (commandRequest.commandType === StoryCommandType.GET) {
                return `<IMAGE ${commandRequest.fieldName}>`;
            } else {
                throw new Error("IMAGE field type can only be used with GET command.");
            }
        }

        return "";
    }
}

export enum StoryCommandType {
    SET,
    GET,
    ADD,
    SUBTRACT
}
