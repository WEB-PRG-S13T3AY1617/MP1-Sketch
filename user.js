var limit = 4;
var url = " https://jsonplaceholder.typicode.com/";

$(document).ready(function () {
    var userId = localStorage.getItem("userId");
    var page = 1;
    var pages = 0;
    var currPage = 1;
    
    if(userId == null) 
       userId = 1;
    
    $.ajax({
        url: url + "users/" + userId,
        method: "GET",
        dataType: "json",
        success: function (data){
            $("#userName").append("<span>" + data.name + "</span><span class='username'>@" + data.username + "</span>");
            $("#email").append("<i> " + data.email + "</i>");
            $("#phone").append("<i> " + data.phone + "</i>");
            $("#website").append("<i> " + data.website + "</i>");
            
            $("#cname").append("<i> " + data.company.name + "</i>");
            $("#cphrase").append("<i> " + data.company.catchPhrase + "</i>");
            $("#cbs").append("<i> " + data.company.bs + "</i>");
            
            $("#address").append("<i> " + data.address.street + ", " + data.address.suite + ", " + data.address.city + ", " + data.address.zipcode + " </i>");
        }
    });
    
    $.ajax({
        url: url + "posts",
        method: "GET",
        dataTyp: 'json',
        success: function (data){
            var postsById = [];
            data.reverse();
            
            $.each(data, function(i, x){
               if(x.userId == userId)
                   postsById.push(x);
            });
            
            displayPosts(postsById);
        }
    });
    
    function viewPage(postsById, pageNum, length){
        var startInd = (pageNum == 1) ? 0 : length * (pageNum - 1);
        limit += (pageNum - currPage) * length;
        currPage = pageNum;
        
        $("#posts").empty();
        
        $(".pages").each(function(i, x) {
            $(x).children('li').each(function(i, y){
                if($(y).hasClass("selectedPage"))
                    $(y).removeClass("selectedPage");

                if(parseInt($(y).text()) == pageNum)
                    $(y).addClass("selectedPage");
            });
        });
        
        $.each(postsById, function (i, x){
            i = startInd + i;
            if(i < limit && i < postsById.length){
                var title =  postsById[i].title;
                if(title.length > 30)
                    title = title.substring(0, 30) + "...";

                $.ajax({
                    url: url + "users/" + userId,
                    method: "GET",
                    dataType: "json",
                    success: function (user){
                        var post = "<div class='post'>" +
                                "<div id='header'>" +
                                    "<div id='img'>" +
                                        "<img src='img/default_profile.png' alt='" + user.name + "'>" +
                                    "</div>" +
                                    "<div id='title'>" +
                                        "<span class='post-title'>" + title + "</span>" +
                                        "<span class='post-user'>By: <a href='#' onclick='goToUser(" + user.id + ")'>" + user.username + "</a></span>" +
                                    "</div>" +
                                "</div>" +
                            "<div id='content'><p>" + postsById[i].body  + "</p></div></div>";

                        $("#posts").append(post);
                    }
                });
            }
        });
    }
    
    function displayPosts(postsById){
        pages = Math.ceil(postsById.length / limit);
        
        // handles the number of pages to be shown
            $(".pages").empty();
            currPage = 1;
            $(".pages").append("<li> <b>{</b> </li>");
            for(var i = 1; i <= pages; i++){
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
                            viewPage(postsById, $(z).text(), 4);
                        });
                    });
                });
            });
            ///////////////////////////////////////////
        
        
            $.each(postsById, function (i, post){
                if(i < limit){
                    var title =  postsById[i].title;
                    if(title.length > 30)
                        title = title.substring(0, 30) + "...";

                    $.ajax({
                        url: url + "users/" + userId,
                        method: "GET",
                        dataType: "json",
                        success: function (user){
                            var post = "<div class='post'>" +
                                    "<div id='header'>" +
                                        "<div id='img'>" +
                                            "<img src='img/default_profile.png' alt='" + user.name + "'>" +
                                        "</div>" +
                                        "<div id='title'>" +
                                            "<span class='post-title'>" + title + "</span>" +
                                            "<span class='post-user'>By: <a href='#' onclick='goToUser(" + user.id + ")'>" + user.username + "</a></span>" +
                                        "</div>" +
                                    "</div>" +
                                "<div id='content'><p>" + postsById[i].body  + "</p></div></div>";

                            $("#posts").append(post);
                        }
                    });
                }
            });
        
    }
});