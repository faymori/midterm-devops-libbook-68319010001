FROM nginx:alpine

# คัดลอกโค้ดหน้าเว็บไปไว้ที่โฟลเดอร์แสดงผลของ Nginx
COPY . /usr/share/nginx/html

# เขียนทับไฟล์คอนฟิกเพื่อให้ Nginx รับพอร์ต 80 และส่งต่อ /api ไปหาหลังบ้านที่พอร์ต 5000
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:5000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]