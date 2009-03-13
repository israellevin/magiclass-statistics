lessons.push('08:15');
lessons.push('09:30');
lessons.push('10:30');
lessons.push('11:15');
lessons.push('13:30');
lessons.push('14:15');

classes.push('אל"ף');
classes.push('Chem-101');
classes.push('Auto-2');
classes.push('10th');
classes.push('Aleph 2');

students.push({id: '039213554', name: 'Isra Lin', classes: [0]});
students.push({id: '639634567', name: 'asdfasdf', classes: ['1']});
students.push({id: '259463466', name: 'weqwefasdf', classes: ['1']});
students.push({id: '349773473', name: 'asasdfasdf', classes: ['1']});
students.push({id: '339333333', name: 'asfasdf', classes: ['1']});
students.push({id: '239346345', name: 'wewfda', classes: ['0']});
students.push({id: '259272456', name: 'zxv', classes: ['0']});
students.push({id: '139523463', name: 'sedqwev', classes: ['2']});
students.push({id: '149345132', name: 'asdferfxc', classes: ['2']});
students.push({id: '139513455', name: 'eqwsvxzcv', classes: ['2']});
students.push({id: '149513463', name: 'qwetdvdefg', classes: ['2']});
students.push({id: '149333616', name: 'sadfadvv', classes: ['3']});
students.push({id: '119354136', name: 'asfsdf', classes: ['3']});
students.push({id: '619136413', name: 'asdfczvwet', classes: ['3']});
students.push({id: '749134553', name: 'qwetqwfasdv', classes: ['3']});
students.push({id: '119413466', name: 'asdfsdferw', classes: ['4']});
students.push({id: '759747777', name: 'asfasdfertg', classes: ['4']});
students.push({id: '139533345', name: 'fhgdtrhg', classes: ['4']});
students.push({id: '159444444', name: 'ASDSASdsf', classes: ['4']});
students.push({id: '449555256', name: 'fdsdfsadf', classes: ['4']});
students.push({id: '449235256', name: '42fsadf', classes: ['4']});
students.push({id: '033213554', name: 'Israel Levin', classes: [0]});
students.push({id: '634634567', name: 'asdfasdf', classes: ['1']});
students.push({id: '253463466', name: 'wetqwefasdf', classes: ['1']});
students.push({id: '345773473', name: 'asdfasdfasdf', classes: ['1']});
students.push({id: '333333333', name: 'asdfasdfasdf', classes: ['1']});
students.push({id: '235346345', name: 'weqrwfda', classes: ['0']});
students.push({id: '256272456', name: 'zxcv', classes: ['0']});
students.push({id: '134523463', name: 'sedfqwev', classes: ['2']});
students.push({id: '145345132', name: 'asdfwerfxc', classes: ['2']});
students.push({id: '134513455', name: 'eqwsdvxzcv', classes: ['2']});
students.push({id: '143513463', name: 'qwetsdvdefg', classes: ['2']});
students.push({id: '143333616', name: 'sadfsadvv', classes: ['3']});
students.push({id: '111354136', name: 'asdfasdf', classes: ['3']});
students.push({id: '613136413', name: 'asdfxczvwet', classes: ['3']});
students.push({id: '745134553', name: 'qwetrqwfasdv', classes: ['3']});
students.push({id: '115413466', name: 'asdfasdferw', classes: ['4']});
students.push({id: '754747777', name: 'asdfasdfertg', classes: ['4']});
students.push({id: '134533345', name: 'fhgdhtrhg', classes: ['4']});
students.push({id: '154444444', name: 'ASDSCASdsf', classes: ['4']});
students.push({id: '444555256', name: 'fdfsdfsadf', classes: ['4']});
students.push({id: '444235256', name: '423dfsadf', classes: ['4']});

for(var idx = 0; idx < 100; idx++) {
    attendance.push({
        date: mkDate(),
        lesson: rnd(lessons.length),
        clas: rnd(classes.length),
        student: rnd(students.length),
        time: rnd(10) == 0 ? null : rnd(1000)
    });
}
