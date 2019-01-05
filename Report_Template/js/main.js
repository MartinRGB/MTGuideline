//{autoslide: 5000} 

window.ws = new WebSlides();

function startSlides(){
  window.ws.goToSlide(1)
}


function playVideo(clicked_id){
  if(clicked_id.id == 'playBtn'){

    if(clicked_id.nextSibling.nextSibling.paused){
      clicked_id.nextSibling.nextSibling.play()
      clicked_id.style.background = "url(./svg/pause.svg)";
    }
    else{
      clicked_id.nextSibling.nextSibling.pause()
      clicked_id.style.background = "url(./svg/play.svg)";
    }
  }
  else{
    if(clicked_id.paused){
      clicked_id.play()
      clicked_id.previousSibling.previousSibling.style.background = "url(./svg/pause.svg)";
    }
    else{
      clicked_id.pause()
      clicked_id.previousSibling.previousSibling.style.background = "url(./svg/play.svg)";
    }
  }

}

document.getElementById('startFix0').addEventListener('loadedmetadata',function(){
  this.currentTime = 2;
},false);

document.getElementById('startFix1').addEventListener('loadedmetadata',function(){
  this.currentTime = 1.2;
},false);

document.getElementById('startFix2').addEventListener('loadedmetadata',function(){
  this.currentTime = 2;
},false);