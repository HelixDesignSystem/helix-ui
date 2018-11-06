// absolute path for icon folder, use path.resolve
const iconFolder = './src/helix-ui/icons/';
const fs = require('fs');

fs.readdirSync(iconFolder).forEach(file => {
  console.log(file);
})

// in the forEach
// concat of absolute icon folder + filename
fs.readFileSync(filename, function(err, data) {
    if (err) {
        throw err;
    }
});
