import { ref, firebaseAuth } from '../config/constants'

var snapshotOf = (location, callback) => {
    ref.child(location).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.ref, snapshot.val(), snapshot.key);
            } else {
                callback(snapshot.ref);
            }
        })
        .catch((err) => {
            callback();
        });
};

var subscribeToEvent = (location, event, callback) => {
    ref.child(location).on(event, (snapshot) => {
        callback(snapshot.ref, snapshot.val(), snapshot.key);
    }, (err) => {
        callback();
    });
};

var subscribeToQuery1 = (location, child, val, event, callback) => {
    ref.child(location).orderByChild(child).equalTo(val).on(event, (snapshot) => {
        callback(snapshot.ref, snapshot.val(), snapshot.key);
    })
}

var applyQuery1 = (location, child, val, event, callback) => {
    ref.child(location).orderByChild(child).equalTo(val).once(event, (snapshot) => {
        callback(snapshot.ref, snapshot.val(), snapshot.key);
    })    
}

var orderedArrByChild = (location, child, callback) => {
    ref.child(location).orderByChild(child).once('value')
        .then((snapshot) => {
            var arr = [];
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    arr.push({
                        key: child.key,
                        data: child.val(),
                    });
                });
            }

            callback(arr);
        });
};

var orderedArrByKey = (location, callback) => {
    ref.child(location).orderByKey().once('value')
        .then((snapshot) => {
            var arr = [];
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    arr.push({
                        key: child.key,
                        data: child.val(),
                    });
                });
            }

            callback(arr);
        });
};

var push = (location, data, callback) => {
    let pushRef = ref.child(location).push();
    data.key = pushRef.key;
    pushRef.set(data)
    .then(() => {
        if (callback) callback();
    })
    .catch((err) => {
        if (callback) callback(err)
    })
}

var set = (location, data, callback) => {
    ref.child(location).set(data)
    .then(() => {
        if (callback) callback();
    })
    .catch((err) => {
        if (callback) callback(err);
    });
};

var update = (location, data, callback) => {
    ref.child(location).update(data)
    .then(() => {
        if (callback) callback();
    })
    .catch((err) => {
        if (callback) callback(err);
    });
};

var remove = (location, callback) => {
    ref.child(location).remove()
        .then(() => {
            if (callback) callback();
        })
        .catch((err) => {
            if (callback) callback(err);
        });
};

var transaction = (location, callback) => {
    ref.child(location).transaction((data) => {
        return callback(data);
    });
};

var off = (location, eventType) => {
    if (eventType) {
        ref.child(location).off(eventType);
    } else {
        ref.child(location).off();
    }
};

let helpers = {
    snapshotOf,
    subscribeToEvent,
    subscribeToQuery1,
    applyQuery1,
    orderedArrByChild,
    orderedArrByKey,
    push,
    set,
    update,
    remove,
    transaction,
    off
}

export default helpers
