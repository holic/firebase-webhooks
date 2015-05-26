var FIREBASE_RE = /^https:\/\/(.*?)\.firebaseio\.com(?:\/(.*))?$/i
var moment = require('moment')

module.exports = {
	replace: true,
	template: require('./hook.html'),
	filters: {
		fromNow: function (timestamp) {
			if (!timestamp) return
			return moment(timestamp).fromNow()
		}
	},
	computed: {
		splitRef: function () {
			var matches = this.ref.match(FIREBASE_RE)
			if (!matches) {
				console.log('Could not parse Firebase URL:', this.ref)
				return {
					subdomain: '??',
					childRef: '??'
				}
			}

			return {
				subdomain: matches[1],
				childRef: matches[2]
			}
		},
		classes: function () {
			if (!this.last_response) {
				return {
					text: 'text-muted',
					icon: 'glyphicon glyphicon-time'
				}
			}
			if (!this.has_error) {
				return {
					text: 'text-success',
					icon: 'glyphicon glyphicon-ok-sign'
				}
			}
			if (this.has_error) {
				return {
					text: 'text-danger',
					icon: 'glyphicon glyphicon-exclamation-sign'
				}
			}
		}
	}
}
