var inquire = require('inquirer');
var mysql = require('mysql');
var keys = require('./keys.js');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "nintendo_db"
});

let funds = 300;

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connection ID is " + connection.threadId);
});

const loadMessage = () => {
  console.log("\n Welcome to Binyan's hole-in-the-wall Nintendo Fan Shop! \n");
  console.log("We're so thrifty here that we can't afford a front end user interface! \n");
  mainScreen();
};

const mainScreen = () => {
  inquire.prompt([
    {
      message: "What would you like to do?",
      type: "list",
      name: "action",
      choices: [{name:"See Store", value:1}, {name:"Purchase items", value: 2}, {name:"Return an item", value:3}, {name:"Search for an item", value:4}, {name:"Leave Shop", value:5}]
    }
  ]).then(function(res) {
    console.log(res.action);
    if (res.action === 1) {
      seeItem();
    } else if (res.action === 2) {
      buyItem();
    } else if (res.action === 3) {
      returnItem();
    } else if (res.action === 4) {
      searchItem();
    } else if (res.action === 5) {
      console.log("Thank you, have a great day!")
      connection.end();
    };
  });
};

const seeItem = () => {
  inquire.prompt([
    {
      message: "What type of wares are you interested in?",
      type: "list",
      name: "category",
      choices: ["video game", "amiibo"]
    }
    ]).then(function(res) {
      console.log("chosen category: "+ res.category);
      connection.query("SELECT * FROM inventory WHERE ?", {category: res.category}, function(err, res){
      if (err) throw err;
      console.log(JSON.stringify(res, null, 2));
      mainScreen();
  })
  })
}

const buyItem = () => {
  inquire.prompt([
    {
      message: "What would you like to buy? (type item name)",
      type: "input",
      name: "itemBuy"
    }
  ]).then(function(res) {
    let item = res.itemBuy;
    connection.query("SELECT id, console, item, stock, price, sold FROM inventory WHERE ?", {item: item}, function(err, res) {
      if (err) throw err;
      console.log(res);
      let selectArr = [];
      selectArr.push(
        {
          name: (`${res[0].item} for ${res[0].console}, Price: $${res[0].price}, Stock: ${res[0].stock}`),
          value: res[0].id,
          short: res[0].item
        });
      console.log(selectArr);
      confirmBuy(selectArr);
    });
  });
};

const confirmBuy =(selectArr) => {
  inquire.prompt([
    {
      message: "Buy this item?",
      type: "list",
      choices: [...selectArr, {name:"cancel", value: false, short:"cancel"}],
      name: "confirm",
      default: false
    }
  ]).then(function(res) {
    console.log(res.confirm + " <= confirmation value")
    console.log(typeof res.confirm);
    if(res.confirm) {
      connection.query("SELECT * FROM inventory WHERE ?", {id: res.confirm}, function(resp) {
        console.log(resp);
        console.log("current stock: "+ resp.stock);
        if (resp.stock > 0) {
          let newValue = resp.stock - 1 ;
          connection.query(`UPDATE inventory SET ? WHERE ?`, [{stock: newValue}, {id: res.confirm}], function(response) {
            console.log("Purchased Item!");
            funds -= resp[price]
            console.log(`You have $${funds} left`);
            mainScreen();
          });
        };
      });
    } else if (res.confirm === false) {
      console.log("Sorry, out of stock! \n");
      mainScreen();
    };
  });
};

loadMessage();