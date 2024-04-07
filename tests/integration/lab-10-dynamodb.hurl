# tests/integration/lab-10-dynamodb.hurl

# POST Fragment

# Make a POST request to store the fragment
POST http://localhost:8080/v1/fragments
# Pass the content-type
Content-Type: application/json
# Include authorization header
[BasicAuth]
user1@email.com:ps1
# Include body with fragment data
```
{
  service : "DynamoDB"
}
```

# Test POST Response

# Make sure it returns the expected values
# Status code 201
HTTP 201

# Capture POST Response
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# GET Fragment

# Make a get request to the returned location in the POST request's response header.
GET {{fragment1_url}}/info
# - Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test GET Response

HTTP 201

[Asserts]
# - Response status
jsonpath "$.status" == "Okay!"
# - Body with JSON object containing fragment's metadata
# - Fragment Id
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# - Owner Id
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# - Created and Updated Timestamp
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
# - Fragment type
jsonpath "$.fragment.type" == "application/json"
# - Fragment size
jsonpath "$.fragment.size" exists

# POST Fragment

# Make a POST request to store the fragment
POST http://localhost:8080/v1/fragments
# Pass the content-type
Content-Type: text/markdown
# Include authorization header
[BasicAuth]
user1@email.com:ps1
# Include body with fragment data
`DynamoDB is **great**`

# Test POST Response

# Make sure it returns the expected values
# Status code 201
HTTP 201

# Capture POST Response
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# GET Fragment

# Make a get request to the returned location in the POST request's response header.
GET {{fragment2_url}}/info
# - Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test GET Response

HTTP 201

[Asserts]
# - Response status
jsonpath "$.status" == "Okay!"
# - Body with JSON object containing fragment's metadata
# - Fragment Id
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# - Owner Id
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# - Created and Updated Timestamp
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
# - Fragment type
jsonpath "$.fragment.type" == "text/markdown"
# - Fragment size
jsonpath "$.fragment.size" exists

# GET Fragments

# Make a GET request to get all the fragmenta
GET http://localhost:8080/v1/fragments
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Make sure it returns the expected values
# Status code 200
HTTP 200

[Asserts]
jsonpath "$.fragments" isCollection
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# DELETE Fragments

# Make a DELETE request
DELETE {{fragment1_url}}
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Make sure it returns the expected values
# Status code 200
HTTP 200

# GET Fragments

# Make a GET request to get all the fragmenta
GET {{fragment1_url}}
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Make sure it returns the expected values
# Status code 404
HTTP 404

# GET Fragments

# Make a GET request to get all the fragmenta
GET http://localhost:8080/v1/fragments
# Include authorization header
[BasicAuth]
user1@email.com:ps1

# Make sure it returns the expected values
# Status code 200
HTTP 200

[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
