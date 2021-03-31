export function gen_bottom() {
  // Append bottom div
  var body = document.getElementsByTagName('body')
  var bottom = document.createElement('div')
  bottom.id = 'bottom-div'
  bottom.style.marginTop = '100px'
  body[0].appendChild(bottom)
 
  // Abstract
  var abstract = document.createElement('div')
  var abstract_title = document.createElement('div')
  var abstract_text = document.createElement('div')
  bottom.appendChild(abstract)
  abstract.appendChild(abstract_title)
  abstract.appendChild(abstract_text)
  abstract.style.marginBottom = '50px'
  abstract_title.style.marginLeft = '30px'
  abstract_title.style.fontSize = '25px'
  abstract_title.style.fontWeight = 'bold'
  abstract_text.style.marginLeft = '30px'
  abstract_text.style.marginRight = '30px'
  abstract_text.style.fontSize = '18px'
  abstract_text.style.textAlign = 'justify'
  abstract_title.innerText = 'Abstract'
  abstract_text.innerText = 'Skeleton-based human action recognition technologies are increasingly \
  used in video based applications, such as home robotics, healthcare on aging population, \
  and surveillance. However, such models are vulnerable to adversarial attacks, \
  raising serious concerns for their use in safety-critical applications. \
  To develop an effective defense against attacks, it is essential to understand how \
  such attacks mislead the pose detection models into making incorrect predictions. \
  We present SkeletonVis, the first interactive system that visualizes how the attacks work \
  on the models to enhance human understanding of attacks.'

  // Paper
  var paper = document.createElement('div')
  var paper_title = document.createElement('div')
  var paper_text = document.createElement('div')
  bottom.appendChild(paper)
  paper.appendChild(paper_title)
  paper.appendChild(paper_text)
  paper_title.style.marginLeft = '30px'
  paper_title.style.fontSize = '25px'
  paper_title.style.fontWeight = 'bold'
  paper_text.style.marginLeft = '30px'
  paper_text.style.marginRight = '30px'
  paper_text.style.fontSize = '18px'
  paper_text.style.textAlign = 'justify'
  paper_title.innerText = 'Paper'
  paper_text.innerHTML = 
  '<p> \
    SkeletonVis: Interactive Visualization for Understanding Adversarial Attacks on Human Action Recognition Models <br> \
    <a href="https://haekyu.com">Haekyu Park</a>, \
    <a href="https://zijie.wang/">Zijie J. Wang</a>, \
    <a href="http://nilakshdas.com/">Nilaksh Das</a>, \
    Anindya S. Paul, \
    Pruthvi Perumalla, \
    Zhiyan Zhou, \
    <a href="https://www.cc.gatech.edu/~dchau/">Duen Horng (Polo) Chau</a> <br> \
    </p>\
    <a href="https://aaai.org/Conferences/AAAI-21/">AAAI</a>, Demo, Virtual, 2021 <br>\
    <a href="https://arxiv.org/abs/2101.10586">[PDF]</a>\
    <a href="https://youtu.be/xgK9maDqhi4">[Video]</a>\
    <div id="bibtex-button" type="button" class="collapsible">[BibTex]</div> \
    <pre id="bibtex" class="content">\
    @article{park2021skeletonvis,<br>\
      title={SkeletonVis: Interactive Visualization for Understanding Adversarial Attacks on Human Action Recognition Models},<br>\
      author={Park, Haekyu and Wang, Zijie J. and Das, Nilaksh and Paul, Anindya S. and Perumalla, Pruthvi and Zhou, Zhiyan and Chau, Duen Horng},<br>\
      booktitle={AAAI, Demo},<br>\
      year={2021}<br>\
    }\
    </pre>\
    <br><br><br><br>\
  '
  
  var bibtex_button = document.getElementById('bibtex-button')
  bibtex_button.onclick = function() {
    var bibtex = document.getElementById('bibtex')
    if (bibtex.style.display == 'block') {
      bibtex.style.display = 'none'
    } else {
      bibtex.style.display = 'block'
    }
  }
}