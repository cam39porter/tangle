const db = require('../db/datastore-client');

function get(id) {
    return db.get("insight", id);
}

function create(data) {
    return db.create("insight", data);
}

module.exports = {
    get: get,
    create: create
}