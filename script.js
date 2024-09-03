console.log('I love js!!!')

let theme = localStorage.getItem('theme')

if (theme == null){
    setTheme('light')
}else {
    setTheme(theme)
}

let themeDots = document.getElementsByClassName('theme-dot')

for (var i=0; themeDots.length > i; i++){

    themeDots[i].addEventListener('click', function(){
        let mode = this.dataset.mode
        console.log('Option Clicked: ', mode)
        setTheme(mode)
    })

}

function setTheme(mode){
    if(mode == 'light'){
        document.getElementById('theme-style').href='default.css'
    }
    if(mode == 'dark'){
        document.getElementById('theme-style').href='dark.css'
    }
    if(mode == 'green'){
        document.getElementById('theme-style').href='green.css'
    }
    if(mode == 'purple'){
        document.getElementById('theme-style').href='purple.css'
    }
    localStorage.setItem('theme', mode)
}

function myFunction() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  }