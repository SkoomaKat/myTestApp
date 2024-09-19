import {CUR_CHAPTER, CUR_NODE, STORY_STACK} from "@/src/app/storyScreenConstants";


export class CustomFields {
    private static customStrings: Map<string, string> = new Map();
    private static customNumbers: Map<string, number> = new Map();

    public static setString(key: string, value: string) {
        this.customStrings.set(key, value)
    }

    public static setNumber(key: string, value: number) {
        this.customNumbers.set(key, value)
    }

    public static getStringOrElse(key: string, orElse: any) {
        return this.customStrings.get(key) || orElse;
    }

    public static getString(key: string, wrapped: boolean = false) {
        const value = this.customStrings.get(key);

        if (value) {
            return wrapped ? `"${value}"` : value;
        } else {
            throw Error(`Attempted to retrieve CustomFields unset string: ${key}`);
        }
    }

    public static getNumber(key: string) {
        const value = this.customNumbers.get(key);

        if (value) {
            return value;
        } else {
            throw Error(`Attempted to retrieve CustomFields unset number: ${key}`);
        }
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
