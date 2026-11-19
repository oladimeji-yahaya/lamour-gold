import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExperienceKey } from '@/constants/options';

export type Photo = { id: string; uri: string };
export type Prompt = { question: string; answer: string };

export type OnboardingData = {
  // Step 1 (private fields: lastName, dob)
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  meet: string[];
  city: string;
  country: string;
  // Step 2 (all optional)
  heightCm?: number;
  bodyType?: string;
  education?: string;
  profession?: string;
  industry?: string;
  languages: string;
  religion?: string;
  relationshipStatus?: string;
  hasChildren?: string;
  wantsChildren?: string;
  // Step 3
  smoking?: string;
  drinking?: string;
  fitness?: string;
  social?: string;
  travel: string[];
  food: string[];
  hobbies: string[];
  music: string[];
  weekend: string[];
  values: string[];
  // Step 4
  bio: string;
  prompts: Prompt[];
  unique: string;
  idealDate: string;
  communication: string[];
  relationshipValues: string[];
  // Step 5: stored separately from core profile data
  experiences: ExperienceKey[];
  // Step 6
  photos: Photo[];
};

const initial: OnboardingData = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  meet: [],
  city: '',
  country: '',
  languages: '',
  travel: [],
  food: [],
  hobbies: [],
  music: [],
  weekend: [],
  values: [],
  bio: '',
  prompts: [
    { question: 'A perfect Sunday looks like…', answer: '' },
    { question: 'I get along best with people who…', answer: '' },
    { question: 'The way to win me over is…', answer: '' },
  ],
  unique: '',
  idealDate: '',
  communication: [],
  relationshipValues: [],
  experiences: [],
  photos: [],
};

type Store = {
  data: OnboardingData;
  completedSteps: number[];
  published: boolean;
  update: (patch: Partial<OnboardingData>) => void;
  completeStep: (n: number) => void;
  publish: () => void;
  reset: () => void;
};

// Persisted locally so users can leave and continue later without losing progress.
export const useOnboarding = create<Store>()(
  persist(
    (set) => ({
      data: initial,
      completedSteps: [],
      published: false,
      update: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
      completeStep: (n) =>
        set((s) => (s.completedSteps.includes(n) ? s : { completedSteps: [...s.completedSteps, n] })),
      publish: () => set({ published: true }),
      reset: () => set({ data: initial, completedSteps: [], published: false }),
    }),
    { name: 'lamour-onboarding-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
