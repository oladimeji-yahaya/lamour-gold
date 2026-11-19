export const colors = {
  bg: '#080808',
  bgAlt: '#141414',
  card: '#1A1714',
  gold: '#D4AF37',
  goldLight: '#E8C78A',
  champagne: '#F8E6C8',
  text: '#FFFFFF',
  textMuted: '#C5BBB0',
  border: '#56442F',
  error: '#D75C5C',
  success: '#52B788',
} as const;

export const goldGradient = ['#F8E6C8', '#DDB568', '#A97734'] as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

export const fonts = {
  heading: 'PlayfairDisplay_600SemiBold',
  headingBold: 'PlayfairDisplay_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_600SemiBold',
} as const;

export const MIN_TOUCH = 48;
