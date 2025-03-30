
# Panduan Instalasi dan Penggunaan Uptime Monitor

## Instalasi di VPS Baru

### Persyaratan
- VPS dengan minimal 1GB RAM
- Ubuntu 20.04 atau lebih baru
- Domain (opsional)

### Langkah 1: Persiapan Server

```bash
# Login ke server Anda
ssh root@your-server-ip

# Update sistem
apt update && apt upgrade -y

# Instal dependensi yang diperlukan
apt install -y curl git

# Instal Docker dan Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

### Langkah 2: Mengunduh Aplikasi

```bash
# Buat direktori untuk aplikasi
mkdir -p /opt/uptime-monitor
cd /opt/uptime-monitor

# Clone repository (ganti URL dengan repository Anda)
git clone https://github.com/yourusername/uptime-monitor.git .

# Atau download release langsung
curl -L https://github.com/yourusername/uptime-monitor/releases/download/v1.0.0/uptime-monitor.tar.gz | tar -xz
```

### Langkah 3: Konfigurasi

```bash
# Salin file konfigurasi
cp .env.example .env

# Edit file konfigurasi
nano .env
```

Sesuaikan nilai-nilai berikut:

```
# Konfigurasi umum
BASE_URL=https://monitor.yourdomain.com
PORT=3000

# Database
MONGODB_URI=mongodb://mongo:27017/uptime-monitor

# Keamanan
JWT_SECRET=buatRandomStringYangKuat

# SMTP untuk notifikasi email
SMTP_HOST=smtp.yourmailprovider.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
EMAIL_FROM=noreply@yourdomain.com

# Notifikasi (opsional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DISCORD_WEBHOOK_URL=
```

### Langkah 4: Jalankan dengan Docker Compose

```bash
# Buat file docker-compose.yml jika belum ada
nano docker-compose.yml
```

Isi dengan konfigurasi berikut:

```yaml
version: '3'

services:
  app:
    container_name: uptime-monitor
    image: yourusername/uptime-monitor:latest
    # Atau gunakan build jika belum membuat image
    # build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongo
    volumes:
      - ./data:/app/data

  mongo:
    container_name: uptime-mongo
    image: mongo:4.4
    restart: unless-stopped
    volumes:
      - ./data/db:/data/db
```

Jalankan aplikasi:

```bash
docker-compose up -d
```

### Langkah 5: Setup Nginx sebagai Reverse Proxy (Opsional)

```bash
# Instal Nginx
apt install -y nginx

# Buat konfigurasi Nginx
nano /etc/nginx/sites-available/uptime-monitor
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
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Aktifkan konfigurasi:

```bash
ln -s /etc/nginx/sites-available/uptime-monitor /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Langkah 6: Setup SSL dengan Certbot (Opsional)

```bash
# Instal Certbot
apt install -y certbot python3-certbot-nginx

# Dapatkan sertifikat SSL
certbot --nginx -d monitor.yourdomain.com
```

## Penggunaan Aplikasi

### Akses Dashboard

Buka browser dan akses aplikasi:
- Dengan domain: `https://monitor.yourdomain.com`
- Tanpa domain: `http://your-server-ip:3000`

### Pertama Kali Setup

1. Pada akses pertama, Anda akan dibawa ke halaman setup
2. Buat akun admin
3. Login dengan kredensial yang baru dibuat

### Menambahkan Monitor

1. Klik tombol "Add Monitor" di dashboard
2. Pilih jenis monitor:
   - HTTP/HTTPS
   - TCP
   - PING
3. Masukkan detail yang diperlukan:
   - Nama monitor
   - URL/Host/IP
   - Interval pemeriksaan (berapa detik/menit sekali)
   - Kondisi sukses (kode status, konten, dll)
4. Klik "Save" untuk membuat monitor

### Konfigurasi Notifikasi

1. Buka menu "Settings" > "Notifications"
2. Konfigurasi integrasi yang diinginkan:
   - Email (SMTP sudah dikonfigurasi di .env)
   - Telegram (memerlukan Bot Token dan Chat ID)
   - Discord (memerlukan Webhook URL)
3. Tentukan kapan notifikasi dikirim:
   - Saat status berubah menjadi down
   - Saat status berubah menjadi up
   - Saat performa memburuk

### Menggunakan Fitur Grup

1. Buka menu "Groups"
2. Buat grup baru dengan klik "Create Group"
3. Tambahkan monitor ke grup dengan drag-and-drop atau pilih dari daftar
4. Lihat status per grup di dashboard

### Backup dan Restore

1. Buka menu "Settings" > "Backup"
2. Klik "Export Configuration" untuk mengunduh backup
3. Untuk restore, klik "Import Configuration" dan pilih file backup

### Manajemen Pengguna

1. Buka menu "Settings" > "Users" (hanya admin)
2. Tambahkan pengguna baru dengan klik "Add User"
3. Tetapkan peran:
   - Admin: Akses penuh
   - Viewer: Hanya melihat status

### Menggunakan API

1. Buka menu "Settings" > "API"
2. Generate API token
3. Gunakan token untuk mengakses API endpoints:
   - `GET /api/monitors` - Dapatkan semua monitor
   - `POST /api/monitors` - Buat monitor baru
   - `GET /api/status` - Cek status semua monitor

## Pemeliharaan

### Update Aplikasi

```bash
cd /opt/uptime-monitor
git pull
docker-compose down
docker-compose up -d
```

### Backup Database

```bash
cd /opt/uptime-monitor
docker-compose exec mongo mongodump --out /data/db/backup
```

### Monitoring Logs

```bash
# Lihat log aplikasi
docker-compose logs -f app

# Lihat log MongoDB
docker-compose logs -f mongo
```

### Restart Layanan

```bash
docker-compose restart app
```

### Diagnostik Umum

Jika aplikasi tidak berjalan dengan benar:

1. Periksa status container:
   ```bash
   docker-compose ps
   ```

2. Periksa penggunaan sistem:
   ```bash
   htop
   ```

3. Periksa ruang disk:
   ```bash
   df -h
   ```

4. Periksa koneksi jaringan:
   ```bash
   netstat -tulpn
   ```

## Kontak Bantuan

Jika Anda membutuhkan bantuan lebih lanjut, hubungi:
- Email: support@yourdomain.com
- GitHub Issues: https://github.com/yourusername/uptime-monitor/issues
