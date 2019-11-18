const settings = require('electron-settings')
require('dotenv').config();

const userAddress =  settings.get('userAddress');


const refreshbutton = document.getElementById('refress-button')
const webview = document.getElementById('webview')

refreshbutton.addEventListener('click', (event) => {

  const { checkNetworkStatus } = require('check-network-status');
  checkNetworkStatus({
      timeout: 3000,
      backUpURL: 'https://example.com',
      pingDomain: 'github.com',
      method: 'GET'
  }).then(function(result){
    if(!result){
      alert('인터넷 연결을 확인해주세요.')
    }else{
      runEtherScan();
    }
  });
})

function runEtherScan(){
      webview.loadURL('https://etherscan.io/address/'+userAddress+"#tokentxns", {
          userAgent: "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
      });
}

onload = () => {
    setTimeout(function() {
      runEtherScan();
    }, 1000 * 3);
};
