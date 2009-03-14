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
    var d;
    if(rnd(90) == 0) d = new Date(2008, 9, 19);
    else {
        d = new Date();
        d.setDate(d.getDate() - rnd(180));
    }
    return d;
}
function pad(n) { n = n.toString(); return n.length == 1 ? '0' + n : n; }

// Attendance data
var attendance = {
    full: [],
    byStud: [],
    current: new Date(),
    semStart: new Date(2008, 8, 1),
    name: false,
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
    jQuery.each(this.byStud, function(key, val) {
        var student = students[key];
        var idn = student.id;
        var i = $('#idNumInp').val();
        if((i.length > 0) && (idn.indexOf(i) == -1)) return true;
        var name = student.name;
        var i = $('#studNameInp').val().toLowerCase();
        if((i.length > 0) && (name.toLowerCase().indexOf(i) == -1)) return true;
        var missAt = [];
        var missSince = [];
        jQuery.each(this, function(key, val) {
            if(this.date >= attendance.semStart) missSince.push(this);
            if((attendance.current - this.date < 1000 * 60 * 60 * 24) && (attendance.current.getDate() == this.date.getDate())) missAt.push(this);
        });

        if(missAt.length > 0) {
            xhtml += '<tr><td></td><td>' + idn + '</td><td>' + name + '</td><td>' + missAt.length + '</td><td>' + missSince.length + '<p style="display: none;"><span style="font-weight: bold;">' + name + '</span><br/>';
            jQuery.each(missSince.slice(0, 10), function(key, val) {
                xhtml += pad(val.date.getMonth() + 1) + '/' + pad(val.date.getDate() + 1) + ' - ' + lessons[val.lesson] + '<br/>';
            });
            xhtml += '</p></td></tr>';
        }
    });
    $('table.dTable tbody').html(xhtml);

    // Fix table sorter
    $('table.dTable').trigger('update');
    if($('table.dTable tr:visible').length > 2) $('table.dTable').trigger('sorton', false); 

    // Hilite tr
    $('table.dTable tbody tr').hover(function(e) {
        jQuery(this).find('td').css('color', 'red');
    }, function() {
        jQuery(this).find('td').css('color', 'black');

    // Bind tooltips
    }).each(function() {
        jQuery(this).find('td').eq(4).hover(function(e) {
            var t = jQuery(this).find('p').html();
            $('body').append('<p id="tooltip">' + t + '</p>');
            $('#tooltip')
                .css('top',(e.pageY - 10) + 'px')
                .css('left',(e.pageX + 10) + 'px')
                .fadeIn('slow');		
        }, function(e) {
            $('#tooltip').remove();
        }).mousemove(function(e) {
    		$('#tooltip').css('top',(e.pageY - 10) + 'px').css('left',(e.pageX + 10) + 'px');
        });
    });
};

function fitToWin() {
    var winH = $('body').innerHeight();
    var winW = $('body').innerWidth();
    $('div#tabs').height(winH - 30);
    $('div#tabs').width(winW - 22);
    var tbodO = $('table.dTable tbody').offset()['top'];
    var footH = $('#footer').height();
    $('table.dTable tbody').css('height',  (winH - tbodO - footH - 20) + 'px');
    /*
    var height = $('#footer').offset()['top'] - top;
    $('table.dTable tbody').css('height',  (height - ofst) + 'px');
    $('div#data').css('height',  height + 'px');
    var footO = $('#footer').offset()['top'];
    */
}

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

    $('#tabs').tabs();

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
    $('input:text').keydown(function(e) {
        switch(this.id) {
            case 'idNumInp':
                if((e.which > 64 && e.which < 91) || e.which < 1) return false;
                break;
        }
    }).keyup(function(e) {
        switch(this.id) {
            case 'idNumInp':
                if(this.value.length > 9) this.value = this.value.substring(0, 9);
                break;
        }
        attendance.xhtmlize();
    });

    translate(lang || 'en', function() {
        // Load the data
        $.getScript('data.js', function() {
            attendance.xhtmlize();

            // Make tables sortable
            $('.dTable').tablesorter({ 
                sortList: [[2,0]],
                headers: { '0': { sorter: false } },
                widgets: ['zebra', 'idx']
            }); 

        });
    });

    fitToWin();
    $(window).resize(fitToWin);
});
