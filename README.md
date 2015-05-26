# [Webhooks for Firebase](https://webhooks.firebaseapp.com/)

Firebase currently does not have [support for webhooks](https://groups.google.com/forum/#!topic/firebase-talk/wjdHSg6w2U4). This project is an attempt to fill that gap.


### Using Firebase webhooks

1. [Log in to the dashboard](https://webhooks.firebaseapp.com/) using your GitHub account.
2. Use the form provided to add a webhook for the Firebase URL and event you'd like to listen on.
3. Optionally provide a custom authentication token or Firebase Secret if the data at the provided path is not publicly readable.
4. Fill in a payload URL which we can `POST` data to.

At your payload URL, you should start receiving `POST` requests with a JSON body that looks like this:

```json
{
	"event": {
		"ref": "The Firebase URL you provided to create this webhook.",
		"type": "The Firebase event you're listening on for this webhook."
	},
	"ref": "The Firebase URL for this DataSnapshot.",
	"key": "The key() of this DataSnapshot.",
	"previous": "The previous child key emitted before this DataSnapshot.",
	"value": "The exportVal() for this DataSnapshot."
}
```


# Contributing

I'd love some help!

### TODO

- validate form input (e.g. make sure URLs are URLs)
- add tests for dashboard
- add tests for webhook server/listeners
- add rate limiting
- stop webhook on hard failure (e.g. `new Firebase()` exceptions)
- stop/pause webhook after `x` failed requests
- log all webhook requests/responses for debugging
