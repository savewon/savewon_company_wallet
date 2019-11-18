// require('dotenv').config();
const settings = require('electron-settings');
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const {clipboard, dialog} = require('electron');

const logoutButton = document.getElementById('logoutButton');
const balanceRefreshButton = document.getElementById('balanceRefreshButton');
const copyAddressButton = document.getElementById('copyAddressButton');

const etherBalance = document.getElementById('etherBalance');
const savewonBalance = document.getElementById('savewonBalance');
const etherAddress = document.getElementById('etherAddress');


//로그아웃버튼 클릭
logoutButton.addEventListener('click', (event) => {
  ipcRenderer.send('show-logout-message-box');
});

ipcRenderer.on('show-logout-message-box-response', (event, arg) => {
  if(arg == 1){
        settings.set('userPassword', '');
        settings.set('userAddress', '');
        settings.set('userPrivateKey', '');
        settings.set('userMnemonic', '');
        remote.getCurrentWindow().reload();
  }
});

ipcRenderer.on('update-walleteInfo-response', (event) => {
//ipcRenderer.send('update-walleteInfo-response')
  const userAddress = settings.get('userAddress');
  getEtherBalance(userAddress);
  getTokenBalance(userAddress);
});

copyAddressButton.addEventListener('click', (event) => {
  if(etherAddress.innerHTML !== ''){
    // electron.writeText(etherAddress.innerHTML);
    var address = etherAddress.innerHTML;
    clipboard.writeText(address);
    alert('주소를 복사하였습니다.');
  }
});

//새로고침 버튼
balanceRefreshButton.addEventListener('click', (event) => {
    const { checkNetworkStatus } = require('check-network-status');
    checkNetworkStatus({
        timeout: 3000,
        backUpURL: 'https://example.com',
        pingDomain: 'github.com',
        method: 'GET'
    }).then(function(result){
      if(!result){
        alert('인터넷 연결을 확인해주세요.');
      }else{
        const userAddress = settings.get('userAddress');
        getEtherBalance(userAddress);
        getTokenBalance(userAddress);
      }
    });
});

//이더리움 토큰 밸런스 확인 함수
function getEtherBalance(userAddress){
    console.log('이더잔액얻기');
  // Require the web3 node module.
  var Web3 = require('web3');
  // Show Web3 where it needs to look for a connection to Ethereum.
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
// 0x964b13A67395A5acAe4FD518D31E14F2AF0997Cb
  // Write to the console the script will run shortly.
  console.log('Getting Ethereum address info.....');

  // Define the address to search witin.
  var addr = (userAddress);

  // Show the address in the console.
  console.log('Address:', addr);

  // Use Wb3 to get the balance of the address, convert it and then show it in the console.
  web3.eth.getBalance(addr, function (error, result) {
  	if (!error){
        console.log('이더에러없음');
        etherBalance.innerHTML = web3.utils.fromWei(result,'ether');
      	console.log('Ether:', web3.utils.fromWei(result,'ether')); // Show the ether balance after converting it from Wei
        settings.set('userEtherBalance', etherBalance.innerHTML);
    }
  	else {
      console.log('이더에러발생');
      settings.set('userEtherBalance', 0);
      etherBalance.innerHTML = 0;
      console.log('Huston we have a promblem: ', error); // Should dump errors here
    }
  });
}

//SAVEWON 토큰 밸런스 확인 함수
function getTokenBalance(userAddress){
  var Web3 = require('web3');
  // web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  console.log('토큰잔액얻기');

  // 토큰을 존재하는 지갑 주소
  var addr = (userAddress);

  // 토큰의 스마트 컨트렉트 주소
  var contractAddr = ('0xc057E4A0B6Ef2b53D6bdFe7300F7f36470600376');

  // 확인할 주소를 가져와 0x를 지운다
  var tknAddress = (addr).substring(2);

  // '0x70a08231' 는 'balanceOf()' ERC20 토큰의 헥스값입니다. 여기에 지갑 주소를 붙여 씁니다.
  var contractData = ('0x70a08231000000000000000000000000' + tknAddress);

  //함수 호출부
  web3.eth.call({
      to: contractAddr, // 지갑의 주소 토큰 잔액호출에 사용
      data: contractData
      }, function(err, result) {
  	if (result) {
  		var tokens = web3.utils.toBN(result).toString(); // 결과값 반환
      console.log(tokens);
  		console.log('Tokens Owned: ' + web3.utils.fromWei(tokens, 'ether')); // Change the string to be in Ether not Wei, and show it in the console
      savewonBalance.innerHTML =  web3.utils.fromWei(tokens, 'ether');
      settings.set('userSaveWonBalance', savewonBalance.innerHTML);
  	}
  	else {
  		console.log(err); // Dump errors here
      savewonBalance.innerHTML =  0;
      settings.set('userSaveWonBalance', 0);
  	}
  });
};

// const userAddress = settings.get('userAddress')
const _userAddress = settings.get('userAddress');
etherAddress.innerHTML = _userAddress;
