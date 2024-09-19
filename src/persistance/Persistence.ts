import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomFields} from "@/src/persistance/CustomFields";
import {CUR_NODE} from "@/src/app/storyScreenConstants";

export enum Profile {
    P1 = "profile_1",
    P2 = "profile_2",
    P3 = "profile_3",
    P4 = "profile_4"
}


export class Persistence {
    private static customStrings: Map<string, string> = new Map();
    private static customNumbers: Map<string, number> = new Map();
    private static _cur_profile: Profile = Profile.P1;

    public static async saveGame() {
        console.log("Saving...")
        let state = new Map<string, any>;

        state.set('customNumbers', Object.fromEntries(CustomFields.numbers));
        state.set('customStrings', Object.fromEntries(CustomFields.strings));

        const save_state = Object.fromEntries(state);

        console.log(`state: ${[JSON.stringify(save_state)]}`)
        const saveData = JSON.stringify(save_state)

        console.log(`Saving Profile ${this._cur_profile}: ${saveData}`)

        AsyncStorage.setItem(this._cur_profile, saveData)
            .then(() => {
                if(!CustomFields.getString(CUR_NODE)) {
                    console.log(`Profile ${this._cur_profile} not found, creating.`);
                    CustomFields.setString(CUR_NODE, "0");
                }
                console.log(`Profile ${this._cur_profile} saved successfully.`);
            });
    }

    public static async loadGame() {
        console.log("Loading...");

        return AsyncStorage.getItem(this._cur_profile)
            .then((value) => {
                console.log(`Loaded ${this._cur_profile}: ${value}`);

                if (value != null) {
                    console.log("Loading existing save.");
                    const parsedState = JSON.parse(value) || {};

                    // Convert regular objects to Maps
                    const state = new Map(Object.entries(parsedState));
                    console.log(`${this._cur_profile}: ${value}`);

                    const numbers = new Map(Object.entries(state.get('customNumbers') || {}));
                    const strings = new Map(Object.entries(state.get('customStrings') || {}));

                    if (strings.has(CUR_NODE)) {
                        console.log("Node Defined.");
                        CustomFields.clear();

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

    public static delete_profile() {
        console.log("Deleting...")
        const profileToDelete = this._cur_profile;
        let state = new Map<string, any>;

        state.set('customNumbers', Object.fromEntries(new Map<string, any>));
        state.set('customStrings', Object.fromEntries(new Map<string, any>));

        const save_state = Object.fromEntries(state);

        console.log(`state: ${[JSON.stringify(save_state)]}`)
        const saveData = JSON.stringify(save_state)

        console.log(`Deleting Profile ${profileToDelete}: ${saveData}`)

        AsyncStorage.setItem(profileToDelete, saveData)
            .then(() => {
                console.log(`Profile ${profileToDelete} deleted successfully.`);
            });
    }

    public static setProfile(profile: Profile) {
        this._cur_profile = profile;
    }

    public static get cur_profile() {return this._cur_profile}

}
