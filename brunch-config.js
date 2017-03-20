module.exports = {
	files: {
		javascripts: {
			joinTo: {
				'vendor.js': /^(?!app)/
			},
			entryPoints: {
				'app/app.js': {
					'app.js': /^app/,
				},
				'app/classroom.js': {
					'classroom.js': /^app/,
				}
			}
		},
		stylesheets: {
			joinTo: 'app.css'
		}
	},

	plugins: {
		babel: {presets: ['es2015']},
		sass: {
			options: {
				includePaths: ['node_modules/bootstrap/scss'], // tell sass-brunch where to look for files to @import
				precision: 8 // minimum precision required by bootstrap-sass
			}
		},
	},

	npm: {
		enabled: true,
		whitelist: ['jquery', 'bootstrap-sass', 'tether'],
		globals: { // bootstrap-sass' JavaScript requires both '$' and 'jQuery' in global scope
			$: 'jquery',
			jQuery: 'jquery',
			Tether: 'tether'
		}
	}
};
