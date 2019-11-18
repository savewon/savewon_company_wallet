const { ipcMain, dialog, app } = require('electron')

ipcMain.on('show-logout-message-box', (event) => {
  const string = ' 지갑정보를 저장을 하셨나요? \n\n 지갑개인키는 필수로 백업을 하시길 바랍니다.\n\n 저장을 하지않으면 차후 지갑을 찾을수 없게 됩니다. \n\n 그래도 로그아웃하시겠습니까?';
  const options = {
      type: 'question',
      buttons: ['Cancel', '네', '아니오'],
      defaultId: 2,
      title: '중요',
      message: '로그아웃',
      detail: string
    };

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      //response 버튼 클릭 타입
      event.sender.send('show-logout-message-box-response', response);
    });
});
