import { textsCA } from "@/translations/ca-ES";
import { textsEN } from "@/translations/en-US";
import { textsES } from "@/translations/es-ES";
import { NativeModules, Platform } from "react-native";

export type texts = {
    Reservate: string,
    Cancel: string,
    Train: string,
    Calendar: string,
    ErrorFetchingReserves: string,
    NotReservationsForThisDay: string,
    SeeEvery: string,
    Students: string,
    Rutines: string,
    SeeEveryFem: string,
    CreatorOfRoutines: string,
    Name: string,
    Description: string,
    Days: string,
    Cycles: string,
    Duration: string,
    Percentage: string,
    Exercises: string,
    AddExercise: string,
    Series: string,
    Repetitions: string,
    SaveRoutine: string,
}

const supportedLangs = ['es-ES', 'en-US', 'ca-ES'];


export function useText() {
    let deviceLanguage;
    if (Platform.OS === 'ios') {
        deviceLanguage = NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else if (Platform.OS === 'android') {
        deviceLanguage = NativeModules.I18nManager.localeIdentifier;
    } else {
        deviceLanguage = 'es-ES'
    }

    switch (deviceLanguage) {
        case "es-ES":
            return textsES;
        case "ca-ES":
            return textsCA;
        default:
            return textsEN;
    }
}