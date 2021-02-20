var myImage = document.getElementById("myImage");
var imageChange = document.getElementById("changeImage");
var myName = document.getElementById("myName");
var mySurname = document.getElementById("mySurname");
var myBirth = document.getElementById("myBirth");
var myNat = document.getElementById("myNat");
var myCity = document.getElementById("myCity");
var myPhone = document.getElementById("myPhone");
var myBio = document.getElementById("myBio");

var submit = document.getElementById("saveSettings");

getUserSettings(myImage, myName, mySurname, myBirth, myNat, myCity, myPhone, myBio);

submit.addEventListener("click", function(){
    setUserSettings(myImage, myName, mySurname, myBirth, myNat, myCity, myPhone, myBio);
})

imageChange.addEventListener("click", function(e){
    setUserImage(myImage);
})