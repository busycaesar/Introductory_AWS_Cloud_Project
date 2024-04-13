# test/integration/put-fragments.hurl

# POST Fragment

POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:ps1
`This is a fragment!`

# Assert responses: Status code
HTTP 201

# Make sure all the expected metadata is received.
[Asserts]
header "Location" matches "^http:\/\/.*\/v1\/fragments\/[A-Za-z0-9_-]+$"
header "content-type" == "application/json; charset=utf-8"
jsonpath "$.status" == "Okay!"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" exists

[Captures]
fragmentLocation: header "Location"

# GET Fragment

GET {{fragmentLocation}}
[BasicAuth]
user1@email.com:ps1

# Assert responses: Status code, Content-type, Content-length
HTTP 200
Content-Type: text/plain; charset=utf-8
Content-Length: 19

# Make sure the data is stored.
[Asserts]
body == "This is a fragment!"

# PUT Fragment
PUT {{fragmentLocation}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:ps1
`This is an updated fragment!`

# Assert responses: Status code
HTTP 201

# GET Fragment

GET {{fragmentLocation}}
[BasicAuth]
user1@email.com:ps1

# Assert responses: Status code, Content-type, Content-length
HTTP 200
Content-Type: text/plain; charset=utf-8
Content-Length: 28

# Make sure the data is updated
[Asserts]
body == "This is an updated fragment!"

# DELETE Fragment

DELETE {{fragmentLocation}}
[BasicAuth]
user1@email.com:ps1

# Assert responses: Status code
HTTP 201

# GET Fragment

GET {{fragmentLocation}}
[BasicAuth]
user1@email.com:ps1

# Assert responses: Status code
HTTP 404
