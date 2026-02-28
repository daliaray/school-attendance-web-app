

# Stage 1: Build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY att/package*.json ./att/
COPY backend/package*.json ./backend/
RUN npm install -g @angular/cli && \
    cd att && npm install && \
    cd ../backend && npm install
COPY . .
RUN cd att && ng build --configuration production --output-path=../backend/public

# Stage 2: Serve the Angular app with NGINX
FROM nginx:alpine
COPY --from=build /app/backend/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
