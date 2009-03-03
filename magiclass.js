// Explicify globals
var jQuery = this.jQuery;
var $ = this.$;
var prompt = this.window.prompt;

// Constants to be loaded from from external js files
var lang;
var lessons = [];
var classes = [];
var students = [];

// Attendance data
var attendance = {
    full: [],
    filtered: [],
    byArrival: null,
    byLesson: null,
    bySince: null,
    byUntil: null,
    byClass: null,
    byStudent: null
};

// Draw data and filter UI
function draw() {
    var html = '';
    var even = false;
    for(var idx in attendance.filtered) {
        if(attendance.filtered[idx].hasOwnProperty('date')) {
            var curAtt = attendance.filtered[idx];
            html += '<tr class="' + (curAtt.arrival ? 'attended' : 'missed') + ((even = !even) ? '1' : '2') + '">';
            html += '<td>' + curAtt.date + '</td>';
            html += '<td>' + curAtt.lesson + '</td>';
            html += '<td>' + curAtt.cls + '</td>';
            html += '<td>' + students[curAtt.student].name + '</td>';
            html += '</tr>';
        }
    }
    $('#attendanceTable tbody').html(html);
    $('#attendanceTable tbody tr').hover(function() {
        jQuery(this).addClass('studRowHover');
    }, function() {
        jQuery(this).removeClass('studRowHover');
    });

    // Draw filter UI
    if(
        (attendance.byArrival != '-1') ||
        (attendance.byLesson.length < 6) ||
        (attendance.byClass.length < 5)
    ) $('#resetFilter').addClass('filterActive');
    else $('#resetFilter').removeClass('filterActive');

//    var j = $('');
//    for(idx in 
}

attendance.addItem = function(date, lesson, cls, student, arrival) {
    this.full.push({date: date, lesson: lesson, cls: cls, student: student, arrival: arrival});
};

attendance.filter = function() {
    this.byArrival = $('#byArrival input:radio[@name="byArrival"]:checked').val();
    this.byLesson = $('#byLesson select').val();
    this.byClass = $('#byClass select').val();

    var t = this.full.slice();
    this.filtered = [];
    for(var idx in t) { if(t[idx].hasOwnProperty('date')) {
        if(!t[idx].date) { continue; }
        if((this.byArrival !== null) && (this.byArrival !== '-1') && ((this.byArrival === '0') == (t[idx].arrival !== null))) { continue; }
        if((this.byLesson !== null) && (jQuery.inArray("" + t[idx].lesson, this.byLesson) == -1)) { continue; }
        if((this.bySince !== null) && (this.bySince > t[idx].date)) { continue; }
        if((this.byUntil !== null) && (this.byUntil < t[idx].date)) { continue; }
        if((this.byClass !== null) && (jQuery.inArray("" + t[idx].cls, this.byClass) == -1)) { continue; }
        if((this.byStudent !== null) && (this.byStudent != students[t[idx].student].id)) { continue; }
        this.filtered.push(t[idx]);
    }}
    draw();
};

$(document).ready(function() {
    // Get language from location params in the form "lang=xx"
    var loc = document.location.href;
    var idx = loc.indexOf('?');
    var params = idx < 0 ? '' : loc.substr(++idx);
    params = params.split('&');
    for(idx in params) { if(params[idx].hasOwnProperty('0')) {
        var pair = params[idx].split('=');
        if(pair.length == 2 && pair[0] == 'lang') { lang = pair[1]; }
    }}

    // Load the language file
    $.getScript('data/' + (lang || 'en') + '.js', function() {
        if(lang.direction) {
            if(lang.direction == 'rtl') {
                $('head').append('<link rel="stylesheet" type="text/css" href="rtl.css" />');
            }
        }
        $('#tabMenu a').each(function() {
            var curJ = jQuery(this);
            var s = curJ.attr('href').substr(1);
            curJ.children('span').text(lang[s] || s);
        });
        $('#tabMenu > ul').tabs();
        $('#attendanceTable th').each(function() {
            this.textContent = lang[this.textContent] || this.textContent;
        });
    });

    // Load the data
    $.getScript('data/data.js', function() {
        attendance.filter();
    });

    $('#filterTable tr').click(function() {
        attendance.filter();
    }).hover(function() {
        jQuery(this).addClass('filterHover');
    }, function() {
        jQuery(this).removeClass('filterHover');
    });

    $('#byLesson select').change(function() {
        attendance.filter();
    });

    $('#byClass select').change(function() {
        attendance.filter();
    });

    $('#resetFilter').click(function() {
        $('#byArrival input:radio[@name="byArrival"]:first')[0].checked = true;
        $('#byLesson option').attr('selected', 'selected');
        $('#byClass option').attr('selected', 'selected');
        attendance.filter();
    });
});
