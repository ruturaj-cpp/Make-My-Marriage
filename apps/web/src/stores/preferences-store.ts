import { create } from 'zustand';

type PreferencesState = {
  preferredLanguage: 'en' | 'mr' | 'hi';
  setPreferredLanguage: (language: 'en' | 'mr' | 'hi') => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  preferredLanguage: 'en',
  setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
}));
