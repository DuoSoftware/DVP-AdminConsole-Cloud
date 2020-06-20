FROM nginx:1.18.0-alpine
RUN rm -f /usr/share/nginx/html/*
COPY . /usr/share/nginx/html/
EXPOSE 80
