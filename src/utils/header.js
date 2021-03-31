import { main_header_style } from './constant.js'

export function gen_main_header() {

  // Header
  var header = document.getElementById('header')

  // Size of header
  header.style.width = main_header_style['width']
  header.style.height = main_header_style['height']

  // Color of header
  header.style.background = main_header_style['background']

  // Title
  var title = document.createElement('div')
  title.innerText = 'SkeleTricks'
  title.style.fontSize = main_header_style['title-font-size']
  title.style.marginLeft = main_header_style['title-margin']['left']
  title.style.marginRight = main_header_style['title-margin']['right']
  title.style.color = main_header_style['title-color']
  title.style.fontWeight = 'bold'
  title.style.display = 'inline-block'
  title.style.transform = 'translate(0px, 2px)'
  header.appendChild(title)

  // Subtitle
  var subtitle = document.createElement('div')
  subtitle.innerText = '- Understanding Adversarial Attacks on Human Action Recognition Models'
  subtitle.style.fontSize = main_header_style['subtitle-font-size']
  subtitle.style.marginLeft = main_header_style['subtitle-margin']['left']
  subtitle.style.marginRight = main_header_style['subtitle-margin']['right']
  subtitle.style.color = main_header_style['subtitle-color']
  subtitle.style.fontWeight = 'bold'
  subtitle.style.display = 'inline-block'
  header.appendChild(subtitle)

  // Youtuve
  // var youtube_link = document.createElement('div')
  // header.appendChild(youtube_link)
  // youtube_link.innerHTML = '<i class="fab fa-youtube"></i>'
  // youtube_link.id = 'youtube-link'
  // youtube_link.style.display = 'inline-flex'
  // youtube_link.style.float = 'right'
  // youtube_link.style.fontSize = '30px'
  // youtube_link.style.color = 'lightgray'
  // youtube_link.style.cursor = 'pointer'
  // youtube_link.style.transform = 'translate(-10px, 10px)'
  // youtube_link.onclick = function() {
  //   window.location = 'https://youtu.be/xgK9maDqhi4'
  //   return false;
  // }

  // // Arxiv
  // var pdf_link = document.createElement('div')
  // header.appendChild(pdf_link)
  // pdf_link.innerHTML = '<i class="fas fa-file-pdf"></i>'
  // pdf_link.id = 'pdf-link'
  // pdf_link.style.display = 'inline-flex'
  // pdf_link.style.float = 'right'
  // pdf_link.style.fontSize = '30px'
  // pdf_link.style.color = 'lightgray'
  // pdf_link.style.cursor = 'pointer'
  // pdf_link.style.transform = 'translate(-20px, 10px)'
  // pdf_link.onclick = function() {
  //   window.location = 'https://arxiv.org/abs/2101.10586'
  //   return false;
  // }
}

