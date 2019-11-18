const {app, ipcMain} = require('electron')

ipcMain.on('getBackupKey', (event, paramPrivatekey, paramMnomoic) => {
    event.sender.send('showBackupKey', paramPrivatekey, paramMnomoic)
})
