// Globals
var jQuery = this.jQuery;
var $ = this.$;
var lang;
var lessons = [];
var classes = [];
var students = [];

// Helper functions
function rnd(max) { return Math.floor(Math.random() * max) }
function mkDate() {
    var d = new Date();
    d.setDate(d.getDate() - rnd(5));
    return d;
}

// Attendance data
var attendance = {
    full: [],
    byStud: [],
    current: new Date(),
    semStart: new Date(2008, 8, 1),
    name: false
};

attendance.push = function(line) {
    var aIdx = this.full.push(line);
    var sIdx = line['student'];
    if(this.byStud.hasOwnProperty(sIdx)) {
        this.byStud[sIdx].push(this.full[aIdx - 1]);
    } else {
        this.byStud[sIdx] = [this.full[aIdx - 1]];
    }
};

attendance.xhtmlize = function() {
    var xhtml = '';
    var idx = 0;
    jQuery.each(this.byStud, function(key, val) {
        var student = students[key];
        var idn = student.id;
        var i = $('#idNumInp').val();
        if((i.length > 2) && (idn.indexOf(i) == -1)) return true;
        var name = student.name;
        var i = $('#studNameInp').val().toLowerCase();
        if((i.length > 2) && (name.toLowerCase().indexOf(i) == -1)) return true;
        var missAt = [];
        var missSince = [];
        jQuery.each(this, function(key, val) {
            if(this.date >= attendance.semStart) {
                missSince.push(this);
                if((attendance.current - this.date < 1000 * 60 * 60 * 24) && (attendance.current.getDate() == this.date.getDate())) {
                    missAt.push(this);
                }
            }
        });

        xhtml += '<tr' + (idx % 2 == 0 ? ' class="altRow"' : '') + '><td>' + (++idx) + '</td><td>' + idn + '</td><td>' + name + '</td><td>' + missAt.length + '</td><td>' + missSince.length + '</td>';
        });
    $('#data tbody').html(xhtml);
};

function translate(dlang, callback) {
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

        // Save dates
        var missAtDate = $('#missAtInp').datepicker('getDate');
        var missSinceDate = $('#missSinceInp').datepicker('getDate');

        // Date picker config
        $('.datepicker').datepicker('setDate').datepicker(
            'option', 'dateFormat',
            lang['dateFormat'] || 'mm/dd/yy'
        ).datepicker(
            'option', 'dayNamesMin',
            lang['days'] || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        ).datepicker(
            'option', 'firstDay',
            ((lang['firstDay'] && parseInt(lang['firstDay'])) || 2) - 1
        ).datepicker(
            'option', 'isRTL',
            (lang['direction'] && lang['direction'] == 'rtl') ? true : false
        ).datepicker(
            'option', 'monthNamesShort',
            lang['months'] || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        ).datepicker(
            'option', 'nextText',
            lang['next'] || 'next'
        ).datepicker(
            'option', 'prevText',
            lang['prev'] || 'prev'
        ).datepicker(
            'option', 'firstDay',
            ((lang['firstDay'] && parseInt(lang['firstDay'])) || 2) - 1
        ).filter('#missAtInp').datepicker(
            'setDate', missAtDate
        ).end().filter('#missSinceInp').datepicker(
            'setDate', missSinceDate
        );

        if(callback) callback();
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

    // Bind date pickers
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        duration: 'fast',
        maxDate: 0,
        showButtonPanel: true,
        onSelect: function(str, dat) {
            if(this.id == 'missAtInp') {
                attendance.current = new Date(dat.currentYear, dat.currentMonth, dat.currentDay); 
            } else if (this.id == 'missSinceInp') {
                attendance.semStart = new Date(dat.currentYear, dat.currentMonth, dat.currentDay); 
            }
            attendance.xhtmlize();
    }}).filter('#missAtInp').datepicker('setDate', attendance.current).end().filter('#missSinceInp').datepicker('setDate', attendance.semStart);


    // Bind inputs
    $('input:text').keyup(function(e) {
        switch(this.id) {
            case 'idNumInp':
                if(e.which > 64 && e.which < 91) return false;
                if(this.value.length > 9) return false;
                break;
        }
        attendance.xhtmlize();
    });

    translate(lang || 'en', function() {
        // Load the data
        $.getScript('data.js', function() {
            attendance.xhtmlize();
        });
    });
});
