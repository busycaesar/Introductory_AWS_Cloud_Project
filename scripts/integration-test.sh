#!/bin/sh

echo "Compose docker containers"
docker compose up --build -d > /dev/null 2>&1 || exit 1

echo "Setup local AWS"
npm run local-aws > /dev/null 2>&1 || exit 1

echo "Run Integration Tests"
npm run test:integration || exit 1

docker compose down
