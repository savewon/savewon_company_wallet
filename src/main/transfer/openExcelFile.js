const {ipcMain, dialog} = require('electron')


ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
    { name: 'excel(xlsx)', extensions: ['xlsx'] }
    ]
  }, (files) => {
    if (files) {
      event.sender.send('selectedExcelFile', files)
    }
  })
})
