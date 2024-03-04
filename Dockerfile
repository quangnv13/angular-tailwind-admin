# Build
FROM node:20-slim as build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package*.json /app/
RUN pnpm install
COPY . /app
RUN pnpm build

# Deploy
FROM nginx:alpine
RUN apk add --no-cache jq
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/entrypoint.sh /entrypoint.sh
COPY deploy/default.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 80

# ENV
# BACKEND_BASE_API_URL
