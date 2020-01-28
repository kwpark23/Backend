class MainServer {
    constructor() {
        this.activeOrder = {};
        this.activeDriver = {};
    }

    addOrderToDict(order, gs) {
        gs.updateStatus(order);

        if (order.status === 'Invalid') {
            this.removeOrderFromDict(order);
            console.log("Order Rejected");
        } else {
            this.activeOrder[order.orderId] = order;
            console.log("Order created")
        }
    }

    addDriverToDict(driver) {
        if (driver.isValid()) {
            this.activeDriver[driver.driverId] = driver;
            console.log("Driver added")
        }
    }

    removeOrderFromDict(order) {
        if (order.orderId in this.activeOrder) {
            delete this.activeOrder[order.id];
            console.log("Order removed");
        }
    }

    removeDriverFromDict(driver) {
        if (driver.driverId in this.activeDriver) {
            delete this.activeDriver[driver.driverId];
            console.log("Driver removed");
        }
    }

}