/*
A script that will sign and broadcast an ethereum transaction to the network, then shows the result in the console.
WARNING!
If executed this script will send ether, be sure the info is correct before you run this!
Alternatively you should use a test net with test ether first before running this on the main net.
For an explanation of this code, navigate to the wiki https://github.com/ThatOtherZach/Web3-by-Example/wiki/Send-Ether-Transaction
*/
require('dotenv').config();
const settings = require('electron-settings')
const {app} = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
const { checkNetworkStatus } = require('check-network-status');


/*********************** 입력객체 및 세팅값  **********************/
const etherMount = document.getElementById('etherMount') // 토큰 수량
const etherToAddress = document.getElementById('etherToAddress') // 이더 주소
const sendEthereumButton = document.getElementById('sendEthereumButton')
const _userAddress = settings.get('userAddress')
const _privateKey = settings.get('userPrivateKey')
/************************************************************/

ipcRenderer.on('show-confirm-ether-send-response', (event, response, gas) => {
  if(response == 1){
    checkNetworkStatus({
        timeout: 3000,
        backUpURL: 'https://example.com',
        pingDomain: 'github.com',
        method: 'GET'
    }).then(function(result){
      if(!result){
        alert('인터넷 연결을 확인해주세요.')
      }else{
        if(etherToAddress.value != ''){
          if(etherMount.value != ''){
            var etherBalance = settings.get('userEtherBalance');
            if(etherBalance > 0){
              if(etherBalance > etherMount.value){
                console.log('gas gas '+ gas);
                if(etherBalance > gas){
                  sendEthereum(etherToAddress.value, etherMount.value, function(isSuccess){
                    ipcRenderer.send('complete-progressbar', 'test');
                    if(isSuccess){
                      ipcRenderer.send('update-walleteInfo')
                      etherMount.value = '';
                      etherToAddress.value = '';
                      document.getElementById('etherEstimateGas').innerHTML =  '';
                      document.getElementById('etherBlockHash').innerHTML =  '';
                      alert('전송완료');
                    }else{
                      alert('전송실패');
                    }
                  });
                }else{
                  alert('보유하고 있는 이더리움 수량을 확인 해주세요.\n\n전송수수료가 부족합니다.');
                }
              }else{
                alert('이더리움 보유수량을 확인해 주세요');
              }
            }else{
              alert('이더리움 보유수량을 확인해 주세요');
            }
          } else {
            alert('전송하고자하는 수량을 입력해주세요');
          }
        } else {
          alert('전송하고자하는 주소를 입력해주세요');
        }
      }
    });
  }
});

//전송버튼 클릭
sendEthereumButton.addEventListener('click', (event) => {

  checkNetworkStatus({
      timeout: 3000,
      backUpURL: 'https://example.com',
      pingDomain: 'github.com',
      method: 'GET'
  }).then(function(result){
    if(!result){
      alert('인터넷 연결을 확인해주세요.')
    }else{
      if(etherToAddress.value != ''){

        if(etherMount.value != ''){

          var etherBalance = settings.get('userEtherBalance');
          if(etherBalance > 0){
            if(etherBalance > etherMount.value){
              document.getElementById('etherBlockHash').innerHTML = '';
              sendEthereumGas(etherToAddress.value, etherMount.value, function(estimateGas){
                ipcRenderer.send('show-confirm-ether-send', estimateGas);
                document.getElementById('etherEstimateGas').innerHTML =  (estimateGas + ' ether');
              });
            }else{
              alert('이더리움 보유수량을 확인해 주세요');
            }
          }else{
            alert('이더리움 보유수량을 확인해 주세요');
          }
        } else {
          alert('전송하고자하는 수량을 입력해주세요');
        }
      } else {
        alert('전송하고자하는 주소를 입력해주세요');
      }
    }
  });
})

