# Repair and setup guide (Windows PowerShell)

This archive preserves the uploaded project and design. The `.env` file was deliberately excluded.

## Install dependencies cleanly

Open PowerShell in the extracted project folder:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm ci
```

If `npm ci` complains that the lockfile is inconsistent, run `npm install` instead. Do not delete `package-lock.json` unless you intentionally want to regenerate it.

## Check the Jest preset and runner

```powershell
node -p "require.resolve('jest-expo/package.json')"
node -p "require.resolve('jest-circus/runner')"
npx jest --showConfig
npm run typecheck
npm test -- --runInBand
```

The project uses the `jest-expo` preset in `package.json`; don't add a second `jest.config.js`. If Jest still fails, share the output of the first three commands.

## Start Expo

```powershell
npx expo start --clear
```

## Supabase

Copy `.env.example` to `.env` and enter your own project URL and publishable/anon key. Never put a service role key in an Expo public variable. Supabase integration is not a complete production backend: the app still contains simulated matching/chat flows.

## Validation status

This ZIP was inspected and edited, but npm installation, Jest tests, and Expo device runtime have not been verified in this environment.
