require('dotenv').config();
var md5 = require('md5');
const settings = require('electron-settings')
var fs = require('fs');
var appRoot = require('app-root-path');
var dialog = require('dialog')
const {ipcRenderer} = require('electron');
const writeJsonFile = require('write-json-file');
const backupButton = document.getElementById('backupButton')

backupButton.addEventListener('click', (event) => {

  var input = document.getElementById('backup_userpassword')
  const userPassword = settings.get('userPassword')
  const userAddress = settings.get('userAddress')
  const _privateKey = settings.get('userPrivateKey')
  const userMnemonic = settings.get('userMnemonic')

  console.log(userPassword);
  console.log('입력값' + input.value);

  var backup_userpassword = input.value
  var privatePassword = md5(backup_userpassword)

  if(privatePassword === userPassword){
    input.value = "";
    ipcRenderer.send('getBackupKey', _privateKey, userMnemonic)
  }else{
    input.value = "";
    alert("틀린비밀번호")
  }
})

ipcRenderer.on('showBackupKey', (event, paramPrivatekey, paramMnomoic)=>{

    if(paramMnomoic){
      var string = '지갑의 닉모닉의 키입니다. \n\n'+ paramMnomoic +'\n\n'+'보완에 중요한 키이므로 따로 작성\n\n보관하여 안전하게 보관하세요.';
      dialog.info(string, "확인", function(exitCode){
     })
    }else{
      var string = '지갑의 프라이빗 키입니다. \n\n'+ paramPrivatekey +'\n\n'+'보완에 중요한 키이므로 따로 작성\n\n보관하여 안전하게 보관하세요.';
      dialog.info(string, "확인", function(exitCode){
      })
    }

})
