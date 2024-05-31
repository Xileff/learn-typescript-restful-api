# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "firstName": "Felix",
  "lastName": "Savero",
  "email": "felix@example.com",
  "phone": "081122223333"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix",
    "lastName": "Savero",
    "email": "felix@example.com",
    "phone": "081122223333"
  }
}
```

Request Body (Failed) :

```json
{
  "errors": "First name required, ..."
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix",
    "lastName": "Savero",
    "email": "felix@example.com",
    "phone": "081122223333"
  }
}
```

Request Body (Failed) :

```json
{
  "errors": "Contact not found, ..."
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "firstName": "Felix",
  "lastName": "Savero",
  "email": "felix@example.com",
  "phone": "081122223333"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstName": "Felix",
    "lastName": "Savero",
    "email": "felix@example.com",
    "phone": "081122223333"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "First name required, ..."
}
```

## Remove Contact

Endpoint : DELETE /api/contacts/:id

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :

```json
{
  "errors": "Contact not found, ..."
}
```

## Search Contact

Endpoint : GET /api/contacts

Query Parameter :

- name : **string**, contact first name or contact last name, optional
- phone : **string**, contact phone, optional
- email : **string**, contact email, optional
- page : **number**, default 1
- size : **number**, default 10

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Felix",
      "lastName": "Savero",
      "email": "felix@example.com",
      "phone": "081122223333"
    },
    {
      "id": 2,
      "firstName": "Renard",
      "lastName": "Renady",
      "email": "renard@example.com",
      "phone": "081122223333"
    }
  ],
  "paging": {
    "currentPage": 1,
    "totalPage": 10,
    "size": 10
  }
}
```

Request Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```
