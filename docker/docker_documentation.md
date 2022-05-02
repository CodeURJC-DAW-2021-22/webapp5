## **Docker**

Manage the application with docker


### **Application properties**

In order to run the application you need to use environment variables to configure the application.properties. Here is a table with the variables and its correspondent application properties:


| **Name**					 | **Application Property**		 | **Default**							 | **Description**									 |
| -------------------------- | ----------------------------- | ------------------------------------- | ------------------------------------------------- |
| PORT						 | server.port					 | 8080									 | Server port 										 |
| SPRING_DATASOURCE_URL		 | spring.datasource.url		 | jdbc:postgresql://localhost/softwear	 | Database URL										 |
| SPRING_DATASOURCE_USERNAME | spring.datasource.username	 | postgres								 | Database user									 |
| SPRING_DATASOURCE_PASSWORD | spring.datasource.password	 | password								 | Database password 								 |
| MAILER_EMAIL				 | mailer.email					 | softwearDAW@gmail.com				 | Email used in the MailerService (GMail account)	 |
| MAILER_PASS				 | mailer.pass					 | 										 | Password for the MAILER_EMAIL					 |


### **Image creation**

You can choose between two options in order to create the image:

* Use the Dockerfile
* Use the create_image.sh script

If you do not want to create the image, you could download it from our dockerhub repository [softweardaw/codeurjc-daw-2021-22-webapp5](https://hub.docker.com/repository/docker/softweardaw/codeurjc-daw-2021-22-webapp5)


#### Dockerfile

In order to compile the image with a dockerfile, you need docker client to be installed in your system. You could use the webapp5-compile.Dockerfile with the following command from the docker directory. 
```bash
docker build -f webapp5-compile.Dockerfile -t <target-image> ..
```

#### Create with create_image.sh

In order to compile the image with the executable file you sould change your wd to docker directory and execute:

```bash
./create_image.sh
```

You need to install docker in your system in order to execute this script. Also, you may need execute it as root.


### **Container Execution**

You can execute the image in a container with the following command:

```bash
docker run [ -d | -it ] --name <container-name> \
	--network <network-name> \
	-e PORT=<application-port> \
	-e SPRING_DATASOURCE_URL=<database-address> \
	[-e SPRING_DATASOURCE_USERNAME=<database-user>] \
	[-e SPRING_DATASOURCE_PASSWORD=<database-password>] \
	[-e MAILER_EMAIL=<mailer-email>] \
	[-e MAILER_PASS=<mailer-password>] \
    softweardaw/codeurjc-daw-2021-22-webapp5
```

If you not specify a mailer email, it is set to our default email softwearDAW@gmail.com. If you not specify the mailer password, you should use -it options in order to introduce it by command line.

You could substitute the image name with your compiled image name.

---

**NOTE**: You need a postgres database in the same network in order to execute the container. You could run one with the following command:

```bash
docker run -d --name <db-container-name> \
	--network <network-name> \
	-e POSTGRES_DB=<database-name> \
	[-e POSTGRES_USERNAME=<database-user> \]
	-e POSTGRES_PASSWORD=<database-password> \
	postgres:14.2

# Your <database-address> will be jdbc:postgresql://<db-container-name>/<database-name>
```

If you want to execute both simultaneously, you could check the next section.


### **Docker Compose - Application Execution**

You need to install the docker client and docker-compose.You would use the docker-compose.yml file in the docker directory.

You need to specify an email for your mail service. If you don't, the application's mail service will not work. You should specify it in a environment variable named MAILER_EMAIL.

You need to do the same in order to specify the service's password. It is set in the variable MAILER_PASS.

You could execute the following command in order to set those variables and run the application:

```bash
# If you have a docker-compose version previous to version 2, you should use the command docker-compose up

env MAILER_EMAIL=<your-mailer-email> MAILER_PASS=<your-mailer-pass> docker compose up
```

### **Heroku Deployment**

In order to deploy the application with heroku, you must create a heroku account and install heroku and docker clients.

First, you need to log in and create a new application with the following commands:

```bash
heroku login
heroku create <app-id>
```

Then, you need to pull our application image from DockerHub for pushing it into the heroku repository:

```bash
docker image pull softwearDAW/codeurjc-daw-2021-22-webapp5
```

You need to log in heroku repository and push the downloaded application image into your application repository. You could do it with the following commands:

```bash
# Log in heroku repository
heroku container:login
# Change image name
docker image tag softweardaw/codeurjc-daw-2021-22-webapp5:latest registry.heroku.com/<app-id>/web:latest
# Push image
docker push registry.heroku.com/<app-id>/web
```

Then you need to configure the database. You can add the database to your heroku app running the following command:

```bash
heroku addons:create heroku-postgresql --app <app-id>
```

You need to set the environment variables running the following command:

```bash
heroku config:set \
	SERVER_SSL_ENABLED=false \
	SPRING_JPA_HIBERNATE_DDL-AUTO=update \
	MAILER_EMAIL=<mailer-email> \
	MAILER_PASS=<mailer-pass> \
	--app <app-id>
```

Finally, you could release the application running the following command:

```bash
heroku container:release web --app <app-id>
```

---

You could destroy the application running the following command:

```bash
heroku apps:destroy --app <app-id>
```
