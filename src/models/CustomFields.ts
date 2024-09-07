

export class CustomFields {
    private static customStrings: Map<string, string> = new Map();
    private static customNumbers: Map<string, number> = new Map();

    public static setString(key: string, value: string) {
        this.customStrings.set(key, value)
    }

    public static setNumber(key: string, value: number) {
        this.customNumbers.set(key, value)
    }

    public static getString(key: string ) {
        return this.customStrings.get(key) || `WARN: ${key} UNDEFINED`;
    }

    public static getNumber(key: string) {
        return this.customNumbers.get(key) || `WARN: ${key} UNDEFINED`;
    }
}

export enum CustomFieldType {
    NUMBER,
    STRING,
    IMAGE
}
