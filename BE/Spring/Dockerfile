FROM gradle:7.6-jdk17 AS builder

WORKDIR /project

COPY build.gradle settings.gradle /project/

RUN gradle build --no-daemon --parallel --info || return 0

COPY . .

RUN gradle clean build -x test

FROM openjdk:17-jdk-slim AS runtime

COPY --from=builder /project/build/libs/llm-ops-0.0.1-SNAPSHOT.jar /app/llm-ops-0.0.1-SNAPSHOT.jar

CMD ["java", "-jar", "-Duser.timezone=Asia/Seoul", "/app/llm-ops-0.0.1-SNAPSHOT.jar"]