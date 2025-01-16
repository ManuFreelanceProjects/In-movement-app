import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./navigation/AppNavigation";

export default function RootLayout() {
  return(
    <SafeAreaProvider>
      <AppNavigation/>
    </SafeAreaProvider>
  );
}