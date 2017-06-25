/**
 * logger config
 * @type {Object}
 */
module.exports={
    "appenders": [
        // {
        //     "type": "console" 
        // },
        {
            "type": "dateFile",
            "filename": "logs/",
            "pattern": "yyyy-MM-dd_app.log",
            "alwaysIncludePattern": true,
            "maxLogSize": 1024,
            "backups": 7,
            "category": "systemInfo"
        },
        {
            "type": "dateFile",
            "filename": "logs/",
            "pattern": "yyyy-MM-dd_conect.log",
            "alwaysIncludePattern": true,
            "maxLogSize": 2048,
            "backups": 7,
            "category": "accessInfo"
        }
    ],
    "replaceConsole": false
}