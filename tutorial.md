# Tutorial Build Aplikasi Expo

## Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Prasyarat](#prasyarat)
3. [Proses Login Expo](#proses-login-expo)
4. [Inisialisasi Proyek Expo](#inisialisasi-proyek-expo)
5. [Konfigurasi EAS Build](#konfigurasi-eas-build)
6. [Menjalankan Build Android](#menjalankan-build-android)
7. [Mengatasi Error Umum](#mengatasi-error-umum)
8. [Studi Kasus: Error pada expo-barcode-scanner](#studi-kasus-error-pada-expo-barcode-scanner)
9. [Mengunduh dan Menginstal APK](#mengunduh-dan-menginstal-apk)
10. [Tips dan Trik](#tips-dan-trik)

## Pengenalan

Expo adalah platform pengembangan aplikasi mobile yang memungkinkan pengembang untuk membuat aplikasi React Native dengan mudah. EAS Build (Expo Application Services) adalah layanan build yang disediakan oleh Expo untuk membuat file APK (Android) atau IPA (iOS) dari proyek Expo Anda.

Document ini akan menjelaskan cara melakukan build aplikasi Expo dari awal hingga akhir, termasuk cara mengatasi masalah umum yang mungkin muncul selama proses build.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

1. Node.js versi terbaru terinstal
2. Expo CLI terinstal (`npm install -g expo-cli`)
3. EAS CLI terinstal (`npm install -g eas-cli`)
4. Akun Expo di [expo.dev](https://expo.dev)
5. Untuk build iOS: Komputer Mac dengan Xcode terinstal
6. Untuk Android: JDK terinstal (opsional, karena EAS Build dapat melakukan build di cloud)

## Proses Login Expo

Langkah pertama adalah login ke akun Expo Anda:

```bash
npx expo login
```

Masukkan email dan password Anda. Jika berhasil, Anda akan melihat pesan konfirmasi bahwa Anda sudah login.

Alternatif, Anda bisa menggunakan token akses:

```bash
npx expo login --token YOUR_TOKEN
```

Contoh token akses: `6om94YWQ_U_OB1gWW-OQ83eZL52nsnD5d918Dzj9`

> **Catatan**: Simpan token akses Anda dengan aman dan jangan bagikan kepada orang lain.

## Inisialisasi Proyek Expo

Jika Anda sudah memiliki proyek Expo, Anda perlu menginisialisasi EAS di proyek tersebut:

```bash
npx eas init
```

Perintah ini akan:
1. Memverifikasi bahwa Anda sudah login
2. Membuat ID proyek baru di server Expo
3. Memperbarui file app.json atau app.config.js dengan ID proyek
4. Membuat file eas.json dengan konfigurasi build dasar

Pastikan "owner" di file app.json adalah username Expo Anda, bukan UUID. Contoh:

```json
{
  "expo": {
    "owner": "koncomyid",
    "name": "invento",
    "slug": "invento",
    ...
  }
}
```

## Konfigurasi EAS Build

File `eas.json` mengatur konfigurasi build Anda. Berikut adalah contoh konfigurasi dasar:

```json
{
  "cli": {
    "version": ">= 16.3.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

Penjelasan profil:
- **development**: Untuk pengembangan dengan Dev Client, debug mode
- **preview**: Build dengan optimisasi, tapi versi APK (lebih mudah dibagikan)
- **production**: Build release untuk Play Store (app bundle)

## Menjalankan Build Android

Untuk memulai build, jalankan perintah:

```bash
# Untuk development build:
npx eas build --profile development --platform android

# Untuk preview build:
npx eas build --profile preview --platform android

# Untuk production build:
npx eas build --profile production --platform android
```

Saat pertama kali build, EAS akan bertanya tentang keystore (kunci tanda tangan Android):
1. **Buat keystore baru**: EAS akan membuat keystore dan menyimpannya di akun Expo Anda
2. **Upload keystore yang sudah ada**: Jika Anda sudah memiliki keystore

Pilih opsi pertama jika Anda baru memulai.

## Mengatasi Error Umum

### 1. Masalah Versi Paket

Jika ada pemberitahuan tentang ketidaksesuaian versi paket:

```
The following packages should be updated for best compatibility:
  expo@53.0.7 - expected version: 53.0.10
  ...
```

Solusi: Update paket dengan perintah:

```bash
npx expo install expo@53.0.10 [paket-lain]
```

### 2. Masalah Keystore

Jika terjadi error saat pembuatan keystore:

```
Error generating Android Keystore
```

Solusi:
- Pastikan JDK terinstal jika ingin membuat keystore lokal
- Gunakan opsi keystore remote melalui EAS
- Tambahkan `"EXPO_USE_HARDCODED_KEYS": "1"` pada environment build

### 3. Error Gradle

Jika muncul error Gradle:

```
Execution failed for task ':app:someGradleTask'
```

Solusi:
- Sesuaikan `gradleCommand` di file eas.json
- Mulai dengan build development yang lebih sederhana

## Studi Kasus: Error pada expo-barcode-scanner

### Masalah:
```
Execution failed for task ':expo-barcode-scanner:compileReleaseKotlin'.
```

Error ini terjadi karena masalah kompatibilitas dengan paket `expo-barcode-scanner`.

### Solusi:

1. **Hapus paket yang bermasalah**:
   ```bash
   npm uninstall expo-barcode-scanner
   ```

2. **Hapus dari app.json**:
   ```json
   "plugins": [
     "expo-router",
     [
       "expo-splash-screen",
       {
         "image": "./assets/images/splash-icon.png",
         "imageWidth": 200,
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       }
     ]
     // Hapus "expo-barcode-scanner" dari sini
   ],
   ```

3. **Modifikasi komponen yang menggunakan barcode scanner**:
   - Mengubah dari `CameraView` ke `Camera` biasa
   - Mengganti fungsi pemindaian dengan alternatif atau simulasi

4. **Coba build lagi dengan profil development**:
   ```bash
   npx eas build --profile development --platform android
   ```

## Mengunduh dan Menginstal APK

Setelah build selesai, Anda dapat mengunduh APK:

```bash
# Lihat daftar build yang tersedia
npx eas build:list

# Unduh build tertentu (ID opsional jika hanya ada satu build terbaru)
npx eas build:download
```

Anda juga bisa mengunduh langsung dari dashboard Expo di [expo.dev](https://expo.dev).

## Tips dan Trik

1. **Mulai dengan profil development**: Lebih mudah berhasil dan lebih cepat untuk debugging

2. **Bersihkan cache jika mengalami masalah**:
   ```bash
   npm cache clean --force
   ```

3. **Periksa kompatibilitas paket**: Pastikan semua paket kompatibel dengan versi Expo yang digunakan

4. **Gunakan "internal distribution"**: Memudahkan berbagi APK tanpa melalui Play Store

5. **Ambil log lengkap**: Jika terjadi masalah, lihat log build lengkap di dashboard Expo

6. **Perbarui Expo SDK secara berkala**: Untuk mendapatkan fitur terbaru dan perbaikan bug

7. **Gunakan EAS Update**: Untuk memperbarui aplikasi tanpa harus build ulang (OTA updates)

---

Document ini akan terus diperbarui sesuai dengan perkembangan Expo dan EAS Build. Semoga bermanfaat dalam perjalanan pengembangan aplikasi mobile Anda!
