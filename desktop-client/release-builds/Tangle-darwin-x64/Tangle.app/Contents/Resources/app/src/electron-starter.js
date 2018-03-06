const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to control global keyboard shortcuts
const globalShortcut = electron.globalShortcut;
const CAPTURE_SHORTCUT = "CommandOrControl+Shift+C";

const path = require("path");
const url = require("url");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 800,
    height: 750,
    minHeight: 600,
    backgroundColor: "#FFFFFF"
  });

  // ESLint will warn about any use of eval(), even this one
  // eslint-disable-next-line
  mainWindow.eval = global.eval = function() {
    throw new Error(`Sorry, this app does not support window.eval().`);
  };

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true
    });
  mainWindow.loadURL(startUrl);

  // Install DevTools extenions
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log("An error occurred: ", err));

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createMainWindow();

  // Register global capture shortcut
  const reg = globalShortcut.register(CAPTURE_SHORTCUT, () => {
    if (keyboardShortcutWindowCreated) {
      keyboardShortcutWindowCreated = false;
      keyboardShortcutWindow.close();
      return;
    }
    createKeyboardShortcutWindow();
  });

  // check if registration failed (shortcut already mapped by OS)
  if (!reg) {
    console.log("Capture shortcut registration failed");
  }

  // Check whether the shortcut is register
  console.log(globalShortcut.isRegistered(CAPTURE_SHORTCUT));
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// When the app will quit unregister the global shortcuts
app.on("will-quit", () => {
  // Unregister a shortcut.
  globalShortcut.unregister(CAPTURE_SHORTCUT);

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// Keyboard shortcut window
let keyboardShortcutWindow;
let keyboardShortcutWindowCreated = false;

function createKeyboardShortcutWindow() {
  if (keyboardShortcutWindowCreated) {
    return;
  }

  keyboardShortcutWindowCreated = true;

  // Create the browser window.
  keyboardShortcutWindow = new BrowserWindow({
    width: 350,
    minWidth: 350,
    maxWidth: 350,
    height: 200,
    minHeight: 75,
    backgroundColor: "#FFFFFF",
    frame: false,
    hasShadow: true,
    opacity: 1
  });

  // ESLint will warn about any use of eval(), even this one
  // eslint-disable-next-line
  keyboardShortcutWindow.eval = global.eval = function() {
    throw new Error(`Sorry, this app does not support window.eval().`);
  };

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "/../build/index.html"),
      protocol: "file:",
      slashes: true
    });

  keyboardShortcutWindow.loadURL(startUrl);

  // Emitted when the window is closed.
  keyboardShortcutWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    keyboardShortcutWindow = null;
  });
}
