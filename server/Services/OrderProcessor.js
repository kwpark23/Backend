const Driver = require("../Models/Driver");
const Order = require("../Models/Order");

class OrderProcessor {
    constructor(gsDB, activeOrderDao, groceryStoreDao, driverDao) {
        var driverQuery = gsDB.collection("Drivers");
        this._orderQuery = gsDB.collection("ActiveOrders");
        this.activeOrderDao = activeOrderDao;
        this.groceryStoreDao = groceryStoreDao;
        this.driverDao = driverDao;
        this.initDriverListener(driverQuery);
        this.initOrderListener(this._orderQuery);
    }

    processOrder(order) {
        this.groceryStoreDao.isOrderValid(order).then(res => {
            if (res) {
                var writePromise = this.activeOrderDao.addToActiveOrders(order);
                this._attachNewListener(writePromise);
                return true;
            }
            return false;
        }).catch(err => { console.log("Error processing order validity", err); });
    }

    _attachNewListener(writePromise) {
        writePromise.then(res => {
            if (res.writeTime !== undefined) {
                this._initOrderListener(this._orderQuery.doc(order.orderId.toString()));
                return true;
            }
            return false;
        }).catch(err => {
            console.log(err);
        });
    }

    initDriverListener(driverQuery) {
        driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                var driverObj = new Driver.Driver(driver);
                if (driverObj.getDriverStatus() === Driver.DriverStates.AVAILABLE) {
                    this.activeOrderDao.findMatchingActiveOrders(driverObj);
                }
            });
        });
    }

    initOrderListener(orderQuery) {
        orderQuery.get().then(activeOrders => { // Get all the activeOrder documents
            return activeOrders.docs.forEach(activeOrder => {
                // Initialize the order listener
                this._initOrderListener(orderQuery.doc(activeOrder.ref.id));
            });
        }).catch(error => {
            console.log(error);
        });
    }

    _initOrderListener(activeOrderQuery) {
        activeOrderQuery.onSnapshot(orderSnapshot => {
            if (orderSnapshot.data() !== undefined && orderSnapshot.data().inventoryItems !== undefined) {
                // Generate the Order object and assign its orderId
                var order = new Order.Order(orderSnapshot.data());
                order.setOrderId(orderSnapshot.data().orderId);
                // Get the status
                var status = orderSnapshot.data().status;
                if (status === 'Looking For Driver') {
                    // Notify all drivers who can take the order
                    this.driverDao.notifyAllValidDrivers(order);
                } else if (status === 'In Progress') {
                    // Send out Advanced Shipping Notice
                    console.log('Advanced Shipping Notice - drivers');
                    console.log('Advanced Shipping Notice - grocery');
                } else if (status === 'Picked Up') {
                    // Change status of orderRecieved
                    console.log('order received');
                    console.log(element.doc.data().orderRecieved);
                }
            }
        });
    }

    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver(driver.getDriverId())
        });
    }
}

module.exports = {
    OrderProcessor
};