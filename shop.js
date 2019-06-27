var inquire = require('inquirer');
var mysql = require('mysql');
var keys = require('./keys.js');
var table = require('console.table')

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
  // console.log("Connection ID is " + connection.threadId);
});

const loadMessage = () => {
  console.log("\x1b[4m" +"\x1b[33m" +"\n Welcome to Binyan's hole-in-the-wall Nintendo Fan Shop! \n");
  console.log("\x1b[0m"+"\x1b[33m"+"We're so thrifty here that we can't afford a front end user interface! \n");
  console.log("\x1b[0m"+"\x1b[32m"+`Current Funds: $${funds} \n`);
  mainScreen();
};

const mainScreen = () => {
  inquire.prompt([
    {
      message: `\x1b[36m What would you like to do?\n`,
      type: "list",
      name: "action",
      choices: [{name:"See Store", value:1}, {name:"Purchase items", value: 2}, {name:"Return an item", value:3}, {name:"Search for an item", value:4}, {name:"Leave Shop", value:5}]
    }
  ]).then(function(res) {
    // console.log(res.action);
    if (res.action === 1) {
      seeItem();
    } else if (res.action === 2) {
      buyItem();
    } else if (res.action === 3) {
      returnItem();
    } else if (res.action === 4) {
      searchItem();
    } else if (res.action === 5) {
      console.log("\x1b[36m"+"Thank you, have a great day!")
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
      console.log("chosen category: "+ res.category +"/n");
      connection.query("SELECT * FROM inventory WHERE ?", {category: res.category}, function(err, res){
      if (err) throw err;
      // console.log(JSON.stringify(res, null, 2));
      console.table(res)
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
    connection.query("SELECT * FROM inventory WHERE ?", {item: item}, function(err, res) {
      if (err) throw err;
      // console.log(res);
      let selectArr = [];
      selectArr.push(
        {
          name: (`${res[0].item} for ${res[0].console}, Price: $${res[0].price}, Stock: ${res[0].stock}`),
          value: res[0].id,
          short: res[0].item
        });
      // console.log(selectArr);
      confirmBuy(selectArr);
    });
  });
};

const confirmBuy = (selectArr) => {
  inquire.prompt([
    {
      message: `Buy this item?\n Current Funds: $${funds} \n`,
      type: "list",
      choices: [...selectArr, {name:"cancel", value: false, short:"cancel"}],
      name: "confirm",
      default: false
    }
  ]).then(function(res) {
    if(res.confirm) {
      connection.query("SELECT * FROM inventory WHERE ?", {id: res.confirm}, function(err, resp) {
        // console.log(resp);
        // console.log("current stock: "+ resp[0].stock);
        // console.log("sold: " + resp[0].sold);
        if (resp[0].stock > 0) {
          let newValue = resp[0].stock - 1 ;
          let newSold = resp[0].sold + 1;
          connection.query(`UPDATE inventory SET ?,? WHERE ?`, [{stock: newValue}, {sold: newSold}, {id: res.confirm}], function(err, response) {
            // console.log(response);
            console.log("Purchased Item!");
            funds -= resp[0].price;
            connection.query(`INSERT INTO fanInventory (category, console, item, stock, price) VALUES("${resp[0].category}", "${resp[0].console}", "${resp[0].item}", 1, ${resp[0].price})`, function(err, response2) {
              // console.log(response2);
              // console.log(resp[0].category, resp[0].console, resp[0].item, 1, resp[0].price);
              console.log("\x1b[33m"+"Your item stash updated!");
              console.log(`\x1b[31m You have $${funds} left`);
              console.log(`\n \x1b[36m Anything else for today? \n`);
              mainScreen();
            });
          });
        };
      });
    } else if (res.confirm === false) {
      mainScreen();
    };
  });
};


const returnItem = () => {
  let userItem = [];
  connection.query("SELECT * FROM fanInventory", function(err, res) {
    res.forEach(element => {
    userItem.push(
      {
        name: (`${element.item} for ${element.console}, Get Back: $${element.price * 0.70}`),
        value: element.id,
        short: element.item
      });
    });
    // console.log(JSON.stringify(userItem, null, 2) + " Checking MAH ITEMS");
    inquire.prompt([
      {
        message: "What would you like to sell? We buy at 70% value",
        type: "list",
        name: "sellItem",
        choices: [...userItem, {name:"cancel", value: false, short:"cancel"}]
      }
    ]).then(function(res) {
      // console.log(res.sellItem);
      if(res.sellItem) {
        connection.query("SELECT * FROM fanInventory WHERE ?", {id: res.sellItem}, function(err, resp) {
          // console.log(resp);
          // console.log("current stock: "+ resp[0].stock);
          // console.log("sold: " + resp[0].sold);
          if (resp[0].stock > 0) {
            let newValue = resp[0].stock + 1 ;
            connection.query(`UPDATE inventory SET ? WHERE ?`, [{stock: newValue}, {id: res.confirm}], function(err, response) {
              // console.log(response);
              console.log("\x1b[36m"+"Sold item to store! Thank you!");
              funds += resp[0].price*0.70;
              connection.query(`DELETE FROM fanInventory WHERE ?`, {id: res.sellItem}, function(err, response2) {
                console.log("\x1b[33m"+"Your item stash updated!");
                console.log(`\x1b[32m You have $${funds} now \n`);
                mainScreen();
              });
            });
          };
        });
      } else if (res.sellItem === false) {
        console.log(`\n \x1b[36m Anything else for today? \n`);
        mainScreen();
    };
    });
  });
};

const searchItem = () => {
  inquire.prompt([
    {
      message: "\x1b[34m"+ "What would you like to search for? (type item name)",
      type: "input",
      name: "itemBuy"
    }
  ]).then(function(res) {
    let item = res.itemBuy;
    connection.query("SELECT * FROM inventory WHERE ?", {item: item}, function(err, res) {
      if (err) throw err;
      // console.log(res);
      let selectArr = [];
      selectArr.push(
        {
          name: (`${res[0].item} for ${res[0].console}, Price: $${res[0].price}, Stock: ${res[0].stock}`),
          value: res[0].id,
          short: res[0].item
        });
      console.log("\n"+"\x1b[33m"+selectArr[0].name+"\n");
      mainScreen();
    });
  });
};

loadMessage();

// const TESTFUNC = () => {
//   connection.query(`INSERT INTO fanInventory (category, console, item, stock, price) VALUES("video games", "N64", "Paper Mario", 1, 24.10)`, function(err, response2) {
//     console.log(response2);
//   });
// };
// TESTFUNC();
