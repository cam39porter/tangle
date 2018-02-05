import Datastore from '@google-cloud/datastore'

const ds = Datastore({
    projectId: "opit-193719"
});

const get = function get(kind, id) {
    const key = ds.key([kind, id]);
    return ds.get(key).then(results => {
      return results;
    }).catch(err => {
      return err;
    });
}

const create = function create(kind, data) {
    console.log(kind);
    console.log(data);
    const record = {
        key: ds.key([kind, 1]),
        data: data
    }
    console.log(record);
    ds.save(record).then(() => {
        console.log("successfully saved record");
    }).catch(err => {
        console.log("failed to save record error message below");
    });
}

module.exports = {
    get: get,
    create: create
}
