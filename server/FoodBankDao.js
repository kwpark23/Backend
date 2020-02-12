class FoodBankDao{
    constructor(fbDB){
    this.fbDB = fbDB;  
}


    writeFoodBankData(foodBankID, fbName, fblocation, fblocationNumber){
        this.fbDB.ref('foodBank/' + foodBankID).set({
            fbName: fbName,
            fblocation: fblocation,
            fblocationNumber: fblocationNumber
            });
    }
//Updating new Food Bank info in Firestore database

    updateFoodBankData(foodBankID, fbName, fblocation, fblocationNumber) {
        var update = {};
        var updatedInfo = {
            fbName: fbName,
            fblocation: fblocation,
            fblocationNumber: fblocationNumber
        }
        update['foodBank/' + foodBankID] = updatedInfo;
        this.fbDB.ref().update(update);
    }
    updateCompletedOrders(order) {
        var stringInventoryData = JSON.stringify(order.getInventory());
        var json_inventory = JSON.parse(stringInventoryData);
        this.fbDB.collection("FoodBank").doc(`${order.getFoodBankID()}`).collection("CompletedOrdersCollection").doc("Orders").set({
            foodBankID: order.getfoodBankID(), 
            storeID: order.getGroceryId(), 
            driverID: order.getdriverID(),
            Inventory: json_inventory

        }
        )
  
    }
}
   
module.exports(FoodBankDao); 