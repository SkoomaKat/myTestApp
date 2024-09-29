import {CustomFields, CustomFieldType} from "@/src/persistance/CustomFields";


export interface StoryCommandRequest {
    commandType: StoryCommandType,
    fieldType: CustomFieldType,
    fieldName: string,
    fieldValue?: string
}

export class StoryCommand {

    static resolveCommand(commandRequest: StoryCommandRequest, wrapped: boolean = false): string {
        if (this.requiresFieldValue(commandRequest) && !commandRequest.fieldValue) {
            throw new Error("Cannot modify CustomField without a value");
        }

        if (commandRequest.fieldType === CustomFieldType.NUMBER) {
            return this.handleNumberField(commandRequest);
        } else if (commandRequest.fieldType === CustomFieldType.STRING) {
            return this.handleStringField(commandRequest, wrapped);
        } else if (commandRequest.fieldType === CustomFieldType.IMAGE) {
            return this.handleImageField(commandRequest);
        }

        return "";
    }

    private static handleNumberField(commandRequest: StoryCommandRequest): string {
        if (commandRequest.commandType === StoryCommandType.GET) {
            return CustomFields.getNumber(commandRequest.fieldName).toString();
        }

        const value = this.parseFieldValueAsNumber(commandRequest.fieldValue);

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

        if (commandRequest.commandType === StoryCommandType.SET) {
            CustomFields.setNumber(commandRequest.fieldName, value);
        }

        if (commandRequest.commandType === StoryCommandType.ADD || commandRequest.commandType === StoryCommandType.SUBTRACT) {
            const currentValue = CustomFields.getNumber(commandRequest.fieldName);
            this.ensureNumberFieldIsValid(currentValue);
            const newValue = commandRequest.commandType === StoryCommandType.ADD ? currentValue + value : currentValue - value;

            CustomFields.setNumber(commandRequest.fieldName, newValue);
        }

        return "";
    }

    static handleStringField(commandRequest: StoryCommandRequest, wrapped: boolean): string {
        switch (commandRequest.commandType) {
            case StoryCommandType.GET:
                return CustomFields.getString(commandRequest.fieldName, wrapped);
            case StoryCommandType.SET:
                CustomFields.setString(commandRequest.fieldName, commandRequest.fieldValue || "");
                break;
            case StoryCommandType.ADD:
            case StoryCommandType.SUBTRACT:
                throw new Error(`Cannot perform ${commandRequest.commandType} operation on STRING type.`);
        }
        return "";
    }

    private static ensureNumberFieldIsValid(currentValue: any) {
        if (typeof currentValue !== "number") {
            throw new Error(currentValue);
        }
    }

    static handleImageField(commandRequest: StoryCommandRequest): string {
        if (commandRequest.commandType === StoryCommandType.GET) {
            return `<IMAGE ${commandRequest.fieldName}>`;
        }
        throw new Error("IMAGE field type can only be used with GET command.");
    }

    private static parseFieldValueAsNumber(fieldValue?: string): number {
        const value = parseInt(fieldValue || "");
        if (isNaN(value)) {
            throw new Error(`Invalid number: ${fieldValue}`);
        }
        return value;
    }

    private static requiresFieldValue(commandRequest: StoryCommandRequest): boolean {
        return [StoryCommandType.SET, StoryCommandType.ADD, StoryCommandType.SUBTRACT].includes(commandRequest.commandType);
    }

    private static resolveCustomCommand(commandRequest: StoryCommandRequest) {

    }
}

export enum StoryCommandType {
    SET,
    GET,
    ADD,
    SUBTRACT
}
