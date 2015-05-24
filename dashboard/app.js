var baseRef = require('./firebase')

module.exports = {
	template: require('./app.html'),
	components: {
		login: require('./views/login'),
		dashboard: require('./views/dashboard')
	},
	data: {
		view: null
	},
	created: function () {
		baseRef.onAuth(function (authData) {
			this.view = authData ? 'dashboard' : 'login'
		}, this)
	}
}
