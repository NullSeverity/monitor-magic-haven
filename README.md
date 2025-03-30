
# Aplikasi Monitoring Uptime

Aplikasi monitoring uptime ini adalah solusi sederhana untuk memantau status dan ketersediaan website serta layanan Anda. Aplikasi ini terinspirasi dari Uptime Kuma dan dirancang untuk membantu Anda memantau berbagai jenis layanan.

## Daftar Isi
1. [Fitur](#fitur)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Instalasi di VPS](#instalasi-di-vps)
   - [Menggunakan Docker](#menggunakan-docker)
   - [Instalasi Manual](#instalasi-manual)
4. [Konfigurasi](#konfigurasi)
5. [Cara Penggunaan](#cara-penggunaan)
   - [Login dan Registrasi](#login-dan-registrasi)
   - [Dashboard](#dashboard)
   - [Menambahkan Monitor](#menambahkan-monitor)
   - [Konfigurasi Notifikasi](#konfigurasi-notifikasi)
   - [Grup Monitor](#grup-monitor)
   - [Backup dan Restore](#backup-dan-restore)
6. [API](#api)
7. [Pemecahan Masalah](#pemecahan-masalah)
8. [Kontribusi](#kontribusi)

## Fitur

- **Monitoring berbagai layanan**:
  - HTTP/HTTPS (GET, POST, dll)
  - TCP Port
  - ICMP Ping
- **Notifikasi**:
  - Telegram
  - Discord
  - Email
- **Dashboard real-time** dengan status dan waktu respons
- **Riwayat log** dan grafik untuk setiap monitor
- **Fitur grup** untuk mengorganisasi monitor
- **Mode gelap/terang**
- **API Token** untuk integrasi kustom
- **Backup & restore** konfigurasi
- **Multi-user** dengan peran admin dan viewer

## Persyaratan Sistem

- Server Linux (Ubuntu 20.04+ direkomendasikan)
- Minimal 1GB RAM
- Minimal 10GB ruang disk
- Koneksi internet

## Instalasi di VPS

### Menggunakan Docker (Direkomendasikan)

1. **Persiapan VPS**

   Pastikan Anda memiliki akses ssh ke VPS Anda dan telah menginstal Docker dan Docker Compose:

   ```bash
   # Update sistem
   sudo apt update && sudo apt upgrade -y

   # Instal Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Instal Docker Compose
   sudo apt install docker-compose -y
   ```

2. **Clone Repository**

   ```bash
   git clone https://github.com/username/uptime-monitor.git
   cd uptime-monitor
   ```

3. **Konfigurasi Environment**

   Buat file `.env` dari contoh:

   ```bash
   cp .env.example .env
   nano .env
   ```

   Ubah konfigurasi sesuai kebutuhan:

   ```
   # Database
   MONGODB_URI=mongodb://mongo:27017/uptime-monitor

   # App
   PORT=3000
   BASE_URL=https://monitor.yourdomain.com

   # JWT Secret
   JWT_SECRET=changeThisToASecureRandomString

   # Email (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Menjalankan Aplikasi**

   ```bash
   sudo docker-compose up -d
   ```

   Aplikasi akan berjalan di `http://your-server-ip:3000`

5. **Konfigurasi Nginx (Opsional untuk Domain)**

   Jika Anda ingin menggunakan domain, pasang Nginx:

   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/monitor
   ```

   Tambahkan konfigurasi:

   ```nginx
   server {
       listen 80;
       server_name monitor.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }
   }
   ```

   Aktifkan dan restart Nginx:

   ```bash
   sudo ln -s /etc/nginx/sites-available/monitor /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Pasang SSL (Opsional)**

   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d monitor.yourdomain.com
   ```

### Instalasi Manual

1. **Persiapan VPS**

   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y git nodejs npm mongodb
   sudo systemctl enable --now mongodb
   ```

2. **Clone dan Setup Aplikasi**

   ```bash
   git clone https://github.com/username/uptime-monitor.git
   cd uptime-monitor
   
   # Instal dependensi
   npm install
   
   # Konfigurasi
   cp .env.example .env
   nano .env
   
   # Build frontend
   npm run build
   
   # Jalankan aplikasi
   npm start
   ```

3. **Setup PM2 untuk Menjalankan Aplikasi di Background**

   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "uptime-monitor" -- start
   pm2 save
   pm2 startup
   ```

## Cara Penggunaan

### Login dan Registrasi

1. Kunjungi `https://monitor.yourdomain.com` atau `http://server-ip:3000`
2. Pada pertama kali, Anda akan diminta membuat akun admin
3. Daftar dengan username, email, dan password
4. Untuk akun tambahan, masuk sebagai admin dan buat akun baru melalui menu 'Users'

### Dashboard

Dashboard menampilkan:

- Ringkasan status semua monitor
- Statistik uptime
- Status terakhir untuk setiap monitor
- Grafik response time

Klik pada monitor untuk melihat detail dan riwayat lebih lanjut.

### Menambahkan Monitor

1. Klik tombol "Add Monitor" di dashboard
2. Pilih jenis monitor:
   - **HTTP/HTTPS**: Masukkan URL, metode (GET/POST), header, body, dan interval
   - **TCP Port**: Masukkan alamat IP/hostname, port, dan interval
   - **ICMP Ping**: Masukkan alamat IP/hostname dan interval
3. Konfigurasi pengaturan tambahan:
   - Interval pemeriksaan (dalam detik/menit)
   - Timeout
   - Retry count
   - Kondisi sukses (kode status, konten)
4. Klik "Save" untuk membuat monitor

### Konfigurasi Notifikasi

1. Pergi ke menu "Settings" > "Notifications"
2. Konfigurasikan saluran notifikasi:
   - **Telegram**: Masukkan Bot Token dan Chat ID
   - **Discord**: Masukkan Webhook URL
   - **Email**: Verifikasi pengaturan email yang sudah dikonfigurasi
3. Aktifkan notifikasi yang diinginkan:
   - Status Down
   - Status Up
   - Peringatan performa

### Grup Monitor

1. Pergi ke menu "Groups"
2. Klik "Create Group" dan beri nama grup
3. Tambahkan monitor ke grup dengan menyeret dan melepaskan atau menggunakan menu "Edit Group"

### Backup dan Restore

1. Pergi ke menu "Settings" > "Backup"
2. Untuk backup:
   - Klik "Export" dan simpan file JSON
3. Untuk restore:
   - Klik "Import" dan pilih file backup JSON
   - Konfirmasi restore data

## API

API tersedia untuk integrasi dengan sistem lain:

1. Pergi ke "Settings" > "API"
2. Generate token API
3. Gunakan token dalam header request: `Authorization: Bearer YOUR_TOKEN`

Endpoint API dasar:

- `GET /api/monitors`: Dapatkan daftar semua monitor
- `GET /api/monitors/:id`: Dapatkan detail monitor
- `POST /api/monitors`: Buat monitor baru
- `PUT /api/monitors/:id`: Perbarui monitor
- `DELETE /api/monitors/:id`: Hapus monitor
- `GET /api/status`: Dapatkan status semua monitor

## Pemecahan Masalah

- **Aplikasi tidak berjalan**: Periksa log dengan `docker-compose logs` atau `pm2 logs`
- **Notifikasi tidak terkirim**: Periksa pengaturan koneksi di menu Settings
- **Koneksi MongoDB gagal**: Pastikan service MongoDB berjalan atau container database aktif
- **Monitor selalu menunjukkan down**: Periksa firewall server dan pastikan port keluar diizinkan

## Kontribusi

Kontribusi selalu disambut baik! Silakan buat pull request atau buka issue untuk fitur baru atau perbaikan bug.

## Lisensi

Aplikasi ini dirilis di bawah lisensi MIT.
