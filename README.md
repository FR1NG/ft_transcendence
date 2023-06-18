# ft transcendece

## rules:
to work on this team and all the working goes smoothely there is some rules you have to follow:
 - for each feature you have to create new brance and the name of the branch will describe the feature you want to add
 - do not ever under any circumstance change directly on the master branch
 - do not use git add . or * , instead add only the files that you have changed
 - each commit must only contain one change, and the commit message must be descriptive
 - for each feature you have to make a pull request that will be reviewd and merged by otossa
 - do not add any irrelevent files (include them in the git ignore instead)
 - you must write small function that do one thing 
 - do not repeat your self
 - all the variables related to the configuration or secret keys and tokens will be stored on .env file
 - all .env file must be encluded on .gitignore so they will not be staged
### naming convention:
 - variables must be camel case and must describe what it used to store
 - methods must be camel case and must describe what it do
 - classes must be in pascal case
 - for html classes and id's must be in cabab case

## stack:
this broject will be written in this stack: 
    - nestjs for the backend
    - vuejs for the front end (vuetify as component library, pinia as state management system)
    - nginx to serve the application
    - postgres as DBMS 
    - docker , all this will be dockerized, 
        -   for development there will be docker-compose-dev.yml that will run the project on the watch mode
        -   for production there will be docker-compose.yml that will build the project for production
## run:

to run the project for dev on the watch mode run the command on the project root direcotry:
```bash
    docker compose up -f docker-compose-dev.yml
```
