class EdiOrder {
    constructor(jsonBody) {
        this.ediOrderNumber = jsonBody.ediOrderNumber;
        this.groceryId = jsonBody.groceryId;

        //Convert list of JSON objects to map of JSON
        this.inventory = {};
        jsonBody.inventory.forEach(item => {
            this.inventory[item.inventoryItemId] = item;
        });
    }
}

module.exports = {
    EdiOrder
};