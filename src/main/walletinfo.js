const {app, ipcMain, BrowserWindow} = require('electron')

ipcMain.on('update-walleteInfo', function(event){
  event.sender.send('update-walleteInfo-response');
})
