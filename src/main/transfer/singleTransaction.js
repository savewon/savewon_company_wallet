const {app, ipcMain, BrowserWindow, dialog} = require('electron')
const ProgressBar = require('electron-progressbar');

let progressBar = null;

ipcMain.on('show-progressbar', (event, arg) => {
  showProgressbar();
});

ipcMain.on('complete-progressbar', (event, arg) => {
  if (!progressBar) {
    return;
  }
  progressBar.setCompleted();
  setTimeout(function() {
    progressBar = null
  }, 1000);
});


ipcMain.on('show-confirm-savewon-single', (event, gas) => {
  const string = '세이브원 토큰 전송시 '+gas +' ether 의 수수료(예상치)가 발생을 합니다.\n\n (위 수수료는 이더리움 네트워크 상태에 따라 차이가 날수 있습니다.)\n\n전송하시겠습니까?';
  const options = {
      type: 'question',
      buttons: ['Cancel', '네', '아니오'],
      defaultId: 2,
      title: '',
      message: '세이브원 전송',
      detail: string
    };

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      //response 버튼 클릭 타입
      event.sender.send('show-confirm-savewon-single-response', response, gas);
    });
});

function showProgressbar () {
  if (progressBar) {
    console.log('progressBar exist')
    return;
  }

  progressBar = new ProgressBar({
      text: '전송중 입니다.',
      detail: 'Wait...'
    });

    progressBar
     .on('completed', function() {
       console.info(`completed...`);
       progressBar.detail = 'Task completed. Exiting...';
     })
     .on('aborted', function() {
       console.info(`aborted...`);
     });
}
