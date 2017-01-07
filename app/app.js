import $ from 'jquery';
import 'bootstrap';
import { icsGenerate } from './lib/utils';

$(document).ready(() => {
	$('form').submit(e => {
		// prevent form submitting, we'll use ajax instead
		e.preventDefault();

		$('#alternative-download-link').addClass('hidden');
		$('#ics-anchor button').attr('disabled', '').removeClass('btn-success').removeClass('btn-danger').text('請稍等');

		// TODO: different school would have different regex
		//       regex should be put in a seperate file
		var course_datas = [];
		var course_codes = $('form #raw-input-textarea').val().match(/[A-Z\d]{9}/g);

		if (!course_codes) {
			$('#ics-anchor button').addClass('btn-danger').text('課程代碼錯誤');
			return;
		}

		const schoolCode = $('#school-value').attr('value');
		const semesterValue = $('#semester-value').attr('value');
		const [year, term] = semesterValue.split('-');

		var done = 0; // jquery ajax parallel job workaround
		var jobCount = course_codes.length;

		course_codes.forEach(code => {
			$.getJSON(`./data/${semesterValue}/${schoolCode}/${code}.json`, json => {
				if (typeof json !== 'undefined') { course_datas = [...course_datas, json]; done += 1; }
				else { jobCount -= 1; } // error occur

				if (done == jobCount) {
					var icsData = icsGenerate(course_datas, year, term);
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
							$('#ics-anchor button').addClass('btn-success').removeAttr('disabled').text('下載');
							$('#alternative-download-link').removeClass('hidden').attr('href', raw_url);
						}
					);
				}
			});
		});
	});

	$('#school-dropdown .dropdown-menu a').click(function() {
		e.preventDefault();
		$('#school-value').text($(this).attr('value').toUpperCase()).attr('value', $(this).attr('value'));
	});

	$('#semester-dropdown .dropdown-menu a').click(function() {
		e.preventDefault();
		const [year, term] = $(this).attr('value').split('-');
		$('#semester-value').text(`${year-1911}${term}`).attr('value', $(this).attr('value'));
	});
});
