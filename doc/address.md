# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:idContact/addresses

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "street": "Jln apa",
  "city": "Kota apa",
  "province": "Provinsi apa",
  "country": "Negara apa",
  "postalCode": "23123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jln apa",
    "city": "Kota apa",
    "province": "Provinsi apa",
    "country": "Negara apa",
    "postalCode": "23123"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Street required, ..."
}
```

## Get Address

Endpoint : GET /api/contacts/:idContact/addresses/:idAddress

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jln apa",
    "city": "Kota apa",
    "province": "Provinsi apa",
    "country": "Negara apa",
    "postalCode": "23123"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Address not found, ..."
}
```

## Update Address

Endpoint : PUT /api/contacts/:idContact/addresses/:idAddress

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "street": "Jln apa",
  "city": "Kota apa",
  "province": "Provinsi apa",
  "country": "Negara apa",
  "postalCode": "23123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "Jln apa",
    "city": "Kota apa",
    "province": "Provinsi apa",
    "country": "Negara apa",
    "postalCode": "23123"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Street required, ..."
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:idContact/addresses/:idAddress

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
  "errors": "Address not found, ..."
}
```

## List Address

Endpoint : GET /api/contacts/:idContact/addresses

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jln apa",
      "city": "Kota apa",
      "province": "Provinsi apa",
      "country": "Negara apa",
      "postalCode": "23123"
    },
    {
      "id": 2,
      "street": "Jln apa",
      "city": "Kota apa",
      "province": "Provinsi apa",
      "country": "Negara apa",
      "postalCode": "23123"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Contact not found, ..."
}
```
