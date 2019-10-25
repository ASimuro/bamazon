var mysql = require('mysql');
var inquirer = require('inquirer');
require("dotenv").config();
var keys = require("./keys.js");

//Connect to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.user,
    password: keys.password,
    database: "bamazon"
});

connection.connect(function(err) 
{
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

//Inquirer introduction
function startPrompt() 
{
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Welcome Manager. What would you like to do?",
        choices: ["View Products For Sale", "View Low Inventory", "Update Inventory", "Add New Product", "Exit"]
    }]).then(function(user) 
    {
        if (user.action === "View Products For Sale") {
            inventoryView();
        } else if (user.action === "View Low Inventory") {
            lowInventory();
        } else if (user.action === "Update Inventory") {
            updateInventory();
        } else if(user.action === "Add New Product"){
            addProduct();
        }
        else{
            Leave();       
        }
    });
}

//View Inventory
function inventoryView() 
{
    connection.query("SELECT * FROM products", function(err, result) 
    {
    if (err) throw err;
    console.log(result);
    startPrompt();
    });
}


//View Low Inventory
function lowInventory() 
{
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, result) 
    {
    if (err) throw err;
    if(result == ""){
        console.log("There is no low inventory")
    }
    else{
    console.log(result);
    }
    startPrompt();
    });
};
   

//Add Inventory
function updateInventory() 
{
    inquirer.prompt([
        {
        type: "input",
        name: "inputId",
        message: "Enter the ID number of the item you would like to add inventory to."
        },
        {
        type: "input",
        name: "inputNumber",
        message: "What quantity of this item would you like to have?"
        }
    ]).then(function(invAdd)
    {
        connection.query("UPDATE products SET ? WHERE ?", 
        [{
        stock_quantity: invAdd.inputNumber
        },
        {
        item_id: invAdd.inputId
        }],
        function(err, res) {});
        startPrompt();
    });
}


//Add New Product
function addProduct() {
    inquirer.prompt([
        {
        type: "input",
        name: "inputName",
        message: "Enter the item name of the new product.",
        },
        {
        type: "input",
        name: "inputDepartment",
        message: "Enter the department name of the new product.",
        },
        {
        type: "input",
        name: "inputPrice",
        message: "Enter the price of the new product (0.00).",
        },
        {
        type: "input",
        name: "inputStock",
         message: "Enter the stock quantity of the new product.",
        }
    ]).then(function(newProduct)
    {
      //connect to database, insert column
      connection.query("INSERT INTO products SET ?", 
      {
        product_name: newProduct.inputName,
        department_name: newProduct.inputDepartment,
        price: newProduct.inputPrice,
        stock_quantity: newProduct.inputStock
      },
      function(err, res) {});
      startPrompt();
    });
  }

function Leave()
{
connection.end();
}