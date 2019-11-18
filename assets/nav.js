const settings = require('electron-settings')
const md5 = require('md5');
const { checkNetworkStatus } = require('check-network-status');
const ipcRenderer = require('electron').ipcRenderer;
require('dotenv').config();

//이동 이벤트 처리
document.body.addEventListener('click', (event) => {
  if (event.target.dataset.section) {

    console.log("1");
    handleSectionTrigger(event)

  } else if (event.target.dataset.modal) {

    console.log("2");
    handleModalTrigger(event)

  } else if (event.target.classList.contains('Wallet-Make')) {

    //생성화면으로 이동
    hideAllModals()
    displayCreateWallet()
    console.log("지갑생성화면으로이동")

  } else if (event.target.classList.contains('Wallet-Load')) {

    //지갑 로드화면으로 이동
    hideAllModals()
    displayLoad()
    console.log("지갑로드화면으로이동")

  }  else if (event.target.classList.contains('Init-Modal-Back')) {

    //초기 화면으로 이동
    hideAllModals()
    displayInit()
    console.log("초기화면으로이동")

  } else if (event.target.classList.contains('Init-Modal-Back-Sub')) {

    //로드 화면으로 이동
    hideAllModals()
    displayLoad()

    console.log("지갑로드화면으로이동")

  }
  else if (event.target.classList.contains('Select-Load-Private')) {

    //프라이빗키 화면으로 이동
    hideAllModals()
    displayLoadPrivate()
    console.log("프라이빗키화면으로이동")
  }
  else if (event.target.classList.contains('Select-Load-Mnemonic')) {

    //닉모닉로드화면으로 이동
    hideAllModals()
    displayLoadMnemonic()
    console.log("닉모닉화면으로이동")
  }
   else if (event.target.classList.contains('Login-Done')) {
     checkNetworkStatus({
         timeout: 3000,
         backUpURL: 'https://example.com',
         pingDomain: 'github.com',
         method: 'GET'
     }).then(function(result){
       if(!result){
         alert('인터넷 연결을 확인해주세요.')
       }else{
         var input = document.getElementById('login_userpassword')
         const userPassword = settings.get('userPassword')

         console.log(userPassword);
         var inputUserpassword = input.value
         var privatePassword = md5(inputUserpassword)

 console.log('입력값' + input.value);
 console.log('userPassword' + userPassword);
  console.log('privatePassword' + privatePassword);

         if(privatePassword === userPassword){
           ipcRenderer.send('update-walleteInfo')
           //메인화면으로 이동
           hideAllModalsAfterMain()
           console.log("Login-Done")
         }else{
           console.log("틀린비밀번호")
           input.value = "";
           alert("틀린비밀번호")
         }
       }
     });

  }
})


//모달 hide
function hideAllModals () {
  const modals = document.querySelectorAll('.modal.is-shown')
  Array.prototype.forEach.call(modals, (modal) => {
    modal.classList.remove('is-shown')
  })
}

function hideAllModalsAfterMain () {
  const modals = document.querySelectorAll('.modal.is-shown')
  Array.prototype.forEach.call(modals, (modal) => {
    modal.classList.remove('is-shown')
  })
  activateDefaultSection()
  showMainContent()
}

function showMainContent () {
  document.querySelector('.js-nav').classList.add('is-shown')
  document.querySelector('.js-content').classList.add('is-shown')
}


function handleSectionTrigger (event) {
  hideAllSectionsAndDeselectButtons()

  // Highlight clicked button and show view
  event.target.classList.add('is-selected')

  // Display the current section
  const sectionId = `${event.target.dataset.section}-section`
  document.getElementById(sectionId).classList.add('is-shown')

  // Save currently active button in localStorage
  // const buttonId = event.target.getAttribute('id')
  // settings.set('activeSectionButtonId', buttonId)
}

function activateDefaultSection () {
  document.getElementById('button-ipc').click()
}


function handleModalTrigger (event) {
  hideAllModalsAndMain()
  const modalId = `${event.target.dataset.modal}-modal`
  document.getElementById(modalId).classList.add('is-shown')
}



function hideAllSectionsAndDeselectButtons () {
  const sections = document.querySelectorAll('.js-section.is-shown')
  Array.prototype.forEach.call(sections, (section) => {
    section.classList.remove('is-shown')
  })

  const buttons = document.querySelectorAll('.nav-button.is-selected')
  Array.prototype.forEach.call(buttons, (button) => {
    button.classList.remove('is-selected')
  })
}

// 초기화면
function displayInit () {
  document.querySelector('#init-modal').classList.add('is-shown')
  console.log('load init.html');
}

// 지갑생성화면
function displayCreateWallet() {
  document.querySelector('#create-modal').classList.add('is-shown')
  console.log('load create_wallet.html');
}

// 불러오기 화면
function displayLoad () {
  document.querySelector('#load-modal').classList.add('is-shown')
  console.log('load select_load.html')
}

// 닉모닉으로 불러오기 화면
function displayLoadMnemonic () {
  document.querySelector('#load-mnemonic-modal').classList.add('is-shown')
  console.log('load load_mnemonic.html')
}

// 개인키로 불러오기 화면
function displayLoadPrivate () {
  document.querySelector('#load-private-modal').classList.add('is-shown')
  console.log('load load_private.html')
}

function displayLogin () {
  document.querySelector('#confirm-modal').classList.add('is-shown')
    console.log('load login.html')
}

function returnInitPage(){
  //초기 화면으로 이동
  hideAllModals()
  displayInit()
  console.log("init-modal-Back")

}

const userAddress = settings.get('userAddress')
const userPassword = settings.get('userPassword')
// settings.set('userAddress', '')
// settings.set('userPassword', '')

if (userAddress && userPassword) {
  displayLogin()
} else {
  displayInit()
}
