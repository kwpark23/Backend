
/*This our observable; GSInventory will notify all orders when the store inventory
 * gets updated*/

class GroceryStoreService {
	constructor(groceryStores, gsDB) {
		this.groceryStores = groceryStores;
		this.gsDB = gsDB
	}

	attachListener(storeId){
		this.gsDB.collection("GroceryStores").doc(newEdiOrder.groceryId).collection("InventoryCollection").doc("Items").onSnapshot(ss => {
			console.log(ss.data())
		})
	}
}

module.exports = {
	GroceryStoreService
};

