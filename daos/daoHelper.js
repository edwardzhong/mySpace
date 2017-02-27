let pool = require("./dbPool").getPool();

function createMethod(obj) {
    let exportsFn={};
    for (let [key, value] of Object.entries(obj)) {
        exportsFn[key]=function(param) {
            return new Promise((resolve, reject) => {
                let callback = (err, result, fields) => {
                    if (err) reject(err)
                    else resolve(result);
                };

                if (value) {
                    pool.query(value, param, callback);
                } else {
                    pool.query(param, callback);
                }
            });
        };
    }
    return exportsFn;
}

module.exports = {
    createMethod
};
