# User API Spec

## Register User

Endpoint: POST /api/users

Request Body :

```json
{
  "username": "felix123",
  "password": "rahasia123",
  "name": "Felix Savero"
}
```

Response Body (Success) :

```json
{
  "username": "felix123",
  "name": "Felix Savero"
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must not be blank, ..."
}
```

## Login User

Endpoint: POST /api/users/login

Request Body :

```json
{
  "username": "felix123",
  "password": "rahasia123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "felix123",
    "name": "Felix Savero",
    "token": "token"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username or password wrong, ..."
}
```

## Get User

Endpoint: GET /api/users

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "username": "felix123",
  "name": "Felix Savero"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint: PATCH /api/users/current

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "password": "rahasia123", // optional
  "name": "Felix Savero" // optional
}
```

Response Body (Success) :

```json
{
  "username": "felix123",
  "name": "Felix Savero"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint: DELETE /api/users/current

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
  "errors": "Unauthorized, ..."
}
```
