// Globals
var jQuery = this.jQuery;
var $ = this.$;
var lang;
var lessons = [];
var classes = [];
var students = [];
var presentations = [];

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
function date2txt(d) {
    var day = d.getDay();
    var month = d.getMonth();
    var year = d.getFullYear();
    var s = (lang['dateFormat'] || '$y-m-d$').replace('d', day).replace('m', month).replace('y', year);
    return s;
}
function pad(n) { n = n.toString(); return n.length == 1 ? '0' + n : n; }

function fitToWin() {
    var winH = $('body').innerHeight();
    var winW = $('body').innerWidth();
    $('div#tabsDiv').height(winH - 30);
    $('div#tabsDiv').width(winW - 22);

    // Natural top of element
    var elemTop;
    // Height of footer, which should get to bottom of page
    var footH = $('#footerDiv').height();

    elemTop = $('table#studentReportChooserTable tbody').offset()['top'];
    $('table#studentReportChooserTable tbody').height('' + (winH - elemTop - footH - 10) + 'px');

    elemTop = $('div#studSingleScrollDiv').offset()['top'];
    $('div#studSingleScrollDiv').height('' + (winH - elemTop - footH - 20) + 'px');
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
            var j = jQuery(this);
            j.text(lang[this.id] || lang[j.attr('name')] || this.id || j.attr('name'));
        });
        if(callback) callback();
    });
}

function injectData() {
    // Create class selects
    var classInp = jQuery('<select name="classInp"><option value="-1">' + lang['allClasses'] + '</option></select>');
    jQuery.each(classes, function(idx, val) {
        classInp.append('<option value="' + idx + '">' + $('<p/>').text(val).html() + '</option>');
    });
    $('input[name="classInp"]').replaceWith(classInp);
    
    // Bind data entry
    $('table#studentReportChooserTable thead th').find('input[name="idNumInp"]').keydown(function(e) {
        if(e.which < 0 || e.which > 57) return false;
    }).unbind('keyup', null).keyup(function(e) {
        if(this.value.length > 9) this.value = this.value.substring(0, 9);
        studentReport.studChoiceUpdate();
    }).end().find('input[name="studNameInp"]').unbind('keyup', null).keyup(function(e) {
        studentReport.studChoiceUpdate();
    }).end().find('select[name="classInp"]').unbind('change', null).change(function(e) {
        studentReport.studChoiceUpdate();
    });

    // Bind clicks
    $('button#studentReportChooserShowBtn').click(function(e) {
        studentReport.curStud = null;
        studentReport.studChoiceUpdate();
        fitToWin();
    });

    studentReport.studChoiceUpdate();

    // Make tables sortable
    $('table.tablesorter').tablesorter({ 
        sortList: [[2,0]],
        widgets: ['zebra']
    }); 
}

