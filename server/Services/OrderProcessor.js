const ActiveOrderDao = require("../DataAccessObjects/ActiveOrderDao");
const Driver = require("../Models/Driver");
const GroceryStoreDao = require("../DataAccessObjects/GroceryStoreDao");

class OrderProcessor {
    constructor(driverQuery, orderQuery, groceryQuery, activeOrderDao, groceryStoreDao) {
        this.initDriverListener(driverQuery);
        this.initOrderListener(orderQuery, groceryQuery)
        this.activeOrderDao = activeOrderDao;
        this.GroceryStoreDao = groceryStoreDao;
    } 

    initDriverListener(driverQuery) {
        // Construct a listener for driver statuses
        let observer = driverQuery.onSnapshot(querySnapshot => {
            querySnapshot.docChanges().forEach(change => {
                // Get the driver data
                var driver = change.doc.data();
                driver.driverId = change.doc.ref.id;
                var driverObj = Driver(driver);
                // Update the orders if the driver is Available
                if (driver.status === Driver.driverStates.AVAILABLE) {
                    // Find orders that the driver can deliver and send
                    notifyDriver(driver, ActiveOrderDao.findMatchingActiveOrders(driver));
                }
            });
        });
    }
    initOrderListener(orderQuery, groceryQuery){
        let orderobserver = orderQuery.onSnapshot(snapshot => {
            let listener = snapshot.docChanges();
            listener.forEach(element => {
                console.log(element.doc.data().status)
                if (element.doc.data().status == 'Looking For Driver') {
                    groceryQuery.get().then(function(doc){
                        if(doc.exists){
                            console.log(doc.data().quantity);
                            var quantity = doc.data()[element.doc.data().inventory['productId']]['quantity'] - element.doc.data().inventory['quantity'];
                            var gs = GroceryStoreDao();
                            gs.updateGroceryStoreData(element.doc.data().storeID, element.doc.data().inventory['productId'], quantity)
                        }else{
                            console.log('doc does not exists');
                        }
                    }).catch(function(error){
                        console.log('caught error', error);
                    });
                } else if (element.doc.data().status == 'In Progress') {
                    console.log('Advanced Shipping Notice - drivers')
                    console.log('Advanced Shipping Notice - grocery')
                } else if (element.doc.data().status == 'Picked Up') {
                    console.log('order received')
                    console.log(element.doc.data().orderRecieved)
                }
            });
        });
    }



    notifyDriver(driver, orders) {
        orders.forEach(order => {
            order.notifyDriver(driver)
        });
    }
}

module.exports = OrderProcessor;