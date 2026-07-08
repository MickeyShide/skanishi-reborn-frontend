#!/bin/sh
cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.RUNTIME_CONFIG = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_YMAP_API_KEY: "${VITE_YMAP_API_KEY}"
};
EOF
