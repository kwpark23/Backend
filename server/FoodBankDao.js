class FoodBankDao{
    constructor(fbDB){
    this.fbDB = fbDB;  
}


writeFoodBankData(FoodBankID, fbName, location, locationNumber){
    this.fbDB.ref('foodBank/' + FoodBankID).set({
        fbName: fbName,
        location: location,
        locationNumber: locationNumber
        });
}
//Updating new Food Bank info in Firestore database

updateFoodBankData(FoodBankID, fbName, location, locationNumber) {
    var update = {};
    var updatedInfo = {
        fbName: fbName,
        location: location,
        locationNumber: locationNumber
    }
    update['foodBank/' + FoodBankID] = updatedInfo;
    this.fbDB.ref().update(update);
}
}
   
module.exports(FoodBankDao); 