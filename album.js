var userId;
var albumLimit = 4;
var albumPages, albumPage, albumCurrPage;

$(document).ready(function (){
    userId = localStorage.getItem("userId");
    
    if(userId == null) 
       userId = 1;
    
    $.ajax({
        url: url + "albums",
        method: "GET",
        dataType: "json",
        success: function (data){
            var albums = [];
            
            $.each(data, function (i, album){
               if(album.userId == userId)
                   albums.push(album);
               
            });
            
            displayAlbums(albums);
        }
    })
    
    function displayAlbums(albums){
        albumPages = Math.ceil(albums.length / albumLimit);
        albumPage = 1;
        albumCurrPage = 1;

        // handles the number of pages to be shown
            $(".albumPages").empty();
            currPage = 1;
            $(".albumPages").append("<li> <b>{</b> </li>");
            for(var i = 1; i <= albumPages; i++){
                var link = $("<li><a>" + i + "</a></li>");
                
                $(".albumPages").append(link);
            }
            $(".albumPages").append("<li> <b>}</b> </li>");
            
            $(".albumPages").each(function(i, x) {
                $(x).children('li').eq(1).addClass("selectedPage");
                
                $(x).children('li').each(function(j, y){
                    $(y).children('a').each(function(k, z){
                        $(z).click(function (e){
                            e.preventDefault();
                            viewAlbumPage(albums, $(z).text(), 4);
                        });
                    });
                });
            });
            ///////////////////////////////////////////
        
        $.each(albums, function(i, album){
            var x = 0;
            var albumPost = $("<div id='albumPost'></div>");
            var albumTitle = $("<div class='albumTitle'>" + album.title + "</div>");
            
            albumTitle.click(function(){
                goToAlbum(album.id);    
            });
            
            albumPost.append(albumTitle);
            
            if(i < albumLimit){
               $.ajax({
                   url: url + "photos/",
                   method: "GET",
                   dataType: "json",
                   success: function (data){
                       $.each(data, function(i, photo){
                          if(photo.albumId == album.id && x < 5){
                              var photoPost = $("<div class='albumPhoto'><img src='" + photo.thumbnailUrl + "'></div>");
                              photoPost.on("click", function(){
                                  viewPhoto(photo, album);
                              })
                              albumPost.append(photoPost);
                              x++;
                          } 
                       });
                   }
               });
               
               $("#albumPosts").append(albumPost);
           }
            
            
        });
    }
    
    function viewAlbumPage(albums, pageNum, length){
        var startInd = (pageNum == 1) ? 0 : length * (pageNum - 1);
        albumLimit += (pageNum - albumCurrPage) * length;
        albumCurrPage = pageNum;
        
        $("#albumPosts").empty();
        
        $(".albumPages").each(function(i, x) {
            $(x).children('li').each(function(i, y){
                if($(y).hasClass("selectedPage"))
                    $(y).removeClass("selectedPage");

                if(parseInt($(y).text()) == pageNum)
                    $(y).addClass("selectedPage");
            });
        });
        
        $.each(albums, function (i, album){
            i = startInd + i;
            
            if(i < albumLimit && i < albums.length){
                var x = 0;
                var albumPost = $("<div id='albumPost'></div>");
                var albumTitle = $("<div class='albumTitle'>" + albums[i].title + "</div>");

                albumTitle.click(function(){
                    goToAlbum(albums[i].id);    
                });

                albumPost.append(albumTitle);
                
               $.ajax({
                   url: url + "photos/",
                   method: "GET",
                   dataType: "json",
                   success: function (data){
                       $.each(data, function(z, photo){
                          if(photo.albumId == albums[i].id && x < 5){
                              var photoPost = $("<div class='albumPhoto'><img src='" + photo.thumbnailUrl + "'></div>");
                              photoPost.on("click", function(){
                                  viewPhoto(photo, albums[i]);
                              })
                              albumPost.append(photoPost);
                              x++;
                          } 
                       });
                   }
               });
               
               $("#albumPosts").append(albumPost);
           }
        });
    }
    
    function viewPhoto(photo, album){
        $.ajax({
            url: url + "users/" + userId,
            method: "GET",
            dataType: "json",
            success: function (user){
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
        })
    }
    
});