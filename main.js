/*Created by Blake Weissman*/
const { app, BrowserWindow } = require('electron');
const { globalShortcut } = require('electron');
const { ipcMain } = require('electron');
const storeClass = require('./storedata.js');
const electron = require('electron');
const path = require('path');
const fs = require('fs');

let win;
let menubarToBeEnabled = true;
let theme;
const userDataPath = (electron.app || electron.remote.app).getPath('userData') + "\\Verton.json";

//SET FALSE FOR PUBLIC BUILDS
let devMode = true;

//Class that can create user data file to store data
const store = new storeClass({
  configName: 'Verton',
  defaults: {
    windowDimensions: { width: 520, height: 345 },
    packages: 3,
    theme: "light", 
  }
});

function createWindow () {
  //If enabled, let user know DevMode is enabled
  if (devMode === true) {
    console.log("Notice: DevMode is enabled. \n\nDevMode Keyboard Shortcuts: \nCTRL/CMD+D: Open DevTools \nCTRL/CMD+T: Change Theme\n");
  }

  //Create user data file if it does not exist
  fs.stat(userDataPath, function(output) {
    if(output == null) {
      if (devMode === true) {
        console.log("Notice: User data file found.");
      }
    } 
    else if(output.code == 'ENOENT') {
      store.set();
      if (devMode === true) {
        console.log("Notice: User data file not found, a new one has been created.");
      }
    } 
  });

  //Create the browser window
  let { width, height } = store.get('windowDimensions');
  win = new BrowserWindow({ width, height, icon: "./icon.png" });

  //Load the index.html of the app
  win.loadFile('index.html');

  //Disable MenuBar
  win.setMenu(null);

  //Store window dimension data
  win.on('resize', () => {
    let { width, height } = win.getBounds();
    store.set('windowDimensions', { width, height });
  });

  //Get theme info
  theme = store.get('theme');
  if (devMode === true) {
    console.log("Notice: The theme is '" + theme + "'.");
  }

  //(DEV MODE) Open DevTools Using CTRL/CMD+D
  globalShortcut.register('CommandOrControl+D', () => {
    if (devMode === true) {
      win.webContents.openDevTools();
      console.log("Notice: DevTools has been opened.");
    }
  })
  
  //(DEV MODE) Change Theme Using CTRL/CMD+T
  globalShortcut.register('CommandOrControl+T', () => {
    if (devMode === true) {
      if (theme === "light") {
        win.webContents.send('send-theme', "dark");
        theme = "dark";
      }
      else if (theme === "dark") {
        win.webContents.send('send-theme', "light");
        theme = "light";
      }
      console.log("Notice: The theme is now '" + theme + "'.");
    }
  })

  //Change MenuBar status using CTRL/CMD+M  
  /*globalShortcut.register('CommandOrControl+M', () => {
    if (devMode === true) {
      if (menubarToBeEnabled === true) {
        win.setMenu(menubar)
        console.log("Notice: MenuBar enabled.")
      }
      else if (menubarToBeEnabled === false) {
        win.setMenu(null)
        console.log("Notice: MenuBar disabled.")
      }
    }
  })*/

  //When the window is closed
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  })
}

//Create the window
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
