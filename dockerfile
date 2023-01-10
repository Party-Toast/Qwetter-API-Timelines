FROM node:16-alpine as builder

COPY package*.json ./ 

RUN npm install

COPY . .
#install dependancies

EXPOSE 3003

CMD ["npm", "run", "start"]
