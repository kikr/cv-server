FROM mhart/alpine-node:10.2.1

# Create app directory
# All following RUN commands are ran in this directory
WORKDIR /usr/src/cv

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Destination is in relation to the WORKDIR
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD [ "start" ]