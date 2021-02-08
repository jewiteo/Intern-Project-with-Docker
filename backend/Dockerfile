FROM openjdk:13-jdk-alpine

ARG JAR_FILE

COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Dmaven.test.failure.skip=true","-jar","/app.jar"]

EXPOSE 9095:9095