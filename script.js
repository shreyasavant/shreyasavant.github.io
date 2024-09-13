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
        document.getElementById('theme-style').href='stylesheets/default.css'
    }
    if(mode == 'dark'){
        document.getElementById('theme-style').href='stylesheets/dark.css'
    }
    if(mode == 'green'){
        document.getElementById('theme-style').href='stylesheets/green.css'
    }
    if(mode == 'purple'){
        document.getElementById('theme-style').href='stylesheets/purple.css'
    }
    localStorage.setItem('theme', mode)
}

// function myFunction() {
//     var dots = document.getElementById("dots");
//     var moreText = document.getElementById("more");
//     var btnText = document.getElementById("myBtn");
  
//     if (dots.style.display === "none") {
//       dots.style.display = "inline";
//       btnText.innerHTML = "Read more";
//       moreText.style.display = "none";
//     } else {
//       dots.style.display = "none";
//       btnText.innerHTML = "Read less";
//       moreText.style.display = "inline";
//     }
//   }


// Select all the "Read More" buttons
const readMoreButtons = document.querySelectorAll('.read-more-btn');

// Add click event listeners to each button
readMoreButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Get the parent job section
    const jobPreview = button.closest('.post-preview');

    // Find the corresponding dots and more content within the same section
    const dots = jobPreview.querySelector('.dots');
    const moreContent = jobPreview.querySelector('.more');

    // Toggle visibility of dots and extra content
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      moreContent.style.display = "none";
      button.textContent = "Read more";
    } else {
      dots.style.display = "none";
      moreContent.style.display = "inline";
      button.textContent = "Read less";
    }
  });
});