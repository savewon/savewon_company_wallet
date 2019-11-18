require('dotenv').config();
const settings = require('electron-settings')
const {app} = require('electron');
const XLSX = require('xlsx');
const ipcRenderer = require('electron').ipcRenderer;
const Web3 = require('web3')
const Tx = require('ethereumjs-tx')
const { checkNetworkStatus } = require('check-network-status');


const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/ed5413b615e44bd2b3fd412d94f54384'))
 const BigNumber = require('big-number');
/*********************** 입력객체 및 세팅값  **********************/
const multiButton = document.getElementById('sendMultiButton')
const table = document.getElementById("multitable");
const _userAddress = settings.get('userAddress')
const _privateKey = settings.get('userPrivateKey')
const selectDirBtn = document.getElementById('selectExcelButton')

var adressArray = new Array();
var mountArray = new Array();

ipcRenderer.on('show-confirm-savewon-multi-response', (event, response, gas) => {
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
        if(table.rows.length > 1){
            // ipcRenderer.send('show-progressbar', table.rows.length-1);
            var savewonBalance = settings.get('userSaveWonBalance');
            var etherBalance = settings.get('userEtherBalance');
            if(savewonBalance > 0 ){
              if(etherBalance > 0){
                if(etherBalance > gas){
                  ipcRenderer.send('show-progressbar', 'test');
                  sendNewMulti(_userAddress, adressArray, mountArray, function(isSuccess){
                     ipcRenderer.send('complete-progressbar', 'test');
                     if(isSuccess){
                       ipcRenderer.send('update-walleteInfo')
                       document.getElementById('savewonMultiEstimateGas').innerHTML =  '';
                       document.getElementById('savewonMultiBlockHash').innerHTML = "";
                       document.getElementById('excelFilePath').innerHTML = "";
                       removeTable();
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
              alert('세이브원토큰의 보유수량을 확인해 주세요');
            }
        }else{
          alert('엑셀파일이 로드되지 않았습니다.');
        }
      }
    });
  }
});

selectDirBtn.addEventListener('click', (event) => {

  adressArray.length = 0;
  mountArray.length = 0;
  document.getElementById('savewonMultiEstimateGas').innerHTML =  '';
  document.getElementById('savewonMultiBlockHash').innerHTML = "";
  document.getElementById('excelFilePath').innerHTML = "";
  ipcRenderer.send('open-file-dialog')
})

function removeTable(){
  var table = document.getElementById("multitable");
  var rowCount = table.rows.length;
  console.log(rowCount);

  for(var i=1; i<rowCount; i++){
    table.deleteRow(1);
  }
}

ipcRenderer.on('selectedExcelFile', (event, path) => {
  document.getElementById('excelFilePath').innerHTML = path;//`You selected: ${path}`
  if(path != ''){
    var workbook = XLSX.readFile(`${path}`);
    var firstWSheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[firstWSheetName];
    var list = XLSX.utils.sheet_to_json(sheet);
    var table = document.getElementById("multitable");
    var index = 0;
    list.forEach(function(element){
      var row = table.insertRow(1);

      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      cell1.innerHTML = index+1;
      cell2.innerHTML = sheet['B'+(index+2)].v;
      cell3.innerHTML = sheet['C'+(index+2)].v;
      cell4.innerHTML = sheet['D'+(index+2)].v;

      var address = sheet['C'+(index+2)].v;
      adressArray.push(address.toString());

      var mount =  sheet['D'+(index+2)].v
      mountArray.push(web3.utils.toHex(web3.utils.toWei(mount.toString(), 'ether')));

      index ++;
    });
  }
})

//멀티 전송버튼 클릭
multiButton.addEventListener('click', (event) => {

  checkNetworkStatus({
      timeout: 3000,
      backUpURL: 'https://example.com',
      pingDomain: 'github.com',
      method: 'GET'
  }).then(function(result){
    if(!result){
      alert('인터넷 연결을 확인해주세요.')
    }else{
      if(table.rows.length > 1){
          // ipcRenderer.send('show-progressbar', table.rows.length-1);
          var savewonBalance = settings.get('userSaveWonBalance');
          var etherBalance = settings.get('userEtherBalance');
          if(savewonBalance > 0 ){
            if(etherBalance > 0){
               sendNewMultiGas(_userAddress, adressArray, mountArray, function(estimateGas){
                    ipcRenderer.send('show-confirm-savewon-multi', estimateGas);
                    document.getElementById('savewonMultiEstimateGas').innerHTML =  (estimateGas + ' ether');
              });
            }else{
              alert('보유하고 있는 이더리움 수량을 확인해 주세요.');
            }
          }else{
            alert('세이브원토큰의 보유수량을 확인해 주세요');
          }
      }else{
        alert('엑셀파일이 로드되지 않았습니다.');
      }
    }
  });
})


//토큰 멀티 전송을 위한 함수
function sendNewMulti(fromAddress, _addressArray, _mountArray, callback){

    let tokenAddress = '0xc057E4A0B6Ef2b53D6bdFe7300F7f36470600376' //
    var temp = (_privateKey).slice(0, 2)
    var subPrivateKey;
    if(temp == '0x'){
      subPrivateKey = (_privateKey).substring(2);
    }else{
      subPrivateKey = _privateKey;
    }

    var privateKey = new Buffer.from(subPrivateKey, 'hex');
    let contractABI = require('../../../data/savewon.json');
    let contract = new web3.eth.Contract(contractABI, tokenAddress)
    let transactions = {
        to:tokenAddress,
        value: '0x00',
        data: contract.methods.multiTransfer(_addressArray, _mountArray).encodeABI()
    };

    web3.eth.getTransactionCount(fromAddress)
    .then((txCount) => {

      transactions.nonce = web3.utils.toHex(txCount);
      transactions.from = fromAddress;
      transactions.gasPrice = web3.utils.toHex(20 * 1e9);

      web3.eth.estimateGas(transactions, function(err, gas){
        console.log('gasLimit : '+ gas);

        transactions.gasLimit = web3.utils.toHex(gas);
        let transaction = new Tx(transactions)
        transaction.sign(privateKey)

        web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        .once('transactionHash', function(hash){
          console.log('                 맨처음                  ');
          console.log('========== 트렌젝션 해쉬번호 ===============');
          console.log('transactionHash : '+hash);
          console.log('========================================');
          console.log('                                        ');
          document.getElementById('savewonMultiBlockHash').innerHTML = hash;
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



//토큰 멀티 전송을 위한 함수
function sendNewMultiGas(fromAddress, _addressArray, _mountArray, callback){

    let tokenAddress = '0xc057E4A0B6Ef2b53D6bdFe7300F7f36470600376' // 
    var temp = (_privateKey).slice(0, 2)
    var subPrivateKey;
    if(temp == '0x'){
      subPrivateKey = (_privateKey).substring(2);
    }else{
      subPrivateKey = _privateKey;
    }

    var privateKey = new Buffer.from(subPrivateKey, 'hex');
    let contractABI = require('../../../data/savewon.json');
    let contract = new web3.eth.Contract(contractABI, tokenAddress)
    let transactions = {
        to:tokenAddress,
        value: '0x00',
        data: contract.methods.multiTransfer(_addressArray, _mountArray).encodeABI()
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
