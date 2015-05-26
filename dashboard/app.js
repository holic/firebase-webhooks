var firebase = require('./firebase')

module.exports = {
	template: require('./app.html'),
	components: {
		login: require('./views/login'),
		dashboard: require('./views/dashboard')
	},
	data: {
		isLoggedIn: false
	},
	created: function () {
		firebase.onAuth(function (authData) {
			this.isLoggedIn = !!authData
		}, this)
	}
}
