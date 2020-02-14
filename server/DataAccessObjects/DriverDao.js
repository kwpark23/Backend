class DriverDao {

    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    notifyAllValidDrivers(activeOrder) {
        let driverDatabase = this.gsDB.collection("Drivers");
        driverDatabase.where('capacity', '>=', activeOrder.getTotalQuantity()).get().then(snapshot => {
            snapshot.forEach(doc => {
                activeOrder.notifyDriver(doc.data()["driverId"])
            });
            return true;
        }).catch(err=>{
            console.log(err);
        });
    }
}
module.exports = {
    DriverDao
};