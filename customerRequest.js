//referencing the inquirer NPM package
var inq = require("inquirer");

//referencing the SQL NPM package
var mysql = require("mysql");

//package that stylizes the font of console text
var colors = require("colors");

//connecting to the necessary SQL database (no password for this connection)
var connect = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connect.connect(function (err) {
	if(err) throw err;
	console.log("");
	console.log("Welcome to AudioSite! Please browse our collection of music technology.");
	console.log("");
	connect.query("SELECT * FROM products", function(err, result) {
		if (err) throw err;
		for (i in result) {
			var newProduct = JSON.stringify(result[i]);
			newProduct = newProduct.slice(1, (newProduct.length-1));
			console.log(newProduct);
			console.log("");
		}
		purchaseOrder();
	});
	

})

function purchaseOrder() {
	console.log("");
	inq
		.prompt([
		{
			type: "input",
			message: "Please enter the ID of the product you would like to purchase:",
			name: "productID"
		},
		{
			type: "input",
			message: "How many units would you like to order?",
			name: "orderQuantity"
		},
		{ 	
			type: "list",
			message: "Lastly, review your order and indicate below whether it is correct",
			choices: ["YES", "NO"],
			name: "confirm"
		}
		])
		.then(function(inquirerResponse) {
			if (inquirerResponse.confirm === "YES") {
				connect.query("SELECT * FROM products WHERE item_id ='" + inquirerResponse.productID + "'", function(err, result) {
					if (err) throw err;
					if (result[0]["stock_quantity"] > inquirerResponse.orderQuantity) {
						console.log("");
						console.log("Thank you for purchasing " + inquirerResponse.orderQuantity.underline + " unit(s) of the " + result[0]["product_name"].underline + " " + result[0]["department_name"] + ".");
						var totalPrice = result[0]["price"] * inquirerResponse.orderQuantity;
						totalPrice = totalPrice.toFixed(2);
						console.log("");
						console.log("Your total is " + "$".underline.green + totalPrice.underline.green);
						var newQuantity = result[0]["stock_quantity"] - inquirerResponse.orderQuantity;
						connect.query("UPDATE products SET stock_quantity = '" + newQuantity + "' WHERE item_id = '" + inquirerResponse.productID + "'", function(err, result) {
							if (err) throw err;
							console.log("");
							inq
							.prompt([
							{
								type: "list",
								message: "Would you like to place another order with AudioSite?",
								choices: ["YES", "NO"],
								name: "restart"
							}
							])
							.then(function(inqResponse) {
								if (inqResponse.restart === "YES") {
									connect.query("SELECT * FROM products", function(err, result) {
										if (err) throw err;
										for (i in result) {
											var newProduct = JSON.stringify(result[i]);
											newProduct = newProduct.slice(1, (newProduct.length-1));
											console.log(newProduct);
											console.log("");
										}
										purchaseOrder();
									});
								}
								else {
									console.log("");
									console.log("Thank you for visiting AudioSite! Hope to see you back around soon.");
									console.log("");
									process.exit();
								}
							})

						})
					}
					else {
						console.log("We're sorry... You've entered an order quantity that cannot be fulfilled. Try again.");
						purchaseOrder();
					}
				})

			}
			else {
				purchaseOrder();
			}
		});
}


