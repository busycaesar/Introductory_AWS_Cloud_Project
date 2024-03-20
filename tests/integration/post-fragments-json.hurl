# Integration Test: POST and GET JSON Fragment
# test/integration/post-fragments-json.hurl

# POST Fragment

# Make a POST request to the correct url to store the fragment
POST http://localhost:8080/v1/fragments
# - Pass the content-type
Content-Type: application/json
# - Include authorization header
[BasicAuth]
user1@email.com:ps1
# - Include body with fragment data
```
{
  maintainer_name : "Dev Shah"
  email_id : "djshah11@myseneca.ca"
}
```

# Test POST Response

# Make sure it returns the expected values
# - Status code 201
HTTP 201

[Asserts]
# - Location header with url to new fragment
# It should be "http://[Domain name]:8080/v1/fragments/[Fragment Id]"
header "Location" matches "^http:\/\/.*:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# - Content type header to be equal to application/jsonpath
header "content-type" == "application/json; charset=utf-8"
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
jsonpath "$.fragment.size" == 71

# Capture POST Response
[Captures]
fragmentLocation: header "Location"

# GET Fragment

GET {{fragmentLocation}}
# - Include authorization header
[BasicAuth]
user1@email.com:ps1

# Test GET Response

HTTP 200
Content-Type: application/json; charset=utf-8
Content-Length: 71

[Asserts]
body == ```
{
  maintainer_name : "Dev Shah"
  email_id : "djshah11@myseneca.ca"
}
```
