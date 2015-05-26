var FIREBASE_RE = /^https:\/\/(.*?)\.firebaseio\.com(?:\/(.*))?$/i

module.exports = {
	replace: true,
	template: require('./hook.html'),
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
		isWaiting: function () {
			return !this.last_call
		},
		hasSuccess: function () {
			return this.last_status >= 200 && this.last_status <= 299
		},
		hasError: function () {
			return this.last_status < 200 || this.last_status > 299
		},
		classes: function () {
			if (this.isWaiting) {
				return {
					text: 'text-muted',
					icon: 'glyphicon glyphicon-time'
				}
			}
			if (this.hasSuccess) {
				return {
					text: 'text-success',
					icon: 'glyphicon glyphicon-ok-sign'
				}
			}
			if (this.hasError) {
				return {
					text: 'text-danger',
					icon: 'glyphicon glyphicon-exclamation-sign'
				}
			}
		}
	}
}