//이더리움 전송 (실제 전송가능한지 재확인 해야함)
function sendEthereumGas(toAddress, amount, callback){
  // Add the web3 node module
  var Web3 = require('web3');
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  var Tx = require('ethereumjs-tx');
  var temp = (_privateKey).slice(0, 2)
  var subPrivateKey;
  if(temp == '0x'){
    subPrivateKey = (_privateKey).substring(2);
  }else{
    subPrivateKey = _privateKey;
  }

  var privateKey = new Buffer.from(subPrivateKey, 'hex');
  var receivingAddr = toAddress.toString();
  let txValue = web3.utils.toHex(web3.utils.toWei(amount, 'ether'));

  let transactions = {
      to:receivingAddr,
      value: txValue,
      data: '0x00'
  };

  web3.eth.getTransactionCount(_userAddress).then(function(txCount){

    transactions.nonce = web3.utils.toHex(txCount);
    transactions.from = _userAddress;
    transactions.gasPrice = web3.utils.toHex(20 * 1e9);
    var gas = 20 * 1e9;

    web3.eth.estimateGas(transactions, function(err, gasPrice){
      transactions.gasLimit = web3.utils.toHex(gasPrice);
      var gasPrice = Number(gasPrice);
      console.log("gas estimation = " + gas + " units");
      console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
      var gasStr = web3.utils.toBN((gas * gasPrice)).toString(); // 결과값 반환
      console.log("gas cost estimation = " + web3.utils.fromWei(gasStr, 'ether') + " ether");
      callback(web3.utils.fromWei(gasStr, 'ether'));
    });
  });
}

//이더리움 전송 (실제 전송가능한지 재확인 해야함)
function sendEthereum(toAddress, amount, callback){
  // Add the web3 node module
  var Web3 = require('web3');
  web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'));
  var Tx = require('ethereumjs-tx');
  var temp = (_privateKey).slice(0, 2)
  var subPrivateKey;
  if(temp == '0x'){
    subPrivateKey = (_privateKey).substring(2);
  }else{
    subPrivateKey = _privateKey;
  }

  var privateKey = new Buffer.from(subPrivateKey, 'hex');
  var receivingAddr = toAddress.toString();
  let txValue = web3.utils.toHex(web3.utils.toWei(amount, 'ether'));

  let transactions = {
      to:receivingAddr,
      value: txValue,
      data: '0x00'
  };

  web3.eth.getTransactionCount(_userAddress).then(function(txCount){

    transactions.nonce = web3.utils.toHex(txCount);
    transactions.from = _userAddress;
    transactions.gasPrice = web3.utils.toHex(20 * 1e9);

    web3.eth.estimateGas(transactions, function(err, gas){
      transactions.gasLimit = web3.utils.toHex(gas);

      var tx = new Tx(transactions);
      tx.sign(privateKey); // Here we sign the transaction with the private key
      var serializedTx = tx.serialize(); // Clean things up a bit

      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')) // Broadcast the transaction to the network

      .once('transactionHash', function(hash){
        console.log('                 맨처음                  ');
        console.log('========== 트렌젝션 해쉬번호 ===============');
        console.log('transactionHash : '+hash);
        console.log('========================================');
        console.log('                                        ');
        document.getElementById('etherBlockHash').innerHTML = hash;
      })
      .once('receipt', function(receipt){

        console.log('                                        ');
        console.log('=============== 전송 최종 확인중 ==================');
        console.log('receipt : '+JSON.stringify(receipt));
        console.log('========================================');
        console.log('                                        ');

      })
      .on('confirmation', function(confNumber, receipt){
        console.log('                                        ');
        console.log('================ 전송 처리중 ===============');
        console.log('confirmation : receipt:'+JSON.stringify(confNumber) +' receipt :'+JSON.stringify(receipt));
        console.log('========================================');
        console.log('                                        ');
      })
      .on('error', function(error){
        console.log('                                        ');
        console.log('================ 에러발생 =================');
        console.log('error : '+JSON.stringify(error));
        console.log('========================================');
        console.log('                                        ');
        callback(false);
      })
      .then(function(receipt){
        console.log('                                        ');
        console.log('================ 이체결과 =================');
        console.log('receipt : '+JSON.stringify(receipt));
        console.log('========================================');
        console.log('                                        ');
        callback(true);
      });
    });
  });
}
