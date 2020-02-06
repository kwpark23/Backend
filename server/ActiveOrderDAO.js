/* eslint-disable promise/always-return */
class ActiveOrdersDAO {
    constructor(gsDB) {
        this.gsDB = gsDB;
    }

    updateActiveOrderStatus(orderId, newStatus) {
        //get order from db using orderId
        let orderRef = this.gsDB.collection('ActiveOrdes').doc(String(orderId));
        //modify order status
        return orderRef.update({
            "status": newStatus
        }).catch(_err => {
            console.log("Failed to update order " + orderId)
            // eslint-disable-next-line promise/always-return
        }).then(() => {
            console.log("Active order" + orderId + " status updated")
        });
    }

    addToActiveOrders(order) {
        //write order to db; index by orderId
        let key = generateUniqueKey();
        this.gsDB.ref('ActiveOrders/' + String(key)).set(order);
    }

    removeFromActiveOrders(orderId) {
        //get all documents with orderid
        let orderRef = this.gsDB.collection('ActiveOrdes').doc(String(orderId));
        // eslint-disable-next-line promise/always-return
        orderRef.get().then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    // delete document
                    doc.delete();
                });
            })
            .catch(err => {
                console.log(orderId + " doesn't exists", err);
            });
    }

    findMatchingActiveOrders(driver) {
        let matchingOrders = [];
        let currCapacity = driver.capacity;
        let ordersRef = this.gsDB.collection('ActiveOrders');
        
        ordersRef.get().then(snapshot => {
            snapshot.forEach(order => {
                console.log(order.id, '=>', order.data());
                if (order.totalQuantity <= currCapacity) {
                    matchingOrders.push(order);
                }
            });
        })
        .catch(err => {
            console.log('Error getting active orders', err);
        });

        return matchingOrders;
    }

    generateUniqueKey() {
        let dbKeys = [];

        //get all keys in firebase and check they don't coincide with key
        let ordersRef = this.gsDB.collection('ActiveOrders');
        console.log(ordersRef);
        
        ordersRef.get().then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    dbKeys.push(doc.id);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });

        return getKeyUnique(dbKeys);
    }

    getKeyUnique(listOfKeys) {
        //return key if unique; otherwise recurse
        let key = Math.ceil(Math.random() * (10000));

        if (listOfKeys.includes(key)) {
            return getKeyUnique(listOfKeys);
        } else {
            console.log(key);
            return key;
        }
    }
}

module.exports = ActiveOrdersDAO;