var studentReport = {
    curStud: null,
    filtered: [],
    idFilter: null,
    nameFilter: null,
    classFilter: null,
    studChoiceUpdate: function() {
        if(null == this.curStud) {
            $('table#studentReportChooserTable').css('display', 'table');
            $('div#studentReportSingleDiv').css('display', 'none');
            var idFilter = $('table#studentReportChooserTable thead input[name="idNumInp"]').val();
            var nameFilter = $('table#studentReportChooserTable thead input[name="studNameInp"]').val();
            var classFilter = parseInt($('table#studentReportChooserTable thead select[name="classInp"] option:selected').val());
            // Must we?
            if((idFilter == this.idFilter) && (nameFilter == this.nameFilter) && (classFilter == this.classFilter)) return true;
            this.filtered = [];
            this.idFilter = idFilter;
            this.nameFilter = nameFilter;
            this.classFilter = classFilter;
            var i;
            jQuery.each(students, function(key, val) {
                i = studentReport.idFilter;
                if((i) && (i.length > 0) && (val['id'].indexOf(i) == -1)) return true;
                i = studentReport.nameFilter.toLowerCase();
                if((i) && (i.length > 0) && (val['name'].toLowerCase().indexOf(i) == -1)) return true;
                i = studentReport.classFilter;
                if(i > -1) {
                    var notInClass = true;
                    jQuery.each(val['classes'], function(key, val) {
                        if(val == i) {
                            notInClass = false;
                            return true;
                        }
                    });
                    if(notInClass) return true;
                }
                studentReport.filtered.push(key);
            });
            var xhtml = '';
            jQuery.each(this.filtered, function(key, val) {
                xhtml += '<tr><td style="display: none">' + val + '</td><td>' + students[val]['id'] + '</td><td>' + students[val]['name'] + '</td><td>' + ((studentReport.classFilter > -1) ? (classes[studentReport.classFilter]) : (classes[students[val]['classes'][0]]) || '') + '</td></tr>';
            });
            $('table#studentReportChooserTable tbody').html(xhtml);

            // Fix table sorter
            $('table#studentReportChooserTable').trigger('update');
            $('table#studentReportChooserTable').trigger('sorton', false); 

            // Bind clicks
            $('table#studentReportChooserTable tbody tr').click(function(e) {
                studentReport.curStud = students[$(this).find('td').eq(0).text()];
                studentReport.studChoiceUpdate();
                fitToWin();
            // Hilite tr
            }).hover(function(e) {
                jQuery(this).find('td').css('color', 'red');
            }, function() {
                jQuery(this).find('td').css('color', 'black');
            // Bind tooltips
            }).each(function() {
                jQuery(this).find('td').eq(2).hover(function(e) {
                    var t = '<img src="pic.png"/>';
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
        } else {
            $('#studNameH').text(this.curStud['name']);
            $('#studIdH').text(this.curStud['id']);
            $('#studPic').attr('src', 'pic.png');
            var xhtml = '';
            jQuery.each(this.curStud['classes'], function(key, val) {
                xhtml += '<li>' + classes[val] + '</li>';
                
            });
            $('#studClssUl').html(xhtml);
            var grds = grades.studStats(this.curStud['id']);
            if(grds) {
                $('#studGrade').text(grds.avgGrade);
                $('#studGradeTableDiv table tbody').html(grds.table);
                $('#studGradeTableDiv table').tablesorter();
            } else {
                $('#studGrade').text(lang[noGrade]);
                $('#studGradeTableDivstudGradeTableDiv table').css('display', 'none');
            }
            var atts = attendance.studStats(this.curStud['id']);
            $('#studNumOfMisses').text(atts.numOfMisses);
            $('#studNumOfActivities').text(atts.numOfActivities);
            if(atts) {
                $('#studAttendanceTableDiv table tbody').html(atts.table);
                $('#studAttendanceTableDiv table').tablesorter();
            } else {
                $('#studAttendanceTableDiv table').css('display', 'none');
            }

            $('table#studentReportChooserTable').css('display', 'none');
            $('div#studentReportSingleDiv').css('display', 'block');
        }
        setTimeout("fitToWin();", 100);
    }
};

var attendance = {
    full: [],
    byStud: [],
    name: false,
    push: function(line) {
        var aIdx = this.full.push(line);
        var sIdx = students[line['student']]['id'];
        if(this.byStud.hasOwnProperty(sIdx)) {
            this.byStud[sIdx].push(this.full[aIdx - 1]);
        } else {
            this.byStud[sIdx] = [this.full[aIdx - 1]];
        }
    },
    studStats: function(studId) {
        if(!this.byStud[studId]) return false;
        var studData = this.byStud[studId];
        var stat = {};
        stat.numOfActivities = studData.length;
        // Calculate total missed activities and generate table
        stat.numOfMisses = 0;
        stat.table = '';
        jQuery.each(studData, function(key, val) {
            if(val['time'] === null) stat.numOfMisses++;
            stat.table += '<tr><td>' + date2txt(val['date']) + '</td><td>' + lessons[val['lesson']] + '</td><td>' + classes[val['clas']] + '</td><td>' + (val['time'] || lang['missing']) + '</td></tr>';
        });

        return stat;
    }
};

var grades = {
    full: [],
    byStud: [],
    byClass: [],
    byPresentation: [],
    push: function(line) {
        var aIdx = this.full.push(line);
        var sIdx = students[line['student']]['id'];
        if(this.byStud.hasOwnProperty(sIdx)) {
            this.byStud[sIdx].push(this.full[aIdx - 1]);
        } else {
            this.byStud[sIdx] = [this.full[aIdx - 1]];
        }

        var cIdx = line['clas']
        if(this.byClass.hasOwnProperty(cIdx)) {
            this.byClass[cIdx].push(this.full[aIdx - 1]);
        } else {
            this.byClass[cIdx] = [this.full[aIdx - 1]];
        }

        var pIdx = line['presentation']
        if(this.byPresentation.hasOwnProperty(pIdx)) {
            this.byPresentation[pIdx].push(this.full[aIdx - 1]);
        } else {
            this.byPresentation[pIdx] = [this.full[aIdx - 1]];
        }
    },
	studStats: function(studId) {
        if(!this.byStud[studId] || this.byStud[studId].length < 1) return false;
        var studData = this.byStud[studId];
        var stat = {};
        stat.avgGrade = rnd(100);
        // Generate table
        stat.table = '';
        var s = 0
        jQuery.each(studData, function(key, val) {
            stat.table += '<tr><td>' + date2txt(val['date']) + '</td><td>' + lessons[val['lesson']] + '</td><td>' + rnd(100) + '</td></tr>';
        });

        return stat;
    }
}

$(document).ready(function() {
    $('#tabsDiv').tabs();
    $(window).resize(fitToWin);

    // Get language from location params in the form "lang=xx"
    var loc = document.location.href;
    var idx = loc.indexOf('?');
    var params = idx < 0 ? '' : loc.substr(++idx);
    params = params.split('&');
    for(idx in params) { if(params[idx].hasOwnProperty('0')) {
        var pair = params[idx].split('=');
        if(pair.length == 2 && pair[0] == 'lang') { lang = pair[1]; }
    }};

    translate(lang || 'en', function() {
        // Load the data
        $.getScript('data.js', function() {
            injectData();
        });
    });
});

/*
attendance.xhtmlize = function() {
    var xhtml = '';
    /*
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

/*
        // Save dates
        var missAtDate = $('missAtInp').datepicker('getDate');
        var missSinceDate = $('missSinceInp').datepicker('getDate');

        // Date picker config
        $('.datepicker').datepicker('setDate').datepicker(
            'option', 'closeText',
            lang['dateClose'] || 'Close'
        ).datepicker(
            'option', 'currentText',
            lang['dateToday'] || 'Today'
        ).datepicker(
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


function bindInputs() {

}

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


 *
*/
