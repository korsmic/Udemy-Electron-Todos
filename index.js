const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo',
    parent: mainWindow
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // clean Memory
  addWindow.on('closed', () => (addWindow = null));
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Todos',
        accelerator: process.platform === 'darwin' ? 'Command+Z' : 'Ctrl+Z',
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        // shortcut key
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          // quit electron
          app.quit();
        }
      }
    ]
  }
];

// for Mac OS add menu object
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload ' },
      {
        label: 'Toggle Developper Tools',
        accelerator:
          process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, foucusedWindow) {
          foucusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
