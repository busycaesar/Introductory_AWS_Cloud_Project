# Integration Test: Health Check
# test/integration/health-check.hurl

# Make get request to root
GET http://localhost:8080/

# It response with status code 200
HTTP/* 200
# It has no-cache value for cache control 
Cache-Control: no-cache

# Assert the response body
[Asserts]
# The value of status is correct. 
jsonpath "$.status" == "Okay!"
# The value of author is string.
jsonpath "$.author" isString
# The value of githubUrl starts with expected string.
jsonpath "$.githubUrl" startsWith "https://github.com/"
# The value of version is in expected format.
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/
