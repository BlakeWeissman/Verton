const electron = require('electron');
const path = require('path');
const fs = require('fs');

class storeClass {
  constructor(opts) {
    //Return a string of the users app data directory path
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    //Set the file name and path.join to bring it all together as a string
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }
  
  //Function to return the property from the "data" object
  get(key) {
    return this.data[key];
  }
  
  //Set "data"
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

//Try/catch it to check for errors/existence
function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } 
  catch(error) {
    return defaults;
  }
}

//Expose the class
module.exports = storeClass;