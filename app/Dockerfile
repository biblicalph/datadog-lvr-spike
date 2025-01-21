FROM node

ARG GITHUB_TOKEN
WORKDIR /app
COPY package*.json ./

RUN touch .npmrc \
  && echo '//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}' > .npmrc \
  && echo '@answerbook:registry=https://npm.pkg.github.com/' >> .npmrc \
  && npm ci \
  && rm .npmrc
  
RUN npm install
RUN npm install -g nodemon

COPY . .

# Start the app using nodemon
CMD ["nodemon", "index.js"]