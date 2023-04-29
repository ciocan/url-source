FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm install-deps
COPY . .
RUN pnpm run build
EXPOSE 3033
CMD ["pnpm", "start:prod"]
