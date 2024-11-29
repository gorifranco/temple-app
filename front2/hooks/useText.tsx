import { calendarLocalecaES, textsCA } from "@/translations/ca-ES";
import { calendarLocaleenUS, textsEN } from "@/translations/en-US";
import { calendarLocaleesES, textsES } from "@/translations/es-ES";
import { NativeModules, Platform } from "react-native";
import React, { createContext, useContext, useMemo, ReactNode } from "react";

function getDeviceLanguage() {
  try {
    if (Platform.OS === "ios") {
      const settings = NativeModules.SettingsManager.settings;
      return settings.AppleLocale || settings.AppleLanguages?.[0] || "es-ES";
    } else if (Platform.OS === "android") {
      const locale = NativeModules.I18nManager?.localeIdentifier;
      return locale || "es-ES";
    } else {
      return "es-ES";
    }
  } catch (error) {
    console.log("Error getting device language:", error);
    return "es-ES";
  }
}

export type texts = {
  Reservate: string;
  Reservations: string,
  Cancel: string;
  Confirm: string;
  Train: string;
  Calendar: string;
  ErrorFetchingReserves: string;
  NotReservationsForThisDay: string;
  SeeEvery: string;
  Students: string;
  Routine: string;
  Rutines: string;
  SeeEveryFem: string;
  CreatorOfRoutines: string;
  Name: string;
  Description: string;
  Days: string;
  Cycles: string;
  Duration: string;
  Percentage: string;
  Exercises: string;
  AddExercise: string;
  Series: string;
  Repetitions: string;
  SaveRoutine: string;
  LoadingRoutines: string;
  AddRoutine: string;
  ThisScreenDoesntExist: string;
  AddStudent: string;
  TrainerCode: string;
  Share: string;
  CreateStudent: string;
  AssignRoutine: string;
  From: string;
  To: string;
  To2: string;
  Select: string;
  ErrorLoadingStudents: string;
  ErrorLoadingStudent: string;
  WithoutAssignedRoutine: string;
  ErrorLoadingRoutine: string;
  Week: string;
  Month: string;
  Year: string;
  Weight: string;
  Save: string;
  Shedule: string;
  SaveShedule: string;
  Delete: string;
  Finish: string;
  Edit: string;
  Update: string;
  DeleteRoutine: string;
  FinishRoutine: string;
  SureDeleteRoutine: string;
  RoutineWillFinish: string;
  LoadingStudents: string;
  LoadingStudent: string;
  MaxStudentsReached: string;
  WithoutRoutine: string;
  WithoutRoutines: string;
  SelectDay: string;
  WithoutReservations: string;
  IncomingTrainings: string;
  CurrentRoutine: string;
  Kick: string;
  KickStudent: string;
  SureWantKickStudent: string;
  Password: string;
  WelcomeBack: string;
  DontHaveAccount: string;
  SignUp: string;
  ForgotPassword: string;
  CreateAccount: string;
  AlreadyHaveAccount: string;
  SignIn: string;
  RestorePassword: string;
  SendInstructions: string;
  TrainingOfTheDay: string;
  Reps: string
};

const supportedLangs = ["es-ES", "en-US", "ca-ES"];

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

const TranslationContext = createContext<texts|null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const deviceLanguage = getDeviceLanguage();

  const texts:texts = useMemo(() => {
    switch (deviceLanguage) {
      case 'es-ES':
        return textsES;
      case 'ca-ES':
        return textsCA;
      default:
        return textsEN;
    }
  }, [deviceLanguage]);

  return (
    <TranslationContext.Provider value={texts}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useText(): texts {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTexts debe ser usado dentro de TranslationProvider');
  }
  return context;
}