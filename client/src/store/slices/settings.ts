import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// export ထည့်ပေးရန် လိုအပ်ပါသည် (store/index.ts တွင် သုံးနိုင်ရန်)
export interface SettingsState {
  lang: "en" | "mm";
  aiEnabled: boolean;
}

const initialState: SettingsState = {
  lang: (localStorage.getItem("lang") as "en" | "mm") || "en",
  aiEnabled: localStorage.getItem("aiEnabled") !== "false",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<"en" | "mm">) => {
      state.lang = action.payload;
      localStorage.setItem("lang", action.payload);
    },
    toggleAI: (state) => {
      state.aiEnabled = !state.aiEnabled;
      localStorage.setItem("aiEnabled", state.aiEnabled.toString());
    },
  },
});

export const { setLanguage, toggleAI } = settingsSlice.actions;
export default settingsSlice.reducer;
