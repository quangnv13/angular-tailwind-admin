#!/bin/sh

jq '.backendBaseApiUrl = env.BACKEND_API_BASE_URL' /usr/share/nginx/html/assets/config.json > /usr/share/nginx/html/assets/config.temp.json && mv /usr/share/nginx/html/assets/config.temp.json /usr/share/nginx/html/assets/config.json

exec nginx -g 'daemon off;'
