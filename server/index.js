/* eslint-disable promise/always-return */
// Firebase Imports
const admin = require("firebase-admin");
const functions = require("firebase-functions");
// Endpoint Imports
const express = require("express");
// Other Imports
const Order = require("./Models/Order");
const OrderProcessor = require("./Services/OrderProcessor");
const GroceryStoreService = require("./Services/GroceryStoreService");
const EdiOrder = require("./Models/EdiOrder");
const GroceryStoreDao = require("./DataAccessObjects/GroceryStoreDao");
const ActiveOrderDao = require("./DataAccessObjects/ActiveOrderDao");
const DriverDao = require("./DataAccessObjects/DriverDao");
const Driver = require("./Models/Driver");
// Initialize App
admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();
var groceryStores = {};
var activeOrdersDao = new ActiveOrderDao.ActiveOrderDao(gsDB);
var groceryStoreDao = new GroceryStoreDao.GroceryStoreDao(gsDB);
var driverDao = new DriverDao.DriverDao(gsDB);
var processor = new OrderProcessor.OrderProcessor(gsDB, activeOrdersDao, groceryStoreDao, driverDao);
var groceryStoreService = new GroceryStoreService.GroceryStoreService(groceryStores);
var cors = require('cors');

exports.pruneDaily = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    groceryStoreDao.pruneInventory();
    return null;
});

/*******************Food Bank EndPoint *************************/
const app = express();

app.use(cors());

app.post("/foodBank/placeOrder", (request, response) => {
    var body = request.body;
    let orderId = activeOrdersDao.generateUniqueKey();
    order = new Order.Order(body);
    order.setOrderId(orderId);
    console.log("Order received and instance created with unique id: " + order.getOrderId())
    processor.processOrder(order, groceryStoreService);
    response.status(200).send("Order Received");
});

/*****************Grocery Store EndPoint **********************/
app.post("/groceryStore/updateUserAccount", (request, response) => {
    
    var groceryUser = request.body;

    /*
    var storeId = groceryStoreDao.generateUniqueKey();
    groceryStoreDao.writeGroceryStoreData(
        groceryUser.companyName,
        groceryUser.location,
        groceryUser.storeNumber,
        groceryUser.ediOrderNumber,
        groceryUser.inventory,
        storeId)
        */
    response.status(200).send("Grocery Store " + groceryUser.location + " Registered");
    console.log(groceryUser);
});

//Update inventory of a store
app.post("/groceryStore/inventoryUpdate", (request, response) => {
    var newEdiOrder = new EdiOrder.EdiOrder(request.body);
    groceryStoreDao.newInventoryToGroceryStoreData(newEdiOrder);
    response.status(200).send("Inventory updated in Firestore");
});

/*****************Driver EndPoint **********************/

app.post("/driver/driverStatusUpdate", (request, response) => {
    var driverId = request.body.driverId;
    var updateDriverStatus = request.body.updateDriverStatus;

    driverDao.updateDriverStatus(driverId, updateDriverStatus); 
    response.status(200).send("Driver Id: " + driverId +
        "\n New Status: " + updateDriverStatus);

});

app.post("/driver/updateUserAccount", (request, response) => {
    var driver = new Driver.Driver(request.body);
    let driverId = driverDao.generateUniqueKey();
    driver.setDriverId(driverId);

    //initalize driver object
    driverDao.updateDriverAccount(driver);
    response.status(200).send("Driver Id: " + driver.driverId +
        " created");

});

exports.app = functions.https.onRequest(app);