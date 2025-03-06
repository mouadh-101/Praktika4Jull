#!/bin/bash

# Define the microservices list
MICROSERVICES=("config-Server" "discovery" "Student" "user" "gatew")

# Function to wait for a service to be available
wait_for_service() {
    local url=$1
    local service_name=$2
    echo "Waiting for $service_name at $url..."

    while ! curl -s "$url" | grep "UP" > /dev/null; do
        sleep 3
    done

    echo "$service_name is UP!"
}

# Function to build a microservice
build_microservice() {
    local service_name=$1
    echo "Building $service_name..."

    # Navigate to the microservice directory
    cd "$service_name" || exit

    # Detect if the project is Maven or Gradle and build it
    if [ -f "pom.xml" ]; then
        mvn clean package -DskipTests
    elif [ -f "build.gradle" ]; then
        gradle build -x test
    else
        echo "No build system detected for $service_name!"
        exit 1
    fi

    # Return to the main directory
    cd ..
}

# Function to start a microservice
start_microservice() {
    local service_name=$1
    local port=$2
    local health_url=$3

    # Find the built JAR file
    JAR_FILE=$(find "$service_name/target" "$service_name/build/libs" -name "*.jar" | head -n 1)

    if [ -z "$JAR_FILE" ]; then
        echo "Error: No JAR file found for $service_name!"
        exit 1
    fi

    echo "Starting $service_name..."
    nohup java -jar "$JAR_FILE" > "logs/$service_name.log" 2>&1 &

    # Wait for the service to be available
    wait_for_service "$health_url" "$service_name"
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Build all microservices
for SERVICE in "${MICROSERVICES[@]}"; do
    build_microservice "$SERVICE"
done

# Start services in order
start_microservice "config-server" 8888 "http://localhost:8888/actuator/health"
start_microservice "discovery-service" 8761 "http://localhost:8761/eureka"

# Start other microservices
for SERVICE in "Student" "user"; do
    start_microservice "$SERVICE" 0 "http://localhost:8082/actuator/health"  # Change port if needed
done

# Start API Gateway
start_microservice "api-gateway" 8222 "http://localhost:8080/actuator/health"

echo "✅ All microservices built and started successfully!"
