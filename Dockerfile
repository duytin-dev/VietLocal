# Build
FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_BASE_URL=https://be-vietlocal.onrender.com
ARG VITE_PAYMENT_WEBHOOK_SECRET=vietlocal-dev-secret
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_PAYMENT_WEBHOOK_SECRET=$VITE_PAYMENT_WEBHOOK_SECRET
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Serve static files
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
