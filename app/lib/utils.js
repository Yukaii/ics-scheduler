var semesterDate = {
	'2016-1': '2016-09-12',
	'2016-2': '2017-02-20',
	'2017-1': '2017-09-11',
	'2017-2': '2018-02-25',
	'2018-1': '2018-09-10',
};

// from http://stackoverflow.com/a/27336600/4147906
function nextDay(d, dow){
	d.setDate(d.getDate() + (dow + ( 7 - d.getDay())) % 7);
	return d;
}

export function icsGenerate(course_datas, year, term){
	const DAY = {
		1: 'MO',
		2: 'TU',
		3: 'WE',
		4: 'TH',
		5: 'FR',
		6: 'SA',
		7: 'SU'
	};

	var eventString = course_datas.map((course_data) => {
		return Array.isArray(course_data.periods) && course_data.periods.map(period => {
			var [dtstart, dtend] = period.time.split('-').map(time => nextDay(new Date(`${semesterDate[`${year}-${term}`]}T${time}:00+08:00`), period.day));
			var [dtstartString, dtendString] = [dtstart, dtend].map(time => time.toISOString().slice(0, 19).replace(/[-:]/g, ''));

			return `BEGIN:VEVENT
DTSTART;TZID=UTC:${dtstartString}
DTEND;TZID=UTC:${dtendString}
RRULE:FREQ=WEEKLY;COUNT=18;BYDAY=${DAY[nextDay(dtstart, period.day).getDay()]}
SUMMARY:${course_data.name}
LOCATION:${period.location}
DESCRIPTION:授課教師:${course_data.lecturer}; 課程代碼:${course_data.code}
END:VEVENT`;

		}).join(`\n`);
	}).join(`\n`);

	return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:yukaii.tw
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:課程表
X-WR-TIMEZONE:Asia/Taipei
X-WR-CALDESC:
BEGIN:VTIMEZONE
TZID:Asia/Taipei
X-LIC-LOCATION:Asia/Taipei
BEGIN:STANDARD
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:CST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
${eventString}
END:VCALENDAR`.replace(/\n/g, `\r\n`); // prefer CRLF over LF in ics format

}
