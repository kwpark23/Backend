const assert = require('assert');
import Item from '../server/Item';

/* Item construction
*/

let apple = {
    inventoryItemId: 222,
    name: 'apple',
    quantity: 34,
    expiryDate: "2020-03-08",
    groceryStoreId: "333"
};

let orange = {
    inventoryItemId: 777,
    name: 'orange',
    quantity: 35,
    expiryDate: "2020-03-08",
    groceryStoreId: 333
};

const { nameError } = new assert.AssertionError({
    correct: 'apple',
    actual: 'orange',
    operator: 'strictEqual'

});


let Apple = new Item(apple);
let Orange = new Item(orange);

try{
    assert.strictEqual(apple.name, Apple.name);
} catch(error) {
    assert(error instanceof assert.AssertionError);
    assert.strictEqual(error.nameError, nameError);
}

try{
    assert.strictEqual(orange.name, Orange.name);
} catch(error) {
    assert(error instanceof assert.AssertionError);
}

try{
    assert.strictEqual(Apple.name, Orange.name,);
} catch(error) {
    assert(error instanceof assert.AssertionError);
    assert.strictEqual(error.nameError, nameError);
}

try {
    assert.notEqual(Apple.quantity, Orange.quantity);
    assert(Apple.quantity < Orange.quantity);
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

try {
    assert.notEqual(Apple.inventoryItemId, Orange.inventoryItemId);
    console.log("Apples distinct from Oranges");
} catch (error) {
    assert(error instanceof assert.AssertionError);
}

try {
    assert.equal(Apple.groceryStoreId, Orange.groceryStoreId);
    console.log("Same Grocery Store.");
} catch (error) {
    assert(error instanceof assert.AssertionError);

}

try {
    assert.strictEqual(Apple.groceryStoreId, Orange.groceryStoreId);
} catch (error) {
    assert(error instanceof assert.AssertionError);
    console.log("Grocery Store ID may have different types");
}