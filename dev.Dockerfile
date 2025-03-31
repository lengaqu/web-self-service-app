FROM node:10-alpine

# RUN apk update && apk add git && apk add ruby-full
RUN apk update && apk add git ruby-full ruby-dev build-base linux-headers

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g gulp-cli bower

COPY . .

RUN bower install

RUN npm install --save-dev gulp gulp-inject gulp-ruby-sass

RUN gem install sass

EXPOSE 3000

CMD [ "gulp", "serve" ] 
