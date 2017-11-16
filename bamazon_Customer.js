var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
 });

function start () {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
    // once you have the items, prompt the user for which they'd like to buy
    inquirer
    .prompt([
    {
    	name: "products",
    	type: "rawlist",
    	choices: function() {
    		var productArray = [];
    		for (var i = 0; i < results.length; i++) {
    			productArray.push(results[i].product_name);
    		}
    		return productArray;
    	},
    	message: "What is the ID of the product you would like to buy?"
    },
    {
    	name: "stock",
    	type: "input",
    	message: "How many units would you like to buy?"
    }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenProduct;
        for (var i = 0; i < results.length; i++) {
        	if (results[i].product_name === answer.choice) {
        		chosenProduct = results[i];
        	}
        }
              // determine if there's enough stock to buy
        if (chosenProduct.stock_quantity > parseInt(answer.stock)) {
          
          connection.query(
            "UPDATE products SET ? WHERE ?", //I'm unsure how to do the 'math' 
            [
              {
                stock_quantity: //stock_quantity - answer.stock...?
              },
              
            ],
            function(error) {
              if (error) throw err;
              console.log("Thanks for shopping!");
              start();
              //a callback to have them buy something else?
            }
          );
        }
        else {
          // if the stock_quantity in the mysql table is too low for their answer
          console.log("Sorry, we don't have enough!");
          start();
        }
    });
});
}