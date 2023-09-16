FROM node:20 as development

WORKDIR /api/
RUN npm install -g npm && npm i -g @nestjs/cli
COPY ./package.json .
RUN npm install
COPY ./build-tools/entry.sh /usr/bin/entry
RUN chmod +x /usr/bin/entry
ENTRYPOINT [ "entry" ]
CMD [ "npm", "run", "start:dev" ]


FROM node:20 as production

WORKDIR /back/
COPY ./package.json .
RUN npm install
COPY ./ .
RUN  npm run build
COPY ./build-tools/entry.sh /usr/bin/entry
RUN chmod +x /usr/bin/entry
ENTRYPOINT [ "entry" ]
CMD [ "node", "./dist/src/main.js" ]
