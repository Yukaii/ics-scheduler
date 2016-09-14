import $ from 'jquery';
import 'bootstrap';
import { saveAs } from 'file-saver';
import { icsGenerate } from './lib/utils';

$(document).ready(() => {
	$('form').submit(e => {
		// prevent form submitting, we'll use ajax instead
		e.preventDefault();

		// TODO: different school would have different regex
		//       regex should be put in a seperate file
		var course_datas = [];
		var course_codes = $('form #raw-input-textarea').val().match(/[A-Z\d]{9}/g);

		var done = 0; // jquery ajax parallel job workaround
		var jobCount = course_codes.length;

		course_codes.forEach(code => {
			$.getJSON(`./data/ntust/${code}.json`, json => {
				if (typeof json !== 'undefined') { course_datas = [...course_datas, json]; done += 1; }
				else { jobCount -= 1; } // error occur

				if (done == jobCount) {
					var file = new Blob([icsGenerate(course_datas)], {type: 'application/octet-stream'});
					saveAs(file, 'calendar.ics', true); // last argument true: save file without BOM
				}
			});
		});
	});
});
