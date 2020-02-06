class GroceryStoreDao{
    constructor(){}

    isOrderValid(gsDB, order){
        //This is a list
        var orderInventory = order.inventoryItems;
        console.log("This is order inventory:", orderInventory);

        let gsRef = gsDB.collection("GroceryStores").doc(order.groceryId).collection("InventoryCollection").doc("Items");
        for (const [key, value] of Object.entries(orderInventory)){
            let queryById = gsRef.get().then(doc => {
                if (!doc.exists){
                    console.log("No such document!");
                    return null;
                }else{
                    var itemInfo = doc.data();
                    console.log("This is item:", orderInventory[key]);
                    console.log("This is the quantity of " + orderInventory[key]["name"] + ":" + orderInventory[key]["quantity"])
                    //console.log(itemInfo);
                    console.log("This is doc data: " + itemInfo);
                    return null;
                }
            }).catch(err => {
                console.log('Error getting document', err);
                return null;
            })
        }
    }

    updateStoreInventoryQuantity(){

    }



}

module.exports = GroceryStoreDao;