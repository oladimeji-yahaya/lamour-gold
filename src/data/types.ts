import type { ExperienceKey } from '@/constants/options';

export type DemoProfile = {
  id: string;
  firstName: string;
  age: number;
  gender: 'Woman' | 'Man' | 'Non-binary';
  profession?: string;
  area: string; // approximate area only, never coordinates
  distanceKm: number; // rounded
  experiences: ExperienceKey[];
  bio: string;
  interests: string[];
  values: string[];
  lifestyle: { smoking?: string; drinking?: string; fitness?: string; social?: string };
  communication: string[];
  relationshipGoals: string;
  prompts: { question: string; answer: string }[];
  /** Demo only: this person has already "liked" the user, so liking back creates a match. */
  likesYou: boolean;
};

export type Msg = { id: string; from: 'me' | 'them'; text: string; at: number; simulated?: boolean };

export type DateCategory =
  | 'Dinner Date'
  | 'Coffee Date'
  | 'Drinks and Conversation'
  | 'Concert'
  | 'Art Gallery'
  | 'Outdoor Activity'
  | 'Custom Date';

export type DateInvite = {
  id: string;
  profileId: string;
  category: DateCategory;
  day: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string; // user-suggested public venue; availability is NOT checked
  status: 'proposed' | 'accepted' | 'declined' | 'cancelled';
  createdAt: number;
};
