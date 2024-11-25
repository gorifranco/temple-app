import { calendarLocalecaES, textsCA } from "@/translations/ca-ES";
import { calendarLocaleenUS, textsEN } from "@/translations/en-US";
import { calendarLocaleesES, textsES } from "@/translations/es-ES";
import { NativeModules, Platform } from "react-native";

function getDeviceLanguage() {
    if (Platform.OS === 'ios') {
        return NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else if (Platform.OS === 'android') {
        return NativeModules.I18nManager.localeIdentifier;
    } else {
        return 'es-ES'
    }
}

export type texts = {
    Reservate: string,
    Cancel: string,
    Confirm: string,
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
    LoadingRoutines: string,
    AddRoutine: string,
    ThisScreenDoesntExist: string,
    AddStudent: string,
    TrainerCode: string,
    Share: string,
    CreateStudent: string,
    AssignRoutine: string,
    From: string,
    To: string,
    To2: string,
    Select: string,
    ErrorLoadingStudents: string,
    ErrorLoadingStudent: string,
    WithoutAssignedRoutine: string,
    ErrorLoadingRoutine: string,
    Week: string,
    Month: string,
    Year: string,
    Weight: string,
    Save: string,
    Shedule: string,
    SaveShedule: string,
    Delete: string,
    Finish: string,
    Edit: string,
    Update: string,
    DeleteRoutine: string,
    FinishRoutine: string,
    SureDeleteRoutine: string,
    RoutineWillFinish: string,
}

const supportedLangs = ['es-ES', 'en-US', 'ca-ES'];

export function calendarLocales() {
    const deviceLanguage = getDeviceLanguage();
    switch (deviceLanguage) {
        case "es-ES":
            return calendarLocaleesES;
        case "ca-ES":
            return calendarLocalecaES;
        default:
            return calendarLocaleenUS;
    }

}

export function useText() {
    const deviceLanguage = getDeviceLanguage();

    switch (deviceLanguage) {
        case "es-ES":
            return textsES;
        case "ca-ES":
            return textsCA;
        default:
            return textsEN;
    }
}