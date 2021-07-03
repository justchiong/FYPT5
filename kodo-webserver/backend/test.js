const fs = require('fs');
uuid = '316fe2c2-36e1-4d2b-aeb6-19ac2c2019d3'
fs.rmdir(`.\\backend\\webServer_Folders\\${uuid}`, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }}
)
fs.rmdir(`.\\backend\\databases\\${uuid}_db`, { recursive: true }, (err) => {
    if (err) {
        throw err;
    }}
)
fs.unlink(`.\\backend\\zipFiles\\${uuid}.zip`, (err) => {
    if (err) {
      throw err
    }
})
