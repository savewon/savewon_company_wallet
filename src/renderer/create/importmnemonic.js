require('dotenv').config();
const settings = require('electron-settings')
const fs = require('fs');
const remote = require('electron').remote;
const ethers = require('ethers');
var md5 = require('md5');
var mnemonicInput = document.getElementById('mnemonicInput');
var inputMnemonicPassword = document.getElementById('inputMnemonicPassword');
var inputMnemonicRePassword = document.getElementById('inputMnemonicRePassword');
var loadMnemonicButton = document.getElementById('loadMnemonicButton');

loadMnemonicButton.addEventListener('click', (event) => {

  if(mnemonicInput.value === ""){
      alert("입력한 값이 없습니다.");
  }else{
    if(inputMnemonicPassword.value.length == 0 || inputMnemonicRePassword.value.length == 0){
      alert("패스워드는 빈공백일수 없습니다.");
      return;
    }else if(inputMnemonicPassword.value !== inputMnemonicRePassword.value ){
      alert("입력한 비밀번호가 서로 다릅니다.");
      return;
    }else if(inputMnemonicPassword.value.length < 8 || inputMnemonicRePassword.value.length < 8){
      alert("패스워드는 최소 8글자 이상입니다.");
      return;
    }else{
      console.log(inputMnemonicPassword.value);
      loadAddressByMnemonic(inputMnemonicPassword.value, mnemonicInput.value);
    }
  }
});

function loadAddressByMnemonic(password, mnemonic){
  let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
  let path = "m/44'/60'/0'/0/0";
  let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);

  console.log(secondMnemonicWallet);
  settings.set('userAddress', secondMnemonicWallet['address']);
  var privatePassword = md5(password)
  settings.set('userPassword', privatePassword);
  settings.set('userPrivateKey', secondMnemonicWallet['privateKey']);
  settings.set('userMnemonic', secondMnemonicWallet['mnemonic']);
  remote.getCurrentWindow().reload();
}
