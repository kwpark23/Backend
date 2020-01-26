const assert = require('assert');
import Item from '../server/Item';
import Order from '../server/Order';

// Test Data
const driver1 = {
    driverId: 3,
    name: 'Dragonite',
    vehicle: 'Dodge caravan',
    messages: ''
};

const driver2 = {
    driverId: 4,
    name: 'Lugia',
    vehicle: 'Hovercar',
    messages: ''
};

const invalidDriver = {
    driverId: 100,
    name: 'Snorlax',
    vehicle: '',
    messages: ''
};

let Apple = new Item({
    inventoryItemId: 222,
    name: 'apple',
    quantity: 34,
    expiryDate: "2020-03-08",
    groceryStoreId: "333"
});

let Orange = new Item({
    inventoryItemId: 777,
    name: 'orange',
    quantity: 35,
    expiryDate: "2020-03-08",
    groceryStoreId: 333
});

const order = {
    "orderId" : 11111,
    "foodBankId" : 3,
    "groceryId" : 1,
    "inventoryItems": [
        Apple, Orange
    ],
    "status": 'Available',
    "time": "2020-01-20"
}

const { nameError } = new assert.AssertionError({
    correct: 'apple',
    actual: 'orange',
    operator: 'strictEqual'

});
let myOrder = new Order(order);


/* Item construction
*/

try{
    assert.strictEqual(apple.name, Apple.name);
} catch(error) {
    assert(error instanceof assert.AssertionError);
    assert.strictEqual(error.nameError, nameError);
}

try{
    assert.strictEqual(orange.name, Orange.name);
} catch(error) {
    assert(error instanceof assert.AssertionError);
}

try{
    assert.strictEqual(Apple.name, Orange.name,);
} catch(error) {
    assert(error instanceof assert.AssertionError);
    assert.strictEqual(error.nameError, nameError);
}

try {
    assert.notEqual(Apple.quantity, Orange.quantity);
    assert(Apple.quantity < Orange.quantity);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

try {
    assert.notEqual(Apple.inventoryItemId, Orange.inventoryItemId);
    console.log("Apples distinct from Oranges");
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

try {
    assert.equal(Apple.groceryStoreId, Orange.groceryStoreId);
    console.log("Same Grocery Store.");
} catch (error) {
    assert(error instanceof assert.AssertionError);

}

try {
    assert.strictEqual(Apple.groceryStoreId, Orange.groceryStoreId);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Grocery Store ID may have different types");
};


/* Order construction
*/

try {
    assert.strictEqual(myOrder.orderId, order.orderId);
    assert.strictEqual(myOrder.foodBankId, order.foodBankId);
    assert.strictEqual(myOrder.groceryId, order.groceryId);
    assert.strictEqual(myOrder.getProgressStatus, order.status);
    assert.equal(myOrder.timePlaced, order.time);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Failed to parse order as object")
}

/* Check parseItems */
try {
    let inventory = myOrder.inventoryItems;
    parsedApples = inventory.getItem(Apple.name);
    assert.strictEqual(parsedApples.name, Apples.name);
    assert.strictEqual(parsedApples.inventoryItemId, Apples.inventoryItemId);
    assert.strictEqual(parsedApples.qty, Apples.quantity);
    assert.strictEqual(Date(parsedApples.expiryDate), Apples.expiryDate);
    assert.strictEqual(parsedApples.groceryStoreId, Apples.groceryStoreId);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Failed to parse items as dictionary")
}

/* Get and set order status
*/

try {
    const parsedStatus = myOrder.getProgressStatus();
    myOrder.setProgressStatus("Unavailable");
    assert.notEqual(parsedStatus, myOrder.getProgressStatus());
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Can't access order status")
}

/* Check driver validity */
try {
    assert.equal(myOrder.isDriverValid(driver1), true);
    assert.equal(myOrder.isDriverValid(driver2), true);
    assert.equal(myOrder.isDriverValid(invalidDriver), false);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Incorrect drive validity checks")
}

/* Add driver */
try {
    myOrder.addDriver(driver1);
    myOrder.addDriver(driver2);
    myOrder.addDriver(driver2);
    myOrder.addDriver(invalidDriver);

    assert.strictEqual(myOrder.driverId.length, 2);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Incorrect drive validity checks")
}

/* Remove a driver */
try {
    myOrder.removeDriver(driver1);

    assert.strictEqual(myOrder.driverId.length, 1);
    assert.strictEqual(myOrder.driverId[driver2.driverId], driver2.driverId);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Incorrect drive validity checks")
}

/* Notify drivers */
try {
    myOrder.notifyDrivers("Pick up order");
    let regDriver = myOrder.driverId[driver2.driverId];

    assert.strictEqual(regDriver.messages, "Pick up order");
} catch (error) {
    assert(error instanceof assert.AssertionError);
}
