# Integration Test: 404
# test/integration/404.hurl

# Make get request to root
GET http://localhost:8080/dev

# It response with status code 404
HTTP 404
