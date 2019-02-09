const { app, BrowserWindow } = require('electron')
const { globalShortcut } = require('electron')

//SET FALSE FOR PUBLIC BUILDS
let devMode = true

let win
let menubarToBeEnabled = true

function createWindow () {
  //Create the browser window
  win = new BrowserWindow({ width: 545, height: 360 })

  //Load the index.html of the app
  win.loadFile('index.html')

  //If enabled, let user know DevMode is enabled
  if (devMode === true) {
    console.log("Notice: DevMode is enabled. \nKeyboard Shortcuts: \nCTRL/CMD+D: Open DevTools")
  }

  //Open DevTools Using CTRL/CMD+D
  globalShortcut.register('CommandOrControl+D', () => {
    if (devMode === true) {
      win.webContents.openDevTools()
      console.log("Notice: DevTools opened.")
    }
  })

  //Disable MenuBar by default
  win.setMenu(null)

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
    win = null
  })
}

//Create the window
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
