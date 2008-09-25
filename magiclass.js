var lang;
var data;

function setData()
{
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);
    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
    data = [d1, d2, d3];
}

function setResizables()
{
    $('#attendanceGraph').resizable({
		minWidth: 100,
		minHeight: 100,
        knobHandles: true,
        autoHide: true,
        stop: function(){
            $.plot($("#attendanceGraph"), data);
            $('#attendanceGraph').resizable('destroy');
            setResizables();
        },
	});
}

$(document).ready(function(){

    setData();

    $.plot($("#attendanceGraph"), data);

    setResizables();


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
    });
});
