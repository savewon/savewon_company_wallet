require('dotenv').config();
const settings = require('electron-settings')
const fs = require('fs');
const remote = require('electron').remote;
const ethers = require('ethers');
var md5 = require('md5');

var privateInput = document.getElementById('privateInput');
var inputPassword = document.getElementById('inputPassword');
var inputRePassword = document.getElementById('inputRePassword');
var loadButton = document.getElementById('loadButton');

loadButton.addEventListener('click', (event) => {
  if(privateInput.value === ""){
      alert("입력한 값이 없습니다.");
  }else{

    if(inputPassword.value.length == 0 || inputRePassword.value.length == 0){
      alert("패스워드는 빈공백일수 없습니다.");
      return;
    }else if(inputPassword.value !== inputRePassword.value ){
      alert("입력한 비밀번호가 서로 다릅니다.");
      return;
    }else if(inputPassword.value.length < 8 || inputRePassword.value.length < 8){
      alert("패스워드는 최소 8글자 이상입니다.");
      return;
    }else{
      console.log(inputPassword.value);
      loadAddressByPrivateKey(inputPassword.value, privateInput.value);
    }
  }
});

function loadAddressByPrivateKey(password, privateKey){
  // var Web3 = require('web3');
  // var md5 = require('md5')
  // // web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  // web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  //
  //    var account = web3.eth.accounts.wallet.add(privateKey);
  //    settings.set('userAddress', account.address);
  //    var privatePassword = md5(password)
  //    settings.set('userPassword', privatePassword);
  //    settings.set('userPrivateKey', account.privateKey);
  //    remote.getCurrentWindow().reload();

  let wallet = new ethers.Wallet(privateKey);

  // Connect a wallet to mainnet
  let provider = ethers.getDefaultProvider();
  let walletWithProvider = new ethers.Wallet(privateKey, provider);

  // console.log(walletWithProvider['address']);
   settings.set('userAddress', walletWithProvider['address']);
   var privatePassword = md5(password)
   settings.set('userPassword', privatePassword);
   settings.set('userPrivateKey', privateKey);
   remote.getCurrentWindow().reload();

}
