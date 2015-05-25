var Firebase = require('firebase')
var request = require('superagent')

var baseRef = new Firebase(process.env.FIREBASE_URL)

baseRef.authWithCustomToken(process.env.FIREBASE_SECRET, function (err, result) {
	if (err) throw err

	bindUsers(baseRef.child('hooks'))
})


function bindUsers (ref) {
	ref.on('child_added', function (snapshot) {
		console.log('Got user', snapshot.key())
		bindHooks(snapshot.ref())
	}, function (err) {
		console.error(err)
	})
}

function bindHooks (ref) {
	ref.on('child_added', function (snapshot) {
		console.log('Got hook', snapshot.val())
		bindHook(snapshot)
	}, function (err) {
		conosle.error(err)
	})
}

function bindHook (hook) {
	var id = hook.key()
	var opts = hook.val()

	try {
		var ref = new Firebase(opts.ref)
	}
	catch (err) {
		console.error('Could not create ref:', opts.ref, err)
		return
	}

	function bind () {
		console.log('binding')
		ref.on(opts.event, function (snapshot, prev) {
			var payload = {
				event: {
					ref: opts.ref,
					type: opts.event
				},
				ref: snapshot.ref().toString(),
				key: snapshot.key(),
				previous: prev,
				value: snapshot.exportVal()
			}

			request
				.post(opts.url)
				.send(payload)
				.end(function (err, res) {
					if (err) {
						console.error('Could not POST payload:', opts.url, err)
						// TODO: log error in Firebase
						return
					}

					console.log(res)
				})
		})
	}

	if (opts.token) {
		ref.authWithCustomToken(opts.token, function (err, auth) {
			if (err) {
				console.error('Could not authenticate ref:', opts, hook.ref().toString(), err)
				// TODO: log error in Firebase
				return
			}

			bind()
		})
		return
	}

	bind()
}
