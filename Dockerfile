# Note: This dockerfile is not optimized for production
# Use multi stage build with set secure default user, instead

FROM node:20-alpine AS development

WORKDIR /usr/src/app
COPY package.json ./

RUN npm install

# Enable hot reload through bind mount
CMD ["npm", "run", "start:dev"]
