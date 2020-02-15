
const DriverStates = {
    AVAILABLE: "Driver available to deliever an order",
    ACCEPTED: "Driver has accepted order",
    REJECTED: "Driver has rejected order",
    CANCELLED: "Driver has cancelled order"
};

class Driver {
    constructor(driverRef) {
        this.driverId = driverRef.driverId;
        this.capacity = driverRef.capacity;
        this.defaultRegion = driverRef.defaultRegion;
        this.name = driverRef.name;
        this.points = driverRef.points;
        this.setCompletedOrderIds(driverRef.completedOrderIds);
        this.setDriverStatus(driverRef.status);
    }

    setDriverId(driverId){ this.driverId = driverId }

    getDriverId() { return this.driverId; }
    getCapacity() { return this.capacity; }

    setDefaultLocation(defaultRegion) { this.defaultRegion = defaultRegion; }
    getDefaultLocation() { return this.defaultRegion; }

    getCompletedOrderIds(){ return this.completedOrderIds; }

    setCompletedOrderIds(list){
        if (typeof list == undefined) {
            this.completedOrderIds = new Array();
            console.log("this is inializaed list:", list);
        }
        this.completedOrderIds = list;
    }

    setDriverStatus(newStatus) {
        switch (newStatus) {
            case "Driver available to deliever an order":
                this.status = DriverStates.AVAILABLE;
                break;
            case "Driver has accepted order":
                this.status = DriverStates.ACCEPTED;
                break;
            case "Driver has rejected order":
                this.status = DriverStates.REJECTED;
                break;
            case "Driver has cancelled order":
                this.status = DriverStates.CANCELLED;
                break;
        }
    }
    getDriverStatus() { return this.status; }
}
module.exports = {
    Driver,
    DriverStates
};