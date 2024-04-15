# Stage 1: Install the dependencies ########################################
FROM node:20.10.0 AS dependencies

WORKDIR /application

COPY package* ./

RUN npm install
############################################################################

# Stage 2: Copy the application files ######################################
FROM node:20.10.0 AS development

WORKDIR /application

# Copying the dependencies from Stage 1 to /application
COPY --from=dependencies /application /application

# Copying the source code
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd
############################################################################

# Stage 3: Start the server and keep running the health check
FROM node:20.10.0

LABEL maintainer="Dev <djshah11@myseneca.ca>" \
      description="Fragments Microservice"

ENV PORT=8080

WORKDIR /application

# Copying the application from development stage!
COPY --from=development /application /application

CMD ["node","src/index.js"]

EXPOSE 8080

# Keeping the healthcheck running to make sure it alerts in case of any server errors!
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
############################################################################

# Explaination of Dockerfile with example commands(According to CCP Lab 5) 
# # Introduction to Dockerfile!
# # This is the Dokerfile. It doesnt have any extension.
# # All the necessary instructions for Docker Enginer for building an image for the service will be defined here.

# # Every Docker file starts with 'FROM [image name]'. This is the name of the image which would be the starting point or base of our image. In other words we would be building our image on the top of this image.
# # This helps avoiding the duplication of the work across projects!
# # In our case, we are using 'node' as the base image because it would have all the functionality we need to build our application.
# # We could have chosen anything else than Node but in that case we would have to manually install and configure things which our service requires like node.js.
# # Along with the name of the image, we should also specify specific version of the node by adding the tags. For e.g. node:lts or node:18.
# # This is to make sure our image closely resembles our development environment.
# FROM node:20.10.0

# # Using LABEL [key=value], we can also declare some metadata about the image. 
# LABEL maintainer="Dev <djshah11@myseneca.ca>" \
#       description="Fragments Microservice"

# # Environment variables can be defined using 'ENV [KEY=VALUE]'
# # We would not include any secrets or any variable which will always be different. Those variables can be passed duing run time.
# ENV PORT=8080

# # The base image used would already have defined the filesystem(linux distro and node.js installed).
# # The working directory for the project can be declared using 'WORKDIR [path to directory]'.
# # This working directory can be named and located anywhere in the filesystem. If the directory/s dont exist, it will created it.
# # All the subsequent commands would be related to this location. This command can be used multiple times in this Dockerfile.
# WORKDIR /app

# # The files and folders can be copied into the image using 'COPY [source] [destination]'.
# # In our case, we copy both the package files, listing all the dependencies, into the working directory, that is /app.
# COPY package* .

# # Any command can be executed using RUN [command].
# # In our case we would install all of our dependencies using npm install.
# RUN npm install

# # Once all the dependencies are installed, we would copy the code into the image.
# COPY ./src ./src
# COPY ./tests/.htpasswd ./tests/.htpasswd

# # Telling the Docker to start the process using the command.
# # This command can be executed using CMD [command] vs RUN [command]. We use the later to setup all the node dependencies which has nothing to do with the Docker container. However, to instruct the Docker, the former can be used.
# CMD npm start

# # We can incide the port that the container will listen on using 'EXPOSE [port number]'.
# # This is mostly for documentation purpose! 
# EXPOSE 8080

