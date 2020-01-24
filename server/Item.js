export class Item {
    constructor(itemRef) {
        this.inventoryItemId = itemRef.inventoryItemId;
        this.name = itemRef.name;
        this.qty = itemRef.qty;
        this.expiryDate = itemRef.expiryDate;
        this.groceryStoreId = itemRef.groceryStoreId
    }
}
