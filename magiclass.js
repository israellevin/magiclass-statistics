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

attendance.addItem = function(date, lesson, cls, student, arrival) {
    this.full.push({date: date, lesson: lesson, cls: cls, student: student, arrival: arrival});
};

attendance.filter = function(attr, val) {
    if(attr == 'resetFilter') {
            this.filtered = this.full.slice();
            this.byArrival = this.byLesson = this.bySince = this.byUntil = this.byClass = this.byStudent = null;
    } else if(typeof(val) == 'undefined') {
        // Selection UI
        this.filter(attr, prompt(attr + ' to what?'));
        return;
    } else {
        if(typeof(this[attr]) != 'undefined') {
            if(this[attr] !== null) this.filtered = this.full.slice();
            this[attr] = val;
        }
    }

    var t = this.filtered.slice();
    this.filtered = [];
    for(idx in t) {
        if((this.byArrival !== null) && ((this.byArrival === '0') == (t[idx].arrival !== null))) continue;
        if((this.byLesson !== null) && (this.byLesson != t[idx].lesson)) continue;
        if((this.bySince !== null) && (this.bySince > t[idx].date)) continue;
        if((this.byUntil !== null) && (this.byUntil < t[idx].date)) continue;
        if((this.byClass !== null) && (this.byClass != t[idx].cls)) continue;
        if((this.byStudent !== null) && (this.byStudent != students[t[idx].student].id)) continue;
        this.filtered.push(t[idx]);
    }
    draw();
}

$(document).ready(function() {
    // Get language from location params in the form "lang=xx"
    var loc = document.location.href;
    var idx = loc.indexOf('?');
    var params = idx < 0 ? '' : loc.substr(++idx);
    params = params.split('&');
    for(idx in params) {
        var pair = params[idx].split('=');
        if(pair.length == 2 && pair[0] == 'lang') lang = pair[1];
    }

    // Load the language file
    $.getScript((lang || 'en') + '.js', function() {
        if(lang['direction']) {
            $('body').css('direction', lang['direction']);
            if(lang['direction'] == 'rtl') {
                $('#tabMenu li, div.filterDiv').css('float', 'right');
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
    $.getScript('data.js', function() {
        $('.filterDiv > div').each(function() {
            var attr = this.innerHTML;
            var cur = jQuery(this);
            cur.text(lang[attr] || attr).click(function() {
                attendance.filter(attr);
            }).hover(function() {
                jQuery(this).addClass('filterHover');
            }, function() {
                jQuery(this).removeClass('filterHover');
            });
        attendance.filter('resetFilter');
        });
    });
});

function draw() {
    var html = '';
    var even = false;
    for(idx in attendance.filtered) {
        var curAtt = attendance.filtered[idx];
        html += '<tr class="' + (curAtt.arrival ? 'attended' : 'missed') + ((even = !even) ? '1' : '2') + '">';
        html += '<td>' + curAtt.date + '</td>';
        html += '<td>' + curAtt.lesson + '</td>';
        html += '<td>' + curAtt.cls + '</td>';
        html += '<td>' + students[curAtt.student].name + '</td>';
        html += '</tr>';
    }
    $('#attendanceTable tbody').html(html);
}
