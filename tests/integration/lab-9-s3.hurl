# tests/integration/lab-9-s3.hurl

# POST Fragment

# Make a POST request to store the fragment
POST http://localhost:8080/v1/fragments
# Pass the content-type
Content-Type: text/plain
# Include authorization header
[BasicAuth]
user1@email.com:ps1
# Include body with fragment data
`Hello S3!`

# Test POST Response

# Make sure it returns the expected values
# Status code 201
HTTP 201

# Capture POST Response
[Captures]
fragmentLocation: header "Location"

# GET Fragment

# Make a get request to the returned location in the POST request's response header.
GET {{fragmentLocation}}
# - Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test GET Response

HTTP 200
Content-Type: text/plain; charset=utf-8
Content-Length: 9

[Asserts]
body == "Hello S3!"

# DELETE Fragment

# Make a DELETE request to delete the fragment
DELETE {{fragmentLocation}}
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test DELETE Response

# Make sure it returns the expected values
# Status code 200
HTTP 200

# GET Fragment

# Make a get request.
GET {{fragmentLocation}}
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test GET Response
 
# It should return 404 since the fragment is deleted.
HTTP 404
