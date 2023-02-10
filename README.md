# Check out this project live

- Live API URL [https://rest-calc.onrender.com/api/v1](https://rest-calc.onrender.com/api/v1)
- Live Frontend URL [https://calc-front.vercel.app/](https://calc-front.vercel.app/)

#### Test Username: testuser
#### Test Password: testpass1


## Project Setup

1- Clone this repository using:
``git clone https://github.com/paterson1720/rest-calc.git``

2- Change into the directory
``cd rest-calc``

3- Install the dependencies using yarn or npm
``npm install``

4- create a .env file and add the following variables (replace with your own value if necessary)
```
MONGO_URI=mongodb://127.0.0.1:27017/restcalc
JWT_SECRET=secret
PORT=5000
```

5- Seed the database y running
``npm run db-seed``

6- Finally run the project by running
``npm run dev``

## API endpoints

### GET /api/v1/operations
Returns a list of all available operations. 
- Sample response:
  ```
  [
    {
    "_id": "63e5f248a5e034e27894a158",
    "label": "Addition",
    "type": "addition",
    "cost": 2,
    "__v": 0
    },
    {
    "_id": "63e5f248a5e034e27894a159",
    "label": "Subtraction",
    "type": "subtraction",
    "cost": 2,
    "__v": 0
    }
]
  ```

### POST /api/v1/register
Register a new account.
- Sample request:
```
curl --location --request POST 'localhost:5000/api/v1/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test-user",
    "password": "123456"
}'
```

- Sample response:
```
{token: "sdjhfjsfueuofei", message: "Registered successfully" }
```

### POST /api/v1/login
Login to the app.
- Sample request:
```
curl --location --request POST 'localhost:5000/api/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test-user",
    "password": "123456"
}'
```

- Sample response:
```
{token: "sdjhfjsfueuofei" }
```

### POST /api/v1/operations/calculate
Request an operation calculation.

- Sample request for operationType : ``random_string``
```
curl --location --request GET 'localhost:5000/api/v1/operations/calculate' \
--header 'Authorization: eyJhbGciOiJII6IkpXVCJ9.eyJ1c2VyIjp7.DcmlfUTwYER4xjgySzM4944' \
--header 'Content-Type: application/json' \
--data-raw '{
    "operationType": "random_string",
    "length": 20,
    "upperalpha": false,
    "loweralpha": true
}'
```

- Sample response:
```
{result: "sdjhfjsfueuo", remainingBalance: 865 }
```

- Sample request for operationType : ``addition``
```
curl --location --request GET 'localhost:5000/api/v1/operations/calculate' \
--header 'Authorization: eyJhbGciOiJII6IkpXVCJ9.eyJ1c2VyIjp7.DcmlfUTwYER4xjgySzM4944' \
--header 'Content-Type: application/json' \
--data-raw '{
    "operationType": "addition",
    "values": [5, 4],
}'
```

- Sample response:
```
{result: 9, remainingBalance: 865 }
```

- Sample request for operationType : ``multiplication``
```
curl --location --request GET 'localhost:5000/api/v1/operations/calculate' \
--header 'Authorization: eyJhbGciOiJII6IkpXVCJ9.eyJ1c2VyIjp7.DcmlfUTwYER4xjgySzM4944' \
--header 'Content-Type: application/json' \
--data-raw '{
    "operationType": "multiplication",
    "values": [5, 4],
}'
```

- Sample response:
```
{result: 20, remainingBalance: 865 }
```

- Sample request for operationType : ``square_root``
```
curl --location --request GET 'localhost:5000/api/v1/operations/calculate' \
--header 'Authorization: eyJhbGciOiJII6IkpXVCJ9.eyJ1c2VyIjp7.DcmlfUTwYER4xjgySzM4944' \
--header 'Content-Type: application/json' \
--data-raw '{
    "operationType": "square_root",
    "values": [9],
}'
```

- Sample response:
```
{result: 3, remainingBalance: 865 }
```


### GET /api/v1/records?page=1&limit=10
Request a list of the current user records with pagination.

- Sample request
```
curl --location --request GET 'localhost:5000/api/v1/operations/calculate' \
curl --location --request GET 'localhost:5000/api/v1/records?page=2&limit=5' \
--header 'Authorization: eyJhbGciOiJIkpXVCJ9.edCI6MTY3NTk2NjAOTY5NjcwfQ.Mq9WvZzTwYER4xjgySzM4944'
```

- Sample response:
```
   {
    "records": [
        {
            "_id": "63e53f910e388a620c448d40",
            "operation": "63e40c06dcde0456009f1c14",
            "user": "63e44494c82bcf8902cc105d",
            "amount": 3,
            "user_balance": 988,
            "operation_response": {
                "result": "",
                "remainingBalance": 988,
                "_id": "63e53f910e388a620c448d41"
            },
            "date": "2023-02-09T18:46:41.688Z",
            "__v": 0,
            "deleted": true
        }
    ],
    "pagination": {
        "totalDocuments": 8,
        "totalPage": 2,
        "currentPage": 2,
        "limit": 5,
        "hasNextPage": false,
        "hasPreviousPage": true,
        "previousPage": 1,
        "nextPage": null
    }
```

### DELETE /api/v1/record/:recordId
Soft delete a record.

- Sample request
```
curl --location --request DELETE 'localhost:5000/api/v1/record/63e53f910e388a620c448d40' \
--header 'Authorization: eyJhbGc6IkpXVCJ9.eyJ14MTgxOCwNjc4NTczODE4fQ.UTSgi3r3UlBqAd9G8A'
```

- Sample response:
```
{
    "record": {
        "_id": "63e53f910e388a620c448d40",
        "operation": "63e40c06dcde0456009f1c14",
        "user": "63e44494c82bcf8902cc105d",
        "amount": 3,
        "user_balance": 988,
        "operation_response": {
            "result": "",
            "remainingBalance": 988,
            "_id": "63e53f910e388a620c448d41"
        },
        "date": "2023-02-09T18:46:41.688Z",
        "__v": 0,
        "deleted": true
    }
}
```
