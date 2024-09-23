import {CustomFields} from "@/src/persistance/CustomFields";

describe('CustomFields', () => {

    beforeEach(() => {
        CustomFields.clear(); // Ensure fields are cleared before each test
    });

    describe('setString', () => {
        it('should set and retrieve a string value', () => {
            CustomFields.setString('testKey', 'testValue');
            expect(CustomFields.getString('testKey')).toBe('testValue');
        });

        it('should throw an error when trying to get a string not set', () => {
            expect(() => CustomFields.getString('missingKey')).toThrow('Attempted to retrieve CustomFields unset string: missingKey');
        });

        it('should return a wrapped string if wrapped flag is true', () => {
            CustomFields.setString('testKey', 'testValue');
            expect(CustomFields.getString('testKey', true)).toBe('"testValue"');
        });
    });

    describe('setNumber', () => {
        it('should set and retrieve a number value', () => {
            CustomFields.setNumber('testKey', 42);
            expect(CustomFields.getNumber('testKey')).toBe(42);
        });

        it('should throw an error when trying to get a number not set', () => {
            expect(() => CustomFields.getNumber('missingKey')).toThrow('Attempted to retrieve CustomFields unset number: missingKey');
        });
    });

    describe('getStringOrElse', () => {
        it('should return the string if the key exists', () => {
            CustomFields.setString('testKey', 'testValue');
            expect(CustomFields.getStringOrElse('testKey', 'default')).toBe('testValue');
        });

        it('should return the fallback value if the key does not exist', () => {
            expect(CustomFields.getStringOrElse('missingKey', 'default')).toBe('default');
        });
    });

    describe('strings and numbers getters', () => {
        it('should return a map of all strings', () => {
            CustomFields.setString('key1', 'value1');
            CustomFields.setString('key2', 'value2');

            const strings = CustomFields.strings;
            expect(strings.size).toBe(2);
            expect(strings.get('key1')).toBe('value1');
            expect(strings.get('key2')).toBe('value2');
        });

        it('should return a map of all numbers', () => {
            CustomFields.setNumber('key1', 10);
            CustomFields.setNumber('key2', 20);

            const numbers = CustomFields.numbers;
            expect(numbers.size).toBe(2);
            expect(numbers.get('key1')).toBe(10);
            expect(numbers.get('key2')).toBe(20);
        });
    });

    describe('clear', () => {
        it('should clear all custom fields', () => {
            CustomFields.setString('key1', 'value1');
            CustomFields.setNumber('key2', 10);

            CustomFields.clear();

            expect(() => CustomFields.getString('key1')).toThrow();
            expect(() => CustomFields.getNumber('key2')).toThrow();
        });
    });

});
