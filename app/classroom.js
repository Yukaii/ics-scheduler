import $ from 'jquery';
import 'bootstrap';

const PERIODS = {
	'0':  '07:10-08:00',
	'1':  '08:10-09:00',
	'2':  '09:10-10:00',
	'3':  '10:20-11:10',
	'4':  '11:20-12:10',
	'5':  '12:20-13:10',
	'6':  '13:20-14:10',
	'7':  '14:20-15:10',
	'8':  '15:30-16:20',
	'9':  '16:30-17:20',
	'10': '17:30-18:20',
	'A':  '18:25-19:15',
	'B':  '19:20-20:10',
	'C':  '20:10-21:05',
	'D':  '21:10-22:00'
};

const DAYS = [
	'一',
	'二',
	'三',
	'四',
	'五',
	'六',
	'日'
];

let periodMap, classrooms, classroomTimes;

$(document).ready(() => {
	$.getJSON('../data/2016-1/ntust-classrooms.json', data => {
		classrooms = data;
	});
	$.getJSON('../data/2016-1/ntust-classroom-times.json', data => {
		classroomTimes = data;
	});

	$.getJSON('../data/2016-1/ntust-period-classrooms.json', data => {
		periodMap = data;

		// TODO: extract the following dynamically
		const periods = Object.keys(PERIODS);
		const rowsCount = Object.keys(PERIODS).length + 1;
		const columnsCount = 8;

		let inserted = '';
		for (var x = 0; x < rowsCount; x += 1) {
			let rowData = '';
			if (x == 0) {
				for (var y = 0; y < columnsCount; y += 1) {
					if (y !== 0) {
						rowData += `<th>${DAYS[y-1]}</th>`;
					} else {
						rowData += '<th></th>';
					}
				}

			} else {
				for (var y = 0; y < columnsCount; y += 1) {
					if (y == 0) {
						rowData += `<th>${periods[x-1]}</th>`;
					} else {
						rowData += `<td class="hoverable" data-day="${x-1}" data-time="${y}"></td>`;
					}
				}
			}
			inserted += `<tr><${rowData}/tr>`;
		}

		$('#timetable.table').append(inserted);

		$('#timetable.table td.hoverable').click(function(event) {
			if (classrooms) {
				const clickedTd = $(this);

				const day = parseInt((clickedTd.attr('data-day')));
				const time = PERIODS[clickedTd.attr('data-time')];

				const availableClassrooms = $(classrooms).not(periodMap[`${day} ${time}`]).get().filter(name => name.match(/^[A-Za-z]+/));

				$('#classrooms-modal .modal-body').text(JSON.stringify(availableClassrooms, null, 2));

				$('#classrooms-modal').modal();
			} else {
				// show some error, classrooms not loaded yet
			}
		});
	});
});
