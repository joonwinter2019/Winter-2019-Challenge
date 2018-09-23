/*jshint esversion: 6 */ 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Datastore = require('nedb');
var shops = new Datastore({ filename: 'db/shops.db', autoload: true, timestampData : true});
var orders = new Datastore({ filename: 'db/orders.db', autoload: true, timestampData : true});


app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});


var Order = (function(){
    return function item(shop, products, totalCost){
    	this.shop = shop
        this.products = products;
        this.totalCost = totalCost;
    };
}());


// CREATE

// Create a new shop given name of shop
// curl -X POST -H 'Content-Type: application/json' --data '{"name": "fruitShop"}' http://localhost:3000/api/shops/
app.post('/api/shops/', function (req, res, next) {
	var name = req.body.name;
    shops.findOne({_id: name}, function(err, shop){
        if (err) return res.status(500).end(err);
        if (shop) return res.status(409).end("Shop: " + name + " already exists.");
        shops.update({_id: name}, {_id: name, products: []}, {upsert: true}, function(err){
            if (err) return res.status(500).end(err);
            return res.json("Shop: " + name + " created.");
        });
    }); 
});


// Add product given product info and name of shop
// curl -X POST -H 'Content-Type: application/json' --data '{"name": "apple", "price": "1"}' http://localhost:3000/api/fruitShop/product
app.post('/api/:shop/product', function (req, res, next) {
    var product = req.body;
    var shopName = req.params.shop;

    shops.findOne({_id: shopName}, function (err, shop) {
        if (err) return res.status(500).end(err);
        if (!shop) return res.status(409).end("Shop: " + shopName + " does not exist.");

        // check if product already exists
    	for (var j = 0; j < shop.products.length; j++) {
    		if (shop.products[j].name == product.name) return res.status(408).end("Product: " + product.name + " already exists.");
    	}

        shops.update({_id: shopName}, { $push: { products: product } }, function(err){
            if (err) return res.status(500).end(err);
            return res.json("Product: " + req.body.name + " added.");
        });
    });

});


// Create an order with list of products and the quantity of each product
// curl -X POST -H 'Content-Type: application/json' --data '{"items": [{"name": "apple", "quantity": "2"}, {"name": "pear", "quantity": "3"}]}' http://localhost:3000/api/fruitShop/orders
app.post('/api/:shop/orders', function (req, res, next) {
    var shopName = req.params.shop;
    var items = req.body.items;
    var total = 0;

    shops.findOne({_id: shopName}, function (err, shop) {
        if (err) return res.status(500).end(err);
        if (!shop) return res.status(409).end("Shop: " + shopName + " does not exist.");

        // calculate total cost for order
	    for (var i = 0; i < items.length; i++) {
	    	var found = false;
	    	for (var j = 0; j < shop.products.length; j++) {
	    		if (shop.products[j].name == items[i].name) {
	    			found = true;
	    			total += parseInt(shop.products[j].price) * parseInt(items[i].quantity);
	    		}
	    	}
	    	// product doesn't exist
	    	if (!found) return res.status(408).end("Product: " + items[i].name + " does not exist.");
	    }

        var order = new Order(shopName, items, total); 
	    orders.insert(order, function (err, order) {
	        if (err) return res.status(500).end(err);
	        return res.json("Order received.");
	    });
    });
});


// READ


// Get products of given shop
// curl localhost:3000/api/fruitShop/products
app.get('/api/:shop/products/', function (req, res, next) {
	var shopName = req.params.shop;
    shops.findOne({_id: shopName}, function (err, shop) {
        if (err) return res.status(500).end(err);
        if (!shop) return res.status(409).end("Shop: " + shopName + " does not exist.");

       	return res.json(shop.products);
    });
});


// Get order given its id
// curl localhost:3000/api/orders/bfQYIl18geGBBkD5
app.get('/api/orders/:orderId', function (req, res, next) {
	var orderId = req.params.orderId;
    orders.findOne({_id: orderId}, function (err, order) {
        if (err) return res.status(500).end(err);
        if (!order) return res.status(409).end("Order: " + orderId + " does not exist.");
       	return res.json(order);
    });
});


// UPDATE


// Update product 
// curl -X PATCH -H 'Content-Type: application/json' --data '{"name":"ap1ple", "price": "-1"}' http://localhost:3000/api/fruitShop/products
app.patch('/api/:shop/products/', function (req, res, next) {
    var shopName = req.params.shop;
    var product = req.body.name;
    var updatedProduct = req.body;


    shops.findOne({_id: shopName}, function (err, shop) {
        if (err) return res.status(500).end(err);
        if (!shop) return res.status(409).end("Shop: " + shopName + " does not exist.");

        // update the product
        var updatedProducts = shop.products;
        var found = false;
    	for (var i = 0; i < updatedProducts.length; i++) {
    		if (updatedProducts[i].name == product) {
				updatedProducts[i] = updatedProduct;
				found = true;
    		}
    	}

    	// product doesn't exist
    	if (!found) return res.status(408).end("Product: " + product + " does not exist.");

        shops.update({_id: shopName}, { $set: { products: updatedProducts } }, function(err){
            if (err) return res.status(500).end(err);
            return res.json("Product updated.");
        });
    });
});


// Delete


// Delete an order given its id
// curl -X DELETE localhost:3000/api/orders/bfQYIl18geGBBkD5
app.delete('/api/orders/:orderId', function (req, res, next) {
    var orderId = req.params.orderId;

    orders.findOne({_id: orderId}, function(err, order){
        if (err) return res.status(500).end(err);
        if (!order) return res.status(404).end("Order: " + orderId+ " does not exist.");
        orders.remove({ _id: orderId}, { multi: false }, function(err, num) {  
            res.json("Order deleted.");
         });
    });   
});



// Delete a shop given its name
// curl -X DELETE localhost:3000/api/shop/fruitShop
app.delete('/api/shop/:shop/', function (req, res, next) {
	var shopName = req.params.shop;
    shops.findOne({_id: shopName}, function(err, shop){
        if (err) return res.status(500).end(err);
        if (!shop) return res.status(404).end("Shop: " + shopName + " does not exist.");
        shops.remove({ _id: shopName}, { multi: false }, function(err, num) {  
            res.json("Shop deleted");
         });
    });    



});

const http = require('http');
const PORT = 3000;

http.createServer(app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});
