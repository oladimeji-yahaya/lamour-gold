# L’AMOUR GOLD

Expo + TypeScript + Expo Router dating app, black-and-gold design. Runs in **DEMO MODE** (simulated data, no backend) until Supabase keys are set.

## Run it
```bash
npm install            # versions in package.json target Expo SDK 52; run `npx expo install --fix` to align
cp .env.example .env   # leave blank for DEMO MODE
npx expo start         # press i (iOS) or a (Android), or scan the QR in Expo Go
npm run typecheck
npm test
```

## Status: NOT YET RUN
Written without network access, so `npm install`, `tsc` and `jest` have **not** been run. Only a syntax-only check
(53 files, 0 errors) was done. Expect small type/version fixes on first install. Nothing was tested on a device.

## Folder / navigation flow
```
app/
  _layout.tsx            fonts, providers, root Stack
  index.tsx              Splash -> /welcome
  welcome.tsx            Welcome -> /onboarding/account or /login
  login.tsx              Login -> /home
  onboarding/            account > basic > details > lifestyle > bio > intentions > photos > verification > preview -> /home
  (tabs)/                bottom tabs: home | discover | likes | chats | profile
  member/[id].tsx        full profile (from Discover, Home, Likes, match)
  match/[id].tsx         "It’s a Match!" screen
  chat/[id].tsx          conversation (matched, unblocked only)
  mystery/[id].tsx       optional Mystery Reveal
  dates/index.tsx, new   date plans (reachable from Home, Chat, Profile)
  filters.tsx            discovery filters
  settings/blocked.tsx   blocked accounts
  notifications.tsx      PLACEHOLDER
src/
  theme/ constants/ components/ hooks/ store/ lib/ data/
```
Profile edit rows reuse the onboarding screens.

## Implemented (demo / on-device)
Splash, welcome, login, onboarding (8 steps, Zod validation, persisted progress), tabs, Home dashboard,
Discover with Love/Spark/Evening tabs and filters, full profiles, explainable compatibility module (+ tests),
like/pass/save, simulated mutual match + animated match screen, chat with scripted replies, report/block/unmatch,
date planning with safety reminder, blocked-accounts list, Mystery Reveal (prompt-by-prompt).

## Not built / placeholders
- Backend: Supabase schema, RLS, storage uploads, realtime, real auth session guard, data deletion (Phase 6)
- Forgot-password screen, email-verification screen, Google/Apple sign-in, account deletion
- Notifications screen, privacy/visibility, notification preferences, help and support (labeled in-app)
- Swipe gestures, image/voice messages, typing indicators, voice intros, "propose another time", share profile
- Real verification (selfie/ID need a provider); nothing is shown as verified
- Demo profiles have no photos (initial avatars); photo gallery and photo reveal need real images
- React Hook Form (forms use local state + Zod); lifestyle-compatibility filter
