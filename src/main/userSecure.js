// const {app, ipcMain, BrowserWindow} = require('electron')
// const QuickEncrypt = require('quick-encrypt')
//
// ipcMain.on('set-secure-privatekey', function(event, paramPrivatekey){
//   // event.sender.send('update-walleteInfo-response');
//
//   let keys = QuickEncrypt.generate(1024) // Use either 2048 bits or 1024 bits.
//   console.log(keys) // Generated Public Key and Private Key pair
//   let publicKey = keys.public
//   let privateKey = keys.private
//
//   // --- Encrypt using public key ---
//   let encryptedText = QuickEncrypt.encrypt(backup_userpassword, publicKey )
//   console.log(encryptedText) // This will print out the ENCRYPTED text, for example : " 01c066e00c660aabadfc320621d9c3ac25ccf2e4c29e8bf4c...... "
//
//   // --- Decrypt using private key ---
//   let decryptedText = QuickEncrypt.decrypt( encryptedText, privateKey)
//   console.log(decryptedText) // This will print out the DECRYPTED text, which is " This is some super top secret text! "
// })
