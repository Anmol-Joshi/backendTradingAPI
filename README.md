https://backend-solution.herokuapp.com/api/trade

# Portfolio APSs

POST:- localhost:4000/api/trade
{
"tickerSymbol":"HOOD",
"price":100,
"quantity":1,
"tradeType":"sell"
}
PUT:- localhost:4000/api/trade/18

{
"price":100,
"quantity":1,
"tradeType":"sell"
}

# API Design:-

# Routes:-

## Trade:-

```js
// get all trades
GET: "https://backend-solution.herokuapp.com/api/trade/"

Sample Response Body:
{
    "HOOD": [
        {
            "_id": "61ea63e79ab6c873ce2a7b9e",
            "tickerSymbol": "HOOD",
            "tradeId": 4,
            "price": 100,
            "quantity": 1,
            "tradeType": "BUY",
            "createdAt": "2022-01-21T07:04:55.457Z",
            "updatedAt": "2022-01-21T07:04:55.457Z",
            "__v": 0
        }
    ],
    "MSFT": [
        {
            "_id": "61ea77eafa716cc3dd4b0e14",
            "tickerSymbol": "MSFT",
            "tradeId": 5,
            "price": 10,
            "quantity": 2,
            "tradeType": "BUY",
            "createdAt": "2022-01-21T09:07:17.844Z",
            "updatedAt": "2022-01-21T09:07:17.844Z",
            "__v": 0
        },
        {
            "_id": "61ea781bfa716cc3dd4b0e1d",
            "tickerSymbol": "MSFT",
            "tradeId": 6,
            "price": 1000,
            "quantity": 2,
            "tradeType": "BUY",
            "createdAt": "2022-01-21T09:07:17.844Z",
            "updatedAt": "2022-01-21T09:07:17.844Z",
            "__v": 0
        }
    ],
    "HOOD1": [
        {
            "_id": "61eac58dc49f1a2b7e295948",
            "tickerSymbol": "HOOD1",
            "tradeId": 7,
            "price": 100,
            "quantity": 1,
            "tradeType": "BUY",
            "createdAt": "2022-01-21T14:14:04.847Z",
            "updatedAt": "2022-01-21T14:14:04.847Z",
            "__v": 0
        }
    ]
}
Status: 200

Sample Response Body:
{
    "message": "No trade present"
}
Status: 200

```

```js
POST "https://backend-solution.herokuapp.com/api/trade/"
Sample Request Body:
 {
    "tickerSymbol":"MSFT",
    "price":1000,
    "quantity":2,
    "tradeType":"buy"
  }

Sample Response Body:
{
   message: 'Trade saved'
}
Status: 200
Sample Request Body:
// tickerSymbol is missing so error is returned
 {
    "price":1000,
    "quantity":2,
    "tradeType":"buy"
  }
Sample Response Body:
{
    "error": "tickerSymbol must be present in body"
}
Status: 400
```

```js
PUT "https://backend-solution.herokuapp.com/api/trade/:id"

Sample Request Body:
//updated quantity from 2 to 20
{
     "tickerSymbol": "MSFT",
    "price":1,
    "quantity":20,
    "tradeType":"buy"
}

Sample Response Body:
{
    "message": "Trade and portfolio updated/deleted"
}
Status: 200

Sample Request Body:
//trying to sell more quantity than present in portfolio
{
     "tickerSymbol": "MSFT",
    "price":1,
    "quantity":23,
    "tradeType":"buy"
}

Sample Response Body:
{
    "error": "Can't execute update order because security quantity can't be -ive"
}
Status: 200


```

```js
DELETE "https://backend-solution.herokuapp.com/api/trade/:id"

Sample Response Body:
{
    "message": "Trade and portfolio updated/deleted"
}
Status: 200

Sample Response Body:
{
    "error": "Invalid tradeId sent"
}
Status: 400
```

## Portfolio:-

```js
DELETE "https://backend-solution.herokuapp.com/api/trade/:id"

Sample Response Body:
{
    "message": "Trade and portfolio updated/deleted"
}
Status: 200

Sample Response Body:
{
    "error": "Invalid tradeId sent"
}
Status: 400
```
