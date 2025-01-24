# مرحلة البناء
FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

# نسخ ملف pom.xml فقط لتثبيت التبعيات
COPY pom.xml .
RUN mvn dependency:go-offline

# نسخ الكود المصدري وبناء المشروع
COPY src ./src
RUN mvn clean package -DskipTests

# المرحلة النهائية
FROM openjdk:17-jdk-slim

WORKDIR /app

# نسخ الملف القابل للتنفيذ (JAR) من مرحلة البناء
COPY --from=build /app/target/deleveryspring-0.0.1-SNAPSHOT.jar /app/

# فتح المنفذ
EXPOSE 8080

# تشغيل التطبيق
ENTRYPOINT ["java", "-jar", "/app/deleveryspring-0.0.1-SNAPSHOT.jar"]
