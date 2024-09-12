import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomFields} from "@/src/persistance/CustomFields";
import {CUR_NODE} from "@/src/app/storyScreenConstants";


export class Persistence {
    private static customStrings: Map<string, string> = new Map();
    private static customNumbers: Map<string, number> = new Map();

    public static async saveGame(profile: string) {
        console.log("Saving...")
        let state = new Map<string, any>;

        state.set('customNumbers', Object.fromEntries(CustomFields.numbers));
        state.set('customStrings', Object.fromEntries(CustomFields.strings));

        const save_state = Object.fromEntries(state);

        console.log(`state: ${[JSON.stringify(save_state)]}`)
        const saveData = JSON.stringify(save_state)

        console.log(`Saving Profile ${profile}: ${saveData}`)

        AsyncStorage.setItem(profile, saveData)
            .then(() => {
                if(!CustomFields.getString(CUR_NODE)) {
                    console.log(`Profile ${profile} not found, creating.`);
                    CustomFields.setString(CUR_NODE, "0");
                }
                console.log(`Profile ${profile} saved successfully.`);
            });
    }

    public static async loadGame(profile: string) {
        console.log("Loading...");

        return AsyncStorage.getItem(profile)
            .then((value) => {
                console.log(`Loaded ${profile}: ${value}`);

                if (value != null) {
                    console.log("Loading existing save.");
                    const parsedState = JSON.parse(value) || {};

                    // Convert regular objects to Maps
                    const state = new Map(Object.entries(parsedState));
                    console.log(`${profile}: ${value}`);

                    const numbers = new Map(Object.entries(state.get('customNumbers') || {}));
                    const strings = new Map(Object.entries(state.get('customStrings') || {}));

                    if (strings.has(CUR_NODE)) {
                        console.log("Node Defined.");

                        numbers.forEach((value, key) => CustomFields.setNumber(key, value));
                        strings.forEach((value, key) => CustomFields.setString(key, value));
                        return true;
                    } else {
                        console.log("No save profile found, creating new profile.");

                        CustomFields.clear();
                        CustomFields.setString(CUR_NODE, "0");
                        return true;
                    }
                }
                return false;
            });
    }

}
