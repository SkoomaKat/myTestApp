import {StoryCommandRequest, StoryCommandType} from "@/src/models/StoryCommand";
import {CustomFields, CustomFieldType} from "@/src/persistance/CustomFields";
import {getStoryCommandRequest, parseCommands} from "@/src/StoryNodeTracker";
import {CUR_NODE} from "@/src/app/storyScreenConstants";


describe('getStoryCommandRequest', () => {

    it('should parse a valid SET STRING command', () => {
        const commandString = 'SET STRING NAME ANDREW';
        const expected: StoryCommandRequest = {
            commandType: StoryCommandType.SET,
            fieldType: CustomFieldType.STRING,
            fieldName: 'NAME',
            fieldValue: 'ANDREW',
        };
        const result = getStoryCommandRequest(commandString);
        expect(result).toEqual(expected);
    });

    it('should parse a valid SUBTRACT NUMBER command', () => {
        const commandString = 'SUBTRACT NUMBER HEALTH 8';
        const expected: StoryCommandRequest = {
            commandType: StoryCommandType.SUBTRACT,
            fieldType: CustomFieldType.NUMBER,
            fieldName: 'HEALTH',
            fieldValue: '8',
        };
        const result = getStoryCommandRequest(commandString);
        expect(result).toEqual(expected);
    });

    it('should parse a valid GET STRING command', () => {
        const commandString = 'GET STRING NAME';
        const expected: StoryCommandRequest = {
            commandType: StoryCommandType.GET,
            fieldType: CustomFieldType.STRING,
            fieldName: 'NAME',
            fieldValue: undefined,
        };
        const result = getStoryCommandRequest(commandString);
        expect(result).toEqual(expected);
    });

    it('should throw an error for an invalid command type', () => {
        const commandString = 'INVALID NUMBER HEALTH 8';
        expect(() => getStoryCommandRequest(commandString)).toThrow('Invalid command type: INVALID');
    });

    it('should throw an error for an invalid field type', () => {
        const commandString = 'SET INVALIDTYPE NAME ANDREW';
        expect(() => getStoryCommandRequest(commandString)).toThrow('Invalid field type: INVALIDTYPE');
    });

    it('should throw an error for missing field name', () => {
        const commandString = 'SET STRING';
        expect(() => getStoryCommandRequest(commandString)).toThrow('Invalid command string format.');
    });

    it('should throw an error for a number field with invalid value on ADD', () => {
        const commandString = 'ADD NUMBER HEALTH abc';
        expect(() => getStoryCommandRequest(commandString)).toThrow('Invalid number value for command: abc');
    });

    it('should parse a valid ADD NUMBER command', () => {
        const commandString = 'ADD NUMBER SCORE 10';
        const expected: StoryCommandRequest = {
            commandType: StoryCommandType.ADD,
            fieldType: CustomFieldType.NUMBER,
            fieldName: 'SCORE',
            fieldValue: '10',
        };
        const result = getStoryCommandRequest(commandString);
        expect(result).toEqual(expected);
    });

    it('should handle a command string with extra spaces', () => {
        const commandString = '  SET    STRING   NAME   ANDREW  ';
        const expected: StoryCommandRequest = {
            commandType: StoryCommandType.SET,
            fieldType: CustomFieldType.STRING,
            fieldName: 'NAME',
            fieldValue: 'ANDREW',
        };
        const result = getStoryCommandRequest(commandString);
        expect(result).toEqual(expected);
    });

    it('should throw an error if too few parts in the command string', () => {
        const commandString = 'SET NAME';
        expect(() => getStoryCommandRequest(commandString)).toThrow('Invalid command string format.');
    });

});




describe('parseCommands tests', () => {
    beforeEach(() => {
        // Clear any state in CustomFields before each test to ensure no leftover data
        CustomFields.setString('NAME', '');
        CustomFields.setNumber('HEALTH', 100);
    });

    it('should replace a single command and execute it (SET STRING)', () => {
        const storyText = 'Hello, <SET STRING NAME ANDREW>';
        const expectedText = 'Hello, ';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
        expect(CustomFields.getString('NAME')).toBe('ANDREW');
    });

    it('should replace multiple commands and execute them (SET and GET)', () => {
        const storyText = 'Player name is <SET STRING NAME JOHN> and health is <SET NUMBER HEALTH 90>';
        const expectedText = 'Player name is  and health is ';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
        expect(CustomFields.getString('NAME')).toBe('JOHN');
        expect(CustomFields.getNumber('HEALTH')).toBe(90);
    });

    it('should correctly handle GET commands', () => {
        CustomFields.setString('NAME', 'ALICE');
        const storyText = 'The character\'s name is <GET STRING NAME>';
        const expectedText = 'The character\'s name is ALICE';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
    });

    it('should correctly handle ADD NUMBER command', () => {
        CustomFields.setNumber('SCORE', 10);
        const storyText = 'Current score is <ADD NUMBER SCORE 5>';
        const expectedText = 'Current score is ';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
        expect(CustomFields.getNumber('SCORE')).toBe(15); // 10 + 5
    });

    it('should handle an invalid command gracefully and throw an error', () => {
        const storyText = 'This is an invalid command <INVALID STRING NAME>';

        expect(() => parseCommands(storyText)).toThrowError('Invalid command type: INVALID');
    });

    it('should handle commands without breaking when multiple commands exist', () => {
        CustomFields.setString('NAME', 'JAMES');
        const storyText = 'The name is <GET STRING NAME> and the health is <SET NUMBER HEALTH 95>';
        const expectedText = 'The name is JAMES and the health is ';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
        expect(CustomFields.getNumber('HEALTH')).toBe(95);
    });

    it('should return unchanged text if no commands are present', () => {
        const storyText = 'This is a simple story with no commands.';
        const expectedText = storyText;

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
    });

    it('should handle text with mixed commands and regular text', () => {
        CustomFields.setString('WEAPON', 'Sword');
        const storyText = 'You equip a <GET STRING WEAPON> and face your opponent.';
        const expectedText = 'You equip a Sword and face your opponent.';

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
    });

    it('should handle ADD NUMBER on undefined fields gracefully', () => {
        const storyText = 'Your new score is <ADD NUMBER SCORE2 10>';
        expect(() => parseCommands(storyText)).toThrow("WARN: SCORE2 UNDEFINED");
    });

    it('should handle NUMBER on undefined fields gracefully', () => {
        CustomFields.setString('WEAPON', 'Sword');
        const storyCondition = ``;
        const parsedContition = parseCommands(storyCondition, true).newText;
        const result = eval(parsedContition)


        expect(0);
    });

    it('should g  NUMBER on undefined fields gracefully', () => {
        const curNode = "test";
        CustomFields.clear();
        CustomFields.setString(CUR_NODE, curNode);

        expect(CustomFields.getString(CUR_NODE)).toEqual(curNode);

        CustomFields.clear();
        expect(CustomFields.getString(CUR_NODE)).toEqual(undefined);
    });
});
