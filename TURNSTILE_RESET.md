# Turnstile Reset Feature

## 📌 Overview

Aplikasi sekarang memiliki fitur automatic reset untuk Cloudflare Turnstile ketika terjadi error atau login/register gagal. Ini memastikan user harus melakukan verifikasi ulang setelah setiap percobaan yang gagal, meningkatkan keamanan.

## ✨ Kapan Turnstile Di-Reset?

### Login (`/login`)
Turnstile akan otomatis di-reset ketika:
- ❌ Format input tidak valid
- ❌ Security check tidak valid
- ❌ Username atau password kosong
- ❌ Server error
- ❌ Rate limit exceeded (terlalu banyak percobaan)
- ❌ Username atau password salah
- ❌ Login gagal (any other error)
- ⚠️ Turnstile verification error
- ⏰ Turnstile expired

### Register (`/register`)
Turnstile akan otomatis di-reset ketika:
- ❌ Validasi gagal (NIK, phone, email, username, password)
- ❌ Terjadi error dari server (duplicate user, dll)
- ❌ Mutation error dari tRPC
- ⚠️ Turnstile verification error
- ⏰ Turnstile expired

## 🔧 Implementasi Teknis

### Metode: Key-based Reset
Menggunakan React `key` prop untuk force remount Turnstile component:

```tsx
const [turnstileKey, setTurnstileKey] = useState(0);

// Reset function
const resetTurnstile = () => {
  setTurnstileKey(prev => prev + 1);  // Force remount
  setTurnstileToken("");
  setTurnstileError("");
};

// Component
<Turnstile
  key={turnstileKey}  // ← Key changes = component remount
  sitekey={SITE_KEY}
  onVerify={...}
/>
```

### Flow

```
User Action (Login/Register)
    ↓
Validation Error / Auth Error
    ↓
resetTurnstile() called
    ↓
turnstileKey incremented
    ↓
Turnstile component remounted
    ↓
User must verify again
```

## 📁 File Changes

### `src/app/utils/actionLogin.ts`
- Added `resetTurnstile` state
- Added `setResetTurnstile` export
- Call `resetTurnstile?.()` on all error cases

### `src/app/utils/actionRegister.ts`
- Added `resetTurnstile` state
- Added `setResetTurnstile` export
- Call `resetTurnstile?.()` on all error cases

### `src/app/login/page.tsx`
- Added `turnstileKey` state for force remount
- Pass reset function to `useLogin` hook via `useEffect`
- Added `onError` and `onExpire` handlers

### `src/app/register/page.tsx`
- Added `turnstileKey` state for force remount
- Pass reset function to `useRegister` hook via `useEffect`
- Added `onError` and `onExpire` handlers

## 🎯 Benefits

1. **Security**: User harus verify ulang setiap kali ada error
2. **User Experience**: Clear feedback ketika verification expired atau error
3. **Anti-Bot**: Mencegah automated scripts menggunakan token yang sama berulang kali
4. **Rate Limiting**: Bekerja dengan baik bersama rate limiting untuk mencegah brute force

## 🧪 Testing

### Test Scenario 1: Wrong Password
1. Enter wrong credentials
2. Click login
3. ✅ Error message appears
4. ✅ Turnstile resets (new challenge)

### Test Scenario 2: Rate Limit
1. Attempt login 6+ times quickly
2. ✅ Rate limit warning appears
3. ✅ Turnstile resets

### Test Scenario 3: Validation Error
1. Leave fields empty
2. Click submit
3. ✅ Validation error appears
4. ✅ Turnstile resets

### Test Scenario 4: Turnstile Expiry
1. Complete turnstile
2. Wait 5 minutes (expiry time)
3. Try to submit
4. ✅ Expiry message appears
5. ✅ Turnstile auto-resets

## 🔗 Related Documentation

- [RATE_LIMITING.md](./RATE_LIMITING.md) - Rate limiting configuration
- [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
