# nodeStorefront

## I. INFO: 

###### This app uses Bash commands view, edit and append a SQL database. More specifically, the app reflects an online storefront, containing a user purchase portal (Section IV) and a product management console (Section V). 

## II. WALKTHROUGH LINK

###### Please view follow this link for a narrated on-screen walkthrough of the various use cases of this app:

[AudioSite Terminal Storefront Walkthrough](https://drive.google.com/open?id=1mAGaZuyvLrAkQIz3GA3ropTyCVaUkUnY)

## III. DATA:

###### SQL queries for mockup data:
###### CREATE DATABASE bamazon;
###### USE bamazon;
###### CREATE TABLE products (item_id INT(10) NOT NULL, product_name VARCHAR(50) NOT NULL, department_name VARCHAR(50) NOT NULL, price FLOAT(10, 2) NOT NULL, stock_quantity INT(10) NOT NULL, primary key (item_id));   
###### INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (13524, "Roland TR 808", "Drum Machine", 3750.00, 3), (53219, "MOOG Little Phatty Stage II", "Monophonic Synthesizer", 824.99, 18), (97324, "Akai Professional Timbre Wolf", "Polyphonic Synthesizer", 185.00, 22), (73892, "Roland JD-XI (Red)", "Polyphonic Synthesizer", 479.00, 7), (49281, "M-Audio Code 49", "MIDI Controller", 199.99, 12), (90324, "JHS Colour Box 500 Series", "Preamplifier", 899.99, 6), (10048, "Fender Hot Rod Deluxe", "Amplifier", 1695.00, 9), (78073, "Arturia MicroBrute", "Monophonic Synthesizer", 269.50, 24), (69800, "Apogee Duet", "Preamplifier", 699.99, 28), (33348, "Fender Rhodes Mark I", "Keyboard", 2750.00, 4);


## IV. USER PURCHASE PORTAL:

###### *MAKE SURE ALL NECESSARY NODE MODULES ARE ADDED*
###### Entry command: "node customerRequest.js"
###### See item_id and available quantity; follow prompts to purchase x quantity of the item with id equal to yyyyy.
###### View total cost.
###### YES to purchase again, NO to exit the portal.


## V. PRODUCT MANAGEMENT CONSOLE:

###### *MAKE SURE ALL NECESSARY NODE MODULES ARE ADDED*
###### Entry command: "node productManager.js"
###### Choose from one of four options (view all, view low inventory, add inventory, add product).
###### IF add inventory, input item_id (yyyyy) and restock quantity (x) as prompted.
###### IF add product, input a unique 5-digit item_id, a product name, a department type (from choice list), price (as float or integer), and initial order quantity as prompted.
###### ALWAYS double check that changes went through with the product view.
###### YES to perform another action within the product management console, NO to exit the portal.
