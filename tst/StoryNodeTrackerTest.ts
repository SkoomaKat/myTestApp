import {parseCommands} from "@/src/StoryNodeTracker";
import {CustomFields} from "@/src/persistance/CustomFields";


function mockGetString(key: string, value: string) {
    jest.spyOn(CustomFields, 'getString').mockImplementation((k: string) => k === key ? value : "");
}

function mockGetNumber(key: string, value: number) {
    jest.spyOn(CustomFields, 'getNumber').mockImplementation((k: string) => k === key ? value : -1);
}

const test_text = 'Test Text'


describe('parseCommands tests', () => {
    beforeEach(() => {
        // Mock the CustomFields methods before each test
        jest.spyOn(CustomFields, 'setString').mockImplementation(jest.fn());
        jest.spyOn(CustomFields, 'setNumber').mockImplementation(jest.fn());


        jest.spyOn(CustomFields, 'getString').mockImplementation(jest.fn());
        jest.spyOn(CustomFields, 'getNumber').mockImplementation(jest.fn());

        //CustomFields.setString('NAME', '');
        //CustomFields.setNumber('HEALTH', 100);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should replace a single SET STRING command and update CustomFields', () => {
        const storyText = 'Hello, <SET STRING NAME ANDREW>';
        const expectedText = 'Hello, ';

        const result = parseCommands(storyText);

        expect(CustomFields.setString).toHaveBeenCalledWith('NAME', 'ANDREW');
        expect(result.newText).toBe(expectedText);
    });

    it('should replace multiple SET commands and update CustomFields', () => {
        const storyText = test_text + '<SET STRING NAME JOHN><SET NUMBER HEALTH 90>';
        const expectedText = test_text;

        const result = parseCommands(storyText);

        expect(CustomFields.setString).toHaveBeenCalledWith('NAME', 'JOHN');
        expect(CustomFields.setNumber).toHaveBeenCalledWith('HEALTH', 90);

        expect(result.newText).toBe(expectedText);
    });

    it('should replace GET STRING command with value from CustomFields', () => {
        const storyText = 'Hello <GET STRING NAME>';
        const expectedText = test_text + ' ';

        mockGetString('NAME', 'ANDREW')
        const result = parseCommands(storyText);

        expect(CustomFields.getString).toHaveBeenCalledWith('NAME', false);
        expect(result.newText).toBe('Hello ANDREW');
    });

    it('should correctly handle ADD NUMBER command', () => {
        const storyText = 'Current score is <ADD NUMBER SCORE 5>';
        const expectedText = 'Current score is ';
        mockGetNumber('SCORE', 5);

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
        expect(CustomFields.setNumber).toHaveBeenCalledWith('SCORE', 10);
    });

    it('should throw an error for invalid command types', () => {
        const storyText = 'This is an invalid command <INVALID STRING NAME>';

        expect(() => parseCommands(storyText)).toThrowError('Invalid command type: INVALID');
    });

    it('should handle multiple commands within the same text', () => {
        const storyText = 'The name is <GET STRING NAME> and the health is <GET NUMBER HEALTH>';
        const expectedText = 'The name is JAMES and the health is 8';

        mockGetString('NAME', 'JAMES');
        mockGetNumber('HEALTH', 8);

        const result = parseCommands(storyText);

        expect(CustomFields.getNumber).toHaveBeenCalledWith('HEALTH');
        expect(CustomFields.getString).toHaveBeenCalledWith('NAME', false);

        expect(result.newText).toBe(expectedText);});

    it('should return unchanged text when no commands are present', () => {
        const storyText = 'This is a simple story with no commands.';
        const expectedText = storyText;

        const result = parseCommands(storyText);

        expect(result.newText).toBe(expectedText);
    });


    it('should throw an error when ADD NUMBER is used on undefined fields', () => {
        const storyText = 'Your new score is <ADD NUMBER SCORE2 10>';
        expect(() => parseCommands(storyText)).toThrow();
    });
});
