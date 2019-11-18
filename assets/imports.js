const links = document.querySelectorAll('link[rel="import"]')

// Import and add each page to the DOM
Array.prototype.forEach.call(links, (link) => {
  let template = link.import.querySelector('.task-template')
  let clone = document.importNode(template.content, true)
  if (link.href.match('init.html')) {
    document.querySelector('body').appendChild(clone)
  } else if (link.href.match('create_wallet.html')) {
    document.querySelector('body').appendChild(clone)
  } else if (link.href.match('select_load.html')) {
    document.querySelector('body').appendChild(clone)
  }else if (link.href.match('load_mnemonic.html')) {
    document.querySelector('body').appendChild(clone)
  } else if (link.href.match('load_private.html')) {
    document.querySelector('body').appendChild(clone)
  } else if (link.href.match('login.html')) {
    document.querySelector('body').appendChild(clone)
  } else {
    document.querySelector('.content').appendChild(clone)
  }
})
