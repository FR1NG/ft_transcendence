FROM node:20 as development

WORKDIR /app/

RUN npm install -g npm
COPY ./package.json .
RUN npm install

CMD [ "npm", "run", "dev" ]


FROM node:20 as build

ARG VITE_API_URL
ARG VITE_INTRA_LOGIN_URL
ARG VITE_DOMAIN

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY ./ .
RUN npm run build-only


#building nginx
FROM nginx:1.25.1-alpine as production
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .

COPY ./build-tools/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
