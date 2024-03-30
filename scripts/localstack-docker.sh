#!/bin/sh

echo "Start Docker Containers"
docker compose up --build -d > temp.txt 2>&1
echo
wait $!

echo "Run AWS Setup Script"
./local-aws-setup.sh >> temp.txt 2>&1
echo
wait $!

echo "Run Integration Test"
npm run test:integration

rm temp.txt
