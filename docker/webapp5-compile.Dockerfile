FROM node:18-alpine as node_compiler

WORKDIR /usr/share/node/app

RUN npm install -g @angular/cli
COPY frontend/src /usr/share/node/app/src
COPY frontend/angular.json /usr/share/node/app/angular.json
COPY frontend/package.json /usr/share/node/app/package.json
RUN npm install
COPY frontend/tsconfig.app.json /usr/share/node/app/tsconfig.app.json
COPY frontend/tsconfig.json /usr/share/node/app/tsconfig.json
RUN ng build --base-href="/new/"

FROM maven:3.8.4-openjdk-17 as maven_compiler

ENV WEBAPP_VERSION=lastest

WORKDIR /usr/share/app

COPY backend/pom.xml /usr/share/app/pom.xml
RUN mvn clean && mvn -B -f pom.xml dependency:resolve
COPY backend/src /usr/share/app/src
COPY --from=node_compiler /usr/share/node/app/dist/* /usr/share/app/src/main/resources/static/new/
RUN mvn package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /usr/share/app

COPY --from=maven_compiler /usr/share/app/target/webapp5*.jar /usr/share/app/webapp5.jar

CMD ["java", "-jar", "webapp5.jar"]

