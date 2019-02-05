const fs = require('fs');
 
fs.readFile('DATA', 'utf8', (err, contents) => {
    console.log(contents);
});
 
