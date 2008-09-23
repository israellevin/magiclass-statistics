var lang;

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
        $('body').css('direction', lang['direction']);
        $('#tabMenu a').each(function(){
            var curJ = jQuery(this);
            var s = curJ.attr('href').substr(1);
            curJ.children('span').text(lang[s]);
        });
        $('#tabMenu > ul').tabs();
        if(lang['direction'] == 'rtl'){
            $('.ui-tabs-nav').css('float', 'right');
        }
            /*
            jQuery(this).click(function(){
                jQuery(this).css('backgroundColor', 'red').siblings('td').css('backgroundColor', 'white');
            });
        });
        $('#headline').html(lang['headline']);
        $("#mainMenu").html('asd');*/
    });
});
