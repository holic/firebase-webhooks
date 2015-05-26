var Firebase = require('firebase')
var firebase = require('../../firebase')

module.exports = {
	replace: true,
	template: require('./login.html'),
	methods: {
		login: function (event) {
			event.preventDefault()

			firebase.authWithOAuthPopup('github', function (err, auth) {
				if (err) {
					console.log('Login failed:', err)
					alert('Login failed.\n\n' + err.message)
				}

				if (auth) {
					auth.updated_at = Firebase.ServerValue.TIMESTAMP
					firebase.child('users').child(auth.uid).set(auth)
				}
			})
		}
	}
}
