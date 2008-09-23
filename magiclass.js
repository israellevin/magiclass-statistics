var lang;
var action;

$(document).ready(function(){
    action = ['', ''];
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
        $('#menu td').each(function(){
            var s = this.innerHTML;
            jQuery(this).addClass(s).click(function(){
                var curJ = jQuery(this);
                if(curJ.attr('class').substr(0, 2) == 'by'){
                    action = [action[0], curJ];
                }else{
                    action = [curJ, action[1]];
                }
                    $('#types td').css('backgroundColor', 'blue');
                    action = [s, action[1]];
                } else if(curJ.hasClass('bys')){
                    $('#byd td').css('backgroundColor', 'blue');
                    action = [action[0], s];
                }
                curJ.css('backgroundColor', 'red');
            });
        });
        $('body').css('direction', lang['direction']);
        $('#headline').html(lang['headline']);
        $("#mainMenu").html('asd');
/*
    var data = [];
    for(var i = 0; i < 334; i += 5)
        data.push([i, i * i]);
    data = [data];

    $.plot($("#placeholder"), data);
*/
    });
});
