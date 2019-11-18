require('dotenv').config();
const settings = require('electron-settings')
const fs = require('fs');
const remote = require('electron').remote;
var md5 = require('md5');

const makeWalletButton = document.getElementById('make-wallet')
var inputPassword = document.getElementById('create_userPassword');
var inputRePassword = document.getElementById('userRePassword');


makeWalletButton.addEventListener('click', (event) => {

  if(inputPassword.value === inputRePassword.value){
    //메인화면으로 이동
    createAccount(inputPassword);
    // createAccountTest();
  }else{
    alert("패스워드가 서로 다릅니다.")
  }
})

function createAccount(password){
  var ethers = require('ethers');
  let randomWallet = ethers.Wallet.createRandom();
  console.log(randomWallet);

  settings.set('userAddress', randomWallet['address']);
  var privatePassword = md5(password)
  settings.set('userPassword', privatePassword);
  settings.set('userPrivateKey', randomWallet['privateKey']);
  settings.set('userMnemonic', randomWallet['mnemonic']);
  remote.getCurrentWindow().reload();
}

function createAccount1(password){
  var Web3 = require('web3');
  // Show Web3 where it needs to look for a connection to Ethereum.
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  var account = web3.eth.accounts.create(web3.utils.randomHex(32));

  settings.set('userAddress', account.address)
  var privatePassword = md5(password)
  settings.set('userPassword', privatePassword);
  settings.set('userPrivateKey', account.privateKey);

  remote.getCurrentWindow().reload();

  // var mkdirp = require('mkdirp');
  // console.log(account.address);
  // console.log(account.privateKey);
  // mkdirp('./key', function(err) {
  //   if(err){
  //     // 폴더 쓰기 실패
  //     console.log(err);
  //   }else{
  //       let filename = account.address +'.txt';
  //
  //     fs.writeFile(`key/${filename}`, account.privateKey, 'utf8', function(err){
  //       if (err) {
  //              // 파일 쓰기 실패
  //             alert("파일 쓰기 실패");
  //          } else {
  //              // 파일 쓰기 성공
  //             alert("파일 쓰기 성공");
  //             remote.getCurrentWindow().reload();
  //          }
  //     });
  //   }
  // });
}
