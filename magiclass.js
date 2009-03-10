// Globals
var jQuery = this.jQuery;
var $ = this.$;
var lang;
var lessons = [];
var classes = [];
var students = [];

function translate(dlang) {
    $.getScript(dlang + '.js', function() {
        if(lang.direction) {
            if(lang.direction == 'rtl') {
                $('head').append('<link id="rtlstyle" rel="stylesheet" type="text/css" href="rtl.css" />');
            } else {
                $('#rtlstyle').remove();
            }
        };
        $('.translate').each(function(){

                jQuery(this).text(lang[this.id] || this.id);
        });
    });
}

$(document).ready(function() {
    // Get language from location params in the form "lang=xx"
    var loc = document.location.href;
    var idx = loc.indexOf('?');
    var params = idx < 0 ? '' : loc.substr(++idx);
    params = params.split('&');
    for(idx in params) { if(params[idx].hasOwnProperty('0')) {
        var pair = params[idx].split('=');
        if(pair.length == 2 && pair[0] == 'lang') { lang = pair[1]; }
    }};
    translate(lang || 'en');

    // Load the data
    $.getScript('data.js', function() {
    });
});
