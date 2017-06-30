var limit = 10;
var url = " https://jsonplaceholder.typicode.com/";
var postsTag = $("#posts");
var landing = $("#landing");

function viewPage(pageNum, length){

    var found = false;
    var startInd = (pageNum == 1) ? 5 : length * (pageNum - 1) + 5;
    limit += (pageNum - currPage) * length;
    
    
    currPage = pageNum;
    
    postsTag.empty();

    $(".pages").each(function(i, x) {
        $(x).children('li').each(function(i, y){
            if($(y).hasClass("selectedPage"))
                $(y).removeClass("selectedPage");
            
            if(parseInt($(y).text()) == pageNum)
                $(y).addClass("selectedPage");
        });
    });
    
     $.ajax({
        url: url + "posts",
        method: 'GET',
        dataType: 'json',
        success: function (posts){
            
            posts.reverse();
            
            $.each(posts, function(i){
                i = startInd + i;
                
                if(i <= limit){
                     $.ajax({
                        url: url + "users/" + posts[i].userId,
                        method: 'GET',
                        dataType: 'json',
                        success: function (user){
                            var title =  posts[i].title;
                            if(title.length > 30)
                                title = title.substring(0, 30) + "...";
                            
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
                                        "<div id='content'><p>" + posts[i].body  + "</p></div></div>";

                            postsTag.append(post);
                        }
                    });
                } 
            });
               
        }
            
    });
}

var pInd = 1;
function cycleThrough(){
    
    if(pInd > 4){
        pInd = 1;
        $("#landing > .post:nth-child(" + 4 + ")").removeClass("move");
    }else
        $("#landing > .post:nth-child(" + (pInd - 1) + ")").removeClass("move");

    $("#landing > .post:nth-child(" + pInd + ")").addClass("move");

    pInd++;
}

function checkIfFull(){
    if($("#landing > div").length >= 1)
        cycleThrough();
}

setInterval(checkIfFull, 6000);

$(document).ready(function () {
    
    var newsFeedTop = $("#newsFeed").offset().top;
    
    $("#postsLink").click(function (){
        $("body").animate({ scrollTop: newsFeedTop}, 700);
    });
    
    $.ajax({
        url: url + "posts",
        method: 'GET',
        dataType: 'json',
        success: function (posts){
            posts.reverse();
            
            var page = 1; 
            var size = posts.length;
            var pages = Math.ceil(size / limit);
            
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
                            viewPage($(z).text(), 6);
                        });
                    });
                });
            });
            ///////////////////////////////////////////
            
            $.each(posts, function(i){
                if(i <= limit){
                     $.ajax({
                        url: url + "users/" + posts[i].userId,
                        method: 'GET',
                        dataType: 'json',
                        success: function (user){
                            var title =  posts[i].title;
                            if(title.length > 30)
                                title = title.substring(0, 30) + "...";
                            
                            var post = "<div class='post " + ((i <= 4) ? "landingPost" : "") + "'>" +
                                            "<div id='header'>" +
                                                "<div id='img'>" +
                                                    "<img src='img/default_profile.png' alt='" + user.name + "'>" +
                                                "</div>" +
                                                "<div id='title'>" +
                                                    "<span class='post-title'>" + title + "</span>" +
                                                    "<span class='post-user'>By: <a href='#' onclick='goToUser(" + user.id + ")'>" + user.username + "</a></span>" +
                                                "</div>" +
                                            "</div>" +
                                        "<div id='content'><p>" + posts[i].body  + "</p></div></div>";

                            if(i <= 4)
                                landing.append(post);
                            else
                                postsTag.append(post);
                        }
                    });
                } 

            });
               
        }
            
    });

});