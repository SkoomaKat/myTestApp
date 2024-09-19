import {CUR_CHAPTER, CUR_NODE, STORY_STACK} from "@/src/app/storyScreenConstants";
import {Persistence} from "@/src/persistance/Persistence";


export class CustomFields {
    private static customStrings: Map<string, string> = new Map();
    private static customNumbers: Map<string, number> = new Map();

    public static setString(key: string, value: string) {
        this.customStrings.set(key, value)
    }

    public static setNumber(key: string, value: number) {
        this.customNumbers.set(key, value)
    }

    public static getString(key: string, wrapped: boolean = false) {
        if (key == CUR_NODE || key == CUR_CHAPTER || key == STORY_STACK) {
            return this.customStrings.get(key);
        }

        if (wrapped) return `"${this.customStrings.get(key)}"` || `WARN: ${key} UNDEFINED`;
        return this.customStrings.get(key) || `WARN: ${key} UNDEFINED`;
    }

    public static getNumber(key: string) {
        return this.customNumbers.get(key) || `WARN: ${key} UNDEFINED`;
    }

    public static get strings() {
        return new Map(this.customStrings);
    }

    public static get numbers() {
        return new Map(this.customNumbers);
    }

    public static clear() {
        this.customNumbers = new Map();
        this.customStrings = new Map();
    }
}

export enum CustomFieldType {
    NUMBER,
    STRING,
    IMAGE
}
