FROM dockerregistry.immin.io/im-node-app:latest

# install dependencies
WORKDIR /opt/app

# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
ENV PORT 4000
EXPOSE 4000

CMD [ "npm", "run", "start" ]
