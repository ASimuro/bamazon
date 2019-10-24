var mysql = require('mysql');
var inquirer = require('inquirer');

//Connect to SQL database

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//Inquirer introduction

function startPrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            afterConnection();
        } else {
            console.log("Thank you! Come back soon!");
            connection.end();
        }
    });
}

//Inventory

function afterConnection() {
         connection.query("SELECT * FROM products", function(err, result) {
       if (err) throw err;
       console.log(result);
       
            continuePrompt();
        });
    }


//Inquirer user purchase

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log("Thank you! Come back soon!");
            connection.end();
        }
    });
}

//Item selection and Quantity desired

function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many units of this item would you like to purchase?",

        }
    ]).then(function(userPurchase) {

        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log("\nSorry! Not enough in stock. Please try again later.\n");
                    startPrompt();

                } else {
                    //list item information for user for confirm prompt
                    console.log("\nYou've selected:");
                    console.log("\nItem: " + res[i].product_name);
                    console.log("\nDepartment: " + res[i].department_name);
                    console.log("\nPrice: $" + res[i].price);
                    console.log("\nQuantity: " + userPurchase.inputNumber);
                    console.log("\nTotal: $" + res[i].price * userPurchase.inputNumber+ "\n");

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    //console.log(newStock);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

 //Confirm Purchase

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("\nTransaction completed. Thank you.\n");
            startPrompt();
        } else {
            console.log("\nNo worries. Maybe next time!\n");
            startPrompt();
        }
    });
}