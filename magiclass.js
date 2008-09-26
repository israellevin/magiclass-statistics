var lang;
var data;

function setData()
{
    var sin = [];
    for (var i = 0; i < 14; i += 0.5)
        sin.push([i, Math.sin(i)]);

    var d1 = {
        data: sin,
        label: 'sin with dots',
        points: {show: true},
        lines: {show: true},
      }
    var d2 = {data: [[0, 3], [4, 8], [8, 5], [9, 13]], label: 'bars', bars: {show: true}};
    data = [d1, d2];
}

function setPrezGraph()
{
    $.plot(
        $("#presentationsGraph"),
        data,
        {
            selection: {
                mode: "x",
            },
        }
    );

    $('#presentationsGraph').resizable({
		minWidth: 100,
		minHeight: 100,
        knobHandles: true,
        autoHide: true,
        stop: function(){
            $('#presentationsGraph').resizable('destroy');
            setPrezGraph();
        },
	});
}

$(document).ready(function(){

    setData();
    setPrezGraph();

    var placeholder = $('#presentationsGraph');
    placeholder.bind("plotselected", function (event, ranges){
        alert(1);
/*        $("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));
        plot = $.plot(placeholder, data,
        $.extend(true, {}, options, {
            xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
        }));*/
    });

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
