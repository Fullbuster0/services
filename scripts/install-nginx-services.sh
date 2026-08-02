#!/usr/bin/env bash
# ============================================================================
# install-nginx-services.sh — Nginx hardening + config untuk services.shazoes.xyz
# Static Docusaurus site. Menambah security headers + server_tokens off.
#
# Style: sama template explorer (CONFIG di atas, copy-paste ready).
# Pakai: sudo bash scripts/install-nginx-services.sh
# Pindah server: edit CONFIG → DNS A/AAAA → deploy build/ → sudo bash script ini
#
# CATATAN CSP: Docusaurus butuh inline <script> (react-helmet + theme bootstrap),
# jadi script-src pakai 'unsafe-inline'. AMAN karena services = static docs,
# 0 dynamic HTML sink (no dangerouslySetInnerHTML/innerHTML/user-input).
# 'unsafe-inline' tetap blok remote script load + eval (vektor XSS utama).
# ============================================================================
set -euo pipefail

# ----------------------------- CONFIG ---------------------------------------
BASE_DOMAIN="shazoes.xyz"
SERVICES_SUB="services"                     # FQDN = services.shazoes.xyz
WEBROOT="/usr/share/nginx/services"
CONF_FILE="/etc/nginx/sites-enabled/services"
SSL_CERT="/etc/letsencrypt/live/services.shazoes.xyz/fullchain.pem"
SSL_KEY="/etc/letsencrypt/live/services.shazoes.xyz/privkey.pem"
# ----------------------------------------------------------------------------

FQDN="${SERVICES_SUB}.${BASE_DOMAIN}"

echo "============================================================"
echo " Services Nginx Hardening — ${FQDN}"
echo "============================================================"
echo "    WEBROOT   = ${WEBROOT}"
echo "    CONF_FILE = ${CONF_FILE}"
echo ""

if [ "$(id -u)" -ne 0 ]; then
  echo "ERROR: jalankan dengan sudo (bash $0)"; exit 1
fi

# ----------------------------- SEC_HEADERS ----------------------------------
# Di-inject ke location / (add_header TIDAK inherit kalau location punya
# add_header sendiri). CSP pragmatis untuk static Docusaurus.
read -r -d '' SEC_HEADERS <<'SEC' || true
        add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
        add_header Cross-Origin-Opener-Policy "same-origin-allow-popups" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
SEC

# ----------------------------- BACKUP ---------------------------------------
# PENTING: backup HARUS di luar sites-enabled/ — nginx meng-include
# sites-enabled/*, jadi .bak di sana jadi duplicate server block
# ("conflicting server name" warning + risiko config lama aktif lagi).
BK_DIR="/etc/nginx/backups"
mkdir -p "$BK_DIR"
if [ -f "$CONF_FILE" ]; then
  BK="${BK_DIR}/services.bak.$(date +%Y%m%d-%H%M%S)"
  cp "$CONF_FILE" "$BK"
  echo "==> Backup config lama → ${BK}"
fi

# ----------------------------- WRITE CONFIG ---------------------------------
echo "==> Tulis config hardened → ${CONF_FILE}"
tee "$CONF_FILE" > /dev/null <<EOF
# SERVICES SERVER (hardened $(date +%Y-%m-%d))
server {
    listen 443 ssl http2;
    server_name ${FQDN};

    ssl_certificate     ${SSL_CERT};
    ssl_certificate_key ${SSL_KEY};

    # Sembunyikan versi nginx (info disclosure)
    server_tokens off;

    root ${WEBROOT};
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html;
${SEC_HEADERS}
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    # Gzip compression
    gzip on;
    gzip_proxied any;
    gzip_static on;
    gzip_min_length 1024;
    gzip_buffers 4 16k;
    gzip_comp_level 2;
    gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";
}

# REDIRECT HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${FQDN};

    location / {
        return 301 https://\$host\$request_uri;
    }
}
EOF

# ----------------------------- TEST + RELOAD --------------------------------
echo "==> nginx -t + reload"
nginx -t
systemctl reload nginx

# ----------------------------- VERIFY ---------------------------------------
echo ""
echo "==> Verifikasi headers live (tunggu 2s)…"
sleep 2
echo "--- headers ---"
curl -sI "https://${FQDN}/" | grep -iE 'content-security|x-frame|x-content-type|referrer-policy|permissions-policy|cross-origin-opener|strict-transport|^server:' | tr -d '\r'
echo ""
echo "--- server token (harus 'nginx' tanpa versi) ---"
curl -sI "https://${FQDN}/" | grep -i '^server:' | tr -d '\r'
echo ""
echo "============================================================"
echo " DONE. Config: ${CONF_FILE}"
echo " Rollback: cp ${BK} ${CONF_FILE} && nginx -t && systemctl reload nginx"
echo "============================================================"
