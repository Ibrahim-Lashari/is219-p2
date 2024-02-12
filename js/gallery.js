// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (/* function */ callback, /* DOMElement */ element) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
  requestAnimFrame(animate);
  var currentTime = new Date().getTime();
  if (mLastFrameTime === 0) {
    mLastFrameTime = currentTime;
  }

  if (currentTime - mLastFrameTime > mWaitTime) {
    swapPhoto();
    mLastFrameTime = currentTime;
  }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
  if (mCurrentIndex >= mImages.length) {
    mCurrentIndex = 0;
  }
  if (mCurrentIndex < 0) {
    mCurrentIndex = mImages.length - 1;
  }
  //Add code here to access the #slideShow element.
  //Access the img element and replace its source
  //with a new image from your images array which is loaded
  //from the JSON string
  var photoElement = document.getElementById("photo");
  photoElement.src = mImages[mCurrentIndex].imgPath;
  let locationElement = document.getElementsByClassName("location")[0];
  let descriptionElement = document.getElementsByClassName("description")[0];
  let dateElement = document.getElementsByClassName("date")[0];
  descriptionElement.innerHTML = "Description: " + mImages[mCurrentIndex].description;
  locationElement.innerHTML = "Location: " + mImages[mCurrentIndex].location;
  dateElement.innerHTML = "Date: " + mImages[mCurrentIndex].date;
  let mLastFrameTime = 0;
  mCurrentIndex += 1;
  console.log("swap photo");
}

function iterateJSON(mJson) {
  for (var i = 0; i < mJson.images.length; i++) {
    mImages[i] = new GalleryImage();
    mImages[i].imgPath = mJson.images[i].imgPath;
    mImages[i].location = mJson.images[i].imgLocation;
    mImages[i].description = mJson.images[i].description;
    mImages[i].date = mJson.images[i].date;
  }
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "images.json";

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
  return function (e) {
    galleryImage.img = e.target;
    mImages.push(galleryImage);
  };
}

$(document).ready(function () {
  // This initially hides the photos' metadata information
  //$(".details").eq(0).hide();
  $(".moreIndicator").on("click", function () {
    if ($(".moreIndicator").hasClass("rot90")){
      $(".moreIndicator").removeClass('rot90').addClass("rot270")
    } else{
      $(".moreIndicator").removeClass("rot270").addClass("rot90")
    }
  
  
    $('.details').slideToggle();
   
  });  

  $('#nextPhoto').position({
    my: 'right',
    at: 'right',
    of: '#nav'
  });

  $("#nextPhoto").on("click", function () {
    swapPhoto()
  });
  
  
  $("#prevPhoto").on("click", function () {
    mCurrentIndex = mCurrentIndex - 2;
    swapPhoto()
  });
  
 



  fetchJSON();
});

window.addEventListener(
  "load",
  function () {
    console.log("window loaded");
  },
  false
);

function GalleryImage() {
  //implement me as an object to hold the following data about an image:
  //1. location where photo was taken
  var location;
  //2. description of photo
  var description;
  //3. the date when the photo was taken
  var date;
  //4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
  var img;
}

function fetchJSON() {
  mRequest.onreadystatechange = () => {
    if (mRequest.readyState == 4 && mRequest.status == 200) {
      let mJson = JSON.parse(mRequest.responseText);
      console.log("work :)");
      iterateJSON(mJson);
    } else {
      console.log("no work :(");
    }
  };
  mRequest.open("GET", mUrl);
  mRequest.send();
}