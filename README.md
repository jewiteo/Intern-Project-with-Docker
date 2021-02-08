The purpose of the project is a full-stack web application CRUD operations on Acronym. 

## Prerequisites
[Download](https://www.oracle.com/technetwork/database/database-technologies/express-edition/downloads/index.html) the RPM from Oracle Technology Network and save to files folder under ./database/files

## Set up
Note first time will take a a while to run for as the oracle-xe configure script needs to complete to create the database.
```bash
docker-compose up
```

## Run and Build Program
Common Paramaters Used with docker-compose for this project.

Command | Description
--- | ---
up | Create and Start Containers **Should be used on the first setup
build | Build or rebuild services (use with up to rebuild project)
down | Stop and remove Containers, Networks, Image and Volumes
rm | Remove stopped Containers
start | Start Containers
stop | Stop Containers
exec | Execute command in a running container

More references can be found [here](https://docs.docker.com/compose/reference/overview/).

## Script to intialise data
SQL instruction that should run on set up can be written onto an .sql file and be added to the folder .\database\scripts\sql
Update the Dockerfile within .\database with the name of the new .sql file at SQL_FILE within ENV portion of the Dockerfile.