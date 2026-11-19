import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExperienceKey } from '@/constants/options';
import type { DateInvite, Msg } from '@/data/types';

export type Filters = { ageMin: number; ageMax: number; maxDistanceKm: number; interest: string | null; verifiedOnly: boolean };

export const DEFAULT_FILTERS: Filters = { ageMin: 21, ageMax: 45, maxDistanceKm: 50, interest: null, verifiedOnly: false };

type State = {
  experience: ExperienceKey;
  filters: Filters;
  liked: string[];
  passed: string[];
  saved: string[];
  blocked: string[];
  reported: string[];
  matches: { profileId: string; at: number }[];
  messages: Record<string, Msg[]>;
  unread: Record<string, number>;
  dates: DateInvite[];
  setExperience: (e: ExperienceKey) => void;
  setFilters: (f: Partial<Filters>) => void;
  /** Returns true if the like produced a (simulated) mutual match. */
  like: (id: string, theyLikeMe: boolean) => boolean;
  pass: (id: string) => void;
  toggleSave: (id: string) => void;
  block: (id: string) => void;
  unblock: (id: string) => void;
  report: (id: string) => void;
  unmatch: (id: string) => void;
  sendMessage: (id: string, text: string) => void;
  receiveSimulated: (id: string, text: string) => void;
  markRead: (id: string) => void;
  addDate: (d: Omit<DateInvite, 'id' | 'createdAt' | 'status'>) => void;
  setDateStatus: (id: string, status: DateInvite['status']) => void;
  resetDemo: () => void;
};

const fresh = {
  experience: 'love' as ExperienceKey,
  filters: DEFAULT_FILTERS,
  liked: [] as string[],
  passed: [] as string[],
  saved: [] as string[],
  blocked: [] as string[],
  reported: [] as string[],
  matches: [] as { profileId: string; at: number }[],
  messages: {} as Record<string, Msg[]>,
  unread: {} as Record<string, number>,
  dates: [] as DateInvite[],
};

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// DEMO STORE: everything here is simulated and persisted on this device only.
export const useApp = create<State>()(
  persist(
    (set, get) => ({
      ...fresh,
      setExperience: (experience) => set({ experience }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      like: (id, theyLikeMe) => {
        const s = get();
        if (s.liked.includes(id)) return s.matches.some((m) => m.profileId === id);
        const matched = theyLikeMe;
        set({
          liked: [...s.liked, id],
          passed: s.passed.filter((x) => x !== id),
          matches: matched ? [...s.matches, { profileId: id, at: Date.now() }] : s.matches,
        });
        return matched;
      },
      pass: (id) => set((s) => ({ passed: s.passed.includes(id) ? s.passed : [...s.passed, id] })),
      toggleSave: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
      block: (id) =>
        set((s) => ({
          blocked: s.blocked.includes(id) ? s.blocked : [...s.blocked, id],
          matches: s.matches.filter((m) => m.profileId !== id),
        })),
      unblock: (id) => set((s) => ({ blocked: s.blocked.filter((x) => x !== id) })),
      report: (id) => set((s) => ({ reported: s.reported.includes(id) ? s.reported : [...s.reported, id] })),
      unmatch: (id) => set((s) => ({ matches: s.matches.filter((m) => m.profileId !== id) })),
      sendMessage: (id, text) =>
        set((s) => {
          // Mirrors the server rule: only matched, unblocked people can message.
          if (!s.matches.some((m) => m.profileId === id) || s.blocked.includes(id)) return s;
          const msg: Msg = { id: uid(), from: 'me', text, at: Date.now() };
          return { messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), msg] } };
        }),
      receiveSimulated: (id, text) =>
        set((s) => {
          if (s.blocked.includes(id)) return s;
          const msg: Msg = { id: uid(), from: 'them', text, at: Date.now(), simulated: true };
          return {
            messages: { ...s.messages, [id]: [...(s.messages[id] ?? []), msg] },
            unread: { ...s.unread, [id]: (s.unread[id] ?? 0) + 1 },
          };
        }),
      markRead: (id) => set((s) => ({ unread: { ...s.unread, [id]: 0 } })),
      addDate: (d) => set((s) => ({ dates: [{ ...d, id: uid(), createdAt: Date.now(), status: 'proposed' }, ...s.dates] })),
      setDateStatus: (id, status) => set((s) => ({ dates: s.dates.map((d) => (d.id === id ? { ...d, status } : d)) })),
      resetDemo: () => set({ ...fresh }),
    }),
    { name: 'lamour-app-demo-v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
