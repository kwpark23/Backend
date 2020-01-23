class Order {
    constructor(orderRef) {
        this.id = orderRef.id
        this.progress = '';
        this.driver = Null;
        this.foodBankId = Null;
        this.groceryStoreId = Null;
        this.items = this.parseItems(orderRef.items);
        this.requestTime = Date(orderRef.time);
    }

    setProgressStatus(newStatus) {
        this.progress = newStatus;
    }

    getProgressStatus() {
        return this.progress;
    }

    setDriver(driver) {
        this.driver = driver;
    }

    getDriver() {
        return this.driver;
    }

    setFoodBankId(foodBankId) {
        this.foodBankId = foodBankId;
    }

    getFoodBankId() {
        return this.foodBankId;
    }

    setGroceryId(groceryId) {
        this.groceryStoreId = groceryId;
    }

    getGroceryId() {
        return this.groceryStoreId;
    }

    setTime(time) {
        this.requestTime = time;
    }

    getTime() {
        return this.requestTime;
    }

    getItem(itemId) {
        return this.items;
    }

    parseItems(itemsList) {
        itemsList.forEach(item => {
            item = new Item(item);
        })
    }

}
