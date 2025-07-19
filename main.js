const {
  app,
  BrowserWindow,
  Tray,
  shell,
  Menu,
  nativeImage,
} = require("electron");
const path = require("path");

let tray = null;
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "goodnotes.png"),
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadURL("https://web.goodnotes.com");

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.includes("goodnotes.com")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.includes("goodnotes.com")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.on("minimize", function (event) {
    event.preventDefault();
    win.hide();
  });
}

app.whenReady().then(() => {
  createWindow();
  // System Tray
  const iconPath = path.join(__dirname, "goodnotes.png");
  const trayIcon = nativeImage.createFromPath(iconPath);
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => win.show() },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setToolTip("Goodnotes Electron");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    win.isVisible() ? win.hide() : win.show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
