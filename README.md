## mysql_nintendoshop

This application was created for applying mySQL and Node Inquirer to interactively search and change SQL databases. To use,
set up a SQL database from the shop.sql, then run Node shop.js in your terminal.

### How it works: 
* Start up the CLI app with node shop.js
![example1](https://i.imgur.com/9WGimEz.png)  
* Inquirer will load a CLI text that allows you a handful of options. Selecting "See Store" shows a table of all the items.
![example2](https://i.imgur.com/JHhOahy.png)
* Purchasing items from the store decreases your funds (which start at $300). The items get added into your inventory and the stock will decrease by 1.
![example3](https://i.imgur.com/3ZuhmgL.png)
* Selecting return an item will pull up a separate mySQL table with your own inventory, which the shop will buy back at 70% of the shop price (GameStop style, except GameStop buys back at much worse rates).






