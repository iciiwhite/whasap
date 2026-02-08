FROM node:18-slim
RUN apt-get update && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei --no-install-recommends
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]