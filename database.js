// Modo estricto
'use strict';

// Módulos importados
var mongoose = require('mongoose'),
    Customers = require("./models/result.js").Customers,
    Transactions = require("./models/result.js").Transactions;

// URL de conexión
function readFromDatabaseAge(age, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': age}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lt': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lt': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeProfile(age, profile, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': age, 'customer.profile': new RegExp(profile, "i")}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lt': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lt': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeInterval(age1, age2, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': {'$gte': age1, '$lt': age2}}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lt': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeIntervalProfile(age1, age2, profile, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': {'$gte': age1, '$lt': age2}, 'customer.profile': new RegExp(profile, "i")}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lt': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeAmount(age, amount, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': age}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                var currentMoney = 0, ccard = 0, dcard = 0, account = 0;
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        ccard++;
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        dcard++;
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        account++;
                    }
                }
                if(currentMoney<=amount){
                    for(var i = 0; i<ccard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<dcard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<account; i++) {
                        currentArray.pop();
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lte': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeAmountProfile(age, amount, profile, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age': age, 'customer.profile': new RegExp(profile, "i")}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                var currentMoney = 0, ccard = 0, dcard = 0, account = 0;
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        ccard++;
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        dcard++;
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        account++;
                    }
                }
                if(currentMoney<=amount){
                    for(var i = 0; i<ccard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<dcard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<account; i++) {
                        currentArray.pop();
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lte': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeIntervalAmount(age1, age2, amount, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age':  {'$gte': age1, '$lt': age2}}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                var currentMoney = 0, ccard = 0, dcard = 0, account = 0;
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        ccard++;
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        dcard++;
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        account++;
                    }
                }
                if(currentMoney<=amount){
                    for(var i = 0; i<ccard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<dcard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<account; i++) {
                        currentArray.pop();
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lte': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

function readFromDatabaseAgeIntervalAmountProfile(age1, age2, amount, profile, lat1, lon1, lat2, lon2, callback) {
    Customers.find({'customer.age':  {'$gte': age1, '$lt': age2}, 'customer.profile': new RegExp(profile, "i")}).exec(function (err, cust) {
        if (err) {
            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
        } else {
            var validTransactions = {};
            var numberOfIterations = 0;
            var currentArray = [];
            if(cust.length==0){
                callback([]);
            }
            cust.forEach(function (customer) {
                var current = [];
                var currentMoney = 0, ccard = 0, dcard = 0, account = 0;
                if (customer.contracts.credit_cards) {
                    current = customer.contracts.credit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        ccard++;
                    }
                }
                if (customer.contracts.debit_cards) {
                    current = customer.contracts.debit_cards.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        dcard++;
                    }
                }
                if (customer.contracts.accounts) {
                    current = customer.contracts.accounts.toObject();
                    for (var i = 0; i < current.length; i++) {
                        currentArray.push(current[i].id);
                        currentMoney += current[i].amount;
                        account++;
                    }
                }
                if(currentMoney<=amount){
                    for(var i = 0; i<ccard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<dcard; i++) {
                        currentArray.pop();
                    }
                    for(var i = 0; i<account; i++) {
                        currentArray.pop();
                    }
                }
                if (numberOfIterations == cust.length - 1) {
                    Transactions.find({
                        'accountId': {$in: currentArray},
                        peerLocation: {$exists: true}, 'peerLocation.lat': {'$gte': lat2, '$lte': lat1},
                        'peerLocation.lon': {'$gte': lon1, '$lte': lon2}
                    }).exec(function (err, documents) {
                        if (err) {
                            callback({'error': 500, 'errorDetail': 'Error en la recuperación de resultados.'});
                        } else {
                            var iterations = 0;
                            if(documents.length==0){
                                callback([]);
                            }
                            documents.forEach(function (document) {
                                if (validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)]) {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity =
                                        validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)].intensity + 1;
                                } else {
                                    validTransactions[document.peerLocation.lat.toFixed(3) + "," + document.peerLocation.lon.toFixed(3)] = {
                                        lat: parseFloat(document.peerLocation.lat.toFixed(3)),
                                        lon: parseFloat(document.peerLocation.lon.toFixed(3)),
                                        intensity: parseFloat(0)
                                    };
                                }
                                if (iterations == documents.length - 1) {
                                    var finalArray = [];
                                    for(var i in validTransactions){
                                        finalArray.push(validTransactions[i]);
                                    }
                                    callback(finalArray);
                                }
                                iterations++;
                            });
                        }
                    });
                }
                numberOfIterations++;
            });
        }
    });
}

// Funciones exportadas para ser usadas externamente
exports.readFromDatabaseAge = readFromDatabaseAge;
exports.readFromDatabaseAgeProfile = readFromDatabaseAgeProfile;
exports.readFromDatabaseAgeAmount = readFromDatabaseAgeAmount;
exports.readFromDatabaseAgeAmountProfile = readFromDatabaseAgeAmountProfile;
exports.readFromDatabaseAgeInterval = readFromDatabaseAgeInterval;
exports.readFromDatabaseAgeIntervalProfile = readFromDatabaseAgeIntervalProfile;
exports.readFromDatabaseAgeIntervalAmount = readFromDatabaseAgeIntervalAmount;
exports.readFromDatabaseAgeIntervalAmountProfile = readFromDatabaseAgeIntervalAmountProfile;