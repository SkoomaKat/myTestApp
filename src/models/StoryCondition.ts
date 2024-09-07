import {CustomFieldType} from "@/src/models/CustomFields";


export interface StoryCondition {
    comparisonType: CustomFieldType,
    fieldKey: string,
    comparison: Comparison,
    toFieldKey: string
}


export enum Comparison {
    GREATER_THAN,
    LESS_THAN,
    EQUAL_TO
}
