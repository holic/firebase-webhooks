var firebase = require('../../firebase')

// TODO: store logins

module.exports = {
	replace: true,
	template: require('./login.html'),
	methods: {
		login: function (event) {
			event.preventDefault()

			firebase.authWithOAuthPopup('github', function (err, authData) {
				if (err) {
					console.log('Login failed:', err)
					alert('Login failed.\n\n' + err.message)
				}
			})
		}
	}
}
