const {app, ipcMain, BrowserWindow, dialog} = require('electron')

ipcMain.on('show-confirm-ether-send', (event, gas) => {
  const string = '이더리움전송시 '+gas +' ether 의 수수료(예상치)가 발생을 합니다.\n\n(위 수수료는 이더리움 네트워크 상태에 따라 차이가 날수 있습니다.)\n\n전송하시겠습니까?';
  const options = {
      type: 'question',
      buttons: ['Cancel', '네', '아니오'],
      defaultId: 2,
      title: '',
      message: '이더리움 전송',
      detail: string
    };

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      //response 버튼 클릭 타입
      event.sender.send('show-confirm-ether-send-response', response, gas);
    });
});
