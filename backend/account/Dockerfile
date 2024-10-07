FROM bellsoft/liberica-openjdk-debian:17

WORKDIR /app

# Gradle의 기본 출력 디렉터리로 변경
COPY build/libs/*.jar /app/app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
