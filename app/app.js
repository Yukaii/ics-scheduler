import $ from 'jquery';
import 'bootstrap';
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
					var icsData = icsGenerate(course_datas);
					$.post(
						'https://api.github.com/gists',
						JSON.stringify({
							'files': {
								'calendar.ics': {
									content: icsData
								}
							}
						}), function(data) {
							var raw_url = data['files']['calendar.ics']['raw_url'];
							$('#ics-anchor').attr('href', raw_url);
							$('#download-group').toggleClass('hidden');
						}
					);
				}
			});
		});
	});
});
