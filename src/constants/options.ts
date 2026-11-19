export const GENDERS = ['Woman', 'Man', 'Non-binary', 'Other'] as const;
export const MEET = ['Women', 'Men', 'Non-binary people', 'Everyone'] as const;
export const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'Prefer not to say'] as const;
export const EDUCATION = ['High school', 'Some college', "Bachelor's degree", "Master's degree", 'Doctorate', 'Trade school'] as const;
export const RELIGION = ['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Spiritual', 'Not religious', 'Prefer not to say'] as const;
export const RELATIONSHIP_STATUS = ['Single', 'Divorced', 'Separated', 'Widowed'] as const;
export const HAS_CHILDREN = ['No children', 'Have children', 'Prefer not to say'] as const;
export const WANTS_CHILDREN = ['Want children', "Don't want children", 'Open to it', 'Not sure'] as const;
export const SMOKING = ['Never', 'Socially', 'Regularly', 'Trying to quit'] as const;
export const DRINKING = ['Never', 'Socially', 'Regularly'] as const;
export const FITNESS = ['Daily', 'A few times a week', 'Occasionally', 'Rarely'] as const;
export const SOCIAL = ['Homebody', 'Balanced', 'Social butterfly'] as const;
export const TRAVEL = ['Beaches', 'City breaks', 'Adventure', 'Culture & history', 'Road trips', 'Luxury escapes'] as const;
export const FOOD = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Foodie', 'Home cooking', 'Fine dining', 'Street food'] as const;
export const HOBBIES = ['Art', 'Reading', 'Photography', 'Gaming', 'Cooking', 'Hiking', 'Fitness', 'Fashion', 'Film', 'Writing', 'Dancing', 'Wellness'] as const;
export const MUSIC = ['Afrobeats', 'R&B', 'Jazz', 'Hip-hop', 'Pop', 'Rock', 'Classical', 'Electronic', 'Gospel', 'Soul'] as const;
export const WEEKEND = ['Brunch', 'Live music', 'Museums', 'Beach days', 'Staying in', 'Sports', 'Volunteering', 'Day trips'] as const;
export const VALUES = ['Honesty', 'Family', 'Faith', 'Growth', 'Ambition', 'Kindness', 'Adventure', 'Loyalty', 'Humor', 'Independence'] as const;
export const COMMUNICATION = ['Texting', 'Voice notes', 'Calls', 'In person', 'Slow and thoughtful', 'Quick and playful'] as const;
export const RELATIONSHIP_VALUES = ['Trust', 'Respect', 'Communication', 'Shared goals', 'Space to grow', 'Affection'] as const;

export const PROMPTS = [
  'A perfect Sunday looks like…',
  'I get along best with people who…',
  'Something I am working on is…',
  'The way to win me over is…',
  'My most underrated quality is…',
  'A green flag for me is…',
] as const;

export const EXPERIENCES = [
  {
    key: 'love',
    name: 'Gold Love',
    blurb: 'Serious relationships, long-term commitment and meaningful romantic connection.',
  },
  {
    key: 'spark',
    name: 'Gold Spark',
    blurb:
      'Casual dating and short-term connections between consenting adults. Consent is always explicit and mutual; choosing this never implies agreement to anything.',
  },
  {
    key: 'evening',
    name: 'Gold Evening',
    blurb:
      'Dinner dates, events, concerts and cultural outings. Social dating only: not paid companionship.',
  },
] as const;

export type ExperienceKey = (typeof EXPERIENCES)[number]['key'];
