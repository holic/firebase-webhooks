var baseRef = require('../../firebase')

module.exports = {
	template: require('./login.html'),
	methods: {
		login: function (event) {
			event.preventDefault()

			baseRef.authWithOAuthPopup('github', function (err, authData) {
				if (err) {
					console.log('Login failed:', err)
					alert('Login failed.\n\n' + err.message)
				}
			})
		}
	}
}
