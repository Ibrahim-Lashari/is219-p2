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

// Every few seconds, the photo with the class of .thumbnail will switch to the next photo in its array
function swapPhoto() {
  if (mCurrentIndex >= mExtra.length) {
    mCurrentIndex = 0;
  }
  if (mCurrentIndex < 0) {
    mCurrentIndex = mExtra.length - 1;
  }
  //Add code here to access the #slideShow element.
  //Access the img element and replace its source
  //with a new image from your images array which is loaded
  //from the JSON string
  var photoElement = document.getElementById("photo");
  photoElement.src = mExtra[mCurrentIndex].imgPath;
  let locationElement = document.getElementsByClassName("location")[0];
  let descriptionElement = document.getElementsByClassName("description")[0];
  let dateElement = document.getElementsByClassName("date")[0];
  descriptionElement.innerHTML = "Description: " + mExtra[mCurrentIndex].description;
  locationElement.innerHTML = "Location: " + mExtra[mCurrentIndex].location;
  dateElement.innerHTML = "Date: " + mExtra[mCurrentIndex].date;
  let mLastFrameTime = 0;
  mCurrentIndex += 1;
  console.log("swap photo");
}


function iterateJSON(mJson) {
  for (var i = 0; i < mJson.extra.length; i++) {
    mExtra[i] = new GalleryImage();
    mExtra[i].imgPath = mJson.extra[i].imgPath;
    mExtra[i].location = mJson.extra[i].imgLocation;
    mExtra[i].description = mJson.extra[i].description;
    mExtra[i].date = mJson.extra[i].date;
  }
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mExtra = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "extra.json";

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
  return function (e) {
    galleryImage.img = e.target;
    mExtra.push(galleryImage);
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

  // This is what moves the next arrow to the right side of the screen
  $('#nextPhoto').position({
    my: 'right',
    at: 'right',
    of: '#nav'
  });

  // When you press the next arrow, it will go to the next image
  $("#nextPhoto").on("click", function () {
    swapPhoto()
  });
  
  // When you press the previous arrow, it will go to the previous image
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

// After the basic html and css of the page loads, the javascript functions will be called and loaded
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