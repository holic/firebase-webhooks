(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = '<div v-component="{{ view }}"></div>\n';
},{}],2:[function(require,module,exports){
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

},{"./app.html":1,"./firebase":3,"./views/dashboard":6,"./views/login":7}],3:[function(require,module,exports){
var Firebase = require('firebase')

module.exports = new Firebase('https://webhooks.firebaseio.com')

},{"firebase":9}],4:[function(require,module,exports){
module.exports = '<div class="container">\n	<div class="panel panel-default">\n		<div class="panel-heading">\n			<h3 class="panel-title">Add a webhook</h3>\n		</div>\n		<div class="panel-body">\n			<form v-on="submit: add($event)" class="form-inline">\n				<code>new Firebase("</code>\n				<input v-model="ref" type="text" class="form-control input-sm" placeholder="https://example.firebaseio.com/" required>\n				<code>").auth("</code>\n				<input v-model="token" type="text" class="form-control input-sm" placeholder="token or secret">\n				<code>").on("</code>\n				<select v-model="event" options="events" class="form-control input-sm" required></select>\n				<code>")</code>\n				<span class="glyphicon glyphicon-chevron-right"></span>\n				<input v-model="url" type="text" class="form-control input-sm" placeholder="https://example.com/hooks/firebase" required>\n				<button type="submit" class="btn btn-sm btn-primary">Save</button>\n			</form>\n		</div>\n	</div>\n\n	<div v-repeat="hook: hooks" class="panel panel-default">\n		<div class="panel-body">\n			<code>new Firebase("{{ hook.ref }}").on("{{ hook.event }}")</code>\n			<span class="glyphicon glyphicon-chevron-right"></span>\n			<code>{{ hook.url }}</code>\n		</div>\n	</div>\n</div>\n';
},{}],5:[function(require,module,exports){
module.exports = [
	'value',
	'child_added',
	'child_changed',
	'child_removed',
	'child_moved'
]

},{}],6:[function(require,module,exports){
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
			// init form fields
			ref: null,
			token: null,
			event: events[0],
			url: null
		}
	},
	methods: {
		add: function (event) {
			// TODO: test input on live `new Firebase()` call to validate

			event.preventDefault()

			hooksRef().push({
				ref: this.ref,
				token: this.token && this.token !== '' ? this.token : null,
				event: this.event,
				url: this.url,
				created_at: Firebase.ServerValue.TIMESTAMP
			}, function (err) {
				if (err) console.error('Could not add hook:', err)
			})

			this.ref = null
			this.token = null
			this.url = null
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

},{"../../firebase":3,"./dashboard.html":4,"./firebase-events":5,"firebase":9}],7:[function(require,module,exports){
var firebase = require('../../firebase')

// TODO: store logins

module.exports = {
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

},{"../../firebase":3,"./login.html":8}],8:[function(require,module,exports){
module.exports = '<div class="container">\n	<div class="row">\n		<div class="col-md-6 col-md-offset-3">\n			<div class="jumbotron text-center">\n				<h1>Webhooks for Firebase</h1>\n				<br>\n				<p>\n					<button v-on="click: login($event)" type="button" class="btn btn-lg btn-primary">\n						Log in with GitHub\n					</button>\n				</p>\n			</div>\n		</div>\n	</div>\n</div>\n';
},{}],9:[function(require,module,exports){
/*! @license Firebase v2.2.5
    License: https://www.firebase.com/terms/terms-of-service.html */
(function() {var h,aa=this;function n(a){return void 0!==a}function ba(){}function ca(a){a.ub=function(){return a.tf?a.tf:a.tf=new a}}
function da(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ea(a){return"array"==da(a)}function fa(a){var b=da(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ga(a){return"number"==typeof a}function ha(a){return"function"==da(a)}function ia(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ja(a,b,c){return a.call.apply(a.bind,arguments)}
function ka(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function q(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ja:ka;return q.apply(null,arguments)}var la=Date.now||function(){return+new Date};
function ma(a,b){function c(){}c.prototype=b.prototype;a.Zg=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Vg=function(a,c,f){for(var g=Array(arguments.length-2),k=2;k<arguments.length;k++)g[k-2]=arguments[k];return b.prototype[c].apply(a,g)}};function r(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function na(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function oa(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function pa(a){var b=0,c;for(c in a)b++;return b}function qa(a){for(var b in a)return b}function ra(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function sa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function ta(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function ua(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function va(a,b){var c=ua(a,b,void 0);return c&&a[c]}function wa(a){for(var b in a)return!1;return!0}function xa(a){var b={},c;for(c in a)b[c]=a[c];return b}var ya="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function za(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<ya.length;f++)c=ya[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Aa(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Ba(){this.Pd=void 0}
function Ca(a,b,c){switch(typeof b){case "string":Da(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(ea(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],Ca(a,a.Pd?a.Pd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),Da(f,c),
c.push(":"),Ca(a,a.Pd?a.Pd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var Ea={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Fa=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Da(a,b){b.push('"',a.replace(Fa,function(a){if(a in Ea)return Ea[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Ea[a]=e+b.toString(16)}),'"')};function Ga(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^la()).toString(36)};var Ha;a:{var Ia=aa.navigator;if(Ia){var Ja=Ia.userAgent;if(Ja){Ha=Ja;break a}}Ha=""};function Ka(){this.Wa=-1};function La(){this.Wa=-1;this.Wa=64;this.R=[];this.le=[];this.Tf=[];this.Id=[];this.Id[0]=128;for(var a=1;a<this.Wa;++a)this.Id[a]=0;this.be=this.$b=0;this.reset()}ma(La,Ka);La.prototype.reset=function(){this.R[0]=1732584193;this.R[1]=4023233417;this.R[2]=2562383102;this.R[3]=271733878;this.R[4]=3285377520;this.be=this.$b=0};
function Ma(a,b,c){c||(c=0);var d=a.Tf;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.R[0];c=a.R[1];for(var g=a.R[2],k=a.R[3],l=a.R[4],m,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),m=1518500249):(f=c^g^k,m=1859775393):60>e?(f=c&g|k&(c|g),m=2400959708):(f=c^g^k,m=3395469782),f=(b<<
5|b>>>27)+f+l+m+d[e]&4294967295,l=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.R[0]=a.R[0]+b&4294967295;a.R[1]=a.R[1]+c&4294967295;a.R[2]=a.R[2]+g&4294967295;a.R[3]=a.R[3]+k&4294967295;a.R[4]=a.R[4]+l&4294967295}
La.prototype.update=function(a,b){if(null!=a){n(b)||(b=a.length);for(var c=b-this.Wa,d=0,e=this.le,f=this.$b;d<b;){if(0==f)for(;d<=c;)Ma(this,a,d),d+=this.Wa;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Wa){Ma(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Wa){Ma(this,e);f=0;break}}this.$b=f;this.be+=b}};var t=Array.prototype,Na=t.indexOf?function(a,b,c){return t.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Oa=t.forEach?function(a,b,c){t.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Pa=t.filter?function(a,b,c){return t.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?
a.split(""):a,k=0;k<d;k++)if(k in g){var l=g[k];b.call(c,l,k,a)&&(e[f++]=l)}return e},Qa=t.map?function(a,b,c){return t.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ra=t.reduce?function(a,b,c,d){for(var e=[],f=1,g=arguments.length;f<g;f++)e.push(arguments[f]);d&&(e[0]=q(b,d));return t.reduce.apply(a,e)}:function(a,b,c,d){var e=c;Oa(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Sa=t.every?function(a,b,
c){return t.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Ta(a,b){var c=Ua(a,b,void 0);return 0>c?null:p(a)?a.charAt(c):a[c]}function Ua(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Va(a,b){var c=Na(a,b);0<=c&&t.splice.call(a,c,1)}function Wa(a,b,c){return 2>=arguments.length?t.slice.call(a,b):t.slice.call(a,b,c)}
function Xa(a,b){a.sort(b||Ya)}function Ya(a,b){return a>b?1:a<b?-1:0};var Za=-1!=Ha.indexOf("Opera")||-1!=Ha.indexOf("OPR"),$a=-1!=Ha.indexOf("Trident")||-1!=Ha.indexOf("MSIE"),ab=-1!=Ha.indexOf("Gecko")&&-1==Ha.toLowerCase().indexOf("webkit")&&!(-1!=Ha.indexOf("Trident")||-1!=Ha.indexOf("MSIE")),bb=-1!=Ha.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Za&&aa.opera)return a=aa.opera.version,ha(a)?a():a;ab?b=/rv\:([^\);]+)(\)|;)/:$a?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:bb&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Ha))?a[1]:"");return $a&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var cb=null,db=null,eb=null;function fb(a,b){if(!fa(a))throw Error("encodeByteArray takes an array as a parameter");gb();for(var c=b?db:cb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,k=g?a[e+1]:0,l=e+2<a.length,m=l?a[e+2]:0,v=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|m>>6,m=m&63;l||(m=64,g||(k=64));d.push(c[v],c[f],c[k],c[m])}return d.join("")}
function gb(){if(!cb){cb={};db={};eb={};for(var a=0;65>a;a++)cb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),db[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),eb[db[a]]=a,62<=a&&(eb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function u(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function w(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function hb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function ib(a){var b={};hb(a,function(a,d){b[a]=d});return b};function jb(a){var b=[];hb(a,function(a,d){ea(d)?Oa(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""}function kb(a){var b={};a=a.replace(/^\?/,"").split("&");Oa(a,function(a){a&&(a=a.split("="),b[a[0]]=a[1])});return b};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function z(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function A(a,b,c,d){if((!d||n(c))&&!ha(c))throw Error(z(a,b,d)+"must be a valid function.");}function lb(a,b,c){if(n(c)&&(!ia(c)||null===c))throw Error(z(a,b,!0)+"must be a valid context object.");};function mb(a){return"undefined"!==typeof JSON&&n(JSON.parse)?JSON.parse(a):Aa(a)}function B(a){if("undefined"!==typeof JSON&&n(JSON.stringify))a=JSON.stringify(a);else{var b=[];Ca(new Ba,a,b);a=b.join("")}return a};function nb(){this.Sd=C}nb.prototype.j=function(a){return this.Sd.oa(a)};nb.prototype.toString=function(){return this.Sd.toString()};function ob(){}ob.prototype.pf=function(){return null};ob.prototype.xe=function(){return null};var pb=new ob;function qb(a,b,c){this.Qf=a;this.Ka=b;this.Hd=c}qb.prototype.pf=function(a){var b=this.Ka.D;if(rb(b,a))return b.j().M(a);b=null!=this.Hd?new sb(this.Hd,!0,!1):this.Ka.u();return this.Qf.Xa(a,b)};qb.prototype.xe=function(a,b,c){var d=null!=this.Hd?this.Hd:tb(this.Ka);a=this.Qf.me(d,b,1,c,a);return 0===a.length?null:a[0]};function ub(){this.tb=[]}function vb(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.Yb();null===c||f.Z(c.Yb())||(a.tb.push(c),c=null);null===c&&(c=new wb(f));c.add(e)}c&&a.tb.push(c)}function xb(a,b,c){vb(a,c);yb(a,function(a){return a.Z(b)})}function zb(a,b,c){vb(a,c);yb(a,function(a){return a.contains(b)||b.contains(a)})}
function yb(a,b){for(var c=!0,d=0;d<a.tb.length;d++){var e=a.tb[d];if(e)if(e=e.Yb(),b(e)){for(var e=a.tb[d],f=0;f<e.sd.length;f++){var g=e.sd[f];if(null!==g){e.sd[f]=null;var k=g.Ub();Ab&&Bb("event: "+g.toString());Cb(k)}}a.tb[d]=null}else c=!1}c&&(a.tb=[])}function wb(a){this.qa=a;this.sd=[]}wb.prototype.add=function(a){this.sd.push(a)};wb.prototype.Yb=function(){return this.qa};function D(a,b,c,d){this.type=a;this.Ja=b;this.Ya=c;this.Je=d;this.Nd=void 0}function Db(a){return new D(Eb,a)}var Eb="value";function Fb(a,b,c,d){this.te=b;this.Wd=c;this.Nd=d;this.rd=a}Fb.prototype.Yb=function(){var a=this.Wd.lc();return"value"===this.rd?a.path:a.parent().path};Fb.prototype.ye=function(){return this.rd};Fb.prototype.Ub=function(){return this.te.Ub(this)};Fb.prototype.toString=function(){return this.Yb().toString()+":"+this.rd+":"+B(this.Wd.lf())};function Gb(a,b,c){this.te=a;this.error=b;this.path=c}Gb.prototype.Yb=function(){return this.path};Gb.prototype.ye=function(){return"cancel"};
Gb.prototype.Ub=function(){return this.te.Ub(this)};Gb.prototype.toString=function(){return this.path.toString()+":cancel"};function sb(a,b,c){this.B=a;this.$=b;this.Tb=c}function Hb(a){return a.$}function rb(a,b){return a.$&&!a.Tb||a.B.Ha(b)}sb.prototype.j=function(){return this.B};function Ib(a){this.dg=a;this.Ad=null}Ib.prototype.get=function(){var a=this.dg.get(),b=xa(a);if(this.Ad)for(var c in this.Ad)b[c]-=this.Ad[c];this.Ad=a;return b};function Jb(a,b){this.Mf={};this.Yd=new Ib(a);this.ca=b;var c=1E4+2E4*Math.random();setTimeout(q(this.Hf,this),Math.floor(c))}Jb.prototype.Hf=function(){var a=this.Yd.get(),b={},c=!1,d;for(d in a)0<a[d]&&u(this.Mf,d)&&(b[d]=a[d],c=!0);c&&this.ca.Te(b);setTimeout(q(this.Hf,this),Math.floor(6E5*Math.random()))};function Kb(){this.Dc={}}function Lb(a,b,c){n(c)||(c=1);u(a.Dc,b)||(a.Dc[b]=0);a.Dc[b]+=c}Kb.prototype.get=function(){return xa(this.Dc)};var Mb={},Nb={};function Ob(a){a=a.toString();Mb[a]||(Mb[a]=new Kb);return Mb[a]}function Pb(a,b){var c=a.toString();Nb[c]||(Nb[c]=b());return Nb[c]};function E(a,b){this.name=a;this.S=b}function Qb(a,b){return new E(a,b)};function Rb(a,b){return Sb(a.name,b.name)}function Tb(a,b){return Sb(a,b)};function Ub(a,b,c){this.type=Vb;this.source=a;this.path=b;this.Ia=c}Ub.prototype.Wc=function(a){return this.path.e()?new Ub(this.source,F,this.Ia.M(a)):new Ub(this.source,G(this.path),this.Ia)};Ub.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ia.toString()+")"};function Wb(a,b){this.type=Xb;this.source=Yb;this.path=a;this.Ve=b}Wb.prototype.Wc=function(){return this.path.e()?this:new Wb(G(this.path),this.Ve)};Wb.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Ve+")"};function Zb(a,b){this.type=$b;this.source=a;this.path=b}Zb.prototype.Wc=function(){return this.path.e()?new Zb(this.source,F):new Zb(this.source,G(this.path))};Zb.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function ac(a,b){this.La=a;this.xa=b?b:bc}h=ac.prototype;h.Na=function(a,b){return new ac(this.La,this.xa.Na(a,b,this.La).X(null,null,!1,null,null))};h.remove=function(a){return new ac(this.La,this.xa.remove(a,this.La).X(null,null,!1,null,null))};h.get=function(a){for(var b,c=this.xa;!c.e();){b=this.La(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function cc(a,b){for(var c,d=a.xa,e=null;!d.e();){c=a.La(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}h.e=function(){return this.xa.e()};h.count=function(){return this.xa.count()};h.Rc=function(){return this.xa.Rc()};h.ec=function(){return this.xa.ec()};h.ha=function(a){return this.xa.ha(a)};
h.Wb=function(a){return new dc(this.xa,null,this.La,!1,a)};h.Xb=function(a,b){return new dc(this.xa,a,this.La,!1,b)};h.Zb=function(a,b){return new dc(this.xa,a,this.La,!0,b)};h.rf=function(a){return new dc(this.xa,null,this.La,!0,a)};function dc(a,b,c,d,e){this.Rd=e||null;this.Ee=d;this.Pa=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.Ee?a.left:a.right;else if(0===e){this.Pa.push(a);break}else this.Pa.push(a),a=this.Ee?a.right:a.left}
function H(a){if(0===a.Pa.length)return null;var b=a.Pa.pop(),c;c=a.Rd?a.Rd(b.key,b.value):{key:b.key,value:b.value};if(a.Ee)for(b=b.left;!b.e();)a.Pa.push(b),b=b.right;else for(b=b.right;!b.e();)a.Pa.push(b),b=b.left;return c}function ec(a){if(0===a.Pa.length)return null;var b;b=a.Pa;b=b[b.length-1];return a.Rd?a.Rd(b.key,b.value):{key:b.key,value:b.value}}function fc(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:bc;this.right=null!=e?e:bc}h=fc.prototype;
h.X=function(a,b,c,d,e){return new fc(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};h.count=function(){return this.left.count()+1+this.right.count()};h.e=function(){return!1};h.ha=function(a){return this.left.ha(a)||a(this.key,this.value)||this.right.ha(a)};function gc(a){return a.left.e()?a:gc(a.left)}h.Rc=function(){return gc(this).key};h.ec=function(){return this.right.e()?this.key:this.right.ec()};
h.Na=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.X(null,null,null,e.left.Na(a,b,c),null):0===d?e.X(null,b,null,null,null):e.X(null,null,null,null,e.right.Na(a,b,c));return hc(e)};function ic(a){if(a.left.e())return bc;a.left.fa()||a.left.left.fa()||(a=jc(a));a=a.X(null,null,null,ic(a.left),null);return hc(a)}
h.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.fa()||c.left.left.fa()||(c=jc(c)),c=c.X(null,null,null,c.left.remove(a,b),null);else{c.left.fa()&&(c=kc(c));c.right.e()||c.right.fa()||c.right.left.fa()||(c=lc(c),c.left.left.fa()&&(c=kc(c),c=lc(c)));if(0===b(a,c.key)){if(c.right.e())return bc;d=gc(c.right);c=c.X(d.key,d.value,null,null,ic(c.right))}c=c.X(null,null,null,null,c.right.remove(a,b))}return hc(c)};h.fa=function(){return this.color};
function hc(a){a.right.fa()&&!a.left.fa()&&(a=mc(a));a.left.fa()&&a.left.left.fa()&&(a=kc(a));a.left.fa()&&a.right.fa()&&(a=lc(a));return a}function jc(a){a=lc(a);a.right.left.fa()&&(a=a.X(null,null,null,null,kc(a.right)),a=mc(a),a=lc(a));return a}function mc(a){return a.right.X(null,null,a.color,a.X(null,null,!0,null,a.right.left),null)}function kc(a){return a.left.X(null,null,a.color,null,a.X(null,null,!0,a.left.right,null))}
function lc(a){return a.X(null,null,!a.color,a.left.X(null,null,!a.left.color,null,null),a.right.X(null,null,!a.right.color,null,null))}function nc(){}h=nc.prototype;h.X=function(){return this};h.Na=function(a,b){return new fc(a,b,null)};h.remove=function(){return this};h.count=function(){return 0};h.e=function(){return!0};h.ha=function(){return!1};h.Rc=function(){return null};h.ec=function(){return null};h.fa=function(){return!1};var bc=new nc;function oc(a,b){return a&&"object"===typeof a?(J(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function pc(a,b){var c=new qc;rc(a,new K(""),function(a,e){c.mc(a,sc(e,b))});return c}function sc(a,b){var c=a.A().K(),c=oc(c,b),d;if(a.N()){var e=oc(a.Ba(),b);return e!==a.Ba()||c!==a.A().K()?new tc(e,L(c)):a}d=a;c!==a.A().K()&&(d=d.da(new tc(c)));a.U(M,function(a,c){var e=sc(c,b);e!==c&&(d=d.Q(a,e))});return d};function K(a,b){if(1==arguments.length){this.n=a.split("/");for(var c=0,d=0;d<this.n.length;d++)0<this.n[d].length&&(this.n[c]=this.n[d],c++);this.n.length=c;this.Y=0}else this.n=a,this.Y=b}function N(a,b){var c=O(a);if(null===c)return b;if(c===O(b))return N(G(a),G(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}function O(a){return a.Y>=a.n.length?null:a.n[a.Y]}function uc(a){return a.n.length-a.Y}
function G(a){var b=a.Y;b<a.n.length&&b++;return new K(a.n,b)}function vc(a){return a.Y<a.n.length?a.n[a.n.length-1]:null}h=K.prototype;h.toString=function(){for(var a="",b=this.Y;b<this.n.length;b++)""!==this.n[b]&&(a+="/"+this.n[b]);return a||"/"};h.slice=function(a){return this.n.slice(this.Y+(a||0))};h.parent=function(){if(this.Y>=this.n.length)return null;for(var a=[],b=this.Y;b<this.n.length-1;b++)a.push(this.n[b]);return new K(a,0)};
h.w=function(a){for(var b=[],c=this.Y;c<this.n.length;c++)b.push(this.n[c]);if(a instanceof K)for(c=a.Y;c<a.n.length;c++)b.push(a.n[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new K(b,0)};h.e=function(){return this.Y>=this.n.length};h.Z=function(a){if(uc(this)!==uc(a))return!1;for(var b=this.Y,c=a.Y;b<=this.n.length;b++,c++)if(this.n[b]!==a.n[c])return!1;return!0};
h.contains=function(a){var b=this.Y,c=a.Y;if(uc(this)>uc(a))return!1;for(;b<this.n.length;){if(this.n[b]!==a.n[c])return!1;++b;++c}return!0};var F=new K("");function wc(a,b){this.Qa=a.slice();this.Ea=Math.max(1,this.Qa.length);this.kf=b;for(var c=0;c<this.Qa.length;c++)this.Ea+=xc(this.Qa[c]);yc(this)}wc.prototype.push=function(a){0<this.Qa.length&&(this.Ea+=1);this.Qa.push(a);this.Ea+=xc(a);yc(this)};wc.prototype.pop=function(){var a=this.Qa.pop();this.Ea-=xc(a);0<this.Qa.length&&--this.Ea};
function yc(a){if(768<a.Ea)throw Error(a.kf+"has a key path longer than 768 bytes ("+a.Ea+").");if(32<a.Qa.length)throw Error(a.kf+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+zc(a));}function zc(a){return 0==a.Qa.length?"":"in property '"+a.Qa.join(".")+"'"};function Ac(){this.wc={}}Ac.prototype.set=function(a,b){null==b?delete this.wc[a]:this.wc[a]=b};Ac.prototype.get=function(a){return u(this.wc,a)?this.wc[a]:null};Ac.prototype.remove=function(a){delete this.wc[a]};Ac.prototype.uf=!0;function Bc(a){this.Ec=a;this.Md="firebase:"}h=Bc.prototype;h.set=function(a,b){null==b?this.Ec.removeItem(this.Md+a):this.Ec.setItem(this.Md+a,B(b))};h.get=function(a){a=this.Ec.getItem(this.Md+a);return null==a?null:mb(a)};h.remove=function(a){this.Ec.removeItem(this.Md+a)};h.uf=!1;h.toString=function(){return this.Ec.toString()};function Cc(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new Bc(b)}}catch(c){}return new Ac}var Dc=Cc("localStorage"),P=Cc("sessionStorage");function Ec(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.lb=b;this.Cb=c;this.Tg=d;this.Ld=e||"";this.Oa=Dc.get("host:"+a)||this.host}function Fc(a,b){b!==a.Oa&&(a.Oa=b,"s-"===a.Oa.substr(0,2)&&Dc.set("host:"+a.host,a.Oa))}Ec.prototype.toString=function(){var a=(this.lb?"https://":"http://")+this.host;this.Ld&&(a+="<"+this.Ld+">");return a};var Gc=function(){var a=1;return function(){return a++}}();function J(a,b){if(!a)throw Hc(b);}function Hc(a){return Error("Firebase (2.2.5) INTERNAL ASSERT FAILED: "+a)}
function Ic(a){try{var b;if("undefined"!==typeof atob)b=atob(a);else{gb();for(var c=eb,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],g=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var l=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==g||null==k||null==l)throw Error();d.push(f<<2|g>>4);64!=k&&(d.push(g<<4&240|k>>2),64!=l&&d.push(k<<6&192|l))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Wa(d,c,
c+8192));b=a}}return b}catch(m){Bb("base64Decode failed: ",m)}return null}function Jc(a){var b=Kc(a);a=new La;a.update(b);var b=[],c=8*a.be;56>a.$b?a.update(a.Id,56-a.$b):a.update(a.Id,a.Wa-(a.$b-56));for(var d=a.Wa-1;56<=d;d--)a.le[d]=c&255,c/=256;Ma(a,a.le);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.R[d]>>e&255,++c;return fb(b)}
function Lc(a){for(var b="",c=0;c<arguments.length;c++)b=fa(arguments[c])?b+Lc.apply(null,arguments[c]):"object"===typeof arguments[c]?b+B(arguments[c]):b+arguments[c],b+=" ";return b}var Ab=null,Mc=!0;function Bb(a){!0===Mc&&(Mc=!1,null===Ab&&!0===P.get("logging_enabled")&&Nc(!0));if(Ab){var b=Lc.apply(null,arguments);Ab(b)}}function Oc(a){return function(){Bb(a,arguments)}}
function Pc(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Lc.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function Qc(a){var b=Lc.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function Q(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Lc.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function Rc(a){var b="",c="",d="",e="",f=!0,g="https",k=443;if(p(a)){var l=a.indexOf("//");0<=l&&(g=a.substring(0,l-1),a=a.substring(l+2));l=a.indexOf("/");-1===l&&(l=a.length);b=a.substring(0,l);e="";a=a.substring(l).split("/");for(l=0;l<a.length;l++)if(0<a[l].length){var m=a[l];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(v){}e+="/"+m}a=b.split(".");3===a.length?(c=a[1],d=a[0].toLowerCase()):2===a.length&&(c=a[0]);l=b.indexOf(":");0<=l&&(f="https"===g||"wss"===g,k=b.substring(l+1),isFinite(k)&&
(k=String(k)),k=p(k)?/^\s*-?0x/i.test(k)?parseInt(k,16):parseInt(k,10):NaN)}return{host:b,port:k,domain:c,Qg:d,lb:f,scheme:g,Zc:e}}function Sc(a){return ga(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function Tc(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function Sb(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=Uc(a),d=Uc(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function Vc(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+B(b));}
function Wc(a){if("object"!==typeof a||null===a)return B(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=B(b[d]),c+=":",c+=Wc(a[b[d]]);return c+"}"}function Xc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function Yc(a,b){if(ea(a))for(var c=0;c<a.length;++c)b(c,a[c]);else r(a,b)}
function Zc(a){J(!Sc(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var $c=/^-?\d{1,10}$/;function Uc(a){return $c.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function Cb(a){try{a()}catch(b){setTimeout(function(){Q("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function R(a,b){if(ha(a)){var c=Array.prototype.slice.call(arguments,1).slice();Cb(function(){a.apply(null,c)})}};function Kc(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,J(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function xc(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function ad(a){var b={},c={},d={},e="";try{var f=a.split("."),b=mb(Ic(f[0])||""),c=mb(Ic(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{Wg:b,Ac:c,data:d,Ng:e}}function bd(a){a=ad(a).Ac;return"object"===typeof a&&a.hasOwnProperty("iat")?w(a,"iat"):null}function cd(a){a=ad(a);var b=a.Ac;return!!a.Ng&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function dd(a){this.V=a;this.g=a.o.g}function ed(a,b,c,d){var e=[],f=[];Oa(b,function(b){"child_changed"===b.type&&a.g.xd(b.Je,b.Ja)&&f.push(new D("child_moved",b.Ja,b.Ya))});fd(a,e,"child_removed",b,d,c);fd(a,e,"child_added",b,d,c);fd(a,e,"child_moved",f,d,c);fd(a,e,"child_changed",b,d,c);fd(a,e,Eb,b,d,c);return e}function fd(a,b,c,d,e,f){d=Pa(d,function(a){return a.type===c});Xa(d,q(a.eg,a));Oa(d,function(c){var d=gd(a,c,f);Oa(e,function(e){e.Jf(c.type)&&b.push(e.createEvent(d,a.V))})})}
function gd(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Nd=c.qf(b.Ya,b.Ja,a.g));return b}dd.prototype.eg=function(a,b){if(null==a.Ya||null==b.Ya)throw Hc("Should only compare child_ events.");return this.g.compare(new E(a.Ya,a.Ja),new E(b.Ya,b.Ja))};function hd(){this.eb={}}
function id(a,b){var c=b.type,d=b.Ya;J("child_added"==c||"child_changed"==c||"child_removed"==c,"Only child changes supported for tracking");J(".priority"!==d,"Only non-priority child changes can be tracked.");var e=w(a.eb,d);if(e){var f=e.type;if("child_added"==c&&"child_removed"==f)a.eb[d]=new D("child_changed",b.Ja,d,e.Ja);else if("child_removed"==c&&"child_added"==f)delete a.eb[d];else if("child_removed"==c&&"child_changed"==f)a.eb[d]=new D("child_removed",e.Je,d);else if("child_changed"==c&&
"child_added"==f)a.eb[d]=new D("child_added",b.Ja,d);else if("child_changed"==c&&"child_changed"==f)a.eb[d]=new D("child_changed",b.Ja,d,e.Je);else throw Hc("Illegal combination of changes: "+b+" occurred after "+e);}else a.eb[d]=b};function jd(a,b,c){this.Pb=a;this.qb=b;this.sb=c||null}h=jd.prototype;h.Jf=function(a){return"value"===a};h.createEvent=function(a,b){var c=b.o.g;return new Fb("value",this,new S(a.Ja,b.lc(),c))};h.Ub=function(a){var b=this.sb;if("cancel"===a.ye()){J(this.qb,"Raising a cancel event on a listener with no cancel callback");var c=this.qb;return function(){c.call(b,a.error)}}var d=this.Pb;return function(){d.call(b,a.Wd)}};h.ff=function(a,b){return this.qb?new Gb(this,a,b):null};
h.matches=function(a){return a instanceof jd?a.Pb&&this.Pb?a.Pb===this.Pb&&a.sb===this.sb:!0:!1};h.sf=function(){return null!==this.Pb};function kd(a,b,c){this.ga=a;this.qb=b;this.sb=c}h=kd.prototype;h.Jf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ga};h.ff=function(a,b){return this.qb?new Gb(this,a,b):null};
h.createEvent=function(a,b){J(null!=a.Ya,"Child events should have a childName.");var c=b.lc().w(a.Ya);return new Fb(a.type,this,new S(a.Ja,c,b.o.g),a.Nd)};h.Ub=function(a){var b=this.sb;if("cancel"===a.ye()){J(this.qb,"Raising a cancel event on a listener with no cancel callback");var c=this.qb;return function(){c.call(b,a.error)}}var d=this.ga[a.rd];return function(){d.call(b,a.Wd,a.Nd)}};
h.matches=function(a){if(a instanceof kd){if(!this.ga||!a.ga)return!0;if(this.sb===a.sb){var b=pa(a.ga);if(b===pa(this.ga)){if(1===b){var b=qa(a.ga),c=qa(this.ga);return c===b&&(!a.ga[b]||!this.ga[c]||a.ga[b]===this.ga[c])}return oa(this.ga,function(b,c){return a.ga[c]===b})}}}return!1};h.sf=function(){return null!==this.ga};function ld(a){this.g=a}h=ld.prototype;h.G=function(a,b,c,d,e){J(a.Ic(this.g),"A node must be indexed if only a child is updated");d=a.M(b);if(d.Z(c))return a;null!=e&&(c.e()?a.Ha(b)?id(e,new D("child_removed",d,b)):J(a.N(),"A child remove without an old child only makes sense on a leaf node"):d.e()?id(e,new D("child_added",c,b)):id(e,new D("child_changed",c,b,d)));return a.N()&&c.e()?a:a.Q(b,c).mb(this.g)};
h.ta=function(a,b,c){null!=c&&(a.N()||a.U(M,function(a,e){b.Ha(a)||id(c,new D("child_removed",e,a))}),b.N()||b.U(M,function(b,e){if(a.Ha(b)){var f=a.M(b);f.Z(e)||id(c,new D("child_changed",e,b,f))}else id(c,new D("child_added",e,b))}));return b.mb(this.g)};h.da=function(a,b){return a.e()?C:a.da(b)};h.Ga=function(){return!1};h.Vb=function(){return this};function md(a){this.Ae=new ld(a.g);this.g=a.g;var b;a.la?(b=nd(a),b=a.g.Oc(od(a),b)):b=a.g.Sc();this.dd=b;a.na?(b=pd(a),a=a.g.Oc(qd(a),b)):a=a.g.Pc();this.Fc=a}h=md.prototype;h.matches=function(a){return 0>=this.g.compare(this.dd,a)&&0>=this.g.compare(a,this.Fc)};h.G=function(a,b,c,d,e){this.matches(new E(b,c))||(c=C);return this.Ae.G(a,b,c,d,e)};h.ta=function(a,b,c){b.N()&&(b=C);var d=b.mb(this.g),d=d.da(C),e=this;b.U(M,function(a,b){e.matches(new E(a,b))||(d=d.Q(a,C))});return this.Ae.ta(a,d,c)};
h.da=function(a){return a};h.Ga=function(){return!0};h.Vb=function(){return this.Ae};function rd(a){this.ra=new md(a);this.g=a.g;J(a.ia,"Only valid if limit has been set");this.ja=a.ja;this.Jb=!sd(a)}h=rd.prototype;h.G=function(a,b,c,d,e){this.ra.matches(new E(b,c))||(c=C);return a.M(b).Z(c)?a:a.Db()<this.ja?this.ra.Vb().G(a,b,c,d,e):td(this,a,b,c,d,e)};
h.ta=function(a,b,c){var d;if(b.N()||b.e())d=C.mb(this.g);else if(2*this.ja<b.Db()&&b.Ic(this.g)){d=C.mb(this.g);b=this.Jb?b.Zb(this.ra.Fc,this.g):b.Xb(this.ra.dd,this.g);for(var e=0;0<b.Pa.length&&e<this.ja;){var f=H(b),g;if(g=this.Jb?0>=this.g.compare(this.ra.dd,f):0>=this.g.compare(f,this.ra.Fc))d=d.Q(f.name,f.S),e++;else break}}else{d=b.mb(this.g);d=d.da(C);var k,l,m;if(this.Jb){b=d.rf(this.g);k=this.ra.Fc;l=this.ra.dd;var v=ud(this.g);m=function(a,b){return v(b,a)}}else b=d.Wb(this.g),k=this.ra.dd,
l=this.ra.Fc,m=ud(this.g);for(var e=0,y=!1;0<b.Pa.length;)f=H(b),!y&&0>=m(k,f)&&(y=!0),(g=y&&e<this.ja&&0>=m(f,l))?e++:d=d.Q(f.name,C)}return this.ra.Vb().ta(a,d,c)};h.da=function(a){return a};h.Ga=function(){return!0};h.Vb=function(){return this.ra.Vb()};
function td(a,b,c,d,e,f){var g;if(a.Jb){var k=ud(a.g);g=function(a,b){return k(b,a)}}else g=ud(a.g);J(b.Db()==a.ja,"");var l=new E(c,d),m=a.Jb?wd(b,a.g):xd(b,a.g),v=a.ra.matches(l);if(b.Ha(c)){var y=b.M(c),m=e.xe(a.g,m,a.Jb);null!=m&&m.name==c&&(m=e.xe(a.g,m,a.Jb));e=null==m?1:g(m,l);if(v&&!d.e()&&0<=e)return null!=f&&id(f,new D("child_changed",d,c,y)),b.Q(c,d);null!=f&&id(f,new D("child_removed",y,c));b=b.Q(c,C);return null!=m&&a.ra.matches(m)?(null!=f&&id(f,new D("child_added",m.S,m.name)),b.Q(m.name,
m.S)):b}return d.e()?b:v&&0<=g(m,l)?(null!=f&&(id(f,new D("child_removed",m.S,m.name)),id(f,new D("child_added",d,c))),b.Q(c,d).Q(m.name,C)):b};function yd(a,b){this.he=a;this.cg=b}function zd(a){this.I=a}
zd.prototype.bb=function(a,b,c,d){var e=new hd,f;if(b.type===Vb)b.source.ve?c=Ad(this,a,b.path,b.Ia,c,d,e):(J(b.source.of,"Unknown source."),f=b.source.af,c=Bd(this,a,b.path,b.Ia,c,d,f,e));else if(b.type===Cd)b.source.ve?c=Dd(this,a,b.path,b.children,c,d,e):(J(b.source.of,"Unknown source."),f=b.source.af,c=Ed(this,a,b.path,b.children,c,d,f,e));else if(b.type===Xb)if(b.Ve)if(f=b.path,null!=c.sc(f))c=a;else{b=new qb(c,a,d);d=a.D.j();if(f.e()||".priority"===O(f))Hb(a.u())?b=c.ua(tb(a)):(b=a.u().j(),
J(b instanceof T,"serverChildren would be complete if leaf node"),b=c.xc(b)),b=this.I.ta(d,b,e);else{f=O(f);var g=c.Xa(f,a.u());null==g&&rb(a.u(),f)&&(g=d.M(f));b=null!=g?this.I.G(d,f,g,b,e):a.D.j().Ha(f)?this.I.G(d,f,C,b,e):d;b.e()&&Hb(a.u())&&(d=c.ua(tb(a)),d.N()&&(b=this.I.ta(b,d,e)))}d=Hb(a.u())||null!=c.sc(F);c=Fd(a,b,d,this.I.Ga())}else c=Gd(this,a,b.path,c,d,e);else if(b.type===$b)d=b.path,b=a.u(),f=b.j(),g=b.$||d.e(),c=Hd(this,new Id(a.D,new sb(f,g,b.Tb)),d,c,pb,e);else throw Hc("Unknown operation type: "+
b.type);e=ra(e.eb);d=c;b=d.D;b.$&&(f=b.j().N()||b.j().e(),g=Jd(a),(0<e.length||!a.D.$||f&&!b.j().Z(g)||!b.j().A().Z(g.A()))&&e.push(Db(Jd(d))));return new yd(c,e)};
function Hd(a,b,c,d,e,f){var g=b.D;if(null!=d.sc(c))return b;var k;if(c.e())J(Hb(b.u()),"If change path is empty, we must have complete server data"),b.u().Tb?(e=tb(b),d=d.xc(e instanceof T?e:C)):d=d.ua(tb(b)),f=a.I.ta(b.D.j(),d,f);else{var l=O(c);if(".priority"==l)J(1==uc(c),"Can't have a priority with additional path components"),f=g.j(),k=b.u().j(),d=d.hd(c,f,k),f=null!=d?a.I.da(f,d):g.j();else{var m=G(c);rb(g,l)?(k=b.u().j(),d=d.hd(c,g.j(),k),d=null!=d?g.j().M(l).G(m,d):g.j().M(l)):d=d.Xa(l,b.u());
f=null!=d?a.I.G(g.j(),l,d,e,f):g.j()}}return Fd(b,f,g.$||c.e(),a.I.Ga())}function Bd(a,b,c,d,e,f,g,k){var l=b.u();g=g?a.I:a.I.Vb();if(c.e())d=g.ta(l.j(),d,null);else if(g.Ga()&&!l.Tb)d=l.j().G(c,d),d=g.ta(l.j(),d,null);else{var m=O(c);if((c.e()?!l.$||l.Tb:!rb(l,O(c)))&&1<uc(c))return b;d=l.j().M(m).G(G(c),d);d=".priority"==m?g.da(l.j(),d):g.G(l.j(),m,d,pb,null)}l=l.$||c.e();b=new Id(b.D,new sb(d,l,g.Ga()));return Hd(a,b,c,e,new qb(e,b,f),k)}
function Ad(a,b,c,d,e,f,g){var k=b.D;e=new qb(e,b,f);if(c.e())g=a.I.ta(b.D.j(),d,g),a=Fd(b,g,!0,a.I.Ga());else if(f=O(c),".priority"===f)g=a.I.da(b.D.j(),d),a=Fd(b,g,k.$,k.Tb);else{var l=G(c);c=k.j().M(f);if(!l.e()){var m=e.pf(f);d=null!=m?".priority"===vc(l)&&m.oa(l.parent()).e()?m:m.G(l,d):C}c.Z(d)?a=b:(g=a.I.G(k.j(),f,d,e,g),a=Fd(b,g,k.$,a.I.Ga()))}return a}
function Dd(a,b,c,d,e,f,g){var k=b;Kd(d,function(d,m){var v=c.w(d);rb(b.D,O(v))&&(k=Ad(a,k,v,m,e,f,g))});Kd(d,function(d,m){var v=c.w(d);rb(b.D,O(v))||(k=Ad(a,k,v,m,e,f,g))});return k}function Ld(a,b){Kd(b,function(b,d){a=a.G(b,d)});return a}
function Ed(a,b,c,d,e,f,g,k){if(b.u().j().e()&&!Hb(b.u()))return b;var l=b;c=c.e()?d:Md(Nd,c,d);var m=b.u().j();c.children.ha(function(c,d){if(m.Ha(c)){var I=b.u().j().M(c),I=Ld(I,d);l=Bd(a,l,new K(c),I,e,f,g,k)}});c.children.ha(function(c,d){var I=!Hb(b.u())&&null==d.value;m.Ha(c)||I||(I=b.u().j().M(c),I=Ld(I,d),l=Bd(a,l,new K(c),I,e,f,g,k))});return l}
function Gd(a,b,c,d,e,f){if(null!=d.sc(c))return b;var g=new qb(d,b,e),k=e=b.D.j();if(Hb(b.u())){if(c.e())e=d.ua(tb(b)),k=a.I.ta(b.D.j(),e,f);else if(".priority"===O(c)){var l=d.Xa(O(c),b.u());null==l||e.e()||e.A().Z(l)||(k=a.I.da(e,l))}else l=O(c),e=d.Xa(l,b.u()),null!=e&&(k=a.I.G(b.D.j(),l,e,g,f));e=!0}else if(b.D.$||c.e())k=e,e=b.D.j(),e.N()||e.U(M,function(c){var e=d.Xa(c,b.u());null!=e&&(k=a.I.G(k,c,e,g,f))}),e=b.D.$;else{l=O(c);if(1==uc(c)||rb(b.D,l))c=d.Xa(l,b.u()),null!=c&&(k=a.I.G(e,l,c,
g,f));e=!1}return Fd(b,k,e,a.I.Ga())};function Od(){}var Pd={};function ud(a){return q(a.compare,a)}Od.prototype.xd=function(a,b){return 0!==this.compare(new E("[MIN_NAME]",a),new E("[MIN_NAME]",b))};Od.prototype.Sc=function(){return Qd};function Rd(a){this.bc=a}ma(Rd,Od);h=Rd.prototype;h.Hc=function(a){return!a.M(this.bc).e()};h.compare=function(a,b){var c=a.S.M(this.bc),d=b.S.M(this.bc),c=c.Cc(d);return 0===c?Sb(a.name,b.name):c};h.Oc=function(a,b){var c=L(a),c=C.Q(this.bc,c);return new E(b,c)};
h.Pc=function(){var a=C.Q(this.bc,Sd);return new E("[MAX_NAME]",a)};h.toString=function(){return this.bc};function Td(){}ma(Td,Od);h=Td.prototype;h.compare=function(a,b){var c=a.S.A(),d=b.S.A(),c=c.Cc(d);return 0===c?Sb(a.name,b.name):c};h.Hc=function(a){return!a.A().e()};h.xd=function(a,b){return!a.A().Z(b.A())};h.Sc=function(){return Qd};h.Pc=function(){return new E("[MAX_NAME]",new tc("[PRIORITY-POST]",Sd))};h.Oc=function(a,b){var c=L(a);return new E(b,new tc("[PRIORITY-POST]",c))};
h.toString=function(){return".priority"};var M=new Td;function Ud(){}ma(Ud,Od);h=Ud.prototype;h.compare=function(a,b){return Sb(a.name,b.name)};h.Hc=function(){throw Hc("KeyIndex.isDefinedOn not expected to be called.");};h.xd=function(){return!1};h.Sc=function(){return Qd};h.Pc=function(){return new E("[MAX_NAME]",C)};h.Oc=function(a){J(p(a),"KeyIndex indexValue must always be a string.");return new E(a,C)};h.toString=function(){return".key"};var Vd=new Ud;function Wd(){}ma(Wd,Od);h=Wd.prototype;
h.compare=function(a,b){var c=a.S.Cc(b.S);return 0===c?Sb(a.name,b.name):c};h.Hc=function(){return!0};h.xd=function(a,b){return!a.Z(b)};h.Sc=function(){return Qd};h.Pc=function(){return Xd};h.Oc=function(a,b){var c=L(a);return new E(b,c)};h.toString=function(){return".value"};var Yd=new Wd;function Zd(){this.Rb=this.na=this.Lb=this.la=this.ia=!1;this.ja=0;this.Nb="";this.dc=null;this.xb="";this.ac=null;this.vb="";this.g=M}var $d=new Zd;function sd(a){return""===a.Nb?a.la:"l"===a.Nb}function od(a){J(a.la,"Only valid if start has been set");return a.dc}function nd(a){J(a.la,"Only valid if start has been set");return a.Lb?a.xb:"[MIN_NAME]"}function qd(a){J(a.na,"Only valid if end has been set");return a.ac}
function pd(a){J(a.na,"Only valid if end has been set");return a.Rb?a.vb:"[MAX_NAME]"}function ae(a){var b=new Zd;b.ia=a.ia;b.ja=a.ja;b.la=a.la;b.dc=a.dc;b.Lb=a.Lb;b.xb=a.xb;b.na=a.na;b.ac=a.ac;b.Rb=a.Rb;b.vb=a.vb;b.g=a.g;return b}h=Zd.prototype;h.Ge=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="";return b};h.He=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="l";return b};h.Ie=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="r";return b};
h.Xd=function(a,b){var c=ae(this);c.la=!0;n(a)||(a=null);c.dc=a;null!=b?(c.Lb=!0,c.xb=b):(c.Lb=!1,c.xb="");return c};h.qd=function(a,b){var c=ae(this);c.na=!0;n(a)||(a=null);c.ac=a;n(b)?(c.Rb=!0,c.vb=b):(c.Yg=!1,c.vb="");return c};function be(a,b){var c=ae(a);c.g=b;return c}function ce(a){var b={};a.la&&(b.sp=a.dc,a.Lb&&(b.sn=a.xb));a.na&&(b.ep=a.ac,a.Rb&&(b.en=a.vb));if(a.ia){b.l=a.ja;var c=a.Nb;""===c&&(c=sd(a)?"l":"r");b.vf=c}a.g!==M&&(b.i=a.g.toString());return b}
function de(a){return!(a.la||a.na||a.ia)}function ee(a){var b={};if(de(a)&&a.g==M)return b;var c;a.g===M?c="$priority":a.g===Yd?c="$value":a.g===Vd?c="$key":(J(a.g instanceof Rd,"Unrecognized index type!"),c=a.g.toString());b.orderBy=B(c);a.la&&(b.startAt=B(a.dc),a.Lb&&(b.startAt+=","+B(a.xb)));a.na&&(b.endAt=B(a.ac),a.Rb&&(b.endAt+=","+B(a.vb)));a.ia&&(sd(a)?b.limitToFirst=a.ja:b.limitToLast=a.ja);return b}h.toString=function(){return B(ce(this))};function fe(a,b){this.yd=a;this.cc=b}fe.prototype.get=function(a){var b=w(this.yd,a);if(!b)throw Error("No index defined for "+a);return b===Pd?null:b};function ge(a,b,c){var d=na(a.yd,function(d,f){var g=w(a.cc,f);J(g,"Missing index implementation for "+f);if(d===Pd){if(g.Hc(b.S)){for(var k=[],l=c.Wb(Qb),m=H(l);m;)m.name!=b.name&&k.push(m),m=H(l);k.push(b);return he(k,ud(g))}return Pd}g=c.get(b.name);k=d;g&&(k=k.remove(new E(b.name,g)));return k.Na(b,b.S)});return new fe(d,a.cc)}
function ie(a,b,c){var d=na(a.yd,function(a){if(a===Pd)return a;var d=c.get(b.name);return d?a.remove(new E(b.name,d)):a});return new fe(d,a.cc)}var je=new fe({".priority":Pd},{".priority":M});function tc(a,b){this.C=a;J(n(this.C)&&null!==this.C,"LeafNode shouldn't be created with null/undefined value.");this.ba=b||C;ke(this.ba);this.Bb=null}h=tc.prototype;h.N=function(){return!0};h.A=function(){return this.ba};h.da=function(a){return new tc(this.C,a)};h.M=function(a){return".priority"===a?this.ba:C};h.oa=function(a){return a.e()?this:".priority"===O(a)?this.ba:C};h.Ha=function(){return!1};h.qf=function(){return null};
h.Q=function(a,b){return".priority"===a?this.da(b):b.e()&&".priority"!==a?this:C.Q(a,b).da(this.ba)};h.G=function(a,b){var c=O(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;J(".priority"!==c||1===uc(a),".priority must be the last token in a path");return this.Q(c,C.G(G(a),b))};h.e=function(){return!1};h.Db=function(){return 0};h.K=function(a){return a&&!this.A().e()?{".value":this.Ba(),".priority":this.A().K()}:this.Ba()};
h.hash=function(){if(null===this.Bb){var a="";this.ba.e()||(a+="priority:"+le(this.ba.K())+":");var b=typeof this.C,a=a+(b+":"),a="number"===b?a+Zc(this.C):a+this.C;this.Bb=Jc(a)}return this.Bb};h.Ba=function(){return this.C};h.Cc=function(a){if(a===C)return 1;if(a instanceof T)return-1;J(a.N(),"Unknown node type");var b=typeof a.C,c=typeof this.C,d=Na(me,b),e=Na(me,c);J(0<=d,"Unknown leaf type: "+b);J(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.C<a.C?-1:this.C===a.C?0:1:e-d};
var me=["object","boolean","number","string"];tc.prototype.mb=function(){return this};tc.prototype.Ic=function(){return!0};tc.prototype.Z=function(a){return a===this?!0:a.N()?this.C===a.C&&this.ba.Z(a.ba):!1};tc.prototype.toString=function(){return B(this.K(!0))};function T(a,b,c){this.m=a;(this.ba=b)&&ke(this.ba);a.e()&&J(!this.ba||this.ba.e(),"An empty node cannot have a priority");this.wb=c;this.Bb=null}h=T.prototype;h.N=function(){return!1};h.A=function(){return this.ba||C};h.da=function(a){return this.m.e()?this:new T(this.m,a,this.wb)};h.M=function(a){if(".priority"===a)return this.A();a=this.m.get(a);return null===a?C:a};h.oa=function(a){var b=O(a);return null===b?this:this.M(b).oa(G(a))};h.Ha=function(a){return null!==this.m.get(a)};
h.Q=function(a,b){J(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.da(b);var c=new E(a,b),d,e;b.e()?(d=this.m.remove(a),c=ie(this.wb,c,this.m)):(d=this.m.Na(a,b),c=ge(this.wb,c,this.m));e=d.e()?C:this.ba;return new T(d,e,c)};h.G=function(a,b){var c=O(a);if(null===c)return b;J(".priority"!==O(a)||1===uc(a),".priority must be the last token in a path");var d=this.M(c).G(G(a),b);return this.Q(c,d)};h.e=function(){return this.m.e()};h.Db=function(){return this.m.count()};
var ne=/^(0|[1-9]\d*)$/;h=T.prototype;h.K=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.U(M,function(f,g){b[f]=g.K(a);c++;e&&ne.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&!this.A().e()&&(b[".priority"]=this.A().K());return b};h.hash=function(){if(null===this.Bb){var a="";this.A().e()||(a+="priority:"+le(this.A().K())+":");this.U(M,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Bb=""===a?"":Jc(a)}return this.Bb};
h.qf=function(a,b,c){return(c=oe(this,c))?(a=cc(c,new E(a,b)))?a.name:null:cc(this.m,a)};function wd(a,b){var c;c=(c=oe(a,b))?(c=c.Rc())&&c.name:a.m.Rc();return c?new E(c,a.m.get(c)):null}function xd(a,b){var c;c=(c=oe(a,b))?(c=c.ec())&&c.name:a.m.ec();return c?new E(c,a.m.get(c)):null}h.U=function(a,b){var c=oe(this,a);return c?c.ha(function(a){return b(a.name,a.S)}):this.m.ha(b)};h.Wb=function(a){return this.Xb(a.Sc(),a)};
h.Xb=function(a,b){var c=oe(this,b);if(c)return c.Xb(a,function(a){return a});for(var c=this.m.Xb(a.name,Qb),d=ec(c);null!=d&&0>b.compare(d,a);)H(c),d=ec(c);return c};h.rf=function(a){return this.Zb(a.Pc(),a)};h.Zb=function(a,b){var c=oe(this,b);if(c)return c.Zb(a,function(a){return a});for(var c=this.m.Zb(a.name,Qb),d=ec(c);null!=d&&0<b.compare(d,a);)H(c),d=ec(c);return c};h.Cc=function(a){return this.e()?a.e()?0:-1:a.N()||a.e()?1:a===Sd?-1:0};
h.mb=function(a){if(a===Vd||ta(this.wb.cc,a.toString()))return this;var b=this.wb,c=this.m;J(a!==Vd,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.Wb(Qb),f=H(c);f;)e=e||a.Hc(f.S),d.push(f),f=H(c);d=e?he(d,ud(a)):Pd;e=a.toString();c=xa(b.cc);c[e]=a;a=xa(b.yd);a[e]=d;return new T(this.m,this.ba,new fe(a,c))};h.Ic=function(a){return a===Vd||ta(this.wb.cc,a.toString())};
h.Z=function(a){if(a===this)return!0;if(a.N())return!1;if(this.A().Z(a.A())&&this.m.count()===a.m.count()){var b=this.Wb(M);a=a.Wb(M);for(var c=H(b),d=H(a);c&&d;){if(c.name!==d.name||!c.S.Z(d.S))return!1;c=H(b);d=H(a)}return null===c&&null===d}return!1};function oe(a,b){return b===Vd?null:a.wb.get(b.toString())}h.toString=function(){return B(this.K(!0))};function L(a,b){if(null===a)return C;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);J(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new tc(a,L(c));if(a instanceof Array){var d=C,e=a;r(e,function(a,b){if(u(e,b)&&"."!==b.substring(0,1)){var c=L(a);if(c.N()||!c.e())d=
d.Q(b,c)}});return d.da(L(c))}var f=[],g=!1,k=a;hb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=L(k[a]);b.e()||(g=g||!b.A().e(),f.push(new E(a,b)))}});if(0==f.length)return C;var l=he(f,Rb,function(a){return a.name},Tb);if(g){var m=he(f,ud(M));return new T(l,L(c),new fe({".priority":m},{".priority":M}))}return new T(l,L(c),je)}var pe=Math.log(2);
function qe(a){this.count=parseInt(Math.log(a+1)/pe,10);this.hf=this.count-1;this.bg=a+1&parseInt(Array(this.count+1).join("1"),2)}function re(a){var b=!(a.bg&1<<a.hf);a.hf--;return b}
function he(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var m=a[b],v=c?c(m):m;return new fc(v,m.S,!1,null,null)}var m=parseInt(f/2,10)+b,f=e(b,m),y=e(m+1,d),m=a[m],v=c?c(m):m;return new fc(v,m.S,!1,f,y)}a.sort(b);var f=function(b){function d(b,g){var k=v-b,y=v;v-=b;var y=e(k+1,y),k=a[k],I=c?c(k):k,y=new fc(I,k.S,g,null,y);f?f.left=y:m=y;f=y}for(var f=null,m=null,v=a.length,y=0;y<b.count;++y){var I=re(b),vd=Math.pow(2,b.count-(y+1));I?d(vd,!1):(d(vd,!1),d(vd,!0))}return m}(new qe(a.length));
return null!==f?new ac(d||b,f):new ac(d||b)}function le(a){return"number"===typeof a?"number:"+Zc(a):"string:"+a}function ke(a){if(a.N()){var b=a.K();J("string"===typeof b||"number"===typeof b||"object"===typeof b&&u(b,".sv"),"Priority must be a string or number.")}else J(a===Sd||a.e(),"priority of unexpected type.");J(a===Sd||a.A().e(),"Priority nodes can't have a priority of their own.")}var C=new T(new ac(Tb),null,je);function se(){T.call(this,new ac(Tb),C,je)}ma(se,T);h=se.prototype;
h.Cc=function(a){return a===this?0:1};h.Z=function(a){return a===this};h.A=function(){return this};h.M=function(){return C};h.e=function(){return!1};var Sd=new se,Qd=new E("[MIN_NAME]",C),Xd=new E("[MAX_NAME]",Sd);function Id(a,b){this.D=a;this.Ud=b}function Fd(a,b,c,d){return new Id(new sb(b,c,d),a.Ud)}function Jd(a){return a.D.$?a.D.j():null}Id.prototype.u=function(){return this.Ud};function tb(a){return a.Ud.$?a.Ud.j():null};function te(a,b){this.V=a;var c=a.o,d=new ld(c.g),c=de(c)?new ld(c.g):c.ia?new rd(c):new md(c);this.Gf=new zd(c);var e=b.u(),f=b.D,g=d.ta(C,e.j(),null),k=c.ta(C,f.j(),null);this.Ka=new Id(new sb(k,f.$,c.Ga()),new sb(g,e.$,d.Ga()));this.Za=[];this.ig=new dd(a)}function ue(a){return a.V}h=te.prototype;h.u=function(){return this.Ka.u().j()};h.hb=function(a){var b=tb(this.Ka);return b&&(de(this.V.o)||!a.e()&&!b.M(O(a)).e())?b.oa(a):null};h.e=function(){return 0===this.Za.length};h.Ob=function(a){this.Za.push(a)};
h.kb=function(a,b){var c=[];if(b){J(null==a,"A cancel should cancel all event registrations.");var d=this.V.path;Oa(this.Za,function(a){(a=a.ff(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.Za.length;++f){var g=this.Za[f];if(!g.matches(a))e.push(g);else if(a.sf()){e=e.concat(this.Za.slice(f+1));break}}this.Za=e}else this.Za=[];return c};
h.bb=function(a,b,c){a.type===Cd&&null!==a.source.Ib&&(J(tb(this.Ka),"We should always have a full cache before handling merges"),J(Jd(this.Ka),"Missing event cache, even though we have a server cache"));var d=this.Ka;a=this.Gf.bb(d,a,b,c);b=this.Gf;c=a.he;J(c.D.j().Ic(b.I.g),"Event snap not indexed");J(c.u().j().Ic(b.I.g),"Server snap not indexed");J(Hb(a.he.u())||!Hb(d.u()),"Once a server snap is complete, it should never go back");this.Ka=a.he;return ve(this,a.cg,a.he.D.j(),null)};
function we(a,b){var c=a.Ka.D,d=[];c.j().N()||c.j().U(M,function(a,b){d.push(new D("child_added",b,a))});c.$&&d.push(Db(c.j()));return ve(a,d,c.j(),b)}function ve(a,b,c,d){return ed(a.ig,b,c,d?[d]:a.Za)};function xe(a,b,c){this.type=Cd;this.source=a;this.path=b;this.children=c}xe.prototype.Wc=function(a){if(this.path.e())return a=this.children.subtree(new K(a)),a.e()?null:a.value?new Ub(this.source,F,a.value):new xe(this.source,F,a);J(O(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new xe(this.source,G(this.path),this.children)};xe.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};var Vb=0,Cd=1,Xb=2,$b=3;function ye(a,b,c,d){this.ve=a;this.of=b;this.Ib=c;this.af=d;J(!d||b,"Tagged queries must be from server.")}var Yb=new ye(!0,!1,null,!1),ze=new ye(!1,!0,null,!1);ye.prototype.toString=function(){return this.ve?"user":this.af?"server(queryID="+this.Ib+")":"server"};function Ae(a,b){this.f=Oc("p:rest:");this.H=a;this.Gb=b;this.Fa=null;this.aa={}}function Be(a,b){if(n(b))return"tag$"+b;var c=a.o;J(de(c)&&c.g==M,"should have a tag if it's not a default query.");return a.path.toString()}h=Ae.prototype;
h.xf=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.wa());var f=Be(a,c),g={};this.aa[f]=g;a=ee(a.o);var k=this;Ce(this,e+".json",a,function(a,b){var v=b;404===a&&(a=v=null);null===a&&k.Gb(e,v,!1,c);w(k.aa,f)===g&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};h.Of=function(a,b){var c=Be(a,b);delete this.aa[c]};h.P=function(a,b){this.Fa=a;var c=ad(a),d=c.data,c=c.Ac&&c.Ac.exp;b&&b("ok",{auth:d,expires:c})};h.ee=function(a){this.Fa=null;a("ok",null)};
h.Le=function(){};h.Bf=function(){};h.Gd=function(){};h.put=function(){};h.yf=function(){};h.Te=function(){};
function Ce(a,b,c,d){c=c||{};c.format="export";a.Fa&&(c.auth=a.Fa);var e=(a.H.lb?"https://":"http://")+a.H.host+b+"?"+jb(c);a.f("Sending REST request for "+e);var f=new XMLHttpRequest;f.onreadystatechange=function(){if(d&&4===f.readyState){a.f("REST Response for "+e+" received. status:",f.status,"response:",f.responseText);var b=null;if(200<=f.status&&300>f.status){try{b=mb(f.responseText)}catch(c){Q("Failed to parse JSON response for "+e+": "+f.responseText)}d(null,b)}else 401!==f.status&&404!==
f.status&&Q("Got unsuccessful REST response for "+e+" Status: "+f.status),d(f.status);d=null}};f.open("GET",e,!0);f.send()};function De(a,b){this.value=a;this.children=b||Ee}var Ee=new ac(function(a,b){return a===b?0:a<b?-1:1});function Fe(a){var b=Nd;r(a,function(a,d){b=b.set(new K(d),a)});return b}h=De.prototype;h.e=function(){return null===this.value&&this.children.e()};function Ge(a,b,c){if(null!=a.value&&c(a.value))return{path:F,value:a.value};if(b.e())return null;var d=O(b);a=a.children.get(d);return null!==a?(b=Ge(a,G(b),c),null!=b?{path:(new K(d)).w(b.path),value:b.value}:null):null}
function He(a,b){return Ge(a,b,function(){return!0})}h.subtree=function(a){if(a.e())return this;var b=this.children.get(O(a));return null!==b?b.subtree(G(a)):Nd};h.set=function(a,b){if(a.e())return new De(b,this.children);var c=O(a),d=(this.children.get(c)||Nd).set(G(a),b),c=this.children.Na(c,d);return new De(this.value,c)};
h.remove=function(a){if(a.e())return this.children.e()?Nd:new De(null,this.children);var b=O(a),c=this.children.get(b);return c?(a=c.remove(G(a)),b=a.e()?this.children.remove(b):this.children.Na(b,a),null===this.value&&b.e()?Nd:new De(this.value,b)):this};h.get=function(a){if(a.e())return this.value;var b=this.children.get(O(a));return b?b.get(G(a)):null};
function Md(a,b,c){if(b.e())return c;var d=O(b);b=Md(a.children.get(d)||Nd,G(b),c);d=b.e()?a.children.remove(d):a.children.Na(d,b);return new De(a.value,d)}function Ie(a,b){return Je(a,F,b)}function Je(a,b,c){var d={};a.children.ha(function(a,f){d[a]=Je(f,b.w(a),c)});return c(b,a.value,d)}function Ke(a,b,c){return Le(a,b,F,c)}function Le(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=O(b);return(a=a.children.get(e))?Le(a,G(b),c.w(e),d):null}
function Me(a,b,c){var d=F;if(!b.e()){var e=!0;a.value&&(e=c(d,a.value));!0===e&&(e=O(b),(a=a.children.get(e))&&Ne(a,G(b),d.w(e),c))}}function Ne(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=O(b);return(a=a.children.get(e))?Ne(a,G(b),c.w(e),d):Nd}function Kd(a,b){Oe(a,F,b)}function Oe(a,b,c){a.children.ha(function(a,e){Oe(e,b.w(a),c)});a.value&&c(b,a.value)}function Pe(a,b){a.children.ha(function(a,d){d.value&&b(a,d.value)})}var Nd=new De(null);
De.prototype.toString=function(){var a={};Kd(this,function(b,c){a[b.toString()]=c.toString()});return B(a)};function Qe(a){this.W=a}var Re=new Qe(new De(null));function Se(a,b,c){if(b.e())return new Qe(new De(c));var d=He(a.W,b);if(null!=d){var e=d.path,d=d.value;b=N(e,b);d=d.G(b,c);return new Qe(a.W.set(e,d))}a=Md(a.W,b,new De(c));return new Qe(a)}function Te(a,b,c){var d=a;hb(c,function(a,c){d=Se(d,b.w(a),c)});return d}Qe.prototype.Od=function(a){if(a.e())return Re;a=Md(this.W,a,Nd);return new Qe(a)};function Ue(a,b){var c=He(a.W,b);return null!=c?a.W.get(c.path).oa(N(c.path,b)):null}
function Ve(a){var b=[],c=a.W.value;null!=c?c.N()||c.U(M,function(a,c){b.push(new E(a,c))}):a.W.children.ha(function(a,c){null!=c.value&&b.push(new E(a,c.value))});return b}function We(a,b){if(b.e())return a;var c=Ue(a,b);return null!=c?new Qe(new De(c)):new Qe(a.W.subtree(b))}Qe.prototype.e=function(){return this.W.e()};Qe.prototype.apply=function(a){return Xe(F,this.W,a)};
function Xe(a,b,c){if(null!=b.value)return c.G(a,b.value);var d=null;b.children.ha(function(b,f){".priority"===b?(J(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=Xe(a.w(b),f,c)});c.oa(a).e()||null===d||(c=c.G(a.w(".priority"),d));return c};function Ye(){this.T=Re;this.za=[];this.Lc=-1}h=Ye.prototype;
h.Od=function(a){var b=Ua(this.za,function(b){return b.ie===a});J(0<=b,"removeWrite called with nonexistent writeId.");var c=this.za[b];this.za.splice(b,1);for(var d=c.visible,e=!1,f=this.za.length-1;d&&0<=f;){var g=this.za[f];g.visible&&(f>=b&&Ze(g,c.path)?d=!1:c.path.contains(g.path)&&(e=!0));f--}if(d){if(e)this.T=$e(this.za,af,F),this.Lc=0<this.za.length?this.za[this.za.length-1].ie:-1;else if(c.Ia)this.T=this.T.Od(c.path);else{var k=this;r(c.children,function(a,b){k.T=k.T.Od(c.path.w(b))})}return c.path}return null};
h.ua=function(a,b,c,d){if(c||d){var e=We(this.T,a);return!d&&e.e()?b:d||null!=b||null!=Ue(e,F)?(e=$e(this.za,function(b){return(b.visible||d)&&(!c||!(0<=Na(c,b.ie)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||C,e.apply(b)):null}e=Ue(this.T,a);if(null!=e)return e;e=We(this.T,a);return e.e()?b:null!=b||null!=Ue(e,F)?(b=b||C,e.apply(b)):null};
h.xc=function(a,b){var c=C,d=Ue(this.T,a);if(d)d.N()||d.U(M,function(a,b){c=c.Q(a,b)});else if(b){var e=We(this.T,a);b.U(M,function(a,b){var d=We(e,new K(a)).apply(b);c=c.Q(a,d)});Oa(Ve(e),function(a){c=c.Q(a.name,a.S)})}else e=We(this.T,a),Oa(Ve(e),function(a){c=c.Q(a.name,a.S)});return c};h.hd=function(a,b,c,d){J(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.w(b);if(null!=Ue(this.T,a))return null;a=We(this.T,a);return a.e()?d.oa(b):a.apply(d.oa(b))};
h.Xa=function(a,b,c){a=a.w(b);var d=Ue(this.T,a);return null!=d?d:rb(c,b)?We(this.T,a).apply(c.j().M(b)):null};h.sc=function(a){return Ue(this.T,a)};h.me=function(a,b,c,d,e,f){var g;a=We(this.T,a);g=Ue(a,F);if(null==g)if(null!=b)g=a.apply(b);else return[];g=g.mb(f);if(g.e()||g.N())return[];b=[];a=ud(f);e=e?g.Zb(c,f):g.Xb(c,f);for(f=H(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=H(e);return b};
function Ze(a,b){return a.Ia?a.path.contains(b):!!ua(a.children,function(c,d){return a.path.w(d).contains(b)})}function af(a){return a.visible}
function $e(a,b,c){for(var d=Re,e=0;e<a.length;++e){var f=a[e];if(b(f)){var g=f.path;if(f.Ia)c.contains(g)?(g=N(c,g),d=Se(d,g,f.Ia)):g.contains(c)&&(g=N(g,c),d=Se(d,F,f.Ia.oa(g)));else if(f.children)if(c.contains(g))g=N(c,g),d=Te(d,g,f.children);else{if(g.contains(c))if(g=N(g,c),g.e())d=Te(d,F,f.children);else if(f=w(f.children,O(g)))f=f.oa(G(g)),d=Se(d,F,f)}else throw Hc("WriteRecord should have .snap or .children");}}return d}function bf(a,b){this.Mb=a;this.W=b}h=bf.prototype;
h.ua=function(a,b,c){return this.W.ua(this.Mb,a,b,c)};h.xc=function(a){return this.W.xc(this.Mb,a)};h.hd=function(a,b,c){return this.W.hd(this.Mb,a,b,c)};h.sc=function(a){return this.W.sc(this.Mb.w(a))};h.me=function(a,b,c,d,e){return this.W.me(this.Mb,a,b,c,d,e)};h.Xa=function(a,b){return this.W.Xa(this.Mb,a,b)};h.w=function(a){return new bf(this.Mb.w(a),this.W)};function cf(){this.ya={}}h=cf.prototype;h.e=function(){return wa(this.ya)};h.bb=function(a,b,c){var d=a.source.Ib;if(null!==d)return d=w(this.ya,d),J(null!=d,"SyncTree gave us an op for an invalid query."),d.bb(a,b,c);var e=[];r(this.ya,function(d){e=e.concat(d.bb(a,b,c))});return e};h.Ob=function(a,b,c,d,e){var f=a.wa(),g=w(this.ya,f);if(!g){var g=c.ua(e?d:null),k=!1;g?k=!0:(g=d instanceof T?c.xc(d):C,k=!1);g=new te(a,new Id(new sb(g,k,!1),new sb(d,e,!1)));this.ya[f]=g}g.Ob(b);return we(g,b)};
h.kb=function(a,b,c){var d=a.wa(),e=[],f=[],g=null!=df(this);if("default"===d){var k=this;r(this.ya,function(a,d){f=f.concat(a.kb(b,c));a.e()&&(delete k.ya[d],de(a.V.o)||e.push(a.V))})}else{var l=w(this.ya,d);l&&(f=f.concat(l.kb(b,c)),l.e()&&(delete this.ya[d],de(l.V.o)||e.push(l.V)))}g&&null==df(this)&&e.push(new U(a.k,a.path));return{Hg:e,jg:f}};function ef(a){return Pa(ra(a.ya),function(a){return!de(a.V.o)})}h.hb=function(a){var b=null;r(this.ya,function(c){b=b||c.hb(a)});return b};
function ff(a,b){if(de(b.o))return df(a);var c=b.wa();return w(a.ya,c)}function df(a){return va(a.ya,function(a){return de(a.V.o)})||null};function gf(a){this.sa=Nd;this.Hb=new Ye;this.$e={};this.kc={};this.Mc=a}function hf(a,b,c,d,e){var f=a.Hb,g=e;J(d>f.Lc,"Stacking an older write on top of newer ones");n(g)||(g=!0);f.za.push({path:b,Ia:c,ie:d,visible:g});g&&(f.T=Se(f.T,b,c));f.Lc=d;return e?jf(a,new Ub(Yb,b,c)):[]}function kf(a,b,c,d){var e=a.Hb;J(d>e.Lc,"Stacking an older merge on top of newer ones");e.za.push({path:b,children:c,ie:d,visible:!0});e.T=Te(e.T,b,c);e.Lc=d;c=Fe(c);return jf(a,new xe(Yb,b,c))}
function lf(a,b,c){c=c||!1;b=a.Hb.Od(b);return null==b?[]:jf(a,new Wb(b,c))}function mf(a,b,c){c=Fe(c);return jf(a,new xe(ze,b,c))}function nf(a,b,c,d){d=of(a,d);if(null!=d){var e=pf(d);d=e.path;e=e.Ib;b=N(d,b);c=new Ub(new ye(!1,!0,e,!0),b,c);return qf(a,d,c)}return[]}function rf(a,b,c,d){if(d=of(a,d)){var e=pf(d);d=e.path;e=e.Ib;b=N(d,b);c=Fe(c);c=new xe(new ye(!1,!0,e,!0),b,c);return qf(a,d,c)}return[]}
gf.prototype.Ob=function(a,b){var c=a.path,d=null,e=!1;Me(this.sa,c,function(a,b){var f=N(a,c);d=b.hb(f);e=e||null!=df(b);return!d});var f=this.sa.get(c);f?(e=e||null!=df(f),d=d||f.hb(F)):(f=new cf,this.sa=this.sa.set(c,f));var g;null!=d?g=!0:(g=!1,d=C,Pe(this.sa.subtree(c),function(a,b){var c=b.hb(F);c&&(d=d.Q(a,c))}));var k=null!=ff(f,a);if(!k&&!de(a.o)){var l=sf(a);J(!(l in this.kc),"View does not exist, but we have a tag");var m=tf++;this.kc[l]=m;this.$e["_"+m]=l}g=f.Ob(a,b,new bf(c,this.Hb),
d,g);k||e||(f=ff(f,a),g=g.concat(uf(this,a,f)));return g};
gf.prototype.kb=function(a,b,c){var d=a.path,e=this.sa.get(d),f=[];if(e&&("default"===a.wa()||null!=ff(e,a))){f=e.kb(a,b,c);e.e()&&(this.sa=this.sa.remove(d));e=f.Hg;f=f.jg;b=-1!==Ua(e,function(a){return de(a.o)});var g=Ke(this.sa,d,function(a,b){return null!=df(b)});if(b&&!g&&(d=this.sa.subtree(d),!d.e()))for(var d=vf(d),k=0;k<d.length;++k){var l=d[k],m=l.V,l=wf(this,l);this.Mc.Xe(m,xf(this,m),l.ud,l.J)}if(!g&&0<e.length&&!c)if(b)this.Mc.Zd(a,null);else{var v=this;Oa(e,function(a){a.wa();var b=v.kc[sf(a)];
v.Mc.Zd(a,b)})}yf(this,e)}return f};gf.prototype.ua=function(a,b){var c=this.Hb,d=Ke(this.sa,a,function(b,c){var d=N(b,a);if(d=c.hb(d))return d});return c.ua(a,d,b,!0)};function vf(a){return Ie(a,function(a,c,d){if(c&&null!=df(c))return[df(c)];var e=[];c&&(e=ef(c));r(d,function(a){e=e.concat(a)});return e})}function yf(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!de(d.o)){var d=sf(d),e=a.kc[d];delete a.kc[d];delete a.$e["_"+e]}}}
function uf(a,b,c){var d=b.path,e=xf(a,b);c=wf(a,c);b=a.Mc.Xe(b,e,c.ud,c.J);d=a.sa.subtree(d);if(e)J(null==df(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=Ie(d,function(a,b,c){if(!a.e()&&b&&null!=df(b))return[ue(df(b))];var d=[];b&&(d=d.concat(Qa(ef(b),function(a){return a.V})));r(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Mc.Zd(c,xf(a,c));return b}
function wf(a,b){var c=b.V,d=xf(a,c);return{ud:function(){return(b.u()||C).hash()},J:function(b){if("ok"===b){if(d){var f=c.path;if(b=of(a,d)){var g=pf(b);b=g.path;g=g.Ib;f=N(b,f);f=new Zb(new ye(!1,!0,g,!0),f);b=qf(a,b,f)}else b=[]}else b=jf(a,new Zb(ze,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+": "+f);f.code=b.toUpperCase();return a.kb(c,null,f)}}}function sf(a){return a.path.toString()+"$"+a.wa()}function pf(a){var b=a.indexOf("$");J(-1!==b&&b<a.length-1,"Bad queryKey.");return{Ib:a.substr(b+1),path:new K(a.substr(0,b))}}function of(a,b){var c=a.$e,d="_"+b;return d in c?c[d]:void 0}function xf(a,b){var c=sf(b);return w(a.kc,c)}var tf=1;
function qf(a,b,c){var d=a.sa.get(b);J(d,"Missing sync point for query tag that we're tracking");return d.bb(c,new bf(b,a.Hb),null)}function jf(a,b){return zf(a,b,a.sa,null,new bf(F,a.Hb))}function zf(a,b,c,d,e){if(b.path.e())return Af(a,b,c,d,e);var f=c.get(F);null==d&&null!=f&&(d=f.hb(F));var g=[],k=O(b.path),l=b.Wc(k);if((c=c.children.get(k))&&l)var m=d?d.M(k):null,k=e.w(k),g=g.concat(zf(a,l,c,m,k));f&&(g=g.concat(f.bb(b,e,d)));return g}
function Af(a,b,c,d,e){var f=c.get(F);null==d&&null!=f&&(d=f.hb(F));var g=[];c.children.ha(function(c,f){var m=d?d.M(c):null,v=e.w(c),y=b.Wc(c);y&&(g=g.concat(Af(a,y,f,m,v)))});f&&(g=g.concat(f.bb(b,e,d)));return g};function Bf(){this.children={};this.kd=0;this.value=null}function Cf(a,b,c){this.Dd=a?a:"";this.Yc=b?b:null;this.B=c?c:new Bf}function Df(a,b){for(var c=b instanceof K?b:new K(b),d=a,e;null!==(e=O(c));)d=new Cf(e,d,w(d.B.children,e)||new Bf),c=G(c);return d}h=Cf.prototype;h.Ba=function(){return this.B.value};function Ef(a,b){J("undefined"!==typeof b,"Cannot set value to undefined");a.B.value=b;Ff(a)}h.clear=function(){this.B.value=null;this.B.children={};this.B.kd=0;Ff(this)};
h.td=function(){return 0<this.B.kd};h.e=function(){return null===this.Ba()&&!this.td()};h.U=function(a){var b=this;r(this.B.children,function(c,d){a(new Cf(d,b,c))})};function Gf(a,b,c,d){c&&!d&&b(a);a.U(function(a){Gf(a,b,!0,d)});c&&d&&b(a)}function Hf(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}h.path=function(){return new K(null===this.Yc?this.Dd:this.Yc.path()+"/"+this.Dd)};h.name=function(){return this.Dd};h.parent=function(){return this.Yc};
function Ff(a){if(null!==a.Yc){var b=a.Yc,c=a.Dd,d=a.e(),e=u(b.B.children,c);d&&e?(delete b.B.children[c],b.B.kd--,Ff(b)):d||e||(b.B.children[c]=a.B,b.B.kd++,Ff(b))}};function If(a){J(ea(a)&&0<a.length,"Requires a non-empty array");this.Uf=a;this.Nc={}}If.prototype.de=function(a,b){for(var c=this.Nc[a]||[],d=0;d<c.length;d++)c[d].yc.apply(c[d].Ma,Array.prototype.slice.call(arguments,1))};If.prototype.Eb=function(a,b,c){Jf(this,a);this.Nc[a]=this.Nc[a]||[];this.Nc[a].push({yc:b,Ma:c});(a=this.ze(a))&&b.apply(c,a)};If.prototype.gc=function(a,b,c){Jf(this,a);a=this.Nc[a]||[];for(var d=0;d<a.length;d++)if(a[d].yc===b&&(!c||c===a[d].Ma)){a.splice(d,1);break}};
function Jf(a,b){J(Ta(a.Uf,function(a){return a===b}),"Unknown event: "+b)};var Kf=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);J(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);J(20===c.length,"nextPushId: Length should be 20.");
return c}}();function Lf(){If.call(this,["online"]);this.ic=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.ic||(a.ic=!0,a.de("online",!0))},!1);window.addEventListener("offline",function(){a.ic&&(a.ic=!1,a.de("online",!1))},!1)}}ma(Lf,If);Lf.prototype.ze=function(a){J("online"===a,"Unknown event type: "+a);return[this.ic]};ca(Lf);function Mf(){If.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.uc=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.uc&&(c.uc=b,c.de("visible",b))},!1)}}ma(Mf,If);Mf.prototype.ze=function(a){J("visible"===a,"Unknown event type: "+a);return[this.uc]};ca(Mf);var Nf=/[\[\].#$\/\u0000-\u001F\u007F]/,Of=/[\[\].#$\u0000-\u001F\u007F]/;function Pf(a){return p(a)&&0!==a.length&&!Nf.test(a)}function Qf(a){return null===a||p(a)||ga(a)&&!Sc(a)||ia(a)&&u(a,".sv")}function Rf(a,b,c,d){d&&!n(b)||Sf(z(a,1,d),b,c)}
function Sf(a,b,c){c instanceof K&&(c=new wc(c,a));if(!n(b))throw Error(a+"contains undefined "+zc(c));if(ha(b))throw Error(a+"contains a function "+zc(c)+" with contents: "+b.toString());if(Sc(b))throw Error(a+"contains "+b.toString()+" "+zc(c));if(p(b)&&b.length>10485760/3&&10485760<xc(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+zc(c)+" ('"+b.substring(0,50)+"...')");if(ia(b)){var d=!1,e=!1;hb(b,function(b,g){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!Pf(b)))throw Error(a+" contains an invalid key ("+b+") "+zc(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Sf(a,g,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+zc(c)+" in addition to actual children.");}}
function Tf(a,b,c){if(!ia(b)||ea(b))throw Error(z(a,1,!1)+" must be an Object containing the children to replace.");if(u(b,".value"))throw Error(z(a,1,!1)+' must not contain ".value".  To overwrite with a leaf value, just use .set() instead.');Rf(a,b,c,!1)}
function Uf(a,b,c){if(Sc(c))throw Error(z(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Qf(c))throw Error(z(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function Vf(a,b,c){if(!c||n(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(z(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Wf(a,b,c,d){if((!d||n(c))&&!Pf(c))throw Error(z(a,b,d)+'was an invalid key: "'+c+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Xf(a,b){if(!p(b)||0===b.length||Of.test(b))throw Error(z(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function Yf(a,b){if(".info"===O(b))throw Error(a+" failed: Can't modify data under /.info/");}function Zf(a,b){if(!p(b))throw Error(z(a,1,!1)+"must be a valid credential (a string).");}function $f(a,b,c){if(!p(c))throw Error(z(a,b,!1)+"must be a valid string.");}
function ag(a,b,c,d){if(!d||n(c))if(!ia(c)||null===c)throw Error(z(a,b,d)+"must be a valid object.");}function bg(a,b,c){if(!ia(b)||null===b||!u(b,c))throw Error(z(a,1,!1)+'must contain the key "'+c+'"');if(!p(w(b,c)))throw Error(z(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function cg(){this.set={}}h=cg.prototype;h.add=function(a,b){this.set[a]=null!==b?b:!0};h.contains=function(a){return u(this.set,a)};h.get=function(a){return this.contains(a)?this.set[a]:void 0};h.remove=function(a){delete this.set[a]};h.clear=function(){this.set={}};h.e=function(){return wa(this.set)};h.count=function(){return pa(this.set)};function dg(a,b){r(a.set,function(a,d){b(d,a)})}h.keys=function(){var a=[];r(this.set,function(b,c){a.push(c)});return a};function qc(){this.m=this.C=null}qc.prototype.find=function(a){if(null!=this.C)return this.C.oa(a);if(a.e()||null==this.m)return null;var b=O(a);a=G(a);return this.m.contains(b)?this.m.get(b).find(a):null};qc.prototype.mc=function(a,b){if(a.e())this.C=b,this.m=null;else if(null!==this.C)this.C=this.C.G(a,b);else{null==this.m&&(this.m=new cg);var c=O(a);this.m.contains(c)||this.m.add(c,new qc);c=this.m.get(c);a=G(a);c.mc(a,b)}};
function eg(a,b){if(b.e())return a.C=null,a.m=null,!0;if(null!==a.C){if(a.C.N())return!1;var c=a.C;a.C=null;c.U(M,function(b,c){a.mc(new K(b),c)});return eg(a,b)}return null!==a.m?(c=O(b),b=G(b),a.m.contains(c)&&eg(a.m.get(c),b)&&a.m.remove(c),a.m.e()?(a.m=null,!0):!1):!0}function rc(a,b,c){null!==a.C?c(b,a.C):a.U(function(a,e){var f=new K(b.toString()+"/"+a);rc(e,f,c)})}qc.prototype.U=function(a){null!==this.m&&dg(this.m,function(b,c){a(b,c)})};var fg="auth.firebase.com";function gg(a,b,c){this.ld=a||{};this.ce=b||{};this.ab=c||{};this.ld.remember||(this.ld.remember="default")}var hg=["remember","redirectTo"];function ig(a){var b={},c={};hb(a||{},function(a,e){0<=Na(hg,a)?b[a]=e:c[a]=e});return new gg(b,{},c)};function jg(a,b){this.Pe=["session",a.Ld,a.Cb].join(":");this.$d=b}jg.prototype.set=function(a,b){if(!b)if(this.$d.length)b=this.$d[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.Pe,a)};jg.prototype.get=function(){var a=Qa(this.$d,q(this.ng,this)),a=Pa(a,function(a){return null!==a});Xa(a,function(a,c){return bd(c.token)-bd(a.token)});return 0<a.length?a.shift():null};jg.prototype.ng=function(a){try{var b=a.get(this.Pe);if(b&&b.token)return b}catch(c){}return null};
jg.prototype.clear=function(){var a=this;Oa(this.$d,function(b){b.remove(a.Pe)})};function kg(){return"undefined"!==typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent)}function lg(){return"undefined"!==typeof location&&/^file:\//.test(location.href)}
function mg(){if("undefined"===typeof navigator)return!1;var a=navigator.userAgent;if("Microsoft Internet Explorer"===navigator.appName){if((a=a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1])}else if(-1<a.indexOf("Trident")&&(a=a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1]);return!1};function ng(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function og(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function pg(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
function qg(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function rg(a){var b="";try{a=a.replace("#","");var c=kb(a);c&&u(c,"__firebase_request_key")&&(b=w(c,"__firebase_request_key"))}catch(d){}return b}function sg(){var a=Rc(fg);return a.scheme+"://"+a.host+"/v2"}function tg(a){return sg()+"/"+a+"/auth/channel"};function ug(a){var b=this;this.zc=a;this.ae="*";mg()?this.Qc=this.wd=ng():(this.Qc=window.opener,this.wd=window);if(!b.Qc)throw"Unable to find relay frame";og(this.wd,"message",q(this.hc,this));og(this.wd,"message",q(this.Af,this));try{vg(this,{a:"ready"})}catch(c){og(this.Qc,"load",function(){vg(b,{a:"ready"})})}og(window,"unload",q(this.yg,this))}function vg(a,b){b=B(b);mg()?a.Qc.doPost(b,a.ae):a.Qc.postMessage(b,a.ae)}
ug.prototype.hc=function(a){var b=this,c;try{c=mb(a.data)}catch(d){}c&&"request"===c.a&&(pg(window,"message",this.hc),this.ae=a.origin,this.zc&&setTimeout(function(){b.zc(b.ae,c.d,function(a,c){b.ag=!c;b.zc=void 0;vg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};ug.prototype.yg=function(){try{pg(this.wd,"message",this.Af)}catch(a){}this.zc&&(vg(this,{a:"error",d:"unknown closed window"}),this.zc=void 0);try{window.close()}catch(b){}};ug.prototype.Af=function(a){if(this.ag&&"die"===a.data)try{window.close()}catch(b){}};function wg(a){this.oc=Ga()+Ga()+Ga();this.Df=a}wg.prototype.open=function(a,b){P.set("redirect_request_id",this.oc);P.set("redirect_request_id",this.oc);b.requestId=this.oc;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+jb(b);window.location=a};wg.isAvailable=function(){return!lg()&&!kg()};wg.prototype.Bc=function(){return"redirect"};var xg={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function yg(a){var b=Error(w(xg,a),a);b.code=a;return b};function zg(a){if(!a.window_features||"undefined"!==typeof navigator&&(-1!==navigator.userAgent.indexOf("Fennec/")||-1!==navigator.userAgent.indexOf("Firefox/")&&-1!==navigator.userAgent.indexOf("Android")))a.window_features=void 0;a.window_name||(a.window_name="_blank");this.options=a}
zg.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);v&&(v=clearInterval(v));pg(window,"message",e);pg(window,"unload",d);if(m&&!a)try{m.close()}catch(b){k.postMessage("die",l)}m=k=void 0}function e(a){if(a.origin===l)try{var b=mb(a.data);"ready"===b.a?k.postMessage(y,l):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.forceKeepWindowOpen),c&&(c(null,b.d),c=null))}catch(e){}}var f=mg(),g,k;if(!this.options.relay_url)return c(Error("invalid arguments: origin of url and relay_url must match"));
var l=qg(a);if(l!==qg(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),k=g.contentWindow);a+=(/\?/.test(a)?"":"?")+jb(b);var m=window.open(a,this.options.window_name,this.options.window_features);k||(k=m);var v=setInterval(function(){m&&m.closed&&
(d(!1),c&&(c(yg("USER_CANCELLED")),c=null))},500),y=B({a:"request",d:b});og(window,"unload",d);og(window,"message",e)}};
zg.isAvailable=function(){return"postMessage"in window&&!lg()&&!(kg()||"undefined"!==typeof navigator&&(navigator.userAgent.match(/Windows Phone/)||window.Windows&&/^ms-appx:/.test(location.href))||"undefined"!==typeof navigator&&"undefined"!==typeof window&&(navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)||navigator.userAgent.match(/CriOS/)||navigator.userAgent.match(/Twitter for iPhone/)||navigator.userAgent.match(/FBAN\/FBIOS/)||window.navigator.standalone))&&!("undefined"!==
typeof navigator&&navigator.userAgent.match(/PhantomJS/))};zg.prototype.Bc=function(){return"popup"};function Ag(a){a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
Ag.prototype.open=function(a,b,c){function d(){c&&(c(yg("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;og(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=mb(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(yg("SERVER_ERROR")):c(yg("NETWORK_ERROR"));c=null;pg(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+jb(b),g=null;else{var k=this.options.headers.content_type;
"application/json"===k&&(g=B(b));"application/x-www-form-urlencoded"===k&&(g=jb(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};za(a,this.options.headers);for(var l in a)e.setRequestHeader(l,a[l]);e.send(g)};Ag.isAvailable=function(){return!!window.XMLHttpRequest&&"string"===typeof(new XMLHttpRequest).responseType&&(!("undefined"!==typeof navigator&&(navigator.userAgent.match(/MSIE/)||navigator.userAgent.match(/Trident/)))||mg())};Ag.prototype.Bc=function(){return"json"};function Bg(a){this.oc=Ga()+Ga()+Ga();this.Df=a}
Bg.prototype.open=function(a,b,c){function d(){c&&(c(yg("USER_CANCELLED")),c=null)}var e=this,f=Rc(fg),g;b.requestId=this.oc;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=jb(b);(g=window.open(a,"_blank","location=no"))&&ha(g.addEventListener)?(g.addEventListener("loadstart",function(a){var b;if(b=a&&a.url)a:{try{var m=document.createElement("a");m.href=a.url;b=m.host===f.host&&"/blank/page.html"===m.pathname;break a}catch(v){}b=!1}b&&(a=rg(a.url),g.removeEventListener("exit",
d),g.close(),a=new gg(null,null,{requestId:e.oc,requestKey:a}),e.Df.requestWithCredential("/auth/session",a,c),c=null)}),g.addEventListener("exit",d)):c(yg("TRANSPORT_UNAVAILABLE"))};Bg.isAvailable=function(){return kg()};Bg.prototype.Bc=function(){return"redirect"};function Cg(a){a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_auth_jsonp=window.__firebase_auth_jsonp||{}}
Cg.prototype.open=function(a,b,c){function d(){c&&(c(yg("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){window.__firebase_auth_jsonp[f]=void 0;wa(window.__firebase_auth_jsonp)&&(window.__firebase_auth_jsonp=void 0);try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);pg(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_auth_jsonp."+f;a+=(/\?/.test(a)?"":"?")+jb(b);
og(window,"beforeunload",d);window.__firebase_auth_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};Dg(f,a,c)};
function Dg(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(yg("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(yg("NETWORK_ERROR"))}},0)}Cg.isAvailable=function(){return!0};Cg.prototype.Bc=function(){return"json"};function Eg(a,b,c,d){If.call(this,["auth_status"]);this.H=a;this.df=b;this.Sg=c;this.Ke=d;this.rc=new jg(a,[Dc,P]);this.nb=null;this.Re=!1;Fg(this)}ma(Eg,If);h=Eg.prototype;h.we=function(){return this.nb||null};function Fg(a){P.get("redirect_request_id")&&Gg(a);var b=a.rc.get();b&&b.token?(Hg(a,b),a.df(b.token,function(c,d){Ig(a,c,d,!1,b.token,b)},function(b,d){Jg(a,"resumeSession()",b,d)})):Hg(a,null)}
function Kg(a,b,c,d,e,f){"firebaseio-demo.com"===a.H.domain&&Q("Firebase authentication is not supported on demo Firebases (*.firebaseio-demo.com). To secure your Firebase, create a production Firebase at https://www.firebase.com.");a.df(b,function(f,k){Ig(a,f,k,!0,b,c,d||{},e)},function(b,c){Jg(a,"auth()",b,c,f)})}function Lg(a,b){a.rc.clear();Hg(a,null);a.Sg(function(a,d){if("ok"===a)R(b,null);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;R(b,f)}})}
function Ig(a,b,c,d,e,f,g,k){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=cd(e)?e:"",c=null,b&&u(b,"uid")?c=w(b,"uid"):u(f,"uid")&&(c=w(f,"uid")),f.uid=c,c="custom",b&&u(b,"provider")?c=w(b,"provider"):u(f,"provider")&&(c=w(f,"provider")),f.provider=c,a.rc.clear(),cd(e)&&(g=g||{},c=Dc,"sessionOnly"===g.remember&&(c=P),"none"!==g.remember&&a.rc.set(f,c)),Hg(a,f)),R(k,null,f)):(a.rc.clear(),Hg(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,R(k,f))}
function Jg(a,b,c,d,e){Q(b+" was canceled: "+d);a.rc.clear();Hg(a,null);a=Error(d);a.code=c.toUpperCase();R(e,a)}function Mg(a,b,c,d,e){Ng(a);c=new gg(d||{},{},c||{});Og(a,[Ag,Cg],"/auth/"+b,c,e)}
function Pg(a,b,c,d){Ng(a);var e=[zg,Bg];c=ig(c);"anonymous"===b||"password"===b?setTimeout(function(){R(d,yg("TRANSPORT_UNAVAILABLE"))},0):(c.ce.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.ce.relay_url=tg(a.H.Cb),c.ce.requestWithCredential=q(a.pc,a),Og(a,e,"/auth/"+b,c,d))}
function Gg(a){var b=P.get("redirect_request_id");if(b){var c=P.get("redirect_client_options");P.remove("redirect_request_id");P.remove("redirect_client_options");var d=[Ag,Cg],b={requestId:b,requestKey:rg(document.location.hash)},c=new gg(c,{},b);a.Re=!0;try{document.location.hash=document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/,"")}catch(e){}Og(a,d,"/auth/session",c,function(){this.Re=!1}.bind(a))}}
h.re=function(a,b){Ng(this);var c=ig(a);c.ab._method="POST";this.pc("/users",c,function(a,c){a?R(b,a):R(b,a,c)})};h.Se=function(a,b){var c=this;Ng(this);var d="/users/"+encodeURIComponent(a.email),e=ig(a);e.ab._method="DELETE";this.pc(d,e,function(a,d){!a&&d&&d.uid&&c.nb&&c.nb.uid&&c.nb.uid===d.uid&&Lg(c);R(b,a)})};h.oe=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=ig(a);d.ab._method="PUT";d.ab.password=a.newPassword;this.pc(c,d,function(a){R(b,a)})};
h.ne=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.oldEmail)+"/email",d=ig(a);d.ab._method="PUT";d.ab.email=a.newEmail;d.ab.password=a.password;this.pc(c,d,function(a){R(b,a)})};h.Ue=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=ig(a);d.ab._method="POST";this.pc(c,d,function(a){R(b,a)})};h.pc=function(a,b,c){Qg(this,[Ag,Cg],a,b,c)};
function Og(a,b,c,d,e){Qg(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?Kg(a,c.token,c,d.ld,function(a,b){a?R(e,a):R(e,null,b)}):R(e,b||yg("UNKNOWN_ERROR"))})}
function Qg(a,b,c,d,e){b=Pa(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){R(e,yg("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.ce),d=ib(d.ab),d.v="js-2.2.5",d.transport=b.Bc(),d.suppress_status_codes=!0,a=sg()+"/"+a.H.Cb+c,b.open(a,d,function(a,b){if(a)R(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;R(e,c)}else R(e,null,b)}))}
function Hg(a,b){var c=null!==a.nb||null!==b;a.nb=b;c&&a.de("auth_status",b);a.Ke(null!==b)}h.ze=function(a){J("auth_status"===a,'initial event must be of type "auth_status"');return this.Re?null:[this.nb]};function Ng(a){var b=a.H;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===fg)throw Error("This custom Firebase server ('"+a.H.domain+"') does not support delegated login.");};function Rg(a){this.hc=a;this.Kd=[];this.Qb=0;this.pe=-1;this.Fb=null}function Sg(a,b,c){a.pe=b;a.Fb=c;a.pe<a.Qb&&(a.Fb(),a.Fb=null)}function Tg(a,b,c){for(a.Kd[b]=c;a.Kd[a.Qb];){var d=a.Kd[a.Qb];delete a.Kd[a.Qb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;Cb(function(){f.hc(d[e])})}if(a.Qb===a.pe){a.Fb&&(clearTimeout(a.Fb),a.Fb(),a.Fb=null);break}a.Qb++}};function Ug(a,b,c){this.qe=a;this.f=Oc(a);this.ob=this.pb=0;this.Va=Ob(b);this.Vd=c;this.Gc=!1;this.gd=function(a){b.host!==b.Oa&&(a.ns=b.Cb);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.lb?"https://":"http://")+b.Oa+"/.lp?"+c.join("&")}}var Vg,Wg;
Ug.prototype.open=function(a,b){this.gf=0;this.ka=b;this.zf=new Rg(a);this.zb=!1;var c=this;this.rb=setTimeout(function(){c.f("Timed out trying to connect.");c.ib();c.rb=null},Math.floor(3E4));Tc(function(){if(!c.zb){c.Ta=new Xg(function(a,b,d,k,l){Yg(c,arguments);if(c.Ta)if(c.rb&&(clearTimeout(c.rb),c.rb=null),c.Gc=!0,"start"==a)c.id=b,c.Ff=d;else if("close"===a)b?(c.Ta.Td=!1,Sg(c.zf,b,function(){c.ib()})):c.ib();else throw Error("Unrecognized command received: "+a);},function(a,b){Yg(c,arguments);
Tg(c.zf,a,b)},function(){c.ib()},c.gd);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Ta.fe&&(a.cb=c.Ta.fe);a.v="5";c.Vd&&(a.s=c.Vd);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.gd(a);c.f("Connecting via long-poll to "+a);Zg(c.Ta,a,function(){})}})};
Ug.prototype.start=function(){var a=this.Ta,b=this.Ff;a.rg=this.id;a.sg=b;for(a.ke=!0;$g(a););a=this.id;b=this.Ff;this.fc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.fc.src=this.gd(c);this.fc.style.display="none";document.body.appendChild(this.fc)};Ug.isAvailable=function(){return Vg||!Wg&&"undefined"!==typeof document&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Ug)};
h=Ug.prototype;h.Bd=function(){};h.cd=function(){this.zb=!0;this.Ta&&(this.Ta.close(),this.Ta=null);this.fc&&(document.body.removeChild(this.fc),this.fc=null);this.rb&&(clearTimeout(this.rb),this.rb=null)};h.ib=function(){this.zb||(this.f("Longpoll is closing itself"),this.cd(),this.ka&&(this.ka(this.Gc),this.ka=null))};h.close=function(){this.zb||(this.f("Longpoll is being closed."),this.cd())};
h.send=function(a){a=B(a);this.pb+=a.length;Lb(this.Va,"bytes_sent",a.length);a=Kc(a);a=fb(a,!0);a=Xc(a,1840);for(var b=0;b<a.length;b++){var c=this.Ta;c.$c.push({Jg:this.gf,Rg:a.length,jf:a[b]});c.ke&&$g(c);this.gf++}};function Yg(a,b){var c=B(b).length;a.ob+=c;Lb(a.Va,"bytes_received",c)}
function Xg(a,b,c,d){this.gd=d;this.jb=c;this.Oe=new cg;this.$c=[];this.se=Math.floor(1E8*Math.random());this.Td=!0;this.fe=Gc();window["pLPCommand"+this.fe]=a;window["pRTLPCB"+this.fe]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||Bb("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.gb=a.contentDocument:a.contentWindow?a.gb=a.contentWindow.document:a.document&&(a.gb=a.document);this.Ca=a;a="";this.Ca.src&&"javascript:"===this.Ca.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ca.gb.open(),this.Ca.gb.write(a),this.Ca.gb.close()}catch(f){Bb("frame writing exception"),f.stack&&Bb(f.stack),Bb(f)}}
Xg.prototype.close=function(){this.ke=!1;if(this.Ca){this.Ca.gb.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ca&&(document.body.removeChild(a.Ca),a.Ca=null)},Math.floor(0))}var b=this.jb;b&&(this.jb=null,b())};
function $g(a){if(a.ke&&a.Td&&a.Oe.count()<(0<a.$c.length?2:1)){a.se++;var b={};b.id=a.rg;b.pw=a.sg;b.ser=a.se;for(var b=a.gd(b),c="",d=0;0<a.$c.length;)if(1870>=a.$c[0].jf.length+30+c.length){var e=a.$c.shift(),c=c+"&seg"+d+"="+e.Jg+"&ts"+d+"="+e.Rg+"&d"+d+"="+e.jf;d++}else break;ah(a,b+c,a.se);return!0}return!1}function ah(a,b,c){function d(){a.Oe.remove(c);$g(a)}a.Oe.add(c,1);var e=setTimeout(d,Math.floor(25E3));Zg(a,b,function(){clearTimeout(e);d()})}
function Zg(a,b,c){setTimeout(function(){try{if(a.Td){var d=a.Ca.gb.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){Bb("Long-poll script failed to load: "+b);a.Td=!1;a.close()};a.Ca.gb.body.appendChild(d)}}catch(e){}},Math.floor(1))};var bh=null;"undefined"!==typeof MozWebSocket?bh=MozWebSocket:"undefined"!==typeof WebSocket&&(bh=WebSocket);function ch(a,b,c){this.qe=a;this.f=Oc(this.qe);this.frames=this.Jc=null;this.ob=this.pb=this.bf=0;this.Va=Ob(b);this.fb=(b.lb?"wss://":"ws://")+b.Oa+"/.ws?v=5";"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(this.fb+="&r=f");b.host!==b.Oa&&(this.fb=this.fb+"&ns="+b.Cb);c&&(this.fb=this.fb+"&s="+c)}var dh;
ch.prototype.open=function(a,b){this.jb=b;this.wg=a;this.f("Websocket connecting to "+this.fb);this.Gc=!1;Dc.set("previous_websocket_failure",!0);try{this.va=new bh(this.fb)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.ib();return}var e=this;this.va.onopen=function(){e.f("Websocket connected.");e.Gc=!0};this.va.onclose=function(){e.f("Websocket connection was disconnected.");e.va=null;e.ib()};this.va.onmessage=function(a){if(null!==e.va)if(a=a.data,e.ob+=
a.length,Lb(e.Va,"bytes_received",a.length),eh(e),null!==e.frames)fh(e,a);else{a:{J(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.bf=b;e.frames=[];a=null;break a}}e.bf=1;e.frames=[]}null!==a&&fh(e,a)}};this.va.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.ib()}};ch.prototype.start=function(){};
ch.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==bh&&!dh};ch.responsesRequiredToBeHealthy=2;ch.healthyTimeout=3E4;h=ch.prototype;h.Bd=function(){Dc.remove("previous_websocket_failure")};function fh(a,b){a.frames.push(b);if(a.frames.length==a.bf){var c=a.frames.join("");a.frames=null;c=mb(c);a.wg(c)}}
h.send=function(a){eh(this);a=B(a);this.pb+=a.length;Lb(this.Va,"bytes_sent",a.length);a=Xc(a,16384);1<a.length&&this.va.send(String(a.length));for(var b=0;b<a.length;b++)this.va.send(a[b])};h.cd=function(){this.zb=!0;this.Jc&&(clearInterval(this.Jc),this.Jc=null);this.va&&(this.va.close(),this.va=null)};h.ib=function(){this.zb||(this.f("WebSocket is closing itself"),this.cd(),this.jb&&(this.jb(this.Gc),this.jb=null))};h.close=function(){this.zb||(this.f("WebSocket is being closed"),this.cd())};
function eh(a){clearInterval(a.Jc);a.Jc=setInterval(function(){a.va&&a.va.send("0");eh(a)},Math.floor(45E3))};function gh(a){hh(this,a)}var ih=[Ug,ch];function hh(a,b){var c=ch&&ch.isAvailable(),d=c&&!(Dc.uf||!0===Dc.get("previous_websocket_failure"));b.Tg&&(c||Q("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.ed=[ch];else{var e=a.ed=[];Yc(ih,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function jh(a){if(0<a.ed.length)return a.ed[0];throw Error("No transports available");};function kh(a,b,c,d,e,f){this.id=a;this.f=Oc("c:"+this.id+":");this.hc=c;this.Vc=d;this.ka=e;this.Me=f;this.H=b;this.Jd=[];this.ef=0;this.Nf=new gh(b);this.Ua=0;this.f("Connection created");lh(this)}
function lh(a){var b=jh(a.Nf);a.L=new b("c:"+a.id+":"+a.ef++,a.H);a.Qe=b.responsesRequiredToBeHealthy||0;var c=mh(a,a.L),d=nh(a,a.L);a.fd=a.L;a.bd=a.L;a.F=null;a.Ab=!1;setTimeout(function(){a.L&&a.L.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.vd=setTimeout(function(){a.vd=null;a.Ab||(a.L&&102400<a.L.ob?(a.f("Connection exceeded healthy timeout but has received "+a.L.ob+" bytes.  Marking connection healthy."),a.Ab=!0,a.L.Bd()):a.L&&10240<a.L.pb?a.f("Connection exceeded healthy timeout but has sent "+
a.L.pb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function nh(a,b){return function(c){b===a.L?(a.L=null,c||0!==a.Ua?1===a.Ua&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.H.Oa.substr(0,2)&&(Dc.remove("host:"+a.H.host),a.H.Oa=a.H.host)),a.close()):b===a.F?(a.f("Secondary connection lost."),c=a.F,a.F=null,a.fd!==c&&a.bd!==c||a.close()):a.f("closing an old connection")}}
function mh(a,b){return function(c){if(2!=a.Ua)if(b===a.bd){var d=Vc("t",c);c=Vc("d",c);if("c"==d){if(d=Vc("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Vd=c.s;Fc(a.H,f);0==a.Ua&&(a.L.start(),oh(a,a.L,d),"5"!==e&&Q("Protocol version mismatch detected"),c=a.Nf,(c=1<c.ed.length?c.ed[1]:null)&&ph(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.bd=a.F;for(c=0;c<a.Jd.length;++c)a.Fd(a.Jd[c]);a.Jd=[];qh(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.Me&&(a.Me(c),a.Me=null),a.ka=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),Fc(a.H,c),1===a.Ua?a.close():(rh(a),lh(a))):"e"===d?Pc("Server Error: "+c):"o"===d?(a.f("got pong on primary."),sh(a),th(a)):Pc("Unknown control packet command: "+d)}else"d"==d&&a.Fd(c)}else if(b===a.F)if(d=Vc("t",c),c=Vc("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?uh(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.F.close(),a.fd!==a.F&&a.bd!==a.F||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.Lf--,uh(a)));else if("d"==d)a.Jd.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}kh.prototype.Da=function(a){vh(this,{t:"d",d:a})};function qh(a){a.fd===a.F&&a.bd===a.F&&(a.f("cleaning up and promoting a connection: "+a.F.qe),a.L=a.F,a.F=null)}
function uh(a){0>=a.Lf?(a.f("Secondary connection is healthy."),a.Ab=!0,a.F.Bd(),a.F.start(),a.f("sending client ack on secondary"),a.F.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.L.send({t:"c",d:{t:"n",d:{}}}),a.fd=a.F,qh(a)):(a.f("sending ping on secondary."),a.F.send({t:"c",d:{t:"p",d:{}}}))}kh.prototype.Fd=function(a){sh(this);this.hc(a)};function sh(a){a.Ab||(a.Qe--,0>=a.Qe&&(a.f("Primary connection is healthy."),a.Ab=!0,a.L.Bd()))}
function ph(a,b){a.F=new b("c:"+a.id+":"+a.ef++,a.H,a.Vd);a.Lf=b.responsesRequiredToBeHealthy||0;a.F.open(mh(a,a.F),nh(a,a.F));setTimeout(function(){a.F&&(a.f("Timed out trying to upgrade."),a.F.close())},Math.floor(6E4))}function oh(a,b,c){a.f("Realtime connection established.");a.L=b;a.Ua=1;a.Vc&&(a.Vc(c),a.Vc=null);0===a.Qe?(a.f("Primary connection is healthy."),a.Ab=!0):setTimeout(function(){th(a)},Math.floor(5E3))}
function th(a){a.Ab||1!==a.Ua||(a.f("sending ping on primary."),vh(a,{t:"c",d:{t:"p",d:{}}}))}function vh(a,b){if(1!==a.Ua)throw"Connection is not connected";a.fd.send(b)}kh.prototype.close=function(){2!==this.Ua&&(this.f("Closing realtime connection."),this.Ua=2,rh(this),this.ka&&(this.ka(),this.ka=null))};function rh(a){a.f("Shutting down all connections");a.L&&(a.L.close(),a.L=null);a.F&&(a.F.close(),a.F=null);a.vd&&(clearTimeout(a.vd),a.vd=null)};function wh(a,b,c,d){this.id=xh++;this.f=Oc("p:"+this.id+":");this.wf=this.De=!1;this.aa={};this.pa=[];this.Xc=0;this.Uc=[];this.ma=!1;this.$a=1E3;this.Cd=3E5;this.Gb=b;this.Tc=c;this.Ne=d;this.H=a;this.We=null;this.Qd={};this.Ig=0;this.mf=!0;this.Kc=this.Fe=null;yh(this,0);Mf.ub().Eb("visible",this.zg,this);-1===a.host.indexOf("fblocal")&&Lf.ub().Eb("online",this.xg,this)}var xh=0,zh=0;h=wh.prototype;
h.Da=function(a,b,c){var d=++this.Ig;a={r:d,a:a,b:b};this.f(B(a));J(this.ma,"sendRequest call when we're not connected not allowed.");this.Sa.Da(a);c&&(this.Qd[d]=c)};h.xf=function(a,b,c,d){var e=a.wa(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.aa[f]=this.aa[f]||{};J(!this.aa[f][e],"listen() called twice for same path/queryId.");a={J:d,ud:b,Fg:a,tag:c};this.aa[f][e]=a;this.ma&&Ah(this,a)};
function Ah(a,b){var c=b.Fg,d=c.path.toString(),e=c.wa();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=ce(c.o),f.t=b.tag);f.h=b.ud();a.Da("q",f,function(f){var k=f.d,l=f.s;if(k&&"object"===typeof k&&u(k,"w")){var m=w(k,"w");ea(m)&&0<=Na(m,"no_index")&&Q("Using an unspecified index. Consider adding "+('".indexOn": "'+c.o.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.aa[d]&&a.aa[d][e])===b&&(a.f("listen response",f),"ok"!==l&&Bh(a,d,e),b.J&&
b.J(l,k))})}h.P=function(a,b,c){this.Fa={fg:a,nf:!1,yc:b,jd:c};this.f("Authenticating using credential: "+a);Ch(this);(b=40==a.length)||(a=ad(a).Ac,b="object"===typeof a&&!0===w(a,"admin"));b&&(this.f("Admin auth credential detected.  Reducing max reconnect time."),this.Cd=3E4)};h.ee=function(a){delete this.Fa;this.ma&&this.Da("unauth",{},function(b){a(b.s,b.d)})};
function Ch(a){var b=a.Fa;a.ma&&b&&a.Da("auth",{cred:b.fg},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.Fa===b&&delete a.Fa;b.nf?"ok"!==d&&b.jd&&b.jd(d,c):(b.nf=!0,b.yc&&b.yc(d,c))})}h.Of=function(a,b){var c=a.path.toString(),d=a.wa();this.f("Unlisten called for "+c+" "+d);if(Bh(this,c,d)&&this.ma){var e=ce(a.o);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.Da("n",c)}};h.Le=function(a,b,c){this.ma?Dh(this,"o",a,b,c):this.Uc.push({Zc:a,action:"o",data:b,J:c})};
h.Bf=function(a,b,c){this.ma?Dh(this,"om",a,b,c):this.Uc.push({Zc:a,action:"om",data:b,J:c})};h.Gd=function(a,b){this.ma?Dh(this,"oc",a,null,b):this.Uc.push({Zc:a,action:"oc",data:null,J:b})};function Dh(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.Da(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}h.put=function(a,b,c,d){Eh(this,"p",a,b,c,d)};h.yf=function(a,b,c,d){Eh(this,"m",a,b,c,d)};
function Eh(a,b,c,d,e,f){d={p:c,d:d};n(f)&&(d.h=f);a.pa.push({action:b,If:d,J:e});a.Xc++;b=a.pa.length-1;a.ma?Fh(a,b):a.f("Buffering put: "+c)}function Fh(a,b){var c=a.pa[b].action,d=a.pa[b].If,e=a.pa[b].J;a.pa[b].Gg=a.ma;a.Da(c,d,function(d){a.f(c+" response",d);delete a.pa[b];a.Xc--;0===a.Xc&&(a.pa=[]);e&&e(d.s,d.d)})}h.Te=function(a){this.ma&&(a={c:a},this.f("reportStats",a),this.Da("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
h.Fd=function(a){if("r"in a){this.f("from server: "+B(a));var b=a.r,c=this.Qd[b];c&&(delete this.Qd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.f("handleServerMessage",b,c),"d"===b?this.Gb(c.p,c.d,!1,c.t):"m"===b?this.Gb(c.p,c.d,!0,c.t):"c"===b?Gh(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.Fa,delete this.Fa,c&&c.jd&&c.jd(a,b)):"sd"===b?this.We?this.We(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n",
"\nFIREBASE: ")):Pc("Unrecognized action received from server: "+B(b)+"\nAre you using the latest client?"))}};h.Vc=function(a){this.f("connection ready");this.ma=!0;this.Kc=(new Date).getTime();this.Ne({serverTimeOffset:a-(new Date).getTime()});this.mf&&(a={},a["sdk.js."+"2.2.5".replace(/\./g,"-")]=1,kg()&&(a["framework.cordova"]=1),this.Te(a));Hh(this);this.mf=!1;this.Tc(!0)};
function yh(a,b){J(!a.Sa,"Scheduling a connect when we're already connected/ing?");a.Sb&&clearTimeout(a.Sb);a.Sb=setTimeout(function(){a.Sb=null;Ih(a)},Math.floor(b))}h.zg=function(a){a&&!this.uc&&this.$a===this.Cd&&(this.f("Window became visible.  Reducing delay."),this.$a=1E3,this.Sa||yh(this,0));this.uc=a};h.xg=function(a){a?(this.f("Browser went online."),this.$a=1E3,this.Sa||yh(this,0)):(this.f("Browser went offline.  Killing connection."),this.Sa&&this.Sa.close())};
h.Cf=function(){this.f("data client disconnected");this.ma=!1;this.Sa=null;for(var a=0;a<this.pa.length;a++){var b=this.pa[a];b&&"h"in b.If&&b.Gg&&(b.J&&b.J("disconnect"),delete this.pa[a],this.Xc--)}0===this.Xc&&(this.pa=[]);this.Qd={};Jh(this)&&(this.uc?this.Kc&&(3E4<(new Date).getTime()-this.Kc&&(this.$a=1E3),this.Kc=null):(this.f("Window isn't visible.  Delaying reconnect."),this.$a=this.Cd,this.Fe=(new Date).getTime()),a=Math.max(0,this.$a-((new Date).getTime()-this.Fe)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),yh(this,a),this.$a=Math.min(this.Cd,1.3*this.$a));this.Tc(!1)};function Ih(a){if(Jh(a)){a.f("Making a connection attempt");a.Fe=(new Date).getTime();a.Kc=null;var b=q(a.Fd,a),c=q(a.Vc,a),d=q(a.Cf,a),e=a.id+":"+zh++;a.Sa=new kh(e,a.H,b,c,d,function(b){Q(b+" ("+a.H.toString()+")");a.wf=!0})}}h.yb=function(){this.De=!0;this.Sa?this.Sa.close():(this.Sb&&(clearTimeout(this.Sb),this.Sb=null),this.ma&&this.Cf())};h.qc=function(){this.De=!1;this.$a=1E3;this.Sa||yh(this,0)};
function Gh(a,b,c){c=c?Qa(c,function(a){return Wc(a)}).join("$"):"default";(a=Bh(a,b,c))&&a.J&&a.J("permission_denied")}function Bh(a,b,c){b=(new K(b)).toString();var d;n(a.aa[b])?(d=a.aa[b][c],delete a.aa[b][c],0===pa(a.aa[b])&&delete a.aa[b]):d=void 0;return d}function Hh(a){Ch(a);r(a.aa,function(b){r(b,function(b){Ah(a,b)})});for(var b=0;b<a.pa.length;b++)a.pa[b]&&Fh(a,b);for(;a.Uc.length;)b=a.Uc.shift(),Dh(a,b.action,b.Zc,b.data,b.J)}function Jh(a){var b;b=Lf.ub().ic;return!a.wf&&!a.De&&b};var V={lg:function(){Vg=dh=!0}};V.forceLongPolling=V.lg;V.mg=function(){Wg=!0};V.forceWebSockets=V.mg;V.Mg=function(a,b){a.k.Ra.We=b};V.setSecurityDebugCallback=V.Mg;V.Ye=function(a,b){a.k.Ye(b)};V.stats=V.Ye;V.Ze=function(a,b){a.k.Ze(b)};V.statsIncrementCounter=V.Ze;V.pd=function(a){return a.k.pd};V.dataUpdateCount=V.pd;V.pg=function(a,b){a.k.Ce=b};V.interceptServerData=V.pg;V.vg=function(a){new ug(a)};V.onPopupOpen=V.vg;V.Kg=function(a){fg=a};V.setAuthenticationServer=V.Kg;function S(a,b,c){this.B=a;this.V=b;this.g=c}S.prototype.K=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.B.K()};S.prototype.val=S.prototype.K;S.prototype.lf=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.B.K(!0)};S.prototype.exportVal=S.prototype.lf;S.prototype.kg=function(){x("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.B.e()};S.prototype.exists=S.prototype.kg;
S.prototype.w=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);ga(a)&&(a=String(a));Xf("Firebase.DataSnapshot.child",a);var b=new K(a),c=this.V.w(b);return new S(this.B.oa(b),c,M)};S.prototype.child=S.prototype.w;S.prototype.Ha=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Xf("Firebase.DataSnapshot.hasChild",a);var b=new K(a);return!this.B.oa(b).e()};S.prototype.hasChild=S.prototype.Ha;
S.prototype.A=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.B.A().K()};S.prototype.getPriority=S.prototype.A;S.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);A("Firebase.DataSnapshot.forEach",1,a,!1);if(this.B.N())return!1;var b=this;return!!this.B.U(this.g,function(c,d){return a(new S(d,b.V.w(c),M))})};S.prototype.forEach=S.prototype.forEach;
S.prototype.td=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.B.N()?!1:!this.B.e()};S.prototype.hasChildren=S.prototype.td;S.prototype.name=function(){Q("Firebase.DataSnapshot.name() being deprecated. Please use Firebase.DataSnapshot.key() instead.");x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.key()};S.prototype.name=S.prototype.name;S.prototype.key=function(){x("Firebase.DataSnapshot.key",0,0,arguments.length);return this.V.key()};
S.prototype.key=S.prototype.key;S.prototype.Db=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.B.Db()};S.prototype.numChildren=S.prototype.Db;S.prototype.lc=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.V};S.prototype.ref=S.prototype.lc;function Kh(a,b){this.H=a;this.Va=Ob(a);this.ea=new ub;this.Ed=1;this.Ra=null;b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)?(this.ca=new Ae(this.H,q(this.Gb,this)),setTimeout(q(this.Tc,this,!0),0)):this.ca=this.Ra=new wh(this.H,q(this.Gb,this),q(this.Tc,this),q(this.Ne,this));this.Pg=Pb(a,q(function(){return new Jb(this.Va,this.ca)},this));this.tc=new Cf;this.Be=
new nb;var c=this;this.zd=new gf({Xe:function(a,b,f,g){b=[];f=c.Be.j(a.path);f.e()||(b=jf(c.zd,new Ub(ze,a.path,f)),setTimeout(function(){g("ok")},0));return b},Zd:ba});Lh(this,"connected",!1);this.ka=new qc;this.P=new Eg(a,q(this.ca.P,this.ca),q(this.ca.ee,this.ca),q(this.Ke,this));this.pd=0;this.Ce=null;this.O=new gf({Xe:function(a,b,f,g){c.ca.xf(a,f,b,function(b,e){var f=g(b,e);zb(c.ea,a.path,f)});return[]},Zd:function(a,b){c.ca.Of(a,b)}})}h=Kh.prototype;
h.toString=function(){return(this.H.lb?"https://":"http://")+this.H.host};h.name=function(){return this.H.Cb};function Mh(a){a=a.Be.j(new K(".info/serverTimeOffset")).K()||0;return(new Date).getTime()+a}function Nh(a){a=a={timestamp:Mh(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
h.Gb=function(a,b,c,d){this.pd++;var e=new K(a);b=this.Ce?this.Ce(a,b):b;a=[];d?c?(b=na(b,function(a){return L(a)}),a=rf(this.O,e,b,d)):(b=L(b),a=nf(this.O,e,b,d)):c?(d=na(b,function(a){return L(a)}),a=mf(this.O,e,d)):(d=L(b),a=jf(this.O,new Ub(ze,e,d)));d=e;0<a.length&&(d=Oh(this,e));zb(this.ea,d,a)};h.Tc=function(a){Lh(this,"connected",a);!1===a&&Ph(this)};h.Ne=function(a){var b=this;Yc(a,function(a,d){Lh(b,d,a)})};h.Ke=function(a){Lh(this,"authenticated",a)};
function Lh(a,b,c){b=new K("/.info/"+b);c=L(c);var d=a.Be;d.Sd=d.Sd.G(b,c);c=jf(a.zd,new Ub(ze,b,c));zb(a.ea,b,c)}h.Kb=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,Xg:c});var e=Nh(this);b=L(b,c);var e=sc(b,e),f=this.Ed++,e=hf(this.O,a,e,f,!0);vb(this.ea,e);var g=this;this.ca.put(a.toString(),b.K(!0),function(b,c){var e="ok"===b;e||Q("set at "+a+" failed: "+b);e=lf(g.O,f,!e);zb(g.ea,a,e);Qh(d,b,c)});e=Rh(this,a);Oh(this,e);zb(this.ea,e,[])};
h.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=Nh(this),f={};r(b,function(a,b){d=!1;var c=L(a);f[b]=sc(c,e)});if(d)Bb("update() called with empty data.  Don't do anything."),Qh(c,"ok");else{var g=this.Ed++,k=kf(this.O,a,f,g);vb(this.ea,k);var l=this;this.ca.yf(a.toString(),b,function(b,d){var e="ok"===b;e||Q("update at "+a+" failed: "+b);var e=lf(l.O,g,!e),f=a;0<e.length&&(f=Oh(l,a));zb(l.ea,f,e);Qh(c,b,d)});b=Rh(this,a);Oh(this,b);zb(this.ea,a,[])}};
function Ph(a){a.f("onDisconnectEvents");var b=Nh(a),c=[];rc(pc(a.ka,b),F,function(b,e){c=c.concat(jf(a.O,new Ub(ze,b,e)));var f=Rh(a,b);Oh(a,f)});a.ka=new qc;zb(a.ea,F,c)}h.Gd=function(a,b){var c=this;this.ca.Gd(a.toString(),function(d,e){"ok"===d&&eg(c.ka,a);Qh(b,d,e)})};function Sh(a,b,c,d){var e=L(c);a.ca.Le(b.toString(),e.K(!0),function(c,g){"ok"===c&&a.ka.mc(b,e);Qh(d,c,g)})}function Th(a,b,c,d,e){var f=L(c,d);a.ca.Le(b.toString(),f.K(!0),function(c,d){"ok"===c&&a.ka.mc(b,f);Qh(e,c,d)})}
function Uh(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(Bb("onDisconnect().update() called with empty data.  Don't do anything."),Qh(d,"ok")):a.ca.Bf(b.toString(),c,function(e,f){if("ok"===e)for(var l in c){var m=L(c[l]);a.ka.mc(b.w(l),m)}Qh(d,e,f)})}function Vh(a,b,c){c=".info"===O(b.path)?a.zd.Ob(b,c):a.O.Ob(b,c);xb(a.ea,b.path,c)}h.yb=function(){this.Ra&&this.Ra.yb()};h.qc=function(){this.Ra&&this.Ra.qc()};
h.Ye=function(a){if("undefined"!==typeof console){a?(this.Yd||(this.Yd=new Ib(this.Va)),a=this.Yd.get()):a=this.Va.get();var b=Ra(sa(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};h.Ze=function(a){Lb(this.Va,a);this.Pg.Mf[a]=!0};h.f=function(a){var b="";this.Ra&&(b=this.Ra.id+":");Bb(b,arguments)};
function Qh(a,b,c){a&&Cb(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Wh(a,b,c,d,e){function f(){}a.f("transaction on "+b);var g=new U(a,b);g.Eb("value",f);c={path:b,update:c,J:d,status:null,Ef:Gc(),cf:e,Kf:0,ge:function(){g.gc("value",f)},je:null,Aa:null,md:null,nd:null,od:null};d=a.O.ua(b,void 0)||C;c.md=d;d=c.update(d.K());if(n(d)){Sf("transaction failed: Data returned ",d,c.path);c.status=1;e=Df(a.tc,b);var k=e.Ba()||[];k.push(c);Ef(e,k);"object"===typeof d&&null!==d&&u(d,".priority")?(k=w(d,".priority"),J(Qf(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.O.ua(b)||C).A().K();e=Nh(a);d=L(d,k);e=sc(d,e);c.nd=d;c.od=e;c.Aa=a.Ed++;c=hf(a.O,b,e,c.Aa,c.cf);zb(a.ea,b,c);Xh(a)}else c.ge(),c.nd=null,c.od=null,c.J&&(a=new S(c.md,new U(a,c.path),M),c.J(null,!1,a))}function Xh(a,b){var c=b||a.tc;b||Yh(a,c);if(null!==c.Ba()){var d=Zh(a,c);J(0<d.length,"Sending zero length transaction queue");Sa(d,function(a){return 1===a.status})&&$h(a,c.path(),d)}else c.td()&&c.U(function(b){Xh(a,b)})}
function $h(a,b,c){for(var d=Qa(c,function(a){return a.Aa}),e=a.O.ua(b,d)||C,d=e,e=e.hash(),f=0;f<c.length;f++){var g=c[f];J(1===g.status,"tryToSendTransactionQueue_: items in queue should all be run.");g.status=2;g.Kf++;var k=N(b,g.path),d=d.G(k,g.nd)}d=d.K(!0);a.ca.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(lf(a.O,c[f].Aa));if(c[f].J){var g=c[f].od,k=new U(a,c[f].path);d.push(q(c[f].J,
null,null,!0,new S(g,k,M)))}c[f].ge()}Yh(a,Df(a.tc,b));Xh(a);zb(a.ea,b,e);for(f=0;f<d.length;f++)Cb(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(Q("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].je=d;Oh(a,b)}},e)}function Oh(a,b){var c=ai(a,b),d=c.path(),c=Zh(a,c);bi(a,c,d);return d}
function bi(a,b,c){if(0!==b.length){for(var d=[],e=[],f=Qa(b,function(a){return a.Aa}),g=0;g<b.length;g++){var k=b[g],l=N(c,k.path),m=!1,v;J(null!==l,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)m=!0,v=k.je,e=e.concat(lf(a.O,k.Aa,!0));else if(1===k.status)if(25<=k.Kf)m=!0,v="maxretry",e=e.concat(lf(a.O,k.Aa,!0));else{var y=a.O.ua(k.path,f)||C;k.md=y;var I=b[g].update(y.K());n(I)?(Sf("transaction failed: Data returned ",I,k.path),l=L(I),"object"===typeof I&&null!=
I&&u(I,".priority")||(l=l.da(y.A())),y=k.Aa,I=Nh(a),I=sc(l,I),k.nd=l,k.od=I,k.Aa=a.Ed++,Va(f,y),e=e.concat(hf(a.O,k.path,I,k.Aa,k.cf)),e=e.concat(lf(a.O,y,!0))):(m=!0,v="nodata",e=e.concat(lf(a.O,k.Aa,!0)))}zb(a.ea,c,e);e=[];m&&(b[g].status=3,setTimeout(b[g].ge,Math.floor(0)),b[g].J&&("nodata"===v?(k=new U(a,b[g].path),d.push(q(b[g].J,null,null,!1,new S(b[g].md,k,M)))):d.push(q(b[g].J,null,Error(v),!1,null))))}Yh(a,a.tc);for(g=0;g<d.length;g++)Cb(d[g]);Xh(a)}}
function ai(a,b){for(var c,d=a.tc;null!==(c=O(b))&&null===d.Ba();)d=Df(d,c),b=G(b);return d}function Zh(a,b){var c=[];ci(a,b,c);c.sort(function(a,b){return a.Ef-b.Ef});return c}function ci(a,b,c){var d=b.Ba();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.U(function(b){ci(a,b,c)})}function Yh(a,b){var c=b.Ba();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Ef(b,0<c.length?c:null)}b.U(function(b){Yh(a,b)})}
function Rh(a,b){var c=ai(a,b).path(),d=Df(a.tc,b);Hf(d,function(b){di(a,b)});di(a,d);Gf(d,function(b){di(a,b)});return c}
function di(a,b){var c=b.Ba();if(null!==c){for(var d=[],e=[],f=-1,g=0;g<c.length;g++)4!==c[g].status&&(2===c[g].status?(J(f===g-1,"All SENT items should be at beginning of queue."),f=g,c[g].status=4,c[g].je="set"):(J(1===c[g].status,"Unexpected transaction status in abort"),c[g].ge(),e=e.concat(lf(a.O,c[g].Aa,!0)),c[g].J&&d.push(q(c[g].J,null,Error("set"),!1,null))));-1===f?Ef(b,null):c.length=f+1;zb(a.ea,b.path(),e);for(g=0;g<d.length;g++)Cb(d[g])}};function W(){this.nc={};this.Pf=!1}ca(W);W.prototype.yb=function(){for(var a in this.nc)this.nc[a].yb()};W.prototype.interrupt=W.prototype.yb;W.prototype.qc=function(){for(var a in this.nc)this.nc[a].qc()};W.prototype.resume=W.prototype.qc;W.prototype.ue=function(){this.Pf=!0};function X(a,b){this.ad=a;this.qa=b}X.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);A("Firebase.onDisconnect().cancel",1,a,!0);this.ad.Gd(this.qa,a||null)};X.prototype.cancel=X.prototype.cancel;X.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);Yf("Firebase.onDisconnect().remove",this.qa);A("Firebase.onDisconnect().remove",1,a,!0);Sh(this.ad,this.qa,null,a)};X.prototype.remove=X.prototype.remove;
X.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);Yf("Firebase.onDisconnect().set",this.qa);Rf("Firebase.onDisconnect().set",a,this.qa,!1);A("Firebase.onDisconnect().set",2,b,!0);Sh(this.ad,this.qa,a,b)};X.prototype.set=X.prototype.set;
X.prototype.Kb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);Yf("Firebase.onDisconnect().setWithPriority",this.qa);Rf("Firebase.onDisconnect().setWithPriority",a,this.qa,!1);Uf("Firebase.onDisconnect().setWithPriority",2,b);A("Firebase.onDisconnect().setWithPriority",3,c,!0);Th(this.ad,this.qa,a,b,c)};X.prototype.setWithPriority=X.prototype.Kb;
X.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);Yf("Firebase.onDisconnect().update",this.qa);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;Q("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Tf("Firebase.onDisconnect().update",a,this.qa);A("Firebase.onDisconnect().update",2,b,!0);
Uh(this.ad,this.qa,a,b)};X.prototype.update=X.prototype.update;function Y(a,b,c,d){this.k=a;this.path=b;this.o=c;this.jc=d}
function ei(a){var b=null,c=null;a.la&&(b=od(a));a.na&&(c=qd(a));if(a.g===Vd){if(a.la){if("[MIN_NAME]"!=nd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.na){if("[MAX_NAME]"!=pd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===M){if(null!=b&&!Qf(b)||null!=c&&!Qf(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(J(a.g instanceof Rd||a.g===Yd,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function fi(a){if(a.la&&a.na&&a.ia&&(!a.ia||""===a.Nb))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function gi(a,b){if(!0===a.jc)throw Error(b+": You can't combine multiple orderBy calls.");}Y.prototype.lc=function(){x("Query.ref",0,0,arguments.length);return new U(this.k,this.path)};Y.prototype.ref=Y.prototype.lc;
Y.prototype.Eb=function(a,b,c,d){x("Query.on",2,4,arguments.length);Vf("Query.on",a,!1);A("Query.on",2,b,!1);var e=hi("Query.on",c,d);if("value"===a)Vh(this.k,this,new jd(b,e.cancel||null,e.Ma||null));else{var f={};f[a]=b;Vh(this.k,this,new kd(f,e.cancel,e.Ma))}return b};Y.prototype.on=Y.prototype.Eb;
Y.prototype.gc=function(a,b,c){x("Query.off",0,3,arguments.length);Vf("Query.off",a,!0);A("Query.off",2,b,!0);lb("Query.off",3,c);var d=null,e=null;"value"===a?d=new jd(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new kd(e,null,c||null));e=this.k;d=".info"===O(this.path)?e.zd.kb(this,d):e.O.kb(this,d);xb(e.ea,this.path,d)};Y.prototype.off=Y.prototype.gc;
Y.prototype.Ag=function(a,b){function c(g){f&&(f=!1,e.gc(a,c),b.call(d.Ma,g))}x("Query.once",2,4,arguments.length);Vf("Query.once",a,!1);A("Query.once",2,b,!1);var d=hi("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.Eb(a,c,function(b){e.gc(a,c);d.cancel&&d.cancel.call(d.Ma,b)})};Y.prototype.once=Y.prototype.Ag;
Y.prototype.Ge=function(a){Q("Query.limit() being deprecated. Please use Query.limitToFirst() or Query.limitToLast() instead.");x("Query.limit",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limit: First argument must be a positive integer.");if(this.o.ia)throw Error("Query.limit: Limit was already set (by another call to limit, limitToFirst, orlimitToLast.");var b=this.o.Ge(a);fi(b);return new Y(this.k,this.path,b,this.jc)};Y.prototype.limit=Y.prototype.Ge;
Y.prototype.He=function(a){x("Query.limitToFirst",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.o.ia)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.o.He(a),this.jc)};Y.prototype.limitToFirst=Y.prototype.He;
Y.prototype.Ie=function(a){x("Query.limitToLast",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.o.ia)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.o.Ie(a),this.jc)};Y.prototype.limitToLast=Y.prototype.Ie;
Y.prototype.Bg=function(a){x("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');Wf("Query.orderByChild",1,a,!1);gi(this,"Query.orderByChild");var b=be(this.o,new Rd(a));ei(b);return new Y(this.k,
this.path,b,!0)};Y.prototype.orderByChild=Y.prototype.Bg;Y.prototype.Cg=function(){x("Query.orderByKey",0,0,arguments.length);gi(this,"Query.orderByKey");var a=be(this.o,Vd);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByKey=Y.prototype.Cg;Y.prototype.Dg=function(){x("Query.orderByPriority",0,0,arguments.length);gi(this,"Query.orderByPriority");var a=be(this.o,M);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByPriority=Y.prototype.Dg;
Y.prototype.Eg=function(){x("Query.orderByValue",0,0,arguments.length);gi(this,"Query.orderByValue");var a=be(this.o,Yd);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByValue=Y.prototype.Eg;
Y.prototype.Xd=function(a,b){x("Query.startAt",0,2,arguments.length);Rf("Query.startAt",a,this.path,!0);Wf("Query.startAt",2,b,!0);var c=this.o.Xd(a,b);fi(c);ei(c);if(this.o.la)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");n(a)||(b=a=null);return new Y(this.k,this.path,c,this.jc)};Y.prototype.startAt=Y.prototype.Xd;
Y.prototype.qd=function(a,b){x("Query.endAt",0,2,arguments.length);Rf("Query.endAt",a,this.path,!0);Wf("Query.endAt",2,b,!0);var c=this.o.qd(a,b);fi(c);ei(c);if(this.o.na)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new Y(this.k,this.path,c,this.jc)};Y.prototype.endAt=Y.prototype.qd;
Y.prototype.hg=function(a,b){x("Query.equalTo",1,2,arguments.length);Rf("Query.equalTo",a,this.path,!1);Wf("Query.equalTo",2,b,!0);if(this.o.la)throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if(this.o.na)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Xd(a,b).qd(a,b)};Y.prototype.equalTo=Y.prototype.hg;
Y.prototype.toString=function(){x("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.Y;c<a.n.length;c++)""!==a.n[c]&&(b+="/"+encodeURIComponent(String(a.n[c])));return this.k.toString()+(b||"/")};Y.prototype.toString=Y.prototype.toString;Y.prototype.wa=function(){var a=Wc(ce(this.o));return"{}"===a?"default":a};
function hi(a,b,c){var d={cancel:null,Ma:null};if(b&&c)d.cancel=b,A(a,3,d.cancel,!0),d.Ma=c,lb(a,4,d.Ma);else if(b)if("object"===typeof b&&null!==b)d.Ma=b;else if("function"===typeof b)d.cancel=b;else throw Error(z(a,3,!0)+" must either be a cancel callback or a context object.");return d};var Z={};Z.vc=wh;Z.DataConnection=Z.vc;wh.prototype.Og=function(a,b){this.Da("q",{p:a},b)};Z.vc.prototype.simpleListen=Z.vc.prototype.Og;wh.prototype.gg=function(a,b){this.Da("echo",{d:a},b)};Z.vc.prototype.echo=Z.vc.prototype.gg;wh.prototype.interrupt=wh.prototype.yb;Z.Sf=kh;Z.RealTimeConnection=Z.Sf;kh.prototype.sendRequest=kh.prototype.Da;kh.prototype.close=kh.prototype.close;
Z.og=function(a){var b=wh.prototype.put;wh.prototype.put=function(c,d,e,f){n(f)&&(f=a());b.call(this,c,d,e,f)};return function(){wh.prototype.put=b}};Z.hijackHash=Z.og;Z.Rf=Ec;Z.ConnectionTarget=Z.Rf;Z.wa=function(a){return a.wa()};Z.queryIdentifier=Z.wa;Z.qg=function(a){return a.k.Ra.aa};Z.listens=Z.qg;Z.ue=function(a){a.ue()};Z.forceRestClient=Z.ue;function U(a,b){var c,d,e;if(a instanceof Kh)c=a,d=b;else{x("new Firebase",1,2,arguments.length);d=Rc(arguments[0]);c=d.Qg;"firebase"===d.domain&&Qc(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c||Qc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.lb||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&Q("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
c=new Ec(d.host,d.lb,c,"ws"===d.scheme||"wss"===d.scheme);d=new K(d.Zc);e=d.toString();var f;!(f=!p(c.host)||0===c.host.length||!Pf(c.Cb))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(p(e)&&0!==e.length&&!Of.test(e)));if(f)throw Error(z("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof W)e=b;else if(p(b))e=W.ub(),c.Ld=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
else e=W.ub();f=c.toString();var g=w(e.nc,f);g||(g=new Kh(c,e.Pf),e.nc[f]=g);c=g}Y.call(this,c,d,$d,!1)}ma(U,Y);var ii=U,ji=["Firebase"],ki=aa;ji[0]in ki||!ki.execScript||ki.execScript("var "+ji[0]);for(var li;ji.length&&(li=ji.shift());)!ji.length&&n(ii)?ki[li]=ii:ki=ki[li]?ki[li]:ki[li]={};U.prototype.name=function(){Q("Firebase.name() being deprecated. Please use Firebase.key() instead.");x("Firebase.name",0,0,arguments.length);return this.key()};U.prototype.name=U.prototype.name;
U.prototype.key=function(){x("Firebase.key",0,0,arguments.length);return this.path.e()?null:vc(this.path)};U.prototype.key=U.prototype.key;U.prototype.w=function(a){x("Firebase.child",1,1,arguments.length);if(ga(a))a=String(a);else if(!(a instanceof K))if(null===O(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Xf("Firebase.child",b)}else Xf("Firebase.child",a);return new U(this.k,this.path.w(a))};U.prototype.child=U.prototype.w;
U.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new U(this.k,a)};U.prototype.parent=U.prototype.parent;U.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};U.prototype.root=U.prototype.root;
U.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);Yf("Firebase.set",this.path);Rf("Firebase.set",a,this.path,!1);A("Firebase.set",2,b,!0);this.k.Kb(this.path,a,null,b||null)};U.prototype.set=U.prototype.set;
U.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);Yf("Firebase.update",this.path);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;Q("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Tf("Firebase.update",a,this.path);A("Firebase.update",2,b,!0);this.k.update(this.path,a,b||null)};U.prototype.update=U.prototype.update;
U.prototype.Kb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);Yf("Firebase.setWithPriority",this.path);Rf("Firebase.setWithPriority",a,this.path,!1);Uf("Firebase.setWithPriority",2,b);A("Firebase.setWithPriority",3,c,!0);if(".length"===this.key()||".keys"===this.key())throw"Firebase.setWithPriority failed: "+this.key()+" is a read-only object.";this.k.Kb(this.path,a,b,c||null)};U.prototype.setWithPriority=U.prototype.Kb;
U.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);Yf("Firebase.remove",this.path);A("Firebase.remove",1,a,!0);this.set(null,a)};U.prototype.remove=U.prototype.remove;
U.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);Yf("Firebase.transaction",this.path);A("Firebase.transaction",1,a,!1);A("Firebase.transaction",2,b,!0);if(n(c)&&"boolean"!=typeof c)throw Error(z("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.key()||".keys"===this.key())throw"Firebase.transaction failed: "+this.key()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Wh(this.k,this.path,a,b||null,c)};U.prototype.transaction=U.prototype.transaction;
U.prototype.Lg=function(a,b){x("Firebase.setPriority",1,2,arguments.length);Yf("Firebase.setPriority",this.path);Uf("Firebase.setPriority",1,a);A("Firebase.setPriority",2,b,!0);this.k.Kb(this.path.w(".priority"),a,null,b)};U.prototype.setPriority=U.prototype.Lg;
U.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);Yf("Firebase.push",this.path);Rf("Firebase.push",a,this.path,!0);A("Firebase.push",2,b,!0);var c=Mh(this.k),c=Kf(c),c=this.w(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};U.prototype.push=U.prototype.push;U.prototype.jb=function(){Yf("Firebase.onDisconnect",this.path);return new X(this.k,this.path)};U.prototype.onDisconnect=U.prototype.jb;
U.prototype.P=function(a,b,c){Q("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");x("Firebase.auth",1,3,arguments.length);Zf("Firebase.auth",a);A("Firebase.auth",2,b,!0);A("Firebase.auth",3,b,!0);Kg(this.k.P,a,{},{remember:"none"},b,c)};U.prototype.auth=U.prototype.P;U.prototype.ee=function(a){x("Firebase.unauth",0,1,arguments.length);A("Firebase.unauth",1,a,!0);Lg(this.k.P,a)};U.prototype.unauth=U.prototype.ee;
U.prototype.we=function(){x("Firebase.getAuth",0,0,arguments.length);return this.k.P.we()};U.prototype.getAuth=U.prototype.we;U.prototype.ug=function(a,b){x("Firebase.onAuth",1,2,arguments.length);A("Firebase.onAuth",1,a,!1);lb("Firebase.onAuth",2,b);this.k.P.Eb("auth_status",a,b)};U.prototype.onAuth=U.prototype.ug;U.prototype.tg=function(a,b){x("Firebase.offAuth",1,2,arguments.length);A("Firebase.offAuth",1,a,!1);lb("Firebase.offAuth",2,b);this.k.P.gc("auth_status",a,b)};U.prototype.offAuth=U.prototype.tg;
U.prototype.Wf=function(a,b,c){x("Firebase.authWithCustomToken",2,3,arguments.length);Zf("Firebase.authWithCustomToken",a);A("Firebase.authWithCustomToken",2,b,!1);ag("Firebase.authWithCustomToken",3,c,!0);Kg(this.k.P,a,{},c||{},b)};U.prototype.authWithCustomToken=U.prototype.Wf;U.prototype.Xf=function(a,b,c){x("Firebase.authWithOAuthPopup",2,3,arguments.length);$f("Firebase.authWithOAuthPopup",1,a);A("Firebase.authWithOAuthPopup",2,b,!1);ag("Firebase.authWithOAuthPopup",3,c,!0);Pg(this.k.P,a,c,b)};
U.prototype.authWithOAuthPopup=U.prototype.Xf;U.prototype.Yf=function(a,b,c){x("Firebase.authWithOAuthRedirect",2,3,arguments.length);$f("Firebase.authWithOAuthRedirect",1,a);A("Firebase.authWithOAuthRedirect",2,b,!1);ag("Firebase.authWithOAuthRedirect",3,c,!0);var d=this.k.P;Ng(d);var e=[wg],f=ig(c);"anonymous"===a||"firebase"===a?R(b,yg("TRANSPORT_UNAVAILABLE")):(P.set("redirect_client_options",f.ld),Og(d,e,"/auth/"+a,f,b))};U.prototype.authWithOAuthRedirect=U.prototype.Yf;
U.prototype.Zf=function(a,b,c,d){x("Firebase.authWithOAuthToken",3,4,arguments.length);$f("Firebase.authWithOAuthToken",1,a);A("Firebase.authWithOAuthToken",3,c,!1);ag("Firebase.authWithOAuthToken",4,d,!0);p(b)?($f("Firebase.authWithOAuthToken",2,b),Mg(this.k.P,a+"/token",{access_token:b},d,c)):(ag("Firebase.authWithOAuthToken",2,b,!1),Mg(this.k.P,a+"/token",b,d,c))};U.prototype.authWithOAuthToken=U.prototype.Zf;
U.prototype.Vf=function(a,b){x("Firebase.authAnonymously",1,2,arguments.length);A("Firebase.authAnonymously",1,a,!1);ag("Firebase.authAnonymously",2,b,!0);Mg(this.k.P,"anonymous",{},b,a)};U.prototype.authAnonymously=U.prototype.Vf;
U.prototype.$f=function(a,b,c){x("Firebase.authWithPassword",2,3,arguments.length);ag("Firebase.authWithPassword",1,a,!1);bg("Firebase.authWithPassword",a,"email");bg("Firebase.authWithPassword",a,"password");A("Firebase.authAnonymously",2,b,!1);ag("Firebase.authAnonymously",3,c,!0);Mg(this.k.P,"password",a,c,b)};U.prototype.authWithPassword=U.prototype.$f;
U.prototype.re=function(a,b){x("Firebase.createUser",2,2,arguments.length);ag("Firebase.createUser",1,a,!1);bg("Firebase.createUser",a,"email");bg("Firebase.createUser",a,"password");A("Firebase.createUser",2,b,!1);this.k.P.re(a,b)};U.prototype.createUser=U.prototype.re;U.prototype.Se=function(a,b){x("Firebase.removeUser",2,2,arguments.length);ag("Firebase.removeUser",1,a,!1);bg("Firebase.removeUser",a,"email");bg("Firebase.removeUser",a,"password");A("Firebase.removeUser",2,b,!1);this.k.P.Se(a,b)};
U.prototype.removeUser=U.prototype.Se;U.prototype.oe=function(a,b){x("Firebase.changePassword",2,2,arguments.length);ag("Firebase.changePassword",1,a,!1);bg("Firebase.changePassword",a,"email");bg("Firebase.changePassword",a,"oldPassword");bg("Firebase.changePassword",a,"newPassword");A("Firebase.changePassword",2,b,!1);this.k.P.oe(a,b)};U.prototype.changePassword=U.prototype.oe;
U.prototype.ne=function(a,b){x("Firebase.changeEmail",2,2,arguments.length);ag("Firebase.changeEmail",1,a,!1);bg("Firebase.changeEmail",a,"oldEmail");bg("Firebase.changeEmail",a,"newEmail");bg("Firebase.changeEmail",a,"password");A("Firebase.changeEmail",2,b,!1);this.k.P.ne(a,b)};U.prototype.changeEmail=U.prototype.ne;
U.prototype.Ue=function(a,b){x("Firebase.resetPassword",2,2,arguments.length);ag("Firebase.resetPassword",1,a,!1);bg("Firebase.resetPassword",a,"email");A("Firebase.resetPassword",2,b,!1);this.k.P.Ue(a,b)};U.prototype.resetPassword=U.prototype.Ue;U.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);W.ub().yb()};U.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);W.ub().qc()};
function Nc(a,b){J(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?Ab=q(console.log,console):"object"===typeof console.log&&(Ab=function(a){console.log(a)})),b&&P.set("logging_enabled",!0)):a?Ab=a:(Ab=null,P.remove("logging_enabled"))}U.enableLogging=Nc;U.ServerValue={TIMESTAMP:{".sv":"timestamp"}};U.SDK_VERSION="2.2.5";U.INTERNAL=V;U.Context=W;U.TEST_ACCESS=Z;})();

module.exports = Firebase;

},{}],10:[function(require,module,exports){
var _ = require('../util')

/**
 * Create a child instance that prototypally inehrits
 * data on parent. To achieve that we create an intermediate
 * constructor with its prototype pointing to parent.
 *
 * @param {Object} opts
 * @param {Function} [BaseCtor]
 * @return {Vue}
 * @public
 */

exports.$addChild = function (opts, BaseCtor) {
  BaseCtor = BaseCtor || _.Vue
  opts = opts || {}
  var parent = this
  var ChildVue
  var inherit = opts.inherit !== undefined
    ? opts.inherit
    : BaseCtor.options.inherit
  if (inherit) {
    var ctors = parent._childCtors
    ChildVue = ctors[BaseCtor.cid]
    if (!ChildVue) {
      var optionName = BaseCtor.options.name
      var className = optionName
        ? _.classify(optionName)
        : 'VueComponent'
      ChildVue = new Function(
        'return function ' + className + ' (options) {' +
        'this.constructor = ' + className + ';' +
        'this._init(options) }'
      )()
      ChildVue.options = BaseCtor.options
      ChildVue.prototype = this
      ctors[BaseCtor.cid] = ChildVue
    }
  } else {
    ChildVue = BaseCtor
  }
  opts._parent = parent
  opts._root = parent.$root
  var child = new ChildVue(opts)
  return child
}
},{"../util":67}],11:[function(require,module,exports){
var _ = require('../util')
var Watcher = require('../watcher')
var Path = require('../parsers/path')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var expParser = require('../parsers/expression')
var filterRE = /[^|]\|[^|]/

/**
 * Get the value from an expression on this vm.
 *
 * @param {String} exp
 * @return {*}
 */

exports.$get = function (exp) {
  var res = expParser.parse(exp)
  if (res) {
    try {
      return res.get.call(this, this)
    } catch (e) {}
  }
}

/**
 * Set the value from an expression on this vm.
 * The expression must be a valid left-hand
 * expression in an assignment.
 *
 * @param {String} exp
 * @param {*} val
 */

exports.$set = function (exp, val) {
  var res = expParser.parse(exp, true)
  if (res && res.set) {
    res.set.call(this, this, val)
  }
}

/**
 * Add a property on the VM
 *
 * @param {String} key
 * @param {*} val
 */

exports.$add = function (key, val) {
  this._data.$add(key, val)
}

/**
 * Delete a property on the VM
 *
 * @param {String} key
 */

exports.$delete = function (key) {
  this._data.$delete(key)
}

/**
 * Watch an expression, trigger callback when its
 * value changes.
 *
 * @param {String} exp
 * @param {Function} cb
 * @param {Boolean} [deep]
 * @param {Boolean} [immediate]
 * @return {Function} - unwatchFn
 */

exports.$watch = function (exp, cb, deep, immediate) {
  var vm = this
  var key = deep ? exp + '**deep**' : exp
  var watcher = vm._userWatchers[key]
  var wrappedCb = function (val, oldVal) {
    cb.call(vm, val, oldVal)
  }
  if (!watcher) {
    watcher = vm._userWatchers[key] =
      new Watcher(vm, exp, wrappedCb, {
        deep: deep,
        user: true
      })
  } else {
    watcher.addCb(wrappedCb)
  }
  if (immediate) {
    wrappedCb(watcher.value)
  }
  return function unwatchFn () {
    watcher.removeCb(wrappedCb)
    if (!watcher.active) {
      vm._userWatchers[key] = null
    }
  }
}

/**
 * Evaluate a text directive, including filters.
 *
 * @param {String} text
 * @return {String}
 */

exports.$eval = function (text) {
  // check for filters.
  if (filterRE.test(text)) {
    var dir = dirParser.parse(text)[0]
    // the filter regex check might give false positive
    // for pipes inside strings, so it's possible that
    // we don't get any filters here
    return dir.filters
      ? _.applyFilters(
          this.$get(dir.expression),
          _.resolveFilters(this, dir.filters).read,
          this
        )
      : this.$get(dir.expression)
  } else {
    // no filter
    return this.$get(text)
  }
}

/**
 * Interpolate a piece of template text.
 *
 * @param {String} text
 * @return {String}
 */

exports.$interpolate = function (text) {
  var tokens = textParser.parse(text)
  var vm = this
  if (tokens) {
    return tokens.length === 1
      ? vm.$eval(tokens[0].value)
      : tokens.map(function (token) {
          return token.tag
            ? vm.$eval(token.value)
            : token.value
        }).join('')
  } else {
    return text
  }
}

/**
 * Log instance data as a plain JS object
 * so that it is easier to inspect in console.
 * This method assumes console is available.
 *
 * @param {String} [path]
 */

exports.$log = function (path) {
  var data = path
    ? Path.get(this._data, path)
    : this._data
  if (data) {
    data = JSON.parse(JSON.stringify(data))
  }
  console.log(data)
}
},{"../parsers/directive":55,"../parsers/expression":56,"../parsers/path":57,"../parsers/text":59,"../util":67,"../watcher":71}],12:[function(require,module,exports){
var _ = require('../util')
var transition = require('../transition')

/**
 * Append instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$appendTo = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    append, transition.append
  )
}

/**
 * Prepend instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$prependTo = function (target, cb, withTransition) {
  target = query(target)
  if (target.hasChildNodes()) {
    this.$before(target.firstChild, cb, withTransition)
  } else {
    this.$appendTo(target, cb, withTransition)
  }
  return this
}

/**
 * Insert instance before target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$before = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    before, transition.before
  )
}

/**
 * Insert instance after target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$after = function (target, cb, withTransition) {
  target = query(target)
  if (target.nextSibling) {
    this.$before(target.nextSibling, cb, withTransition)
  } else {
    this.$appendTo(target.parentNode, cb, withTransition)
  }
  return this
}

/**
 * Remove instance from DOM
 *
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$remove = function (cb, withTransition) {
  var inDoc = this._isAttached && _.inDoc(this.$el)
  // if we are not in document, no need to check
  // for transitions
  if (!inDoc) withTransition = false
  var op
  var self = this
  var realCb = function () {
    if (inDoc) self._callHook('detached')
    if (cb) cb()
  }
  if (
    this._isBlock &&
    !this._blockFragment.hasChildNodes()
  ) {
    op = withTransition === false
      ? append
      : transition.removeThenAppend
    blockOp(this, this._blockFragment, op, realCb)
  } else {
    op = withTransition === false
      ? remove
      : transition.remove
    op(this.$el, this, realCb)
  }
  return this
}

/**
 * Shared DOM insertion function.
 *
 * @param {Vue} vm
 * @param {Element} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition]
 * @param {Function} op1 - op for non-transition insert
 * @param {Function} op2 - op for transition insert
 * @return vm
 */

function insert (vm, target, cb, withTransition, op1, op2) {
  target = query(target)
  var targetIsDetached = !_.inDoc(target)
  var op = withTransition === false || targetIsDetached
    ? op1
    : op2
  var shouldCallHook =
    !targetIsDetached &&
    !vm._isAttached &&
    !_.inDoc(vm.$el)
  if (vm._isBlock) {
    blockOp(vm, target, op, cb)
  } else {
    op(vm.$el, target, vm, cb)
  }
  if (shouldCallHook) {
    vm._callHook('attached')
  }
  return vm
}

/**
 * Execute a transition operation on a block instance,
 * iterating through all its block nodes.
 *
 * @param {Vue} vm
 * @param {Node} target
 * @param {Function} op
 * @param {Function} cb
 */

function blockOp (vm, target, op, cb) {
  var current = vm._blockStart
  var end = vm._blockEnd
  var next
  while (next !== end) {
    next = current.nextSibling
    op(current, target, vm)
    current = next
  }
  op(end, target, vm, cb)
}

/**
 * Check for selectors
 *
 * @param {String|Element} el
 */

function query (el) {
  return typeof el === 'string'
    ? document.querySelector(el)
    : el
}

/**
 * Append operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function append (el, target, vm, cb) {
  target.appendChild(el)
  if (cb) cb()
}

/**
 * InsertBefore operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function before (el, target, vm, cb) {
  _.before(el, target)
  if (cb) cb()
}

/**
 * Remove operation that takes a callback.
 *
 * @param {Node} el
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function remove (el, vm, cb) {
  _.remove(el)
  if (cb) cb()
}
},{"../transition":61,"../util":67}],13:[function(require,module,exports){
var _ = require('../util')

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$on = function (event, fn) {
  (this._events[event] || (this._events[event] = []))
    .push(fn)
  modifyListenerCount(this, event, 1)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$once = function (event, fn) {
  var self = this
  function on () {
    self.$off(event, on)
    fn.apply(this, arguments)
  }
  on.fn = fn
  this.$on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$off = function (event, fn) {
  var cbs
  // all
  if (!arguments.length) {
    if (this.$parent) {
      for (event in this._events) {
        cbs = this._events[event]
        if (cbs) {
          modifyListenerCount(this, event, -cbs.length)
        }
      }
    }
    this._events = {}
    return this
  }
  // specific event
  cbs = this._events[event]
  if (!cbs) {
    return this
  }
  if (arguments.length === 1) {
    modifyListenerCount(this, event, -cbs.length)
    this._events[event] = null
    return this
  }
  // specific handler
  var cb
  var i = cbs.length
  while (i--) {
    cb = cbs[i]
    if (cb === fn || cb.fn === fn) {
      modifyListenerCount(this, event, -1)
      cbs.splice(i, 1)
      break
    }
  }
  return this
}

/**
 * Trigger an event on self.
 *
 * @param {String} event
 */

exports.$emit = function (event) {
  this._eventCancelled = false
  var cbs = this._events[event]
  if (cbs) {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length - 1
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i + 1]
    }
    i = 0
    cbs = cbs.length > 1
      ? _.toArray(cbs)
      : cbs
    for (var l = cbs.length; i < l; i++) {
      if (cbs[i].apply(this, args) === false) {
        this._eventCancelled = true
      }
    }
  }
  return this
}

/**
 * Recursively broadcast an event to all children instances.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$broadcast = function (event) {
  // if no child has registered for this event,
  // then there's no need to broadcast.
  if (!this._eventsCount[event]) return
  var children = this._children
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    child.$emit.apply(child, arguments)
    if (!child._eventCancelled) {
      child.$broadcast.apply(child, arguments)
    }
  }
  return this
}

/**
 * Recursively propagate an event up the parent chain.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$dispatch = function () {
  var parent = this.$parent
  while (parent) {
    parent.$emit.apply(parent, arguments)
    parent = parent._eventCancelled
      ? null
      : parent.$parent
  }
  return this
}

/**
 * Modify the listener counts on all parents.
 * This bookkeeping allows $broadcast to return early when
 * no child has listened to a certain event.
 *
 * @param {Vue} vm
 * @param {String} event
 * @param {Number} count
 */

var hookRE = /^hook:/
function modifyListenerCount (vm, event, count) {
  var parent = vm.$parent
  // hooks do not get broadcasted so no need
  // to do bookkeeping for them
  if (!parent || !count || hookRE.test(event)) return
  while (parent) {
    parent._eventsCount[event] =
      (parent._eventsCount[event] || 0) + count
    parent = parent.$parent
  }
}
},{"../util":67}],14:[function(require,module,exports){
var _ = require('../util')
var mergeOptions = require('../util/merge-option')

/**
 * Expose useful internals
 */

exports.util = _
exports.nextTick = _.nextTick
exports.config = require('../config')

exports.compiler = {
  compile: require('../compiler/compile'),
  transclude: require('../compiler/transclude')
}

exports.parsers = {
  path: require('../parsers/path'),
  text: require('../parsers/text'),
  template: require('../parsers/template'),
  directive: require('../parsers/directive'),
  expression: require('../parsers/expression')
}

/**
 * Each instance constructor, including Vue, has a unique
 * cid. This enables us to create wrapped "child
 * constructors" for prototypal inheritance and cache them.
 */

exports.cid = 0
var cid = 1

/**
 * Class inehritance
 *
 * @param {Object} extendOptions
 */

exports.extend = function (extendOptions) {
  extendOptions = extendOptions || {}
  var Super = this
  var Sub = createClass(
    extendOptions.name ||
    Super.options.name ||
    'VueComponent'
  )
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super
  // allow further extension
  Sub.extend = Super.extend
  // create asset registers, so extended classes
  // can have their private assets too.
  createAssetRegisters(Sub)
  return Sub
}

/**
 * A function that returns a sub-class constructor with the
 * given name. This gives us much nicer output when
 * logging instances in the console.
 *
 * @param {String} name
 * @return {Function}
 */

function createClass (name) {
  return new Function(
    'return function ' + _.classify(name) +
    ' (options) { this._init(options) }'
  )()
}

/**
 * Plugin system
 *
 * @param {Object} plugin
 */

exports.use = function (plugin) {
  // additional parameters
  var args = _.toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else {
    plugin.apply(null, args)
  }
  return this
}

/**
 * Define asset registration methods on a constructor.
 *
 * @param {Function} Constructor
 */

var assetTypes = [
  'directive',
  'filter',
  'partial',
  'transition'
]

function createAssetRegisters (Constructor) {

  /* Asset registration methods share the same signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  assetTypes.forEach(function (type) {
    Constructor[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        this.options[type + 's'][id] = definition
      }
    }
  })

  /**
   * Component registration needs to automatically invoke
   * Vue.extend on object values.
   *
   * @param {String} id
   * @param {Object|Function} definition
   */

  Constructor.component = function (id, definition) {
    if (!definition) {
      return this.options.components[id]
    } else {
      if (_.isPlainObject(definition)) {
        definition.name = id
        definition = _.Vue.extend(definition)
      }
      this.options.components[id] = definition
    }
  }
}

createAssetRegisters(exports)
},{"../compiler/compile":18,"../compiler/transclude":19,"../config":20,"../parsers/directive":55,"../parsers/expression":56,"../parsers/path":57,"../parsers/template":58,"../parsers/text":59,"../util":67,"../util/merge-option":69}],15:[function(require,module,exports){
var _ = require('../util')
var compile = require('../compiler/compile')

/**
 * Set instance target element and kick off the compilation
 * process. The passed in `el` can be a selector string, an
 * existing Element, or a DocumentFragment (for block
 * instances).
 *
 * @param {Element|DocumentFragment|string} el
 * @public
 */

exports.$mount = function (el) {
  if (this._isCompiled) {
    _.warn('$mount() should be called only once.')
    return
  }
  if (!el) {
    el = document.createElement('div')
  } else if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      _.warn('Cannot find element: ' + selector)
      return
    }
  }
  this._compile(el)
  this._isCompiled = true
  this._callHook('compiled')
  if (_.inDoc(this.$el)) {
    this._callHook('attached')
    this._initDOMHooks()
    ready.call(this)
  } else {
    this._initDOMHooks()
    this.$once('hook:attached', ready)
  }
  return this
}

/**
 * Mark an instance as ready.
 */

function ready () {
  this._isAttached = true
  this._isReady = true
  this._callHook('ready')
}

/**
 * Teardown the instance, simply delegate to the internal
 * _destroy.
 */

exports.$destroy = function (remove, deferCleanup) {
  this._destroy(remove, deferCleanup)
}

/**
 * Partially compile a piece of DOM and return a
 * decompile function.
 *
 * @param {Element|DocumentFragment} el
 * @return {Function}
 */

exports.$compile = function (el) {
  return compile(el, this.$options, true)(this, el)
}
},{"../compiler/compile":18,"../util":67}],16:[function(require,module,exports){
var _ = require('./util')
var MAX_UPDATE_COUNT = 10

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.
var queue = []
var userQueue = []
var has = {}
var waiting = false
var flushing = false

/**
 * Reset the batcher's state.
 */

function reset () {
  queue = []
  userQueue = []
  has = {}
  waiting = false
  flushing = false
}

/**
 * Flush both queues and run the jobs.
 */

function flush () {
  flushing = true
  run(queue)
  run(userQueue)
  reset()
}

/**
 * Run the jobs in a single queue.
 *
 * @param {Array} queue
 */

function run (queue) {
  // do not cache length because more jobs might be pushed
  // as we run existing jobs
  for (var i = 0; i < queue.length; i++) {
    queue[i].run()
  }
}

/**
 * Push a job into the job queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Object} job
 *   properties:
 *   - {String|Number} id
 *   - {Function}      run
 */

exports.push = function (job) {
  var id = job.id
  if (!id || !has[id] || flushing) {
    if (!has[id]) {
      has[id] = 1
    } else {
      has[id]++
      // detect possible infinite update loops
      if (has[id] > MAX_UPDATE_COUNT) {
        _.warn(
          'You may have an infinite update loop for the ' +
          'watcher with expression: "' + job.expression + '".'
        )
        return
      }
    }
    // A user watcher callback could trigger another
    // directive update during the flushing; at that time
    // the directive queue would already have been run, so
    // we call that update immediately as it is pushed.
    if (flushing && !job.user) {
      job.run()
      return
    }
    ;(job.user ? userQueue : queue).push(job)
    if (!waiting) {
      waiting = true
      _.nextTick(flush)
    }
  }
}
},{"./util":67}],17:[function(require,module,exports){
/**
 * A doubly linked list-based Least Recently Used (LRU)
 * cache. Will keep most recently used items while
 * discarding least recently used items when its limit is
 * reached. This is a bare-bone version of
 * Rasmus Andersson's js-lru:
 *
 *   https://github.com/rsms/js-lru
 *
 * @param {Number} limit
 * @constructor
 */

function Cache (limit) {
  this.size = 0
  this.limit = limit
  this.head = this.tail = undefined
  this._keymap = {}
}

var p = Cache.prototype

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var entry = {
    key:key,
    value:value
  }
  this._keymap[key] = entry
  if (this.tail) {
    this.tail.newer = entry
    entry.older = this.tail
  } else {
    this.head = entry
  }
  this.tail = entry
  if (this.size === this.limit) {
    return this.shift()
  } else {
    this.size++
  }
}

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
  var entry = this.head
  if (entry) {
    this.head = this.head.newer
    this.head.older = undefined
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
  }
  return entry
}

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key]
  if (entry === undefined) return
  if (entry === this.tail) {
    return returnEntry
      ? entry
      : entry.value
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer
    }
    entry.newer.older = entry.older // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer // C. --> E
  }
  entry.newer = undefined // D --x
  entry.older = this.tail // D. --> E
  if (this.tail) {
    this.tail.newer = entry // E. <-- D
  }
  this.tail = entry
  return returnEntry
    ? entry
    : entry.value
}

module.exports = Cache
},{}],18:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var templateParser = require('../parsers/template')

module.exports = compile

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function should only be
 * called on instance root nodes.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @param {Boolean} transcluded
 * @return {Function}
 */

function compile (el, options, partial, transcluded) {
  var isBlock = el.nodeType === 11
  // link function for param attributes.
  var params = options.paramAttributes
  var paramsLinkFn = params && !partial && !transcluded && !isBlock
    ? compileParamAttributes(el, params, options)
    : null
  // link function for the node itself.
  // if this is a block instance, we return a link function
  // for the attributes found on the container, if any.
  // options._containerAttrs are collected during transclusion.
  var nodeLinkFn = isBlock
    ? compileBlockContainer(options._containerAttrs, params, options)
    : compileNode(el, options)
  // link function for the childNodes
  var childLinkFn =
    !(nodeLinkFn && nodeLinkFn.terminal) &&
    el.tagName !== 'SCRIPT' &&
    el.hasChildNodes()
      ? compileNodeList(el.childNodes, options)
      : null

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @return {Function|undefined}
   */

  function compositeLinkFn (vm, el) {
    var originalDirCount = vm._directives.length
    var parentOriginalDirCount =
      vm.$parent && vm.$parent._directives.length
    if (paramsLinkFn) {
      paramsLinkFn(vm, el)
    }
    // cache childNodes before linking parent, fix #657
    var childNodes = _.toArray(el.childNodes)
    // if this is a transcluded compile, linkers need to be
    // called in source scope, and the host needs to be
    // passed down.
    var source = transcluded ? vm.$parent : vm
    var host = transcluded ? vm : undefined
    // link
    if (nodeLinkFn) nodeLinkFn(source, el, host)
    if (childLinkFn) childLinkFn(source, childNodes, host)

    /**
     * If this is a partial compile, the linker function
     * returns an unlink function that tearsdown all
     * directives instances generated during the partial
     * linking.
     */

    if (partial && !transcluded) {
      var selfDirs = vm._directives.slice(originalDirCount)
      var parentDirs = vm.$parent &&
        vm.$parent._directives.slice(parentOriginalDirCount)

      var teardownDirs = function (vm, dirs) {
        var i = dirs.length
        while (i--) {
          dirs[i]._teardown()
        }
        i = vm._directives.indexOf(dirs[0])
        vm._directives.splice(i, dirs.length)
      }

      return function unlink () {
        teardownDirs(vm, selfDirs)
        if (parentDirs) {
          teardownDirs(vm.$parent, parentDirs)
        }
      }
    }
  }

  // transcluded linkFns are terminal, because it takes
  // over the entire sub-tree.
  if (transcluded) {
    compositeLinkFn.terminal = true
  }

  return compositeLinkFn
}

/**
 * Compile the attributes found on a "block container" -
 * i.e. the container node in the parent tempate of a block
 * instance. We are only concerned with v-with and
 * paramAttributes here.
 *
 * @param {Object} attrs - a map of attr name/value pairs
 * @param {Array} params - param attributes list
 * @param {Object} options
 * @return {Function}
 */

function compileBlockContainer (attrs, params, options) {
  if (!attrs) return null
  var paramsLinkFn = params
    ? compileParamAttributes(attrs, params, options)
    : null
  var withVal = attrs[config.prefix + 'with']
  var withLinkFn = null
  if (withVal) {
    var descriptor = dirParser.parse(withVal)[0]
    var def = options.directives['with']
    withLinkFn = function (vm, el) {
      vm._bindDir('with', el, descriptor, def)   
    }
  }
  return function blockContainerLinkFn (vm) {
    // explicitly passing null to the linkers
    // since v-with doesn't need a real element
    if (paramsLinkFn) paramsLinkFn(vm, null)
    if (withLinkFn) withLinkFn(vm, null)
  }
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode (node, options) {
  var type = node.nodeType
  if (type === 1 && node.tagName !== 'SCRIPT') {
    return compileElement(node, options)
  } else if (type === 3 && config.interpolate && node.data.trim()) {
    return compileTextNode(node, options)
  } else {
    return null
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement (el, options) {
  if (checkTransclusion(el)) {
    // unwrap textNode
    if (el.hasAttribute('__vue__wrap')) {
      el = el.firstChild
    }
    return compile(el, options._parent.$options, true, true)
  }
  var linkFn, tag, component
  // check custom element component, but only on non-root
  if (!el.__vue__) {
    tag = el.tagName.toLowerCase()
    component =
      tag.indexOf('-') > 0 &&
      options.components[tag]
    if (component) {
      el.setAttribute(config.prefix + 'component', tag)
    }
  }
  if (component || el.hasAttributes()) {
    // check terminal direcitves
    linkFn = checkTerminalDirectives(el, options)
    // if not terminal, build normal link function
    if (!linkFn) {
      var dirs = collectDirectives(el, options)
      linkFn = dirs.length
        ? makeNodeLinkFn(dirs)
        : null
    }
  }
  // if the element is a textarea, we need to interpolate
  // its content on initial render.
  if (el.tagName === 'TEXTAREA') {
    var realLinkFn = linkFn
    linkFn = function (vm, el) {
      el.value = vm.$interpolate(el.value)
      if (realLinkFn) realLinkFn(vm, el)
    }
    linkFn.terminal = true
  }
  return linkFn
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn (directives) {
  return function nodeLinkFn (vm, el, host) {
    // reverse apply because it's sorted low to high
    var i = directives.length
    var dir, j, k, target
    while (i--) {
      dir = directives[i]
      // a directive can be transcluded if it's written
      // on a component's container in its parent tempalte.
      target = dir.transcluded
        ? vm.$parent
        : vm
      if (dir._link) {
        // custom link fn
        dir._link(target, el)
      } else {
        k = dir.descriptors.length
        for (j = 0; j < k; j++) {
          target._bindDir(dir.name, el,
            dir.descriptors[j], dir.def, host)
        }
      }
    }
  }
}

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode (node, options) {
  var tokens = textParser.parse(node.data)
  if (!tokens) {
    return null
  }
  var frag = document.createDocumentFragment()
  var el, token
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i]
    el = token.tag
      ? processTextToken(token, options)
      : document.createTextNode(token.value)
    frag.appendChild(el)
  }
  return makeTextNodeLinkFn(tokens, frag, options)
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken (token, options) {
  var el
  if (token.oneTime) {
    el = document.createTextNode(token.value)
  } else {
    if (token.html) {
      el = document.createComment('v-html')
      setTokenType('html')
    } else if (token.partial) {
      el = document.createComment('v-partial')
      setTokenType('partial')
    } else {
      // IE will clean up empty textNodes during
      // frag.cloneNode(true), so we have to give it
      // something here...
      el = document.createTextNode(' ')
      setTokenType('text')
    }
  }
  function setTokenType (type) {
    token.type = type
    token.def = options.directives[type]
    token.descriptor = dirParser.parse(token.value)[0]
  }
  return el
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn (tokens, frag) {
  return function textNodeLinkFn (vm, el) {
    var fragClone = frag.cloneNode(true)
    var childNodes = _.toArray(fragClone.childNodes)
    var token, value, node
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i]
      value = token.value
      if (token.tag) {
        node = childNodes[i]
        if (token.oneTime) {
          value = vm.$eval(value)
          if (token.html) {
            _.replace(node, templateParser.parse(value, true))
          } else {
            node.data = value
          }
        } else {
          vm._bindDir(token.type, node,
                      token.descriptor, token.def)
        }
      }
    }
    _.replace(el, fragClone)
  }
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList (nodeList, options) {
  var linkFns = []
  var nodeLinkFn, childLinkFn, node
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i]
    nodeLinkFn = compileNode(node, options)
    childLinkFn =
      !(nodeLinkFn && nodeLinkFn.terminal) &&
      node.tagName !== 'SCRIPT' &&
      node.hasChildNodes()
        ? compileNodeList(node.childNodes, options)
        : null
    linkFns.push(nodeLinkFn, childLinkFn)
  }
  return linkFns.length
    ? makeChildLinkFn(linkFns)
    : null
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn (linkFns) {
  return function childLinkFn (vm, nodes, host) {
    var node, nodeLinkFn, childrenLinkFn
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n]
      nodeLinkFn = linkFns[i++]
      childrenLinkFn = linkFns[i++]
      // cache childNodes before linking parent, fix #657
      var childNodes = _.toArray(node.childNodes)
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host)
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host)
      }
    }
  }
}

/**
 * Compile param attributes on a root element and return
 * a paramAttributes link function.
 *
 * @param {Element|Object} el
 * @param {Array} attrs
 * @param {Object} options
 * @return {Function} paramsLinkFn
 */

function compileParamAttributes (el, attrs, options) {
  var params = []
  var isEl = el.nodeType
  var i = attrs.length
  var name, value, param
  while (i--) {
    name = attrs[i]
    if (/[A-Z]/.test(name)) {
      _.warn(
        'You seem to be using camelCase for a paramAttribute, ' +
        'but HTML doesn\'t differentiate between upper and ' +
        'lower case. You should use hyphen-delimited ' +
        'attribute names. For more info see ' +
        'http://vuejs.org/api/options.html#paramAttributes'
      )
    }
    value = isEl ? el.getAttribute(name) : el[name]
    if (value !== null) {
      param = {
        name: name,
        value: value
      }
      var tokens = textParser.parse(value)
      if (tokens) {
        if (isEl) el.removeAttribute(name)
        if (tokens.length > 1) {
          _.warn(
            'Invalid param attribute binding: "' +
            name + '="' + value + '"' +
            '\nDon\'t mix binding tags with plain text ' +
            'in param attribute bindings.'
          )
          continue
        } else {
          param.dynamic = true
          param.value = tokens[0].value
        }
      }
      params.push(param)
    }
  }
  return makeParamsLinkFn(params, options)
}

/**
 * Build a function that applies param attributes to a vm.
 *
 * @param {Array} params
 * @param {Object} options
 * @return {Function} paramsLinkFn
 */

var dataAttrRE = /^data-/

function makeParamsLinkFn (params, options) {
  var def = options.directives['with']
  return function paramsLinkFn (vm, el) {
    var i = params.length
    var param, path
    while (i--) {
      param = params[i]
      // params could contain dashes, which will be
      // interpreted as minus calculations by the parser
      // so we need to wrap the path here
      path = _.camelize(param.name.replace(dataAttrRE, ''))
      if (param.dynamic) {
        // dynamic param attribtues are bound as v-with.
        // we can directly duck the descriptor here beacuse
        // param attributes cannot use expressions or
        // filters.
        vm._bindDir('with', el, {
          arg: path,
          expression: param.value
        }, def)
      } else {
        // just set once
        vm.$set(path, param.value)
      }
    }
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

var terminalDirectives = [
  'repeat',
  'if',
  'component'
]

function skip () {}
skip.terminal = true

function checkTerminalDirectives (el, options) {
  if (_.attr(el, 'pre') !== null) {
    return skip
  }
  var value, dirName
  /* jshint boss: true */
  for (var i = 0; i < 3; i++) {
    dirName = terminalDirectives[i]
    if (value = _.attr(el, dirName)) {
      return makeTerminalNodeLinkFn(el, dirName, value, options)
    }
  }
}

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn (el, dirName, value, options) {
  var descriptor = dirParser.parse(value)[0]
  var def = options.directives[dirName]
  var fn = function terminalNodeLinkFn (vm, el, host) {
    vm._bindDir(dirName, el, descriptor, def, host)
  }
  fn.terminal = true
  return fn
}

/**
 * Collect the directives on an element.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Array}
 */

function collectDirectives (el, options) {
  var attrs = _.toArray(el.attributes)
  var i = attrs.length
  var dirs = []
  var attr, attrName, dir, dirName, dirDef, transcluded
  while (i--) {
    attr = attrs[i]
    attrName = attr.name
    transcluded =
      options._transcludedAttrs &&
      options._transcludedAttrs[attrName]
    if (attrName.indexOf(config.prefix) === 0) {
      dirName = attrName.slice(config.prefix.length)
      dirDef = options.directives[dirName]
      _.assertAsset(dirDef, 'directive', dirName)
      if (dirDef) {
        dirs.push({
          name: dirName,
          descriptors: dirParser.parse(attr.value),
          def: dirDef,
          transcluded: transcluded
        })
      }
    } else if (config.interpolate) {
      dir = collectAttrDirective(el, attrName, attr.value,
                                 options)
      if (dir) {
        dir.transcluded = transcluded
        dirs.push(dir)
      }
    }
  }
  // sort by priority, LOW to HIGH
  dirs.sort(directiveComparator)
  return dirs
}

/**
 * Check an attribute for potential dynamic bindings,
 * and return a directive object.
 *
 * @param {Element} el
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */

function collectAttrDirective (el, name, value, options) {
  var tokens = textParser.parse(value)
  if (tokens) {
    var def = options.directives.attr
    var i = tokens.length
    var allOneTime = true
    while (i--) {
      var token = tokens[i]
      if (token.tag && !token.oneTime) {
        allOneTime = false
      }
    }
    return {
      def: def,
      _link: allOneTime
        ? function (vm, el) {
            el.setAttribute(name, vm.$interpolate(value))
          }
        : function (vm, el) {
            var value = textParser.tokensToExp(tokens, vm)
            var desc = dirParser.parse(name + ':' + value)[0]
            vm._bindDir('attr', el, desc, def)
          }
    }
  }
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator (a, b) {
  a = a.def.priority || 0
  b = b.def.priority || 0
  return a > b ? 1 : -1
}

/**
 * Check whether an element is transcluded
 *
 * @param {Element} el
 * @return {Boolean}
 */

var transcludedFlagAttr = '__vue__transcluded'
function checkTransclusion (el) {
  if (el.nodeType === 1 && el.hasAttribute(transcludedFlagAttr)) {
    el.removeAttribute(transcludedFlagAttr)
    return true
  }
}
},{"../config":20,"../parsers/directive":55,"../parsers/template":58,"../parsers/text":59,"../util":67}],19:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var templateParser = require('../parsers/template')
var transcludedFlagAttr = '__vue__transcluded'

/**
 * Process an element or a DocumentFragment based on a
 * instance option object. This allows us to transclude
 * a template node/fragment before the instance is created,
 * so the processed fragment can then be cloned and reused
 * in v-repeat.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

module.exports = function transclude (el, options) {
  if (options && options._asComponent) {
    // mutating the options object here assuming the same
    // object will be used for compile right after this
    options._transcludedAttrs = extractAttrs(el.attributes)
    // Mark content nodes and attrs so that the compiler
    // knows they should be compiled in parent scope.
    var i = el.childNodes.length
    while (i--) {
      var node = el.childNodes[i]
      if (node.nodeType === 1) {
        node.setAttribute(transcludedFlagAttr, '')
      } else if (node.nodeType === 3 && node.data.trim()) {
        // wrap transcluded textNodes in spans, because
        // raw textNodes can't be persisted through clones
        // by attaching attributes.
        var wrapper = document.createElement('span')
        wrapper.textContent = node.data
        wrapper.setAttribute('__vue__wrap', '')
        wrapper.setAttribute(transcludedFlagAttr, '')
        el.replaceChild(wrapper, node)
      }
    }
  }
  // for template tags, what we want is its content as
  // a documentFragment (for block instances)
  if (el.tagName === 'TEMPLATE') {
    el = templateParser.parse(el)
  }
  if (options && options.template) {
    el = transcludeTemplate(el, options)
  }
  if (el instanceof DocumentFragment) {
    _.prepend(document.createComment('v-start'), el)
    el.appendChild(document.createComment('v-end'))
  }
  return el
}

/**
 * Process the template option.
 * If the replace option is true this will swap the $el.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transcludeTemplate (el, options) {
  var template = options.template
  var frag = templateParser.parse(template, true)
  if (!frag) {
    _.warn('Invalid template option: ' + template)
  } else {
    var rawContent = options._content || _.extractContent(el)
    if (options.replace) {
      if (frag.childNodes.length > 1) {
        // this is a block instance which has no root node.
        // however, the container in the parent template
        // (which is replaced here) may contain v-with and
        // paramAttributes that still need to be compiled
        // for the child. we store all the container
        // attributes on the options object and pass it down
        // to the compiler.
        var containerAttrs = options._containerAttrs = {}
        var i = el.attributes.length
        while (i--) {
          var attr = el.attributes[i]
          containerAttrs[attr.name] = attr.value
        }
        transcludeContent(frag, rawContent)
        return frag
      } else {
        var replacer = frag.firstChild
        _.copyAttributes(el, replacer)
        transcludeContent(replacer, rawContent)
        return replacer
      }
    } else {
      el.appendChild(frag)
      transcludeContent(el, rawContent)
      return el
    }
  }
}

/**
 * Resolve <content> insertion points mimicking the behavior
 * of the Shadow DOM spec:
 *
 *   http://w3c.github.io/webcomponents/spec/shadow/#insertion-points
 *
 * @param {Element|DocumentFragment} el
 * @param {Element} raw
 */

function transcludeContent (el, raw) {
  var outlets = getOutlets(el)
  var i = outlets.length
  if (!i) return
  var outlet, select, selected, j, main

  function isDirectChild (node) {
    return node.parentNode === raw
  }

  // first pass, collect corresponding content
  // for each outlet.
  while (i--) {
    outlet = outlets[i]
    if (raw) {
      select = outlet.getAttribute('select')
      if (select) {  // select content
        selected = raw.querySelectorAll(select)
        if (selected.length) {
          // according to Shadow DOM spec, `select` can
          // only select direct children of the host node.
          // enforcing this also fixes #786.
          selected = [].filter.call(selected, isDirectChild)
        }
        outlet.content = selected.length
          ? selected
          : _.toArray(outlet.childNodes)
      } else { // default content
        main = outlet
      }
    } else { // fallback content
      outlet.content = _.toArray(outlet.childNodes)
    }
  }
  // second pass, actually insert the contents
  for (i = 0, j = outlets.length; i < j; i++) {
    outlet = outlets[i]
    if (outlet !== main) {
      insertContentAt(outlet, outlet.content)
    }
  }
  // finally insert the main content
  if (main) {
    insertContentAt(main, _.toArray(raw.childNodes))
  }
}

/**
 * Get <content> outlets from the element/list
 *
 * @param {Element|Array} el
 * @return {Array}
 */

var concat = [].concat
function getOutlets (el) {
  return _.isArray(el)
    ? concat.apply([], el.map(getOutlets))
    : el.querySelectorAll
      ? _.toArray(el.querySelectorAll('content'))
      : []
}

/**
 * Insert an array of nodes at outlet,
 * then remove the outlet.
 *
 * @param {Element} outlet
 * @param {Array} contents
 */

function insertContentAt (outlet, contents) {
  // not using util DOM methods here because
  // parentNode can be cached
  var parent = outlet.parentNode
  for (var i = 0, j = contents.length; i < j; i++) {
    parent.insertBefore(contents[i], outlet)
  }
  parent.removeChild(outlet)
}

/**
 * Helper to extract a component container's attribute names
 * into a map, and filtering out `v-with` in the process.
 * The resulting map will be used in compiler/compile to
 * determine whether an attribute is transcluded.
 *
 * @param {NameNodeMap} attrs
 */

function extractAttrs (attrs) {
  if (!attrs) return null
  var res = {}
  var vwith = config.prefix + 'with'
  var i = attrs.length
  while (i--) {
    var name = attrs[i].name
    if (name !== vwith) res[name] = true
  }
  return res
}
},{"../config":20,"../parsers/template":58,"../util":67}],20:[function(require,module,exports){
module.exports = {

  /**
   * The prefix to look for when parsing directives.
   *
   * @type {String}
   */

  prefix: 'v-',

  /**
   * Whether to print debug messages.
   * Also enables stack trace for warnings.
   *
   * @type {Boolean}
   */

  debug: false,

  /**
   * Whether to suppress warnings.
   *
   * @type {Boolean}
   */

  silent: false,

  /**
   * Whether allow observer to alter data objects'
   * __proto__.
   *
   * @type {Boolean}
   */

  proto: true,

  /**
   * Whether to parse mustache tags in templates.
   *
   * @type {Boolean}
   */

  interpolate: true,

  /**
   * Whether to use async rendering.
   */

  async: true,

  /**
   * Whether to warn against errors caught when evaluating
   * expressions.
   */

  warnExpressionErrors: true,

  /**
   * Internal flag to indicate the delimiters have been
   * changed.
   *
   * @type {Boolean}
   */

  _delimitersChanged: true

}

/**
 * Interpolation delimiters.
 * We need to mark the changed flag so that the text parser
 * knows it needs to recompile the regex.
 *
 * @type {Array<String>}
 */

var delimiters = ['{{', '}}']
Object.defineProperty(module.exports, 'delimiters', {
  get: function () {
    return delimiters
  },
  set: function (val) {
    delimiters = val
    this._delimitersChanged = true
  }
})
},{}],21:[function(require,module,exports){
var _ = require('./util')
var config = require('./config')
var Watcher = require('./watcher')
var textParser = require('./parsers/text')
var expParser = require('./parsers/expression')

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {String} name
 * @param {Node} el
 * @param {Vue} vm
 * @param {Object} descriptor
 *                 - {String} expression
 *                 - {String} [arg]
 *                 - {Array<Object>} [filters]
 * @param {Object} def - directive definition object
 * @param {Vue|undefined} host - transclusion host target
 * @constructor
 */

function Directive (name, el, vm, descriptor, def, host) {
  // public
  this.name = name
  this.el = el
  this.vm = vm
  // copy descriptor props
  this.raw = descriptor.raw
  this.expression = descriptor.expression
  this.arg = descriptor.arg
  this.filters = _.resolveFilters(vm, descriptor.filters)
  // private
  this._host = host
  this._locked = false
  this._bound = false
  // init
  this._bind(def)
}

var p = Directive.prototype

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 *
 * @param {Object} def
 */

p._bind = function (def) {
  if (this.name !== 'cloak' && this.el && this.el.removeAttribute) {
    this.el.removeAttribute(config.prefix + this.name)
  }
  if (typeof def === 'function') {
    this.update = def
  } else {
    _.extend(this, def)
  }
  this._watcherExp = this.expression
  this._checkDynamicLiteral()
  if (this.bind) {
    this.bind()
  }
  if (this._watcherExp &&
      (this.update || this.twoWay) &&
      (!this.isLiteral || this._isDynamicLiteral) &&
      !this._checkStatement()) {
    // wrapped updater for context
    var dir = this
    var update = this._update = this.update
      ? function (val, oldVal) {
          if (!dir._locked) {
            dir.update(val, oldVal)
          }
        }
      : function () {} // noop if no update is provided
    // use raw expression as identifier because filters
    // make them different watchers
    var watcher = this.vm._watchers[this.raw]
    // v-repeat always creates a new watcher because it has
    // a special filter that's bound to its directive
    // instance.
    if (!watcher || this.name === 'repeat') {
      watcher = this.vm._watchers[this.raw] = new Watcher(
        this.vm,
        this._watcherExp,
        update, // callback
        {
          filters: this.filters,
          twoWay: this.twoWay,
          deep: this.deep
        }
      )
    } else {
      watcher.addCb(update)
    }
    this._watcher = watcher
    if (this._initValue != null) {
      watcher.set(this._initValue)
    } else if (this.update) {
      this.update(watcher.value)
    }
  }
  this._bound = true
}

/**
 * check if this is a dynamic literal binding.
 *
 * e.g. v-component="{{currentView}}"
 */

p._checkDynamicLiteral = function () {
  var expression = this.expression
  if (expression && this.isLiteral) {
    var tokens = textParser.parse(expression)
    if (tokens) {
      var exp = textParser.tokensToExp(tokens)
      this.expression = this.vm.$get(exp)
      this._watcherExp = exp
      this._isDynamicLiteral = true
    }
  }
}

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. v-on="click: a++"
 *
 * @return {Boolean}
 */

p._checkStatement = function () {
  var expression = this.expression
  if (
    expression && this.acceptStatement &&
    !expParser.pathTestRE.test(expression)
  ) {
    var fn = expParser.parse(expression).get
    var vm = this.vm
    var handler = function () {
      fn.call(vm, vm)
    }
    if (this.filters) {
      handler = _.applyFilters(
        handler,
        this.filters.read,
        vm
      )
    }
    this.update(handler)
    return true
  }
}

/**
 * Check for an attribute directive param, e.g. lazy
 *
 * @param {String} name
 * @return {String}
 */

p._checkParam = function (name) {
  var param = this.el.getAttribute(name)
  if (param !== null) {
    this.el.removeAttribute(name)
  }
  return param
}

/**
 * Teardown the watcher and call unbind.
 */

p._teardown = function () {
  if (this._bound) {
    if (this.unbind) {
      this.unbind()
    }
    var watcher = this._watcher
    if (watcher && watcher.active) {
      watcher.removeCb(this._update)
      if (!watcher.active) {
        this.vm._watchers[this.raw] = null
      }
    }
    this._bound = false
    this.vm = this.el = this._watcher = null
  }
}

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @param {Boolean} lock - prevent wrtie triggering update.
 * @public
 */

p.set = function (value, lock) {
  if (this.twoWay) {
    if (lock) {
      this._locked = true
    }
    this._watcher.set(value)
    if (lock) {
      var self = this
      _.nextTick(function () {
        self._locked = false
      })
    }
  }
}

module.exports = Directive
},{"./config":20,"./parsers/expression":56,"./parsers/text":59,"./util":67,"./watcher":71}],22:[function(require,module,exports){
// xlink
var xlinkNS = 'http://www.w3.org/1999/xlink'
var xlinkRE = /^xlink:/

module.exports = {

  priority: 850,

  bind: function () {
    var name = this.arg
    this.update = xlinkRE.test(name)
      ? xlinkHandler
      : defaultHandler
  }

}

function defaultHandler (value) {
  if (value || value === 0) {
    this.el.setAttribute(this.arg, value)
  } else {
    this.el.removeAttribute(this.arg)
  }
}

function xlinkHandler (value) {
  if (value != null) {
    this.el.setAttributeNS(xlinkNS, this.arg, value)
  } else {
    this.el.removeAttributeNS(xlinkNS, 'href')
  }
}
},{}],23:[function(require,module,exports){
var _ = require('../util')
var addClass = _.addClass
var removeClass = _.removeClass

module.exports = function (value) {
  if (this.arg) {
    var method = value ? addClass : removeClass
    method(this.el, this.arg)
  } else {
    if (this.lastVal) {
      removeClass(this.el, this.lastVal)
    }
    if (value) {
      addClass(this.el, value)
      this.lastVal = value
    }
  }
}
},{"../util":67}],24:[function(require,module,exports){
var config = require('../config')

module.exports = {

  bind: function () {
    var el = this.el
    this.vm.$once('hook:compiled', function () {
      el.removeAttribute(config.prefix + 'cloak')
    })
  }

}
},{"../config":20}],25:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

module.exports = {

  isLiteral: true,

  /**
   * Setup. Two possible usages:
   *
   * - static:
   *   v-component="comp"
   *
   * - dynamic:
   *   v-component="{{currentView}}"
   */

  bind: function () {
    if (!this.el.__vue__) {
      // create a ref anchor
      this.ref = document.createComment('v-component')
      _.replace(this.el, this.ref)
      // check keep-alive options.
      // If yes, instead of destroying the active vm when
      // hiding (v-if) or switching (dynamic literal) it,
      // we simply remove it from the DOM and save it in a
      // cache object, with its constructor id as the key.
      this.keepAlive = this._checkParam('keep-alive') != null
      // check ref
      this.refID = _.attr(this.el, 'ref')
      if (this.keepAlive) {
        this.cache = {}
      }
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.template = _.extractContent(this.el, true)
      }
      // if static, build right now.
      if (!this._isDynamicLiteral) {
        this.resolveCtor(this.expression)
        var child = this.build()
        child.$before(this.ref)
        this.setCurrent(child)
      } else {
        // check dynamic component params
        this.readyEvent = this._checkParam('wait-for')
        this.transMode = this._checkParam('transition-mode')
      }
    } else {
      _.warn(
        'v-component="' + this.expression + '" cannot be ' +
        'used on an already mounted instance.'
      )
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   */

  resolveCtor: function (id) {
    this.ctorId = id
    this.Ctor = this.vm.$options.components[id]
    _.assertAsset(this.Ctor, 'component', id)
  },

  /**
   * Instantiate/insert a new child vm.
   * If keep alive and has cached instance, insert that
   * instance; otherwise build a new one and cache it.
   *
   * @return {Vue} - the created instance
   */

  build: function () {
    if (this.keepAlive) {
      var cached = this.cache[this.ctorId]
      if (cached) {
        return cached
      }
    }
    var vm = this.vm
    var el = templateParser.clone(this.el)
    if (this.Ctor) {
      var child = vm.$addChild({
        el: el,
        template: this.template,
        _asComponent: true,
        _host: this._host
      }, this.Ctor)
      if (this.keepAlive) {
        this.cache[this.ctorId] = child
      }
      return child
    }
  },

  /**
   * Teardown the current child, but defers cleanup so
   * that we can separate the destroy and removal steps.
   */

  unbuild: function () {
    var child = this.childVM
    if (!child || this.keepAlive) {
      return
    }
    // the sole purpose of `deferCleanup` is so that we can
    // "deactivate" the vm right now and perform DOM removal
    // later.
    child.$destroy(false, true)
  },

  /**
   * Remove current destroyed child and manually do
   * the cleanup after removal.
   *
   * @param {Function} cb
   */

  remove: function (child, cb) {
    var keepAlive = this.keepAlive
    if (child) {
      child.$remove(function () {
        if (!keepAlive) child._cleanup()
        if (cb) cb()
      })
    } else if (cb) {
      cb()
    }
  },

  /**
   * Update callback for the dynamic literal scenario,
   * e.g. v-component="{{view}}"
   */

  update: function (value) {
    if (!value) {
      // just destroy and remove current
      this.unbuild()
      this.remove(this.childVM)
      this.unsetCurrent()
    } else {
      this.resolveCtor(value)
      this.unbuild()
      var newComponent = this.build()
      var self = this
      if (this.readyEvent) {
        newComponent.$once(this.readyEvent, function () {
          self.swapTo(newComponent)
        })
      } else {
        this.swapTo(newComponent)
      }
    }
  },

  /**
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   */

  swapTo: function (target) {
    var self = this
    var current = this.childVM
    this.unsetCurrent()
    this.setCurrent(target)
    switch (self.transMode) {
      case 'in-out':
        target.$before(self.ref, function () {
          self.remove(current)
        })
        break
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.ref)
        })
        break
      default:
        self.remove(current)
        target.$before(self.ref)
    }
  },

  /**
   * Set childVM and parent ref
   */
  
  setCurrent: function (child) {
    this.childVM = child
    var refID = child._refID || this.refID
    if (refID) {
      this.vm.$[refID] = child
    }
  },

  /**
   * Unset childVM and parent ref
   */

  unsetCurrent: function () {
    var child = this.childVM
    this.childVM = null
    var refID = (child && child._refID) || this.refID
    if (refID) {
      this.vm.$[refID] = null
    }
  },

  /**
   * Unbind.
   */

  unbind: function () {
    this.unbuild()
    // destroy all keep-alive cached instances
    if (this.cache) {
      for (var key in this.cache) {
        this.cache[key].$destroy()
      }
      this.cache = null
    }
  }

}
},{"../parsers/template":58,"../util":67}],26:[function(require,module,exports){
module.exports = {

  isLiteral: true,

  bind: function () {
    this.vm.$$[this.expression] = this.el
  },

  unbind: function () {
    delete this.vm.$$[this.expression]
  }
  
}
},{}],27:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  acceptStatement: true,

  bind: function () {
    var child = this.el.__vue__
    if (!child || this.vm !== child.$parent) {
      _.warn(
        '`v-events` should only be used on a child component ' +
        'from the parent template.'
      )
      return
    }
  },

  update: function (handler, oldHandler) {
    if (typeof handler !== 'function') {
      _.warn(
        'Directive "v-events:' + this.expression + '" ' +
        'expects a function value.'
      )
      return
    }
    var child = this.el.__vue__
    if (oldHandler) {
      child.$off(this.arg, oldHandler)
    }
    child.$on(this.arg, handler)
  }

  // when child is destroyed, all events are turned off,
  // so no need for unbind here.

}
},{"../util":67}],28:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

module.exports = {

  bind: function () {
    // a comment node means this is a binding for
    // {{{ inline unescaped html }}}
    if (this.el.nodeType === 8) {
      // hold nodes
      this.nodes = []
    }
  },

  update: function (value) {
    value = _.toString(value)
    if (this.nodes) {
      this.swap(value)
    } else {
      this.el.innerHTML = value
    }
  },

  swap: function (value) {
    // remove old nodes
    var i = this.nodes.length
    while (i--) {
      _.remove(this.nodes[i])
    }
    // convert new value to a fragment
    // do not attempt to retrieve from id selector
    var frag = templateParser.parse(value, true, true)
    // save a reference to these nodes so we can remove later
    this.nodes = _.toArray(frag.childNodes)
    _.before(frag, this.el)
  }

}
},{"../parsers/template":58,"../util":67}],29:[function(require,module,exports){
var _ = require('../util')
var compile = require('../compiler/compile')
var templateParser = require('../parsers/template')
var transition = require('../transition')

module.exports = {

  bind: function () {
    var el = this.el
    if (!el.__vue__) {
      this.start = document.createComment('v-if-start')
      this.end = document.createComment('v-if-end')
      _.replace(el, this.end)
      _.before(this.start, this.end)
      if (el.tagName === 'TEMPLATE') {
        this.template = templateParser.parse(el, true)
      } else {
        this.template = document.createDocumentFragment()
        this.template.appendChild(templateParser.clone(el))
      }
      // compile the nested partial
      this.linker = compile(
        this.template,
        this.vm.$options,
        true
      )
    } else {
      this.invalid = true
      _.warn(
        'v-if="' + this.expression + '" cannot be ' +
        'used on an already mounted instance.'
      )
    }
  },

  update: function (value) {
    if (this.invalid) return
    if (value) {
      // avoid duplicate compiles, since update() can be
      // called with different truthy values
      if (!this.unlink) {
        var frag = templateParser.clone(this.template)
        this.compile(frag)
      }
    } else {
      this.teardown()
    }
  },

  // NOTE: this function is shared in v-partial
  compile: function (frag) {
    var vm = this.vm
    // the linker is not guaranteed to be present because
    // this function might get called by v-partial 
    this.unlink = this.linker
      ? this.linker(vm, frag)
      : vm.$compile(frag)
    transition.blockAppend(frag, this.end, vm)
    // call attached for all the child components created
    // during the compilation
    if (_.inDoc(vm.$el)) {
      var children = this.getContainedComponents()
      if (children) children.forEach(callAttach)
    }
  },

  // NOTE: this function is shared in v-partial
  teardown: function () {
    if (!this.unlink) return
    // collect children beforehand
    var children
    if (_.inDoc(this.vm.$el)) {
      children = this.getContainedComponents()
    }
    transition.blockRemove(this.start, this.end, this.vm)
    if (children) children.forEach(callDetach)
    this.unlink()
    this.unlink = null
  },

  // NOTE: this function is shared in v-partial
  getContainedComponents: function () {
    var vm = this.vm
    var start = this.start.nextSibling
    var end = this.end
    var selfCompoents =
      vm._children.length &&
      vm._children.filter(contains)
    var transComponents =
      vm._transCpnts &&
      vm._transCpnts.filter(contains)

    function contains (c) {
      var cur = start
      var next
      while (next !== end) {
        next = cur.nextSibling
        if (cur.contains(c.$el)) {
          return true
        }
        cur = next
      }
      return false
    }

    return selfCompoents
      ? transComponents
        ? selfCompoents.concat(transComponents)
        : selfCompoents
      : transComponents
  },

  // NOTE: this function is shared in v-partial
  unbind: function () {
    if (this.unlink) this.unlink()
  }

}

function callAttach (child) {
  if (!child._isAttached) {
    child._callHook('attached')
  }
}

function callDetach (child) {
  if (child._isAttached) {
    child._callHook('detached')
  }
}
},{"../compiler/compile":18,"../parsers/template":58,"../transition":61,"../util":67}],30:[function(require,module,exports){
// manipulation directives
exports.text       = require('./text')
exports.html       = require('./html')
exports.attr       = require('./attr')
exports.show       = require('./show')
exports['class']   = require('./class')
exports.el         = require('./el')
exports.ref        = require('./ref')
exports.cloak      = require('./cloak')
exports.style      = require('./style')
exports.partial    = require('./partial')
exports.transition = require('./transition')

// event listener directives
exports.on         = require('./on')
exports.model      = require('./model')

// child vm directives
exports.component  = require('./component')
exports.repeat     = require('./repeat')
exports['if']      = require('./if')

// child vm communication directives
exports['with']    = require('./with')
exports.events     = require('./events')
},{"./attr":22,"./class":23,"./cloak":24,"./component":25,"./el":26,"./events":27,"./html":28,"./if":29,"./model":33,"./on":36,"./partial":37,"./ref":38,"./repeat":39,"./show":40,"./style":41,"./text":42,"./transition":43,"./with":44}],31:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.checked, true)
    }
    _.on(el, 'change', this.listener)
    if (el.checked) {
      this._initValue = el.checked
    }
  },

  update: function (value) {
    this.el.checked = !!value
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
  }

}
},{"../../util":67}],32:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el

    // check params
    // - lazy: update model on "change" instead of "input"
    var lazy = this._checkParam('lazy') != null
    // - number: cast value into number when updating model.
    var number = this._checkParam('number') != null
    // - debounce: debounce the input listener
    var debounce = parseInt(this._checkParam('debounce'), 10)

    // handle composition events.
    // http://blog.evanyou.me/2014/01/03/composition-event/
    var cpLocked = false
    this.cpLock = function () {
      cpLocked = true
    }
    this.cpUnlock = function () {
      cpLocked = false
      // in IE11 the "compositionend" event fires AFTER
      // the "input" event, so the input handler is blocked
      // at the end... have to call it here.
      set()
    }
    _.on(el,'compositionstart', this.cpLock)
    _.on(el,'compositionend', this.cpUnlock)

    // shared setter
    function set () {
      self.set(
        number ? _.toNumber(el.value) : el.value,
        true
      )
    }

    // if the directive has filters, we need to
    // record cursor position and restore it after updating
    // the input with the filtered value.
    // also force update for type="range" inputs to enable
    // "lock in range" (see #506)
    var hasReadFilter = this.filters && this.filters.read
    this.listener = hasReadFilter || el.type === 'range'
      ? function textInputListener () {
          if (cpLocked) return
          var charsOffset
          // some HTML5 input types throw error here
          try {
            // record how many chars from the end of input
            // the cursor was at
            charsOffset = el.value.length - el.selectionStart
          } catch (e) {}
          // Fix IE10/11 infinite update cycle
          // https://github.com/yyx990803/vue/issues/592
          /* istanbul ignore if */
          if (charsOffset < 0) {
            return
          }
          set()
          _.nextTick(function () {
            // force a value update, because in
            // certain cases the write filters output the
            // same result for different input values, and
            // the Observer set events won't be triggered.
            var newVal = self._watcher.value
            self.update(newVal)
            if (charsOffset != null) {
              var cursorPos =
                _.toString(newVal).length - charsOffset
              el.setSelectionRange(cursorPos, cursorPos)
            }
          })
        }
      : function textInputListener () {
          if (cpLocked) return
          set()
        }

    if (debounce) {
      this.listener = _.debounce(this.listener, debounce)
    }
    this.event = lazy ? 'change' : 'input'
    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    // 
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function'
    if (this.hasjQuery) {
      jQuery(el).on(this.event, this.listener)
    } else {
      _.on(el, this.event, this.listener)
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && _.isIE9) {
      this.onCut = function () {
        _.nextTick(self.listener)
      }
      this.onDel = function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener()
        }
      }
      _.on(el, 'cut', this.onCut)
      _.on(el, 'keyup', this.onDel)
    }

    // set initial value if present
    if (
      el.hasAttribute('value') ||
      (el.tagName === 'TEXTAREA' && el.value.trim())
    ) {
      this._initValue = number
        ? _.toNumber(el.value)
        : el.value
    }
  },

  update: function (value) {
    this.el.value = _.toString(value)
  },

  unbind: function () {
    var el = this.el
    if (this.hasjQuery) {
      jQuery(el).off(this.event, this.listener)
    } else {
      _.off(el, this.event, this.listener)
    }
    _.off(el,'compositionstart', this.cpLock)
    _.off(el,'compositionend', this.cpUnlock)
    if (this.onCut) {
      _.off(el,'cut', this.onCut)
      _.off(el,'keyup', this.onDel)
    }
  }

}
},{"../../util":67}],33:[function(require,module,exports){
var _ = require('../../util')

var handlers = {
  _default: require('./default'),
  radio: require('./radio'),
  select: require('./select'),
  checkbox: require('./checkbox')
}

module.exports = {

  priority: 800,
  twoWay: true,
  handlers: handlers,

  /**
   * Possible elements:
   *   <select>
   *   <textarea>
   *   <input type="*">
   *     - text
   *     - checkbox
   *     - radio
   *     - number
   *     - TODO: more types may be supplied as a plugin
   */

  bind: function () {
    // friendly warning...
    var filters = this.filters
    if (filters && filters.read && !filters.write) {
      _.warn(
        'It seems you are using a read-only filter with ' +
        'v-model. You might want to use a two-way filter ' +
        'to ensure correct behavior.'
      )
    }
    var el = this.el
    var tag = el.tagName
    var handler
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers._default
    } else if (tag === 'SELECT') {
      handler = handlers.select
    } else if (tag === 'TEXTAREA') {
      handler = handlers._default
    } else {
      _.warn("v-model doesn't support element type: " + tag)
      return
    }
    handler.bind.call(this)
    this.update = handler.update
    this.unbind = handler.unbind
  }

}
},{"../../util":67,"./checkbox":31,"./default":32,"./radio":34,"./select":35}],34:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.value, true)
    }
    _.on(el, 'change', this.listener)
    if (el.checked) {
      this._initValue = el.value
    }
  },

  update: function (value) {
    /* jshint eqeqeq: false */
    this.el.checked = value == this.el.value
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
  }

}
},{"../../util":67}],35:[function(require,module,exports){
var _ = require('../../util')
var Watcher = require('../../watcher')
var dirParser = require('../../parsers/directive')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    // check options param
    var optionsParam = this._checkParam('options')
    if (optionsParam) {
      initOptions.call(this, optionsParam)
    }
    this.number = this._checkParam('number') != null
    this.multiple = el.hasAttribute('multiple')
    this.listener = function () {
      var value = self.multiple
        ? getMultiValue(el)
        : el.value
      value = self.number
        ? _.isArray(value)
          ? value.map(_.toNumber)
          : _.toNumber(value)
        : value
      self.set(value, true)
    }
    _.on(el, 'change', this.listener)
    checkInitialValue.call(this)
  },

  update: function (value) {
    /* jshint eqeqeq: false */
    var el = this.el
    el.selectedIndex = -1
    var multi = this.multiple && _.isArray(value)
    var options = el.options
    var i = options.length
    var option
    while (i--) {
      option = options[i]
      option.selected = multi
        ? indexOf(value, option.value) > -1
        : value == option.value
    }
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
    if (this.optionWatcher) {
      this.optionWatcher.teardown()
    }
  }

}

/**
 * Initialize the option list from the param.
 *
 * @param {String} expression
 */

function initOptions (expression) {
  var self = this
  var descriptor = dirParser.parse(expression)[0]
  function optionUpdateWatcher (value) {
    if (_.isArray(value)) {
      self.el.innerHTML = ''
      buildOptions(self.el, value)
      if (self._watcher) {
        self.update(self._watcher.value)
      }
    } else {
      _.warn('Invalid options value for v-model: ' + value)
    }
  }
  this.optionWatcher = new Watcher(
    this.vm,
    descriptor.expression,
    optionUpdateWatcher,
    {
      deep: true,
      filters: _.resolveFilters(this.vm, descriptor.filters)
    }
  )
  // update with initial value
  optionUpdateWatcher(this.optionWatcher.value)
}

/**
 * Build up option elements. IE9 doesn't create options
 * when setting innerHTML on <select> elements, so we have
 * to use DOM API here.
 *
 * @param {Element} parent - a <select> or an <optgroup>
 * @param {Array} options
 */

function buildOptions (parent, options) {
  var op, el
  for (var i = 0, l = options.length; i < l; i++) {
    op = options[i]
    if (!op.options) {
      el = document.createElement('option')
      if (typeof op === 'string') {
        el.text = el.value = op
      } else {
        el.text = op.text
        el.value = op.value
      }
    } else {
      el = document.createElement('optgroup')
      el.label = op.label
      buildOptions(el, op.options)
    }
    parent.appendChild(el)
  }
}

/**
 * Check the initial value for selected options.
 */

function checkInitialValue () {
  var initValue
  var options = this.el.options
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].hasAttribute('selected')) {
      if (this.multiple) {
        (initValue || (initValue = []))
          .push(options[i].value)
      } else {
        initValue = options[i].value
      }
    }
  }
  if (typeof initValue !== 'undefined') {
    this._initValue = this.number
      ? _.toNumber(initValue)
      : initValue
  }
}

/**
 * Helper to extract a value array for select[multiple]
 *
 * @param {SelectElement} el
 * @return {Array}
 */

function getMultiValue (el) {
  return Array.prototype.filter
    .call(el.options, filterSelected)
    .map(getOptionValue)
}

function filterSelected (op) {
  return op.selected
}

function getOptionValue (op) {
  return op.value || op.text
}

/**
 * Native Array.indexOf uses strict equal, but in this
 * case we need to match string/numbers with soft equal.
 *
 * @param {Array} arr
 * @param {*} val
 */

function indexOf (arr, val) {
  /* jshint eqeqeq: false */
  var i = arr.length
  while (i--) {
    if (arr[i] == val) return i
  }
  return -1
}
},{"../../parsers/directive":55,"../../util":67,"../../watcher":71}],36:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  acceptStatement: true,
  priority: 700,

  bind: function () {
    // deal with iframes
    if (
      this.el.tagName === 'IFRAME' &&
      this.arg !== 'load'
    ) {
      var self = this
      this.iframeBind = function () {
        _.on(self.el.contentWindow, self.arg, self.handler)
      }
      _.on(this.el, 'load', this.iframeBind)
    }
  },

  update: function (handler) {
    if (typeof handler !== 'function') {
      _.warn(
        'Directive "v-on:' + this.expression + '" ' +
        'expects a function value.'
      )
      return
    }
    this.reset()
    var vm = this.vm
    this.handler = function (e) {
      e.targetVM = vm
      vm.$event = e
      var res = handler(e)
      vm.$event = null
      return res
    }
    if (this.iframeBind) {
      this.iframeBind()
    } else {
      _.on(this.el, this.arg, this.handler)
    }
  },

  reset: function () {
    var el = this.iframeBind
      ? this.el.contentWindow
      : this.el
    if (this.handler) {
      _.off(el, this.arg, this.handler)
    }
  },

  unbind: function () {
    this.reset()
    _.off(this.el, 'load', this.iframeBind)
  }
}
},{"../util":67}],37:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')
var vIf = require('./if')

module.exports = {

  isLiteral: true,

  // same logic reuse from v-if
  compile: vIf.compile,
  teardown: vIf.teardown,
  getContainedComponents: vIf.getContainedComponents,
  unbind: vIf.unbind,

  bind: function () {
    var el = this.el
    this.start = document.createComment('v-partial-start')
    this.end = document.createComment('v-partial-end')
    if (el.nodeType !== 8) {
      el.innerHTML = ''
    }
    if (el.tagName === 'TEMPLATE' || el.nodeType === 8) {
      _.replace(el, this.end)
    } else {
      el.appendChild(this.end)
    }
    _.before(this.start, this.end)
    if (!this._isDynamicLiteral) {
      this.insert(this.expression)
    }
  },

  update: function (id) {
    this.teardown()
    this.insert(id)
  },

  insert: function (id) {
    var partial = this.vm.$options.partials[id]
    _.assertAsset(partial, 'partial', id)
    if (partial) {
      var filters = this.filters && this.filters.read
      if (filters) {
        partial = _.applyFilters(partial, filters, this.vm)
      }
      this.compile(templateParser.parse(partial, true))
    }
  }

}
},{"../parsers/template":58,"../util":67,"./if":29}],38:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  isLiteral: true,

  bind: function () {
    var vm = this.el.__vue__
    if (!vm) {
      _.warn(
        'v-ref should only be used on a component root element.'
      )
      return
    }
    // If we get here, it means this is a `v-ref` on a
    // child, because parent scope `v-ref` is stripped in
    // `v-component` already. So we just record our own ref
    // here - it will overwrite parent ref in `v-component`,
    // if any.
    vm._refID = this.expression
  }
  
}
},{"../util":67}],39:[function(require,module,exports){
var _ = require('../util')
var isObject = _.isObject
var isPlainObject = _.isPlainObject
var textParser = require('../parsers/text')
var expParser = require('../parsers/expression')
var templateParser = require('../parsers/template')
var compile = require('../compiler/compile')
var transclude = require('../compiler/transclude')
var mergeOptions = require('../util/merge-option')
var uid = 0

module.exports = {

  /**
   * Setup.
   */

  bind: function () {
    // uid as a cache identifier
    this.id = '__v_repeat_' + (++uid)
    // we need to insert the objToArray converter
    // as the first read filter, because it has to be invoked
    // before any user filters. (can't do it in `update`)
    if (!this.filters) {
      this.filters = {}
    }
    // add the object -> array convert filter
    var objectConverter = _.bind(objToArray, this)
    if (!this.filters.read) {
      this.filters.read = [objectConverter]
    } else {
      this.filters.read.unshift(objectConverter)
    }
    // setup ref node
    this.ref = document.createComment('v-repeat')
    _.replace(this.el, this.ref)
    // check if this is a block repeat
    this.template = this.el.tagName === 'TEMPLATE'
      ? templateParser.parse(this.el, true)
      : this.el
    // check other directives that need to be handled
    // at v-repeat level
    this.checkIf()
    this.checkRef()
    this.checkComponent()
    // check for trackby param
    this.idKey =
      this._checkParam('track-by') ||
      this._checkParam('trackby') // 0.11.0 compat
    this.cache = Object.create(null)
  },

  /**
   * Warn against v-if usage.
   */

  checkIf: function () {
    if (_.attr(this.el, 'if') !== null) {
      _.warn(
        'Don\'t use v-if with v-repeat. ' +
        'Use v-show or the "filterBy" filter instead.'
      )
    }
  },

  /**
   * Check if v-ref/ v-el is also present.
   */

  checkRef: function () {
    var refID = _.attr(this.el, 'ref')
    this.refID = refID
      ? this.vm.$interpolate(refID)
      : null
    var elId = _.attr(this.el, 'el')
    this.elId = elId
      ? this.vm.$interpolate(elId)
      : null
  },

  /**
   * Check the component constructor to use for repeated
   * instances. If static we resolve it now, otherwise it
   * needs to be resolved at build time with actual data.
   */

  checkComponent: function () {
    var id = _.attr(this.el, 'component')
    var options = this.vm.$options
    if (!id) {
      // default constructor
      this.Ctor = _.Vue
      // inline repeats should inherit
      this.inherit = true
      // important: transclude with no options, just
      // to ensure block start and block end
      this.template = transclude(this.template)
      this._linkFn = compile(this.template, options)
    } else {
      this.asComponent = true
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.inlineTempalte = _.extractContent(this.el, true)
      }
      var tokens = textParser.parse(id)
      if (!tokens) { // static component
        var Ctor = this.Ctor = options.components[id]
        _.assertAsset(Ctor, 'component', id)
        var merged = mergeOptions(Ctor.options, {}, {
          $parent: this.vm
        })
        merged.template = this.inlineTempalte || merged.template
        merged._asComponent = true
        merged._parent = this.vm
        this.template = transclude(this.template, merged)
        // Important: mark the template as a root node so that
        // custom element components don't get compiled twice.
        // fixes #822
        this.template.__vue__ = true
        this._linkFn = compile(this.template, merged)
      } else {
        // to be resolved later
        var ctorExp = textParser.tokensToExp(tokens)
        this.ctorGetter = expParser.parse(ctorExp).get
      }
    }
  },

  /**
   * Update.
   * This is called whenever the Array mutates.
   *
   * @param {Array|Number|String} data
   */

  update: function (data) {
    data = data || []
    var type = typeof data
    if (type === 'number') {
      data = range(data)
    } else if (type === 'string') {
      data = _.toArray(data)
    }
    this.vms = this.diff(data, this.vms)
    // update v-ref
    if (this.refID) {
      this.vm.$[this.refID] = this.vms
    }
    if (this.elId) {
      this.vm.$$[this.elId] = this.vms.map(function (vm) {
        return vm.$el
      })
    }
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   * @param {Array} oldVms
   * @return {Array}
   */

  diff: function (data, oldVms) {
    var idKey = this.idKey
    var converted = this.converted
    var ref = this.ref
    var alias = this.arg
    var init = !oldVms
    var vms = new Array(data.length)
    var obj, raw, vm, i, l
    // First pass, go through the new Array and fill up
    // the new vms array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      obj = data[i]
      raw = converted ? obj.$value : obj
      vm = !init && this.getVm(raw)
      if (vm) { // reusable instance
        vm._reused = true
        vm.$index = i // update $index
        if (converted) {
          vm.$key = obj.$key // update $key
        }
        if (idKey) { // swap track by id data
          if (alias) {
            vm[alias] = raw
          } else {
            vm._setData(raw)
          }
        }
      } else { // new instance
        vm = this.build(obj, i, true)
        vm._new = true
        vm._reused = false
      }
      vms[i] = vm
      // insert if this is first run
      if (init) {
        vm.$before(ref)
      }
    }
    // if this is the first run, we're done.
    if (init) {
      return vms
    }
    // Second pass, go through the old vm instances and
    // destroy those who are not reused (and remove them
    // from cache)
    for (i = 0, l = oldVms.length; i < l; i++) {
      vm = oldVms[i]
      if (!vm._reused) {
        this.uncacheVm(vm)
        vm.$destroy(true)
      }
    }
    // final pass, move/insert new instances into the
    // right place. We're going in reverse here because
    // insertBefore relies on the next sibling to be
    // resolved.
    var targetNext, currentNext
    i = vms.length
    while (i--) {
      vm = vms[i]
      // this is the vm that we should be in front of
      targetNext = vms[i + 1]
      if (!targetNext) {
        // This is the last item. If it's reused then
        // everything else will eventually be in the right
        // place, so no need to touch it. Otherwise, insert
        // it.
        if (!vm._reused) {
          vm.$before(ref)
        }
      } else {
        var nextEl = targetNext.$el
        if (vm._reused) {
          // this is the vm we are actually in front of
          currentNext = findNextVm(vm, ref)
          // we only need to move if we are not in the right
          // place already.
          if (currentNext !== targetNext) {
            vm.$before(nextEl, null, false)
          }
        } else {
          // new instance, insert to existing next
          vm.$before(nextEl)
        }
      }
      vm._new = false
      vm._reused = false
    }
    return vms
  },

  /**
   * Build a new instance and cache it.
   *
   * @param {Object} data
   * @param {Number} index
   * @param {Boolean} needCache
   */

  build: function (data, index, needCache) {
    var meta = { $index: index }
    if (this.converted) {
      meta.$key = data.$key
    }
    var raw = this.converted ? data.$value : data
    var alias = this.arg
    if (alias) {
      data = {}
      data[alias] = raw
    } else if (!isPlainObject(raw)) {
      // non-object values
      data = {}
      meta.$value = raw
    } else {
      // default
      data = raw
    }
    // resolve constructor
    var Ctor = this.Ctor || this.resolveCtor(data, meta)
    var vm = this.vm.$addChild({
      el: templateParser.clone(this.template),
      _asComponent: this.asComponent,
      _host: this._host,
      _linkFn: this._linkFn,
      _meta: meta,
      data: data,
      inherit: this.inherit,
      template: this.inlineTempalte
    }, Ctor)
    // flag this instance as a repeat instance
    // so that we can skip it in vm._digest
    vm._repeat = true
    // cache instance
    if (needCache) {
      this.cacheVm(raw, vm)
    }
    // sync back changes for $value, particularly for
    // two-way bindings of primitive values
    var self = this
    vm.$watch('$value', function (val) {
      if (self.converted) {
        self.rawValue[vm.$key] = val
      } else {
        self.rawValue.$set(vm.$index, val)
      }
    })
    return vm
  },

  /**
   * Resolve a contructor to use for an instance.
   * The tricky part here is that there could be dynamic
   * components depending on instance data.
   *
   * @param {Object} data
   * @param {Object} meta
   * @return {Function}
   */

  resolveCtor: function (data, meta) {
    // create a temporary context object and copy data
    // and meta properties onto it.
    // use _.define to avoid accidentally overwriting scope
    // properties.
    var context = Object.create(this.vm)
    var key
    for (key in data) {
      _.define(context, key, data[key])
    }
    for (key in meta) {
      _.define(context, key, meta[key])
    }
    var id = this.ctorGetter.call(context, context)
    var Ctor = this.vm.$options.components[id]
    _.assertAsset(Ctor, 'component', id)
    return Ctor
  },

  /**
   * Unbind, teardown everything
   */

  unbind: function () {
    if (this.refID) {
      this.vm.$[this.refID] = null
    }
    if (this.vms) {
      var i = this.vms.length
      var vm
      while (i--) {
        vm = this.vms[i]
        this.uncacheVm(vm)
        vm.$destroy()
      }
    }
  },

  /**
   * Cache a vm instance based on its data.
   *
   * If the data is an object, we save the vm's reference on
   * the data object as a hidden property. Otherwise we
   * cache them in an object and for each primitive value
   * there is an array in case there are duplicates.
   *
   * @param {Object} data
   * @param {Vue} vm
   */

  cacheVm: function (data, vm) {
    var idKey = this.idKey
    var cache = this.cache
    var id
    if (idKey) {
      id = data[idKey]
      if (!cache[id]) {
        cache[id] = vm
      } else {
        _.warn('Duplicate track-by key in v-repeat: ' + id)
      }
    } else if (isObject(data)) {
      id = this.id
      if (data.hasOwnProperty(id)) {
        if (data[id] === null) {
          data[id] = vm
        } else {
          _.warn(
            'Duplicate objects are not supported in v-repeat ' +
            'when using components or transitions.'
          )
        }
      } else {
        _.define(data, this.id, vm)
      }
    } else {
      if (!cache[data]) {
        cache[data] = [vm]
      } else {
        cache[data].push(vm)
      }
    }
    vm._raw = data
  },

  /**
   * Try to get a cached instance from a piece of data.
   *
   * @param {Object} data
   * @return {Vue|undefined}
   */

  getVm: function (data) {
    if (this.idKey) {
      return this.cache[data[this.idKey]]
    } else if (isObject(data)) {
      return data[this.id]
    } else {
      var cached = this.cache[data]
      if (cached) {
        var i = 0
        var vm = cached[i]
        // since duplicated vm instances might be a reused
        // one OR a newly created one, we need to return the
        // first instance that is neither of these.
        while (vm && (vm._reused || vm._new)) {
          vm = cached[++i]
        }
        return vm
      }
    }
  },

  /**
   * Delete a cached vm instance.
   *
   * @param {Vue} vm
   */

  uncacheVm: function (vm) {
    var data = vm._raw
    if (this.idKey) {
      this.cache[data[this.idKey]] = null
    } else if (isObject(data)) {
      data[this.id] = null
      vm._raw = null
    } else {
      this.cache[data].pop()
    }
  }

}

/**
 * Helper to find the next element that is an instance
 * root node. This is necessary because a destroyed vm's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its __vue__ reference
 * should have been removed so we can skip them.
 *
 * @param {Vue} vm
 * @param {CommentNode} ref
 * @return {Vue}
 */

function findNextVm (vm, ref) {
  var el = (vm._blockEnd || vm.$el).nextSibling
  while (!el.__vue__ && el !== ref) {
    el = el.nextSibling
  }
  return el.__vue__
}

/**
 * Attempt to convert non-Array objects to array.
 * This is the default filter installed to every v-repeat
 * directive.
 *
 * It will be called with **the directive** as `this`
 * context so that we can mark the repeat array as converted
 * from an object.
 *
 * @param {*} obj
 * @return {Array}
 * @private
 */

function objToArray (obj) {
  // regardless of type, store the un-filtered raw value.
  this.rawValue = obj
  if (!isPlainObject(obj)) {
    return obj
  }
  var keys = Object.keys(obj)
  var i = keys.length
  var res = new Array(i)
  var key
  while (i--) {
    key = keys[i]
    res[i] = {
      $key: key,
      $value: obj[key]
    }
  }
  // `this` points to the repeat directive instance
  this.converted = true
  return res
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range (n) {
  var i = -1
  var ret = new Array(n)
  while (++i < n) {
    ret[i] = i
  }
  return ret
}
},{"../compiler/compile":18,"../compiler/transclude":19,"../parsers/expression":56,"../parsers/template":58,"../parsers/text":59,"../util":67,"../util/merge-option":69}],40:[function(require,module,exports){
var transition = require('../transition')

module.exports = function (value) {
  var el = this.el
  transition.apply(el, value ? 1 : -1, function () {
    el.style.display = value ? '' : 'none'
  }, this.vm)
}
},{"../transition":61}],41:[function(require,module,exports){
var _ = require('../util')
var prefixes = ['-webkit-', '-moz-', '-ms-']
var camelPrefixes = ['Webkit', 'Moz', 'ms']
var importantRE = /!important;?$/
var camelRE = /([a-z])([A-Z])/g
var testEl = null
var propCache = {}

module.exports = {

  deep: true,

  update: function (value) {
    if (this.arg) {
      this.setProp(this.arg, value)
    } else {
      if (typeof value === 'object') {
        // cache object styles so that only changed props
        // are actually updated.
        if (!this.cache) this.cache = {}
        for (var prop in value) {
          this.setProp(prop, value[prop])
          /* jshint eqeqeq: false */
          if (value[prop] != this.cache[prop]) {
            this.cache[prop] = value[prop]
            this.setProp(prop, value[prop])
          }
        }
      } else {
        this.el.style.cssText = value
      }
    }
  },

  setProp: function (prop, value) {
    prop = normalize(prop)
    if (!prop) return // unsupported prop
    // cast possible numbers/booleans into strings
    if (value != null) value += ''
    if (value) {
      var isImportant = importantRE.test(value)
        ? 'important'
        : ''
      if (isImportant) {
        value = value.replace(importantRE, '').trim()
      }
      this.el.style.setProperty(prop, value, isImportant)
    } else {
      this.el.style.removeProperty(prop)
    }
  }

}

/**
 * Normalize a CSS property name.
 * - cache result
 * - auto prefix
 * - camelCase -> dash-case
 *
 * @param {String} prop
 * @return {String}
 */

function normalize (prop) {
  if (propCache[prop]) {
    return propCache[prop]
  }
  var res = prefix(prop)
  propCache[prop] = propCache[res] = res
  return res
}

/**
 * Auto detect the appropriate prefix for a CSS property.
 * https://gist.github.com/paulirish/523692
 *
 * @param {String} prop
 * @return {String}
 */

function prefix (prop) {
  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
  var camel = _.camelize(prop)
  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
  if (!testEl) {
    testEl = document.createElement('div')
  }
  if (camel in testEl.style) {
    return prop
  }
  var i = prefixes.length
  var prefixed
  while (i--) {
    prefixed = camelPrefixes[i] + upper
    if (prefixed in testEl.style) {
      return prefixes[i] + prop
    }
  }
}
},{"../util":67}],42:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  bind: function () {
    this.attr = this.el.nodeType === 3
      ? 'nodeValue'
      : 'textContent'
  },

  update: function (value) {
    this.el[this.attr] = _.toString(value)
  }
  
}
},{"../util":67}],43:[function(require,module,exports){
module.exports = {

  priority: 1000,
  isLiteral: true,

  bind: function () {
    if (!this._isDynamicLiteral) {
      this.update(this.expression)
    }
  },

  update: function (id) {
    var vm = this.el.__vue__ || this.vm
    this.el.__v_trans = {
      id: id,
      // resolve the custom transition functions now
      // so the transition module knows this is a
      // javascript transition without having to check
      // computed CSS.
      fns: vm.$options.transitions[id]
    }
  }

}
},{}],44:[function(require,module,exports){
var _ = require('../util')
var Watcher = require('../watcher')
var expParser = require('../parsers/expression')
var literalRE = /^(true|false|\s?('[^']*'|"[^"]")\s?)$/

module.exports = {

  priority: 900,

  bind: function () {

    var child = this.vm
    var parent = child.$parent
    var childKey = this.arg || '$data'
    var parentKey = this.expression

    if (this.el && this.el !== child.$el) {
      _.warn(
        'v-with can only be used on instance root elements.'
      )
    } else if (!parent) {
      _.warn(
        'v-with must be used on an instance with a parent.'
      )
    } else if (literalRE.test(parentKey)) {
      // no need to setup watchers for literal bindings
      if (!this.arg) {
        _.warn(
          'v-with cannot bind literal value as $data: ' +
          parentKey
        )
      } else {
        var value = expParser.parse(parentKey).get()
        child.$set(childKey, value)
      }
    } else {

      // simple lock to avoid circular updates.
      // without this it would stabilize too, but this makes
      // sure it doesn't cause other watchers to re-evaluate.
      var locked = false
      var lock = function () {
        locked = true
        _.nextTick(unlock)
      }
      var unlock = function () {
        locked = false
      }

      this.parentWatcher = new Watcher(
        parent,
        parentKey,
        function (val) {
          if (!locked) {
            lock()
            child.$set(childKey, val)
          }
        }
      )
      
      // set the child initial value first, before setting
      // up the child watcher to avoid triggering it
      // immediately.
      child.$set(childKey, this.parentWatcher.value)

      this.childWatcher = new Watcher(
        child,
        childKey,
        function (val) {
          if (!locked) {
            lock()
            parent.$set(parentKey, val)
          }
        }
      )
    }
  },

  unbind: function () {
    if (this.parentWatcher) {
      this.parentWatcher.teardown()
      this.childWatcher.teardown()
    }
  }

}
},{"../parsers/expression":56,"../util":67,"../watcher":71}],45:[function(require,module,exports){
var _ = require('../util')
var Path = require('../parsers/path')

/**
 * Filter filter for v-repeat
 *
 * @param {String} searchKey
 * @param {String} [delimiter]
 * @param {String} dataKey
 */

exports.filterBy = function (arr, searchKey, delimiter, dataKey) {
  // allow optional `in` delimiter
  // because why not
  if (delimiter && delimiter !== 'in') {
    dataKey = delimiter
  }
  // get the search string
  var search =
    _.stripQuotes(searchKey) ||
    this.$get(searchKey)
  if (!search) {
    return arr
  }
  search = ('' + search).toLowerCase()
  // get the optional dataKey
  dataKey =
    dataKey &&
    (_.stripQuotes(dataKey) || this.$get(dataKey))
  return arr.filter(function (item) {
    return dataKey
      ? contains(Path.get(item, dataKey), search)
      : contains(item, search)
  })
}

/**
 * Filter filter for v-repeat
 *
 * @param {String} sortKey
 * @param {String} reverseKey
 */

exports.orderBy = function (arr, sortKey, reverseKey) {
  var key =
    _.stripQuotes(sortKey) ||
    this.$get(sortKey)
  if (!key) {
    return arr
  }
  var order = 1
  if (reverseKey) {
    if (reverseKey === '-1') {
      order = -1
    } else if (reverseKey.charCodeAt(0) === 0x21) { // !
      reverseKey = reverseKey.slice(1)
      order = this.$get(reverseKey) ? 1 : -1
    } else {
      order = this.$get(reverseKey) ? -1 : 1
    }
  }
  // sort on a copy to avoid mutating original array
  return arr.slice().sort(function (a, b) {
    a = _.isObject(a) ? Path.get(a, key) : a
    b = _.isObject(b) ? Path.get(b, key) : b
    return a === b ? 0 : a > b ? order : -order
  })
}

/**
 * String contain helper
 *
 * @param {*} val
 * @param {String} search
 */

function contains (val, search) {
  if (_.isObject(val)) {
    for (var key in val) {
      if (contains(val[key], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
}
},{"../parsers/path":57,"../util":67}],46:[function(require,module,exports){
var _ = require('../util')

/**
 * Stringify value.
 *
 * @param {Number} indent
 */

exports.json = {
  read: function (value, indent) {
    return typeof value === 'string'
      ? value
      : JSON.stringify(value, null, Number(indent) || 2)
  },
  write: function (value) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}

/**
 * 'abc' => 'Abc'
 */

exports.capitalize = function (value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 'abc' => 'ABC'
 */

exports.uppercase = function (value) {
  return (value || value === 0)
    ? value.toString().toUpperCase()
    : ''
}

/**
 * 'AbC' => 'abc'
 */

exports.lowercase = function (value) {
  return (value || value === 0)
    ? value.toString().toLowerCase()
    : ''
}

/**
 * 12345 => $12,345.00
 *
 * @param {String} sign
 */

var digitsRE = /(\d{3})(?=\d)/g

exports.currency = function (value, sign) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  sign = sign || '$'
  var s = Math.floor(Math.abs(value)).toString(),
    i = s.length % 3,
    h = i > 0
      ? (s.slice(0, i) + (s.length > 3 ? ',' : ''))
      : '',
    v = Math.abs(parseInt((value * 100) % 100, 10)),
    f = '.' + (v < 10 ? ('0' + v) : v)
  return (value < 0 ? '-' : '') +
    sign + h + s.slice(i).replace(digitsRE, '$1,') + f
}

/**
 * 'item' => 'items'
 *
 * @params
 *  an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */

exports.pluralize = function (value) {
  var args = _.toArray(arguments, 1)
  return args.length > 1
    ? (args[value % 10 - 1] || args[args.length - 1])
    : (args[0] + (value === 1 ? '' : 's'))
}

/**
 * A special filter that takes a handler function,
 * wraps it so it only gets triggered on specific
 * keypresses. v-on only.
 *
 * @param {String} key
 */

var keyCodes = {
  enter    : 13,
  tab      : 9,
  'delete' : 46,
  up       : 38,
  left     : 37,
  right    : 39,
  down     : 40,
  esc      : 27
}

exports.key = function (handler, key) {
  if (!handler) return
  var code = keyCodes[key]
  if (!code) {
    code = parseInt(key, 10)
  }
  return function (e) {
    if (e.keyCode === code) {
      return handler.call(this, e)
    }
  }
}

// expose keycode hash
exports.key.keyCodes = keyCodes

/**
 * Install special array filters
 */

_.extend(exports, require('./array-filters'))

},{"../util":67,"./array-filters":45}],47:[function(require,module,exports){
var _ = require('../util')
var Directive = require('../directive')
var compile = require('../compiler/compile')
var transclude = require('../compiler/transclude')

/**
 * Transclude, compile and link element.
 *
 * If a pre-compiled linker is available, that means the
 * passed in element will be pre-transcluded and compiled
 * as well - all we need to do is to call the linker.
 *
 * Otherwise we need to call transclude/compile/link here.
 *
 * @param {Element} el
 * @return {Element}
 */

exports._compile = function (el) {
  var options = this.$options
  if (options._linkFn) {
    // pre-transcluded with linker, just use it
    this._initElement(el)
    options._linkFn(this, el)
  } else {
    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference
    var original = el
    el = transclude(el, options)
    this._initElement(el)
    // compile and link the rest
    compile(el, options)(this, el)
    // finally replace original
    if (options.replace) {
      _.replace(original, el)
    }
  }
  return el
}

/**
 * Initialize instance element. Called in the public
 * $mount() method.
 *
 * @param {Element} el
 */

exports._initElement = function (el) {
  if (el instanceof DocumentFragment) {
    this._isBlock = true
    this.$el = this._blockStart = el.firstChild
    this._blockEnd = el.lastChild
    this._blockFragment = el
  } else {
    this.$el = el
  }
  this.$el.__vue__ = this
  this._callHook('beforeCompile')
}

/**
 * Create and bind a directive to an element.
 *
 * @param {String} name - directive name
 * @param {Node} node   - target node
 * @param {Object} desc - parsed directive descriptor
 * @param {Object} def  - directive definition object
 * @param {Vue|undefined} host - transclusion host component
 */

exports._bindDir = function (name, node, desc, def, host) {
  this._directives.push(
    new Directive(name, node, this, desc, def, host)
  )
}

/**
 * Teardown an instance, unobserves the data, unbind all the
 * directives, turn off all the event listeners, etc.
 *
 * @param {Boolean} remove - whether to remove the DOM node.
 * @param {Boolean} deferCleanup - if true, defer cleanup to
 *                                 be called later
 */

exports._destroy = function (remove, deferCleanup) {
  if (this._isBeingDestroyed) {
    return
  }
  this._callHook('beforeDestroy')
  this._isBeingDestroyed = true
  var i
  // remove self from parent. only necessary
  // if parent is not being destroyed as well.
  var parent = this.$parent
  if (parent && !parent._isBeingDestroyed) {
    i = parent._children.indexOf(this)
    parent._children.splice(i, 1)
  }
  // same for transclusion host.
  var host = this._host
  if (host && !host._isBeingDestroyed) {
    i = host._transCpnts.indexOf(this)
    host._transCpnts.splice(i, 1)
  }
  // destroy all children.
  i = this._children.length
  while (i--) {
    this._children[i].$destroy()
  }
  // teardown all directives. this also tearsdown all
  // directive-owned watchers. intentionally check for
  // directives array length on every loop since directives
  // that manages partial compilation can splice ones out
  for (i = 0; i < this._directives.length; i++) {
    this._directives[i]._teardown()
  }
  // teardown all user watchers.
  var watcher
  for (i in this._userWatchers) {
    watcher = this._userWatchers[i]
    if (watcher) {
      watcher.teardown()
    }
  }
  // remove reference to self on $el
  if (this.$el) {
    this.$el.__vue__ = null
  }
  // remove DOM element
  var self = this
  if (remove && this.$el) {
    this.$remove(function () {
      self._cleanup()
    })
  } else if (!deferCleanup) {
    this._cleanup()
  }
}

/**
 * Clean up to ensure garbage collection.
 * This is called after the leave transition if there
 * is any.
 */

exports._cleanup = function () {
  // remove reference from data ob
  this._data.__ob__.removeVm(this)
  this._data =
  this._watchers =
  this._userWatchers =
  this._watcherList =
  this.$el =
  this.$parent =
  this.$root =
  this._children =
  this._transCpnts =
  this._directives = null
  // call the last hook...
  this._isDestroyed = true
  this._callHook('destroyed')
  // turn off all instance listeners.
  this.$off()
}
},{"../compiler/compile":18,"../compiler/transclude":19,"../directive":21,"../util":67}],48:[function(require,module,exports){
var _ = require('../util')
var inDoc = _.inDoc

/**
 * Setup the instance's option events & watchers.
 * If the value is a string, we pull it from the
 * instance's methods by name.
 */

exports._initEvents = function () {
  var options = this.$options
  registerCallbacks(this, '$on', options.events)
  registerCallbacks(this, '$watch', options.watch)
}

/**
 * Register callbacks for option events and watchers.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {Object} hash
 */

function registerCallbacks (vm, action, hash) {
  if (!hash) return
  var handlers, key, i, j
  for (key in hash) {
    handlers = hash[key]
    if (_.isArray(handlers)) {
      for (i = 0, j = handlers.length; i < j; i++) {
        register(vm, action, key, handlers[i])
      }
    } else {
      register(vm, action, key, handlers)
    }
  }
}

/**
 * Helper to register an event/watch callback.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {String} key
 * @param {*} handler
 */

function register (vm, action, key, handler) {
  var type = typeof handler
  if (type === 'function') {
    vm[action](key, handler)
  } else if (type === 'string') {
    var methods = vm.$options.methods
    var method = methods && methods[handler]
    if (method) {
      vm[action](key, method)
    } else {
      _.warn(
        'Unknown method: "' + handler + '" when ' +
        'registering callback for ' + action +
        ': "' + key + '".'
      )
    }
  }
}

/**
 * Setup recursive attached/detached calls
 */

exports._initDOMHooks = function () {
  this.$on('hook:attached', onAttached)
  this.$on('hook:detached', onDetached)
}

/**
 * Callback to recursively call attached hook on children
 */

function onAttached () {
  this._isAttached = true
  this._children.forEach(callAttach)
  if (this._transCpnts.length) {
    this._transCpnts.forEach(callAttach)
  }
}

/**
 * Iterator to call attached hook
 * 
 * @param {Vue} child
 */

function callAttach (child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached')
  }
}

/**
 * Callback to recursively call detached hook on children
 */

function onDetached () {
  this._isAttached = false
  this._children.forEach(callDetach)
  if (this._transCpnts.length) {
    this._transCpnts.forEach(callDetach)
  }
}

/**
 * Iterator to call detached hook
 * 
 * @param {Vue} child
 */

function callDetach (child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached')
  }
}

/**
 * Trigger all handlers for a hook
 *
 * @param {String} hook
 */

exports._callHook = function (hook) {
  var handlers = this.$options[hook]
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(this)
    }
  }
  this.$emit('hook:' + hook)
}
},{"../util":67}],49:[function(require,module,exports){
var mergeOptions = require('../util/merge-option')

/**
 * The main init sequence. This is called for every
 * instance, including ones that are created from extended
 * constructors.
 *
 * @param {Object} options - this options object should be
 *                           the result of merging class
 *                           options and the options passed
 *                           in to the constructor.
 */

exports._init = function (options) {

  options = options || {}

  this.$el           = null
  this.$parent       = options._parent
  this.$root         = options._root || this
  this.$             = {} // child vm references
  this.$$            = {} // element references
  this._watcherList  = [] // all watchers as an array
  this._watchers     = {} // internal watchers as a hash
  this._userWatchers = {} // user watchers as a hash
  this._directives   = [] // all directives

  // a flag to avoid this being observed
  this._isVue = true

  // events bookkeeping
  this._events         = {}    // registered callbacks
  this._eventsCount    = {}    // for $broadcast optimization
  this._eventCancelled = false // for event cancellation

  // block instance properties
  this._isBlock     = false
  this._blockStart  =          // @type {CommentNode}
  this._blockEnd    = null     // @type {CommentNode}

  // lifecycle state
  this._isCompiled  =
  this._isDestroyed =
  this._isReady     =
  this._isAttached  =
  this._isBeingDestroyed = false

  // children
  this._children = []
  this._childCtors = {}

  // transclusion unlink functions
  this._containerUnlinkFn =
  this._contentUnlinkFn = null

  // transcluded components that belong to the parent.
  // need to keep track of them so that we can call
  // attached/detached hooks on them.
  this._transCpnts = []
  this._host = options._host

  // push self into parent / transclusion host
  if (this.$parent) {
    this.$parent._children.push(this)
  }
  if (this._host) {
    this._host._transCpnts.push(this)
  }

  // props used in v-repeat diffing
  this._new = true
  this._reused = false

  // merge options.
  options = this.$options = mergeOptions(
    this.constructor.options,
    options,
    this
  )

  // set data after merge.
  this._data = options.data || {}

  // initialize data observation and scope inheritance.
  this._initScope()

  // setup event system and option events.
  this._initEvents()

  // call created hook
  this._callHook('created')

  // if `el` option is passed, start compilation.
  if (options.el) {
    this.$mount(options.el)
  }
}
},{"../util/merge-option":69}],50:[function(require,module,exports){
var _ = require('../util')
var Observer = require('../observer')
var Dep = require('../observer/dep')

/**
 * Setup the scope of an instance, which contains:
 * - observed data
 * - computed properties
 * - user methods
 * - meta properties
 */

exports._initScope = function () {
  this._initData()
  this._initComputed()
  this._initMethods()
  this._initMeta()
}

/**
 * Initialize the data. 
 */

exports._initData = function () {
  // proxy data on instance
  var data = this._data
  var keys = Object.keys(data)
  var i = keys.length
  var key
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key)) {
      this._proxy(key)
    }
  }
  // observe data
  Observer.create(data).addVm(this)
}

/**
 * Swap the isntance's $data. Called in $data's setter.
 *
 * @param {Object} newData
 */

exports._setData = function (newData) {
  newData = newData || {}
  var oldData = this._data
  this._data = newData
  var keys, key, i
  // unproxy keys not present in new data
  keys = Object.keys(oldData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key) && !(key in newData)) {
      this._unproxy(key)
    }
  }
  // proxy keys not already proxied,
  // and trigger change for changed values
  keys = Object.keys(newData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
      // new property
      this._proxy(key)
    }
  }
  oldData.__ob__.removeVm(this)
  Observer.create(newData).addVm(this)
  this._digest()
}

/**
 * Proxy a property, so that
 * vm.prop === vm._data.prop
 *
 * @param {String} key
 */

exports._proxy = function (key) {
  // need to store ref to self here
  // because these getter/setters might
  // be called by child instances!
  var self = this
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function proxyGetter () {
      return self._data[key]
    },
    set: function proxySetter (val) {
      self._data[key] = val
    }
  })
}

/**
 * Unproxy a property.
 *
 * @param {String} key
 */

exports._unproxy = function (key) {
  delete this[key]
}

/**
 * Force update on every watcher in scope.
 */

exports._digest = function () {
  var i = this._watcherList.length
  while (i--) {
    this._watcherList[i].update()
  }
  var children = this._children
  i = children.length
  while (i--) {
    var child = children[i]
    if (child.$options.inherit) {
      child._digest()
    }
  }
}

/**
 * Setup computed properties. They are essentially
 * special getter/setters
 */

function noop () {}
exports._initComputed = function () {
  var computed = this.$options.computed
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key]
      var def = {
        enumerable: true,
        configurable: true
      }
      if (typeof userDef === 'function') {
        def.get = _.bind(userDef, this)
        def.set = noop
      } else {
        def.get = userDef.get
          ? _.bind(userDef.get, this)
          : noop
        def.set = userDef.set
          ? _.bind(userDef.set, this)
          : noop
      }
      Object.defineProperty(this, key, def)
    }
  }
}

/**
 * Setup instance methods. Methods must be bound to the
 * instance since they might be called by children
 * inheriting them.
 */

exports._initMethods = function () {
  var methods = this.$options.methods
  if (methods) {
    for (var key in methods) {
      this[key] = _.bind(methods[key], this)
    }
  }
}

/**
 * Initialize meta information like $index, $key & $value.
 */

exports._initMeta = function () {
  var metas = this.$options._meta
  if (metas) {
    for (var key in metas) {
      this._defineMeta(key, metas[key])
    }
  }
}

/**
 * Define a meta property, e.g $index, $key, $value
 * which only exists on the vm instance but not in $data.
 *
 * @param {String} key
 * @param {*} value
 */

exports._defineMeta = function (key, value) {
  var dep = new Dep()
  Object.defineProperty(this, key, {
    enumerable: true,
    configurable: true,
    get: function metaGetter () {
      if (Observer.target) {
        Observer.target.addDep(dep)
      }
      return value
    },
    set: function metaSetter (val) {
      if (val !== value) {
        value = val
        dep.notify()
      }
    }
  })
}
},{"../observer":53,"../observer/dep":52,"../util":67}],51:[function(require,module,exports){
var _ = require('../util')
var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method]
  _.define(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    var result = original.apply(this, args)
    var ob = this.__ob__
    var inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.notify()
    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

_.define(
  arrayProto,
  '$set',
  function $set (index, val) {
    if (index >= this.length) {
      this.length = index + 1
    }
    return this.splice(index, 1, val)[0]
  }
)

/**
 * Convenience method to remove the element at given index.
 *
 * @param {Number} index
 * @param {*} val
 */

_.define(
  arrayProto,
  '$remove',
  function $remove (index) {
    if (typeof index !== 'number') {
      index = this.indexOf(index)
    }
    if (index > -1) {
      return this.splice(index, 1)[0]
    }
  }
)

module.exports = arrayMethods
},{"../util":67}],52:[function(require,module,exports){
var uid = 0
var _ = require('../util')

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

function Dep () {
  this.id = ++uid
  this.subs = []
}

var p = Dep.prototype

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

p.addSub = function (sub) {
  this.subs.push(sub)
}

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

p.removeSub = function (sub) {
  if (this.subs.length) {
    var i = this.subs.indexOf(sub)
    if (i > -1) this.subs.splice(i, 1)
  }
}

/**
 * Notify all subscribers of a new value.
 */

p.notify = function () {
  // stablize the subscriber list first
  var subs = _.toArray(this.subs)
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}

module.exports = Dep
},{"../util":67}],53:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var Dep = require('./dep')
var arrayMethods = require('./array')
var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
require('./object')

var uid = 0

/**
 * Type enums
 */

var ARRAY  = 0
var OBJECT = 1

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function protoAugment (target, src) {
  target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment (target, src, keys) {
  var i = keys.length
  var key
  while (i--) {
    key = keys[i]
    _.define(target, key, src[key])
  }
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @param {Number} type
 * @constructor
 */

function Observer (value, type) {
  this.id = ++uid
  this.value = value
  this.active = true
  this.deps = []
  _.define(value, '__ob__', this)
  if (type === ARRAY) {
    var augment = config.proto && _.hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else if (type === OBJECT) {
    this.walk(value)
  }
}

Observer.target = null

var p = Observer.prototype

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @return {Observer|undefined}
 * @static
 */

Observer.create = function (value) {
  if (
    value &&
    value.hasOwnProperty('__ob__') &&
    value.__ob__ instanceof Observer
  ) {
    return value.__ob__
  } else if (_.isArray(value)) {
    return new Observer(value, ARRAY)
  } else if (
    _.isPlainObject(value) &&
    !value._isVue // avoid Vue instance
  ) {
    return new Observer(value, OBJECT)
  }
}

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object. Properties prefixed with `$` or `_`
 * and accessor properties are ignored.
 *
 * @param {Object} obj
 */

p.walk = function (obj) {
  var keys = Object.keys(obj)
  var i = keys.length
  var key, prefix
  while (i--) {
    key = keys[i]
    prefix = key.charCodeAt(0)
    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
      this.convert(key, obj[key])
    }
  }
}

/**
 * Try to carete an observer for a child value,
 * and if value is array, link dep to the array.
 *
 * @param {*} val
 * @return {Dep|undefined}
 */

p.observe = function (val) {
  return Observer.create(val)
}

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

p.observeArray = function (items) {
  var i = items.length
  while (i--) {
    this.observe(items[i])
  }
}

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

p.convert = function (key, val) {
  var ob = this
  var childOb = ob.observe(val)
  var dep = new Dep()
  if (childOb) {
    childOb.deps.push(dep)
  }
  Object.defineProperty(ob.value, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // Observer.target is a watcher whose getter is
      // currently being evaluated.
      if (ob.active && Observer.target) {
        Observer.target.addDep(dep)
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      // remove dep from old value
      var oldChildOb = val && val.__ob__
      if (oldChildOb) {
        var oldDeps = oldChildOb.deps
        oldDeps.splice(oldDeps.indexOf(dep), 1)
      }
      val = newVal
      // add dep to new value
      var newChildOb = ob.observe(newVal)
      if (newChildOb) {
        newChildOb.deps.push(dep)
      }
      dep.notify()
    }
  })
}

/**
 * Notify change on all self deps on an observer.
 * This is called when a mutable value mutates. e.g.
 * when an Array's mutating methods are called, or an
 * Object's $add/$delete are called.
 */

p.notify = function () {
  var deps = this.deps
  for (var i = 0, l = deps.length; i < l; i++) {
    deps[i].notify()
  }
}

/**
 * Add an owner vm, so that when $add/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

p.addVm = function (vm) {
  (this.vms = this.vms || []).push(vm)
}

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

p.removeVm = function (vm) {
  this.vms.splice(this.vms.indexOf(vm), 1)
}

module.exports = Observer

},{"../config":20,"../util":67,"./array":51,"./dep":52,"./object":54}],54:[function(require,module,exports){
var _ = require('../util')
var objProto = Object.prototype

/**
 * Add a new property to an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$add',
  function $add (key, val) {
    if (this.hasOwnProperty(key)) return
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      this[key] = val
      return
    }
    ob.convert(key, val)
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._proxy(key)
        vm._digest()
      }
    } else {
      ob.notify()
    }
  }
)

/**
 * Set a property on an observed object, calling add to
 * ensure the property is observed.
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$set',
  function $set (key, val) {
    this.$add(key, val)
    this[key] = val
  }
)

/**
 * Deletes a property from an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @public
 */

_.define(
  objProto,
  '$delete',
  function $delete (key) {
    if (!this.hasOwnProperty(key)) return
    delete this[key]
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      return
    }
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._unproxy(key)
        vm._digest()
      }
    } else {
      ob.notify()
    }
  }
)
},{"../util":67}],55:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var cache = new Cache(1000)
var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g

/**
 * Parser state
 */

var str
var c, i, l
var inSingle
var inDouble
var curly
var square
var paren
var begin
var argIndex
var dirs
var dir
var lastFilterIndex
var arg

/**
 * Push a directive object into the result Array
 */

function pushDir () {
  dir.raw = str.slice(begin, i).trim()
  if (dir.expression === undefined) {
    dir.expression = str.slice(argIndex, i).trim()
  } else if (lastFilterIndex !== begin) {
    pushFilter()
  }
  if (i === 0 || dir.expression) {
    dirs.push(dir)
  }
}

/**
 * Push a filter to the current directive object
 */

function pushFilter () {
  var exp = str.slice(lastFilterIndex, i).trim()
  var filter
  if (exp) {
    filter = {}
    var tokens = exp.match(filterTokenRE)
    filter.name = tokens[0]
    filter.args = tokens.length > 1 ? tokens.slice(1) : null
  }
  if (filter) {
    (dir.filters = dir.filters || []).push(filter)
  }
  lastFilterIndex = i + 1
}

/**
 * Parse a directive string into an Array of AST-like
 * objects representing directives.
 *
 * Example:
 *
 * "click: a = a + 1 | uppercase" will yield:
 * {
 *   arg: 'click',
 *   expression: 'a = a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} str
 * @return {Array<Object>}
 */

exports.parse = function (s) {

  var hit = cache.get(s)
  if (hit) {
    return hit
  }

  // reset parser state
  str = s
  inSingle = inDouble = false
  curly = square = paren = begin = argIndex = 0
  lastFilterIndex = 0
  dirs = []
  dir = {}
  arg = null

  for (i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i)
    if (inSingle) {
      // check single quote
      if (c === 0x27) inSingle = !inSingle
    } else if (inDouble) {
      // check double quote
      if (c === 0x22) inDouble = !inDouble
    } else if (
      c === 0x2C && // comma
      !paren && !curly && !square
    ) {
      // reached the end of a directive
      pushDir()
      // reset & skip the comma
      dir = {}
      begin = argIndex = lastFilterIndex = i + 1
    } else if (
      c === 0x3A && // colon
      !dir.expression &&
      !dir.arg
    ) {
      // argument
      arg = str.slice(begin, i).trim()
      // test for valid argument here
      // since we may have caught stuff like first half of
      // an object literal or a ternary expression.
      if (argRE.test(arg)) {
        argIndex = i + 1
        dir.arg = _.stripQuotes(arg) || arg
      }
    } else if (
      c === 0x7C && // pipe
      str.charCodeAt(i + 1) !== 0x7C &&
      str.charCodeAt(i - 1) !== 0x7C
    ) {
      if (dir.expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1
        dir.expression = str.slice(argIndex, i).trim()
      } else {
        // already has filter
        pushFilter()
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break // "
        case 0x27: inSingle = true; break // '
        case 0x28: paren++; break         // (
        case 0x29: paren--; break         // )
        case 0x5B: square++; break        // [
        case 0x5D: square--; break        // ]
        case 0x7B: curly++; break         // {
        case 0x7D: curly--; break         // }
      }
    }
  }

  if (i === 0 || begin !== i) {
    pushDir()
  }

  cache.put(s, dirs)
  return dirs
}
},{"../cache":17,"../util":67}],56:[function(require,module,exports){
var _ = require('../util')
var Path = require('./path')
var Cache = require('../cache')
var expressionCache = new Cache(1000)

var allowedKeywords =
  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
  'encodeURIComponent,parseInt,parseFloat'
var allowedKeywordsRE =
  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// keywords that don't make sense inside expressions
var improperKeywords =
  'break,case,class,catch,const,continue,debugger,default,' +
  'delete,do,else,export,extends,finally,for,function,if,' +
  'import,in,instanceof,let,return,super,switch,throw,try,' +
  'var,while,with,yield,enum,await,implements,package,' +
  'proctected,static,interface,private,public'
var improperKeywordsRE =
  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

var wsRE = /\s/g
var newlineRE = /\n/g
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
var restoreRE = /"(\d+)"/g
var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/
var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
var booleanLiteralRE = /^(true|false)$/

/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = []

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save (str, isString) {
  var i = saved.length
  saved[i] = isString
    ? str.replace(newlineRE, '\\n')
    : str
  return '"' + i + '"'
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite (raw) {
  var c = raw.charAt(0)
  var path = raw.slice(1)
  if (allowedKeywordsRE.test(path)) {
    return raw
  } else {
    path = path.indexOf('"') > -1
      ? path.replace(restoreRE, restore)
      : path
    return c + 'scope.' + path
  }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore (str, i) {
  return saved[i]
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function compileExpFns (exp, needSet) {
  if (improperKeywordsRE.test(exp)) {
    _.warn(
      'Avoid using reserved keywords in expression: '
      + exp
    )
  }
  // reset state
  saved.length = 0
  // save strings and object literal keys
  var body = exp
    .replace(saveRE, save)
    .replace(wsRE, '')
  // rewrite all paths
  // pad 1 space here becaue the regex matches 1 extra char
  body = (' ' + body)
    .replace(pathReplaceRE, rewrite)
    .replace(restoreRE, restore)
  var getter = makeGetter(body)
  if (getter) {
    return {
      get: getter,
      body: body,
      set: needSet
        ? makeSetter(body)
        : null
    }
  }
}

/**
 * Compile getter setters for a simple path.
 *
 * @param {String} exp
 * @return {Function}
 */

function compilePathFns (exp) {
  var getter, path
  if (exp.indexOf('[') < 0) {
    // really simple path
    path = exp.split('.')
    getter = Path.compileGetter(path)
  } else {
    // do the real parsing
    path = Path.parse(exp)
    getter = path.get
  }
  return {
    get: getter,
    // always generate setter for simple paths
    set: function (obj, val) {
      Path.set(obj, path, val)
    }
  }
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetter (body) {
  try {
    return new Function('scope', 'return ' + body + ';')
  } catch (e) {
    _.warn(
      'Invalid expression. ' +
      'Generated function body: ' + body
    )
  }
}

/**
 * Build a setter function.
 *
 * This is only needed in rare situations like "a[b]" where
 * a settable path requires dynamic evaluation.
 *
 * This setter function may throw error when called if the
 * expression body is not a valid left-hand expression in
 * assignment.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeSetter (body) {
  try {
    return new Function('scope', 'value', body + '=value;')
  } catch (e) {
    _.warn('Invalid setter function body: ' + body)
  }
}

/**
 * Check for setter existence on a cache hit.
 *
 * @param {Function} hit
 */

function checkSetter (hit) {
  if (!hit.set) {
    hit.set = makeSetter(hit.body)
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

exports.parse = function (exp, needSet) {
  exp = exp.trim()
  // try cache
  var hit = expressionCache.get(exp)
  if (hit) {
    if (needSet) {
      checkSetter(hit)
    }
    return hit
  }
  // we do a simple path check to optimize for them.
  // the check fails valid paths with unusal whitespaces,
  // but that's too rare and we don't care.
  // also skip boolean literals and paths that start with
  // global "Math"
  var res =
    pathTestRE.test(exp) &&
    // don't treat true/false as paths
    !booleanLiteralRE.test(exp) &&
    // Math constants e.g. Math.PI, Math.E etc.
    exp.slice(0, 5) !== 'Math.'
      ? compilePathFns(exp)
      : compileExpFns(exp, needSet)
  expressionCache.put(exp, res)
  return res
}

// Export the pathRegex for external use
exports.pathTestRE = pathTestRE
},{"../cache":17,"../util":67,"./path":57}],57:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var pathCache = new Cache(1000)
var identRE = /^[$_a-zA-Z]+[\w$]*$/

/**
 * Path-parsing algorithm scooped from Polymer/observe-js
 */

var pathStateMachine = {
  'beforePath': {
    'ws': ['beforePath'],
    'ident': ['inIdent', 'append'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'inPath': {
    'ws': ['inPath'],
    '.': ['beforeIdent'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'beforeIdent': {
    'ws': ['beforeIdent'],
    'ident': ['inIdent', 'append']
  },

  'inIdent': {
    'ident': ['inIdent', 'append'],
    '0': ['inIdent', 'append'],
    'number': ['inIdent', 'append'],
    'ws': ['inPath', 'push'],
    '.': ['beforeIdent', 'push'],
    '[': ['beforeElement', 'push'],
    'eof': ['afterPath', 'push']
  },

  'beforeElement': {
    'ws': ['beforeElement'],
    '0': ['afterZero', 'append'],
    'number': ['inIndex', 'append'],
    "'": ['inSingleQuote', 'append', ''],
    '"': ['inDoubleQuote', 'append', '']
  },

  'afterZero': {
    'ws': ['afterElement', 'push'],
    ']': ['inPath', 'push']
  },

  'inIndex': {
    '0': ['inIndex', 'append'],
    'number': ['inIndex', 'append'],
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  },

  'inSingleQuote': {
    "'": ['afterElement'],
    'eof': 'error',
    'else': ['inSingleQuote', 'append']
  },

  'inDoubleQuote': {
    '"': ['afterElement'],
    'eof': 'error',
    'else': ['inDoubleQuote', 'append']
  },

  'afterElement': {
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  }
}

function noop () {}

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} char
 * @return {String} type
 */

function getPathCharType (char) {
  if (char === undefined) {
    return 'eof'
  }

  var code = char.charCodeAt(0)

  switch(code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return char

    case 0x5F: // _
    case 0x24: // $
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((0x61 <= code && code <= 0x7A) ||
      (0x41 <= code && code <= 0x5A)) {
    return 'ident'
  }

  // 1-9
  if (0x31 <= code && code <= 0x39) {
    return 'number'
  }

  return 'else'
}

/**
 * Parse a string path into an array of segments
 * Todo implement cache
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath (path) {
  var keys = []
  var index = -1
  var mode = 'beforePath'
  var c, newChar, key, type, transition, action, typeMap

  var actions = {
    push: function() {
      if (key === undefined) {
        return
      }
      keys.push(key)
      key = undefined
    },
    append: function() {
      if (key === undefined) {
        key = newChar
      } else {
        key += newChar
      }
    }
  }

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1]
    if ((mode === 'inSingleQuote' && nextChar === "'") ||
        (mode === 'inDoubleQuote' && nextChar === '"')) {
      index++
      newChar = nextChar
      actions.append()
      return true
    }
  }

  while (mode) {
    index++
    c = path[index]

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c)
    typeMap = pathStateMachine[mode]
    transition = typeMap[type] || typeMap['else'] || 'error'

    if (transition === 'error') {
      return // parse error
    }

    mode = transition[0]
    action = actions[transition[1]] || noop
    newChar = transition[2] === undefined
      ? c
      : transition[2]
    action()

    if (mode === 'afterPath') {
      return keys
    }
  }
}

/**
 * Format a accessor segment based on its type.
 *
 * @param {String} key
 * @return {Boolean}
 */

function formatAccessor(key) {
  if (identRE.test(key)) { // identifier
    return '.' + key
  } else if (+key === key >>> 0) { // bracket index
    return '[' + key + ']'
  } else { // bracket string
    return '["' + key.replace(/"/g, '\\"') + '"]'
  }
}

/**
 * Compiles a getter function with a fixed path.
 *
 * @param {Array} path
 * @return {Function}
 */

exports.compileGetter = function (path) {
  var body = 'return o' + path.map(formatAccessor).join('')
  return new Function('o', body)
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

exports.parse = function (path) {
  var hit = pathCache.get(path)
  if (!hit) {
    hit = parsePath(path)
    if (hit) {
      hit.get = exports.compileGetter(hit)
      pathCache.put(path, hit)
    }
  }
  return hit
}

/**
 * Get from an object from a path string
 *
 * @param {Object} obj
 * @param {String} path
 */

exports.get = function (obj, path) {
  path = exports.parse(path)
  if (path) {
    return path.get(obj)
  }
}

/**
 * Set on an object from a path
 *
 * @param {Object} obj
 * @param {String | Array} path
 * @param {*} val
 */

exports.set = function (obj, path, val) {
  if (typeof path === 'string') {
    path = exports.parse(path)
  }
  if (!path || !_.isObject(obj)) {
    return false
  }
  var last, key
  for (var i = 0, l = path.length - 1; i < l; i++) {
    last = obj
    key = path[i]
    obj = obj[key]
    if (!_.isObject(obj)) {
      obj = {}
      last.$add(key, obj)
    }
  }
  key = path[i]
  if (key in obj) {
    obj[key] = val
  } else {
    obj.$add(key, val)
  }
  return true
}
},{"../cache":17,"../util":67}],58:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var templateCache = new Cache(1000)
var idSelectorCache = new Cache(1000)

var map = {
  _default : [0, '', ''],
  legend   : [1, '<fieldset>', '</fieldset>'],
  tr       : [2, '<table><tbody>', '</tbody></table>'],
  col      : [
    2,
    '<table><tbody></tbody><colgroup>',
    '</colgroup></table>'
  ]
}

map.td =
map.th = [
  3,
  '<table><tbody><tr>',
  '</tr></tbody></table>'
]

map.option =
map.optgroup = [
  1,
  '<select multiple="multiple">',
  '</select>'
]

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.g =
map.defs =
map.symbol =
map.use =
map.image =
map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [
  1,
  '<svg ' +
    'xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
    'version="1.1">',
  '</svg>'
]

var tagRE = /<([\w:]+)/
var entityRE = /&\w+;/

/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @return {DocumentFragment}
 */

function stringToFragment (templateString) {
  // try a cache hit first
  var hit = templateCache.get(templateString)
  if (hit) {
    return hit
  }

  var frag = document.createDocumentFragment()
  var tagMatch = templateString.match(tagRE)
  var entityMatch = entityRE.test(templateString)

  if (!tagMatch && !entityMatch) {
    // text only, return a single text node.
    frag.appendChild(
      document.createTextNode(templateString)
    )
  } else {

    var tag    = tagMatch && tagMatch[1]
    var wrap   = map[tag] || map._default
    var depth  = wrap[0]
    var prefix = wrap[1]
    var suffix = wrap[2]
    var node   = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) {
      node = node.lastChild
    }

    var child
    /* jshint boss:true */
    while (child = node.firstChild) {
      frag.appendChild(child)
    }
  }

  templateCache.put(templateString, frag)
  return frag
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment (node) {
  var tag = node.tagName
  // if its a template tag and the browser supports it,
  // its content is already a document fragment.
  if (
    tag === 'TEMPLATE' &&
    node.content instanceof DocumentFragment
  ) {
    return node.content
  }
  // script template
  if (tag === 'SCRIPT') {
    return stringToFragment(node.textContent)
  }
  // normal node, clone it to avoid mutating the original
  var clone = exports.clone(node)
  var frag = document.createDocumentFragment()
  var child
  /* jshint boss:true */
  while (child = clone.firstChild) {
    frag.appendChild(child)
  }
  return frag
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/show_bug.cgi?id=137755
var hasBrokenTemplate = _.inBrowser
  ? (function () {
      var a = document.createElement('div')
      a.innerHTML = '<template>1</template>'
      return !a.cloneNode(true).firstChild.innerHTML
    })()
  : false

// Test for IE10/11 textarea placeholder clone bug
var hasTextareaCloneBug = _.inBrowser
  ? (function () {
      var t = document.createElement('textarea')
      t.placeholder = 't'
      return t.cloneNode(true).value === 't'
    })()
  : false

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

exports.clone = function (node) {
  var res = node.cloneNode(true)
  var i, original, cloned
  /* istanbul ignore if */
  if (hasBrokenTemplate) {
    original = node.querySelectorAll('template')
    if (original.length) {
      cloned = res.querySelectorAll('template')
      i = cloned.length
      while (i--) {
        cloned[i].parentNode.replaceChild(
          original[i].cloneNode(true),
          cloned[i]
        )
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      res.value = node.value
    } else {
      original = node.querySelectorAll('textarea')
      if (original.length) {
        cloned = res.querySelectorAll('textarea')
        i = cloned.length
        while (i--) {
          cloned[i].value = original[i].value
        }
      }
    }
  }
  return res
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *    Possible values include:
 *    - DocumentFragment object
 *    - Node object of type Template
 *    - id selector: '#some-template-id'
 *    - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} clone
 * @param {Boolean} noSelector
 * @return {DocumentFragment|undefined}
 */

exports.parse = function (template, clone, noSelector) {
  var node, frag

  // if the template is already a document fragment,
  // do nothing
  if (template instanceof DocumentFragment) {
    return clone
      ? template.cloneNode(true)
      : template
  }

  if (typeof template === 'string') {
    // id selector
    if (!noSelector && template.charAt(0) === '#') {
      // id selector can be cached too
      frag = idSelectorCache.get(template)
      if (!frag) {
        node = document.getElementById(template.slice(1))
        if (node) {
          frag = nodeToFragment(node)
          // save selector to cache
          idSelectorCache.put(template, frag)
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template)
    }
  } else if (template.nodeType) {
    // a direct node
    frag = nodeToFragment(template)
  }

  return frag && clone
    ? exports.clone(frag)
    : frag
}
},{"../cache":17,"../util":67}],59:[function(require,module,exports){
var Cache = require('../cache')
var config = require('../config')
var dirParser = require('./directive')
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
var cache, tagRE, htmlRE, firstChar, lastChar

/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex (str) {
  return str.replace(regexEscapeRE, '\\$&')
}

/**
 * Compile the interpolation tag regex.
 *
 * @return {RegExp}
 */

function compileRegex () {
  config._delimitersChanged = false
  var open = config.delimiters[0]
  var close = config.delimiters[1]
  firstChar = open.charAt(0)
  lastChar = close.charAt(close.length - 1)
  var firstCharRE = escapeRegex(firstChar)
  var lastCharRE = escapeRegex(lastChar)
  var openRE = escapeRegex(open)
  var closeRE = escapeRegex(close)
  tagRE = new RegExp(
    firstCharRE + '?' + openRE +
    '(.+?)' +
    closeRE + lastCharRE + '?',
    'g'
  )
  htmlRE = new RegExp(
    '^' + firstCharRE + openRE +
    '.*' +
    closeRE + lastCharRE + '$'
  )
  // reset cache
  cache = new Cache(1000)
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

exports.parse = function (text) {
  if (config._delimitersChanged) {
    compileRegex()
  }
  var hit = cache.get(text)
  if (hit) {
    return hit
  }
  if (!tagRE.test(text)) {
    return null
  }
  var tokens = []
  var lastIndex = tagRE.lastIndex = 0
  var match, index, value, first, oneTime, partial
  /* jshint boss:true */
  while (match = tagRE.exec(text)) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    // tag token
    first = match[1].charCodeAt(0)
    oneTime = first === 0x2A // *
    partial = first === 0x3E // >
    value = (oneTime || partial)
      ? match[1].slice(1)
      : match[1]
    tokens.push({
      tag: true,
      value: value.trim(),
      html: htmlRE.test(match[0]),
      oneTime: oneTime,
      partial: partial
    })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  cache.put(text, tokens)
  return tokens
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 *
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

exports.tokensToExp = function (tokens, vm) {
  return tokens.length > 1
    ? tokens.map(function (token) {
        return formatToken(token, vm)
      }).join('+')
    : formatToken(tokens[0], vm, true)
}

/**
 * Format a single token.
 *
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} single
 * @return {String}
 */

function formatToken (token, vm, single) {
  return token.tag
    ? vm && token.oneTime
      ? '"' + vm.$eval(token.value) + '"'
      : single
        ? token.value
        : inlineFilters(token.value)
    : '"' + token.value + '"'
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/
function inlineFilters (exp) {
  if (!filterRE.test(exp)) {
    return '(' + exp + ')'
  } else {
    var dir = dirParser.parse(exp)[0]
    if (!dir.filters) {
      return '(' + exp + ')'
    } else {
      exp = dir.expression
      for (var i = 0, l = dir.filters.length; i < l; i++) {
        var filter = dir.filters[i]
        var args = filter.args
          ? ',"' + filter.args.join('","') + '"'
          : ''
        filter = 'this.$options.filters["' + filter.name + '"]'
        exp = '(' + filter + '.read||' + filter + ')' +
          '.apply(this,[' + exp + args + '])'
      }
      return exp
    }
  }
}
},{"../cache":17,"../config":20,"./directive":55}],60:[function(require,module,exports){
var _ = require('../util')
var addClass = _.addClass
var removeClass = _.removeClass
var transDurationProp = _.transitionProp + 'Duration'
var animDurationProp = _.animationProp + 'Duration'

var queue = []
var queued = false

/**
 * Push a job into the transition queue, which is to be
 * executed on next frame.
 *
 * @param {Element} el    - target element
 * @param {Number} dir    - 1: enter, -1: leave
 * @param {Function} op   - the actual dom operation
 * @param {String} cls    - the className to remove when the
 *                          transition is done.
 * @param {Function} [cb] - user supplied callback.
 */

function push (el, dir, op, cls, cb) {
  queue.push({
    el  : el,
    dir : dir,
    cb  : cb,
    cls : cls,
    op  : op
  })
  if (!queued) {
    queued = true
    _.nextTick(flush)
  }
}

/**
 * Flush the queue, and do one forced reflow before
 * triggering transitions.
 */

function flush () {
  /* jshint unused: false */
  var f = document.documentElement.offsetHeight
  queue.forEach(run)
  queue = []
  queued = false
}

/**
 * Run a transition job.
 *
 * @param {Object} job
 */

function run (job) {

  var el = job.el
  var data = el.__v_trans
  var cls = job.cls
  var cb = job.cb
  var op = job.op
  var transitionType = getTransitionType(el, data, cls)

  if (job.dir > 0) { // ENTER
    if (transitionType === 1) {
      // trigger transition by removing enter class
      removeClass(el, cls)
      // only need to listen for transitionend if there's
      // a user callback
      if (cb) setupTransitionCb(_.transitionEndEvent)
    } else if (transitionType === 2) {
      // animations are triggered when class is added
      // so we just listen for animationend to remove it.
      setupTransitionCb(_.animationEndEvent, function () {
        removeClass(el, cls)
      })
    } else {
      // no transition applicable
      removeClass(el, cls)
      if (cb) cb()
    }
  } else { // LEAVE
    if (transitionType) {
      // leave transitions/animations are both triggered
      // by adding the class, just remove it on end event.
      var event = transitionType === 1
        ? _.transitionEndEvent
        : _.animationEndEvent
      setupTransitionCb(event, function () {
        op()
        removeClass(el, cls)
      })
    } else {
      op()
      removeClass(el, cls)
      if (cb) cb()
    }
  }

  /**
   * Set up a transition end callback, store the callback
   * on the element's __v_trans data object, so we can
   * clean it up if another transition is triggered before
   * the callback is fired.
   *
   * @param {String} event
   * @param {Function} [cleanupFn]
   */

  function setupTransitionCb (event, cleanupFn) {
    data.event = event
    var onEnd = data.callback = function transitionCb (e) {
      if (e.target === el) {
        _.off(el, event, onEnd)
        data.event = data.callback = null
        if (cleanupFn) cleanupFn()
        if (cb) cb()
      }
    }
    _.on(el, event, onEnd)
  }
}

/**
 * Get an element's transition type based on the
 * calculated styles
 *
 * @param {Element} el
 * @param {Object} data
 * @param {String} className
 * @return {Number}
 *         1 - transition
 *         2 - animation
 */

function getTransitionType (el, data, className) {
  var type = data.cache && data.cache[className]
  if (type) return type
  var inlineStyles = el.style
  var computedStyles = window.getComputedStyle(el)
  var transDuration =
    inlineStyles[transDurationProp] ||
    computedStyles[transDurationProp]
  if (transDuration && transDuration !== '0s') {
    type = 1
  } else {
    var animDuration =
      inlineStyles[animDurationProp] ||
      computedStyles[animDurationProp]
    if (animDuration && animDuration !== '0s') {
      type = 2
    }
  }
  if (type) {
    if (!data.cache) data.cache = {}
    data.cache[className] = type
  }
  return type
}

/**
 * Apply CSS transition to an element.
 *
 * @param {Element} el
 * @param {Number} direction - 1: enter, -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Object} data - target element's transition data
 */

module.exports = function (el, direction, op, data, cb) {
  var prefix = data.id || 'v'
  var enterClass = prefix + '-enter'
  var leaveClass = prefix + '-leave'
  // clean up potential previous unfinished transition
  if (data.callback) {
    _.off(el, data.event, data.callback)
    removeClass(el, enterClass)
    removeClass(el, leaveClass)
    data.event = data.callback = null
  }
  if (direction > 0) { // enter
    addClass(el, enterClass)
    op()
    push(el, direction, null, enterClass, cb)
  } else { // leave
    addClass(el, leaveClass)
    push(el, direction, op, leaveClass, cb)
  }
}
},{"../util":67}],61:[function(require,module,exports){
var _ = require('../util')
var applyCSSTransition = require('./css')
var applyJSTransition = require('./js')
var doc = typeof document === 'undefined' ? null : document

/**
 * Append with transition.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.append = function (el, target, vm, cb) {
  apply(el, 1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * InsertBefore with transition.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.before = function (el, target, vm, cb) {
  apply(el, 1, function () {
    _.before(el, target)
  }, vm, cb)
}

/**
 * Remove with transition.
 *
 * @oaram {Element} el
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.remove = function (el, vm, cb) {
  apply(el, -1, function () {
    _.remove(el)
  }, vm, cb)
}

/**
 * Remove by appending to another parent with transition.
 * This is only used in block operations.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.removeThenAppend = function (el, target, vm, cb) {
  apply(el, -1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * Append the childNodes of a fragment to target.
 *
 * @param {DocumentFragment} block
 * @param {Node} target
 * @param {Vue} vm
 */

exports.blockAppend = function (block, target, vm) {
  var nodes = _.toArray(block.childNodes)
  for (var i = 0, l = nodes.length; i < l; i++) {
    exports.before(nodes[i], target, vm)
  }
}

/**
 * Remove a block of nodes between two edge nodes.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 */

exports.blockRemove = function (start, end, vm) {
  var node = start.nextSibling
  var next
  while (node !== end) {
    next = node.nextSibling
    exports.remove(node, vm)
    node = next
  }
}

/**
 * Apply transitions with an operation callback.
 *
 * @oaram {Element} el
 * @param {Number} direction
 *                  1: enter
 *                 -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Vue} vm
 * @param {Function} [cb]
 */

var apply = exports.apply = function (el, direction, op, vm, cb) {
  var transData = el.__v_trans
  if (
    !transData ||
    !vm._isCompiled ||
    // if the vm is being manipulated by a parent directive
    // during the parent's compilation phase, skip the
    // animation.
    (vm.$parent && !vm.$parent._isCompiled)
  ) {
    op()
    if (cb) cb()
    return
  }
  // determine the transition type on the element
  var jsTransition = transData.fns
  if (jsTransition) {
    // js
    applyJSTransition(
      el,
      direction,
      op,
      transData,
      jsTransition,
      vm,
      cb
    )
  } else if (
    _.transitionEndEvent &&
    // skip CSS transitions if page is not visible -
    // this solves the issue of transitionend events not
    // firing until the page is visible again.
    // pageVisibility API is supported in IE10+, same as
    // CSS transitions.
    !(doc && doc.hidden)
  ) {
    // css
    applyCSSTransition(
      el,
      direction,
      op,
      transData,
      cb
    )
  } else {
    // not applicable
    op()
    if (cb) cb()
  }
}
},{"../util":67,"./css":60,"./js":62}],62:[function(require,module,exports){
/**
 * Apply JavaScript enter/leave functions.
 *
 * @param {Element} el
 * @param {Number} direction - 1: enter, -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Object} data - target element's transition data
 * @param {Object} def - transition definition object
 * @param {Vue} vm - the owner vm of the element
 * @param {Function} [cb]
 */

module.exports = function (el, direction, op, data, def, vm, cb) {
  // if the element is the root of an instance,
  // use that instance as the transition function context
  vm = el.__vue__ || vm
  if (data.cancel) {
    data.cancel()
    data.cancel = null
  }
  if (direction > 0) { // enter
    if (def.beforeEnter) {
      def.beforeEnter.call(vm, el)
    }
    op()
    if (def.enter) {
      data.cancel = def.enter.call(vm, el, function () {
        data.cancel = null
        if (cb) cb()
      })
    } else if (cb) {
      cb()
    }
  } else { // leave
    if (def.leave) {
      data.cancel = def.leave.call(vm, el, function () {
        data.cancel = null
        op()
        if (cb) cb()
      })
    } else {
      op()
      if (cb) cb()
    }
  }
}
},{}],63:[function(require,module,exports){
var config = require('../config')

/**
 * Enable debug utilities. The enableDebug() function and
 * all _.log() & _.warn() calls will be dropped in the
 * minified production build.
 */

enableDebug()

function enableDebug () {

  var hasConsole = typeof console !== 'undefined'
  
  /**
   * Log a message.
   *
   * @param {String} msg
   */

  exports.log = function (msg) {
    if (hasConsole && config.debug) {
      console.log('[Vue info]: ' + msg)
    }
  }

  /**
   * We've got a problem here.
   *
   * @param {String} msg
   */

  exports.warn = function (msg) {
    if (hasConsole && (!config.silent || config.debug)) {
      console.warn('[Vue warn]: ' + msg)
      /* istanbul ignore if */
      if (config.debug) {
        /* jshint debug: true */
        debugger
      }
    }
  }

  /**
   * Assert asset exists
   */

  exports.assertAsset = function (val, type, id) {
    if (!val) {
      exports.warn('Failed to resolve ' + type + ': ' + id)
    }
  }
}
},{"../config":20}],64:[function(require,module,exports){
var config = require('../config')

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed byy doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

var doc =
  typeof document !== 'undefined' &&
  document.documentElement

exports.inDoc = function (node) {
  var parent = node && node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

/**
 * Extract an attribute from a node.
 *
 * @param {Node} node
 * @param {String} attr
 */

exports.attr = function (node, attr) {
  attr = config.prefix + attr
  var val = node.getAttribute(attr)
  if (val !== null) {
    node.removeAttribute(attr)
  }
  return val
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.after = function (el, target) {
  if (target.nextSibling) {
    exports.before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

exports.remove = function (el) {
  el.parentNode.removeChild(el)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.prepend = function (el, target) {
  if (target.firstChild) {
    exports.before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

exports.replace = function (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

/**
 * Copy attributes from one element to another.
 *
 * @param {Element} from
 * @param {Element} to
 */

exports.copyAttributes = function (from, to) {
  if (from.hasAttributes()) {
    var attrs = from.attributes
    for (var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i]
      to.setAttribute(attr.name, attr.value)
    }
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.on = function (el, event, cb) {
  el.addEventListener(event, cb)
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.off = function (el, event, cb) {
  el.removeEventListener(event, cb)
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.addClass = function (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.removeClass = function (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    el.setAttribute('class', cur.trim())
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element}
 */

exports.extractContent = function (el, asFragment) {
  var child
  var rawContent
  if (el.hasChildNodes()) {
    rawContent = asFragment
      ? document.createDocumentFragment()
      : document.createElement('div')
    /* jshint boss:true */
    while (child = el.firstChild) {
      rawContent.appendChild(child)
    }
  }
  return rawContent
}

},{"../config":20}],65:[function(require,module,exports){
/**
 * Can we use __proto__?
 *
 * @type {Boolean}
 */

exports.hasProto = '__proto__' in {}

/**
 * Indicates we have a window
 *
 * @type {Boolean}
 */

var toString = Object.prototype.toString
var inBrowser = exports.inBrowser =
  typeof window !== 'undefined' &&
  toString.call(window) !== '[object Object]'

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

exports.nextTick = (function () {
  var callbacks = []
  var pending = false
  var timerFunc
  function handle () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1
    var observer = new MutationObserver(handle)
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function () {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    timerFunc = setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(handle, 0)
  }
})()

/**
 * Detect if we are in IE9...
 *
 * @type {Boolean}
 */

exports.isIE9 =
  inBrowser &&
  navigator.userAgent.indexOf('MSIE 9.0') > 0

/**
 * Sniff transition/animation events
 */

if (inBrowser && !exports.isIE9) {
  var isWebkitTrans =
    window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  var isWebkitAnim =
    window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  exports.transitionProp = isWebkitTrans
    ? 'WebkitTransition'
    : 'transition'
  exports.transitionEndEvent = isWebkitTrans
    ? 'webkitTransitionEnd'
    : 'transitionend'
  exports.animationProp = isWebkitAnim
    ? 'WebkitAnimation'
    : 'animation'
  exports.animationEndEvent = isWebkitAnim
    ? 'webkitAnimationEnd'
    : 'animationend'
}
},{}],66:[function(require,module,exports){
var _ = require('./debug')

/**
 * Resolve read & write filters for a vm instance. The
 * filters descriptor Array comes from the directive parser.
 *
 * This is extracted into its own utility so it can
 * be used in multiple scenarios.
 *
 * @param {Vue} vm
 * @param {Array<Object>} filters
 * @param {Object} [target]
 * @return {Object}
 */

exports.resolveFilters = function (vm, filters, target) {
  if (!filters) {
    return
  }
  var res = target || {}
  // var registry = vm.$options.filters
  filters.forEach(function (f) {
    var def = vm.$options.filters[f.name]
    _.assertAsset(def, 'filter', f.name)
    if (!def) return
    var args = f.args
    var reader, writer
    if (typeof def === 'function') {
      reader = def
    } else {
      reader = def.read
      writer = def.write
    }
    if (reader) {
      if (!res.read) res.read = []
      res.read.push(function (value) {
        return args
          ? reader.apply(vm, [value].concat(args))
          : reader.call(vm, value)
      })
    }
    if (writer) {
      if (!res.write) res.write = []
      res.write.push(function (value, oldVal) {
        return args
          ? writer.apply(vm, [value, oldVal].concat(args))
          : writer.call(vm, value, oldVal)
      })
    }
  })
  return res
}

/**
 * Apply filters to a value
 *
 * @param {*} value
 * @param {Array} filters
 * @param {Vue} vm
 * @param {*} oldVal
 * @return {*}
 */

exports.applyFilters = function (value, filters, vm, oldVal) {
  if (!filters) {
    return value
  }
  for (var i = 0, l = filters.length; i < l; i++) {
    value = filters[i].call(vm, value, oldVal)
  }
  return value
}
},{"./debug":63}],67:[function(require,module,exports){
var lang   = require('./lang')
var extend = lang.extend

extend(exports, lang)
extend(exports, require('./env'))
extend(exports, require('./dom'))
extend(exports, require('./filter'))
extend(exports, require('./debug'))
},{"./debug":63,"./dom":64,"./env":65,"./filter":66,"./lang":68}],68:[function(require,module,exports){
/**
 * Check is a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

exports.isReserved = function (str) {
  var c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Guard text output, make sure undefined outputs
 * empty string
 *
 * @param {*} value
 * @return {String}
 */

exports.toString = function (value) {
  return value == null
    ? ''
    : value.toString()
}

/**
 * Check and convert possible numeric numbers before
 * setting back to data
 *
 * @param {*} value
 * @return {*|Number}
 */

exports.toNumber = function (value) {
  return (
    isNaN(value) ||
    value === null ||
    typeof value === 'boolean'
  ) ? value
    : Number(value)
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

exports.stripQuotes = function (str) {
  var a = str.charCodeAt(0)
  var b = str.charCodeAt(str.length - 1)
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : false
}

/**
 * Replace helper
 *
 * @param {String} _ - matched delimiter
 * @param {String} c - matched char
 * @return {String}
 */
function toUpper (_, c) {
  return c ? c.toUpperCase () : ''
}

/**
 * Camelize a hyphen-delmited string.
 *
 * @param {String} str
 * @return {String}
 */

var camelRE = /-(\w)/g
exports.camelize = function (str) {
  return str.replace(camelRE, toUpper)
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g
exports.classify = function (str) {
  return str.replace(classifyRE, toUpper)
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return {Function}
 */

exports.bind = function (fn, ctx) {
  return function () {
    return fn.apply(ctx, arguments)
  }
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

exports.toArray = function (list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.extend = function (to, from) {
  for (var key in from) {
    to[key] = from[key]
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isObject = function (obj) {
  return obj && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString
exports.isPlainObject = function (obj) {
  return toString.call(obj) === '[object Object]'
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isArray = function (obj) {
  return Array.isArray(obj)
}

/**
 * Define a non-enumerable property
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

exports.define = function (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value        : val,
    enumerable   : !!enumerable,
    writable     : true,
    configurable : true
  })
}

/**
 * Debounce a function so it only gets called after the
 * input stops arriving after the given wait period.
 *
 * @param {Function} func
 * @param {Number} wait
 * @return {Function} - the debounced function
 */

exports.debounce = function(func, wait) {
  var timeout, args, context, timestamp, result
  var later = function() {
    var last = Date.now() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
  }
  return function() {
    context = this
    args = arguments
    timestamp = Date.now()
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    return result
  }
}
},{}],69:[function(require,module,exports){
var _ = require('./index')
var extend = _.extend

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 *
 * All strategy functions follow the same signature:
 *
 * @param {*} parentVal
 * @param {*} childVal
 * @param {Vue} [vm]
 */

var strats = Object.create(null)

/**
 * Helper that recursively merges two data objects together.
 */

function mergeData (to, from) {
  var key, toVal, fromVal
  for (key in from) {
    toVal = to[key]
    fromVal = from[key]
    if (!to.hasOwnProperty(key)) {
      to.$add(key, fromVal)
    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      _.warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.'
      )
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else {
    // instance merge, return raw object
    var instanceData = typeof childVal === 'function'
      ? childVal.call(vm)
      : childVal
    var defaultData = typeof parentVal === 'function'
      ? parentVal.call(vm)
      : undefined
    if (instanceData) {
      return mergeData(instanceData, defaultData)
    } else {
      return defaultData
    }
  }
}

/**
 * El
 */

strats.el = function (parentVal, childVal, vm) {
  if (!vm && childVal && typeof childVal !== 'function') {
    _.warn(
      'The "el" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.'
    )
    return
  }
  var ret = childVal || parentVal
  // invoke the element factory if this is instance merge
  return vm && typeof ret === 'function'
    ? ret.call(vm)
    : ret
}

/**
 * Hooks and param attributes are merged as arrays.
 */

strats.created =
strats.ready =
strats.attached =
strats.detached =
strats.beforeCompile =
strats.compiled =
strats.beforeDestroy =
strats.destroyed =
strats.paramAttributes = function (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : _.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

strats.directives =
strats.filters =
strats.partials =
strats.transitions =
strats.components = function (parentVal, childVal, vm, key) {
  var ret = Object.create(
    vm && vm.$parent
      ? vm.$parent.$options[key]
      : _.Vue.options[key]
  )
  if (parentVal) {
    var keys = Object.keys(parentVal)
    var i = keys.length
    var field
    while (i--) {
      field = keys[i]
      ret[field] = parentVal[field]
    }
  }
  if (childVal) extend(ret, childVal)
  return ret
}

/**
 * Events & Watchers.
 *
 * Events & watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch =
strats.events = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = {}
  extend(ret, parentVal)
  for (var key in childVal) {
    var parent = ret[key]
    var child = childVal[key]
    if (parent && !_.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */

strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = Object.create(parentVal)
  extend(ret, childVal)
  return ret
}

/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

/**
 * Make sure component options get converted to actual
 * constructors.
 *
 * @param {Object} components
 */

function guardComponents (components) {
  if (components) {
    var def
    for (var key in components) {
      def = components[key]
      if (_.isPlainObject(def)) {
        def.name = key
        components[key] = _.Vue.extend(def)
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * @param {Object} parent
 * @param {Object} child
 * @param {Vue} [vm] - if vm is present, indicates this is
 *                     an instantiation merge.
 */

module.exports = function mergeOptions (parent, child, vm) {
  guardComponents(child.components)
  var options = {}
  var key
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  for (key in parent) {
    merge(key)
  }
  for (key in child) {
    if (!(parent.hasOwnProperty(key))) {
      merge(key)
    }
  }
  function merge (key) {
    var strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
},{"./index":67}],70:[function(require,module,exports){
var _ = require('./util')
var extend = _.extend

/**
 * The exposed Vue constructor.
 *
 * API conventions:
 * - public API methods/properties are prefiexed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue (options) {
  this._init(options)
}

/**
 * Mixin global API
 */

extend(Vue, require('./api/global'))

/**
 * Vue and every constructor that extends Vue has an
 * associated options object, which can be accessed during
 * compilation steps as `this.constructor.options`.
 *
 * These can be seen as the default options of every
 * Vue instance.
 */

Vue.options = {
  directives  : require('./directives'),
  filters     : require('./filters'),
  partials    : {},
  transitions : {},
  components  : {}
}

/**
 * Build up the prototype
 */

var p = Vue.prototype

/**
 * $data has a setter which does a bunch of
 * teardown/setup work
 */

Object.defineProperty(p, '$data', {
  get: function () {
    return this._data
  },
  set: function (newData) {
    this._setData(newData)
  }
})

/**
 * Mixin internal instance methods
 */

extend(p, require('./instance/init'))
extend(p, require('./instance/events'))
extend(p, require('./instance/scope'))
extend(p, require('./instance/compile'))

/**
 * Mixin public API methods
 */

extend(p, require('./api/data'))
extend(p, require('./api/dom'))
extend(p, require('./api/events'))
extend(p, require('./api/child'))
extend(p, require('./api/lifecycle'))

module.exports = _.Vue = Vue
},{"./api/child":10,"./api/data":11,"./api/dom":12,"./api/events":13,"./api/global":14,"./api/lifecycle":15,"./directives":30,"./filters":46,"./instance/compile":47,"./instance/events":48,"./instance/init":49,"./instance/scope":50,"./util":67}],71:[function(require,module,exports){
var _ = require('./util')
var config = require('./config')
var Observer = require('./observer')
var expParser = require('./parsers/expression')
var batcher = require('./batcher')
var uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm
 * @param {String} expression
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep
 *                 - {Boolean} user
 * @constructor
 */

function Watcher (vm, expression, cb, options) {
  this.vm = vm
  vm._watcherList.push(this)
  this.expression = expression
  this.cbs = [cb]
  this.id = ++uid // uid for batching
  this.active = true
  options = options || {}
  this.deep = !!options.deep
  this.user = !!options.user
  this.deps = Object.create(null)
  // setup filters if any.
  // We delegate directive filters here to the watcher
  // because they need to be included in the dependency
  // collection process.
  if (options.filters) {
    this.readFilters = options.filters.read
    this.writeFilters = options.filters.write
  }
  // parse expression for getter/setter
  var res = expParser.parse(expression, options.twoWay)
  this.getter = res.get
  this.setter = res.set
  this.value = this.get()
}

var p = Watcher.prototype

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

p.addDep = function (dep) {
  var id = dep.id
  if (!this.newDeps[id]) {
    this.newDeps[id] = dep
    if (!this.deps[id]) {
      this.deps[id] = dep
      dep.addSub(this)
    }
  }
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

p.get = function () {
  this.beforeGet()
  var vm = this.vm
  var value
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (config.warnExpressionErrors) {
      _.warn(
        'Error when evaluating expression "' +
        this.expression + '":\n   ' + e
      )
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value)
  }
  value = _.applyFilters(value, this.readFilters, vm)
  this.afterGet()
  return value
}

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

p.set = function (value) {
  var vm = this.vm
  value = _.applyFilters(
    value, this.writeFilters, vm, this.value
  )
  try {
    this.setter.call(vm, vm, value)
  } catch (e) {
    if (config.warnExpressionErrors) {
      _.warn(
        'Error when evaluating setter "' +
        this.expression + '":\n   ' + e
      )
    }
  }
}

/**
 * Prepare for dependency collection.
 */

p.beforeGet = function () {
  Observer.target = this
  this.newDeps = {}
}

/**
 * Clean up for dependency collection.
 */

p.afterGet = function () {
  Observer.target = null
  for (var id in this.deps) {
    if (!this.newDeps[id]) {
      this.deps[id].removeSub(this)
    }
  }
  this.deps = this.newDeps
}

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */

p.update = function () {
  if (!config.async || config.debug) {
    this.run()
  } else {
    batcher.push(this)
  }
}

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

p.run = function () {
  if (this.active) {
    var value = this.get()
    if (
      value !== this.value ||
      Array.isArray(value) ||
      this.deep
    ) {
      var oldValue = this.value
      this.value = value
      var cbs = this.cbs
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i](value, oldValue)
        // if a callback also removed other callbacks,
        // we need to adjust the loop accordingly.
        var removed = l - cbs.length
        if (removed) {
          i -= removed
          l -= removed
        }
      }
    }
  }
}

/**
 * Add a callback.
 *
 * @param {Function} cb
 */

p.addCb = function (cb) {
  this.cbs.push(cb)
}

/**
 * Remove a callback.
 *
 * @param {Function} cb
 */

p.removeCb = function (cb) {
  var cbs = this.cbs
  if (cbs.length > 1) {
    var i = cbs.indexOf(cb)
    if (i > -1) {
      cbs.splice(i, 1)
    }
  } else if (cb === cbs[0]) {
    this.teardown()
  }
}

/**
 * Remove self from all dependencies' subcriber list.
 */

p.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // we can skip this if the vm if being destroyed
    // which can improve teardown performance.
    if (!this.vm._isBeingDestroyed) {
      var list = this.vm._watcherList
      var i = list.indexOf(this)
      if (i > -1) {
        list.splice(i, 1)
      }
    }
    for (var id in this.deps) {
      this.deps[id].removeSub(this)
    }
    this.active = false
    this.vm = this.cbs = this.value = null
  }
}


/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {Object} obj
 */

function traverse (obj) {
  var key, val, i
  for (key in obj) {
    val = obj[key]
    if (_.isArray(val)) {
      i = val.length
      while (i--) traverse(val[i])
    } else if (_.isObject(val)) {
      traverse(val)
    }
  }
}

module.exports = Watcher
},{"./batcher":16,"./config":20,"./observer":53,"./parsers/expression":56,"./util":67}],72:[function(require,module,exports){
var Vue = require('vue')

var app = new Vue(require('./app'))

app.$mount(document.body)

},{"./app":2,"vue":70}]},{},[72])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkYXNoYm9hcmQvYXBwLmh0bWwiLCJkYXNoYm9hcmQvYXBwLmpzIiwiZGFzaGJvYXJkL2ZpcmViYXNlLmpzIiwiZGFzaGJvYXJkL3ZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCIsImRhc2hib2FyZC92aWV3cy9kYXNoYm9hcmQvZmlyZWJhc2UtZXZlbnRzLmpzIiwiZGFzaGJvYXJkL3ZpZXdzL2Rhc2hib2FyZC9pbmRleC5qcyIsImRhc2hib2FyZC92aWV3cy9sb2dpbi9pbmRleC5qcyIsImRhc2hib2FyZC92aWV3cy9sb2dpbi9sb2dpbi5odG1sIiwibm9kZV9tb2R1bGVzL2ZpcmViYXNlL2xpYi9maXJlYmFzZS13ZWIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvY2hpbGQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZGF0YS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9kb20uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9saWZlY3ljbGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9iYXRjaGVyLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY2FjaGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb21waWxlci9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvdHJhbnNjbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvYXR0ci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY2xhc3MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2Nsb2FrLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2VsLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2h0bWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2lmLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvY2hlY2tib3guanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2RlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9yYWRpby5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvc2VsZWN0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9vbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVmLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3Nob3cuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3N0eWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy90ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy90cmFuc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy93aXRoLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy9hcnJheS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL2NvbXBpbGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9pbml0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2Uvc2NvcGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2RlcC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL2V4cHJlc3Npb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3BhdGguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3RlbXBsYXRlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy90ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9jc3MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9qcy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZGVidWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZW52LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9sYW5nLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9tZXJnZS1vcHRpb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy92dWUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy93YXRjaGVyLmpzIiwiZGFzaGJvYXJkL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgdi1jb21wb25lbnQ9XCJ7eyB2aWV3IH19XCI+PC9kaXY+XFxuJzsiLCJ2YXIgZmlyZWJhc2UgPSByZXF1aXJlKCcuL2ZpcmViYXNlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2FwcC5odG1sJyksXG5cdGNvbXBvbmVudHM6IHtcblx0XHRsb2dpbjogcmVxdWlyZSgnLi92aWV3cy9sb2dpbicpLFxuXHRcdGRhc2hib2FyZDogcmVxdWlyZSgnLi92aWV3cy9kYXNoYm9hcmQnKVxuXHR9LFxuXHRkYXRhOiB7XG5cdFx0dmlldzogbnVsbFxuXHR9LFxuXHRjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZmlyZWJhc2Uub25BdXRoKGZ1bmN0aW9uIChhdXRoRGF0YSkge1xuXHRcdFx0dGhpcy52aWV3ID0gYXV0aERhdGEgPyAnZGFzaGJvYXJkJyA6ICdsb2dpbidcblx0XHR9LCB0aGlzKVxuXHR9XG59XG4iLCJ2YXIgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEZpcmViYXNlKCdodHRwczovL3dlYmhvb2tzLmZpcmViYXNlaW8uY29tJylcbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG5cdDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+XFxuXHRcdFx0PGgzIGNsYXNzPVwicGFuZWwtdGl0bGVcIj5BZGQgYSB3ZWJob29rPC9oMz5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XFxuXHRcdFx0PGZvcm0gdi1vbj1cInN1Ym1pdDogYWRkKCRldmVudClcIiBjbGFzcz1cImZvcm0taW5saW5lXCI+XFxuXHRcdFx0XHQ8Y29kZT5uZXcgRmlyZWJhc2UoXCI8L2NvZGU+XFxuXHRcdFx0XHQ8aW5wdXQgdi1tb2RlbD1cInJlZlwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cImh0dHBzOi8vZXhhbXBsZS5maXJlYmFzZWlvLmNvbS9cIiByZXF1aXJlZD5cXG5cdFx0XHRcdDxjb2RlPlwiKS5hdXRoKFwiPC9jb2RlPlxcblx0XHRcdFx0PGlucHV0IHYtbW9kZWw9XCJ0b2tlblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cInRva2VuIG9yIHNlY3JldFwiPlxcblx0XHRcdFx0PGNvZGU+XCIpLm9uKFwiPC9jb2RlPlxcblx0XHRcdFx0PHNlbGVjdCB2LW1vZGVsPVwiZXZlbnRcIiBvcHRpb25zPVwiZXZlbnRzXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiByZXF1aXJlZD48L3NlbGVjdD5cXG5cdFx0XHRcdDxjb2RlPlwiKTwvY29kZT5cXG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXJpZ2h0XCI+PC9zcGFuPlxcblx0XHRcdFx0PGlucHV0IHYtbW9kZWw9XCJ1cmxcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgcGxhY2Vob2xkZXI9XCJodHRwczovL2V4YW1wbGUuY29tL2hvb2tzL2ZpcmViYXNlXCIgcmVxdWlyZWQ+XFxuXHRcdFx0XHQ8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXByaW1hcnlcIj5TYXZlPC9idXR0b24+XFxuXHRcdFx0PC9mb3JtPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2Plxcblxcblx0PGRpdiB2LXJlcGVhdD1cImhvb2s6IGhvb2tzXCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XFxuXHRcdFx0PGNvZGU+bmV3IEZpcmViYXNlKFwie3sgaG9vay5yZWYgfX1cIikub24oXCJ7eyBob29rLmV2ZW50IH19XCIpPC9jb2RlPlxcblx0XHRcdDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1jaGV2cm9uLXJpZ2h0XCI+PC9zcGFuPlxcblx0XHRcdDxjb2RlPnt7IGhvb2sudXJsIH19PC9jb2RlPlxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSBbXG5cdCd2YWx1ZScsXG5cdCdjaGlsZF9hZGRlZCcsXG5cdCdjaGlsZF9jaGFuZ2VkJyxcblx0J2NoaWxkX3JlbW92ZWQnLFxuXHQnY2hpbGRfbW92ZWQnXG5dXG4iLCJ2YXIgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpXG52YXIgZmlyZWJhc2UgPSByZXF1aXJlKCcuLi8uLi9maXJlYmFzZScpXG5cbnZhciBldmVudHMgPSByZXF1aXJlKCcuL2ZpcmViYXNlLWV2ZW50cycpXG5cbmZ1bmN0aW9uIGhvb2tzUmVmICgpIHtcblx0dmFyIGF1dGggPSBmaXJlYmFzZS5nZXRBdXRoKClcblx0cmV0dXJuIGZpcmViYXNlLmNoaWxkKCdob29rcycpLmNoaWxkKGF1dGgudWlkKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZGFzaGJvYXJkLmh0bWwnKSxcblx0ZGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRob29rczogbnVsbCxcblx0XHRcdGV2ZW50czogZXZlbnRzLFxuXHRcdFx0Ly8gaW5pdCBmb3JtIGZpZWxkc1xuXHRcdFx0cmVmOiBudWxsLFxuXHRcdFx0dG9rZW46IG51bGwsXG5cdFx0XHRldmVudDogZXZlbnRzWzBdLFxuXHRcdFx0dXJsOiBudWxsXG5cdFx0fVxuXHR9LFxuXHRtZXRob2RzOiB7XG5cdFx0YWRkOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdC8vIFRPRE86IHRlc3QgaW5wdXQgb24gbGl2ZSBgbmV3IEZpcmViYXNlKClgIGNhbGwgdG8gdmFsaWRhdGVcblxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHRob29rc1JlZigpLnB1c2goe1xuXHRcdFx0XHRyZWY6IHRoaXMucmVmLFxuXHRcdFx0XHR0b2tlbjogdGhpcy50b2tlbiAmJiB0aGlzLnRva2VuICE9PSAnJyA/IHRoaXMudG9rZW4gOiBudWxsLFxuXHRcdFx0XHRldmVudDogdGhpcy5ldmVudCxcblx0XHRcdFx0dXJsOiB0aGlzLnVybCxcblx0XHRcdFx0Y3JlYXRlZF9hdDogRmlyZWJhc2UuU2VydmVyVmFsdWUuVElNRVNUQU1QXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBhZGQgaG9vazonLCBlcnIpXG5cdFx0XHR9KVxuXG5cdFx0XHR0aGlzLnJlZiA9IG51bGxcblx0XHRcdHRoaXMudG9rZW4gPSBudWxsXG5cdFx0XHR0aGlzLnVybCA9IG51bGxcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgYXV0aCA9IGZpcmViYXNlLmdldEF1dGgoKVxuXG5cdFx0aG9va3NSZWYoKS5vbigndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcblx0XHRcdHRoaXMuaG9va3MgPSBzbmFwc2hvdC52YWwoKVxuXHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBnZXQgaG9va3M6JywgZXJyKVxuXHRcdH0sIHRoaXMpXG5cdH1cbn1cbiIsInZhciBmaXJlYmFzZSA9IHJlcXVpcmUoJy4uLy4uL2ZpcmViYXNlJylcblxuLy8gVE9ETzogc3RvcmUgbG9naW5zXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9sb2dpbi5odG1sJyksXG5cdG1ldGhvZHM6IHtcblx0XHRsb2dpbjogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdGZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cCgnZ2l0aHViJywgZnVuY3Rpb24gKGVyciwgYXV0aERhdGEpIHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdMb2dpbiBmYWlsZWQ6JywgZXJyKVxuXHRcdFx0XHRcdGFsZXJ0KCdMb2dpbiBmYWlsZWQuXFxuXFxuJyArIGVyci5tZXNzYWdlKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxcblx0PGRpdiBjbGFzcz1cInJvd1wiPlxcblx0XHQ8ZGl2IGNsYXNzPVwiY29sLW1kLTYgY29sLW1kLW9mZnNldC0zXCI+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImp1bWJvdHJvbiB0ZXh0LWNlbnRlclwiPlxcblx0XHRcdFx0PGgxPldlYmhvb2tzIGZvciBGaXJlYmFzZTwvaDE+XFxuXHRcdFx0XHQ8YnI+XFxuXHRcdFx0XHQ8cD5cXG5cdFx0XHRcdFx0PGJ1dHRvbiB2LW9uPVwiY2xpY2s6IGxvZ2luKCRldmVudClcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxnIGJ0bi1wcmltYXJ5XCI+XFxuXHRcdFx0XHRcdFx0TG9nIGluIHdpdGggR2l0SHViXFxuXHRcdFx0XHRcdDwvYnV0dG9uPlxcblx0XHRcdFx0PC9wPlxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwiLyohIEBsaWNlbnNlIEZpcmViYXNlIHYyLjIuNVxuICAgIExpY2Vuc2U6IGh0dHBzOi8vd3d3LmZpcmViYXNlLmNvbS90ZXJtcy90ZXJtcy1vZi1zZXJ2aWNlLmh0bWwgKi9cbihmdW5jdGlvbigpIHt2YXIgaCxhYT10aGlzO2Z1bmN0aW9uIG4oYSl7cmV0dXJuIHZvaWQgMCE9PWF9ZnVuY3Rpb24gYmEoKXt9ZnVuY3Rpb24gY2EoYSl7YS51Yj1mdW5jdGlvbigpe3JldHVybiBhLnRmP2EudGY6YS50Zj1uZXcgYX19XG5mdW5jdGlvbiBkYShhKXt2YXIgYj10eXBlb2YgYTtpZihcIm9iamVjdFwiPT1iKWlmKGEpe2lmKGEgaW5zdGFuY2VvZiBBcnJheSlyZXR1cm5cImFycmF5XCI7aWYoYSBpbnN0YW5jZW9mIE9iamVjdClyZXR1cm4gYjt2YXIgYz1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSk7aWYoXCJbb2JqZWN0IFdpbmRvd11cIj09YylyZXR1cm5cIm9iamVjdFwiO2lmKFwiW29iamVjdCBBcnJheV1cIj09Y3x8XCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RoJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5zcGxpY2UmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnByb3BlcnR5SXNFbnVtZXJhYmxlJiYhYS5wcm9wZXJ0eUlzRW51bWVyYWJsZShcInNwbGljZVwiKSlyZXR1cm5cImFycmF5XCI7aWYoXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1jfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5jYWxsJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5wcm9wZXJ0eUlzRW51bWVyYWJsZSYmIWEucHJvcGVydHlJc0VudW1lcmFibGUoXCJjYWxsXCIpKXJldHVyblwiZnVuY3Rpb25cIn1lbHNlIHJldHVyblwibnVsbFwiO1xuZWxzZSBpZihcImZ1bmN0aW9uXCI9PWImJlwidW5kZWZpbmVkXCI9PXR5cGVvZiBhLmNhbGwpcmV0dXJuXCJvYmplY3RcIjtyZXR1cm4gYn1mdW5jdGlvbiBlYShhKXtyZXR1cm5cImFycmF5XCI9PWRhKGEpfWZ1bmN0aW9uIGZhKGEpe3ZhciBiPWRhKGEpO3JldHVyblwiYXJyYXlcIj09Ynx8XCJvYmplY3RcIj09YiYmXCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RofWZ1bmN0aW9uIHAoYSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGF9ZnVuY3Rpb24gZ2EoYSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGF9ZnVuY3Rpb24gaGEoYSl7cmV0dXJuXCJmdW5jdGlvblwiPT1kYShhKX1mdW5jdGlvbiBpYShhKXt2YXIgYj10eXBlb2YgYTtyZXR1cm5cIm9iamVjdFwiPT1iJiZudWxsIT1hfHxcImZ1bmN0aW9uXCI9PWJ9ZnVuY3Rpb24gamEoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9XG5mdW5jdGlvbiBrYShhLGIsYyl7aWYoIWEpdGhyb3cgRXJyb3IoKTtpZigyPGFyZ3VtZW50cy5sZW5ndGgpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO0FycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGMsZCk7cmV0dXJuIGEuYXBwbHkoYixjKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBxKGEsYixjKXtxPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJiYtMSE9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQudG9TdHJpbmcoKS5pbmRleE9mKFwibmF0aXZlIGNvZGVcIik/amE6a2E7cmV0dXJuIHEuYXBwbHkobnVsbCxhcmd1bWVudHMpfXZhciBsYT1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9O1xuZnVuY3Rpb24gbWEoYSxiKXtmdW5jdGlvbiBjKCl7fWMucHJvdG90eXBlPWIucHJvdG90eXBlO2EuWmc9Yi5wcm90b3R5cGU7YS5wcm90b3R5cGU9bmV3IGM7YS5wcm90b3R5cGUuY29uc3RydWN0b3I9YTthLlZnPWZ1bmN0aW9uKGEsYyxmKXtmb3IodmFyIGc9QXJyYXkoYXJndW1lbnRzLmxlbmd0aC0yKSxrPTI7azxhcmd1bWVudHMubGVuZ3RoO2srKylnW2stMl09YXJndW1lbnRzW2tdO3JldHVybiBiLnByb3RvdHlwZVtjXS5hcHBseShhLGcpfX07ZnVuY3Rpb24gcihhLGIpe2Zvcih2YXIgYyBpbiBhKWIuY2FsbCh2b2lkIDAsYVtjXSxjLGEpfWZ1bmN0aW9uIG5hKGEsYil7dmFyIGM9e30sZDtmb3IoZCBpbiBhKWNbZF09Yi5jYWxsKHZvaWQgMCxhW2RdLGQsYSk7cmV0dXJuIGN9ZnVuY3Rpb24gb2EoYSxiKXtmb3IodmFyIGMgaW4gYSlpZighYi5jYWxsKHZvaWQgMCxhW2NdLGMsYSkpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gcGEoYSl7dmFyIGI9MCxjO2ZvcihjIGluIGEpYisrO3JldHVybiBifWZ1bmN0aW9uIHFhKGEpe2Zvcih2YXIgYiBpbiBhKXJldHVybiBifWZ1bmN0aW9uIHJhKGEpe3ZhciBiPVtdLGM9MCxkO2ZvcihkIGluIGEpYltjKytdPWFbZF07cmV0dXJuIGJ9ZnVuY3Rpb24gc2EoYSl7dmFyIGI9W10sYz0wLGQ7Zm9yKGQgaW4gYSliW2MrK109ZDtyZXR1cm4gYn1mdW5jdGlvbiB0YShhLGIpe2Zvcih2YXIgYyBpbiBhKWlmKGFbY109PWIpcmV0dXJuITA7cmV0dXJuITF9XG5mdW5jdGlvbiB1YShhLGIsYyl7Zm9yKHZhciBkIGluIGEpaWYoYi5jYWxsKGMsYVtkXSxkLGEpKXJldHVybiBkfWZ1bmN0aW9uIHZhKGEsYil7dmFyIGM9dWEoYSxiLHZvaWQgMCk7cmV0dXJuIGMmJmFbY119ZnVuY3Rpb24gd2EoYSl7Zm9yKHZhciBiIGluIGEpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24geGEoYSl7dmFyIGI9e30sYztmb3IoYyBpbiBhKWJbY109YVtjXTtyZXR1cm4gYn12YXIgeWE9XCJjb25zdHJ1Y3RvciBoYXNPd25Qcm9wZXJ0eSBpc1Byb3RvdHlwZU9mIHByb3BlcnR5SXNFbnVtZXJhYmxlIHRvTG9jYWxlU3RyaW5nIHRvU3RyaW5nIHZhbHVlT2ZcIi5zcGxpdChcIiBcIik7XG5mdW5jdGlvbiB6YShhLGIpe2Zvcih2YXIgYyxkLGU9MTtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKXtkPWFyZ3VtZW50c1tlXTtmb3IoYyBpbiBkKWFbY109ZFtjXTtmb3IodmFyIGY9MDtmPHlhLmxlbmd0aDtmKyspYz15YVtmXSxPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZCxjKSYmKGFbY109ZFtjXSl9fTtmdW5jdGlvbiBBYShhKXthPVN0cmluZyhhKTtpZigvXlxccyokLy50ZXN0KGEpPzA6L15bXFxdLDp7fVxcc1xcdTIwMjhcXHUyMDI5XSokLy50ZXN0KGEucmVwbGFjZSgvXFxcXFtcIlxcXFxcXC9iZm5ydHVdL2csXCJAXCIpLnJlcGxhY2UoL1wiW15cIlxcXFxcXG5cXHJcXHUyMDI4XFx1MjAyOVxceDAwLVxceDA4XFx4MGEtXFx4MWZdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLFwiXVwiKS5yZXBsYWNlKC8oPzpefDp8LCkoPzpbXFxzXFx1MjAyOFxcdTIwMjldKlxcWykrL2csXCJcIikpKXRyeXtyZXR1cm4gZXZhbChcIihcIithK1wiKVwiKX1jYXRjaChiKXt9dGhyb3cgRXJyb3IoXCJJbnZhbGlkIEpTT04gc3RyaW5nOiBcIithKTt9ZnVuY3Rpb24gQmEoKXt0aGlzLlBkPXZvaWQgMH1cbmZ1bmN0aW9uIENhKGEsYixjKXtzd2l0Y2godHlwZW9mIGIpe2Nhc2UgXCJzdHJpbmdcIjpEYShiLGMpO2JyZWFrO2Nhc2UgXCJudW1iZXJcIjpjLnB1c2goaXNGaW5pdGUoYikmJiFpc05hTihiKT9iOlwibnVsbFwiKTticmVhaztjYXNlIFwiYm9vbGVhblwiOmMucHVzaChiKTticmVhaztjYXNlIFwidW5kZWZpbmVkXCI6Yy5wdXNoKFwibnVsbFwiKTticmVhaztjYXNlIFwib2JqZWN0XCI6aWYobnVsbD09Yil7Yy5wdXNoKFwibnVsbFwiKTticmVha31pZihlYShiKSl7dmFyIGQ9Yi5sZW5ndGg7Yy5wdXNoKFwiW1wiKTtmb3IodmFyIGU9XCJcIixmPTA7ZjxkO2YrKyljLnB1c2goZSksZT1iW2ZdLENhKGEsYS5QZD9hLlBkLmNhbGwoYixTdHJpbmcoZiksZSk6ZSxjKSxlPVwiLFwiO2MucHVzaChcIl1cIik7YnJlYWt9Yy5wdXNoKFwie1wiKTtkPVwiXCI7Zm9yKGYgaW4gYilPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYixmKSYmKGU9YltmXSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiYoYy5wdXNoKGQpLERhKGYsYyksXG5jLnB1c2goXCI6XCIpLENhKGEsYS5QZD9hLlBkLmNhbGwoYixmLGUpOmUsYyksZD1cIixcIikpO2MucHVzaChcIn1cIik7YnJlYWs7Y2FzZSBcImZ1bmN0aW9uXCI6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVua25vd24gdHlwZTogXCIrdHlwZW9mIGIpO319dmFyIEVhPXsnXCInOidcXFxcXCInLFwiXFxcXFwiOlwiXFxcXFxcXFxcIixcIi9cIjpcIlxcXFwvXCIsXCJcXGJcIjpcIlxcXFxiXCIsXCJcXGZcIjpcIlxcXFxmXCIsXCJcXG5cIjpcIlxcXFxuXCIsXCJcXHJcIjpcIlxcXFxyXCIsXCJcXHRcIjpcIlxcXFx0XCIsXCJcXHgwQlwiOlwiXFxcXHUwMDBiXCJ9LEZhPS9cXHVmZmZmLy50ZXN0KFwiXFx1ZmZmZlwiKT8vW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHVmZmZmXS9nOi9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceGZmXS9nO1xuZnVuY3Rpb24gRGEoYSxiKXtiLnB1c2goJ1wiJyxhLnJlcGxhY2UoRmEsZnVuY3Rpb24oYSl7aWYoYSBpbiBFYSlyZXR1cm4gRWFbYV07dmFyIGI9YS5jaGFyQ29kZUF0KDApLGU9XCJcXFxcdVwiOzE2PmI/ZSs9XCIwMDBcIjoyNTY+Yj9lKz1cIjAwXCI6NDA5Nj5iJiYoZSs9XCIwXCIpO3JldHVybiBFYVthXT1lK2IudG9TdHJpbmcoMTYpfSksJ1wiJyl9O2Z1bmN0aW9uIEdhKCl7cmV0dXJuIE1hdGguZmxvb3IoMjE0NzQ4MzY0OCpNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNikrTWF0aC5hYnMoTWF0aC5mbG9vcigyMTQ3NDgzNjQ4Kk1hdGgucmFuZG9tKCkpXmxhKCkpLnRvU3RyaW5nKDM2KX07dmFyIEhhO2E6e3ZhciBJYT1hYS5uYXZpZ2F0b3I7aWYoSWEpe3ZhciBKYT1JYS51c2VyQWdlbnQ7aWYoSmEpe0hhPUphO2JyZWFrIGF9fUhhPVwiXCJ9O2Z1bmN0aW9uIEthKCl7dGhpcy5XYT0tMX07ZnVuY3Rpb24gTGEoKXt0aGlzLldhPS0xO3RoaXMuV2E9NjQ7dGhpcy5SPVtdO3RoaXMubGU9W107dGhpcy5UZj1bXTt0aGlzLklkPVtdO3RoaXMuSWRbMF09MTI4O2Zvcih2YXIgYT0xO2E8dGhpcy5XYTsrK2EpdGhpcy5JZFthXT0wO3RoaXMuYmU9dGhpcy4kYj0wO3RoaXMucmVzZXQoKX1tYShMYSxLYSk7TGEucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5SWzBdPTE3MzI1ODQxOTM7dGhpcy5SWzFdPTQwMjMyMzM0MTc7dGhpcy5SWzJdPTI1NjIzODMxMDI7dGhpcy5SWzNdPTI3MTczMzg3ODt0aGlzLlJbNF09MzI4NTM3NzUyMDt0aGlzLmJlPXRoaXMuJGI9MH07XG5mdW5jdGlvbiBNYShhLGIsYyl7Y3x8KGM9MCk7dmFyIGQ9YS5UZjtpZihwKGIpKWZvcih2YXIgZT0wOzE2PmU7ZSsrKWRbZV09Yi5jaGFyQ29kZUF0KGMpPDwyNHxiLmNoYXJDb2RlQXQoYysxKTw8MTZ8Yi5jaGFyQ29kZUF0KGMrMik8PDh8Yi5jaGFyQ29kZUF0KGMrMyksYys9NDtlbHNlIGZvcihlPTA7MTY+ZTtlKyspZFtlXT1iW2NdPDwyNHxiW2MrMV08PDE2fGJbYysyXTw8OHxiW2MrM10sYys9NDtmb3IoZT0xNjs4MD5lO2UrKyl7dmFyIGY9ZFtlLTNdXmRbZS04XV5kW2UtMTRdXmRbZS0xNl07ZFtlXT0oZjw8MXxmPj4+MzEpJjQyOTQ5NjcyOTV9Yj1hLlJbMF07Yz1hLlJbMV07Zm9yKHZhciBnPWEuUlsyXSxrPWEuUlszXSxsPWEuUls0XSxtLGU9MDs4MD5lO2UrKyk0MD5lPzIwPmU/KGY9a15jJihnXmspLG09MTUxODUwMDI0OSk6KGY9Y15nXmssbT0xODU5Nzc1MzkzKTo2MD5lPyhmPWMmZ3xrJihjfGcpLG09MjQwMDk1OTcwOCk6KGY9Y15nXmssbT0zMzk1NDY5NzgyKSxmPShiPDxcbjV8Yj4+PjI3KStmK2wrbStkW2VdJjQyOTQ5NjcyOTUsbD1rLGs9ZyxnPShjPDwzMHxjPj4+MikmNDI5NDk2NzI5NSxjPWIsYj1mO2EuUlswXT1hLlJbMF0rYiY0Mjk0OTY3Mjk1O2EuUlsxXT1hLlJbMV0rYyY0Mjk0OTY3Mjk1O2EuUlsyXT1hLlJbMl0rZyY0Mjk0OTY3Mjk1O2EuUlszXT1hLlJbM10rayY0Mjk0OTY3Mjk1O2EuUls0XT1hLlJbNF0rbCY0Mjk0OTY3Mjk1fVxuTGEucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe2lmKG51bGwhPWEpe24oYil8fChiPWEubGVuZ3RoKTtmb3IodmFyIGM9Yi10aGlzLldhLGQ9MCxlPXRoaXMubGUsZj10aGlzLiRiO2Q8Yjspe2lmKDA9PWYpZm9yKDtkPD1jOylNYSh0aGlzLGEsZCksZCs9dGhpcy5XYTtpZihwKGEpKWZvcig7ZDxiOyl7aWYoZVtmXT1hLmNoYXJDb2RlQXQoZCksKytmLCsrZCxmPT10aGlzLldhKXtNYSh0aGlzLGUpO2Y9MDticmVha319ZWxzZSBmb3IoO2Q8YjspaWYoZVtmXT1hW2RdLCsrZiwrK2QsZj09dGhpcy5XYSl7TWEodGhpcyxlKTtmPTA7YnJlYWt9fXRoaXMuJGI9Zjt0aGlzLmJlKz1ifX07dmFyIHQ9QXJyYXkucHJvdG90eXBlLE5hPXQuaW5kZXhPZj9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQuaW5kZXhPZi5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2M9bnVsbD09Yz8wOjA+Yz9NYXRoLm1heCgwLGEubGVuZ3RoK2MpOmM7aWYocChhKSlyZXR1cm4gcChiKSYmMT09Yi5sZW5ndGg/YS5pbmRleE9mKGIsYyk6LTE7Zm9yKDtjPGEubGVuZ3RoO2MrKylpZihjIGluIGEmJmFbY109PT1iKXJldHVybiBjO3JldHVybi0xfSxPYT10LmZvckVhY2g/ZnVuY3Rpb24oYSxiLGMpe3QuZm9yRWFjaC5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWYgaW4gZSYmYi5jYWxsKGMsZVtmXSxmLGEpfSxQYT10LmZpbHRlcj9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQuZmlsdGVyLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9W10sZj0wLGc9cChhKT9cbmEuc3BsaXQoXCJcIik6YSxrPTA7azxkO2srKylpZihrIGluIGcpe3ZhciBsPWdba107Yi5jYWxsKGMsbCxrLGEpJiYoZVtmKytdPWwpfXJldHVybiBlfSxRYT10Lm1hcD9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQubWFwLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9QXJyYXkoZCksZj1wKGEpP2Euc3BsaXQoXCJcIik6YSxnPTA7ZzxkO2crKylnIGluIGYmJihlW2ddPWIuY2FsbChjLGZbZ10sZyxhKSk7cmV0dXJuIGV9LFJhPXQucmVkdWNlP2Z1bmN0aW9uKGEsYixjLGQpe2Zvcih2YXIgZT1bXSxmPTEsZz1hcmd1bWVudHMubGVuZ3RoO2Y8ZztmKyspZS5wdXNoKGFyZ3VtZW50c1tmXSk7ZCYmKGVbMF09cShiLGQpKTtyZXR1cm4gdC5yZWR1Y2UuYXBwbHkoYSxlKX06ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YztPYShhLGZ1bmN0aW9uKGMsZyl7ZT1iLmNhbGwoZCxlLGMsZyxhKX0pO3JldHVybiBlfSxTYT10LmV2ZXJ5P2Z1bmN0aW9uKGEsYixcbmMpe3JldHVybiB0LmV2ZXJ5LmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspaWYoZiBpbiBlJiYhYi5jYWxsKGMsZVtmXSxmLGEpKXJldHVybiExO3JldHVybiEwfTtmdW5jdGlvbiBUYShhLGIpe3ZhciBjPVVhKGEsYix2b2lkIDApO3JldHVybiAwPmM/bnVsbDpwKGEpP2EuY2hhckF0KGMpOmFbY119ZnVuY3Rpb24gVWEoYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWlmKGYgaW4gZSYmYi5jYWxsKGMsZVtmXSxmLGEpKXJldHVybiBmO3JldHVybi0xfWZ1bmN0aW9uIFZhKGEsYil7dmFyIGM9TmEoYSxiKTswPD1jJiZ0LnNwbGljZS5jYWxsKGEsYywxKX1mdW5jdGlvbiBXYShhLGIsYyl7cmV0dXJuIDI+PWFyZ3VtZW50cy5sZW5ndGg/dC5zbGljZS5jYWxsKGEsYik6dC5zbGljZS5jYWxsKGEsYixjKX1cbmZ1bmN0aW9uIFhhKGEsYil7YS5zb3J0KGJ8fFlhKX1mdW5jdGlvbiBZYShhLGIpe3JldHVybiBhPmI/MTphPGI/LTE6MH07dmFyIFphPS0xIT1IYS5pbmRleE9mKFwiT3BlcmFcIil8fC0xIT1IYS5pbmRleE9mKFwiT1BSXCIpLCRhPS0xIT1IYS5pbmRleE9mKFwiVHJpZGVudFwiKXx8LTEhPUhhLmluZGV4T2YoXCJNU0lFXCIpLGFiPS0xIT1IYS5pbmRleE9mKFwiR2Vja29cIikmJi0xPT1IYS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ3ZWJraXRcIikmJiEoLTEhPUhhLmluZGV4T2YoXCJUcmlkZW50XCIpfHwtMSE9SGEuaW5kZXhPZihcIk1TSUVcIikpLGJiPS0xIT1IYS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ3ZWJraXRcIik7XG4oZnVuY3Rpb24oKXt2YXIgYT1cIlwiLGI7aWYoWmEmJmFhLm9wZXJhKXJldHVybiBhPWFhLm9wZXJhLnZlcnNpb24saGEoYSk/YSgpOmE7YWI/Yj0vcnZcXDooW15cXCk7XSspKFxcKXw7KS86JGE/Yj0vXFxiKD86TVNJRXxydilbOiBdKFteXFwpO10rKShcXCl8OykvOmJiJiYoYj0vV2ViS2l0XFwvKFxcUyspLyk7YiYmKGE9KGE9Yi5leGVjKEhhKSk/YVsxXTpcIlwiKTtyZXR1cm4gJGEmJihiPShiPWFhLmRvY3VtZW50KT9iLmRvY3VtZW50TW9kZTp2b2lkIDAsYj5wYXJzZUZsb2F0KGEpKT9TdHJpbmcoYik6YX0pKCk7dmFyIGNiPW51bGwsZGI9bnVsbCxlYj1udWxsO2Z1bmN0aW9uIGZiKGEsYil7aWYoIWZhKGEpKXRocm93IEVycm9yKFwiZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyXCIpO2diKCk7Zm9yKHZhciBjPWI/ZGI6Y2IsZD1bXSxlPTA7ZTxhLmxlbmd0aDtlKz0zKXt2YXIgZj1hW2VdLGc9ZSsxPGEubGVuZ3RoLGs9Zz9hW2UrMV06MCxsPWUrMjxhLmxlbmd0aCxtPWw/YVtlKzJdOjAsdj1mPj4yLGY9KGYmMyk8PDR8az4+NCxrPShrJjE1KTw8MnxtPj42LG09bSY2MztsfHwobT02NCxnfHwoaz02NCkpO2QucHVzaChjW3ZdLGNbZl0sY1trXSxjW21dKX1yZXR1cm4gZC5qb2luKFwiXCIpfVxuZnVuY3Rpb24gZ2IoKXtpZighY2Ipe2NiPXt9O2RiPXt9O2ViPXt9O2Zvcih2YXIgYT0wOzY1PmE7YSsrKWNiW2FdPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIi5jaGFyQXQoYSksZGJbYV09XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OS1fLlwiLmNoYXJBdChhKSxlYltkYlthXV09YSw2Mjw9YSYmKGViW1wiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIi5jaGFyQXQoYSldPWEpfX07ZnVuY3Rpb24gdShhLGIpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxiKX1mdW5jdGlvbiB3KGEsYil7aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYikpcmV0dXJuIGFbYl19ZnVuY3Rpb24gaGIoYSxiKXtmb3IodmFyIGMgaW4gYSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxjKSYmYihjLGFbY10pfWZ1bmN0aW9uIGliKGEpe3ZhciBiPXt9O2hiKGEsZnVuY3Rpb24oYSxkKXtiW2FdPWR9KTtyZXR1cm4gYn07ZnVuY3Rpb24gamIoYSl7dmFyIGI9W107aGIoYSxmdW5jdGlvbihhLGQpe2VhKGQpP09hKGQsZnVuY3Rpb24oZCl7Yi5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChhKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZCkpfSk6Yi5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChhKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZCkpfSk7cmV0dXJuIGIubGVuZ3RoP1wiJlwiK2Iuam9pbihcIiZcIik6XCJcIn1mdW5jdGlvbiBrYihhKXt2YXIgYj17fTthPWEucmVwbGFjZSgvXlxcPy8sXCJcIikuc3BsaXQoXCImXCIpO09hKGEsZnVuY3Rpb24oYSl7YSYmKGE9YS5zcGxpdChcIj1cIiksYlthWzBdXT1hWzFdKX0pO3JldHVybiBifTtmdW5jdGlvbiB4KGEsYixjLGQpe3ZhciBlO2Q8Yj9lPVwiYXQgbGVhc3QgXCIrYjpkPmMmJihlPTA9PT1jP1wibm9uZVwiOlwibm8gbW9yZSB0aGFuIFwiK2MpO2lmKGUpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IFdhcyBjYWxsZWQgd2l0aCBcIitkKygxPT09ZD9cIiBhcmd1bWVudC5cIjpcIiBhcmd1bWVudHMuXCIpK1wiIEV4cGVjdHMgXCIrZStcIi5cIik7fWZ1bmN0aW9uIHooYSxiLGMpe3ZhciBkPVwiXCI7c3dpdGNoKGIpe2Nhc2UgMTpkPWM/XCJmaXJzdFwiOlwiRmlyc3RcIjticmVhaztjYXNlIDI6ZD1jP1wic2Vjb25kXCI6XCJTZWNvbmRcIjticmVhaztjYXNlIDM6ZD1jP1widGhpcmRcIjpcIlRoaXJkXCI7YnJlYWs7Y2FzZSA0OmQ9Yz9cImZvdXJ0aFwiOlwiRm91cnRoXCI7YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihcImVycm9yUHJlZml4IGNhbGxlZCB3aXRoIGFyZ3VtZW50TnVtYmVyID4gNC4gIE5lZWQgdG8gdXBkYXRlIGl0P1wiKTt9cmV0dXJuIGE9YStcIiBmYWlsZWQ6IFwiKyhkK1wiIGFyZ3VtZW50IFwiKX1cbmZ1bmN0aW9uIEEoYSxiLGMsZCl7aWYoKCFkfHxuKGMpKSYmIWhhKGMpKXRocm93IEVycm9yKHooYSxiLGQpK1wibXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLlwiKTt9ZnVuY3Rpb24gbGIoYSxiLGMpe2lmKG4oYykmJighaWEoYyl8fG51bGw9PT1jKSl0aHJvdyBFcnJvcih6KGEsYiwhMCkrXCJtdXN0IGJlIGEgdmFsaWQgY29udGV4dCBvYmplY3QuXCIpO307ZnVuY3Rpb24gbWIoYSl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBKU09OJiZuKEpTT04ucGFyc2UpP0pTT04ucGFyc2UoYSk6QWEoYSl9ZnVuY3Rpb24gQihhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIEpTT04mJm4oSlNPTi5zdHJpbmdpZnkpKWE9SlNPTi5zdHJpbmdpZnkoYSk7ZWxzZXt2YXIgYj1bXTtDYShuZXcgQmEsYSxiKTthPWIuam9pbihcIlwiKX1yZXR1cm4gYX07ZnVuY3Rpb24gbmIoKXt0aGlzLlNkPUN9bmIucHJvdG90eXBlLmo9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuU2Qub2EoYSl9O25iLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLlNkLnRvU3RyaW5nKCl9O2Z1bmN0aW9uIG9iKCl7fW9iLnByb3RvdHlwZS5wZj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtvYi5wcm90b3R5cGUueGU9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07dmFyIHBiPW5ldyBvYjtmdW5jdGlvbiBxYihhLGIsYyl7dGhpcy5RZj1hO3RoaXMuS2E9Yjt0aGlzLkhkPWN9cWIucHJvdG90eXBlLnBmPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuS2EuRDtpZihyYihiLGEpKXJldHVybiBiLmooKS5NKGEpO2I9bnVsbCE9dGhpcy5IZD9uZXcgc2IodGhpcy5IZCwhMCwhMSk6dGhpcy5LYS51KCk7cmV0dXJuIHRoaXMuUWYuWGEoYSxiKX07cWIucHJvdG90eXBlLnhlPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1udWxsIT10aGlzLkhkP3RoaXMuSGQ6dGIodGhpcy5LYSk7YT10aGlzLlFmLm1lKGQsYiwxLGMsYSk7cmV0dXJuIDA9PT1hLmxlbmd0aD9udWxsOmFbMF19O2Z1bmN0aW9uIHViKCl7dGhpcy50Yj1bXX1mdW5jdGlvbiB2YihhLGIpe2Zvcih2YXIgYz1udWxsLGQ9MDtkPGIubGVuZ3RoO2QrKyl7dmFyIGU9YltkXSxmPWUuWWIoKTtudWxsPT09Y3x8Zi5aKGMuWWIoKSl8fChhLnRiLnB1c2goYyksYz1udWxsKTtudWxsPT09YyYmKGM9bmV3IHdiKGYpKTtjLmFkZChlKX1jJiZhLnRiLnB1c2goYyl9ZnVuY3Rpb24geGIoYSxiLGMpe3ZiKGEsYyk7eWIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYS5aKGIpfSl9ZnVuY3Rpb24gemIoYSxiLGMpe3ZiKGEsYyk7eWIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYS5jb250YWlucyhiKXx8Yi5jb250YWlucyhhKX0pfVxuZnVuY3Rpb24geWIoYSxiKXtmb3IodmFyIGM9ITAsZD0wO2Q8YS50Yi5sZW5ndGg7ZCsrKXt2YXIgZT1hLnRiW2RdO2lmKGUpaWYoZT1lLlliKCksYihlKSl7Zm9yKHZhciBlPWEudGJbZF0sZj0wO2Y8ZS5zZC5sZW5ndGg7ZisrKXt2YXIgZz1lLnNkW2ZdO2lmKG51bGwhPT1nKXtlLnNkW2ZdPW51bGw7dmFyIGs9Zy5VYigpO0FiJiZCYihcImV2ZW50OiBcIitnLnRvU3RyaW5nKCkpO0NiKGspfX1hLnRiW2RdPW51bGx9ZWxzZSBjPSExfWMmJihhLnRiPVtdKX1mdW5jdGlvbiB3YihhKXt0aGlzLnFhPWE7dGhpcy5zZD1bXX13Yi5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKGEpe3RoaXMuc2QucHVzaChhKX07d2IucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucWF9O2Z1bmN0aW9uIEQoYSxiLGMsZCl7dGhpcy50eXBlPWE7dGhpcy5KYT1iO3RoaXMuWWE9Yzt0aGlzLkplPWQ7dGhpcy5OZD12b2lkIDB9ZnVuY3Rpb24gRGIoYSl7cmV0dXJuIG5ldyBEKEViLGEpfXZhciBFYj1cInZhbHVlXCI7ZnVuY3Rpb24gRmIoYSxiLGMsZCl7dGhpcy50ZT1iO3RoaXMuV2Q9Yzt0aGlzLk5kPWQ7dGhpcy5yZD1hfUZiLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuV2QubGMoKTtyZXR1cm5cInZhbHVlXCI9PT10aGlzLnJkP2EucGF0aDphLnBhcmVudCgpLnBhdGh9O0ZiLnByb3RvdHlwZS55ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJkfTtGYi5wcm90b3R5cGUuVWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50ZS5VYih0aGlzKX07RmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWWIoKS50b1N0cmluZygpK1wiOlwiK3RoaXMucmQrXCI6XCIrQih0aGlzLldkLmxmKCkpfTtmdW5jdGlvbiBHYihhLGIsYyl7dGhpcy50ZT1hO3RoaXMuZXJyb3I9Yjt0aGlzLnBhdGg9Y31HYi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRofTtHYi5wcm90b3R5cGUueWU9ZnVuY3Rpb24oKXtyZXR1cm5cImNhbmNlbFwifTtcbkdiLnByb3RvdHlwZS5VYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRlLlViKHRoaXMpfTtHYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLnRvU3RyaW5nKCkrXCI6Y2FuY2VsXCJ9O2Z1bmN0aW9uIHNiKGEsYixjKXt0aGlzLkI9YTt0aGlzLiQ9Yjt0aGlzLlRiPWN9ZnVuY3Rpb24gSGIoYSl7cmV0dXJuIGEuJH1mdW5jdGlvbiByYihhLGIpe3JldHVybiBhLiQmJiFhLlRifHxhLkIuSGEoYil9c2IucHJvdG90eXBlLmo9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5CfTtmdW5jdGlvbiBJYihhKXt0aGlzLmRnPWE7dGhpcy5BZD1udWxsfUliLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmRnLmdldCgpLGI9eGEoYSk7aWYodGhpcy5BZClmb3IodmFyIGMgaW4gdGhpcy5BZCliW2NdLT10aGlzLkFkW2NdO3RoaXMuQWQ9YTtyZXR1cm4gYn07ZnVuY3Rpb24gSmIoYSxiKXt0aGlzLk1mPXt9O3RoaXMuWWQ9bmV3IEliKGEpO3RoaXMuY2E9Yjt2YXIgYz0xRTQrMkU0Kk1hdGgucmFuZG9tKCk7c2V0VGltZW91dChxKHRoaXMuSGYsdGhpcyksTWF0aC5mbG9vcihjKSl9SmIucHJvdG90eXBlLkhmPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5ZZC5nZXQoKSxiPXt9LGM9ITEsZDtmb3IoZCBpbiBhKTA8YVtkXSYmdSh0aGlzLk1mLGQpJiYoYltkXT1hW2RdLGM9ITApO2MmJnRoaXMuY2EuVGUoYik7c2V0VGltZW91dChxKHRoaXMuSGYsdGhpcyksTWF0aC5mbG9vcig2RTUqTWF0aC5yYW5kb20oKSkpfTtmdW5jdGlvbiBLYigpe3RoaXMuRGM9e319ZnVuY3Rpb24gTGIoYSxiLGMpe24oYyl8fChjPTEpO3UoYS5EYyxiKXx8KGEuRGNbYl09MCk7YS5EY1tiXSs9Y31LYi5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHhhKHRoaXMuRGMpfTt2YXIgTWI9e30sTmI9e307ZnVuY3Rpb24gT2IoYSl7YT1hLnRvU3RyaW5nKCk7TWJbYV18fChNYlthXT1uZXcgS2IpO3JldHVybiBNYlthXX1mdW5jdGlvbiBQYihhLGIpe3ZhciBjPWEudG9TdHJpbmcoKTtOYltjXXx8KE5iW2NdPWIoKSk7cmV0dXJuIE5iW2NdfTtmdW5jdGlvbiBFKGEsYil7dGhpcy5uYW1lPWE7dGhpcy5TPWJ9ZnVuY3Rpb24gUWIoYSxiKXtyZXR1cm4gbmV3IEUoYSxiKX07ZnVuY3Rpb24gUmIoYSxiKXtyZXR1cm4gU2IoYS5uYW1lLGIubmFtZSl9ZnVuY3Rpb24gVGIoYSxiKXtyZXR1cm4gU2IoYSxiKX07ZnVuY3Rpb24gVWIoYSxiLGMpe3RoaXMudHlwZT1WYjt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1iO3RoaXMuSWE9Y31VYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucGF0aC5lKCk/bmV3IFViKHRoaXMuc291cmNlLEYsdGhpcy5JYS5NKGEpKTpuZXcgVWIodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpLHRoaXMuSWEpfTtVYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgb3ZlcndyaXRlOiBcIit0aGlzLklhLnRvU3RyaW5nKCkrXCIpXCJ9O2Z1bmN0aW9uIFdiKGEsYil7dGhpcy50eXBlPVhiO3RoaXMuc291cmNlPVliO3RoaXMucGF0aD1hO3RoaXMuVmU9Yn1XYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT90aGlzOm5ldyBXYihHKHRoaXMucGF0aCksdGhpcy5WZSl9O1diLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBhY2sgd3JpdGUgcmV2ZXJ0PVwiK3RoaXMuVmUrXCIpXCJ9O2Z1bmN0aW9uIFpiKGEsYil7dGhpcy50eXBlPSRiO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWJ9WmIucHJvdG90eXBlLldjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC5lKCk/bmV3IFpiKHRoaXMuc291cmNlLEYpOm5ldyBaYih0aGlzLnNvdXJjZSxHKHRoaXMucGF0aCkpfTtaYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgbGlzdGVuX2NvbXBsZXRlKVwifTtmdW5jdGlvbiBhYyhhLGIpe3RoaXMuTGE9YTt0aGlzLnhhPWI/YjpiY31oPWFjLnByb3RvdHlwZTtoLk5hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBhYyh0aGlzLkxhLHRoaXMueGEuTmEoYSxiLHRoaXMuTGEpLlgobnVsbCxudWxsLCExLG51bGwsbnVsbCkpfTtoLnJlbW92ZT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGFjKHRoaXMuTGEsdGhpcy54YS5yZW1vdmUoYSx0aGlzLkxhKS5YKG51bGwsbnVsbCwhMSxudWxsLG51bGwpKX07aC5nZXQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGM9dGhpcy54YTshYy5lKCk7KXtiPXRoaXMuTGEoYSxjLmtleSk7aWYoMD09PWIpcmV0dXJuIGMudmFsdWU7MD5iP2M9Yy5sZWZ0OjA8YiYmKGM9Yy5yaWdodCl9cmV0dXJuIG51bGx9O1xuZnVuY3Rpb24gY2MoYSxiKXtmb3IodmFyIGMsZD1hLnhhLGU9bnVsbDshZC5lKCk7KXtjPWEuTGEoYixkLmtleSk7aWYoMD09PWMpe2lmKGQubGVmdC5lKCkpcmV0dXJuIGU/ZS5rZXk6bnVsbDtmb3IoZD1kLmxlZnQ7IWQucmlnaHQuZSgpOylkPWQucmlnaHQ7cmV0dXJuIGQua2V5fTA+Yz9kPWQubGVmdDowPGMmJihlPWQsZD1kLnJpZ2h0KX10aHJvdyBFcnJvcihcIkF0dGVtcHRlZCB0byBmaW5kIHByZWRlY2Vzc29yIGtleSBmb3IgYSBub25leGlzdGVudCBrZXkuICBXaGF0IGdpdmVzP1wiKTt9aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuZSgpfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuY291bnQoKX07aC5SYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLlJjKCl9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5lYygpfTtoLmhhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnhhLmhhKGEpfTtcbmguV2I9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLG51bGwsdGhpcy5MYSwhMSxhKX07aC5YYj1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZGModGhpcy54YSxhLHRoaXMuTGEsITEsYil9O2guWmI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsYSx0aGlzLkxhLCEwLGIpfTtoLnJmPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgZGModGhpcy54YSxudWxsLHRoaXMuTGEsITAsYSl9O2Z1bmN0aW9uIGRjKGEsYixjLGQsZSl7dGhpcy5SZD1lfHxudWxsO3RoaXMuRWU9ZDt0aGlzLlBhPVtdO2ZvcihlPTE7IWEuZSgpOylpZihlPWI/YyhhLmtleSxiKToxLGQmJihlKj0tMSksMD5lKWE9dGhpcy5FZT9hLmxlZnQ6YS5yaWdodDtlbHNlIGlmKDA9PT1lKXt0aGlzLlBhLnB1c2goYSk7YnJlYWt9ZWxzZSB0aGlzLlBhLnB1c2goYSksYT10aGlzLkVlP2EucmlnaHQ6YS5sZWZ0fVxuZnVuY3Rpb24gSChhKXtpZigwPT09YS5QYS5sZW5ndGgpcmV0dXJuIG51bGw7dmFyIGI9YS5QYS5wb3AoKSxjO2M9YS5SZD9hLlJkKGIua2V5LGIudmFsdWUpOntrZXk6Yi5rZXksdmFsdWU6Yi52YWx1ZX07aWYoYS5FZSlmb3IoYj1iLmxlZnQ7IWIuZSgpOylhLlBhLnB1c2goYiksYj1iLnJpZ2h0O2Vsc2UgZm9yKGI9Yi5yaWdodDshYi5lKCk7KWEuUGEucHVzaChiKSxiPWIubGVmdDtyZXR1cm4gY31mdW5jdGlvbiBlYyhhKXtpZigwPT09YS5QYS5sZW5ndGgpcmV0dXJuIG51bGw7dmFyIGI7Yj1hLlBhO2I9YltiLmxlbmd0aC0xXTtyZXR1cm4gYS5SZD9hLlJkKGIua2V5LGIudmFsdWUpOntrZXk6Yi5rZXksdmFsdWU6Yi52YWx1ZX19ZnVuY3Rpb24gZmMoYSxiLGMsZCxlKXt0aGlzLmtleT1hO3RoaXMudmFsdWU9Yjt0aGlzLmNvbG9yPW51bGwhPWM/YzohMDt0aGlzLmxlZnQ9bnVsbCE9ZD9kOmJjO3RoaXMucmlnaHQ9bnVsbCE9ZT9lOmJjfWg9ZmMucHJvdG90eXBlO1xuaC5YPWZ1bmN0aW9uKGEsYixjLGQsZSl7cmV0dXJuIG5ldyBmYyhudWxsIT1hP2E6dGhpcy5rZXksbnVsbCE9Yj9iOnRoaXMudmFsdWUsbnVsbCE9Yz9jOnRoaXMuY29sb3IsbnVsbCE9ZD9kOnRoaXMubGVmdCxudWxsIT1lP2U6dGhpcy5yaWdodCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sZWZ0LmNvdW50KCkrMSt0aGlzLnJpZ2h0LmNvdW50KCl9O2guZT1mdW5jdGlvbigpe3JldHVybiExfTtoLmhhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmxlZnQuaGEoYSl8fGEodGhpcy5rZXksdGhpcy52YWx1ZSl8fHRoaXMucmlnaHQuaGEoYSl9O2Z1bmN0aW9uIGdjKGEpe3JldHVybiBhLmxlZnQuZSgpP2E6Z2MoYS5sZWZ0KX1oLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIGdjKHRoaXMpLmtleX07aC5lYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJpZ2h0LmUoKT90aGlzLmtleTp0aGlzLnJpZ2h0LmVjKCl9O1xuaC5OYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtlPXRoaXM7ZD1jKGEsZS5rZXkpO2U9MD5kP2UuWChudWxsLG51bGwsbnVsbCxlLmxlZnQuTmEoYSxiLGMpLG51bGwpOjA9PT1kP2UuWChudWxsLGIsbnVsbCxudWxsLG51bGwpOmUuWChudWxsLG51bGwsbnVsbCxudWxsLGUucmlnaHQuTmEoYSxiLGMpKTtyZXR1cm4gaGMoZSl9O2Z1bmN0aW9uIGljKGEpe2lmKGEubGVmdC5lKCkpcmV0dXJuIGJjO2EubGVmdC5mYSgpfHxhLmxlZnQubGVmdC5mYSgpfHwoYT1qYyhhKSk7YT1hLlgobnVsbCxudWxsLG51bGwsaWMoYS5sZWZ0KSxudWxsKTtyZXR1cm4gaGMoYSl9XG5oLnJlbW92ZT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7Yz10aGlzO2lmKDA+YihhLGMua2V5KSljLmxlZnQuZSgpfHxjLmxlZnQuZmEoKXx8Yy5sZWZ0LmxlZnQuZmEoKXx8KGM9amMoYykpLGM9Yy5YKG51bGwsbnVsbCxudWxsLGMubGVmdC5yZW1vdmUoYSxiKSxudWxsKTtlbHNle2MubGVmdC5mYSgpJiYoYz1rYyhjKSk7Yy5yaWdodC5lKCl8fGMucmlnaHQuZmEoKXx8Yy5yaWdodC5sZWZ0LmZhKCl8fChjPWxjKGMpLGMubGVmdC5sZWZ0LmZhKCkmJihjPWtjKGMpLGM9bGMoYykpKTtpZigwPT09YihhLGMua2V5KSl7aWYoYy5yaWdodC5lKCkpcmV0dXJuIGJjO2Q9Z2MoYy5yaWdodCk7Yz1jLlgoZC5rZXksZC52YWx1ZSxudWxsLG51bGwsaWMoYy5yaWdodCkpfWM9Yy5YKG51bGwsbnVsbCxudWxsLG51bGwsYy5yaWdodC5yZW1vdmUoYSxiKSl9cmV0dXJuIGhjKGMpfTtoLmZhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29sb3J9O1xuZnVuY3Rpb24gaGMoYSl7YS5yaWdodC5mYSgpJiYhYS5sZWZ0LmZhKCkmJihhPW1jKGEpKTthLmxlZnQuZmEoKSYmYS5sZWZ0LmxlZnQuZmEoKSYmKGE9a2MoYSkpO2EubGVmdC5mYSgpJiZhLnJpZ2h0LmZhKCkmJihhPWxjKGEpKTtyZXR1cm4gYX1mdW5jdGlvbiBqYyhhKXthPWxjKGEpO2EucmlnaHQubGVmdC5mYSgpJiYoYT1hLlgobnVsbCxudWxsLG51bGwsbnVsbCxrYyhhLnJpZ2h0KSksYT1tYyhhKSxhPWxjKGEpKTtyZXR1cm4gYX1mdW5jdGlvbiBtYyhhKXtyZXR1cm4gYS5yaWdodC5YKG51bGwsbnVsbCxhLmNvbG9yLGEuWChudWxsLG51bGwsITAsbnVsbCxhLnJpZ2h0LmxlZnQpLG51bGwpfWZ1bmN0aW9uIGtjKGEpe3JldHVybiBhLmxlZnQuWChudWxsLG51bGwsYS5jb2xvcixudWxsLGEuWChudWxsLG51bGwsITAsYS5sZWZ0LnJpZ2h0LG51bGwpKX1cbmZ1bmN0aW9uIGxjKGEpe3JldHVybiBhLlgobnVsbCxudWxsLCFhLmNvbG9yLGEubGVmdC5YKG51bGwsbnVsbCwhYS5sZWZ0LmNvbG9yLG51bGwsbnVsbCksYS5yaWdodC5YKG51bGwsbnVsbCwhYS5yaWdodC5jb2xvcixudWxsLG51bGwpKX1mdW5jdGlvbiBuYygpe31oPW5jLnByb3RvdHlwZTtoLlg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307aC5OYT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZmMoYSxiLG51bGwpfTtoLnJlbW92ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIDB9O2guZT1mdW5jdGlvbigpe3JldHVybiEwfTtoLmhhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guUmM9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07aC5lYz1mdW5jdGlvbigpe3JldHVybiBudWxsfTtoLmZhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O3ZhciBiYz1uZXcgbmM7ZnVuY3Rpb24gb2MoYSxiKXtyZXR1cm4gYSYmXCJvYmplY3RcIj09PXR5cGVvZiBhPyhKKFwiLnN2XCJpbiBhLFwiVW5leHBlY3RlZCBsZWFmIG5vZGUgb3IgcHJpb3JpdHkgY29udGVudHNcIiksYlthW1wiLnN2XCJdXSk6YX1mdW5jdGlvbiBwYyhhLGIpe3ZhciBjPW5ldyBxYztyYyhhLG5ldyBLKFwiXCIpLGZ1bmN0aW9uKGEsZSl7Yy5tYyhhLHNjKGUsYikpfSk7cmV0dXJuIGN9ZnVuY3Rpb24gc2MoYSxiKXt2YXIgYz1hLkEoKS5LKCksYz1vYyhjLGIpLGQ7aWYoYS5OKCkpe3ZhciBlPW9jKGEuQmEoKSxiKTtyZXR1cm4gZSE9PWEuQmEoKXx8YyE9PWEuQSgpLksoKT9uZXcgdGMoZSxMKGMpKTphfWQ9YTtjIT09YS5BKCkuSygpJiYoZD1kLmRhKG5ldyB0YyhjKSkpO2EuVShNLGZ1bmN0aW9uKGEsYyl7dmFyIGU9c2MoYyxiKTtlIT09YyYmKGQ9ZC5RKGEsZSkpfSk7cmV0dXJuIGR9O2Z1bmN0aW9uIEsoYSxiKXtpZigxPT1hcmd1bWVudHMubGVuZ3RoKXt0aGlzLm49YS5zcGxpdChcIi9cIik7Zm9yKHZhciBjPTAsZD0wO2Q8dGhpcy5uLmxlbmd0aDtkKyspMDx0aGlzLm5bZF0ubGVuZ3RoJiYodGhpcy5uW2NdPXRoaXMubltkXSxjKyspO3RoaXMubi5sZW5ndGg9Yzt0aGlzLlk9MH1lbHNlIHRoaXMubj1hLHRoaXMuWT1ifWZ1bmN0aW9uIE4oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO2lmKGM9PT1PKGIpKXJldHVybiBOKEcoYSksRyhiKSk7dGhyb3cgRXJyb3IoXCJJTlRFUk5BTCBFUlJPUjogaW5uZXJQYXRoIChcIitiK1wiKSBpcyBub3Qgd2l0aGluIG91dGVyUGF0aCAoXCIrYStcIilcIik7fWZ1bmN0aW9uIE8oYSl7cmV0dXJuIGEuWT49YS5uLmxlbmd0aD9udWxsOmEublthLlldfWZ1bmN0aW9uIHVjKGEpe3JldHVybiBhLm4ubGVuZ3RoLWEuWX1cbmZ1bmN0aW9uIEcoYSl7dmFyIGI9YS5ZO2I8YS5uLmxlbmd0aCYmYisrO3JldHVybiBuZXcgSyhhLm4sYil9ZnVuY3Rpb24gdmMoYSl7cmV0dXJuIGEuWTxhLm4ubGVuZ3RoP2EublthLm4ubGVuZ3RoLTFdOm51bGx9aD1LLnByb3RvdHlwZTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7Zm9yKHZhciBhPVwiXCIsYj10aGlzLlk7Yjx0aGlzLm4ubGVuZ3RoO2IrKylcIlwiIT09dGhpcy5uW2JdJiYoYSs9XCIvXCIrdGhpcy5uW2JdKTtyZXR1cm4gYXx8XCIvXCJ9O2guc2xpY2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMubi5zbGljZSh0aGlzLlkrKGF8fDApKX07aC5wYXJlbnQ9ZnVuY3Rpb24oKXtpZih0aGlzLlk+PXRoaXMubi5sZW5ndGgpcmV0dXJuIG51bGw7Zm9yKHZhciBhPVtdLGI9dGhpcy5ZO2I8dGhpcy5uLmxlbmd0aC0xO2IrKylhLnB1c2godGhpcy5uW2JdKTtyZXR1cm4gbmV3IEsoYSwwKX07XG5oLnc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9dGhpcy5ZO2M8dGhpcy5uLmxlbmd0aDtjKyspYi5wdXNoKHRoaXMubltjXSk7aWYoYSBpbnN0YW5jZW9mIEspZm9yKGM9YS5ZO2M8YS5uLmxlbmd0aDtjKyspYi5wdXNoKGEubltjXSk7ZWxzZSBmb3IoYT1hLnNwbGl0KFwiL1wiKSxjPTA7YzxhLmxlbmd0aDtjKyspMDxhW2NdLmxlbmd0aCYmYi5wdXNoKGFbY10pO3JldHVybiBuZXcgSyhiLDApfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ZPj10aGlzLm4ubGVuZ3RofTtoLlo9ZnVuY3Rpb24oYSl7aWYodWModGhpcykhPT11YyhhKSlyZXR1cm4hMTtmb3IodmFyIGI9dGhpcy5ZLGM9YS5ZO2I8PXRoaXMubi5sZW5ndGg7YisrLGMrKylpZih0aGlzLm5bYl0hPT1hLm5bY10pcmV0dXJuITE7cmV0dXJuITB9O1xuaC5jb250YWlucz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLlksYz1hLlk7aWYodWModGhpcyk+dWMoYSkpcmV0dXJuITE7Zm9yKDtiPHRoaXMubi5sZW5ndGg7KXtpZih0aGlzLm5bYl0hPT1hLm5bY10pcmV0dXJuITE7KytiOysrY31yZXR1cm4hMH07dmFyIEY9bmV3IEsoXCJcIik7ZnVuY3Rpb24gd2MoYSxiKXt0aGlzLlFhPWEuc2xpY2UoKTt0aGlzLkVhPU1hdGgubWF4KDEsdGhpcy5RYS5sZW5ndGgpO3RoaXMua2Y9Yjtmb3IodmFyIGM9MDtjPHRoaXMuUWEubGVuZ3RoO2MrKyl0aGlzLkVhKz14Yyh0aGlzLlFhW2NdKTt5Yyh0aGlzKX13Yy5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihhKXswPHRoaXMuUWEubGVuZ3RoJiYodGhpcy5FYSs9MSk7dGhpcy5RYS5wdXNoKGEpO3RoaXMuRWErPXhjKGEpO3ljKHRoaXMpfTt3Yy5wcm90b3R5cGUucG9wPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5RYS5wb3AoKTt0aGlzLkVhLT14YyhhKTswPHRoaXMuUWEubGVuZ3RoJiYtLXRoaXMuRWF9O1xuZnVuY3Rpb24geWMoYSl7aWYoNzY4PGEuRWEpdGhyb3cgRXJyb3IoYS5rZitcImhhcyBhIGtleSBwYXRoIGxvbmdlciB0aGFuIDc2OCBieXRlcyAoXCIrYS5FYStcIikuXCIpO2lmKDMyPGEuUWEubGVuZ3RoKXRocm93IEVycm9yKGEua2YrXCJwYXRoIHNwZWNpZmllZCBleGNlZWRzIHRoZSBtYXhpbXVtIGRlcHRoIHRoYXQgY2FuIGJlIHdyaXR0ZW4gKDMyKSBvciBvYmplY3QgY29udGFpbnMgYSBjeWNsZSBcIit6YyhhKSk7fWZ1bmN0aW9uIHpjKGEpe3JldHVybiAwPT1hLlFhLmxlbmd0aD9cIlwiOlwiaW4gcHJvcGVydHkgJ1wiK2EuUWEuam9pbihcIi5cIikrXCInXCJ9O2Z1bmN0aW9uIEFjKCl7dGhpcy53Yz17fX1BYy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7bnVsbD09Yj9kZWxldGUgdGhpcy53Y1thXTp0aGlzLndjW2FdPWJ9O0FjLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHUodGhpcy53YyxhKT90aGlzLndjW2FdOm51bGx9O0FjLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMud2NbYV19O0FjLnByb3RvdHlwZS51Zj0hMDtmdW5jdGlvbiBCYyhhKXt0aGlzLkVjPWE7dGhpcy5NZD1cImZpcmViYXNlOlwifWg9QmMucHJvdG90eXBlO2guc2V0PWZ1bmN0aW9uKGEsYil7bnVsbD09Yj90aGlzLkVjLnJlbW92ZUl0ZW0odGhpcy5NZCthKTp0aGlzLkVjLnNldEl0ZW0odGhpcy5NZCthLEIoYikpfTtoLmdldD1mdW5jdGlvbihhKXthPXRoaXMuRWMuZ2V0SXRlbSh0aGlzLk1kK2EpO3JldHVybiBudWxsPT1hP251bGw6bWIoYSl9O2gucmVtb3ZlPWZ1bmN0aW9uKGEpe3RoaXMuRWMucmVtb3ZlSXRlbSh0aGlzLk1kK2EpfTtoLnVmPSExO2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5FYy50b1N0cmluZygpfTtmdW5jdGlvbiBDYyhhKXt0cnl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93W2FdKXt2YXIgYj13aW5kb3dbYV07Yi5zZXRJdGVtKFwiZmlyZWJhc2U6c2VudGluZWxcIixcImNhY2hlXCIpO2IucmVtb3ZlSXRlbShcImZpcmViYXNlOnNlbnRpbmVsXCIpO3JldHVybiBuZXcgQmMoYil9fWNhdGNoKGMpe31yZXR1cm4gbmV3IEFjfXZhciBEYz1DYyhcImxvY2FsU3RvcmFnZVwiKSxQPUNjKFwic2Vzc2lvblN0b3JhZ2VcIik7ZnVuY3Rpb24gRWMoYSxiLGMsZCxlKXt0aGlzLmhvc3Q9YS50b0xvd2VyQ2FzZSgpO3RoaXMuZG9tYWluPXRoaXMuaG9zdC5zdWJzdHIodGhpcy5ob3N0LmluZGV4T2YoXCIuXCIpKzEpO3RoaXMubGI9Yjt0aGlzLkNiPWM7dGhpcy5UZz1kO3RoaXMuTGQ9ZXx8XCJcIjt0aGlzLk9hPURjLmdldChcImhvc3Q6XCIrYSl8fHRoaXMuaG9zdH1mdW5jdGlvbiBGYyhhLGIpe2IhPT1hLk9hJiYoYS5PYT1iLFwicy1cIj09PWEuT2Euc3Vic3RyKDAsMikmJkRjLnNldChcImhvc3Q6XCIrYS5ob3N0LGEuT2EpKX1FYy5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT0odGhpcy5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK3RoaXMuaG9zdDt0aGlzLkxkJiYoYSs9XCI8XCIrdGhpcy5MZCtcIj5cIik7cmV0dXJuIGF9O3ZhciBHYz1mdW5jdGlvbigpe3ZhciBhPTE7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGErK319KCk7ZnVuY3Rpb24gSihhLGIpe2lmKCFhKXRocm93IEhjKGIpO31mdW5jdGlvbiBIYyhhKXtyZXR1cm4gRXJyb3IoXCJGaXJlYmFzZSAoMi4yLjUpIElOVEVSTkFMIEFTU0VSVCBGQUlMRUQ6IFwiK2EpfVxuZnVuY3Rpb24gSWMoYSl7dHJ5e3ZhciBiO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgYXRvYiliPWF0b2IoYSk7ZWxzZXtnYigpO2Zvcih2YXIgYz1lYixkPVtdLGU9MDtlPGEubGVuZ3RoOyl7dmFyIGY9Y1thLmNoYXJBdChlKyspXSxnPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06MDsrK2U7dmFyIGs9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTo2NDsrK2U7dmFyIGw9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTo2NDsrK2U7aWYobnVsbD09Znx8bnVsbD09Z3x8bnVsbD09a3x8bnVsbD09bCl0aHJvdyBFcnJvcigpO2QucHVzaChmPDwyfGc+PjQpOzY0IT1rJiYoZC5wdXNoKGc8PDQmMjQwfGs+PjIpLDY0IT1sJiZkLnB1c2goazw8NiYxOTJ8bCkpfWlmKDgxOTI+ZC5sZW5ndGgpYj1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZCk7ZWxzZXthPVwiXCI7Zm9yKGM9MDtjPGQubGVuZ3RoO2MrPTgxOTIpYSs9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLFdhKGQsYyxcbmMrODE5MikpO2I9YX19cmV0dXJuIGJ9Y2F0Y2gobSl7QmIoXCJiYXNlNjREZWNvZGUgZmFpbGVkOiBcIixtKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBKYyhhKXt2YXIgYj1LYyhhKTthPW5ldyBMYTthLnVwZGF0ZShiKTt2YXIgYj1bXSxjPTgqYS5iZTs1Nj5hLiRiP2EudXBkYXRlKGEuSWQsNTYtYS4kYik6YS51cGRhdGUoYS5JZCxhLldhLShhLiRiLTU2KSk7Zm9yKHZhciBkPWEuV2EtMTs1Njw9ZDtkLS0pYS5sZVtkXT1jJjI1NSxjLz0yNTY7TWEoYSxhLmxlKTtmb3IoZD1jPTA7NT5kO2QrKylmb3IodmFyIGU9MjQ7MDw9ZTtlLT04KWJbY109YS5SW2RdPj5lJjI1NSwrK2M7cmV0dXJuIGZiKGIpfVxuZnVuY3Rpb24gTGMoYSl7Zm9yKHZhciBiPVwiXCIsYz0wO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYj1mYShhcmd1bWVudHNbY10pP2IrTGMuYXBwbHkobnVsbCxhcmd1bWVudHNbY10pOlwib2JqZWN0XCI9PT10eXBlb2YgYXJndW1lbnRzW2NdP2IrQihhcmd1bWVudHNbY10pOmIrYXJndW1lbnRzW2NdLGIrPVwiIFwiO3JldHVybiBifXZhciBBYj1udWxsLE1jPSEwO2Z1bmN0aW9uIEJiKGEpeyEwPT09TWMmJihNYz0hMSxudWxsPT09QWImJiEwPT09UC5nZXQoXCJsb2dnaW5nX2VuYWJsZWRcIikmJk5jKCEwKSk7aWYoQWIpe3ZhciBiPUxjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtBYihiKX19ZnVuY3Rpb24gT2MoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7QmIoYSxhcmd1bWVudHMpfX1cbmZ1bmN0aW9uIFBjKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIGI9XCJGSVJFQkFTRSBJTlRFUk5BTCBFUlJPUjogXCIrTGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS5lcnJvcj9jb25zb2xlLmVycm9yKGIpOmNvbnNvbGUubG9nKGIpfX1mdW5jdGlvbiBRYyhhKXt2YXIgYj1MYy5hcHBseShudWxsLGFyZ3VtZW50cyk7dGhyb3cgRXJyb3IoXCJGSVJFQkFTRSBGQVRBTCBFUlJPUjogXCIrYik7fWZ1bmN0aW9uIFEoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXt2YXIgYj1cIkZJUkVCQVNFIFdBUk5JTkc6IFwiK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUud2Fybj9jb25zb2xlLndhcm4oYik6Y29uc29sZS5sb2coYil9fVxuZnVuY3Rpb24gUmMoYSl7dmFyIGI9XCJcIixjPVwiXCIsZD1cIlwiLGU9XCJcIixmPSEwLGc9XCJodHRwc1wiLGs9NDQzO2lmKHAoYSkpe3ZhciBsPWEuaW5kZXhPZihcIi8vXCIpOzA8PWwmJihnPWEuc3Vic3RyaW5nKDAsbC0xKSxhPWEuc3Vic3RyaW5nKGwrMikpO2w9YS5pbmRleE9mKFwiL1wiKTstMT09PWwmJihsPWEubGVuZ3RoKTtiPWEuc3Vic3RyaW5nKDAsbCk7ZT1cIlwiO2E9YS5zdWJzdHJpbmcobCkuc3BsaXQoXCIvXCIpO2ZvcihsPTA7bDxhLmxlbmd0aDtsKyspaWYoMDxhW2xdLmxlbmd0aCl7dmFyIG09YVtsXTt0cnl7bT1kZWNvZGVVUklDb21wb25lbnQobS5yZXBsYWNlKC9cXCsvZyxcIiBcIikpfWNhdGNoKHYpe31lKz1cIi9cIittfWE9Yi5zcGxpdChcIi5cIik7Mz09PWEubGVuZ3RoPyhjPWFbMV0sZD1hWzBdLnRvTG93ZXJDYXNlKCkpOjI9PT1hLmxlbmd0aCYmKGM9YVswXSk7bD1iLmluZGV4T2YoXCI6XCIpOzA8PWwmJihmPVwiaHR0cHNcIj09PWd8fFwid3NzXCI9PT1nLGs9Yi5zdWJzdHJpbmcobCsxKSxpc0Zpbml0ZShrKSYmXG4oaz1TdHJpbmcoaykpLGs9cChrKT8vXlxccyotPzB4L2kudGVzdChrKT9wYXJzZUludChrLDE2KTpwYXJzZUludChrLDEwKTpOYU4pfXJldHVybntob3N0OmIscG9ydDprLGRvbWFpbjpjLFFnOmQsbGI6ZixzY2hlbWU6ZyxaYzplfX1mdW5jdGlvbiBTYyhhKXtyZXR1cm4gZ2EoYSkmJihhIT1hfHxhPT1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl8fGE9PU51bWJlci5ORUdBVElWRV9JTkZJTklUWSl9XG5mdW5jdGlvbiBUYyhhKXtpZihcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlKWEoKTtlbHNle3ZhciBiPSExLGM9ZnVuY3Rpb24oKXtkb2N1bWVudC5ib2R5P2J8fChiPSEwLGEoKSk6c2V0VGltZW91dChjLE1hdGguZmxvb3IoMTApKX07ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj8oZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjLCExKSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixjLCExKSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQmJihkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uKCl7XCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZSYmYygpfSksd2luZG93LmF0dGFjaEV2ZW50KFwib25sb2FkXCIsYykpfX1cbmZ1bmN0aW9uIFNiKGEsYil7aWYoYT09PWIpcmV0dXJuIDA7aWYoXCJbTUlOX05BTUVdXCI9PT1hfHxcIltNQVhfTkFNRV1cIj09PWIpcmV0dXJuLTE7aWYoXCJbTUlOX05BTUVdXCI9PT1ifHxcIltNQVhfTkFNRV1cIj09PWEpcmV0dXJuIDE7dmFyIGM9VWMoYSksZD1VYyhiKTtyZXR1cm4gbnVsbCE9PWM/bnVsbCE9PWQ/MD09Yy1kP2EubGVuZ3RoLWIubGVuZ3RoOmMtZDotMTpudWxsIT09ZD8xOmE8Yj8tMToxfWZ1bmN0aW9uIFZjKGEsYil7aWYoYiYmYSBpbiBiKXJldHVybiBiW2FdO3Rocm93IEVycm9yKFwiTWlzc2luZyByZXF1aXJlZCBrZXkgKFwiK2ErXCIpIGluIG9iamVjdDogXCIrQihiKSk7fVxuZnVuY3Rpb24gV2MoYSl7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBhfHxudWxsPT09YSlyZXR1cm4gQihhKTt2YXIgYj1bXSxjO2ZvcihjIGluIGEpYi5wdXNoKGMpO2Iuc29ydCgpO2M9XCJ7XCI7Zm9yKHZhciBkPTA7ZDxiLmxlbmd0aDtkKyspMCE9PWQmJihjKz1cIixcIiksYys9QihiW2RdKSxjKz1cIjpcIixjKz1XYyhhW2JbZF1dKTtyZXR1cm4gYytcIn1cIn1mdW5jdGlvbiBYYyhhLGIpe2lmKGEubGVuZ3RoPD1iKXJldHVyblthXTtmb3IodmFyIGM9W10sZD0wO2Q8YS5sZW5ndGg7ZCs9YilkK2I+YT9jLnB1c2goYS5zdWJzdHJpbmcoZCxhLmxlbmd0aCkpOmMucHVzaChhLnN1YnN0cmluZyhkLGQrYikpO3JldHVybiBjfWZ1bmN0aW9uIFljKGEsYil7aWYoZWEoYSkpZm9yKHZhciBjPTA7YzxhLmxlbmd0aDsrK2MpYihjLGFbY10pO2Vsc2UgcihhLGIpfVxuZnVuY3Rpb24gWmMoYSl7SighU2MoYSksXCJJbnZhbGlkIEpTT04gbnVtYmVyXCIpO3ZhciBiLGMsZCxlOzA9PT1hPyhkPWM9MCxiPS1JbmZpbml0eT09PTEvYT8xOjApOihiPTA+YSxhPU1hdGguYWJzKGEpLGE+PU1hdGgucG93KDIsLTEwMjIpPyhkPU1hdGgubWluKE1hdGguZmxvb3IoTWF0aC5sb2coYSkvTWF0aC5MTjIpLDEwMjMpLGM9ZCsxMDIzLGQ9TWF0aC5yb3VuZChhKk1hdGgucG93KDIsNTItZCktTWF0aC5wb3coMiw1MikpKTooYz0wLGQ9TWF0aC5yb3VuZChhL01hdGgucG93KDIsLTEwNzQpKSkpO2U9W107Zm9yKGE9NTI7YTstLWEpZS5wdXNoKGQlMj8xOjApLGQ9TWF0aC5mbG9vcihkLzIpO2ZvcihhPTExO2E7LS1hKWUucHVzaChjJTI/MTowKSxjPU1hdGguZmxvb3IoYy8yKTtlLnB1c2goYj8xOjApO2UucmV2ZXJzZSgpO2I9ZS5qb2luKFwiXCIpO2M9XCJcIjtmb3IoYT0wOzY0PmE7YSs9OClkPXBhcnNlSW50KGIuc3Vic3RyKGEsOCksMikudG9TdHJpbmcoMTYpLDE9PT1kLmxlbmd0aCYmXG4oZD1cIjBcIitkKSxjKz1kO3JldHVybiBjLnRvTG93ZXJDYXNlKCl9dmFyICRjPS9eLT9cXGR7MSwxMH0kLztmdW5jdGlvbiBVYyhhKXtyZXR1cm4gJGMudGVzdChhKSYmKGE9TnVtYmVyKGEpLC0yMTQ3NDgzNjQ4PD1hJiYyMTQ3NDgzNjQ3Pj1hKT9hOm51bGx9ZnVuY3Rpb24gQ2IoYSl7dHJ5e2EoKX1jYXRjaChiKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7UShcIkV4Y2VwdGlvbiB3YXMgdGhyb3duIGJ5IHVzZXIgY2FsbGJhY2suXCIsYi5zdGFja3x8XCJcIik7dGhyb3cgYjt9LE1hdGguZmxvb3IoMCkpfX1mdW5jdGlvbiBSKGEsYil7aWYoaGEoYSkpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKS5zbGljZSgpO0NiKGZ1bmN0aW9uKCl7YS5hcHBseShudWxsLGMpfSl9fTtmdW5jdGlvbiBLYyhhKXtmb3IodmFyIGI9W10sYz0wLGQ9MDtkPGEubGVuZ3RoO2QrKyl7dmFyIGU9YS5jaGFyQ29kZUF0KGQpOzU1Mjk2PD1lJiY1NjMxOT49ZSYmKGUtPTU1Mjk2LGQrKyxKKGQ8YS5sZW5ndGgsXCJTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS5cIiksZT02NTUzNisoZTw8MTApKyhhLmNoYXJDb2RlQXQoZCktNTYzMjApKTsxMjg+ZT9iW2MrK109ZTooMjA0OD5lP2JbYysrXT1lPj42fDE5MjooNjU1MzY+ZT9iW2MrK109ZT4+MTJ8MjI0OihiW2MrK109ZT4+MTh8MjQwLGJbYysrXT1lPj4xMiY2M3wxMjgpLGJbYysrXT1lPj42JjYzfDEyOCksYltjKytdPWUmNjN8MTI4KX1yZXR1cm4gYn1mdW5jdGlvbiB4YyhhKXtmb3IodmFyIGI9MCxjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBkPWEuY2hhckNvZGVBdChjKTsxMjg+ZD9iKys6MjA0OD5kP2IrPTI6NTUyOTY8PWQmJjU2MzE5Pj1kPyhiKz00LGMrKyk6Yis9M31yZXR1cm4gYn07ZnVuY3Rpb24gYWQoYSl7dmFyIGI9e30sYz17fSxkPXt9LGU9XCJcIjt0cnl7dmFyIGY9YS5zcGxpdChcIi5cIiksYj1tYihJYyhmWzBdKXx8XCJcIiksYz1tYihJYyhmWzFdKXx8XCJcIiksZT1mWzJdLGQ9Yy5kfHx7fTtkZWxldGUgYy5kfWNhdGNoKGcpe31yZXR1cm57V2c6YixBYzpjLGRhdGE6ZCxOZzplfX1mdW5jdGlvbiBiZChhKXthPWFkKGEpLkFjO3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmYS5oYXNPd25Qcm9wZXJ0eShcImlhdFwiKT93KGEsXCJpYXRcIik6bnVsbH1mdW5jdGlvbiBjZChhKXthPWFkKGEpO3ZhciBiPWEuQWM7cmV0dXJuISFhLk5nJiYhIWImJlwib2JqZWN0XCI9PT10eXBlb2YgYiYmYi5oYXNPd25Qcm9wZXJ0eShcImlhdFwiKX07ZnVuY3Rpb24gZGQoYSl7dGhpcy5WPWE7dGhpcy5nPWEuby5nfWZ1bmN0aW9uIGVkKGEsYixjLGQpe3ZhciBlPVtdLGY9W107T2EoYixmdW5jdGlvbihiKXtcImNoaWxkX2NoYW5nZWRcIj09PWIudHlwZSYmYS5nLnhkKGIuSmUsYi5KYSkmJmYucHVzaChuZXcgRChcImNoaWxkX21vdmVkXCIsYi5KYSxiLllhKSl9KTtmZChhLGUsXCJjaGlsZF9yZW1vdmVkXCIsYixkLGMpO2ZkKGEsZSxcImNoaWxkX2FkZGVkXCIsYixkLGMpO2ZkKGEsZSxcImNoaWxkX21vdmVkXCIsZixkLGMpO2ZkKGEsZSxcImNoaWxkX2NoYW5nZWRcIixiLGQsYyk7ZmQoYSxlLEViLGIsZCxjKTtyZXR1cm4gZX1mdW5jdGlvbiBmZChhLGIsYyxkLGUsZil7ZD1QYShkLGZ1bmN0aW9uKGEpe3JldHVybiBhLnR5cGU9PT1jfSk7WGEoZCxxKGEuZWcsYSkpO09hKGQsZnVuY3Rpb24oYyl7dmFyIGQ9Z2QoYSxjLGYpO09hKGUsZnVuY3Rpb24oZSl7ZS5KZihjLnR5cGUpJiZiLnB1c2goZS5jcmVhdGVFdmVudChkLGEuVikpfSl9KX1cbmZ1bmN0aW9uIGdkKGEsYixjKXtcInZhbHVlXCIhPT1iLnR5cGUmJlwiY2hpbGRfcmVtb3ZlZFwiIT09Yi50eXBlJiYoYi5OZD1jLnFmKGIuWWEsYi5KYSxhLmcpKTtyZXR1cm4gYn1kZC5wcm90b3R5cGUuZWc9ZnVuY3Rpb24oYSxiKXtpZihudWxsPT1hLllhfHxudWxsPT1iLllhKXRocm93IEhjKFwiU2hvdWxkIG9ubHkgY29tcGFyZSBjaGlsZF8gZXZlbnRzLlwiKTtyZXR1cm4gdGhpcy5nLmNvbXBhcmUobmV3IEUoYS5ZYSxhLkphKSxuZXcgRShiLllhLGIuSmEpKX07ZnVuY3Rpb24gaGQoKXt0aGlzLmViPXt9fVxuZnVuY3Rpb24gaWQoYSxiKXt2YXIgYz1iLnR5cGUsZD1iLllhO0ooXCJjaGlsZF9hZGRlZFwiPT1jfHxcImNoaWxkX2NoYW5nZWRcIj09Y3x8XCJjaGlsZF9yZW1vdmVkXCI9PWMsXCJPbmx5IGNoaWxkIGNoYW5nZXMgc3VwcG9ydGVkIGZvciB0cmFja2luZ1wiKTtKKFwiLnByaW9yaXR5XCIhPT1kLFwiT25seSBub24tcHJpb3JpdHkgY2hpbGQgY2hhbmdlcyBjYW4gYmUgdHJhY2tlZC5cIik7dmFyIGU9dyhhLmViLGQpO2lmKGUpe3ZhciBmPWUudHlwZTtpZihcImNoaWxkX2FkZGVkXCI9PWMmJlwiY2hpbGRfcmVtb3ZlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYi5KYSxkLGUuSmEpO2Vsc2UgaWYoXCJjaGlsZF9yZW1vdmVkXCI9PWMmJlwiY2hpbGRfYWRkZWRcIj09ZilkZWxldGUgYS5lYltkXTtlbHNlIGlmKFwiY2hpbGRfcmVtb3ZlZFwiPT1jJiZcImNoaWxkX2NoYW5nZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGUuSmUsZCk7ZWxzZSBpZihcImNoaWxkX2NoYW5nZWRcIj09YyYmXG5cImNoaWxkX2FkZGVkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2FkZGVkXCIsYi5KYSxkKTtlbHNlIGlmKFwiY2hpbGRfY2hhbmdlZFwiPT1jJiZcImNoaWxkX2NoYW5nZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGIuSmEsZCxlLkplKTtlbHNlIHRocm93IEhjKFwiSWxsZWdhbCBjb21iaW5hdGlvbiBvZiBjaGFuZ2VzOiBcIitiK1wiIG9jY3VycmVkIGFmdGVyIFwiK2UpO31lbHNlIGEuZWJbZF09Yn07ZnVuY3Rpb24gamQoYSxiLGMpe3RoaXMuUGI9YTt0aGlzLnFiPWI7dGhpcy5zYj1jfHxudWxsfWg9amQucHJvdG90eXBlO2guSmY9ZnVuY3Rpb24oYSl7cmV0dXJuXCJ2YWx1ZVwiPT09YX07aC5jcmVhdGVFdmVudD1mdW5jdGlvbihhLGIpe3ZhciBjPWIuby5nO3JldHVybiBuZXcgRmIoXCJ2YWx1ZVwiLHRoaXMsbmV3IFMoYS5KYSxiLmxjKCksYykpfTtoLlViPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc2I7aWYoXCJjYW5jZWxcIj09PWEueWUoKSl7Sih0aGlzLnFiLFwiUmFpc2luZyBhIGNhbmNlbCBldmVudCBvbiBhIGxpc3RlbmVyIHdpdGggbm8gY2FuY2VsIGNhbGxiYWNrXCIpO3ZhciBjPXRoaXMucWI7cmV0dXJuIGZ1bmN0aW9uKCl7Yy5jYWxsKGIsYS5lcnJvcil9fXZhciBkPXRoaXMuUGI7cmV0dXJuIGZ1bmN0aW9uKCl7ZC5jYWxsKGIsYS5XZCl9fTtoLmZmPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucWI/bmV3IEdiKHRoaXMsYSxiKTpudWxsfTtcbmgubWF0Y2hlcz1mdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIGpkP2EuUGImJnRoaXMuUGI/YS5QYj09PXRoaXMuUGImJmEuc2I9PT10aGlzLnNiOiEwOiExfTtoLnNmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT10aGlzLlBifTtmdW5jdGlvbiBrZChhLGIsYyl7dGhpcy5nYT1hO3RoaXMucWI9Yjt0aGlzLnNiPWN9aD1rZC5wcm90b3R5cGU7aC5KZj1mdW5jdGlvbihhKXthPVwiY2hpbGRyZW5fYWRkZWRcIj09PWE/XCJjaGlsZF9hZGRlZFwiOmE7cmV0dXJuKFwiY2hpbGRyZW5fcmVtb3ZlZFwiPT09YT9cImNoaWxkX3JlbW92ZWRcIjphKWluIHRoaXMuZ2F9O2guZmY9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5xYj9uZXcgR2IodGhpcyxhLGIpOm51bGx9O1xuaC5jcmVhdGVFdmVudD1mdW5jdGlvbihhLGIpe0oobnVsbCE9YS5ZYSxcIkNoaWxkIGV2ZW50cyBzaG91bGQgaGF2ZSBhIGNoaWxkTmFtZS5cIik7dmFyIGM9Yi5sYygpLncoYS5ZYSk7cmV0dXJuIG5ldyBGYihhLnR5cGUsdGhpcyxuZXcgUyhhLkphLGMsYi5vLmcpLGEuTmQpfTtoLlViPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc2I7aWYoXCJjYW5jZWxcIj09PWEueWUoKSl7Sih0aGlzLnFiLFwiUmFpc2luZyBhIGNhbmNlbCBldmVudCBvbiBhIGxpc3RlbmVyIHdpdGggbm8gY2FuY2VsIGNhbGxiYWNrXCIpO3ZhciBjPXRoaXMucWI7cmV0dXJuIGZ1bmN0aW9uKCl7Yy5jYWxsKGIsYS5lcnJvcil9fXZhciBkPXRoaXMuZ2FbYS5yZF07cmV0dXJuIGZ1bmN0aW9uKCl7ZC5jYWxsKGIsYS5XZCxhLk5kKX19O1xuaC5tYXRjaGVzPWZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBrZCl7aWYoIXRoaXMuZ2F8fCFhLmdhKXJldHVybiEwO2lmKHRoaXMuc2I9PT1hLnNiKXt2YXIgYj1wYShhLmdhKTtpZihiPT09cGEodGhpcy5nYSkpe2lmKDE9PT1iKXt2YXIgYj1xYShhLmdhKSxjPXFhKHRoaXMuZ2EpO3JldHVybiBjPT09YiYmKCFhLmdhW2JdfHwhdGhpcy5nYVtjXXx8YS5nYVtiXT09PXRoaXMuZ2FbY10pfXJldHVybiBvYSh0aGlzLmdhLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuZ2FbY109PT1ifSl9fX1yZXR1cm4hMX07aC5zZj1mdW5jdGlvbigpe3JldHVybiBudWxsIT09dGhpcy5nYX07ZnVuY3Rpb24gbGQoYSl7dGhpcy5nPWF9aD1sZC5wcm90b3R5cGU7aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7SihhLkljKHRoaXMuZyksXCJBIG5vZGUgbXVzdCBiZSBpbmRleGVkIGlmIG9ubHkgYSBjaGlsZCBpcyB1cGRhdGVkXCIpO2Q9YS5NKGIpO2lmKGQuWihjKSlyZXR1cm4gYTtudWxsIT1lJiYoYy5lKCk/YS5IYShiKT9pZChlLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGQsYikpOkooYS5OKCksXCJBIGNoaWxkIHJlbW92ZSB3aXRob3V0IGFuIG9sZCBjaGlsZCBvbmx5IG1ha2VzIHNlbnNlIG9uIGEgbGVhZiBub2RlXCIpOmQuZSgpP2lkKGUsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGMsYikpOmlkKGUsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYyxiLGQpKSk7cmV0dXJuIGEuTigpJiZjLmUoKT9hOmEuUShiLGMpLm1iKHRoaXMuZyl9O1xuaC50YT1mdW5jdGlvbihhLGIsYyl7bnVsbCE9YyYmKGEuTigpfHxhLlUoTSxmdW5jdGlvbihhLGUpe2IuSGEoYSl8fGlkKGMsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZSxhKSl9KSxiLk4oKXx8Yi5VKE0sZnVuY3Rpb24oYixlKXtpZihhLkhhKGIpKXt2YXIgZj1hLk0oYik7Zi5aKGUpfHxpZChjLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGUsYixmKSl9ZWxzZSBpZChjLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixlLGIpKX0pKTtyZXR1cm4gYi5tYih0aGlzLmcpfTtoLmRhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuZSgpP0M6YS5kYShiKX07aC5HYT1mdW5jdGlvbigpe3JldHVybiExfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIG1kKGEpe3RoaXMuQWU9bmV3IGxkKGEuZyk7dGhpcy5nPWEuZzt2YXIgYjthLmxhPyhiPW5kKGEpLGI9YS5nLk9jKG9kKGEpLGIpKTpiPWEuZy5TYygpO3RoaXMuZGQ9YjthLm5hPyhiPXBkKGEpLGE9YS5nLk9jKHFkKGEpLGIpKTphPWEuZy5QYygpO3RoaXMuRmM9YX1oPW1kLnByb3RvdHlwZTtoLm1hdGNoZXM9ZnVuY3Rpb24oYSl7cmV0dXJuIDA+PXRoaXMuZy5jb21wYXJlKHRoaXMuZGQsYSkmJjA+PXRoaXMuZy5jb21wYXJlKGEsdGhpcy5GYyl9O2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe3RoaXMubWF0Y2hlcyhuZXcgRShiLGMpKXx8KGM9Qyk7cmV0dXJuIHRoaXMuQWUuRyhhLGIsYyxkLGUpfTtoLnRhPWZ1bmN0aW9uKGEsYixjKXtiLk4oKSYmKGI9Qyk7dmFyIGQ9Yi5tYih0aGlzLmcpLGQ9ZC5kYShDKSxlPXRoaXM7Yi5VKE0sZnVuY3Rpb24oYSxiKXtlLm1hdGNoZXMobmV3IEUoYSxiKSl8fChkPWQuUShhLEMpKX0pO3JldHVybiB0aGlzLkFlLnRhKGEsZCxjKX07XG5oLmRhPWZ1bmN0aW9uKGEpe3JldHVybiBhfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5BZX07ZnVuY3Rpb24gcmQoYSl7dGhpcy5yYT1uZXcgbWQoYSk7dGhpcy5nPWEuZztKKGEuaWEsXCJPbmx5IHZhbGlkIGlmIGxpbWl0IGhhcyBiZWVuIHNldFwiKTt0aGlzLmphPWEuamE7dGhpcy5KYj0hc2QoYSl9aD1yZC5wcm90b3R5cGU7aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7dGhpcy5yYS5tYXRjaGVzKG5ldyBFKGIsYykpfHwoYz1DKTtyZXR1cm4gYS5NKGIpLlooYyk/YTphLkRiKCk8dGhpcy5qYT90aGlzLnJhLlZiKCkuRyhhLGIsYyxkLGUpOnRkKHRoaXMsYSxiLGMsZCxlKX07XG5oLnRhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZDtpZihiLk4oKXx8Yi5lKCkpZD1DLm1iKHRoaXMuZyk7ZWxzZSBpZigyKnRoaXMuamE8Yi5EYigpJiZiLkljKHRoaXMuZykpe2Q9Qy5tYih0aGlzLmcpO2I9dGhpcy5KYj9iLlpiKHRoaXMucmEuRmMsdGhpcy5nKTpiLlhiKHRoaXMucmEuZGQsdGhpcy5nKTtmb3IodmFyIGU9MDswPGIuUGEubGVuZ3RoJiZlPHRoaXMuamE7KXt2YXIgZj1IKGIpLGc7aWYoZz10aGlzLkpiPzA+PXRoaXMuZy5jb21wYXJlKHRoaXMucmEuZGQsZik6MD49dGhpcy5nLmNvbXBhcmUoZix0aGlzLnJhLkZjKSlkPWQuUShmLm5hbWUsZi5TKSxlKys7ZWxzZSBicmVha319ZWxzZXtkPWIubWIodGhpcy5nKTtkPWQuZGEoQyk7dmFyIGssbCxtO2lmKHRoaXMuSmIpe2I9ZC5yZih0aGlzLmcpO2s9dGhpcy5yYS5GYztsPXRoaXMucmEuZGQ7dmFyIHY9dWQodGhpcy5nKTttPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHYoYixhKX19ZWxzZSBiPWQuV2IodGhpcy5nKSxrPXRoaXMucmEuZGQsXG5sPXRoaXMucmEuRmMsbT11ZCh0aGlzLmcpO2Zvcih2YXIgZT0wLHk9ITE7MDxiLlBhLmxlbmd0aDspZj1IKGIpLCF5JiYwPj1tKGssZikmJih5PSEwKSwoZz15JiZlPHRoaXMuamEmJjA+PW0oZixsKSk/ZSsrOmQ9ZC5RKGYubmFtZSxDKX1yZXR1cm4gdGhpcy5yYS5WYigpLnRhKGEsZCxjKX07aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gYX07aC5HYT1mdW5jdGlvbigpe3JldHVybiEwfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmEuVmIoKX07XG5mdW5jdGlvbiB0ZChhLGIsYyxkLGUsZil7dmFyIGc7aWYoYS5KYil7dmFyIGs9dWQoYS5nKTtnPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGsoYixhKX19ZWxzZSBnPXVkKGEuZyk7SihiLkRiKCk9PWEuamEsXCJcIik7dmFyIGw9bmV3IEUoYyxkKSxtPWEuSmI/d2QoYixhLmcpOnhkKGIsYS5nKSx2PWEucmEubWF0Y2hlcyhsKTtpZihiLkhhKGMpKXt2YXIgeT1iLk0oYyksbT1lLnhlKGEuZyxtLGEuSmIpO251bGwhPW0mJm0ubmFtZT09YyYmKG09ZS54ZShhLmcsbSxhLkpiKSk7ZT1udWxsPT1tPzE6ZyhtLGwpO2lmKHYmJiFkLmUoKSYmMDw9ZSlyZXR1cm4gbnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX2NoYW5nZWRcIixkLGMseSkpLGIuUShjLGQpO251bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIseSxjKSk7Yj1iLlEoYyxDKTtyZXR1cm4gbnVsbCE9bSYmYS5yYS5tYXRjaGVzKG0pPyhudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixtLlMsbS5uYW1lKSksYi5RKG0ubmFtZSxcbm0uUykpOmJ9cmV0dXJuIGQuZSgpP2I6diYmMDw9ZyhtLGwpPyhudWxsIT1mJiYoaWQoZixuZXcgRChcImNoaWxkX3JlbW92ZWRcIixtLlMsbS5uYW1lKSksaWQoZixuZXcgRChcImNoaWxkX2FkZGVkXCIsZCxjKSkpLGIuUShjLGQpLlEobS5uYW1lLEMpKTpifTtmdW5jdGlvbiB5ZChhLGIpe3RoaXMuaGU9YTt0aGlzLmNnPWJ9ZnVuY3Rpb24gemQoYSl7dGhpcy5JPWF9XG56ZC5wcm90b3R5cGUuYmI9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9bmV3IGhkLGY7aWYoYi50eXBlPT09VmIpYi5zb3VyY2UudmU/Yz1BZCh0aGlzLGEsYi5wYXRoLGIuSWEsYyxkLGUpOihKKGIuc291cmNlLm9mLFwiVW5rbm93biBzb3VyY2UuXCIpLGY9Yi5zb3VyY2UuYWYsYz1CZCh0aGlzLGEsYi5wYXRoLGIuSWEsYyxkLGYsZSkpO2Vsc2UgaWYoYi50eXBlPT09Q2QpYi5zb3VyY2UudmU/Yz1EZCh0aGlzLGEsYi5wYXRoLGIuY2hpbGRyZW4sYyxkLGUpOihKKGIuc291cmNlLm9mLFwiVW5rbm93biBzb3VyY2UuXCIpLGY9Yi5zb3VyY2UuYWYsYz1FZCh0aGlzLGEsYi5wYXRoLGIuY2hpbGRyZW4sYyxkLGYsZSkpO2Vsc2UgaWYoYi50eXBlPT09WGIpaWYoYi5WZSlpZihmPWIucGF0aCxudWxsIT1jLnNjKGYpKWM9YTtlbHNle2I9bmV3IHFiKGMsYSxkKTtkPWEuRC5qKCk7aWYoZi5lKCl8fFwiLnByaW9yaXR5XCI9PT1PKGYpKUhiKGEudSgpKT9iPWMudWEodGIoYSkpOihiPWEudSgpLmooKSxcbkooYiBpbnN0YW5jZW9mIFQsXCJzZXJ2ZXJDaGlsZHJlbiB3b3VsZCBiZSBjb21wbGV0ZSBpZiBsZWFmIG5vZGVcIiksYj1jLnhjKGIpKSxiPXRoaXMuSS50YShkLGIsZSk7ZWxzZXtmPU8oZik7dmFyIGc9Yy5YYShmLGEudSgpKTtudWxsPT1nJiZyYihhLnUoKSxmKSYmKGc9ZC5NKGYpKTtiPW51bGwhPWc/dGhpcy5JLkcoZCxmLGcsYixlKTphLkQuaigpLkhhKGYpP3RoaXMuSS5HKGQsZixDLGIsZSk6ZDtiLmUoKSYmSGIoYS51KCkpJiYoZD1jLnVhKHRiKGEpKSxkLk4oKSYmKGI9dGhpcy5JLnRhKGIsZCxlKSkpfWQ9SGIoYS51KCkpfHxudWxsIT1jLnNjKEYpO2M9RmQoYSxiLGQsdGhpcy5JLkdhKCkpfWVsc2UgYz1HZCh0aGlzLGEsYi5wYXRoLGMsZCxlKTtlbHNlIGlmKGIudHlwZT09PSRiKWQ9Yi5wYXRoLGI9YS51KCksZj1iLmooKSxnPWIuJHx8ZC5lKCksYz1IZCh0aGlzLG5ldyBJZChhLkQsbmV3IHNiKGYsZyxiLlRiKSksZCxjLHBiLGUpO2Vsc2UgdGhyb3cgSGMoXCJVbmtub3duIG9wZXJhdGlvbiB0eXBlOiBcIitcbmIudHlwZSk7ZT1yYShlLmViKTtkPWM7Yj1kLkQ7Yi4kJiYoZj1iLmooKS5OKCl8fGIuaigpLmUoKSxnPUpkKGEpLCgwPGUubGVuZ3RofHwhYS5ELiR8fGYmJiFiLmooKS5aKGcpfHwhYi5qKCkuQSgpLlooZy5BKCkpKSYmZS5wdXNoKERiKEpkKGQpKSkpO3JldHVybiBuZXcgeWQoYyxlKX07XG5mdW5jdGlvbiBIZChhLGIsYyxkLGUsZil7dmFyIGc9Yi5EO2lmKG51bGwhPWQuc2MoYykpcmV0dXJuIGI7dmFyIGs7aWYoYy5lKCkpSihIYihiLnUoKSksXCJJZiBjaGFuZ2UgcGF0aCBpcyBlbXB0eSwgd2UgbXVzdCBoYXZlIGNvbXBsZXRlIHNlcnZlciBkYXRhXCIpLGIudSgpLlRiPyhlPXRiKGIpLGQ9ZC54YyhlIGluc3RhbmNlb2YgVD9lOkMpKTpkPWQudWEodGIoYikpLGY9YS5JLnRhKGIuRC5qKCksZCxmKTtlbHNle3ZhciBsPU8oYyk7aWYoXCIucHJpb3JpdHlcIj09bClKKDE9PXVjKGMpLFwiQ2FuJ3QgaGF2ZSBhIHByaW9yaXR5IHdpdGggYWRkaXRpb25hbCBwYXRoIGNvbXBvbmVudHNcIiksZj1nLmooKSxrPWIudSgpLmooKSxkPWQuaGQoYyxmLGspLGY9bnVsbCE9ZD9hLkkuZGEoZixkKTpnLmooKTtlbHNle3ZhciBtPUcoYyk7cmIoZyxsKT8oaz1iLnUoKS5qKCksZD1kLmhkKGMsZy5qKCksayksZD1udWxsIT1kP2cuaigpLk0obCkuRyhtLGQpOmcuaigpLk0obCkpOmQ9ZC5YYShsLGIudSgpKTtcbmY9bnVsbCE9ZD9hLkkuRyhnLmooKSxsLGQsZSxmKTpnLmooKX19cmV0dXJuIEZkKGIsZixnLiR8fGMuZSgpLGEuSS5HYSgpKX1mdW5jdGlvbiBCZChhLGIsYyxkLGUsZixnLGspe3ZhciBsPWIudSgpO2c9Zz9hLkk6YS5JLlZiKCk7aWYoYy5lKCkpZD1nLnRhKGwuaigpLGQsbnVsbCk7ZWxzZSBpZihnLkdhKCkmJiFsLlRiKWQ9bC5qKCkuRyhjLGQpLGQ9Zy50YShsLmooKSxkLG51bGwpO2Vsc2V7dmFyIG09TyhjKTtpZigoYy5lKCk/IWwuJHx8bC5UYjohcmIobCxPKGMpKSkmJjE8dWMoYykpcmV0dXJuIGI7ZD1sLmooKS5NKG0pLkcoRyhjKSxkKTtkPVwiLnByaW9yaXR5XCI9PW0/Zy5kYShsLmooKSxkKTpnLkcobC5qKCksbSxkLHBiLG51bGwpfWw9bC4kfHxjLmUoKTtiPW5ldyBJZChiLkQsbmV3IHNiKGQsbCxnLkdhKCkpKTtyZXR1cm4gSGQoYSxiLGMsZSxuZXcgcWIoZSxiLGYpLGspfVxuZnVuY3Rpb24gQWQoYSxiLGMsZCxlLGYsZyl7dmFyIGs9Yi5EO2U9bmV3IHFiKGUsYixmKTtpZihjLmUoKSlnPWEuSS50YShiLkQuaigpLGQsZyksYT1GZChiLGcsITAsYS5JLkdhKCkpO2Vsc2UgaWYoZj1PKGMpLFwiLnByaW9yaXR5XCI9PT1mKWc9YS5JLmRhKGIuRC5qKCksZCksYT1GZChiLGcsay4kLGsuVGIpO2Vsc2V7dmFyIGw9RyhjKTtjPWsuaigpLk0oZik7aWYoIWwuZSgpKXt2YXIgbT1lLnBmKGYpO2Q9bnVsbCE9bT9cIi5wcmlvcml0eVwiPT09dmMobCkmJm0ub2EobC5wYXJlbnQoKSkuZSgpP206bS5HKGwsZCk6Q31jLlooZCk/YT1iOihnPWEuSS5HKGsuaigpLGYsZCxlLGcpLGE9RmQoYixnLGsuJCxhLkkuR2EoKSkpfXJldHVybiBhfVxuZnVuY3Rpb24gRGQoYSxiLGMsZCxlLGYsZyl7dmFyIGs9YjtLZChkLGZ1bmN0aW9uKGQsbSl7dmFyIHY9Yy53KGQpO3JiKGIuRCxPKHYpKSYmKGs9QWQoYSxrLHYsbSxlLGYsZykpfSk7S2QoZCxmdW5jdGlvbihkLG0pe3ZhciB2PWMudyhkKTtyYihiLkQsTyh2KSl8fChrPUFkKGEsayx2LG0sZSxmLGcpKX0pO3JldHVybiBrfWZ1bmN0aW9uIExkKGEsYil7S2QoYixmdW5jdGlvbihiLGQpe2E9YS5HKGIsZCl9KTtyZXR1cm4gYX1cbmZ1bmN0aW9uIEVkKGEsYixjLGQsZSxmLGcsayl7aWYoYi51KCkuaigpLmUoKSYmIUhiKGIudSgpKSlyZXR1cm4gYjt2YXIgbD1iO2M9Yy5lKCk/ZDpNZChOZCxjLGQpO3ZhciBtPWIudSgpLmooKTtjLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGMsZCl7aWYobS5IYShjKSl7dmFyIEk9Yi51KCkuaigpLk0oYyksST1MZChJLGQpO2w9QmQoYSxsLG5ldyBLKGMpLEksZSxmLGcsayl9fSk7Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGQpe3ZhciBJPSFIYihiLnUoKSkmJm51bGw9PWQudmFsdWU7bS5IYShjKXx8SXx8KEk9Yi51KCkuaigpLk0oYyksST1MZChJLGQpLGw9QmQoYSxsLG5ldyBLKGMpLEksZSxmLGcsaykpfSk7cmV0dXJuIGx9XG5mdW5jdGlvbiBHZChhLGIsYyxkLGUsZil7aWYobnVsbCE9ZC5zYyhjKSlyZXR1cm4gYjt2YXIgZz1uZXcgcWIoZCxiLGUpLGs9ZT1iLkQuaigpO2lmKEhiKGIudSgpKSl7aWYoYy5lKCkpZT1kLnVhKHRiKGIpKSxrPWEuSS50YShiLkQuaigpLGUsZik7ZWxzZSBpZihcIi5wcmlvcml0eVwiPT09TyhjKSl7dmFyIGw9ZC5YYShPKGMpLGIudSgpKTtudWxsPT1sfHxlLmUoKXx8ZS5BKCkuWihsKXx8KGs9YS5JLmRhKGUsbCkpfWVsc2UgbD1PKGMpLGU9ZC5YYShsLGIudSgpKSxudWxsIT1lJiYoaz1hLkkuRyhiLkQuaigpLGwsZSxnLGYpKTtlPSEwfWVsc2UgaWYoYi5ELiR8fGMuZSgpKWs9ZSxlPWIuRC5qKCksZS5OKCl8fGUuVShNLGZ1bmN0aW9uKGMpe3ZhciBlPWQuWGEoYyxiLnUoKSk7bnVsbCE9ZSYmKGs9YS5JLkcoayxjLGUsZyxmKSl9KSxlPWIuRC4kO2Vsc2V7bD1PKGMpO2lmKDE9PXVjKGMpfHxyYihiLkQsbCkpYz1kLlhhKGwsYi51KCkpLG51bGwhPWMmJihrPWEuSS5HKGUsbCxjLFxuZyxmKSk7ZT0hMX1yZXR1cm4gRmQoYixrLGUsYS5JLkdhKCkpfTtmdW5jdGlvbiBPZCgpe312YXIgUGQ9e307ZnVuY3Rpb24gdWQoYSl7cmV0dXJuIHEoYS5jb21wYXJlLGEpfU9kLnByb3RvdHlwZS54ZD1mdW5jdGlvbihhLGIpe3JldHVybiAwIT09dGhpcy5jb21wYXJlKG5ldyBFKFwiW01JTl9OQU1FXVwiLGEpLG5ldyBFKFwiW01JTl9OQU1FXVwiLGIpKX07T2QucHJvdG90eXBlLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtmdW5jdGlvbiBSZChhKXt0aGlzLmJjPWF9bWEoUmQsT2QpO2g9UmQucHJvdG90eXBlO2guSGM9ZnVuY3Rpb24oYSl7cmV0dXJuIWEuTSh0aGlzLmJjKS5lKCl9O2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5NKHRoaXMuYmMpLGQ9Yi5TLk0odGhpcy5iYyksYz1jLkNjKGQpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKSxjPUMuUSh0aGlzLmJjLGMpO3JldHVybiBuZXcgRShiLGMpfTtcbmguUGM9ZnVuY3Rpb24oKXt2YXIgYT1DLlEodGhpcy5iYyxTZCk7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLGEpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmN9O2Z1bmN0aW9uIFRkKCl7fW1hKFRkLE9kKTtoPVRkLnByb3RvdHlwZTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuQSgpLGQ9Yi5TLkEoKSxjPWMuQ2MoZCk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guSGM9ZnVuY3Rpb24oYSl7cmV0dXJuIWEuQSgpLmUoKX07aC54ZD1mdW5jdGlvbihhLGIpe3JldHVybiFhLkEoKS5aKGIuQSgpKX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixuZXcgdGMoXCJbUFJJT1JJVFktUE9TVF1cIixTZCkpfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKTtyZXR1cm4gbmV3IEUoYixuZXcgdGMoXCJbUFJJT1JJVFktUE9TVF1cIixjKSl9O1xuaC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLnByaW9yaXR5XCJ9O3ZhciBNPW5ldyBUZDtmdW5jdGlvbiBVZCgpe31tYShVZCxPZCk7aD1VZC5wcm90b3R5cGU7aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFNiKGEubmFtZSxiLm5hbWUpfTtoLkhjPWZ1bmN0aW9uKCl7dGhyb3cgSGMoXCJLZXlJbmRleC5pc0RlZmluZWRPbiBub3QgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkLlwiKTt9O2gueGQ9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixDKX07aC5PYz1mdW5jdGlvbihhKXtKKHAoYSksXCJLZXlJbmRleCBpbmRleFZhbHVlIG11c3QgYWx3YXlzIGJlIGEgc3RyaW5nLlwiKTtyZXR1cm4gbmV3IEUoYSxDKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLmtleVwifTt2YXIgVmQ9bmV3IFVkO2Z1bmN0aW9uIFdkKCl7fW1hKFdkLE9kKTtoPVdkLnByb3RvdHlwZTtcbmguY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5DYyhiLlMpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLkhjPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2gueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4hYS5aKGIpfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIFhkfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKTtyZXR1cm4gbmV3IEUoYixjKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLnZhbHVlXCJ9O3ZhciBZZD1uZXcgV2Q7ZnVuY3Rpb24gWmQoKXt0aGlzLlJiPXRoaXMubmE9dGhpcy5MYj10aGlzLmxhPXRoaXMuaWE9ITE7dGhpcy5qYT0wO3RoaXMuTmI9XCJcIjt0aGlzLmRjPW51bGw7dGhpcy54Yj1cIlwiO3RoaXMuYWM9bnVsbDt0aGlzLnZiPVwiXCI7dGhpcy5nPU19dmFyICRkPW5ldyBaZDtmdW5jdGlvbiBzZChhKXtyZXR1cm5cIlwiPT09YS5OYj9hLmxhOlwibFwiPT09YS5OYn1mdW5jdGlvbiBvZChhKXtKKGEubGEsXCJPbmx5IHZhbGlkIGlmIHN0YXJ0IGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5kY31mdW5jdGlvbiBuZChhKXtKKGEubGEsXCJPbmx5IHZhbGlkIGlmIHN0YXJ0IGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5MYj9hLnhiOlwiW01JTl9OQU1FXVwifWZ1bmN0aW9uIHFkKGEpe0ooYS5uYSxcIk9ubHkgdmFsaWQgaWYgZW5kIGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5hY31cbmZ1bmN0aW9uIHBkKGEpe0ooYS5uYSxcIk9ubHkgdmFsaWQgaWYgZW5kIGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5SYj9hLnZiOlwiW01BWF9OQU1FXVwifWZ1bmN0aW9uIGFlKGEpe3ZhciBiPW5ldyBaZDtiLmlhPWEuaWE7Yi5qYT1hLmphO2IubGE9YS5sYTtiLmRjPWEuZGM7Yi5MYj1hLkxiO2IueGI9YS54YjtiLm5hPWEubmE7Yi5hYz1hLmFjO2IuUmI9YS5SYjtiLnZiPWEudmI7Yi5nPWEuZztyZXR1cm4gYn1oPVpkLnByb3RvdHlwZTtoLkdlPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJcIjtyZXR1cm4gYn07aC5IZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwibFwiO3JldHVybiBifTtoLkllPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJyXCI7cmV0dXJuIGJ9O1xuaC5YZD1mdW5jdGlvbihhLGIpe3ZhciBjPWFlKHRoaXMpO2MubGE9ITA7bihhKXx8KGE9bnVsbCk7Yy5kYz1hO251bGwhPWI/KGMuTGI9ITAsYy54Yj1iKTooYy5MYj0hMSxjLnhiPVwiXCIpO3JldHVybiBjfTtoLnFkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YWUodGhpcyk7Yy5uYT0hMDtuKGEpfHwoYT1udWxsKTtjLmFjPWE7bihiKT8oYy5SYj0hMCxjLnZiPWIpOihjLllnPSExLGMudmI9XCJcIik7cmV0dXJuIGN9O2Z1bmN0aW9uIGJlKGEsYil7dmFyIGM9YWUoYSk7Yy5nPWI7cmV0dXJuIGN9ZnVuY3Rpb24gY2UoYSl7dmFyIGI9e307YS5sYSYmKGIuc3A9YS5kYyxhLkxiJiYoYi5zbj1hLnhiKSk7YS5uYSYmKGIuZXA9YS5hYyxhLlJiJiYoYi5lbj1hLnZiKSk7aWYoYS5pYSl7Yi5sPWEuamE7dmFyIGM9YS5OYjtcIlwiPT09YyYmKGM9c2QoYSk/XCJsXCI6XCJyXCIpO2IudmY9Y31hLmchPT1NJiYoYi5pPWEuZy50b1N0cmluZygpKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIGRlKGEpe3JldHVybiEoYS5sYXx8YS5uYXx8YS5pYSl9ZnVuY3Rpb24gZWUoYSl7dmFyIGI9e307aWYoZGUoYSkmJmEuZz09TSlyZXR1cm4gYjt2YXIgYzthLmc9PT1NP2M9XCIkcHJpb3JpdHlcIjphLmc9PT1ZZD9jPVwiJHZhbHVlXCI6YS5nPT09VmQ/Yz1cIiRrZXlcIjooSihhLmcgaW5zdGFuY2VvZiBSZCxcIlVucmVjb2duaXplZCBpbmRleCB0eXBlIVwiKSxjPWEuZy50b1N0cmluZygpKTtiLm9yZGVyQnk9QihjKTthLmxhJiYoYi5zdGFydEF0PUIoYS5kYyksYS5MYiYmKGIuc3RhcnRBdCs9XCIsXCIrQihhLnhiKSkpO2EubmEmJihiLmVuZEF0PUIoYS5hYyksYS5SYiYmKGIuZW5kQXQrPVwiLFwiK0IoYS52YikpKTthLmlhJiYoc2QoYSk/Yi5saW1pdFRvRmlyc3Q9YS5qYTpiLmxpbWl0VG9MYXN0PWEuamEpO3JldHVybiBifWgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQihjZSh0aGlzKSl9O2Z1bmN0aW9uIGZlKGEsYil7dGhpcy55ZD1hO3RoaXMuY2M9Yn1mZS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGEpe3ZhciBiPXcodGhpcy55ZCxhKTtpZighYil0aHJvdyBFcnJvcihcIk5vIGluZGV4IGRlZmluZWQgZm9yIFwiK2EpO3JldHVybiBiPT09UGQ/bnVsbDpifTtmdW5jdGlvbiBnZShhLGIsYyl7dmFyIGQ9bmEoYS55ZCxmdW5jdGlvbihkLGYpe3ZhciBnPXcoYS5jYyxmKTtKKGcsXCJNaXNzaW5nIGluZGV4IGltcGxlbWVudGF0aW9uIGZvciBcIitmKTtpZihkPT09UGQpe2lmKGcuSGMoYi5TKSl7Zm9yKHZhciBrPVtdLGw9Yy5XYihRYiksbT1IKGwpO207KW0ubmFtZSE9Yi5uYW1lJiZrLnB1c2gobSksbT1IKGwpO2sucHVzaChiKTtyZXR1cm4gaGUoayx1ZChnKSl9cmV0dXJuIFBkfWc9Yy5nZXQoYi5uYW1lKTtrPWQ7ZyYmKGs9ay5yZW1vdmUobmV3IEUoYi5uYW1lLGcpKSk7cmV0dXJuIGsuTmEoYixiLlMpfSk7cmV0dXJuIG5ldyBmZShkLGEuY2MpfVxuZnVuY3Rpb24gaWUoYSxiLGMpe3ZhciBkPW5hKGEueWQsZnVuY3Rpb24oYSl7aWYoYT09PVBkKXJldHVybiBhO3ZhciBkPWMuZ2V0KGIubmFtZSk7cmV0dXJuIGQ/YS5yZW1vdmUobmV3IEUoYi5uYW1lLGQpKTphfSk7cmV0dXJuIG5ldyBmZShkLGEuY2MpfXZhciBqZT1uZXcgZmUoe1wiLnByaW9yaXR5XCI6UGR9LHtcIi5wcmlvcml0eVwiOk19KTtmdW5jdGlvbiB0YyhhLGIpe3RoaXMuQz1hO0oobih0aGlzLkMpJiZudWxsIT09dGhpcy5DLFwiTGVhZk5vZGUgc2hvdWxkbid0IGJlIGNyZWF0ZWQgd2l0aCBudWxsL3VuZGVmaW5lZCB2YWx1ZS5cIik7dGhpcy5iYT1ifHxDO2tlKHRoaXMuYmEpO3RoaXMuQmI9bnVsbH1oPXRjLnByb3RvdHlwZTtoLk49ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmF9O2guZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyB0Yyh0aGlzLkMsYSl9O2guTT1mdW5jdGlvbihhKXtyZXR1cm5cIi5wcmlvcml0eVwiPT09YT90aGlzLmJhOkN9O2gub2E9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuZSgpP3RoaXM6XCIucHJpb3JpdHlcIj09PU8oYSk/dGhpcy5iYTpDfTtoLkhhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2gucWY9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07XG5oLlE9ZnVuY3Rpb24oYSxiKXtyZXR1cm5cIi5wcmlvcml0eVwiPT09YT90aGlzLmRhKGIpOmIuZSgpJiZcIi5wcmlvcml0eVwiIT09YT90aGlzOkMuUShhLGIpLmRhKHRoaXMuYmEpfTtoLkc9ZnVuY3Rpb24oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO2lmKGIuZSgpJiZcIi5wcmlvcml0eVwiIT09YylyZXR1cm4gdGhpcztKKFwiLnByaW9yaXR5XCIhPT1jfHwxPT09dWMoYSksXCIucHJpb3JpdHkgbXVzdCBiZSB0aGUgbGFzdCB0b2tlbiBpbiBhIHBhdGhcIik7cmV0dXJuIHRoaXMuUShjLEMuRyhHKGEpLGIpKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guRGI9ZnVuY3Rpb24oKXtyZXR1cm4gMH07aC5LPWZ1bmN0aW9uKGEpe3JldHVybiBhJiYhdGhpcy5BKCkuZSgpP3tcIi52YWx1ZVwiOnRoaXMuQmEoKSxcIi5wcmlvcml0eVwiOnRoaXMuQSgpLksoKX06dGhpcy5CYSgpfTtcbmguaGFzaD1mdW5jdGlvbigpe2lmKG51bGw9PT10aGlzLkJiKXt2YXIgYT1cIlwiO3RoaXMuYmEuZSgpfHwoYSs9XCJwcmlvcml0eTpcIitsZSh0aGlzLmJhLksoKSkrXCI6XCIpO3ZhciBiPXR5cGVvZiB0aGlzLkMsYT1hKyhiK1wiOlwiKSxhPVwibnVtYmVyXCI9PT1iP2ErWmModGhpcy5DKTphK3RoaXMuQzt0aGlzLkJiPUpjKGEpfXJldHVybiB0aGlzLkJifTtoLkJhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQ307aC5DYz1mdW5jdGlvbihhKXtpZihhPT09QylyZXR1cm4gMTtpZihhIGluc3RhbmNlb2YgVClyZXR1cm4tMTtKKGEuTigpLFwiVW5rbm93biBub2RlIHR5cGVcIik7dmFyIGI9dHlwZW9mIGEuQyxjPXR5cGVvZiB0aGlzLkMsZD1OYShtZSxiKSxlPU5hKG1lLGMpO0ooMDw9ZCxcIlVua25vd24gbGVhZiB0eXBlOiBcIitiKTtKKDA8PWUsXCJVbmtub3duIGxlYWYgdHlwZTogXCIrYyk7cmV0dXJuIGQ9PT1lP1wib2JqZWN0XCI9PT1jPzA6dGhpcy5DPGEuQz8tMTp0aGlzLkM9PT1hLkM/MDoxOmUtZH07XG52YXIgbWU9W1wib2JqZWN0XCIsXCJib29sZWFuXCIsXCJudW1iZXJcIixcInN0cmluZ1wiXTt0Yy5wcm90b3R5cGUubWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307dGMucHJvdG90eXBlLkljPWZ1bmN0aW9uKCl7cmV0dXJuITB9O3RjLnByb3RvdHlwZS5aPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpcz8hMDphLk4oKT90aGlzLkM9PT1hLkMmJnRoaXMuYmEuWihhLmJhKTohMX07dGMucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEIodGhpcy5LKCEwKSl9O2Z1bmN0aW9uIFQoYSxiLGMpe3RoaXMubT1hOyh0aGlzLmJhPWIpJiZrZSh0aGlzLmJhKTthLmUoKSYmSighdGhpcy5iYXx8dGhpcy5iYS5lKCksXCJBbiBlbXB0eSBub2RlIGNhbm5vdCBoYXZlIGEgcHJpb3JpdHlcIik7dGhpcy53Yj1jO3RoaXMuQmI9bnVsbH1oPVQucHJvdG90eXBlO2guTj1mdW5jdGlvbigpe3JldHVybiExfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYXx8Q307aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5tLmUoKT90aGlzOm5ldyBUKHRoaXMubSxhLHRoaXMud2IpfTtoLk09ZnVuY3Rpb24oYSl7aWYoXCIucHJpb3JpdHlcIj09PWEpcmV0dXJuIHRoaXMuQSgpO2E9dGhpcy5tLmdldChhKTtyZXR1cm4gbnVsbD09PWE/QzphfTtoLm9hPWZ1bmN0aW9uKGEpe3ZhciBiPU8oYSk7cmV0dXJuIG51bGw9PT1iP3RoaXM6dGhpcy5NKGIpLm9hKEcoYSkpfTtoLkhhPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09dGhpcy5tLmdldChhKX07XG5oLlE9ZnVuY3Rpb24oYSxiKXtKKGIsXCJXZSBzaG91bGQgYWx3YXlzIGJlIHBhc3Npbmcgc25hcHNob3Qgbm9kZXNcIik7aWYoXCIucHJpb3JpdHlcIj09PWEpcmV0dXJuIHRoaXMuZGEoYik7dmFyIGM9bmV3IEUoYSxiKSxkLGU7Yi5lKCk/KGQ9dGhpcy5tLnJlbW92ZShhKSxjPWllKHRoaXMud2IsYyx0aGlzLm0pKTooZD10aGlzLm0uTmEoYSxiKSxjPWdlKHRoaXMud2IsYyx0aGlzLm0pKTtlPWQuZSgpP0M6dGhpcy5iYTtyZXR1cm4gbmV3IFQoZCxlLGMpfTtoLkc9ZnVuY3Rpb24oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO0ooXCIucHJpb3JpdHlcIiE9PU8oYSl8fDE9PT11YyhhKSxcIi5wcmlvcml0eSBtdXN0IGJlIHRoZSBsYXN0IHRva2VuIGluIGEgcGF0aFwiKTt2YXIgZD10aGlzLk0oYykuRyhHKGEpLGIpO3JldHVybiB0aGlzLlEoYyxkKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubS5lKCl9O2guRGI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tLmNvdW50KCl9O1xudmFyIG5lPS9eKDB8WzEtOV1cXGQqKSQvO2g9VC5wcm90b3R5cGU7aC5LPWZ1bmN0aW9uKGEpe2lmKHRoaXMuZSgpKXJldHVybiBudWxsO3ZhciBiPXt9LGM9MCxkPTAsZT0hMDt0aGlzLlUoTSxmdW5jdGlvbihmLGcpe2JbZl09Zy5LKGEpO2MrKztlJiZuZS50ZXN0KGYpP2Q9TWF0aC5tYXgoZCxOdW1iZXIoZikpOmU9ITF9KTtpZighYSYmZSYmZDwyKmMpe3ZhciBmPVtdLGc7Zm9yKGcgaW4gYilmW2ddPWJbZ107cmV0dXJuIGZ9YSYmIXRoaXMuQSgpLmUoKSYmKGJbXCIucHJpb3JpdHlcIl09dGhpcy5BKCkuSygpKTtyZXR1cm4gYn07aC5oYXNoPWZ1bmN0aW9uKCl7aWYobnVsbD09PXRoaXMuQmIpe3ZhciBhPVwiXCI7dGhpcy5BKCkuZSgpfHwoYSs9XCJwcmlvcml0eTpcIitsZSh0aGlzLkEoKS5LKCkpK1wiOlwiKTt0aGlzLlUoTSxmdW5jdGlvbihiLGMpe3ZhciBkPWMuaGFzaCgpO1wiXCIhPT1kJiYoYSs9XCI6XCIrYitcIjpcIitkKX0pO3RoaXMuQmI9XCJcIj09PWE/XCJcIjpKYyhhKX1yZXR1cm4gdGhpcy5CYn07XG5oLnFmPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4oYz1vZSh0aGlzLGMpKT8oYT1jYyhjLG5ldyBFKGEsYikpKT9hLm5hbWU6bnVsbDpjYyh0aGlzLm0sYSl9O2Z1bmN0aW9uIHdkKGEsYil7dmFyIGM7Yz0oYz1vZShhLGIpKT8oYz1jLlJjKCkpJiZjLm5hbWU6YS5tLlJjKCk7cmV0dXJuIGM/bmV3IEUoYyxhLm0uZ2V0KGMpKTpudWxsfWZ1bmN0aW9uIHhkKGEsYil7dmFyIGM7Yz0oYz1vZShhLGIpKT8oYz1jLmVjKCkpJiZjLm5hbWU6YS5tLmVjKCk7cmV0dXJuIGM/bmV3IEUoYyxhLm0uZ2V0KGMpKTpudWxsfWguVT1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYSk7cmV0dXJuIGM/Yy5oYShmdW5jdGlvbihhKXtyZXR1cm4gYihhLm5hbWUsYS5TKX0pOnRoaXMubS5oYShiKX07aC5XYj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5YYihhLlNjKCksYSl9O1xuaC5YYj1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYik7aWYoYylyZXR1cm4gYy5YYihhLGZ1bmN0aW9uKGEpe3JldHVybiBhfSk7Zm9yKHZhciBjPXRoaXMubS5YYihhLm5hbWUsUWIpLGQ9ZWMoYyk7bnVsbCE9ZCYmMD5iLmNvbXBhcmUoZCxhKTspSChjKSxkPWVjKGMpO3JldHVybiBjfTtoLnJmPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlpiKGEuUGMoKSxhKX07aC5aYj1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYik7aWYoYylyZXR1cm4gYy5aYihhLGZ1bmN0aW9uKGEpe3JldHVybiBhfSk7Zm9yKHZhciBjPXRoaXMubS5aYihhLm5hbWUsUWIpLGQ9ZWMoYyk7bnVsbCE9ZCYmMDxiLmNvbXBhcmUoZCxhKTspSChjKSxkPWVjKGMpO3JldHVybiBjfTtoLkNjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmUoKT9hLmUoKT8wOi0xOmEuTigpfHxhLmUoKT8xOmE9PT1TZD8tMTowfTtcbmgubWI9ZnVuY3Rpb24oYSl7aWYoYT09PVZkfHx0YSh0aGlzLndiLmNjLGEudG9TdHJpbmcoKSkpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy53YixjPXRoaXMubTtKKGEhPT1WZCxcIktleUluZGV4IGFsd2F5cyBleGlzdHMgYW5kIGlzbid0IG1lYW50IHRvIGJlIGFkZGVkIHRvIHRoZSBJbmRleE1hcC5cIik7Zm9yKHZhciBkPVtdLGU9ITEsYz1jLldiKFFiKSxmPUgoYyk7ZjspZT1lfHxhLkhjKGYuUyksZC5wdXNoKGYpLGY9SChjKTtkPWU/aGUoZCx1ZChhKSk6UGQ7ZT1hLnRvU3RyaW5nKCk7Yz14YShiLmNjKTtjW2VdPWE7YT14YShiLnlkKTthW2VdPWQ7cmV0dXJuIG5ldyBUKHRoaXMubSx0aGlzLmJhLG5ldyBmZShhLGMpKX07aC5JYz1mdW5jdGlvbihhKXtyZXR1cm4gYT09PVZkfHx0YSh0aGlzLndiLmNjLGEudG9TdHJpbmcoKSl9O1xuaC5aPWZ1bmN0aW9uKGEpe2lmKGE9PT10aGlzKXJldHVybiEwO2lmKGEuTigpKXJldHVybiExO2lmKHRoaXMuQSgpLlooYS5BKCkpJiZ0aGlzLm0uY291bnQoKT09PWEubS5jb3VudCgpKXt2YXIgYj10aGlzLldiKE0pO2E9YS5XYihNKTtmb3IodmFyIGM9SChiKSxkPUgoYSk7YyYmZDspe2lmKGMubmFtZSE9PWQubmFtZXx8IWMuUy5aKGQuUykpcmV0dXJuITE7Yz1IKGIpO2Q9SChhKX1yZXR1cm4gbnVsbD09PWMmJm51bGw9PT1kfXJldHVybiExfTtmdW5jdGlvbiBvZShhLGIpe3JldHVybiBiPT09VmQ/bnVsbDphLndiLmdldChiLnRvU3RyaW5nKCkpfWgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQih0aGlzLksoITApKX07ZnVuY3Rpb24gTChhLGIpe2lmKG51bGw9PT1hKXJldHVybiBDO3ZhciBjPW51bGw7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi5wcmlvcml0eVwiaW4gYT9jPWFbXCIucHJpb3JpdHlcIl06XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiJiYoYz1iKTtKKG51bGw9PT1jfHxcInN0cmluZ1wiPT09dHlwZW9mIGN8fFwibnVtYmVyXCI9PT10eXBlb2YgY3x8XCJvYmplY3RcIj09PXR5cGVvZiBjJiZcIi5zdlwiaW4gYyxcIkludmFsaWQgcHJpb3JpdHkgdHlwZSBmb3VuZDogXCIrdHlwZW9mIGMpO1wib2JqZWN0XCI9PT10eXBlb2YgYSYmXCIudmFsdWVcImluIGEmJm51bGwhPT1hW1wiLnZhbHVlXCJdJiYoYT1hW1wiLnZhbHVlXCJdKTtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fFwiLnN2XCJpbiBhKXJldHVybiBuZXcgdGMoYSxMKGMpKTtpZihhIGluc3RhbmNlb2YgQXJyYXkpe3ZhciBkPUMsZT1hO3IoZSxmdW5jdGlvbihhLGIpe2lmKHUoZSxiKSYmXCIuXCIhPT1iLnN1YnN0cmluZygwLDEpKXt2YXIgYz1MKGEpO2lmKGMuTigpfHwhYy5lKCkpZD1cbmQuUShiLGMpfX0pO3JldHVybiBkLmRhKEwoYykpfXZhciBmPVtdLGc9ITEsaz1hO2hiKGssZnVuY3Rpb24oYSl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhfHxcIi5cIiE9PWEuc3Vic3RyaW5nKDAsMSkpe3ZhciBiPUwoa1thXSk7Yi5lKCl8fChnPWd8fCFiLkEoKS5lKCksZi5wdXNoKG5ldyBFKGEsYikpKX19KTtpZigwPT1mLmxlbmd0aClyZXR1cm4gQzt2YXIgbD1oZShmLFJiLGZ1bmN0aW9uKGEpe3JldHVybiBhLm5hbWV9LFRiKTtpZihnKXt2YXIgbT1oZShmLHVkKE0pKTtyZXR1cm4gbmV3IFQobCxMKGMpLG5ldyBmZSh7XCIucHJpb3JpdHlcIjptfSx7XCIucHJpb3JpdHlcIjpNfSkpfXJldHVybiBuZXcgVChsLEwoYyksamUpfXZhciBwZT1NYXRoLmxvZygyKTtcbmZ1bmN0aW9uIHFlKGEpe3RoaXMuY291bnQ9cGFyc2VJbnQoTWF0aC5sb2coYSsxKS9wZSwxMCk7dGhpcy5oZj10aGlzLmNvdW50LTE7dGhpcy5iZz1hKzEmcGFyc2VJbnQoQXJyYXkodGhpcy5jb3VudCsxKS5qb2luKFwiMVwiKSwyKX1mdW5jdGlvbiByZShhKXt2YXIgYj0hKGEuYmcmMTw8YS5oZik7YS5oZi0tO3JldHVybiBifVxuZnVuY3Rpb24gaGUoYSxiLGMsZCl7ZnVuY3Rpb24gZShiLGQpe3ZhciBmPWQtYjtpZigwPT1mKXJldHVybiBudWxsO2lmKDE9PWYpe3ZhciBtPWFbYl0sdj1jP2MobSk6bTtyZXR1cm4gbmV3IGZjKHYsbS5TLCExLG51bGwsbnVsbCl9dmFyIG09cGFyc2VJbnQoZi8yLDEwKStiLGY9ZShiLG0pLHk9ZShtKzEsZCksbT1hW21dLHY9Yz9jKG0pOm07cmV0dXJuIG5ldyBmYyh2LG0uUywhMSxmLHkpfWEuc29ydChiKTt2YXIgZj1mdW5jdGlvbihiKXtmdW5jdGlvbiBkKGIsZyl7dmFyIGs9di1iLHk9djt2LT1iO3ZhciB5PWUoaysxLHkpLGs9YVtrXSxJPWM/YyhrKTprLHk9bmV3IGZjKEksay5TLGcsbnVsbCx5KTtmP2YubGVmdD15Om09eTtmPXl9Zm9yKHZhciBmPW51bGwsbT1udWxsLHY9YS5sZW5ndGgseT0wO3k8Yi5jb3VudDsrK3kpe3ZhciBJPXJlKGIpLHZkPU1hdGgucG93KDIsYi5jb3VudC0oeSsxKSk7ST9kKHZkLCExKTooZCh2ZCwhMSksZCh2ZCwhMCkpfXJldHVybiBtfShuZXcgcWUoYS5sZW5ndGgpKTtcbnJldHVybiBudWxsIT09Zj9uZXcgYWMoZHx8YixmKTpuZXcgYWMoZHx8Yil9ZnVuY3Rpb24gbGUoYSl7cmV0dXJuXCJudW1iZXJcIj09PXR5cGVvZiBhP1wibnVtYmVyOlwiK1pjKGEpOlwic3RyaW5nOlwiK2F9ZnVuY3Rpb24ga2UoYSl7aWYoYS5OKCkpe3ZhciBiPWEuSygpO0ooXCJzdHJpbmdcIj09PXR5cGVvZiBifHxcIm51bWJlclwiPT09dHlwZW9mIGJ8fFwib2JqZWN0XCI9PT10eXBlb2YgYiYmdShiLFwiLnN2XCIpLFwiUHJpb3JpdHkgbXVzdCBiZSBhIHN0cmluZyBvciBudW1iZXIuXCIpfWVsc2UgSihhPT09U2R8fGEuZSgpLFwicHJpb3JpdHkgb2YgdW5leHBlY3RlZCB0eXBlLlwiKTtKKGE9PT1TZHx8YS5BKCkuZSgpLFwiUHJpb3JpdHkgbm9kZXMgY2FuJ3QgaGF2ZSBhIHByaW9yaXR5IG9mIHRoZWlyIG93bi5cIil9dmFyIEM9bmV3IFQobmV3IGFjKFRiKSxudWxsLGplKTtmdW5jdGlvbiBzZSgpe1QuY2FsbCh0aGlzLG5ldyBhYyhUYiksQyxqZSl9bWEoc2UsVCk7aD1zZS5wcm90b3R5cGU7XG5oLkNjPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpcz8wOjF9O2guWj1mdW5jdGlvbihhKXtyZXR1cm4gYT09PXRoaXN9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLk09ZnVuY3Rpb24oKXtyZXR1cm4gQ307aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O3ZhciBTZD1uZXcgc2UsUWQ9bmV3IEUoXCJbTUlOX05BTUVdXCIsQyksWGQ9bmV3IEUoXCJbTUFYX05BTUVdXCIsU2QpO2Z1bmN0aW9uIElkKGEsYil7dGhpcy5EPWE7dGhpcy5VZD1ifWZ1bmN0aW9uIEZkKGEsYixjLGQpe3JldHVybiBuZXcgSWQobmV3IHNiKGIsYyxkKSxhLlVkKX1mdW5jdGlvbiBKZChhKXtyZXR1cm4gYS5ELiQ/YS5ELmooKTpudWxsfUlkLnByb3RvdHlwZS51PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuVWR9O2Z1bmN0aW9uIHRiKGEpe3JldHVybiBhLlVkLiQ/YS5VZC5qKCk6bnVsbH07ZnVuY3Rpb24gdGUoYSxiKXt0aGlzLlY9YTt2YXIgYz1hLm8sZD1uZXcgbGQoYy5nKSxjPWRlKGMpP25ldyBsZChjLmcpOmMuaWE/bmV3IHJkKGMpOm5ldyBtZChjKTt0aGlzLkdmPW5ldyB6ZChjKTt2YXIgZT1iLnUoKSxmPWIuRCxnPWQudGEoQyxlLmooKSxudWxsKSxrPWMudGEoQyxmLmooKSxudWxsKTt0aGlzLkthPW5ldyBJZChuZXcgc2IoayxmLiQsYy5HYSgpKSxuZXcgc2IoZyxlLiQsZC5HYSgpKSk7dGhpcy5aYT1bXTt0aGlzLmlnPW5ldyBkZChhKX1mdW5jdGlvbiB1ZShhKXtyZXR1cm4gYS5WfWg9dGUucHJvdG90eXBlO2gudT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkthLnUoKS5qKCl9O2guaGI9ZnVuY3Rpb24oYSl7dmFyIGI9dGIodGhpcy5LYSk7cmV0dXJuIGImJihkZSh0aGlzLlYubyl8fCFhLmUoKSYmIWIuTShPKGEpKS5lKCkpP2Iub2EoYSk6bnVsbH07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PT10aGlzLlphLmxlbmd0aH07aC5PYj1mdW5jdGlvbihhKXt0aGlzLlphLnB1c2goYSl9O1xuaC5rYj1mdW5jdGlvbihhLGIpe3ZhciBjPVtdO2lmKGIpe0oobnVsbD09YSxcIkEgY2FuY2VsIHNob3VsZCBjYW5jZWwgYWxsIGV2ZW50IHJlZ2lzdHJhdGlvbnMuXCIpO3ZhciBkPXRoaXMuVi5wYXRoO09hKHRoaXMuWmEsZnVuY3Rpb24oYSl7KGE9YS5mZihiLGQpKSYmYy5wdXNoKGEpfSl9aWYoYSl7Zm9yKHZhciBlPVtdLGY9MDtmPHRoaXMuWmEubGVuZ3RoOysrZil7dmFyIGc9dGhpcy5aYVtmXTtpZighZy5tYXRjaGVzKGEpKWUucHVzaChnKTtlbHNlIGlmKGEuc2YoKSl7ZT1lLmNvbmNhdCh0aGlzLlphLnNsaWNlKGYrMSkpO2JyZWFrfX10aGlzLlphPWV9ZWxzZSB0aGlzLlphPVtdO3JldHVybiBjfTtcbmguYmI9ZnVuY3Rpb24oYSxiLGMpe2EudHlwZT09PUNkJiZudWxsIT09YS5zb3VyY2UuSWImJihKKHRiKHRoaXMuS2EpLFwiV2Ugc2hvdWxkIGFsd2F5cyBoYXZlIGEgZnVsbCBjYWNoZSBiZWZvcmUgaGFuZGxpbmcgbWVyZ2VzXCIpLEooSmQodGhpcy5LYSksXCJNaXNzaW5nIGV2ZW50IGNhY2hlLCBldmVuIHRob3VnaCB3ZSBoYXZlIGEgc2VydmVyIGNhY2hlXCIpKTt2YXIgZD10aGlzLkthO2E9dGhpcy5HZi5iYihkLGEsYixjKTtiPXRoaXMuR2Y7Yz1hLmhlO0ooYy5ELmooKS5JYyhiLkkuZyksXCJFdmVudCBzbmFwIG5vdCBpbmRleGVkXCIpO0ooYy51KCkuaigpLkljKGIuSS5nKSxcIlNlcnZlciBzbmFwIG5vdCBpbmRleGVkXCIpO0ooSGIoYS5oZS51KCkpfHwhSGIoZC51KCkpLFwiT25jZSBhIHNlcnZlciBzbmFwIGlzIGNvbXBsZXRlLCBpdCBzaG91bGQgbmV2ZXIgZ28gYmFja1wiKTt0aGlzLkthPWEuaGU7cmV0dXJuIHZlKHRoaXMsYS5jZyxhLmhlLkQuaigpLG51bGwpfTtcbmZ1bmN0aW9uIHdlKGEsYil7dmFyIGM9YS5LYS5ELGQ9W107Yy5qKCkuTigpfHxjLmooKS5VKE0sZnVuY3Rpb24oYSxiKXtkLnB1c2gobmV3IEQoXCJjaGlsZF9hZGRlZFwiLGIsYSkpfSk7Yy4kJiZkLnB1c2goRGIoYy5qKCkpKTtyZXR1cm4gdmUoYSxkLGMuaigpLGIpfWZ1bmN0aW9uIHZlKGEsYixjLGQpe3JldHVybiBlZChhLmlnLGIsYyxkP1tkXTphLlphKX07ZnVuY3Rpb24geGUoYSxiLGMpe3RoaXMudHlwZT1DZDt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1iO3RoaXMuY2hpbGRyZW49Y314ZS5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oYSl7aWYodGhpcy5wYXRoLmUoKSlyZXR1cm4gYT10aGlzLmNoaWxkcmVuLnN1YnRyZWUobmV3IEsoYSkpLGEuZSgpP251bGw6YS52YWx1ZT9uZXcgVWIodGhpcy5zb3VyY2UsRixhLnZhbHVlKTpuZXcgeGUodGhpcy5zb3VyY2UsRixhKTtKKE8odGhpcy5wYXRoKT09PWEsXCJDYW4ndCBnZXQgYSBtZXJnZSBmb3IgYSBjaGlsZCBub3Qgb24gdGhlIHBhdGggb2YgdGhlIG9wZXJhdGlvblwiKTtyZXR1cm4gbmV3IHhlKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSx0aGlzLmNoaWxkcmVuKX07eGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIG1lcmdlOiBcIit0aGlzLmNoaWxkcmVuLnRvU3RyaW5nKCkrXCIpXCJ9O3ZhciBWYj0wLENkPTEsWGI9MiwkYj0zO2Z1bmN0aW9uIHllKGEsYixjLGQpe3RoaXMudmU9YTt0aGlzLm9mPWI7dGhpcy5JYj1jO3RoaXMuYWY9ZDtKKCFkfHxiLFwiVGFnZ2VkIHF1ZXJpZXMgbXVzdCBiZSBmcm9tIHNlcnZlci5cIil9dmFyIFliPW5ldyB5ZSghMCwhMSxudWxsLCExKSx6ZT1uZXcgeWUoITEsITAsbnVsbCwhMSk7eWUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmU/XCJ1c2VyXCI6dGhpcy5hZj9cInNlcnZlcihxdWVyeUlEPVwiK3RoaXMuSWIrXCIpXCI6XCJzZXJ2ZXJcIn07ZnVuY3Rpb24gQWUoYSxiKXt0aGlzLmY9T2MoXCJwOnJlc3Q6XCIpO3RoaXMuSD1hO3RoaXMuR2I9Yjt0aGlzLkZhPW51bGw7dGhpcy5hYT17fX1mdW5jdGlvbiBCZShhLGIpe2lmKG4oYikpcmV0dXJuXCJ0YWckXCIrYjt2YXIgYz1hLm87SihkZShjKSYmYy5nPT1NLFwic2hvdWxkIGhhdmUgYSB0YWcgaWYgaXQncyBub3QgYSBkZWZhdWx0IHF1ZXJ5LlwiKTtyZXR1cm4gYS5wYXRoLnRvU3RyaW5nKCl9aD1BZS5wcm90b3R5cGU7XG5oLnhmPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEucGF0aC50b1N0cmluZygpO3RoaXMuZihcIkxpc3RlbiBjYWxsZWQgZm9yIFwiK2UrXCIgXCIrYS53YSgpKTt2YXIgZj1CZShhLGMpLGc9e307dGhpcy5hYVtmXT1nO2E9ZWUoYS5vKTt2YXIgaz10aGlzO0NlKHRoaXMsZStcIi5qc29uXCIsYSxmdW5jdGlvbihhLGIpe3ZhciB2PWI7NDA0PT09YSYmKGE9dj1udWxsKTtudWxsPT09YSYmay5HYihlLHYsITEsYyk7dyhrLmFhLGYpPT09ZyYmZChhPzQwMT09YT9cInBlcm1pc3Npb25fZGVuaWVkXCI6XCJyZXN0X2Vycm9yOlwiK2E6XCJva1wiLG51bGwpfSl9O2guT2Y9ZnVuY3Rpb24oYSxiKXt2YXIgYz1CZShhLGIpO2RlbGV0ZSB0aGlzLmFhW2NdfTtoLlA9ZnVuY3Rpb24oYSxiKXt0aGlzLkZhPWE7dmFyIGM9YWQoYSksZD1jLmRhdGEsYz1jLkFjJiZjLkFjLmV4cDtiJiZiKFwib2tcIix7YXV0aDpkLGV4cGlyZXM6Y30pfTtoLmVlPWZ1bmN0aW9uKGEpe3RoaXMuRmE9bnVsbDthKFwib2tcIixudWxsKX07XG5oLkxlPWZ1bmN0aW9uKCl7fTtoLkJmPWZ1bmN0aW9uKCl7fTtoLkdkPWZ1bmN0aW9uKCl7fTtoLnB1dD1mdW5jdGlvbigpe307aC55Zj1mdW5jdGlvbigpe307aC5UZT1mdW5jdGlvbigpe307XG5mdW5jdGlvbiBDZShhLGIsYyxkKXtjPWN8fHt9O2MuZm9ybWF0PVwiZXhwb3J0XCI7YS5GYSYmKGMuYXV0aD1hLkZhKTt2YXIgZT0oYS5ILmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrYS5ILmhvc3QrYitcIj9cIitqYihjKTthLmYoXCJTZW5kaW5nIFJFU1QgcmVxdWVzdCBmb3IgXCIrZSk7dmFyIGY9bmV3IFhNTEh0dHBSZXF1ZXN0O2Yub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoZCYmND09PWYucmVhZHlTdGF0ZSl7YS5mKFwiUkVTVCBSZXNwb25zZSBmb3IgXCIrZStcIiByZWNlaXZlZC4gc3RhdHVzOlwiLGYuc3RhdHVzLFwicmVzcG9uc2U6XCIsZi5yZXNwb25zZVRleHQpO3ZhciBiPW51bGw7aWYoMjAwPD1mLnN0YXR1cyYmMzAwPmYuc3RhdHVzKXt0cnl7Yj1tYihmLnJlc3BvbnNlVGV4dCl9Y2F0Y2goYyl7UShcIkZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlIGZvciBcIitlK1wiOiBcIitmLnJlc3BvbnNlVGV4dCl9ZChudWxsLGIpfWVsc2UgNDAxIT09Zi5zdGF0dXMmJjQwNCE9PVxuZi5zdGF0dXMmJlEoXCJHb3QgdW5zdWNjZXNzZnVsIFJFU1QgcmVzcG9uc2UgZm9yIFwiK2UrXCIgU3RhdHVzOiBcIitmLnN0YXR1cyksZChmLnN0YXR1cyk7ZD1udWxsfX07Zi5vcGVuKFwiR0VUXCIsZSwhMCk7Zi5zZW5kKCl9O2Z1bmN0aW9uIERlKGEsYil7dGhpcy52YWx1ZT1hO3RoaXMuY2hpbGRyZW49Ynx8RWV9dmFyIEVlPW5ldyBhYyhmdW5jdGlvbihhLGIpe3JldHVybiBhPT09Yj8wOmE8Yj8tMToxfSk7ZnVuY3Rpb24gRmUoYSl7dmFyIGI9TmQ7cihhLGZ1bmN0aW9uKGEsZCl7Yj1iLnNldChuZXcgSyhkKSxhKX0pO3JldHVybiBifWg9RGUucHJvdG90eXBlO2guZT1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy52YWx1ZSYmdGhpcy5jaGlsZHJlbi5lKCl9O2Z1bmN0aW9uIEdlKGEsYixjKXtpZihudWxsIT1hLnZhbHVlJiZjKGEudmFsdWUpKXJldHVybntwYXRoOkYsdmFsdWU6YS52YWx1ZX07aWYoYi5lKCkpcmV0dXJuIG51bGw7dmFyIGQ9TyhiKTthPWEuY2hpbGRyZW4uZ2V0KGQpO3JldHVybiBudWxsIT09YT8oYj1HZShhLEcoYiksYyksbnVsbCE9Yj97cGF0aDoobmV3IEsoZCkpLncoYi5wYXRoKSx2YWx1ZTpiLnZhbHVlfTpudWxsKTpudWxsfVxuZnVuY3Rpb24gSGUoYSxiKXtyZXR1cm4gR2UoYSxiLGZ1bmN0aW9uKCl7cmV0dXJuITB9KX1oLnN1YnRyZWU9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5jaGlsZHJlbi5nZXQoTyhhKSk7cmV0dXJuIG51bGwhPT1iP2Iuc3VidHJlZShHKGEpKTpOZH07aC5zZXQ9ZnVuY3Rpb24oYSxiKXtpZihhLmUoKSlyZXR1cm4gbmV3IERlKGIsdGhpcy5jaGlsZHJlbik7dmFyIGM9TyhhKSxkPSh0aGlzLmNoaWxkcmVuLmdldChjKXx8TmQpLnNldChHKGEpLGIpLGM9dGhpcy5jaGlsZHJlbi5OYShjLGQpO3JldHVybiBuZXcgRGUodGhpcy52YWx1ZSxjKX07XG5oLnJlbW92ZT1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpcy5jaGlsZHJlbi5lKCk/TmQ6bmV3IERlKG51bGwsdGhpcy5jaGlsZHJlbik7dmFyIGI9TyhhKSxjPXRoaXMuY2hpbGRyZW4uZ2V0KGIpO3JldHVybiBjPyhhPWMucmVtb3ZlKEcoYSkpLGI9YS5lKCk/dGhpcy5jaGlsZHJlbi5yZW1vdmUoYik6dGhpcy5jaGlsZHJlbi5OYShiLGEpLG51bGw9PT10aGlzLnZhbHVlJiZiLmUoKT9OZDpuZXcgRGUodGhpcy52YWx1ZSxiKSk6dGhpc307aC5nZXQ9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIHRoaXMudmFsdWU7dmFyIGI9dGhpcy5jaGlsZHJlbi5nZXQoTyhhKSk7cmV0dXJuIGI/Yi5nZXQoRyhhKSk6bnVsbH07XG5mdW5jdGlvbiBNZChhLGIsYyl7aWYoYi5lKCkpcmV0dXJuIGM7dmFyIGQ9TyhiKTtiPU1kKGEuY2hpbGRyZW4uZ2V0KGQpfHxOZCxHKGIpLGMpO2Q9Yi5lKCk/YS5jaGlsZHJlbi5yZW1vdmUoZCk6YS5jaGlsZHJlbi5OYShkLGIpO3JldHVybiBuZXcgRGUoYS52YWx1ZSxkKX1mdW5jdGlvbiBJZShhLGIpe3JldHVybiBKZShhLEYsYil9ZnVuY3Rpb24gSmUoYSxiLGMpe3ZhciBkPXt9O2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxmKXtkW2FdPUplKGYsYi53KGEpLGMpfSk7cmV0dXJuIGMoYixhLnZhbHVlLGQpfWZ1bmN0aW9uIEtlKGEsYixjKXtyZXR1cm4gTGUoYSxiLEYsYyl9ZnVuY3Rpb24gTGUoYSxiLGMsZCl7dmFyIGU9YS52YWx1ZT9kKGMsYS52YWx1ZSk6ITE7aWYoZSlyZXR1cm4gZTtpZihiLmUoKSlyZXR1cm4gbnVsbDtlPU8oYik7cmV0dXJuKGE9YS5jaGlsZHJlbi5nZXQoZSkpP0xlKGEsRyhiKSxjLncoZSksZCk6bnVsbH1cbmZ1bmN0aW9uIE1lKGEsYixjKXt2YXIgZD1GO2lmKCFiLmUoKSl7dmFyIGU9ITA7YS52YWx1ZSYmKGU9YyhkLGEudmFsdWUpKTshMD09PWUmJihlPU8oYiksKGE9YS5jaGlsZHJlbi5nZXQoZSkpJiZOZShhLEcoYiksZC53KGUpLGMpKX19ZnVuY3Rpb24gTmUoYSxiLGMsZCl7aWYoYi5lKCkpcmV0dXJuIGE7YS52YWx1ZSYmZChjLGEudmFsdWUpO3ZhciBlPU8oYik7cmV0dXJuKGE9YS5jaGlsZHJlbi5nZXQoZSkpP05lKGEsRyhiKSxjLncoZSksZCk6TmR9ZnVuY3Rpb24gS2QoYSxiKXtPZShhLEYsYil9ZnVuY3Rpb24gT2UoYSxiLGMpe2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxlKXtPZShlLGIudyhhKSxjKX0pO2EudmFsdWUmJmMoYixhLnZhbHVlKX1mdW5jdGlvbiBQZShhLGIpe2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxkKXtkLnZhbHVlJiZiKGEsZC52YWx1ZSl9KX12YXIgTmQ9bmV3IERlKG51bGwpO1xuRGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGE9e307S2QodGhpcyxmdW5jdGlvbihiLGMpe2FbYi50b1N0cmluZygpXT1jLnRvU3RyaW5nKCl9KTtyZXR1cm4gQihhKX07ZnVuY3Rpb24gUWUoYSl7dGhpcy5XPWF9dmFyIFJlPW5ldyBRZShuZXcgRGUobnVsbCkpO2Z1bmN0aW9uIFNlKGEsYixjKXtpZihiLmUoKSlyZXR1cm4gbmV3IFFlKG5ldyBEZShjKSk7dmFyIGQ9SGUoYS5XLGIpO2lmKG51bGwhPWQpe3ZhciBlPWQucGF0aCxkPWQudmFsdWU7Yj1OKGUsYik7ZD1kLkcoYixjKTtyZXR1cm4gbmV3IFFlKGEuVy5zZXQoZSxkKSl9YT1NZChhLlcsYixuZXcgRGUoYykpO3JldHVybiBuZXcgUWUoYSl9ZnVuY3Rpb24gVGUoYSxiLGMpe3ZhciBkPWE7aGIoYyxmdW5jdGlvbihhLGMpe2Q9U2UoZCxiLncoYSksYyl9KTtyZXR1cm4gZH1RZS5wcm90b3R5cGUuT2Q9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIFJlO2E9TWQodGhpcy5XLGEsTmQpO3JldHVybiBuZXcgUWUoYSl9O2Z1bmN0aW9uIFVlKGEsYil7dmFyIGM9SGUoYS5XLGIpO3JldHVybiBudWxsIT1jP2EuVy5nZXQoYy5wYXRoKS5vYShOKGMucGF0aCxiKSk6bnVsbH1cbmZ1bmN0aW9uIFZlKGEpe3ZhciBiPVtdLGM9YS5XLnZhbHVlO251bGwhPWM/Yy5OKCl8fGMuVShNLGZ1bmN0aW9uKGEsYyl7Yi5wdXNoKG5ldyBFKGEsYykpfSk6YS5XLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGEsYyl7bnVsbCE9Yy52YWx1ZSYmYi5wdXNoKG5ldyBFKGEsYy52YWx1ZSkpfSk7cmV0dXJuIGJ9ZnVuY3Rpb24gV2UoYSxiKXtpZihiLmUoKSlyZXR1cm4gYTt2YXIgYz1VZShhLGIpO3JldHVybiBudWxsIT1jP25ldyBRZShuZXcgRGUoYykpOm5ldyBRZShhLlcuc3VidHJlZShiKSl9UWUucHJvdG90eXBlLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5XLmUoKX07UWUucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGEpe3JldHVybiBYZShGLHRoaXMuVyxhKX07XG5mdW5jdGlvbiBYZShhLGIsYyl7aWYobnVsbCE9Yi52YWx1ZSlyZXR1cm4gYy5HKGEsYi52YWx1ZSk7dmFyIGQ9bnVsbDtiLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGIsZil7XCIucHJpb3JpdHlcIj09PWI/KEoobnVsbCE9PWYudmFsdWUsXCJQcmlvcml0eSB3cml0ZXMgbXVzdCBhbHdheXMgYmUgbGVhZiBub2Rlc1wiKSxkPWYudmFsdWUpOmM9WGUoYS53KGIpLGYsYyl9KTtjLm9hKGEpLmUoKXx8bnVsbD09PWR8fChjPWMuRyhhLncoXCIucHJpb3JpdHlcIiksZCkpO3JldHVybiBjfTtmdW5jdGlvbiBZZSgpe3RoaXMuVD1SZTt0aGlzLnphPVtdO3RoaXMuTGM9LTF9aD1ZZS5wcm90b3R5cGU7XG5oLk9kPWZ1bmN0aW9uKGEpe3ZhciBiPVVhKHRoaXMuemEsZnVuY3Rpb24oYil7cmV0dXJuIGIuaWU9PT1hfSk7SigwPD1iLFwicmVtb3ZlV3JpdGUgY2FsbGVkIHdpdGggbm9uZXhpc3RlbnQgd3JpdGVJZC5cIik7dmFyIGM9dGhpcy56YVtiXTt0aGlzLnphLnNwbGljZShiLDEpO2Zvcih2YXIgZD1jLnZpc2libGUsZT0hMSxmPXRoaXMuemEubGVuZ3RoLTE7ZCYmMDw9Zjspe3ZhciBnPXRoaXMuemFbZl07Zy52aXNpYmxlJiYoZj49YiYmWmUoZyxjLnBhdGgpP2Q9ITE6Yy5wYXRoLmNvbnRhaW5zKGcucGF0aCkmJihlPSEwKSk7Zi0tfWlmKGQpe2lmKGUpdGhpcy5UPSRlKHRoaXMuemEsYWYsRiksdGhpcy5MYz0wPHRoaXMuemEubGVuZ3RoP3RoaXMuemFbdGhpcy56YS5sZW5ndGgtMV0uaWU6LTE7ZWxzZSBpZihjLklhKXRoaXMuVD10aGlzLlQuT2QoYy5wYXRoKTtlbHNle3ZhciBrPXRoaXM7cihjLmNoaWxkcmVuLGZ1bmN0aW9uKGEsYil7ay5UPWsuVC5PZChjLnBhdGgudyhiKSl9KX1yZXR1cm4gYy5wYXRofXJldHVybiBudWxsfTtcbmgudWE9ZnVuY3Rpb24oYSxiLGMsZCl7aWYoY3x8ZCl7dmFyIGU9V2UodGhpcy5ULGEpO3JldHVybiFkJiZlLmUoKT9iOmR8fG51bGwhPWJ8fG51bGwhPVVlKGUsRik/KGU9JGUodGhpcy56YSxmdW5jdGlvbihiKXtyZXR1cm4oYi52aXNpYmxlfHxkKSYmKCFjfHwhKDA8PU5hKGMsYi5pZSkpKSYmKGIucGF0aC5jb250YWlucyhhKXx8YS5jb250YWlucyhiLnBhdGgpKX0sYSksYj1ifHxDLGUuYXBwbHkoYikpOm51bGx9ZT1VZSh0aGlzLlQsYSk7aWYobnVsbCE9ZSlyZXR1cm4gZTtlPVdlKHRoaXMuVCxhKTtyZXR1cm4gZS5lKCk/YjpudWxsIT1ifHxudWxsIT1VZShlLEYpPyhiPWJ8fEMsZS5hcHBseShiKSk6bnVsbH07XG5oLnhjPWZ1bmN0aW9uKGEsYil7dmFyIGM9QyxkPVVlKHRoaXMuVCxhKTtpZihkKWQuTigpfHxkLlUoTSxmdW5jdGlvbihhLGIpe2M9Yy5RKGEsYil9KTtlbHNlIGlmKGIpe3ZhciBlPVdlKHRoaXMuVCxhKTtiLlUoTSxmdW5jdGlvbihhLGIpe3ZhciBkPVdlKGUsbmV3IEsoYSkpLmFwcGx5KGIpO2M9Yy5RKGEsZCl9KTtPYShWZShlKSxmdW5jdGlvbihhKXtjPWMuUShhLm5hbWUsYS5TKX0pfWVsc2UgZT1XZSh0aGlzLlQsYSksT2EoVmUoZSksZnVuY3Rpb24oYSl7Yz1jLlEoYS5uYW1lLGEuUyl9KTtyZXR1cm4gY307aC5oZD1mdW5jdGlvbihhLGIsYyxkKXtKKGN8fGQsXCJFaXRoZXIgZXhpc3RpbmdFdmVudFNuYXAgb3IgZXhpc3RpbmdTZXJ2ZXJTbmFwIG11c3QgZXhpc3RcIik7YT1hLncoYik7aWYobnVsbCE9VWUodGhpcy5ULGEpKXJldHVybiBudWxsO2E9V2UodGhpcy5ULGEpO3JldHVybiBhLmUoKT9kLm9hKGIpOmEuYXBwbHkoZC5vYShiKSl9O1xuaC5YYT1mdW5jdGlvbihhLGIsYyl7YT1hLncoYik7dmFyIGQ9VWUodGhpcy5ULGEpO3JldHVybiBudWxsIT1kP2Q6cmIoYyxiKT9XZSh0aGlzLlQsYSkuYXBwbHkoYy5qKCkuTShiKSk6bnVsbH07aC5zYz1mdW5jdGlvbihhKXtyZXR1cm4gVWUodGhpcy5ULGEpfTtoLm1lPWZ1bmN0aW9uKGEsYixjLGQsZSxmKXt2YXIgZzthPVdlKHRoaXMuVCxhKTtnPVVlKGEsRik7aWYobnVsbD09ZylpZihudWxsIT1iKWc9YS5hcHBseShiKTtlbHNlIHJldHVybltdO2c9Zy5tYihmKTtpZihnLmUoKXx8Zy5OKCkpcmV0dXJuW107Yj1bXTthPXVkKGYpO2U9ZT9nLlpiKGMsZik6Zy5YYihjLGYpO2ZvcihmPUgoZSk7ZiYmYi5sZW5ndGg8ZDspMCE9PWEoZixjKSYmYi5wdXNoKGYpLGY9SChlKTtyZXR1cm4gYn07XG5mdW5jdGlvbiBaZShhLGIpe3JldHVybiBhLklhP2EucGF0aC5jb250YWlucyhiKTohIXVhKGEuY2hpbGRyZW4sZnVuY3Rpb24oYyxkKXtyZXR1cm4gYS5wYXRoLncoZCkuY29udGFpbnMoYil9KX1mdW5jdGlvbiBhZihhKXtyZXR1cm4gYS52aXNpYmxlfVxuZnVuY3Rpb24gJGUoYSxiLGMpe2Zvcih2YXIgZD1SZSxlPTA7ZTxhLmxlbmd0aDsrK2Upe3ZhciBmPWFbZV07aWYoYihmKSl7dmFyIGc9Zi5wYXRoO2lmKGYuSWEpYy5jb250YWlucyhnKT8oZz1OKGMsZyksZD1TZShkLGcsZi5JYSkpOmcuY29udGFpbnMoYykmJihnPU4oZyxjKSxkPVNlKGQsRixmLklhLm9hKGcpKSk7ZWxzZSBpZihmLmNoaWxkcmVuKWlmKGMuY29udGFpbnMoZykpZz1OKGMsZyksZD1UZShkLGcsZi5jaGlsZHJlbik7ZWxzZXtpZihnLmNvbnRhaW5zKGMpKWlmKGc9TihnLGMpLGcuZSgpKWQ9VGUoZCxGLGYuY2hpbGRyZW4pO2Vsc2UgaWYoZj13KGYuY2hpbGRyZW4sTyhnKSkpZj1mLm9hKEcoZykpLGQ9U2UoZCxGLGYpfWVsc2UgdGhyb3cgSGMoXCJXcml0ZVJlY29yZCBzaG91bGQgaGF2ZSAuc25hcCBvciAuY2hpbGRyZW5cIik7fX1yZXR1cm4gZH1mdW5jdGlvbiBiZihhLGIpe3RoaXMuTWI9YTt0aGlzLlc9Yn1oPWJmLnByb3RvdHlwZTtcbmgudWE9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLlcudWEodGhpcy5NYixhLGIsYyl9O2gueGM9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuVy54Yyh0aGlzLk1iLGEpfTtoLmhkPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5XLmhkKHRoaXMuTWIsYSxiLGMpfTtoLnNjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlcuc2ModGhpcy5NYi53KGEpKX07aC5tZT1mdW5jdGlvbihhLGIsYyxkLGUpe3JldHVybiB0aGlzLlcubWUodGhpcy5NYixhLGIsYyxkLGUpfTtoLlhhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuVy5YYSh0aGlzLk1iLGEsYil9O2gudz1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGJmKHRoaXMuTWIudyhhKSx0aGlzLlcpfTtmdW5jdGlvbiBjZigpe3RoaXMueWE9e319aD1jZi5wcm90b3R5cGU7aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHdhKHRoaXMueWEpfTtoLmJiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnNvdXJjZS5JYjtpZihudWxsIT09ZClyZXR1cm4gZD13KHRoaXMueWEsZCksSihudWxsIT1kLFwiU3luY1RyZWUgZ2F2ZSB1cyBhbiBvcCBmb3IgYW4gaW52YWxpZCBxdWVyeS5cIiksZC5iYihhLGIsYyk7dmFyIGU9W107cih0aGlzLnlhLGZ1bmN0aW9uKGQpe2U9ZS5jb25jYXQoZC5iYihhLGIsYykpfSk7cmV0dXJuIGV9O2guT2I9ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1hLndhKCksZz13KHRoaXMueWEsZik7aWYoIWcpe3ZhciBnPWMudWEoZT9kOm51bGwpLGs9ITE7Zz9rPSEwOihnPWQgaW5zdGFuY2VvZiBUP2MueGMoZCk6QyxrPSExKTtnPW5ldyB0ZShhLG5ldyBJZChuZXcgc2IoZyxrLCExKSxuZXcgc2IoZCxlLCExKSkpO3RoaXMueWFbZl09Z31nLk9iKGIpO3JldHVybiB3ZShnLGIpfTtcbmgua2I9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEud2EoKSxlPVtdLGY9W10sZz1udWxsIT1kZih0aGlzKTtpZihcImRlZmF1bHRcIj09PWQpe3ZhciBrPXRoaXM7cih0aGlzLnlhLGZ1bmN0aW9uKGEsZCl7Zj1mLmNvbmNhdChhLmtiKGIsYykpO2EuZSgpJiYoZGVsZXRlIGsueWFbZF0sZGUoYS5WLm8pfHxlLnB1c2goYS5WKSl9KX1lbHNle3ZhciBsPXcodGhpcy55YSxkKTtsJiYoZj1mLmNvbmNhdChsLmtiKGIsYykpLGwuZSgpJiYoZGVsZXRlIHRoaXMueWFbZF0sZGUobC5WLm8pfHxlLnB1c2gobC5WKSkpfWcmJm51bGw9PWRmKHRoaXMpJiZlLnB1c2gobmV3IFUoYS5rLGEucGF0aCkpO3JldHVybntIZzplLGpnOmZ9fTtmdW5jdGlvbiBlZihhKXtyZXR1cm4gUGEocmEoYS55YSksZnVuY3Rpb24oYSl7cmV0dXJuIWRlKGEuVi5vKX0pfWguaGI9ZnVuY3Rpb24oYSl7dmFyIGI9bnVsbDtyKHRoaXMueWEsZnVuY3Rpb24oYyl7Yj1ifHxjLmhiKGEpfSk7cmV0dXJuIGJ9O1xuZnVuY3Rpb24gZmYoYSxiKXtpZihkZShiLm8pKXJldHVybiBkZihhKTt2YXIgYz1iLndhKCk7cmV0dXJuIHcoYS55YSxjKX1mdW5jdGlvbiBkZihhKXtyZXR1cm4gdmEoYS55YSxmdW5jdGlvbihhKXtyZXR1cm4gZGUoYS5WLm8pfSl8fG51bGx9O2Z1bmN0aW9uIGdmKGEpe3RoaXMuc2E9TmQ7dGhpcy5IYj1uZXcgWWU7dGhpcy4kZT17fTt0aGlzLmtjPXt9O3RoaXMuTWM9YX1mdW5jdGlvbiBoZihhLGIsYyxkLGUpe3ZhciBmPWEuSGIsZz1lO0ooZD5mLkxjLFwiU3RhY2tpbmcgYW4gb2xkZXIgd3JpdGUgb24gdG9wIG9mIG5ld2VyIG9uZXNcIik7bihnKXx8KGc9ITApO2YuemEucHVzaCh7cGF0aDpiLElhOmMsaWU6ZCx2aXNpYmxlOmd9KTtnJiYoZi5UPVNlKGYuVCxiLGMpKTtmLkxjPWQ7cmV0dXJuIGU/amYoYSxuZXcgVWIoWWIsYixjKSk6W119ZnVuY3Rpb24ga2YoYSxiLGMsZCl7dmFyIGU9YS5IYjtKKGQ+ZS5MYyxcIlN0YWNraW5nIGFuIG9sZGVyIG1lcmdlIG9uIHRvcCBvZiBuZXdlciBvbmVzXCIpO2UuemEucHVzaCh7cGF0aDpiLGNoaWxkcmVuOmMsaWU6ZCx2aXNpYmxlOiEwfSk7ZS5UPVRlKGUuVCxiLGMpO2UuTGM9ZDtjPUZlKGMpO3JldHVybiBqZihhLG5ldyB4ZShZYixiLGMpKX1cbmZ1bmN0aW9uIGxmKGEsYixjKXtjPWN8fCExO2I9YS5IYi5PZChiKTtyZXR1cm4gbnVsbD09Yj9bXTpqZihhLG5ldyBXYihiLGMpKX1mdW5jdGlvbiBtZihhLGIsYyl7Yz1GZShjKTtyZXR1cm4gamYoYSxuZXcgeGUoemUsYixjKSl9ZnVuY3Rpb24gbmYoYSxiLGMsZCl7ZD1vZihhLGQpO2lmKG51bGwhPWQpe3ZhciBlPXBmKGQpO2Q9ZS5wYXRoO2U9ZS5JYjtiPU4oZCxiKTtjPW5ldyBVYihuZXcgeWUoITEsITAsZSwhMCksYixjKTtyZXR1cm4gcWYoYSxkLGMpfXJldHVybltdfWZ1bmN0aW9uIHJmKGEsYixjLGQpe2lmKGQ9b2YoYSxkKSl7dmFyIGU9cGYoZCk7ZD1lLnBhdGg7ZT1lLkliO2I9TihkLGIpO2M9RmUoYyk7Yz1uZXcgeGUobmV3IHllKCExLCEwLGUsITApLGIsYyk7cmV0dXJuIHFmKGEsZCxjKX1yZXR1cm5bXX1cbmdmLnByb3RvdHlwZS5PYj1mdW5jdGlvbihhLGIpe3ZhciBjPWEucGF0aCxkPW51bGwsZT0hMTtNZSh0aGlzLnNhLGMsZnVuY3Rpb24oYSxiKXt2YXIgZj1OKGEsYyk7ZD1iLmhiKGYpO2U9ZXx8bnVsbCE9ZGYoYik7cmV0dXJuIWR9KTt2YXIgZj10aGlzLnNhLmdldChjKTtmPyhlPWV8fG51bGwhPWRmKGYpLGQ9ZHx8Zi5oYihGKSk6KGY9bmV3IGNmLHRoaXMuc2E9dGhpcy5zYS5zZXQoYyxmKSk7dmFyIGc7bnVsbCE9ZD9nPSEwOihnPSExLGQ9QyxQZSh0aGlzLnNhLnN1YnRyZWUoYyksZnVuY3Rpb24oYSxiKXt2YXIgYz1iLmhiKEYpO2MmJihkPWQuUShhLGMpKX0pKTt2YXIgaz1udWxsIT1mZihmLGEpO2lmKCFrJiYhZGUoYS5vKSl7dmFyIGw9c2YoYSk7SighKGwgaW4gdGhpcy5rYyksXCJWaWV3IGRvZXMgbm90IGV4aXN0LCBidXQgd2UgaGF2ZSBhIHRhZ1wiKTt2YXIgbT10ZisrO3RoaXMua2NbbF09bTt0aGlzLiRlW1wiX1wiK21dPWx9Zz1mLk9iKGEsYixuZXcgYmYoYyx0aGlzLkhiKSxcbmQsZyk7a3x8ZXx8KGY9ZmYoZixhKSxnPWcuY29uY2F0KHVmKHRoaXMsYSxmKSkpO3JldHVybiBnfTtcbmdmLnByb3RvdHlwZS5rYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS5wYXRoLGU9dGhpcy5zYS5nZXQoZCksZj1bXTtpZihlJiYoXCJkZWZhdWx0XCI9PT1hLndhKCl8fG51bGwhPWZmKGUsYSkpKXtmPWUua2IoYSxiLGMpO2UuZSgpJiYodGhpcy5zYT10aGlzLnNhLnJlbW92ZShkKSk7ZT1mLkhnO2Y9Zi5qZztiPS0xIT09VWEoZSxmdW5jdGlvbihhKXtyZXR1cm4gZGUoYS5vKX0pO3ZhciBnPUtlKHRoaXMuc2EsZCxmdW5jdGlvbihhLGIpe3JldHVybiBudWxsIT1kZihiKX0pO2lmKGImJiFnJiYoZD10aGlzLnNhLnN1YnRyZWUoZCksIWQuZSgpKSlmb3IodmFyIGQ9dmYoZCksaz0wO2s8ZC5sZW5ndGg7KytrKXt2YXIgbD1kW2tdLG09bC5WLGw9d2YodGhpcyxsKTt0aGlzLk1jLlhlKG0seGYodGhpcyxtKSxsLnVkLGwuSil9aWYoIWcmJjA8ZS5sZW5ndGgmJiFjKWlmKGIpdGhpcy5NYy5aZChhLG51bGwpO2Vsc2V7dmFyIHY9dGhpcztPYShlLGZ1bmN0aW9uKGEpe2Eud2EoKTt2YXIgYj12LmtjW3NmKGEpXTtcbnYuTWMuWmQoYSxiKX0pfXlmKHRoaXMsZSl9cmV0dXJuIGZ9O2dmLnByb3RvdHlwZS51YT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuSGIsZD1LZSh0aGlzLnNhLGEsZnVuY3Rpb24oYixjKXt2YXIgZD1OKGIsYSk7aWYoZD1jLmhiKGQpKXJldHVybiBkfSk7cmV0dXJuIGMudWEoYSxkLGIsITApfTtmdW5jdGlvbiB2ZihhKXtyZXR1cm4gSWUoYSxmdW5jdGlvbihhLGMsZCl7aWYoYyYmbnVsbCE9ZGYoYykpcmV0dXJuW2RmKGMpXTt2YXIgZT1bXTtjJiYoZT1lZihjKSk7cihkLGZ1bmN0aW9uKGEpe2U9ZS5jb25jYXQoYSl9KTtyZXR1cm4gZX0pfWZ1bmN0aW9uIHlmKGEsYil7Zm9yKHZhciBjPTA7YzxiLmxlbmd0aDsrK2Mpe3ZhciBkPWJbY107aWYoIWRlKGQubykpe3ZhciBkPXNmKGQpLGU9YS5rY1tkXTtkZWxldGUgYS5rY1tkXTtkZWxldGUgYS4kZVtcIl9cIitlXX19fVxuZnVuY3Rpb24gdWYoYSxiLGMpe3ZhciBkPWIucGF0aCxlPXhmKGEsYik7Yz13ZihhLGMpO2I9YS5NYy5YZShiLGUsYy51ZCxjLkopO2Q9YS5zYS5zdWJ0cmVlKGQpO2lmKGUpSihudWxsPT1kZihkLnZhbHVlKSxcIklmIHdlJ3JlIGFkZGluZyBhIHF1ZXJ5LCBpdCBzaG91bGRuJ3QgYmUgc2hhZG93ZWRcIik7ZWxzZSBmb3IoZT1JZShkLGZ1bmN0aW9uKGEsYixjKXtpZighYS5lKCkmJmImJm51bGwhPWRmKGIpKXJldHVyblt1ZShkZihiKSldO3ZhciBkPVtdO2ImJihkPWQuY29uY2F0KFFhKGVmKGIpLGZ1bmN0aW9uKGEpe3JldHVybiBhLlZ9KSkpO3IoYyxmdW5jdGlvbihhKXtkPWQuY29uY2F0KGEpfSk7cmV0dXJuIGR9KSxkPTA7ZDxlLmxlbmd0aDsrK2QpYz1lW2RdLGEuTWMuWmQoYyx4ZihhLGMpKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIHdmKGEsYil7dmFyIGM9Yi5WLGQ9eGYoYSxjKTtyZXR1cm57dWQ6ZnVuY3Rpb24oKXtyZXR1cm4oYi51KCl8fEMpLmhhc2goKX0sSjpmdW5jdGlvbihiKXtpZihcIm9rXCI9PT1iKXtpZihkKXt2YXIgZj1jLnBhdGg7aWYoYj1vZihhLGQpKXt2YXIgZz1wZihiKTtiPWcucGF0aDtnPWcuSWI7Zj1OKGIsZik7Zj1uZXcgWmIobmV3IHllKCExLCEwLGcsITApLGYpO2I9cWYoYSxiLGYpfWVsc2UgYj1bXX1lbHNlIGI9amYoYSxuZXcgWmIoemUsYy5wYXRoKSk7cmV0dXJuIGJ9Zj1cIlVua25vd24gRXJyb3JcIjtcInRvb19iaWdcIj09PWI/Zj1cIlRoZSBkYXRhIHJlcXVlc3RlZCBleGNlZWRzIHRoZSBtYXhpbXVtIHNpemUgdGhhdCBjYW4gYmUgYWNjZXNzZWQgd2l0aCBhIHNpbmdsZSByZXF1ZXN0LlwiOlwicGVybWlzc2lvbl9kZW5pZWRcIj09Yj9mPVwiQ2xpZW50IGRvZXNuJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGFjY2VzcyB0aGUgZGVzaXJlZCBkYXRhLlwiOlwidW5hdmFpbGFibGVcIj09YiYmXG4oZj1cIlRoZSBzZXJ2aWNlIGlzIHVuYXZhaWxhYmxlXCIpO2Y9RXJyb3IoYitcIjogXCIrZik7Zi5jb2RlPWIudG9VcHBlckNhc2UoKTtyZXR1cm4gYS5rYihjLG51bGwsZil9fX1mdW5jdGlvbiBzZihhKXtyZXR1cm4gYS5wYXRoLnRvU3RyaW5nKCkrXCIkXCIrYS53YSgpfWZ1bmN0aW9uIHBmKGEpe3ZhciBiPWEuaW5kZXhPZihcIiRcIik7SigtMSE9PWImJmI8YS5sZW5ndGgtMSxcIkJhZCBxdWVyeUtleS5cIik7cmV0dXJue0liOmEuc3Vic3RyKGIrMSkscGF0aDpuZXcgSyhhLnN1YnN0cigwLGIpKX19ZnVuY3Rpb24gb2YoYSxiKXt2YXIgYz1hLiRlLGQ9XCJfXCIrYjtyZXR1cm4gZCBpbiBjP2NbZF06dm9pZCAwfWZ1bmN0aW9uIHhmKGEsYil7dmFyIGM9c2YoYik7cmV0dXJuIHcoYS5rYyxjKX12YXIgdGY9MTtcbmZ1bmN0aW9uIHFmKGEsYixjKXt2YXIgZD1hLnNhLmdldChiKTtKKGQsXCJNaXNzaW5nIHN5bmMgcG9pbnQgZm9yIHF1ZXJ5IHRhZyB0aGF0IHdlJ3JlIHRyYWNraW5nXCIpO3JldHVybiBkLmJiKGMsbmV3IGJmKGIsYS5IYiksbnVsbCl9ZnVuY3Rpb24gamYoYSxiKXtyZXR1cm4gemYoYSxiLGEuc2EsbnVsbCxuZXcgYmYoRixhLkhiKSl9ZnVuY3Rpb24gemYoYSxiLGMsZCxlKXtpZihiLnBhdGguZSgpKXJldHVybiBBZihhLGIsYyxkLGUpO3ZhciBmPWMuZ2V0KEYpO251bGw9PWQmJm51bGwhPWYmJihkPWYuaGIoRikpO3ZhciBnPVtdLGs9TyhiLnBhdGgpLGw9Yi5XYyhrKTtpZigoYz1jLmNoaWxkcmVuLmdldChrKSkmJmwpdmFyIG09ZD9kLk0oayk6bnVsbCxrPWUudyhrKSxnPWcuY29uY2F0KHpmKGEsbCxjLG0saykpO2YmJihnPWcuY29uY2F0KGYuYmIoYixlLGQpKSk7cmV0dXJuIGd9XG5mdW5jdGlvbiBBZihhLGIsYyxkLGUpe3ZhciBmPWMuZ2V0KEYpO251bGw9PWQmJm51bGwhPWYmJihkPWYuaGIoRikpO3ZhciBnPVtdO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxmKXt2YXIgbT1kP2QuTShjKTpudWxsLHY9ZS53KGMpLHk9Yi5XYyhjKTt5JiYoZz1nLmNvbmNhdChBZihhLHksZixtLHYpKSl9KTtmJiYoZz1nLmNvbmNhdChmLmJiKGIsZSxkKSkpO3JldHVybiBnfTtmdW5jdGlvbiBCZigpe3RoaXMuY2hpbGRyZW49e307dGhpcy5rZD0wO3RoaXMudmFsdWU9bnVsbH1mdW5jdGlvbiBDZihhLGIsYyl7dGhpcy5EZD1hP2E6XCJcIjt0aGlzLlljPWI/YjpudWxsO3RoaXMuQj1jP2M6bmV3IEJmfWZ1bmN0aW9uIERmKGEsYil7Zm9yKHZhciBjPWIgaW5zdGFuY2VvZiBLP2I6bmV3IEsoYiksZD1hLGU7bnVsbCE9PShlPU8oYykpOylkPW5ldyBDZihlLGQsdyhkLkIuY2hpbGRyZW4sZSl8fG5ldyBCZiksYz1HKGMpO3JldHVybiBkfWg9Q2YucHJvdG90eXBlO2guQmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5CLnZhbHVlfTtmdW5jdGlvbiBFZihhLGIpe0ooXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiLFwiQ2Fubm90IHNldCB2YWx1ZSB0byB1bmRlZmluZWRcIik7YS5CLnZhbHVlPWI7RmYoYSl9aC5jbGVhcj1mdW5jdGlvbigpe3RoaXMuQi52YWx1ZT1udWxsO3RoaXMuQi5jaGlsZHJlbj17fTt0aGlzLkIua2Q9MDtGZih0aGlzKX07XG5oLnRkPWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5CLmtkfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbD09PXRoaXMuQmEoKSYmIXRoaXMudGQoKX07aC5VPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cih0aGlzLkIuY2hpbGRyZW4sZnVuY3Rpb24oYyxkKXthKG5ldyBDZihkLGIsYykpfSl9O2Z1bmN0aW9uIEdmKGEsYixjLGQpe2MmJiFkJiZiKGEpO2EuVShmdW5jdGlvbihhKXtHZihhLGIsITAsZCl9KTtjJiZkJiZiKGEpfWZ1bmN0aW9uIEhmKGEsYil7Zm9yKHZhciBjPWEucGFyZW50KCk7bnVsbCE9PWMmJiFiKGMpOyljPWMucGFyZW50KCl9aC5wYXRoPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBLKG51bGw9PT10aGlzLlljP3RoaXMuRGQ6dGhpcy5ZYy5wYXRoKCkrXCIvXCIrdGhpcy5EZCl9O2gubmFtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkRkfTtoLnBhcmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLlljfTtcbmZ1bmN0aW9uIEZmKGEpe2lmKG51bGwhPT1hLlljKXt2YXIgYj1hLlljLGM9YS5EZCxkPWEuZSgpLGU9dShiLkIuY2hpbGRyZW4sYyk7ZCYmZT8oZGVsZXRlIGIuQi5jaGlsZHJlbltjXSxiLkIua2QtLSxGZihiKSk6ZHx8ZXx8KGIuQi5jaGlsZHJlbltjXT1hLkIsYi5CLmtkKyssRmYoYikpfX07ZnVuY3Rpb24gSWYoYSl7SihlYShhKSYmMDxhLmxlbmd0aCxcIlJlcXVpcmVzIGEgbm9uLWVtcHR5IGFycmF5XCIpO3RoaXMuVWY9YTt0aGlzLk5jPXt9fUlmLnByb3RvdHlwZS5kZT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz10aGlzLk5jW2FdfHxbXSxkPTA7ZDxjLmxlbmd0aDtkKyspY1tkXS55Yy5hcHBseShjW2RdLk1hLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSl9O0lmLnByb3RvdHlwZS5FYj1mdW5jdGlvbihhLGIsYyl7SmYodGhpcyxhKTt0aGlzLk5jW2FdPXRoaXMuTmNbYV18fFtdO3RoaXMuTmNbYV0ucHVzaCh7eWM6YixNYTpjfSk7KGE9dGhpcy56ZShhKSkmJmIuYXBwbHkoYyxhKX07SWYucHJvdG90eXBlLmdjPWZ1bmN0aW9uKGEsYixjKXtKZih0aGlzLGEpO2E9dGhpcy5OY1thXXx8W107Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDtkKyspaWYoYVtkXS55Yz09PWImJighY3x8Yz09PWFbZF0uTWEpKXthLnNwbGljZShkLDEpO2JyZWFrfX07XG5mdW5jdGlvbiBKZihhLGIpe0ooVGEoYS5VZixmdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9KSxcIlVua25vd24gZXZlbnQ6IFwiK2IpfTt2YXIgS2Y9ZnVuY3Rpb24oKXt2YXIgYT0wLGI9W107cmV0dXJuIGZ1bmN0aW9uKGMpe3ZhciBkPWM9PT1hO2E9Yztmb3IodmFyIGU9QXJyYXkoOCksZj03OzA8PWY7Zi0tKWVbZl09XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMlNjQpLGM9TWF0aC5mbG9vcihjLzY0KTtKKDA9PT1jLFwiQ2Fubm90IHB1c2ggYXQgdGltZSA9PSAwXCIpO2M9ZS5qb2luKFwiXCIpO2lmKGQpe2ZvcihmPTExOzA8PWYmJjYzPT09YltmXTtmLS0pYltmXT0wO2JbZl0rK31lbHNlIGZvcihmPTA7MTI+ZjtmKyspYltmXT1NYXRoLmZsb29yKDY0Kk1hdGgucmFuZG9tKCkpO2ZvcihmPTA7MTI+ZjtmKyspYys9XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGJbZl0pO0ooMjA9PT1jLmxlbmd0aCxcIm5leHRQdXNoSWQ6IExlbmd0aCBzaG91bGQgYmUgMjAuXCIpO1xucmV0dXJuIGN9fSgpO2Z1bmN0aW9uIExmKCl7SWYuY2FsbCh0aGlzLFtcIm9ubGluZVwiXSk7dGhpcy5pYz0hMDtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7dmFyIGE9dGhpczt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9ubGluZVwiLGZ1bmN0aW9uKCl7YS5pY3x8KGEuaWM9ITAsYS5kZShcIm9ubGluZVwiLCEwKSl9LCExKTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9mZmxpbmVcIixmdW5jdGlvbigpe2EuaWMmJihhLmljPSExLGEuZGUoXCJvbmxpbmVcIiwhMSkpfSwhMSl9fW1hKExmLElmKTtMZi5wcm90b3R5cGUuemU9ZnVuY3Rpb24oYSl7SihcIm9ubGluZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMuaWNdfTtjYShMZik7ZnVuY3Rpb24gTWYoKXtJZi5jYWxsKHRoaXMsW1widmlzaWJsZVwiXSk7dmFyIGEsYjtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXImJihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmhpZGRlbj8oYj1cInZpc2liaWxpdHljaGFuZ2VcIixhPVwiaGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuPyhiPVwibW96dmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtb3pIaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbj8oYj1cIm1zdmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtc0hpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiYmKGI9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIndlYmtpdEhpZGRlblwiKSk7dGhpcy51Yz0hMDtpZihiKXt2YXIgYz10aGlzO2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYixcbmZ1bmN0aW9uKCl7dmFyIGI9IWRvY3VtZW50W2FdO2IhPT1jLnVjJiYoYy51Yz1iLGMuZGUoXCJ2aXNpYmxlXCIsYikpfSwhMSl9fW1hKE1mLElmKTtNZi5wcm90b3R5cGUuemU9ZnVuY3Rpb24oYSl7SihcInZpc2libGVcIj09PWEsXCJVbmtub3duIGV2ZW50IHR5cGU6IFwiK2EpO3JldHVyblt0aGlzLnVjXX07Y2EoTWYpO3ZhciBOZj0vW1xcW1xcXS4jJFxcL1xcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLyxPZj0vW1xcW1xcXS4jJFxcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLztmdW5jdGlvbiBQZihhKXtyZXR1cm4gcChhKSYmMCE9PWEubGVuZ3RoJiYhTmYudGVzdChhKX1mdW5jdGlvbiBRZihhKXtyZXR1cm4gbnVsbD09PWF8fHAoYSl8fGdhKGEpJiYhU2MoYSl8fGlhKGEpJiZ1KGEsXCIuc3ZcIil9ZnVuY3Rpb24gUmYoYSxiLGMsZCl7ZCYmIW4oYil8fFNmKHooYSwxLGQpLGIsYyl9XG5mdW5jdGlvbiBTZihhLGIsYyl7YyBpbnN0YW5jZW9mIEsmJihjPW5ldyB3YyhjLGEpKTtpZighbihiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgdW5kZWZpbmVkIFwiK3pjKGMpKTtpZihoYShiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgYSBmdW5jdGlvbiBcIit6YyhjKStcIiB3aXRoIGNvbnRlbnRzOiBcIitiLnRvU3RyaW5nKCkpO2lmKFNjKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBcIitiLnRvU3RyaW5nKCkrXCIgXCIremMoYykpO2lmKHAoYikmJmIubGVuZ3RoPjEwNDg1NzYwLzMmJjEwNDg1NzYwPHhjKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIHN0cmluZyBncmVhdGVyIHRoYW4gMTA0ODU3NjAgdXRmOCBieXRlcyBcIit6YyhjKStcIiAoJ1wiK2Iuc3Vic3RyaW5nKDAsNTApK1wiLi4uJylcIik7aWYoaWEoYikpe3ZhciBkPSExLGU9ITE7aGIoYixmdW5jdGlvbihiLGcpe2lmKFwiLnZhbHVlXCI9PT1iKWQ9ITA7ZWxzZSBpZihcIi5wcmlvcml0eVwiIT09YiYmXCIuc3ZcIiE9PWImJihlPVxuITAsIVBmKGIpKSl0aHJvdyBFcnJvcihhK1wiIGNvbnRhaW5zIGFuIGludmFsaWQga2V5IChcIitiK1wiKSBcIit6YyhjKSsnLiAgS2V5cyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCIvXCIsIFwiW1wiLCBvciBcIl1cIicpO2MucHVzaChiKTtTZihhLGcsYyk7Yy5wb3AoKX0pO2lmKGQmJmUpdGhyb3cgRXJyb3IoYSsnIGNvbnRhaW5zIFwiLnZhbHVlXCIgY2hpbGQgJyt6YyhjKStcIiBpbiBhZGRpdGlvbiB0byBhY3R1YWwgY2hpbGRyZW4uXCIpO319XG5mdW5jdGlvbiBUZihhLGIsYyl7aWYoIWlhKGIpfHxlYShiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrXCIgbXVzdCBiZSBhbiBPYmplY3QgY29udGFpbmluZyB0aGUgY2hpbGRyZW4gdG8gcmVwbGFjZS5cIik7aWYodShiLFwiLnZhbHVlXCIpKXRocm93IEVycm9yKHooYSwxLCExKSsnIG11c3Qgbm90IGNvbnRhaW4gXCIudmFsdWVcIi4gIFRvIG92ZXJ3cml0ZSB3aXRoIGEgbGVhZiB2YWx1ZSwganVzdCB1c2UgLnNldCgpIGluc3RlYWQuJyk7UmYoYSxiLGMsITEpfVxuZnVuY3Rpb24gVWYoYSxiLGMpe2lmKFNjKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcImlzIFwiK2MudG9TdHJpbmcoKStcIiwgYnV0IG11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbCkuXCIpO2lmKCFRZihjKSl0aHJvdyBFcnJvcih6KGEsYiwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgRmlyZWJhc2UgcHJpb3JpdHkgKGEgc3RyaW5nLCBmaW5pdGUgbnVtYmVyLCBzZXJ2ZXIgdmFsdWUsIG9yIG51bGwpLlwiKTt9XG5mdW5jdGlvbiBWZihhLGIsYyl7aWYoIWN8fG4oYikpc3dpdGNoKGIpe2Nhc2UgXCJ2YWx1ZVwiOmNhc2UgXCJjaGlsZF9hZGRlZFwiOmNhc2UgXCJjaGlsZF9yZW1vdmVkXCI6Y2FzZSBcImNoaWxkX2NoYW5nZWRcIjpjYXNlIFwiY2hpbGRfbW92ZWRcIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKHooYSwxLGMpKydtdXN0IGJlIGEgdmFsaWQgZXZlbnQgdHlwZTogXCJ2YWx1ZVwiLCBcImNoaWxkX2FkZGVkXCIsIFwiY2hpbGRfcmVtb3ZlZFwiLCBcImNoaWxkX2NoYW5nZWRcIiwgb3IgXCJjaGlsZF9tb3ZlZFwiLicpO319ZnVuY3Rpb24gV2YoYSxiLGMsZCl7aWYoKCFkfHxuKGMpKSYmIVBmKGMpKXRocm93IEVycm9yKHooYSxiLGQpKyd3YXMgYW4gaW52YWxpZCBrZXk6IFwiJytjKydcIi4gIEZpcmViYXNlIGtleXMgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5ncyBhbmQgY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiL1wiLCBcIltcIiwgb3IgXCJdXCIpLicpO31cbmZ1bmN0aW9uIFhmKGEsYil7aWYoIXAoYil8fDA9PT1iLmxlbmd0aHx8T2YudGVzdChiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJ3dhcyBhbiBpbnZhbGlkIHBhdGg6IFwiJytiKydcIi4gUGF0aHMgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5ncyBhbmQgY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIicpO31mdW5jdGlvbiBZZihhLGIpe2lmKFwiLmluZm9cIj09PU8oYikpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IENhbid0IG1vZGlmeSBkYXRhIHVuZGVyIC8uaW5mby9cIik7fWZ1bmN0aW9uIFpmKGEsYil7aWYoIXAoYikpdGhyb3cgRXJyb3IoeihhLDEsITEpK1wibXVzdCBiZSBhIHZhbGlkIGNyZWRlbnRpYWwgKGEgc3RyaW5nKS5cIik7fWZ1bmN0aW9uICRmKGEsYixjKXtpZighcChjKSl0aHJvdyBFcnJvcih6KGEsYiwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgc3RyaW5nLlwiKTt9XG5mdW5jdGlvbiBhZyhhLGIsYyxkKXtpZighZHx8bihjKSlpZighaWEoYyl8fG51bGw9PT1jKXRocm93IEVycm9yKHooYSxiLGQpK1wibXVzdCBiZSBhIHZhbGlkIG9iamVjdC5cIik7fWZ1bmN0aW9uIGJnKGEsYixjKXtpZighaWEoYil8fG51bGw9PT1ifHwhdShiLGMpKXRocm93IEVycm9yKHooYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiJyk7aWYoIXAodyhiLGMpKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJ211c3QgY29udGFpbiB0aGUga2V5IFwiJytjKydcIiB3aXRoIHR5cGUgXCJzdHJpbmdcIicpO307ZnVuY3Rpb24gY2coKXt0aGlzLnNldD17fX1oPWNnLnByb3RvdHlwZTtoLmFkZD1mdW5jdGlvbihhLGIpe3RoaXMuc2V0W2FdPW51bGwhPT1iP2I6ITB9O2guY29udGFpbnM9ZnVuY3Rpb24oYSl7cmV0dXJuIHUodGhpcy5zZXQsYSl9O2guZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNvbnRhaW5zKGEpP3RoaXMuc2V0W2FdOnZvaWQgMH07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMuc2V0W2FdfTtoLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5zZXQ9e319O2guZT1mdW5jdGlvbigpe3JldHVybiB3YSh0aGlzLnNldCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gcGEodGhpcy5zZXQpfTtmdW5jdGlvbiBkZyhhLGIpe3IoYS5zZXQsZnVuY3Rpb24oYSxkKXtiKGQsYSl9KX1oLmtleXM9ZnVuY3Rpb24oKXt2YXIgYT1bXTtyKHRoaXMuc2V0LGZ1bmN0aW9uKGIsYyl7YS5wdXNoKGMpfSk7cmV0dXJuIGF9O2Z1bmN0aW9uIHFjKCl7dGhpcy5tPXRoaXMuQz1udWxsfXFjLnByb3RvdHlwZS5maW5kPWZ1bmN0aW9uKGEpe2lmKG51bGwhPXRoaXMuQylyZXR1cm4gdGhpcy5DLm9hKGEpO2lmKGEuZSgpfHxudWxsPT10aGlzLm0pcmV0dXJuIG51bGw7dmFyIGI9TyhhKTthPUcoYSk7cmV0dXJuIHRoaXMubS5jb250YWlucyhiKT90aGlzLm0uZ2V0KGIpLmZpbmQoYSk6bnVsbH07cWMucHJvdG90eXBlLm1jPWZ1bmN0aW9uKGEsYil7aWYoYS5lKCkpdGhpcy5DPWIsdGhpcy5tPW51bGw7ZWxzZSBpZihudWxsIT09dGhpcy5DKXRoaXMuQz10aGlzLkMuRyhhLGIpO2Vsc2V7bnVsbD09dGhpcy5tJiYodGhpcy5tPW5ldyBjZyk7dmFyIGM9TyhhKTt0aGlzLm0uY29udGFpbnMoYyl8fHRoaXMubS5hZGQoYyxuZXcgcWMpO2M9dGhpcy5tLmdldChjKTthPUcoYSk7Yy5tYyhhLGIpfX07XG5mdW5jdGlvbiBlZyhhLGIpe2lmKGIuZSgpKXJldHVybiBhLkM9bnVsbCxhLm09bnVsbCwhMDtpZihudWxsIT09YS5DKXtpZihhLkMuTigpKXJldHVybiExO3ZhciBjPWEuQzthLkM9bnVsbDtjLlUoTSxmdW5jdGlvbihiLGMpe2EubWMobmV3IEsoYiksYyl9KTtyZXR1cm4gZWcoYSxiKX1yZXR1cm4gbnVsbCE9PWEubT8oYz1PKGIpLGI9RyhiKSxhLm0uY29udGFpbnMoYykmJmVnKGEubS5nZXQoYyksYikmJmEubS5yZW1vdmUoYyksYS5tLmUoKT8oYS5tPW51bGwsITApOiExKTohMH1mdW5jdGlvbiByYyhhLGIsYyl7bnVsbCE9PWEuQz9jKGIsYS5DKTphLlUoZnVuY3Rpb24oYSxlKXt2YXIgZj1uZXcgSyhiLnRvU3RyaW5nKCkrXCIvXCIrYSk7cmMoZSxmLGMpfSl9cWMucHJvdG90eXBlLlU9ZnVuY3Rpb24oYSl7bnVsbCE9PXRoaXMubSYmZGcodGhpcy5tLGZ1bmN0aW9uKGIsYyl7YShiLGMpfSl9O3ZhciBmZz1cImF1dGguZmlyZWJhc2UuY29tXCI7ZnVuY3Rpb24gZ2coYSxiLGMpe3RoaXMubGQ9YXx8e307dGhpcy5jZT1ifHx7fTt0aGlzLmFiPWN8fHt9O3RoaXMubGQucmVtZW1iZXJ8fCh0aGlzLmxkLnJlbWVtYmVyPVwiZGVmYXVsdFwiKX12YXIgaGc9W1wicmVtZW1iZXJcIixcInJlZGlyZWN0VG9cIl07ZnVuY3Rpb24gaWcoYSl7dmFyIGI9e30sYz17fTtoYihhfHx7fSxmdW5jdGlvbihhLGUpezA8PU5hKGhnLGEpP2JbYV09ZTpjW2FdPWV9KTtyZXR1cm4gbmV3IGdnKGIse30sYyl9O2Z1bmN0aW9uIGpnKGEsYil7dGhpcy5QZT1bXCJzZXNzaW9uXCIsYS5MZCxhLkNiXS5qb2luKFwiOlwiKTt0aGlzLiRkPWJ9amcucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe2lmKCFiKWlmKHRoaXMuJGQubGVuZ3RoKWI9dGhpcy4kZFswXTtlbHNlIHRocm93IEVycm9yKFwiZmIubG9naW4uU2Vzc2lvbk1hbmFnZXIgOiBObyBzdG9yYWdlIG9wdGlvbnMgYXZhaWxhYmxlIVwiKTtiLnNldCh0aGlzLlBlLGEpfTtqZy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9UWEodGhpcy4kZCxxKHRoaXMubmcsdGhpcykpLGE9UGEoYSxmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9PWF9KTtYYShhLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGJkKGMudG9rZW4pLWJkKGEudG9rZW4pfSk7cmV0dXJuIDA8YS5sZW5ndGg/YS5zaGlmdCgpOm51bGx9O2pnLnByb3RvdHlwZS5uZz1mdW5jdGlvbihhKXt0cnl7dmFyIGI9YS5nZXQodGhpcy5QZSk7aWYoYiYmYi50b2tlbilyZXR1cm4gYn1jYXRjaChjKXt9cmV0dXJuIG51bGx9O1xuamcucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztPYSh0aGlzLiRkLGZ1bmN0aW9uKGIpe2IucmVtb3ZlKGEuUGUpfSl9O2Z1bmN0aW9uIGtnKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJiEhKHdpbmRvdy5jb3Jkb3ZhfHx3aW5kb3cucGhvbmVnYXB8fHdpbmRvdy5QaG9uZUdhcCkmJi9pb3N8aXBob25lfGlwb2R8aXBhZHxhbmRyb2lkfGJsYWNrYmVycnl8aWVtb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpfWZ1bmN0aW9uIGxnKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmL15maWxlOlxcLy8udGVzdChsb2NhdGlvbi5ocmVmKX1cbmZ1bmN0aW9uIG1nKCl7aWYoXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBuYXZpZ2F0b3IpcmV0dXJuITE7dmFyIGE9bmF2aWdhdG9yLnVzZXJBZ2VudDtpZihcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiPT09bmF2aWdhdG9yLmFwcE5hbWUpe2lmKChhPWEubWF0Y2goL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSl9ZWxzZSBpZigtMTxhLmluZGV4T2YoXCJUcmlkZW50XCIpJiYoYT1hLm1hdGNoKC9ydjooWzAtOV17MiwyfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSk7cmV0dXJuITF9O2Z1bmN0aW9uIG5nKCl7dmFyIGE9d2luZG93Lm9wZW5lci5mcmFtZXMsYjtmb3IoYj1hLmxlbmd0aC0xOzA8PWI7Yi0tKXRyeXtpZihhW2JdLmxvY2F0aW9uLnByb3RvY29sPT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sJiZhW2JdLmxvY2F0aW9uLmhvc3Q9PT13aW5kb3cubG9jYXRpb24uaG9zdCYmXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIj09PWFbYl0ubmFtZSlyZXR1cm4gYVtiXX1jYXRjaChjKXt9cmV0dXJuIG51bGx9ZnVuY3Rpb24gb2coYSxiLGMpe2EuYXR0YWNoRXZlbnQ/YS5hdHRhY2hFdmVudChcIm9uXCIrYixjKTphLmFkZEV2ZW50TGlzdGVuZXImJmEuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfWZ1bmN0aW9uIHBnKGEsYixjKXthLmRldGFjaEV2ZW50P2EuZGV0YWNoRXZlbnQoXCJvblwiK2IsYyk6YS5yZW1vdmVFdmVudExpc3RlbmVyJiZhLnJlbW92ZUV2ZW50TGlzdGVuZXIoYixjLCExKX1cbmZ1bmN0aW9uIHFnKGEpey9eaHR0cHM/OlxcL1xcLy8udGVzdChhKXx8KGE9d2luZG93LmxvY2F0aW9uLmhyZWYpO3ZhciBiPS9eKGh0dHBzPzpcXC9cXC9bXFwtX2EtekEtWlxcLjAtOTpdKykvLmV4ZWMoYSk7cmV0dXJuIGI/YlsxXTphfWZ1bmN0aW9uIHJnKGEpe3ZhciBiPVwiXCI7dHJ5e2E9YS5yZXBsYWNlKFwiI1wiLFwiXCIpO3ZhciBjPWtiKGEpO2MmJnUoYyxcIl9fZmlyZWJhc2VfcmVxdWVzdF9rZXlcIikmJihiPXcoYyxcIl9fZmlyZWJhc2VfcmVxdWVzdF9rZXlcIikpfWNhdGNoKGQpe31yZXR1cm4gYn1mdW5jdGlvbiBzZygpe3ZhciBhPVJjKGZnKTtyZXR1cm4gYS5zY2hlbWUrXCI6Ly9cIithLmhvc3QrXCIvdjJcIn1mdW5jdGlvbiB0ZyhhKXtyZXR1cm4gc2coKStcIi9cIithK1wiL2F1dGgvY2hhbm5lbFwifTtmdW5jdGlvbiB1ZyhhKXt2YXIgYj10aGlzO3RoaXMuemM9YTt0aGlzLmFlPVwiKlwiO21nKCk/dGhpcy5RYz10aGlzLndkPW5nKCk6KHRoaXMuUWM9d2luZG93Lm9wZW5lcix0aGlzLndkPXdpbmRvdyk7aWYoIWIuUWMpdGhyb3dcIlVuYWJsZSB0byBmaW5kIHJlbGF5IGZyYW1lXCI7b2codGhpcy53ZCxcIm1lc3NhZ2VcIixxKHRoaXMuaGMsdGhpcykpO29nKHRoaXMud2QsXCJtZXNzYWdlXCIscSh0aGlzLkFmLHRoaXMpKTt0cnl7dmcodGhpcyx7YTpcInJlYWR5XCJ9KX1jYXRjaChjKXtvZyh0aGlzLlFjLFwibG9hZFwiLGZ1bmN0aW9uKCl7dmcoYix7YTpcInJlYWR5XCJ9KX0pfW9nKHdpbmRvdyxcInVubG9hZFwiLHEodGhpcy55Zyx0aGlzKSl9ZnVuY3Rpb24gdmcoYSxiKXtiPUIoYik7bWcoKT9hLlFjLmRvUG9zdChiLGEuYWUpOmEuUWMucG9zdE1lc3NhZ2UoYixhLmFlKX1cbnVnLnByb3RvdHlwZS5oYz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM7dHJ5e2M9bWIoYS5kYXRhKX1jYXRjaChkKXt9YyYmXCJyZXF1ZXN0XCI9PT1jLmEmJihwZyh3aW5kb3csXCJtZXNzYWdlXCIsdGhpcy5oYyksdGhpcy5hZT1hLm9yaWdpbix0aGlzLnpjJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi56YyhiLmFlLGMuZCxmdW5jdGlvbihhLGMpe2IuYWc9IWM7Yi56Yz12b2lkIDA7dmcoYix7YTpcInJlc3BvbnNlXCIsZDphLGZvcmNlS2VlcFdpbmRvd09wZW46Y30pfSl9LDApKX07dWcucHJvdG90eXBlLnlnPWZ1bmN0aW9uKCl7dHJ5e3BnKHRoaXMud2QsXCJtZXNzYWdlXCIsdGhpcy5BZil9Y2F0Y2goYSl7fXRoaXMuemMmJih2Zyh0aGlzLHthOlwiZXJyb3JcIixkOlwidW5rbm93biBjbG9zZWQgd2luZG93XCJ9KSx0aGlzLnpjPXZvaWQgMCk7dHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O3VnLnByb3RvdHlwZS5BZj1mdW5jdGlvbihhKXtpZih0aGlzLmFnJiZcImRpZVwiPT09YS5kYXRhKXRyeXt3aW5kb3cuY2xvc2UoKX1jYXRjaChiKXt9fTtmdW5jdGlvbiB3ZyhhKXt0aGlzLm9jPUdhKCkrR2EoKStHYSgpO3RoaXMuRGY9YX13Zy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe1Auc2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiLHRoaXMub2MpO1Auc2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiLHRoaXMub2MpO2IucmVxdWVzdElkPXRoaXMub2M7Yi5yZWRpcmVjdFRvPWIucmVkaXJlY3RUb3x8d2luZG93LmxvY2F0aW9uLmhyZWY7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYik7d2luZG93LmxvY2F0aW9uPWF9O3dnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIWxnKCkmJiFrZygpfTt3Zy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInJlZGlyZWN0XCJ9O3ZhciB4Zz17TkVUV09SS19FUlJPUjpcIlVuYWJsZSB0byBjb250YWN0IHRoZSBGaXJlYmFzZSBzZXJ2ZXIuXCIsU0VSVkVSX0VSUk9SOlwiQW4gdW5rbm93biBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsVFJBTlNQT1JUX1VOQVZBSUxBQkxFOlwiVGhlcmUgYXJlIG5vIGxvZ2luIHRyYW5zcG9ydHMgYXZhaWxhYmxlIGZvciB0aGUgcmVxdWVzdGVkIG1ldGhvZC5cIixSRVFVRVNUX0lOVEVSUlVQVEVEOlwiVGhlIGJyb3dzZXIgcmVkaXJlY3RlZCB0aGUgcGFnZSBiZWZvcmUgdGhlIGxvZ2luIHJlcXVlc3QgY291bGQgY29tcGxldGUuXCIsVVNFUl9DQU5DRUxMRUQ6XCJUaGUgdXNlciBjYW5jZWxsZWQgYXV0aGVudGljYXRpb24uXCJ9O2Z1bmN0aW9uIHlnKGEpe3ZhciBiPUVycm9yKHcoeGcsYSksYSk7Yi5jb2RlPWE7cmV0dXJuIGJ9O2Z1bmN0aW9uIHpnKGEpe2lmKCFhLndpbmRvd19mZWF0dXJlc3x8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJigtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZlbm5lYy9cIil8fC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveC9cIikmJi0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQW5kcm9pZFwiKSkpYS53aW5kb3dfZmVhdHVyZXM9dm9pZCAwO2Eud2luZG93X25hbWV8fChhLndpbmRvd19uYW1lPVwiX2JsYW5rXCIpO3RoaXMub3B0aW9ucz1hfVxuemcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7ZyYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZyksZz12b2lkIDApO3YmJih2PWNsZWFySW50ZXJ2YWwodikpO3BnKHdpbmRvdyxcIm1lc3NhZ2VcIixlKTtwZyh3aW5kb3csXCJ1bmxvYWRcIixkKTtpZihtJiYhYSl0cnl7bS5jbG9zZSgpfWNhdGNoKGIpe2sucG9zdE1lc3NhZ2UoXCJkaWVcIixsKX1tPWs9dm9pZCAwfWZ1bmN0aW9uIGUoYSl7aWYoYS5vcmlnaW49PT1sKXRyeXt2YXIgYj1tYihhLmRhdGEpO1wicmVhZHlcIj09PWIuYT9rLnBvc3RNZXNzYWdlKHksbCk6XCJlcnJvclwiPT09Yi5hPyhkKCExKSxjJiYoYyhiLmQpLGM9bnVsbCkpOlwicmVzcG9uc2VcIj09PWIuYSYmKGQoYi5mb3JjZUtlZXBXaW5kb3dPcGVuKSxjJiYoYyhudWxsLGIuZCksYz1udWxsKSl9Y2F0Y2goZSl7fX12YXIgZj1tZygpLGcsaztpZighdGhpcy5vcHRpb25zLnJlbGF5X3VybClyZXR1cm4gYyhFcnJvcihcImludmFsaWQgYXJndW1lbnRzOiBvcmlnaW4gb2YgdXJsIGFuZCByZWxheV91cmwgbXVzdCBtYXRjaFwiKSk7XG52YXIgbD1xZyhhKTtpZihsIT09cWcodGhpcy5vcHRpb25zLnJlbGF5X3VybCkpYyYmc2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJpbnZhbGlkIGFyZ3VtZW50czogb3JpZ2luIG9mIHVybCBhbmQgcmVsYXlfdXJsIG11c3QgbWF0Y2hcIikpfSwwKTtlbHNle2YmJihnPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIix0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSxnLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIiksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnKSxrPWcuY29udGVudFdpbmRvdyk7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYik7dmFyIG09d2luZG93Lm9wZW4oYSx0aGlzLm9wdGlvbnMud2luZG93X25hbWUsdGhpcy5vcHRpb25zLndpbmRvd19mZWF0dXJlcyk7a3x8KGs9bSk7dmFyIHY9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXttJiZtLmNsb3NlZCYmXG4oZCghMSksYyYmKGMoeWcoXCJVU0VSX0NBTkNFTExFRFwiKSksYz1udWxsKSl9LDUwMCkseT1CKHthOlwicmVxdWVzdFwiLGQ6Yn0pO29nKHdpbmRvdyxcInVubG9hZFwiLGQpO29nKHdpbmRvdyxcIm1lc3NhZ2VcIixlKX19O1xuemcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm5cInBvc3RNZXNzYWdlXCJpbiB3aW5kb3cmJiFsZygpJiYhKGtnKCl8fFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvV2luZG93cyBQaG9uZS8pfHx3aW5kb3cuV2luZG93cyYmL15tcy1hcHB4Oi8udGVzdChsb2NhdGlvbi5ocmVmKSl8fFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaSl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0NyaU9TLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1R3aXR0ZXIgZm9yIGlQaG9uZS8pfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GQkFOXFwvRkJJT1MvKXx8d2luZG93Lm5hdmlnYXRvci5zdGFuZGFsb25lKSkmJiEoXCJ1bmRlZmluZWRcIiE9PVxudHlwZW9mIG5hdmlnYXRvciYmbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvUGhhbnRvbUpTLykpfTt6Zy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInBvcHVwXCJ9O2Z1bmN0aW9uIEFnKGEpe2EubWV0aG9kfHwoYS5tZXRob2Q9XCJHRVRcIik7YS5oZWFkZXJzfHwoYS5oZWFkZXJzPXt9KTthLmhlYWRlcnMuY29udGVudF90eXBlfHwoYS5oZWFkZXJzLmNvbnRlbnRfdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIik7YS5oZWFkZXJzLmNvbnRlbnRfdHlwZT1hLmhlYWRlcnMuY29udGVudF90eXBlLnRvTG93ZXJDYXNlKCk7dGhpcy5vcHRpb25zPWF9XG5BZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiUkVRVUVTVF9JTlRFUlJVUFRFRFwiKSksYz1udWxsKX12YXIgZT1uZXcgWE1MSHR0cFJlcXVlc3QsZj10aGlzLm9wdGlvbnMubWV0aG9kLnRvVXBwZXJDYXNlKCksZztvZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKTtlLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKGMmJjQ9PT1lLnJlYWR5U3RhdGUpe3ZhciBhO2lmKDIwMDw9ZS5zdGF0dXMmJjMwMD5lLnN0YXR1cyl7dHJ5e2E9bWIoZS5yZXNwb25zZVRleHQpfWNhdGNoKGIpe31jKG51bGwsYSl9ZWxzZSA1MDA8PWUuc3RhdHVzJiY2MDA+ZS5zdGF0dXM/Yyh5ZyhcIlNFUlZFUl9FUlJPUlwiKSk6Yyh5ZyhcIk5FVFdPUktfRVJST1JcIikpO2M9bnVsbDtwZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKX19O2lmKFwiR0VUXCI9PT1mKWErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpLGc9bnVsbDtlbHNle3ZhciBrPXRoaXMub3B0aW9ucy5oZWFkZXJzLmNvbnRlbnRfdHlwZTtcblwiYXBwbGljYXRpb24vanNvblwiPT09ayYmKGc9QihiKSk7XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIj09PWsmJihnPWpiKGIpKX1lLm9wZW4oZixhLCEwKTthPXtcIlgtUmVxdWVzdGVkLVdpdGhcIjpcIlhNTEh0dHBSZXF1ZXN0XCIsQWNjZXB0OlwiYXBwbGljYXRpb24vanNvbjt0ZXh0L3BsYWluXCJ9O3phKGEsdGhpcy5vcHRpb25zLmhlYWRlcnMpO2Zvcih2YXIgbCBpbiBhKWUuc2V0UmVxdWVzdEhlYWRlcihsLGFbbF0pO2Uuc2VuZChnKX07QWcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hIXdpbmRvdy5YTUxIdHRwUmVxdWVzdCYmXCJzdHJpbmdcIj09PXR5cGVvZihuZXcgWE1MSHR0cFJlcXVlc3QpLnJlc3BvbnNlVHlwZSYmKCEoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSkpfHxtZygpKX07QWcucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJqc29uXCJ9O2Z1bmN0aW9uIEJnKGEpe3RoaXMub2M9R2EoKStHYSgpK0dhKCk7dGhpcy5EZj1hfVxuQmcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoKXtjJiYoYyh5ZyhcIlVTRVJfQ0FOQ0VMTEVEXCIpKSxjPW51bGwpfXZhciBlPXRoaXMsZj1SYyhmZyksZztiLnJlcXVlc3RJZD10aGlzLm9jO2IucmVkaXJlY3RUbz1mLnNjaGVtZStcIjovL1wiK2YuaG9zdCtcIi9ibGFuay9wYWdlLmh0bWxcIjthKz0vXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCI7YSs9amIoYik7KGc9d2luZG93Lm9wZW4oYSxcIl9ibGFua1wiLFwibG9jYXRpb249bm9cIikpJiZoYShnLmFkZEV2ZW50TGlzdGVuZXIpPyhnLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2Fkc3RhcnRcIixmdW5jdGlvbihhKXt2YXIgYjtpZihiPWEmJmEudXJsKWE6e3RyeXt2YXIgbT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTttLmhyZWY9YS51cmw7Yj1tLmhvc3Q9PT1mLmhvc3QmJlwiL2JsYW5rL3BhZ2UuaHRtbFwiPT09bS5wYXRobmFtZTticmVhayBhfWNhdGNoKHYpe31iPSExfWImJihhPXJnKGEudXJsKSxnLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJleGl0XCIsXG5kKSxnLmNsb3NlKCksYT1uZXcgZ2cobnVsbCxudWxsLHtyZXF1ZXN0SWQ6ZS5vYyxyZXF1ZXN0S2V5OmF9KSxlLkRmLnJlcXVlc3RXaXRoQ3JlZGVudGlhbChcIi9hdXRoL3Nlc3Npb25cIixhLGMpLGM9bnVsbCl9KSxnLmFkZEV2ZW50TGlzdGVuZXIoXCJleGl0XCIsZCkpOmMoeWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfTtCZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiBrZygpfTtCZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInJlZGlyZWN0XCJ9O2Z1bmN0aW9uIENnKGEpe2EuY2FsbGJhY2tfcGFyYW1ldGVyfHwoYS5jYWxsYmFja19wYXJhbWV0ZXI9XCJjYWxsYmFja1wiKTt0aGlzLm9wdGlvbnM9YTt3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wPXdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnB8fHt9fVxuQ2cucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoKXtjJiYoYyh5ZyhcIlJFUVVFU1RfSU5URVJSVVBURURcIikpLGM9bnVsbCl9ZnVuY3Rpb24gZSgpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wW2ZdPXZvaWQgMDt3YSh3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wKSYmKHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9dm9pZCAwKTt0cnl7dmFyIGE9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZik7YSYmYS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpfWNhdGNoKGIpe319LDEpO3BnKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfXZhciBmPVwiZm5cIisobmV3IERhdGUpLmdldFRpbWUoKStNYXRoLmZsb29yKDk5OTk5Kk1hdGgucmFuZG9tKCkpO2JbdGhpcy5vcHRpb25zLmNhbGxiYWNrX3BhcmFtZXRlcl09XCJfX2ZpcmViYXNlX2F1dGhfanNvbnAuXCIrZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTtcbm9nKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl09ZnVuY3Rpb24oYSl7YyYmKGMobnVsbCxhKSxjPW51bGwpO2UoKX07RGcoZixhLGMpfTtcbmZ1bmN0aW9uIERnKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e3ZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7ZC5pZD1hO2QuYXN5bmM9ITA7ZC5zcmM9YjtkLm9uZXJyb3I9ZnVuY3Rpb24oKXt2YXIgYj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChhKTtudWxsIT09YiYmYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpO2MmJmMoeWcoXCJORVRXT1JLX0VSUk9SXCIpKX07dmFyIGU9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpOyhlJiYwIT1lLmxlbmd0aD9lWzBdOmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoZCl9Y2F0Y2goZil7YyYmYyh5ZyhcIk5FVFdPUktfRVJST1JcIikpfX0sMCl9Q2cuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hMH07Q2cucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJqc29uXCJ9O2Z1bmN0aW9uIEVnKGEsYixjLGQpe0lmLmNhbGwodGhpcyxbXCJhdXRoX3N0YXR1c1wiXSk7dGhpcy5IPWE7dGhpcy5kZj1iO3RoaXMuU2c9Yzt0aGlzLktlPWQ7dGhpcy5yYz1uZXcgamcoYSxbRGMsUF0pO3RoaXMubmI9bnVsbDt0aGlzLlJlPSExO0ZnKHRoaXMpfW1hKEVnLElmKTtoPUVnLnByb3RvdHlwZTtoLndlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmJ8fG51bGx9O2Z1bmN0aW9uIEZnKGEpe1AuZ2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiKSYmR2coYSk7dmFyIGI9YS5yYy5nZXQoKTtiJiZiLnRva2VuPyhIZyhhLGIpLGEuZGYoYi50b2tlbixmdW5jdGlvbihjLGQpe0lnKGEsYyxkLCExLGIudG9rZW4sYil9LGZ1bmN0aW9uKGIsZCl7SmcoYSxcInJlc3VtZVNlc3Npb24oKVwiLGIsZCl9KSk6SGcoYSxudWxsKX1cbmZ1bmN0aW9uIEtnKGEsYixjLGQsZSxmKXtcImZpcmViYXNlaW8tZGVtby5jb21cIj09PWEuSC5kb21haW4mJlEoXCJGaXJlYmFzZSBhdXRoZW50aWNhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIG9uIGRlbW8gRmlyZWJhc2VzICgqLmZpcmViYXNlaW8tZGVtby5jb20pLiBUbyBzZWN1cmUgeW91ciBGaXJlYmFzZSwgY3JlYXRlIGEgcHJvZHVjdGlvbiBGaXJlYmFzZSBhdCBodHRwczovL3d3dy5maXJlYmFzZS5jb20uXCIpO2EuZGYoYixmdW5jdGlvbihmLGspe0lnKGEsZixrLCEwLGIsYyxkfHx7fSxlKX0sZnVuY3Rpb24oYixjKXtKZyhhLFwiYXV0aCgpXCIsYixjLGYpfSl9ZnVuY3Rpb24gTGcoYSxiKXthLnJjLmNsZWFyKCk7SGcoYSxudWxsKTthLlNnKGZ1bmN0aW9uKGEsZCl7aWYoXCJva1wiPT09YSlSKGIsbnVsbCk7ZWxzZXt2YXIgZT0oYXx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGY9ZTtkJiYoZis9XCI6IFwiK2QpO2Y9RXJyb3IoZik7Zi5jb2RlPWU7UihiLGYpfX0pfVxuZnVuY3Rpb24gSWcoYSxiLGMsZCxlLGYsZyxrKXtcIm9rXCI9PT1iPyhkJiYoYj1jLmF1dGgsZi5hdXRoPWIsZi5leHBpcmVzPWMuZXhwaXJlcyxmLnRva2VuPWNkKGUpP2U6XCJcIixjPW51bGwsYiYmdShiLFwidWlkXCIpP2M9dyhiLFwidWlkXCIpOnUoZixcInVpZFwiKSYmKGM9dyhmLFwidWlkXCIpKSxmLnVpZD1jLGM9XCJjdXN0b21cIixiJiZ1KGIsXCJwcm92aWRlclwiKT9jPXcoYixcInByb3ZpZGVyXCIpOnUoZixcInByb3ZpZGVyXCIpJiYoYz13KGYsXCJwcm92aWRlclwiKSksZi5wcm92aWRlcj1jLGEucmMuY2xlYXIoKSxjZChlKSYmKGc9Z3x8e30sYz1EYyxcInNlc3Npb25Pbmx5XCI9PT1nLnJlbWVtYmVyJiYoYz1QKSxcIm5vbmVcIiE9PWcucmVtZW1iZXImJmEucmMuc2V0KGYsYykpLEhnKGEsZikpLFIoayxudWxsLGYpKTooYS5yYy5jbGVhcigpLEhnKGEsbnVsbCksZj1hPShifHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksYyYmKGYrPVwiOiBcIitjKSxmPUVycm9yKGYpLGYuY29kZT1hLFIoayxmKSl9XG5mdW5jdGlvbiBKZyhhLGIsYyxkLGUpe1EoYitcIiB3YXMgY2FuY2VsZWQ6IFwiK2QpO2EucmMuY2xlYXIoKTtIZyhhLG51bGwpO2E9RXJyb3IoZCk7YS5jb2RlPWMudG9VcHBlckNhc2UoKTtSKGUsYSl9ZnVuY3Rpb24gTWcoYSxiLGMsZCxlKXtOZyhhKTtjPW5ldyBnZyhkfHx7fSx7fSxjfHx7fSk7T2coYSxbQWcsQ2ddLFwiL2F1dGgvXCIrYixjLGUpfVxuZnVuY3Rpb24gUGcoYSxiLGMsZCl7TmcoYSk7dmFyIGU9W3pnLEJnXTtjPWlnKGMpO1wiYW5vbnltb3VzXCI9PT1ifHxcInBhc3N3b3JkXCI9PT1iP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtSKGQseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfSwwKTooYy5jZS53aW5kb3dfZmVhdHVyZXM9XCJtZW51YmFyPXllcyxtb2RhbD15ZXMsYWx3YXlzUmFpc2VkPXllc2xvY2F0aW9uPXllcyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz15ZXMsaGVpZ2h0PTYyNSx3aWR0aD02MjUsdG9wPVwiKyhcIm9iamVjdFwiPT09dHlwZW9mIHNjcmVlbj8uNSooc2NyZWVuLmhlaWdodC02MjUpOjApK1wiLGxlZnQ9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4ud2lkdGgtNjI1KTowKSxjLmNlLnJlbGF5X3VybD10ZyhhLkguQ2IpLGMuY2UucmVxdWVzdFdpdGhDcmVkZW50aWFsPXEoYS5wYyxhKSxPZyhhLGUsXCIvYXV0aC9cIitiLGMsZCkpfVxuZnVuY3Rpb24gR2coYSl7dmFyIGI9UC5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO2lmKGIpe3ZhciBjPVAuZ2V0KFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7UC5yZW1vdmUoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO1AucmVtb3ZlKFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7dmFyIGQ9W0FnLENnXSxiPXtyZXF1ZXN0SWQ6YixyZXF1ZXN0S2V5OnJnKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpfSxjPW5ldyBnZyhjLHt9LGIpO2EuUmU9ITA7dHJ5e2RvY3VtZW50LmxvY2F0aW9uLmhhc2g9ZG9jdW1lbnQubG9jYXRpb24uaGFzaC5yZXBsYWNlKC8mX19maXJlYmFzZV9yZXF1ZXN0X2tleT0oW2EtekEtejAtOV0qKS8sXCJcIil9Y2F0Y2goZSl7fU9nKGEsZCxcIi9hdXRoL3Nlc3Npb25cIixjLGZ1bmN0aW9uKCl7dGhpcy5SZT0hMX0uYmluZChhKSl9fVxuaC5yZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPWlnKGEpO2MuYWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLnBjKFwiL3VzZXJzXCIsYyxmdW5jdGlvbihhLGMpe2E/UihiLGEpOlIoYixhLGMpfSl9O2guU2U9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO05nKHRoaXMpO3ZhciBkPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKSxlPWlnKGEpO2UuYWIuX21ldGhvZD1cIkRFTEVURVwiO3RoaXMucGMoZCxlLGZ1bmN0aW9uKGEsZCl7IWEmJmQmJmQudWlkJiZjLm5iJiZjLm5iLnVpZCYmYy5uYi51aWQ9PT1kLnVpZCYmTGcoYyk7UihiLGEpfSl9O2gub2U9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBVVFwiO2QuYWIucGFzc3dvcmQ9YS5uZXdQYXNzd29yZDt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07XG5oLm5lPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEub2xkRW1haWwpK1wiL2VtYWlsXCIsZD1pZyhhKTtkLmFiLl9tZXRob2Q9XCJQVVRcIjtkLmFiLmVtYWlsPWEubmV3RW1haWw7ZC5hYi5wYXNzd29yZD1hLnBhc3N3b3JkO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtoLlVlPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpK1wiL3Bhc3N3b3JkXCIsZD1pZyhhKTtkLmFiLl9tZXRob2Q9XCJQT1NUXCI7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O2gucGM9ZnVuY3Rpb24oYSxiLGMpe1FnKHRoaXMsW0FnLENnXSxhLGIsYyl9O1xuZnVuY3Rpb24gT2coYSxiLGMsZCxlKXtRZyhhLGIsYyxkLGZ1bmN0aW9uKGIsYyl7IWImJmMmJmMudG9rZW4mJmMudWlkP0tnKGEsYy50b2tlbixjLGQubGQsZnVuY3Rpb24oYSxiKXthP1IoZSxhKTpSKGUsbnVsbCxiKX0pOlIoZSxifHx5ZyhcIlVOS05PV05fRVJST1JcIikpfSl9XG5mdW5jdGlvbiBRZyhhLGIsYyxkLGUpe2I9UGEoYixmdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYS5pc0F2YWlsYWJsZSYmYS5pc0F2YWlsYWJsZSgpfSk7MD09PWIubGVuZ3RoP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtSKGUseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfSwwKTooYj1uZXcgKGIuc2hpZnQoKSkoZC5jZSksZD1pYihkLmFiKSxkLnY9XCJqcy0yLjIuNVwiLGQudHJhbnNwb3J0PWIuQmMoKSxkLnN1cHByZXNzX3N0YXR1c19jb2Rlcz0hMCxhPXNnKCkrXCIvXCIrYS5ILkNiK2MsYi5vcGVuKGEsZCxmdW5jdGlvbihhLGIpe2lmKGEpUihlLGEpO2Vsc2UgaWYoYiYmYi5lcnJvcil7dmFyIGM9RXJyb3IoYi5lcnJvci5tZXNzYWdlKTtjLmNvZGU9Yi5lcnJvci5jb2RlO2MuZGV0YWlscz1iLmVycm9yLmRldGFpbHM7UihlLGMpfWVsc2UgUihlLG51bGwsYil9KSl9XG5mdW5jdGlvbiBIZyhhLGIpe3ZhciBjPW51bGwhPT1hLm5ifHxudWxsIT09YjthLm5iPWI7YyYmYS5kZShcImF1dGhfc3RhdHVzXCIsYik7YS5LZShudWxsIT09Yil9aC56ZT1mdW5jdGlvbihhKXtKKFwiYXV0aF9zdGF0dXNcIj09PWEsJ2luaXRpYWwgZXZlbnQgbXVzdCBiZSBvZiB0eXBlIFwiYXV0aF9zdGF0dXNcIicpO3JldHVybiB0aGlzLlJlP251bGw6W3RoaXMubmJdfTtmdW5jdGlvbiBOZyhhKXt2YXIgYj1hLkg7aWYoXCJmaXJlYmFzZWlvLmNvbVwiIT09Yi5kb21haW4mJlwiZmlyZWJhc2Vpby1kZW1vLmNvbVwiIT09Yi5kb21haW4mJlwiYXV0aC5maXJlYmFzZS5jb21cIj09PWZnKXRocm93IEVycm9yKFwiVGhpcyBjdXN0b20gRmlyZWJhc2Ugc2VydmVyICgnXCIrYS5ILmRvbWFpbitcIicpIGRvZXMgbm90IHN1cHBvcnQgZGVsZWdhdGVkIGxvZ2luLlwiKTt9O2Z1bmN0aW9uIFJnKGEpe3RoaXMuaGM9YTt0aGlzLktkPVtdO3RoaXMuUWI9MDt0aGlzLnBlPS0xO3RoaXMuRmI9bnVsbH1mdW5jdGlvbiBTZyhhLGIsYyl7YS5wZT1iO2EuRmI9YzthLnBlPGEuUWImJihhLkZiKCksYS5GYj1udWxsKX1mdW5jdGlvbiBUZyhhLGIsYyl7Zm9yKGEuS2RbYl09YzthLktkW2EuUWJdOyl7dmFyIGQ9YS5LZFthLlFiXTtkZWxldGUgYS5LZFthLlFiXTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoOysrZSlpZihkW2VdKXt2YXIgZj1hO0NiKGZ1bmN0aW9uKCl7Zi5oYyhkW2VdKX0pfWlmKGEuUWI9PT1hLnBlKXthLkZiJiYoY2xlYXJUaW1lb3V0KGEuRmIpLGEuRmIoKSxhLkZiPW51bGwpO2JyZWFrfWEuUWIrK319O2Z1bmN0aW9uIFVnKGEsYixjKXt0aGlzLnFlPWE7dGhpcy5mPU9jKGEpO3RoaXMub2I9dGhpcy5wYj0wO3RoaXMuVmE9T2IoYik7dGhpcy5WZD1jO3RoaXMuR2M9ITE7dGhpcy5nZD1mdW5jdGlvbihhKXtiLmhvc3QhPT1iLk9hJiYoYS5ucz1iLkNiKTt2YXIgYz1bXSxmO2ZvcihmIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShmKSYmYy5wdXNoKGYrXCI9XCIrYVtmXSk7cmV0dXJuKGIubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKStiLk9hK1wiLy5scD9cIitjLmpvaW4oXCImXCIpfX12YXIgVmcsV2c7XG5VZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe3RoaXMuZ2Y9MDt0aGlzLmthPWI7dGhpcy56Zj1uZXcgUmcoYSk7dGhpcy56Yj0hMTt2YXIgYz10aGlzO3RoaXMucmI9c2V0VGltZW91dChmdW5jdGlvbigpe2MuZihcIlRpbWVkIG91dCB0cnlpbmcgdG8gY29ubmVjdC5cIik7Yy5pYigpO2MucmI9bnVsbH0sTWF0aC5mbG9vcigzRTQpKTtUYyhmdW5jdGlvbigpe2lmKCFjLnpiKXtjLlRhPW5ldyBYZyhmdW5jdGlvbihhLGIsZCxrLGwpe1lnKGMsYXJndW1lbnRzKTtpZihjLlRhKWlmKGMucmImJihjbGVhclRpbWVvdXQoYy5yYiksYy5yYj1udWxsKSxjLkdjPSEwLFwic3RhcnRcIj09YSljLmlkPWIsYy5GZj1kO2Vsc2UgaWYoXCJjbG9zZVwiPT09YSliPyhjLlRhLlRkPSExLFNnKGMuemYsYixmdW5jdGlvbigpe2MuaWIoKX0pKTpjLmliKCk7ZWxzZSB0aHJvdyBFcnJvcihcIlVucmVjb2duaXplZCBjb21tYW5kIHJlY2VpdmVkOiBcIithKTt9LGZ1bmN0aW9uKGEsYil7WWcoYyxhcmd1bWVudHMpO1xuVGcoYy56ZixhLGIpfSxmdW5jdGlvbigpe2MuaWIoKX0sYy5nZCk7dmFyIGE9e3N0YXJ0OlwidFwifTthLnNlcj1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTtjLlRhLmZlJiYoYS5jYj1jLlRhLmZlKTthLnY9XCI1XCI7Yy5WZCYmKGEucz1jLlZkKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5ocmVmJiYtMSE9PWxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZpcmViYXNlaW8uY29tXCIpJiYoYS5yPVwiZlwiKTthPWMuZ2QoYSk7Yy5mKFwiQ29ubmVjdGluZyB2aWEgbG9uZy1wb2xsIHRvIFwiK2EpO1pnKGMuVGEsYSxmdW5jdGlvbigpe30pfX0pfTtcblVnLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuVGEsYj10aGlzLkZmO2Eucmc9dGhpcy5pZDthLnNnPWI7Zm9yKGEua2U9ITA7JGcoYSk7KTthPXRoaXMuaWQ7Yj10aGlzLkZmO3RoaXMuZmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTt2YXIgYz17ZGZyYW1lOlwidFwifTtjLmlkPWE7Yy5wdz1iO3RoaXMuZmMuc3JjPXRoaXMuZ2QoYyk7dGhpcy5mYy5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5mYyl9O1VnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIFZnfHwhV2cmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQmJiEoXCJvYmplY3RcIj09PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jaHJvbWUmJndpbmRvdy5jaHJvbWUuZXh0ZW5zaW9uJiYhL15jaHJvbWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKSYmIShcIm9iamVjdFwiPT09dHlwZW9mIFdpbmRvd3MmJlwib2JqZWN0XCI9PT10eXBlb2YgV2luZG93cy5VZyl9O1xuaD1VZy5wcm90b3R5cGU7aC5CZD1mdW5jdGlvbigpe307aC5jZD1mdW5jdGlvbigpe3RoaXMuemI9ITA7dGhpcy5UYSYmKHRoaXMuVGEuY2xvc2UoKSx0aGlzLlRhPW51bGwpO3RoaXMuZmMmJihkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZmMpLHRoaXMuZmM9bnVsbCk7dGhpcy5yYiYmKGNsZWFyVGltZW91dCh0aGlzLnJiKSx0aGlzLnJiPW51bGwpfTtoLmliPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIkxvbmdwb2xsIGlzIGNsb3NpbmcgaXRzZWxmXCIpLHRoaXMuY2QoKSx0aGlzLmthJiYodGhpcy5rYSh0aGlzLkdjKSx0aGlzLmthPW51bGwpKX07aC5jbG9zZT1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJMb25ncG9sbCBpcyBiZWluZyBjbG9zZWQuXCIpLHRoaXMuY2QoKSl9O1xuaC5zZW5kPWZ1bmN0aW9uKGEpe2E9QihhKTt0aGlzLnBiKz1hLmxlbmd0aDtMYih0aGlzLlZhLFwiYnl0ZXNfc2VudFwiLGEubGVuZ3RoKTthPUtjKGEpO2E9ZmIoYSwhMCk7YT1YYyhhLDE4NDApO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXt2YXIgYz10aGlzLlRhO2MuJGMucHVzaCh7Smc6dGhpcy5nZixSZzphLmxlbmd0aCxqZjphW2JdfSk7Yy5rZSYmJGcoYyk7dGhpcy5nZisrfX07ZnVuY3Rpb24gWWcoYSxiKXt2YXIgYz1CKGIpLmxlbmd0aDthLm9iKz1jO0xiKGEuVmEsXCJieXRlc19yZWNlaXZlZFwiLGMpfVxuZnVuY3Rpb24gWGcoYSxiLGMsZCl7dGhpcy5nZD1kO3RoaXMuamI9Yzt0aGlzLk9lPW5ldyBjZzt0aGlzLiRjPVtdO3RoaXMuc2U9TWF0aC5mbG9vcigxRTgqTWF0aC5yYW5kb20oKSk7dGhpcy5UZD0hMDt0aGlzLmZlPUdjKCk7d2luZG93W1wicExQQ29tbWFuZFwiK3RoaXMuZmVdPWE7d2luZG93W1wicFJUTFBDQlwiK3RoaXMuZmVdPWI7YT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO2Euc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtpZihkb2N1bWVudC5ib2R5KXtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO3RyeXthLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnR8fEJiKFwiTm8gSUUgZG9tYWluIHNldHRpbmcgcmVxdWlyZWRcIil9Y2F0Y2goZSl7YS5zcmM9XCJqYXZhc2NyaXB0OnZvaWQoKGZ1bmN0aW9uKCl7ZG9jdW1lbnQub3BlbigpO2RvY3VtZW50LmRvbWFpbj0nXCIrZG9jdW1lbnQuZG9tYWluK1wiJztkb2N1bWVudC5jbG9zZSgpO30pKCkpXCJ9fWVsc2UgdGhyb3dcIkRvY3VtZW50IGJvZHkgaGFzIG5vdCBpbml0aWFsaXplZC4gV2FpdCB0byBpbml0aWFsaXplIEZpcmViYXNlIHVudGlsIGFmdGVyIHRoZSBkb2N1bWVudCBpcyByZWFkeS5cIjtcbmEuY29udGVudERvY3VtZW50P2EuZ2I9YS5jb250ZW50RG9jdW1lbnQ6YS5jb250ZW50V2luZG93P2EuZ2I9YS5jb250ZW50V2luZG93LmRvY3VtZW50OmEuZG9jdW1lbnQmJihhLmdiPWEuZG9jdW1lbnQpO3RoaXMuQ2E9YTthPVwiXCI7dGhpcy5DYS5zcmMmJlwiamF2YXNjcmlwdDpcIj09PXRoaXMuQ2Euc3JjLnN1YnN0cigwLDExKSYmKGE9JzxzY3JpcHQ+ZG9jdW1lbnQuZG9tYWluPVwiJytkb2N1bWVudC5kb21haW4rJ1wiO1xceDNjL3NjcmlwdD4nKTthPVwiPGh0bWw+PGJvZHk+XCIrYStcIjwvYm9keT48L2h0bWw+XCI7dHJ5e3RoaXMuQ2EuZ2Iub3BlbigpLHRoaXMuQ2EuZ2Iud3JpdGUoYSksdGhpcy5DYS5nYi5jbG9zZSgpfWNhdGNoKGYpe0JiKFwiZnJhbWUgd3JpdGluZyBleGNlcHRpb25cIiksZi5zdGFjayYmQmIoZi5zdGFjayksQmIoZil9fVxuWGcucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy5rZT0hMTtpZih0aGlzLkNhKXt0aGlzLkNhLmdiLmJvZHkuaW5uZXJIVE1MPVwiXCI7dmFyIGE9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bnVsbCE9PWEuQ2EmJihkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEuQ2EpLGEuQ2E9bnVsbCl9LE1hdGguZmxvb3IoMCkpfXZhciBiPXRoaXMuamI7YiYmKHRoaXMuamI9bnVsbCxiKCkpfTtcbmZ1bmN0aW9uICRnKGEpe2lmKGEua2UmJmEuVGQmJmEuT2UuY291bnQoKTwoMDxhLiRjLmxlbmd0aD8yOjEpKXthLnNlKys7dmFyIGI9e307Yi5pZD1hLnJnO2IucHc9YS5zZztiLnNlcj1hLnNlO2Zvcih2YXIgYj1hLmdkKGIpLGM9XCJcIixkPTA7MDxhLiRjLmxlbmd0aDspaWYoMTg3MD49YS4kY1swXS5qZi5sZW5ndGgrMzArYy5sZW5ndGgpe3ZhciBlPWEuJGMuc2hpZnQoKSxjPWMrXCImc2VnXCIrZCtcIj1cIitlLkpnK1wiJnRzXCIrZCtcIj1cIitlLlJnK1wiJmRcIitkK1wiPVwiK2UuamY7ZCsrfWVsc2UgYnJlYWs7YWgoYSxiK2MsYS5zZSk7cmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gYWgoYSxiLGMpe2Z1bmN0aW9uIGQoKXthLk9lLnJlbW92ZShjKTskZyhhKX1hLk9lLmFkZChjLDEpO3ZhciBlPXNldFRpbWVvdXQoZCxNYXRoLmZsb29yKDI1RTMpKTtaZyhhLGIsZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZSk7ZCgpfSl9XG5mdW5jdGlvbiBaZyhhLGIsYyl7c2V0VGltZW91dChmdW5jdGlvbigpe3RyeXtpZihhLlRkKXt2YXIgZD1hLkNhLmdiLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7ZC5hc3luYz0hMDtkLnNyYz1iO2Qub25sb2FkPWQub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5yZWFkeVN0YXRlO2EmJlwibG9hZGVkXCIhPT1hJiZcImNvbXBsZXRlXCIhPT1hfHwoZC5vbmxvYWQ9ZC5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjKCkpfTtkLm9uZXJyb3I9ZnVuY3Rpb24oKXtCYihcIkxvbmctcG9sbCBzY3JpcHQgZmFpbGVkIHRvIGxvYWQ6IFwiK2IpO2EuVGQ9ITE7YS5jbG9zZSgpfTthLkNhLmdiLmJvZHkuYXBwZW5kQ2hpbGQoZCl9fWNhdGNoKGUpe319LE1hdGguZmxvb3IoMSkpfTt2YXIgYmg9bnVsbDtcInVuZGVmaW5lZFwiIT09dHlwZW9mIE1veldlYlNvY2tldD9iaD1Nb3pXZWJTb2NrZXQ6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBXZWJTb2NrZXQmJihiaD1XZWJTb2NrZXQpO2Z1bmN0aW9uIGNoKGEsYixjKXt0aGlzLnFlPWE7dGhpcy5mPU9jKHRoaXMucWUpO3RoaXMuZnJhbWVzPXRoaXMuSmM9bnVsbDt0aGlzLm9iPXRoaXMucGI9dGhpcy5iZj0wO3RoaXMuVmE9T2IoYik7dGhpcy5mYj0oYi5sYj9cIndzczovL1wiOlwid3M6Ly9cIikrYi5PYStcIi8ud3M/dj01XCI7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmbG9jYXRpb24uaHJlZiYmLTEhPT1sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJmaXJlYmFzZWlvLmNvbVwiKSYmKHRoaXMuZmIrPVwiJnI9ZlwiKTtiLmhvc3QhPT1iLk9hJiYodGhpcy5mYj10aGlzLmZiK1wiJm5zPVwiK2IuQ2IpO2MmJih0aGlzLmZiPXRoaXMuZmIrXCImcz1cIitjKX12YXIgZGg7XG5jaC5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe3RoaXMuamI9Yjt0aGlzLndnPWE7dGhpcy5mKFwiV2Vic29ja2V0IGNvbm5lY3RpbmcgdG8gXCIrdGhpcy5mYik7dGhpcy5HYz0hMTtEYy5zZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiLCEwKTt0cnl7dGhpcy52YT1uZXcgYmgodGhpcy5mYil9Y2F0Y2goYyl7dGhpcy5mKFwiRXJyb3IgaW5zdGFudGlhdGluZyBXZWJTb2NrZXQuXCIpO3ZhciBkPWMubWVzc2FnZXx8Yy5kYXRhO2QmJnRoaXMuZihkKTt0aGlzLmliKCk7cmV0dXJufXZhciBlPXRoaXM7dGhpcy52YS5vbm9wZW49ZnVuY3Rpb24oKXtlLmYoXCJXZWJzb2NrZXQgY29ubmVjdGVkLlwiKTtlLkdjPSEwfTt0aGlzLnZhLm9uY2xvc2U9ZnVuY3Rpb24oKXtlLmYoXCJXZWJzb2NrZXQgY29ubmVjdGlvbiB3YXMgZGlzY29ubmVjdGVkLlwiKTtlLnZhPW51bGw7ZS5pYigpfTt0aGlzLnZhLm9ubWVzc2FnZT1mdW5jdGlvbihhKXtpZihudWxsIT09ZS52YSlpZihhPWEuZGF0YSxlLm9iKz1cbmEubGVuZ3RoLExiKGUuVmEsXCJieXRlc19yZWNlaXZlZFwiLGEubGVuZ3RoKSxlaChlKSxudWxsIT09ZS5mcmFtZXMpZmgoZSxhKTtlbHNle2E6e0oobnVsbD09PWUuZnJhbWVzLFwiV2UgYWxyZWFkeSBoYXZlIGEgZnJhbWUgYnVmZmVyXCIpO2lmKDY+PWEubGVuZ3RoKXt2YXIgYj1OdW1iZXIoYSk7aWYoIWlzTmFOKGIpKXtlLmJmPWI7ZS5mcmFtZXM9W107YT1udWxsO2JyZWFrIGF9fWUuYmY9MTtlLmZyYW1lcz1bXX1udWxsIT09YSYmZmgoZSxhKX19O3RoaXMudmEub25lcnJvcj1mdW5jdGlvbihhKXtlLmYoXCJXZWJTb2NrZXQgZXJyb3IuICBDbG9zaW5nIGNvbm5lY3Rpb24uXCIpOyhhPWEubWVzc2FnZXx8YS5kYXRhKSYmZS5mKGEpO2UuaWIoKX19O2NoLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe307XG5jaC5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3ZhciBhPSExO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IudXNlckFnZW50KXt2YXIgYj1uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkIChbMC05XXswLH1cXC5bMC05XXswLH0pLyk7YiYmMTxiLmxlbmd0aCYmNC40PnBhcnNlRmxvYXQoYlsxXSkmJihhPSEwKX1yZXR1cm4hYSYmbnVsbCE9PWJoJiYhZGh9O2NoLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHk9MjtjaC5oZWFsdGh5VGltZW91dD0zRTQ7aD1jaC5wcm90b3R5cGU7aC5CZD1mdW5jdGlvbigpe0RjLnJlbW92ZShcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIpfTtmdW5jdGlvbiBmaChhLGIpe2EuZnJhbWVzLnB1c2goYik7aWYoYS5mcmFtZXMubGVuZ3RoPT1hLmJmKXt2YXIgYz1hLmZyYW1lcy5qb2luKFwiXCIpO2EuZnJhbWVzPW51bGw7Yz1tYihjKTthLndnKGMpfX1cbmguc2VuZD1mdW5jdGlvbihhKXtlaCh0aGlzKTthPUIoYSk7dGhpcy5wYis9YS5sZW5ndGg7TGIodGhpcy5WYSxcImJ5dGVzX3NlbnRcIixhLmxlbmd0aCk7YT1YYyhhLDE2Mzg0KTsxPGEubGVuZ3RoJiZ0aGlzLnZhLnNlbmQoU3RyaW5nKGEubGVuZ3RoKSk7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspdGhpcy52YS5zZW5kKGFbYl0pfTtoLmNkPWZ1bmN0aW9uKCl7dGhpcy56Yj0hMDt0aGlzLkpjJiYoY2xlYXJJbnRlcnZhbCh0aGlzLkpjKSx0aGlzLkpjPW51bGwpO3RoaXMudmEmJih0aGlzLnZhLmNsb3NlKCksdGhpcy52YT1udWxsKX07aC5pYj1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJXZWJTb2NrZXQgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5jZCgpLHRoaXMuamImJih0aGlzLmpiKHRoaXMuR2MpLHRoaXMuamI9bnVsbCkpfTtoLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIldlYlNvY2tldCBpcyBiZWluZyBjbG9zZWRcIiksdGhpcy5jZCgpKX07XG5mdW5jdGlvbiBlaChhKXtjbGVhckludGVydmFsKGEuSmMpO2EuSmM9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXthLnZhJiZhLnZhLnNlbmQoXCIwXCIpO2VoKGEpfSxNYXRoLmZsb29yKDQ1RTMpKX07ZnVuY3Rpb24gZ2goYSl7aGgodGhpcyxhKX12YXIgaWg9W1VnLGNoXTtmdW5jdGlvbiBoaChhLGIpe3ZhciBjPWNoJiZjaC5pc0F2YWlsYWJsZSgpLGQ9YyYmIShEYy51Znx8ITA9PT1EYy5nZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiKSk7Yi5UZyYmKGN8fFEoXCJ3c3M6Ly8gVVJMIHVzZWQsIGJ1dCBicm93c2VyIGlzbid0IGtub3duIHRvIHN1cHBvcnQgd2Vic29ja2V0cy4gIFRyeWluZyBhbnl3YXkuXCIpLGQ9ITApO2lmKGQpYS5lZD1bY2hdO2Vsc2V7dmFyIGU9YS5lZD1bXTtZYyhpaCxmdW5jdGlvbihhLGIpe2ImJmIuaXNBdmFpbGFibGUoKSYmZS5wdXNoKGIpfSl9fWZ1bmN0aW9uIGpoKGEpe2lmKDA8YS5lZC5sZW5ndGgpcmV0dXJuIGEuZWRbMF07dGhyb3cgRXJyb3IoXCJObyB0cmFuc3BvcnRzIGF2YWlsYWJsZVwiKTt9O2Z1bmN0aW9uIGtoKGEsYixjLGQsZSxmKXt0aGlzLmlkPWE7dGhpcy5mPU9jKFwiYzpcIit0aGlzLmlkK1wiOlwiKTt0aGlzLmhjPWM7dGhpcy5WYz1kO3RoaXMua2E9ZTt0aGlzLk1lPWY7dGhpcy5IPWI7dGhpcy5KZD1bXTt0aGlzLmVmPTA7dGhpcy5OZj1uZXcgZ2goYik7dGhpcy5VYT0wO3RoaXMuZihcIkNvbm5lY3Rpb24gY3JlYXRlZFwiKTtsaCh0aGlzKX1cbmZ1bmN0aW9uIGxoKGEpe3ZhciBiPWpoKGEuTmYpO2EuTD1uZXcgYihcImM6XCIrYS5pZCtcIjpcIithLmVmKyssYS5IKTthLlFlPWIucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeXx8MDt2YXIgYz1taChhLGEuTCksZD1uaChhLGEuTCk7YS5mZD1hLkw7YS5iZD1hLkw7YS5GPW51bGw7YS5BYj0hMTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5MJiZhLkwub3BlbihjLGQpfSxNYXRoLmZsb29yKDApKTtiPWIuaGVhbHRoeVRpbWVvdXR8fDA7MDxiJiYoYS52ZD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS52ZD1udWxsO2EuQWJ8fChhLkwmJjEwMjQwMDxhLkwub2I/KGEuZihcIkNvbm5lY3Rpb24gZXhjZWVkZWQgaGVhbHRoeSB0aW1lb3V0IGJ1dCBoYXMgcmVjZWl2ZWQgXCIrYS5MLm9iK1wiIGJ5dGVzLiAgTWFya2luZyBjb25uZWN0aW9uIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5MLkJkKCkpOmEuTCYmMTAyNDA8YS5MLnBiP2EuZihcIkNvbm5lY3Rpb24gZXhjZWVkZWQgaGVhbHRoeSB0aW1lb3V0IGJ1dCBoYXMgc2VudCBcIitcbmEuTC5wYitcIiBieXRlcy4gIExlYXZpbmcgY29ubmVjdGlvbiBhbGl2ZS5cIik6KGEuZihcIkNsb3NpbmcgdW5oZWFsdGh5IGNvbm5lY3Rpb24gYWZ0ZXIgdGltZW91dC5cIiksYS5jbG9zZSgpKSl9LE1hdGguZmxvb3IoYikpKX1mdW5jdGlvbiBuaChhLGIpe3JldHVybiBmdW5jdGlvbihjKXtiPT09YS5MPyhhLkw9bnVsbCxjfHwwIT09YS5VYT8xPT09YS5VYSYmYS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBsb3N0LlwiKTooYS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBmYWlsZWQuXCIpLFwicy1cIj09PWEuSC5PYS5zdWJzdHIoMCwyKSYmKERjLnJlbW92ZShcImhvc3Q6XCIrYS5ILmhvc3QpLGEuSC5PYT1hLkguaG9zdCkpLGEuY2xvc2UoKSk6Yj09PWEuRj8oYS5mKFwiU2Vjb25kYXJ5IGNvbm5lY3Rpb24gbG9zdC5cIiksYz1hLkYsYS5GPW51bGwsYS5mZCE9PWMmJmEuYmQhPT1jfHxhLmNsb3NlKCkpOmEuZihcImNsb3NpbmcgYW4gb2xkIGNvbm5lY3Rpb25cIil9fVxuZnVuY3Rpb24gbWgoYSxiKXtyZXR1cm4gZnVuY3Rpb24oYyl7aWYoMiE9YS5VYSlpZihiPT09YS5iZCl7dmFyIGQ9VmMoXCJ0XCIsYyk7Yz1WYyhcImRcIixjKTtpZihcImNcIj09ZCl7aWYoZD1WYyhcInRcIixjKSxcImRcImluIGMpaWYoYz1jLmQsXCJoXCI9PT1kKXt2YXIgZD1jLnRzLGU9Yy52LGY9Yy5oO2EuVmQ9Yy5zO0ZjKGEuSCxmKTswPT1hLlVhJiYoYS5MLnN0YXJ0KCksb2goYSxhLkwsZCksXCI1XCIhPT1lJiZRKFwiUHJvdG9jb2wgdmVyc2lvbiBtaXNtYXRjaCBkZXRlY3RlZFwiKSxjPWEuTmYsKGM9MTxjLmVkLmxlbmd0aD9jLmVkWzFdOm51bGwpJiZwaChhLGMpKX1lbHNlIGlmKFwiblwiPT09ZCl7YS5mKFwicmVjdmQgZW5kIHRyYW5zbWlzc2lvbiBvbiBwcmltYXJ5XCIpO2EuYmQ9YS5GO2ZvcihjPTA7YzxhLkpkLmxlbmd0aDsrK2MpYS5GZChhLkpkW2NdKTthLkpkPVtdO3FoKGEpfWVsc2VcInNcIj09PWQ/KGEuZihcIkNvbm5lY3Rpb24gc2h1dGRvd24gY29tbWFuZCByZWNlaXZlZC4gU2h1dHRpbmcgZG93bi4uLlwiKSxcbmEuTWUmJihhLk1lKGMpLGEuTWU9bnVsbCksYS5rYT1udWxsLGEuY2xvc2UoKSk6XCJyXCI9PT1kPyhhLmYoXCJSZXNldCBwYWNrZXQgcmVjZWl2ZWQuICBOZXcgaG9zdDogXCIrYyksRmMoYS5ILGMpLDE9PT1hLlVhP2EuY2xvc2UoKToocmgoYSksbGgoYSkpKTpcImVcIj09PWQ/UGMoXCJTZXJ2ZXIgRXJyb3I6IFwiK2MpOlwib1wiPT09ZD8oYS5mKFwiZ290IHBvbmcgb24gcHJpbWFyeS5cIiksc2goYSksdGgoYSkpOlBjKFwiVW5rbm93biBjb250cm9sIHBhY2tldCBjb21tYW5kOiBcIitkKX1lbHNlXCJkXCI9PWQmJmEuRmQoYyl9ZWxzZSBpZihiPT09YS5GKWlmKGQ9VmMoXCJ0XCIsYyksYz1WYyhcImRcIixjKSxcImNcIj09ZClcInRcImluIGMmJihjPWMudCxcImFcIj09PWM/dWgoYSk6XCJyXCI9PT1jPyhhLmYoXCJHb3QgYSByZXNldCBvbiBzZWNvbmRhcnksIGNsb3NpbmcgaXRcIiksYS5GLmNsb3NlKCksYS5mZCE9PWEuRiYmYS5iZCE9PWEuRnx8YS5jbG9zZSgpKTpcIm9cIj09PWMmJihhLmYoXCJnb3QgcG9uZyBvbiBzZWNvbmRhcnkuXCIpLFxuYS5MZi0tLHVoKGEpKSk7ZWxzZSBpZihcImRcIj09ZClhLkpkLnB1c2goYyk7ZWxzZSB0aHJvdyBFcnJvcihcIlVua25vd24gcHJvdG9jb2wgbGF5ZXI6IFwiK2QpO2Vsc2UgYS5mKFwibWVzc2FnZSBvbiBvbGQgY29ubmVjdGlvblwiKX19a2gucHJvdG90eXBlLkRhPWZ1bmN0aW9uKGEpe3ZoKHRoaXMse3Q6XCJkXCIsZDphfSl9O2Z1bmN0aW9uIHFoKGEpe2EuZmQ9PT1hLkYmJmEuYmQ9PT1hLkYmJihhLmYoXCJjbGVhbmluZyB1cCBhbmQgcHJvbW90aW5nIGEgY29ubmVjdGlvbjogXCIrYS5GLnFlKSxhLkw9YS5GLGEuRj1udWxsKX1cbmZ1bmN0aW9uIHVoKGEpezA+PWEuTGY/KGEuZihcIlNlY29uZGFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5GLkJkKCksYS5GLnN0YXJ0KCksYS5mKFwic2VuZGluZyBjbGllbnQgYWNrIG9uIHNlY29uZGFyeVwiKSxhLkYuc2VuZCh7dDpcImNcIixkOnt0OlwiYVwiLGQ6e319fSksYS5mKFwiRW5kaW5nIHRyYW5zbWlzc2lvbiBvbiBwcmltYXJ5XCIpLGEuTC5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJuXCIsZDp7fX19KSxhLmZkPWEuRixxaChhKSk6KGEuZihcInNlbmRpbmcgcGluZyBvbiBzZWNvbmRhcnkuXCIpLGEuRi5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJwXCIsZDp7fX19KSl9a2gucHJvdG90eXBlLkZkPWZ1bmN0aW9uKGEpe3NoKHRoaXMpO3RoaXMuaGMoYSl9O2Z1bmN0aW9uIHNoKGEpe2EuQWJ8fChhLlFlLS0sMD49YS5RZSYmKGEuZihcIlByaW1hcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuTC5CZCgpKSl9XG5mdW5jdGlvbiBwaChhLGIpe2EuRj1uZXcgYihcImM6XCIrYS5pZCtcIjpcIithLmVmKyssYS5ILGEuVmQpO2EuTGY9Yi5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5fHwwO2EuRi5vcGVuKG1oKGEsYS5GKSxuaChhLGEuRikpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLkYmJihhLmYoXCJUaW1lZCBvdXQgdHJ5aW5nIHRvIHVwZ3JhZGUuXCIpLGEuRi5jbG9zZSgpKX0sTWF0aC5mbG9vcig2RTQpKX1mdW5jdGlvbiBvaChhLGIsYyl7YS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBlc3RhYmxpc2hlZC5cIik7YS5MPWI7YS5VYT0xO2EuVmMmJihhLlZjKGMpLGEuVmM9bnVsbCk7MD09PWEuUWU/KGEuZihcIlByaW1hcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwKTpzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGgoYSl9LE1hdGguZmxvb3IoNUUzKSl9XG5mdW5jdGlvbiB0aChhKXthLkFifHwxIT09YS5VYXx8KGEuZihcInNlbmRpbmcgcGluZyBvbiBwcmltYXJ5LlwiKSx2aChhLHt0OlwiY1wiLGQ6e3Q6XCJwXCIsZDp7fX19KSl9ZnVuY3Rpb24gdmgoYSxiKXtpZigxIT09YS5VYSl0aHJvd1wiQ29ubmVjdGlvbiBpcyBub3QgY29ubmVjdGVkXCI7YS5mZC5zZW5kKGIpfWtoLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpezIhPT10aGlzLlVhJiYodGhpcy5mKFwiQ2xvc2luZyByZWFsdGltZSBjb25uZWN0aW9uLlwiKSx0aGlzLlVhPTIscmgodGhpcyksdGhpcy5rYSYmKHRoaXMua2EoKSx0aGlzLmthPW51bGwpKX07ZnVuY3Rpb24gcmgoYSl7YS5mKFwiU2h1dHRpbmcgZG93biBhbGwgY29ubmVjdGlvbnNcIik7YS5MJiYoYS5MLmNsb3NlKCksYS5MPW51bGwpO2EuRiYmKGEuRi5jbG9zZSgpLGEuRj1udWxsKTthLnZkJiYoY2xlYXJUaW1lb3V0KGEudmQpLGEudmQ9bnVsbCl9O2Z1bmN0aW9uIHdoKGEsYixjLGQpe3RoaXMuaWQ9eGgrKzt0aGlzLmY9T2MoXCJwOlwiK3RoaXMuaWQrXCI6XCIpO3RoaXMud2Y9dGhpcy5EZT0hMTt0aGlzLmFhPXt9O3RoaXMucGE9W107dGhpcy5YYz0wO3RoaXMuVWM9W107dGhpcy5tYT0hMTt0aGlzLiRhPTFFMzt0aGlzLkNkPTNFNTt0aGlzLkdiPWI7dGhpcy5UYz1jO3RoaXMuTmU9ZDt0aGlzLkg9YTt0aGlzLldlPW51bGw7dGhpcy5RZD17fTt0aGlzLklnPTA7dGhpcy5tZj0hMDt0aGlzLktjPXRoaXMuRmU9bnVsbDt5aCh0aGlzLDApO01mLnViKCkuRWIoXCJ2aXNpYmxlXCIsdGhpcy56Zyx0aGlzKTstMT09PWEuaG9zdC5pbmRleE9mKFwiZmJsb2NhbFwiKSYmTGYudWIoKS5FYihcIm9ubGluZVwiLHRoaXMueGcsdGhpcyl9dmFyIHhoPTAsemg9MDtoPXdoLnByb3RvdHlwZTtcbmguRGE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPSsrdGhpcy5JZzthPXtyOmQsYTphLGI6Yn07dGhpcy5mKEIoYSkpO0oodGhpcy5tYSxcInNlbmRSZXF1ZXN0IGNhbGwgd2hlbiB3ZSdyZSBub3QgY29ubmVjdGVkIG5vdCBhbGxvd2VkLlwiKTt0aGlzLlNhLkRhKGEpO2MmJih0aGlzLlFkW2RdPWMpfTtoLnhmPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEud2EoKSxmPWEucGF0aC50b1N0cmluZygpO3RoaXMuZihcIkxpc3RlbiBjYWxsZWQgZm9yIFwiK2YrXCIgXCIrZSk7dGhpcy5hYVtmXT10aGlzLmFhW2ZdfHx7fTtKKCF0aGlzLmFhW2ZdW2VdLFwibGlzdGVuKCkgY2FsbGVkIHR3aWNlIGZvciBzYW1lIHBhdGgvcXVlcnlJZC5cIik7YT17SjpkLHVkOmIsRmc6YSx0YWc6Y307dGhpcy5hYVtmXVtlXT1hO3RoaXMubWEmJkFoKHRoaXMsYSl9O1xuZnVuY3Rpb24gQWgoYSxiKXt2YXIgYz1iLkZnLGQ9Yy5wYXRoLnRvU3RyaW5nKCksZT1jLndhKCk7YS5mKFwiTGlzdGVuIG9uIFwiK2QrXCIgZm9yIFwiK2UpO3ZhciBmPXtwOmR9O2IudGFnJiYoZi5xPWNlKGMubyksZi50PWIudGFnKTtmLmg9Yi51ZCgpO2EuRGEoXCJxXCIsZixmdW5jdGlvbihmKXt2YXIgaz1mLmQsbD1mLnM7aWYoayYmXCJvYmplY3RcIj09PXR5cGVvZiBrJiZ1KGssXCJ3XCIpKXt2YXIgbT13KGssXCJ3XCIpO2VhKG0pJiYwPD1OYShtLFwibm9faW5kZXhcIikmJlEoXCJVc2luZyBhbiB1bnNwZWNpZmllZCBpbmRleC4gQ29uc2lkZXIgYWRkaW5nIFwiKygnXCIuaW5kZXhPblwiOiBcIicrYy5vLmcudG9TdHJpbmcoKSsnXCInKStcIiBhdCBcIitjLnBhdGgudG9TdHJpbmcoKStcIiB0byB5b3VyIHNlY3VyaXR5IHJ1bGVzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VcIil9KGEuYWFbZF0mJmEuYWFbZF1bZV0pPT09YiYmKGEuZihcImxpc3RlbiByZXNwb25zZVwiLGYpLFwib2tcIiE9PWwmJkJoKGEsZCxlKSxiLkomJlxuYi5KKGwsaykpfSl9aC5QPWZ1bmN0aW9uKGEsYixjKXt0aGlzLkZhPXtmZzphLG5mOiExLHljOmIsamQ6Y307dGhpcy5mKFwiQXV0aGVudGljYXRpbmcgdXNpbmcgY3JlZGVudGlhbDogXCIrYSk7Q2godGhpcyk7KGI9NDA9PWEubGVuZ3RoKXx8KGE9YWQoYSkuQWMsYj1cIm9iamVjdFwiPT09dHlwZW9mIGEmJiEwPT09dyhhLFwiYWRtaW5cIikpO2ImJih0aGlzLmYoXCJBZG1pbiBhdXRoIGNyZWRlbnRpYWwgZGV0ZWN0ZWQuICBSZWR1Y2luZyBtYXggcmVjb25uZWN0IHRpbWUuXCIpLHRoaXMuQ2Q9M0U0KX07aC5lZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy5GYTt0aGlzLm1hJiZ0aGlzLkRhKFwidW5hdXRoXCIse30sZnVuY3Rpb24oYil7YShiLnMsYi5kKX0pfTtcbmZ1bmN0aW9uIENoKGEpe3ZhciBiPWEuRmE7YS5tYSYmYiYmYS5EYShcImF1dGhcIix7Y3JlZDpiLmZnfSxmdW5jdGlvbihjKXt2YXIgZD1jLnM7Yz1jLmR8fFwiZXJyb3JcIjtcIm9rXCIhPT1kJiZhLkZhPT09YiYmZGVsZXRlIGEuRmE7Yi5uZj9cIm9rXCIhPT1kJiZiLmpkJiZiLmpkKGQsYyk6KGIubmY9ITAsYi55YyYmYi55YyhkLGMpKX0pfWguT2Y9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnBhdGgudG9TdHJpbmcoKSxkPWEud2EoKTt0aGlzLmYoXCJVbmxpc3RlbiBjYWxsZWQgZm9yIFwiK2MrXCIgXCIrZCk7aWYoQmgodGhpcyxjLGQpJiZ0aGlzLm1hKXt2YXIgZT1jZShhLm8pO3RoaXMuZihcIlVubGlzdGVuIG9uIFwiK2MrXCIgZm9yIFwiK2QpO2M9e3A6Y307YiYmKGMucT1lLGMudD1iKTt0aGlzLkRhKFwiblwiLGMpfX07aC5MZT1mdW5jdGlvbihhLGIsYyl7dGhpcy5tYT9EaCh0aGlzLFwib1wiLGEsYixjKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib1wiLGRhdGE6YixKOmN9KX07XG5oLkJmPWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1hP0RoKHRoaXMsXCJvbVwiLGEsYixjKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib21cIixkYXRhOmIsSjpjfSl9O2guR2Q9ZnVuY3Rpb24oYSxiKXt0aGlzLm1hP0RoKHRoaXMsXCJvY1wiLGEsbnVsbCxiKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib2NcIixkYXRhOm51bGwsSjpifSl9O2Z1bmN0aW9uIERoKGEsYixjLGQsZSl7Yz17cDpjLGQ6ZH07YS5mKFwib25EaXNjb25uZWN0IFwiK2IsYyk7YS5EYShiLGMsZnVuY3Rpb24oYSl7ZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2UoYS5zLGEuZCl9LE1hdGguZmxvb3IoMCkpfSl9aC5wdXQ9ZnVuY3Rpb24oYSxiLGMsZCl7RWgodGhpcyxcInBcIixhLGIsYyxkKX07aC55Zj1mdW5jdGlvbihhLGIsYyxkKXtFaCh0aGlzLFwibVwiLGEsYixjLGQpfTtcbmZ1bmN0aW9uIEVoKGEsYixjLGQsZSxmKXtkPXtwOmMsZDpkfTtuKGYpJiYoZC5oPWYpO2EucGEucHVzaCh7YWN0aW9uOmIsSWY6ZCxKOmV9KTthLlhjKys7Yj1hLnBhLmxlbmd0aC0xO2EubWE/RmgoYSxiKTphLmYoXCJCdWZmZXJpbmcgcHV0OiBcIitjKX1mdW5jdGlvbiBGaChhLGIpe3ZhciBjPWEucGFbYl0uYWN0aW9uLGQ9YS5wYVtiXS5JZixlPWEucGFbYl0uSjthLnBhW2JdLkdnPWEubWE7YS5EYShjLGQsZnVuY3Rpb24oZCl7YS5mKGMrXCIgcmVzcG9uc2VcIixkKTtkZWxldGUgYS5wYVtiXTthLlhjLS07MD09PWEuWGMmJihhLnBhPVtdKTtlJiZlKGQucyxkLmQpfSl9aC5UZT1mdW5jdGlvbihhKXt0aGlzLm1hJiYoYT17YzphfSx0aGlzLmYoXCJyZXBvcnRTdGF0c1wiLGEpLHRoaXMuRGEoXCJzXCIsYSxmdW5jdGlvbihhKXtcIm9rXCIhPT1hLnMmJnRoaXMuZihcInJlcG9ydFN0YXRzXCIsXCJFcnJvciBzZW5kaW5nIHN0YXRzOiBcIithLmQpfSkpfTtcbmguRmQ9ZnVuY3Rpb24oYSl7aWYoXCJyXCJpbiBhKXt0aGlzLmYoXCJmcm9tIHNlcnZlcjogXCIrQihhKSk7dmFyIGI9YS5yLGM9dGhpcy5RZFtiXTtjJiYoZGVsZXRlIHRoaXMuUWRbYl0sYyhhLmIpKX1lbHNle2lmKFwiZXJyb3JcImluIGEpdGhyb3dcIkEgc2VydmVyLXNpZGUgZXJyb3IgaGFzIG9jY3VycmVkOiBcIithLmVycm9yO1wiYVwiaW4gYSYmKGI9YS5hLGM9YS5iLHRoaXMuZihcImhhbmRsZVNlcnZlck1lc3NhZ2VcIixiLGMpLFwiZFwiPT09Yj90aGlzLkdiKGMucCxjLmQsITEsYy50KTpcIm1cIj09PWI/dGhpcy5HYihjLnAsYy5kLCEwLGMudCk6XCJjXCI9PT1iP0doKHRoaXMsYy5wLGMucSk6XCJhY1wiPT09Yj8oYT1jLnMsYj1jLmQsYz10aGlzLkZhLGRlbGV0ZSB0aGlzLkZhLGMmJmMuamQmJmMuamQoYSxiKSk6XCJzZFwiPT09Yj90aGlzLldlP3RoaXMuV2UoYyk6XCJtc2dcImluIGMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSYmY29uc29sZS5sb2coXCJGSVJFQkFTRTogXCIrYy5tc2cucmVwbGFjZShcIlxcblwiLFxuXCJcXG5GSVJFQkFTRTogXCIpKTpQYyhcIlVucmVjb2duaXplZCBhY3Rpb24gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiK0IoYikrXCJcXG5BcmUgeW91IHVzaW5nIHRoZSBsYXRlc3QgY2xpZW50P1wiKSl9fTtoLlZjPWZ1bmN0aW9uKGEpe3RoaXMuZihcImNvbm5lY3Rpb24gcmVhZHlcIik7dGhpcy5tYT0hMDt0aGlzLktjPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3RoaXMuTmUoe3NlcnZlclRpbWVPZmZzZXQ6YS0obmV3IERhdGUpLmdldFRpbWUoKX0pO3RoaXMubWYmJihhPXt9LGFbXCJzZGsuanMuXCIrXCIyLjIuNVwiLnJlcGxhY2UoL1xcLi9nLFwiLVwiKV09MSxrZygpJiYoYVtcImZyYW1ld29yay5jb3Jkb3ZhXCJdPTEpLHRoaXMuVGUoYSkpO0hoKHRoaXMpO3RoaXMubWY9ITE7dGhpcy5UYyghMCl9O1xuZnVuY3Rpb24geWgoYSxiKXtKKCFhLlNhLFwiU2NoZWR1bGluZyBhIGNvbm5lY3Qgd2hlbiB3ZSdyZSBhbHJlYWR5IGNvbm5lY3RlZC9pbmc/XCIpO2EuU2ImJmNsZWFyVGltZW91dChhLlNiKTthLlNiPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthLlNiPW51bGw7SWgoYSl9LE1hdGguZmxvb3IoYikpfWguemc9ZnVuY3Rpb24oYSl7YSYmIXRoaXMudWMmJnRoaXMuJGE9PT10aGlzLkNkJiYodGhpcy5mKFwiV2luZG93IGJlY2FtZSB2aXNpYmxlLiAgUmVkdWNpbmcgZGVsYXkuXCIpLHRoaXMuJGE9MUUzLHRoaXMuU2F8fHloKHRoaXMsMCkpO3RoaXMudWM9YX07aC54Zz1mdW5jdGlvbihhKXthPyh0aGlzLmYoXCJCcm93c2VyIHdlbnQgb25saW5lLlwiKSx0aGlzLiRhPTFFMyx0aGlzLlNhfHx5aCh0aGlzLDApKToodGhpcy5mKFwiQnJvd3NlciB3ZW50IG9mZmxpbmUuICBLaWxsaW5nIGNvbm5lY3Rpb24uXCIpLHRoaXMuU2EmJnRoaXMuU2EuY2xvc2UoKSl9O1xuaC5DZj1mdW5jdGlvbigpe3RoaXMuZihcImRhdGEgY2xpZW50IGRpc2Nvbm5lY3RlZFwiKTt0aGlzLm1hPSExO3RoaXMuU2E9bnVsbDtmb3IodmFyIGE9MDthPHRoaXMucGEubGVuZ3RoO2ErKyl7dmFyIGI9dGhpcy5wYVthXTtiJiZcImhcImluIGIuSWYmJmIuR2cmJihiLkomJmIuSihcImRpc2Nvbm5lY3RcIiksZGVsZXRlIHRoaXMucGFbYV0sdGhpcy5YYy0tKX0wPT09dGhpcy5YYyYmKHRoaXMucGE9W10pO3RoaXMuUWQ9e307SmgodGhpcykmJih0aGlzLnVjP3RoaXMuS2MmJigzRTQ8KG5ldyBEYXRlKS5nZXRUaW1lKCktdGhpcy5LYyYmKHRoaXMuJGE9MUUzKSx0aGlzLktjPW51bGwpOih0aGlzLmYoXCJXaW5kb3cgaXNuJ3QgdmlzaWJsZS4gIERlbGF5aW5nIHJlY29ubmVjdC5cIiksdGhpcy4kYT10aGlzLkNkLHRoaXMuRmU9KG5ldyBEYXRlKS5nZXRUaW1lKCkpLGE9TWF0aC5tYXgoMCx0aGlzLiRhLSgobmV3IERhdGUpLmdldFRpbWUoKS10aGlzLkZlKSksYSo9TWF0aC5yYW5kb20oKSx0aGlzLmYoXCJUcnlpbmcgdG8gcmVjb25uZWN0IGluIFwiK1xuYStcIm1zXCIpLHloKHRoaXMsYSksdGhpcy4kYT1NYXRoLm1pbih0aGlzLkNkLDEuMyp0aGlzLiRhKSk7dGhpcy5UYyghMSl9O2Z1bmN0aW9uIEloKGEpe2lmKEpoKGEpKXthLmYoXCJNYWtpbmcgYSBjb25uZWN0aW9uIGF0dGVtcHRcIik7YS5GZT0obmV3IERhdGUpLmdldFRpbWUoKTthLktjPW51bGw7dmFyIGI9cShhLkZkLGEpLGM9cShhLlZjLGEpLGQ9cShhLkNmLGEpLGU9YS5pZCtcIjpcIit6aCsrO2EuU2E9bmV3IGtoKGUsYS5ILGIsYyxkLGZ1bmN0aW9uKGIpe1EoYitcIiAoXCIrYS5ILnRvU3RyaW5nKCkrXCIpXCIpO2Eud2Y9ITB9KX19aC55Yj1mdW5jdGlvbigpe3RoaXMuRGU9ITA7dGhpcy5TYT90aGlzLlNhLmNsb3NlKCk6KHRoaXMuU2ImJihjbGVhclRpbWVvdXQodGhpcy5TYiksdGhpcy5TYj1udWxsKSx0aGlzLm1hJiZ0aGlzLkNmKCkpfTtoLnFjPWZ1bmN0aW9uKCl7dGhpcy5EZT0hMTt0aGlzLiRhPTFFMzt0aGlzLlNhfHx5aCh0aGlzLDApfTtcbmZ1bmN0aW9uIEdoKGEsYixjKXtjPWM/UWEoYyxmdW5jdGlvbihhKXtyZXR1cm4gV2MoYSl9KS5qb2luKFwiJFwiKTpcImRlZmF1bHRcIjsoYT1CaChhLGIsYykpJiZhLkomJmEuSihcInBlcm1pc3Npb25fZGVuaWVkXCIpfWZ1bmN0aW9uIEJoKGEsYixjKXtiPShuZXcgSyhiKSkudG9TdHJpbmcoKTt2YXIgZDtuKGEuYWFbYl0pPyhkPWEuYWFbYl1bY10sZGVsZXRlIGEuYWFbYl1bY10sMD09PXBhKGEuYWFbYl0pJiZkZWxldGUgYS5hYVtiXSk6ZD12b2lkIDA7cmV0dXJuIGR9ZnVuY3Rpb24gSGgoYSl7Q2goYSk7cihhLmFhLGZ1bmN0aW9uKGIpe3IoYixmdW5jdGlvbihiKXtBaChhLGIpfSl9KTtmb3IodmFyIGI9MDtiPGEucGEubGVuZ3RoO2IrKylhLnBhW2JdJiZGaChhLGIpO2Zvcig7YS5VYy5sZW5ndGg7KWI9YS5VYy5zaGlmdCgpLERoKGEsYi5hY3Rpb24sYi5aYyxiLmRhdGEsYi5KKX1mdW5jdGlvbiBKaChhKXt2YXIgYjtiPUxmLnViKCkuaWM7cmV0dXJuIWEud2YmJiFhLkRlJiZifTt2YXIgVj17bGc6ZnVuY3Rpb24oKXtWZz1kaD0hMH19O1YuZm9yY2VMb25nUG9sbGluZz1WLmxnO1YubWc9ZnVuY3Rpb24oKXtXZz0hMH07Vi5mb3JjZVdlYlNvY2tldHM9Vi5tZztWLk1nPWZ1bmN0aW9uKGEsYil7YS5rLlJhLldlPWJ9O1Yuc2V0U2VjdXJpdHlEZWJ1Z0NhbGxiYWNrPVYuTWc7Vi5ZZT1mdW5jdGlvbihhLGIpe2Euay5ZZShiKX07Vi5zdGF0cz1WLlllO1YuWmU9ZnVuY3Rpb24oYSxiKXthLmsuWmUoYil9O1Yuc3RhdHNJbmNyZW1lbnRDb3VudGVyPVYuWmU7Vi5wZD1mdW5jdGlvbihhKXtyZXR1cm4gYS5rLnBkfTtWLmRhdGFVcGRhdGVDb3VudD1WLnBkO1YucGc9ZnVuY3Rpb24oYSxiKXthLmsuQ2U9Yn07Vi5pbnRlcmNlcHRTZXJ2ZXJEYXRhPVYucGc7Vi52Zz1mdW5jdGlvbihhKXtuZXcgdWcoYSl9O1Yub25Qb3B1cE9wZW49Vi52ZztWLktnPWZ1bmN0aW9uKGEpe2ZnPWF9O1Yuc2V0QXV0aGVudGljYXRpb25TZXJ2ZXI9Vi5LZztmdW5jdGlvbiBTKGEsYixjKXt0aGlzLkI9YTt0aGlzLlY9Yjt0aGlzLmc9Y31TLnByb3RvdHlwZS5LPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC52YWxcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5LKCl9O1MucHJvdG90eXBlLnZhbD1TLnByb3RvdHlwZS5LO1MucHJvdG90eXBlLmxmPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5leHBvcnRWYWxcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5LKCEwKX07Uy5wcm90b3R5cGUuZXhwb3J0VmFsPVMucHJvdG90eXBlLmxmO1MucHJvdG90eXBlLmtnPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5leGlzdHNcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIXRoaXMuQi5lKCl9O1MucHJvdG90eXBlLmV4aXN0cz1TLnByb3RvdHlwZS5rZztcblMucHJvdG90eXBlLnc9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5jaGlsZFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtnYShhKSYmKGE9U3RyaW5nKGEpKTtYZihcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5jaGlsZFwiLGEpO3ZhciBiPW5ldyBLKGEpLGM9dGhpcy5WLncoYik7cmV0dXJuIG5ldyBTKHRoaXMuQi5vYShiKSxjLE0pfTtTLnByb3RvdHlwZS5jaGlsZD1TLnByb3RvdHlwZS53O1MucHJvdG90eXBlLkhhPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7WGYoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRcIixhKTt2YXIgYj1uZXcgSyhhKTtyZXR1cm4hdGhpcy5CLm9hKGIpLmUoKX07Uy5wcm90b3R5cGUuaGFzQ2hpbGQ9Uy5wcm90b3R5cGUuSGE7XG5TLnByb3RvdHlwZS5BPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5nZXRQcmlvcml0eVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLkEoKS5LKCl9O1MucHJvdG90eXBlLmdldFByaW9yaXR5PVMucHJvdG90eXBlLkE7Uy5wcm90b3R5cGUuZm9yRWFjaD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmZvckVhY2hcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5mb3JFYWNoXCIsMSxhLCExKTtpZih0aGlzLkIuTigpKXJldHVybiExO3ZhciBiPXRoaXM7cmV0dXJuISF0aGlzLkIuVSh0aGlzLmcsZnVuY3Rpb24oYyxkKXtyZXR1cm4gYShuZXcgUyhkLGIuVi53KGMpLE0pKX0pfTtTLnByb3RvdHlwZS5mb3JFYWNoPVMucHJvdG90eXBlLmZvckVhY2g7XG5TLnByb3RvdHlwZS50ZD1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRyZW5cIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5OKCk/ITE6IXRoaXMuQi5lKCl9O1MucHJvdG90eXBlLmhhc0NoaWxkcmVuPVMucHJvdG90eXBlLnRkO1MucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXtRKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm5hbWUoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlLkRhdGFTbmFwc2hvdC5rZXkoKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMua2V5KCl9O1MucHJvdG90eXBlLm5hbWU9Uy5wcm90b3R5cGUubmFtZTtTLnByb3RvdHlwZS5rZXk9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmtleVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5WLmtleSgpfTtcblMucHJvdG90eXBlLmtleT1TLnByb3RvdHlwZS5rZXk7Uy5wcm90b3R5cGUuRGI9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm51bUNoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuRGIoKX07Uy5wcm90b3R5cGUubnVtQ2hpbGRyZW49Uy5wcm90b3R5cGUuRGI7Uy5wcm90b3R5cGUubGM9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5WfTtTLnByb3RvdHlwZS5yZWY9Uy5wcm90b3R5cGUubGM7ZnVuY3Rpb24gS2goYSxiKXt0aGlzLkg9YTt0aGlzLlZhPU9iKGEpO3RoaXMuZWE9bmV3IHViO3RoaXMuRWQ9MTt0aGlzLlJhPW51bGw7Ynx8MDw9KFwib2JqZWN0XCI9PT10eXBlb2Ygd2luZG93JiZ3aW5kb3cubmF2aWdhdG9yJiZ3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudHx8XCJcIikuc2VhcmNoKC9nb29nbGVib3R8Z29vZ2xlIHdlYm1hc3RlciB0b29sc3xiaW5nYm90fHlhaG9vISBzbHVycHxiYWlkdXNwaWRlcnx5YW5kZXhib3R8ZHVja2R1Y2tib3QvaSk/KHRoaXMuY2E9bmV3IEFlKHRoaXMuSCxxKHRoaXMuR2IsdGhpcykpLHNldFRpbWVvdXQocSh0aGlzLlRjLHRoaXMsITApLDApKTp0aGlzLmNhPXRoaXMuUmE9bmV3IHdoKHRoaXMuSCxxKHRoaXMuR2IsdGhpcykscSh0aGlzLlRjLHRoaXMpLHEodGhpcy5OZSx0aGlzKSk7dGhpcy5QZz1QYihhLHEoZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEpiKHRoaXMuVmEsdGhpcy5jYSl9LHRoaXMpKTt0aGlzLnRjPW5ldyBDZjt0aGlzLkJlPVxubmV3IG5iO3ZhciBjPXRoaXM7dGhpcy56ZD1uZXcgZ2Yoe1hlOmZ1bmN0aW9uKGEsYixmLGcpe2I9W107Zj1jLkJlLmooYS5wYXRoKTtmLmUoKXx8KGI9amYoYy56ZCxuZXcgVWIoemUsYS5wYXRoLGYpKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZyhcIm9rXCIpfSwwKSk7cmV0dXJuIGJ9LFpkOmJhfSk7TGgodGhpcyxcImNvbm5lY3RlZFwiLCExKTt0aGlzLmthPW5ldyBxYzt0aGlzLlA9bmV3IEVnKGEscSh0aGlzLmNhLlAsdGhpcy5jYSkscSh0aGlzLmNhLmVlLHRoaXMuY2EpLHEodGhpcy5LZSx0aGlzKSk7dGhpcy5wZD0wO3RoaXMuQ2U9bnVsbDt0aGlzLk89bmV3IGdmKHtYZTpmdW5jdGlvbihhLGIsZixnKXtjLmNhLnhmKGEsZixiLGZ1bmN0aW9uKGIsZSl7dmFyIGY9ZyhiLGUpO3piKGMuZWEsYS5wYXRoLGYpfSk7cmV0dXJuW119LFpkOmZ1bmN0aW9uKGEsYil7Yy5jYS5PZihhLGIpfX0pfWg9S2gucHJvdG90eXBlO1xuaC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybih0aGlzLkgubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSt0aGlzLkguaG9zdH07aC5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuSC5DYn07ZnVuY3Rpb24gTWgoYSl7YT1hLkJlLmoobmV3IEsoXCIuaW5mby9zZXJ2ZXJUaW1lT2Zmc2V0XCIpKS5LKCl8fDA7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCkrYX1mdW5jdGlvbiBOaChhKXthPWE9e3RpbWVzdGFtcDpNaChhKX07YS50aW1lc3RhbXA9YS50aW1lc3RhbXB8fChuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBhfVxuaC5HYj1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLnBkKys7dmFyIGU9bmV3IEsoYSk7Yj10aGlzLkNlP3RoaXMuQ2UoYSxiKTpiO2E9W107ZD9jPyhiPW5hKGIsZnVuY3Rpb24oYSl7cmV0dXJuIEwoYSl9KSxhPXJmKHRoaXMuTyxlLGIsZCkpOihiPUwoYiksYT1uZih0aGlzLk8sZSxiLGQpKTpjPyhkPW5hKGIsZnVuY3Rpb24oYSl7cmV0dXJuIEwoYSl9KSxhPW1mKHRoaXMuTyxlLGQpKTooZD1MKGIpLGE9amYodGhpcy5PLG5ldyBVYih6ZSxlLGQpKSk7ZD1lOzA8YS5sZW5ndGgmJihkPU9oKHRoaXMsZSkpO3piKHRoaXMuZWEsZCxhKX07aC5UYz1mdW5jdGlvbihhKXtMaCh0aGlzLFwiY29ubmVjdGVkXCIsYSk7ITE9PT1hJiZQaCh0aGlzKX07aC5OZT1mdW5jdGlvbihhKXt2YXIgYj10aGlzO1ljKGEsZnVuY3Rpb24oYSxkKXtMaChiLGQsYSl9KX07aC5LZT1mdW5jdGlvbihhKXtMaCh0aGlzLFwiYXV0aGVudGljYXRlZFwiLGEpfTtcbmZ1bmN0aW9uIExoKGEsYixjKXtiPW5ldyBLKFwiLy5pbmZvL1wiK2IpO2M9TChjKTt2YXIgZD1hLkJlO2QuU2Q9ZC5TZC5HKGIsYyk7Yz1qZihhLnpkLG5ldyBVYih6ZSxiLGMpKTt6YihhLmVhLGIsYyl9aC5LYj1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLmYoXCJzZXRcIix7cGF0aDphLnRvU3RyaW5nKCksdmFsdWU6YixYZzpjfSk7dmFyIGU9TmgodGhpcyk7Yj1MKGIsYyk7dmFyIGU9c2MoYixlKSxmPXRoaXMuRWQrKyxlPWhmKHRoaXMuTyxhLGUsZiwhMCk7dmIodGhpcy5lYSxlKTt2YXIgZz10aGlzO3RoaXMuY2EucHV0KGEudG9TdHJpbmcoKSxiLksoITApLGZ1bmN0aW9uKGIsYyl7dmFyIGU9XCJva1wiPT09YjtlfHxRKFwic2V0IGF0IFwiK2ErXCIgZmFpbGVkOiBcIitiKTtlPWxmKGcuTyxmLCFlKTt6YihnLmVhLGEsZSk7UWgoZCxiLGMpfSk7ZT1SaCh0aGlzLGEpO09oKHRoaXMsZSk7emIodGhpcy5lYSxlLFtdKX07XG5oLnVwZGF0ZT1mdW5jdGlvbihhLGIsYyl7dGhpcy5mKFwidXBkYXRlXCIse3BhdGg6YS50b1N0cmluZygpLHZhbHVlOmJ9KTt2YXIgZD0hMCxlPU5oKHRoaXMpLGY9e307cihiLGZ1bmN0aW9uKGEsYil7ZD0hMTt2YXIgYz1MKGEpO2ZbYl09c2MoYyxlKX0pO2lmKGQpQmIoXCJ1cGRhdGUoKSBjYWxsZWQgd2l0aCBlbXB0eSBkYXRhLiAgRG9uJ3QgZG8gYW55dGhpbmcuXCIpLFFoKGMsXCJva1wiKTtlbHNle3ZhciBnPXRoaXMuRWQrKyxrPWtmKHRoaXMuTyxhLGYsZyk7dmIodGhpcy5lYSxrKTt2YXIgbD10aGlzO3RoaXMuY2EueWYoYS50b1N0cmluZygpLGIsZnVuY3Rpb24oYixkKXt2YXIgZT1cIm9rXCI9PT1iO2V8fFEoXCJ1cGRhdGUgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO3ZhciBlPWxmKGwuTyxnLCFlKSxmPWE7MDxlLmxlbmd0aCYmKGY9T2gobCxhKSk7emIobC5lYSxmLGUpO1FoKGMsYixkKX0pO2I9UmgodGhpcyxhKTtPaCh0aGlzLGIpO3piKHRoaXMuZWEsYSxbXSl9fTtcbmZ1bmN0aW9uIFBoKGEpe2EuZihcIm9uRGlzY29ubmVjdEV2ZW50c1wiKTt2YXIgYj1OaChhKSxjPVtdO3JjKHBjKGEua2EsYiksRixmdW5jdGlvbihiLGUpe2M9Yy5jb25jYXQoamYoYS5PLG5ldyBVYih6ZSxiLGUpKSk7dmFyIGY9UmgoYSxiKTtPaChhLGYpfSk7YS5rYT1uZXcgcWM7emIoYS5lYSxGLGMpfWguR2Q9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO3RoaXMuY2EuR2QoYS50b1N0cmluZygpLGZ1bmN0aW9uKGQsZSl7XCJva1wiPT09ZCYmZWcoYy5rYSxhKTtRaChiLGQsZSl9KX07ZnVuY3Rpb24gU2goYSxiLGMsZCl7dmFyIGU9TChjKTthLmNhLkxlKGIudG9TdHJpbmcoKSxlLksoITApLGZ1bmN0aW9uKGMsZyl7XCJva1wiPT09YyYmYS5rYS5tYyhiLGUpO1FoKGQsYyxnKX0pfWZ1bmN0aW9uIFRoKGEsYixjLGQsZSl7dmFyIGY9TChjLGQpO2EuY2EuTGUoYi50b1N0cmluZygpLGYuSyghMCksZnVuY3Rpb24oYyxkKXtcIm9rXCI9PT1jJiZhLmthLm1jKGIsZik7UWgoZSxjLGQpfSl9XG5mdW5jdGlvbiBVaChhLGIsYyxkKXt2YXIgZT0hMCxmO2ZvcihmIGluIGMpZT0hMTtlPyhCYihcIm9uRGlzY29ubmVjdCgpLnVwZGF0ZSgpIGNhbGxlZCB3aXRoIGVtcHR5IGRhdGEuICBEb24ndCBkbyBhbnl0aGluZy5cIiksUWgoZCxcIm9rXCIpKTphLmNhLkJmKGIudG9TdHJpbmcoKSxjLGZ1bmN0aW9uKGUsZil7aWYoXCJva1wiPT09ZSlmb3IodmFyIGwgaW4gYyl7dmFyIG09TChjW2xdKTthLmthLm1jKGIudyhsKSxtKX1RaChkLGUsZil9KX1mdW5jdGlvbiBWaChhLGIsYyl7Yz1cIi5pbmZvXCI9PT1PKGIucGF0aCk/YS56ZC5PYihiLGMpOmEuTy5PYihiLGMpO3hiKGEuZWEsYi5wYXRoLGMpfWgueWI9ZnVuY3Rpb24oKXt0aGlzLlJhJiZ0aGlzLlJhLnliKCl9O2gucWM9ZnVuY3Rpb24oKXt0aGlzLlJhJiZ0aGlzLlJhLnFjKCl9O1xuaC5ZZT1mdW5jdGlvbihhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe2E/KHRoaXMuWWR8fCh0aGlzLllkPW5ldyBJYih0aGlzLlZhKSksYT10aGlzLllkLmdldCgpKTphPXRoaXMuVmEuZ2V0KCk7dmFyIGI9UmEoc2EoYSksZnVuY3Rpb24oYSxiKXtyZXR1cm4gTWF0aC5tYXgoYi5sZW5ndGgsYSl9LDApLGM7Zm9yKGMgaW4gYSl7Zm9yKHZhciBkPWFbY10sZT1jLmxlbmd0aDtlPGIrMjtlKyspYys9XCIgXCI7Y29uc29sZS5sb2coYytkKX19fTtoLlplPWZ1bmN0aW9uKGEpe0xiKHRoaXMuVmEsYSk7dGhpcy5QZy5NZlthXT0hMH07aC5mPWZ1bmN0aW9uKGEpe3ZhciBiPVwiXCI7dGhpcy5SYSYmKGI9dGhpcy5SYS5pZCtcIjpcIik7QmIoYixhcmd1bWVudHMpfTtcbmZ1bmN0aW9uIFFoKGEsYixjKXthJiZDYihmdW5jdGlvbigpe2lmKFwib2tcIj09YilhKG51bGwpO2Vsc2V7dmFyIGQ9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxlPWQ7YyYmKGUrPVwiOiBcIitjKTtlPUVycm9yKGUpO2UuY29kZT1kO2EoZSl9fSl9O2Z1bmN0aW9uIFdoKGEsYixjLGQsZSl7ZnVuY3Rpb24gZigpe31hLmYoXCJ0cmFuc2FjdGlvbiBvbiBcIitiKTt2YXIgZz1uZXcgVShhLGIpO2cuRWIoXCJ2YWx1ZVwiLGYpO2M9e3BhdGg6Yix1cGRhdGU6YyxKOmQsc3RhdHVzOm51bGwsRWY6R2MoKSxjZjplLEtmOjAsZ2U6ZnVuY3Rpb24oKXtnLmdjKFwidmFsdWVcIixmKX0samU6bnVsbCxBYTpudWxsLG1kOm51bGwsbmQ6bnVsbCxvZDpudWxsfTtkPWEuTy51YShiLHZvaWQgMCl8fEM7Yy5tZD1kO2Q9Yy51cGRhdGUoZC5LKCkpO2lmKG4oZCkpe1NmKFwidHJhbnNhY3Rpb24gZmFpbGVkOiBEYXRhIHJldHVybmVkIFwiLGQsYy5wYXRoKTtjLnN0YXR1cz0xO2U9RGYoYS50YyxiKTt2YXIgaz1lLkJhKCl8fFtdO2sucHVzaChjKTtFZihlLGspO1wib2JqZWN0XCI9PT10eXBlb2YgZCYmbnVsbCE9PWQmJnUoZCxcIi5wcmlvcml0eVwiKT8oaz13KGQsXCIucHJpb3JpdHlcIiksSihRZihrKSxcIkludmFsaWQgcHJpb3JpdHkgcmV0dXJuZWQgYnkgdHJhbnNhY3Rpb24uIFByaW9yaXR5IG11c3QgYmUgYSB2YWxpZCBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbC5cIikpOlxuaz0oYS5PLnVhKGIpfHxDKS5BKCkuSygpO2U9TmgoYSk7ZD1MKGQsayk7ZT1zYyhkLGUpO2MubmQ9ZDtjLm9kPWU7Yy5BYT1hLkVkKys7Yz1oZihhLk8sYixlLGMuQWEsYy5jZik7emIoYS5lYSxiLGMpO1hoKGEpfWVsc2UgYy5nZSgpLGMubmQ9bnVsbCxjLm9kPW51bGwsYy5KJiYoYT1uZXcgUyhjLm1kLG5ldyBVKGEsYy5wYXRoKSxNKSxjLkoobnVsbCwhMSxhKSl9ZnVuY3Rpb24gWGgoYSxiKXt2YXIgYz1ifHxhLnRjO2J8fFloKGEsYyk7aWYobnVsbCE9PWMuQmEoKSl7dmFyIGQ9WmgoYSxjKTtKKDA8ZC5sZW5ndGgsXCJTZW5kaW5nIHplcm8gbGVuZ3RoIHRyYW5zYWN0aW9uIHF1ZXVlXCIpO1NhKGQsZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLnN0YXR1c30pJiYkaChhLGMucGF0aCgpLGQpfWVsc2UgYy50ZCgpJiZjLlUoZnVuY3Rpb24oYil7WGgoYSxiKX0pfVxuZnVuY3Rpb24gJGgoYSxiLGMpe2Zvcih2YXIgZD1RYShjLGZ1bmN0aW9uKGEpe3JldHVybiBhLkFhfSksZT1hLk8udWEoYixkKXx8QyxkPWUsZT1lLmhhc2goKSxmPTA7ZjxjLmxlbmd0aDtmKyspe3ZhciBnPWNbZl07SigxPT09Zy5zdGF0dXMsXCJ0cnlUb1NlbmRUcmFuc2FjdGlvblF1ZXVlXzogaXRlbXMgaW4gcXVldWUgc2hvdWxkIGFsbCBiZSBydW4uXCIpO2cuc3RhdHVzPTI7Zy5LZisrO3ZhciBrPU4oYixnLnBhdGgpLGQ9ZC5HKGssZy5uZCl9ZD1kLksoITApO2EuY2EucHV0KGIudG9TdHJpbmcoKSxkLGZ1bmN0aW9uKGQpe2EuZihcInRyYW5zYWN0aW9uIHB1dCByZXNwb25zZVwiLHtwYXRoOmIudG9TdHJpbmcoKSxzdGF0dXM6ZH0pO3ZhciBlPVtdO2lmKFwib2tcIj09PWQpe2Q9W107Zm9yKGY9MDtmPGMubGVuZ3RoO2YrKyl7Y1tmXS5zdGF0dXM9MztlPWUuY29uY2F0KGxmKGEuTyxjW2ZdLkFhKSk7aWYoY1tmXS5KKXt2YXIgZz1jW2ZdLm9kLGs9bmV3IFUoYSxjW2ZdLnBhdGgpO2QucHVzaChxKGNbZl0uSixcbm51bGwsbnVsbCwhMCxuZXcgUyhnLGssTSkpKX1jW2ZdLmdlKCl9WWgoYSxEZihhLnRjLGIpKTtYaChhKTt6YihhLmVhLGIsZSk7Zm9yKGY9MDtmPGQubGVuZ3RoO2YrKylDYihkW2ZdKX1lbHNle2lmKFwiZGF0YXN0YWxlXCI9PT1kKWZvcihmPTA7ZjxjLmxlbmd0aDtmKyspY1tmXS5zdGF0dXM9ND09PWNbZl0uc3RhdHVzPzU6MTtlbHNlIGZvcihRKFwidHJhbnNhY3Rpb24gYXQgXCIrYi50b1N0cmluZygpK1wiIGZhaWxlZDogXCIrZCksZj0wO2Y8Yy5sZW5ndGg7ZisrKWNbZl0uc3RhdHVzPTUsY1tmXS5qZT1kO09oKGEsYil9fSxlKX1mdW5jdGlvbiBPaChhLGIpe3ZhciBjPWFpKGEsYiksZD1jLnBhdGgoKSxjPVpoKGEsYyk7YmkoYSxjLGQpO3JldHVybiBkfVxuZnVuY3Rpb24gYmkoYSxiLGMpe2lmKDAhPT1iLmxlbmd0aCl7Zm9yKHZhciBkPVtdLGU9W10sZj1RYShiLGZ1bmN0aW9uKGEpe3JldHVybiBhLkFhfSksZz0wO2c8Yi5sZW5ndGg7ZysrKXt2YXIgaz1iW2ddLGw9TihjLGsucGF0aCksbT0hMSx2O0oobnVsbCE9PWwsXCJyZXJ1blRyYW5zYWN0aW9uc1VuZGVyTm9kZV86IHJlbGF0aXZlUGF0aCBzaG91bGQgbm90IGJlIG51bGwuXCIpO2lmKDU9PT1rLnN0YXR1cyltPSEwLHY9ay5qZSxlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSk7ZWxzZSBpZigxPT09ay5zdGF0dXMpaWYoMjU8PWsuS2YpbT0hMCx2PVwibWF4cmV0cnlcIixlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSk7ZWxzZXt2YXIgeT1hLk8udWEoay5wYXRoLGYpfHxDO2subWQ9eTt2YXIgST1iW2ddLnVwZGF0ZSh5LksoKSk7bihJKT8oU2YoXCJ0cmFuc2FjdGlvbiBmYWlsZWQ6IERhdGEgcmV0dXJuZWQgXCIsSSxrLnBhdGgpLGw9TChJKSxcIm9iamVjdFwiPT09dHlwZW9mIEkmJm51bGwhPVxuSSYmdShJLFwiLnByaW9yaXR5XCIpfHwobD1sLmRhKHkuQSgpKSkseT1rLkFhLEk9TmgoYSksST1zYyhsLEkpLGsubmQ9bCxrLm9kPUksay5BYT1hLkVkKyssVmEoZix5KSxlPWUuY29uY2F0KGhmKGEuTyxrLnBhdGgsSSxrLkFhLGsuY2YpKSxlPWUuY29uY2F0KGxmKGEuTyx5LCEwKSkpOihtPSEwLHY9XCJub2RhdGFcIixlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSkpfXpiKGEuZWEsYyxlKTtlPVtdO20mJihiW2ddLnN0YXR1cz0zLHNldFRpbWVvdXQoYltnXS5nZSxNYXRoLmZsb29yKDApKSxiW2ddLkomJihcIm5vZGF0YVwiPT09dj8oaz1uZXcgVShhLGJbZ10ucGF0aCksZC5wdXNoKHEoYltnXS5KLG51bGwsbnVsbCwhMSxuZXcgUyhiW2ddLm1kLGssTSkpKSk6ZC5wdXNoKHEoYltnXS5KLG51bGwsRXJyb3IodiksITEsbnVsbCkpKSl9WWgoYSxhLnRjKTtmb3IoZz0wO2c8ZC5sZW5ndGg7ZysrKUNiKGRbZ10pO1hoKGEpfX1cbmZ1bmN0aW9uIGFpKGEsYil7Zm9yKHZhciBjLGQ9YS50YztudWxsIT09KGM9TyhiKSkmJm51bGw9PT1kLkJhKCk7KWQ9RGYoZCxjKSxiPUcoYik7cmV0dXJuIGR9ZnVuY3Rpb24gWmgoYSxiKXt2YXIgYz1bXTtjaShhLGIsYyk7Yy5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuRWYtYi5FZn0pO3JldHVybiBjfWZ1bmN0aW9uIGNpKGEsYixjKXt2YXIgZD1iLkJhKCk7aWYobnVsbCE9PWQpZm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspYy5wdXNoKGRbZV0pO2IuVShmdW5jdGlvbihiKXtjaShhLGIsYyl9KX1mdW5jdGlvbiBZaChhLGIpe3ZhciBjPWIuQmEoKTtpZihjKXtmb3IodmFyIGQ9MCxlPTA7ZTxjLmxlbmd0aDtlKyspMyE9PWNbZV0uc3RhdHVzJiYoY1tkXT1jW2VdLGQrKyk7Yy5sZW5ndGg9ZDtFZihiLDA8Yy5sZW5ndGg/YzpudWxsKX1iLlUoZnVuY3Rpb24oYil7WWgoYSxiKX0pfVxuZnVuY3Rpb24gUmgoYSxiKXt2YXIgYz1haShhLGIpLnBhdGgoKSxkPURmKGEudGMsYik7SGYoZCxmdW5jdGlvbihiKXtkaShhLGIpfSk7ZGkoYSxkKTtHZihkLGZ1bmN0aW9uKGIpe2RpKGEsYil9KTtyZXR1cm4gY31cbmZ1bmN0aW9uIGRpKGEsYil7dmFyIGM9Yi5CYSgpO2lmKG51bGwhPT1jKXtmb3IodmFyIGQ9W10sZT1bXSxmPS0xLGc9MDtnPGMubGVuZ3RoO2crKyk0IT09Y1tnXS5zdGF0dXMmJigyPT09Y1tnXS5zdGF0dXM/KEooZj09PWctMSxcIkFsbCBTRU5UIGl0ZW1zIHNob3VsZCBiZSBhdCBiZWdpbm5pbmcgb2YgcXVldWUuXCIpLGY9ZyxjW2ddLnN0YXR1cz00LGNbZ10uamU9XCJzZXRcIik6KEooMT09PWNbZ10uc3RhdHVzLFwiVW5leHBlY3RlZCB0cmFuc2FjdGlvbiBzdGF0dXMgaW4gYWJvcnRcIiksY1tnXS5nZSgpLGU9ZS5jb25jYXQobGYoYS5PLGNbZ10uQWEsITApKSxjW2ddLkomJmQucHVzaChxKGNbZ10uSixudWxsLEVycm9yKFwic2V0XCIpLCExLG51bGwpKSkpOy0xPT09Zj9FZihiLG51bGwpOmMubGVuZ3RoPWYrMTt6YihhLmVhLGIucGF0aCgpLGUpO2ZvcihnPTA7ZzxkLmxlbmd0aDtnKyspQ2IoZFtnXSl9fTtmdW5jdGlvbiBXKCl7dGhpcy5uYz17fTt0aGlzLlBmPSExfWNhKFcpO1cucHJvdG90eXBlLnliPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMubmMpdGhpcy5uY1thXS55YigpfTtXLnByb3RvdHlwZS5pbnRlcnJ1cHQ9Vy5wcm90b3R5cGUueWI7Vy5wcm90b3R5cGUucWM9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5uYyl0aGlzLm5jW2FdLnFjKCl9O1cucHJvdG90eXBlLnJlc3VtZT1XLnByb3RvdHlwZS5xYztXLnByb3RvdHlwZS51ZT1mdW5jdGlvbigpe3RoaXMuUGY9ITB9O2Z1bmN0aW9uIFgoYSxiKXt0aGlzLmFkPWE7dGhpcy5xYT1ifVgucHJvdG90eXBlLmNhbmNlbD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuY2FuY2VsXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5jYW5jZWxcIiwxLGEsITApO3RoaXMuYWQuR2QodGhpcy5xYSxhfHxudWxsKX07WC5wcm90b3R5cGUuY2FuY2VsPVgucHJvdG90eXBlLmNhbmNlbDtYLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLHRoaXMucWEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIiwxLGEsITApO1NoKHRoaXMuYWQsdGhpcy5xYSxudWxsLGEpfTtYLnByb3RvdHlwZS5yZW1vdmU9WC5wcm90b3R5cGUucmVtb3ZlO1xuWC5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLHRoaXMucWEpO1JmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsYSx0aGlzLnFhLCExKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsMixiLCEwKTtTaCh0aGlzLmFkLHRoaXMucWEsYSxiKX07WC5wcm90b3R5cGUuc2V0PVgucHJvdG90eXBlLnNldDtcblgucHJvdG90eXBlLktiPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsdGhpcy5xYSk7UmYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIixhLHRoaXMucWEsITEpO1VmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMixiKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMyxjLCEwKTtUaCh0aGlzLmFkLHRoaXMucWEsYSxiLGMpfTtYLnByb3RvdHlwZS5zZXRXaXRoUHJpb3JpdHk9WC5wcm90b3R5cGUuS2I7XG5YLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsdGhpcy5xYSk7aWYoZWEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO1EoXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfVRmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsYSx0aGlzLnFhKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsMixiLCEwKTtcblVoKHRoaXMuYWQsdGhpcy5xYSxhLGIpfTtYLnByb3RvdHlwZS51cGRhdGU9WC5wcm90b3R5cGUudXBkYXRlO2Z1bmN0aW9uIFkoYSxiLGMsZCl7dGhpcy5rPWE7dGhpcy5wYXRoPWI7dGhpcy5vPWM7dGhpcy5qYz1kfVxuZnVuY3Rpb24gZWkoYSl7dmFyIGI9bnVsbCxjPW51bGw7YS5sYSYmKGI9b2QoYSkpO2EubmEmJihjPXFkKGEpKTtpZihhLmc9PT1WZCl7aWYoYS5sYSl7aWYoXCJbTUlOX05BTUVdXCIhPW5kKGEpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB5b3UgbWF5IG9ubHkgcGFzcyBvbmUgYXJndW1lbnQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkuXCIpO2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYil0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksb3IgZXF1YWxUbygpIG11c3QgYmUgYSBzdHJpbmcuXCIpO31pZihhLm5hKXtpZihcIltNQVhfTkFNRV1cIiE9cGQoYSkpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHlvdSBtYXkgb25seSBwYXNzIG9uZSBhcmd1bWVudCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKS5cIik7aWYoXCJzdHJpbmdcIiE9PVxudHlwZW9mIGMpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgc3RyaW5nLlwiKTt9fWVsc2UgaWYoYS5nPT09TSl7aWYobnVsbCE9YiYmIVFmKGIpfHxudWxsIT1jJiYhUWYoYykpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBwcmlvcml0eSwgdGhlIGZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgdmFsaWQgcHJpb3JpdHkgdmFsdWUgKG51bGwsIGEgbnVtYmVyLCBvciBhIHN0cmluZykuXCIpO31lbHNlIGlmKEooYS5nIGluc3RhbmNlb2YgUmR8fGEuZz09PVlkLFwidW5rbm93biBpbmRleCB0eXBlLlwiKSxudWxsIT1iJiZcIm9iamVjdFwiPT09dHlwZW9mIGJ8fG51bGwhPWMmJlwib2JqZWN0XCI9PT10eXBlb2YgYyl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBGaXJzdCBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkgY2Fubm90IGJlIGFuIG9iamVjdC5cIik7XG59ZnVuY3Rpb24gZmkoYSl7aWYoYS5sYSYmYS5uYSYmYS5pYSYmKCFhLmlhfHxcIlwiPT09YS5OYikpdGhyb3cgRXJyb3IoXCJRdWVyeTogQ2FuJ3QgY29tYmluZSBzdGFydEF0KCksIGVuZEF0KCksIGFuZCBsaW1pdCgpLiBVc2UgbGltaXRUb0ZpcnN0KCkgb3IgbGltaXRUb0xhc3QoKSBpbnN0ZWFkLlwiKTt9ZnVuY3Rpb24gZ2koYSxiKXtpZighMD09PWEuamMpdGhyb3cgRXJyb3IoYitcIjogWW91IGNhbid0IGNvbWJpbmUgbXVsdGlwbGUgb3JkZXJCeSBjYWxscy5cIik7fVkucHJvdG90eXBlLmxjPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5LnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gbmV3IFUodGhpcy5rLHRoaXMucGF0aCl9O1kucHJvdG90eXBlLnJlZj1ZLnByb3RvdHlwZS5sYztcblkucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjLGQpe3goXCJRdWVyeS5vblwiLDIsNCxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9uXCIsYSwhMSk7QShcIlF1ZXJ5Lm9uXCIsMixiLCExKTt2YXIgZT1oaShcIlF1ZXJ5Lm9uXCIsYyxkKTtpZihcInZhbHVlXCI9PT1hKVZoKHRoaXMuayx0aGlzLG5ldyBqZChiLGUuY2FuY2VsfHxudWxsLGUuTWF8fG51bGwpKTtlbHNle3ZhciBmPXt9O2ZbYV09YjtWaCh0aGlzLmssdGhpcyxuZXcga2QoZixlLmNhbmNlbCxlLk1hKSl9cmV0dXJuIGJ9O1kucHJvdG90eXBlLm9uPVkucHJvdG90eXBlLkViO1xuWS5wcm90b3R5cGUuZ2M9ZnVuY3Rpb24oYSxiLGMpe3goXCJRdWVyeS5vZmZcIiwwLDMsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vZmZcIixhLCEwKTtBKFwiUXVlcnkub2ZmXCIsMixiLCEwKTtsYihcIlF1ZXJ5Lm9mZlwiLDMsYyk7dmFyIGQ9bnVsbCxlPW51bGw7XCJ2YWx1ZVwiPT09YT9kPW5ldyBqZChifHxudWxsLG51bGwsY3x8bnVsbCk6YSYmKGImJihlPXt9LGVbYV09YiksZD1uZXcga2QoZSxudWxsLGN8fG51bGwpKTtlPXRoaXMuaztkPVwiLmluZm9cIj09PU8odGhpcy5wYXRoKT9lLnpkLmtiKHRoaXMsZCk6ZS5PLmtiKHRoaXMsZCk7eGIoZS5lYSx0aGlzLnBhdGgsZCl9O1kucHJvdG90eXBlLm9mZj1ZLnByb3RvdHlwZS5nYztcblkucHJvdG90eXBlLkFnPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhnKXtmJiYoZj0hMSxlLmdjKGEsYyksYi5jYWxsKGQuTWEsZykpfXgoXCJRdWVyeS5vbmNlXCIsMiw0LGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub25jZVwiLGEsITEpO0EoXCJRdWVyeS5vbmNlXCIsMixiLCExKTt2YXIgZD1oaShcIlF1ZXJ5Lm9uY2VcIixhcmd1bWVudHNbMl0sYXJndW1lbnRzWzNdKSxlPXRoaXMsZj0hMDt0aGlzLkViKGEsYyxmdW5jdGlvbihiKXtlLmdjKGEsYyk7ZC5jYW5jZWwmJmQuY2FuY2VsLmNhbGwoZC5NYSxiKX0pfTtZLnByb3RvdHlwZS5vbmNlPVkucHJvdG90eXBlLkFnO1xuWS5wcm90b3R5cGUuR2U9ZnVuY3Rpb24oYSl7UShcIlF1ZXJ5LmxpbWl0KCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBRdWVyeS5saW1pdFRvRmlyc3QoKSBvciBRdWVyeS5saW1pdFRvTGFzdCgpIGluc3RlYWQuXCIpO3goXCJRdWVyeS5saW1pdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXQ6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm8uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3JsaW1pdFRvTGFzdC5cIik7dmFyIGI9dGhpcy5vLkdlKGEpO2ZpKGIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGIsdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0PVkucHJvdG90eXBlLkdlO1xuWS5wcm90b3R5cGUuSGU9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5LmxpbWl0VG9GaXJzdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0ZpcnN0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5vLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0ZpcnN0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvciBsaW1pdFRvTGFzdCkuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLHRoaXMuby5IZShhKSx0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXRUb0ZpcnN0PVkucHJvdG90eXBlLkhlO1xuWS5wcm90b3R5cGUuSWU9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5LmxpbWl0VG9MYXN0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvTGFzdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMuby5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9MYXN0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvciBsaW1pdFRvTGFzdCkuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLHRoaXMuby5JZShhKSx0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXRUb0xhc3Q9WS5wcm90b3R5cGUuSWU7XG5ZLnByb3RvdHlwZS5CZz1mdW5jdGlvbihhKXt4KFwiUXVlcnkub3JkZXJCeUNoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKFwiJGtleVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiRrZXlcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlLZXkoKSBpbnN0ZWFkLicpO2lmKFwiJHByaW9yaXR5XCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJHByaW9yaXR5XCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5UHJpb3JpdHkoKSBpbnN0ZWFkLicpO2lmKFwiJHZhbHVlXCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJHZhbHVlXCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5VmFsdWUoKSBpbnN0ZWFkLicpO1dmKFwiUXVlcnkub3JkZXJCeUNoaWxkXCIsMSxhLCExKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeUNoaWxkXCIpO3ZhciBiPWJlKHRoaXMubyxuZXcgUmQoYSkpO2VpKGIpO3JldHVybiBuZXcgWSh0aGlzLmssXG50aGlzLnBhdGgsYiwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlDaGlsZD1ZLnByb3RvdHlwZS5CZztZLnByb3RvdHlwZS5DZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5S2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5S2V5XCIpO3ZhciBhPWJlKHRoaXMubyxWZCk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlLZXk9WS5wcm90b3R5cGUuQ2c7WS5wcm90b3R5cGUuRGc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeVByaW9yaXR5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5UHJpb3JpdHlcIik7dmFyIGE9YmUodGhpcy5vLE0pO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5UHJpb3JpdHk9WS5wcm90b3R5cGUuRGc7XG5ZLnByb3RvdHlwZS5FZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5VmFsdWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlWYWx1ZVwiKTt2YXIgYT1iZSh0aGlzLm8sWWQpO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5VmFsdWU9WS5wcm90b3R5cGUuRWc7XG5ZLnByb3RvdHlwZS5YZD1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5zdGFydEF0XCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuc3RhcnRBdFwiLGEsdGhpcy5wYXRoLCEwKTtXZihcIlF1ZXJ5LnN0YXJ0QXRcIiwyLGIsITApO3ZhciBjPXRoaXMuby5YZChhLGIpO2ZpKGMpO2VpKGMpO2lmKHRoaXMuby5sYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LnN0YXJ0QXQ6IFN0YXJ0aW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIHN0YXJ0QXQgb3IgZXF1YWxUbykuXCIpO24oYSl8fChiPWE9bnVsbCk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYyx0aGlzLmpjKX07WS5wcm90b3R5cGUuc3RhcnRBdD1ZLnByb3RvdHlwZS5YZDtcblkucHJvdG90eXBlLnFkPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LmVuZEF0XCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuZW5kQXRcIixhLHRoaXMucGF0aCwhMCk7V2YoXCJRdWVyeS5lbmRBdFwiLDIsYiwhMCk7dmFyIGM9dGhpcy5vLnFkKGEsYik7ZmkoYyk7ZWkoYyk7aWYodGhpcy5vLm5hKXRocm93IEVycm9yKFwiUXVlcnkuZW5kQXQ6IEVuZGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYyx0aGlzLmpjKX07WS5wcm90b3R5cGUuZW5kQXQ9WS5wcm90b3R5cGUucWQ7XG5ZLnByb3RvdHlwZS5oZz1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5lcXVhbFRvXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuZXF1YWxUb1wiLGEsdGhpcy5wYXRoLCExKTtXZihcIlF1ZXJ5LmVxdWFsVG9cIiwyLGIsITApO2lmKHRoaXMuby5sYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVxdWFsVG86IFN0YXJ0aW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtpZih0aGlzLm8ubmEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lcXVhbFRvOiBFbmRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO3JldHVybiB0aGlzLlhkKGEsYikucWQoYSxiKX07WS5wcm90b3R5cGUuZXF1YWxUbz1ZLnByb3RvdHlwZS5oZztcblkucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5LnRvU3RyaW5nXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgYT10aGlzLnBhdGgsYj1cIlwiLGM9YS5ZO2M8YS5uLmxlbmd0aDtjKyspXCJcIiE9PWEubltjXSYmKGIrPVwiL1wiK2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoYS5uW2NdKSkpO3JldHVybiB0aGlzLmsudG9TdHJpbmcoKSsoYnx8XCIvXCIpfTtZLnByb3RvdHlwZS50b1N0cmluZz1ZLnByb3RvdHlwZS50b1N0cmluZztZLnByb3RvdHlwZS53YT1mdW5jdGlvbigpe3ZhciBhPVdjKGNlKHRoaXMubykpO3JldHVyblwie31cIj09PWE/XCJkZWZhdWx0XCI6YX07XG5mdW5jdGlvbiBoaShhLGIsYyl7dmFyIGQ9e2NhbmNlbDpudWxsLE1hOm51bGx9O2lmKGImJmMpZC5jYW5jZWw9YixBKGEsMyxkLmNhbmNlbCwhMCksZC5NYT1jLGxiKGEsNCxkLk1hKTtlbHNlIGlmKGIpaWYoXCJvYmplY3RcIj09PXR5cGVvZiBiJiZudWxsIT09YilkLk1hPWI7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilkLmNhbmNlbD1iO2Vsc2UgdGhyb3cgRXJyb3IoeihhLDMsITApK1wiIG11c3QgZWl0aGVyIGJlIGEgY2FuY2VsIGNhbGxiYWNrIG9yIGEgY29udGV4dCBvYmplY3QuXCIpO3JldHVybiBkfTt2YXIgWj17fTtaLnZjPXdoO1ouRGF0YUNvbm5lY3Rpb249Wi52Yzt3aC5wcm90b3R5cGUuT2c9ZnVuY3Rpb24oYSxiKXt0aGlzLkRhKFwicVwiLHtwOmF9LGIpfTtaLnZjLnByb3RvdHlwZS5zaW1wbGVMaXN0ZW49Wi52Yy5wcm90b3R5cGUuT2c7d2gucHJvdG90eXBlLmdnPWZ1bmN0aW9uKGEsYil7dGhpcy5EYShcImVjaG9cIix7ZDphfSxiKX07Wi52Yy5wcm90b3R5cGUuZWNobz1aLnZjLnByb3RvdHlwZS5nZzt3aC5wcm90b3R5cGUuaW50ZXJydXB0PXdoLnByb3RvdHlwZS55YjtaLlNmPWtoO1ouUmVhbFRpbWVDb25uZWN0aW9uPVouU2Y7a2gucHJvdG90eXBlLnNlbmRSZXF1ZXN0PWtoLnByb3RvdHlwZS5EYTtraC5wcm90b3R5cGUuY2xvc2U9a2gucHJvdG90eXBlLmNsb3NlO1xuWi5vZz1mdW5jdGlvbihhKXt2YXIgYj13aC5wcm90b3R5cGUucHV0O3doLnByb3RvdHlwZS5wdXQ9ZnVuY3Rpb24oYyxkLGUsZil7bihmKSYmKGY9YSgpKTtiLmNhbGwodGhpcyxjLGQsZSxmKX07cmV0dXJuIGZ1bmN0aW9uKCl7d2gucHJvdG90eXBlLnB1dD1ifX07Wi5oaWphY2tIYXNoPVoub2c7Wi5SZj1FYztaLkNvbm5lY3Rpb25UYXJnZXQ9Wi5SZjtaLndhPWZ1bmN0aW9uKGEpe3JldHVybiBhLndhKCl9O1oucXVlcnlJZGVudGlmaWVyPVoud2E7Wi5xZz1mdW5jdGlvbihhKXtyZXR1cm4gYS5rLlJhLmFhfTtaLmxpc3RlbnM9Wi5xZztaLnVlPWZ1bmN0aW9uKGEpe2EudWUoKX07Wi5mb3JjZVJlc3RDbGllbnQ9Wi51ZTtmdW5jdGlvbiBVKGEsYil7dmFyIGMsZCxlO2lmKGEgaW5zdGFuY2VvZiBLaCljPWEsZD1iO2Vsc2V7eChcIm5ldyBGaXJlYmFzZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtkPVJjKGFyZ3VtZW50c1swXSk7Yz1kLlFnO1wiZmlyZWJhc2VcIj09PWQuZG9tYWluJiZRYyhkLmhvc3QrXCIgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4gUGxlYXNlIHVzZSA8WU9VUiBGSVJFQkFTRT4uZmlyZWJhc2Vpby5jb20gaW5zdGVhZFwiKTtjfHxRYyhcIkNhbm5vdCBwYXJzZSBGaXJlYmFzZSB1cmwuIFBsZWFzZSB1c2UgaHR0cHM6Ly88WU9VUiBGSVJFQkFTRT4uZmlyZWJhc2Vpby5jb21cIik7ZC5sYnx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5sb2NhdGlvbiYmd2luZG93LmxvY2F0aW9uLnByb3RvY29sJiYtMSE9PXdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKFwiaHR0cHM6XCIpJiZRKFwiSW5zZWN1cmUgRmlyZWJhc2UgYWNjZXNzIGZyb20gYSBzZWN1cmUgcGFnZS4gUGxlYXNlIHVzZSBodHRwcyBpbiBjYWxscyB0byBuZXcgRmlyZWJhc2UoKS5cIik7XG5jPW5ldyBFYyhkLmhvc3QsZC5sYixjLFwid3NcIj09PWQuc2NoZW1lfHxcIndzc1wiPT09ZC5zY2hlbWUpO2Q9bmV3IEsoZC5aYyk7ZT1kLnRvU3RyaW5nKCk7dmFyIGY7IShmPSFwKGMuaG9zdCl8fDA9PT1jLmhvc3QubGVuZ3RofHwhUGYoYy5DYikpJiYoZj0wIT09ZS5sZW5ndGgpJiYoZSYmKGU9ZS5yZXBsYWNlKC9eXFwvKlxcLmluZm8oXFwvfCQpLyxcIi9cIikpLGY9IShwKGUpJiYwIT09ZS5sZW5ndGgmJiFPZi50ZXN0KGUpKSk7aWYoZil0aHJvdyBFcnJvcih6KFwibmV3IEZpcmViYXNlXCIsMSwhMSkrJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBVUkwgYW5kIHRoZSBwYXRoIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIltcIiwgb3IgXCJdXCIuJyk7aWYoYilpZihiIGluc3RhbmNlb2YgVyllPWI7ZWxzZSBpZihwKGIpKWU9Vy51YigpLGMuTGQ9YjtlbHNlIHRocm93IEVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBGaXJlYmFzZS5Db250ZXh0IGZvciBzZWNvbmQgYXJndW1lbnQgdG8gbmV3IEZpcmViYXNlKClcIik7XG5lbHNlIGU9Vy51YigpO2Y9Yy50b1N0cmluZygpO3ZhciBnPXcoZS5uYyxmKTtnfHwoZz1uZXcgS2goYyxlLlBmKSxlLm5jW2ZdPWcpO2M9Z31ZLmNhbGwodGhpcyxjLGQsJGQsITEpfW1hKFUsWSk7dmFyIGlpPVUsamk9W1wiRmlyZWJhc2VcIl0sa2k9YWE7amlbMF1pbiBraXx8IWtpLmV4ZWNTY3JpcHR8fGtpLmV4ZWNTY3JpcHQoXCJ2YXIgXCIramlbMF0pO2Zvcih2YXIgbGk7amkubGVuZ3RoJiYobGk9amkuc2hpZnQoKSk7KSFqaS5sZW5ndGgmJm4oaWkpP2tpW2xpXT1paTpraT1raVtsaV0/a2lbbGldOmtpW2xpXT17fTtVLnByb3RvdHlwZS5uYW1lPWZ1bmN0aW9uKCl7UShcIkZpcmViYXNlLm5hbWUoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlLmtleSgpIGluc3RlYWQuXCIpO3goXCJGaXJlYmFzZS5uYW1lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLmtleSgpfTtVLnByb3RvdHlwZS5uYW1lPVUucHJvdG90eXBlLm5hbWU7XG5VLnByb3RvdHlwZS5rZXk9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2Uua2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLnBhdGguZSgpP251bGw6dmModGhpcy5wYXRoKX07VS5wcm90b3R5cGUua2V5PVUucHJvdG90eXBlLmtleTtVLnByb3RvdHlwZS53PWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5jaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZihnYShhKSlhPVN0cmluZyhhKTtlbHNlIGlmKCEoYSBpbnN0YW5jZW9mIEspKWlmKG51bGw9PT1PKHRoaXMucGF0aCkpe3ZhciBiPWE7YiYmKGI9Yi5yZXBsYWNlKC9eXFwvKlxcLmluZm8oXFwvfCQpLyxcIi9cIikpO1hmKFwiRmlyZWJhc2UuY2hpbGRcIixiKX1lbHNlIFhmKFwiRmlyZWJhc2UuY2hpbGRcIixhKTtyZXR1cm4gbmV3IFUodGhpcy5rLHRoaXMucGF0aC53KGEpKX07VS5wcm90b3R5cGUuY2hpbGQ9VS5wcm90b3R5cGUudztcblUucHJvdG90eXBlLnBhcmVudD1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5wYXJlbnRcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7dmFyIGE9dGhpcy5wYXRoLnBhcmVudCgpO3JldHVybiBudWxsPT09YT9udWxsOm5ldyBVKHRoaXMuayxhKX07VS5wcm90b3R5cGUucGFyZW50PVUucHJvdG90eXBlLnBhcmVudDtVLnByb3RvdHlwZS5yb290PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtmb3IodmFyIGE9dGhpcztudWxsIT09YS5wYXJlbnQoKTspYT1hLnBhcmVudCgpO3JldHVybiBhfTtVLnByb3RvdHlwZS5yb290PVUucHJvdG90eXBlLnJvb3Q7XG5VLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uuc2V0XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uuc2V0XCIsdGhpcy5wYXRoKTtSZihcIkZpcmViYXNlLnNldFwiLGEsdGhpcy5wYXRoLCExKTtBKFwiRmlyZWJhc2Uuc2V0XCIsMixiLCEwKTt0aGlzLmsuS2IodGhpcy5wYXRoLGEsbnVsbCxifHxudWxsKX07VS5wcm90b3R5cGUuc2V0PVUucHJvdG90eXBlLnNldDtcblUucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS51cGRhdGVcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS51cGRhdGVcIix0aGlzLnBhdGgpO2lmKGVhKGEpKXtmb3IodmFyIGM9e30sZD0wO2Q8YS5sZW5ndGg7KytkKWNbXCJcIitkXT1hW2RdO2E9YztRKFwiUGFzc2luZyBhbiBBcnJheSB0byBGaXJlYmFzZS51cGRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2Ugc2V0KCkgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoZSBleGlzdGluZyBkYXRhLCBvciBhbiBPYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXMgaWYgeW91IHJlYWxseSBkbyB3YW50IHRvIG9ubHkgdXBkYXRlIHNvbWUgb2YgdGhlIGNoaWxkcmVuLlwiKX1UZihcIkZpcmViYXNlLnVwZGF0ZVwiLGEsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UudXBkYXRlXCIsMixiLCEwKTt0aGlzLmsudXBkYXRlKHRoaXMucGF0aCxhLGJ8fG51bGwpfTtVLnByb3RvdHlwZS51cGRhdGU9VS5wcm90b3R5cGUudXBkYXRlO1xuVS5wcm90b3R5cGUuS2I9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsYSx0aGlzLnBhdGgsITEpO1VmKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsMixiKTtBKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsMyxjLCEwKTtpZihcIi5sZW5ndGhcIj09PXRoaXMua2V5KCl8fFwiLmtleXNcIj09PXRoaXMua2V5KCkpdGhyb3dcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eSBmYWlsZWQ6IFwiK3RoaXMua2V5KCkrXCIgaXMgYSByZWFkLW9ubHkgb2JqZWN0LlwiO3RoaXMuay5LYih0aGlzLnBhdGgsYSxiLGN8fG51bGwpfTtVLnByb3RvdHlwZS5zZXRXaXRoUHJpb3JpdHk9VS5wcm90b3R5cGUuS2I7XG5VLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLnJlbW92ZVwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnJlbW92ZVwiLHRoaXMucGF0aCk7QShcIkZpcmViYXNlLnJlbW92ZVwiLDEsYSwhMCk7dGhpcy5zZXQobnVsbCxhKX07VS5wcm90b3R5cGUucmVtb3ZlPVUucHJvdG90eXBlLnJlbW92ZTtcblUucHJvdG90eXBlLnRyYW5zYWN0aW9uPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLHRoaXMucGF0aCk7QShcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsMSxhLCExKTtBKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwyLGIsITApO2lmKG4oYykmJlwiYm9vbGVhblwiIT10eXBlb2YgYyl0aHJvdyBFcnJvcih6KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwzLCEwKStcIm11c3QgYmUgYSBib29sZWFuLlwiKTtpZihcIi5sZW5ndGhcIj09PXRoaXMua2V5KCl8fFwiLmtleXNcIj09PXRoaXMua2V5KCkpdGhyb3dcIkZpcmViYXNlLnRyYW5zYWN0aW9uIGZhaWxlZDogXCIrdGhpcy5rZXkoKStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz0hMCk7V2godGhpcy5rLHRoaXMucGF0aCxhLGJ8fG51bGwsYyl9O1UucHJvdG90eXBlLnRyYW5zYWN0aW9uPVUucHJvdG90eXBlLnRyYW5zYWN0aW9uO1xuVS5wcm90b3R5cGUuTGc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLHRoaXMucGF0aCk7VWYoXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsYSk7QShcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMixiLCEwKTt0aGlzLmsuS2IodGhpcy5wYXRoLncoXCIucHJpb3JpdHlcIiksYSxudWxsLGIpfTtVLnByb3RvdHlwZS5zZXRQcmlvcml0eT1VLnByb3RvdHlwZS5MZztcblUucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucHVzaFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnB1c2hcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2UucHVzaFwiLGEsdGhpcy5wYXRoLCEwKTtBKFwiRmlyZWJhc2UucHVzaFwiLDIsYiwhMCk7dmFyIGM9TWgodGhpcy5rKSxjPUtmKGMpLGM9dGhpcy53KGMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgYSYmbnVsbCE9PWEmJmMuc2V0KGEsYik7cmV0dXJuIGN9O1UucHJvdG90eXBlLnB1c2g9VS5wcm90b3R5cGUucHVzaDtVLnByb3RvdHlwZS5qYj1mdW5jdGlvbigpe1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0XCIsdGhpcy5wYXRoKTtyZXR1cm4gbmV3IFgodGhpcy5rLHRoaXMucGF0aCl9O1UucHJvdG90eXBlLm9uRGlzY29ubmVjdD1VLnByb3RvdHlwZS5qYjtcblUucHJvdG90eXBlLlA9ZnVuY3Rpb24oYSxiLGMpe1EoXCJGaXJlYmFzZVJlZi5hdXRoKCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBGaXJlYmFzZVJlZi5hdXRoV2l0aEN1c3RvbVRva2VuKCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLmF1dGhcIiwxLDMsYXJndW1lbnRzLmxlbmd0aCk7WmYoXCJGaXJlYmFzZS5hdXRoXCIsYSk7QShcIkZpcmViYXNlLmF1dGhcIiwyLGIsITApO0EoXCJGaXJlYmFzZS5hdXRoXCIsMyxiLCEwKTtLZyh0aGlzLmsuUCxhLHt9LHtyZW1lbWJlcjpcIm5vbmVcIn0sYixjKX07VS5wcm90b3R5cGUuYXV0aD1VLnByb3RvdHlwZS5QO1UucHJvdG90eXBlLmVlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS51bmF1dGhcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLnVuYXV0aFwiLDEsYSwhMCk7TGcodGhpcy5rLlAsYSl9O1UucHJvdG90eXBlLnVuYXV0aD1VLnByb3RvdHlwZS5lZTtcblUucHJvdG90eXBlLndlPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdldEF1dGhcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuay5QLndlKCl9O1UucHJvdG90eXBlLmdldEF1dGg9VS5wcm90b3R5cGUud2U7VS5wcm90b3R5cGUudWc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25BdXRoXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5vbkF1dGhcIiwxLGEsITEpO2xiKFwiRmlyZWJhc2Uub25BdXRoXCIsMixiKTt0aGlzLmsuUC5FYihcImF1dGhfc3RhdHVzXCIsYSxiKX07VS5wcm90b3R5cGUub25BdXRoPVUucHJvdG90eXBlLnVnO1UucHJvdG90eXBlLnRnPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9mZkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9mZkF1dGhcIiwxLGEsITEpO2xiKFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDIsYik7dGhpcy5rLlAuZ2MoXCJhdXRoX3N0YXR1c1wiLGEsYil9O1UucHJvdG90eXBlLm9mZkF1dGg9VS5wcm90b3R5cGUudGc7XG5VLnByb3RvdHlwZS5XZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WmYoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDMsYywhMCk7S2codGhpcy5rLlAsYSx7fSxjfHx7fSxiKX07VS5wcm90b3R5cGUuYXV0aFdpdGhDdXN0b21Ub2tlbj1VLnByb3RvdHlwZS5XZjtVLnByb3RvdHlwZS5YZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUG9wdXBcIiwzLGMsITApO1BnKHRoaXMuay5QLGEsYyxiKX07XG5VLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoUG9wdXA9VS5wcm90b3R5cGUuWGY7VS5wcm90b3R5cGUuWWY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7JGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwxLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFJlZGlyZWN0XCIsMyxjLCEwKTt2YXIgZD10aGlzLmsuUDtOZyhkKTt2YXIgZT1bd2ddLGY9aWcoYyk7XCJhbm9ueW1vdXNcIj09PWF8fFwiZmlyZWJhc2VcIj09PWE/UihiLHlnKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKTooUC5zZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiLGYubGQpLE9nKGQsZSxcIi9hdXRoL1wiK2EsZixiKSl9O1UucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdD1VLnByb3RvdHlwZS5ZZjtcblUucHJvdG90eXBlLlpmPWZ1bmN0aW9uKGEsYixjLGQpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLDQsYXJndW1lbnRzLmxlbmd0aCk7JGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwxLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLGMsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsNCxkLCEwKTtwKGIpPygkZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDIsYiksTWcodGhpcy5rLlAsYStcIi90b2tlblwiLHthY2Nlc3NfdG9rZW46Yn0sZCxjKSk6KGFnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiLCExKSxNZyh0aGlzLmsuUCxhK1wiL3Rva2VuXCIsYixkLGMpKX07VS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFRva2VuPVUucHJvdG90eXBlLlpmO1xuVS5wcm90b3R5cGUuVmY9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwxLGEsITEpO2FnKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCEwKTtNZyh0aGlzLmsuUCxcImFub255bW91c1wiLHt9LGIsYSl9O1UucHJvdG90eXBlLmF1dGhBbm9ueW1vdXNseT1VLnByb3RvdHlwZS5WZjtcblUucHJvdG90eXBlLiRmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIixhLFwicGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwzLGMsITApO01nKHRoaXMuay5QLFwicGFzc3dvcmRcIixhLGMsYil9O1UucHJvdG90eXBlLmF1dGhXaXRoUGFzc3dvcmQ9VS5wcm90b3R5cGUuJGY7XG5VLnByb3RvdHlwZS5yZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDIsYiwhMSk7dGhpcy5rLlAucmUoYSxiKX07VS5wcm90b3R5cGUuY3JlYXRlVXNlcj1VLnByb3RvdHlwZS5yZTtVLnByb3RvdHlwZS5TZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLDIsYiwhMSk7dGhpcy5rLlAuU2UoYSxiKX07XG5VLnByb3RvdHlwZS5yZW1vdmVVc2VyPVUucHJvdG90eXBlLlNlO1UucHJvdG90eXBlLm9lPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJvbGRQYXNzd29yZFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcIm5ld1Bhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDIsYiwhMSk7dGhpcy5rLlAub2UoYSxiKX07VS5wcm90b3R5cGUuY2hhbmdlUGFzc3dvcmQ9VS5wcm90b3R5cGUub2U7XG5VLnByb3RvdHlwZS5uZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcIm9sZEVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwibmV3RW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwyLGIsITEpO3RoaXMuay5QLm5lKGEsYil9O1UucHJvdG90eXBlLmNoYW5nZUVtYWlsPVUucHJvdG90eXBlLm5lO1xuVS5wcm90b3R5cGUuVWU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLnJlc2V0UGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtBKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDIsYiwhMSk7dGhpcy5rLlAuVWUoYSxiKX07VS5wcm90b3R5cGUucmVzZXRQYXNzd29yZD1VLnByb3RvdHlwZS5VZTtVLmdvT2ZmbGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09mZmxpbmVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Vy51YigpLnliKCl9O1UuZ29PbmxpbmU9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ29PbmxpbmVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Vy51YigpLnFjKCl9O1xuZnVuY3Rpb24gTmMoYSxiKXtKKCFifHwhMD09PWF8fCExPT09YSxcIkNhbid0IHR1cm4gb24gY3VzdG9tIGxvZ2dlcnMgcGVyc2lzdGVudGx5LlwiKTshMD09PWE/KFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSYmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBjb25zb2xlLmxvZz9BYj1xKGNvbnNvbGUubG9nLGNvbnNvbGUpOlwib2JqZWN0XCI9PT10eXBlb2YgY29uc29sZS5sb2cmJihBYj1mdW5jdGlvbihhKXtjb25zb2xlLmxvZyhhKX0pKSxiJiZQLnNldChcImxvZ2dpbmdfZW5hYmxlZFwiLCEwKSk6YT9BYj1hOihBYj1udWxsLFAucmVtb3ZlKFwibG9nZ2luZ19lbmFibGVkXCIpKX1VLmVuYWJsZUxvZ2dpbmc9TmM7VS5TZXJ2ZXJWYWx1ZT17VElNRVNUQU1QOntcIi5zdlwiOlwidGltZXN0YW1wXCJ9fTtVLlNES19WRVJTSU9OPVwiMi4yLjVcIjtVLklOVEVSTkFMPVY7VS5Db250ZXh0PVc7VS5URVNUX0FDQ0VTUz1aO30pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZWJhc2U7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIENyZWF0ZSBhIGNoaWxkIGluc3RhbmNlIHRoYXQgcHJvdG90eXBhbGx5IGluZWhyaXRzXG4gKiBkYXRhIG9uIHBhcmVudC4gVG8gYWNoaWV2ZSB0aGF0IHdlIGNyZWF0ZSBhbiBpbnRlcm1lZGlhdGVcbiAqIGNvbnN0cnVjdG9yIHdpdGggaXRzIHByb3RvdHlwZSBwb2ludGluZyB0byBwYXJlbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtCYXNlQ3Rvcl1cbiAqIEByZXR1cm4ge1Z1ZX1cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLiRhZGRDaGlsZCA9IGZ1bmN0aW9uIChvcHRzLCBCYXNlQ3Rvcikge1xuICBCYXNlQ3RvciA9IEJhc2VDdG9yIHx8IF8uVnVlXG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHZhciBwYXJlbnQgPSB0aGlzXG4gIHZhciBDaGlsZFZ1ZVxuICB2YXIgaW5oZXJpdCA9IG9wdHMuaW5oZXJpdCAhPT0gdW5kZWZpbmVkXG4gICAgPyBvcHRzLmluaGVyaXRcbiAgICA6IEJhc2VDdG9yLm9wdGlvbnMuaW5oZXJpdFxuICBpZiAoaW5oZXJpdCkge1xuICAgIHZhciBjdG9ycyA9IHBhcmVudC5fY2hpbGRDdG9yc1xuICAgIENoaWxkVnVlID0gY3RvcnNbQmFzZUN0b3IuY2lkXVxuICAgIGlmICghQ2hpbGRWdWUpIHtcbiAgICAgIHZhciBvcHRpb25OYW1lID0gQmFzZUN0b3Iub3B0aW9ucy5uYW1lXG4gICAgICB2YXIgY2xhc3NOYW1lID0gb3B0aW9uTmFtZVxuICAgICAgICA/IF8uY2xhc3NpZnkob3B0aW9uTmFtZSlcbiAgICAgICAgOiAnVnVlQ29tcG9uZW50J1xuICAgICAgQ2hpbGRWdWUgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdyZXR1cm4gZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcgKG9wdGlvbnMpIHsnICtcbiAgICAgICAgJ3RoaXMuY29uc3RydWN0b3IgPSAnICsgY2xhc3NOYW1lICsgJzsnICtcbiAgICAgICAgJ3RoaXMuX2luaXQob3B0aW9ucykgfSdcbiAgICAgICkoKVxuICAgICAgQ2hpbGRWdWUub3B0aW9ucyA9IEJhc2VDdG9yLm9wdGlvbnNcbiAgICAgIENoaWxkVnVlLnByb3RvdHlwZSA9IHRoaXNcbiAgICAgIGN0b3JzW0Jhc2VDdG9yLmNpZF0gPSBDaGlsZFZ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBDaGlsZFZ1ZSA9IEJhc2VDdG9yXG4gIH1cbiAgb3B0cy5fcGFyZW50ID0gcGFyZW50XG4gIG9wdHMuX3Jvb3QgPSBwYXJlbnQuJHJvb3RcbiAgdmFyIGNoaWxkID0gbmV3IENoaWxkVnVlKG9wdHMpXG4gIHJldHVybiBjaGlsZFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxudmFyIFBhdGggPSByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgZnJvbSBhbiBleHByZXNzaW9uIG9uIHRoaXMgdm0uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLiRnZXQgPSBmdW5jdGlvbiAoZXhwKSB7XG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwKVxuICBpZiAocmVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiByZXMuZ2V0LmNhbGwodGhpcywgdGhpcylcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAqIFRoZSBleHByZXNzaW9uIG11c3QgYmUgYSB2YWxpZCBsZWZ0LWhhbmRcbiAqIGV4cHJlc3Npb24gaW4gYW4gYXNzaWdubWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuJHNldCA9IGZ1bmN0aW9uIChleHAsIHZhbCkge1xuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cCwgdHJ1ZSlcbiAgaWYgKHJlcyAmJiByZXMuc2V0KSB7XG4gICAgcmVzLnNldC5jYWxsKHRoaXMsIHRoaXMsIHZhbClcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhIHByb3BlcnR5IG9uIHRoZSBWTVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy4kYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gIHRoaXMuX2RhdGEuJGFkZChrZXksIHZhbClcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy4kZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICB0aGlzLl9kYXRhLiRkZWxldGUoa2V5KVxufVxuXG4vKipcbiAqIFdhdGNoIGFuIGV4cHJlc3Npb24sIHRyaWdnZXIgY2FsbGJhY2sgd2hlbiBpdHNcbiAqIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZXBdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpbW1lZGlhdGVdXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB1bndhdGNoRm5cbiAqL1xuXG5leHBvcnRzLiR3YXRjaCA9IGZ1bmN0aW9uIChleHAsIGNiLCBkZWVwLCBpbW1lZGlhdGUpIHtcbiAgdmFyIHZtID0gdGhpc1xuICB2YXIga2V5ID0gZGVlcCA/IGV4cCArICcqKmRlZXAqKicgOiBleHBcbiAgdmFyIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV1cbiAgdmFyIHdyYXBwZWRDYiA9IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgIGNiLmNhbGwodm0sIHZhbCwgb2xkVmFsKVxuICB9XG4gIGlmICghd2F0Y2hlcikge1xuICAgIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV0gPVxuICAgICAgbmV3IFdhdGNoZXIodm0sIGV4cCwgd3JhcHBlZENiLCB7XG4gICAgICAgIGRlZXA6IGRlZXAsXG4gICAgICAgIHVzZXI6IHRydWVcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgd2F0Y2hlci5hZGRDYih3cmFwcGVkQ2IpXG4gIH1cbiAgaWYgKGltbWVkaWF0ZSkge1xuICAgIHdyYXBwZWRDYih3YXRjaGVyLnZhbHVlKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xuICAgIHdhdGNoZXIucmVtb3ZlQ2Iod3JhcHBlZENiKVxuICAgIGlmICghd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHZtLl91c2VyV2F0Y2hlcnNba2V5XSA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBhIHRleHQgZGlyZWN0aXZlLCBpbmNsdWRpbmcgZmlsdGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuJGV2YWwgPSBmdW5jdGlvbiAodGV4dCkge1xuICAvLyBjaGVjayBmb3IgZmlsdGVycy5cbiAgaWYgKGZpbHRlclJFLnRlc3QodGV4dCkpIHtcbiAgICB2YXIgZGlyID0gZGlyUGFyc2VyLnBhcnNlKHRleHQpWzBdXG4gICAgLy8gdGhlIGZpbHRlciByZWdleCBjaGVjayBtaWdodCBnaXZlIGZhbHNlIHBvc2l0aXZlXG4gICAgLy8gZm9yIHBpcGVzIGluc2lkZSBzdHJpbmdzLCBzbyBpdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAvLyB3ZSBkb24ndCBnZXQgYW55IGZpbHRlcnMgaGVyZVxuICAgIHJldHVybiBkaXIuZmlsdGVyc1xuICAgICAgPyBfLmFwcGx5RmlsdGVycyhcbiAgICAgICAgICB0aGlzLiRnZXQoZGlyLmV4cHJlc3Npb24pLFxuICAgICAgICAgIF8ucmVzb2x2ZUZpbHRlcnModGhpcywgZGlyLmZpbHRlcnMpLnJlYWQsXG4gICAgICAgICAgdGhpc1xuICAgICAgICApXG4gICAgICA6IHRoaXMuJGdldChkaXIuZXhwcmVzc2lvbilcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBmaWx0ZXJcbiAgICByZXR1cm4gdGhpcy4kZ2V0KHRleHQpXG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcnBvbGF0ZSBhIHBpZWNlIG9mIHRlbXBsYXRlIHRleHQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLiRpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHRleHQpXG4gIHZhciB2bSA9IHRoaXNcbiAgaWYgKHRva2Vucykge1xuICAgIHJldHVybiB0b2tlbnMubGVuZ3RoID09PSAxXG4gICAgICA/IHZtLiRldmFsKHRva2Vuc1swXS52YWx1ZSlcbiAgICAgIDogdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICByZXR1cm4gdG9rZW4udGFnXG4gICAgICAgICAgICA/IHZtLiRldmFsKHRva2VuLnZhbHVlKVxuICAgICAgICAgICAgOiB0b2tlbi52YWx1ZVxuICAgICAgICB9KS5qb2luKCcnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cbn1cblxuLyoqXG4gKiBMb2cgaW5zdGFuY2UgZGF0YSBhcyBhIHBsYWluIEpTIG9iamVjdFxuICogc28gdGhhdCBpdCBpcyBlYXNpZXIgdG8gaW5zcGVjdCBpbiBjb25zb2xlLlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyBjb25zb2xlIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW3BhdGhdXG4gKi9cblxuZXhwb3J0cy4kbG9nID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGRhdGEgPSBwYXRoXG4gICAgPyBQYXRoLmdldCh0aGlzLl9kYXRhLCBwYXRoKVxuICAgIDogdGhpcy5fZGF0YVxuICBpZiAoZGF0YSkge1xuICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG4gIGNvbnNvbGUubG9nKGRhdGEpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbi8qKlxuICogQXBwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kYXBwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBhcHBlbmQsIHRyYW5zaXRpb24uYXBwZW5kXG4gIClcbn1cblxuLyoqXG4gKiBQcmVwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kcHJlcGVuZFRvID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgaWYgKHRhcmdldC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0LmZpcnN0Q2hpbGQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRhcHBlbmRUbyh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIEluc2VydCBpbnN0YW5jZSBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRiZWZvcmUgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBiZWZvcmUsIHRyYW5zaXRpb24uYmVmb3JlXG4gIClcbn1cblxuLyoqXG4gKiBJbnNlcnQgaW5zdGFuY2UgYWZ0ZXIgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRhZnRlciA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0Lm5leHRTaWJsaW5nLCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kYXBwZW5kVG8odGFyZ2V0LnBhcmVudE5vZGUsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSBpbnN0YW5jZSBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRyZW1vdmUgPSBmdW5jdGlvbiAoY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHZhciBpbkRvYyA9IHRoaXMuX2lzQXR0YWNoZWQgJiYgXy5pbkRvYyh0aGlzLiRlbClcbiAgLy8gaWYgd2UgYXJlIG5vdCBpbiBkb2N1bWVudCwgbm8gbmVlZCB0byBjaGVja1xuICAvLyBmb3IgdHJhbnNpdGlvbnNcbiAgaWYgKCFpbkRvYykgd2l0aFRyYW5zaXRpb24gPSBmYWxzZVxuICB2YXIgb3BcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZWFsQ2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGluRG9jKSBzZWxmLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICAgIGlmIChjYikgY2IoKVxuICB9XG4gIGlmIChcbiAgICB0aGlzLl9pc0Jsb2NrICYmXG4gICAgIXRoaXMuX2Jsb2NrRnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpXG4gICkge1xuICAgIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlXG4gICAgICA/IGFwcGVuZFxuICAgICAgOiB0cmFuc2l0aW9uLnJlbW92ZVRoZW5BcHBlbmRcbiAgICBibG9ja09wKHRoaXMsIHRoaXMuX2Jsb2NrRnJhZ21lbnQsIG9wLCByZWFsQ2IpXG4gIH0gZWxzZSB7XG4gICAgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2VcbiAgICAgID8gcmVtb3ZlXG4gICAgICA6IHRyYW5zaXRpb24ucmVtb3ZlXG4gICAgb3AodGhpcy4kZWwsIHRoaXMsIHJlYWxDYilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFNoYXJlZCBET00gaW5zZXJ0aW9uIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AxIC0gb3AgZm9yIG5vbi10cmFuc2l0aW9uIGluc2VydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AyIC0gb3AgZm9yIHRyYW5zaXRpb24gaW5zZXJ0XG4gKiBAcmV0dXJuIHZtXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0ICh2bSwgdGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24sIG9wMSwgb3AyKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgdmFyIHRhcmdldElzRGV0YWNoZWQgPSAhXy5pbkRvYyh0YXJnZXQpXG4gIHZhciBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZSB8fCB0YXJnZXRJc0RldGFjaGVkXG4gICAgPyBvcDFcbiAgICA6IG9wMlxuICB2YXIgc2hvdWxkQ2FsbEhvb2sgPVxuICAgICF0YXJnZXRJc0RldGFjaGVkICYmXG4gICAgIXZtLl9pc0F0dGFjaGVkICYmXG4gICAgIV8uaW5Eb2Modm0uJGVsKVxuICBpZiAodm0uX2lzQmxvY2spIHtcbiAgICBibG9ja09wKHZtLCB0YXJnZXQsIG9wLCBjYilcbiAgfSBlbHNlIHtcbiAgICBvcCh2bS4kZWwsIHRhcmdldCwgdm0sIGNiKVxuICB9XG4gIGlmIChzaG91bGRDYWxsSG9vaykge1xuICAgIHZtLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG4gIHJldHVybiB2bVxufVxuXG4vKipcbiAqIEV4ZWN1dGUgYSB0cmFuc2l0aW9uIG9wZXJhdGlvbiBvbiBhIGJsb2NrIGluc3RhbmNlLFxuICogaXRlcmF0aW5nIHRocm91Z2ggYWxsIGl0cyBibG9jayBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5mdW5jdGlvbiBibG9ja09wICh2bSwgdGFyZ2V0LCBvcCwgY2IpIHtcbiAgdmFyIGN1cnJlbnQgPSB2bS5fYmxvY2tTdGFydFxuICB2YXIgZW5kID0gdm0uX2Jsb2NrRW5kXG4gIHZhciBuZXh0XG4gIHdoaWxlIChuZXh0ICE9PSBlbmQpIHtcbiAgICBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZ1xuICAgIG9wKGN1cnJlbnQsIHRhcmdldCwgdm0pXG4gICAgY3VycmVudCA9IG5leHRcbiAgfVxuICBvcChlbmQsIHRhcmdldCwgdm0sIGNiKVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZWxlY3RvcnNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbFxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5IChlbCkge1xuICByZXR1cm4gdHlwZW9mIGVsID09PSAnc3RyaW5nJ1xuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICA6IGVsXG59XG5cbi8qKlxuICogQXBwZW5kIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGFwcGVuZCAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgaWYgKGNiKSBjYigpXG59XG5cbi8qKlxuICogSW5zZXJ0QmVmb3JlIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGJlZm9yZSAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIF8uYmVmb3JlKGVsLCB0YXJnZXQpXG4gIGlmIChjYikgY2IoKVxufVxuXG4vKipcbiAqIFJlbW92ZSBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZSAoZWwsIHZtLCBjYikge1xuICBfLnJlbW92ZShlbClcbiAgaWYgKGNiKSBjYigpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgKHRoaXMuX2V2ZW50c1tldmVudF0gfHwgKHRoaXMuX2V2ZW50c1tldmVudF0gPSBbXSkpXG4gICAgLnB1c2goZm4pXG4gIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIDEpXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgZnVuY3Rpb24gb24gKCkge1xuICAgIHNlbGYuJG9mZihldmVudCwgb24pXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIG9uLmZuID0gZm5cbiAgdGhpcy4kb24oZXZlbnQsIG9uKVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZXhwb3J0cy4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgY2JzXG4gIC8vIGFsbFxuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICBmb3IgKGV2ZW50IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgICBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gICAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9ldmVudHMgPSB7fVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoIWNicykge1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gbnVsbFxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2JcbiAgdmFyIGkgPSBjYnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBjYiA9IGNic1tpXVxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtMSlcbiAgICAgIGNicy5zcGxpY2UoaSwgMSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogVHJpZ2dlciBhbiBldmVudCBvbiBzZWxmLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICovXG5cbmV4cG9ydHMuJGVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZVxuICB2YXIgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoY2JzKSB7XG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vY2xvc3VyZS13aXRoLWFyZ3VtZW50c1xuICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDFcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdXG4gICAgfVxuICAgIGkgPSAwXG4gICAgY2JzID0gY2JzLmxlbmd0aCA+IDFcbiAgICAgID8gXy50b0FycmF5KGNicylcbiAgICAgIDogY2JzXG4gICAgZm9yICh2YXIgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChjYnNbaV0uYXBwbHkodGhpcywgYXJncykgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGJyb2FkY2FzdCBhbiBldmVudCB0byBhbGwgY2hpbGRyZW4gaW5zdGFuY2VzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHsuLi4qfSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICovXG5cbmV4cG9ydHMuJGJyb2FkY2FzdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyBpZiBubyBjaGlsZCBoYXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBldmVudCxcbiAgLy8gdGhlbiB0aGVyZSdzIG5vIG5lZWQgdG8gYnJvYWRjYXN0LlxuICBpZiAoIXRoaXMuX2V2ZW50c0NvdW50W2V2ZW50XSkgcmV0dXJuXG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBjaGlsZC4kZW1pdC5hcHBseShjaGlsZCwgYXJndW1lbnRzKVxuICAgIGlmICghY2hpbGQuX2V2ZW50Q2FuY2VsbGVkKSB7XG4gICAgICBjaGlsZC4kYnJvYWRjYXN0LmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvcGFnYXRlIGFuIGV2ZW50IHVwIHRoZSBwYXJlbnQgY2hhaW4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKi9cblxuZXhwb3J0cy4kZGlzcGF0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC4kZW1pdC5hcHBseShwYXJlbnQsIGFyZ3VtZW50cylcbiAgICBwYXJlbnQgPSBwYXJlbnQuX2V2ZW50Q2FuY2VsbGVkXG4gICAgICA/IG51bGxcbiAgICAgIDogcGFyZW50LiRwYXJlbnRcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIE1vZGlmeSB0aGUgbGlzdGVuZXIgY291bnRzIG9uIGFsbCBwYXJlbnRzLlxuICogVGhpcyBib29ra2VlcGluZyBhbGxvd3MgJGJyb2FkY2FzdCB0byByZXR1cm4gZWFybHkgd2hlblxuICogbm8gY2hpbGQgaGFzIGxpc3RlbmVkIHRvIGEgY2VydGFpbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKi9cblxudmFyIGhvb2tSRSA9IC9eaG9vazovXG5mdW5jdGlvbiBtb2RpZnlMaXN0ZW5lckNvdW50ICh2bSwgZXZlbnQsIGNvdW50KSB7XG4gIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50XG4gIC8vIGhvb2tzIGRvIG5vdCBnZXQgYnJvYWRjYXN0ZWQgc28gbm8gbmVlZFxuICAvLyB0byBkbyBib29ra2VlcGluZyBmb3IgdGhlbVxuICBpZiAoIXBhcmVudCB8fCAhY291bnQgfHwgaG9va1JFLnRlc3QoZXZlbnQpKSByZXR1cm5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdID1cbiAgICAgIChwYXJlbnQuX2V2ZW50c0NvdW50W2V2ZW50XSB8fCAwKSArIGNvdW50XG4gICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnRcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxuXG4vKipcbiAqIEV4cG9zZSB1c2VmdWwgaW50ZXJuYWxzXG4gKi9cblxuZXhwb3J0cy51dGlsID0gX1xuZXhwb3J0cy5uZXh0VGljayA9IF8ubmV4dFRpY2tcbmV4cG9ydHMuY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuZXhwb3J0cy5jb21waWxlciA9IHtcbiAgY29tcGlsZTogcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpLFxuICB0cmFuc2NsdWRlOiByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcbn1cblxuZXhwb3J0cy5wYXJzZXJzID0ge1xuICBwYXRoOiByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKSxcbiAgdGV4dDogcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JyksXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJyksXG4gIGRpcmVjdGl2ZTogcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKSxcbiAgZXhwcmVzc2lvbjogcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbn1cblxuLyoqXG4gKiBFYWNoIGluc3RhbmNlIGNvbnN0cnVjdG9yLCBpbmNsdWRpbmcgVnVlLCBoYXMgYSB1bmlxdWVcbiAqIGNpZC4gVGhpcyBlbmFibGVzIHVzIHRvIGNyZWF0ZSB3cmFwcGVkIFwiY2hpbGRcbiAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICovXG5cbmV4cG9ydHMuY2lkID0gMFxudmFyIGNpZCA9IDFcblxuLyoqXG4gKiBDbGFzcyBpbmVocml0YW5jZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBleHRlbmRPcHRpb25zXG4gKi9cblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAoZXh0ZW5kT3B0aW9ucykge1xuICBleHRlbmRPcHRpb25zID0gZXh0ZW5kT3B0aW9ucyB8fCB7fVxuICB2YXIgU3VwZXIgPSB0aGlzXG4gIHZhciBTdWIgPSBjcmVhdGVDbGFzcyhcbiAgICBleHRlbmRPcHRpb25zLm5hbWUgfHxcbiAgICBTdXBlci5vcHRpb25zLm5hbWUgfHxcbiAgICAnVnVlQ29tcG9uZW50J1xuICApXG4gIFN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cGVyLnByb3RvdHlwZSlcbiAgU3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YlxuICBTdWIuY2lkID0gY2lkKytcbiAgU3ViLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXG4gICAgU3VwZXIub3B0aW9ucyxcbiAgICBleHRlbmRPcHRpb25zXG4gIClcbiAgU3ViWydzdXBlciddID0gU3VwZXJcbiAgLy8gYWxsb3cgZnVydGhlciBleHRlbnNpb25cbiAgU3ViLmV4dGVuZCA9IFN1cGVyLmV4dGVuZFxuICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gIC8vIGNhbiBoYXZlIHRoZWlyIHByaXZhdGUgYXNzZXRzIHRvby5cbiAgY3JlYXRlQXNzZXRSZWdpc3RlcnMoU3ViKVxuICByZXR1cm4gU3ViXG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdWItY2xhc3MgY29uc3RydWN0b3Igd2l0aCB0aGVcbiAqIGdpdmVuIG5hbWUuIFRoaXMgZ2l2ZXMgdXMgbXVjaCBuaWNlciBvdXRwdXQgd2hlblxuICogbG9nZ2luZyBpbnN0YW5jZXMgaW4gdGhlIGNvbnNvbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzIChuYW1lKSB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnICsgXy5jbGFzc2lmeShuYW1lKSArXG4gICAgJyAob3B0aW9ucykgeyB0aGlzLl9pbml0KG9wdGlvbnMpIH0nXG4gICkoKVxufVxuXG4vKipcbiAqIFBsdWdpbiBzeXN0ZW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGx1Z2luXG4gKi9cblxuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiAocGx1Z2luKSB7XG4gIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIGFyZ3MudW5zaGlmdCh0aGlzKVxuICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKVxuICB9IGVsc2Uge1xuICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogRGVmaW5lIGFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIG9uIGEgY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29uc3RydWN0b3JcbiAqL1xuXG52YXIgYXNzZXRUeXBlcyA9IFtcbiAgJ2RpcmVjdGl2ZScsXG4gICdmaWx0ZXInLFxuICAncGFydGlhbCcsXG4gICd0cmFuc2l0aW9uJ1xuXVxuXG5mdW5jdGlvbiBjcmVhdGVBc3NldFJlZ2lzdGVycyAoQ29uc3RydWN0b3IpIHtcblxuICAvKiBBc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcyBzaGFyZSB0aGUgc2FtZSBzaWduYXR1cmU6XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0geyp9IGRlZmluaXRpb25cbiAgICovXG5cbiAgYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgQ29uc3RydWN0b3JbdHlwZV0gPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb25cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIENvbXBvbmVudCByZWdpc3RyYXRpb24gbmVlZHMgdG8gYXV0b21hdGljYWxseSBpbnZva2VcbiAgICogVnVlLmV4dGVuZCBvbiBvYmplY3QgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGRlZmluaXRpb25cbiAgICovXG5cbiAgQ29uc3RydWN0b3IuY29tcG9uZW50ID0gZnVuY3Rpb24gKGlkLCBkZWZpbml0aW9uKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgZGVmaW5pdGlvbi5uYW1lID0gaWRcbiAgICAgICAgZGVmaW5pdGlvbiA9IF8uVnVlLmV4dGVuZChkZWZpbml0aW9uKVxuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdID0gZGVmaW5pdGlvblxuICAgIH1cbiAgfVxufVxuXG5jcmVhdGVBc3NldFJlZ2lzdGVycyhleHBvcnRzKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxuXG4vKipcbiAqIFNldCBpbnN0YW5jZSB0YXJnZXQgZWxlbWVudCBhbmQga2ljayBvZmYgdGhlIGNvbXBpbGF0aW9uXG4gKiBwcm9jZXNzLiBUaGUgcGFzc2VkIGluIGBlbGAgY2FuIGJlIGEgc2VsZWN0b3Igc3RyaW5nLCBhblxuICogZXhpc3RpbmcgRWxlbWVudCwgb3IgYSBEb2N1bWVudEZyYWdtZW50IChmb3IgYmxvY2tcbiAqIGluc3RhbmNlcykuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8c3RyaW5nfSBlbFxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuJG1vdW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmICh0aGlzLl9pc0NvbXBpbGVkKSB7XG4gICAgXy53YXJuKCckbW91bnQoKSBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZS4nKVxuICAgIHJldHVyblxuICB9XG4gIGlmICghZWwpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzZWxlY3RvciA9IGVsXG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgIGlmICghZWwpIHtcbiAgICAgIF8ud2FybignQ2Fubm90IGZpbmQgZWxlbWVudDogJyArIHNlbGVjdG9yKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG4gIHRoaXMuX2NvbXBpbGUoZWwpXG4gIHRoaXMuX2lzQ29tcGlsZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdjb21waWxlZCcpXG4gIGlmIChfLmluRG9jKHRoaXMuJGVsKSkge1xuICAgIHRoaXMuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICByZWFkeS5jYWxsKHRoaXMpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICB0aGlzLiRvbmNlKCdob29rOmF0dGFjaGVkJywgcmVhZHkpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBNYXJrIGFuIGluc3RhbmNlIGFzIHJlYWR5LlxuICovXG5cbmZ1bmN0aW9uIHJlYWR5ICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5faXNSZWFkeSA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ3JlYWR5Jylcbn1cblxuLyoqXG4gKiBUZWFyZG93biB0aGUgaW5zdGFuY2UsIHNpbXBseSBkZWxlZ2F0ZSB0byB0aGUgaW50ZXJuYWxcbiAqIF9kZXN0cm95LlxuICovXG5cbmV4cG9ydHMuJGRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlLCBkZWZlckNsZWFudXApIHtcbiAgdGhpcy5fZGVzdHJveShyZW1vdmUsIGRlZmVyQ2xlYW51cClcbn1cblxuLyoqXG4gKiBQYXJ0aWFsbHkgY29tcGlsZSBhIHBpZWNlIG9mIERPTSBhbmQgcmV0dXJuIGFcbiAqIGRlY29tcGlsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuJGNvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGNvbXBpbGUoZWwsIHRoaXMuJG9wdGlvbnMsIHRydWUpKHRoaXMsIGVsKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBNQVhfVVBEQVRFX0NPVU5UID0gMTBcblxuLy8gd2UgaGF2ZSB0d28gc2VwYXJhdGUgcXVldWVzOiBvbmUgZm9yIGRpcmVjdGl2ZSB1cGRhdGVzXG4vLyBhbmQgb25lIGZvciB1c2VyIHdhdGNoZXIgcmVnaXN0ZXJlZCB2aWEgJHdhdGNoKCkuXG4vLyB3ZSB3YW50IHRvIGd1YXJhbnRlZSBkaXJlY3RpdmUgdXBkYXRlcyB0byBiZSBjYWxsZWRcbi8vIGJlZm9yZSB1c2VyIHdhdGNoZXJzIHNvIHRoYXQgd2hlbiB1c2VyIHdhdGNoZXJzIGFyZVxuLy8gdHJpZ2dlcmVkLCB0aGUgRE9NIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIGluIHVwZGF0ZWRcbi8vIHN0YXRlLlxudmFyIHF1ZXVlID0gW11cbnZhciB1c2VyUXVldWUgPSBbXVxudmFyIGhhcyA9IHt9XG52YXIgd2FpdGluZyA9IGZhbHNlXG52YXIgZmx1c2hpbmcgPSBmYWxzZVxuXG4vKipcbiAqIFJlc2V0IHRoZSBiYXRjaGVyJ3Mgc3RhdGUuXG4gKi9cblxuZnVuY3Rpb24gcmVzZXQgKCkge1xuICBxdWV1ZSA9IFtdXG4gIHVzZXJRdWV1ZSA9IFtdXG4gIGhhcyA9IHt9XG4gIHdhaXRpbmcgPSBmYWxzZVxuICBmbHVzaGluZyA9IGZhbHNlXG59XG5cbi8qKlxuICogRmx1c2ggYm90aCBxdWV1ZXMgYW5kIHJ1biB0aGUgam9icy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIGZsdXNoaW5nID0gdHJ1ZVxuICBydW4ocXVldWUpXG4gIHJ1bih1c2VyUXVldWUpXG4gIHJlc2V0KClcbn1cblxuLyoqXG4gKiBSdW4gdGhlIGpvYnMgaW4gYSBzaW5nbGUgcXVldWUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcXVldWVcbiAqL1xuXG5mdW5jdGlvbiBydW4gKHF1ZXVlKSB7XG4gIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIGpvYnMgbWlnaHQgYmUgcHVzaGVkXG4gIC8vIGFzIHdlIHJ1biBleGlzdGluZyBqb2JzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXS5ydW4oKVxuICB9XG59XG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSBqb2IgcXVldWUuXG4gKiBKb2JzIHdpdGggZHVwbGljYXRlIElEcyB3aWxsIGJlIHNraXBwZWQgdW5sZXNzIGl0J3NcbiAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqb2JcbiAqICAgcHJvcGVydGllczpcbiAqICAgLSB7U3RyaW5nfE51bWJlcn0gaWRcbiAqICAgLSB7RnVuY3Rpb259ICAgICAgcnVuXG4gKi9cblxuZXhwb3J0cy5wdXNoID0gZnVuY3Rpb24gKGpvYikge1xuICB2YXIgaWQgPSBqb2IuaWRcbiAgaWYgKCFpZCB8fCAhaGFzW2lkXSB8fCBmbHVzaGluZykge1xuICAgIGlmICghaGFzW2lkXSkge1xuICAgICAgaGFzW2lkXSA9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgaGFzW2lkXSsrXG4gICAgICAvLyBkZXRlY3QgcG9zc2libGUgaW5maW5pdGUgdXBkYXRlIGxvb3BzXG4gICAgICBpZiAoaGFzW2lkXSA+IE1BWF9VUERBVEVfQ09VTlQpIHtcbiAgICAgICAgXy53YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgZm9yIHRoZSAnICtcbiAgICAgICAgICAnd2F0Y2hlciB3aXRoIGV4cHJlc3Npb246IFwiJyArIGpvYi5leHByZXNzaW9uICsgJ1wiLidcbiAgICAgICAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQSB1c2VyIHdhdGNoZXIgY2FsbGJhY2sgY291bGQgdHJpZ2dlciBhbm90aGVyXG4gICAgLy8gZGlyZWN0aXZlIHVwZGF0ZSBkdXJpbmcgdGhlIGZsdXNoaW5nOyBhdCB0aGF0IHRpbWVcbiAgICAvLyB0aGUgZGlyZWN0aXZlIHF1ZXVlIHdvdWxkIGFscmVhZHkgaGF2ZSBiZWVuIHJ1biwgc29cbiAgICAvLyB3ZSBjYWxsIHRoYXQgdXBkYXRlIGltbWVkaWF0ZWx5IGFzIGl0IGlzIHB1c2hlZC5cbiAgICBpZiAoZmx1c2hpbmcgJiYgIWpvYi51c2VyKSB7XG4gICAgICBqb2IucnVuKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICA7KGpvYi51c2VyID8gdXNlclF1ZXVlIDogcXVldWUpLnB1c2goam9iKVxuICAgIGlmICghd2FpdGluZykge1xuICAgICAgd2FpdGluZyA9IHRydWVcbiAgICAgIF8ubmV4dFRpY2soZmx1c2gpXG4gICAgfVxuICB9XG59IiwiLyoqXG4gKiBBIGRvdWJseSBsaW5rZWQgbGlzdC1iYXNlZCBMZWFzdCBSZWNlbnRseSBVc2VkIChMUlUpXG4gKiBjYWNoZS4gV2lsbCBrZWVwIG1vc3QgcmVjZW50bHkgdXNlZCBpdGVtcyB3aGlsZVxuICogZGlzY2FyZGluZyBsZWFzdCByZWNlbnRseSB1c2VkIGl0ZW1zIHdoZW4gaXRzIGxpbWl0IGlzXG4gKiByZWFjaGVkLiBUaGlzIGlzIGEgYmFyZS1ib25lIHZlcnNpb24gb2ZcbiAqIFJhc211cyBBbmRlcnNzb24ncyBqcy1scnU6XG4gKlxuICogICBodHRwczovL2dpdGh1Yi5jb20vcnNtcy9qcy1scnVcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbGltaXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIENhY2hlIChsaW1pdCkge1xuICB0aGlzLnNpemUgPSAwXG4gIHRoaXMubGltaXQgPSBsaW1pdFxuICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSB1bmRlZmluZWRcbiAgdGhpcy5fa2V5bWFwID0ge31cbn1cblxudmFyIHAgPSBDYWNoZS5wcm90b3R5cGVcblxuLyoqXG4gKiBQdXQgPHZhbHVlPiBpbnRvIHRoZSBjYWNoZSBhc3NvY2lhdGVkIHdpdGggPGtleT4uXG4gKiBSZXR1cm5zIHRoZSBlbnRyeSB3aGljaCB3YXMgcmVtb3ZlZCB0byBtYWtlIHJvb20gZm9yXG4gKiB0aGUgbmV3IGVudHJ5LiBPdGhlcndpc2UgdW5kZWZpbmVkIGlzIHJldHVybmVkLlxuICogKGkuZS4gaWYgdGhlcmUgd2FzIGVub3VnaCByb29tIGFscmVhZHkpLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0VudHJ5fHVuZGVmaW5lZH1cbiAqL1xuXG5wLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBlbnRyeSA9IHtcbiAgICBrZXk6a2V5LFxuICAgIHZhbHVlOnZhbHVlXG4gIH1cbiAgdGhpcy5fa2V5bWFwW2tleV0gPSBlbnRyeVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnlcbiAgICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuaGVhZCA9IGVudHJ5XG4gIH1cbiAgdGhpcy50YWlsID0gZW50cnlcbiAgaWYgKHRoaXMuc2l6ZSA9PT0gdGhpcy5saW1pdCkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpemUrK1xuICB9XG59XG5cbi8qKlxuICogUHVyZ2UgdGhlIGxlYXN0IHJlY2VudGx5IHVzZWQgKG9sZGVzdCkgZW50cnkgZnJvbSB0aGVcbiAqIGNhY2hlLiBSZXR1cm5zIHRoZSByZW1vdmVkIGVudHJ5IG9yIHVuZGVmaW5lZCBpZiB0aGVcbiAqIGNhY2hlIHdhcyBlbXB0eS5cbiAqL1xuXG5wLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZW50cnkgPSB0aGlzLmhlYWRcbiAgaWYgKGVudHJ5KSB7XG4gICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5ld2VyXG4gICAgdGhpcy5oZWFkLm9sZGVyID0gdW5kZWZpbmVkXG4gICAgZW50cnkubmV3ZXIgPSBlbnRyeS5vbGRlciA9IHVuZGVmaW5lZFxuICAgIHRoaXMuX2tleW1hcFtlbnRyeS5rZXldID0gdW5kZWZpbmVkXG4gIH1cbiAgcmV0dXJuIGVudHJ5XG59XG5cbi8qKlxuICogR2V0IGFuZCByZWdpc3RlciByZWNlbnQgdXNlIG9mIDxrZXk+LiBSZXR1cm5zIHRoZSB2YWx1ZVxuICogYXNzb2NpYXRlZCB3aXRoIDxrZXk+IG9yIHVuZGVmaW5lZCBpZiBub3QgaW4gY2FjaGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtCb29sZWFufSByZXR1cm5FbnRyeVxuICogQHJldHVybiB7RW50cnl8Kn1cbiAqL1xuXG5wLmdldCA9IGZ1bmN0aW9uIChrZXksIHJldHVybkVudHJ5KSB7XG4gIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcFtrZXldXG4gIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgaWYgKGVudHJ5ID09PSB0aGlzLnRhaWwpIHtcbiAgICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICAgID8gZW50cnlcbiAgICAgIDogZW50cnkudmFsdWVcbiAgfVxuICAvLyBIRUFELS0tLS0tLS0tLS0tLS1UQUlMXG4gIC8vICAgPC5vbGRlciAgIC5uZXdlcj5cbiAgLy8gIDwtLS0gYWRkIGRpcmVjdGlvbiAtLVxuICAvLyAgIEEgIEIgIEMgIDxEPiAgRVxuICBpZiAoZW50cnkubmV3ZXIpIHtcbiAgICBpZiAoZW50cnkgPT09IHRoaXMuaGVhZCkge1xuICAgICAgdGhpcy5oZWFkID0gZW50cnkubmV3ZXJcbiAgICB9XG4gICAgZW50cnkubmV3ZXIub2xkZXIgPSBlbnRyeS5vbGRlciAvLyBDIDwtLSBFLlxuICB9XG4gIGlmIChlbnRyeS5vbGRlcikge1xuICAgIGVudHJ5Lm9sZGVyLm5ld2VyID0gZW50cnkubmV3ZXIgLy8gQy4gLS0+IEVcbiAgfVxuICBlbnRyeS5uZXdlciA9IHVuZGVmaW5lZCAvLyBEIC0teFxuICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbCAvLyBELiAtLT4gRVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnkgLy8gRS4gPC0tIERcbiAgfVxuICB0aGlzLnRhaWwgPSBlbnRyeVxuICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICA/IGVudHJ5XG4gICAgOiBlbnRyeS52YWx1ZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuLyoqXG4gKiBDb21waWxlIGEgdGVtcGxhdGUgYW5kIHJldHVybiBhIHJldXNhYmxlIGNvbXBvc2l0ZSBsaW5rXG4gKiBmdW5jdGlvbiwgd2hpY2ggcmVjdXJzaXZlbHkgY29udGFpbnMgbW9yZSBsaW5rIGZ1bmN0aW9uc1xuICogaW5zaWRlLiBUaGlzIHRvcCBsZXZlbCBjb21waWxlIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlXG4gKiBjYWxsZWQgb24gaW5zdGFuY2Ugcm9vdCBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHBhcnRpYWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdHJhbnNjbHVkZWRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGUgKGVsLCBvcHRpb25zLCBwYXJ0aWFsLCB0cmFuc2NsdWRlZCkge1xuICB2YXIgaXNCbG9jayA9IGVsLm5vZGVUeXBlID09PSAxMVxuICAvLyBsaW5rIGZ1bmN0aW9uIGZvciBwYXJhbSBhdHRyaWJ1dGVzLlxuICB2YXIgcGFyYW1zID0gb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgdmFyIHBhcmFtc0xpbmtGbiA9IHBhcmFtcyAmJiAhcGFydGlhbCAmJiAhdHJhbnNjbHVkZWQgJiYgIWlzQmxvY2tcbiAgICA/IGNvbXBpbGVQYXJhbUF0dHJpYnV0ZXMoZWwsIHBhcmFtcywgb3B0aW9ucylcbiAgICA6IG51bGxcbiAgLy8gbGluayBmdW5jdGlvbiBmb3IgdGhlIG5vZGUgaXRzZWxmLlxuICAvLyBpZiB0aGlzIGlzIGEgYmxvY2sgaW5zdGFuY2UsIHdlIHJldHVybiBhIGxpbmsgZnVuY3Rpb25cbiAgLy8gZm9yIHRoZSBhdHRyaWJ1dGVzIGZvdW5kIG9uIHRoZSBjb250YWluZXIsIGlmIGFueS5cbiAgLy8gb3B0aW9ucy5fY29udGFpbmVyQXR0cnMgYXJlIGNvbGxlY3RlZCBkdXJpbmcgdHJhbnNjbHVzaW9uLlxuICB2YXIgbm9kZUxpbmtGbiA9IGlzQmxvY2tcbiAgICA/IGNvbXBpbGVCbG9ja0NvbnRhaW5lcihvcHRpb25zLl9jb250YWluZXJBdHRycywgcGFyYW1zLCBvcHRpb25zKVxuICAgIDogY29tcGlsZU5vZGUoZWwsIG9wdGlvbnMpXG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHRoZSBjaGlsZE5vZGVzXG4gIHZhciBjaGlsZExpbmtGbiA9XG4gICAgIShub2RlTGlua0ZuICYmIG5vZGVMaW5rRm4udGVybWluYWwpICYmXG4gICAgZWwudGFnTmFtZSAhPT0gJ1NDUklQVCcgJiZcbiAgICBlbC5oYXNDaGlsZE5vZGVzKClcbiAgICAgID8gY29tcGlsZU5vZGVMaXN0KGVsLmNoaWxkTm9kZXMsIG9wdGlvbnMpXG4gICAgICA6IG51bGxcblxuICAvKipcbiAgICogQSBjb21wb3NpdGUgbGlua2VyIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBhIGFscmVhZHlcbiAgICogY29tcGlsZWQgcGllY2Ugb2YgRE9NLCB3aGljaCBpbnN0YW50aWF0ZXMgYWxsIGRpcmVjdGl2ZVxuICAgKiBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAgICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICAgKi9cblxuICBmdW5jdGlvbiBjb21wb3NpdGVMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBvcmlnaW5hbERpckNvdW50ID0gdm0uX2RpcmVjdGl2ZXMubGVuZ3RoXG4gICAgdmFyIHBhcmVudE9yaWdpbmFsRGlyQ291bnQgPVxuICAgICAgdm0uJHBhcmVudCAmJiB2bS4kcGFyZW50Ll9kaXJlY3RpdmVzLmxlbmd0aFxuICAgIGlmIChwYXJhbXNMaW5rRm4pIHtcbiAgICAgIHBhcmFtc0xpbmtGbih2bSwgZWwpXG4gICAgfVxuICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KGVsLmNoaWxkTm9kZXMpXG4gICAgLy8gaWYgdGhpcyBpcyBhIHRyYW5zY2x1ZGVkIGNvbXBpbGUsIGxpbmtlcnMgbmVlZCB0byBiZVxuICAgIC8vIGNhbGxlZCBpbiBzb3VyY2Ugc2NvcGUsIGFuZCB0aGUgaG9zdCBuZWVkcyB0byBiZVxuICAgIC8vIHBhc3NlZCBkb3duLlxuICAgIHZhciBzb3VyY2UgPSB0cmFuc2NsdWRlZCA/IHZtLiRwYXJlbnQgOiB2bVxuICAgIHZhciBob3N0ID0gdHJhbnNjbHVkZWQgPyB2bSA6IHVuZGVmaW5lZFxuICAgIC8vIGxpbmtcbiAgICBpZiAobm9kZUxpbmtGbikgbm9kZUxpbmtGbihzb3VyY2UsIGVsLCBob3N0KVxuICAgIGlmIChjaGlsZExpbmtGbikgY2hpbGRMaW5rRm4oc291cmNlLCBjaGlsZE5vZGVzLCBob3N0KVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBpcyBhIHBhcnRpYWwgY29tcGlsZSwgdGhlIGxpbmtlciBmdW5jdGlvblxuICAgICAqIHJldHVybnMgYW4gdW5saW5rIGZ1bmN0aW9uIHRoYXQgdGVhcnNkb3duIGFsbFxuICAgICAqIGRpcmVjdGl2ZXMgaW5zdGFuY2VzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIHBhcnRpYWxcbiAgICAgKiBsaW5raW5nLlxuICAgICAqL1xuXG4gICAgaWYgKHBhcnRpYWwgJiYgIXRyYW5zY2x1ZGVkKSB7XG4gICAgICB2YXIgc2VsZkRpcnMgPSB2bS5fZGlyZWN0aXZlcy5zbGljZShvcmlnaW5hbERpckNvdW50KVxuICAgICAgdmFyIHBhcmVudERpcnMgPSB2bS4kcGFyZW50ICYmXG4gICAgICAgIHZtLiRwYXJlbnQuX2RpcmVjdGl2ZXMuc2xpY2UocGFyZW50T3JpZ2luYWxEaXJDb3VudClcblxuICAgICAgdmFyIHRlYXJkb3duRGlycyA9IGZ1bmN0aW9uICh2bSwgZGlycykge1xuICAgICAgICB2YXIgaSA9IGRpcnMubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICBkaXJzW2ldLl90ZWFyZG93bigpXG4gICAgICAgIH1cbiAgICAgICAgaSA9IHZtLl9kaXJlY3RpdmVzLmluZGV4T2YoZGlyc1swXSlcbiAgICAgICAgdm0uX2RpcmVjdGl2ZXMuc3BsaWNlKGksIGRpcnMubGVuZ3RoKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gdW5saW5rICgpIHtcbiAgICAgICAgdGVhcmRvd25EaXJzKHZtLCBzZWxmRGlycylcbiAgICAgICAgaWYgKHBhcmVudERpcnMpIHtcbiAgICAgICAgICB0ZWFyZG93bkRpcnModm0uJHBhcmVudCwgcGFyZW50RGlycylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIHRyYW5zY2x1ZGVkIGxpbmtGbnMgYXJlIHRlcm1pbmFsLCBiZWNhdXNlIGl0IHRha2VzXG4gIC8vIG92ZXIgdGhlIGVudGlyZSBzdWItdHJlZS5cbiAgaWYgKHRyYW5zY2x1ZGVkKSB7XG4gICAgY29tcG9zaXRlTGlua0ZuLnRlcm1pbmFsID0gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGNvbXBvc2l0ZUxpbmtGblxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGF0dHJpYnV0ZXMgZm91bmQgb24gYSBcImJsb2NrIGNvbnRhaW5lclwiIC1cbiAqIGkuZS4gdGhlIGNvbnRhaW5lciBub2RlIGluIHRoZSBwYXJlbnQgdGVtcGF0ZSBvZiBhIGJsb2NrXG4gKiBpbnN0YW5jZS4gV2UgYXJlIG9ubHkgY29uY2VybmVkIHdpdGggdi13aXRoIGFuZFxuICogcGFyYW1BdHRyaWJ1dGVzIGhlcmUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzIC0gYSBtYXAgb2YgYXR0ciBuYW1lL3ZhbHVlIHBhaXJzXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXMgLSBwYXJhbSBhdHRyaWJ1dGVzIGxpc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlQmxvY2tDb250YWluZXIgKGF0dHJzLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgaWYgKCFhdHRycykgcmV0dXJuIG51bGxcbiAgdmFyIHBhcmFtc0xpbmtGbiA9IHBhcmFtc1xuICAgID8gY29tcGlsZVBhcmFtQXR0cmlidXRlcyhhdHRycywgcGFyYW1zLCBvcHRpb25zKVxuICAgIDogbnVsbFxuICB2YXIgd2l0aFZhbCA9IGF0dHJzW2NvbmZpZy5wcmVmaXggKyAnd2l0aCddXG4gIHZhciB3aXRoTGlua0ZuID0gbnVsbFxuICBpZiAod2l0aFZhbCkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHdpdGhWYWwpWzBdXG4gICAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1snd2l0aCddXG4gICAgd2l0aExpbmtGbiA9IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgIHZtLl9iaW5kRGlyKCd3aXRoJywgZWwsIGRlc2NyaXB0b3IsIGRlZikgICBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIGJsb2NrQ29udGFpbmVyTGlua0ZuICh2bSkge1xuICAgIC8vIGV4cGxpY2l0bHkgcGFzc2luZyBudWxsIHRvIHRoZSBsaW5rZXJzXG4gICAgLy8gc2luY2Ugdi13aXRoIGRvZXNuJ3QgbmVlZCBhIHJlYWwgZWxlbWVudFxuICAgIGlmIChwYXJhbXNMaW5rRm4pIHBhcmFtc0xpbmtGbih2bSwgbnVsbClcbiAgICBpZiAod2l0aExpbmtGbikgd2l0aExpbmtGbih2bSwgbnVsbClcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuIGJhc2VkIG9uIHRoZVxuICogbm9kZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGUgKG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGUgPSBub2RlLm5vZGVUeXBlXG4gIGlmICh0eXBlID09PSAxICYmIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcpIHtcbiAgICByZXR1cm4gY29tcGlsZUVsZW1lbnQobm9kZSwgb3B0aW9ucylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAzICYmIGNvbmZpZy5pbnRlcnBvbGF0ZSAmJiBub2RlLmRhdGEudHJpbSgpKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVUZXh0Tm9kZShub2RlLCBvcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGFuIGVsZW1lbnQgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZUVsZW1lbnQgKGVsLCBvcHRpb25zKSB7XG4gIGlmIChjaGVja1RyYW5zY2x1c2lvbihlbCkpIHtcbiAgICAvLyB1bndyYXAgdGV4dE5vZGVcbiAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdfX3Z1ZV9fd3JhcCcpKSB7XG4gICAgICBlbCA9IGVsLmZpcnN0Q2hpbGRcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGUoZWwsIG9wdGlvbnMuX3BhcmVudC4kb3B0aW9ucywgdHJ1ZSwgdHJ1ZSlcbiAgfVxuICB2YXIgbGlua0ZuLCB0YWcsIGNvbXBvbmVudFxuICAvLyBjaGVjayBjdXN0b20gZWxlbWVudCBjb21wb25lbnQsIGJ1dCBvbmx5IG9uIG5vbi1yb290XG4gIGlmICghZWwuX192dWVfXykge1xuICAgIHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgIGNvbXBvbmVudCA9XG4gICAgICB0YWcuaW5kZXhPZignLScpID4gMCAmJlxuICAgICAgb3B0aW9ucy5jb21wb25lbnRzW3RhZ11cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArICdjb21wb25lbnQnLCB0YWcpXG4gICAgfVxuICB9XG4gIGlmIChjb21wb25lbnQgfHwgZWwuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgLy8gY2hlY2sgdGVybWluYWwgZGlyZWNpdHZlc1xuICAgIGxpbmtGbiA9IGNoZWNrVGVybWluYWxEaXJlY3RpdmVzKGVsLCBvcHRpb25zKVxuICAgIC8vIGlmIG5vdCB0ZXJtaW5hbCwgYnVpbGQgbm9ybWFsIGxpbmsgZnVuY3Rpb25cbiAgICBpZiAoIWxpbmtGbikge1xuICAgICAgdmFyIGRpcnMgPSBjb2xsZWN0RGlyZWN0aXZlcyhlbCwgb3B0aW9ucylcbiAgICAgIGxpbmtGbiA9IGRpcnMubGVuZ3RoXG4gICAgICAgID8gbWFrZU5vZGVMaW5rRm4oZGlycylcbiAgICAgICAgOiBudWxsXG4gICAgfVxuICB9XG4gIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgdGV4dGFyZWEsIHdlIG5lZWQgdG8gaW50ZXJwb2xhdGVcbiAgLy8gaXRzIGNvbnRlbnQgb24gaW5pdGlhbCByZW5kZXIuXG4gIGlmIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgdmFyIHJlYWxMaW5rRm4gPSBsaW5rRm5cbiAgICBsaW5rRm4gPSBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICBlbC52YWx1ZSA9IHZtLiRpbnRlcnBvbGF0ZShlbC52YWx1ZSlcbiAgICAgIGlmIChyZWFsTGlua0ZuKSByZWFsTGlua0ZuKHZtLCBlbClcbiAgICB9XG4gICAgbGlua0ZuLnRlcm1pbmFsID0gdHJ1ZVxuICB9XG4gIHJldHVybiBsaW5rRm5cbn1cblxuLyoqXG4gKiBCdWlsZCBhIGxpbmsgZnVuY3Rpb24gZm9yIGFsbCBkaXJlY3RpdmVzIG9uIGEgc2luZ2xlIG5vZGUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGlyZWN0aXZlc1xuICogQHJldHVybiB7RnVuY3Rpb259IGRpcmVjdGl2ZXNMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBtYWtlTm9kZUxpbmtGbiAoZGlyZWN0aXZlcykge1xuICByZXR1cm4gZnVuY3Rpb24gbm9kZUxpbmtGbiAodm0sIGVsLCBob3N0KSB7XG4gICAgLy8gcmV2ZXJzZSBhcHBseSBiZWNhdXNlIGl0J3Mgc29ydGVkIGxvdyB0byBoaWdoXG4gICAgdmFyIGkgPSBkaXJlY3RpdmVzLmxlbmd0aFxuICAgIHZhciBkaXIsIGosIGssIHRhcmdldFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGRpciA9IGRpcmVjdGl2ZXNbaV1cbiAgICAgIC8vIGEgZGlyZWN0aXZlIGNhbiBiZSB0cmFuc2NsdWRlZCBpZiBpdCdzIHdyaXR0ZW5cbiAgICAgIC8vIG9uIGEgY29tcG9uZW50J3MgY29udGFpbmVyIGluIGl0cyBwYXJlbnQgdGVtcGFsdGUuXG4gICAgICB0YXJnZXQgPSBkaXIudHJhbnNjbHVkZWRcbiAgICAgICAgPyB2bS4kcGFyZW50XG4gICAgICAgIDogdm1cbiAgICAgIGlmIChkaXIuX2xpbmspIHtcbiAgICAgICAgLy8gY3VzdG9tIGxpbmsgZm5cbiAgICAgICAgZGlyLl9saW5rKHRhcmdldCwgZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrID0gZGlyLmRlc2NyaXB0b3JzLmxlbmd0aFxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgdGFyZ2V0Ll9iaW5kRGlyKGRpci5uYW1lLCBlbCxcbiAgICAgICAgICAgIGRpci5kZXNjcmlwdG9yc1tqXSwgZGlyLmRlZiwgaG9zdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSB0ZXh0Tm9kZSBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge1RleHROb2RlfSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH0gdGV4dE5vZGVMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlVGV4dE5vZGUgKG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2Uobm9kZS5kYXRhKVxuICBpZiAoIXRva2Vucykge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgdmFyIGVsLCB0b2tlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB0b2tlbiA9IHRva2Vuc1tpXVxuICAgIGVsID0gdG9rZW4udGFnXG4gICAgICA/IHByb2Nlc3NUZXh0VG9rZW4odG9rZW4sIG9wdGlvbnMpXG4gICAgICA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKVxuICAgIGZyYWcuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbiAgcmV0dXJuIG1ha2VUZXh0Tm9kZUxpbmtGbih0b2tlbnMsIGZyYWcsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogUHJvY2VzcyBhIHNpbmdsZSB0ZXh0IHRva2VuLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlblxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cblxuZnVuY3Rpb24gcHJvY2Vzc1RleHRUb2tlbiAodG9rZW4sIG9wdGlvbnMpIHtcbiAgdmFyIGVsXG4gIGlmICh0b2tlbi5vbmVUaW1lKSB7XG4gICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbi52YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICBpZiAodG9rZW4uaHRtbCkge1xuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWh0bWwnKVxuICAgICAgc2V0VG9rZW5UeXBlKCdodG1sJylcbiAgICB9IGVsc2UgaWYgKHRva2VuLnBhcnRpYWwpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1wYXJ0aWFsJylcbiAgICAgIHNldFRva2VuVHlwZSgncGFydGlhbCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElFIHdpbGwgY2xlYW4gdXAgZW1wdHkgdGV4dE5vZGVzIGR1cmluZ1xuICAgICAgLy8gZnJhZy5jbG9uZU5vZGUodHJ1ZSksIHNvIHdlIGhhdmUgdG8gZ2l2ZSBpdFxuICAgICAgLy8gc29tZXRoaW5nIGhlcmUuLi5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKVxuICAgICAgc2V0VG9rZW5UeXBlKCd0ZXh0JylcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VG9rZW5UeXBlICh0eXBlKSB7XG4gICAgdG9rZW4udHlwZSA9IHR5cGVcbiAgICB0b2tlbi5kZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXNbdHlwZV1cbiAgICB0b2tlbi5kZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHRva2VuLnZhbHVlKVswXVxuICB9XG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgYSB0ZXh0Tm9kZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRva2Vuc1xuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSBmcmFnXG4gKi9cblxuZnVuY3Rpb24gbWFrZVRleHROb2RlTGlua0ZuICh0b2tlbnMsIGZyYWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRleHROb2RlTGlua0ZuICh2bSwgZWwpIHtcbiAgICB2YXIgZnJhZ0Nsb25lID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSlcbiAgICB2YXIgY2hpbGROb2RlcyA9IF8udG9BcnJheShmcmFnQ2xvbmUuY2hpbGROb2RlcylcbiAgICB2YXIgdG9rZW4sIHZhbHVlLCBub2RlXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgdmFsdWUgPSB0b2tlbi52YWx1ZVxuICAgICAgaWYgKHRva2VuLnRhZykge1xuICAgICAgICBub2RlID0gY2hpbGROb2Rlc1tpXVxuICAgICAgICBpZiAodG9rZW4ub25lVGltZSkge1xuICAgICAgICAgIHZhbHVlID0gdm0uJGV2YWwodmFsdWUpXG4gICAgICAgICAgaWYgKHRva2VuLmh0bWwpIHtcbiAgICAgICAgICAgIF8ucmVwbGFjZShub2RlLCB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh2YWx1ZSwgdHJ1ZSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZtLl9iaW5kRGlyKHRva2VuLnR5cGUsIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgdG9rZW4uZGVzY3JpcHRvciwgdG9rZW4uZGVmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIF8ucmVwbGFjZShlbCwgZnJhZ0Nsb25lKVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgbGlzdCBhbmQgcmV0dXJuIGEgY2hpbGRMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZUxpc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGVMaXN0IChub2RlTGlzdCwgb3B0aW9ucykge1xuICB2YXIgbGlua0ZucyA9IFtdXG4gIHZhciBub2RlTGlua0ZuLCBjaGlsZExpbmtGbiwgbm9kZVxuICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG5vZGUgPSBub2RlTGlzdFtpXVxuICAgIG5vZGVMaW5rRm4gPSBjb21waWxlTm9kZShub2RlLCBvcHRpb25zKVxuICAgIGNoaWxkTGlua0ZuID1cbiAgICAgICEobm9kZUxpbmtGbiAmJiBub2RlTGlua0ZuLnRlcm1pbmFsKSAmJlxuICAgICAgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgbm9kZS5oYXNDaGlsZE5vZGVzKClcbiAgICAgICAgPyBjb21waWxlTm9kZUxpc3Qobm9kZS5jaGlsZE5vZGVzLCBvcHRpb25zKVxuICAgICAgICA6IG51bGxcbiAgICBsaW5rRm5zLnB1c2gobm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4pXG4gIH1cbiAgcmV0dXJuIGxpbmtGbnMubGVuZ3RoXG4gICAgPyBtYWtlQ2hpbGRMaW5rRm4obGlua0ZucylcbiAgICA6IG51bGxcbn1cblxuLyoqXG4gKiBNYWtlIGEgY2hpbGQgbGluayBmdW5jdGlvbiBmb3IgYSBub2RlJ3MgY2hpbGROb2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gbGlua0Zuc1xuICogQHJldHVybiB7RnVuY3Rpb259IGNoaWxkTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZUNoaWxkTGlua0ZuIChsaW5rRm5zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjaGlsZExpbmtGbiAodm0sIG5vZGVzLCBob3N0KSB7XG4gICAgdmFyIG5vZGUsIG5vZGVMaW5rRm4sIGNoaWxkcmVuTGlua0ZuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSAwLCBsID0gbGlua0Zucy5sZW5ndGg7IGkgPCBsOyBuKyspIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tuXVxuICAgICAgbm9kZUxpbmtGbiA9IGxpbmtGbnNbaSsrXVxuICAgICAgY2hpbGRyZW5MaW5rRm4gPSBsaW5rRm5zW2krK11cbiAgICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkobm9kZS5jaGlsZE5vZGVzKVxuICAgICAgaWYgKG5vZGVMaW5rRm4pIHtcbiAgICAgICAgbm9kZUxpbmtGbih2bSwgbm9kZSwgaG9zdClcbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZHJlbkxpbmtGbikge1xuICAgICAgICBjaGlsZHJlbkxpbmtGbih2bSwgY2hpbGROb2RlcywgaG9zdClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIHBhcmFtIGF0dHJpYnV0ZXMgb24gYSByb290IGVsZW1lbnQgYW5kIHJldHVyblxuICogYSBwYXJhbUF0dHJpYnV0ZXMgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbFxuICogQHBhcmFtIHtBcnJheX0gYXR0cnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gcGFyYW1zTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVBhcmFtQXR0cmlidXRlcyAoZWwsIGF0dHJzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJhbXMgPSBbXVxuICB2YXIgaXNFbCA9IGVsLm5vZGVUeXBlXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHZhciBuYW1lLCB2YWx1ZSwgcGFyYW1cbiAgd2hpbGUgKGktLSkge1xuICAgIG5hbWUgPSBhdHRyc1tpXVxuICAgIGlmICgvW0EtWl0vLnRlc3QobmFtZSkpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1lvdSBzZWVtIHRvIGJlIHVzaW5nIGNhbWVsQ2FzZSBmb3IgYSBwYXJhbUF0dHJpYnV0ZSwgJyArXG4gICAgICAgICdidXQgSFRNTCBkb2VzblxcJ3QgZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIHVwcGVyIGFuZCAnICtcbiAgICAgICAgJ2xvd2VyIGNhc2UuIFlvdSBzaG91bGQgdXNlIGh5cGhlbi1kZWxpbWl0ZWQgJyArXG4gICAgICAgICdhdHRyaWJ1dGUgbmFtZXMuIEZvciBtb3JlIGluZm8gc2VlICcgK1xuICAgICAgICAnaHR0cDovL3Z1ZWpzLm9yZy9hcGkvb3B0aW9ucy5odG1sI3BhcmFtQXR0cmlidXRlcydcbiAgICAgIClcbiAgICB9XG4gICAgdmFsdWUgPSBpc0VsID8gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIDogZWxbbmFtZV1cbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHBhcmFtID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH1cbiAgICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHZhbHVlKVxuICAgICAgaWYgKHRva2Vucykge1xuICAgICAgICBpZiAoaXNFbCkgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIF8ud2FybihcbiAgICAgICAgICAgICdJbnZhbGlkIHBhcmFtIGF0dHJpYnV0ZSBiaW5kaW5nOiBcIicgK1xuICAgICAgICAgICAgbmFtZSArICc9XCInICsgdmFsdWUgKyAnXCInICtcbiAgICAgICAgICAgICdcXG5Eb25cXCd0IG1peCBiaW5kaW5nIHRhZ3Mgd2l0aCBwbGFpbiB0ZXh0ICcgK1xuICAgICAgICAgICAgJ2luIHBhcmFtIGF0dHJpYnV0ZSBiaW5kaW5ncy4nXG4gICAgICAgICAgKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0uZHluYW1pYyA9IHRydWVcbiAgICAgICAgICBwYXJhbS52YWx1ZSA9IHRva2Vuc1swXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXJhbXMucHVzaChwYXJhbSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1ha2VQYXJhbXNMaW5rRm4ocGFyYW1zLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZnVuY3Rpb24gdGhhdCBhcHBsaWVzIHBhcmFtIGF0dHJpYnV0ZXMgdG8gYSB2bS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gcGFyYW1zTGlua0ZuXG4gKi9cblxudmFyIGRhdGFBdHRyUkUgPSAvXmRhdGEtL1xuXG5mdW5jdGlvbiBtYWtlUGFyYW1zTGlua0ZuIChwYXJhbXMsIG9wdGlvbnMpIHtcbiAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1snd2l0aCddXG4gIHJldHVybiBmdW5jdGlvbiBwYXJhbXNMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBpID0gcGFyYW1zLmxlbmd0aFxuICAgIHZhciBwYXJhbSwgcGF0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHBhcmFtID0gcGFyYW1zW2ldXG4gICAgICAvLyBwYXJhbXMgY291bGQgY29udGFpbiBkYXNoZXMsIHdoaWNoIHdpbGwgYmVcbiAgICAgIC8vIGludGVycHJldGVkIGFzIG1pbnVzIGNhbGN1bGF0aW9ucyBieSB0aGUgcGFyc2VyXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIHdyYXAgdGhlIHBhdGggaGVyZVxuICAgICAgcGF0aCA9IF8uY2FtZWxpemUocGFyYW0ubmFtZS5yZXBsYWNlKGRhdGFBdHRyUkUsICcnKSlcbiAgICAgIGlmIChwYXJhbS5keW5hbWljKSB7XG4gICAgICAgIC8vIGR5bmFtaWMgcGFyYW0gYXR0cmlidHVlcyBhcmUgYm91bmQgYXMgdi13aXRoLlxuICAgICAgICAvLyB3ZSBjYW4gZGlyZWN0bHkgZHVjayB0aGUgZGVzY3JpcHRvciBoZXJlIGJlYWN1c2VcbiAgICAgICAgLy8gcGFyYW0gYXR0cmlidXRlcyBjYW5ub3QgdXNlIGV4cHJlc3Npb25zIG9yXG4gICAgICAgIC8vIGZpbHRlcnMuXG4gICAgICAgIHZtLl9iaW5kRGlyKCd3aXRoJywgZWwsIHtcbiAgICAgICAgICBhcmc6IHBhdGgsXG4gICAgICAgICAgZXhwcmVzc2lvbjogcGFyYW0udmFsdWVcbiAgICAgICAgfSwgZGVmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8ganVzdCBzZXQgb25jZVxuICAgICAgICB2bS4kc2V0KHBhdGgsIHBhcmFtLnZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGFuIGVsZW1lbnQgZm9yIHRlcm1pbmFsIGRpcmVjdGl2ZXMgaW4gZml4ZWQgb3JkZXIuXG4gKiBJZiBpdCBmaW5kcyBvbmUsIHJldHVybiBhIHRlcm1pbmFsIGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbnZhciB0ZXJtaW5hbERpcmVjdGl2ZXMgPSBbXG4gICdyZXBlYXQnLFxuICAnaWYnLFxuICAnY29tcG9uZW50J1xuXVxuXG5mdW5jdGlvbiBza2lwICgpIHt9XG5za2lwLnRlcm1pbmFsID0gdHJ1ZVxuXG5mdW5jdGlvbiBjaGVja1Rlcm1pbmFsRGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKF8uYXR0cihlbCwgJ3ByZScpICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNraXBcbiAgfVxuICB2YXIgdmFsdWUsIGRpck5hbWVcbiAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBkaXJOYW1lID0gdGVybWluYWxEaXJlY3RpdmVzW2ldXG4gICAgaWYgKHZhbHVlID0gXy5hdHRyKGVsLCBkaXJOYW1lKSkge1xuICAgICAgcmV0dXJuIG1ha2VUZXJtaW5hbE5vZGVMaW5rRm4oZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgbm9kZSBsaW5rIGZ1bmN0aW9uIGZvciBhIHRlcm1pbmFsIGRpcmVjdGl2ZS5cbiAqIEEgdGVybWluYWwgbGluayBmdW5jdGlvbiB0ZXJtaW5hdGVzIHRoZSBjdXJyZW50XG4gKiBjb21waWxhdGlvbiByZWN1cnNpb24gYW5kIGhhbmRsZXMgY29tcGlsYXRpb24gb2YgdGhlXG4gKiBzdWJ0cmVlIGluIHRoZSBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGRpck5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXJtaW5hbE5vZGVMaW5rRm4gKGVsLCBkaXJOYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZSh2YWx1ZSlbMF1cbiAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1tkaXJOYW1lXVxuICB2YXIgZm4gPSBmdW5jdGlvbiB0ZXJtaW5hbE5vZGVMaW5rRm4gKHZtLCBlbCwgaG9zdCkge1xuICAgIHZtLl9iaW5kRGlyKGRpck5hbWUsIGVsLCBkZXNjcmlwdG9yLCBkZWYsIGhvc3QpXG4gIH1cbiAgZm4udGVybWluYWwgPSB0cnVlXG4gIHJldHVybiBmblxufVxuXG4vKipcbiAqIENvbGxlY3QgdGhlIGRpcmVjdGl2ZXMgb24gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gY29sbGVjdERpcmVjdGl2ZXMgKGVsLCBvcHRpb25zKSB7XG4gIHZhciBhdHRycyA9IF8udG9BcnJheShlbC5hdHRyaWJ1dGVzKVxuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB2YXIgZGlycyA9IFtdXG4gIHZhciBhdHRyLCBhdHRyTmFtZSwgZGlyLCBkaXJOYW1lLCBkaXJEZWYsIHRyYW5zY2x1ZGVkXG4gIHdoaWxlIChpLS0pIHtcbiAgICBhdHRyID0gYXR0cnNbaV1cbiAgICBhdHRyTmFtZSA9IGF0dHIubmFtZVxuICAgIHRyYW5zY2x1ZGVkID1cbiAgICAgIG9wdGlvbnMuX3RyYW5zY2x1ZGVkQXR0cnMgJiZcbiAgICAgIG9wdGlvbnMuX3RyYW5zY2x1ZGVkQXR0cnNbYXR0ck5hbWVdXG4gICAgaWYgKGF0dHJOYW1lLmluZGV4T2YoY29uZmlnLnByZWZpeCkgPT09IDApIHtcbiAgICAgIGRpck5hbWUgPSBhdHRyTmFtZS5zbGljZShjb25maWcucHJlZml4Lmxlbmd0aClcbiAgICAgIGRpckRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1tkaXJOYW1lXVxuICAgICAgXy5hc3NlcnRBc3NldChkaXJEZWYsICdkaXJlY3RpdmUnLCBkaXJOYW1lKVxuICAgICAgaWYgKGRpckRlZikge1xuICAgICAgICBkaXJzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGRpck5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRvcnM6IGRpclBhcnNlci5wYXJzZShhdHRyLnZhbHVlKSxcbiAgICAgICAgICBkZWY6IGRpckRlZixcbiAgICAgICAgICB0cmFuc2NsdWRlZDogdHJhbnNjbHVkZWRcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgZGlyID0gY29sbGVjdEF0dHJEaXJlY3RpdmUoZWwsIGF0dHJOYW1lLCBhdHRyLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucylcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgZGlyLnRyYW5zY2x1ZGVkID0gdHJhbnNjbHVkZWRcbiAgICAgICAgZGlycy5wdXNoKGRpcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gc29ydCBieSBwcmlvcml0eSwgTE9XIHRvIEhJR0hcbiAgZGlycy5zb3J0KGRpcmVjdGl2ZUNvbXBhcmF0b3IpXG4gIHJldHVybiBkaXJzXG59XG5cbi8qKlxuICogQ2hlY2sgYW4gYXR0cmlidXRlIGZvciBwb3RlbnRpYWwgZHluYW1pYyBiaW5kaW5ncyxcbiAqIGFuZCByZXR1cm4gYSBkaXJlY3RpdmUgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gY29sbGVjdEF0dHJEaXJlY3RpdmUgKGVsLCBuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh2YWx1ZSlcbiAgaWYgKHRva2Vucykge1xuICAgIHZhciBkZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXMuYXR0clxuICAgIHZhciBpID0gdG9rZW5zLmxlbmd0aFxuICAgIHZhciBhbGxPbmVUaW1lID0gdHJ1ZVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgaWYgKHRva2VuLnRhZyAmJiAhdG9rZW4ub25lVGltZSkge1xuICAgICAgICBhbGxPbmVUaW1lID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZjogZGVmLFxuICAgICAgX2xpbms6IGFsbE9uZVRpbWVcbiAgICAgICAgPyBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUobmFtZSwgdm0uJGludGVycG9sYXRlKHZhbHVlKSlcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMsIHZtKVxuICAgICAgICAgICAgdmFyIGRlc2MgPSBkaXJQYXJzZXIucGFyc2UobmFtZSArICc6JyArIHZhbHVlKVswXVxuICAgICAgICAgICAgdm0uX2JpbmREaXIoJ2F0dHInLCBlbCwgZGVzYywgZGVmKVxuICAgICAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgcHJpb3JpdHkgc29ydCBjb21wYXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKi9cblxuZnVuY3Rpb24gZGlyZWN0aXZlQ29tcGFyYXRvciAoYSwgYikge1xuICBhID0gYS5kZWYucHJpb3JpdHkgfHwgMFxuICBiID0gYi5kZWYucHJpb3JpdHkgfHwgMFxuICByZXR1cm4gYSA+IGIgPyAxIDogLTFcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnQgaXMgdHJhbnNjbHVkZWRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciB0cmFuc2NsdWRlZEZsYWdBdHRyID0gJ19fdnVlX190cmFuc2NsdWRlZCdcbmZ1bmN0aW9uIGNoZWNrVHJhbnNjbHVzaW9uIChlbCkge1xuICBpZiAoZWwubm9kZVR5cGUgPT09IDEgJiYgZWwuaGFzQXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIpKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIHRyYW5zY2x1ZGVkRmxhZ0F0dHIgPSAnX192dWVfX3RyYW5zY2x1ZGVkJ1xuXG4vKipcbiAqIFByb2Nlc3MgYW4gZWxlbWVudCBvciBhIERvY3VtZW50RnJhZ21lbnQgYmFzZWQgb24gYVxuICogaW5zdGFuY2Ugb3B0aW9uIG9iamVjdC4gVGhpcyBhbGxvd3MgdXMgdG8gdHJhbnNjbHVkZVxuICogYSB0ZW1wbGF0ZSBub2RlL2ZyYWdtZW50IGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgY3JlYXRlZCxcbiAqIHNvIHRoZSBwcm9jZXNzZWQgZnJhZ21lbnQgY2FuIHRoZW4gYmUgY2xvbmVkIGFuZCByZXVzZWRcbiAqIGluIHYtcmVwZWF0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2NsdWRlIChlbCwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLl9hc0NvbXBvbmVudCkge1xuICAgIC8vIG11dGF0aW5nIHRoZSBvcHRpb25zIG9iamVjdCBoZXJlIGFzc3VtaW5nIHRoZSBzYW1lXG4gICAgLy8gb2JqZWN0IHdpbGwgYmUgdXNlZCBmb3IgY29tcGlsZSByaWdodCBhZnRlciB0aGlzXG4gICAgb3B0aW9ucy5fdHJhbnNjbHVkZWRBdHRycyA9IGV4dHJhY3RBdHRycyhlbC5hdHRyaWJ1dGVzKVxuICAgIC8vIE1hcmsgY29udGVudCBub2RlcyBhbmQgYXR0cnMgc28gdGhhdCB0aGUgY29tcGlsZXJcbiAgICAvLyBrbm93cyB0aGV5IHNob3VsZCBiZSBjb21waWxlZCBpbiBwYXJlbnQgc2NvcGUuXG4gICAgdmFyIGkgPSBlbC5jaGlsZE5vZGVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciBub2RlID0gZWwuY2hpbGROb2Rlc1tpXVxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0ciwgJycpXG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMgJiYgbm9kZS5kYXRhLnRyaW0oKSkge1xuICAgICAgICAvLyB3cmFwIHRyYW5zY2x1ZGVkIHRleHROb2RlcyBpbiBzcGFucywgYmVjYXVzZVxuICAgICAgICAvLyByYXcgdGV4dE5vZGVzIGNhbid0IGJlIHBlcnNpc3RlZCB0aHJvdWdoIGNsb25lc1xuICAgICAgICAvLyBieSBhdHRhY2hpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgd3JhcHBlci50ZXh0Q29udGVudCA9IG5vZGUuZGF0YVxuICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnX192dWVfX3dyYXAnLCAnJylcbiAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0ciwgJycpXG4gICAgICAgIGVsLnJlcGxhY2VDaGlsZCh3cmFwcGVyLCBub2RlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBmb3IgdGVtcGxhdGUgdGFncywgd2hhdCB3ZSB3YW50IGlzIGl0cyBjb250ZW50IGFzXG4gIC8vIGEgZG9jdW1lbnRGcmFnbWVudCAoZm9yIGJsb2NrIGluc3RhbmNlcylcbiAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScpIHtcbiAgICBlbCA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKGVsKVxuICB9XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICBlbCA9IHRyYW5zY2x1ZGVUZW1wbGF0ZShlbCwgb3B0aW9ucylcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgXy5wcmVwZW5kKGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3Ytc3RhcnQnKSwgZWwpXG4gICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1lbmQnKSlcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24uXG4gKiBJZiB0aGUgcmVwbGFjZSBvcHRpb24gaXMgdHJ1ZSB0aGlzIHdpbGwgc3dhcCB0aGUgJGVsLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZVRlbXBsYXRlIChlbCwgb3B0aW9ucykge1xuICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlXG4gIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRydWUpXG4gIGlmICghZnJhZykge1xuICAgIF8ud2FybignSW52YWxpZCB0ZW1wbGF0ZSBvcHRpb246ICcgKyB0ZW1wbGF0ZSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmF3Q29udGVudCA9IG9wdGlvbnMuX2NvbnRlbnQgfHwgXy5leHRyYWN0Q29udGVudChlbClcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBpZiAoZnJhZy5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gdGhpcyBpcyBhIGJsb2NrIGluc3RhbmNlIHdoaWNoIGhhcyBubyByb290IG5vZGUuXG4gICAgICAgIC8vIGhvd2V2ZXIsIHRoZSBjb250YWluZXIgaW4gdGhlIHBhcmVudCB0ZW1wbGF0ZVxuICAgICAgICAvLyAod2hpY2ggaXMgcmVwbGFjZWQgaGVyZSkgbWF5IGNvbnRhaW4gdi13aXRoIGFuZFxuICAgICAgICAvLyBwYXJhbUF0dHJpYnV0ZXMgdGhhdCBzdGlsbCBuZWVkIHRvIGJlIGNvbXBpbGVkXG4gICAgICAgIC8vIGZvciB0aGUgY2hpbGQuIHdlIHN0b3JlIGFsbCB0aGUgY29udGFpbmVyXG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgb24gdGhlIG9wdGlvbnMgb2JqZWN0IGFuZCBwYXNzIGl0IGRvd25cbiAgICAgICAgLy8gdG8gdGhlIGNvbXBpbGVyLlxuICAgICAgICB2YXIgY29udGFpbmVyQXR0cnMgPSBvcHRpb25zLl9jb250YWluZXJBdHRycyA9IHt9XG4gICAgICAgIHZhciBpID0gZWwuYXR0cmlidXRlcy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIHZhciBhdHRyID0gZWwuYXR0cmlidXRlc1tpXVxuICAgICAgICAgIGNvbnRhaW5lckF0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgdHJhbnNjbHVkZUNvbnRlbnQoZnJhZywgcmF3Q29udGVudClcbiAgICAgICAgcmV0dXJuIGZyYWdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXBsYWNlciA9IGZyYWcuZmlyc3RDaGlsZFxuICAgICAgICBfLmNvcHlBdHRyaWJ1dGVzKGVsLCByZXBsYWNlcilcbiAgICAgICAgdHJhbnNjbHVkZUNvbnRlbnQocmVwbGFjZXIsIHJhd0NvbnRlbnQpXG4gICAgICAgIHJldHVybiByZXBsYWNlclxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZChmcmFnKVxuICAgICAgdHJhbnNjbHVkZUNvbnRlbnQoZWwsIHJhd0NvbnRlbnQpXG4gICAgICByZXR1cm4gZWxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZXNvbHZlIDxjb250ZW50PiBpbnNlcnRpb24gcG9pbnRzIG1pbWlja2luZyB0aGUgYmVoYXZpb3JcbiAqIG9mIHRoZSBTaGFkb3cgRE9NIHNwZWM6XG4gKlxuICogICBodHRwOi8vdzNjLmdpdGh1Yi5pby93ZWJjb21wb25lbnRzL3NwZWMvc2hhZG93LyNpbnNlcnRpb24tcG9pbnRzXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHJhd1xuICovXG5cbmZ1bmN0aW9uIHRyYW5zY2x1ZGVDb250ZW50IChlbCwgcmF3KSB7XG4gIHZhciBvdXRsZXRzID0gZ2V0T3V0bGV0cyhlbClcbiAgdmFyIGkgPSBvdXRsZXRzLmxlbmd0aFxuICBpZiAoIWkpIHJldHVyblxuICB2YXIgb3V0bGV0LCBzZWxlY3QsIHNlbGVjdGVkLCBqLCBtYWluXG5cbiAgZnVuY3Rpb24gaXNEaXJlY3RDaGlsZCAobm9kZSkge1xuICAgIHJldHVybiBub2RlLnBhcmVudE5vZGUgPT09IHJhd1xuICB9XG5cbiAgLy8gZmlyc3QgcGFzcywgY29sbGVjdCBjb3JyZXNwb25kaW5nIGNvbnRlbnRcbiAgLy8gZm9yIGVhY2ggb3V0bGV0LlxuICB3aGlsZSAoaS0tKSB7XG4gICAgb3V0bGV0ID0gb3V0bGV0c1tpXVxuICAgIGlmIChyYXcpIHtcbiAgICAgIHNlbGVjdCA9IG91dGxldC5nZXRBdHRyaWJ1dGUoJ3NlbGVjdCcpXG4gICAgICBpZiAoc2VsZWN0KSB7ICAvLyBzZWxlY3QgY29udGVudFxuICAgICAgICBzZWxlY3RlZCA9IHJhdy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdClcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCkge1xuICAgICAgICAgIC8vIGFjY29yZGluZyB0byBTaGFkb3cgRE9NIHNwZWMsIGBzZWxlY3RgIGNhblxuICAgICAgICAgIC8vIG9ubHkgc2VsZWN0IGRpcmVjdCBjaGlsZHJlbiBvZiB0aGUgaG9zdCBub2RlLlxuICAgICAgICAgIC8vIGVuZm9yY2luZyB0aGlzIGFsc28gZml4ZXMgIzc4Ni5cbiAgICAgICAgICBzZWxlY3RlZCA9IFtdLmZpbHRlci5jYWxsKHNlbGVjdGVkLCBpc0RpcmVjdENoaWxkKVxuICAgICAgICB9XG4gICAgICAgIG91dGxldC5jb250ZW50ID0gc2VsZWN0ZWQubGVuZ3RoXG4gICAgICAgICAgPyBzZWxlY3RlZFxuICAgICAgICAgIDogXy50b0FycmF5KG91dGxldC5jaGlsZE5vZGVzKVxuICAgICAgfSBlbHNlIHsgLy8gZGVmYXVsdCBjb250ZW50XG4gICAgICAgIG1haW4gPSBvdXRsZXRcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBmYWxsYmFjayBjb250ZW50XG4gICAgICBvdXRsZXQuY29udGVudCA9IF8udG9BcnJheShvdXRsZXQuY2hpbGROb2RlcylcbiAgICB9XG4gIH1cbiAgLy8gc2Vjb25kIHBhc3MsIGFjdHVhbGx5IGluc2VydCB0aGUgY29udGVudHNcbiAgZm9yIChpID0gMCwgaiA9IG91dGxldHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgb3V0bGV0ID0gb3V0bGV0c1tpXVxuICAgIGlmIChvdXRsZXQgIT09IG1haW4pIHtcbiAgICAgIGluc2VydENvbnRlbnRBdChvdXRsZXQsIG91dGxldC5jb250ZW50KVxuICAgIH1cbiAgfVxuICAvLyBmaW5hbGx5IGluc2VydCB0aGUgbWFpbiBjb250ZW50XG4gIGlmIChtYWluKSB7XG4gICAgaW5zZXJ0Q29udGVudEF0KG1haW4sIF8udG9BcnJheShyYXcuY2hpbGROb2RlcykpXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgPGNvbnRlbnQ+IG91dGxldHMgZnJvbSB0aGUgZWxlbWVudC9saXN0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fEFycmF5fSBlbFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxudmFyIGNvbmNhdCA9IFtdLmNvbmNhdFxuZnVuY3Rpb24gZ2V0T3V0bGV0cyAoZWwpIHtcbiAgcmV0dXJuIF8uaXNBcnJheShlbClcbiAgICA/IGNvbmNhdC5hcHBseShbXSwgZWwubWFwKGdldE91dGxldHMpKVxuICAgIDogZWwucXVlcnlTZWxlY3RvckFsbFxuICAgICAgPyBfLnRvQXJyYXkoZWwucXVlcnlTZWxlY3RvckFsbCgnY29udGVudCcpKVxuICAgICAgOiBbXVxufVxuXG4vKipcbiAqIEluc2VydCBhbiBhcnJheSBvZiBub2RlcyBhdCBvdXRsZXQsXG4gKiB0aGVuIHJlbW92ZSB0aGUgb3V0bGV0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gb3V0bGV0XG4gKiBAcGFyYW0ge0FycmF5fSBjb250ZW50c1xuICovXG5cbmZ1bmN0aW9uIGluc2VydENvbnRlbnRBdCAob3V0bGV0LCBjb250ZW50cykge1xuICAvLyBub3QgdXNpbmcgdXRpbCBET00gbWV0aG9kcyBoZXJlIGJlY2F1c2VcbiAgLy8gcGFyZW50Tm9kZSBjYW4gYmUgY2FjaGVkXG4gIHZhciBwYXJlbnQgPSBvdXRsZXQucGFyZW50Tm9kZVxuICBmb3IgKHZhciBpID0gMCwgaiA9IGNvbnRlbnRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoY29udGVudHNbaV0sIG91dGxldClcbiAgfVxuICBwYXJlbnQucmVtb3ZlQ2hpbGQob3V0bGV0KVxufVxuXG4vKipcbiAqIEhlbHBlciB0byBleHRyYWN0IGEgY29tcG9uZW50IGNvbnRhaW5lcidzIGF0dHJpYnV0ZSBuYW1lc1xuICogaW50byBhIG1hcCwgYW5kIGZpbHRlcmluZyBvdXQgYHYtd2l0aGAgaW4gdGhlIHByb2Nlc3MuXG4gKiBUaGUgcmVzdWx0aW5nIG1hcCB3aWxsIGJlIHVzZWQgaW4gY29tcGlsZXIvY29tcGlsZSB0b1xuICogZGV0ZXJtaW5lIHdoZXRoZXIgYW4gYXR0cmlidXRlIGlzIHRyYW5zY2x1ZGVkLlxuICpcbiAqIEBwYXJhbSB7TmFtZU5vZGVNYXB9IGF0dHJzXG4gKi9cblxuZnVuY3Rpb24gZXh0cmFjdEF0dHJzIChhdHRycykge1xuICBpZiAoIWF0dHJzKSByZXR1cm4gbnVsbFxuICB2YXIgcmVzID0ge31cbiAgdmFyIHZ3aXRoID0gY29uZmlnLnByZWZpeCArICd3aXRoJ1xuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdmFyIG5hbWUgPSBhdHRyc1tpXS5uYW1lXG4gICAgaWYgKG5hbWUgIT09IHZ3aXRoKSByZXNbbmFtZV0gPSB0cnVlXG4gIH1cbiAgcmV0dXJuIHJlc1xufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZml4IHRvIGxvb2sgZm9yIHdoZW4gcGFyc2luZyBkaXJlY3RpdmVzLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cblxuICBwcmVmaXg6ICd2LScsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcHJpbnQgZGVidWcgbWVzc2FnZXMuXG4gICAqIEFsc28gZW5hYmxlcyBzdGFjayB0cmFjZSBmb3Igd2FybmluZ3MuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBkZWJ1ZzogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gc3VwcHJlc3Mgd2FybmluZ3MuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBzaWxlbnQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGFsbG93IG9ic2VydmVyIHRvIGFsdGVyIGRhdGEgb2JqZWN0cydcbiAgICogX19wcm90b19fLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgcHJvdG86IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcGFyc2UgbXVzdGFjaGUgdGFncyBpbiB0ZW1wbGF0ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBpbnRlcnBvbGF0ZTogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byB1c2UgYXN5bmMgcmVuZGVyaW5nLlxuICAgKi9cblxuICBhc3luYzogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byB3YXJuIGFnYWluc3QgZXJyb3JzIGNhdWdodCB3aGVuIGV2YWx1YXRpbmdcbiAgICogZXhwcmVzc2lvbnMuXG4gICAqL1xuXG4gIHdhcm5FeHByZXNzaW9uRXJyb3JzOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBmbGFnIHRvIGluZGljYXRlIHRoZSBkZWxpbWl0ZXJzIGhhdmUgYmVlblxuICAgKiBjaGFuZ2VkLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgX2RlbGltaXRlcnNDaGFuZ2VkOiB0cnVlXG5cbn1cblxuLyoqXG4gKiBJbnRlcnBvbGF0aW9uIGRlbGltaXRlcnMuXG4gKiBXZSBuZWVkIHRvIG1hcmsgdGhlIGNoYW5nZWQgZmxhZyBzbyB0aGF0IHRoZSB0ZXh0IHBhcnNlclxuICoga25vd3MgaXQgbmVlZHMgdG8gcmVjb21waWxlIHRoZSByZWdleC5cbiAqXG4gKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAqL1xuXG52YXIgZGVsaW1pdGVycyA9IFsne3snLCAnfX0nXVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnZGVsaW1pdGVycycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGRlbGltaXRlcnNcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgZGVsaW1pdGVycyA9IHZhbFxuICAgIHRoaXMuX2RlbGltaXRlcnNDaGFuZ2VkID0gdHJ1ZVxuICB9XG59KSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4vd2F0Y2hlcicpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy90ZXh0JylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvZXhwcmVzc2lvbicpXG5cbi8qKlxuICogQSBkaXJlY3RpdmUgbGlua3MgYSBET00gZWxlbWVudCB3aXRoIGEgcGllY2Ugb2YgZGF0YSxcbiAqIHdoaWNoIGlzIHRoZSByZXN1bHQgb2YgZXZhbHVhdGluZyBhbiBleHByZXNzaW9uLlxuICogSXQgcmVnaXN0ZXJzIGEgd2F0Y2hlciB3aXRoIHRoZSBleHByZXNzaW9uIGFuZCBjYWxsc1xuICogdGhlIERPTSB1cGRhdGUgZnVuY3Rpb24gd2hlbiBhIGNoYW5nZSBpcyB0cmlnZ2VyZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3JcbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IFthcmddXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXk8T2JqZWN0Pn0gW2ZpbHRlcnNdXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmIC0gZGlyZWN0aXZlIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZXx1bmRlZmluZWR9IGhvc3QgLSB0cmFuc2NsdXNpb24gaG9zdCB0YXJnZXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERpcmVjdGl2ZSAobmFtZSwgZWwsIHZtLCBkZXNjcmlwdG9yLCBkZWYsIGhvc3QpIHtcbiAgLy8gcHVibGljXG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5lbCA9IGVsXG4gIHRoaXMudm0gPSB2bVxuICAvLyBjb3B5IGRlc2NyaXB0b3IgcHJvcHNcbiAgdGhpcy5yYXcgPSBkZXNjcmlwdG9yLnJhd1xuICB0aGlzLmV4cHJlc3Npb24gPSBkZXNjcmlwdG9yLmV4cHJlc3Npb25cbiAgdGhpcy5hcmcgPSBkZXNjcmlwdG9yLmFyZ1xuICB0aGlzLmZpbHRlcnMgPSBfLnJlc29sdmVGaWx0ZXJzKHZtLCBkZXNjcmlwdG9yLmZpbHRlcnMpXG4gIC8vIHByaXZhdGVcbiAgdGhpcy5faG9zdCA9IGhvc3RcbiAgdGhpcy5fbG9ja2VkID0gZmFsc2VcbiAgdGhpcy5fYm91bmQgPSBmYWxzZVxuICAvLyBpbml0XG4gIHRoaXMuX2JpbmQoZGVmKVxufVxuXG52YXIgcCA9IERpcmVjdGl2ZS5wcm90b3R5cGVcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkaXJlY3RpdmUsIG1peGluIGRlZmluaXRpb24gcHJvcGVydGllcyxcbiAqIHNldHVwIHRoZSB3YXRjaGVyLCBjYWxsIGRlZmluaXRpb24gYmluZCgpIGFuZCB1cGRhdGUoKVxuICogaWYgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmXG4gKi9cblxucC5fYmluZCA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKHRoaXMubmFtZSAhPT0gJ2Nsb2FrJyAmJiB0aGlzLmVsICYmIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArIHRoaXMubmFtZSlcbiAgfVxuICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMudXBkYXRlID0gZGVmXG4gIH0gZWxzZSB7XG4gICAgXy5leHRlbmQodGhpcywgZGVmKVxuICB9XG4gIHRoaXMuX3dhdGNoZXJFeHAgPSB0aGlzLmV4cHJlc3Npb25cbiAgdGhpcy5fY2hlY2tEeW5hbWljTGl0ZXJhbCgpXG4gIGlmICh0aGlzLmJpbmQpIHtcbiAgICB0aGlzLmJpbmQoKVxuICB9XG4gIGlmICh0aGlzLl93YXRjaGVyRXhwICYmXG4gICAgICAodGhpcy51cGRhdGUgfHwgdGhpcy50d29XYXkpICYmXG4gICAgICAoIXRoaXMuaXNMaXRlcmFsIHx8IHRoaXMuX2lzRHluYW1pY0xpdGVyYWwpICYmXG4gICAgICAhdGhpcy5fY2hlY2tTdGF0ZW1lbnQoKSkge1xuICAgIC8vIHdyYXBwZWQgdXBkYXRlciBmb3IgY29udGV4dFxuICAgIHZhciBkaXIgPSB0aGlzXG4gICAgdmFyIHVwZGF0ZSA9IHRoaXMuX3VwZGF0ZSA9IHRoaXMudXBkYXRlXG4gICAgICA/IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmICghZGlyLl9sb2NrZWQpIHtcbiAgICAgICAgICAgIGRpci51cGRhdGUodmFsLCBvbGRWYWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICgpIHt9IC8vIG5vb3AgaWYgbm8gdXBkYXRlIGlzIHByb3ZpZGVkXG4gICAgLy8gdXNlIHJhdyBleHByZXNzaW9uIGFzIGlkZW50aWZpZXIgYmVjYXVzZSBmaWx0ZXJzXG4gICAgLy8gbWFrZSB0aGVtIGRpZmZlcmVudCB3YXRjaGVyc1xuICAgIHZhciB3YXRjaGVyID0gdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddXG4gICAgLy8gdi1yZXBlYXQgYWx3YXlzIGNyZWF0ZXMgYSBuZXcgd2F0Y2hlciBiZWNhdXNlIGl0IGhhc1xuICAgIC8vIGEgc3BlY2lhbCBmaWx0ZXIgdGhhdCdzIGJvdW5kIHRvIGl0cyBkaXJlY3RpdmVcbiAgICAvLyBpbnN0YW5jZS5cbiAgICBpZiAoIXdhdGNoZXIgfHwgdGhpcy5uYW1lID09PSAncmVwZWF0Jykge1xuICAgICAgd2F0Y2hlciA9IHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XSA9IG5ldyBXYXRjaGVyKFxuICAgICAgICB0aGlzLnZtLFxuICAgICAgICB0aGlzLl93YXRjaGVyRXhwLFxuICAgICAgICB1cGRhdGUsIC8vIGNhbGxiYWNrXG4gICAgICAgIHtcbiAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgdHdvV2F5OiB0aGlzLnR3b1dheSxcbiAgICAgICAgICBkZWVwOiB0aGlzLmRlZXBcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3YXRjaGVyLmFkZENiKHVwZGF0ZSlcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hlciA9IHdhdGNoZXJcbiAgICBpZiAodGhpcy5faW5pdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHdhdGNoZXIuc2V0KHRoaXMuX2luaXRWYWx1ZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMudXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh3YXRjaGVyLnZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLl9ib3VuZCA9IHRydWVcbn1cblxuLyoqXG4gKiBjaGVjayBpZiB0aGlzIGlzIGEgZHluYW1pYyBsaXRlcmFsIGJpbmRpbmcuXG4gKlxuICogZS5nLiB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gKi9cblxucC5fY2hlY2tEeW5hbWljTGl0ZXJhbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25cbiAgaWYgKGV4cHJlc3Npb24gJiYgdGhpcy5pc0xpdGVyYWwpIHtcbiAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShleHByZXNzaW9uKVxuICAgIGlmICh0b2tlbnMpIHtcbiAgICAgIHZhciBleHAgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2VucylcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMudm0uJGdldChleHApXG4gICAgICB0aGlzLl93YXRjaGVyRXhwID0gZXhwXG4gICAgICB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkaXJlY3RpdmUgaXMgYSBmdW5jdGlvbiBjYWxsZXJcbiAqIGFuZCBpZiB0aGUgZXhwcmVzc2lvbiBpcyBhIGNhbGxhYmxlIG9uZS4gSWYgYm90aCB0cnVlLFxuICogd2Ugd3JhcCB1cCB0aGUgZXhwcmVzc2lvbiBhbmQgdXNlIGl0IGFzIHRoZSBldmVudFxuICogaGFuZGxlci5cbiAqXG4gKiBlLmcuIHYtb249XCJjbGljazogYSsrXCJcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnAuX2NoZWNrU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcmVzc2lvblxuICBpZiAoXG4gICAgZXhwcmVzc2lvbiAmJiB0aGlzLmFjY2VwdFN0YXRlbWVudCAmJlxuICAgICFleHBQYXJzZXIucGF0aFRlc3RSRS50ZXN0KGV4cHJlc3Npb24pXG4gICkge1xuICAgIHZhciBmbiA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uKS5nZXRcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5jYWxsKHZtLCB2bSlcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgaGFuZGxlciA9IF8uYXBwbHlGaWx0ZXJzKFxuICAgICAgICBoYW5kbGVyLFxuICAgICAgICB0aGlzLmZpbHRlcnMucmVhZCxcbiAgICAgICAgdm1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoaGFuZGxlcilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIGFuIGF0dHJpYnV0ZSBkaXJlY3RpdmUgcGFyYW0sIGUuZy4gbGF6eVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxucC5fY2hlY2tQYXJhbSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBwYXJhbSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKG5hbWUpXG4gIGlmIChwYXJhbSAhPT0gbnVsbCkge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gIH1cbiAgcmV0dXJuIHBhcmFtXG59XG5cbi8qKlxuICogVGVhcmRvd24gdGhlIHdhdGNoZXIgYW5kIGNhbGwgdW5iaW5kLlxuICovXG5cbnAuX3RlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYm91bmQpIHtcbiAgICBpZiAodGhpcy51bmJpbmQpIHtcbiAgICAgIHRoaXMudW5iaW5kKClcbiAgICB9XG4gICAgdmFyIHdhdGNoZXIgPSB0aGlzLl93YXRjaGVyXG4gICAgaWYgKHdhdGNoZXIgJiYgd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHdhdGNoZXIucmVtb3ZlQ2IodGhpcy5fdXBkYXRlKVxuICAgICAgaWYgKCF3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd10gPSBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2JvdW5kID0gZmFsc2VcbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuX3dhdGNoZXIgPSBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGluIHR3by13YXkgZGlyZWN0aXZlc1xuICogZS5nLiB2LW1vZGVsLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9jayAtIHByZXZlbnQgd3J0aWUgdHJpZ2dlcmluZyB1cGRhdGUuXG4gKiBAcHVibGljXG4gKi9cblxucC5zZXQgPSBmdW5jdGlvbiAodmFsdWUsIGxvY2spIHtcbiAgaWYgKHRoaXMudHdvV2F5KSB7XG4gICAgaWYgKGxvY2spIHtcbiAgICAgIHRoaXMuX2xvY2tlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hlci5zZXQodmFsdWUpXG4gICAgaWYgKGxvY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgXy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2xvY2tlZCA9IGZhbHNlXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZSIsIi8vIHhsaW5rXG52YXIgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xudmFyIHhsaW5rUkUgPSAvXnhsaW5rOi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDg1MCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5hbWUgPSB0aGlzLmFyZ1xuICAgIHRoaXMudXBkYXRlID0geGxpbmtSRS50ZXN0KG5hbWUpXG4gICAgICA/IHhsaW5rSGFuZGxlclxuICAgICAgOiBkZWZhdWx0SGFuZGxlclxuICB9XG5cbn1cblxuZnVuY3Rpb24gZGVmYXVsdEhhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKHRoaXMuYXJnLCB2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmFyZylcbiAgfVxufVxuXG5mdW5jdGlvbiB4bGlua0hhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCB0aGlzLmFyZywgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua05TLCAnaHJlZicpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFkZENsYXNzID0gXy5hZGRDbGFzc1xudmFyIHJlbW92ZUNsYXNzID0gXy5yZW1vdmVDbGFzc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodGhpcy5hcmcpIHtcbiAgICB2YXIgbWV0aG9kID0gdmFsdWUgPyBhZGRDbGFzcyA6IHJlbW92ZUNsYXNzXG4gICAgbWV0aG9kKHRoaXMuZWwsIHRoaXMuYXJnKVxuICB9IGVsc2Uge1xuICAgIGlmICh0aGlzLmxhc3RWYWwpIHtcbiAgICAgIHJlbW92ZUNsYXNzKHRoaXMuZWwsIHRoaXMubGFzdFZhbClcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBhZGRDbGFzcyh0aGlzLmVsLCB2YWx1ZSlcbiAgICAgIHRoaXMubGFzdFZhbCA9IHZhbHVlXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy52bS4kb25jZSgnaG9vazpjb21waWxlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ2Nsb2FrJylcbiAgICB9KVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAvKipcbiAgICogU2V0dXAuIFR3byBwb3NzaWJsZSB1c2FnZXM6XG4gICAqXG4gICAqIC0gc3RhdGljOlxuICAgKiAgIHYtY29tcG9uZW50PVwiY29tcFwiXG4gICAqXG4gICAqIC0gZHluYW1pYzpcbiAgICogICB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwuX192dWVfXykge1xuICAgICAgLy8gY3JlYXRlIGEgcmVmIGFuY2hvclxuICAgICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWNvbXBvbmVudCcpXG4gICAgICBfLnJlcGxhY2UodGhpcy5lbCwgdGhpcy5yZWYpXG4gICAgICAvLyBjaGVjayBrZWVwLWFsaXZlIG9wdGlvbnMuXG4gICAgICAvLyBJZiB5ZXMsIGluc3RlYWQgb2YgZGVzdHJveWluZyB0aGUgYWN0aXZlIHZtIHdoZW5cbiAgICAgIC8vIGhpZGluZyAodi1pZikgb3Igc3dpdGNoaW5nIChkeW5hbWljIGxpdGVyYWwpIGl0LFxuICAgICAgLy8gd2Ugc2ltcGx5IHJlbW92ZSBpdCBmcm9tIHRoZSBET00gYW5kIHNhdmUgaXQgaW4gYVxuICAgICAgLy8gY2FjaGUgb2JqZWN0LCB3aXRoIGl0cyBjb25zdHJ1Y3RvciBpZCBhcyB0aGUga2V5LlxuICAgICAgdGhpcy5rZWVwQWxpdmUgPSB0aGlzLl9jaGVja1BhcmFtKCdrZWVwLWFsaXZlJykgIT0gbnVsbFxuICAgICAgLy8gY2hlY2sgcmVmXG4gICAgICB0aGlzLnJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSB7fVxuICAgICAgfVxuICAgICAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlXG4gICAgICBpZiAodGhpcy5fY2hlY2tQYXJhbSgnaW5saW5lLXRlbXBsYXRlJykgIT09IG51bGwpIHtcbiAgICAgICAgLy8gZXh0cmFjdCBpbmxpbmUgdGVtcGxhdGUgYXMgYSBEb2N1bWVudEZyYWdtZW50XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLmV4dHJhY3RDb250ZW50KHRoaXMuZWwsIHRydWUpXG4gICAgICB9XG4gICAgICAvLyBpZiBzdGF0aWMsIGJ1aWxkIHJpZ2h0IG5vdy5cbiAgICAgIGlmICghdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkge1xuICAgICAgICB0aGlzLnJlc29sdmVDdG9yKHRoaXMuZXhwcmVzc2lvbilcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5idWlsZCgpXG4gICAgICAgIGNoaWxkLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudChjaGlsZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNoZWNrIGR5bmFtaWMgY29tcG9uZW50IHBhcmFtc1xuICAgICAgICB0aGlzLnJlYWR5RXZlbnQgPSB0aGlzLl9jaGVja1BhcmFtKCd3YWl0LWZvcicpXG4gICAgICAgIHRoaXMudHJhbnNNb2RlID0gdGhpcy5fY2hlY2tQYXJhbSgndHJhbnNpdGlvbi1tb2RlJylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi1jb21wb25lbnQ9XCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGNhbm5vdCBiZSAnICtcbiAgICAgICAgJ3VzZWQgb24gYW4gYWxyZWFkeSBtb3VudGVkIGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgdGhlIGNvbXBvbmVudCBjb25zdHJ1Y3RvciB0byB1c2Ugd2hlbiBjcmVhdGluZ1xuICAgKiB0aGUgY2hpbGQgdm0uXG4gICAqL1xuXG4gIHJlc29sdmVDdG9yOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB0aGlzLmN0b3JJZCA9IGlkXG4gICAgdGhpcy5DdG9yID0gdGhpcy52bS4kb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIF8uYXNzZXJ0QXNzZXQodGhpcy5DdG9yLCAnY29tcG9uZW50JywgaWQpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlL2luc2VydCBhIG5ldyBjaGlsZCB2bS5cbiAgICogSWYga2VlcCBhbGl2ZSBhbmQgaGFzIGNhY2hlZCBpbnN0YW5jZSwgaW5zZXJ0IHRoYXRcbiAgICogaW5zdGFuY2U7IG90aGVyd2lzZSBidWlsZCBhIG5ldyBvbmUgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtWdWV9IC0gdGhlIGNyZWF0ZWQgaW5zdGFuY2VcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXVxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVkXG4gICAgICB9XG4gICAgfVxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgZWwgPSB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLmVsKVxuICAgIGlmICh0aGlzLkN0b3IpIHtcbiAgICAgIHZhciBjaGlsZCA9IHZtLiRhZGRDaGlsZCh7XG4gICAgICAgIGVsOiBlbCxcbiAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsXG4gICAgICAgIF9hc0NvbXBvbmVudDogdHJ1ZSxcbiAgICAgICAgX2hvc3Q6IHRoaXMuX2hvc3RcbiAgICAgIH0sIHRoaXMuQ3RvcilcbiAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXSA9IGNoaWxkXG4gICAgICB9XG4gICAgICByZXR1cm4gY2hpbGRcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRlYXJkb3duIHRoZSBjdXJyZW50IGNoaWxkLCBidXQgZGVmZXJzIGNsZWFudXAgc29cbiAgICogdGhhdCB3ZSBjYW4gc2VwYXJhdGUgdGhlIGRlc3Ryb3kgYW5kIHJlbW92YWwgc3RlcHMuXG4gICAqL1xuXG4gIHVuYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkVk1cbiAgICBpZiAoIWNoaWxkIHx8IHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gdGhlIHNvbGUgcHVycG9zZSBvZiBgZGVmZXJDbGVhbnVwYCBpcyBzbyB0aGF0IHdlIGNhblxuICAgIC8vIFwiZGVhY3RpdmF0ZVwiIHRoZSB2bSByaWdodCBub3cgYW5kIHBlcmZvcm0gRE9NIHJlbW92YWxcbiAgICAvLyBsYXRlci5cbiAgICBjaGlsZC4kZGVzdHJveShmYWxzZSwgdHJ1ZSlcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGN1cnJlbnQgZGVzdHJveWVkIGNoaWxkIGFuZCBtYW51YWxseSBkb1xuICAgKiB0aGUgY2xlYW51cCBhZnRlciByZW1vdmFsLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgKi9cblxuICByZW1vdmU6IGZ1bmN0aW9uIChjaGlsZCwgY2IpIHtcbiAgICB2YXIga2VlcEFsaXZlID0gdGhpcy5rZWVwQWxpdmVcbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGNoaWxkLiRyZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWtlZXBBbGl2ZSkgY2hpbGQuX2NsZWFudXAoKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgY2IoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIGNhbGxiYWNrIGZvciB0aGUgZHluYW1pYyBsaXRlcmFsIHNjZW5hcmlvLFxuICAgKiBlLmcuIHYtY29tcG9uZW50PVwie3t2aWV3fX1cIlxuICAgKi9cblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIC8vIGp1c3QgZGVzdHJveSBhbmQgcmVtb3ZlIGN1cnJlbnRcbiAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICB0aGlzLnJlbW92ZSh0aGlzLmNoaWxkVk0pXG4gICAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzb2x2ZUN0b3IodmFsdWUpXG4gICAgICB0aGlzLnVuYnVpbGQoKVxuICAgICAgdmFyIG5ld0NvbXBvbmVudCA9IHRoaXMuYnVpbGQoKVxuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBpZiAodGhpcy5yZWFkeUV2ZW50KSB7XG4gICAgICAgIG5ld0NvbXBvbmVudC4kb25jZSh0aGlzLnJlYWR5RXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnN3YXBUbyhuZXdDb21wb25lbnQpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN3YXBUbyhuZXdDb21wb25lbnQpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBY3R1YWxseSBzd2FwIHRoZSBjb21wb25lbnRzLCBkZXBlbmRpbmcgb24gdGhlXG4gICAqIHRyYW5zaXRpb24gbW9kZS4gRGVmYXVsdHMgdG8gc2ltdWx0YW5lb3VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdGFyZ2V0XG4gICAqL1xuXG4gIHN3YXBUbzogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5jaGlsZFZNXG4gICAgdGhpcy51bnNldEN1cnJlbnQoKVxuICAgIHRoaXMuc2V0Q3VycmVudCh0YXJnZXQpXG4gICAgc3dpdGNoIChzZWxmLnRyYW5zTW9kZSkge1xuICAgICAgY2FzZSAnaW4tb3V0JzpcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50KVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnb3V0LWluJzpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRhcmdldC4kYmVmb3JlKHNlbGYucmVmKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudClcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgY2hpbGRWTSBhbmQgcGFyZW50IHJlZlxuICAgKi9cbiAgXG4gIHNldEN1cnJlbnQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRWTSA9IGNoaWxkXG4gICAgdmFyIHJlZklEID0gY2hpbGQuX3JlZklEIHx8IHRoaXMucmVmSURcbiAgICBpZiAocmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFtyZWZJRF0gPSBjaGlsZFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVW5zZXQgY2hpbGRWTSBhbmQgcGFyZW50IHJlZlxuICAgKi9cblxuICB1bnNldEN1cnJlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkVk1cbiAgICB0aGlzLmNoaWxkVk0gPSBudWxsXG4gICAgdmFyIHJlZklEID0gKGNoaWxkICYmIGNoaWxkLl9yZWZJRCkgfHwgdGhpcy5yZWZJRFxuICAgIGlmIChyZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3JlZklEXSA9IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuYmluZC5cbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy51bmJ1aWxkKClcbiAgICAvLyBkZXN0cm95IGFsbCBrZWVwLWFsaXZlIGNhY2hlZCBpbnN0YW5jZXNcbiAgICBpZiAodGhpcy5jYWNoZSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuY2FjaGUpIHtcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldLiRkZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGUgPSBudWxsXG4gICAgfVxuICB9XG5cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudm0uJCRbdGhpcy5leHByZXNzaW9uXSA9IHRoaXMuZWxcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBkZWxldGUgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dXG4gIH1cbiAgXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYWNjZXB0U3RhdGVtZW50OiB0cnVlLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmVsLl9fdnVlX19cbiAgICBpZiAoIWNoaWxkIHx8IHRoaXMudm0gIT09IGNoaWxkLiRwYXJlbnQpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ2B2LWV2ZW50c2Agc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBhIGNoaWxkIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2Zyb20gdGhlIHBhcmVudCB0ZW1wbGF0ZS4nXG4gICAgICApXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlciwgb2xkSGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRGlyZWN0aXZlIFwidi1ldmVudHM6JyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiAnICtcbiAgICAgICAgJ2V4cGVjdHMgYSBmdW5jdGlvbiB2YWx1ZS4nXG4gICAgICApXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGNoaWxkID0gdGhpcy5lbC5fX3Z1ZV9fXG4gICAgaWYgKG9sZEhhbmRsZXIpIHtcbiAgICAgIGNoaWxkLiRvZmYodGhpcy5hcmcsIG9sZEhhbmRsZXIpXG4gICAgfVxuICAgIGNoaWxkLiRvbih0aGlzLmFyZywgaGFuZGxlcilcbiAgfVxuXG4gIC8vIHdoZW4gY2hpbGQgaXMgZGVzdHJveWVkLCBhbGwgZXZlbnRzIGFyZSB0dXJuZWQgb2ZmLFxuICAvLyBzbyBubyBuZWVkIGZvciB1bmJpbmQgaGVyZS5cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGEgY29tbWVudCBub2RlIG1lYW5zIHRoaXMgaXMgYSBiaW5kaW5nIGZvclxuICAgIC8vIHt7eyBpbmxpbmUgdW5lc2NhcGVkIGh0bWwgfX19XG4gICAgaWYgKHRoaXMuZWwubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIC8vIGhvbGQgbm9kZXNcbiAgICAgIHRoaXMubm9kZXMgPSBbXVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhbHVlID0gXy50b1N0cmluZyh2YWx1ZSlcbiAgICBpZiAodGhpcy5ub2Rlcykge1xuICAgICAgdGhpcy5zd2FwKHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsLmlubmVySFRNTCA9IHZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHN3YXA6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8vIHJlbW92ZSBvbGQgbm9kZXNcbiAgICB2YXIgaSA9IHRoaXMubm9kZXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgXy5yZW1vdmUodGhpcy5ub2Rlc1tpXSlcbiAgICB9XG4gICAgLy8gY29udmVydCBuZXcgdmFsdWUgdG8gYSBmcmFnbWVudFxuICAgIC8vIGRvIG5vdCBhdHRlbXB0IHRvIHJldHJpZXZlIGZyb20gaWQgc2VsZWN0b3JcbiAgICB2YXIgZnJhZyA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKHZhbHVlLCB0cnVlLCB0cnVlKVxuICAgIC8vIHNhdmUgYSByZWZlcmVuY2UgdG8gdGhlc2Ugbm9kZXMgc28gd2UgY2FuIHJlbW92ZSBsYXRlclxuICAgIHRoaXMubm9kZXMgPSBfLnRvQXJyYXkoZnJhZy5jaGlsZE5vZGVzKVxuICAgIF8uYmVmb3JlKGZyYWcsIHRoaXMuZWwpXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG52YXIgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4uL3RyYW5zaXRpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIGlmICghZWwuX192dWVfXykge1xuICAgICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaWYtc3RhcnQnKVxuICAgICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWlmLWVuZCcpXG4gICAgICBfLnJlcGxhY2UoZWwsIHRoaXMuZW5kKVxuICAgICAgXy5iZWZvcmUodGhpcy5zdGFydCwgdGhpcy5lbmQpXG4gICAgICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJykge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVQYXJzZXIucGFyc2UoZWwsIHRydWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgIHRoaXMudGVtcGxhdGUuYXBwZW5kQ2hpbGQodGVtcGxhdGVQYXJzZXIuY2xvbmUoZWwpKVxuICAgICAgfVxuICAgICAgLy8gY29tcGlsZSB0aGUgbmVzdGVkIHBhcnRpYWxcbiAgICAgIHRoaXMubGlua2VyID0gY29tcGlsZShcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSxcbiAgICAgICAgdGhpcy52bS4kb3B0aW9ucyxcbiAgICAgICAgdHJ1ZVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmludmFsaWQgPSB0cnVlXG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LWlmPVwiJyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBjYW5ub3QgYmUgJyArXG4gICAgICAgICd1c2VkIG9uIGFuIGFscmVhZHkgbW91bnRlZCBpbnN0YW5jZS4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaW52YWxpZCkgcmV0dXJuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICAvLyBhdm9pZCBkdXBsaWNhdGUgY29tcGlsZXMsIHNpbmNlIHVwZGF0ZSgpIGNhbiBiZVxuICAgICAgLy8gY2FsbGVkIHdpdGggZGlmZmVyZW50IHRydXRoeSB2YWx1ZXNcbiAgICAgIGlmICghdGhpcy51bmxpbmspIHtcbiAgICAgICAgdmFyIGZyYWcgPSB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLnRlbXBsYXRlKVxuICAgICAgICB0aGlzLmNvbXBpbGUoZnJhZylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICBjb21waWxlOiBmdW5jdGlvbiAoZnJhZykge1xuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICAvLyB0aGUgbGlua2VyIGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIHByZXNlbnQgYmVjYXVzZVxuICAgIC8vIHRoaXMgZnVuY3Rpb24gbWlnaHQgZ2V0IGNhbGxlZCBieSB2LXBhcnRpYWwgXG4gICAgdGhpcy51bmxpbmsgPSB0aGlzLmxpbmtlclxuICAgICAgPyB0aGlzLmxpbmtlcih2bSwgZnJhZylcbiAgICAgIDogdm0uJGNvbXBpbGUoZnJhZylcbiAgICB0cmFuc2l0aW9uLmJsb2NrQXBwZW5kKGZyYWcsIHRoaXMuZW5kLCB2bSlcbiAgICAvLyBjYWxsIGF0dGFjaGVkIGZvciBhbGwgdGhlIGNoaWxkIGNvbXBvbmVudHMgY3JlYXRlZFxuICAgIC8vIGR1cmluZyB0aGUgY29tcGlsYXRpb25cbiAgICBpZiAoXy5pbkRvYyh2bS4kZWwpKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmdldENvbnRhaW5lZENvbXBvbmVudHMoKVxuICAgICAgaWYgKGNoaWxkcmVuKSBjaGlsZHJlbi5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gICAgfVxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICB0ZWFyZG93bjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy51bmxpbmspIHJldHVyblxuICAgIC8vIGNvbGxlY3QgY2hpbGRyZW4gYmVmb3JlaGFuZFxuICAgIHZhciBjaGlsZHJlblxuICAgIGlmIChfLmluRG9jKHRoaXMudm0uJGVsKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENvbnRhaW5lZENvbXBvbmVudHMoKVxuICAgIH1cbiAgICB0cmFuc2l0aW9uLmJsb2NrUmVtb3ZlKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnZtKVxuICAgIGlmIChjaGlsZHJlbikgY2hpbGRyZW4uZm9yRWFjaChjYWxsRGV0YWNoKVxuICAgIHRoaXMudW5saW5rKClcbiAgICB0aGlzLnVubGluayA9IG51bGxcbiAgfSxcblxuICAvLyBOT1RFOiB0aGlzIGZ1bmN0aW9uIGlzIHNoYXJlZCBpbiB2LXBhcnRpYWxcbiAgZ2V0Q29udGFpbmVkQ29tcG9uZW50czogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgc3RhcnQgPSB0aGlzLnN0YXJ0Lm5leHRTaWJsaW5nXG4gICAgdmFyIGVuZCA9IHRoaXMuZW5kXG4gICAgdmFyIHNlbGZDb21wb2VudHMgPVxuICAgICAgdm0uX2NoaWxkcmVuLmxlbmd0aCAmJlxuICAgICAgdm0uX2NoaWxkcmVuLmZpbHRlcihjb250YWlucylcbiAgICB2YXIgdHJhbnNDb21wb25lbnRzID1cbiAgICAgIHZtLl90cmFuc0NwbnRzICYmXG4gICAgICB2bS5fdHJhbnNDcG50cy5maWx0ZXIoY29udGFpbnMpXG5cbiAgICBmdW5jdGlvbiBjb250YWlucyAoYykge1xuICAgICAgdmFyIGN1ciA9IHN0YXJ0XG4gICAgICB2YXIgbmV4dFxuICAgICAgd2hpbGUgKG5leHQgIT09IGVuZCkge1xuICAgICAgICBuZXh0ID0gY3VyLm5leHRTaWJsaW5nXG4gICAgICAgIGlmIChjdXIuY29udGFpbnMoYy4kZWwpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgICBjdXIgPSBuZXh0XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZkNvbXBvZW50c1xuICAgICAgPyB0cmFuc0NvbXBvbmVudHNcbiAgICAgICAgPyBzZWxmQ29tcG9lbnRzLmNvbmNhdCh0cmFuc0NvbXBvbmVudHMpXG4gICAgICAgIDogc2VsZkNvbXBvZW50c1xuICAgICAgOiB0cmFuc0NvbXBvbmVudHNcbiAgfSxcblxuICAvLyBOT1RFOiB0aGlzIGZ1bmN0aW9uIGlzIHNoYXJlZCBpbiB2LXBhcnRpYWxcbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudW5saW5rKSB0aGlzLnVubGluaygpXG4gIH1cblxufVxuXG5mdW5jdGlvbiBjYWxsQXR0YWNoIChjaGlsZCkge1xuICBpZiAoIWNoaWxkLl9pc0F0dGFjaGVkKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbERldGFjaCAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLl9pc0F0dGFjaGVkKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gIH1cbn0iLCIvLyBtYW5pcHVsYXRpb24gZGlyZWN0aXZlc1xuZXhwb3J0cy50ZXh0ICAgICAgID0gcmVxdWlyZSgnLi90ZXh0JylcbmV4cG9ydHMuaHRtbCAgICAgICA9IHJlcXVpcmUoJy4vaHRtbCcpXG5leHBvcnRzLmF0dHIgICAgICAgPSByZXF1aXJlKCcuL2F0dHInKVxuZXhwb3J0cy5zaG93ICAgICAgID0gcmVxdWlyZSgnLi9zaG93JylcbmV4cG9ydHNbJ2NsYXNzJ10gICA9IHJlcXVpcmUoJy4vY2xhc3MnKVxuZXhwb3J0cy5lbCAgICAgICAgID0gcmVxdWlyZSgnLi9lbCcpXG5leHBvcnRzLnJlZiAgICAgICAgPSByZXF1aXJlKCcuL3JlZicpXG5leHBvcnRzLmNsb2FrICAgICAgPSByZXF1aXJlKCcuL2Nsb2FrJylcbmV4cG9ydHMuc3R5bGUgICAgICA9IHJlcXVpcmUoJy4vc3R5bGUnKVxuZXhwb3J0cy5wYXJ0aWFsICAgID0gcmVxdWlyZSgnLi9wYXJ0aWFsJylcbmV4cG9ydHMudHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbicpXG5cbi8vIGV2ZW50IGxpc3RlbmVyIGRpcmVjdGl2ZXNcbmV4cG9ydHMub24gICAgICAgICA9IHJlcXVpcmUoJy4vb24nKVxuZXhwb3J0cy5tb2RlbCAgICAgID0gcmVxdWlyZSgnLi9tb2RlbCcpXG5cbi8vIGNoaWxkIHZtIGRpcmVjdGl2ZXNcbmV4cG9ydHMuY29tcG9uZW50ICA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbmV4cG9ydHMucmVwZWF0ICAgICA9IHJlcXVpcmUoJy4vcmVwZWF0JylcbmV4cG9ydHNbJ2lmJ10gICAgICA9IHJlcXVpcmUoJy4vaWYnKVxuXG4vLyBjaGlsZCB2bSBjb21tdW5pY2F0aW9uIGRpcmVjdGl2ZXNcbmV4cG9ydHNbJ3dpdGgnXSAgICA9IHJlcXVpcmUoJy4vd2l0aCcpXG5leHBvcnRzLmV2ZW50cyAgICAgPSByZXF1aXJlKCcuL2V2ZW50cycpIiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoZWwuY2hlY2tlZCwgdHJ1ZSlcbiAgICB9XG4gICAgXy5vbihlbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IGVsLmNoZWNrZWRcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLmNoZWNrZWQgPSAhIXZhbHVlXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG5cbiAgICAvLyBjaGVjayBwYXJhbXNcbiAgICAvLyAtIGxhenk6IHVwZGF0ZSBtb2RlbCBvbiBcImNoYW5nZVwiIGluc3RlYWQgb2YgXCJpbnB1dFwiXG4gICAgdmFyIGxhenkgPSB0aGlzLl9jaGVja1BhcmFtKCdsYXp5JykgIT0gbnVsbFxuICAgIC8vIC0gbnVtYmVyOiBjYXN0IHZhbHVlIGludG8gbnVtYmVyIHdoZW4gdXBkYXRpbmcgbW9kZWwuXG4gICAgdmFyIG51bWJlciA9IHRoaXMuX2NoZWNrUGFyYW0oJ251bWJlcicpICE9IG51bGxcbiAgICAvLyAtIGRlYm91bmNlOiBkZWJvdW5jZSB0aGUgaW5wdXQgbGlzdGVuZXJcbiAgICB2YXIgZGVib3VuY2UgPSBwYXJzZUludCh0aGlzLl9jaGVja1BhcmFtKCdkZWJvdW5jZScpLCAxMClcblxuICAgIC8vIGhhbmRsZSBjb21wb3NpdGlvbiBldmVudHMuXG4gICAgLy8gaHR0cDovL2Jsb2cuZXZhbnlvdS5tZS8yMDE0LzAxLzAzL2NvbXBvc2l0aW9uLWV2ZW50L1xuICAgIHZhciBjcExvY2tlZCA9IGZhbHNlXG4gICAgdGhpcy5jcExvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjcExvY2tlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5jcFVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNwTG9ja2VkID0gZmFsc2VcbiAgICAgIC8vIGluIElFMTEgdGhlIFwiY29tcG9zaXRpb25lbmRcIiBldmVudCBmaXJlcyBBRlRFUlxuICAgICAgLy8gdGhlIFwiaW5wdXRcIiBldmVudCwgc28gdGhlIGlucHV0IGhhbmRsZXIgaXMgYmxvY2tlZFxuICAgICAgLy8gYXQgdGhlIGVuZC4uLiBoYXZlIHRvIGNhbGwgaXQgaGVyZS5cbiAgICAgIHNldCgpXG4gICAgfVxuICAgIF8ub24oZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9uKGVsLCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY3BVbmxvY2spXG5cbiAgICAvLyBzaGFyZWQgc2V0dGVyXG4gICAgZnVuY3Rpb24gc2V0ICgpIHtcbiAgICAgIHNlbGYuc2V0KFxuICAgICAgICBudW1iZXIgPyBfLnRvTnVtYmVyKGVsLnZhbHVlKSA6IGVsLnZhbHVlLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRpcmVjdGl2ZSBoYXMgZmlsdGVycywgd2UgbmVlZCB0b1xuICAgIC8vIHJlY29yZCBjdXJzb3IgcG9zaXRpb24gYW5kIHJlc3RvcmUgaXQgYWZ0ZXIgdXBkYXRpbmdcbiAgICAvLyB0aGUgaW5wdXQgd2l0aCB0aGUgZmlsdGVyZWQgdmFsdWUuXG4gICAgLy8gYWxzbyBmb3JjZSB1cGRhdGUgZm9yIHR5cGU9XCJyYW5nZVwiIGlucHV0cyB0byBlbmFibGVcbiAgICAvLyBcImxvY2sgaW4gcmFuZ2VcIiAoc2VlICM1MDYpXG4gICAgdmFyIGhhc1JlYWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLmxpc3RlbmVyID0gaGFzUmVhZEZpbHRlciB8fCBlbC50eXBlID09PSAncmFuZ2UnXG4gICAgICA/IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHZhciBjaGFyc09mZnNldFxuICAgICAgICAgIC8vIHNvbWUgSFRNTDUgaW5wdXQgdHlwZXMgdGhyb3cgZXJyb3IgaGVyZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyByZWNvcmQgaG93IG1hbnkgY2hhcnMgZnJvbSB0aGUgZW5kIG9mIGlucHV0XG4gICAgICAgICAgICAvLyB0aGUgY3Vyc29yIHdhcyBhdFxuICAgICAgICAgICAgY2hhcnNPZmZzZXQgPSBlbC52YWx1ZS5sZW5ndGggLSBlbC5zZWxlY3Rpb25TdGFydFxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgLy8gRml4IElFMTAvMTEgaW5maW5pdGUgdXBkYXRlIGN5Y2xlXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3l5eDk5MDgwMy92dWUvaXNzdWVzLzU5MlxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChjaGFyc09mZnNldCA8IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXQoKVxuICAgICAgICAgIF8ubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gZm9yY2UgYSB2YWx1ZSB1cGRhdGUsIGJlY2F1c2UgaW5cbiAgICAgICAgICAgIC8vIGNlcnRhaW4gY2FzZXMgdGhlIHdyaXRlIGZpbHRlcnMgb3V0cHV0IHRoZVxuICAgICAgICAgICAgLy8gc2FtZSByZXN1bHQgZm9yIGRpZmZlcmVudCBpbnB1dCB2YWx1ZXMsIGFuZFxuICAgICAgICAgICAgLy8gdGhlIE9ic2VydmVyIHNldCBldmVudHMgd29uJ3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHNlbGYuX3dhdGNoZXIudmFsdWVcbiAgICAgICAgICAgIHNlbGYudXBkYXRlKG5ld1ZhbClcbiAgICAgICAgICAgIGlmIChjaGFyc09mZnNldCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHZhciBjdXJzb3JQb3MgPVxuICAgICAgICAgICAgICAgIF8udG9TdHJpbmcobmV3VmFsKS5sZW5ndGggLSBjaGFyc09mZnNldFxuICAgICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3JQb3MsIGN1cnNvclBvcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHNldCgpXG4gICAgICAgIH1cblxuICAgIGlmIChkZWJvdW5jZSkge1xuICAgICAgdGhpcy5saXN0ZW5lciA9IF8uZGVib3VuY2UodGhpcy5saXN0ZW5lciwgZGVib3VuY2UpXG4gICAgfVxuICAgIHRoaXMuZXZlbnQgPSBsYXp5ID8gJ2NoYW5nZScgOiAnaW5wdXQnXG4gICAgLy8gU3VwcG9ydCBqUXVlcnkgZXZlbnRzLCBzaW5jZSBqUXVlcnkudHJpZ2dlcigpIGRvZXNuJ3RcbiAgICAvLyB0cmlnZ2VyIG5hdGl2ZSBldmVudHMgaW4gc29tZSBjYXNlcyBhbmQgc29tZSBwbHVnaW5zXG4gICAgLy8gcmVseSBvbiAkLnRyaWdnZXIoKVxuICAgIC8vIFxuICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIGlmIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdXNpbmdcbiAgICAvLyBqUXVlcnksIGl0IGlzIGFsc28gcmVtb3ZlZCB3aXRoIGpRdWVyeSwgdGhhdCdzIHdoeVxuICAgIC8vIHdlIGRvIHRoZSBjaGVjayBmb3IgZWFjaCBkaXJlY3RpdmUgaW5zdGFuY2UgYW5kXG4gICAgLy8gc3RvcmUgdGhhdCBjaGVjayByZXN1bHQgb24gaXRzZWxmLiBUaGlzIGFsc28gYWxsb3dzXG4gICAgLy8gZWFzaWVyIHRlc3QgY292ZXJhZ2UgY29udHJvbCBieSB1bnNldHRpbmcgdGhlIGdsb2JhbFxuICAgIC8vIGpRdWVyeSB2YXJpYWJsZSBpbiB0ZXN0cy5cbiAgICB0aGlzLmhhc2pRdWVyeSA9IHR5cGVvZiBqUXVlcnkgPT09ICdmdW5jdGlvbidcbiAgICBpZiAodGhpcy5oYXNqUXVlcnkpIHtcbiAgICAgIGpRdWVyeShlbCkub24odGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG5cbiAgICAvLyBJRTkgZG9lc24ndCBmaXJlIGlucHV0IGV2ZW50IG9uIGJhY2tzcGFjZS9kZWwvY3V0XG4gICAgaWYgKCFsYXp5ICYmIF8uaXNJRTkpIHtcbiAgICAgIHRoaXMub25DdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ubmV4dFRpY2soc2VsZi5saXN0ZW5lcilcbiAgICAgIH1cbiAgICAgIHRoaXMub25EZWwgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0NiB8fCBlLmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICBzZWxmLmxpc3RlbmVyKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXy5vbihlbCwgJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICBfLm9uKGVsLCAna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgIH1cblxuICAgIC8vIHNldCBpbml0aWFsIHZhbHVlIGlmIHByZXNlbnRcbiAgICBpZiAoXG4gICAgICBlbC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykgfHxcbiAgICAgIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnICYmIGVsLnZhbHVlLnRyaW0oKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IG51bWJlclxuICAgICAgICA/IF8udG9OdW1iZXIoZWwudmFsdWUpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLnZhbHVlID0gXy50b1N0cmluZyh2YWx1ZSlcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKHRoaXMuaGFzalF1ZXJ5KSB7XG4gICAgICBqUXVlcnkoZWwpLm9mZih0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9mZihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG4gICAgXy5vZmYoZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9mZihlbCwnY29tcG9zaXRpb25lbmQnLCB0aGlzLmNwVW5sb2NrKVxuICAgIGlmICh0aGlzLm9uQ3V0KSB7XG4gICAgICBfLm9mZihlbCwnY3V0JywgdGhpcy5vbkN1dClcbiAgICAgIF8ub2ZmKGVsLCdrZXl1cCcsIHRoaXMub25EZWwpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG52YXIgaGFuZGxlcnMgPSB7XG4gIF9kZWZhdWx0OiByZXF1aXJlKCcuL2RlZmF1bHQnKSxcbiAgcmFkaW86IHJlcXVpcmUoJy4vcmFkaW8nKSxcbiAgc2VsZWN0OiByZXF1aXJlKCcuL3NlbGVjdCcpLFxuICBjaGVja2JveDogcmVxdWlyZSgnLi9jaGVja2JveCcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiA4MDAsXG4gIHR3b1dheTogdHJ1ZSxcbiAgaGFuZGxlcnM6IGhhbmRsZXJzLFxuXG4gIC8qKlxuICAgKiBQb3NzaWJsZSBlbGVtZW50czpcbiAgICogICA8c2VsZWN0PlxuICAgKiAgIDx0ZXh0YXJlYT5cbiAgICogICA8aW5wdXQgdHlwZT1cIipcIj5cbiAgICogICAgIC0gdGV4dFxuICAgKiAgICAgLSBjaGVja2JveFxuICAgKiAgICAgLSByYWRpb1xuICAgKiAgICAgLSBudW1iZXJcbiAgICogICAgIC0gVE9ETzogbW9yZSB0eXBlcyBtYXkgYmUgc3VwcGxpZWQgYXMgYSBwbHVnaW5cbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGZyaWVuZGx5IHdhcm5pbmcuLi5cbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMucmVhZCAmJiAhZmlsdGVycy53cml0ZSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnSXQgc2VlbXMgeW91IGFyZSB1c2luZyBhIHJlYWQtb25seSBmaWx0ZXIgd2l0aCAnICtcbiAgICAgICAgJ3YtbW9kZWwuIFlvdSBtaWdodCB3YW50IHRvIHVzZSBhIHR3by13YXkgZmlsdGVyICcgK1xuICAgICAgICAndG8gZW5zdXJlIGNvcnJlY3QgYmVoYXZpb3IuJ1xuICAgICAgKVxuICAgIH1cbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdmFyIHRhZyA9IGVsLnRhZ05hbWVcbiAgICB2YXIgaGFuZGxlclxuICAgIGlmICh0YWcgPT09ICdJTlBVVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tlbC50eXBlXSB8fCBoYW5kbGVycy5fZGVmYXVsdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnU0VMRUNUJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzLnNlbGVjdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnMuX2RlZmF1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFwidi1tb2RlbCBkb2Vzbid0IHN1cHBvcnQgZWxlbWVudCB0eXBlOiBcIiArIHRhZylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVyLmJpbmQuY2FsbCh0aGlzKVxuICAgIHRoaXMudXBkYXRlID0gaGFuZGxlci51cGRhdGVcbiAgICB0aGlzLnVuYmluZCA9IGhhbmRsZXIudW5iaW5kXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2V0KGVsLnZhbHVlLCB0cnVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBpZiAoZWwuY2hlY2tlZCkge1xuICAgICAgdGhpcy5faW5pdFZhbHVlID0gZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHRoaXMuZWwuY2hlY2tlZCA9IHZhbHVlID09IHRoaXMuZWwudmFsdWVcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBfLm9mZih0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vLi4vd2F0Y2hlcicpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIC8vIGNoZWNrIG9wdGlvbnMgcGFyYW1cbiAgICB2YXIgb3B0aW9uc1BhcmFtID0gdGhpcy5fY2hlY2tQYXJhbSgnb3B0aW9ucycpXG4gICAgaWYgKG9wdGlvbnNQYXJhbSkge1xuICAgICAgaW5pdE9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zUGFyYW0pXG4gICAgfVxuICAgIHRoaXMubnVtYmVyID0gdGhpcy5fY2hlY2tQYXJhbSgnbnVtYmVyJykgIT0gbnVsbFxuICAgIHRoaXMubXVsdGlwbGUgPSBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJylcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gc2VsZi5tdWx0aXBsZVxuICAgICAgICA/IGdldE11bHRpVmFsdWUoZWwpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICAgIHZhbHVlID0gc2VsZi5udW1iZXJcbiAgICAgICAgPyBfLmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZS5tYXAoXy50b051bWJlcilcbiAgICAgICAgICA6IF8udG9OdW1iZXIodmFsdWUpXG4gICAgICAgIDogdmFsdWVcbiAgICAgIHNlbGYuc2V0KHZhbHVlLCB0cnVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBjaGVja0luaXRpYWxWYWx1ZS5jYWxsKHRoaXMpXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICB2YXIgbXVsdGkgPSB0aGlzLm11bHRpcGxlICYmIF8uaXNBcnJheSh2YWx1ZSlcbiAgICB2YXIgb3B0aW9ucyA9IGVsLm9wdGlvbnNcbiAgICB2YXIgaSA9IG9wdGlvbnMubGVuZ3RoXG4gICAgdmFyIG9wdGlvblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV1cbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IG11bHRpXG4gICAgICAgID8gaW5kZXhPZih2YWx1ZSwgb3B0aW9uLnZhbHVlKSA+IC0xXG4gICAgICAgIDogdmFsdWUgPT0gb3B0aW9uLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmICh0aGlzLm9wdGlvbldhdGNoZXIpIHtcbiAgICAgIHRoaXMub3B0aW9uV2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBvcHRpb24gbGlzdCBmcm9tIHRoZSBwYXJhbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICovXG5cbmZ1bmN0aW9uIGluaXRPcHRpb25zIChleHByZXNzaW9uKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZShleHByZXNzaW9uKVswXVxuICBmdW5jdGlvbiBvcHRpb25VcGRhdGVXYXRjaGVyICh2YWx1ZSkge1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnXG4gICAgICBidWlsZE9wdGlvbnMoc2VsZi5lbCwgdmFsdWUpXG4gICAgICBpZiAoc2VsZi5fd2F0Y2hlcikge1xuICAgICAgICBzZWxmLnVwZGF0ZShzZWxmLl93YXRjaGVyLnZhbHVlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oJ0ludmFsaWQgb3B0aW9ucyB2YWx1ZSBmb3Igdi1tb2RlbDogJyArIHZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLm9wdGlvbldhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICB0aGlzLnZtLFxuICAgIGRlc2NyaXB0b3IuZXhwcmVzc2lvbixcbiAgICBvcHRpb25VcGRhdGVXYXRjaGVyLFxuICAgIHtcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgICBmaWx0ZXJzOiBfLnJlc29sdmVGaWx0ZXJzKHRoaXMudm0sIGRlc2NyaXB0b3IuZmlsdGVycylcbiAgICB9XG4gIClcbiAgLy8gdXBkYXRlIHdpdGggaW5pdGlhbCB2YWx1ZVxuICBvcHRpb25VcGRhdGVXYXRjaGVyKHRoaXMub3B0aW9uV2F0Y2hlci52YWx1ZSlcbn1cblxuLyoqXG4gKiBCdWlsZCB1cCBvcHRpb24gZWxlbWVudHMuIElFOSBkb2Vzbid0IGNyZWF0ZSBvcHRpb25zXG4gKiB3aGVuIHNldHRpbmcgaW5uZXJIVE1MIG9uIDxzZWxlY3Q+IGVsZW1lbnRzLCBzbyB3ZSBoYXZlXG4gKiB0byB1c2UgRE9NIEFQSSBoZXJlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IC0gYSA8c2VsZWN0PiBvciBhbiA8b3B0Z3JvdXA+XG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zXG4gKi9cblxuZnVuY3Rpb24gYnVpbGRPcHRpb25zIChwYXJlbnQsIG9wdGlvbnMpIHtcbiAgdmFyIG9wLCBlbFxuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb3AgPSBvcHRpb25zW2ldXG4gICAgaWYgKCFvcC5vcHRpb25zKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gICAgICBpZiAodHlwZW9mIG9wID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbC50ZXh0ID0gZWwudmFsdWUgPSBvcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwudGV4dCA9IG9wLnRleHRcbiAgICAgICAgZWwudmFsdWUgPSBvcC52YWx1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJylcbiAgICAgIGVsLmxhYmVsID0gb3AubGFiZWxcbiAgICAgIGJ1aWxkT3B0aW9ucyhlbCwgb3Aub3B0aW9ucylcbiAgICB9XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgdGhlIGluaXRpYWwgdmFsdWUgZm9yIHNlbGVjdGVkIG9wdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gY2hlY2tJbml0aWFsVmFsdWUgKCkge1xuICB2YXIgaW5pdFZhbHVlXG4gIHZhciBvcHRpb25zID0gdGhpcy5lbC5vcHRpb25zXG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1tpXS5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIChpbml0VmFsdWUgfHwgKGluaXRWYWx1ZSA9IFtdKSlcbiAgICAgICAgICAucHVzaChvcHRpb25zW2ldLnZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdFZhbHVlID0gb3B0aW9uc1tpXS52YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGluaXRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLl9pbml0VmFsdWUgPSB0aGlzLm51bWJlclxuICAgICAgPyBfLnRvTnVtYmVyKGluaXRWYWx1ZSlcbiAgICAgIDogaW5pdFZhbHVlXG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gZXh0cmFjdCBhIHZhbHVlIGFycmF5IGZvciBzZWxlY3RbbXVsdGlwbGVdXG4gKlxuICogQHBhcmFtIHtTZWxlY3RFbGVtZW50fSBlbFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZ2V0TXVsdGlWYWx1ZSAoZWwpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgICAuY2FsbChlbC5vcHRpb25zLCBmaWx0ZXJTZWxlY3RlZClcbiAgICAubWFwKGdldE9wdGlvblZhbHVlKVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJTZWxlY3RlZCAob3ApIHtcbiAgcmV0dXJuIG9wLnNlbGVjdGVkXG59XG5cbmZ1bmN0aW9uIGdldE9wdGlvblZhbHVlIChvcCkge1xuICByZXR1cm4gb3AudmFsdWUgfHwgb3AudGV4dFxufVxuXG4vKipcbiAqIE5hdGl2ZSBBcnJheS5pbmRleE9mIHVzZXMgc3RyaWN0IGVxdWFsLCBidXQgaW4gdGhpc1xuICogY2FzZSB3ZSBuZWVkIHRvIG1hdGNoIHN0cmluZy9udW1iZXJzIHdpdGggc29mdCBlcXVhbC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZnVuY3Rpb24gaW5kZXhPZiAoYXJyLCB2YWwpIHtcbiAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgdmFyIGkgPSBhcnIubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoYXJyW2ldID09IHZhbCkgcmV0dXJuIGlcbiAgfVxuICByZXR1cm4gLTFcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBhY2NlcHRTdGF0ZW1lbnQ6IHRydWUsXG4gIHByaW9yaXR5OiA3MDAsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGRlYWwgd2l0aCBpZnJhbWVzXG4gICAgaWYgKFxuICAgICAgdGhpcy5lbC50YWdOYW1lID09PSAnSUZSQU1FJyAmJlxuICAgICAgdGhpcy5hcmcgIT09ICdsb2FkJ1xuICAgICkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLmlmcmFtZUJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ub24oc2VsZi5lbC5jb250ZW50V2luZG93LCBzZWxmLmFyZywgc2VsZi5oYW5kbGVyKVxuICAgICAgfVxuICAgICAgXy5vbih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRGlyZWN0aXZlIFwidi1vbjonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgK1xuICAgICAgICAnZXhwZWN0cyBhIGZ1bmN0aW9uIHZhbHVlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlc2V0KClcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUudGFyZ2V0Vk0gPSB2bVxuICAgICAgdm0uJGV2ZW50ID0gZVxuICAgICAgdmFyIHJlcyA9IGhhbmRsZXIoZSlcbiAgICAgIHZtLiRldmVudCA9IG51bGxcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgaWYgKHRoaXMuaWZyYW1lQmluZCkge1xuICAgICAgdGhpcy5pZnJhbWVCaW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbih0aGlzLmVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuaWZyYW1lQmluZFxuICAgICAgPyB0aGlzLmVsLmNvbnRlbnRXaW5kb3dcbiAgICAgIDogdGhpcy5lbFxuICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgIF8ub2ZmKGVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2V0KClcbiAgICBfLm9mZih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB2SWYgPSByZXF1aXJlKCcuL2lmJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIC8vIHNhbWUgbG9naWMgcmV1c2UgZnJvbSB2LWlmXG4gIGNvbXBpbGU6IHZJZi5jb21waWxlLFxuICB0ZWFyZG93bjogdklmLnRlYXJkb3duLFxuICBnZXRDb250YWluZWRDb21wb25lbnRzOiB2SWYuZ2V0Q29udGFpbmVkQ29tcG9uZW50cyxcbiAgdW5iaW5kOiB2SWYudW5iaW5kLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcGFydGlhbC1zdGFydCcpXG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXBhcnRpYWwtZW5kJylcbiAgICBpZiAoZWwubm9kZVR5cGUgIT09IDgpIHtcbiAgICAgIGVsLmlubmVySFRNTCA9ICcnXG4gICAgfVxuICAgIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnIHx8IGVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICBfLnJlcGxhY2UoZWwsIHRoaXMuZW5kKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZCh0aGlzLmVuZClcbiAgICB9XG4gICAgXy5iZWZvcmUodGhpcy5zdGFydCwgdGhpcy5lbmQpXG4gICAgaWYgKCF0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSB7XG4gICAgICB0aGlzLmluc2VydCh0aGlzLmV4cHJlc3Npb24pXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdGhpcy50ZWFyZG93bigpXG4gICAgdGhpcy5pbnNlcnQoaWQpXG4gIH0sXG5cbiAgaW5zZXJ0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGFydGlhbCA9IHRoaXMudm0uJG9wdGlvbnMucGFydGlhbHNbaWRdXG4gICAgXy5hc3NlcnRBc3NldChwYXJ0aWFsLCAncGFydGlhbCcsIGlkKVxuICAgIGlmIChwYXJ0aWFsKSB7XG4gICAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMucmVhZFxuICAgICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgICAgcGFydGlhbCA9IF8uYXBwbHlGaWx0ZXJzKHBhcnRpYWwsIGZpbHRlcnMsIHRoaXMudm0pXG4gICAgICB9XG4gICAgICB0aGlzLmNvbXBpbGUodGVtcGxhdGVQYXJzZXIucGFyc2UocGFydGlhbCwgdHJ1ZSkpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghdm0pIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtcmVmIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYSBjb21wb25lbnQgcm9vdCBlbGVtZW50LidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBJZiB3ZSBnZXQgaGVyZSwgaXQgbWVhbnMgdGhpcyBpcyBhIGB2LXJlZmAgb24gYVxuICAgIC8vIGNoaWxkLCBiZWNhdXNlIHBhcmVudCBzY29wZSBgdi1yZWZgIGlzIHN0cmlwcGVkIGluXG4gICAgLy8gYHYtY29tcG9uZW50YCBhbHJlYWR5LiBTbyB3ZSBqdXN0IHJlY29yZCBvdXIgb3duIHJlZlxuICAgIC8vIGhlcmUgLSBpdCB3aWxsIG92ZXJ3cml0ZSBwYXJlbnQgcmVmIGluIGB2LWNvbXBvbmVudGAsXG4gICAgLy8gaWYgYW55LlxuICAgIHZtLl9yZWZJRCA9IHRoaXMuZXhwcmVzc2lvblxuICB9XG4gIFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaXNPYmplY3QgPSBfLmlzT2JqZWN0XG52YXIgaXNQbGFpbk9iamVjdCA9IF8uaXNQbGFpbk9iamVjdFxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdHJhbnNjbHVkZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxudmFyIG1lcmdlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvbWVyZ2Utb3B0aW9uJylcbnZhciB1aWQgPSAwXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBTZXR1cC5cbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIHVpZCBhcyBhIGNhY2hlIGlkZW50aWZpZXJcbiAgICB0aGlzLmlkID0gJ19fdl9yZXBlYXRfJyArICgrK3VpZClcbiAgICAvLyB3ZSBuZWVkIHRvIGluc2VydCB0aGUgb2JqVG9BcnJheSBjb252ZXJ0ZXJcbiAgICAvLyBhcyB0aGUgZmlyc3QgcmVhZCBmaWx0ZXIsIGJlY2F1c2UgaXQgaGFzIHRvIGJlIGludm9rZWRcbiAgICAvLyBiZWZvcmUgYW55IHVzZXIgZmlsdGVycy4gKGNhbid0IGRvIGl0IGluIGB1cGRhdGVgKVxuICAgIGlmICghdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlcnMgPSB7fVxuICAgIH1cbiAgICAvLyBhZGQgdGhlIG9iamVjdCAtPiBhcnJheSBjb252ZXJ0IGZpbHRlclxuICAgIHZhciBvYmplY3RDb252ZXJ0ZXIgPSBfLmJpbmQob2JqVG9BcnJheSwgdGhpcylcbiAgICBpZiAoIXRoaXMuZmlsdGVycy5yZWFkKSB7XG4gICAgICB0aGlzLmZpbHRlcnMucmVhZCA9IFtvYmplY3RDb252ZXJ0ZXJdXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsdGVycy5yZWFkLnVuc2hpZnQob2JqZWN0Q29udmVydGVyKVxuICAgIH1cbiAgICAvLyBzZXR1cCByZWYgbm9kZVxuICAgIHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1yZXBlYXQnKVxuICAgIF8ucmVwbGFjZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAvLyBjaGVjayBpZiB0aGlzIGlzIGEgYmxvY2sgcmVwZWF0XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJ1xuICAgICAgPyB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh0aGlzLmVsLCB0cnVlKVxuICAgICAgOiB0aGlzLmVsXG4gICAgLy8gY2hlY2sgb3RoZXIgZGlyZWN0aXZlcyB0aGF0IG5lZWQgdG8gYmUgaGFuZGxlZFxuICAgIC8vIGF0IHYtcmVwZWF0IGxldmVsXG4gICAgdGhpcy5jaGVja0lmKClcbiAgICB0aGlzLmNoZWNrUmVmKClcbiAgICB0aGlzLmNoZWNrQ29tcG9uZW50KClcbiAgICAvLyBjaGVjayBmb3IgdHJhY2tieSBwYXJhbVxuICAgIHRoaXMuaWRLZXkgPVxuICAgICAgdGhpcy5fY2hlY2tQYXJhbSgndHJhY2stYnknKSB8fFxuICAgICAgdGhpcy5fY2hlY2tQYXJhbSgndHJhY2tieScpIC8vIDAuMTEuMCBjb21wYXRcbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB9LFxuXG4gIC8qKlxuICAgKiBXYXJuIGFnYWluc3Qgdi1pZiB1c2FnZS5cbiAgICovXG5cbiAgY2hlY2tJZjogZnVuY3Rpb24gKCkge1xuICAgIGlmIChfLmF0dHIodGhpcy5lbCwgJ2lmJykgIT09IG51bGwpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0RvblxcJ3QgdXNlIHYtaWYgd2l0aCB2LXJlcGVhdC4gJyArXG4gICAgICAgICdVc2Ugdi1zaG93IG9yIHRoZSBcImZpbHRlckJ5XCIgZmlsdGVyIGluc3RlYWQuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdi1yZWYvIHYtZWwgaXMgYWxzbyBwcmVzZW50LlxuICAgKi9cblxuICBjaGVja1JlZjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZWZJRCA9IF8uYXR0cih0aGlzLmVsLCAncmVmJylcbiAgICB0aGlzLnJlZklEID0gcmVmSURcbiAgICAgID8gdGhpcy52bS4kaW50ZXJwb2xhdGUocmVmSUQpXG4gICAgICA6IG51bGxcbiAgICB2YXIgZWxJZCA9IF8uYXR0cih0aGlzLmVsLCAnZWwnKVxuICAgIHRoaXMuZWxJZCA9IGVsSWRcbiAgICAgID8gdGhpcy52bS4kaW50ZXJwb2xhdGUoZWxJZClcbiAgICAgIDogbnVsbFxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIHRvIHVzZSBmb3IgcmVwZWF0ZWRcbiAgICogaW5zdGFuY2VzLiBJZiBzdGF0aWMgd2UgcmVzb2x2ZSBpdCBub3csIG90aGVyd2lzZSBpdFxuICAgKiBuZWVkcyB0byBiZSByZXNvbHZlZCBhdCBidWlsZCB0aW1lIHdpdGggYWN0dWFsIGRhdGEuXG4gICAqL1xuXG4gIGNoZWNrQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlkID0gXy5hdHRyKHRoaXMuZWwsICdjb21wb25lbnQnKVxuICAgIHZhciBvcHRpb25zID0gdGhpcy52bS4kb3B0aW9uc1xuICAgIGlmICghaWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgY29uc3RydWN0b3JcbiAgICAgIHRoaXMuQ3RvciA9IF8uVnVlXG4gICAgICAvLyBpbmxpbmUgcmVwZWF0cyBzaG91bGQgaW5oZXJpdFxuICAgICAgdGhpcy5pbmhlcml0ID0gdHJ1ZVxuICAgICAgLy8gaW1wb3J0YW50OiB0cmFuc2NsdWRlIHdpdGggbm8gb3B0aW9ucywganVzdFxuICAgICAgLy8gdG8gZW5zdXJlIGJsb2NrIHN0YXJ0IGFuZCBibG9jayBlbmRcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0cmFuc2NsdWRlKHRoaXMudGVtcGxhdGUpXG4gICAgICB0aGlzLl9saW5rRm4gPSBjb21waWxlKHRoaXMudGVtcGxhdGUsIG9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNDb21wb25lbnQgPSB0cnVlXG4gICAgICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGVcbiAgICAgIGlmICh0aGlzLl9jaGVja1BhcmFtKCdpbmxpbmUtdGVtcGxhdGUnKSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBleHRyYWN0IGlubGluZSB0ZW1wbGF0ZSBhcyBhIERvY3VtZW50RnJhZ21lbnRcbiAgICAgICAgdGhpcy5pbmxpbmVUZW1wYWx0ZSA9IF8uZXh0cmFjdENvbnRlbnQodGhpcy5lbCwgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKGlkKVxuICAgICAgaWYgKCF0b2tlbnMpIHsgLy8gc3RhdGljIGNvbXBvbmVudFxuICAgICAgICB2YXIgQ3RvciA9IHRoaXMuQ3RvciA9IG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICAgICAgXy5hc3NlcnRBc3NldChDdG9yLCAnY29tcG9uZW50JywgaWQpXG4gICAgICAgIHZhciBtZXJnZWQgPSBtZXJnZU9wdGlvbnMoQ3Rvci5vcHRpb25zLCB7fSwge1xuICAgICAgICAgICRwYXJlbnQ6IHRoaXMudm1cbiAgICAgICAgfSlcbiAgICAgICAgbWVyZ2VkLnRlbXBsYXRlID0gdGhpcy5pbmxpbmVUZW1wYWx0ZSB8fCBtZXJnZWQudGVtcGxhdGVcbiAgICAgICAgbWVyZ2VkLl9hc0NvbXBvbmVudCA9IHRydWVcbiAgICAgICAgbWVyZ2VkLl9wYXJlbnQgPSB0aGlzLnZtXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0cmFuc2NsdWRlKHRoaXMudGVtcGxhdGUsIG1lcmdlZClcbiAgICAgICAgLy8gSW1wb3J0YW50OiBtYXJrIHRoZSB0ZW1wbGF0ZSBhcyBhIHJvb3Qgbm9kZSBzbyB0aGF0XG4gICAgICAgIC8vIGN1c3RvbSBlbGVtZW50IGNvbXBvbmVudHMgZG9uJ3QgZ2V0IGNvbXBpbGVkIHR3aWNlLlxuICAgICAgICAvLyBmaXhlcyAjODIyXG4gICAgICAgIHRoaXMudGVtcGxhdGUuX192dWVfXyA9IHRydWVcbiAgICAgICAgdGhpcy5fbGlua0ZuID0gY29tcGlsZSh0aGlzLnRlbXBsYXRlLCBtZXJnZWQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0byBiZSByZXNvbHZlZCBsYXRlclxuICAgICAgICB2YXIgY3RvckV4cCA9IHRleHRQYXJzZXIudG9rZW5zVG9FeHAodG9rZW5zKVxuICAgICAgICB0aGlzLmN0b3JHZXR0ZXIgPSBleHBQYXJzZXIucGFyc2UoY3RvckV4cCkuZ2V0XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUuXG4gICAqIFRoaXMgaXMgY2FsbGVkIHdoZW5ldmVyIHRoZSBBcnJheSBtdXRhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fE51bWJlcnxTdHJpbmd9IGRhdGFcbiAgICovXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IFtdXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgZGF0YVxuICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgZGF0YSA9IHJhbmdlKGRhdGEpXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgZGF0YSA9IF8udG9BcnJheShkYXRhKVxuICAgIH1cbiAgICB0aGlzLnZtcyA9IHRoaXMuZGlmZihkYXRhLCB0aGlzLnZtcylcbiAgICAvLyB1cGRhdGUgdi1yZWZcbiAgICBpZiAodGhpcy5yZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3RoaXMucmVmSURdID0gdGhpcy52bXNcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxJZCkge1xuICAgICAgdGhpcy52bS4kJFt0aGlzLmVsSWRdID0gdGhpcy52bXMubWFwKGZ1bmN0aW9uICh2bSkge1xuICAgICAgICByZXR1cm4gdm0uJGVsXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGlmZiwgYmFzZWQgb24gbmV3IGRhdGEgYW5kIG9sZCBkYXRhLCBkZXRlcm1pbmUgdGhlXG4gICAqIG1pbmltdW0gYW1vdW50IG9mIERPTSBtYW5pcHVsYXRpb25zIG5lZWRlZCB0byBtYWtlIHRoZVxuICAgKiBET00gcmVmbGVjdCB0aGUgbmV3IGRhdGEgQXJyYXkuXG4gICAqXG4gICAqIFRoZSBhbGdvcml0aG0gZGlmZnMgdGhlIG5ldyBkYXRhIEFycmF5IGJ5IHN0b3JpbmcgYVxuICAgKiBoaWRkZW4gcmVmZXJlbmNlIHRvIGFuIG93bmVyIHZtIGluc3RhbmNlIG9uIHByZXZpb3VzbHlcbiAgICogc2VlbiBkYXRhLiBUaGlzIGFsbG93cyB1cyB0byBhY2hpZXZlIE8obikgd2hpY2ggaXNcbiAgICogYmV0dGVyIHRoYW4gYSBsZXZlbnNodGVpbiBkaXN0YW5jZSBiYXNlZCBhbGdvcml0aG0sXG4gICAqIHdoaWNoIGlzIE8obSAqIG4pLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhXG4gICAqIEBwYXJhbSB7QXJyYXl9IG9sZFZtc1xuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG5cbiAgZGlmZjogZnVuY3Rpb24gKGRhdGEsIG9sZFZtcykge1xuICAgIHZhciBpZEtleSA9IHRoaXMuaWRLZXlcbiAgICB2YXIgY29udmVydGVkID0gdGhpcy5jb252ZXJ0ZWRcbiAgICB2YXIgcmVmID0gdGhpcy5yZWZcbiAgICB2YXIgYWxpYXMgPSB0aGlzLmFyZ1xuICAgIHZhciBpbml0ID0gIW9sZFZtc1xuICAgIHZhciB2bXMgPSBuZXcgQXJyYXkoZGF0YS5sZW5ndGgpXG4gICAgdmFyIG9iaiwgcmF3LCB2bSwgaSwgbFxuICAgIC8vIEZpcnN0IHBhc3MsIGdvIHRocm91Z2ggdGhlIG5ldyBBcnJheSBhbmQgZmlsbCB1cFxuICAgIC8vIHRoZSBuZXcgdm1zIGFycmF5LiBJZiBhIHBpZWNlIG9mIGRhdGEgaGFzIGEgY2FjaGVkXG4gICAgLy8gaW5zdGFuY2UgZm9yIGl0LCB3ZSByZXVzZSBpdC4gT3RoZXJ3aXNlIGJ1aWxkIGEgbmV3XG4gICAgLy8gaW5zdGFuY2UuXG4gICAgZm9yIChpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBvYmogPSBkYXRhW2ldXG4gICAgICByYXcgPSBjb252ZXJ0ZWQgPyBvYmouJHZhbHVlIDogb2JqXG4gICAgICB2bSA9ICFpbml0ICYmIHRoaXMuZ2V0Vm0ocmF3KVxuICAgICAgaWYgKHZtKSB7IC8vIHJldXNhYmxlIGluc3RhbmNlXG4gICAgICAgIHZtLl9yZXVzZWQgPSB0cnVlXG4gICAgICAgIHZtLiRpbmRleCA9IGkgLy8gdXBkYXRlICRpbmRleFxuICAgICAgICBpZiAoY29udmVydGVkKSB7XG4gICAgICAgICAgdm0uJGtleSA9IG9iai4ka2V5IC8vIHVwZGF0ZSAka2V5XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkS2V5KSB7IC8vIHN3YXAgdHJhY2sgYnkgaWQgZGF0YVxuICAgICAgICAgIGlmIChhbGlhcykge1xuICAgICAgICAgICAgdm1bYWxpYXNdID0gcmF3XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLl9zZXREYXRhKHJhdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7IC8vIG5ldyBpbnN0YW5jZVxuICAgICAgICB2bSA9IHRoaXMuYnVpbGQob2JqLCBpLCB0cnVlKVxuICAgICAgICB2bS5fbmV3ID0gdHJ1ZVxuICAgICAgICB2bS5fcmV1c2VkID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHZtc1tpXSA9IHZtXG4gICAgICAvLyBpbnNlcnQgaWYgdGhpcyBpcyBmaXJzdCBydW5cbiAgICAgIGlmIChpbml0KSB7XG4gICAgICAgIHZtLiRiZWZvcmUocmVmKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSBmaXJzdCBydW4sIHdlJ3JlIGRvbmUuXG4gICAgaWYgKGluaXQpIHtcbiAgICAgIHJldHVybiB2bXNcbiAgICB9XG4gICAgLy8gU2Vjb25kIHBhc3MsIGdvIHRocm91Z2ggdGhlIG9sZCB2bSBpbnN0YW5jZXMgYW5kXG4gICAgLy8gZGVzdHJveSB0aG9zZSB3aG8gYXJlIG5vdCByZXVzZWQgKGFuZCByZW1vdmUgdGhlbVxuICAgIC8vIGZyb20gY2FjaGUpXG4gICAgZm9yIChpID0gMCwgbCA9IG9sZFZtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZtID0gb2xkVm1zW2ldXG4gICAgICBpZiAoIXZtLl9yZXVzZWQpIHtcbiAgICAgICAgdGhpcy51bmNhY2hlVm0odm0pXG4gICAgICAgIHZtLiRkZXN0cm95KHRydWUpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZpbmFsIHBhc3MsIG1vdmUvaW5zZXJ0IG5ldyBpbnN0YW5jZXMgaW50byB0aGVcbiAgICAvLyByaWdodCBwbGFjZS4gV2UncmUgZ29pbmcgaW4gcmV2ZXJzZSBoZXJlIGJlY2F1c2VcbiAgICAvLyBpbnNlcnRCZWZvcmUgcmVsaWVzIG9uIHRoZSBuZXh0IHNpYmxpbmcgdG8gYmVcbiAgICAvLyByZXNvbHZlZC5cbiAgICB2YXIgdGFyZ2V0TmV4dCwgY3VycmVudE5leHRcbiAgICBpID0gdm1zLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZtID0gdm1zW2ldXG4gICAgICAvLyB0aGlzIGlzIHRoZSB2bSB0aGF0IHdlIHNob3VsZCBiZSBpbiBmcm9udCBvZlxuICAgICAgdGFyZ2V0TmV4dCA9IHZtc1tpICsgMV1cbiAgICAgIGlmICghdGFyZ2V0TmV4dCkge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGl0ZW0uIElmIGl0J3MgcmV1c2VkIHRoZW5cbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlIHdpbGwgZXZlbnR1YWxseSBiZSBpbiB0aGUgcmlnaHRcbiAgICAgICAgLy8gcGxhY2UsIHNvIG5vIG5lZWQgdG8gdG91Y2ggaXQuIE90aGVyd2lzZSwgaW5zZXJ0XG4gICAgICAgIC8vIGl0LlxuICAgICAgICBpZiAoIXZtLl9yZXVzZWQpIHtcbiAgICAgICAgICB2bS4kYmVmb3JlKHJlZilcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5leHRFbCA9IHRhcmdldE5leHQuJGVsXG4gICAgICAgIGlmICh2bS5fcmV1c2VkKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgdm0gd2UgYXJlIGFjdHVhbGx5IGluIGZyb250IG9mXG4gICAgICAgICAgY3VycmVudE5leHQgPSBmaW5kTmV4dFZtKHZtLCByZWYpXG4gICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIG1vdmUgaWYgd2UgYXJlIG5vdCBpbiB0aGUgcmlnaHRcbiAgICAgICAgICAvLyBwbGFjZSBhbHJlYWR5LlxuICAgICAgICAgIGlmIChjdXJyZW50TmV4dCAhPT0gdGFyZ2V0TmV4dCkge1xuICAgICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwsIG51bGwsIGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBuZXcgaW5zdGFuY2UsIGluc2VydCB0byBleGlzdGluZyBuZXh0XG4gICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZtLl9uZXcgPSBmYWxzZVxuICAgICAgdm0uX3JldXNlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB2bXNcbiAgfSxcblxuICAvKipcbiAgICogQnVpbGQgYSBuZXcgaW5zdGFuY2UgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtCb29sZWFufSBuZWVkQ2FjaGVcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uIChkYXRhLCBpbmRleCwgbmVlZENhY2hlKSB7XG4gICAgdmFyIG1ldGEgPSB7ICRpbmRleDogaW5kZXggfVxuICAgIGlmICh0aGlzLmNvbnZlcnRlZCkge1xuICAgICAgbWV0YS4ka2V5ID0gZGF0YS4ka2V5XG4gICAgfVxuICAgIHZhciByYXcgPSB0aGlzLmNvbnZlcnRlZCA/IGRhdGEuJHZhbHVlIDogZGF0YVxuICAgIHZhciBhbGlhcyA9IHRoaXMuYXJnXG4gICAgaWYgKGFsaWFzKSB7XG4gICAgICBkYXRhID0ge31cbiAgICAgIGRhdGFbYWxpYXNdID0gcmF3XG4gICAgfSBlbHNlIGlmICghaXNQbGFpbk9iamVjdChyYXcpKSB7XG4gICAgICAvLyBub24tb2JqZWN0IHZhbHVlc1xuICAgICAgZGF0YSA9IHt9XG4gICAgICBtZXRhLiR2YWx1ZSA9IHJhd1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0XG4gICAgICBkYXRhID0gcmF3XG4gICAgfVxuICAgIC8vIHJlc29sdmUgY29uc3RydWN0b3JcbiAgICB2YXIgQ3RvciA9IHRoaXMuQ3RvciB8fCB0aGlzLnJlc29sdmVDdG9yKGRhdGEsIG1ldGEpXG4gICAgdmFyIHZtID0gdGhpcy52bS4kYWRkQ2hpbGQoe1xuICAgICAgZWw6IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMudGVtcGxhdGUpLFxuICAgICAgX2FzQ29tcG9uZW50OiB0aGlzLmFzQ29tcG9uZW50LFxuICAgICAgX2hvc3Q6IHRoaXMuX2hvc3QsXG4gICAgICBfbGlua0ZuOiB0aGlzLl9saW5rRm4sXG4gICAgICBfbWV0YTogbWV0YSxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBpbmhlcml0OiB0aGlzLmluaGVyaXQsXG4gICAgICB0ZW1wbGF0ZTogdGhpcy5pbmxpbmVUZW1wYWx0ZVxuICAgIH0sIEN0b3IpXG4gICAgLy8gZmxhZyB0aGlzIGluc3RhbmNlIGFzIGEgcmVwZWF0IGluc3RhbmNlXG4gICAgLy8gc28gdGhhdCB3ZSBjYW4gc2tpcCBpdCBpbiB2bS5fZGlnZXN0XG4gICAgdm0uX3JlcGVhdCA9IHRydWVcbiAgICAvLyBjYWNoZSBpbnN0YW5jZVxuICAgIGlmIChuZWVkQ2FjaGUpIHtcbiAgICAgIHRoaXMuY2FjaGVWbShyYXcsIHZtKVxuICAgIH1cbiAgICAvLyBzeW5jIGJhY2sgY2hhbmdlcyBmb3IgJHZhbHVlLCBwYXJ0aWN1bGFybHkgZm9yXG4gICAgLy8gdHdvLXdheSBiaW5kaW5ncyBvZiBwcmltaXRpdmUgdmFsdWVzXG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdm0uJHdhdGNoKCckdmFsdWUnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAoc2VsZi5jb252ZXJ0ZWQpIHtcbiAgICAgICAgc2VsZi5yYXdWYWx1ZVt2bS4ka2V5XSA9IHZhbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5yYXdWYWx1ZS4kc2V0KHZtLiRpbmRleCwgdmFsKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHZtXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSBjb250cnVjdG9yIHRvIHVzZSBmb3IgYW4gaW5zdGFuY2UuXG4gICAqIFRoZSB0cmlja3kgcGFydCBoZXJlIGlzIHRoYXQgdGhlcmUgY291bGQgYmUgZHluYW1pY1xuICAgKiBjb21wb25lbnRzIGRlcGVuZGluZyBvbiBpbnN0YW5jZSBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG5cbiAgcmVzb2x2ZUN0b3I6IGZ1bmN0aW9uIChkYXRhLCBtZXRhKSB7XG4gICAgLy8gY3JlYXRlIGEgdGVtcG9yYXJ5IGNvbnRleHQgb2JqZWN0IGFuZCBjb3B5IGRhdGFcbiAgICAvLyBhbmQgbWV0YSBwcm9wZXJ0aWVzIG9udG8gaXQuXG4gICAgLy8gdXNlIF8uZGVmaW5lIHRvIGF2b2lkIGFjY2lkZW50YWxseSBvdmVyd3JpdGluZyBzY29wZVxuICAgIC8vIHByb3BlcnRpZXMuXG4gICAgdmFyIGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKHRoaXMudm0pXG4gICAgdmFyIGtleVxuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgZGF0YVtrZXldKVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBtZXRhKSB7XG4gICAgICBfLmRlZmluZShjb250ZXh0LCBrZXksIG1ldGFba2V5XSlcbiAgICB9XG4gICAgdmFyIGlkID0gdGhpcy5jdG9yR2V0dGVyLmNhbGwoY29udGV4dCwgY29udGV4dClcbiAgICB2YXIgQ3RvciA9IHRoaXMudm0uJG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KEN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgICByZXR1cm4gQ3RvclxuICB9LFxuXG4gIC8qKlxuICAgKiBVbmJpbmQsIHRlYXJkb3duIGV2ZXJ5dGhpbmdcbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFt0aGlzLnJlZklEXSA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMudm1zKSB7XG4gICAgICB2YXIgaSA9IHRoaXMudm1zLmxlbmd0aFxuICAgICAgdmFyIHZtXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZtID0gdGhpcy52bXNbaV1cbiAgICAgICAgdGhpcy51bmNhY2hlVm0odm0pXG4gICAgICAgIHZtLiRkZXN0cm95KClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhY2hlIGEgdm0gaW5zdGFuY2UgYmFzZWQgb24gaXRzIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIGFuIG9iamVjdCwgd2Ugc2F2ZSB0aGUgdm0ncyByZWZlcmVuY2Ugb25cbiAgICogdGhlIGRhdGEgb2JqZWN0IGFzIGEgaGlkZGVuIHByb3BlcnR5LiBPdGhlcndpc2Ugd2VcbiAgICogY2FjaGUgdGhlbSBpbiBhbiBvYmplY3QgYW5kIGZvciBlYWNoIHByaW1pdGl2ZSB2YWx1ZVxuICAgKiB0aGVyZSBpcyBhbiBhcnJheSBpbiBjYXNlIHRoZXJlIGFyZSBkdXBsaWNhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICovXG5cbiAgY2FjaGVWbTogZnVuY3Rpb24gKGRhdGEsIHZtKSB7XG4gICAgdmFyIGlkS2V5ID0gdGhpcy5pZEtleVxuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGVcbiAgICB2YXIgaWRcbiAgICBpZiAoaWRLZXkpIHtcbiAgICAgIGlkID0gZGF0YVtpZEtleV1cbiAgICAgIGlmICghY2FjaGVbaWRdKSB7XG4gICAgICAgIGNhY2hlW2lkXSA9IHZtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLndhcm4oJ0R1cGxpY2F0ZSB0cmFjay1ieSBrZXkgaW4gdi1yZXBlYXQ6ICcgKyBpZClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBpZCA9IHRoaXMuaWRcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICBpZiAoZGF0YVtpZF0gPT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhW2lkXSA9IHZtXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy53YXJuKFxuICAgICAgICAgICAgJ0R1cGxpY2F0ZSBvYmplY3RzIGFyZSBub3Qgc3VwcG9ydGVkIGluIHYtcmVwZWF0ICcgK1xuICAgICAgICAgICAgJ3doZW4gdXNpbmcgY29tcG9uZW50cyBvciB0cmFuc2l0aW9ucy4nXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmRlZmluZShkYXRhLCB0aGlzLmlkLCB2bSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjYWNoZVtkYXRhXSkge1xuICAgICAgICBjYWNoZVtkYXRhXSA9IFt2bV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlW2RhdGFdLnB1c2godm0pXG4gICAgICB9XG4gICAgfVxuICAgIHZtLl9yYXcgPSBkYXRhXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBnZXQgYSBjYWNoZWQgaW5zdGFuY2UgZnJvbSBhIHBpZWNlIG9mIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1Z1ZXx1bmRlZmluZWR9XG4gICAqL1xuXG4gIGdldFZtOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICh0aGlzLmlkS2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtkYXRhW3RoaXMuaWRLZXldXVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhW3RoaXMuaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW2RhdGFdXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHZhciBpID0gMFxuICAgICAgICB2YXIgdm0gPSBjYWNoZWRbaV1cbiAgICAgICAgLy8gc2luY2UgZHVwbGljYXRlZCB2bSBpbnN0YW5jZXMgbWlnaHQgYmUgYSByZXVzZWRcbiAgICAgICAgLy8gb25lIE9SIGEgbmV3bHkgY3JlYXRlZCBvbmUsIHdlIG5lZWQgdG8gcmV0dXJuIHRoZVxuICAgICAgICAvLyBmaXJzdCBpbnN0YW5jZSB0aGF0IGlzIG5laXRoZXIgb2YgdGhlc2UuXG4gICAgICAgIHdoaWxlICh2bSAmJiAodm0uX3JldXNlZCB8fCB2bS5fbmV3KSkge1xuICAgICAgICAgIHZtID0gY2FjaGVkWysraV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdm1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIGNhY2hlZCB2bSBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqL1xuXG4gIHVuY2FjaGVWbTogZnVuY3Rpb24gKHZtKSB7XG4gICAgdmFyIGRhdGEgPSB2bS5fcmF3XG4gICAgaWYgKHRoaXMuaWRLZXkpIHtcbiAgICAgIHRoaXMuY2FjaGVbZGF0YVt0aGlzLmlkS2V5XV0gPSBudWxsXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgZGF0YVt0aGlzLmlkXSA9IG51bGxcbiAgICAgIHZtLl9yYXcgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FjaGVbZGF0YV0ucG9wKClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEhlbHBlciB0byBmaW5kIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBhbiBpbnN0YW5jZVxuICogcm9vdCBub2RlLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgZGVzdHJveWVkIHZtJ3NcbiAqIGVsZW1lbnQgY291bGQgc3RpbGwgYmUgbGluZ2VyaW5nIGluIHRoZSBET00gYmVmb3JlIGl0c1xuICogbGVhdmluZyB0cmFuc2l0aW9uIGZpbmlzaGVzLCBidXQgaXRzIF9fdnVlX18gcmVmZXJlbmNlXG4gKiBzaG91bGQgaGF2ZSBiZWVuIHJlbW92ZWQgc28gd2UgY2FuIHNraXAgdGhlbS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Q29tbWVudE5vZGV9IHJlZlxuICogQHJldHVybiB7VnVlfVxuICovXG5cbmZ1bmN0aW9uIGZpbmROZXh0Vm0gKHZtLCByZWYpIHtcbiAgdmFyIGVsID0gKHZtLl9ibG9ja0VuZCB8fCB2bS4kZWwpLm5leHRTaWJsaW5nXG4gIHdoaWxlICghZWwuX192dWVfXyAmJiBlbCAhPT0gcmVmKSB7XG4gICAgZWwgPSBlbC5uZXh0U2libGluZ1xuICB9XG4gIHJldHVybiBlbC5fX3Z1ZV9fXG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBjb252ZXJ0IG5vbi1BcnJheSBvYmplY3RzIHRvIGFycmF5LlxuICogVGhpcyBpcyB0aGUgZGVmYXVsdCBmaWx0ZXIgaW5zdGFsbGVkIHRvIGV2ZXJ5IHYtcmVwZWF0XG4gKiBkaXJlY3RpdmUuXG4gKlxuICogSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCAqKnRoZSBkaXJlY3RpdmUqKiBhcyBgdGhpc2BcbiAqIGNvbnRleHQgc28gdGhhdCB3ZSBjYW4gbWFyayB0aGUgcmVwZWF0IGFycmF5IGFzIGNvbnZlcnRlZFxuICogZnJvbSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBvYmpUb0FycmF5IChvYmopIHtcbiAgLy8gcmVnYXJkbGVzcyBvZiB0eXBlLCBzdG9yZSB0aGUgdW4tZmlsdGVyZWQgcmF3IHZhbHVlLlxuICB0aGlzLnJhd1ZhbHVlID0gb2JqXG4gIGlmICghaXNQbGFpbk9iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIG9ialxuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciByZXMgPSBuZXcgQXJyYXkoaSlcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIHJlc1tpXSA9IHtcbiAgICAgICRrZXk6IGtleSxcbiAgICAgICR2YWx1ZTogb2JqW2tleV1cbiAgICB9XG4gIH1cbiAgLy8gYHRoaXNgIHBvaW50cyB0byB0aGUgcmVwZWF0IGRpcmVjdGl2ZSBpbnN0YW5jZVxuICB0aGlzLmNvbnZlcnRlZCA9IHRydWVcbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHJhbmdlIGFycmF5IGZyb20gZ2l2ZW4gbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICB2YXIgaSA9IC0xXG4gIHZhciByZXQgPSBuZXcgQXJyYXkobilcbiAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICByZXRbaV0gPSBpXG4gIH1cbiAgcmV0dXJuIHJldFxufSIsInZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBlbCA9IHRoaXMuZWxcbiAgdHJhbnNpdGlvbi5hcHBseShlbCwgdmFsdWUgPyAxIDogLTEsIGZ1bmN0aW9uICgpIHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuICB9LCB0aGlzLnZtKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXVxudmFyIGNhbWVsUHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnXVxudmFyIGltcG9ydGFudFJFID0gLyFpbXBvcnRhbnQ7PyQvXG52YXIgY2FtZWxSRSA9IC8oW2Etel0pKFtBLVpdKS9nXG52YXIgdGVzdEVsID0gbnVsbFxudmFyIHByb3BDYWNoZSA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGRlZXA6IHRydWUsXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5hcmcpIHtcbiAgICAgIHRoaXMuc2V0UHJvcCh0aGlzLmFyZywgdmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIGNhY2hlIG9iamVjdCBzdHlsZXMgc28gdGhhdCBvbmx5IGNoYW5nZWQgcHJvcHNcbiAgICAgICAgLy8gYXJlIGFjdHVhbGx5IHVwZGF0ZWQuXG4gICAgICAgIGlmICghdGhpcy5jYWNoZSkgdGhpcy5jYWNoZSA9IHt9XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgICBpZiAodmFsdWVbcHJvcF0gIT0gdGhpcy5jYWNoZVtwcm9wXSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZVtwcm9wXSA9IHZhbHVlW3Byb3BdXG4gICAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXRQcm9wOiBmdW5jdGlvbiAocHJvcCwgdmFsdWUpIHtcbiAgICBwcm9wID0gbm9ybWFsaXplKHByb3ApXG4gICAgaWYgKCFwcm9wKSByZXR1cm4gLy8gdW5zdXBwb3J0ZWQgcHJvcFxuICAgIC8vIGNhc3QgcG9zc2libGUgbnVtYmVycy9ib29sZWFucyBpbnRvIHN0cmluZ3NcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWUgKz0gJydcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHZhciBpc0ltcG9ydGFudCA9IGltcG9ydGFudFJFLnRlc3QodmFsdWUpXG4gICAgICAgID8gJ2ltcG9ydGFudCdcbiAgICAgICAgOiAnJ1xuICAgICAgaWYgKGlzSW1wb3J0YW50KSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShpbXBvcnRhbnRSRSwgJycpLnRyaW0oKVxuICAgICAgfVxuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIENTUyBwcm9wZXJ0eSBuYW1lLlxuICogLSBjYWNoZSByZXN1bHRcbiAqIC0gYXV0byBwcmVmaXhcbiAqIC0gY2FtZWxDYXNlIC0+IGRhc2gtY2FzZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplIChwcm9wKSB7XG4gIGlmIChwcm9wQ2FjaGVbcHJvcF0pIHtcbiAgICByZXR1cm4gcHJvcENhY2hlW3Byb3BdXG4gIH1cbiAgdmFyIHJlcyA9IHByZWZpeChwcm9wKVxuICBwcm9wQ2FjaGVbcHJvcF0gPSBwcm9wQ2FjaGVbcmVzXSA9IHJlc1xuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQXV0byBkZXRlY3QgdGhlIGFwcHJvcHJpYXRlIHByZWZpeCBmb3IgYSBDU1MgcHJvcGVydHkuXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNTIzNjkyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBwcmVmaXggKHByb3ApIHtcbiAgcHJvcCA9IHByb3AucmVwbGFjZShjYW1lbFJFLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpXG4gIHZhciBjYW1lbCA9IF8uY2FtZWxpemUocHJvcClcbiAgdmFyIHVwcGVyID0gY2FtZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYW1lbC5zbGljZSgxKVxuICBpZiAoIXRlc3RFbCkge1xuICAgIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH1cbiAgaWYgKGNhbWVsIGluIHRlc3RFbC5zdHlsZSkge1xuICAgIHJldHVybiBwcm9wXG4gIH1cbiAgdmFyIGkgPSBwcmVmaXhlcy5sZW5ndGhcbiAgdmFyIHByZWZpeGVkXG4gIHdoaWxlIChpLS0pIHtcbiAgICBwcmVmaXhlZCA9IGNhbWVsUHJlZml4ZXNbaV0gKyB1cHBlclxuICAgIGlmIChwcmVmaXhlZCBpbiB0ZXN0RWwuc3R5bGUpIHtcbiAgICAgIHJldHVybiBwcmVmaXhlc1tpXSArIHByb3BcbiAgICB9XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdHRyID0gdGhpcy5lbC5ub2RlVHlwZSA9PT0gM1xuICAgICAgPyAnbm9kZVZhbHVlJ1xuICAgICAgOiAndGV4dENvbnRlbnQnXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsW3RoaXMuYXR0cl0gPSBfLnRvU3RyaW5nKHZhbHVlKVxuICB9XG4gIFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiAxMDAwLFxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkge1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5leHByZXNzaW9uKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciB2bSA9IHRoaXMuZWwuX192dWVfXyB8fCB0aGlzLnZtXG4gICAgdGhpcy5lbC5fX3ZfdHJhbnMgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICAvLyByZXNvbHZlIHRoZSBjdXN0b20gdHJhbnNpdGlvbiBmdW5jdGlvbnMgbm93XG4gICAgICAvLyBzbyB0aGUgdHJhbnNpdGlvbiBtb2R1bGUga25vd3MgdGhpcyBpcyBhXG4gICAgICAvLyBqYXZhc2NyaXB0IHRyYW5zaXRpb24gd2l0aG91dCBoYXZpbmcgdG8gY2hlY2tcbiAgICAgIC8vIGNvbXB1dGVkIENTUy5cbiAgICAgIGZuczogdm0uJG9wdGlvbnMudHJhbnNpdGlvbnNbaWRdXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuLi93YXRjaGVyJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGxpdGVyYWxSRSA9IC9eKHRydWV8ZmFsc2V8XFxzPygnW14nXSonfFwiW15cIl1cIilcXHM/KSQvXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiA5MDAsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNoaWxkID0gdGhpcy52bVxuICAgIHZhciBwYXJlbnQgPSBjaGlsZC4kcGFyZW50XG4gICAgdmFyIGNoaWxkS2V5ID0gdGhpcy5hcmcgfHwgJyRkYXRhJ1xuICAgIHZhciBwYXJlbnRLZXkgPSB0aGlzLmV4cHJlc3Npb25cblxuICAgIGlmICh0aGlzLmVsICYmIHRoaXMuZWwgIT09IGNoaWxkLiRlbCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi13aXRoIGNhbiBvbmx5IGJlIHVzZWQgb24gaW5zdGFuY2Ugcm9vdCBlbGVtZW50cy4nXG4gICAgICApXG4gICAgfSBlbHNlIGlmICghcGFyZW50KSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LXdpdGggbXVzdCBiZSB1c2VkIG9uIGFuIGluc3RhbmNlIHdpdGggYSBwYXJlbnQuJ1xuICAgICAgKVxuICAgIH0gZWxzZSBpZiAobGl0ZXJhbFJFLnRlc3QocGFyZW50S2V5KSkge1xuICAgICAgLy8gbm8gbmVlZCB0byBzZXR1cCB3YXRjaGVycyBmb3IgbGl0ZXJhbCBiaW5kaW5nc1xuICAgICAgaWYgKCF0aGlzLmFyZykge1xuICAgICAgICBfLndhcm4oXG4gICAgICAgICAgJ3Ytd2l0aCBjYW5ub3QgYmluZCBsaXRlcmFsIHZhbHVlIGFzICRkYXRhOiAnICtcbiAgICAgICAgICBwYXJlbnRLZXlcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZXhwUGFyc2VyLnBhcnNlKHBhcmVudEtleSkuZ2V0KClcbiAgICAgICAgY2hpbGQuJHNldChjaGlsZEtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gc2ltcGxlIGxvY2sgdG8gYXZvaWQgY2lyY3VsYXIgdXBkYXRlcy5cbiAgICAgIC8vIHdpdGhvdXQgdGhpcyBpdCB3b3VsZCBzdGFiaWxpemUgdG9vLCBidXQgdGhpcyBtYWtlc1xuICAgICAgLy8gc3VyZSBpdCBkb2Vzbid0IGNhdXNlIG90aGVyIHdhdGNoZXJzIHRvIHJlLWV2YWx1YXRlLlxuICAgICAgdmFyIGxvY2tlZCA9IGZhbHNlXG4gICAgICB2YXIgbG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICBfLm5leHRUaWNrKHVubG9jaylcbiAgICAgIH1cbiAgICAgIHZhciB1bmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2tlZCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyZW50V2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIHBhcmVudEtleSxcbiAgICAgICAgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgIGlmICghbG9ja2VkKSB7XG4gICAgICAgICAgICBsb2NrKClcbiAgICAgICAgICAgIGNoaWxkLiRzZXQoY2hpbGRLZXksIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIFxuICAgICAgLy8gc2V0IHRoZSBjaGlsZCBpbml0aWFsIHZhbHVlIGZpcnN0LCBiZWZvcmUgc2V0dGluZ1xuICAgICAgLy8gdXAgdGhlIGNoaWxkIHdhdGNoZXIgdG8gYXZvaWQgdHJpZ2dlcmluZyBpdFxuICAgICAgLy8gaW1tZWRpYXRlbHkuXG4gICAgICBjaGlsZC4kc2V0KGNoaWxkS2V5LCB0aGlzLnBhcmVudFdhdGNoZXIudmFsdWUpXG5cbiAgICAgIHRoaXMuY2hpbGRXYXRjaGVyID0gbmV3IFdhdGNoZXIoXG4gICAgICAgIGNoaWxkLFxuICAgICAgICBjaGlsZEtleSxcbiAgICAgICAgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgIGlmICghbG9ja2VkKSB7XG4gICAgICAgICAgICBsb2NrKClcbiAgICAgICAgICAgIHBhcmVudC4kc2V0KHBhcmVudEtleSwgdmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnRXYXRjaGVyKSB7XG4gICAgICB0aGlzLnBhcmVudFdhdGNoZXIudGVhcmRvd24oKVxuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9wYXRoJylcblxuLyoqXG4gKiBGaWx0ZXIgZmlsdGVyIGZvciB2LXJlcGVhdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVsaW1pdGVyXVxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFLZXlcbiAqL1xuXG5leHBvcnRzLmZpbHRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc2VhcmNoS2V5LCBkZWxpbWl0ZXIsIGRhdGFLZXkpIHtcbiAgLy8gYWxsb3cgb3B0aW9uYWwgYGluYCBkZWxpbWl0ZXJcbiAgLy8gYmVjYXVzZSB3aHkgbm90XG4gIGlmIChkZWxpbWl0ZXIgJiYgZGVsaW1pdGVyICE9PSAnaW4nKSB7XG4gICAgZGF0YUtleSA9IGRlbGltaXRlclxuICB9XG4gIC8vIGdldCB0aGUgc2VhcmNoIHN0cmluZ1xuICB2YXIgc2VhcmNoID1cbiAgICBfLnN0cmlwUXVvdGVzKHNlYXJjaEtleSkgfHxcbiAgICB0aGlzLiRnZXQoc2VhcmNoS2V5KVxuICBpZiAoIXNlYXJjaCkge1xuICAgIHJldHVybiBhcnJcbiAgfVxuICBzZWFyY2ggPSAoJycgKyBzZWFyY2gpLnRvTG93ZXJDYXNlKClcbiAgLy8gZ2V0IHRoZSBvcHRpb25hbCBkYXRhS2V5XG4gIGRhdGFLZXkgPVxuICAgIGRhdGFLZXkgJiZcbiAgICAoXy5zdHJpcFF1b3RlcyhkYXRhS2V5KSB8fCB0aGlzLiRnZXQoZGF0YUtleSkpXG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGRhdGFLZXlcbiAgICAgID8gY29udGFpbnMoUGF0aC5nZXQoaXRlbSwgZGF0YUtleSksIHNlYXJjaClcbiAgICAgIDogY29udGFpbnMoaXRlbSwgc2VhcmNoKVxuICB9KVxufVxuXG4vKipcbiAqIEZpbHRlciBmaWx0ZXIgZm9yIHYtcmVwZWF0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNvcnRLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXZlcnNlS2V5XG4gKi9cblxuZXhwb3J0cy5vcmRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc29ydEtleSwgcmV2ZXJzZUtleSkge1xuICB2YXIga2V5ID1cbiAgICBfLnN0cmlwUXVvdGVzKHNvcnRLZXkpIHx8XG4gICAgdGhpcy4kZ2V0KHNvcnRLZXkpXG4gIGlmICgha2V5KSB7XG4gICAgcmV0dXJuIGFyclxuICB9XG4gIHZhciBvcmRlciA9IDFcbiAgaWYgKHJldmVyc2VLZXkpIHtcbiAgICBpZiAocmV2ZXJzZUtleSA9PT0gJy0xJykge1xuICAgICAgb3JkZXIgPSAtMVxuICAgIH0gZWxzZSBpZiAocmV2ZXJzZUtleS5jaGFyQ29kZUF0KDApID09PSAweDIxKSB7IC8vICFcbiAgICAgIHJldmVyc2VLZXkgPSByZXZlcnNlS2V5LnNsaWNlKDEpXG4gICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IDEgOiAtMVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IC0xIDogMVxuICAgIH1cbiAgfVxuICAvLyBzb3J0IG9uIGEgY29weSB0byBhdm9pZCBtdXRhdGluZyBvcmlnaW5hbCBhcnJheVxuICByZXR1cm4gYXJyLnNsaWNlKCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGEgPSBfLmlzT2JqZWN0KGEpID8gUGF0aC5nZXQoYSwga2V5KSA6IGFcbiAgICBiID0gXy5pc09iamVjdChiKSA/IFBhdGguZ2V0KGIsIGtleSkgOiBiXG4gICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA+IGIgPyBvcmRlciA6IC1vcmRlclxuICB9KVxufVxuXG4vKipcbiAqIFN0cmluZyBjb250YWluIGhlbHBlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoXG4gKi9cblxuZnVuY3Rpb24gY29udGFpbnMgKHZhbCwgc2VhcmNoKSB7XG4gIGlmIChfLmlzT2JqZWN0KHZhbCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgICBpZiAoY29udGFpbnModmFsW2tleV0sIHNlYXJjaCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodmFsICE9IG51bGwpIHtcbiAgICByZXR1cm4gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBTdHJpbmdpZnkgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGVudFxuICovXG5cbmV4cG9ydHMuanNvbiA9IHtcbiAgcmVhZDogZnVuY3Rpb24gKHZhbHVlLCBpbmRlbnQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgPyB2YWx1ZVxuICAgICAgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgTnVtYmVyKGluZGVudCkgfHwgMilcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnYWJjJyA9PiAnQWJjJ1xuICovXG5cbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gJydcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXG4gIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpXG59XG5cbi8qKlxuICogJ2FiYycgPT4gJ0FCQydcbiAqL1xuXG5leHBvcnRzLnVwcGVyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgID8gdmFsdWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpXG4gICAgOiAnJ1xufVxuXG4vKipcbiAqICdBYkMnID0+ICdhYmMnXG4gKi9cblxuZXhwb3J0cy5sb3dlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgIDogJydcbn1cblxuLyoqXG4gKiAxMjM0NSA9PiAkMTIsMzQ1LjAwXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25cbiAqL1xuXG52YXIgZGlnaXRzUkUgPSAvKFxcZHszfSkoPz1cXGQpL2dcblxuZXhwb3J0cy5jdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgc2lnbikge1xuICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gIGlmICghaXNGaW5pdGUodmFsdWUpIHx8ICghdmFsdWUgJiYgdmFsdWUgIT09IDApKSByZXR1cm4gJydcbiAgc2lnbiA9IHNpZ24gfHwgJyQnXG4gIHZhciBzID0gTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkpLnRvU3RyaW5nKCksXG4gICAgaSA9IHMubGVuZ3RoICUgMyxcbiAgICBoID0gaSA+IDBcbiAgICAgID8gKHMuc2xpY2UoMCwgaSkgKyAocy5sZW5ndGggPiAzID8gJywnIDogJycpKVxuICAgICAgOiAnJyxcbiAgICB2ID0gTWF0aC5hYnMocGFyc2VJbnQoKHZhbHVlICogMTAwKSAlIDEwMCwgMTApKSxcbiAgICBmID0gJy4nICsgKHYgPCAxMCA/ICgnMCcgKyB2KSA6IHYpXG4gIHJldHVybiAodmFsdWUgPCAwID8gJy0nIDogJycpICtcbiAgICBzaWduICsgaCArIHMuc2xpY2UoaSkucmVwbGFjZShkaWdpdHNSRSwgJyQxLCcpICsgZlxufVxuXG4vKipcbiAqICdpdGVtJyA9PiAnaXRlbXMnXG4gKlxuICogQHBhcmFtc1xuICogIGFuIGFycmF5IG9mIHN0cmluZ3MgY29ycmVzcG9uZGluZyB0b1xuICogIHRoZSBzaW5nbGUsIGRvdWJsZSwgdHJpcGxlIC4uLiBmb3JtcyBvZiB0aGUgd29yZCB0b1xuICogIGJlIHBsdXJhbGl6ZWQuIFdoZW4gdGhlIG51bWJlciB0byBiZSBwbHVyYWxpemVkXG4gKiAgZXhjZWVkcyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmdzLCBpdCB3aWxsIHVzZSB0aGUgbGFzdFxuICogIGVudHJ5IGluIHRoZSBhcnJheS5cbiAqXG4gKiAgZS5nLiBbJ3NpbmdsZScsICdkb3VibGUnLCAndHJpcGxlJywgJ211bHRpcGxlJ11cbiAqL1xuXG5leHBvcnRzLnBsdXJhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIHJldHVybiBhcmdzLmxlbmd0aCA+IDFcbiAgICA/IChhcmdzW3ZhbHVlICUgMTAgLSAxXSB8fCBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pXG4gICAgOiAoYXJnc1swXSArICh2YWx1ZSA9PT0gMSA/ICcnIDogJ3MnKSlcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWwgZmlsdGVyIHRoYXQgdGFrZXMgYSBoYW5kbGVyIGZ1bmN0aW9uLFxuICogd3JhcHMgaXQgc28gaXQgb25seSBnZXRzIHRyaWdnZXJlZCBvbiBzcGVjaWZpY1xuICoga2V5cHJlc3Nlcy4gdi1vbiBvbmx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG52YXIga2V5Q29kZXMgPSB7XG4gIGVudGVyICAgIDogMTMsXG4gIHRhYiAgICAgIDogOSxcbiAgJ2RlbGV0ZScgOiA0NixcbiAgdXAgICAgICAgOiAzOCxcbiAgbGVmdCAgICAgOiAzNyxcbiAgcmlnaHQgICAgOiAzOSxcbiAgZG93biAgICAgOiA0MCxcbiAgZXNjICAgICAgOiAyN1xufVxuXG5leHBvcnRzLmtleSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBrZXkpIHtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm5cbiAgdmFyIGNvZGUgPSBrZXlDb2Rlc1trZXldXG4gIGlmICghY29kZSkge1xuICAgIGNvZGUgPSBwYXJzZUludChrZXksIDEwKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IGNvZGUpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSlcbiAgICB9XG4gIH1cbn1cblxuLy8gZXhwb3NlIGtleWNvZGUgaGFzaFxuZXhwb3J0cy5rZXkua2V5Q29kZXMgPSBrZXlDb2Rlc1xuXG4vKipcbiAqIEluc3RhbGwgc3BlY2lhbCBhcnJheSBmaWx0ZXJzXG4gKi9cblxuXy5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9hcnJheS1maWx0ZXJzJykpXG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4uL2RpcmVjdGl2ZScpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxudmFyIHRyYW5zY2x1ZGUgPSByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcblxuLyoqXG4gKiBUcmFuc2NsdWRlLCBjb21waWxlIGFuZCBsaW5rIGVsZW1lbnQuXG4gKlxuICogSWYgYSBwcmUtY29tcGlsZWQgbGlua2VyIGlzIGF2YWlsYWJsZSwgdGhhdCBtZWFucyB0aGVcbiAqIHBhc3NlZCBpbiBlbGVtZW50IHdpbGwgYmUgcHJlLXRyYW5zY2x1ZGVkIGFuZCBjb21waWxlZFxuICogYXMgd2VsbCAtIGFsbCB3ZSBuZWVkIHRvIGRvIGlzIHRvIGNhbGwgdGhlIGxpbmtlci5cbiAqXG4gKiBPdGhlcndpc2Ugd2UgbmVlZCB0byBjYWxsIHRyYW5zY2x1ZGUvY29tcGlsZS9saW5rIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLl9jb21waWxlID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9uc1xuICBpZiAob3B0aW9ucy5fbGlua0ZuKSB7XG4gICAgLy8gcHJlLXRyYW5zY2x1ZGVkIHdpdGggbGlua2VyLCBqdXN0IHVzZSBpdFxuICAgIHRoaXMuX2luaXRFbGVtZW50KGVsKVxuICAgIG9wdGlvbnMuX2xpbmtGbih0aGlzLCBlbClcbiAgfSBlbHNlIHtcbiAgICAvLyB0cmFuc2NsdWRlIGFuZCBpbml0IGVsZW1lbnRcbiAgICAvLyB0cmFuc2NsdWRlIGNhbiBwb3RlbnRpYWxseSByZXBsYWNlIG9yaWdpbmFsXG4gICAgLy8gc28gd2UgbmVlZCB0byBrZWVwIHJlZmVyZW5jZVxuICAgIHZhciBvcmlnaW5hbCA9IGVsXG4gICAgZWwgPSB0cmFuc2NsdWRlKGVsLCBvcHRpb25zKVxuICAgIHRoaXMuX2luaXRFbGVtZW50KGVsKVxuICAgIC8vIGNvbXBpbGUgYW5kIGxpbmsgdGhlIHJlc3RcbiAgICBjb21waWxlKGVsLCBvcHRpb25zKSh0aGlzLCBlbClcbiAgICAvLyBmaW5hbGx5IHJlcGxhY2Ugb3JpZ2luYWxcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBfLnJlcGxhY2Uob3JpZ2luYWwsIGVsKVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGluc3RhbmNlIGVsZW1lbnQuIENhbGxlZCBpbiB0aGUgcHVibGljXG4gKiAkbW91bnQoKSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMuX2luaXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmIChlbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICB0aGlzLl9pc0Jsb2NrID0gdHJ1ZVxuICAgIHRoaXMuJGVsID0gdGhpcy5fYmxvY2tTdGFydCA9IGVsLmZpcnN0Q2hpbGRcbiAgICB0aGlzLl9ibG9ja0VuZCA9IGVsLmxhc3RDaGlsZFxuICAgIHRoaXMuX2Jsb2NrRnJhZ21lbnQgPSBlbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuJGVsID0gZWxcbiAgfVxuICB0aGlzLiRlbC5fX3Z1ZV9fID0gdGhpc1xuICB0aGlzLl9jYWxsSG9vaygnYmVmb3JlQ29tcGlsZScpXG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBiaW5kIGEgZGlyZWN0aXZlIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBkaXJlY3RpdmUgbmFtZVxuICogQHBhcmFtIHtOb2RlfSBub2RlICAgLSB0YXJnZXQgbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IGRlc2MgLSBwYXJzZWQgZGlyZWN0aXZlIGRlc2NyaXB0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgIC0gZGlyZWN0aXZlIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZXx1bmRlZmluZWR9IGhvc3QgLSB0cmFuc2NsdXNpb24gaG9zdCBjb21wb25lbnRcbiAqL1xuXG5leHBvcnRzLl9iaW5kRGlyID0gZnVuY3Rpb24gKG5hbWUsIG5vZGUsIGRlc2MsIGRlZiwgaG9zdCkge1xuICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goXG4gICAgbmV3IERpcmVjdGl2ZShuYW1lLCBub2RlLCB0aGlzLCBkZXNjLCBkZWYsIGhvc3QpXG4gIClcbn1cblxuLyoqXG4gKiBUZWFyZG93biBhbiBpbnN0YW5jZSwgdW5vYnNlcnZlcyB0aGUgZGF0YSwgdW5iaW5kIGFsbCB0aGVcbiAqIGRpcmVjdGl2ZXMsIHR1cm4gb2ZmIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgLSB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgRE9NIG5vZGUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlZmVyQ2xlYW51cCAtIGlmIHRydWUsIGRlZmVyIGNsZWFudXAgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgY2FsbGVkIGxhdGVyXG4gKi9cblxuZXhwb3J0cy5fZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICBpZiAodGhpcy5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVEZXN0cm95JylcbiAgdGhpcy5faXNCZWluZ0Rlc3Ryb3llZCA9IHRydWVcbiAgdmFyIGlcbiAgLy8gcmVtb3ZlIHNlbGYgZnJvbSBwYXJlbnQuIG9ubHkgbmVjZXNzYXJ5XG4gIC8vIGlmIHBhcmVudCBpcyBub3QgYmVpbmcgZGVzdHJveWVkIGFzIHdlbGwuXG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgaSA9IHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZih0aGlzKVxuICAgIHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKGksIDEpXG4gIH1cbiAgLy8gc2FtZSBmb3IgdHJhbnNjbHVzaW9uIGhvc3QuXG4gIHZhciBob3N0ID0gdGhpcy5faG9zdFxuICBpZiAoaG9zdCAmJiAhaG9zdC5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIGkgPSBob3N0Ll90cmFuc0NwbnRzLmluZGV4T2YodGhpcylcbiAgICBob3N0Ll90cmFuc0NwbnRzLnNwbGljZShpLCAxKVxuICB9XG4gIC8vIGRlc3Ryb3kgYWxsIGNoaWxkcmVuLlxuICBpID0gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLl9jaGlsZHJlbltpXS4kZGVzdHJveSgpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIGRpcmVjdGl2ZXMuIHRoaXMgYWxzbyB0ZWFyc2Rvd24gYWxsXG4gIC8vIGRpcmVjdGl2ZS1vd25lZCB3YXRjaGVycy4gaW50ZW50aW9uYWxseSBjaGVjayBmb3JcbiAgLy8gZGlyZWN0aXZlcyBhcnJheSBsZW5ndGggb24gZXZlcnkgbG9vcCBzaW5jZSBkaXJlY3RpdmVzXG4gIC8vIHRoYXQgbWFuYWdlcyBwYXJ0aWFsIGNvbXBpbGF0aW9uIGNhbiBzcGxpY2Ugb25lcyBvdXRcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2RpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9kaXJlY3RpdmVzW2ldLl90ZWFyZG93bigpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIHVzZXIgd2F0Y2hlcnMuXG4gIHZhciB3YXRjaGVyXG4gIGZvciAoaSBpbiB0aGlzLl91c2VyV2F0Y2hlcnMpIHtcbiAgICB3YXRjaGVyID0gdGhpcy5fdXNlcldhdGNoZXJzW2ldXG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIHdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuICAvLyByZW1vdmUgcmVmZXJlbmNlIHRvIHNlbGYgb24gJGVsXG4gIGlmICh0aGlzLiRlbCkge1xuICAgIHRoaXMuJGVsLl9fdnVlX18gPSBudWxsXG4gIH1cbiAgLy8gcmVtb3ZlIERPTSBlbGVtZW50XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAocmVtb3ZlICYmIHRoaXMuJGVsKSB7XG4gICAgdGhpcy4kcmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2NsZWFudXAoKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAoIWRlZmVyQ2xlYW51cCkge1xuICAgIHRoaXMuX2NsZWFudXAoKVxuICB9XG59XG5cbi8qKlxuICogQ2xlYW4gdXAgdG8gZW5zdXJlIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAqIFRoaXMgaXMgY2FsbGVkIGFmdGVyIHRoZSBsZWF2ZSB0cmFuc2l0aW9uIGlmIHRoZXJlXG4gKiBpcyBhbnkuXG4gKi9cblxuZXhwb3J0cy5fY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcmVtb3ZlIHJlZmVyZW5jZSBmcm9tIGRhdGEgb2JcbiAgdGhpcy5fZGF0YS5fX29iX18ucmVtb3ZlVm0odGhpcylcbiAgdGhpcy5fZGF0YSA9XG4gIHRoaXMuX3dhdGNoZXJzID1cbiAgdGhpcy5fdXNlcldhdGNoZXJzID1cbiAgdGhpcy5fd2F0Y2hlckxpc3QgPVxuICB0aGlzLiRlbCA9XG4gIHRoaXMuJHBhcmVudCA9XG4gIHRoaXMuJHJvb3QgPVxuICB0aGlzLl9jaGlsZHJlbiA9XG4gIHRoaXMuX3RyYW5zQ3BudHMgPVxuICB0aGlzLl9kaXJlY3RpdmVzID0gbnVsbFxuICAvLyBjYWxsIHRoZSBsYXN0IGhvb2suLi5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdkZXN0cm95ZWQnKVxuICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICB0aGlzLiRvZmYoKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaW5Eb2MgPSBfLmluRG9jXG5cbi8qKlxuICogU2V0dXAgdGhlIGluc3RhbmNlJ3Mgb3B0aW9uIGV2ZW50cyAmIHdhdGNoZXJzLlxuICogSWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nLCB3ZSBwdWxsIGl0IGZyb20gdGhlXG4gKiBpbnN0YW5jZSdzIG1ldGhvZHMgYnkgbmFtZS5cbiAqL1xuXG5leHBvcnRzLl9pbml0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnNcbiAgcmVnaXN0ZXJDYWxsYmFja3ModGhpcywgJyRvbicsIG9wdGlvbnMuZXZlbnRzKVxuICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJHdhdGNoJywgb3B0aW9ucy53YXRjaClcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBjYWxsYmFja3MgZm9yIG9wdGlvbiBldmVudHMgYW5kIHdhdGNoZXJzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGhhc2hcbiAqL1xuXG5mdW5jdGlvbiByZWdpc3RlckNhbGxiYWNrcyAodm0sIGFjdGlvbiwgaGFzaCkge1xuICBpZiAoIWhhc2gpIHJldHVyblxuICB2YXIgaGFuZGxlcnMsIGtleSwgaSwgalxuICBmb3IgKGtleSBpbiBoYXNoKSB7XG4gICAgaGFuZGxlcnMgPSBoYXNoW2tleV1cbiAgICBpZiAoXy5pc0FycmF5KGhhbmRsZXJzKSkge1xuICAgICAgZm9yIChpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzW2ldKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byByZWdpc3RlciBhbiBldmVudC93YXRjaCBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gaGFuZGxlclxuICovXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyICh2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXIpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgaGFuZGxlclxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZtW2FjdGlvbl0oa2V5LCBoYW5kbGVyKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1ldGhvZHMgPSB2bS4kb3B0aW9ucy5tZXRob2RzXG4gICAgdmFyIG1ldGhvZCA9IG1ldGhvZHMgJiYgbWV0aG9kc1toYW5kbGVyXVxuICAgIGlmIChtZXRob2QpIHtcbiAgICAgIHZtW2FjdGlvbl0oa2V5LCBtZXRob2QpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1Vua25vd24gbWV0aG9kOiBcIicgKyBoYW5kbGVyICsgJ1wiIHdoZW4gJyArXG4gICAgICAgICdyZWdpc3RlcmluZyBjYWxsYmFjayBmb3IgJyArIGFjdGlvbiArXG4gICAgICAgICc6IFwiJyArIGtleSArICdcIi4nXG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgcmVjdXJzaXZlIGF0dGFjaGVkL2RldGFjaGVkIGNhbGxzXG4gKi9cblxuZXhwb3J0cy5faW5pdERPTUhvb2tzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRvbignaG9vazphdHRhY2hlZCcsIG9uQXR0YWNoZWQpXG4gIHRoaXMuJG9uKCdob29rOmRldGFjaGVkJywgb25EZXRhY2hlZClcbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0byByZWN1cnNpdmVseSBjYWxsIGF0dGFjaGVkIGhvb2sgb24gY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBvbkF0dGFjaGVkICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjYWxsQXR0YWNoKVxuICBpZiAodGhpcy5fdHJhbnNDcG50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl90cmFuc0NwbnRzLmZvckVhY2goY2FsbEF0dGFjaClcbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdG9yIHRvIGNhbGwgYXR0YWNoZWQgaG9va1xuICogXG4gKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAqL1xuXG5mdW5jdGlvbiBjYWxsQXR0YWNoIChjaGlsZCkge1xuICBpZiAoIWNoaWxkLl9pc0F0dGFjaGVkICYmIGluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgfVxufVxuXG4vKipcbiAqIENhbGxiYWNrIHRvIHJlY3Vyc2l2ZWx5IGNhbGwgZGV0YWNoZWQgaG9vayBvbiBjaGlsZHJlblxuICovXG5cbmZ1bmN0aW9uIG9uRGV0YWNoZWQgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gZmFsc2VcbiAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjYWxsRGV0YWNoKVxuICBpZiAodGhpcy5fdHJhbnNDcG50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl90cmFuc0NwbnRzLmZvckVhY2goY2FsbERldGFjaClcbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdG9yIHRvIGNhbGwgZGV0YWNoZWQgaG9va1xuICogXG4gKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAqL1xuXG5mdW5jdGlvbiBjYWxsRGV0YWNoIChjaGlsZCkge1xuICBpZiAoY2hpbGQuX2lzQXR0YWNoZWQgJiYgIWluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgfVxufVxuXG4vKipcbiAqIFRyaWdnZXIgYWxsIGhhbmRsZXJzIGZvciBhIGhvb2tcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaG9va1xuICovXG5cbmV4cG9ydHMuX2NhbGxIb29rID0gZnVuY3Rpb24gKGhvb2spIHtcbiAgdmFyIGhhbmRsZXJzID0gdGhpcy4kb3B0aW9uc1tob29rXVxuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaGFuZGxlcnNbaV0uY2FsbCh0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLiRlbWl0KCdob29rOicgKyBob29rKVxufSIsInZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG5cbi8qKlxuICogVGhlIG1haW4gaW5pdCBzZXF1ZW5jZS4gVGhpcyBpcyBjYWxsZWQgZm9yIGV2ZXJ5XG4gKiBpbnN0YW5jZSwgaW5jbHVkaW5nIG9uZXMgdGhhdCBhcmUgY3JlYXRlZCBmcm9tIGV4dGVuZGVkXG4gKiBjb25zdHJ1Y3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGlzIG9wdGlvbnMgb2JqZWN0IHNob3VsZCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgY2xhc3NcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyBhbmQgdGhlIG9wdGlvbnMgcGFzc2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuXG5leHBvcnRzLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIHRoaXMuJGVsICAgICAgICAgICA9IG51bGxcbiAgdGhpcy4kcGFyZW50ICAgICAgID0gb3B0aW9ucy5fcGFyZW50XG4gIHRoaXMuJHJvb3QgICAgICAgICA9IG9wdGlvbnMuX3Jvb3QgfHwgdGhpc1xuICB0aGlzLiQgICAgICAgICAgICAgPSB7fSAvLyBjaGlsZCB2bSByZWZlcmVuY2VzXG4gIHRoaXMuJCQgICAgICAgICAgICA9IHt9IC8vIGVsZW1lbnQgcmVmZXJlbmNlc1xuICB0aGlzLl93YXRjaGVyTGlzdCAgPSBbXSAvLyBhbGwgd2F0Y2hlcnMgYXMgYW4gYXJyYXlcbiAgdGhpcy5fd2F0Y2hlcnMgICAgID0ge30gLy8gaW50ZXJuYWwgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX3VzZXJXYXRjaGVycyA9IHt9IC8vIHVzZXIgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX2RpcmVjdGl2ZXMgICA9IFtdIC8vIGFsbCBkaXJlY3RpdmVzXG5cbiAgLy8gYSBmbGFnIHRvIGF2b2lkIHRoaXMgYmVpbmcgb2JzZXJ2ZWRcbiAgdGhpcy5faXNWdWUgPSB0cnVlXG5cbiAgLy8gZXZlbnRzIGJvb2trZWVwaW5nXG4gIHRoaXMuX2V2ZW50cyAgICAgICAgID0ge30gICAgLy8gcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgdGhpcy5fZXZlbnRzQ291bnQgICAgPSB7fSAgICAvLyBmb3IgJGJyb2FkY2FzdCBvcHRpbWl6YXRpb25cbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZSAvLyBmb3IgZXZlbnQgY2FuY2VsbGF0aW9uXG5cbiAgLy8gYmxvY2sgaW5zdGFuY2UgcHJvcGVydGllc1xuICB0aGlzLl9pc0Jsb2NrICAgICA9IGZhbHNlXG4gIHRoaXMuX2Jsb2NrU3RhcnQgID0gICAgICAgICAgLy8gQHR5cGUge0NvbW1lbnROb2RlfVxuICB0aGlzLl9ibG9ja0VuZCAgICA9IG51bGwgICAgIC8vIEB0eXBlIHtDb21tZW50Tm9kZX1cblxuICAvLyBsaWZlY3ljbGUgc3RhdGVcbiAgdGhpcy5faXNDb21waWxlZCAgPVxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9XG4gIHRoaXMuX2lzUmVhZHkgICAgID1cbiAgdGhpcy5faXNBdHRhY2hlZCAgPVxuICB0aGlzLl9pc0JlaW5nRGVzdHJveWVkID0gZmFsc2VcblxuICAvLyBjaGlsZHJlblxuICB0aGlzLl9jaGlsZHJlbiA9IFtdXG4gIHRoaXMuX2NoaWxkQ3RvcnMgPSB7fVxuXG4gIC8vIHRyYW5zY2x1c2lvbiB1bmxpbmsgZnVuY3Rpb25zXG4gIHRoaXMuX2NvbnRhaW5lclVubGlua0ZuID1cbiAgdGhpcy5fY29udGVudFVubGlua0ZuID0gbnVsbFxuXG4gIC8vIHRyYW5zY2x1ZGVkIGNvbXBvbmVudHMgdGhhdCBiZWxvbmcgdG8gdGhlIHBhcmVudC5cbiAgLy8gbmVlZCB0byBrZWVwIHRyYWNrIG9mIHRoZW0gc28gdGhhdCB3ZSBjYW4gY2FsbFxuICAvLyBhdHRhY2hlZC9kZXRhY2hlZCBob29rcyBvbiB0aGVtLlxuICB0aGlzLl90cmFuc0NwbnRzID0gW11cbiAgdGhpcy5faG9zdCA9IG9wdGlvbnMuX2hvc3RcblxuICAvLyBwdXNoIHNlbGYgaW50byBwYXJlbnQgLyB0cmFuc2NsdXNpb24gaG9zdFxuICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgdGhpcy4kcGFyZW50Ll9jaGlsZHJlbi5wdXNoKHRoaXMpXG4gIH1cbiAgaWYgKHRoaXMuX2hvc3QpIHtcbiAgICB0aGlzLl9ob3N0Ll90cmFuc0NwbnRzLnB1c2godGhpcylcbiAgfVxuXG4gIC8vIHByb3BzIHVzZWQgaW4gdi1yZXBlYXQgZGlmZmluZ1xuICB0aGlzLl9uZXcgPSB0cnVlXG4gIHRoaXMuX3JldXNlZCA9IGZhbHNlXG5cbiAgLy8gbWVyZ2Ugb3B0aW9ucy5cbiAgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5vcHRpb25zLFxuICAgIG9wdGlvbnMsXG4gICAgdGhpc1xuICApXG5cbiAgLy8gc2V0IGRhdGEgYWZ0ZXIgbWVyZ2UuXG4gIHRoaXMuX2RhdGEgPSBvcHRpb25zLmRhdGEgfHwge31cblxuICAvLyBpbml0aWFsaXplIGRhdGEgb2JzZXJ2YXRpb24gYW5kIHNjb3BlIGluaGVyaXRhbmNlLlxuICB0aGlzLl9pbml0U2NvcGUoKVxuXG4gIC8vIHNldHVwIGV2ZW50IHN5c3RlbSBhbmQgb3B0aW9uIGV2ZW50cy5cbiAgdGhpcy5faW5pdEV2ZW50cygpXG5cbiAgLy8gY2FsbCBjcmVhdGVkIGhvb2tcbiAgdGhpcy5fY2FsbEhvb2soJ2NyZWF0ZWQnKVxuXG4gIC8vIGlmIGBlbGAgb3B0aW9uIGlzIHBhc3NlZCwgc3RhcnQgY29tcGlsYXRpb24uXG4gIGlmIChvcHRpb25zLmVsKSB7XG4gICAgdGhpcy4kbW91bnQob3B0aW9ucy5lbClcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuLi9vYnNlcnZlcicpXG52YXIgRGVwID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXIvZGVwJylcblxuLyoqXG4gKiBTZXR1cCB0aGUgc2NvcGUgb2YgYW4gaW5zdGFuY2UsIHdoaWNoIGNvbnRhaW5zOlxuICogLSBvYnNlcnZlZCBkYXRhXG4gKiAtIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAqIC0gdXNlciBtZXRob2RzXG4gKiAtIG1ldGEgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydHMuX2luaXRTY29wZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5faW5pdERhdGEoKVxuICB0aGlzLl9pbml0Q29tcHV0ZWQoKVxuICB0aGlzLl9pbml0TWV0aG9kcygpXG4gIHRoaXMuX2luaXRNZXRhKClcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkYXRhLiBcbiAqL1xuXG5leHBvcnRzLl9pbml0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxuICB2YXIgZGF0YSA9IHRoaXMuX2RhdGFcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXlcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzLl9wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIC8vIG9ic2VydmUgZGF0YVxuICBPYnNlcnZlci5jcmVhdGUoZGF0YSkuYWRkVm0odGhpcylcbn1cblxuLyoqXG4gKiBTd2FwIHRoZSBpc250YW5jZSdzICRkYXRhLiBDYWxsZWQgaW4gJGRhdGEncyBzZXR0ZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5ld0RhdGFcbiAqL1xuXG5leHBvcnRzLl9zZXREYXRhID0gZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgbmV3RGF0YSA9IG5ld0RhdGEgfHwge31cbiAgdmFyIG9sZERhdGEgPSB0aGlzLl9kYXRhXG4gIHRoaXMuX2RhdGEgPSBuZXdEYXRhXG4gIHZhciBrZXlzLCBrZXksIGlcbiAgLy8gdW5wcm94eSBrZXlzIG5vdCBwcmVzZW50IGluIG5ldyBkYXRhXG4gIGtleXMgPSBPYmplY3Qua2V5cyhvbGREYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpICYmICEoa2V5IGluIG5ld0RhdGEpKSB7XG4gICAgICB0aGlzLl91bnByb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gcHJveHkga2V5cyBub3QgYWxyZWFkeSBwcm94aWVkLFxuICAvLyBhbmQgdHJpZ2dlciBjaGFuZ2UgZm9yIGNoYW5nZWQgdmFsdWVzXG4gIGtleXMgPSBPYmplY3Qua2V5cyhuZXdEYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIC8vIG5ldyBwcm9wZXJ0eVxuICAgICAgdGhpcy5fcHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICBvbGREYXRhLl9fb2JfXy5yZW1vdmVWbSh0aGlzKVxuICBPYnNlcnZlci5jcmVhdGUobmV3RGF0YSkuYWRkVm0odGhpcylcbiAgdGhpcy5fZGlnZXN0KClcbn1cblxuLyoqXG4gKiBQcm94eSBhIHByb3BlcnR5LCBzbyB0aGF0XG4gKiB2bS5wcm9wID09PSB2bS5fZGF0YS5wcm9wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3Byb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICAvLyBuZWVkIHRvIHN0b3JlIHJlZiB0byBzZWxmIGhlcmVcbiAgLy8gYmVjYXVzZSB0aGVzZSBnZXR0ZXIvc2V0dGVycyBtaWdodFxuICAvLyBiZSBjYWxsZWQgYnkgY2hpbGQgaW5zdGFuY2VzIVxuICB2YXIgc2VsZiA9IHRoaXNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsIGtleSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gcHJveHlHZXR0ZXIgKCkge1xuICAgICAgcmV0dXJuIHNlbGYuX2RhdGFba2V5XVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBwcm94eVNldHRlciAodmFsKSB7XG4gICAgICBzZWxmLl9kYXRhW2tleV0gPSB2YWxcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogVW5wcm94eSBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLl91bnByb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICBkZWxldGUgdGhpc1trZXldXG59XG5cbi8qKlxuICogRm9yY2UgdXBkYXRlIG9uIGV2ZXJ5IHdhdGNoZXIgaW4gc2NvcGUuXG4gKi9cblxuZXhwb3J0cy5fZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSA9IHRoaXMuX3dhdGNoZXJMaXN0Lmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5fd2F0Y2hlckxpc3RbaV0udXBkYXRlKClcbiAgfVxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlblxuICBpID0gY2hpbGRyZW4ubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZC4kb3B0aW9ucy5pbmhlcml0KSB7XG4gICAgICBjaGlsZC5fZGlnZXN0KClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCBjb21wdXRlZCBwcm9wZXJ0aWVzLiBUaGV5IGFyZSBlc3NlbnRpYWxseVxuICogc3BlY2lhbCBnZXR0ZXIvc2V0dGVyc1xuICovXG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cbmV4cG9ydHMuX2luaXRDb21wdXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbXB1dGVkID0gdGhpcy4kb3B0aW9ucy5jb21wdXRlZFxuICBpZiAoY29tcHV0ZWQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcbiAgICAgIHZhciB1c2VyRGVmID0gY29tcHV0ZWRba2V5XVxuICAgICAgdmFyIGRlZiA9IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVmLmdldCA9IF8uYmluZCh1c2VyRGVmLCB0aGlzKVxuICAgICAgICBkZWYuc2V0ID0gbm9vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmLmdldCA9IHVzZXJEZWYuZ2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5nZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICAgIGRlZi5zZXQgPSB1c2VyRGVmLnNldFxuICAgICAgICAgID8gXy5iaW5kKHVzZXJEZWYuc2V0LCB0aGlzKVxuICAgICAgICAgIDogbm9vcFxuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgZGVmKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIGluc3RhbmNlIG1ldGhvZHMuIE1ldGhvZHMgbXVzdCBiZSBib3VuZCB0byB0aGVcbiAqIGluc3RhbmNlIHNpbmNlIHRoZXkgbWlnaHQgYmUgY2FsbGVkIGJ5IGNoaWxkcmVuXG4gKiBpbmhlcml0aW5nIHRoZW0uXG4gKi9cblxuZXhwb3J0cy5faW5pdE1ldGhvZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRob2RzID0gdGhpcy4kb3B0aW9ucy5tZXRob2RzXG4gIGlmIChtZXRob2RzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIHRoaXNba2V5XSA9IF8uYmluZChtZXRob2RzW2tleV0sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBtZXRhIGluZm9ybWF0aW9uIGxpa2UgJGluZGV4LCAka2V5ICYgJHZhbHVlLlxuICovXG5cbmV4cG9ydHMuX2luaXRNZXRhID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWV0YXMgPSB0aGlzLiRvcHRpb25zLl9tZXRhXG4gIGlmIChtZXRhcykge1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRhcykge1xuICAgICAgdGhpcy5fZGVmaW5lTWV0YShrZXksIG1ldGFzW2tleV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbWV0YSBwcm9wZXJ0eSwgZS5nICRpbmRleCwgJGtleSwgJHZhbHVlXG4gKiB3aGljaCBvbmx5IGV4aXN0cyBvbiB0aGUgdm0gaW5zdGFuY2UgYnV0IG5vdCBpbiAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuZXhwb3J0cy5fZGVmaW5lTWV0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBkZXAgPSBuZXcgRGVwKClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gbWV0YUdldHRlciAoKSB7XG4gICAgICBpZiAoT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIG1ldGFTZXR0ZXIgKHZhbCkge1xuICAgICAgaWYgKHZhbCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB2YWxcbiAgICAgICAgZGVwLm5vdGlmeSgpXG4gICAgICB9XG4gICAgfVxuICB9KVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90bylcblxuLyoqXG4gKiBJbnRlcmNlcHQgbXV0YXRpbmcgbWV0aG9kcyBhbmQgZW1pdCBldmVudHNcbiAqL1xuXG47W1xuICAncHVzaCcsXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnLFxuICAnc29ydCcsXG4gICdyZXZlcnNlJ1xuXVxuLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdXG4gIF8uZGVmaW5lKGFycmF5TWV0aG9kcywgbWV0aG9kLCBmdW5jdGlvbiBtdXRhdG9yICgpIHtcbiAgICAvLyBhdm9pZCBsZWFraW5nIGFyZ3VtZW50czpcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSlcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgdmFyIGluc2VydGVkXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICBpZiAoaW5zZXJ0ZWQpIG9iLm9ic2VydmVBcnJheShpbnNlcnRlZClcbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2Iubm90aWZ5KClcbiAgICByZXR1cm4gcmVzdWx0XG4gIH0pXG59KVxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4IHdpdGggYSBuZXcgdmFsdWVcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4geyp9IC0gcmVwbGFjZWQgZWxlbWVudFxuICovXG5cbl8uZGVmaW5lKFxuICBhcnJheVByb3RvLFxuICAnJHNldCcsXG4gIGZ1bmN0aW9uICRzZXQgKGluZGV4LCB2YWwpIHtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gaW5kZXggKyAxXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSwgdmFsKVswXVxuICB9XG4pXG5cbi8qKlxuICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIHJlbW92ZSB0aGUgZWxlbWVudCBhdCBnaXZlbiBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckcmVtb3ZlJyxcbiAgZnVuY3Rpb24gJHJlbW92ZSAoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgaW5kZXggPSB0aGlzLmluZGV4T2YoaW5kZXgpXG4gICAgfVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gICAgfVxuICB9XG4pXG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNZXRob2RzIiwidmFyIHVpZCA9IDBcbnZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXG4gKiBkaXJlY3RpdmVzIHN1YnNjcmliaW5nIHRvIGl0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERlcCAoKSB7XG4gIHRoaXMuaWQgPSArK3VpZFxuICB0aGlzLnN1YnMgPSBbXVxufVxuXG52YXIgcCA9IERlcC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5hZGRTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHRoaXMuc3Vicy5wdXNoKHN1Yilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5yZW1vdmVTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIGlmICh0aGlzLnN1YnMubGVuZ3RoKSB7XG4gICAgdmFyIGkgPSB0aGlzLnN1YnMuaW5kZXhPZihzdWIpXG4gICAgaWYgKGkgPiAtMSkgdGhpcy5zdWJzLnNwbGljZShpLCAxKVxuICB9XG59XG5cbi8qKlxuICogTm90aWZ5IGFsbCBzdWJzY3JpYmVycyBvZiBhIG5ldyB2YWx1ZS5cbiAqL1xuXG5wLm5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gc3RhYmxpemUgdGhlIHN1YnNjcmliZXIgbGlzdCBmaXJzdFxuICB2YXIgc3VicyA9IF8udG9BcnJheSh0aGlzLnN1YnMpXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc3Vicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBzdWJzW2ldLnVwZGF0ZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXAiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgRGVwID0gcmVxdWlyZSgnLi9kZXAnKVxudmFyIGFycmF5TWV0aG9kcyA9IHJlcXVpcmUoJy4vYXJyYXknKVxudmFyIGFycmF5S2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFycmF5TWV0aG9kcylcbnJlcXVpcmUoJy4vb2JqZWN0JylcblxudmFyIHVpZCA9IDBcblxuLyoqXG4gKiBUeXBlIGVudW1zXG4gKi9cblxudmFyIEFSUkFZICA9IDBcbnZhciBPQkpFQ1QgPSAxXG5cbi8qKlxuICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGludGVyY2VwdGluZ1xuICogdGhlIHByb3RvdHlwZSBjaGFpbiB1c2luZyBfX3Byb3RvX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG9cbiAqL1xuXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gIHRhcmdldC5fX3Byb3RvX18gPSBzcmNcbn1cblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgZGVmaW5pbmdcbiAqIGhpZGRlbiBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b1xuICovXG5cbmZ1bmN0aW9uIGNvcHlBdWdtZW50ICh0YXJnZXQsIHNyYywga2V5cykge1xuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXlcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBfLmRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pXG4gIH1cbn1cblxuLyoqXG4gKiBPYnNlcnZlciBjbGFzcyB0aGF0IGFyZSBhdHRhY2hlZCB0byBlYWNoIG9ic2VydmVkXG4gKiBvYmplY3QuIE9uY2UgYXR0YWNoZWQsIHRoZSBvYnNlcnZlciBjb252ZXJ0cyB0YXJnZXRcbiAqIG9iamVjdCdzIHByb3BlcnR5IGtleXMgaW50byBnZXR0ZXIvc2V0dGVycyB0aGF0XG4gKiBjb2xsZWN0IGRlcGVuZGVuY2llcyBhbmQgZGlzcGF0Y2hlcyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSB2YWx1ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGVcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIE9ic2VydmVyICh2YWx1ZSwgdHlwZSkge1xuICB0aGlzLmlkID0gKyt1aWRcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICB0aGlzLmRlcHMgPSBbXVxuICBfLmRlZmluZSh2YWx1ZSwgJ19fb2JfXycsIHRoaXMpXG4gIGlmICh0eXBlID09PSBBUlJBWSkge1xuICAgIHZhciBhdWdtZW50ID0gY29uZmlnLnByb3RvICYmIF8uaGFzUHJvdG9cbiAgICAgID8gcHJvdG9BdWdtZW50XG4gICAgICA6IGNvcHlBdWdtZW50XG4gICAgYXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpXG4gICAgdGhpcy5vYnNlcnZlQXJyYXkodmFsdWUpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gT0JKRUNUKSB7XG4gICAgdGhpcy53YWxrKHZhbHVlKVxuICB9XG59XG5cbk9ic2VydmVyLnRhcmdldCA9IG51bGxcblxudmFyIHAgPSBPYnNlcnZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBmb3IgYSB2YWx1ZSxcbiAqIHJldHVybnMgdGhlIG5ldyBvYnNlcnZlciBpZiBzdWNjZXNzZnVsbHkgb2JzZXJ2ZWQsXG4gKiBvciB0aGUgZXhpc3Rpbmcgb2JzZXJ2ZXIgaWYgdGhlIHZhbHVlIGFscmVhZHkgaGFzIG9uZS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtPYnNlcnZlcnx1bmRlZmluZWR9XG4gKiBAc3RhdGljXG4gKi9cblxuT2JzZXJ2ZXIuY3JlYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmIChcbiAgICB2YWx1ZSAmJlxuICAgIHZhbHVlLmhhc093blByb3BlcnR5KCdfX29iX18nKSAmJlxuICAgIHZhbHVlLl9fb2JfXyBpbnN0YW5jZW9mIE9ic2VydmVyXG4gICkge1xuICAgIHJldHVybiB2YWx1ZS5fX29iX19cbiAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcih2YWx1ZSwgQVJSQVkpXG4gIH0gZWxzZSBpZiAoXG4gICAgXy5pc1BsYWluT2JqZWN0KHZhbHVlKSAmJlxuICAgICF2YWx1ZS5faXNWdWUgLy8gYXZvaWQgVnVlIGluc3RhbmNlXG4gICkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIodmFsdWUsIE9CSkVDVClcbiAgfVxufVxuXG4vKipcbiAqIFdhbGsgdGhyb3VnaCBlYWNoIHByb3BlcnR5IGFuZCBjb252ZXJ0IHRoZW0gaW50b1xuICogZ2V0dGVyL3NldHRlcnMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aGVuXG4gKiB2YWx1ZSB0eXBlIGlzIE9iamVjdC4gUHJvcGVydGllcyBwcmVmaXhlZCB3aXRoIGAkYCBvciBgX2BcbiAqIGFuZCBhY2Nlc3NvciBwcm9wZXJ0aWVzIGFyZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5wLndhbGsgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXksIHByZWZpeFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIHByZWZpeCA9IGtleS5jaGFyQ29kZUF0KDApXG4gICAgaWYgKHByZWZpeCAhPT0gMHgyNCAmJiBwcmVmaXggIT09IDB4NUYpIHsgLy8gc2tpcCAkIG9yIF9cbiAgICAgIHRoaXMuY29udmVydChrZXksIG9ialtrZXldKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyeSB0byBjYXJldGUgYW4gb2JzZXJ2ZXIgZm9yIGEgY2hpbGQgdmFsdWUsXG4gKiBhbmQgaWYgdmFsdWUgaXMgYXJyYXksIGxpbmsgZGVwIHRvIHRoZSBhcnJheS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7RGVwfHVuZGVmaW5lZH1cbiAqL1xuXG5wLm9ic2VydmUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiBPYnNlcnZlci5jcmVhdGUodmFsKVxufVxuXG4vKipcbiAqIE9ic2VydmUgYSBsaXN0IG9mIEFycmF5IGl0ZW1zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXG4gKi9cblxucC5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgdmFyIGkgPSBpdGVtcy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMub2JzZXJ2ZShpdGVtc1tpXSlcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBwcm9wZXJ0eSBpbnRvIGdldHRlci9zZXR0ZXIgc28gd2UgY2FuIGVtaXRcbiAqIHRoZSBldmVudHMgd2hlbiB0aGUgcHJvcGVydHkgaXMgYWNjZXNzZWQvY2hhbmdlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbnAuY29udmVydCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICB2YXIgb2IgPSB0aGlzXG4gIHZhciBjaGlsZE9iID0gb2Iub2JzZXJ2ZSh2YWwpXG4gIHZhciBkZXAgPSBuZXcgRGVwKClcbiAgaWYgKGNoaWxkT2IpIHtcbiAgICBjaGlsZE9iLmRlcHMucHVzaChkZXApXG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLnZhbHVlLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIE9ic2VydmVyLnRhcmdldCBpcyBhIHdhdGNoZXIgd2hvc2UgZ2V0dGVyIGlzXG4gICAgICAvLyBjdXJyZW50bHkgYmVpbmcgZXZhbHVhdGVkLlxuICAgICAgaWYgKG9iLmFjdGl2ZSAmJiBPYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgT2JzZXJ2ZXIudGFyZ2V0LmFkZERlcChkZXApXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwgPT09IHZhbCkgcmV0dXJuXG4gICAgICAvLyByZW1vdmUgZGVwIGZyb20gb2xkIHZhbHVlXG4gICAgICB2YXIgb2xkQ2hpbGRPYiA9IHZhbCAmJiB2YWwuX19vYl9fXG4gICAgICBpZiAob2xkQ2hpbGRPYikge1xuICAgICAgICB2YXIgb2xkRGVwcyA9IG9sZENoaWxkT2IuZGVwc1xuICAgICAgICBvbGREZXBzLnNwbGljZShvbGREZXBzLmluZGV4T2YoZGVwKSwgMSlcbiAgICAgIH1cbiAgICAgIHZhbCA9IG5ld1ZhbFxuICAgICAgLy8gYWRkIGRlcCB0byBuZXcgdmFsdWVcbiAgICAgIHZhciBuZXdDaGlsZE9iID0gb2Iub2JzZXJ2ZShuZXdWYWwpXG4gICAgICBpZiAobmV3Q2hpbGRPYikge1xuICAgICAgICBuZXdDaGlsZE9iLmRlcHMucHVzaChkZXApXG4gICAgICB9XG4gICAgICBkZXAubm90aWZ5KClcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogTm90aWZ5IGNoYW5nZSBvbiBhbGwgc2VsZiBkZXBzIG9uIGFuIG9ic2VydmVyLlxuICogVGhpcyBpcyBjYWxsZWQgd2hlbiBhIG11dGFibGUgdmFsdWUgbXV0YXRlcy4gZS5nLlxuICogd2hlbiBhbiBBcnJheSdzIG11dGF0aW5nIG1ldGhvZHMgYXJlIGNhbGxlZCwgb3IgYW5cbiAqIE9iamVjdCdzICRhZGQvJGRlbGV0ZSBhcmUgY2FsbGVkLlxuICovXG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGVwcyA9IHRoaXMuZGVwc1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGRlcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZGVwc1tpXS5ub3RpZnkoKVxuICB9XG59XG5cbi8qKlxuICogQWRkIGFuIG93bmVyIHZtLCBzbyB0aGF0IHdoZW4gJGFkZC8kZGVsZXRlIG11dGF0aW9uc1xuICogaGFwcGVuIHdlIGNhbiBub3RpZnkgb3duZXIgdm1zIHRvIHByb3h5IHRoZSBrZXlzIGFuZFxuICogZGlnZXN0IHRoZSB3YXRjaGVycy4gVGhpcyBpcyBvbmx5IGNhbGxlZCB3aGVuIHRoZSBvYmplY3RcbiAqIGlzIG9ic2VydmVkIGFzIGFuIGluc3RhbmNlJ3Mgcm9vdCAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLmFkZFZtID0gZnVuY3Rpb24gKHZtKSB7XG4gICh0aGlzLnZtcyA9IHRoaXMudm1zIHx8IFtdKS5wdXNoKHZtKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBvd25lciB2bS4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgb2JqZWN0IGlzXG4gKiBzd2FwcGVkIG91dCBhcyBhbiBpbnN0YW5jZSdzICRkYXRhIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLnJlbW92ZVZtID0gZnVuY3Rpb24gKHZtKSB7XG4gIHRoaXMudm1zLnNwbGljZSh0aGlzLnZtcy5pbmRleE9mKHZtKSwgMSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZlclxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBvYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBuZXcgcHJvcGVydHkgdG8gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGFkZCcsXG4gIGZ1bmN0aW9uICRhZGQgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBvYi5jb252ZXJ0KGtleSwgdmFsKVxuICAgIGlmIChvYi52bXMpIHtcbiAgICAgIHZhciBpID0gb2Iudm1zLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgdm0gPSBvYi52bXNbaV1cbiAgICAgICAgdm0uX3Byb3h5KGtleSlcbiAgICAgICAgdm0uX2RpZ2VzdCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iLm5vdGlmeSgpXG4gICAgfVxuICB9XG4pXG5cbi8qKlxuICogU2V0IGEgcHJvcGVydHkgb24gYW4gb2JzZXJ2ZWQgb2JqZWN0LCBjYWxsaW5nIGFkZCB0b1xuICogZW5zdXJlIHRoZSBwcm9wZXJ0eSBpcyBvYnNlcnZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRzZXQnLFxuICBmdW5jdGlvbiAkc2V0IChrZXksIHZhbCkge1xuICAgIHRoaXMuJGFkZChrZXksIHZhbClcbiAgICB0aGlzW2tleV0gPSB2YWxcbiAgfVxuKVxuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBmcm9tIGFuIG9ic2VydmVkIG9iamVjdFxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGRlbGV0ZScsXG4gIGZ1bmN0aW9uICRkZWxldGUgKGtleSkge1xuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm5cbiAgICBkZWxldGUgdGhpc1trZXldXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fdW5wcm94eShrZXkpXG4gICAgICAgIHZtLl9kaWdlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYi5ub3RpZnkoKVxuICAgIH1cbiAgfVxuKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBhcmdSRSA9IC9eW15cXHtcXD9dKyR8XidbXiddKickfF5cIlteXCJdKlwiJC9cbnZhciBmaWx0ZXJUb2tlblJFID0gL1teXFxzJ1wiXSt8J1teJ10rJ3xcIlteXCJdK1wiL2dcblxuLyoqXG4gKiBQYXJzZXIgc3RhdGVcbiAqL1xuXG52YXIgc3RyXG52YXIgYywgaSwgbFxudmFyIGluU2luZ2xlXG52YXIgaW5Eb3VibGVcbnZhciBjdXJseVxudmFyIHNxdWFyZVxudmFyIHBhcmVuXG52YXIgYmVnaW5cbnZhciBhcmdJbmRleFxudmFyIGRpcnNcbnZhciBkaXJcbnZhciBsYXN0RmlsdGVySW5kZXhcbnZhciBhcmdcblxuLyoqXG4gKiBQdXNoIGEgZGlyZWN0aXZlIG9iamVjdCBpbnRvIHRoZSByZXN1bHQgQXJyYXlcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRGlyICgpIHtcbiAgZGlyLnJhdyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gIGlmIChkaXIuZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZGlyLmV4cHJlc3Npb24gPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gYmVnaW4pIHtcbiAgICBwdXNoRmlsdGVyKClcbiAgfVxuICBpZiAoaSA9PT0gMCB8fCBkaXIuZXhwcmVzc2lvbikge1xuICAgIGRpcnMucHVzaChkaXIpXG4gIH1cbn1cblxuLyoqXG4gKiBQdXNoIGEgZmlsdGVyIHRvIHRoZSBjdXJyZW50IGRpcmVjdGl2ZSBvYmplY3RcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRmlsdGVyICgpIHtcbiAgdmFyIGV4cCA9IHN0ci5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKVxuICB2YXIgZmlsdGVyXG4gIGlmIChleHApIHtcbiAgICBmaWx0ZXIgPSB7fVxuICAgIHZhciB0b2tlbnMgPSBleHAubWF0Y2goZmlsdGVyVG9rZW5SRSlcbiAgICBmaWx0ZXIubmFtZSA9IHRva2Vuc1swXVxuICAgIGZpbHRlci5hcmdzID0gdG9rZW5zLmxlbmd0aCA+IDEgPyB0b2tlbnMuc2xpY2UoMSkgOiBudWxsXG4gIH1cbiAgaWYgKGZpbHRlcikge1xuICAgIChkaXIuZmlsdGVycyA9IGRpci5maWx0ZXJzIHx8IFtdKS5wdXNoKGZpbHRlcilcbiAgfVxuICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxufVxuXG4vKipcbiAqIFBhcnNlIGEgZGlyZWN0aXZlIHN0cmluZyBpbnRvIGFuIEFycmF5IG9mIEFTVC1saWtlXG4gKiBvYmplY3RzIHJlcHJlc2VudGluZyBkaXJlY3RpdmVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogXCJjbGljazogYSA9IGEgKyAxIHwgdXBwZXJjYXNlXCIgd2lsbCB5aWVsZDpcbiAqIHtcbiAqICAgYXJnOiAnY2xpY2snLFxuICogICBleHByZXNzaW9uOiAnYSA9IGEgKyAxJyxcbiAqICAgZmlsdGVyczogW1xuICogICAgIHsgbmFtZTogJ3VwcGVyY2FzZScsIGFyZ3M6IG51bGwgfVxuICogICBdXG4gKiB9XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHMpIHtcblxuICB2YXIgaGl0ID0gY2FjaGUuZ2V0KHMpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICAvLyByZXNldCBwYXJzZXIgc3RhdGVcbiAgc3RyID0gc1xuICBpblNpbmdsZSA9IGluRG91YmxlID0gZmFsc2VcbiAgY3VybHkgPSBzcXVhcmUgPSBwYXJlbiA9IGJlZ2luID0gYXJnSW5kZXggPSAwXG4gIGxhc3RGaWx0ZXJJbmRleCA9IDBcbiAgZGlycyA9IFtdXG4gIGRpciA9IHt9XG4gIGFyZyA9IG51bGxcblxuICBmb3IgKGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChpblNpbmdsZSkge1xuICAgICAgLy8gY2hlY2sgc2luZ2xlIHF1b3RlXG4gICAgICBpZiAoYyA9PT0gMHgyNykgaW5TaW5nbGUgPSAhaW5TaW5nbGVcbiAgICB9IGVsc2UgaWYgKGluRG91YmxlKSB7XG4gICAgICAvLyBjaGVjayBkb3VibGUgcXVvdGVcbiAgICAgIGlmIChjID09PSAweDIyKSBpbkRvdWJsZSA9ICFpbkRvdWJsZVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDJDICYmIC8vIGNvbW1hXG4gICAgICAhcGFyZW4gJiYgIWN1cmx5ICYmICFzcXVhcmVcbiAgICApIHtcbiAgICAgIC8vIHJlYWNoZWQgdGhlIGVuZCBvZiBhIGRpcmVjdGl2ZVxuICAgICAgcHVzaERpcigpXG4gICAgICAvLyByZXNldCAmIHNraXAgdGhlIGNvbW1hXG4gICAgICBkaXIgPSB7fVxuICAgICAgYmVnaW4gPSBhcmdJbmRleCA9IGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4M0EgJiYgLy8gY29sb25cbiAgICAgICFkaXIuZXhwcmVzc2lvbiAmJlxuICAgICAgIWRpci5hcmdcbiAgICApIHtcbiAgICAgIC8vIGFyZ3VtZW50XG4gICAgICBhcmcgPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICAgICAgLy8gdGVzdCBmb3IgdmFsaWQgYXJndW1lbnQgaGVyZVxuICAgICAgLy8gc2luY2Ugd2UgbWF5IGhhdmUgY2F1Z2h0IHN0dWZmIGxpa2UgZmlyc3QgaGFsZiBvZlxuICAgICAgLy8gYW4gb2JqZWN0IGxpdGVyYWwgb3IgYSB0ZXJuYXJ5IGV4cHJlc3Npb24uXG4gICAgICBpZiAoYXJnUkUudGVzdChhcmcpKSB7XG4gICAgICAgIGFyZ0luZGV4ID0gaSArIDFcbiAgICAgICAgZGlyLmFyZyA9IF8uc3RyaXBRdW90ZXMoYXJnKSB8fCBhcmdcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHg3QyAmJiAvLyBwaXBlXG4gICAgICBzdHIuY2hhckNvZGVBdChpICsgMSkgIT09IDB4N0MgJiZcbiAgICAgIHN0ci5jaGFyQ29kZUF0KGkgLSAxKSAhPT0gMHg3Q1xuICAgICkge1xuICAgICAgaWYgKGRpci5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZmlyc3QgZmlsdGVyLCBlbmQgb2YgZXhwcmVzc2lvblxuICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhbHJlYWR5IGhhcyBmaWx0ZXJcbiAgICAgICAgcHVzaEZpbHRlcigpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlIDB4MjI6IGluRG91YmxlID0gdHJ1ZTsgYnJlYWsgLy8gXCJcbiAgICAgICAgY2FzZSAweDI3OiBpblNpbmdsZSA9IHRydWU7IGJyZWFrIC8vICdcbiAgICAgICAgY2FzZSAweDI4OiBwYXJlbisrOyBicmVhayAgICAgICAgIC8vIChcbiAgICAgICAgY2FzZSAweDI5OiBwYXJlbi0tOyBicmVhayAgICAgICAgIC8vIClcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgIC8vIFtcbiAgICAgICAgY2FzZSAweDVEOiBzcXVhcmUtLTsgYnJlYWsgICAgICAgIC8vIF1cbiAgICAgICAgY2FzZSAweDdCOiBjdXJseSsrOyBicmVhayAgICAgICAgIC8vIHtcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaSA9PT0gMCB8fCBiZWdpbiAhPT0gaSkge1xuICAgIHB1c2hEaXIoKVxuICB9XG5cbiAgY2FjaGUucHV0KHMsIGRpcnMpXG4gIHJldHVybiBkaXJzXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBleHByZXNzaW9uQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcblxudmFyIGFsbG93ZWRLZXl3b3JkcyA9XG4gICdNYXRoLERhdGUsdGhpcyx0cnVlLGZhbHNlLG51bGwsdW5kZWZpbmVkLEluZmluaXR5LE5hTiwnICtcbiAgJ2lzTmFOLGlzRmluaXRlLGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLCcgK1xuICAnZW5jb2RlVVJJQ29tcG9uZW50LHBhcnNlSW50LHBhcnNlRmxvYXQnXG52YXIgYWxsb3dlZEtleXdvcmRzUkUgPVxuICBuZXcgUmVnRXhwKCdeKCcgKyBhbGxvd2VkS2V5d29yZHMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8JykgKyAnXFxcXGIpJylcblxuLy8ga2V5d29yZHMgdGhhdCBkb24ndCBtYWtlIHNlbnNlIGluc2lkZSBleHByZXNzaW9uc1xudmFyIGltcHJvcGVyS2V5d29yZHMgPVxuICAnYnJlYWssY2FzZSxjbGFzcyxjYXRjaCxjb25zdCxjb250aW51ZSxkZWJ1Z2dlcixkZWZhdWx0LCcgK1xuICAnZGVsZXRlLGRvLGVsc2UsZXhwb3J0LGV4dGVuZHMsZmluYWxseSxmb3IsZnVuY3Rpb24saWYsJyArXG4gICdpbXBvcnQsaW4saW5zdGFuY2VvZixsZXQscmV0dXJuLHN1cGVyLHN3aXRjaCx0aHJvdyx0cnksJyArXG4gICd2YXIsd2hpbGUsd2l0aCx5aWVsZCxlbnVtLGF3YWl0LGltcGxlbWVudHMscGFja2FnZSwnICtcbiAgJ3Byb2N0ZWN0ZWQsc3RhdGljLGludGVyZmFjZSxwcml2YXRlLHB1YmxpYydcbnZhciBpbXByb3BlcktleXdvcmRzUkUgPVxuICBuZXcgUmVnRXhwKCdeKCcgKyBpbXByb3BlcktleXdvcmRzLnJlcGxhY2UoLywvZywgJ1xcXFxifCcpICsgJ1xcXFxiKScpXG5cbnZhciB3c1JFID0gL1xccy9nXG52YXIgbmV3bGluZVJFID0gL1xcbi9nXG52YXIgc2F2ZVJFID0gL1tcXHssXVxccypbXFx3XFwkX10rXFxzKjp8KCdbXiddKid8XCJbXlwiXSpcIil8bmV3IHx0eXBlb2YgfHZvaWQgL2dcbnZhciByZXN0b3JlUkUgPSAvXCIoXFxkKylcIi9nXG52YXIgcGF0aFRlc3RSRSA9IC9eW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJy4qPydcXF18XFxbXCIuKj9cIlxcXXxcXFtcXGQrXFxdKSokL1xudmFyIHBhdGhSZXBsYWNlUkUgPSAvW15cXHckXFwuXShbQS1aYS16XyRdW1xcdyRdKihcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFsnLio/J1xcXXxcXFtcIi4qP1wiXFxdKSopL2dcbnZhciBib29sZWFuTGl0ZXJhbFJFID0gL14odHJ1ZXxmYWxzZSkkL1xuXG4vKipcbiAqIFNhdmUgLyBSZXdyaXRlIC8gUmVzdG9yZVxuICpcbiAqIFdoZW4gcmV3cml0aW5nIHBhdGhzIGZvdW5kIGluIGFuIGV4cHJlc3Npb24sIGl0IGlzXG4gKiBwb3NzaWJsZSBmb3IgdGhlIHNhbWUgbGV0dGVyIHNlcXVlbmNlcyB0byBiZSBmb3VuZCBpblxuICogc3RyaW5ncyBhbmQgT2JqZWN0IGxpdGVyYWwgcHJvcGVydHkga2V5cy4gVGhlcmVmb3JlIHdlXG4gKiByZW1vdmUgYW5kIHN0b3JlIHRoZXNlIHBhcnRzIGluIGEgdGVtcG9yYXJ5IGFycmF5LCBhbmRcbiAqIHJlc3RvcmUgdGhlbSBhZnRlciB0aGUgcGF0aCByZXdyaXRlLlxuICovXG5cbnZhciBzYXZlZCA9IFtdXG5cbi8qKlxuICogU2F2ZSByZXBsYWNlclxuICpcbiAqIFRoZSBzYXZlIHJlZ2V4IGNhbiBtYXRjaCB0d28gcG9zc2libGUgY2FzZXM6XG4gKiAxLiBBbiBvcGVuaW5nIG9iamVjdCBsaXRlcmFsXG4gKiAyLiBBIHN0cmluZ1xuICogSWYgbWF0Y2hlZCBhcyBhIHBsYWluIHN0cmluZywgd2UgbmVlZCB0byBlc2NhcGUgaXRzXG4gKiBuZXdsaW5lcywgc2luY2UgdGhlIHN0cmluZyBuZWVkcyB0byBiZSBwcmVzZXJ2ZWQgd2hlblxuICogZ2VuZXJhdGluZyB0aGUgZnVuY3Rpb24gYm9keS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gaXNTdHJpbmcgLSBzdHIgaWYgbWF0Y2hlZCBhcyBhIHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSAtIHBsYWNlaG9sZGVyIHdpdGggaW5kZXhcbiAqL1xuXG5mdW5jdGlvbiBzYXZlIChzdHIsIGlzU3RyaW5nKSB7XG4gIHZhciBpID0gc2F2ZWQubGVuZ3RoXG4gIHNhdmVkW2ldID0gaXNTdHJpbmdcbiAgICA/IHN0ci5yZXBsYWNlKG5ld2xpbmVSRSwgJ1xcXFxuJylcbiAgICA6IHN0clxuICByZXR1cm4gJ1wiJyArIGkgKyAnXCInXG59XG5cbi8qKlxuICogUGF0aCByZXdyaXRlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHJld3JpdGUgKHJhdykge1xuICB2YXIgYyA9IHJhdy5jaGFyQXQoMClcbiAgdmFyIHBhdGggPSByYXcuc2xpY2UoMSlcbiAgaWYgKGFsbG93ZWRLZXl3b3Jkc1JFLnRlc3QocGF0aCkpIHtcbiAgICByZXR1cm4gcmF3XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHBhdGguaW5kZXhPZignXCInKSA+IC0xXG4gICAgICA/IHBhdGgucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gICAgICA6IHBhdGhcbiAgICByZXR1cm4gYyArICdzY29wZS4nICsgcGF0aFxuICB9XG59XG5cbi8qKlxuICogUmVzdG9yZSByZXBsYWNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpIC0gbWF0Y2hlZCBzYXZlIGluZGV4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gcmVzdG9yZSAoc3RyLCBpKSB7XG4gIHJldHVybiBzYXZlZFtpXVxufVxuXG4vKipcbiAqIFJld3JpdGUgYW4gZXhwcmVzc2lvbiwgcHJlZml4aW5nIGFsbCBwYXRoIGFjY2Vzc29ycyB3aXRoXG4gKiBgc2NvcGUuYCBhbmQgZ2VuZXJhdGUgZ2V0dGVyL3NldHRlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtCb29sZWFufSBuZWVkU2V0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRXhwRm5zIChleHAsIG5lZWRTZXQpIHtcbiAgaWYgKGltcHJvcGVyS2V5d29yZHNSRS50ZXN0KGV4cCkpIHtcbiAgICBfLndhcm4oXG4gICAgICAnQXZvaWQgdXNpbmcgcmVzZXJ2ZWQga2V5d29yZHMgaW4gZXhwcmVzc2lvbjogJ1xuICAgICAgKyBleHBcbiAgICApXG4gIH1cbiAgLy8gcmVzZXQgc3RhdGVcbiAgc2F2ZWQubGVuZ3RoID0gMFxuICAvLyBzYXZlIHN0cmluZ3MgYW5kIG9iamVjdCBsaXRlcmFsIGtleXNcbiAgdmFyIGJvZHkgPSBleHBcbiAgICAucmVwbGFjZShzYXZlUkUsIHNhdmUpXG4gICAgLnJlcGxhY2Uod3NSRSwgJycpXG4gIC8vIHJld3JpdGUgYWxsIHBhdGhzXG4gIC8vIHBhZCAxIHNwYWNlIGhlcmUgYmVjYXVlIHRoZSByZWdleCBtYXRjaGVzIDEgZXh0cmEgY2hhclxuICBib2R5ID0gKCcgJyArIGJvZHkpXG4gICAgLnJlcGxhY2UocGF0aFJlcGxhY2VSRSwgcmV3cml0ZSlcbiAgICAucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gIHZhciBnZXR0ZXIgPSBtYWtlR2V0dGVyKGJvZHkpXG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAgc2V0OiBuZWVkU2V0XG4gICAgICAgID8gbWFrZVNldHRlcihib2R5KVxuICAgICAgICA6IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGdldHRlciBzZXR0ZXJzIGZvciBhIHNpbXBsZSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoRm5zIChleHApIHtcbiAgdmFyIGdldHRlciwgcGF0aFxuICBpZiAoZXhwLmluZGV4T2YoJ1snKSA8IDApIHtcbiAgICAvLyByZWFsbHkgc2ltcGxlIHBhdGhcbiAgICBwYXRoID0gZXhwLnNwbGl0KCcuJylcbiAgICBnZXR0ZXIgPSBQYXRoLmNvbXBpbGVHZXR0ZXIocGF0aClcbiAgfSBlbHNlIHtcbiAgICAvLyBkbyB0aGUgcmVhbCBwYXJzaW5nXG4gICAgcGF0aCA9IFBhdGgucGFyc2UoZXhwKVxuICAgIGdldHRlciA9IHBhdGguZ2V0XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGdldHRlcixcbiAgICAvLyBhbHdheXMgZ2VuZXJhdGUgc2V0dGVyIGZvciBzaW1wbGUgcGF0aHNcbiAgICBzZXQ6IGZ1bmN0aW9uIChvYmosIHZhbCkge1xuICAgICAgUGF0aC5zZXQob2JqLCBwYXRoLCB2YWwpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBnZXR0ZXIgZnVuY3Rpb24uIFJlcXVpcmVzIGV2YWwuXG4gKlxuICogV2UgaXNvbGF0ZSB0aGUgdHJ5L2NhdGNoIHNvIGl0IGRvZXNuJ3QgYWZmZWN0IHRoZVxuICogb3B0aW1pemF0aW9uIG9mIHRoZSBwYXJzZSBmdW5jdGlvbiB3aGVuIGl0IGlzIG5vdCBjYWxsZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlR2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAncmV0dXJuICcgKyBib2R5ICsgJzsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ0ludmFsaWQgZXhwcmVzc2lvbi4gJyArXG4gICAgICAnR2VuZXJhdGVkIGZ1bmN0aW9uIGJvZHk6ICcgKyBib2R5XG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBzZXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogVGhpcyBpcyBvbmx5IG5lZWRlZCBpbiByYXJlIHNpdHVhdGlvbnMgbGlrZSBcImFbYl1cIiB3aGVyZVxuICogYSBzZXR0YWJsZSBwYXRoIHJlcXVpcmVzIGR5bmFtaWMgZXZhbHVhdGlvbi5cbiAqXG4gKiBUaGlzIHNldHRlciBmdW5jdGlvbiBtYXkgdGhyb3cgZXJyb3Igd2hlbiBjYWxsZWQgaWYgdGhlXG4gKiBleHByZXNzaW9uIGJvZHkgaXMgbm90IGEgdmFsaWQgbGVmdC1oYW5kIGV4cHJlc3Npb24gaW5cbiAqIGFzc2lnbm1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlU2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAndmFsdWUnLCBib2R5ICsgJz12YWx1ZTsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKCdJbnZhbGlkIHNldHRlciBmdW5jdGlvbiBib2R5OiAnICsgYm9keSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZXR0ZXIgZXhpc3RlbmNlIG9uIGEgY2FjaGUgaGl0LlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhpdFxuICovXG5cbmZ1bmN0aW9uIGNoZWNrU2V0dGVyIChoaXQpIHtcbiAgaWYgKCFoaXQuc2V0KSB7XG4gICAgaGl0LnNldCA9IG1ha2VTZXR0ZXIoaGl0LmJvZHkpXG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBleHByZXNzaW9uIGludG8gcmUtd3JpdHRlbiBnZXR0ZXIvc2V0dGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRTZXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoZXhwLCBuZWVkU2V0KSB7XG4gIGV4cCA9IGV4cC50cmltKClcbiAgLy8gdHJ5IGNhY2hlXG4gIHZhciBoaXQgPSBleHByZXNzaW9uQ2FjaGUuZ2V0KGV4cClcbiAgaWYgKGhpdCkge1xuICAgIGlmIChuZWVkU2V0KSB7XG4gICAgICBjaGVja1NldHRlcihoaXQpXG4gICAgfVxuICAgIHJldHVybiBoaXRcbiAgfVxuICAvLyB3ZSBkbyBhIHNpbXBsZSBwYXRoIGNoZWNrIHRvIG9wdGltaXplIGZvciB0aGVtLlxuICAvLyB0aGUgY2hlY2sgZmFpbHMgdmFsaWQgcGF0aHMgd2l0aCB1bnVzYWwgd2hpdGVzcGFjZXMsXG4gIC8vIGJ1dCB0aGF0J3MgdG9vIHJhcmUgYW5kIHdlIGRvbid0IGNhcmUuXG4gIC8vIGFsc28gc2tpcCBib29sZWFuIGxpdGVyYWxzIGFuZCBwYXRocyB0aGF0IHN0YXJ0IHdpdGhcbiAgLy8gZ2xvYmFsIFwiTWF0aFwiXG4gIHZhciByZXMgPVxuICAgIHBhdGhUZXN0UkUudGVzdChleHApICYmXG4gICAgLy8gZG9uJ3QgdHJlYXQgdHJ1ZS9mYWxzZSBhcyBwYXRoc1xuICAgICFib29sZWFuTGl0ZXJhbFJFLnRlc3QoZXhwKSAmJlxuICAgIC8vIE1hdGggY29uc3RhbnRzIGUuZy4gTWF0aC5QSSwgTWF0aC5FIGV0Yy5cbiAgICBleHAuc2xpY2UoMCwgNSkgIT09ICdNYXRoLidcbiAgICAgID8gY29tcGlsZVBhdGhGbnMoZXhwKVxuICAgICAgOiBjb21waWxlRXhwRm5zKGV4cCwgbmVlZFNldClcbiAgZXhwcmVzc2lvbkNhY2hlLnB1dChleHAsIHJlcylcbiAgcmV0dXJuIHJlc1xufVxuXG4vLyBFeHBvcnQgdGhlIHBhdGhSZWdleCBmb3IgZXh0ZXJuYWwgdXNlXG5leHBvcnRzLnBhdGhUZXN0UkUgPSBwYXRoVGVzdFJFIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBwYXRoQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBpZGVudFJFID0gL15bJF9hLXpBLVpdK1tcXHckXSokL1xuXG4vKipcbiAqIFBhdGgtcGFyc2luZyBhbGdvcml0aG0gc2Nvb3BlZCBmcm9tIFBvbHltZXIvb2JzZXJ2ZS1qc1xuICovXG5cbnZhciBwYXRoU3RhdGVNYWNoaW5lID0ge1xuICAnYmVmb3JlUGF0aCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZVBhdGgnXSxcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnXVxuICB9LFxuXG4gICdpblBhdGgnOiB7XG4gICAgJ3dzJzogWydpblBhdGgnXSxcbiAgICAnLic6IFsnYmVmb3JlSWRlbnQnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCddXG4gIH0sXG5cbiAgJ2JlZm9yZUlkZW50Jzoge1xuICAgICd3cyc6IFsnYmVmb3JlSWRlbnQnXSxcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnaW5JZGVudCc6IHtcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJzAnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnd3MnOiBbJ2luUGF0aCcsICdwdXNoJ10sXG4gICAgJy4nOiBbJ2JlZm9yZUlkZW50JywgJ3B1c2gnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCcsICdwdXNoJ10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdiZWZvcmVFbGVtZW50Jzoge1xuICAgICd3cyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICcwJzogWydhZnRlclplcm8nLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICBcIidcIjogWydpblNpbmdsZVF1b3RlJywgJ2FwcGVuZCcsICcnXSxcbiAgICAnXCInOiBbJ2luRG91YmxlUXVvdGUnLCAnYXBwZW5kJywgJyddXG4gIH0sXG5cbiAgJ2FmdGVyWmVybyc6IHtcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCcsICdwdXNoJ10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnaW5JbmRleCc6IHtcbiAgICAnMCc6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnaW5TaW5nbGVRdW90ZSc6IHtcbiAgICBcIidcIjogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnZW9mJzogJ2Vycm9yJyxcbiAgICAnZWxzZSc6IFsnaW5TaW5nbGVRdW90ZScsICdhcHBlbmQnXVxuICB9LFxuXG4gICdpbkRvdWJsZVF1b3RlJzoge1xuICAgICdcIic6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ2VvZic6ICdlcnJvcicsXG4gICAgJ2Vsc2UnOiBbJ2luRG91YmxlUXVvdGUnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnYWZ0ZXJFbGVtZW50Jzoge1xuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfVxufVxuXG5mdW5jdGlvbiBub29wICgpIHt9XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGEgY2hhcmFjdGVyIGluIGEga2V5cGF0aC5cbiAqXG4gKiBAcGFyYW0ge0NoYXJ9IGNoYXJcbiAqIEByZXR1cm4ge1N0cmluZ30gdHlwZVxuICovXG5cbmZ1bmN0aW9uIGdldFBhdGhDaGFyVHlwZSAoY2hhcikge1xuICBpZiAoY2hhciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICdlb2YnXG4gIH1cblxuICB2YXIgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKVxuXG4gIHN3aXRjaChjb2RlKSB7XG4gICAgY2FzZSAweDVCOiAvLyBbXG4gICAgY2FzZSAweDVEOiAvLyBdXG4gICAgY2FzZSAweDJFOiAvLyAuXG4gICAgY2FzZSAweDIyOiAvLyBcIlxuICAgIGNhc2UgMHgyNzogLy8gJ1xuICAgIGNhc2UgMHgzMDogLy8gMFxuICAgICAgcmV0dXJuIGNoYXJcblxuICAgIGNhc2UgMHg1RjogLy8gX1xuICAgIGNhc2UgMHgyNDogLy8gJFxuICAgICAgcmV0dXJuICdpZGVudCdcblxuICAgIGNhc2UgMHgyMDogLy8gU3BhY2VcbiAgICBjYXNlIDB4MDk6IC8vIFRhYlxuICAgIGNhc2UgMHgwQTogLy8gTmV3bGluZVxuICAgIGNhc2UgMHgwRDogLy8gUmV0dXJuXG4gICAgY2FzZSAweEEwOiAgLy8gTm8tYnJlYWsgc3BhY2VcbiAgICBjYXNlIDB4RkVGRjogIC8vIEJ5dGUgT3JkZXIgTWFya1xuICAgIGNhc2UgMHgyMDI4OiAgLy8gTGluZSBTZXBhcmF0b3JcbiAgICBjYXNlIDB4MjAyOTogIC8vIFBhcmFncmFwaCBTZXBhcmF0b3JcbiAgICAgIHJldHVybiAnd3MnXG4gIH1cblxuICAvLyBhLXosIEEtWlxuICBpZiAoKDB4NjEgPD0gY29kZSAmJiBjb2RlIDw9IDB4N0EpIHx8XG4gICAgICAoMHg0MSA8PSBjb2RlICYmIGNvZGUgPD0gMHg1QSkpIHtcbiAgICByZXR1cm4gJ2lkZW50J1xuICB9XG5cbiAgLy8gMS05XG4gIGlmICgweDMxIDw9IGNvZGUgJiYgY29kZSA8PSAweDM5KSB7XG4gICAgcmV0dXJuICdudW1iZXInXG4gIH1cblxuICByZXR1cm4gJ2Vsc2UnXG59XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgcGF0aCBpbnRvIGFuIGFycmF5IG9mIHNlZ21lbnRzXG4gKiBUb2RvIGltcGxlbWVudCBjYWNoZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtBcnJheXx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYXRoIChwYXRoKSB7XG4gIHZhciBrZXlzID0gW11cbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIG1vZGUgPSAnYmVmb3JlUGF0aCdcbiAgdmFyIGMsIG5ld0NoYXIsIGtleSwgdHlwZSwgdHJhbnNpdGlvbiwgYWN0aW9uLCB0eXBlTWFwXG5cbiAgdmFyIGFjdGlvbnMgPSB7XG4gICAgcHVzaDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgICAga2V5ID0gdW5kZWZpbmVkXG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleSA9IG5ld0NoYXJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSArPSBuZXdDaGFyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVVbmVzY2FwZVF1b3RlICgpIHtcbiAgICB2YXIgbmV4dENoYXIgPSBwYXRoW2luZGV4ICsgMV1cbiAgICBpZiAoKG1vZGUgPT09ICdpblNpbmdsZVF1b3RlJyAmJiBuZXh0Q2hhciA9PT0gXCInXCIpIHx8XG4gICAgICAgIChtb2RlID09PSAnaW5Eb3VibGVRdW90ZScgJiYgbmV4dENoYXIgPT09ICdcIicpKSB7XG4gICAgICBpbmRleCsrXG4gICAgICBuZXdDaGFyID0gbmV4dENoYXJcbiAgICAgIGFjdGlvbnMuYXBwZW5kKClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKG1vZGUpIHtcbiAgICBpbmRleCsrXG4gICAgYyA9IHBhdGhbaW5kZXhdXG5cbiAgICBpZiAoYyA9PT0gJ1xcXFwnICYmIG1heWJlVW5lc2NhcGVRdW90ZSgpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHR5cGUgPSBnZXRQYXRoQ2hhclR5cGUoYylcbiAgICB0eXBlTWFwID0gcGF0aFN0YXRlTWFjaGluZVttb2RlXVxuICAgIHRyYW5zaXRpb24gPSB0eXBlTWFwW3R5cGVdIHx8IHR5cGVNYXBbJ2Vsc2UnXSB8fCAnZXJyb3InXG5cbiAgICBpZiAodHJhbnNpdGlvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgcmV0dXJuIC8vIHBhcnNlIGVycm9yXG4gICAgfVxuXG4gICAgbW9kZSA9IHRyYW5zaXRpb25bMF1cbiAgICBhY3Rpb24gPSBhY3Rpb25zW3RyYW5zaXRpb25bMV1dIHx8IG5vb3BcbiAgICBuZXdDaGFyID0gdHJhbnNpdGlvblsyXSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGNcbiAgICAgIDogdHJhbnNpdGlvblsyXVxuICAgIGFjdGlvbigpXG5cbiAgICBpZiAobW9kZSA9PT0gJ2FmdGVyUGF0aCcpIHtcbiAgICAgIHJldHVybiBrZXlzXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRm9ybWF0IGEgYWNjZXNzb3Igc2VnbWVudCBiYXNlZCBvbiBpdHMgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFjY2Vzc29yKGtleSkge1xuICBpZiAoaWRlbnRSRS50ZXN0KGtleSkpIHsgLy8gaWRlbnRpZmllclxuICAgIHJldHVybiAnLicgKyBrZXlcbiAgfSBlbHNlIGlmICgra2V5ID09PSBrZXkgPj4+IDApIHsgLy8gYnJhY2tldCBpbmRleFxuICAgIHJldHVybiAnWycgKyBrZXkgKyAnXSdcbiAgfSBlbHNlIHsgLy8gYnJhY2tldCBzdHJpbmdcbiAgICByZXR1cm4gJ1tcIicgKyBrZXkucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiXSdcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGVzIGEgZ2V0dGVyIGZ1bmN0aW9uIHdpdGggYSBmaXhlZCBwYXRoLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGhcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuY29tcGlsZUdldHRlciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBib2R5ID0gJ3JldHVybiBvJyArIHBhdGgubWFwKGZvcm1hdEFjY2Vzc29yKS5qb2luKCcnKVxuICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdvJywgYm9keSlcbn1cblxuLyoqXG4gKiBFeHRlcm5hbCBwYXJzZSB0aGF0IGNoZWNrIGZvciBhIGNhY2hlIGhpdCBmaXJzdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtBcnJheXx1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBoaXQgPSBwYXRoQ2FjaGUuZ2V0KHBhdGgpXG4gIGlmICghaGl0KSB7XG4gICAgaGl0ID0gcGFyc2VQYXRoKHBhdGgpXG4gICAgaWYgKGhpdCkge1xuICAgICAgaGl0LmdldCA9IGV4cG9ydHMuY29tcGlsZUdldHRlcihoaXQpXG4gICAgICBwYXRoQ2FjaGUucHV0KHBhdGgsIGhpdClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpdFxufVxuXG4vKipcbiAqIEdldCBmcm9tIGFuIG9iamVjdCBmcm9tIGEgcGF0aCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICovXG5cbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICBwYXRoID0gZXhwb3J0cy5wYXJzZShwYXRoKVxuICBpZiAocGF0aCkge1xuICAgIHJldHVybiBwYXRoLmdldChvYmopXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgb24gYW4gb2JqZWN0IGZyb20gYSBwYXRoXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmcgfCBBcnJheX0gcGF0aFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgcGF0aCA9IGV4cG9ydHMucGFyc2UocGF0aClcbiAgfVxuICBpZiAoIXBhdGggfHwgIV8uaXNPYmplY3Qob2JqKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHZhciBsYXN0LCBrZXlcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPCBsOyBpKyspIHtcbiAgICBsYXN0ID0gb2JqXG4gICAga2V5ID0gcGF0aFtpXVxuICAgIG9iaiA9IG9ialtrZXldXG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgIG9iaiA9IHt9XG4gICAgICBsYXN0LiRhZGQoa2V5LCBvYmopXG4gICAgfVxuICB9XG4gIGtleSA9IHBhdGhbaV1cbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBvYmpba2V5XSA9IHZhbFxuICB9IGVsc2Uge1xuICAgIG9iai4kYWRkKGtleSwgdmFsKVxuICB9XG4gIHJldHVybiB0cnVlXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciB0ZW1wbGF0ZUNhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgaWRTZWxlY3RvckNhY2hlID0gbmV3IENhY2hlKDEwMDApXG5cbnZhciBtYXAgPSB7XG4gIF9kZWZhdWx0IDogWzAsICcnLCAnJ10sXG4gIGxlZ2VuZCAgIDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRyICAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gIGNvbCAgICAgIDogW1xuICAgIDIsXG4gICAgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JyxcbiAgICAnPC9jb2xncm91cD48L3RhYmxlPidcbiAgXVxufVxuXG5tYXAudGQgPVxubWFwLnRoID0gW1xuICAzLFxuICAnPHRhYmxlPjx0Ym9keT48dHI+JyxcbiAgJzwvdHI+PC90Ym9keT48L3RhYmxlPidcbl1cblxubWFwLm9wdGlvbiA9XG5tYXAub3B0Z3JvdXAgPSBbXG4gIDEsXG4gICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLFxuICAnPC9zZWxlY3Q+J1xuXVxuXG5tYXAudGhlYWQgPVxubWFwLnRib2R5ID1cbm1hcC5jb2xncm91cCA9XG5tYXAuY2FwdGlvbiA9XG5tYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXVxuXG5tYXAuZyA9XG5tYXAuZGVmcyA9XG5tYXAuc3ltYm9sID1cbm1hcC51c2UgPVxubWFwLmltYWdlID1cbm1hcC50ZXh0ID1cbm1hcC5jaXJjbGUgPVxubWFwLmVsbGlwc2UgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnBvbHlnb24gPVxubWFwLnBvbHlsaW5lID1cbm1hcC5yZWN0ID0gW1xuICAxLFxuICAnPHN2ZyAnICtcbiAgICAneG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICcgK1xuICAgICd4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiAnICtcbiAgICAneG1sbnM6ZXY9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHNcIicgK1xuICAgICd2ZXJzaW9uPVwiMS4xXCI+JyxcbiAgJzwvc3ZnPidcbl1cblxudmFyIHRhZ1JFID0gLzwoW1xcdzpdKykvXG52YXIgZW50aXR5UkUgPSAvJlxcdys7L1xuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBEb2N1bWVudEZyYWdtZW50LlxuICogRGV0ZXJtaW5lcyBjb3JyZWN0IHdyYXBwaW5nIGJ5IHRhZyB0eXBlcy4gV3JhcHBpbmdcbiAqIHN0cmF0ZWd5IGZvdW5kIGluIGpRdWVyeSAmIGNvbXBvbmVudC9kb21pZnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlU3RyaW5nXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvRnJhZ21lbnQgKHRlbXBsYXRlU3RyaW5nKSB7XG4gIC8vIHRyeSBhIGNhY2hlIGhpdCBmaXJzdFxuICB2YXIgaGl0ID0gdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVTdHJpbmcpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgdGFnTWF0Y2ggPSB0ZW1wbGF0ZVN0cmluZy5tYXRjaCh0YWdSRSlcbiAgdmFyIGVudGl0eU1hdGNoID0gZW50aXR5UkUudGVzdCh0ZW1wbGF0ZVN0cmluZylcblxuICBpZiAoIXRhZ01hdGNoICYmICFlbnRpdHlNYXRjaCkge1xuICAgIC8vIHRleHQgb25seSwgcmV0dXJuIGEgc2luZ2xlIHRleHQgbm9kZS5cbiAgICBmcmFnLmFwcGVuZENoaWxkKFxuICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGVtcGxhdGVTdHJpbmcpXG4gICAgKVxuICB9IGVsc2Uge1xuXG4gICAgdmFyIHRhZyAgICA9IHRhZ01hdGNoICYmIHRhZ01hdGNoWzFdXG4gICAgdmFyIHdyYXAgICA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdFxuICAgIHZhciBkZXB0aCAgPSB3cmFwWzBdXG4gICAgdmFyIHByZWZpeCA9IHdyYXBbMV1cbiAgICB2YXIgc3VmZml4ID0gd3JhcFsyXVxuICAgIHZhciBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZy50cmltKCkgKyBzdWZmaXhcbiAgICB3aGlsZSAoZGVwdGgtLSkge1xuICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkXG4gICAgfVxuXG4gICAgdmFyIGNoaWxkXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG4gIH1cblxuICB0ZW1wbGF0ZUNhY2hlLnB1dCh0ZW1wbGF0ZVN0cmluZywgZnJhZylcbiAgcmV0dXJuIGZyYWdcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdGVtcGxhdGUgbm9kZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIG5vZGVUb0ZyYWdtZW50IChub2RlKSB7XG4gIHZhciB0YWcgPSBub2RlLnRhZ05hbWVcbiAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgLy8gaXRzIGNvbnRlbnQgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LlxuICBpZiAoXG4gICAgdGFnID09PSAnVEVNUExBVEUnICYmXG4gICAgbm9kZS5jb250ZW50IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudFxuICApIHtcbiAgICByZXR1cm4gbm9kZS5jb250ZW50XG4gIH1cbiAgLy8gc2NyaXB0IHRlbXBsYXRlXG4gIGlmICh0YWcgPT09ICdTQ1JJUFQnKSB7XG4gICAgcmV0dXJuIHN0cmluZ1RvRnJhZ21lbnQobm9kZS50ZXh0Q29udGVudClcbiAgfVxuICAvLyBub3JtYWwgbm9kZSwgY2xvbmUgaXQgdG8gYXZvaWQgbXV0YXRpbmcgdGhlIG9yaWdpbmFsXG4gIHZhciBjbG9uZSA9IGV4cG9ydHMuY2xvbmUobm9kZSlcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgdmFyIGNoaWxkXG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgd2hpbGUgKGNoaWxkID0gY2xvbmUuZmlyc3RDaGlsZCkge1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gIH1cbiAgcmV0dXJuIGZyYWdcbn1cblxuLy8gVGVzdCBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSBTYWZhcmkgdGVtcGxhdGUgY2xvbmluZyBidWdcbi8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzc3NTVcbnZhciBoYXNCcm9rZW5UZW1wbGF0ZSA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGEuaW5uZXJIVE1MID0gJzx0ZW1wbGF0ZT4xPC90ZW1wbGF0ZT4nXG4gICAgICByZXR1cm4gIWEuY2xvbmVOb2RlKHRydWUpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MXG4gICAgfSkoKVxuICA6IGZhbHNlXG5cbi8vIFRlc3QgZm9yIElFMTAvMTEgdGV4dGFyZWEgcGxhY2Vob2xkZXIgY2xvbmUgYnVnXG52YXIgaGFzVGV4dGFyZWFDbG9uZUJ1ZyA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgICAgdC5wbGFjZWhvbGRlciA9ICd0J1xuICAgICAgcmV0dXJuIHQuY2xvbmVOb2RlKHRydWUpLnZhbHVlID09PSAndCdcbiAgICB9KSgpXG4gIDogZmFsc2VcblxuLyoqXG4gKiAxLiBEZWFsIHdpdGggU2FmYXJpIGNsb25pbmcgbmVzdGVkIDx0ZW1wbGF0ZT4gYnVnIGJ5XG4gKiAgICBtYW51YWxseSBjbG9uaW5nIGFsbCB0ZW1wbGF0ZSBpbnN0YW5jZXMuXG4gKiAyLiBEZWFsIHdpdGggSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBidWcgYnkgc2V0dGluZ1xuICogICAgdGhlIGNvcnJlY3QgdmFsdWUgYWZ0ZXIgY2xvbmluZy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gbm9kZVxuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgcmVzID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgdmFyIGksIG9yaWdpbmFsLCBjbG9uZWRcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNCcm9rZW5UZW1wbGF0ZSkge1xuICAgIG9yaWdpbmFsID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpXG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgY2xvbmVkID0gcmVzLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylcbiAgICAgIGkgPSBjbG9uZWQubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNsb25lZFtpXS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICBvcmlnaW5hbFtpXS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgY2xvbmVkW2ldXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNUZXh0YXJlYUNsb25lQnVnKSB7XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgcmVzLnZhbHVlID0gbm9kZS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnaW5hbCA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgICBjbG9uZWQgPSByZXMucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgICBpID0gY2xvbmVkLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgY2xvbmVkW2ldLnZhbHVlID0gb3JpZ2luYWxbaV0udmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgdGVtcGxhdGUgb3B0aW9uIGFuZCBub3JtYWxpemVzIGl0IGludG8gYVxuICogYSBEb2N1bWVudEZyYWdtZW50IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBwYXJ0aWFsIG9yIGFcbiAqIGluc3RhbmNlIHRlbXBsYXRlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdGVtcGxhdGVcbiAqICAgIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlOlxuICogICAgLSBEb2N1bWVudEZyYWdtZW50IG9iamVjdFxuICogICAgLSBOb2RlIG9iamVjdCBvZiB0eXBlIFRlbXBsYXRlXG4gKiAgICAtIGlkIHNlbGVjdG9yOiAnI3NvbWUtdGVtcGxhdGUtaWQnXG4gKiAgICAtIHRlbXBsYXRlIHN0cmluZzogJzxkaXY+PHNwYW4+e3ttc2d9fTwvc3Bhbj48L2Rpdj4nXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb25lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5vU2VsZWN0b3JcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR8dW5kZWZpbmVkfVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGNsb25lLCBub1NlbGVjdG9yKSB7XG4gIHZhciBub2RlLCBmcmFnXG5cbiAgLy8gaWYgdGhlIHRlbXBsYXRlIGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCxcbiAgLy8gZG8gbm90aGluZ1xuICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgcmV0dXJuIGNsb25lXG4gICAgICA/IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKVxuICAgICAgOiB0ZW1wbGF0ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBpZCBzZWxlY3RvclxuICAgIGlmICghbm9TZWxlY3RvciAmJiB0ZW1wbGF0ZS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgLy8gaWQgc2VsZWN0b3IgY2FuIGJlIGNhY2hlZCB0b29cbiAgICAgIGZyYWcgPSBpZFNlbGVjdG9yQ2FjaGUuZ2V0KHRlbXBsYXRlKVxuICAgICAgaWYgKCFmcmFnKSB7XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZS5zbGljZSgxKSlcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICBmcmFnID0gbm9kZVRvRnJhZ21lbnQobm9kZSlcbiAgICAgICAgICAvLyBzYXZlIHNlbGVjdG9yIHRvIGNhY2hlXG4gICAgICAgICAgaWRTZWxlY3RvckNhY2hlLnB1dCh0ZW1wbGF0ZSwgZnJhZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWwgc3RyaW5nIHRlbXBsYXRlXG4gICAgICBmcmFnID0gc3RyaW5nVG9GcmFnbWVudCh0ZW1wbGF0ZSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodGVtcGxhdGUubm9kZVR5cGUpIHtcbiAgICAvLyBhIGRpcmVjdCBub2RlXG4gICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KHRlbXBsYXRlKVxuICB9XG5cbiAgcmV0dXJuIGZyYWcgJiYgY2xvbmVcbiAgICA/IGV4cG9ydHMuY2xvbmUoZnJhZylcbiAgICA6IGZyYWdcbn0iLCJ2YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG52YXIgcmVnZXhFc2NhcGVSRSA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2dcbnZhciBjYWNoZSwgdGFnUkUsIGh0bWxSRSwgZmlyc3RDaGFyLCBsYXN0Q2hhclxuXG4vKipcbiAqIEVzY2FwZSBhIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCBpbiBhIFJlZ0V4cFxuICogY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4IChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4RXNjYXBlUkUsICdcXFxcJCYnKVxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGludGVycG9sYXRpb24gdGFnIHJlZ2V4LlxuICpcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUmVnZXggKCkge1xuICBjb25maWcuX2RlbGltaXRlcnNDaGFuZ2VkID0gZmFsc2VcbiAgdmFyIG9wZW4gPSBjb25maWcuZGVsaW1pdGVyc1swXVxuICB2YXIgY2xvc2UgPSBjb25maWcuZGVsaW1pdGVyc1sxXVxuICBmaXJzdENoYXIgPSBvcGVuLmNoYXJBdCgwKVxuICBsYXN0Q2hhciA9IGNsb3NlLmNoYXJBdChjbG9zZS5sZW5ndGggLSAxKVxuICB2YXIgZmlyc3RDaGFyUkUgPSBlc2NhcGVSZWdleChmaXJzdENoYXIpXG4gIHZhciBsYXN0Q2hhclJFID0gZXNjYXBlUmVnZXgobGFzdENoYXIpXG4gIHZhciBvcGVuUkUgPSBlc2NhcGVSZWdleChvcGVuKVxuICB2YXIgY2xvc2VSRSA9IGVzY2FwZVJlZ2V4KGNsb3NlKVxuICB0YWdSRSA9IG5ldyBSZWdFeHAoXG4gICAgZmlyc3RDaGFyUkUgKyAnPycgKyBvcGVuUkUgK1xuICAgICcoLis/KScgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJz8nLFxuICAgICdnJ1xuICApXG4gIGh0bWxSRSA9IG5ldyBSZWdFeHAoXG4gICAgJ14nICsgZmlyc3RDaGFyUkUgKyBvcGVuUkUgK1xuICAgICcuKicgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJyQnXG4gIClcbiAgLy8gcmVzZXQgY2FjaGVcbiAgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHRlbXBsYXRlIHRleHQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+IHwgbnVsbH1cbiAqICAgICAgICAgICAgICAgLSB7U3RyaW5nfSB0eXBlXG4gKiAgICAgICAgICAgICAgIC0ge1N0cmluZ30gdmFsdWVcbiAqICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW2h0bWxdXG4gKiAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtvbmVUaW1lXVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGV4dCkge1xuICBpZiAoY29uZmlnLl9kZWxpbWl0ZXJzQ2hhbmdlZCkge1xuICAgIGNvbXBpbGVSZWdleCgpXG4gIH1cbiAgdmFyIGhpdCA9IGNhY2hlLmdldCh0ZXh0KVxuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdFxuICB9XG4gIGlmICghdGFnUkUudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgdmFyIHRva2VucyA9IFtdXG4gIHZhciBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXggPSAwXG4gIHZhciBtYXRjaCwgaW5kZXgsIHZhbHVlLCBmaXJzdCwgb25lVGltZSwgcGFydGlhbFxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gIHdoaWxlIChtYXRjaCA9IHRhZ1JFLmV4ZWModGV4dCkpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4XG4gICAgLy8gcHVzaCB0ZXh0IHRva2VuXG4gICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyB0YWcgdG9rZW5cbiAgICBmaXJzdCA9IG1hdGNoWzFdLmNoYXJDb2RlQXQoMClcbiAgICBvbmVUaW1lID0gZmlyc3QgPT09IDB4MkEgLy8gKlxuICAgIHBhcnRpYWwgPSBmaXJzdCA9PT0gMHgzRSAvLyA+XG4gICAgdmFsdWUgPSAob25lVGltZSB8fCBwYXJ0aWFsKVxuICAgICAgPyBtYXRjaFsxXS5zbGljZSgxKVxuICAgICAgOiBtYXRjaFsxXVxuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIHRhZzogdHJ1ZSxcbiAgICAgIHZhbHVlOiB2YWx1ZS50cmltKCksXG4gICAgICBodG1sOiBodG1sUkUudGVzdChtYXRjaFswXSksXG4gICAgICBvbmVUaW1lOiBvbmVUaW1lLFxuICAgICAgcGFydGlhbDogcGFydGlhbFxuICAgIH0pXG4gICAgbGFzdEluZGV4ID0gaW5kZXggKyBtYXRjaFswXS5sZW5ndGhcbiAgfVxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaCh7XG4gICAgICB2YWx1ZTogdGV4dC5zbGljZShsYXN0SW5kZXgpXG4gICAgfSlcbiAgfVxuICBjYWNoZS5wdXQodGV4dCwgdG9rZW5zKVxuICByZXR1cm4gdG9rZW5zXG59XG5cbi8qKlxuICogRm9ybWF0IGEgbGlzdCBvZiB0b2tlbnMgaW50byBhbiBleHByZXNzaW9uLlxuICogZS5nLiB0b2tlbnMgcGFyc2VkIGZyb20gJ2Ege3tifX0gYycgY2FuIGJlIHNlcmlhbGl6ZWRcbiAqIGludG8gb25lIHNpbmdsZSBleHByZXNzaW9uIGFzICdcImEgXCIgKyBiICsgXCIgY1wiJy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy50b2tlbnNUb0V4cCA9IGZ1bmN0aW9uICh0b2tlbnMsIHZtKSB7XG4gIHJldHVybiB0b2tlbnMubGVuZ3RoID4gMVxuICAgID8gdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRva2VuKHRva2VuLCB2bSlcbiAgICAgIH0pLmpvaW4oJysnKVxuICAgIDogZm9ybWF0VG9rZW4odG9rZW5zWzBdLCB2bSwgdHJ1ZSlcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBzaW5nbGUgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICogQHBhcmFtIHtCb29sZWFufSBzaW5nbGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRUb2tlbiAodG9rZW4sIHZtLCBzaW5nbGUpIHtcbiAgcmV0dXJuIHRva2VuLnRhZ1xuICAgID8gdm0gJiYgdG9rZW4ub25lVGltZVxuICAgICAgPyAnXCInICsgdm0uJGV2YWwodG9rZW4udmFsdWUpICsgJ1wiJ1xuICAgICAgOiBzaW5nbGVcbiAgICAgICAgPyB0b2tlbi52YWx1ZVxuICAgICAgICA6IGlubGluZUZpbHRlcnModG9rZW4udmFsdWUpXG4gICAgOiAnXCInICsgdG9rZW4udmFsdWUgKyAnXCInXG59XG5cbi8qKlxuICogRm9yIGFuIGF0dHJpYnV0ZSB3aXRoIG11bHRpcGxlIGludGVycG9sYXRpb24gdGFncyxcbiAqIGUuZy4gYXR0cj1cInNvbWUte3t0aGluZyB8IGZpbHRlcn19XCIsIGluIG9yZGVyIHRvIGNvbWJpbmVcbiAqIHRoZSB3aG9sZSB0aGluZyBpbnRvIGEgc2luZ2xlIHdhdGNoYWJsZSBleHByZXNzaW9uLCB3ZVxuICogaGF2ZSB0byBpbmxpbmUgdGhvc2UgZmlsdGVycy4gVGhpcyBmdW5jdGlvbiBkb2VzIGV4YWN0bHlcbiAqIHRoYXQuIFRoaXMgaXMgYSBiaXQgaGFja3kgYnV0IGl0IGF2b2lkcyBoZWF2eSBjaGFuZ2VzXG4gKiB0byBkaXJlY3RpdmUgcGFyc2VyIGFuZCB3YXRjaGVyIG1lY2hhbmlzbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuZnVuY3Rpb24gaW5saW5lRmlsdGVycyAoZXhwKSB7XG4gIGlmICghZmlsdGVyUkUudGVzdChleHApKSB7XG4gICAgcmV0dXJuICcoJyArIGV4cCArICcpJ1xuICB9IGVsc2Uge1xuICAgIHZhciBkaXIgPSBkaXJQYXJzZXIucGFyc2UoZXhwKVswXVxuICAgIGlmICghZGlyLmZpbHRlcnMpIHtcbiAgICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSdcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwID0gZGlyLmV4cHJlc3Npb25cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZGlyLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBkaXIuZmlsdGVyc1tpXVxuICAgICAgICB2YXIgYXJncyA9IGZpbHRlci5hcmdzXG4gICAgICAgICAgPyAnLFwiJyArIGZpbHRlci5hcmdzLmpvaW4oJ1wiLFwiJykgKyAnXCInXG4gICAgICAgICAgOiAnJ1xuICAgICAgICBmaWx0ZXIgPSAndGhpcy4kb3B0aW9ucy5maWx0ZXJzW1wiJyArIGZpbHRlci5uYW1lICsgJ1wiXSdcbiAgICAgICAgZXhwID0gJygnICsgZmlsdGVyICsgJy5yZWFkfHwnICsgZmlsdGVyICsgJyknICtcbiAgICAgICAgICAnLmFwcGx5KHRoaXMsWycgKyBleHAgKyBhcmdzICsgJ10pJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYWRkQ2xhc3MgPSBfLmFkZENsYXNzXG52YXIgcmVtb3ZlQ2xhc3MgPSBfLnJlbW92ZUNsYXNzXG52YXIgdHJhbnNEdXJhdGlvblByb3AgPSBfLnRyYW5zaXRpb25Qcm9wICsgJ0R1cmF0aW9uJ1xudmFyIGFuaW1EdXJhdGlvblByb3AgPSBfLmFuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXG5cbnZhciBxdWV1ZSA9IFtdXG52YXIgcXVldWVkID0gZmFsc2VcblxuLyoqXG4gKiBQdXNoIGEgam9iIGludG8gdGhlIHRyYW5zaXRpb24gcXVldWUsIHdoaWNoIGlzIHRvIGJlXG4gKiBleGVjdXRlZCBvbiBuZXh0IGZyYW1lLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWwgICAgLSB0YXJnZXQgZWxlbWVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpciAgICAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wICAgLSB0aGUgYWN0dWFsIGRvbSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbHMgICAgLSB0aGUgY2xhc3NOYW1lIHRvIHJlbW92ZSB3aGVuIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gaXMgZG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gLSB1c2VyIHN1cHBsaWVkIGNhbGxiYWNrLlxuICovXG5cbmZ1bmN0aW9uIHB1c2ggKGVsLCBkaXIsIG9wLCBjbHMsIGNiKSB7XG4gIHF1ZXVlLnB1c2goe1xuICAgIGVsICA6IGVsLFxuICAgIGRpciA6IGRpcixcbiAgICBjYiAgOiBjYixcbiAgICBjbHMgOiBjbHMsXG4gICAgb3AgIDogb3BcbiAgfSlcbiAgaWYgKCFxdWV1ZWQpIHtcbiAgICBxdWV1ZWQgPSB0cnVlXG4gICAgXy5uZXh0VGljayhmbHVzaClcbiAgfVxufVxuXG4vKipcbiAqIEZsdXNoIHRoZSBxdWV1ZSwgYW5kIGRvIG9uZSBmb3JjZWQgcmVmbG93IGJlZm9yZVxuICogdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG4gIHZhciBmID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodFxuICBxdWV1ZS5mb3JFYWNoKHJ1bilcbiAgcXVldWUgPSBbXVxuICBxdWV1ZWQgPSBmYWxzZVxufVxuXG4vKipcbiAqIFJ1biBhIHRyYW5zaXRpb24gam9iLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqb2JcbiAqL1xuXG5mdW5jdGlvbiBydW4gKGpvYikge1xuXG4gIHZhciBlbCA9IGpvYi5lbFxuICB2YXIgZGF0YSA9IGVsLl9fdl90cmFuc1xuICB2YXIgY2xzID0gam9iLmNsc1xuICB2YXIgY2IgPSBqb2IuY2JcbiAgdmFyIG9wID0gam9iLm9wXG4gIHZhciB0cmFuc2l0aW9uVHlwZSA9IGdldFRyYW5zaXRpb25UeXBlKGVsLCBkYXRhLCBjbHMpXG5cbiAgaWYgKGpvYi5kaXIgPiAwKSB7IC8vIEVOVEVSXG4gICAgaWYgKHRyYW5zaXRpb25UeXBlID09PSAxKSB7XG4gICAgICAvLyB0cmlnZ2VyIHRyYW5zaXRpb24gYnkgcmVtb3ZpbmcgZW50ZXIgY2xhc3NcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICAvLyBvbmx5IG5lZWQgdG8gbGlzdGVuIGZvciB0cmFuc2l0aW9uZW5kIGlmIHRoZXJlJ3NcbiAgICAgIC8vIGEgdXNlciBjYWxsYmFja1xuICAgICAgaWYgKGNiKSBzZXR1cFRyYW5zaXRpb25DYihfLnRyYW5zaXRpb25FbmRFdmVudClcbiAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb25UeXBlID09PSAyKSB7XG4gICAgICAvLyBhbmltYXRpb25zIGFyZSB0cmlnZ2VyZWQgd2hlbiBjbGFzcyBpcyBhZGRlZFxuICAgICAgLy8gc28gd2UganVzdCBsaXN0ZW4gZm9yIGFuaW1hdGlvbmVuZCB0byByZW1vdmUgaXQuXG4gICAgICBzZXR1cFRyYW5zaXRpb25DYihfLmFuaW1hdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyB0cmFuc2l0aW9uIGFwcGxpY2FibGVcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH0gZWxzZSB7IC8vIExFQVZFXG4gICAgaWYgKHRyYW5zaXRpb25UeXBlKSB7XG4gICAgICAvLyBsZWF2ZSB0cmFuc2l0aW9ucy9hbmltYXRpb25zIGFyZSBib3RoIHRyaWdnZXJlZFxuICAgICAgLy8gYnkgYWRkaW5nIHRoZSBjbGFzcywganVzdCByZW1vdmUgaXQgb24gZW5kIGV2ZW50LlxuICAgICAgdmFyIGV2ZW50ID0gdHJhbnNpdGlvblR5cGUgPT09IDFcbiAgICAgICAgPyBfLnRyYW5zaXRpb25FbmRFdmVudFxuICAgICAgICA6IF8uYW5pbWF0aW9uRW5kRXZlbnRcbiAgICAgIHNldHVwVHJhbnNpdGlvbkNiKGV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9wKClcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wKClcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHVwIGEgdHJhbnNpdGlvbiBlbmQgY2FsbGJhY2ssIHN0b3JlIHRoZSBjYWxsYmFja1xuICAgKiBvbiB0aGUgZWxlbWVudCdzIF9fdl90cmFucyBkYXRhIG9iamVjdCwgc28gd2UgY2FuXG4gICAqIGNsZWFuIGl0IHVwIGlmIGFub3RoZXIgdHJhbnNpdGlvbiBpcyB0cmlnZ2VyZWQgYmVmb3JlXG4gICAqIHRoZSBjYWxsYmFjayBpcyBmaXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjbGVhbnVwRm5dXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldHVwVHJhbnNpdGlvbkNiIChldmVudCwgY2xlYW51cEZuKSB7XG4gICAgZGF0YS5ldmVudCA9IGV2ZW50XG4gICAgdmFyIG9uRW5kID0gZGF0YS5jYWxsYmFjayA9IGZ1bmN0aW9uIHRyYW5zaXRpb25DYiAoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSBlbCkge1xuICAgICAgICBfLm9mZihlbCwgZXZlbnQsIG9uRW5kKVxuICAgICAgICBkYXRhLmV2ZW50ID0gZGF0YS5jYWxsYmFjayA9IG51bGxcbiAgICAgICAgaWYgKGNsZWFudXBGbikgY2xlYW51cEZuKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9XG4gICAgfVxuICAgIF8ub24oZWwsIGV2ZW50LCBvbkVuZClcbiAgfVxufVxuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50J3MgdHJhbnNpdGlvbiB0eXBlIGJhc2VkIG9uIHRoZVxuICogY2FsY3VsYXRlZCBzdHlsZXNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICAxIC0gdHJhbnNpdGlvblxuICogICAgICAgICAyIC0gYW5pbWF0aW9uXG4gKi9cblxuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvblR5cGUgKGVsLCBkYXRhLCBjbGFzc05hbWUpIHtcbiAgdmFyIHR5cGUgPSBkYXRhLmNhY2hlICYmIGRhdGEuY2FjaGVbY2xhc3NOYW1lXVxuICBpZiAodHlwZSkgcmV0dXJuIHR5cGVcbiAgdmFyIGlubGluZVN0eWxlcyA9IGVsLnN0eWxlXG4gIHZhciBjb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICB2YXIgdHJhbnNEdXJhdGlvbiA9XG4gICAgaW5saW5lU3R5bGVzW3RyYW5zRHVyYXRpb25Qcm9wXSB8fFxuICAgIGNvbXB1dGVkU3R5bGVzW3RyYW5zRHVyYXRpb25Qcm9wXVxuICBpZiAodHJhbnNEdXJhdGlvbiAmJiB0cmFuc0R1cmF0aW9uICE9PSAnMHMnKSB7XG4gICAgdHlwZSA9IDFcbiAgfSBlbHNlIHtcbiAgICB2YXIgYW5pbUR1cmF0aW9uID1cbiAgICAgIGlubGluZVN0eWxlc1thbmltRHVyYXRpb25Qcm9wXSB8fFxuICAgICAgY29tcHV0ZWRTdHlsZXNbYW5pbUR1cmF0aW9uUHJvcF1cbiAgICBpZiAoYW5pbUR1cmF0aW9uICYmIGFuaW1EdXJhdGlvbiAhPT0gJzBzJykge1xuICAgICAgdHlwZSA9IDJcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGUpIHtcbiAgICBpZiAoIWRhdGEuY2FjaGUpIGRhdGEuY2FjaGUgPSB7fVxuICAgIGRhdGEuY2FjaGVbY2xhc3NOYW1lXSA9IHR5cGVcbiAgfVxuICByZXR1cm4gdHlwZVxufVxuXG4vKipcbiAqIEFwcGx5IENTUyB0cmFuc2l0aW9uIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvbiAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRhcmdldCBlbGVtZW50J3MgdHJhbnNpdGlvbiBkYXRhXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIGRhdGEsIGNiKSB7XG4gIHZhciBwcmVmaXggPSBkYXRhLmlkIHx8ICd2J1xuICB2YXIgZW50ZXJDbGFzcyA9IHByZWZpeCArICctZW50ZXInXG4gIHZhciBsZWF2ZUNsYXNzID0gcHJlZml4ICsgJy1sZWF2ZSdcbiAgLy8gY2xlYW4gdXAgcG90ZW50aWFsIHByZXZpb3VzIHVuZmluaXNoZWQgdHJhbnNpdGlvblxuICBpZiAoZGF0YS5jYWxsYmFjaykge1xuICAgIF8ub2ZmKGVsLCBkYXRhLmV2ZW50LCBkYXRhLmNhbGxiYWNrKVxuICAgIHJlbW92ZUNsYXNzKGVsLCBlbnRlckNsYXNzKVxuICAgIHJlbW92ZUNsYXNzKGVsLCBsZWF2ZUNsYXNzKVxuICAgIGRhdGEuZXZlbnQgPSBkYXRhLmNhbGxiYWNrID0gbnVsbFxuICB9XG4gIGlmIChkaXJlY3Rpb24gPiAwKSB7IC8vIGVudGVyXG4gICAgYWRkQ2xhc3MoZWwsIGVudGVyQ2xhc3MpXG4gICAgb3AoKVxuICAgIHB1c2goZWwsIGRpcmVjdGlvbiwgbnVsbCwgZW50ZXJDbGFzcywgY2IpXG4gIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgYWRkQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpXG4gICAgcHVzaChlbCwgZGlyZWN0aW9uLCBvcCwgbGVhdmVDbGFzcywgY2IpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFwcGx5Q1NTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vY3NzJylcbnZhciBhcHBseUpTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vanMnKVxudmFyIGRvYyA9IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogZG9jdW1lbnRcblxuLyoqXG4gKiBBcHBlbmQgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmJlZm9yZSA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICBfLmJlZm9yZShlbCwgdGFyZ2V0KVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIHdpdGggdHJhbnNpdGlvbi5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIF8ucmVtb3ZlKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5IGFwcGVuZGluZyB0byBhbm90aGVyIHBhcmVudCB3aXRoIHRyYW5zaXRpb24uXG4gKiBUaGlzIGlzIG9ubHkgdXNlZCBpbiBibG9jayBvcGVyYXRpb25zLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZVRoZW5BcHBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIEFwcGVuZCB0aGUgY2hpbGROb2RlcyBvZiBhIGZyYWdtZW50IHRvIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGJsb2NrXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxuZXhwb3J0cy5ibG9ja0FwcGVuZCA9IGZ1bmN0aW9uIChibG9jaywgdGFyZ2V0LCB2bSkge1xuICB2YXIgbm9kZXMgPSBfLnRvQXJyYXkoYmxvY2suY2hpbGROb2RlcylcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBleHBvcnRzLmJlZm9yZShub2Rlc1tpXSwgdGFyZ2V0LCB2bSlcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGJsb2NrIG9mIG5vZGVzIGJldHdlZW4gdHdvIGVkZ2Ugbm9kZXMuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICogQHBhcmFtIHtOb2RlfSBlbmRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbmV4cG9ydHMuYmxvY2tSZW1vdmUgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgdm0pIHtcbiAgdmFyIG5vZGUgPSBzdGFydC5uZXh0U2libGluZ1xuICB2YXIgbmV4dFxuICB3aGlsZSAobm9kZSAhPT0gZW5kKSB7XG4gICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmdcbiAgICBleHBvcnRzLnJlbW92ZShub2RlLCB2bSlcbiAgICBub2RlID0gbmV4dFxuICB9XG59XG5cbi8qKlxuICogQXBwbHkgdHJhbnNpdGlvbnMgd2l0aCBhbiBvcGVyYXRpb24gY2FsbGJhY2suXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvblxuICogICAgICAgICAgICAgICAgICAxOiBlbnRlclxuICogICAgICAgICAgICAgICAgIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbnZhciBhcHBseSA9IGV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIHZtLCBjYikge1xuICB2YXIgdHJhbnNEYXRhID0gZWwuX192X3RyYW5zXG4gIGlmIChcbiAgICAhdHJhbnNEYXRhIHx8XG4gICAgIXZtLl9pc0NvbXBpbGVkIHx8XG4gICAgLy8gaWYgdGhlIHZtIGlzIGJlaW5nIG1hbmlwdWxhdGVkIGJ5IGEgcGFyZW50IGRpcmVjdGl2ZVxuICAgIC8vIGR1cmluZyB0aGUgcGFyZW50J3MgY29tcGlsYXRpb24gcGhhc2UsIHNraXAgdGhlXG4gICAgLy8gYW5pbWF0aW9uLlxuICAgICh2bS4kcGFyZW50ICYmICF2bS4kcGFyZW50Ll9pc0NvbXBpbGVkKVxuICApIHtcbiAgICBvcCgpXG4gICAgaWYgKGNiKSBjYigpXG4gICAgcmV0dXJuXG4gIH1cbiAgLy8gZGV0ZXJtaW5lIHRoZSB0cmFuc2l0aW9uIHR5cGUgb24gdGhlIGVsZW1lbnRcbiAgdmFyIGpzVHJhbnNpdGlvbiA9IHRyYW5zRGF0YS5mbnNcbiAgaWYgKGpzVHJhbnNpdGlvbikge1xuICAgIC8vIGpzXG4gICAgYXBwbHlKU1RyYW5zaXRpb24oXG4gICAgICBlbCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9wLFxuICAgICAgdHJhbnNEYXRhLFxuICAgICAganNUcmFuc2l0aW9uLFxuICAgICAgdm0sXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIGlmIChcbiAgICBfLnRyYW5zaXRpb25FbmRFdmVudCAmJlxuICAgIC8vIHNraXAgQ1NTIHRyYW5zaXRpb25zIGlmIHBhZ2UgaXMgbm90IHZpc2libGUgLVxuICAgIC8vIHRoaXMgc29sdmVzIHRoZSBpc3N1ZSBvZiB0cmFuc2l0aW9uZW5kIGV2ZW50cyBub3RcbiAgICAvLyBmaXJpbmcgdW50aWwgdGhlIHBhZ2UgaXMgdmlzaWJsZSBhZ2Fpbi5cbiAgICAvLyBwYWdlVmlzaWJpbGl0eSBBUEkgaXMgc3VwcG9ydGVkIGluIElFMTArLCBzYW1lIGFzXG4gICAgLy8gQ1NTIHRyYW5zaXRpb25zLlxuICAgICEoZG9jICYmIGRvYy5oaWRkZW4pXG4gICkge1xuICAgIC8vIGNzc1xuICAgIGFwcGx5Q1NTVHJhbnNpdGlvbihcbiAgICAgIGVsLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgb3AsXG4gICAgICB0cmFuc0RhdGEsXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIHtcbiAgICAvLyBub3QgYXBwbGljYWJsZVxuICAgIG9wKClcbiAgICBpZiAoY2IpIGNiKClcbiAgfVxufSIsIi8qKlxuICogQXBwbHkgSmF2YVNjcmlwdCBlbnRlci9sZWF2ZSBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvbiAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRhcmdldCBlbGVtZW50J3MgdHJhbnNpdGlvbiBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmIC0gdHJhbnNpdGlvbiBkZWZpbml0aW9uIG9iamVjdFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdGhlIG93bmVyIHZtIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIGRhdGEsIGRlZiwgdm0sIGNiKSB7XG4gIC8vIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByb290IG9mIGFuIGluc3RhbmNlLFxuICAvLyB1c2UgdGhhdCBpbnN0YW5jZSBhcyB0aGUgdHJhbnNpdGlvbiBmdW5jdGlvbiBjb250ZXh0XG4gIHZtID0gZWwuX192dWVfXyB8fCB2bVxuICBpZiAoZGF0YS5jYW5jZWwpIHtcbiAgICBkYXRhLmNhbmNlbCgpXG4gICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA+IDApIHsgLy8gZW50ZXJcbiAgICBpZiAoZGVmLmJlZm9yZUVudGVyKSB7XG4gICAgICBkZWYuYmVmb3JlRW50ZXIuY2FsbCh2bSwgZWwpXG4gICAgfVxuICAgIG9wKClcbiAgICBpZiAoZGVmLmVudGVyKSB7XG4gICAgICBkYXRhLmNhbmNlbCA9IGRlZi5lbnRlci5jYWxsKHZtLCBlbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKClcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgaWYgKGRlZi5sZWF2ZSkge1xuICAgICAgZGF0YS5jYW5jZWwgPSBkZWYubGVhdmUuY2FsbCh2bSwgZWwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gICAgICAgIG9wKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcCgpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiBFbmFibGUgZGVidWcgdXRpbGl0aWVzLiBUaGUgZW5hYmxlRGVidWcoKSBmdW5jdGlvbiBhbmRcbiAqIGFsbCBfLmxvZygpICYgXy53YXJuKCkgY2FsbHMgd2lsbCBiZSBkcm9wcGVkIGluIHRoZVxuICogbWluaWZpZWQgcHJvZHVjdGlvbiBidWlsZC5cbiAqL1xuXG5lbmFibGVEZWJ1ZygpXG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnICgpIHtcblxuICB2YXIgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJ1xuICBcbiAgLyoqXG4gICAqIExvZyBhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgY29uZmlnLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW1Z1ZSBpbmZvXTogJyArIG1zZylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2UndmUgZ290IGEgcHJvYmxlbSBoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gICAqL1xuXG4gIGV4cG9ydHMud2FybiA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQgfHwgY29uZmlnLmRlYnVnKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbVnVlIHdhcm5dOiAnICsgbXNnKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICAgIC8qIGpzaGludCBkZWJ1ZzogdHJ1ZSAqL1xuICAgICAgICBkZWJ1Z2dlclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgYXNzZXQgZXhpc3RzXG4gICAqL1xuXG4gIGV4cG9ydHMuYXNzZXJ0QXNzZXQgPSBmdW5jdGlvbiAodmFsLCB0eXBlLCBpZCkge1xuICAgIGlmICghdmFsKSB7XG4gICAgICBleHBvcnRzLndhcm4oJ0ZhaWxlZCB0byByZXNvbHZlICcgKyB0eXBlICsgJzogJyArIGlkKVxuICAgIH1cbiAgfVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBpbiB0aGUgZG9jdW1lbnQuXG4gKiBOb3RlOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMgc2hvdWxkIHdvcmsgaGVyZVxuICogYnV0IGFsd2F5cyByZXR1cm5zIGZhbHNlIGZvciBjb21tZW50IG5vZGVzIGluIHBoYW50b21qcyxcbiAqIG1ha2luZyB1bml0IHRlc3RzIGRpZmZpY3VsdC4gVGhpcyBpcyBmaXhlZCBieXkgZG9pbmcgdGhlXG4gKiBjb250YWlucygpIGNoZWNrIG9uIHRoZSBub2RlJ3MgcGFyZW50Tm9kZSBpbnN0ZWFkIG9mXG4gKiB0aGUgbm9kZSBpdHNlbGYuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciBkb2MgPVxuICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuXG5leHBvcnRzLmluRG9jID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgdmFyIHBhcmVudCA9IG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlXG4gIHJldHVybiBkb2MgPT09IG5vZGUgfHxcbiAgICBkb2MgPT09IHBhcmVudCB8fFxuICAgICEhKHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT09IDEgJiYgKGRvYy5jb250YWlucyhwYXJlbnQpKSlcbn1cblxuLyoqXG4gKiBFeHRyYWN0IGFuIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyXG4gKi9cblxuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgYXR0ciA9IGNvbmZpZy5wcmVmaXggKyBhdHRyXG4gIHZhciB2YWwgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyKVxuICBpZiAodmFsICE9PSBudWxsKSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cilcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbi8qKlxuICogSW5zZXJ0IGVsIGJlZm9yZSB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMuYmVmb3JlID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQpXG59XG5cbi8qKlxuICogSW5zZXJ0IGVsIGFmdGVyIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5hZnRlciA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICBleHBvcnRzLmJlZm9yZShlbCwgdGFyZ2V0Lm5leHRTaWJsaW5nKVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGVsIGZyb20gRE9NXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMucmVtb3ZlID0gZnVuY3Rpb24gKGVsKSB7XG4gIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG59XG5cbi8qKlxuICogUHJlcGVuZCBlbCB0byB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMucHJlcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuICAgIGV4cG9ydHMuYmVmb3JlKGVsLCB0YXJnZXQuZmlyc3RDaGlsZClcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBSZXBsYWNlIHRhcmdldCB3aXRoIGVsXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLnJlcGxhY2UgPSBmdW5jdGlvbiAodGFyZ2V0LCBlbCkge1xuICB2YXIgcGFyZW50ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoZWwsIHRhcmdldClcbiAgfVxufVxuXG4vKipcbiAqIENvcHkgYXR0cmlidXRlcyBmcm9tIG9uZSBlbGVtZW50IHRvIGFub3RoZXIuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBmcm9tXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRvXG4gKi9cblxuZXhwb3J0cy5jb3B5QXR0cmlidXRlcyA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICBpZiAoZnJvbS5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICB2YXIgYXR0cnMgPSBmcm9tLmF0dHJpYnV0ZXNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXVxuICAgICAgdG8uc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLm9uID0gZnVuY3Rpb24gKGVsLCBldmVudCwgY2IpIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIHNob3J0aGFuZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiAoZWwsIGV2ZW50LCBjYikge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYilcbn1cblxuLyoqXG4gKiBBZGQgY2xhc3Mgd2l0aCBjb21wYXRpYmlsaXR5IGZvciBJRSAmIFNWR1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3Ryb25nfSBjbHNcbiAqL1xuXG5leHBvcnRzLmFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKVxuICB9IGVsc2Uge1xuICAgIHZhciBjdXIgPSAnICcgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArICcgJ1xuICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIChjdXIgKyBjbHMpLnRyaW0oKSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgY2xhc3Mgd2l0aCBjb21wYXRpYmlsaXR5IGZvciBJRSAmIFNWR1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3Ryb25nfSBjbHNcbiAqL1xuXG5leHBvcnRzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKVxuICB9IGVsc2Uge1xuICAgIHZhciBjdXIgPSAnICcgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArICcgJ1xuICAgIHZhciB0YXIgPSAnICcgKyBjbHMgKyAnICdcbiAgICB3aGlsZSAoY3VyLmluZGV4T2YodGFyKSA+PSAwKSB7XG4gICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJylcbiAgICB9XG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGN1ci50cmltKCkpXG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHJhdyBjb250ZW50IGluc2lkZSBhbiBlbGVtZW50IGludG8gYSB0ZW1wb3JhcnlcbiAqIGNvbnRhaW5lciBkaXZcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzRnJhZ21lbnRcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cblxuZXhwb3J0cy5leHRyYWN0Q29udGVudCA9IGZ1bmN0aW9uIChlbCwgYXNGcmFnbWVudCkge1xuICB2YXIgY2hpbGRcbiAgdmFyIHJhd0NvbnRlbnRcbiAgaWYgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgIHJhd0NvbnRlbnQgPSBhc0ZyYWdtZW50XG4gICAgICA/IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB3aGlsZSAoY2hpbGQgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICByYXdDb250ZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3Q29udGVudFxufVxuIiwiLyoqXG4gKiBDYW4gd2UgdXNlIF9fcHJvdG9fXz9cbiAqXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmhhc1Byb3RvID0gJ19fcHJvdG9fXycgaW4ge31cblxuLyoqXG4gKiBJbmRpY2F0ZXMgd2UgaGF2ZSBhIHdpbmRvd1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBpbkJyb3dzZXIgPSBleHBvcnRzLmluQnJvd3NlciA9XG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gIHRvU3RyaW5nLmNhbGwod2luZG93KSAhPT0gJ1tvYmplY3QgT2JqZWN0XSdcblxuLyoqXG4gKiBEZWZlciBhIHRhc2sgdG8gZXhlY3V0ZSBpdCBhc3luY2hyb25vdXNseS4gSWRlYWxseSB0aGlzXG4gKiBzaG91bGQgYmUgZXhlY3V0ZWQgYXMgYSBtaWNyb3Rhc2ssIHNvIHdlIGxldmVyYWdlXG4gKiBNdXRhdGlvbk9ic2VydmVyIGlmIGl0J3MgYXZhaWxhYmxlLCBhbmQgZmFsbGJhY2sgdG9cbiAqIHNldFRpbWVvdXQoMCkuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqL1xuXG5leHBvcnRzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbGxiYWNrcyA9IFtdXG4gIHZhciBwZW5kaW5nID0gZmFsc2VcbiAgdmFyIHRpbWVyRnVuY1xuICBmdW5jdGlvbiBoYW5kbGUgKCkge1xuICAgIHBlbmRpbmcgPSBmYWxzZVxuICAgIHZhciBjb3BpZXMgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICBjYWxsYmFja3MgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb3BpZXNbaV0oKVxuICAgIH1cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjb3VudGVyID0gMVxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGhhbmRsZSlcbiAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb3VudGVyKVxuICAgIG9ic2VydmVyLm9ic2VydmUodGV4dE5vZGUsIHtcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWVcbiAgICB9KVxuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvdW50ZXIgPSAoY291bnRlciArIDEpICUgMlxuICAgICAgdGV4dE5vZGUuZGF0YSA9IGNvdW50ZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGltZXJGdW5jID0gc2V0VGltZW91dFxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoY2IsIGN0eCkge1xuICAgIHZhciBmdW5jID0gY3R4XG4gICAgICA/IGZ1bmN0aW9uICgpIHsgY2IuY2FsbChjdHgpIH1cbiAgICAgIDogY2JcbiAgICBjYWxsYmFja3MucHVzaChmdW5jKVxuICAgIGlmIChwZW5kaW5nKSByZXR1cm5cbiAgICBwZW5kaW5nID0gdHJ1ZVxuICAgIHRpbWVyRnVuYyhoYW5kbGUsIDApXG4gIH1cbn0pKClcblxuLyoqXG4gKiBEZXRlY3QgaWYgd2UgYXJlIGluIElFOS4uLlxuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNJRTkgPVxuICBpbkJyb3dzZXIgJiZcbiAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDkuMCcpID4gMFxuXG4vKipcbiAqIFNuaWZmIHRyYW5zaXRpb24vYW5pbWF0aW9uIGV2ZW50c1xuICovXG5cbmlmIChpbkJyb3dzZXIgJiYgIWV4cG9ydHMuaXNJRTkpIHtcbiAgdmFyIGlzV2Via2l0VHJhbnMgPVxuICAgIHdpbmRvdy5vbnRyYW5zaXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdHRyYW5zaXRpb25lbmQgIT09IHVuZGVmaW5lZFxuICB2YXIgaXNXZWJraXRBbmltID1cbiAgICB3aW5kb3cub25hbmltYXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdGFuaW1hdGlvbmVuZCAhPT0gdW5kZWZpbmVkXG4gIGV4cG9ydHMudHJhbnNpdGlvblByb3AgPSBpc1dlYmtpdFRyYW5zXG4gICAgPyAnV2Via2l0VHJhbnNpdGlvbidcbiAgICA6ICd0cmFuc2l0aW9uJ1xuICBleHBvcnRzLnRyYW5zaXRpb25FbmRFdmVudCA9IGlzV2Via2l0VHJhbnNcbiAgICA/ICd3ZWJraXRUcmFuc2l0aW9uRW5kJ1xuICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gIGV4cG9ydHMuYW5pbWF0aW9uUHJvcCA9IGlzV2Via2l0QW5pbVxuICAgID8gJ1dlYmtpdEFuaW1hdGlvbidcbiAgICA6ICdhbmltYXRpb24nXG4gIGV4cG9ydHMuYW5pbWF0aW9uRW5kRXZlbnQgPSBpc1dlYmtpdEFuaW1cbiAgICA/ICd3ZWJraXRBbmltYXRpb25FbmQnXG4gICAgOiAnYW5pbWF0aW9uZW5kJ1xufSIsInZhciBfID0gcmVxdWlyZSgnLi9kZWJ1ZycpXG5cbi8qKlxuICogUmVzb2x2ZSByZWFkICYgd3JpdGUgZmlsdGVycyBmb3IgYSB2bSBpbnN0YW5jZS4gVGhlXG4gKiBmaWx0ZXJzIGRlc2NyaXB0b3IgQXJyYXkgY29tZXMgZnJvbSB0aGUgZGlyZWN0aXZlIHBhcnNlci5cbiAqXG4gKiBUaGlzIGlzIGV4dHJhY3RlZCBpbnRvIGl0cyBvd24gdXRpbGl0eSBzbyBpdCBjYW5cbiAqIGJlIHVzZWQgaW4gbXVsdGlwbGUgc2NlbmFyaW9zLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBmaWx0ZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5leHBvcnRzLnJlc29sdmVGaWx0ZXJzID0gZnVuY3Rpb24gKHZtLCBmaWx0ZXJzLCB0YXJnZXQpIHtcbiAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHJlcyA9IHRhcmdldCB8fCB7fVxuICAvLyB2YXIgcmVnaXN0cnkgPSB2bS4kb3B0aW9ucy5maWx0ZXJzXG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgIHZhciBkZWYgPSB2bS4kb3B0aW9ucy5maWx0ZXJzW2YubmFtZV1cbiAgICBfLmFzc2VydEFzc2V0KGRlZiwgJ2ZpbHRlcicsIGYubmFtZSlcbiAgICBpZiAoIWRlZikgcmV0dXJuXG4gICAgdmFyIGFyZ3MgPSBmLmFyZ3NcbiAgICB2YXIgcmVhZGVyLCB3cml0ZXJcbiAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZGVyID0gZGVmXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWRlciA9IGRlZi5yZWFkXG4gICAgICB3cml0ZXIgPSBkZWYud3JpdGVcbiAgICB9XG4gICAgaWYgKHJlYWRlcikge1xuICAgICAgaWYgKCFyZXMucmVhZCkgcmVzLnJlYWQgPSBbXVxuICAgICAgcmVzLnJlYWQucHVzaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICAgICAgICA/IHJlYWRlci5hcHBseSh2bSwgW3ZhbHVlXS5jb25jYXQoYXJncykpXG4gICAgICAgICAgOiByZWFkZXIuY2FsbCh2bSwgdmFsdWUpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAod3JpdGVyKSB7XG4gICAgICBpZiAoIXJlcy53cml0ZSkgcmVzLndyaXRlID0gW11cbiAgICAgIHJlcy53cml0ZS5wdXNoKGZ1bmN0aW9uICh2YWx1ZSwgb2xkVmFsKSB7XG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgICAgICAgPyB3cml0ZXIuYXBwbHkodm0sIFt2YWx1ZSwgb2xkVmFsXS5jb25jYXQoYXJncykpXG4gICAgICAgICAgOiB3cml0ZXIuY2FsbCh2bSwgdmFsdWUsIG9sZFZhbClcbiAgICAgIH0pXG4gICAgfVxuICB9KVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQXBwbHkgZmlsdGVycyB0byBhIHZhbHVlXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gZmlsdGVyc1xuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0geyp9IG9sZFZhbFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLmFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICh2YWx1ZSwgZmlsdGVycywgdm0sIG9sZFZhbCkge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFsdWUgPSBmaWx0ZXJzW2ldLmNhbGwodm0sIHZhbHVlLCBvbGRWYWwpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59IiwidmFyIGxhbmcgICA9IHJlcXVpcmUoJy4vbGFuZycpXG52YXIgZXh0ZW5kID0gbGFuZy5leHRlbmRcblxuZXh0ZW5kKGV4cG9ydHMsIGxhbmcpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9lbnYnKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2RvbScpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZmlsdGVyJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9kZWJ1ZycpKSIsIi8qKlxuICogQ2hlY2sgaXMgYSBzdHJpbmcgc3RhcnRzIHdpdGggJCBvciBfXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzUmVzZXJ2ZWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHZhciBjID0gKHN0ciArICcnKS5jaGFyQ29kZUF0KDApXG4gIHJldHVybiBjID09PSAweDI0IHx8IGMgPT09IDB4NUZcbn1cblxuLyoqXG4gKiBHdWFyZCB0ZXh0IG91dHB1dCwgbWFrZSBzdXJlIHVuZGVmaW5lZCBvdXRwdXRzXG4gKiBlbXB0eSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy50b1N0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgID8gJydcbiAgICA6IHZhbHVlLnRvU3RyaW5nKClcbn1cblxuLyoqXG4gKiBDaGVjayBhbmQgY29udmVydCBwb3NzaWJsZSBudW1lcmljIG51bWJlcnMgYmVmb3JlXG4gKiBzZXR0aW5nIGJhY2sgdG8gZGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp8TnVtYmVyfVxuICovXG5cbmV4cG9ydHMudG9OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICBpc05hTih2YWx1ZSkgfHxcbiAgICB2YWx1ZSA9PT0gbnVsbCB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nXG4gICkgPyB2YWx1ZVxuICAgIDogTnVtYmVyKHZhbHVlKVxufVxuXG4vKipcbiAqIFN0cmlwIHF1b3RlcyBmcm9tIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nIHwgZmFsc2V9XG4gKi9cblxuZXhwb3J0cy5zdHJpcFF1b3RlcyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIGEgPSBzdHIuY2hhckNvZGVBdCgwKVxuICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KHN0ci5sZW5ndGggLSAxKVxuICByZXR1cm4gYSA9PT0gYiAmJiAoYSA9PT0gMHgyMiB8fCBhID09PSAweDI3KVxuICAgID8gc3RyLnNsaWNlKDEsIC0xKVxuICAgIDogZmFsc2Vcbn1cblxuLyoqXG4gKiBSZXBsYWNlIGhlbHBlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBfIC0gbWF0Y2hlZCBkZWxpbWl0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjIC0gbWF0Y2hlZCBjaGFyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRvVXBwZXIgKF8sIGMpIHtcbiAgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlICgpIDogJydcbn1cblxuLyoqXG4gKiBDYW1lbGl6ZSBhIGh5cGhlbi1kZWxtaXRlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnZhciBjYW1lbFJFID0gLy0oXFx3KS9nXG5leHBvcnRzLmNhbWVsaXplID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxSRSwgdG9VcHBlcilcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBoeXBoZW4vdW5kZXJzY29yZS9zbGFzaCBkZWxpbWl0ZXJlZCBuYW1lcyBpbnRvXG4gKiBjYW1lbGl6ZWQgY2xhc3NOYW1lcy5cbiAqXG4gKiBlLmcuIG15LWNvbXBvbmVudCA9PiBNeUNvbXBvbmVudFxuICogICAgICBzb21lX2Vsc2UgICAgPT4gU29tZUVsc2VcbiAqICAgICAgc29tZS9jb21wICAgID0+IFNvbWVDb21wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnZhciBjbGFzc2lmeVJFID0gLyg/Ol58Wy1fXFwvXSkoXFx3KS9nXG5leHBvcnRzLmNsYXNzaWZ5ID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2xhc3NpZnlSRSwgdG9VcHBlcilcbn1cblxuLyoqXG4gKiBTaW1wbGUgYmluZCwgZmFzdGVyIHRoYW4gbmF0aXZlXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGN0eCwgYXJndW1lbnRzKVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBBcnJheS1saWtlIG9iamVjdCB0byBhIHJlYWwgQXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheS1saWtlfSBsaXN0XG4gKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0XSAtIHN0YXJ0IGluZGV4XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5leHBvcnRzLnRvQXJyYXkgPSBmdW5jdGlvbiAobGlzdCwgc3RhcnQpIHtcbiAgc3RhcnQgPSBzdGFydCB8fCAwXG4gIHZhciBpID0gbGlzdC5sZW5ndGggLSBzdGFydFxuICB2YXIgcmV0ID0gbmV3IEFycmF5KGkpXG4gIHdoaWxlIChpLS0pIHtcbiAgICByZXRbaV0gPSBsaXN0W2kgKyBzdGFydF1cbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogTWl4IHByb3BlcnRpZXMgaW50byB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b1xuICogQHBhcmFtIHtPYmplY3R9IGZyb21cbiAqL1xuXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0bywgZnJvbSkge1xuICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuICAgIHRvW2tleV0gPSBmcm9tW2tleV1cbiAgfVxuICByZXR1cm4gdG9cbn1cblxuLyoqXG4gKiBRdWljayBvYmplY3QgY2hlY2sgLSB0aGlzIGlzIHByaW1hcmlseSB1c2VkIHRvIHRlbGxcbiAqIE9iamVjdHMgZnJvbSBwcmltaXRpdmUgdmFsdWVzIHdoZW4gd2Uga25vdyB0aGUgdmFsdWVcbiAqIGlzIGEgSlNPTi1jb21wbGlhbnQgdHlwZS5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXG59XG5cbi8qKlxuICogU3RyaWN0IG9iamVjdCB0eXBlIGNoZWNrLiBPbmx5IHJldHVybnMgdHJ1ZVxuICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5leHBvcnRzLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nXG59XG5cbi8qKlxuICogQXJyYXkgdHlwZSBjaGVjay5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzQXJyYXkgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9iailcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtlbnVtZXJhYmxlXVxuICovXG5cbmV4cG9ydHMuZGVmaW5lID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgdmFsdWUgICAgICAgIDogdmFsLFxuICAgIGVudW1lcmFibGUgICA6ICEhZW51bWVyYWJsZSxcbiAgICB3cml0YWJsZSAgICAgOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgfSlcbn1cblxuLyoqXG4gKiBEZWJvdW5jZSBhIGZ1bmN0aW9uIHNvIGl0IG9ubHkgZ2V0cyBjYWxsZWQgYWZ0ZXIgdGhlXG4gKiBpbnB1dCBzdG9wcyBhcnJpdmluZyBhZnRlciB0aGUgZ2l2ZW4gd2FpdCBwZXJpb2QuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY1xuICogQHBhcmFtIHtOdW1iZXJ9IHdhaXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuXG5leHBvcnRzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHRcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3QgPSBEYXRlLm5vdygpIC0gdGltZXN0YW1wXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNvbnRleHQgPSB0aGlzXG4gICAgYXJncyA9IGFyZ3VtZW50c1xuICAgIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vaW5kZXgnKVxudmFyIGV4dGVuZCA9IF8uZXh0ZW5kXG5cbi8qKlxuICogT3B0aW9uIG92ZXJ3cml0aW5nIHN0cmF0ZWdpZXMgYXJlIGZ1bmN0aW9ucyB0aGF0IGhhbmRsZVxuICogaG93IHRvIG1lcmdlIGEgcGFyZW50IG9wdGlvbiB2YWx1ZSBhbmQgYSBjaGlsZCBvcHRpb25cbiAqIHZhbHVlIGludG8gdGhlIGZpbmFsIHZhbHVlLlxuICpcbiAqIEFsbCBzdHJhdGVneSBmdW5jdGlvbnMgZm9sbG93IHRoZSBzYW1lIHNpZ25hdHVyZTpcbiAqXG4gKiBAcGFyYW0geyp9IHBhcmVudFZhbFxuICogQHBhcmFtIHsqfSBjaGlsZFZhbFxuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqL1xuXG52YXIgc3RyYXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4vKipcbiAqIEhlbHBlciB0aGF0IHJlY3Vyc2l2ZWx5IG1lcmdlcyB0d28gZGF0YSBvYmplY3RzIHRvZ2V0aGVyLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlRGF0YSAodG8sIGZyb20pIHtcbiAgdmFyIGtleSwgdG9WYWwsIGZyb21WYWxcbiAgZm9yIChrZXkgaW4gZnJvbSkge1xuICAgIHRvVmFsID0gdG9ba2V5XVxuICAgIGZyb21WYWwgPSBmcm9tW2tleV1cbiAgICBpZiAoIXRvLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRvLiRhZGQoa2V5LCBmcm9tVmFsKVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh0b1ZhbCkgJiYgXy5pc09iamVjdChmcm9tVmFsKSkge1xuICAgICAgbWVyZ2VEYXRhKHRvVmFsLCBmcm9tVmFsKVxuICAgIH1cbiAgfVxuICByZXR1cm4gdG9cbn1cblxuLyoqXG4gKiBEYXRhXG4gKi9cblxuc3RyYXRzLmRhdGEgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0pIHtcbiAgaWYgKCF2bSkge1xuICAgIC8vIGluIGEgVnVlLmV4dGVuZCBtZXJnZSwgYm90aCBzaG91bGQgYmUgZnVuY3Rpb25zXG4gICAgaWYgKCFjaGlsZFZhbCkge1xuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdUaGUgXCJkYXRhXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgICAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2RlZmluaXRpb25zLidcbiAgICAgIClcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcbiAgICB9XG4gICAgaWYgKCFwYXJlbnRWYWwpIHtcbiAgICAgIHJldHVybiBjaGlsZFZhbFxuICAgIH1cbiAgICAvLyB3aGVuIHBhcmVudFZhbCAmIGNoaWxkVmFsIGFyZSBib3RoIHByZXNlbnQsXG4gICAgLy8gd2UgbmVlZCB0byByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXG4gICAgLy8gY2hlY2sgaWYgcGFyZW50VmFsIGlzIGEgZnVuY3Rpb24gaGVyZSBiZWNhdXNlXG4gICAgLy8gaXQgaGFzIHRvIGJlIGEgZnVuY3Rpb24gdG8gcGFzcyBwcmV2aW91cyBtZXJnZXMuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbiAoKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKFxuICAgICAgICBjaGlsZFZhbC5jYWxsKHRoaXMpLFxuICAgICAgICBwYXJlbnRWYWwuY2FsbCh0aGlzKVxuICAgICAgKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBpbnN0YW5jZSBtZXJnZSwgcmV0dXJuIHJhdyBvYmplY3RcbiAgICB2YXIgaW5zdGFuY2VEYXRhID0gdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IGNoaWxkVmFsLmNhbGwodm0pXG4gICAgICA6IGNoaWxkVmFsXG4gICAgdmFyIGRlZmF1bHREYXRhID0gdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBwYXJlbnRWYWwuY2FsbCh2bSlcbiAgICAgIDogdW5kZWZpbmVkXG4gICAgaWYgKGluc3RhbmNlRGF0YSkge1xuICAgICAgcmV0dXJuIG1lcmdlRGF0YShpbnN0YW5jZURhdGEsIGRlZmF1bHREYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVmYXVsdERhdGFcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFbFxuICovXG5cbnN0cmF0cy5lbCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSkge1xuICBpZiAoIXZtICYmIGNoaWxkVmFsICYmIHR5cGVvZiBjaGlsZFZhbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8ud2FybihcbiAgICAgICdUaGUgXCJlbFwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcbiAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xuICAgICAgJ2RlZmluaXRpb25zLidcbiAgICApXG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHJldCA9IGNoaWxkVmFsIHx8IHBhcmVudFZhbFxuICAvLyBpbnZva2UgdGhlIGVsZW1lbnQgZmFjdG9yeSBpZiB0aGlzIGlzIGluc3RhbmNlIG1lcmdlXG4gIHJldHVybiB2bSAmJiB0eXBlb2YgcmV0ID09PSAnZnVuY3Rpb24nXG4gICAgPyByZXQuY2FsbCh2bSlcbiAgICA6IHJldFxufVxuXG4vKipcbiAqIEhvb2tzIGFuZCBwYXJhbSBhdHRyaWJ1dGVzIGFyZSBtZXJnZWQgYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy5jcmVhdGVkID1cbnN0cmF0cy5yZWFkeSA9XG5zdHJhdHMuYXR0YWNoZWQgPVxuc3RyYXRzLmRldGFjaGVkID1cbnN0cmF0cy5iZWZvcmVDb21waWxlID1cbnN0cmF0cy5jb21waWxlZCA9XG5zdHJhdHMuYmVmb3JlRGVzdHJveSA9XG5zdHJhdHMuZGVzdHJveWVkID1cbnN0cmF0cy5wYXJhbUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWxcbiAgICA/IHBhcmVudFZhbFxuICAgICAgPyBwYXJlbnRWYWwuY29uY2F0KGNoaWxkVmFsKVxuICAgICAgOiBfLmlzQXJyYXkoY2hpbGRWYWwpXG4gICAgICAgID8gY2hpbGRWYWxcbiAgICAgICAgOiBbY2hpbGRWYWxdXG4gICAgOiBwYXJlbnRWYWxcbn1cblxuLyoqXG4gKiBBc3NldHNcbiAqXG4gKiBXaGVuIGEgdm0gaXMgcHJlc2VudCAoaW5zdGFuY2UgY3JlYXRpb24pLCB3ZSBuZWVkIHRvIGRvXG4gKiBhIHRocmVlLXdheSBtZXJnZSBiZXR3ZWVuIGNvbnN0cnVjdG9yIG9wdGlvbnMsIGluc3RhbmNlXG4gKiBvcHRpb25zIGFuZCBwYXJlbnQgb3B0aW9ucy5cbiAqL1xuXG5zdHJhdHMuZGlyZWN0aXZlcyA9XG5zdHJhdHMuZmlsdGVycyA9XG5zdHJhdHMucGFydGlhbHMgPVxuc3RyYXRzLnRyYW5zaXRpb25zID1cbnN0cmF0cy5jb21wb25lbnRzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtLCBrZXkpIHtcbiAgdmFyIHJldCA9IE9iamVjdC5jcmVhdGUoXG4gICAgdm0gJiYgdm0uJHBhcmVudFxuICAgICAgPyB2bS4kcGFyZW50LiRvcHRpb25zW2tleV1cbiAgICAgIDogXy5WdWUub3B0aW9uc1trZXldXG4gIClcbiAgaWYgKHBhcmVudFZhbCkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMocGFyZW50VmFsKVxuICAgIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgICB2YXIgZmllbGRcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBmaWVsZCA9IGtleXNbaV1cbiAgICAgIHJldFtmaWVsZF0gPSBwYXJlbnRWYWxbZmllbGRdXG4gICAgfVxuICB9XG4gIGlmIChjaGlsZFZhbCkgZXh0ZW5kKHJldCwgY2hpbGRWYWwpXG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBFdmVudHMgJiBXYXRjaGVycy5cbiAqXG4gKiBFdmVudHMgJiB3YXRjaGVycyBoYXNoZXMgc2hvdWxkIG5vdCBvdmVyd3JpdGUgb25lXG4gKiBhbm90aGVyLCBzbyB3ZSBtZXJnZSB0aGVtIGFzIGFycmF5cy5cbiAqL1xuXG5zdHJhdHMud2F0Y2ggPVxuc3RyYXRzLmV2ZW50cyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIGlmICghY2hpbGRWYWwpIHJldHVybiBwYXJlbnRWYWxcbiAgaWYgKCFwYXJlbnRWYWwpIHJldHVybiBjaGlsZFZhbFxuICB2YXIgcmV0ID0ge31cbiAgZXh0ZW5kKHJldCwgcGFyZW50VmFsKVxuICBmb3IgKHZhciBrZXkgaW4gY2hpbGRWYWwpIHtcbiAgICB2YXIgcGFyZW50ID0gcmV0W2tleV1cbiAgICB2YXIgY2hpbGQgPSBjaGlsZFZhbFtrZXldXG4gICAgaWYgKHBhcmVudCAmJiAhXy5pc0FycmF5KHBhcmVudCkpIHtcbiAgICAgIHBhcmVudCA9IFtwYXJlbnRdXG4gICAgfVxuICAgIHJldFtrZXldID0gcGFyZW50XG4gICAgICA/IHBhcmVudC5jb25jYXQoY2hpbGQpXG4gICAgICA6IFtjaGlsZF1cbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogT3RoZXIgb2JqZWN0IGhhc2hlcy5cbiAqL1xuXG5zdHJhdHMubWV0aG9kcyA9XG5zdHJhdHMuY29tcHV0ZWQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSByZXR1cm4gcGFyZW50VmFsXG4gIGlmICghcGFyZW50VmFsKSByZXR1cm4gY2hpbGRWYWxcbiAgdmFyIHJldCA9IE9iamVjdC5jcmVhdGUocGFyZW50VmFsKVxuICBleHRlbmQocmV0LCBjaGlsZFZhbClcbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIERlZmF1bHQgc3RyYXRlZ3kuXG4gKi9cblxudmFyIGRlZmF1bHRTdHJhdCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHJldHVybiBjaGlsZFZhbCA9PT0gdW5kZWZpbmVkXG4gICAgPyBwYXJlbnRWYWxcbiAgICA6IGNoaWxkVmFsXG59XG5cbi8qKlxuICogTWFrZSBzdXJlIGNvbXBvbmVudCBvcHRpb25zIGdldCBjb252ZXJ0ZWQgdG8gYWN0dWFsXG4gKiBjb25zdHJ1Y3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbXBvbmVudHNcbiAqL1xuXG5mdW5jdGlvbiBndWFyZENvbXBvbmVudHMgKGNvbXBvbmVudHMpIHtcbiAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICB2YXIgZGVmXG4gICAgZm9yICh2YXIga2V5IGluIGNvbXBvbmVudHMpIHtcbiAgICAgIGRlZiA9IGNvbXBvbmVudHNba2V5XVxuICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChkZWYpKSB7XG4gICAgICAgIGRlZi5uYW1lID0ga2V5XG4gICAgICAgIGNvbXBvbmVudHNba2V5XSA9IF8uVnVlLmV4dGVuZChkZWYpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdHdvIG9wdGlvbiBvYmplY3RzIGludG8gYSBuZXcgb25lLlxuICogQ29yZSB1dGlsaXR5IHVzZWQgaW4gYm90aCBpbnN0YW50aWF0aW9uIGFuZCBpbmhlcml0YW5jZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyZW50XG4gKiBAcGFyYW0ge09iamVjdH0gY2hpbGRcbiAqIEBwYXJhbSB7VnVlfSBbdm1dIC0gaWYgdm0gaXMgcHJlc2VudCwgaW5kaWNhdGVzIHRoaXMgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgYW4gaW5zdGFudGlhdGlvbiBtZXJnZS5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlT3B0aW9ucyAocGFyZW50LCBjaGlsZCwgdm0pIHtcbiAgZ3VhcmRDb21wb25lbnRzKGNoaWxkLmNvbXBvbmVudHMpXG4gIHZhciBvcHRpb25zID0ge31cbiAgdmFyIGtleVxuICBpZiAoY2hpbGQubWl4aW5zKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZC5taXhpbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJlbnQgPSBtZXJnZU9wdGlvbnMocGFyZW50LCBjaGlsZC5taXhpbnNbaV0sIHZtKVxuICAgIH1cbiAgfVxuICBmb3IgKGtleSBpbiBwYXJlbnQpIHtcbiAgICBtZXJnZShrZXkpXG4gIH1cbiAgZm9yIChrZXkgaW4gY2hpbGQpIHtcbiAgICBpZiAoIShwYXJlbnQuaGFzT3duUHJvcGVydHkoa2V5KSkpIHtcbiAgICAgIG1lcmdlKGtleSlcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWVyZ2UgKGtleSkge1xuICAgIHZhciBzdHJhdCA9IHN0cmF0c1trZXldIHx8IGRlZmF1bHRTdHJhdFxuICAgIG9wdGlvbnNba2V5XSA9IHN0cmF0KHBhcmVudFtrZXldLCBjaGlsZFtrZXldLCB2bSwga2V5KVxuICB9XG4gIHJldHVybiBvcHRpb25zXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGV4dGVuZCA9IF8uZXh0ZW5kXG5cbi8qKlxuICogVGhlIGV4cG9zZWQgVnVlIGNvbnN0cnVjdG9yLlxuICpcbiAqIEFQSSBjb252ZW50aW9uczpcbiAqIC0gcHVibGljIEFQSSBtZXRob2RzL3Byb3BlcnRpZXMgYXJlIHByZWZpZXhlZCB3aXRoIGAkYFxuICogLSBpbnRlcm5hbCBtZXRob2RzL3Byb3BlcnRpZXMgYXJlIHByZWZpeGVkIHdpdGggYF9gXG4gKiAtIG5vbi1wcmVmaXhlZCBwcm9wZXJ0aWVzIGFyZSBhc3N1bWVkIHRvIGJlIHByb3hpZWQgdXNlclxuICogICBkYXRhLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFZ1ZSAob3B0aW9ucykge1xuICB0aGlzLl9pbml0KG9wdGlvbnMpXG59XG5cbi8qKlxuICogTWl4aW4gZ2xvYmFsIEFQSVxuICovXG5cbmV4dGVuZChWdWUsIHJlcXVpcmUoJy4vYXBpL2dsb2JhbCcpKVxuXG4vKipcbiAqIFZ1ZSBhbmQgZXZlcnkgY29uc3RydWN0b3IgdGhhdCBleHRlbmRzIFZ1ZSBoYXMgYW5cbiAqIGFzc29jaWF0ZWQgb3B0aW9ucyBvYmplY3QsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZCBkdXJpbmdcbiAqIGNvbXBpbGF0aW9uIHN0ZXBzIGFzIGB0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnNgLlxuICpcbiAqIFRoZXNlIGNhbiBiZSBzZWVuIGFzIHRoZSBkZWZhdWx0IG9wdGlvbnMgb2YgZXZlcnlcbiAqIFZ1ZSBpbnN0YW5jZS5cbiAqL1xuXG5WdWUub3B0aW9ucyA9IHtcbiAgZGlyZWN0aXZlcyAgOiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKSxcbiAgZmlsdGVycyAgICAgOiByZXF1aXJlKCcuL2ZpbHRlcnMnKSxcbiAgcGFydGlhbHMgICAgOiB7fSxcbiAgdHJhbnNpdGlvbnMgOiB7fSxcbiAgY29tcG9uZW50cyAgOiB7fVxufVxuXG4vKipcbiAqIEJ1aWxkIHVwIHRoZSBwcm90b3R5cGVcbiAqL1xuXG52YXIgcCA9IFZ1ZS5wcm90b3R5cGVcblxuLyoqXG4gKiAkZGF0YSBoYXMgYSBzZXR0ZXIgd2hpY2ggZG9lcyBhIGJ1bmNoIG9mXG4gKiB0ZWFyZG93bi9zZXR1cCB3b3JrXG4gKi9cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHAsICckZGF0YScsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAobmV3RGF0YSkge1xuICAgIHRoaXMuX3NldERhdGEobmV3RGF0YSlcbiAgfVxufSlcblxuLyoqXG4gKiBNaXhpbiBpbnRlcm5hbCBpbnN0YW5jZSBtZXRob2RzXG4gKi9cblxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvaW5pdCcpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvZXZlbnRzJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9zY29wZScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvY29tcGlsZScpKVxuXG4vKipcbiAqIE1peGluIHB1YmxpYyBBUEkgbWV0aG9kc1xuICovXG5cbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9kYXRhJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZG9tJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZXZlbnRzJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvY2hpbGQnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9saWZlY3ljbGUnKSlcblxubW9kdWxlLmV4cG9ydHMgPSBfLlZ1ZSA9IFZ1ZSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuL29ic2VydmVyJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgYmF0Y2hlciA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpXG52YXIgdWlkID0gMFxuXG4vKipcbiAqIEEgd2F0Y2hlciBwYXJzZXMgYW4gZXhwcmVzc2lvbiwgY29sbGVjdHMgZGVwZW5kZW5jaWVzLFxuICogYW5kIGZpcmVzIGNhbGxiYWNrIHdoZW4gdGhlIGV4cHJlc3Npb24gdmFsdWUgY2hhbmdlcy5cbiAqIFRoaXMgaXMgdXNlZCBmb3IgYm90aCB0aGUgJHdhdGNoKCkgYXBpIGFuZCBkaXJlY3RpdmVzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICAgICAgICAgICAgICAgIC0ge0FycmF5fSBmaWx0ZXJzXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdHdvV2F5XG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gZGVlcFxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IHVzZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIFdhdGNoZXIgKHZtLCBleHByZXNzaW9uLCBjYiwgb3B0aW9ucykge1xuICB0aGlzLnZtID0gdm1cbiAgdm0uX3dhdGNoZXJMaXN0LnB1c2godGhpcylcbiAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvblxuICB0aGlzLmNicyA9IFtjYl1cbiAgdGhpcy5pZCA9ICsrdWlkIC8vIHVpZCBmb3IgYmF0Y2hpbmdcbiAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHRoaXMuZGVlcCA9ICEhb3B0aW9ucy5kZWVwXG4gIHRoaXMudXNlciA9ICEhb3B0aW9ucy51c2VyXG4gIHRoaXMuZGVwcyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgLy8gc2V0dXAgZmlsdGVycyBpZiBhbnkuXG4gIC8vIFdlIGRlbGVnYXRlIGRpcmVjdGl2ZSBmaWx0ZXJzIGhlcmUgdG8gdGhlIHdhdGNoZXJcbiAgLy8gYmVjYXVzZSB0aGV5IG5lZWQgdG8gYmUgaW5jbHVkZWQgaW4gdGhlIGRlcGVuZGVuY3lcbiAgLy8gY29sbGVjdGlvbiBwcm9jZXNzLlxuICBpZiAob3B0aW9ucy5maWx0ZXJzKSB7XG4gICAgdGhpcy5yZWFkRmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycy5yZWFkXG4gICAgdGhpcy53cml0ZUZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnMud3JpdGVcbiAgfVxuICAvLyBwYXJzZSBleHByZXNzaW9uIGZvciBnZXR0ZXIvc2V0dGVyXG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwcmVzc2lvbiwgb3B0aW9ucy50d29XYXkpXG4gIHRoaXMuZ2V0dGVyID0gcmVzLmdldFxuICB0aGlzLnNldHRlciA9IHJlcy5zZXRcbiAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0KClcbn1cblxudmFyIHAgPSBXYXRjaGVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIGRlcGVuZGVuY3kgdG8gdGhpcyBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtEZXB9IGRlcFxuICovXG5cbnAuYWRkRGVwID0gZnVuY3Rpb24gKGRlcCkge1xuICB2YXIgaWQgPSBkZXAuaWRcbiAgaWYgKCF0aGlzLm5ld0RlcHNbaWRdKSB7XG4gICAgdGhpcy5uZXdEZXBzW2lkXSA9IGRlcFxuICAgIGlmICghdGhpcy5kZXBzW2lkXSkge1xuICAgICAgdGhpcy5kZXBzW2lkXSA9IGRlcFxuICAgICAgZGVwLmFkZFN1Yih0aGlzKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV2YWx1YXRlIHRoZSBnZXR0ZXIsIGFuZCByZS1jb2xsZWN0IGRlcGVuZGVuY2llcy5cbiAqL1xuXG5wLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5iZWZvcmVHZXQoKVxuICB2YXIgdm0gPSB0aGlzLnZtXG4gIHZhciB2YWx1ZVxuICB0cnkge1xuICAgIHZhbHVlID0gdGhpcy5nZXR0ZXIuY2FsbCh2bSwgdm0pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoY29uZmlnLndhcm5FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdFcnJvciB3aGVuIGV2YWx1YXRpbmcgZXhwcmVzc2lvbiBcIicgK1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gKyAnXCI6XFxuICAgJyArIGVcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgLy8gXCJ0b3VjaFwiIGV2ZXJ5IHByb3BlcnR5IHNvIHRoZXkgYXJlIGFsbCB0cmFja2VkIGFzXG4gIC8vIGRlcGVuZGVuY2llcyBmb3IgZGVlcCB3YXRjaGluZ1xuICBpZiAodGhpcy5kZWVwKSB7XG4gICAgdHJhdmVyc2UodmFsdWUpXG4gIH1cbiAgdmFsdWUgPSBfLmFwcGx5RmlsdGVycyh2YWx1ZSwgdGhpcy5yZWFkRmlsdGVycywgdm0pXG4gIHRoaXMuYWZ0ZXJHZXQoKVxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuXG5wLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgdm0gPSB0aGlzLnZtXG4gIHZhbHVlID0gXy5hcHBseUZpbHRlcnMoXG4gICAgdmFsdWUsIHRoaXMud3JpdGVGaWx0ZXJzLCB2bSwgdGhpcy52YWx1ZVxuICApXG4gIHRyeSB7XG4gICAgdGhpcy5zZXR0ZXIuY2FsbCh2bSwgdm0sIHZhbHVlKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy53YXJuRXhwcmVzc2lvbkVycm9ycykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRXJyb3Igd2hlbiBldmFsdWF0aW5nIHNldHRlciBcIicgK1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gKyAnXCI6XFxuICAgJyArIGVcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcmVwYXJlIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cblxucC5iZWZvcmVHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IHRoaXNcbiAgdGhpcy5uZXdEZXBzID0ge31cbn1cblxuLyoqXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbnAuYWZ0ZXJHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IG51bGxcbiAgZm9yICh2YXIgaWQgaW4gdGhpcy5kZXBzKSB7XG4gICAgaWYgKCF0aGlzLm5ld0RlcHNbaWRdKSB7XG4gICAgICB0aGlzLmRlcHNbaWRdLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHNcbn1cblxuLyoqXG4gKiBTdWJzY3JpYmVyIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gKi9cblxucC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghY29uZmlnLmFzeW5jIHx8IGNvbmZpZy5kZWJ1Zykge1xuICAgIHRoaXMucnVuKClcbiAgfSBlbHNlIHtcbiAgICBiYXRjaGVyLnB1c2godGhpcylcbiAgfVxufVxuXG4vKipcbiAqIEJhdGNoZXIgam9iIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBiYXRjaGVyLlxuICovXG5cbnAucnVuID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgpXG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IHRoaXMudmFsdWUgfHxcbiAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8XG4gICAgICB0aGlzLmRlZXBcbiAgICApIHtcbiAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgICAgdmFyIGNicyA9IHRoaXMuY2JzXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY2JzW2ldKHZhbHVlLCBvbGRWYWx1ZSlcbiAgICAgICAgLy8gaWYgYSBjYWxsYmFjayBhbHNvIHJlbW92ZWQgb3RoZXIgY2FsbGJhY2tzLFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgbG9vcCBhY2NvcmRpbmdseS5cbiAgICAgICAgdmFyIHJlbW92ZWQgPSBsIC0gY2JzLmxlbmd0aFxuICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgIGkgLT0gcmVtb3ZlZFxuICAgICAgICAgIGwgLT0gcmVtb3ZlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5wLmFkZENiID0gZnVuY3Rpb24gKGNiKSB7XG4gIHRoaXMuY2JzLnB1c2goY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5wLnJlbW92ZUNiID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBjYnMgPSB0aGlzLmNic1xuICBpZiAoY2JzLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgaSA9IGNicy5pbmRleE9mKGNiKVxuICAgIGlmIChpID4gLTEpIHtcbiAgICAgIGNicy5zcGxpY2UoaSwgMSlcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2IgPT09IGNic1swXSkge1xuICAgIHRoaXMudGVhcmRvd24oKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHNlbGYgZnJvbSBhbGwgZGVwZW5kZW5jaWVzJyBzdWJjcmliZXIgbGlzdC5cbiAqL1xuXG5wLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHZtJ3Mgd2F0Y2hlciBsaXN0XG4gICAgLy8gd2UgY2FuIHNraXAgdGhpcyBpZiB0aGUgdm0gaWYgYmVpbmcgZGVzdHJveWVkXG4gICAgLy8gd2hpY2ggY2FuIGltcHJvdmUgdGVhcmRvd24gcGVyZm9ybWFuY2UuXG4gICAgaWYgKCF0aGlzLnZtLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgICB2YXIgbGlzdCA9IHRoaXMudm0uX3dhdGNoZXJMaXN0XG4gICAgICB2YXIgaSA9IGxpc3QuaW5kZXhPZih0aGlzKVxuICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICBsaXN0LnNwbGljZShpLCAxKVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLmRlcHMpIHtcbiAgICAgIHRoaXMuZGVwc1tpZF0ucmVtb3ZlU3ViKHRoaXMpXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnZtID0gdGhpcy5jYnMgPSB0aGlzLnZhbHVlID0gbnVsbFxuICB9XG59XG5cblxuLyoqXG4gKiBSZWNydXNpdmVseSB0cmF2ZXJzZSBhbiBvYmplY3QgdG8gZXZva2UgYWxsIGNvbnZlcnRlZFxuICogZ2V0dGVycywgc28gdGhhdCBldmVyeSBuZXN0ZWQgcHJvcGVydHkgaW5zaWRlIHRoZSBvYmplY3RcbiAqIGlzIGNvbGxlY3RlZCBhcyBhIFwiZGVlcFwiIGRlcGVuZGVuY3kuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChvYmopIHtcbiAgdmFyIGtleSwgdmFsLCBpXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIHZhbCA9IG9ialtrZXldXG4gICAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgICBpID0gdmFsLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkgdHJhdmVyc2UodmFsW2ldKVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh2YWwpKSB7XG4gICAgICB0cmF2ZXJzZSh2YWwpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2F0Y2hlciIsInZhciBWdWUgPSByZXF1aXJlKCd2dWUnKVxuXG52YXIgYXBwID0gbmV3IFZ1ZShyZXF1aXJlKCcuL2FwcCcpKVxuXG5hcHAuJG1vdW50KGRvY3VtZW50LmJvZHkpXG4iXX0=
