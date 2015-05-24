var firebase = require('./firebase')

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
		firebase.onAuth(function (authData) {
			this.view = authData ? 'dashboard' : 'login'
		}, this)
	}
}
