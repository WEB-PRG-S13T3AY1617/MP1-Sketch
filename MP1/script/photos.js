var limit = 15;
var currPage = 1;
var minPage = 1;
var pages;
var url = 'https://jsonplaceholder.typicode.com/';
var albumId = null;

$(document).ready(function () {

    albumId = localStorage.getItem("albumId");
    
    if(albumId != null)
        $.ajax({
            url: url + "albums/" + albumId,
            method: "GET",
            dataType: "json",
            success: function (data){
                $("#newsFeed #header").empty();
                $("#newsFeed #header").append(data.title);
            }
        });
    
    $.ajax({
        url: url + "photos",
        method: "GET",
        dataType: "json",
        success: function (data){
            var photos = [];
            
            $.each(data, function(i, photo){
               if(albumId == null)
                   photos.push(photo);
                else if(photo.albumId == albumId)
                    photos.push(photo);
            });
            
            photos.reverse();
            
            displayPhotos(photos);
            
        }
    })
    
    function displayPhotos(photos){
        pages = Math.ceil(photos.length / limit);
        maxPage = pages;
        if(maxPage > 10)
            maxPage = 10;
        minPage = 1;
        
        // handles the number of pages to be shown
        $(".pages").empty();
        currPage = 1;
        $(".pages").append("<li> <b>{</b> </li>");
        for(var i = minPage; i <= maxPage; i++){
            var link = $("<li><a>" + i + "</a></li>");

            $(".pages").append(link);
        }

        $(".pages").append("<li> <b>}</b> </li>");

        $(".pages").each(function(i, x) {
            $(x).children('li').eq(1).addClass("selectedPage");

            $(x).children('li').each(function(j, y){
                $(y).children('a').each(function(k, z){
                    $(z).click(function (e){
                        e.preventDefault();
                        viewPhotoPage(photos, $(z).text(), 15);
                    });
                });
            });
        });
        ///////////////////////////////////////////
        
        $.each(photos, function(i, photo){
           if(i < limit){
               $.ajax({
                   url: url + "albums/" + photo.albumId,
                   method: "GET",
                   dataType: "json",
                   success: function (album){
                       $.ajax({
                           url: url + "users/" + album.userId,
                           method: "GET",
                           dataType: "json",
                           success: function (user){
                               var photoPost = $("<div class='photoPost'><img src='" + photo.thumbnailUrl + "'/></div>");
                               $(photoPost).click(function (){
                                  viewPhoto(user, photo, album);
                               });
                               
                               $("#posts").append(photoPost);
                           }
                       })
                   }
               })
           } 
        });
    }
    
    function viewPhotoPage(photos, pageNum, length){
        var startInd = (pageNum == 1) ? 0 : length * (pageNum - 1);
        
        if(pages > 10){
            if(pageNum == maxPage){
                maxPage++;
                minPage++;
            }

            if(minPage == pageNum && pageNum != 1){
                minPage--;
                maxPage--;
            }

            if(maxPage > pages) maxPage = pages;
            if(minPage < 0) minPage = 1;

        }
        
        limit += (pageNum - currPage) * length;
        currPage = pageNum;
        $("#posts").empty();
        
        // handles the number of pages to be shown
        $(".pages").empty();
        $(".pages").append("<li> <b>{</b> </li>");
        for(var i = minPage; i <= maxPage; i++){
            var link = $("<li><a>" + i + "</a></li>");
            
            if(i == currPage)
                link.addClass("selectedPage");
            
            $(".pages").append(link);
        }

        $(".pages").append("<li> <b>}</b> </li>");

        $(".pages").each(function(i, x) {

            $(x).children('li').each(function(j, y){
                $(y).children('a').each(function(k, z){
                    $(z).click(function (e){
                        e.preventDefault();
                        viewPhotoPage(photos, $(z).text(), 15);
                    });
                });
            });
        });
        ///////////////////////////////////////////
        
        $.each(photos, function(i, photo){  
            i = startInd + i;
            
            if(i < limit){
                console.log(i);
               $.ajax({
                   url: url + "albums/" + photo.albumId,
                   method: "GET",
                   dataType: "json",
                   success: function (album){
                       $.ajax({
                           url: url + "users/" + album.userId,
                           method: "GET",
                           dataType: "json",
                           success: function (user){
                               var photoPost = $("<div class='photoPost'><img src='" + photo.thumbnailUrl + "'/></div>");
                               $(photoPost).click(function (){
                                  viewPhoto(user, photo, album);
                               });

                               $("#posts").append(photoPost);
                           }
                       });
                   }
               });
            } 
        });
    }
    
    function viewPhoto(user, photo, album){
        var userElem = $("<i class='username'>@" + user.username + "</i>");
        var albumElem = $("<i class='albumname'>" + album.title + "</i>");
        
        userElem.click(function(){
            goToUser(user.id);
        });
        
        albumElem.click(function(){
            goToAlbum(album.id);
        });
        
        $("#img").empty();
        $("#imageDetails #title").empty();
        $("#imageDetails #owner").empty();
        $("#imageDetails #album").empty();
        
        $("#imageDetails #title").append("Title: ");
        $("#imageDetails #album").append("Album: ");
        $("#imageDetails #owner").append("Owner: ");
        
        $("#img").append("<img src='" + photo.url + "'/>");
        $("#imageDetails #title").append("<i>" + photo.title + "</i>");
        $("#imageDetails #owner").append(userElem);
        $("#imageDetails #album").append(albumElem);
        $("#imageView").fadeIn(300);
    }
});