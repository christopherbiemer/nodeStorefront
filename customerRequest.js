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

//on connect display welcome message and query a list of all available products
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
		//run the purchase order function after the list has been displayed
		purchaseOrder();
	});
})

//allows the customer to make a purchase of multiple units of one product at a time
function purchaseOrder() {
	//formatting
	console.log("");
	//ask the customer for the item_id and order quantity; finally, let them review their order and confirm
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
			//if the order is confirmed
			if (inquirerResponse.confirm === "YES") {
				//analyze product data to determine whether the quantity ordered is available
				connect.query("SELECT * FROM products WHERE item_id ='" + inquirerResponse.productID + "'", function(err, result) {
					if (err) throw err;
					//if the ordered quantity is available
					if (result[0]["stock_quantity"] > inquirerResponse.orderQuantity) {
						//log order summary and pricing
						console.log("");
						console.log("Thank you for purchasing " + inquirerResponse.orderQuantity.underline + " unit(s) of the " + result[0]["product_name"].underline + " " + result[0]["department_name"] + ".");
						var totalPrice = result[0]["price"] * inquirerResponse.orderQuantity;
						totalPrice = totalPrice.toFixed(2);
						console.log("");
						console.log("Your total is " + "$".underline.green + totalPrice.underline.green);
						var newQuantity = result[0]["stock_quantity"] - inquirerResponse.orderQuantity;
						//update the stock quantity in the database
						connect.query("UPDATE products SET stock_quantity = '" + newQuantity + "' WHERE item_id = '" + inquirerResponse.productID + "'", function(err, result) {
							if (err) throw err;
							console.log("");
							//ask the user whether they would like to place another order
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
								//if yes, redisplay the list of products and rerun the purchaseOrder function
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
								//exit message
								else {
									console.log("");
									console.log("Thank you for visiting AudioSite! Hope to see you back around soon.");
									console.log("");
									process.exit();
								}
							})

						})
					}
					//if ordered quantity is in excess of stock quantity
					else {
						//error message then rerun purchaseOrder function
						console.log("We're sorry... You've entered an order quantity that cannot be fulfilled. Try again.");
						purchaseOrder();
					}
				})

			}
			//if the order is not confirmed
			else {
				//rerun the purchaseOrder function
				purchaseOrder();
			}
		});
}


