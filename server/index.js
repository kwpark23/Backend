/* eslint-disable promise/always-return */
// Firebase Imports
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const FieldValue = admin.firestore.FieldValue;
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
const Item = require("./Models/Item");

// Initialize App
admin.initializeApp(functions.config().firebase);
var gsDB = admin.firestore();
var groceryStores = {};
var activeOrdersDao = new ActiveOrderDao.ActiveOrderDao(gsDB);
var groceryStoreDao = new GroceryStoreDao.GroceryStoreDao(gsDB);
var driverDao = new DriverDao.DriverDao(gsDB);

var processor = new OrderProcessor.OrderProcessor(gsDB, activeOrdersDao, groceryStoreDao, driverDao);
var groceryStoreService = new GroceryStoreService.GroceryStoreService(groceryStores);
var startTime = new Date(Date.now());

exports.pruneDaily = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    checkDate();
    return null;
});
/*******************Food Bank EndPoint *************************/
const app = express();

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
    //TODO parse userInfo and register grocery store
    console.log(groceryUser.companyName)
    groceryStoreDao.writeGroceryStoreData(
        groceryUser.companyName,
        groceryUser.location,
        groceryUser.storeNumber)

    response.status(200).send("Grocery Store Registered");
});

//Update inventory of a store
app.post("/groceryStore/inventoryUpdate", (request, response) => {
    //receive data body that is an inventory from single grocery store
    var jsonBody = request.body;
    var newEdiOrder = new EdiOrder.EdiOrder(jsonBody);
    groceryStoreDao.newInventoryToGroceryStoreData(newEdiOrder).then(write => {
        if (write) {
            checkDate();
        }
    }).catch(err => { console.log(err) });
    response.status(200).send("Inventory updated in Firestore");
});

/*****************Driver EndPoint **********************/

app.post("/driver/driverStatusUpdate", (request, response) => {
    var orderId = request.body.orderId;
    var driverId = request.body.driverId;
    var updateDriverStatus = request.body.updateDriverStatus;

    response.status(200).send("Driver Id: " + driverId +
        "\n New Status: " + updateDriverStatus +
        "\n For Order Id: " + orderId);

});

exports.app = functions.https.onRequest(app);

/**********************Timers*************************/
function checkDate() {
    let today = new Date(Date.now());

    pruneInventoryListener(today);
}

async function getStores() {
    let storesRef = await gsDB.collection("GroceryStores").get();
    const storeIds = [];
    try {
        storesRef.forEach(doc => {
            storeIds.push(doc.id);
        });
    } catch (error) {
        console.log("Error getting stores", error);
    }

    storesRef.forEach(doc => {
        storeIds.push(doc.id);
    });
    return storeIds;
}

async function pruneInventoryListener(day) {
    //get IDs of all stores in grocerySTores
    storeIds = await getStores();
    uniqueStores = [...new Set(storeIds)];
    //loop through stores and update inventories
    for (let index = 0; index < uniqueStores.length; index++) {
        pruneInventory(uniqueStores[index]);
    }
}

async function pruneInventory(id) {
    let storeRef = await gsDB.collection("GroceryStores").doc(id).collection("InventoryCollection").doc("Items");
    try {
        storeRef.get().then(snapshot => {
            let inventory = snapshot.data();
            for (var key in inventory) {
                let item = new Item.Item(inventory[key]);
                let itemEBD = item.getEdibleByDate();

                if (itemEBD < new Date(Date.now())) {
                    delete inventory[key];
                }
            }
            console.log(inventory);
            gsDB.collection("GroceryStores").doc(id).collection("InventoryCollection").doc("Items").set(inventory);

        }).catch(err => { console.log(err) })
    } catch (error) {
        console.log("Error getting inventory", error);
    }
}
