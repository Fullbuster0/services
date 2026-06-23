#!/bin/bash
# ==========================================================
# Shazoes Services — SSL Auto-Renewal & Telegram Notifier
# ==========================================================
# Usage:
#   1. Edit TELEGRAM_BOT_TOKEN & CHAT_ID di bawah
#   2. chmod +x renew_ssl.sh
#   3. Pindahkan ke /usr/local/bin/ dengan sudo:
#      sudo mv renew_ssl.sh /usr/local/bin/renew_ssl.sh
#   4. Tambah ke crontab: 0 3 * * 0 /usr/local/bin/renew_ssl.sh
# ==========================================================

# === KONFIGURASI (EDIT BAGIAN INI) ===
TELEGRAM_BOT_TOKEN="GANTI_DENGAN_TOKEN_BOT_TUAN"
CHAT_ID="6150903188"
WEBROOT_PATH="/var/www/html"   # Sesuaikan dengan webroot Nginx Tuan
RENEW_LOG="/var/log/ssl_renew.log"

# === TIDAK PERLU EDIT DI BAWAH INI ===
DATE=$(date '+%Y-%m-%d %H:%M:%S')
HOSTNAME=$(hostname)

# Telegram notifier function
send_telegram() {
    local message="$1"
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ "$TELEGRAM_BOT_TOKEN" != "GANTI_DENGAN_TOKEN_BOT_TUAN" ]; then
        curl -s --max-time 10 \
            -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d chat_id="${CHAT_ID}" \
            -d text="${message}" \
            -d parse_mode="Markdown" > /dev/null 2>&1
    fi
}

# Log start
echo "=== [${DATE}] Memulai proses renewal SSL di ${HOSTNAME} ===" | sudo tee -a "$RENEW_LOG" > /dev/null

# Pastikan direktori log bisa ditulis
sudo touch "$RENEW_LOG"
sudo chmod 644 "$RENEW_LOG"

# Jalankan certbot renew dengan webroot
# (Tidak mematikan Nginx — Tuan harus punya location /.well-known di config)
sudo certbot renew --webroot -w "$WEBROOT_PATH" --quiet
RENEW_EXIT=$?

# Cek hasil
if [ $RENEW_EXIT -eq 0 ]; then
    # Cek apakah ada sertifikat yang baru di-renew
    # (certbot renew exit 0 bahkan jika tidak ada yang perlu di-renew)
    LATEST_CERT=$(sudo find /etc/letsencrypt/live -name "cert.pem" -newer /tmp/renew_marker 2>/dev/null | head -1)
    touch /tmp/renew_marker

    if [ -n "$LATEST_CERT" ]; then
        echo "✅ [${DATE}] Ada sertifikat baru. Reload Nginx..." | sudo tee -a "$RENEW_LOG" > /dev/null
        sudo systemctl reload nginx
        send_telegram "✅ *SSL Renewed* di \`${HOSTNAME}\`

🕐 Waktu: ${DATE}
🔄 Nginx telah di-reload otomatis."
    else
        echo "ℹ️  [${DATE}] Tidak ada sertifikat yang perlu di-renew." | sudo tee -a "$RENEW_LOG" > /dev/null
    fi
else
    ERROR_MSG="❌ [${DATE}] GAGAL renewal SSL di ${HOSTNAME}. Cek log: ${RENEW_LOG}"
    echo "$ERROR_MSG" | sudo tee -a "$RENEW_LOG" > /dev/null

    send_telegram "🚨 *SSL RENEWAL GAGAL*

🖥️ Server: \`${HOSTNAME}\`
🕐 Waktu: ${DATE}
❌ Exit code: ${RENEW_EXIT}
📋 Log: \`${RENEW_LOG}\`

Cek manual dengan:
\`sudo certbot renew --webroot -w ${WEBROOT_PATH}\`"
fi

# Bersihkan marker
rm -f /tmp/renew_marker

echo "=== [${DATE}] Selesai ===" | sudo tee -a "$RENEW_LOG" > /dev/null
