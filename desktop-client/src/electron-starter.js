const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create tray icon for menu bar.
const Tray = electron.Tray;
// Module to create menu for menu bar.
const Menu = electron.Menu;
// Module to open external window.
const shell = electron.shell;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Module to control global keyboard shortcuts
const globalShortcut = electron.globalShortcut;
const CAPTURE_SHORTCUT = "CommandOrControl+Shift+C";
const SURFACE_SHORTCUT = "Command+Shift+S";

const path = require("path");
const url = require("url");

const assetsDirectory = path.join(__dirname, "assets");

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer");

// Tray
let tray;

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, "icon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Surface",
      accelerator: SURFACE_SHORTCUT,
      click: openSurfaceInBrowswer
    },
    {
      label: "Toggle Capture",
      accelerator: CAPTURE_SHORTCUT,
      click: toggleKeyboardShortcutWindow
    },
    {
      label: "Quit",
      accelerator: "Command+Q",
      selector: "terminate:"
    }
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
};

// Keyboard shortcut
let keyboardShortcutWindow;
let keyboardShortcutWindowShowing = false;

function createKeyboardShortcutWindow() {
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

  keyboardShortcutWindow.blur();

  keyboardShortcutWindow.hide();
}

function toggleKeyboardShortcutWindow() {
  if (keyboardShortcutWindowShowing) {
    keyboardShortcutWindowShowing = false;
    keyboardShortcutWindow.blur();
    keyboardShortcutWindow.hide();
    return;
  }

  keyboardShortcutWindowShowing = true;
  keyboardShortcutWindow.focus();
  keyboardShortcutWindow.show();
}

function openSurfaceInBrowswer() {
  shell.openExternal("https://web-client-dot-opit-193719.appspot.com/surface");
}

// Don't show the app in the dock
app.dock.hide();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createTray();
  createKeyboardShortcutWindow();
  // Register global shortcuts
  globalShortcut.register(CAPTURE_SHORTCUT, toggleKeyboardShortcutWindow);
  globalShortcut.register(SURFACE_SHORTCUT, openSurfaceInBrowswer);
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// When the app will quit unregister the global shortcuts
app.on("will-quit", () => {
  // Unregister a shortcut.
  globalShortcut.unregister(CAPTURE_SHORTCUT);

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
