# Winter 2019 Developer Intern Challenge RestFul API Documentation Joon Choi
# Joon Choi, joonkbjc@gmail.com

### Create a new Shop
- description: create a new shop
- request: `POST /api/shops`
	- content-type: `application/json`
	- body: object
		- name: (string) the name of shop 
- response: 200
	- body: "Shop: (shopname) created."
- response: 409
	- body: "Shop: (shopname) already exists."

```
curl -X POST 
	-H 'Content-Type: application/json' 
	--data '{"name": "fruitShop"}' 
	http://localhost:3000/api/shops/
```

### Add a product to a Shop
- description: Add a product to a given Shop 
- request: `POST /api/:shop/product`
	- content-type: `application/json`
	- body: object
		- name: (string) the name of product
		- price: (string) the price of product 
- response: 200
	- body: "Product: (product name) added."
- response: 408
	- body: "Product: (product name) already exists."
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl -X POST 
	-H 'Content-Type: application/json' 
	--data '{"name": "apple", "price": "1"}' 
	http://localhost:3000/api/fruitShop/product
```

### Make an Order
- description: Make an order given a shop and list of products and their quantity.
- request: `POST /api/:shop/orders`
	- content-type: `application/json`
	- body: object
		- items: array
			- item: object
				- name: (string) name of product
				- quantity: (string) quantity of product
- response: 200
	- body: "Order received."
- response: 408
	- body: "Product: (product name) does not exist."
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl -X POST 
	-H 'Content-Type: application/json' 
	--data '{"items": [{"name": "apple", "quantity": "2"}, {"name": "pear", "quantity": "3"}]}' 
	http://localhost:3000/api/fruitShop/orders
```

### Get shop products
- description: Get the available products from a shop
- request: `GET api/:shop/products`
- response: 200
	- content-type: `application/json`
	- body: array
		- product: object
			- name: (string) name of product
			- price: (string) price of product
			- ...
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl localhost:3000/api/fruitShop/products
```

### Get Order
- description: Get order given its id.
- request: `GET /api/orders/:orderId`
- response: 200
	- content-type: `application/json`
	- body: object
		- shop: (string) name of shop
		- products: array
			- product: object
				- name: (string) name of product
				- price: (string) price of product
				- ...
		- totalCost: (int) total cost of order
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl localhost:3000/api/orders/bfQYIl18geGBBkD5
```


### Modify Product line item
- description: Modify product and/or its line item from a given shop
- request: `PATCH /api/:shop/products/`
	- content-type: `application/json`
	- body: object
		- name: (string) name of product
		- price: (string) price of product
		- ...
- response: 200
	- body: "Product updated"
- response: 408
	- body: "Product: (product name) does not exist."
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl -X PATCH 
	-H 'Content-Type: application/json' 
	--data '{"name":"ap1ple", "price": "-1"}' 
	http://localhost:3000/api/fruitShop/products
```


### Modify Product line item
- description: Modify product and/or its line item from a given shop
- request: `PATCH /api/:shop/products/`
	- content-type: `application/json`
	- body: object
		- name: (string) name of product
		- price: (string) price of product
		- ...
- response: 200
	- body: "Product updated"
- response: 408
	- body: "Product: (product name) does not exist."
- response: 409
	- body: "Shop: (shopname) does not exist."

```
curl -X PATCH 
	-H 'Content-Type: application/json' 
	--data '{"name":"apple", "price": "3"}' 
	http://localhost:3000/api/fruitShop/products
```

### Delete Order
- description: Delete an order given its ID.
- request: `DELETE /api/orders/:orderId`
- response: 200
	- body: "Order deleted"
- response: 404
	- body: "Order: (order id) does not exist"

```
 curl -X DELETE localhost:3000/api/orders/bfQYIl18geGBBkD5
```


### Delete Shop
- description: Delete a shop given its name.
- request: `DELETE /api/orders/:orderId`
- response: 200
	- body: "Shop deleted"
- response: 404
	- body: "Shop: (shopname) does not exist."

```
curl -X DELETE localhost:3000/api/shop/fruitShop
```

