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
	console.log("Welcome to AudioSite's product management console:")
	console.log("");
	actionResponse();
})

function actionResponse() {
	inq
	.prompt([
	{
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products", "View Low Inventory", "Add Inventory", "Add Product"],
		name: "action"
	}
	])
	.then(function(inquirerResponse) {
		if (inquirerResponse.action === "View Products") {
			productView();
		}
		else if (inquirerResponse.action === "View Low Inventory") {
			lowInvView();
		}
		else if (inquirerResponse.action === "Add Inventory") {
			addInventory();
		}
		else if (inquirerResponse.action === "Add Product") {
			addProduct();
		}
	})

}

function productView() {
	console.log("");
	console.log("See below for a list of products currently available on AudioSite:")
	console.log("");
	connect.query("SELECT * FROM products", function(err, result) {
		if (err) throw err;
		for (i in result) {
			var newProduct = JSON.stringify(result[i]);
			newProduct = newProduct.slice(1, (newProduct.length-1));
			console.log(newProduct);
			console.log("");
		}
		inq
			.prompt([
			{
				type: "list",
				message: "Would you like to do anything else within AudioSite's product management console?",
				choices: ["YES", "NO"],
				name: "restart"
			}
			])
			.then(function(inqResponse) {
				if (inqResponse.restart === "YES") {
					actionResponse();
				}
				else {
					process.exit();
				}
			})
	});
}

function lowInvView() {
	console.log("");
	console.log("See below for a list of products with low quantities on AudioSite: ")
	console.log("");
	console.log("Before updating inventory, keep in mind that these products could be VINTAGE, USED or RARE".red)
	console.log("");
	connect.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, result) {
		if (err) throw err;
		for (i in result) {
			var newProduct = JSON.stringify(result[i]);
			newProduct = newProduct.slice(1, (newProduct.length-1));
			console.log(newProduct);
			console.log("");
		}
		inq
			.prompt([
			{
				type: "list",
				message: "Would you like to do anything else within AudioSite's product management console?",
				choices: ["YES", "NO"],
				name: "restart"
			}
			])
			.then(function(inqResponse) {
				if (inqResponse.restart === "YES") {
					actionResponse();
				}
				else {
					process.exit();
				}
			})
	});
}

function addInventory() {
	inq.prompt([
		{
			type: "input",
			message: "Please enter the ID of the product you would like to restock:",
			name: "productID"
		},
		{
			type: "input",
			message: "How many units would you like to order?",
			name: "orderQuantity"
		}
	])
	.then(function(inqResponse) {
		connect.query("SELECT * FROM products WHERE item_id = '" + inqResponse.productID + "'", function (err, res) {
			if (err) throw err;
			var newQuantity = parseInt(inqResponse.orderQuantity) + res[0]["stock_quantity"];
		
			connect.query("UPDATE products SET stock_quantity = '" + newQuantity + "' WHERE item_id = '" + inqResponse.productID + "'", function(err, result) {
				if (err) throw err;
				console.log("");
				console.log("Thank you for your update...");
				console.log("");
				inq
				.prompt([
				{
					type: "list",
					message: "Would you like to do anything else within AudioSite's product management console?",
					choices: ["YES", "NO"],
					name: "restart"
				}
				])
				.then(function(inqResponse) {
					if (inqResponse.restart === "YES") {
						actionResponse();
					}
					else {
						process.exit();
					}
				})
			})
		})
	})
}

function addProduct() {
	inq
	.prompt([
	{
		type: "input",
		message: "Please enter the UNIQUE 5-digit ID for this new product",
		name: "id"
	},
	{
		type: "input",
		message: "What is the official name of this product?",
		name: "name"
	},
	{
		type: "list",
		message: "Which type of musical equipment is this?",
		choices: ["Polyphonic Synthesizer", "Monophonic Synthesizer", "MIDI Controller", "Preamplifier", "Drum Machine", "Amplifier", "Other"],
		name: "department"
	},
	{
		type: "input",
		message: "Enter the price of this item (ENTER AS INTEGER OR FLOAT, NO $):",
		name: "price"
	},
	{
		type: "input",
		message: "How much of this product would you like to order on its initial run?",
		name: "quantity"
	}
	])
	.then(function(inqResponse) {
		var newid = parseInt(inqResponse.id);
		var newName = inqResponse.name;
		var newDepartment = inqResponse.department;
		var newPrice = parseFloat(inqResponse.price);
		var newQuantity = parseInt(inqResponse.quantity);
		var query = "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (" + newid + ", '" + newName + "', '" + newDepartment + "', " + newPrice + ", " + newQuantity + ");";
		connect.query(query, function(err, res) {
			if (err) throw err;
			console.log("");
			console.log("You have successfully added a new item to AudioSite!");
			console.log("");
			inq
				.prompt([
				{
					type: "list",
					message: "Would you like to do anything else within AudioSite's product management console?",
					choices: ["YES", "NO"],
					name: "restart"
				}
				])
				.then(function(inqResponse) {
					if (inqResponse.restart === "YES") {
						actionResponse();
					}
					else {
						process.exit();
					}
				})
		})
	})
}