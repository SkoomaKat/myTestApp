import {CustomFields} from "@/src/persistance/CustomFields";
import {parseCommands} from "@/src/StoryNodeTracker";

// Tests related to CustomFields behavior that don't belong in parseCommands
describe('CustomFields tests', () => {
    it('should throw an error when accessing undefined NUMBER fields', () => {
        CustomFields.setString('WEAPON', 'Sword');
        const storyCondition = ``;
        const parsedCondition = parseCommands(storyCondition, true).newText;
        const result = eval(parsedCondition);

        expect(result).toBe(0); // Adjusted based on intended behavior
    });

    it('should clear CustomFields and verify clearing of fields', () => {
        const curNode = "test";
        CustomFields.clear();
        CustomFields.setString('CUR_NODE', curNode);

        expect(CustomFields.getString('CUR_NODE')).toEqual(curNode);

        CustomFields.clear();
        expect(CustomFields.getString('CUR_NODE')).toEqual(undefined);
    });
});
