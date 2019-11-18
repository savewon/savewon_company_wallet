require('dotenv').config();
const settings = require('electron-settings')
const {app} = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
 const { checkNetworkStatus } = require('check-network-status');


/*********************** 입력객체 및 세팅값  **********************/
const savewonSingleSendButton = document.getElementById('savewonSingleSendButton')
const savewonSingleToAddress = document.getElementById('savewonSingleToAddress') // 이더 주소
const savewonSingleMount = document.getElementById('savewonSingleMount') // 이더 주소
const _userAddress = settings.get('userAddress')
const _privateKey = settings.get('userPrivateKey')
/************************************************************/

ipcRenderer.on('show-confirm-savewon-single-response', (event, response, gas) => {
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
        if(savewonSingleToAddress.value != ''){
          if(savewonSingleMount.value != ''){
            var savewonBalance = settings.get('userSaveWonBalance');
            if(savewonBalance > 0 ){
              if(savewonBalance > savewonSingleMount.value){
                var etherBalance = settings.get('userEtherBalance');
                if(etherBalance > 0 ){
                    if(etherBalance > gas){
                      document.getElementById('savewonBlockHash').innerHTML = '';
                      ipcRenderer.send('show-progressbar', 'test');
                      sendSaveWon(_userAddress, savewonSingleToAddress.value, savewonSingleMount.value, function(isSuccess){
                        ipcRenderer.send('complete-progressbar', 'test');
                        if(isSuccess){
                          ipcRenderer.send('update-walleteInfo')
                          savewonSingleMount.value = '';
                          savewonSingleToAddress.value = '';
                          document.getElementById('savewonEstimateGas').innerHTML =  '';
                          document.getElementById('savewonBlockHash').innerHTML =  '';
                          alert('전송완료');
                        }else{
                          alert('전송실패');
                        }
                      });
                    }else{
                      alert('보유하고 있는 이더리움 수량을 확인 해주세요.\n\n전송수수료가 부족합니다.');
                    }
                }else{
                  alert('보유하고 있는 이더리움 수량을 확인해 주세요.');
                }
              }else{
                  alert('세이브원토큰의 보유 토큰이 전송양보다 적습니다.');
              }
            }else{
                alert('세이브원토큰의 보유수량을 확인해 주세요');
            }
          }else{
              alert('전송하고자하는 수량을 입력해주세요');
          }
        }else{
            alert('전송하고자하는 주소를 입력해주세요');
        }
      }
    });
  }
});

//전송버튼 클릭
savewonSingleSendButton.addEventListener('click', (event) => {

  checkNetworkStatus({
      timeout: 3000,
      backUpURL: 'https://example.com',
      pingDomain: 'github.com',
      method: 'GET'
  }).then(function(result){
    if(!result){
      alert('인터넷 연결을 확인해주세요.')
    }else{
      if(savewonSingleToAddress.value != ''){
        if(savewonSingleMount.value != ''){
          var savewonBalance = settings.get('userSaveWonBalance');
          if(savewonBalance > 0 ){
            if(savewonBalance > savewonSingleMount.value){
              var etherBalance = settings.get('userEtherBalance');
              if(etherBalance > 0 ){
                document.getElementById('savewonBlockHash').innerHTML = '';
                  sendSaveWonGetGas(_userAddress, savewonSingleToAddress.value, savewonSingleMount.value, function(estimateGas){
                        ipcRenderer.send('show-confirm-savewon-single', estimateGas);
                        document.getElementById('savewonEstimateGas').innerHTML =  (estimateGas + ' ether');
                  });
              }else{
                alert('보유하고 있는 이더리움 수량을 확인해 주세요.');
              }
            }else{
                alert('세이브원토큰의 보유 토큰이 전송양보다 적습니다.');
            }
          }else{
              alert('세이브원토큰의 보유수량을 확인해 주세요');
          }
        }else{
            alert('전송하고자하는 수량을 입력해주세요');
        }
      }else{
          console.log(savewonSingleToAddress.value);
          alert('전송하고자하는 주소를 입력해주세요');
      }
    }
  });
})

//토큰 전송버튼
function sendSaveWon(fromAddress, toAddress, amount, callback){

    const Web3 = require('web3')
    const Tx = require('ethereumjs-tx')
    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'))
    console.log(_privateKey);
    let tokenAddress = '0xc057E4A0B6Ef2b53D6bdFe7300F7f36470600376' // 컨트렉트 주소
    var temp = (_privateKey).slice(0, 2)
    var subPrivateKey;
    if(temp == '0x'){
      subPrivateKey = (_privateKey).substring(2);
    }else{
      subPrivateKey = _privateKey;
    }

    var privateKey = new Buffer.from(subPrivateKey, 'hex');

    let contractABI = require('../../../data/savewon.json'); //abi 로드
    let contract = new web3.eth.Contract(contractABI, tokenAddress)
    let sendAmount = web3.utils.toWei(amount, 'ether');

    let transactions = {
        to:tokenAddress,
        value: '0x00',
        data: contract.methods.transfer(toAddress, sendAmount).encodeABI()
    };

    web3.eth.getTransactionCount(fromAddress)
    .then((txCount) => {

      transactions.nonce = web3.utils.toHex(txCount);
      transactions.from = fromAddress;
      transactions.gasPrice = web3.utils.toHex(20 * 1e9);

      web3.eth.estimateGas(transactions, function(err, gas){
        transactions.gasLimit = web3.utils.toHex(gas);

        console.log('gasLimit : ' + gas);

        let transaction = new Tx(transactions);
        transaction.sign(privateKey);

        web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        .once('transactionHash', function(hash){
          console.log('                 맨처음                  ');
          console.log('========== 트렌젝션 해쉬번호 ===============');
          console.log('transactionHash : '+hash);
          console.log('========================================');
          console.log('                                        ');
          document.getElementById('savewonBlockHash').innerHTML = hash;
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

function sendSaveWonGetGas(fromAddress, toAddress, amount, callback){

    const Web3 = require('web3')
    const Tx = require('ethereumjs-tx')
    const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'))
    console.log(_privateKey);
    let tokenAddress = '0xc057E4A0B6Ef2b53D6bdFe7300F7f36470600376' // 컨트렉트 주소
    var temp = (_privateKey).slice(0, 2)
    var subPrivateKey;
    if(temp == '0x'){
      subPrivateKey = (_privateKey).substring(2);
    }else{
      subPrivateKey = _privateKey;
    }

    var privateKey = new Buffer.from(subPrivateKey, 'hex');

    let contractABI = require('../../../data/savewon.json'); //abi 로드
    let contract = new web3.eth.Contract(contractABI, tokenAddress)
    let sendAmount = web3.utils.toWei(amount, 'ether');

    let transactions = {
        to:tokenAddress,
        value: '0x00',
        data: contract.methods.transfer(toAddress, sendAmount).encodeABI()
    };

    web3.eth.getTransactionCount(fromAddress)
    .then((txCount) => {

      transactions.nonce = web3.utils.toHex(txCount);
      transactions.from = fromAddress;
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
