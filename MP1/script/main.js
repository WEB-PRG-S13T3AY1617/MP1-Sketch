function goToUser(userId){
    localStorage.setItem("userId", userId);
    window.location.assign("user.html");
}

function goToPhotos(){
    localStorage.removeItem("albumId");
    window.location.assign("photos.html");
}

function goToAlbum(albumId){
    localStorage.setItem("albumId", albumId);
    window.location.assign("photos.html");
}

$(document).ready(function () {
   
    $("#photosLink").click(function (evt){
        evt.preventDefault();
        goToPhotos();
    });
    
    $("#imageView #close").click(function (){
       $("#imageView").fadeOut(300);
    });
    
});