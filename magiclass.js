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
        $('#menu td').each(function(){
            var s = this.innerHTML;
            jQuery(this).click(function(){
                jQuery(this).css('backgroundColor', 'red').siblings('td').css('backgroundColor', 'white');
            });
        });
        $('body').css('direction', lang['direction']);
        $('#headline').html(lang['headline']);
        $("#mainMenu").html('asd');
    });
});
