var Firebase = require('firebase')
var firebase = require('../../firebase')

var events = require('./firebase-events')

function hooksRef () {
	var auth = firebase.getAuth()
	return firebase.child('hooks').child(auth.uid)
}

module.exports = {
	template: require('./dashboard.html'),
	data: function () {
		return {
			hooks: null,
			events: events,
			firebase_url: null,
			firebase_event: events[0],
			webhook_url: null
		}
	},
	methods: {
		add: function (event) {
			event.preventDefault()

			hooksRef().push({
				ref: this.firebase_url,
				on: this.firebase_event,
				url: this.webhook_url,
				created_at: Firebase.ServerValue.TIMESTAMP
			}, function (err) {
				if (err) console.error('Could not add hook:', err)
			})

			this.firebase_url = null
			this.webhook_url = null
		}
	},
	created: function () {
		var auth = firebase.getAuth()

		hooksRef().on('value', function (snapshot) {
			this.hooks = snapshot.val()
		}, function (err) {
			console.error('Could not get hooks:', err)
		}, this)
	}
}
