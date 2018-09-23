#!/bin/sh

curl -X POST -H 'Content-Type: application/json' --data '{"name": "fruitShop"}' http://localhost:3000/api/shops/
curl -X POST -H 'Content-Type: application/json' --data '{"name": "apple", "price": "1"}' http://localhost:3000/api/fruitShop/product
curl -X POST -H 'Content-Type: application/json' --data '{"name": "pear", "price": "2"}' http://localhost:3000/api/fruitShop/product
curl -X PATCH -H 'Content-Type: application/json' --data '{"name":"apple", "price": "3"}' http://localhost:3000/api/fruitShop/products
curl -X POST -H 'Content-Type: application/json' --data '{"items": [{"name": "apple", "quantity": "2"}, {"name": "pear", "quantity": "3"}]}' http://localhost:3000/api/fruitShop/orders