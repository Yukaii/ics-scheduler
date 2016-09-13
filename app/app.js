import $ from 'jquery';
import 'bootstrap';
import { saveAs } from 'file-saver';
import { icsGenerate } from './lib/utils';

$(document).ready(() => {
	$('form').submit(e => {
		e.preventDefault();

		// TODO: different school would have different regex
		// generalize this part
		var course_datas = [];
		var done = 0;
		var course_codes = $('form #raw-input-textarea').val().match(/[A-Z\d]{9}/g);

		course_codes.forEach((code) => {
			$.getJSON(`./data/ntust/${code}.json`, json => {
				if (typeof json !== 'undefined') { course_datas = [...course_datas, json]; }
				done += 1;

				if (done == course_codes.length) {
					var file = new File([icsGenerate(course_datas)], {type: 'text/calendar;charset=utf-8'});
					saveAs(file, 'calendar.ics', true);
				}
			});
		});
	});
});
