# L’Amour Gold — Expo SDK 58 migration candidate

This is a source-preserving migration package, **not a verified successful build**. The original `.env`, npm lockfile and `.expo` cache were deliberately excluded. Copy your private `.env` locally; do not commit it.

## Windows PowerShell

```powershell
node -v
npm install
npx expo install --fix
npx expo-doctor@latest
npm run typecheck
npx expo start --clear
```

If npm reports a new `ERESOLVE`, read the first `peer` conflict and correct it; do not use `--force` or `--legacy-peer-deps` as a permanent fix. This package uses `lucide-react-native: latest` to avoid the old 0.453.0 React 18 peer constraint; pin the resolved version after successful install. The Expo CLI will select a compatible `react-native-worklets` version via `expo install --fix`. If it does not, run `npx expo install react-native-worklets`.

The Babel configuration drops the obsolete `react-native-reanimated/plugin` entry; Expo SDK 58 uses the modern Worklets integration. Check migration notes for React Native Reanimated v4 and Expo Router.

`expo-notifications` push notifications and other native features may require a development build rather than Expo Go. Test on-device.

This zip is not guaranteed to run without source changes; it has not been installed or tested in this environment.
