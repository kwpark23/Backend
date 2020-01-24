/*This our observable; GSInventory will notify all orders when the store inventory
 * get's updated*/

class GroceryStoreInventory{
	constructor(){
		this.status = '';
		this.orders = [];
		this.statusList = [];
	}

	//Can add observers (Example: an order)
	addOrder(o){
		this.orders.push(o);
	}

	//Can remove observers 
	removeOrder(o) {
	    const removeIndex = this.orders.findIndex(obs => {
	      return o === obs;
	    });

	      if (removeIndex !== -1) {
	      this.orders = this.orders.slice(removeIndex, 1);
	    }
 	}

 	//Send notification to all orders in the list
	notifyOrders(statusList){
		var i;
		for (i = 0; i < this.orders.length; i++){
			this.orders[i].update(statusList[i]);
		}
	}

	/*Update status of each order in the list based on whether the order
	 * can be completed with store inventory in stock 
	 * */
	updateStatus(gsinv){
		var i;
		for (i=0; i<this.orders.length; i++){
			var counter = 0;
			for (var gskey in gsinv) {
				for (var ordkey in this.orders[i].orderitems){
					if (gskey == ordkey){
						//check whether quantity in stock can fulfill the order item
						if (gsinv[gskey] >= this.orders[i].orderitems[ordkey]){
							counter++;
						}
					}				
				}
			}

			//Algorithm for checking whether an individual order can be fulfilled or not
			if (counter == this.orders.length){
				this.statusList.push("Looking for Driver");
				this.updateInventory(gsinv, this.orders[i].orderitems);
			}else{
				this.statusList.push("Invalid");
			}
		}
		//Send notification to all orders
		this.notifyOrders(this.statusList);
	}

	/*If the order can be fulfilled, update store inventory by decrementing 
	 * store inventory items
	 */
	updateInventory(gsinv, orditems){
		for (var gskey in gsinv) {
			for (var ordkey in orditems){
				if (gskey == ordkey){
					if ((gsinv[gskey] >= orditems[ordkey]) && (gsinv[gskey] != 0)){
						gsinv[gskey] = gsinv[gskey] - orditems[ordkey];
					}
				}				
			}
		}
	}

}
