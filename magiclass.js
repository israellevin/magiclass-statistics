var lang;
var menu;

function initMenu()
{
    menu = {
        'attendance': {
            'byDate': {},
            'byLesson': {},
            'byClass': {},
            'byStudent': {},
        },
        'presentation': {},
        'test': {},
        'feedback': {},
    };
}

function getMenu(loc){
    loc = loc ? loc.split('.') : ' ';
    jQuery.each(loc, function(){
        alert(this);
    });
}

$(document).ready(function(){
    // Get language from location params in the form "lang=xx"
    var loc = document.location.href;
    var idx = loc.indexOf('?');
    var params = idx < 0 ? '' : loc.substr(++idx);
    params = params.split('&');
    for(idx in params){
        var pair = params[idx].split('=');
        if(pair.length == 2 && pair[0] == 'lang') lang = pair[1];
    }

    // Load the language file
    $.getScript((lang || 'en') + '.js', function(){
        $('body').css('direction', lang.direction);
        $('#headline').html(lang.headline);
        $("#mainMenu").html('asd');

        initMenu();
        getMenu();
/*
    var data = [];
    for(var i = 0; i < 334; i += 5)
        data.push([i, i * i]);
    data = [data];

    $.plot($("#placeholder"), data);
*/
});
