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
module.exports = '<div class="container">\n	<div class="panel panel-default">\n		<div class="panel-heading">\n			<h3 class="panel-title">Add a webhook</h3>\n		</div>\n		<div class="panel-body">\n			<form v-on="submit: add($event)" class="form-inline">\n				<code>new Firebase("</code>\n				<input v-model="ref" type="text" class="form-control input-sm" placeholder="https://example.firebaseio.com/" required>\n				<code>").auth("</code>\n				<input v-model="token" type="text" class="form-control input-sm" placeholder="token or secret">\n				<code>").on("</code>\n				<select v-model="event" options="events" class="form-control input-sm" required></select>\n				<code>", function () {</code>\n				<input v-model="url" type="text" class="form-control input-sm" placeholder="https://example.com/hooks/firebase" required>\n				<code>})</code>\n				<button type="submit" class="btn btn-sm btn-primary">Save</button>\n			</form>\n		</div>\n	</div>\n\n	<div v-repeat="hook: hooks" class="panel panel-default">\n		<div class="panel-body">\n			<code>new Firebase("{{ hook.ref }}").on("{{ hook.event }}")</code>\n			<span class="glyphicon glyphicon-chevron-right"></span>\n			<code>{{ hook.url }}</code>\n		</div>\n	</div>\n</div>\n';
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkYXNoYm9hcmQvYXBwLmh0bWwiLCJkYXNoYm9hcmQvYXBwLmpzIiwiZGFzaGJvYXJkL2ZpcmViYXNlLmpzIiwiZGFzaGJvYXJkL3ZpZXdzL2Rhc2hib2FyZC9kYXNoYm9hcmQuaHRtbCIsImRhc2hib2FyZC92aWV3cy9kYXNoYm9hcmQvZmlyZWJhc2UtZXZlbnRzLmpzIiwiZGFzaGJvYXJkL3ZpZXdzL2Rhc2hib2FyZC9pbmRleC5qcyIsImRhc2hib2FyZC92aWV3cy9sb2dpbi9pbmRleC5qcyIsImRhc2hib2FyZC92aWV3cy9sb2dpbi9sb2dpbi5odG1sIiwibm9kZV9tb2R1bGVzL2ZpcmViYXNlL2xpYi9maXJlYmFzZS13ZWIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvY2hpbGQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZGF0YS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9kb20uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9saWZlY3ljbGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9iYXRjaGVyLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY2FjaGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb21waWxlci9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvdHJhbnNjbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbmZpZy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvYXR0ci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY2xhc3MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2Nsb2FrLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2VsLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2h0bWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2lmLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvY2hlY2tib3guanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2RlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9yYWRpby5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvc2VsZWN0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9vbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcGFydGlhbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVmLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9yZXBlYXQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3Nob3cuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3N0eWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy90ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy90cmFuc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy93aXRoLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy9hcnJheS1maWx0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZmlsdGVycy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL2NvbXBpbGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9pbml0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2Uvc2NvcGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2RlcC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL2V4cHJlc3Npb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3BhdGguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3RlbXBsYXRlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy90ZXh0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9jc3MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9qcy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZGVidWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2RvbS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZW52LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9sYW5nLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9tZXJnZS1vcHRpb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy92dWUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy93YXRjaGVyLmpzIiwiZGFzaGJvYXJkL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiB2LWNvbXBvbmVudD1cInt7IHZpZXcgfX1cIj48L2Rpdj5cXG4nOyIsInZhciBmaXJlYmFzZSA9IHJlcXVpcmUoJy4vZmlyZWJhc2UnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vYXBwLmh0bWwnKSxcblx0Y29tcG9uZW50czoge1xuXHRcdGxvZ2luOiByZXF1aXJlKCcuL3ZpZXdzL2xvZ2luJyksXG5cdFx0ZGFzaGJvYXJkOiByZXF1aXJlKCcuL3ZpZXdzL2Rhc2hib2FyZCcpXG5cdH0sXG5cdGRhdGE6IHtcblx0XHR2aWV3OiBudWxsXG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRmaXJlYmFzZS5vbkF1dGgoZnVuY3Rpb24gKGF1dGhEYXRhKSB7XG5cdFx0XHR0aGlzLnZpZXcgPSBhdXRoRGF0YSA/ICdkYXNoYm9hcmQnIDogJ2xvZ2luJ1xuXHRcdH0sIHRoaXMpXG5cdH1cbn1cbiIsInZhciBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJylcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vd2ViaG9va3MuZmlyZWJhc2Vpby5jb20nKVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxcblx0PGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cXG5cdFx0PGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5cXG5cdFx0XHQ8aDMgY2xhc3M9XCJwYW5lbC10aXRsZVwiPkFkZCBhIHdlYmhvb2s8L2gzPlxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cXG5cdFx0XHQ8Zm9ybSB2LW9uPVwic3VibWl0OiBhZGQoJGV2ZW50KVwiIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj5cXG5cdFx0XHRcdDxjb2RlPm5ldyBGaXJlYmFzZShcIjwvY29kZT5cXG5cdFx0XHRcdDxpbnB1dCB2LW1vZGVsPVwicmVmXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwiaHR0cHM6Ly9leGFtcGxlLmZpcmViYXNlaW8uY29tL1wiIHJlcXVpcmVkPlxcblx0XHRcdFx0PGNvZGU+XCIpLmF1dGgoXCI8L2NvZGU+XFxuXHRcdFx0XHQ8aW5wdXQgdi1tb2RlbD1cInRva2VuXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHBsYWNlaG9sZGVyPVwidG9rZW4gb3Igc2VjcmV0XCI+XFxuXHRcdFx0XHQ8Y29kZT5cIikub24oXCI8L2NvZGU+XFxuXHRcdFx0XHQ8c2VsZWN0IHYtbW9kZWw9XCJldmVudFwiIG9wdGlvbnM9XCJldmVudHNcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIHJlcXVpcmVkPjwvc2VsZWN0Plxcblx0XHRcdFx0PGNvZGU+XCIsIGZ1bmN0aW9uICgpIHs8L2NvZGU+XFxuXHRcdFx0XHQ8aW5wdXQgdi1tb2RlbD1cInVybFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtc21cIiBwbGFjZWhvbGRlcj1cImh0dHBzOi8vZXhhbXBsZS5jb20vaG9va3MvZmlyZWJhc2VcIiByZXF1aXJlZD5cXG5cdFx0XHRcdDxjb2RlPn0pPC9jb2RlPlxcblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1wcmltYXJ5XCI+U2F2ZTwvYnV0dG9uPlxcblx0XHRcdDwvZm9ybT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG5cXG5cdDxkaXYgdi1yZXBlYXQ9XCJob29rOiBob29rc1wiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxcblx0XHRcdDxjb2RlPm5ldyBGaXJlYmFzZShcInt7IGhvb2sucmVmIH19XCIpLm9uKFwie3sgaG9vay5ldmVudCB9fVwiKTwvY29kZT5cXG5cdFx0XHQ8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tY2hldnJvbi1yaWdodFwiPjwvc3Bhbj5cXG5cdFx0XHQ8Y29kZT57eyBob29rLnVybCB9fTwvY29kZT5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gW1xuXHQndmFsdWUnLFxuXHQnY2hpbGRfYWRkZWQnLFxuXHQnY2hpbGRfY2hhbmdlZCcsXG5cdCdjaGlsZF9yZW1vdmVkJyxcblx0J2NoaWxkX21vdmVkJ1xuXVxuIiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxudmFyIGZpcmViYXNlID0gcmVxdWlyZSgnLi4vLi4vZmlyZWJhc2UnKVxuXG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9maXJlYmFzZS1ldmVudHMnKVxuXG5mdW5jdGlvbiBob29rc1JlZiAoKSB7XG5cdHZhciBhdXRoID0gZmlyZWJhc2UuZ2V0QXV0aCgpXG5cdHJldHVybiBmaXJlYmFzZS5jaGlsZCgnaG9va3MnKS5jaGlsZChhdXRoLnVpZClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2Rhc2hib2FyZC5odG1sJyksXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aG9va3M6IG51bGwsXG5cdFx0XHRldmVudHM6IGV2ZW50cyxcblx0XHRcdC8vIGluaXQgZm9ybSBmaWVsZHNcblx0XHRcdHJlZjogbnVsbCxcblx0XHRcdHRva2VuOiBudWxsLFxuXHRcdFx0ZXZlbnQ6IGV2ZW50c1swXSxcblx0XHRcdHVybDogbnVsbFxuXHRcdH1cblx0fSxcblx0bWV0aG9kczoge1xuXHRcdGFkZDogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdGhvb2tzUmVmKCkucHVzaCh7XG5cdFx0XHRcdHJlZjogdGhpcy5yZWYsXG5cdFx0XHRcdHRva2VuOiB0aGlzLnRva2VuICYmIHRoaXMudG9rZW4gIT09ICcnID8gdGhpcy50b2tlbiA6IG51bGwsXG5cdFx0XHRcdGV2ZW50OiB0aGlzLmV2ZW50LFxuXHRcdFx0XHR1cmw6IHRoaXMudXJsLFxuXHRcdFx0XHRjcmVhdGVkX2F0OiBGaXJlYmFzZS5TZXJ2ZXJWYWx1ZS5USU1FU1RBTVBcblx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0aWYgKGVycikgY29uc29sZS5lcnJvcignQ291bGQgbm90IGFkZCBob29rOicsIGVycilcblx0XHRcdH0pXG5cblx0XHRcdHRoaXMucmVmID0gbnVsbFxuXHRcdFx0dGhpcy50b2tlbiA9IG51bGxcblx0XHRcdHRoaXMudXJsID0gbnVsbFxuXHRcdH1cblx0fSxcblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBhdXRoID0gZmlyZWJhc2UuZ2V0QXV0aCgpXG5cblx0XHRob29rc1JlZigpLm9uKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuXHRcdFx0dGhpcy5ob29rcyA9IHNuYXBzaG90LnZhbCgpXG5cdFx0fSwgZnVuY3Rpb24gKGVycikge1xuXHRcdFx0Y29uc29sZS5lcnJvcignQ291bGQgbm90IGdldCBob29rczonLCBlcnIpXG5cdFx0fSwgdGhpcylcblx0fVxufVxuIiwidmFyIGZpcmViYXNlID0gcmVxdWlyZSgnLi4vLi4vZmlyZWJhc2UnKVxuXG4vLyBUT0RPOiBzdG9yZSBsb2dpbnNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2xvZ2luLmh0bWwnKSxcblx0bWV0aG9kczoge1xuXHRcdGxvZ2luOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdFx0ZmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwKCdnaXRodWInLCBmdW5jdGlvbiAoZXJyLCBhdXRoRGF0YSkge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0xvZ2luIGZhaWxlZDonLCBlcnIpXG5cdFx0XHRcdFx0YWxlcnQoJ0xvZ2luIGZhaWxlZC5cXG5cXG4nICsgZXJyLm1lc3NhZ2UpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XFxuXHQ8ZGl2IGNsYXNzPVwicm93XCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBjb2wtbWQtb2Zmc2V0LTNcIj5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwianVtYm90cm9uIHRleHQtY2VudGVyXCI+XFxuXHRcdFx0XHQ8aDE+V2ViaG9va3MgZm9yIEZpcmViYXNlPC9oMT5cXG5cdFx0XHRcdDxicj5cXG5cdFx0XHRcdDxwPlxcblx0XHRcdFx0XHQ8YnV0dG9uIHYtb249XCJjbGljazogbG9naW4oJGV2ZW50KVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGcgYnRuLXByaW1hcnlcIj5cXG5cdFx0XHRcdFx0XHRMb2cgaW4gd2l0aCBHaXRIdWJcXG5cdFx0XHRcdFx0PC9idXR0b24+XFxuXHRcdFx0XHQ8L3A+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCIvKiEgQGxpY2Vuc2UgRmlyZWJhc2UgdjIuMi41XG4gICAgTGljZW5zZTogaHR0cHM6Ly93d3cuZmlyZWJhc2UuY29tL3Rlcm1zL3Rlcm1zLW9mLXNlcnZpY2UuaHRtbCAqL1xuKGZ1bmN0aW9uKCkge3ZhciBoLGFhPXRoaXM7ZnVuY3Rpb24gbihhKXtyZXR1cm4gdm9pZCAwIT09YX1mdW5jdGlvbiBiYSgpe31mdW5jdGlvbiBjYShhKXthLnViPWZ1bmN0aW9uKCl7cmV0dXJuIGEudGY/YS50ZjphLnRmPW5ldyBhfX1cbmZ1bmN0aW9uIGRhKGEpe3ZhciBiPXR5cGVvZiBhO2lmKFwib2JqZWN0XCI9PWIpaWYoYSl7aWYoYSBpbnN0YW5jZW9mIEFycmF5KXJldHVyblwiYXJyYXlcIjtpZihhIGluc3RhbmNlb2YgT2JqZWN0KXJldHVybiBiO3ZhciBjPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKTtpZihcIltvYmplY3QgV2luZG93XVwiPT1jKXJldHVyblwib2JqZWN0XCI7aWYoXCJbb2JqZWN0IEFycmF5XVwiPT1jfHxcIm51bWJlclwiPT10eXBlb2YgYS5sZW5ndGgmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnNwbGljZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEucHJvcGVydHlJc0VudW1lcmFibGUmJiFhLnByb3BlcnR5SXNFbnVtZXJhYmxlKFwic3BsaWNlXCIpKXJldHVyblwiYXJyYXlcIjtpZihcIltvYmplY3QgRnVuY3Rpb25dXCI9PWN8fFwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLmNhbGwmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnByb3BlcnR5SXNFbnVtZXJhYmxlJiYhYS5wcm9wZXJ0eUlzRW51bWVyYWJsZShcImNhbGxcIikpcmV0dXJuXCJmdW5jdGlvblwifWVsc2UgcmV0dXJuXCJudWxsXCI7XG5lbHNlIGlmKFwiZnVuY3Rpb25cIj09YiYmXCJ1bmRlZmluZWRcIj09dHlwZW9mIGEuY2FsbClyZXR1cm5cIm9iamVjdFwiO3JldHVybiBifWZ1bmN0aW9uIGVhKGEpe3JldHVyblwiYXJyYXlcIj09ZGEoYSl9ZnVuY3Rpb24gZmEoYSl7dmFyIGI9ZGEoYSk7cmV0dXJuXCJhcnJheVwiPT1ifHxcIm9iamVjdFwiPT1iJiZcIm51bWJlclwiPT10eXBlb2YgYS5sZW5ndGh9ZnVuY3Rpb24gcChhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBnYShhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYX1mdW5jdGlvbiBoYShhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PWRhKGEpfWZ1bmN0aW9uIGlhKGEpe3ZhciBiPXR5cGVvZiBhO3JldHVyblwib2JqZWN0XCI9PWImJm51bGwhPWF8fFwiZnVuY3Rpb25cIj09Yn1mdW5jdGlvbiBqYShhLGIsYyl7cmV0dXJuIGEuY2FsbC5hcHBseShhLmJpbmQsYXJndW1lbnRzKX1cbmZ1bmN0aW9uIGthKGEsYixjKXtpZighYSl0aHJvdyBFcnJvcigpO2lmKDI8YXJndW1lbnRzLmxlbmd0aCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7QXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoYyxkKTtyZXR1cm4gYS5hcHBseShiLGMpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShiLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIHEoYSxiLGMpe3E9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmJi0xIT1GdW5jdGlvbi5wcm90b3R5cGUuYmluZC50b1N0cmluZygpLmluZGV4T2YoXCJuYXRpdmUgY29kZVwiKT9qYTprYTtyZXR1cm4gcS5hcHBseShudWxsLGFyZ3VtZW50cyl9dmFyIGxhPURhdGUubm93fHxmdW5jdGlvbigpe3JldHVybituZXcgRGF0ZX07XG5mdW5jdGlvbiBtYShhLGIpe2Z1bmN0aW9uIGMoKXt9Yy5wcm90b3R5cGU9Yi5wcm90b3R5cGU7YS5aZz1iLnByb3RvdHlwZTthLnByb3RvdHlwZT1uZXcgYzthLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1hO2EuVmc9ZnVuY3Rpb24oYSxjLGYpe2Zvcih2YXIgZz1BcnJheShhcmd1bWVudHMubGVuZ3RoLTIpLGs9MjtrPGFyZ3VtZW50cy5sZW5ndGg7aysrKWdbay0yXT1hcmd1bWVudHNba107cmV0dXJuIGIucHJvdG90eXBlW2NdLmFwcGx5KGEsZyl9fTtmdW5jdGlvbiByKGEsYil7Zm9yKHZhciBjIGluIGEpYi5jYWxsKHZvaWQgMCxhW2NdLGMsYSl9ZnVuY3Rpb24gbmEoYSxiKXt2YXIgYz17fSxkO2ZvcihkIGluIGEpY1tkXT1iLmNhbGwodm9pZCAwLGFbZF0sZCxhKTtyZXR1cm4gY31mdW5jdGlvbiBvYShhLGIpe2Zvcih2YXIgYyBpbiBhKWlmKCFiLmNhbGwodm9pZCAwLGFbY10sYyxhKSlyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiBwYShhKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSliKys7cmV0dXJuIGJ9ZnVuY3Rpb24gcWEoYSl7Zm9yKHZhciBiIGluIGEpcmV0dXJuIGJ9ZnVuY3Rpb24gcmEoYSl7dmFyIGI9W10sYz0wLGQ7Zm9yKGQgaW4gYSliW2MrK109YVtkXTtyZXR1cm4gYn1mdW5jdGlvbiBzYShhKXt2YXIgYj1bXSxjPTAsZDtmb3IoZCBpbiBhKWJbYysrXT1kO3JldHVybiBifWZ1bmN0aW9uIHRhKGEsYil7Zm9yKHZhciBjIGluIGEpaWYoYVtjXT09YilyZXR1cm4hMDtyZXR1cm4hMX1cbmZ1bmN0aW9uIHVhKGEsYixjKXtmb3IodmFyIGQgaW4gYSlpZihiLmNhbGwoYyxhW2RdLGQsYSkpcmV0dXJuIGR9ZnVuY3Rpb24gdmEoYSxiKXt2YXIgYz11YShhLGIsdm9pZCAwKTtyZXR1cm4gYyYmYVtjXX1mdW5jdGlvbiB3YShhKXtmb3IodmFyIGIgaW4gYSlyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiB4YShhKXt2YXIgYj17fSxjO2ZvcihjIGluIGEpYltjXT1hW2NdO3JldHVybiBifXZhciB5YT1cImNvbnN0cnVjdG9yIGhhc093blByb3BlcnR5IGlzUHJvdG90eXBlT2YgcHJvcGVydHlJc0VudW1lcmFibGUgdG9Mb2NhbGVTdHJpbmcgdG9TdHJpbmcgdmFsdWVPZlwiLnNwbGl0KFwiIFwiKTtcbmZ1bmN0aW9uIHphKGEsYil7Zm9yKHZhciBjLGQsZT0xO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspe2Q9YXJndW1lbnRzW2VdO2ZvcihjIGluIGQpYVtjXT1kW2NdO2Zvcih2YXIgZj0wO2Y8eWEubGVuZ3RoO2YrKyljPXlhW2ZdLE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkLGMpJiYoYVtjXT1kW2NdKX19O2Z1bmN0aW9uIEFhKGEpe2E9U3RyaW5nKGEpO2lmKC9eXFxzKiQvLnRlc3QoYSk/MDovXltcXF0sOnt9XFxzXFx1MjAyOFxcdTIwMjldKiQvLnRlc3QoYS5yZXBsYWNlKC9cXFxcW1wiXFxcXFxcL2JmbnJ0dV0vZyxcIkBcIikucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxcclxcdTIwMjhcXHUyMDI5XFx4MDAtXFx4MDhcXHgwYS1cXHgxZl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csXCJdXCIpLnJlcGxhY2UoLyg/Ol58OnwsKSg/OltcXHNcXHUyMDI4XFx1MjAyOV0qXFxbKSsvZyxcIlwiKSkpdHJ5e3JldHVybiBldmFsKFwiKFwiK2ErXCIpXCIpfWNhdGNoKGIpe310aHJvdyBFcnJvcihcIkludmFsaWQgSlNPTiBzdHJpbmc6IFwiK2EpO31mdW5jdGlvbiBCYSgpe3RoaXMuUGQ9dm9pZCAwfVxuZnVuY3Rpb24gQ2EoYSxiLGMpe3N3aXRjaCh0eXBlb2YgYil7Y2FzZSBcInN0cmluZ1wiOkRhKGIsYyk7YnJlYWs7Y2FzZSBcIm51bWJlclwiOmMucHVzaChpc0Zpbml0ZShiKSYmIWlzTmFOKGIpP2I6XCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJib29sZWFuXCI6Yy5wdXNoKGIpO2JyZWFrO2Nhc2UgXCJ1bmRlZmluZWRcIjpjLnB1c2goXCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJvYmplY3RcIjppZihudWxsPT1iKXtjLnB1c2goXCJudWxsXCIpO2JyZWFrfWlmKGVhKGIpKXt2YXIgZD1iLmxlbmd0aDtjLnB1c2goXCJbXCIpO2Zvcih2YXIgZT1cIlwiLGY9MDtmPGQ7ZisrKWMucHVzaChlKSxlPWJbZl0sQ2EoYSxhLlBkP2EuUGQuY2FsbChiLFN0cmluZyhmKSxlKTplLGMpLGU9XCIsXCI7Yy5wdXNoKFwiXVwiKTticmVha31jLnB1c2goXCJ7XCIpO2Q9XCJcIjtmb3IoZiBpbiBiKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLGYpJiYoZT1iW2ZdLFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJihjLnB1c2goZCksRGEoZixjKSxcbmMucHVzaChcIjpcIiksQ2EoYSxhLlBkP2EuUGQuY2FsbChiLGYsZSk6ZSxjKSxkPVwiLFwiKSk7Yy5wdXNoKFwifVwiKTticmVhaztjYXNlIFwiZnVuY3Rpb25cIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiVW5rbm93biB0eXBlOiBcIit0eXBlb2YgYik7fX12YXIgRWE9eydcIic6J1xcXFxcIicsXCJcXFxcXCI6XCJcXFxcXFxcXFwiLFwiL1wiOlwiXFxcXC9cIixcIlxcYlwiOlwiXFxcXGJcIixcIlxcZlwiOlwiXFxcXGZcIixcIlxcblwiOlwiXFxcXG5cIixcIlxcclwiOlwiXFxcXHJcIixcIlxcdFwiOlwiXFxcXHRcIixcIlxceDBCXCI6XCJcXFxcdTAwMGJcIn0sRmE9L1xcdWZmZmYvLnRlc3QoXCJcXHVmZmZmXCIpPy9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxcdWZmZmZdL2c6L1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4ZmZdL2c7XG5mdW5jdGlvbiBEYShhLGIpe2IucHVzaCgnXCInLGEucmVwbGFjZShGYSxmdW5jdGlvbihhKXtpZihhIGluIEVhKXJldHVybiBFYVthXTt2YXIgYj1hLmNoYXJDb2RlQXQoMCksZT1cIlxcXFx1XCI7MTY+Yj9lKz1cIjAwMFwiOjI1Nj5iP2UrPVwiMDBcIjo0MDk2PmImJihlKz1cIjBcIik7cmV0dXJuIEVhW2FdPWUrYi50b1N0cmluZygxNil9KSwnXCInKX07ZnVuY3Rpb24gR2EoKXtyZXR1cm4gTWF0aC5mbG9vcigyMTQ3NDgzNjQ4Kk1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KStNYXRoLmFicyhNYXRoLmZsb29yKDIxNDc0ODM2NDgqTWF0aC5yYW5kb20oKSlebGEoKSkudG9TdHJpbmcoMzYpfTt2YXIgSGE7YTp7dmFyIElhPWFhLm5hdmlnYXRvcjtpZihJYSl7dmFyIEphPUlhLnVzZXJBZ2VudDtpZihKYSl7SGE9SmE7YnJlYWsgYX19SGE9XCJcIn07ZnVuY3Rpb24gS2EoKXt0aGlzLldhPS0xfTtmdW5jdGlvbiBMYSgpe3RoaXMuV2E9LTE7dGhpcy5XYT02NDt0aGlzLlI9W107dGhpcy5sZT1bXTt0aGlzLlRmPVtdO3RoaXMuSWQ9W107dGhpcy5JZFswXT0xMjg7Zm9yKHZhciBhPTE7YTx0aGlzLldhOysrYSl0aGlzLklkW2FdPTA7dGhpcy5iZT10aGlzLiRiPTA7dGhpcy5yZXNldCgpfW1hKExhLEthKTtMYS5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLlJbMF09MTczMjU4NDE5Mzt0aGlzLlJbMV09NDAyMzIzMzQxNzt0aGlzLlJbMl09MjU2MjM4MzEwMjt0aGlzLlJbM109MjcxNzMzODc4O3RoaXMuUls0XT0zMjg1Mzc3NTIwO3RoaXMuYmU9dGhpcy4kYj0wfTtcbmZ1bmN0aW9uIE1hKGEsYixjKXtjfHwoYz0wKTt2YXIgZD1hLlRmO2lmKHAoYikpZm9yKHZhciBlPTA7MTY+ZTtlKyspZFtlXT1iLmNoYXJDb2RlQXQoYyk8PDI0fGIuY2hhckNvZGVBdChjKzEpPDwxNnxiLmNoYXJDb2RlQXQoYysyKTw8OHxiLmNoYXJDb2RlQXQoYyszKSxjKz00O2Vsc2UgZm9yKGU9MDsxNj5lO2UrKylkW2VdPWJbY108PDI0fGJbYysxXTw8MTZ8YltjKzJdPDw4fGJbYyszXSxjKz00O2ZvcihlPTE2OzgwPmU7ZSsrKXt2YXIgZj1kW2UtM11eZFtlLThdXmRbZS0xNF1eZFtlLTE2XTtkW2VdPShmPDwxfGY+Pj4zMSkmNDI5NDk2NzI5NX1iPWEuUlswXTtjPWEuUlsxXTtmb3IodmFyIGc9YS5SWzJdLGs9YS5SWzNdLGw9YS5SWzRdLG0sZT0wOzgwPmU7ZSsrKTQwPmU/MjA+ZT8oZj1rXmMmKGdeayksbT0xNTE4NTAwMjQ5KTooZj1jXmdeayxtPTE4NTk3NzUzOTMpOjYwPmU/KGY9YyZnfGsmKGN8ZyksbT0yNDAwOTU5NzA4KTooZj1jXmdeayxtPTMzOTU0Njk3ODIpLGY9KGI8PFxuNXxiPj4+MjcpK2YrbCttK2RbZV0mNDI5NDk2NzI5NSxsPWssaz1nLGc9KGM8PDMwfGM+Pj4yKSY0Mjk0OTY3Mjk1LGM9YixiPWY7YS5SWzBdPWEuUlswXStiJjQyOTQ5NjcyOTU7YS5SWzFdPWEuUlsxXStjJjQyOTQ5NjcyOTU7YS5SWzJdPWEuUlsyXStnJjQyOTQ5NjcyOTU7YS5SWzNdPWEuUlszXStrJjQyOTQ5NjcyOTU7YS5SWzRdPWEuUls0XStsJjQyOTQ5NjcyOTV9XG5MYS5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7aWYobnVsbCE9YSl7bihiKXx8KGI9YS5sZW5ndGgpO2Zvcih2YXIgYz1iLXRoaXMuV2EsZD0wLGU9dGhpcy5sZSxmPXRoaXMuJGI7ZDxiOyl7aWYoMD09Zilmb3IoO2Q8PWM7KU1hKHRoaXMsYSxkKSxkKz10aGlzLldhO2lmKHAoYSkpZm9yKDtkPGI7KXtpZihlW2ZdPWEuY2hhckNvZGVBdChkKSwrK2YsKytkLGY9PXRoaXMuV2Epe01hKHRoaXMsZSk7Zj0wO2JyZWFrfX1lbHNlIGZvcig7ZDxiOylpZihlW2ZdPWFbZF0sKytmLCsrZCxmPT10aGlzLldhKXtNYSh0aGlzLGUpO2Y9MDticmVha319dGhpcy4kYj1mO3RoaXMuYmUrPWJ9fTt2YXIgdD1BcnJheS5wcm90b3R5cGUsTmE9dC5pbmRleE9mP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5pbmRleE9mLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Yz1udWxsPT1jPzA6MD5jP01hdGgubWF4KDAsYS5sZW5ndGgrYyk6YztpZihwKGEpKXJldHVybiBwKGIpJiYxPT1iLmxlbmd0aD9hLmluZGV4T2YoYixjKTotMTtmb3IoO2M8YS5sZW5ndGg7YysrKWlmKGMgaW4gYSYmYVtjXT09PWIpcmV0dXJuIGM7cmV0dXJuLTF9LE9hPXQuZm9yRWFjaD9mdW5jdGlvbihhLGIsYyl7dC5mb3JFYWNoLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspZiBpbiBlJiZiLmNhbGwoYyxlW2ZdLGYsYSl9LFBhPXQuZmlsdGVyP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5maWx0ZXIuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1bXSxmPTAsZz1wKGEpP1xuYS5zcGxpdChcIlwiKTphLGs9MDtrPGQ7aysrKWlmKGsgaW4gZyl7dmFyIGw9Z1trXTtiLmNhbGwoYyxsLGssYSkmJihlW2YrK109bCl9cmV0dXJuIGV9LFFhPXQubWFwP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5tYXAuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1BcnJheShkKSxmPXAoYSk/YS5zcGxpdChcIlwiKTphLGc9MDtnPGQ7ZysrKWcgaW4gZiYmKGVbZ109Yi5jYWxsKGMsZltnXSxnLGEpKTtyZXR1cm4gZX0sUmE9dC5yZWR1Y2U/ZnVuY3Rpb24oYSxiLGMsZCl7Zm9yKHZhciBlPVtdLGY9MSxnPWFyZ3VtZW50cy5sZW5ndGg7ZjxnO2YrKyllLnB1c2goYXJndW1lbnRzW2ZdKTtkJiYoZVswXT1xKGIsZCkpO3JldHVybiB0LnJlZHVjZS5hcHBseShhLGUpfTpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1jO09hKGEsZnVuY3Rpb24oYyxnKXtlPWIuY2FsbChkLGUsYyxnLGEpfSk7cmV0dXJuIGV9LFNhPXQuZXZlcnk/ZnVuY3Rpb24oYSxiLFxuYyl7cmV0dXJuIHQuZXZlcnkuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylpZihmIGluIGUmJiFiLmNhbGwoYyxlW2ZdLGYsYSkpcmV0dXJuITE7cmV0dXJuITB9O2Z1bmN0aW9uIFRhKGEsYil7dmFyIGM9VWEoYSxiLHZvaWQgMCk7cmV0dXJuIDA+Yz9udWxsOnAoYSk/YS5jaGFyQXQoYyk6YVtjXX1mdW5jdGlvbiBVYShhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspaWYoZiBpbiBlJiZiLmNhbGwoYyxlW2ZdLGYsYSkpcmV0dXJuIGY7cmV0dXJuLTF9ZnVuY3Rpb24gVmEoYSxiKXt2YXIgYz1OYShhLGIpOzA8PWMmJnQuc3BsaWNlLmNhbGwoYSxjLDEpfWZ1bmN0aW9uIFdhKGEsYixjKXtyZXR1cm4gMj49YXJndW1lbnRzLmxlbmd0aD90LnNsaWNlLmNhbGwoYSxiKTp0LnNsaWNlLmNhbGwoYSxiLGMpfVxuZnVuY3Rpb24gWGEoYSxiKXthLnNvcnQoYnx8WWEpfWZ1bmN0aW9uIFlhKGEsYil7cmV0dXJuIGE+Yj8xOmE8Yj8tMTowfTt2YXIgWmE9LTEhPUhhLmluZGV4T2YoXCJPcGVyYVwiKXx8LTEhPUhhLmluZGV4T2YoXCJPUFJcIiksJGE9LTEhPUhhLmluZGV4T2YoXCJUcmlkZW50XCIpfHwtMSE9SGEuaW5kZXhPZihcIk1TSUVcIiksYWI9LTEhPUhhLmluZGV4T2YoXCJHZWNrb1wiKSYmLTE9PUhhLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKSYmISgtMSE9SGEuaW5kZXhPZihcIlRyaWRlbnRcIil8fC0xIT1IYS5pbmRleE9mKFwiTVNJRVwiKSksYmI9LTEhPUhhLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKTtcbihmdW5jdGlvbigpe3ZhciBhPVwiXCIsYjtpZihaYSYmYWEub3BlcmEpcmV0dXJuIGE9YWEub3BlcmEudmVyc2lvbixoYShhKT9hKCk6YTthYj9iPS9ydlxcOihbXlxcKTtdKykoXFwpfDspLzokYT9iPS9cXGIoPzpNU0lFfHJ2KVs6IF0oW15cXCk7XSspKFxcKXw7KS86YmImJihiPS9XZWJLaXRcXC8oXFxTKykvKTtiJiYoYT0oYT1iLmV4ZWMoSGEpKT9hWzFdOlwiXCIpO3JldHVybiAkYSYmKGI9KGI9YWEuZG9jdW1lbnQpP2IuZG9jdW1lbnRNb2RlOnZvaWQgMCxiPnBhcnNlRmxvYXQoYSkpP1N0cmluZyhiKTphfSkoKTt2YXIgY2I9bnVsbCxkYj1udWxsLGViPW51bGw7ZnVuY3Rpb24gZmIoYSxiKXtpZighZmEoYSkpdGhyb3cgRXJyb3IoXCJlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXJcIik7Z2IoKTtmb3IodmFyIGM9Yj9kYjpjYixkPVtdLGU9MDtlPGEubGVuZ3RoO2UrPTMpe3ZhciBmPWFbZV0sZz1lKzE8YS5sZW5ndGgsaz1nP2FbZSsxXTowLGw9ZSsyPGEubGVuZ3RoLG09bD9hW2UrMl06MCx2PWY+PjIsZj0oZiYzKTw8NHxrPj40LGs9KGsmMTUpPDwyfG0+PjYsbT1tJjYzO2x8fChtPTY0LGd8fChrPTY0KSk7ZC5wdXNoKGNbdl0sY1tmXSxjW2tdLGNbbV0pfXJldHVybiBkLmpvaW4oXCJcIil9XG5mdW5jdGlvbiBnYigpe2lmKCFjYil7Y2I9e307ZGI9e307ZWI9e307Zm9yKHZhciBhPTA7NjU+YTthKyspY2JbYV09XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLmNoYXJBdChhKSxkYlthXT1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LV8uXCIuY2hhckF0KGEpLGViW2RiW2FdXT1hLDYyPD1hJiYoZWJbXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLmNoYXJBdChhKV09YSl9fTtmdW5jdGlvbiB1KGEsYil7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGIpfWZ1bmN0aW9uIHcoYSxiKXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxiKSlyZXR1cm4gYVtiXX1mdW5jdGlvbiBoYihhLGIpe2Zvcih2YXIgYyBpbiBhKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGMpJiZiKGMsYVtjXSl9ZnVuY3Rpb24gaWIoYSl7dmFyIGI9e307aGIoYSxmdW5jdGlvbihhLGQpe2JbYV09ZH0pO3JldHVybiBifTtmdW5jdGlvbiBqYihhKXt2YXIgYj1bXTtoYihhLGZ1bmN0aW9uKGEsZCl7ZWEoZCk/T2EoZCxmdW5jdGlvbihkKXtiLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChkKSl9KTpiLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChkKSl9KTtyZXR1cm4gYi5sZW5ndGg/XCImXCIrYi5qb2luKFwiJlwiKTpcIlwifWZ1bmN0aW9uIGtiKGEpe3ZhciBiPXt9O2E9YS5yZXBsYWNlKC9eXFw/LyxcIlwiKS5zcGxpdChcIiZcIik7T2EoYSxmdW5jdGlvbihhKXthJiYoYT1hLnNwbGl0KFwiPVwiKSxiW2FbMF1dPWFbMV0pfSk7cmV0dXJuIGJ9O2Z1bmN0aW9uIHgoYSxiLGMsZCl7dmFyIGU7ZDxiP2U9XCJhdCBsZWFzdCBcIitiOmQ+YyYmKGU9MD09PWM/XCJub25lXCI6XCJubyBtb3JlIHRoYW4gXCIrYyk7aWYoZSl0aHJvdyBFcnJvcihhK1wiIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoIFwiK2QrKDE9PT1kP1wiIGFyZ3VtZW50LlwiOlwiIGFyZ3VtZW50cy5cIikrXCIgRXhwZWN0cyBcIitlK1wiLlwiKTt9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9XCJcIjtzd2l0Y2goYil7Y2FzZSAxOmQ9Yz9cImZpcnN0XCI6XCJGaXJzdFwiO2JyZWFrO2Nhc2UgMjpkPWM/XCJzZWNvbmRcIjpcIlNlY29uZFwiO2JyZWFrO2Nhc2UgMzpkPWM/XCJ0aGlyZFwiOlwiVGhpcmRcIjticmVhaztjYXNlIDQ6ZD1jP1wiZm91cnRoXCI6XCJGb3VydGhcIjticmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiZXJyb3JQcmVmaXggY2FsbGVkIHdpdGggYXJndW1lbnROdW1iZXIgPiA0LiAgTmVlZCB0byB1cGRhdGUgaXQ/XCIpO31yZXR1cm4gYT1hK1wiIGZhaWxlZDogXCIrKGQrXCIgYXJndW1lbnQgXCIpfVxuZnVuY3Rpb24gQShhLGIsYyxkKXtpZigoIWR8fG4oYykpJiYhaGEoYykpdGhyb3cgRXJyb3IoeihhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgZnVuY3Rpb24uXCIpO31mdW5jdGlvbiBsYihhLGIsYyl7aWYobihjKSYmKCFpYShjKXx8bnVsbD09PWMpKXRocm93IEVycm9yKHooYSxiLCEwKStcIm11c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC5cIik7fTtmdW5jdGlvbiBtYihhKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIEpTT04mJm4oSlNPTi5wYXJzZSk/SlNPTi5wYXJzZShhKTpBYShhKX1mdW5jdGlvbiBCKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgSlNPTiYmbihKU09OLnN0cmluZ2lmeSkpYT1KU09OLnN0cmluZ2lmeShhKTtlbHNle3ZhciBiPVtdO0NhKG5ldyBCYSxhLGIpO2E9Yi5qb2luKFwiXCIpfXJldHVybiBhfTtmdW5jdGlvbiBuYigpe3RoaXMuU2Q9Q31uYi5wcm90b3R5cGUuaj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5TZC5vYShhKX07bmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuU2QudG9TdHJpbmcoKX07ZnVuY3Rpb24gb2IoKXt9b2IucHJvdG90eXBlLnBmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O29iLnByb3RvdHlwZS54ZT1mdW5jdGlvbigpe3JldHVybiBudWxsfTt2YXIgcGI9bmV3IG9iO2Z1bmN0aW9uIHFiKGEsYixjKXt0aGlzLlFmPWE7dGhpcy5LYT1iO3RoaXMuSGQ9Y31xYi5wcm90b3R5cGUucGY9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5LYS5EO2lmKHJiKGIsYSkpcmV0dXJuIGIuaigpLk0oYSk7Yj1udWxsIT10aGlzLkhkP25ldyBzYih0aGlzLkhkLCEwLCExKTp0aGlzLkthLnUoKTtyZXR1cm4gdGhpcy5RZi5YYShhLGIpfTtxYi5wcm90b3R5cGUueGU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPW51bGwhPXRoaXMuSGQ/dGhpcy5IZDp0Yih0aGlzLkthKTthPXRoaXMuUWYubWUoZCxiLDEsYyxhKTtyZXR1cm4gMD09PWEubGVuZ3RoP251bGw6YVswXX07ZnVuY3Rpb24gdWIoKXt0aGlzLnRiPVtdfWZ1bmN0aW9uIHZiKGEsYil7Zm9yKHZhciBjPW51bGwsZD0wO2Q8Yi5sZW5ndGg7ZCsrKXt2YXIgZT1iW2RdLGY9ZS5ZYigpO251bGw9PT1jfHxmLlooYy5ZYigpKXx8KGEudGIucHVzaChjKSxjPW51bGwpO251bGw9PT1jJiYoYz1uZXcgd2IoZikpO2MuYWRkKGUpfWMmJmEudGIucHVzaChjKX1mdW5jdGlvbiB4YihhLGIsYyl7dmIoYSxjKTt5YihhLGZ1bmN0aW9uKGEpe3JldHVybiBhLlooYil9KX1mdW5jdGlvbiB6YihhLGIsYyl7dmIoYSxjKTt5YihhLGZ1bmN0aW9uKGEpe3JldHVybiBhLmNvbnRhaW5zKGIpfHxiLmNvbnRhaW5zKGEpfSl9XG5mdW5jdGlvbiB5YihhLGIpe2Zvcih2YXIgYz0hMCxkPTA7ZDxhLnRiLmxlbmd0aDtkKyspe3ZhciBlPWEudGJbZF07aWYoZSlpZihlPWUuWWIoKSxiKGUpKXtmb3IodmFyIGU9YS50YltkXSxmPTA7ZjxlLnNkLmxlbmd0aDtmKyspe3ZhciBnPWUuc2RbZl07aWYobnVsbCE9PWcpe2Uuc2RbZl09bnVsbDt2YXIgaz1nLlViKCk7QWImJkJiKFwiZXZlbnQ6IFwiK2cudG9TdHJpbmcoKSk7Q2Ioayl9fWEudGJbZF09bnVsbH1lbHNlIGM9ITF9YyYmKGEudGI9W10pfWZ1bmN0aW9uIHdiKGEpe3RoaXMucWE9YTt0aGlzLnNkPVtdfXdiLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oYSl7dGhpcy5zZC5wdXNoKGEpfTt3Yi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5xYX07ZnVuY3Rpb24gRChhLGIsYyxkKXt0aGlzLnR5cGU9YTt0aGlzLkphPWI7dGhpcy5ZYT1jO3RoaXMuSmU9ZDt0aGlzLk5kPXZvaWQgMH1mdW5jdGlvbiBEYihhKXtyZXR1cm4gbmV3IEQoRWIsYSl9dmFyIEViPVwidmFsdWVcIjtmdW5jdGlvbiBGYihhLGIsYyxkKXt0aGlzLnRlPWI7dGhpcy5XZD1jO3RoaXMuTmQ9ZDt0aGlzLnJkPWF9RmIucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5XZC5sYygpO3JldHVyblwidmFsdWVcIj09PXRoaXMucmQ/YS5wYXRoOmEucGFyZW50KCkucGF0aH07RmIucHJvdG90eXBlLnllPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmR9O0ZiLnByb3RvdHlwZS5VYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRlLlViKHRoaXMpfTtGYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ZYigpLnRvU3RyaW5nKCkrXCI6XCIrdGhpcy5yZCtcIjpcIitCKHRoaXMuV2QubGYoKSl9O2Z1bmN0aW9uIEdiKGEsYixjKXt0aGlzLnRlPWE7dGhpcy5lcnJvcj1iO3RoaXMucGF0aD1jfUdiLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGh9O0diLnByb3RvdHlwZS55ZT1mdW5jdGlvbigpe3JldHVyblwiY2FuY2VsXCJ9O1xuR2IucHJvdG90eXBlLlViPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGUuVWIodGhpcyl9O0diLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGgudG9TdHJpbmcoKStcIjpjYW5jZWxcIn07ZnVuY3Rpb24gc2IoYSxiLGMpe3RoaXMuQj1hO3RoaXMuJD1iO3RoaXMuVGI9Y31mdW5jdGlvbiBIYihhKXtyZXR1cm4gYS4kfWZ1bmN0aW9uIHJiKGEsYil7cmV0dXJuIGEuJCYmIWEuVGJ8fGEuQi5IYShiKX1zYi5wcm90b3R5cGUuaj1mdW5jdGlvbigpe3JldHVybiB0aGlzLkJ9O2Z1bmN0aW9uIEliKGEpe3RoaXMuZGc9YTt0aGlzLkFkPW51bGx9SWIucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZGcuZ2V0KCksYj14YShhKTtpZih0aGlzLkFkKWZvcih2YXIgYyBpbiB0aGlzLkFkKWJbY10tPXRoaXMuQWRbY107dGhpcy5BZD1hO3JldHVybiBifTtmdW5jdGlvbiBKYihhLGIpe3RoaXMuTWY9e307dGhpcy5ZZD1uZXcgSWIoYSk7dGhpcy5jYT1iO3ZhciBjPTFFNCsyRTQqTWF0aC5yYW5kb20oKTtzZXRUaW1lb3V0KHEodGhpcy5IZix0aGlzKSxNYXRoLmZsb29yKGMpKX1KYi5wcm90b3R5cGUuSGY9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLllkLmdldCgpLGI9e30sYz0hMSxkO2ZvcihkIGluIGEpMDxhW2RdJiZ1KHRoaXMuTWYsZCkmJihiW2RdPWFbZF0sYz0hMCk7YyYmdGhpcy5jYS5UZShiKTtzZXRUaW1lb3V0KHEodGhpcy5IZix0aGlzKSxNYXRoLmZsb29yKDZFNSpNYXRoLnJhbmRvbSgpKSl9O2Z1bmN0aW9uIEtiKCl7dGhpcy5EYz17fX1mdW5jdGlvbiBMYihhLGIsYyl7bihjKXx8KGM9MSk7dShhLkRjLGIpfHwoYS5EY1tiXT0wKTthLkRjW2JdKz1jfUtiLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4geGEodGhpcy5EYyl9O3ZhciBNYj17fSxOYj17fTtmdW5jdGlvbiBPYihhKXthPWEudG9TdHJpbmcoKTtNYlthXXx8KE1iW2FdPW5ldyBLYik7cmV0dXJuIE1iW2FdfWZ1bmN0aW9uIFBiKGEsYil7dmFyIGM9YS50b1N0cmluZygpO05iW2NdfHwoTmJbY109YigpKTtyZXR1cm4gTmJbY119O2Z1bmN0aW9uIEUoYSxiKXt0aGlzLm5hbWU9YTt0aGlzLlM9Yn1mdW5jdGlvbiBRYihhLGIpe3JldHVybiBuZXcgRShhLGIpfTtmdW5jdGlvbiBSYihhLGIpe3JldHVybiBTYihhLm5hbWUsYi5uYW1lKX1mdW5jdGlvbiBUYihhLGIpe3JldHVybiBTYihhLGIpfTtmdW5jdGlvbiBVYihhLGIsYyl7dGhpcy50eXBlPVZiO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWI7dGhpcy5JYT1jfVViLnByb3RvdHlwZS5XYz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT9uZXcgVWIodGhpcy5zb3VyY2UsRix0aGlzLklhLk0oYSkpOm5ldyBVYih0aGlzLnNvdXJjZSxHKHRoaXMucGF0aCksdGhpcy5JYSl9O1ViLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBvdmVyd3JpdGU6IFwiK3RoaXMuSWEudG9TdHJpbmcoKStcIilcIn07ZnVuY3Rpb24gV2IoYSxiKXt0aGlzLnR5cGU9WGI7dGhpcy5zb3VyY2U9WWI7dGhpcy5wYXRoPWE7dGhpcy5WZT1ifVdiLnByb3RvdHlwZS5XYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGguZSgpP3RoaXM6bmV3IFdiKEcodGhpcy5wYXRoKSx0aGlzLlZlKX07V2IucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIGFjayB3cml0ZSByZXZlcnQ9XCIrdGhpcy5WZStcIilcIn07ZnVuY3Rpb24gWmIoYSxiKXt0aGlzLnR5cGU9JGI7dGhpcy5zb3VyY2U9YTt0aGlzLnBhdGg9Yn1aYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT9uZXcgWmIodGhpcy5zb3VyY2UsRik6bmV3IFpiKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSl9O1piLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBsaXN0ZW5fY29tcGxldGUpXCJ9O2Z1bmN0aW9uIGFjKGEsYil7dGhpcy5MYT1hO3RoaXMueGE9Yj9iOmJjfWg9YWMucHJvdG90eXBlO2guTmE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGFjKHRoaXMuTGEsdGhpcy54YS5OYShhLGIsdGhpcy5MYSkuWChudWxsLG51bGwsITEsbnVsbCxudWxsKSl9O2gucmVtb3ZlPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYWModGhpcy5MYSx0aGlzLnhhLnJlbW92ZShhLHRoaXMuTGEpLlgobnVsbCxudWxsLCExLG51bGwsbnVsbCkpfTtoLmdldD1mdW5jdGlvbihhKXtmb3IodmFyIGIsYz10aGlzLnhhOyFjLmUoKTspe2I9dGhpcy5MYShhLGMua2V5KTtpZigwPT09YilyZXR1cm4gYy52YWx1ZTswPmI/Yz1jLmxlZnQ6MDxiJiYoYz1jLnJpZ2h0KX1yZXR1cm4gbnVsbH07XG5mdW5jdGlvbiBjYyhhLGIpe2Zvcih2YXIgYyxkPWEueGEsZT1udWxsOyFkLmUoKTspe2M9YS5MYShiLGQua2V5KTtpZigwPT09Yyl7aWYoZC5sZWZ0LmUoKSlyZXR1cm4gZT9lLmtleTpudWxsO2ZvcihkPWQubGVmdDshZC5yaWdodC5lKCk7KWQ9ZC5yaWdodDtyZXR1cm4gZC5rZXl9MD5jP2Q9ZC5sZWZ0OjA8YyYmKGU9ZCxkPWQucmlnaHQpfXRocm93IEVycm9yKFwiQXR0ZW1wdGVkIHRvIGZpbmQgcHJlZGVjZXNzb3Iga2V5IGZvciBhIG5vbmV4aXN0ZW50IGtleS4gIFdoYXQgZ2l2ZXM/XCIpO31oLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5lKCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5jb3VudCgpfTtoLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuUmMoKX07aC5lYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmVjKCl9O2guaGE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMueGEuaGEoYSl9O1xuaC5XYj1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsbnVsbCx0aGlzLkxhLCExLGEpfTtoLlhiPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLGEsdGhpcy5MYSwhMSxiKX07aC5aYj1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZGModGhpcy54YSxhLHRoaXMuTGEsITAsYil9O2gucmY9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLG51bGwsdGhpcy5MYSwhMCxhKX07ZnVuY3Rpb24gZGMoYSxiLGMsZCxlKXt0aGlzLlJkPWV8fG51bGw7dGhpcy5FZT1kO3RoaXMuUGE9W107Zm9yKGU9MTshYS5lKCk7KWlmKGU9Yj9jKGEua2V5LGIpOjEsZCYmKGUqPS0xKSwwPmUpYT10aGlzLkVlP2EubGVmdDphLnJpZ2h0O2Vsc2UgaWYoMD09PWUpe3RoaXMuUGEucHVzaChhKTticmVha31lbHNlIHRoaXMuUGEucHVzaChhKSxhPXRoaXMuRWU/YS5yaWdodDphLmxlZnR9XG5mdW5jdGlvbiBIKGEpe2lmKDA9PT1hLlBhLmxlbmd0aClyZXR1cm4gbnVsbDt2YXIgYj1hLlBhLnBvcCgpLGM7Yz1hLlJkP2EuUmQoYi5rZXksYi52YWx1ZSk6e2tleTpiLmtleSx2YWx1ZTpiLnZhbHVlfTtpZihhLkVlKWZvcihiPWIubGVmdDshYi5lKCk7KWEuUGEucHVzaChiKSxiPWIucmlnaHQ7ZWxzZSBmb3IoYj1iLnJpZ2h0OyFiLmUoKTspYS5QYS5wdXNoKGIpLGI9Yi5sZWZ0O3JldHVybiBjfWZ1bmN0aW9uIGVjKGEpe2lmKDA9PT1hLlBhLmxlbmd0aClyZXR1cm4gbnVsbDt2YXIgYjtiPWEuUGE7Yj1iW2IubGVuZ3RoLTFdO3JldHVybiBhLlJkP2EuUmQoYi5rZXksYi52YWx1ZSk6e2tleTpiLmtleSx2YWx1ZTpiLnZhbHVlfX1mdW5jdGlvbiBmYyhhLGIsYyxkLGUpe3RoaXMua2V5PWE7dGhpcy52YWx1ZT1iO3RoaXMuY29sb3I9bnVsbCE9Yz9jOiEwO3RoaXMubGVmdD1udWxsIT1kP2Q6YmM7dGhpcy5yaWdodD1udWxsIT1lP2U6YmN9aD1mYy5wcm90b3R5cGU7XG5oLlg9ZnVuY3Rpb24oYSxiLGMsZCxlKXtyZXR1cm4gbmV3IGZjKG51bGwhPWE/YTp0aGlzLmtleSxudWxsIT1iP2I6dGhpcy52YWx1ZSxudWxsIT1jP2M6dGhpcy5jb2xvcixudWxsIT1kP2Q6dGhpcy5sZWZ0LG51bGwhPWU/ZTp0aGlzLnJpZ2h0KX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxlZnQuY291bnQoKSsxK3RoaXMucmlnaHQuY291bnQoKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guaGE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMubGVmdC5oYShhKXx8YSh0aGlzLmtleSx0aGlzLnZhbHVlKXx8dGhpcy5yaWdodC5oYShhKX07ZnVuY3Rpb24gZ2MoYSl7cmV0dXJuIGEubGVmdC5lKCk/YTpnYyhhLmxlZnQpfWguUmM9ZnVuY3Rpb24oKXtyZXR1cm4gZ2ModGhpcykua2V5fTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmlnaHQuZSgpP3RoaXMua2V5OnRoaXMucmlnaHQuZWMoKX07XG5oLk5hPWZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2U9dGhpcztkPWMoYSxlLmtleSk7ZT0wPmQ/ZS5YKG51bGwsbnVsbCxudWxsLGUubGVmdC5OYShhLGIsYyksbnVsbCk6MD09PWQ/ZS5YKG51bGwsYixudWxsLG51bGwsbnVsbCk6ZS5YKG51bGwsbnVsbCxudWxsLG51bGwsZS5yaWdodC5OYShhLGIsYykpO3JldHVybiBoYyhlKX07ZnVuY3Rpb24gaWMoYSl7aWYoYS5sZWZ0LmUoKSlyZXR1cm4gYmM7YS5sZWZ0LmZhKCl8fGEubGVmdC5sZWZ0LmZhKCl8fChhPWpjKGEpKTthPWEuWChudWxsLG51bGwsbnVsbCxpYyhhLmxlZnQpLG51bGwpO3JldHVybiBoYyhhKX1cbmgucmVtb3ZlPWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtjPXRoaXM7aWYoMD5iKGEsYy5rZXkpKWMubGVmdC5lKCl8fGMubGVmdC5mYSgpfHxjLmxlZnQubGVmdC5mYSgpfHwoYz1qYyhjKSksYz1jLlgobnVsbCxudWxsLG51bGwsYy5sZWZ0LnJlbW92ZShhLGIpLG51bGwpO2Vsc2V7Yy5sZWZ0LmZhKCkmJihjPWtjKGMpKTtjLnJpZ2h0LmUoKXx8Yy5yaWdodC5mYSgpfHxjLnJpZ2h0LmxlZnQuZmEoKXx8KGM9bGMoYyksYy5sZWZ0LmxlZnQuZmEoKSYmKGM9a2MoYyksYz1sYyhjKSkpO2lmKDA9PT1iKGEsYy5rZXkpKXtpZihjLnJpZ2h0LmUoKSlyZXR1cm4gYmM7ZD1nYyhjLnJpZ2h0KTtjPWMuWChkLmtleSxkLnZhbHVlLG51bGwsbnVsbCxpYyhjLnJpZ2h0KSl9Yz1jLlgobnVsbCxudWxsLG51bGwsbnVsbCxjLnJpZ2h0LnJlbW92ZShhLGIpKX1yZXR1cm4gaGMoYyl9O2guZmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2xvcn07XG5mdW5jdGlvbiBoYyhhKXthLnJpZ2h0LmZhKCkmJiFhLmxlZnQuZmEoKSYmKGE9bWMoYSkpO2EubGVmdC5mYSgpJiZhLmxlZnQubGVmdC5mYSgpJiYoYT1rYyhhKSk7YS5sZWZ0LmZhKCkmJmEucmlnaHQuZmEoKSYmKGE9bGMoYSkpO3JldHVybiBhfWZ1bmN0aW9uIGpjKGEpe2E9bGMoYSk7YS5yaWdodC5sZWZ0LmZhKCkmJihhPWEuWChudWxsLG51bGwsbnVsbCxudWxsLGtjKGEucmlnaHQpKSxhPW1jKGEpLGE9bGMoYSkpO3JldHVybiBhfWZ1bmN0aW9uIG1jKGEpe3JldHVybiBhLnJpZ2h0LlgobnVsbCxudWxsLGEuY29sb3IsYS5YKG51bGwsbnVsbCwhMCxudWxsLGEucmlnaHQubGVmdCksbnVsbCl9ZnVuY3Rpb24ga2MoYSl7cmV0dXJuIGEubGVmdC5YKG51bGwsbnVsbCxhLmNvbG9yLG51bGwsYS5YKG51bGwsbnVsbCwhMCxhLmxlZnQucmlnaHQsbnVsbCkpfVxuZnVuY3Rpb24gbGMoYSl7cmV0dXJuIGEuWChudWxsLG51bGwsIWEuY29sb3IsYS5sZWZ0LlgobnVsbCxudWxsLCFhLmxlZnQuY29sb3IsbnVsbCxudWxsKSxhLnJpZ2h0LlgobnVsbCxudWxsLCFhLnJpZ2h0LmNvbG9yLG51bGwsbnVsbCkpfWZ1bmN0aW9uIG5jKCl7fWg9bmMucHJvdG90eXBlO2guWD1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLk5hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBmYyhhLGIsbnVsbCl9O2gucmVtb3ZlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gMH07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guaGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5SYz1mdW5jdGlvbigpe3JldHVybiBudWxsfTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O2guZmE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07dmFyIGJjPW5ldyBuYztmdW5jdGlvbiBvYyhhLGIpe3JldHVybiBhJiZcIm9iamVjdFwiPT09dHlwZW9mIGE/KEooXCIuc3ZcImluIGEsXCJVbmV4cGVjdGVkIGxlYWYgbm9kZSBvciBwcmlvcml0eSBjb250ZW50c1wiKSxiW2FbXCIuc3ZcIl1dKTphfWZ1bmN0aW9uIHBjKGEsYil7dmFyIGM9bmV3IHFjO3JjKGEsbmV3IEsoXCJcIiksZnVuY3Rpb24oYSxlKXtjLm1jKGEsc2MoZSxiKSl9KTtyZXR1cm4gY31mdW5jdGlvbiBzYyhhLGIpe3ZhciBjPWEuQSgpLksoKSxjPW9jKGMsYiksZDtpZihhLk4oKSl7dmFyIGU9b2MoYS5CYSgpLGIpO3JldHVybiBlIT09YS5CYSgpfHxjIT09YS5BKCkuSygpP25ldyB0YyhlLEwoYykpOmF9ZD1hO2MhPT1hLkEoKS5LKCkmJihkPWQuZGEobmV3IHRjKGMpKSk7YS5VKE0sZnVuY3Rpb24oYSxjKXt2YXIgZT1zYyhjLGIpO2UhPT1jJiYoZD1kLlEoYSxlKSl9KTtyZXR1cm4gZH07ZnVuY3Rpb24gSyhhLGIpe2lmKDE9PWFyZ3VtZW50cy5sZW5ndGgpe3RoaXMubj1hLnNwbGl0KFwiL1wiKTtmb3IodmFyIGM9MCxkPTA7ZDx0aGlzLm4ubGVuZ3RoO2QrKykwPHRoaXMubltkXS5sZW5ndGgmJih0aGlzLm5bY109dGhpcy5uW2RdLGMrKyk7dGhpcy5uLmxlbmd0aD1jO3RoaXMuWT0wfWVsc2UgdGhpcy5uPWEsdGhpcy5ZPWJ9ZnVuY3Rpb24gTihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYz09PU8oYikpcmV0dXJuIE4oRyhhKSxHKGIpKTt0aHJvdyBFcnJvcihcIklOVEVSTkFMIEVSUk9SOiBpbm5lclBhdGggKFwiK2IrXCIpIGlzIG5vdCB3aXRoaW4gb3V0ZXJQYXRoIChcIithK1wiKVwiKTt9ZnVuY3Rpb24gTyhhKXtyZXR1cm4gYS5ZPj1hLm4ubGVuZ3RoP251bGw6YS5uW2EuWV19ZnVuY3Rpb24gdWMoYSl7cmV0dXJuIGEubi5sZW5ndGgtYS5ZfVxuZnVuY3Rpb24gRyhhKXt2YXIgYj1hLlk7YjxhLm4ubGVuZ3RoJiZiKys7cmV0dXJuIG5ldyBLKGEubixiKX1mdW5jdGlvbiB2YyhhKXtyZXR1cm4gYS5ZPGEubi5sZW5ndGg/YS5uW2Eubi5sZW5ndGgtMV06bnVsbH1oPUsucHJvdG90eXBlO2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtmb3IodmFyIGE9XCJcIixiPXRoaXMuWTtiPHRoaXMubi5sZW5ndGg7YisrKVwiXCIhPT10aGlzLm5bYl0mJihhKz1cIi9cIit0aGlzLm5bYl0pO3JldHVybiBhfHxcIi9cIn07aC5zbGljZT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5uLnNsaWNlKHRoaXMuWSsoYXx8MCkpfTtoLnBhcmVudD1mdW5jdGlvbigpe2lmKHRoaXMuWT49dGhpcy5uLmxlbmd0aClyZXR1cm4gbnVsbDtmb3IodmFyIGE9W10sYj10aGlzLlk7Yjx0aGlzLm4ubGVuZ3RoLTE7YisrKWEucHVzaCh0aGlzLm5bYl0pO3JldHVybiBuZXcgSyhhLDApfTtcbmgudz1mdW5jdGlvbihhKXtmb3IodmFyIGI9W10sYz10aGlzLlk7Yzx0aGlzLm4ubGVuZ3RoO2MrKyliLnB1c2godGhpcy5uW2NdKTtpZihhIGluc3RhbmNlb2YgSylmb3IoYz1hLlk7YzxhLm4ubGVuZ3RoO2MrKyliLnB1c2goYS5uW2NdKTtlbHNlIGZvcihhPWEuc3BsaXQoXCIvXCIpLGM9MDtjPGEubGVuZ3RoO2MrKykwPGFbY10ubGVuZ3RoJiZiLnB1c2goYVtjXSk7cmV0dXJuIG5ldyBLKGIsMCl9O2guZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlk+PXRoaXMubi5sZW5ndGh9O2guWj1mdW5jdGlvbihhKXtpZih1Yyh0aGlzKSE9PXVjKGEpKXJldHVybiExO2Zvcih2YXIgYj10aGlzLlksYz1hLlk7Yjw9dGhpcy5uLmxlbmd0aDtiKyssYysrKWlmKHRoaXMubltiXSE9PWEubltjXSlyZXR1cm4hMTtyZXR1cm4hMH07XG5oLmNvbnRhaW5zPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuWSxjPWEuWTtpZih1Yyh0aGlzKT51YyhhKSlyZXR1cm4hMTtmb3IoO2I8dGhpcy5uLmxlbmd0aDspe2lmKHRoaXMubltiXSE9PWEubltjXSlyZXR1cm4hMTsrK2I7KytjfXJldHVybiEwfTt2YXIgRj1uZXcgSyhcIlwiKTtmdW5jdGlvbiB3YyhhLGIpe3RoaXMuUWE9YS5zbGljZSgpO3RoaXMuRWE9TWF0aC5tYXgoMSx0aGlzLlFhLmxlbmd0aCk7dGhpcy5rZj1iO2Zvcih2YXIgYz0wO2M8dGhpcy5RYS5sZW5ndGg7YysrKXRoaXMuRWErPXhjKHRoaXMuUWFbY10pO3ljKHRoaXMpfXdjLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGEpezA8dGhpcy5RYS5sZW5ndGgmJih0aGlzLkVhKz0xKTt0aGlzLlFhLnB1c2goYSk7dGhpcy5FYSs9eGMoYSk7eWModGhpcyl9O3djLnByb3RvdHlwZS5wb3A9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLlFhLnBvcCgpO3RoaXMuRWEtPXhjKGEpOzA8dGhpcy5RYS5sZW5ndGgmJi0tdGhpcy5FYX07XG5mdW5jdGlvbiB5YyhhKXtpZig3Njg8YS5FYSl0aHJvdyBFcnJvcihhLmtmK1wiaGFzIGEga2V5IHBhdGggbG9uZ2VyIHRoYW4gNzY4IGJ5dGVzIChcIithLkVhK1wiKS5cIik7aWYoMzI8YS5RYS5sZW5ndGgpdGhyb3cgRXJyb3IoYS5rZitcInBhdGggc3BlY2lmaWVkIGV4Y2VlZHMgdGhlIG1heGltdW0gZGVwdGggdGhhdCBjYW4gYmUgd3JpdHRlbiAoMzIpIG9yIG9iamVjdCBjb250YWlucyBhIGN5Y2xlIFwiK3pjKGEpKTt9ZnVuY3Rpb24gemMoYSl7cmV0dXJuIDA9PWEuUWEubGVuZ3RoP1wiXCI6XCJpbiBwcm9wZXJ0eSAnXCIrYS5RYS5qb2luKFwiLlwiKStcIidcIn07ZnVuY3Rpb24gQWMoKXt0aGlzLndjPXt9fUFjLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXtudWxsPT1iP2RlbGV0ZSB0aGlzLndjW2FdOnRoaXMud2NbYV09Yn07QWMucHJvdG90eXBlLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gdSh0aGlzLndjLGEpP3RoaXMud2NbYV06bnVsbH07QWMucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy53Y1thXX07QWMucHJvdG90eXBlLnVmPSEwO2Z1bmN0aW9uIEJjKGEpe3RoaXMuRWM9YTt0aGlzLk1kPVwiZmlyZWJhc2U6XCJ9aD1CYy5wcm90b3R5cGU7aC5zZXQ9ZnVuY3Rpb24oYSxiKXtudWxsPT1iP3RoaXMuRWMucmVtb3ZlSXRlbSh0aGlzLk1kK2EpOnRoaXMuRWMuc2V0SXRlbSh0aGlzLk1kK2EsQihiKSl9O2guZ2V0PWZ1bmN0aW9uKGEpe2E9dGhpcy5FYy5nZXRJdGVtKHRoaXMuTWQrYSk7cmV0dXJuIG51bGw9PWE/bnVsbDptYihhKX07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5FYy5yZW1vdmVJdGVtKHRoaXMuTWQrYSl9O2gudWY9ITE7aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLkVjLnRvU3RyaW5nKCl9O2Z1bmN0aW9uIENjKGEpe3RyeXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3dbYV0pe3ZhciBiPXdpbmRvd1thXTtiLnNldEl0ZW0oXCJmaXJlYmFzZTpzZW50aW5lbFwiLFwiY2FjaGVcIik7Yi5yZW1vdmVJdGVtKFwiZmlyZWJhc2U6c2VudGluZWxcIik7cmV0dXJuIG5ldyBCYyhiKX19Y2F0Y2goYyl7fXJldHVybiBuZXcgQWN9dmFyIERjPUNjKFwibG9jYWxTdG9yYWdlXCIpLFA9Q2MoXCJzZXNzaW9uU3RvcmFnZVwiKTtmdW5jdGlvbiBFYyhhLGIsYyxkLGUpe3RoaXMuaG9zdD1hLnRvTG93ZXJDYXNlKCk7dGhpcy5kb21haW49dGhpcy5ob3N0LnN1YnN0cih0aGlzLmhvc3QuaW5kZXhPZihcIi5cIikrMSk7dGhpcy5sYj1iO3RoaXMuQ2I9Yzt0aGlzLlRnPWQ7dGhpcy5MZD1lfHxcIlwiO3RoaXMuT2E9RGMuZ2V0KFwiaG9zdDpcIithKXx8dGhpcy5ob3N0fWZ1bmN0aW9uIEZjKGEsYil7YiE9PWEuT2EmJihhLk9hPWIsXCJzLVwiPT09YS5PYS5zdWJzdHIoMCwyKSYmRGMuc2V0KFwiaG9zdDpcIithLmhvc3QsYS5PYSkpfUVjLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3ZhciBhPSh0aGlzLmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrdGhpcy5ob3N0O3RoaXMuTGQmJihhKz1cIjxcIit0aGlzLkxkK1wiPlwiKTtyZXR1cm4gYX07dmFyIEdjPWZ1bmN0aW9uKCl7dmFyIGE9MTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYSsrfX0oKTtmdW5jdGlvbiBKKGEsYil7aWYoIWEpdGhyb3cgSGMoYik7fWZ1bmN0aW9uIEhjKGEpe3JldHVybiBFcnJvcihcIkZpcmViYXNlICgyLjIuNSkgSU5URVJOQUwgQVNTRVJUIEZBSUxFRDogXCIrYSl9XG5mdW5jdGlvbiBJYyhhKXt0cnl7dmFyIGI7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhdG9iKWI9YXRvYihhKTtlbHNle2diKCk7Zm9yKHZhciBjPWViLGQ9W10sZT0wO2U8YS5sZW5ndGg7KXt2YXIgZj1jW2EuY2hhckF0KGUrKyldLGc9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTowOysrZTt2YXIgaz1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjY0OysrZTt2YXIgbD1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjY0OysrZTtpZihudWxsPT1mfHxudWxsPT1nfHxudWxsPT1rfHxudWxsPT1sKXRocm93IEVycm9yKCk7ZC5wdXNoKGY8PDJ8Zz4+NCk7NjQhPWsmJihkLnB1c2goZzw8NCYyNDB8az4+MiksNjQhPWwmJmQucHVzaChrPDw2JjE5MnxsKSl9aWYoODE5Mj5kLmxlbmd0aCliPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxkKTtlbHNle2E9XCJcIjtmb3IoYz0wO2M8ZC5sZW5ndGg7Yys9ODE5MilhKz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsV2EoZCxjLFxuYys4MTkyKSk7Yj1hfX1yZXR1cm4gYn1jYXRjaChtKXtCYihcImJhc2U2NERlY29kZSBmYWlsZWQ6IFwiLG0pfXJldHVybiBudWxsfWZ1bmN0aW9uIEpjKGEpe3ZhciBiPUtjKGEpO2E9bmV3IExhO2EudXBkYXRlKGIpO3ZhciBiPVtdLGM9OCphLmJlOzU2PmEuJGI/YS51cGRhdGUoYS5JZCw1Ni1hLiRiKTphLnVwZGF0ZShhLklkLGEuV2EtKGEuJGItNTYpKTtmb3IodmFyIGQ9YS5XYS0xOzU2PD1kO2QtLSlhLmxlW2RdPWMmMjU1LGMvPTI1NjtNYShhLGEubGUpO2ZvcihkPWM9MDs1PmQ7ZCsrKWZvcih2YXIgZT0yNDswPD1lO2UtPTgpYltjXT1hLlJbZF0+PmUmMjU1LCsrYztyZXR1cm4gZmIoYil9XG5mdW5jdGlvbiBMYyhhKXtmb3IodmFyIGI9XCJcIixjPTA7Yzxhcmd1bWVudHMubGVuZ3RoO2MrKyliPWZhKGFyZ3VtZW50c1tjXSk/YitMYy5hcHBseShudWxsLGFyZ3VtZW50c1tjXSk6XCJvYmplY3RcIj09PXR5cGVvZiBhcmd1bWVudHNbY10/YitCKGFyZ3VtZW50c1tjXSk6Yithcmd1bWVudHNbY10sYis9XCIgXCI7cmV0dXJuIGJ9dmFyIEFiPW51bGwsTWM9ITA7ZnVuY3Rpb24gQmIoYSl7ITA9PT1NYyYmKE1jPSExLG51bGw9PT1BYiYmITA9PT1QLmdldChcImxvZ2dpbmdfZW5hYmxlZFwiKSYmTmMoITApKTtpZihBYil7dmFyIGI9TGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO0FiKGIpfX1mdW5jdGlvbiBPYyhhKXtyZXR1cm4gZnVuY3Rpb24oKXtCYihhLGFyZ3VtZW50cyl9fVxuZnVuY3Rpb24gUGMoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXt2YXIgYj1cIkZJUkVCQVNFIElOVEVSTkFMIEVSUk9SOiBcIitMYy5hcHBseShudWxsLGFyZ3VtZW50cyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlLmVycm9yP2NvbnNvbGUuZXJyb3IoYik6Y29uc29sZS5sb2coYil9fWZ1bmN0aW9uIFFjKGEpe3ZhciBiPUxjLmFwcGx5KG51bGwsYXJndW1lbnRzKTt0aHJvdyBFcnJvcihcIkZJUkVCQVNFIEZBVEFMIEVSUk9SOiBcIitiKTt9ZnVuY3Rpb24gUShhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBiPVwiRklSRUJBU0UgV0FSTklORzogXCIrTGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS53YXJuP2NvbnNvbGUud2FybihiKTpjb25zb2xlLmxvZyhiKX19XG5mdW5jdGlvbiBSYyhhKXt2YXIgYj1cIlwiLGM9XCJcIixkPVwiXCIsZT1cIlwiLGY9ITAsZz1cImh0dHBzXCIsaz00NDM7aWYocChhKSl7dmFyIGw9YS5pbmRleE9mKFwiLy9cIik7MDw9bCYmKGc9YS5zdWJzdHJpbmcoMCxsLTEpLGE9YS5zdWJzdHJpbmcobCsyKSk7bD1hLmluZGV4T2YoXCIvXCIpOy0xPT09bCYmKGw9YS5sZW5ndGgpO2I9YS5zdWJzdHJpbmcoMCxsKTtlPVwiXCI7YT1hLnN1YnN0cmluZyhsKS5zcGxpdChcIi9cIik7Zm9yKGw9MDtsPGEubGVuZ3RoO2wrKylpZigwPGFbbF0ubGVuZ3RoKXt2YXIgbT1hW2xdO3RyeXttPWRlY29kZVVSSUNvbXBvbmVudChtLnJlcGxhY2UoL1xcKy9nLFwiIFwiKSl9Y2F0Y2godil7fWUrPVwiL1wiK219YT1iLnNwbGl0KFwiLlwiKTszPT09YS5sZW5ndGg/KGM9YVsxXSxkPWFbMF0udG9Mb3dlckNhc2UoKSk6Mj09PWEubGVuZ3RoJiYoYz1hWzBdKTtsPWIuaW5kZXhPZihcIjpcIik7MDw9bCYmKGY9XCJodHRwc1wiPT09Z3x8XCJ3c3NcIj09PWcsaz1iLnN1YnN0cmluZyhsKzEpLGlzRmluaXRlKGspJiZcbihrPVN0cmluZyhrKSksaz1wKGspPy9eXFxzKi0/MHgvaS50ZXN0KGspP3BhcnNlSW50KGssMTYpOnBhcnNlSW50KGssMTApOk5hTil9cmV0dXJue2hvc3Q6Yixwb3J0OmssZG9tYWluOmMsUWc6ZCxsYjpmLHNjaGVtZTpnLFpjOmV9fWZ1bmN0aW9uIFNjKGEpe3JldHVybiBnYShhKSYmKGEhPWF8fGE9PU51bWJlci5QT1NJVElWRV9JTkZJTklUWXx8YT09TnVtYmVyLk5FR0FUSVZFX0lORklOSVRZKX1cbmZ1bmN0aW9uIFRjKGEpe2lmKFwiY29tcGxldGVcIj09PWRvY3VtZW50LnJlYWR5U3RhdGUpYSgpO2Vsc2V7dmFyIGI9ITEsYz1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHk/Ynx8KGI9ITAsYSgpKTpzZXRUaW1lb3V0KGMsTWF0aC5mbG9vcigxMCkpfTtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPyhkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMsITEpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGMsITEpKTpkb2N1bWVudC5hdHRhY2hFdmVudCYmKGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24oKXtcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlJiZjKCl9KSx3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIixjKSl9fVxuZnVuY3Rpb24gU2IoYSxiKXtpZihhPT09YilyZXR1cm4gMDtpZihcIltNSU5fTkFNRV1cIj09PWF8fFwiW01BWF9OQU1FXVwiPT09YilyZXR1cm4tMTtpZihcIltNSU5fTkFNRV1cIj09PWJ8fFwiW01BWF9OQU1FXVwiPT09YSlyZXR1cm4gMTt2YXIgYz1VYyhhKSxkPVVjKGIpO3JldHVybiBudWxsIT09Yz9udWxsIT09ZD8wPT1jLWQ/YS5sZW5ndGgtYi5sZW5ndGg6Yy1kOi0xOm51bGwhPT1kPzE6YTxiPy0xOjF9ZnVuY3Rpb24gVmMoYSxiKXtpZihiJiZhIGluIGIpcmV0dXJuIGJbYV07dGhyb3cgRXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIGtleSAoXCIrYStcIikgaW4gb2JqZWN0OiBcIitCKGIpKTt9XG5mdW5jdGlvbiBXYyhhKXtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fG51bGw9PT1hKXJldHVybiBCKGEpO3ZhciBiPVtdLGM7Zm9yKGMgaW4gYSliLnB1c2goYyk7Yi5zb3J0KCk7Yz1cIntcIjtmb3IodmFyIGQ9MDtkPGIubGVuZ3RoO2QrKykwIT09ZCYmKGMrPVwiLFwiKSxjKz1CKGJbZF0pLGMrPVwiOlwiLGMrPVdjKGFbYltkXV0pO3JldHVybiBjK1wifVwifWZ1bmN0aW9uIFhjKGEsYil7aWYoYS5sZW5ndGg8PWIpcmV0dXJuW2FdO2Zvcih2YXIgYz1bXSxkPTA7ZDxhLmxlbmd0aDtkKz1iKWQrYj5hP2MucHVzaChhLnN1YnN0cmluZyhkLGEubGVuZ3RoKSk6Yy5wdXNoKGEuc3Vic3RyaW5nKGQsZCtiKSk7cmV0dXJuIGN9ZnVuY3Rpb24gWWMoYSxiKXtpZihlYShhKSlmb3IodmFyIGM9MDtjPGEubGVuZ3RoOysrYyliKGMsYVtjXSk7ZWxzZSByKGEsYil9XG5mdW5jdGlvbiBaYyhhKXtKKCFTYyhhKSxcIkludmFsaWQgSlNPTiBudW1iZXJcIik7dmFyIGIsYyxkLGU7MD09PWE/KGQ9Yz0wLGI9LUluZmluaXR5PT09MS9hPzE6MCk6KGI9MD5hLGE9TWF0aC5hYnMoYSksYT49TWF0aC5wb3coMiwtMTAyMik/KGQ9TWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhhKS9NYXRoLkxOMiksMTAyMyksYz1kKzEwMjMsZD1NYXRoLnJvdW5kKGEqTWF0aC5wb3coMiw1Mi1kKS1NYXRoLnBvdygyLDUyKSkpOihjPTAsZD1NYXRoLnJvdW5kKGEvTWF0aC5wb3coMiwtMTA3NCkpKSk7ZT1bXTtmb3IoYT01MjthOy0tYSllLnB1c2goZCUyPzE6MCksZD1NYXRoLmZsb29yKGQvMik7Zm9yKGE9MTE7YTstLWEpZS5wdXNoKGMlMj8xOjApLGM9TWF0aC5mbG9vcihjLzIpO2UucHVzaChiPzE6MCk7ZS5yZXZlcnNlKCk7Yj1lLmpvaW4oXCJcIik7Yz1cIlwiO2ZvcihhPTA7NjQ+YTthKz04KWQ9cGFyc2VJbnQoYi5zdWJzdHIoYSw4KSwyKS50b1N0cmluZygxNiksMT09PWQubGVuZ3RoJiZcbihkPVwiMFwiK2QpLGMrPWQ7cmV0dXJuIGMudG9Mb3dlckNhc2UoKX12YXIgJGM9L14tP1xcZHsxLDEwfSQvO2Z1bmN0aW9uIFVjKGEpe3JldHVybiAkYy50ZXN0KGEpJiYoYT1OdW1iZXIoYSksLTIxNDc0ODM2NDg8PWEmJjIxNDc0ODM2NDc+PWEpP2E6bnVsbH1mdW5jdGlvbiBDYihhKXt0cnl7YSgpfWNhdGNoKGIpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXtRKFwiRXhjZXB0aW9uIHdhcyB0aHJvd24gYnkgdXNlciBjYWxsYmFjay5cIixiLnN0YWNrfHxcIlwiKTt0aHJvdyBiO30sTWF0aC5mbG9vcigwKSl9fWZ1bmN0aW9uIFIoYSxiKXtpZihoYShhKSl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLnNsaWNlKCk7Q2IoZnVuY3Rpb24oKXthLmFwcGx5KG51bGwsYyl9KX19O2Z1bmN0aW9uIEtjKGEpe2Zvcih2YXIgYj1bXSxjPTAsZD0wO2Q8YS5sZW5ndGg7ZCsrKXt2YXIgZT1hLmNoYXJDb2RlQXQoZCk7NTUyOTY8PWUmJjU2MzE5Pj1lJiYoZS09NTUyOTYsZCsrLEooZDxhLmxlbmd0aCxcIlN1cnJvZ2F0ZSBwYWlyIG1pc3NpbmcgdHJhaWwgc3Vycm9nYXRlLlwiKSxlPTY1NTM2KyhlPDwxMCkrKGEuY2hhckNvZGVBdChkKS01NjMyMCkpOzEyOD5lP2JbYysrXT1lOigyMDQ4PmU/YltjKytdPWU+PjZ8MTkyOig2NTUzNj5lP2JbYysrXT1lPj4xMnwyMjQ6KGJbYysrXT1lPj4xOHwyNDAsYltjKytdPWU+PjEyJjYzfDEyOCksYltjKytdPWU+PjYmNjN8MTI4KSxiW2MrK109ZSY2M3wxMjgpfXJldHVybiBifWZ1bmN0aW9uIHhjKGEpe2Zvcih2YXIgYj0wLGM9MDtjPGEubGVuZ3RoO2MrKyl7dmFyIGQ9YS5jaGFyQ29kZUF0KGMpOzEyOD5kP2IrKzoyMDQ4PmQ/Yis9Mjo1NTI5Njw9ZCYmNTYzMTk+PWQ/KGIrPTQsYysrKTpiKz0zfXJldHVybiBifTtmdW5jdGlvbiBhZChhKXt2YXIgYj17fSxjPXt9LGQ9e30sZT1cIlwiO3RyeXt2YXIgZj1hLnNwbGl0KFwiLlwiKSxiPW1iKEljKGZbMF0pfHxcIlwiKSxjPW1iKEljKGZbMV0pfHxcIlwiKSxlPWZbMl0sZD1jLmR8fHt9O2RlbGV0ZSBjLmR9Y2F0Y2goZyl7fXJldHVybntXZzpiLEFjOmMsZGF0YTpkLE5nOmV9fWZ1bmN0aW9uIGJkKGEpe2E9YWQoYSkuQWM7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZhLmhhc093blByb3BlcnR5KFwiaWF0XCIpP3coYSxcImlhdFwiKTpudWxsfWZ1bmN0aW9uIGNkKGEpe2E9YWQoYSk7dmFyIGI9YS5BYztyZXR1cm4hIWEuTmcmJiEhYiYmXCJvYmplY3RcIj09PXR5cGVvZiBiJiZiLmhhc093blByb3BlcnR5KFwiaWF0XCIpfTtmdW5jdGlvbiBkZChhKXt0aGlzLlY9YTt0aGlzLmc9YS5vLmd9ZnVuY3Rpb24gZWQoYSxiLGMsZCl7dmFyIGU9W10sZj1bXTtPYShiLGZ1bmN0aW9uKGIpe1wiY2hpbGRfY2hhbmdlZFwiPT09Yi50eXBlJiZhLmcueGQoYi5KZSxiLkphKSYmZi5wdXNoKG5ldyBEKFwiY2hpbGRfbW92ZWRcIixiLkphLGIuWWEpKX0pO2ZkKGEsZSxcImNoaWxkX3JlbW92ZWRcIixiLGQsYyk7ZmQoYSxlLFwiY2hpbGRfYWRkZWRcIixiLGQsYyk7ZmQoYSxlLFwiY2hpbGRfbW92ZWRcIixmLGQsYyk7ZmQoYSxlLFwiY2hpbGRfY2hhbmdlZFwiLGIsZCxjKTtmZChhLGUsRWIsYixkLGMpO3JldHVybiBlfWZ1bmN0aW9uIGZkKGEsYixjLGQsZSxmKXtkPVBhKGQsZnVuY3Rpb24oYSl7cmV0dXJuIGEudHlwZT09PWN9KTtYYShkLHEoYS5lZyxhKSk7T2EoZCxmdW5jdGlvbihjKXt2YXIgZD1nZChhLGMsZik7T2EoZSxmdW5jdGlvbihlKXtlLkpmKGMudHlwZSkmJmIucHVzaChlLmNyZWF0ZUV2ZW50KGQsYS5WKSl9KX0pfVxuZnVuY3Rpb24gZ2QoYSxiLGMpe1widmFsdWVcIiE9PWIudHlwZSYmXCJjaGlsZF9yZW1vdmVkXCIhPT1iLnR5cGUmJihiLk5kPWMucWYoYi5ZYSxiLkphLGEuZykpO3JldHVybiBifWRkLnByb3RvdHlwZS5lZz1mdW5jdGlvbihhLGIpe2lmKG51bGw9PWEuWWF8fG51bGw9PWIuWWEpdGhyb3cgSGMoXCJTaG91bGQgb25seSBjb21wYXJlIGNoaWxkXyBldmVudHMuXCIpO3JldHVybiB0aGlzLmcuY29tcGFyZShuZXcgRShhLllhLGEuSmEpLG5ldyBFKGIuWWEsYi5KYSkpfTtmdW5jdGlvbiBoZCgpe3RoaXMuZWI9e319XG5mdW5jdGlvbiBpZChhLGIpe3ZhciBjPWIudHlwZSxkPWIuWWE7SihcImNoaWxkX2FkZGVkXCI9PWN8fFwiY2hpbGRfY2hhbmdlZFwiPT1jfHxcImNoaWxkX3JlbW92ZWRcIj09YyxcIk9ubHkgY2hpbGQgY2hhbmdlcyBzdXBwb3J0ZWQgZm9yIHRyYWNraW5nXCIpO0ooXCIucHJpb3JpdHlcIiE9PWQsXCJPbmx5IG5vbi1wcmlvcml0eSBjaGlsZCBjaGFuZ2VzIGNhbiBiZSB0cmFja2VkLlwiKTt2YXIgZT13KGEuZWIsZCk7aWYoZSl7dmFyIGY9ZS50eXBlO2lmKFwiY2hpbGRfYWRkZWRcIj09YyYmXCJjaGlsZF9yZW1vdmVkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2NoYW5nZWRcIixiLkphLGQsZS5KYSk7ZWxzZSBpZihcImNoaWxkX3JlbW92ZWRcIj09YyYmXCJjaGlsZF9hZGRlZFwiPT1mKWRlbGV0ZSBhLmViW2RdO2Vsc2UgaWYoXCJjaGlsZF9yZW1vdmVkXCI9PWMmJlwiY2hpbGRfY2hhbmdlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZS5KZSxkKTtlbHNlIGlmKFwiY2hpbGRfY2hhbmdlZFwiPT1jJiZcblwiY2hpbGRfYWRkZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfYWRkZWRcIixiLkphLGQpO2Vsc2UgaWYoXCJjaGlsZF9jaGFuZ2VkXCI9PWMmJlwiY2hpbGRfY2hhbmdlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYi5KYSxkLGUuSmUpO2Vsc2UgdGhyb3cgSGMoXCJJbGxlZ2FsIGNvbWJpbmF0aW9uIG9mIGNoYW5nZXM6IFwiK2IrXCIgb2NjdXJyZWQgYWZ0ZXIgXCIrZSk7fWVsc2UgYS5lYltkXT1ifTtmdW5jdGlvbiBqZChhLGIsYyl7dGhpcy5QYj1hO3RoaXMucWI9Yjt0aGlzLnNiPWN8fG51bGx9aD1qZC5wcm90b3R5cGU7aC5KZj1mdW5jdGlvbihhKXtyZXR1cm5cInZhbHVlXCI9PT1hfTtoLmNyZWF0ZUV2ZW50PWZ1bmN0aW9uKGEsYil7dmFyIGM9Yi5vLmc7cmV0dXJuIG5ldyBGYihcInZhbHVlXCIsdGhpcyxuZXcgUyhhLkphLGIubGMoKSxjKSl9O2guVWI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zYjtpZihcImNhbmNlbFwiPT09YS55ZSgpKXtKKHRoaXMucWIsXCJSYWlzaW5nIGEgY2FuY2VsIGV2ZW50IG9uIGEgbGlzdGVuZXIgd2l0aCBubyBjYW5jZWwgY2FsbGJhY2tcIik7dmFyIGM9dGhpcy5xYjtyZXR1cm4gZnVuY3Rpb24oKXtjLmNhbGwoYixhLmVycm9yKX19dmFyIGQ9dGhpcy5QYjtyZXR1cm4gZnVuY3Rpb24oKXtkLmNhbGwoYixhLldkKX19O2guZmY9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5xYj9uZXcgR2IodGhpcyxhLGIpOm51bGx9O1xuaC5tYXRjaGVzPWZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgamQ/YS5QYiYmdGhpcy5QYj9hLlBiPT09dGhpcy5QYiYmYS5zYj09PXRoaXMuc2I6ITA6ITF9O2guc2Y9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuUGJ9O2Z1bmN0aW9uIGtkKGEsYixjKXt0aGlzLmdhPWE7dGhpcy5xYj1iO3RoaXMuc2I9Y31oPWtkLnByb3RvdHlwZTtoLkpmPWZ1bmN0aW9uKGEpe2E9XCJjaGlsZHJlbl9hZGRlZFwiPT09YT9cImNoaWxkX2FkZGVkXCI6YTtyZXR1cm4oXCJjaGlsZHJlbl9yZW1vdmVkXCI9PT1hP1wiY2hpbGRfcmVtb3ZlZFwiOmEpaW4gdGhpcy5nYX07aC5mZj1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnFiP25ldyBHYih0aGlzLGEsYik6bnVsbH07XG5oLmNyZWF0ZUV2ZW50PWZ1bmN0aW9uKGEsYil7SihudWxsIT1hLllhLFwiQ2hpbGQgZXZlbnRzIHNob3VsZCBoYXZlIGEgY2hpbGROYW1lLlwiKTt2YXIgYz1iLmxjKCkudyhhLllhKTtyZXR1cm4gbmV3IEZiKGEudHlwZSx0aGlzLG5ldyBTKGEuSmEsYyxiLm8uZyksYS5OZCl9O2guVWI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zYjtpZihcImNhbmNlbFwiPT09YS55ZSgpKXtKKHRoaXMucWIsXCJSYWlzaW5nIGEgY2FuY2VsIGV2ZW50IG9uIGEgbGlzdGVuZXIgd2l0aCBubyBjYW5jZWwgY2FsbGJhY2tcIik7dmFyIGM9dGhpcy5xYjtyZXR1cm4gZnVuY3Rpb24oKXtjLmNhbGwoYixhLmVycm9yKX19dmFyIGQ9dGhpcy5nYVthLnJkXTtyZXR1cm4gZnVuY3Rpb24oKXtkLmNhbGwoYixhLldkLGEuTmQpfX07XG5oLm1hdGNoZXM9ZnVuY3Rpb24oYSl7aWYoYSBpbnN0YW5jZW9mIGtkKXtpZighdGhpcy5nYXx8IWEuZ2EpcmV0dXJuITA7aWYodGhpcy5zYj09PWEuc2Ipe3ZhciBiPXBhKGEuZ2EpO2lmKGI9PT1wYSh0aGlzLmdhKSl7aWYoMT09PWIpe3ZhciBiPXFhKGEuZ2EpLGM9cWEodGhpcy5nYSk7cmV0dXJuIGM9PT1iJiYoIWEuZ2FbYl18fCF0aGlzLmdhW2NdfHxhLmdhW2JdPT09dGhpcy5nYVtjXSl9cmV0dXJuIG9hKHRoaXMuZ2EsZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5nYVtjXT09PWJ9KX19fXJldHVybiExfTtoLnNmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT10aGlzLmdhfTtmdW5jdGlvbiBsZChhKXt0aGlzLmc9YX1oPWxkLnByb3RvdHlwZTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXtKKGEuSWModGhpcy5nKSxcIkEgbm9kZSBtdXN0IGJlIGluZGV4ZWQgaWYgb25seSBhIGNoaWxkIGlzIHVwZGF0ZWRcIik7ZD1hLk0oYik7aWYoZC5aKGMpKXJldHVybiBhO251bGwhPWUmJihjLmUoKT9hLkhhKGIpP2lkKGUsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZCxiKSk6SihhLk4oKSxcIkEgY2hpbGQgcmVtb3ZlIHdpdGhvdXQgYW4gb2xkIGNoaWxkIG9ubHkgbWFrZXMgc2Vuc2Ugb24gYSBsZWFmIG5vZGVcIik6ZC5lKCk/aWQoZSxuZXcgRChcImNoaWxkX2FkZGVkXCIsYyxiKSk6aWQoZSxuZXcgRChcImNoaWxkX2NoYW5nZWRcIixjLGIsZCkpKTtyZXR1cm4gYS5OKCkmJmMuZSgpP2E6YS5RKGIsYykubWIodGhpcy5nKX07XG5oLnRhPWZ1bmN0aW9uKGEsYixjKXtudWxsIT1jJiYoYS5OKCl8fGEuVShNLGZ1bmN0aW9uKGEsZSl7Yi5IYShhKXx8aWQoYyxuZXcgRChcImNoaWxkX3JlbW92ZWRcIixlLGEpKX0pLGIuTigpfHxiLlUoTSxmdW5jdGlvbihiLGUpe2lmKGEuSGEoYikpe3ZhciBmPWEuTShiKTtmLlooZSl8fGlkKGMsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsZSxiLGYpKX1lbHNlIGlkKGMsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGUsYikpfSkpO3JldHVybiBiLm1iKHRoaXMuZyl9O2guZGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5lKCk/QzphLmRhKGIpfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307ZnVuY3Rpb24gbWQoYSl7dGhpcy5BZT1uZXcgbGQoYS5nKTt0aGlzLmc9YS5nO3ZhciBiO2EubGE/KGI9bmQoYSksYj1hLmcuT2Mob2QoYSksYikpOmI9YS5nLlNjKCk7dGhpcy5kZD1iO2EubmE/KGI9cGQoYSksYT1hLmcuT2MocWQoYSksYikpOmE9YS5nLlBjKCk7dGhpcy5GYz1hfWg9bWQucHJvdG90eXBlO2gubWF0Y2hlcz1mdW5jdGlvbihhKXtyZXR1cm4gMD49dGhpcy5nLmNvbXBhcmUodGhpcy5kZCxhKSYmMD49dGhpcy5nLmNvbXBhcmUoYSx0aGlzLkZjKX07aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7dGhpcy5tYXRjaGVzKG5ldyBFKGIsYykpfHwoYz1DKTtyZXR1cm4gdGhpcy5BZS5HKGEsYixjLGQsZSl9O2gudGE9ZnVuY3Rpb24oYSxiLGMpe2IuTigpJiYoYj1DKTt2YXIgZD1iLm1iKHRoaXMuZyksZD1kLmRhKEMpLGU9dGhpcztiLlUoTSxmdW5jdGlvbihhLGIpe2UubWF0Y2hlcyhuZXcgRShhLGIpKXx8KGQ9ZC5RKGEsQykpfSk7cmV0dXJuIHRoaXMuQWUudGEoYSxkLGMpfTtcbmguZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLkFlfTtmdW5jdGlvbiByZChhKXt0aGlzLnJhPW5ldyBtZChhKTt0aGlzLmc9YS5nO0ooYS5pYSxcIk9ubHkgdmFsaWQgaWYgbGltaXQgaGFzIGJlZW4gc2V0XCIpO3RoaXMuamE9YS5qYTt0aGlzLkpiPSFzZChhKX1oPXJkLnByb3RvdHlwZTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXt0aGlzLnJhLm1hdGNoZXMobmV3IEUoYixjKSl8fChjPUMpO3JldHVybiBhLk0oYikuWihjKT9hOmEuRGIoKTx0aGlzLmphP3RoaXMucmEuVmIoKS5HKGEsYixjLGQsZSk6dGQodGhpcyxhLGIsYyxkLGUpfTtcbmgudGE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO2lmKGIuTigpfHxiLmUoKSlkPUMubWIodGhpcy5nKTtlbHNlIGlmKDIqdGhpcy5qYTxiLkRiKCkmJmIuSWModGhpcy5nKSl7ZD1DLm1iKHRoaXMuZyk7Yj10aGlzLkpiP2IuWmIodGhpcy5yYS5GYyx0aGlzLmcpOmIuWGIodGhpcy5yYS5kZCx0aGlzLmcpO2Zvcih2YXIgZT0wOzA8Yi5QYS5sZW5ndGgmJmU8dGhpcy5qYTspe3ZhciBmPUgoYiksZztpZihnPXRoaXMuSmI/MD49dGhpcy5nLmNvbXBhcmUodGhpcy5yYS5kZCxmKTowPj10aGlzLmcuY29tcGFyZShmLHRoaXMucmEuRmMpKWQ9ZC5RKGYubmFtZSxmLlMpLGUrKztlbHNlIGJyZWFrfX1lbHNle2Q9Yi5tYih0aGlzLmcpO2Q9ZC5kYShDKTt2YXIgayxsLG07aWYodGhpcy5KYil7Yj1kLnJmKHRoaXMuZyk7az10aGlzLnJhLkZjO2w9dGhpcy5yYS5kZDt2YXIgdj11ZCh0aGlzLmcpO209ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdihiLGEpfX1lbHNlIGI9ZC5XYih0aGlzLmcpLGs9dGhpcy5yYS5kZCxcbmw9dGhpcy5yYS5GYyxtPXVkKHRoaXMuZyk7Zm9yKHZhciBlPTAseT0hMTswPGIuUGEubGVuZ3RoOylmPUgoYiksIXkmJjA+PW0oayxmKSYmKHk9ITApLChnPXkmJmU8dGhpcy5qYSYmMD49bShmLGwpKT9lKys6ZD1kLlEoZi5uYW1lLEMpfXJldHVybiB0aGlzLnJhLlZiKCkudGEoYSxkLGMpfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiBhfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yYS5WYigpfTtcbmZ1bmN0aW9uIHRkKGEsYixjLGQsZSxmKXt2YXIgZztpZihhLkpiKXt2YXIgaz11ZChhLmcpO2c9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gayhiLGEpfX1lbHNlIGc9dWQoYS5nKTtKKGIuRGIoKT09YS5qYSxcIlwiKTt2YXIgbD1uZXcgRShjLGQpLG09YS5KYj93ZChiLGEuZyk6eGQoYixhLmcpLHY9YS5yYS5tYXRjaGVzKGwpO2lmKGIuSGEoYykpe3ZhciB5PWIuTShjKSxtPWUueGUoYS5nLG0sYS5KYik7bnVsbCE9bSYmbS5uYW1lPT1jJiYobT1lLnhlKGEuZyxtLGEuSmIpKTtlPW51bGw9PW0/MTpnKG0sbCk7aWYodiYmIWQuZSgpJiYwPD1lKXJldHVybiBudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGQsYyx5KSksYi5RKGMsZCk7bnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX3JlbW92ZWRcIix5LGMpKTtiPWIuUShjLEMpO3JldHVybiBudWxsIT1tJiZhLnJhLm1hdGNoZXMobSk/KG51bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLG0uUyxtLm5hbWUpKSxiLlEobS5uYW1lLFxubS5TKSk6Yn1yZXR1cm4gZC5lKCk/Yjp2JiYwPD1nKG0sbCk/KG51bGwhPWYmJihpZChmLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLG0uUyxtLm5hbWUpKSxpZChmLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixkLGMpKSksYi5RKGMsZCkuUShtLm5hbWUsQykpOmJ9O2Z1bmN0aW9uIHlkKGEsYil7dGhpcy5oZT1hO3RoaXMuY2c9Yn1mdW5jdGlvbiB6ZChhKXt0aGlzLkk9YX1cbnpkLnByb3RvdHlwZS5iYj1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1uZXcgaGQsZjtpZihiLnR5cGU9PT1WYiliLnNvdXJjZS52ZT9jPUFkKHRoaXMsYSxiLnBhdGgsYi5JYSxjLGQsZSk6KEooYi5zb3VyY2Uub2YsXCJVbmtub3duIHNvdXJjZS5cIiksZj1iLnNvdXJjZS5hZixjPUJkKHRoaXMsYSxiLnBhdGgsYi5JYSxjLGQsZixlKSk7ZWxzZSBpZihiLnR5cGU9PT1DZCliLnNvdXJjZS52ZT9jPURkKHRoaXMsYSxiLnBhdGgsYi5jaGlsZHJlbixjLGQsZSk6KEooYi5zb3VyY2Uub2YsXCJVbmtub3duIHNvdXJjZS5cIiksZj1iLnNvdXJjZS5hZixjPUVkKHRoaXMsYSxiLnBhdGgsYi5jaGlsZHJlbixjLGQsZixlKSk7ZWxzZSBpZihiLnR5cGU9PT1YYilpZihiLlZlKWlmKGY9Yi5wYXRoLG51bGwhPWMuc2MoZikpYz1hO2Vsc2V7Yj1uZXcgcWIoYyxhLGQpO2Q9YS5ELmooKTtpZihmLmUoKXx8XCIucHJpb3JpdHlcIj09PU8oZikpSGIoYS51KCkpP2I9Yy51YSh0YihhKSk6KGI9YS51KCkuaigpLFxuSihiIGluc3RhbmNlb2YgVCxcInNlcnZlckNoaWxkcmVuIHdvdWxkIGJlIGNvbXBsZXRlIGlmIGxlYWYgbm9kZVwiKSxiPWMueGMoYikpLGI9dGhpcy5JLnRhKGQsYixlKTtlbHNle2Y9TyhmKTt2YXIgZz1jLlhhKGYsYS51KCkpO251bGw9PWcmJnJiKGEudSgpLGYpJiYoZz1kLk0oZikpO2I9bnVsbCE9Zz90aGlzLkkuRyhkLGYsZyxiLGUpOmEuRC5qKCkuSGEoZik/dGhpcy5JLkcoZCxmLEMsYixlKTpkO2IuZSgpJiZIYihhLnUoKSkmJihkPWMudWEodGIoYSkpLGQuTigpJiYoYj10aGlzLkkudGEoYixkLGUpKSl9ZD1IYihhLnUoKSl8fG51bGwhPWMuc2MoRik7Yz1GZChhLGIsZCx0aGlzLkkuR2EoKSl9ZWxzZSBjPUdkKHRoaXMsYSxiLnBhdGgsYyxkLGUpO2Vsc2UgaWYoYi50eXBlPT09JGIpZD1iLnBhdGgsYj1hLnUoKSxmPWIuaigpLGc9Yi4kfHxkLmUoKSxjPUhkKHRoaXMsbmV3IElkKGEuRCxuZXcgc2IoZixnLGIuVGIpKSxkLGMscGIsZSk7ZWxzZSB0aHJvdyBIYyhcIlVua25vd24gb3BlcmF0aW9uIHR5cGU6IFwiK1xuYi50eXBlKTtlPXJhKGUuZWIpO2Q9YztiPWQuRDtiLiQmJihmPWIuaigpLk4oKXx8Yi5qKCkuZSgpLGc9SmQoYSksKDA8ZS5sZW5ndGh8fCFhLkQuJHx8ZiYmIWIuaigpLlooZyl8fCFiLmooKS5BKCkuWihnLkEoKSkpJiZlLnB1c2goRGIoSmQoZCkpKSk7cmV0dXJuIG5ldyB5ZChjLGUpfTtcbmZ1bmN0aW9uIEhkKGEsYixjLGQsZSxmKXt2YXIgZz1iLkQ7aWYobnVsbCE9ZC5zYyhjKSlyZXR1cm4gYjt2YXIgaztpZihjLmUoKSlKKEhiKGIudSgpKSxcIklmIGNoYW5nZSBwYXRoIGlzIGVtcHR5LCB3ZSBtdXN0IGhhdmUgY29tcGxldGUgc2VydmVyIGRhdGFcIiksYi51KCkuVGI/KGU9dGIoYiksZD1kLnhjKGUgaW5zdGFuY2VvZiBUP2U6QykpOmQ9ZC51YSh0YihiKSksZj1hLkkudGEoYi5ELmooKSxkLGYpO2Vsc2V7dmFyIGw9TyhjKTtpZihcIi5wcmlvcml0eVwiPT1sKUooMT09dWMoYyksXCJDYW4ndCBoYXZlIGEgcHJpb3JpdHkgd2l0aCBhZGRpdGlvbmFsIHBhdGggY29tcG9uZW50c1wiKSxmPWcuaigpLGs9Yi51KCkuaigpLGQ9ZC5oZChjLGYsayksZj1udWxsIT1kP2EuSS5kYShmLGQpOmcuaigpO2Vsc2V7dmFyIG09RyhjKTtyYihnLGwpPyhrPWIudSgpLmooKSxkPWQuaGQoYyxnLmooKSxrKSxkPW51bGwhPWQ/Zy5qKCkuTShsKS5HKG0sZCk6Zy5qKCkuTShsKSk6ZD1kLlhhKGwsYi51KCkpO1xuZj1udWxsIT1kP2EuSS5HKGcuaigpLGwsZCxlLGYpOmcuaigpfX1yZXR1cm4gRmQoYixmLGcuJHx8Yy5lKCksYS5JLkdhKCkpfWZ1bmN0aW9uIEJkKGEsYixjLGQsZSxmLGcsayl7dmFyIGw9Yi51KCk7Zz1nP2EuSTphLkkuVmIoKTtpZihjLmUoKSlkPWcudGEobC5qKCksZCxudWxsKTtlbHNlIGlmKGcuR2EoKSYmIWwuVGIpZD1sLmooKS5HKGMsZCksZD1nLnRhKGwuaigpLGQsbnVsbCk7ZWxzZXt2YXIgbT1PKGMpO2lmKChjLmUoKT8hbC4kfHxsLlRiOiFyYihsLE8oYykpKSYmMTx1YyhjKSlyZXR1cm4gYjtkPWwuaigpLk0obSkuRyhHKGMpLGQpO2Q9XCIucHJpb3JpdHlcIj09bT9nLmRhKGwuaigpLGQpOmcuRyhsLmooKSxtLGQscGIsbnVsbCl9bD1sLiR8fGMuZSgpO2I9bmV3IElkKGIuRCxuZXcgc2IoZCxsLGcuR2EoKSkpO3JldHVybiBIZChhLGIsYyxlLG5ldyBxYihlLGIsZiksayl9XG5mdW5jdGlvbiBBZChhLGIsYyxkLGUsZixnKXt2YXIgaz1iLkQ7ZT1uZXcgcWIoZSxiLGYpO2lmKGMuZSgpKWc9YS5JLnRhKGIuRC5qKCksZCxnKSxhPUZkKGIsZywhMCxhLkkuR2EoKSk7ZWxzZSBpZihmPU8oYyksXCIucHJpb3JpdHlcIj09PWYpZz1hLkkuZGEoYi5ELmooKSxkKSxhPUZkKGIsZyxrLiQsay5UYik7ZWxzZXt2YXIgbD1HKGMpO2M9ay5qKCkuTShmKTtpZighbC5lKCkpe3ZhciBtPWUucGYoZik7ZD1udWxsIT1tP1wiLnByaW9yaXR5XCI9PT12YyhsKSYmbS5vYShsLnBhcmVudCgpKS5lKCk/bTptLkcobCxkKTpDfWMuWihkKT9hPWI6KGc9YS5JLkcoay5qKCksZixkLGUsZyksYT1GZChiLGcsay4kLGEuSS5HYSgpKSl9cmV0dXJuIGF9XG5mdW5jdGlvbiBEZChhLGIsYyxkLGUsZixnKXt2YXIgaz1iO0tkKGQsZnVuY3Rpb24oZCxtKXt2YXIgdj1jLncoZCk7cmIoYi5ELE8odikpJiYoaz1BZChhLGssdixtLGUsZixnKSl9KTtLZChkLGZ1bmN0aW9uKGQsbSl7dmFyIHY9Yy53KGQpO3JiKGIuRCxPKHYpKXx8KGs9QWQoYSxrLHYsbSxlLGYsZykpfSk7cmV0dXJuIGt9ZnVuY3Rpb24gTGQoYSxiKXtLZChiLGZ1bmN0aW9uKGIsZCl7YT1hLkcoYixkKX0pO3JldHVybiBhfVxuZnVuY3Rpb24gRWQoYSxiLGMsZCxlLGYsZyxrKXtpZihiLnUoKS5qKCkuZSgpJiYhSGIoYi51KCkpKXJldHVybiBiO3ZhciBsPWI7Yz1jLmUoKT9kOk1kKE5kLGMsZCk7dmFyIG09Yi51KCkuaigpO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxkKXtpZihtLkhhKGMpKXt2YXIgST1iLnUoKS5qKCkuTShjKSxJPUxkKEksZCk7bD1CZChhLGwsbmV3IEsoYyksSSxlLGYsZyxrKX19KTtjLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGMsZCl7dmFyIEk9IUhiKGIudSgpKSYmbnVsbD09ZC52YWx1ZTttLkhhKGMpfHxJfHwoST1iLnUoKS5qKCkuTShjKSxJPUxkKEksZCksbD1CZChhLGwsbmV3IEsoYyksSSxlLGYsZyxrKSl9KTtyZXR1cm4gbH1cbmZ1bmN0aW9uIEdkKGEsYixjLGQsZSxmKXtpZihudWxsIT1kLnNjKGMpKXJldHVybiBiO3ZhciBnPW5ldyBxYihkLGIsZSksaz1lPWIuRC5qKCk7aWYoSGIoYi51KCkpKXtpZihjLmUoKSllPWQudWEodGIoYikpLGs9YS5JLnRhKGIuRC5qKCksZSxmKTtlbHNlIGlmKFwiLnByaW9yaXR5XCI9PT1PKGMpKXt2YXIgbD1kLlhhKE8oYyksYi51KCkpO251bGw9PWx8fGUuZSgpfHxlLkEoKS5aKGwpfHwoaz1hLkkuZGEoZSxsKSl9ZWxzZSBsPU8oYyksZT1kLlhhKGwsYi51KCkpLG51bGwhPWUmJihrPWEuSS5HKGIuRC5qKCksbCxlLGcsZikpO2U9ITB9ZWxzZSBpZihiLkQuJHx8Yy5lKCkpaz1lLGU9Yi5ELmooKSxlLk4oKXx8ZS5VKE0sZnVuY3Rpb24oYyl7dmFyIGU9ZC5YYShjLGIudSgpKTtudWxsIT1lJiYoaz1hLkkuRyhrLGMsZSxnLGYpKX0pLGU9Yi5ELiQ7ZWxzZXtsPU8oYyk7aWYoMT09dWMoYyl8fHJiKGIuRCxsKSljPWQuWGEobCxiLnUoKSksbnVsbCE9YyYmKGs9YS5JLkcoZSxsLGMsXG5nLGYpKTtlPSExfXJldHVybiBGZChiLGssZSxhLkkuR2EoKSl9O2Z1bmN0aW9uIE9kKCl7fXZhciBQZD17fTtmdW5jdGlvbiB1ZChhKXtyZXR1cm4gcShhLmNvbXBhcmUsYSl9T2QucHJvdG90eXBlLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIDAhPT10aGlzLmNvbXBhcmUobmV3IEUoXCJbTUlOX05BTUVdXCIsYSksbmV3IEUoXCJbTUlOX05BTUVdXCIsYikpfTtPZC5wcm90b3R5cGUuU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2Z1bmN0aW9uIFJkKGEpe3RoaXMuYmM9YX1tYShSZCxPZCk7aD1SZC5wcm90b3R5cGU7aC5IYz1mdW5jdGlvbihhKXtyZXR1cm4hYS5NKHRoaXMuYmMpLmUoKX07aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLk0odGhpcy5iYyksZD1iLlMuTSh0aGlzLmJjKSxjPWMuQ2MoZCk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpLGM9Qy5RKHRoaXMuYmMsYyk7cmV0dXJuIG5ldyBFKGIsYyl9O1xuaC5QYz1mdW5jdGlvbigpe3ZhciBhPUMuUSh0aGlzLmJjLFNkKTtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsYSl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iY307ZnVuY3Rpb24gVGQoKXt9bWEoVGQsT2QpO2g9VGQucHJvdG90eXBlO2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5BKCksZD1iLlMuQSgpLGM9Yy5DYyhkKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5IYz1mdW5jdGlvbihhKXtyZXR1cm4hYS5BKCkuZSgpfTtoLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIWEuQSgpLlooYi5BKCkpfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLG5ldyB0YyhcIltQUklPUklUWS1QT1NUXVwiLFNkKSl9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpO3JldHVybiBuZXcgRShiLG5ldyB0YyhcIltQUklPUklUWS1QT1NUXVwiLGMpKX07XG5oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIucHJpb3JpdHlcIn07dmFyIE09bmV3IFRkO2Z1bmN0aW9uIFVkKCl7fW1hKFVkLE9kKTtoPVVkLnByb3RvdHlwZTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gU2IoYS5uYW1lLGIubmFtZSl9O2guSGM9ZnVuY3Rpb24oKXt0aHJvdyBIYyhcIktleUluZGV4LmlzRGVmaW5lZE9uIG5vdCBleHBlY3RlZCB0byBiZSBjYWxsZWQuXCIpO307aC54ZD1mdW5jdGlvbigpe3JldHVybiExfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLEMpfTtoLk9jPWZ1bmN0aW9uKGEpe0oocChhKSxcIktleUluZGV4IGluZGV4VmFsdWUgbXVzdCBhbHdheXMgYmUgYSBzdHJpbmcuXCIpO3JldHVybiBuZXcgRShhLEMpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIua2V5XCJ9O3ZhciBWZD1uZXcgVWQ7ZnVuY3Rpb24gV2QoKXt9bWEoV2QsT2QpO2g9V2QucHJvdG90eXBlO1xuaC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLkNjKGIuUyk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guSGM9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC54ZD1mdW5jdGlvbihhLGIpe3JldHVybiFhLlooYil9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gWGR9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpO3JldHVybiBuZXcgRShiLGMpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIudmFsdWVcIn07dmFyIFlkPW5ldyBXZDtmdW5jdGlvbiBaZCgpe3RoaXMuUmI9dGhpcy5uYT10aGlzLkxiPXRoaXMubGE9dGhpcy5pYT0hMTt0aGlzLmphPTA7dGhpcy5OYj1cIlwiO3RoaXMuZGM9bnVsbDt0aGlzLnhiPVwiXCI7dGhpcy5hYz1udWxsO3RoaXMudmI9XCJcIjt0aGlzLmc9TX12YXIgJGQ9bmV3IFpkO2Z1bmN0aW9uIHNkKGEpe3JldHVyblwiXCI9PT1hLk5iP2EubGE6XCJsXCI9PT1hLk5ifWZ1bmN0aW9uIG9kKGEpe0ooYS5sYSxcIk9ubHkgdmFsaWQgaWYgc3RhcnQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLmRjfWZ1bmN0aW9uIG5kKGEpe0ooYS5sYSxcIk9ubHkgdmFsaWQgaWYgc3RhcnQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLkxiP2EueGI6XCJbTUlOX05BTUVdXCJ9ZnVuY3Rpb24gcWQoYSl7SihhLm5hLFwiT25seSB2YWxpZCBpZiBlbmQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLmFjfVxuZnVuY3Rpb24gcGQoYSl7SihhLm5hLFwiT25seSB2YWxpZCBpZiBlbmQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLlJiP2EudmI6XCJbTUFYX05BTUVdXCJ9ZnVuY3Rpb24gYWUoYSl7dmFyIGI9bmV3IFpkO2IuaWE9YS5pYTtiLmphPWEuamE7Yi5sYT1hLmxhO2IuZGM9YS5kYztiLkxiPWEuTGI7Yi54Yj1hLnhiO2IubmE9YS5uYTtiLmFjPWEuYWM7Yi5SYj1hLlJiO2IudmI9YS52YjtiLmc9YS5nO3JldHVybiBifWg9WmQucHJvdG90eXBlO2guR2U9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cIlwiO3JldHVybiBifTtoLkhlPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJsXCI7cmV0dXJuIGJ9O2guSWU9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cInJcIjtyZXR1cm4gYn07XG5oLlhkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YWUodGhpcyk7Yy5sYT0hMDtuKGEpfHwoYT1udWxsKTtjLmRjPWE7bnVsbCE9Yj8oYy5MYj0hMCxjLnhiPWIpOihjLkxiPSExLGMueGI9XCJcIik7cmV0dXJuIGN9O2gucWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hZSh0aGlzKTtjLm5hPSEwO24oYSl8fChhPW51bGwpO2MuYWM9YTtuKGIpPyhjLlJiPSEwLGMudmI9Yik6KGMuWWc9ITEsYy52Yj1cIlwiKTtyZXR1cm4gY307ZnVuY3Rpb24gYmUoYSxiKXt2YXIgYz1hZShhKTtjLmc9YjtyZXR1cm4gY31mdW5jdGlvbiBjZShhKXt2YXIgYj17fTthLmxhJiYoYi5zcD1hLmRjLGEuTGImJihiLnNuPWEueGIpKTthLm5hJiYoYi5lcD1hLmFjLGEuUmImJihiLmVuPWEudmIpKTtpZihhLmlhKXtiLmw9YS5qYTt2YXIgYz1hLk5iO1wiXCI9PT1jJiYoYz1zZChhKT9cImxcIjpcInJcIik7Yi52Zj1jfWEuZyE9PU0mJihiLmk9YS5nLnRvU3RyaW5nKCkpO3JldHVybiBifVxuZnVuY3Rpb24gZGUoYSl7cmV0dXJuIShhLmxhfHxhLm5hfHxhLmlhKX1mdW5jdGlvbiBlZShhKXt2YXIgYj17fTtpZihkZShhKSYmYS5nPT1NKXJldHVybiBiO3ZhciBjO2EuZz09PU0/Yz1cIiRwcmlvcml0eVwiOmEuZz09PVlkP2M9XCIkdmFsdWVcIjphLmc9PT1WZD9jPVwiJGtleVwiOihKKGEuZyBpbnN0YW5jZW9mIFJkLFwiVW5yZWNvZ25pemVkIGluZGV4IHR5cGUhXCIpLGM9YS5nLnRvU3RyaW5nKCkpO2Iub3JkZXJCeT1CKGMpO2EubGEmJihiLnN0YXJ0QXQ9QihhLmRjKSxhLkxiJiYoYi5zdGFydEF0Kz1cIixcIitCKGEueGIpKSk7YS5uYSYmKGIuZW5kQXQ9QihhLmFjKSxhLlJiJiYoYi5lbmRBdCs9XCIsXCIrQihhLnZiKSkpO2EuaWEmJihzZChhKT9iLmxpbWl0VG9GaXJzdD1hLmphOmIubGltaXRUb0xhc3Q9YS5qYSk7cmV0dXJuIGJ9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKGNlKHRoaXMpKX07ZnVuY3Rpb24gZmUoYSxiKXt0aGlzLnlkPWE7dGhpcy5jYz1ifWZlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dyh0aGlzLnlkLGEpO2lmKCFiKXRocm93IEVycm9yKFwiTm8gaW5kZXggZGVmaW5lZCBmb3IgXCIrYSk7cmV0dXJuIGI9PT1QZD9udWxsOmJ9O2Z1bmN0aW9uIGdlKGEsYixjKXt2YXIgZD1uYShhLnlkLGZ1bmN0aW9uKGQsZil7dmFyIGc9dyhhLmNjLGYpO0ooZyxcIk1pc3NpbmcgaW5kZXggaW1wbGVtZW50YXRpb24gZm9yIFwiK2YpO2lmKGQ9PT1QZCl7aWYoZy5IYyhiLlMpKXtmb3IodmFyIGs9W10sbD1jLldiKFFiKSxtPUgobCk7bTspbS5uYW1lIT1iLm5hbWUmJmsucHVzaChtKSxtPUgobCk7ay5wdXNoKGIpO3JldHVybiBoZShrLHVkKGcpKX1yZXR1cm4gUGR9Zz1jLmdldChiLm5hbWUpO2s9ZDtnJiYoaz1rLnJlbW92ZShuZXcgRShiLm5hbWUsZykpKTtyZXR1cm4gay5OYShiLGIuUyl9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9XG5mdW5jdGlvbiBpZShhLGIsYyl7dmFyIGQ9bmEoYS55ZCxmdW5jdGlvbihhKXtpZihhPT09UGQpcmV0dXJuIGE7dmFyIGQ9Yy5nZXQoYi5uYW1lKTtyZXR1cm4gZD9hLnJlbW92ZShuZXcgRShiLm5hbWUsZCkpOmF9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9dmFyIGplPW5ldyBmZSh7XCIucHJpb3JpdHlcIjpQZH0se1wiLnByaW9yaXR5XCI6TX0pO2Z1bmN0aW9uIHRjKGEsYil7dGhpcy5DPWE7SihuKHRoaXMuQykmJm51bGwhPT10aGlzLkMsXCJMZWFmTm9kZSBzaG91bGRuJ3QgYmUgY3JlYXRlZCB3aXRoIG51bGwvdW5kZWZpbmVkIHZhbHVlLlwiKTt0aGlzLmJhPWJ8fEM7a2UodGhpcy5iYSk7dGhpcy5CYj1udWxsfWg9dGMucHJvdG90eXBlO2guTj1mdW5jdGlvbigpe3JldHVybiEwfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYX07aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IHRjKHRoaXMuQyxhKX07aC5NPWZ1bmN0aW9uKGEpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuYmE6Q307aC5vYT1mdW5jdGlvbihhKXtyZXR1cm4gYS5lKCk/dGhpczpcIi5wcmlvcml0eVwiPT09TyhhKT90aGlzLmJhOkN9O2guSGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5xZj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtcbmguUT1mdW5jdGlvbihhLGIpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuZGEoYik6Yi5lKCkmJlwiLnByaW9yaXR5XCIhPT1hP3RoaXM6Qy5RKGEsYikuZGEodGhpcy5iYSl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYi5lKCkmJlwiLnByaW9yaXR5XCIhPT1jKXJldHVybiB0aGlzO0ooXCIucHJpb3JpdHlcIiE9PWN8fDE9PT11YyhhKSxcIi5wcmlvcml0eSBtdXN0IGJlIHRoZSBsYXN0IHRva2VuIGluIGEgcGF0aFwiKTtyZXR1cm4gdGhpcy5RKGMsQy5HKEcoYSksYikpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5EYj1mdW5jdGlvbigpe3JldHVybiAwfTtoLks9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJiF0aGlzLkEoKS5lKCk/e1wiLnZhbHVlXCI6dGhpcy5CYSgpLFwiLnByaW9yaXR5XCI6dGhpcy5BKCkuSygpfTp0aGlzLkJhKCl9O1xuaC5oYXNoPWZ1bmN0aW9uKCl7aWYobnVsbD09PXRoaXMuQmIpe3ZhciBhPVwiXCI7dGhpcy5iYS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuYmEuSygpKStcIjpcIik7dmFyIGI9dHlwZW9mIHRoaXMuQyxhPWErKGIrXCI6XCIpLGE9XCJudW1iZXJcIj09PWI/YStaYyh0aGlzLkMpOmErdGhpcy5DO3RoaXMuQmI9SmMoYSl9cmV0dXJuIHRoaXMuQmJ9O2guQmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5DfTtoLkNjPWZ1bmN0aW9uKGEpe2lmKGE9PT1DKXJldHVybiAxO2lmKGEgaW5zdGFuY2VvZiBUKXJldHVybi0xO0ooYS5OKCksXCJVbmtub3duIG5vZGUgdHlwZVwiKTt2YXIgYj10eXBlb2YgYS5DLGM9dHlwZW9mIHRoaXMuQyxkPU5hKG1lLGIpLGU9TmEobWUsYyk7SigwPD1kLFwiVW5rbm93biBsZWFmIHR5cGU6IFwiK2IpO0ooMDw9ZSxcIlVua25vd24gbGVhZiB0eXBlOiBcIitjKTtyZXR1cm4gZD09PWU/XCJvYmplY3RcIj09PWM/MDp0aGlzLkM8YS5DPy0xOnRoaXMuQz09PWEuQz8wOjE6ZS1kfTtcbnZhciBtZT1bXCJvYmplY3RcIixcImJvb2xlYW5cIixcIm51bWJlclwiLFwic3RyaW5nXCJdO3RjLnByb3RvdHlwZS5tYj1mdW5jdGlvbigpe3JldHVybiB0aGlzfTt0Yy5wcm90b3R5cGUuSWM9ZnVuY3Rpb24oKXtyZXR1cm4hMH07dGMucHJvdG90eXBlLlo9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPyEwOmEuTigpP3RoaXMuQz09PWEuQyYmdGhpcy5iYS5aKGEuYmEpOiExfTt0Yy5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQih0aGlzLksoITApKX07ZnVuY3Rpb24gVChhLGIsYyl7dGhpcy5tPWE7KHRoaXMuYmE9YikmJmtlKHRoaXMuYmEpO2EuZSgpJiZKKCF0aGlzLmJhfHx0aGlzLmJhLmUoKSxcIkFuIGVtcHR5IG5vZGUgY2Fubm90IGhhdmUgYSBwcmlvcml0eVwiKTt0aGlzLndiPWM7dGhpcy5CYj1udWxsfWg9VC5wcm90b3R5cGU7aC5OPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJhfHxDfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm0uZSgpP3RoaXM6bmV3IFQodGhpcy5tLGEsdGhpcy53Yil9O2guTT1mdW5jdGlvbihhKXtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5BKCk7YT10aGlzLm0uZ2V0KGEpO3JldHVybiBudWxsPT09YT9DOmF9O2gub2E9ZnVuY3Rpb24oYSl7dmFyIGI9TyhhKTtyZXR1cm4gbnVsbD09PWI/dGhpczp0aGlzLk0oYikub2EoRyhhKSl9O2guSGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPT10aGlzLm0uZ2V0KGEpfTtcbmguUT1mdW5jdGlvbihhLGIpe0ooYixcIldlIHNob3VsZCBhbHdheXMgYmUgcGFzc2luZyBzbmFwc2hvdCBub2Rlc1wiKTtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5kYShiKTt2YXIgYz1uZXcgRShhLGIpLGQsZTtiLmUoKT8oZD10aGlzLm0ucmVtb3ZlKGEpLGM9aWUodGhpcy53YixjLHRoaXMubSkpOihkPXRoaXMubS5OYShhLGIpLGM9Z2UodGhpcy53YixjLHRoaXMubSkpO2U9ZC5lKCk/Qzp0aGlzLmJhO3JldHVybiBuZXcgVChkLGUsYyl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7SihcIi5wcmlvcml0eVwiIT09TyhhKXx8MT09PXVjKGEpLFwiLnByaW9yaXR5IG11c3QgYmUgdGhlIGxhc3QgdG9rZW4gaW4gYSBwYXRoXCIpO3ZhciBkPXRoaXMuTShjKS5HKEcoYSksYik7cmV0dXJuIHRoaXMuUShjLGQpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tLmUoKX07aC5EYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLm0uY291bnQoKX07XG52YXIgbmU9L14oMHxbMS05XVxcZCopJC87aD1ULnByb3RvdHlwZTtoLks9ZnVuY3Rpb24oYSl7aWYodGhpcy5lKCkpcmV0dXJuIG51bGw7dmFyIGI9e30sYz0wLGQ9MCxlPSEwO3RoaXMuVShNLGZ1bmN0aW9uKGYsZyl7YltmXT1nLksoYSk7YysrO2UmJm5lLnRlc3QoZik/ZD1NYXRoLm1heChkLE51bWJlcihmKSk6ZT0hMX0pO2lmKCFhJiZlJiZkPDIqYyl7dmFyIGY9W10sZztmb3IoZyBpbiBiKWZbZ109YltnXTtyZXR1cm4gZn1hJiYhdGhpcy5BKCkuZSgpJiYoYltcIi5wcmlvcml0eVwiXT10aGlzLkEoKS5LKCkpO3JldHVybiBifTtoLmhhc2g9ZnVuY3Rpb24oKXtpZihudWxsPT09dGhpcy5CYil7dmFyIGE9XCJcIjt0aGlzLkEoKS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuQSgpLksoKSkrXCI6XCIpO3RoaXMuVShNLGZ1bmN0aW9uKGIsYyl7dmFyIGQ9Yy5oYXNoKCk7XCJcIiE9PWQmJihhKz1cIjpcIitiK1wiOlwiK2QpfSk7dGhpcy5CYj1cIlwiPT09YT9cIlwiOkpjKGEpfXJldHVybiB0aGlzLkJifTtcbmgucWY9ZnVuY3Rpb24oYSxiLGMpe3JldHVybihjPW9lKHRoaXMsYykpPyhhPWNjKGMsbmV3IEUoYSxiKSkpP2EubmFtZTpudWxsOmNjKHRoaXMubSxhKX07ZnVuY3Rpb24gd2QoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuUmMoKSkmJmMubmFtZTphLm0uUmMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9ZnVuY3Rpb24geGQoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuZWMoKSkmJmMubmFtZTphLm0uZWMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9aC5VPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxhKTtyZXR1cm4gYz9jLmhhKGZ1bmN0aW9uKGEpe3JldHVybiBiKGEubmFtZSxhLlMpfSk6dGhpcy5tLmhhKGIpfTtoLldiPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlhiKGEuU2MoKSxhKX07XG5oLlhiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlhiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlhiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPmIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2gucmY9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuWmIoYS5QYygpLGEpfTtoLlpiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlpiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlpiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPGIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2guQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZSgpP2EuZSgpPzA6LTE6YS5OKCl8fGEuZSgpPzE6YT09PVNkPy0xOjB9O1xuaC5tYj1mdW5jdGlvbihhKXtpZihhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLndiLGM9dGhpcy5tO0ooYSE9PVZkLFwiS2V5SW5kZXggYWx3YXlzIGV4aXN0cyBhbmQgaXNuJ3QgbWVhbnQgdG8gYmUgYWRkZWQgdG8gdGhlIEluZGV4TWFwLlwiKTtmb3IodmFyIGQ9W10sZT0hMSxjPWMuV2IoUWIpLGY9SChjKTtmOyllPWV8fGEuSGMoZi5TKSxkLnB1c2goZiksZj1IKGMpO2Q9ZT9oZShkLHVkKGEpKTpQZDtlPWEudG9TdHJpbmcoKTtjPXhhKGIuY2MpO2NbZV09YTthPXhhKGIueWQpO2FbZV09ZDtyZXR1cm4gbmV3IFQodGhpcy5tLHRoaXMuYmEsbmV3IGZlKGEsYykpfTtoLkljPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKX07XG5oLlo9ZnVuY3Rpb24oYSl7aWYoYT09PXRoaXMpcmV0dXJuITA7aWYoYS5OKCkpcmV0dXJuITE7aWYodGhpcy5BKCkuWihhLkEoKSkmJnRoaXMubS5jb3VudCgpPT09YS5tLmNvdW50KCkpe3ZhciBiPXRoaXMuV2IoTSk7YT1hLldiKE0pO2Zvcih2YXIgYz1IKGIpLGQ9SChhKTtjJiZkOyl7aWYoYy5uYW1lIT09ZC5uYW1lfHwhYy5TLlooZC5TKSlyZXR1cm4hMTtjPUgoYik7ZD1IKGEpfXJldHVybiBudWxsPT09YyYmbnVsbD09PWR9cmV0dXJuITF9O2Z1bmN0aW9uIG9lKGEsYil7cmV0dXJuIGI9PT1WZD9udWxsOmEud2IuZ2V0KGIudG9TdHJpbmcoKSl9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKHRoaXMuSyghMCkpfTtmdW5jdGlvbiBMKGEsYil7aWYobnVsbD09PWEpcmV0dXJuIEM7dmFyIGM9bnVsbDtcIm9iamVjdFwiPT09dHlwZW9mIGEmJlwiLnByaW9yaXR5XCJpbiBhP2M9YVtcIi5wcmlvcml0eVwiXTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGImJihjPWIpO0oobnVsbD09PWN8fFwic3RyaW5nXCI9PT10eXBlb2YgY3x8XCJudW1iZXJcIj09PXR5cGVvZiBjfHxcIm9iamVjdFwiPT09dHlwZW9mIGMmJlwiLnN2XCJpbiBjLFwiSW52YWxpZCBwcmlvcml0eSB0eXBlIGZvdW5kOiBcIit0eXBlb2YgYyk7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi52YWx1ZVwiaW4gYSYmbnVsbCE9PWFbXCIudmFsdWVcIl0mJihhPWFbXCIudmFsdWVcIl0pO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8XCIuc3ZcImluIGEpcmV0dXJuIG5ldyB0YyhhLEwoYykpO2lmKGEgaW5zdGFuY2VvZiBBcnJheSl7dmFyIGQ9QyxlPWE7cihlLGZ1bmN0aW9uKGEsYil7aWYodShlLGIpJiZcIi5cIiE9PWIuc3Vic3RyaW5nKDAsMSkpe3ZhciBjPUwoYSk7aWYoYy5OKCl8fCFjLmUoKSlkPVxuZC5RKGIsYyl9fSk7cmV0dXJuIGQuZGEoTChjKSl9dmFyIGY9W10sZz0hMSxrPWE7aGIoayxmdW5jdGlvbihhKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGF8fFwiLlwiIT09YS5zdWJzdHJpbmcoMCwxKSl7dmFyIGI9TChrW2FdKTtiLmUoKXx8KGc9Z3x8IWIuQSgpLmUoKSxmLnB1c2gobmV3IEUoYSxiKSkpfX0pO2lmKDA9PWYubGVuZ3RoKXJldHVybiBDO3ZhciBsPWhlKGYsUmIsZnVuY3Rpb24oYSl7cmV0dXJuIGEubmFtZX0sVGIpO2lmKGcpe3ZhciBtPWhlKGYsdWQoTSkpO3JldHVybiBuZXcgVChsLEwoYyksbmV3IGZlKHtcIi5wcmlvcml0eVwiOm19LHtcIi5wcmlvcml0eVwiOk19KSl9cmV0dXJuIG5ldyBUKGwsTChjKSxqZSl9dmFyIHBlPU1hdGgubG9nKDIpO1xuZnVuY3Rpb24gcWUoYSl7dGhpcy5jb3VudD1wYXJzZUludChNYXRoLmxvZyhhKzEpL3BlLDEwKTt0aGlzLmhmPXRoaXMuY291bnQtMTt0aGlzLmJnPWErMSZwYXJzZUludChBcnJheSh0aGlzLmNvdW50KzEpLmpvaW4oXCIxXCIpLDIpfWZ1bmN0aW9uIHJlKGEpe3ZhciBiPSEoYS5iZyYxPDxhLmhmKTthLmhmLS07cmV0dXJuIGJ9XG5mdW5jdGlvbiBoZShhLGIsYyxkKXtmdW5jdGlvbiBlKGIsZCl7dmFyIGY9ZC1iO2lmKDA9PWYpcmV0dXJuIG51bGw7aWYoMT09Zil7dmFyIG09YVtiXSx2PWM/YyhtKTptO3JldHVybiBuZXcgZmModixtLlMsITEsbnVsbCxudWxsKX12YXIgbT1wYXJzZUludChmLzIsMTApK2IsZj1lKGIsbSkseT1lKG0rMSxkKSxtPWFbbV0sdj1jP2MobSk6bTtyZXR1cm4gbmV3IGZjKHYsbS5TLCExLGYseSl9YS5zb3J0KGIpO3ZhciBmPWZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoYixnKXt2YXIgaz12LWIseT12O3YtPWI7dmFyIHk9ZShrKzEseSksaz1hW2tdLEk9Yz9jKGspOmsseT1uZXcgZmMoSSxrLlMsZyxudWxsLHkpO2Y/Zi5sZWZ0PXk6bT15O2Y9eX1mb3IodmFyIGY9bnVsbCxtPW51bGwsdj1hLmxlbmd0aCx5PTA7eTxiLmNvdW50OysreSl7dmFyIEk9cmUoYiksdmQ9TWF0aC5wb3coMixiLmNvdW50LSh5KzEpKTtJP2QodmQsITEpOihkKHZkLCExKSxkKHZkLCEwKSl9cmV0dXJuIG19KG5ldyBxZShhLmxlbmd0aCkpO1xucmV0dXJuIG51bGwhPT1mP25ldyBhYyhkfHxiLGYpOm5ldyBhYyhkfHxiKX1mdW5jdGlvbiBsZShhKXtyZXR1cm5cIm51bWJlclwiPT09dHlwZW9mIGE/XCJudW1iZXI6XCIrWmMoYSk6XCJzdHJpbmc6XCIrYX1mdW5jdGlvbiBrZShhKXtpZihhLk4oKSl7dmFyIGI9YS5LKCk7SihcInN0cmluZ1wiPT09dHlwZW9mIGJ8fFwibnVtYmVyXCI9PT10eXBlb2YgYnx8XCJvYmplY3RcIj09PXR5cGVvZiBiJiZ1KGIsXCIuc3ZcIiksXCJQcmlvcml0eSBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bWJlci5cIil9ZWxzZSBKKGE9PT1TZHx8YS5lKCksXCJwcmlvcml0eSBvZiB1bmV4cGVjdGVkIHR5cGUuXCIpO0ooYT09PVNkfHxhLkEoKS5lKCksXCJQcmlvcml0eSBub2RlcyBjYW4ndCBoYXZlIGEgcHJpb3JpdHkgb2YgdGhlaXIgb3duLlwiKX12YXIgQz1uZXcgVChuZXcgYWMoVGIpLG51bGwsamUpO2Z1bmN0aW9uIHNlKCl7VC5jYWxsKHRoaXMsbmV3IGFjKFRiKSxDLGplKX1tYShzZSxUKTtoPXNlLnByb3RvdHlwZTtcbmguQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPzA6MX07aC5aPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpc307aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guTT1mdW5jdGlvbigpe3JldHVybiBDfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07dmFyIFNkPW5ldyBzZSxRZD1uZXcgRShcIltNSU5fTkFNRV1cIixDKSxYZD1uZXcgRShcIltNQVhfTkFNRV1cIixTZCk7ZnVuY3Rpb24gSWQoYSxiKXt0aGlzLkQ9YTt0aGlzLlVkPWJ9ZnVuY3Rpb24gRmQoYSxiLGMsZCl7cmV0dXJuIG5ldyBJZChuZXcgc2IoYixjLGQpLGEuVWQpfWZ1bmN0aW9uIEpkKGEpe3JldHVybiBhLkQuJD9hLkQuaigpOm51bGx9SWQucHJvdG90eXBlLnU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5VZH07ZnVuY3Rpb24gdGIoYSl7cmV0dXJuIGEuVWQuJD9hLlVkLmooKTpudWxsfTtmdW5jdGlvbiB0ZShhLGIpe3RoaXMuVj1hO3ZhciBjPWEubyxkPW5ldyBsZChjLmcpLGM9ZGUoYyk/bmV3IGxkKGMuZyk6Yy5pYT9uZXcgcmQoYyk6bmV3IG1kKGMpO3RoaXMuR2Y9bmV3IHpkKGMpO3ZhciBlPWIudSgpLGY9Yi5ELGc9ZC50YShDLGUuaigpLG51bGwpLGs9Yy50YShDLGYuaigpLG51bGwpO3RoaXMuS2E9bmV3IElkKG5ldyBzYihrLGYuJCxjLkdhKCkpLG5ldyBzYihnLGUuJCxkLkdhKCkpKTt0aGlzLlphPVtdO3RoaXMuaWc9bmV3IGRkKGEpfWZ1bmN0aW9uIHVlKGEpe3JldHVybiBhLlZ9aD10ZS5wcm90b3R5cGU7aC51PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuS2EudSgpLmooKX07aC5oYj1mdW5jdGlvbihhKXt2YXIgYj10Yih0aGlzLkthKTtyZXR1cm4gYiYmKGRlKHRoaXMuVi5vKXx8IWEuZSgpJiYhYi5NKE8oYSkpLmUoKSk/Yi5vYShhKTpudWxsfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gMD09PXRoaXMuWmEubGVuZ3RofTtoLk9iPWZ1bmN0aW9uKGEpe3RoaXMuWmEucHVzaChhKX07XG5oLmtiPWZ1bmN0aW9uKGEsYil7dmFyIGM9W107aWYoYil7SihudWxsPT1hLFwiQSBjYW5jZWwgc2hvdWxkIGNhbmNlbCBhbGwgZXZlbnQgcmVnaXN0cmF0aW9ucy5cIik7dmFyIGQ9dGhpcy5WLnBhdGg7T2EodGhpcy5aYSxmdW5jdGlvbihhKXsoYT1hLmZmKGIsZCkpJiZjLnB1c2goYSl9KX1pZihhKXtmb3IodmFyIGU9W10sZj0wO2Y8dGhpcy5aYS5sZW5ndGg7KytmKXt2YXIgZz10aGlzLlphW2ZdO2lmKCFnLm1hdGNoZXMoYSkpZS5wdXNoKGcpO2Vsc2UgaWYoYS5zZigpKXtlPWUuY29uY2F0KHRoaXMuWmEuc2xpY2UoZisxKSk7YnJlYWt9fXRoaXMuWmE9ZX1lbHNlIHRoaXMuWmE9W107cmV0dXJuIGN9O1xuaC5iYj1mdW5jdGlvbihhLGIsYyl7YS50eXBlPT09Q2QmJm51bGwhPT1hLnNvdXJjZS5JYiYmKEoodGIodGhpcy5LYSksXCJXZSBzaG91bGQgYWx3YXlzIGhhdmUgYSBmdWxsIGNhY2hlIGJlZm9yZSBoYW5kbGluZyBtZXJnZXNcIiksSihKZCh0aGlzLkthKSxcIk1pc3NpbmcgZXZlbnQgY2FjaGUsIGV2ZW4gdGhvdWdoIHdlIGhhdmUgYSBzZXJ2ZXIgY2FjaGVcIikpO3ZhciBkPXRoaXMuS2E7YT10aGlzLkdmLmJiKGQsYSxiLGMpO2I9dGhpcy5HZjtjPWEuaGU7SihjLkQuaigpLkljKGIuSS5nKSxcIkV2ZW50IHNuYXAgbm90IGluZGV4ZWRcIik7SihjLnUoKS5qKCkuSWMoYi5JLmcpLFwiU2VydmVyIHNuYXAgbm90IGluZGV4ZWRcIik7SihIYihhLmhlLnUoKSl8fCFIYihkLnUoKSksXCJPbmNlIGEgc2VydmVyIHNuYXAgaXMgY29tcGxldGUsIGl0IHNob3VsZCBuZXZlciBnbyBiYWNrXCIpO3RoaXMuS2E9YS5oZTtyZXR1cm4gdmUodGhpcyxhLmNnLGEuaGUuRC5qKCksbnVsbCl9O1xuZnVuY3Rpb24gd2UoYSxiKXt2YXIgYz1hLkthLkQsZD1bXTtjLmooKS5OKCl8fGMuaigpLlUoTSxmdW5jdGlvbihhLGIpe2QucHVzaChuZXcgRChcImNoaWxkX2FkZGVkXCIsYixhKSl9KTtjLiQmJmQucHVzaChEYihjLmooKSkpO3JldHVybiB2ZShhLGQsYy5qKCksYil9ZnVuY3Rpb24gdmUoYSxiLGMsZCl7cmV0dXJuIGVkKGEuaWcsYixjLGQ/W2RdOmEuWmEpfTtmdW5jdGlvbiB4ZShhLGIsYyl7dGhpcy50eXBlPUNkO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWI7dGhpcy5jaGlsZHJlbj1jfXhlLnByb3RvdHlwZS5XYz1mdW5jdGlvbihhKXtpZih0aGlzLnBhdGguZSgpKXJldHVybiBhPXRoaXMuY2hpbGRyZW4uc3VidHJlZShuZXcgSyhhKSksYS5lKCk/bnVsbDphLnZhbHVlP25ldyBVYih0aGlzLnNvdXJjZSxGLGEudmFsdWUpOm5ldyB4ZSh0aGlzLnNvdXJjZSxGLGEpO0ooTyh0aGlzLnBhdGgpPT09YSxcIkNhbid0IGdldCBhIG1lcmdlIGZvciBhIGNoaWxkIG5vdCBvbiB0aGUgcGF0aCBvZiB0aGUgb3BlcmF0aW9uXCIpO3JldHVybiBuZXcgeGUodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpLHRoaXMuY2hpbGRyZW4pfTt4ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgbWVyZ2U6IFwiK3RoaXMuY2hpbGRyZW4udG9TdHJpbmcoKStcIilcIn07dmFyIFZiPTAsQ2Q9MSxYYj0yLCRiPTM7ZnVuY3Rpb24geWUoYSxiLGMsZCl7dGhpcy52ZT1hO3RoaXMub2Y9Yjt0aGlzLkliPWM7dGhpcy5hZj1kO0ooIWR8fGIsXCJUYWdnZWQgcXVlcmllcyBtdXN0IGJlIGZyb20gc2VydmVyLlwiKX12YXIgWWI9bmV3IHllKCEwLCExLG51bGwsITEpLHplPW5ldyB5ZSghMSwhMCxudWxsLCExKTt5ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZT9cInVzZXJcIjp0aGlzLmFmP1wic2VydmVyKHF1ZXJ5SUQ9XCIrdGhpcy5JYitcIilcIjpcInNlcnZlclwifTtmdW5jdGlvbiBBZShhLGIpe3RoaXMuZj1PYyhcInA6cmVzdDpcIik7dGhpcy5IPWE7dGhpcy5HYj1iO3RoaXMuRmE9bnVsbDt0aGlzLmFhPXt9fWZ1bmN0aW9uIEJlKGEsYil7aWYobihiKSlyZXR1cm5cInRhZyRcIitiO3ZhciBjPWEubztKKGRlKGMpJiZjLmc9PU0sXCJzaG91bGQgaGF2ZSBhIHRhZyBpZiBpdCdzIG5vdCBhIGRlZmF1bHQgcXVlcnkuXCIpO3JldHVybiBhLnBhdGgudG9TdHJpbmcoKX1oPUFlLnByb3RvdHlwZTtcbmgueGY9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5wYXRoLnRvU3RyaW5nKCk7dGhpcy5mKFwiTGlzdGVuIGNhbGxlZCBmb3IgXCIrZStcIiBcIithLndhKCkpO3ZhciBmPUJlKGEsYyksZz17fTt0aGlzLmFhW2ZdPWc7YT1lZShhLm8pO3ZhciBrPXRoaXM7Q2UodGhpcyxlK1wiLmpzb25cIixhLGZ1bmN0aW9uKGEsYil7dmFyIHY9Yjs0MDQ9PT1hJiYoYT12PW51bGwpO251bGw9PT1hJiZrLkdiKGUsdiwhMSxjKTt3KGsuYWEsZik9PT1nJiZkKGE/NDAxPT1hP1wicGVybWlzc2lvbl9kZW5pZWRcIjpcInJlc3RfZXJyb3I6XCIrYTpcIm9rXCIsbnVsbCl9KX07aC5PZj1mdW5jdGlvbihhLGIpe3ZhciBjPUJlKGEsYik7ZGVsZXRlIHRoaXMuYWFbY119O2guUD1mdW5jdGlvbihhLGIpe3RoaXMuRmE9YTt2YXIgYz1hZChhKSxkPWMuZGF0YSxjPWMuQWMmJmMuQWMuZXhwO2ImJmIoXCJva1wiLHthdXRoOmQsZXhwaXJlczpjfSl9O2guZWU9ZnVuY3Rpb24oYSl7dGhpcy5GYT1udWxsO2EoXCJva1wiLG51bGwpfTtcbmguTGU9ZnVuY3Rpb24oKXt9O2guQmY9ZnVuY3Rpb24oKXt9O2guR2Q9ZnVuY3Rpb24oKXt9O2gucHV0PWZ1bmN0aW9uKCl7fTtoLnlmPWZ1bmN0aW9uKCl7fTtoLlRlPWZ1bmN0aW9uKCl7fTtcbmZ1bmN0aW9uIENlKGEsYixjLGQpe2M9Y3x8e307Yy5mb3JtYXQ9XCJleHBvcnRcIjthLkZhJiYoYy5hdXRoPWEuRmEpO3ZhciBlPShhLkgubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSthLkguaG9zdCtiK1wiP1wiK2piKGMpO2EuZihcIlNlbmRpbmcgUkVTVCByZXF1ZXN0IGZvciBcIitlKTt2YXIgZj1uZXcgWE1MSHR0cFJlcXVlc3Q7Zi5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihkJiY0PT09Zi5yZWFkeVN0YXRlKXthLmYoXCJSRVNUIFJlc3BvbnNlIGZvciBcIitlK1wiIHJlY2VpdmVkLiBzdGF0dXM6XCIsZi5zdGF0dXMsXCJyZXNwb25zZTpcIixmLnJlc3BvbnNlVGV4dCk7dmFyIGI9bnVsbDtpZigyMDA8PWYuc3RhdHVzJiYzMDA+Zi5zdGF0dXMpe3RyeXtiPW1iKGYucmVzcG9uc2VUZXh0KX1jYXRjaChjKXtRKFwiRmFpbGVkIHRvIHBhcnNlIEpTT04gcmVzcG9uc2UgZm9yIFwiK2UrXCI6IFwiK2YucmVzcG9uc2VUZXh0KX1kKG51bGwsYil9ZWxzZSA0MDEhPT1mLnN0YXR1cyYmNDA0IT09XG5mLnN0YXR1cyYmUShcIkdvdCB1bnN1Y2Nlc3NmdWwgUkVTVCByZXNwb25zZSBmb3IgXCIrZStcIiBTdGF0dXM6IFwiK2Yuc3RhdHVzKSxkKGYuc3RhdHVzKTtkPW51bGx9fTtmLm9wZW4oXCJHRVRcIixlLCEwKTtmLnNlbmQoKX07ZnVuY3Rpb24gRGUoYSxiKXt0aGlzLnZhbHVlPWE7dGhpcy5jaGlsZHJlbj1ifHxFZX12YXIgRWU9bmV3IGFjKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1iPzA6YTxiPy0xOjF9KTtmdW5jdGlvbiBGZShhKXt2YXIgYj1OZDtyKGEsZnVuY3Rpb24oYSxkKXtiPWIuc2V0KG5ldyBLKGQpLGEpfSk7cmV0dXJuIGJ9aD1EZS5wcm90b3R5cGU7aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PT10aGlzLnZhbHVlJiZ0aGlzLmNoaWxkcmVuLmUoKX07ZnVuY3Rpb24gR2UoYSxiLGMpe2lmKG51bGwhPWEudmFsdWUmJmMoYS52YWx1ZSkpcmV0dXJue3BhdGg6Rix2YWx1ZTphLnZhbHVlfTtpZihiLmUoKSlyZXR1cm4gbnVsbDt2YXIgZD1PKGIpO2E9YS5jaGlsZHJlbi5nZXQoZCk7cmV0dXJuIG51bGwhPT1hPyhiPUdlKGEsRyhiKSxjKSxudWxsIT1iP3twYXRoOihuZXcgSyhkKSkudyhiLnBhdGgpLHZhbHVlOmIudmFsdWV9Om51bGwpOm51bGx9XG5mdW5jdGlvbiBIZShhLGIpe3JldHVybiBHZShhLGIsZnVuY3Rpb24oKXtyZXR1cm4hMH0pfWguc3VidHJlZT1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gbnVsbCE9PWI/Yi5zdWJ0cmVlKEcoYSkpOk5kfTtoLnNldD1mdW5jdGlvbihhLGIpe2lmKGEuZSgpKXJldHVybiBuZXcgRGUoYix0aGlzLmNoaWxkcmVuKTt2YXIgYz1PKGEpLGQ9KHRoaXMuY2hpbGRyZW4uZ2V0KGMpfHxOZCkuc2V0KEcoYSksYiksYz10aGlzLmNoaWxkcmVuLk5hKGMsZCk7cmV0dXJuIG5ldyBEZSh0aGlzLnZhbHVlLGMpfTtcbmgucmVtb3ZlPWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiB0aGlzLmNoaWxkcmVuLmUoKT9OZDpuZXcgRGUobnVsbCx0aGlzLmNoaWxkcmVuKTt2YXIgYj1PKGEpLGM9dGhpcy5jaGlsZHJlbi5nZXQoYik7cmV0dXJuIGM/KGE9Yy5yZW1vdmUoRyhhKSksYj1hLmUoKT90aGlzLmNoaWxkcmVuLnJlbW92ZShiKTp0aGlzLmNoaWxkcmVuLk5hKGIsYSksbnVsbD09PXRoaXMudmFsdWUmJmIuZSgpP05kOm5ldyBEZSh0aGlzLnZhbHVlLGIpKTp0aGlzfTtoLmdldD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpcy52YWx1ZTt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gYj9iLmdldChHKGEpKTpudWxsfTtcbmZ1bmN0aW9uIE1kKGEsYixjKXtpZihiLmUoKSlyZXR1cm4gYzt2YXIgZD1PKGIpO2I9TWQoYS5jaGlsZHJlbi5nZXQoZCl8fE5kLEcoYiksYyk7ZD1iLmUoKT9hLmNoaWxkcmVuLnJlbW92ZShkKTphLmNoaWxkcmVuLk5hKGQsYik7cmV0dXJuIG5ldyBEZShhLnZhbHVlLGQpfWZ1bmN0aW9uIEllKGEsYil7cmV0dXJuIEplKGEsRixiKX1mdW5jdGlvbiBKZShhLGIsYyl7dmFyIGQ9e307YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGYpe2RbYV09SmUoZixiLncoYSksYyl9KTtyZXR1cm4gYyhiLGEudmFsdWUsZCl9ZnVuY3Rpb24gS2UoYSxiLGMpe3JldHVybiBMZShhLGIsRixjKX1mdW5jdGlvbiBMZShhLGIsYyxkKXt2YXIgZT1hLnZhbHVlP2QoYyxhLnZhbHVlKTohMTtpZihlKXJldHVybiBlO2lmKGIuZSgpKXJldHVybiBudWxsO2U9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TGUoYSxHKGIpLGMudyhlKSxkKTpudWxsfVxuZnVuY3Rpb24gTWUoYSxiLGMpe3ZhciBkPUY7aWYoIWIuZSgpKXt2YXIgZT0hMDthLnZhbHVlJiYoZT1jKGQsYS52YWx1ZSkpOyEwPT09ZSYmKGU9TyhiKSwoYT1hLmNoaWxkcmVuLmdldChlKSkmJk5lKGEsRyhiKSxkLncoZSksYykpfX1mdW5jdGlvbiBOZShhLGIsYyxkKXtpZihiLmUoKSlyZXR1cm4gYTthLnZhbHVlJiZkKGMsYS52YWx1ZSk7dmFyIGU9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TmUoYSxHKGIpLGMudyhlKSxkKTpOZH1mdW5jdGlvbiBLZChhLGIpe09lKGEsRixiKX1mdW5jdGlvbiBPZShhLGIsYyl7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGUpe09lKGUsYi53KGEpLGMpfSk7YS52YWx1ZSYmYyhiLGEudmFsdWUpfWZ1bmN0aW9uIFBlKGEsYil7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGQpe2QudmFsdWUmJmIoYSxkLnZhbHVlKX0pfXZhciBOZD1uZXcgRGUobnVsbCk7XG5EZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT17fTtLZCh0aGlzLGZ1bmN0aW9uKGIsYyl7YVtiLnRvU3RyaW5nKCldPWMudG9TdHJpbmcoKX0pO3JldHVybiBCKGEpfTtmdW5jdGlvbiBRZShhKXt0aGlzLlc9YX12YXIgUmU9bmV3IFFlKG5ldyBEZShudWxsKSk7ZnVuY3Rpb24gU2UoYSxiLGMpe2lmKGIuZSgpKXJldHVybiBuZXcgUWUobmV3IERlKGMpKTt2YXIgZD1IZShhLlcsYik7aWYobnVsbCE9ZCl7dmFyIGU9ZC5wYXRoLGQ9ZC52YWx1ZTtiPU4oZSxiKTtkPWQuRyhiLGMpO3JldHVybiBuZXcgUWUoYS5XLnNldChlLGQpKX1hPU1kKGEuVyxiLG5ldyBEZShjKSk7cmV0dXJuIG5ldyBRZShhKX1mdW5jdGlvbiBUZShhLGIsYyl7dmFyIGQ9YTtoYihjLGZ1bmN0aW9uKGEsYyl7ZD1TZShkLGIudyhhKSxjKX0pO3JldHVybiBkfVFlLnByb3RvdHlwZS5PZD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gUmU7YT1NZCh0aGlzLlcsYSxOZCk7cmV0dXJuIG5ldyBRZShhKX07ZnVuY3Rpb24gVWUoYSxiKXt2YXIgYz1IZShhLlcsYik7cmV0dXJuIG51bGwhPWM/YS5XLmdldChjLnBhdGgpLm9hKE4oYy5wYXRoLGIpKTpudWxsfVxuZnVuY3Rpb24gVmUoYSl7dmFyIGI9W10sYz1hLlcudmFsdWU7bnVsbCE9Yz9jLk4oKXx8Yy5VKE0sZnVuY3Rpb24oYSxjKXtiLnB1c2gobmV3IEUoYSxjKSl9KTphLlcuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxjKXtudWxsIT1jLnZhbHVlJiZiLnB1c2gobmV3IEUoYSxjLnZhbHVlKSl9KTtyZXR1cm4gYn1mdW5jdGlvbiBXZShhLGIpe2lmKGIuZSgpKXJldHVybiBhO3ZhciBjPVVlKGEsYik7cmV0dXJuIG51bGwhPWM/bmV3IFFlKG5ldyBEZShjKSk6bmV3IFFlKGEuVy5zdWJ0cmVlKGIpKX1RZS5wcm90b3R5cGUuZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlcuZSgpfTtRZS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oYSl7cmV0dXJuIFhlKEYsdGhpcy5XLGEpfTtcbmZ1bmN0aW9uIFhlKGEsYixjKXtpZihudWxsIT1iLnZhbHVlKXJldHVybiBjLkcoYSxiLnZhbHVlKTt2YXIgZD1udWxsO2IuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYixmKXtcIi5wcmlvcml0eVwiPT09Yj8oSihudWxsIT09Zi52YWx1ZSxcIlByaW9yaXR5IHdyaXRlcyBtdXN0IGFsd2F5cyBiZSBsZWFmIG5vZGVzXCIpLGQ9Zi52YWx1ZSk6Yz1YZShhLncoYiksZixjKX0pO2Mub2EoYSkuZSgpfHxudWxsPT09ZHx8KGM9Yy5HKGEudyhcIi5wcmlvcml0eVwiKSxkKSk7cmV0dXJuIGN9O2Z1bmN0aW9uIFllKCl7dGhpcy5UPVJlO3RoaXMuemE9W107dGhpcy5MYz0tMX1oPVllLnByb3RvdHlwZTtcbmguT2Q9ZnVuY3Rpb24oYSl7dmFyIGI9VWEodGhpcy56YSxmdW5jdGlvbihiKXtyZXR1cm4gYi5pZT09PWF9KTtKKDA8PWIsXCJyZW1vdmVXcml0ZSBjYWxsZWQgd2l0aCBub25leGlzdGVudCB3cml0ZUlkLlwiKTt2YXIgYz10aGlzLnphW2JdO3RoaXMuemEuc3BsaWNlKGIsMSk7Zm9yKHZhciBkPWMudmlzaWJsZSxlPSExLGY9dGhpcy56YS5sZW5ndGgtMTtkJiYwPD1mOyl7dmFyIGc9dGhpcy56YVtmXTtnLnZpc2libGUmJihmPj1iJiZaZShnLGMucGF0aCk/ZD0hMTpjLnBhdGguY29udGFpbnMoZy5wYXRoKSYmKGU9ITApKTtmLS19aWYoZCl7aWYoZSl0aGlzLlQ9JGUodGhpcy56YSxhZixGKSx0aGlzLkxjPTA8dGhpcy56YS5sZW5ndGg/dGhpcy56YVt0aGlzLnphLmxlbmd0aC0xXS5pZTotMTtlbHNlIGlmKGMuSWEpdGhpcy5UPXRoaXMuVC5PZChjLnBhdGgpO2Vsc2V7dmFyIGs9dGhpcztyKGMuY2hpbGRyZW4sZnVuY3Rpb24oYSxiKXtrLlQ9ay5ULk9kKGMucGF0aC53KGIpKX0pfXJldHVybiBjLnBhdGh9cmV0dXJuIG51bGx9O1xuaC51YT1mdW5jdGlvbihhLGIsYyxkKXtpZihjfHxkKXt2YXIgZT1XZSh0aGlzLlQsYSk7cmV0dXJuIWQmJmUuZSgpP2I6ZHx8bnVsbCE9Ynx8bnVsbCE9VWUoZSxGKT8oZT0kZSh0aGlzLnphLGZ1bmN0aW9uKGIpe3JldHVybihiLnZpc2libGV8fGQpJiYoIWN8fCEoMDw9TmEoYyxiLmllKSkpJiYoYi5wYXRoLmNvbnRhaW5zKGEpfHxhLmNvbnRhaW5zKGIucGF0aCkpfSxhKSxiPWJ8fEMsZS5hcHBseShiKSk6bnVsbH1lPVVlKHRoaXMuVCxhKTtpZihudWxsIT1lKXJldHVybiBlO2U9V2UodGhpcy5ULGEpO3JldHVybiBlLmUoKT9iOm51bGwhPWJ8fG51bGwhPVVlKGUsRik/KGI9Ynx8QyxlLmFwcGx5KGIpKTpudWxsfTtcbmgueGM9ZnVuY3Rpb24oYSxiKXt2YXIgYz1DLGQ9VWUodGhpcy5ULGEpO2lmKGQpZC5OKCl8fGQuVShNLGZ1bmN0aW9uKGEsYil7Yz1jLlEoYSxiKX0pO2Vsc2UgaWYoYil7dmFyIGU9V2UodGhpcy5ULGEpO2IuVShNLGZ1bmN0aW9uKGEsYil7dmFyIGQ9V2UoZSxuZXcgSyhhKSkuYXBwbHkoYik7Yz1jLlEoYSxkKX0pO09hKFZlKGUpLGZ1bmN0aW9uKGEpe2M9Yy5RKGEubmFtZSxhLlMpfSl9ZWxzZSBlPVdlKHRoaXMuVCxhKSxPYShWZShlKSxmdW5jdGlvbihhKXtjPWMuUShhLm5hbWUsYS5TKX0pO3JldHVybiBjfTtoLmhkPWZ1bmN0aW9uKGEsYixjLGQpe0ooY3x8ZCxcIkVpdGhlciBleGlzdGluZ0V2ZW50U25hcCBvciBleGlzdGluZ1NlcnZlclNuYXAgbXVzdCBleGlzdFwiKTthPWEudyhiKTtpZihudWxsIT1VZSh0aGlzLlQsYSkpcmV0dXJuIG51bGw7YT1XZSh0aGlzLlQsYSk7cmV0dXJuIGEuZSgpP2Qub2EoYik6YS5hcHBseShkLm9hKGIpKX07XG5oLlhhPWZ1bmN0aW9uKGEsYixjKXthPWEudyhiKTt2YXIgZD1VZSh0aGlzLlQsYSk7cmV0dXJuIG51bGwhPWQ/ZDpyYihjLGIpP1dlKHRoaXMuVCxhKS5hcHBseShjLmooKS5NKGIpKTpudWxsfTtoLnNjPWZ1bmN0aW9uKGEpe3JldHVybiBVZSh0aGlzLlQsYSl9O2gubWU9ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe3ZhciBnO2E9V2UodGhpcy5ULGEpO2c9VWUoYSxGKTtpZihudWxsPT1nKWlmKG51bGwhPWIpZz1hLmFwcGx5KGIpO2Vsc2UgcmV0dXJuW107Zz1nLm1iKGYpO2lmKGcuZSgpfHxnLk4oKSlyZXR1cm5bXTtiPVtdO2E9dWQoZik7ZT1lP2cuWmIoYyxmKTpnLlhiKGMsZik7Zm9yKGY9SChlKTtmJiZiLmxlbmd0aDxkOykwIT09YShmLGMpJiZiLnB1c2goZiksZj1IKGUpO3JldHVybiBifTtcbmZ1bmN0aW9uIFplKGEsYil7cmV0dXJuIGEuSWE/YS5wYXRoLmNvbnRhaW5zKGIpOiEhdWEoYS5jaGlsZHJlbixmdW5jdGlvbihjLGQpe3JldHVybiBhLnBhdGgudyhkKS5jb250YWlucyhiKX0pfWZ1bmN0aW9uIGFmKGEpe3JldHVybiBhLnZpc2libGV9XG5mdW5jdGlvbiAkZShhLGIsYyl7Zm9yKHZhciBkPVJlLGU9MDtlPGEubGVuZ3RoOysrZSl7dmFyIGY9YVtlXTtpZihiKGYpKXt2YXIgZz1mLnBhdGg7aWYoZi5JYSljLmNvbnRhaW5zKGcpPyhnPU4oYyxnKSxkPVNlKGQsZyxmLklhKSk6Zy5jb250YWlucyhjKSYmKGc9TihnLGMpLGQ9U2UoZCxGLGYuSWEub2EoZykpKTtlbHNlIGlmKGYuY2hpbGRyZW4paWYoYy5jb250YWlucyhnKSlnPU4oYyxnKSxkPVRlKGQsZyxmLmNoaWxkcmVuKTtlbHNle2lmKGcuY29udGFpbnMoYykpaWYoZz1OKGcsYyksZy5lKCkpZD1UZShkLEYsZi5jaGlsZHJlbik7ZWxzZSBpZihmPXcoZi5jaGlsZHJlbixPKGcpKSlmPWYub2EoRyhnKSksZD1TZShkLEYsZil9ZWxzZSB0aHJvdyBIYyhcIldyaXRlUmVjb3JkIHNob3VsZCBoYXZlIC5zbmFwIG9yIC5jaGlsZHJlblwiKTt9fXJldHVybiBkfWZ1bmN0aW9uIGJmKGEsYil7dGhpcy5NYj1hO3RoaXMuVz1ifWg9YmYucHJvdG90eXBlO1xuaC51YT1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHRoaXMuVy51YSh0aGlzLk1iLGEsYixjKX07aC54Yz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5XLnhjKHRoaXMuTWIsYSl9O2guaGQ9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLlcuaGQodGhpcy5NYixhLGIsYyl9O2guc2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuVy5zYyh0aGlzLk1iLncoYSkpfTtoLm1lPWZ1bmN0aW9uKGEsYixjLGQsZSl7cmV0dXJuIHRoaXMuVy5tZSh0aGlzLk1iLGEsYixjLGQsZSl9O2guWGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5XLlhhKHRoaXMuTWIsYSxiKX07aC53PWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYmYodGhpcy5NYi53KGEpLHRoaXMuVyl9O2Z1bmN0aW9uIGNmKCl7dGhpcy55YT17fX1oPWNmLnByb3RvdHlwZTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gd2EodGhpcy55YSl9O2guYmI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEuc291cmNlLkliO2lmKG51bGwhPT1kKXJldHVybiBkPXcodGhpcy55YSxkKSxKKG51bGwhPWQsXCJTeW5jVHJlZSBnYXZlIHVzIGFuIG9wIGZvciBhbiBpbnZhbGlkIHF1ZXJ5LlwiKSxkLmJiKGEsYixjKTt2YXIgZT1bXTtyKHRoaXMueWEsZnVuY3Rpb24oZCl7ZT1lLmNvbmNhdChkLmJiKGEsYixjKSl9KTtyZXR1cm4gZX07aC5PYj1mdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmPWEud2EoKSxnPXcodGhpcy55YSxmKTtpZighZyl7dmFyIGc9Yy51YShlP2Q6bnVsbCksaz0hMTtnP2s9ITA6KGc9ZCBpbnN0YW5jZW9mIFQ/Yy54YyhkKTpDLGs9ITEpO2c9bmV3IHRlKGEsbmV3IElkKG5ldyBzYihnLGssITEpLG5ldyBzYihkLGUsITEpKSk7dGhpcy55YVtmXT1nfWcuT2IoYik7cmV0dXJuIHdlKGcsYil9O1xuaC5rYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS53YSgpLGU9W10sZj1bXSxnPW51bGwhPWRmKHRoaXMpO2lmKFwiZGVmYXVsdFwiPT09ZCl7dmFyIGs9dGhpcztyKHRoaXMueWEsZnVuY3Rpb24oYSxkKXtmPWYuY29uY2F0KGEua2IoYixjKSk7YS5lKCkmJihkZWxldGUgay55YVtkXSxkZShhLlYubyl8fGUucHVzaChhLlYpKX0pfWVsc2V7dmFyIGw9dyh0aGlzLnlhLGQpO2wmJihmPWYuY29uY2F0KGwua2IoYixjKSksbC5lKCkmJihkZWxldGUgdGhpcy55YVtkXSxkZShsLlYubyl8fGUucHVzaChsLlYpKSl9ZyYmbnVsbD09ZGYodGhpcykmJmUucHVzaChuZXcgVShhLmssYS5wYXRoKSk7cmV0dXJue0hnOmUsamc6Zn19O2Z1bmN0aW9uIGVmKGEpe3JldHVybiBQYShyYShhLnlhKSxmdW5jdGlvbihhKXtyZXR1cm4hZGUoYS5WLm8pfSl9aC5oYj1mdW5jdGlvbihhKXt2YXIgYj1udWxsO3IodGhpcy55YSxmdW5jdGlvbihjKXtiPWJ8fGMuaGIoYSl9KTtyZXR1cm4gYn07XG5mdW5jdGlvbiBmZihhLGIpe2lmKGRlKGIubykpcmV0dXJuIGRmKGEpO3ZhciBjPWIud2EoKTtyZXR1cm4gdyhhLnlhLGMpfWZ1bmN0aW9uIGRmKGEpe3JldHVybiB2YShhLnlhLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLlYubyl9KXx8bnVsbH07ZnVuY3Rpb24gZ2YoYSl7dGhpcy5zYT1OZDt0aGlzLkhiPW5ldyBZZTt0aGlzLiRlPXt9O3RoaXMua2M9e307dGhpcy5NYz1hfWZ1bmN0aW9uIGhmKGEsYixjLGQsZSl7dmFyIGY9YS5IYixnPWU7SihkPmYuTGMsXCJTdGFja2luZyBhbiBvbGRlciB3cml0ZSBvbiB0b3Agb2YgbmV3ZXIgb25lc1wiKTtuKGcpfHwoZz0hMCk7Zi56YS5wdXNoKHtwYXRoOmIsSWE6YyxpZTpkLHZpc2libGU6Z30pO2cmJihmLlQ9U2UoZi5ULGIsYykpO2YuTGM9ZDtyZXR1cm4gZT9qZihhLG5ldyBVYihZYixiLGMpKTpbXX1mdW5jdGlvbiBrZihhLGIsYyxkKXt2YXIgZT1hLkhiO0ooZD5lLkxjLFwiU3RhY2tpbmcgYW4gb2xkZXIgbWVyZ2Ugb24gdG9wIG9mIG5ld2VyIG9uZXNcIik7ZS56YS5wdXNoKHtwYXRoOmIsY2hpbGRyZW46YyxpZTpkLHZpc2libGU6ITB9KTtlLlQ9VGUoZS5ULGIsYyk7ZS5MYz1kO2M9RmUoYyk7cmV0dXJuIGpmKGEsbmV3IHhlKFliLGIsYykpfVxuZnVuY3Rpb24gbGYoYSxiLGMpe2M9Y3x8ITE7Yj1hLkhiLk9kKGIpO3JldHVybiBudWxsPT1iP1tdOmpmKGEsbmV3IFdiKGIsYykpfWZ1bmN0aW9uIG1mKGEsYixjKXtjPUZlKGMpO3JldHVybiBqZihhLG5ldyB4ZSh6ZSxiLGMpKX1mdW5jdGlvbiBuZihhLGIsYyxkKXtkPW9mKGEsZCk7aWYobnVsbCE9ZCl7dmFyIGU9cGYoZCk7ZD1lLnBhdGg7ZT1lLkliO2I9TihkLGIpO2M9bmV3IFViKG5ldyB5ZSghMSwhMCxlLCEwKSxiLGMpO3JldHVybiBxZihhLGQsYyl9cmV0dXJuW119ZnVuY3Rpb24gcmYoYSxiLGMsZCl7aWYoZD1vZihhLGQpKXt2YXIgZT1wZihkKTtkPWUucGF0aDtlPWUuSWI7Yj1OKGQsYik7Yz1GZShjKTtjPW5ldyB4ZShuZXcgeWUoITEsITAsZSwhMCksYixjKTtyZXR1cm4gcWYoYSxkLGMpfXJldHVybltdfVxuZ2YucHJvdG90eXBlLk9iPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wYXRoLGQ9bnVsbCxlPSExO01lKHRoaXMuc2EsYyxmdW5jdGlvbihhLGIpe3ZhciBmPU4oYSxjKTtkPWIuaGIoZik7ZT1lfHxudWxsIT1kZihiKTtyZXR1cm4hZH0pO3ZhciBmPXRoaXMuc2EuZ2V0KGMpO2Y/KGU9ZXx8bnVsbCE9ZGYoZiksZD1kfHxmLmhiKEYpKTooZj1uZXcgY2YsdGhpcy5zYT10aGlzLnNhLnNldChjLGYpKTt2YXIgZztudWxsIT1kP2c9ITA6KGc9ITEsZD1DLFBlKHRoaXMuc2Euc3VidHJlZShjKSxmdW5jdGlvbihhLGIpe3ZhciBjPWIuaGIoRik7YyYmKGQ9ZC5RKGEsYykpfSkpO3ZhciBrPW51bGwhPWZmKGYsYSk7aWYoIWsmJiFkZShhLm8pKXt2YXIgbD1zZihhKTtKKCEobCBpbiB0aGlzLmtjKSxcIlZpZXcgZG9lcyBub3QgZXhpc3QsIGJ1dCB3ZSBoYXZlIGEgdGFnXCIpO3ZhciBtPXRmKys7dGhpcy5rY1tsXT1tO3RoaXMuJGVbXCJfXCIrbV09bH1nPWYuT2IoYSxiLG5ldyBiZihjLHRoaXMuSGIpLFxuZCxnKTtrfHxlfHwoZj1mZihmLGEpLGc9Zy5jb25jYXQodWYodGhpcyxhLGYpKSk7cmV0dXJuIGd9O1xuZ2YucHJvdG90eXBlLmtiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnBhdGgsZT10aGlzLnNhLmdldChkKSxmPVtdO2lmKGUmJihcImRlZmF1bHRcIj09PWEud2EoKXx8bnVsbCE9ZmYoZSxhKSkpe2Y9ZS5rYihhLGIsYyk7ZS5lKCkmJih0aGlzLnNhPXRoaXMuc2EucmVtb3ZlKGQpKTtlPWYuSGc7Zj1mLmpnO2I9LTEhPT1VYShlLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLm8pfSk7dmFyIGc9S2UodGhpcy5zYSxkLGZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWRmKGIpfSk7aWYoYiYmIWcmJihkPXRoaXMuc2Euc3VidHJlZShkKSwhZC5lKCkpKWZvcih2YXIgZD12ZihkKSxrPTA7azxkLmxlbmd0aDsrK2spe3ZhciBsPWRba10sbT1sLlYsbD13Zih0aGlzLGwpO3RoaXMuTWMuWGUobSx4Zih0aGlzLG0pLGwudWQsbC5KKX1pZighZyYmMDxlLmxlbmd0aCYmIWMpaWYoYil0aGlzLk1jLlpkKGEsbnVsbCk7ZWxzZXt2YXIgdj10aGlzO09hKGUsZnVuY3Rpb24oYSl7YS53YSgpO3ZhciBiPXYua2Nbc2YoYSldO1xudi5NYy5aZChhLGIpfSl9eWYodGhpcyxlKX1yZXR1cm4gZn07Z2YucHJvdG90eXBlLnVhPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5IYixkPUtlKHRoaXMuc2EsYSxmdW5jdGlvbihiLGMpe3ZhciBkPU4oYixhKTtpZihkPWMuaGIoZCkpcmV0dXJuIGR9KTtyZXR1cm4gYy51YShhLGQsYiwhMCl9O2Z1bmN0aW9uIHZmKGEpe3JldHVybiBJZShhLGZ1bmN0aW9uKGEsYyxkKXtpZihjJiZudWxsIT1kZihjKSlyZXR1cm5bZGYoYyldO3ZhciBlPVtdO2MmJihlPWVmKGMpKTtyKGQsZnVuY3Rpb24oYSl7ZT1lLmNvbmNhdChhKX0pO3JldHVybiBlfSl9ZnVuY3Rpb24geWYoYSxiKXtmb3IodmFyIGM9MDtjPGIubGVuZ3RoOysrYyl7dmFyIGQ9YltjXTtpZighZGUoZC5vKSl7dmFyIGQ9c2YoZCksZT1hLmtjW2RdO2RlbGV0ZSBhLmtjW2RdO2RlbGV0ZSBhLiRlW1wiX1wiK2VdfX19XG5mdW5jdGlvbiB1ZihhLGIsYyl7dmFyIGQ9Yi5wYXRoLGU9eGYoYSxiKTtjPXdmKGEsYyk7Yj1hLk1jLlhlKGIsZSxjLnVkLGMuSik7ZD1hLnNhLnN1YnRyZWUoZCk7aWYoZSlKKG51bGw9PWRmKGQudmFsdWUpLFwiSWYgd2UncmUgYWRkaW5nIGEgcXVlcnksIGl0IHNob3VsZG4ndCBiZSBzaGFkb3dlZFwiKTtlbHNlIGZvcihlPUllKGQsZnVuY3Rpb24oYSxiLGMpe2lmKCFhLmUoKSYmYiYmbnVsbCE9ZGYoYikpcmV0dXJuW3VlKGRmKGIpKV07dmFyIGQ9W107YiYmKGQ9ZC5jb25jYXQoUWEoZWYoYiksZnVuY3Rpb24oYSl7cmV0dXJuIGEuVn0pKSk7cihjLGZ1bmN0aW9uKGEpe2Q9ZC5jb25jYXQoYSl9KTtyZXR1cm4gZH0pLGQ9MDtkPGUubGVuZ3RoOysrZCljPWVbZF0sYS5NYy5aZChjLHhmKGEsYykpO3JldHVybiBifVxuZnVuY3Rpb24gd2YoYSxiKXt2YXIgYz1iLlYsZD14ZihhLGMpO3JldHVybnt1ZDpmdW5jdGlvbigpe3JldHVybihiLnUoKXx8QykuaGFzaCgpfSxKOmZ1bmN0aW9uKGIpe2lmKFwib2tcIj09PWIpe2lmKGQpe3ZhciBmPWMucGF0aDtpZihiPW9mKGEsZCkpe3ZhciBnPXBmKGIpO2I9Zy5wYXRoO2c9Zy5JYjtmPU4oYixmKTtmPW5ldyBaYihuZXcgeWUoITEsITAsZywhMCksZik7Yj1xZihhLGIsZil9ZWxzZSBiPVtdfWVsc2UgYj1qZihhLG5ldyBaYih6ZSxjLnBhdGgpKTtyZXR1cm4gYn1mPVwiVW5rbm93biBFcnJvclwiO1widG9vX2JpZ1wiPT09Yj9mPVwiVGhlIGRhdGEgcmVxdWVzdGVkIGV4Y2VlZHMgdGhlIG1heGltdW0gc2l6ZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGEgc2luZ2xlIHJlcXVlc3QuXCI6XCJwZXJtaXNzaW9uX2RlbmllZFwiPT1iP2Y9XCJDbGllbnQgZG9lc24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBkZXNpcmVkIGRhdGEuXCI6XCJ1bmF2YWlsYWJsZVwiPT1iJiZcbihmPVwiVGhlIHNlcnZpY2UgaXMgdW5hdmFpbGFibGVcIik7Zj1FcnJvcihiK1wiOiBcIitmKTtmLmNvZGU9Yi50b1VwcGVyQ2FzZSgpO3JldHVybiBhLmtiKGMsbnVsbCxmKX19fWZ1bmN0aW9uIHNmKGEpe3JldHVybiBhLnBhdGgudG9TdHJpbmcoKStcIiRcIithLndhKCl9ZnVuY3Rpb24gcGYoYSl7dmFyIGI9YS5pbmRleE9mKFwiJFwiKTtKKC0xIT09YiYmYjxhLmxlbmd0aC0xLFwiQmFkIHF1ZXJ5S2V5LlwiKTtyZXR1cm57SWI6YS5zdWJzdHIoYisxKSxwYXRoOm5ldyBLKGEuc3Vic3RyKDAsYikpfX1mdW5jdGlvbiBvZihhLGIpe3ZhciBjPWEuJGUsZD1cIl9cIitiO3JldHVybiBkIGluIGM/Y1tkXTp2b2lkIDB9ZnVuY3Rpb24geGYoYSxiKXt2YXIgYz1zZihiKTtyZXR1cm4gdyhhLmtjLGMpfXZhciB0Zj0xO1xuZnVuY3Rpb24gcWYoYSxiLGMpe3ZhciBkPWEuc2EuZ2V0KGIpO0ooZCxcIk1pc3Npbmcgc3luYyBwb2ludCBmb3IgcXVlcnkgdGFnIHRoYXQgd2UncmUgdHJhY2tpbmdcIik7cmV0dXJuIGQuYmIoYyxuZXcgYmYoYixhLkhiKSxudWxsKX1mdW5jdGlvbiBqZihhLGIpe3JldHVybiB6ZihhLGIsYS5zYSxudWxsLG5ldyBiZihGLGEuSGIpKX1mdW5jdGlvbiB6ZihhLGIsYyxkLGUpe2lmKGIucGF0aC5lKCkpcmV0dXJuIEFmKGEsYixjLGQsZSk7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W10saz1PKGIucGF0aCksbD1iLldjKGspO2lmKChjPWMuY2hpbGRyZW4uZ2V0KGspKSYmbCl2YXIgbT1kP2QuTShrKTpudWxsLGs9ZS53KGspLGc9Zy5jb25jYXQoemYoYSxsLGMsbSxrKSk7ZiYmKGc9Zy5jb25jYXQoZi5iYihiLGUsZCkpKTtyZXR1cm4gZ31cbmZ1bmN0aW9uIEFmKGEsYixjLGQsZSl7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W107Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGYpe3ZhciBtPWQ/ZC5NKGMpOm51bGwsdj1lLncoYykseT1iLldjKGMpO3kmJihnPWcuY29uY2F0KEFmKGEseSxmLG0sdikpKX0pO2YmJihnPWcuY29uY2F0KGYuYmIoYixlLGQpKSk7cmV0dXJuIGd9O2Z1bmN0aW9uIEJmKCl7dGhpcy5jaGlsZHJlbj17fTt0aGlzLmtkPTA7dGhpcy52YWx1ZT1udWxsfWZ1bmN0aW9uIENmKGEsYixjKXt0aGlzLkRkPWE/YTpcIlwiO3RoaXMuWWM9Yj9iOm51bGw7dGhpcy5CPWM/YzpuZXcgQmZ9ZnVuY3Rpb24gRGYoYSxiKXtmb3IodmFyIGM9YiBpbnN0YW5jZW9mIEs/YjpuZXcgSyhiKSxkPWEsZTtudWxsIT09KGU9TyhjKSk7KWQ9bmV3IENmKGUsZCx3KGQuQi5jaGlsZHJlbixlKXx8bmV3IEJmKSxjPUcoYyk7cmV0dXJuIGR9aD1DZi5wcm90b3R5cGU7aC5CYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkIudmFsdWV9O2Z1bmN0aW9uIEVmKGEsYil7SihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGIsXCJDYW5ub3Qgc2V0IHZhbHVlIHRvIHVuZGVmaW5lZFwiKTthLkIudmFsdWU9YjtGZihhKX1oLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5CLnZhbHVlPW51bGw7dGhpcy5CLmNoaWxkcmVuPXt9O3RoaXMuQi5rZD0wO0ZmKHRoaXMpfTtcbmgudGQ9ZnVuY3Rpb24oKXtyZXR1cm4gMDx0aGlzLkIua2R9O2guZT1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5CYSgpJiYhdGhpcy50ZCgpfTtoLlU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyKHRoaXMuQi5jaGlsZHJlbixmdW5jdGlvbihjLGQpe2EobmV3IENmKGQsYixjKSl9KX07ZnVuY3Rpb24gR2YoYSxiLGMsZCl7YyYmIWQmJmIoYSk7YS5VKGZ1bmN0aW9uKGEpe0dmKGEsYiwhMCxkKX0pO2MmJmQmJmIoYSl9ZnVuY3Rpb24gSGYoYSxiKXtmb3IodmFyIGM9YS5wYXJlbnQoKTtudWxsIT09YyYmIWIoYyk7KWM9Yy5wYXJlbnQoKX1oLnBhdGg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEsobnVsbD09PXRoaXMuWWM/dGhpcy5EZDp0aGlzLlljLnBhdGgoKStcIi9cIit0aGlzLkRkKX07aC5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRGR9O2gucGFyZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWWN9O1xuZnVuY3Rpb24gRmYoYSl7aWYobnVsbCE9PWEuWWMpe3ZhciBiPWEuWWMsYz1hLkRkLGQ9YS5lKCksZT11KGIuQi5jaGlsZHJlbixjKTtkJiZlPyhkZWxldGUgYi5CLmNoaWxkcmVuW2NdLGIuQi5rZC0tLEZmKGIpKTpkfHxlfHwoYi5CLmNoaWxkcmVuW2NdPWEuQixiLkIua2QrKyxGZihiKSl9fTtmdW5jdGlvbiBJZihhKXtKKGVhKGEpJiYwPGEubGVuZ3RoLFwiUmVxdWlyZXMgYSBub24tZW1wdHkgYXJyYXlcIik7dGhpcy5VZj1hO3RoaXMuTmM9e319SWYucHJvdG90eXBlLmRlPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPXRoaXMuTmNbYV18fFtdLGQ9MDtkPGMubGVuZ3RoO2QrKyljW2RdLnljLmFwcGx5KGNbZF0uTWEsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpKX07SWYucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjKXtKZih0aGlzLGEpO3RoaXMuTmNbYV09dGhpcy5OY1thXXx8W107dGhpcy5OY1thXS5wdXNoKHt5YzpiLE1hOmN9KTsoYT10aGlzLnplKGEpKSYmYi5hcHBseShjLGEpfTtJZi5wcm90b3R5cGUuZ2M9ZnVuY3Rpb24oYSxiLGMpe0pmKHRoaXMsYSk7YT10aGlzLk5jW2FdfHxbXTtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrKylpZihhW2RdLnljPT09YiYmKCFjfHxjPT09YVtkXS5NYSkpe2Euc3BsaWNlKGQsMSk7YnJlYWt9fTtcbmZ1bmN0aW9uIEpmKGEsYil7SihUYShhLlVmLGZ1bmN0aW9uKGEpe3JldHVybiBhPT09Yn0pLFwiVW5rbm93biBldmVudDogXCIrYil9O3ZhciBLZj1mdW5jdGlvbigpe3ZhciBhPTAsYj1bXTtyZXR1cm4gZnVuY3Rpb24oYyl7dmFyIGQ9Yz09PWE7YT1jO2Zvcih2YXIgZT1BcnJheSg4KSxmPTc7MDw9ZjtmLS0pZVtmXT1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYyU2NCksYz1NYXRoLmZsb29yKGMvNjQpO0ooMD09PWMsXCJDYW5ub3QgcHVzaCBhdCB0aW1lID09IDBcIik7Yz1lLmpvaW4oXCJcIik7aWYoZCl7Zm9yKGY9MTE7MDw9ZiYmNjM9PT1iW2ZdO2YtLSliW2ZdPTA7YltmXSsrfWVsc2UgZm9yKGY9MDsxMj5mO2YrKyliW2ZdPU1hdGguZmxvb3IoNjQqTWF0aC5yYW5kb20oKSk7Zm9yKGY9MDsxMj5mO2YrKyljKz1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYltmXSk7SigyMD09PWMubGVuZ3RoLFwibmV4dFB1c2hJZDogTGVuZ3RoIHNob3VsZCBiZSAyMC5cIik7XG5yZXR1cm4gY319KCk7ZnVuY3Rpb24gTGYoKXtJZi5jYWxsKHRoaXMsW1wib25saW5lXCJdKTt0aGlzLmljPSEwO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXt2YXIgYT10aGlzO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib25saW5lXCIsZnVuY3Rpb24oKXthLmljfHwoYS5pYz0hMCxhLmRlKFwib25saW5lXCIsITApKX0sITEpO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib2ZmbGluZVwiLGZ1bmN0aW9uKCl7YS5pYyYmKGEuaWM9ITEsYS5kZShcIm9ubGluZVwiLCExKSl9LCExKX19bWEoTGYsSWYpO0xmLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwib25saW5lXCI9PT1hLFwiVW5rbm93biBldmVudCB0eXBlOiBcIithKTtyZXR1cm5bdGhpcy5pY119O2NhKExmKTtmdW5jdGlvbiBNZigpe0lmLmNhbGwodGhpcyxbXCJ2aXNpYmxlXCJdKTt2YXIgYSxiO1widW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciYmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuaGlkZGVuPyhiPVwidmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJoaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4/KGI9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1vekhpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuPyhiPVwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1zSGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuJiYoYj1cIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIixhPVwid2Via2l0SGlkZGVuXCIpKTt0aGlzLnVjPSEwO2lmKGIpe3ZhciBjPXRoaXM7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihiLFxuZnVuY3Rpb24oKXt2YXIgYj0hZG9jdW1lbnRbYV07YiE9PWMudWMmJihjLnVjPWIsYy5kZShcInZpc2libGVcIixiKSl9LCExKX19bWEoTWYsSWYpO01mLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwidmlzaWJsZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMudWNdfTtjYShNZik7dmFyIE5mPS9bXFxbXFxdLiMkXFwvXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vLE9mPS9bXFxbXFxdLiMkXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vO2Z1bmN0aW9uIFBmKGEpe3JldHVybiBwKGEpJiYwIT09YS5sZW5ndGgmJiFOZi50ZXN0KGEpfWZ1bmN0aW9uIFFmKGEpe3JldHVybiBudWxsPT09YXx8cChhKXx8Z2EoYSkmJiFTYyhhKXx8aWEoYSkmJnUoYSxcIi5zdlwiKX1mdW5jdGlvbiBSZihhLGIsYyxkKXtkJiYhbihiKXx8U2YoeihhLDEsZCksYixjKX1cbmZ1bmN0aW9uIFNmKGEsYixjKXtjIGluc3RhbmNlb2YgSyYmKGM9bmV3IHdjKGMsYSkpO2lmKCFuKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyB1bmRlZmluZWQgXCIremMoYykpO2lmKGhhKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIGZ1bmN0aW9uIFwiK3pjKGMpK1wiIHdpdGggY29udGVudHM6IFwiK2IudG9TdHJpbmcoKSk7aWYoU2MoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIFwiK2IudG9TdHJpbmcoKStcIiBcIit6YyhjKSk7aWYocChiKSYmYi5sZW5ndGg+MTA0ODU3NjAvMyYmMTA0ODU3NjA8eGMoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIGEgc3RyaW5nIGdyZWF0ZXIgdGhhbiAxMDQ4NTc2MCB1dGY4IGJ5dGVzIFwiK3pjKGMpK1wiICgnXCIrYi5zdWJzdHJpbmcoMCw1MCkrXCIuLi4nKVwiKTtpZihpYShiKSl7dmFyIGQ9ITEsZT0hMTtoYihiLGZ1bmN0aW9uKGIsZyl7aWYoXCIudmFsdWVcIj09PWIpZD0hMDtlbHNlIGlmKFwiLnByaW9yaXR5XCIhPT1iJiZcIi5zdlwiIT09YiYmKGU9XG4hMCwhUGYoYikpKXRocm93IEVycm9yKGErXCIgY29udGFpbnMgYW4gaW52YWxpZCBrZXkgKFwiK2IrXCIpIFwiK3pjKGMpKycuICBLZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiJyk7Yy5wdXNoKGIpO1NmKGEsZyxjKTtjLnBvcCgpfSk7aWYoZCYmZSl0aHJvdyBFcnJvcihhKycgY29udGFpbnMgXCIudmFsdWVcIiBjaGlsZCAnK3pjKGMpK1wiIGluIGFkZGl0aW9uIHRvIGFjdHVhbCBjaGlsZHJlbi5cIik7fX1cbmZ1bmN0aW9uIFRmKGEsYixjKXtpZighaWEoYil8fGVhKGIpKXRocm93IEVycm9yKHooYSwxLCExKStcIiBtdXN0IGJlIGFuIE9iamVjdCBjb250YWluaW5nIHRoZSBjaGlsZHJlbiB0byByZXBsYWNlLlwiKTtpZih1KGIsXCIudmFsdWVcIikpdGhyb3cgRXJyb3IoeihhLDEsITEpKycgbXVzdCBub3QgY29udGFpbiBcIi52YWx1ZVwiLiAgVG8gb3ZlcndyaXRlIHdpdGggYSBsZWFmIHZhbHVlLCBqdXN0IHVzZSAuc2V0KCkgaW5zdGVhZC4nKTtSZihhLGIsYywhMSl9XG5mdW5jdGlvbiBVZihhLGIsYyl7aWYoU2MoYykpdGhyb3cgRXJyb3IoeihhLGIsITEpK1wiaXMgXCIrYy50b1N0cmluZygpK1wiLCBidXQgbXVzdCBiZSBhIHZhbGlkIEZpcmViYXNlIHByaW9yaXR5IChhIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsKS5cIik7aWYoIVFmKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbCkuXCIpO31cbmZ1bmN0aW9uIFZmKGEsYixjKXtpZighY3x8bihiKSlzd2l0Y2goYil7Y2FzZSBcInZhbHVlXCI6Y2FzZSBcImNoaWxkX2FkZGVkXCI6Y2FzZSBcImNoaWxkX3JlbW92ZWRcIjpjYXNlIFwiY2hpbGRfY2hhbmdlZFwiOmNhc2UgXCJjaGlsZF9tb3ZlZFwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoeihhLDEsYykrJ211c3QgYmUgYSB2YWxpZCBldmVudCB0eXBlOiBcInZhbHVlXCIsIFwiY2hpbGRfYWRkZWRcIiwgXCJjaGlsZF9yZW1vdmVkXCIsIFwiY2hpbGRfY2hhbmdlZFwiLCBvciBcImNoaWxkX21vdmVkXCIuJyk7fX1mdW5jdGlvbiBXZihhLGIsYyxkKXtpZigoIWR8fG4oYykpJiYhUGYoYykpdGhyb3cgRXJyb3IoeihhLGIsZCkrJ3dhcyBhbiBpbnZhbGlkIGtleTogXCInK2MrJ1wiLiAgRmlyZWJhc2Uga2V5cyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCIvXCIsIFwiW1wiLCBvciBcIl1cIikuJyk7fVxuZnVuY3Rpb24gWGYoYSxiKXtpZighcChiKXx8MD09PWIubGVuZ3RofHxPZi50ZXN0KGIpKXRocm93IEVycm9yKHooYSwxLCExKSsnd2FzIGFuIGludmFsaWQgcGF0aDogXCInK2IrJ1wiLiBQYXRocyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCJbXCIsIG9yIFwiXVwiJyk7fWZ1bmN0aW9uIFlmKGEsYil7aWYoXCIuaW5mb1wiPT09TyhiKSl0aHJvdyBFcnJvcihhK1wiIGZhaWxlZDogQ2FuJ3QgbW9kaWZ5IGRhdGEgdW5kZXIgLy5pbmZvL1wiKTt9ZnVuY3Rpb24gWmYoYSxiKXtpZighcChiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgY3JlZGVudGlhbCAoYSBzdHJpbmcpLlwiKTt9ZnVuY3Rpb24gJGYoYSxiLGMpe2lmKCFwKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBzdHJpbmcuXCIpO31cbmZ1bmN0aW9uIGFnKGEsYixjLGQpe2lmKCFkfHxuKGMpKWlmKCFpYShjKXx8bnVsbD09PWMpdGhyb3cgRXJyb3IoeihhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgb2JqZWN0LlwiKTt9ZnVuY3Rpb24gYmcoYSxiLGMpe2lmKCFpYShiKXx8bnVsbD09PWJ8fCF1KGIsYykpdGhyb3cgRXJyb3IoeihhLDEsITEpKydtdXN0IGNvbnRhaW4gdGhlIGtleSBcIicrYysnXCInKTtpZighcCh3KGIsYykpKXRocm93IEVycm9yKHooYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiIHdpdGggdHlwZSBcInN0cmluZ1wiJyk7fTtmdW5jdGlvbiBjZygpe3RoaXMuc2V0PXt9fWg9Y2cucHJvdG90eXBlO2guYWRkPWZ1bmN0aW9uKGEsYil7dGhpcy5zZXRbYV09bnVsbCE9PWI/YjohMH07aC5jb250YWlucz1mdW5jdGlvbihhKXtyZXR1cm4gdSh0aGlzLnNldCxhKX07aC5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY29udGFpbnMoYSk/dGhpcy5zZXRbYV06dm9pZCAwfTtoLnJlbW92ZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy5zZXRbYV19O2guY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLnNldD17fX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHdhKHRoaXMuc2V0KX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiBwYSh0aGlzLnNldCl9O2Z1bmN0aW9uIGRnKGEsYil7cihhLnNldCxmdW5jdGlvbihhLGQpe2IoZCxhKX0pfWgua2V5cz1mdW5jdGlvbigpe3ZhciBhPVtdO3IodGhpcy5zZXQsZnVuY3Rpb24oYixjKXthLnB1c2goYyl9KTtyZXR1cm4gYX07ZnVuY3Rpb24gcWMoKXt0aGlzLm09dGhpcy5DPW51bGx9cWMucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oYSl7aWYobnVsbCE9dGhpcy5DKXJldHVybiB0aGlzLkMub2EoYSk7aWYoYS5lKCl8fG51bGw9PXRoaXMubSlyZXR1cm4gbnVsbDt2YXIgYj1PKGEpO2E9RyhhKTtyZXR1cm4gdGhpcy5tLmNvbnRhaW5zKGIpP3RoaXMubS5nZXQoYikuZmluZChhKTpudWxsfTtxYy5wcm90b3R5cGUubWM9ZnVuY3Rpb24oYSxiKXtpZihhLmUoKSl0aGlzLkM9Yix0aGlzLm09bnVsbDtlbHNlIGlmKG51bGwhPT10aGlzLkMpdGhpcy5DPXRoaXMuQy5HKGEsYik7ZWxzZXtudWxsPT10aGlzLm0mJih0aGlzLm09bmV3IGNnKTt2YXIgYz1PKGEpO3RoaXMubS5jb250YWlucyhjKXx8dGhpcy5tLmFkZChjLG5ldyBxYyk7Yz10aGlzLm0uZ2V0KGMpO2E9RyhhKTtjLm1jKGEsYil9fTtcbmZ1bmN0aW9uIGVnKGEsYil7aWYoYi5lKCkpcmV0dXJuIGEuQz1udWxsLGEubT1udWxsLCEwO2lmKG51bGwhPT1hLkMpe2lmKGEuQy5OKCkpcmV0dXJuITE7dmFyIGM9YS5DO2EuQz1udWxsO2MuVShNLGZ1bmN0aW9uKGIsYyl7YS5tYyhuZXcgSyhiKSxjKX0pO3JldHVybiBlZyhhLGIpfXJldHVybiBudWxsIT09YS5tPyhjPU8oYiksYj1HKGIpLGEubS5jb250YWlucyhjKSYmZWcoYS5tLmdldChjKSxiKSYmYS5tLnJlbW92ZShjKSxhLm0uZSgpPyhhLm09bnVsbCwhMCk6ITEpOiEwfWZ1bmN0aW9uIHJjKGEsYixjKXtudWxsIT09YS5DP2MoYixhLkMpOmEuVShmdW5jdGlvbihhLGUpe3ZhciBmPW5ldyBLKGIudG9TdHJpbmcoKStcIi9cIithKTtyYyhlLGYsYyl9KX1xYy5wcm90b3R5cGUuVT1mdW5jdGlvbihhKXtudWxsIT09dGhpcy5tJiZkZyh0aGlzLm0sZnVuY3Rpb24oYixjKXthKGIsYyl9KX07dmFyIGZnPVwiYXV0aC5maXJlYmFzZS5jb21cIjtmdW5jdGlvbiBnZyhhLGIsYyl7dGhpcy5sZD1hfHx7fTt0aGlzLmNlPWJ8fHt9O3RoaXMuYWI9Y3x8e307dGhpcy5sZC5yZW1lbWJlcnx8KHRoaXMubGQucmVtZW1iZXI9XCJkZWZhdWx0XCIpfXZhciBoZz1bXCJyZW1lbWJlclwiLFwicmVkaXJlY3RUb1wiXTtmdW5jdGlvbiBpZyhhKXt2YXIgYj17fSxjPXt9O2hiKGF8fHt9LGZ1bmN0aW9uKGEsZSl7MDw9TmEoaGcsYSk/YlthXT1lOmNbYV09ZX0pO3JldHVybiBuZXcgZ2coYix7fSxjKX07ZnVuY3Rpb24gamcoYSxiKXt0aGlzLlBlPVtcInNlc3Npb25cIixhLkxkLGEuQ2JdLmpvaW4oXCI6XCIpO3RoaXMuJGQ9Yn1qZy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7aWYoIWIpaWYodGhpcy4kZC5sZW5ndGgpYj10aGlzLiRkWzBdO2Vsc2UgdGhyb3cgRXJyb3IoXCJmYi5sb2dpbi5TZXNzaW9uTWFuYWdlciA6IE5vIHN0b3JhZ2Ugb3B0aW9ucyBhdmFpbGFibGUhXCIpO2Iuc2V0KHRoaXMuUGUsYSl9O2pnLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT1RYSh0aGlzLiRkLHEodGhpcy5uZyx0aGlzKSksYT1QYShhLGZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09YX0pO1hhKGEsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYmQoYy50b2tlbiktYmQoYS50b2tlbil9KTtyZXR1cm4gMDxhLmxlbmd0aD9hLnNoaWZ0KCk6bnVsbH07amcucHJvdG90eXBlLm5nPWZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1hLmdldCh0aGlzLlBlKTtpZihiJiZiLnRva2VuKXJldHVybiBifWNhdGNoKGMpe31yZXR1cm4gbnVsbH07XG5qZy5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO09hKHRoaXMuJGQsZnVuY3Rpb24oYil7Yi5yZW1vdmUoYS5QZSl9KX07ZnVuY3Rpb24ga2coKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmISEod2luZG93LmNvcmRvdmF8fHdpbmRvdy5waG9uZWdhcHx8d2luZG93LlBob25lR2FwKSYmL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9ZnVuY3Rpb24gbGcoKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiYvXmZpbGU6XFwvLy50ZXN0KGxvY2F0aW9uLmhyZWYpfVxuZnVuY3Rpb24gbWcoKXtpZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIG5hdmlnYXRvcilyZXR1cm4hMTt2YXIgYT1uYXZpZ2F0b3IudXNlckFnZW50O2lmKFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI9PT1uYXZpZ2F0b3IuYXBwTmFtZSl7aWYoKGE9YS5tYXRjaCgvTVNJRSAoWzAtOV17MSx9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKX1lbHNlIGlmKC0xPGEuaW5kZXhPZihcIlRyaWRlbnRcIikmJihhPWEubWF0Y2goL3J2OihbMC05XXsyLDJ9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKTtyZXR1cm4hMX07ZnVuY3Rpb24gbmcoKXt2YXIgYT13aW5kb3cub3BlbmVyLmZyYW1lcyxiO2ZvcihiPWEubGVuZ3RoLTE7MDw9YjtiLS0pdHJ5e2lmKGFbYl0ubG9jYXRpb24ucHJvdG9jb2w9PT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJmFbYl0ubG9jYXRpb24uaG9zdD09PXdpbmRvdy5sb2NhdGlvbi5ob3N0JiZcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiPT09YVtiXS5uYW1lKXJldHVybiBhW2JdfWNhdGNoKGMpe31yZXR1cm4gbnVsbH1mdW5jdGlvbiBvZyhhLGIsYyl7YS5hdHRhY2hFdmVudD9hLmF0dGFjaEV2ZW50KFwib25cIitiLGMpOmEuYWRkRXZlbnRMaXN0ZW5lciYmYS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9ZnVuY3Rpb24gcGcoYSxiLGMpe2EuZGV0YWNoRXZlbnQ/YS5kZXRhY2hFdmVudChcIm9uXCIrYixjKTphLnJlbW92ZUV2ZW50TGlzdGVuZXImJmEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfVxuZnVuY3Rpb24gcWcoYSl7L15odHRwcz86XFwvXFwvLy50ZXN0KGEpfHwoYT13aW5kb3cubG9jYXRpb24uaHJlZik7dmFyIGI9L14oaHR0cHM/OlxcL1xcL1tcXC1fYS16QS1aXFwuMC05Ol0rKS8uZXhlYyhhKTtyZXR1cm4gYj9iWzFdOmF9ZnVuY3Rpb24gcmcoYSl7dmFyIGI9XCJcIjt0cnl7YT1hLnJlcGxhY2UoXCIjXCIsXCJcIik7dmFyIGM9a2IoYSk7YyYmdShjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSYmKGI9dyhjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSl9Y2F0Y2goZCl7fXJldHVybiBifWZ1bmN0aW9uIHNnKCl7dmFyIGE9UmMoZmcpO3JldHVybiBhLnNjaGVtZStcIjovL1wiK2EuaG9zdCtcIi92MlwifWZ1bmN0aW9uIHRnKGEpe3JldHVybiBzZygpK1wiL1wiK2ErXCIvYXV0aC9jaGFubmVsXCJ9O2Z1bmN0aW9uIHVnKGEpe3ZhciBiPXRoaXM7dGhpcy56Yz1hO3RoaXMuYWU9XCIqXCI7bWcoKT90aGlzLlFjPXRoaXMud2Q9bmcoKToodGhpcy5RYz13aW5kb3cub3BlbmVyLHRoaXMud2Q9d2luZG93KTtpZighYi5RYyl0aHJvd1wiVW5hYmxlIHRvIGZpbmQgcmVsYXkgZnJhbWVcIjtvZyh0aGlzLndkLFwibWVzc2FnZVwiLHEodGhpcy5oYyx0aGlzKSk7b2codGhpcy53ZCxcIm1lc3NhZ2VcIixxKHRoaXMuQWYsdGhpcykpO3RyeXt2Zyh0aGlzLHthOlwicmVhZHlcIn0pfWNhdGNoKGMpe29nKHRoaXMuUWMsXCJsb2FkXCIsZnVuY3Rpb24oKXt2ZyhiLHthOlwicmVhZHlcIn0pfSl9b2cod2luZG93LFwidW5sb2FkXCIscSh0aGlzLnlnLHRoaXMpKX1mdW5jdGlvbiB2ZyhhLGIpe2I9QihiKTttZygpP2EuUWMuZG9Qb3N0KGIsYS5hZSk6YS5RYy5wb3N0TWVzc2FnZShiLGEuYWUpfVxudWcucHJvdG90eXBlLmhjPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYzt0cnl7Yz1tYihhLmRhdGEpfWNhdGNoKGQpe31jJiZcInJlcXVlc3RcIj09PWMuYSYmKHBnKHdpbmRvdyxcIm1lc3NhZ2VcIix0aGlzLmhjKSx0aGlzLmFlPWEub3JpZ2luLHRoaXMuemMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLnpjKGIuYWUsYy5kLGZ1bmN0aW9uKGEsYyl7Yi5hZz0hYztiLnpjPXZvaWQgMDt2ZyhiLHthOlwicmVzcG9uc2VcIixkOmEsZm9yY2VLZWVwV2luZG93T3BlbjpjfSl9KX0sMCkpfTt1Zy5wcm90b3R5cGUueWc9ZnVuY3Rpb24oKXt0cnl7cGcodGhpcy53ZCxcIm1lc3NhZ2VcIix0aGlzLkFmKX1jYXRjaChhKXt9dGhpcy56YyYmKHZnKHRoaXMse2E6XCJlcnJvclwiLGQ6XCJ1bmtub3duIGNsb3NlZCB3aW5kb3dcIn0pLHRoaXMuemM9dm9pZCAwKTt0cnl7d2luZG93LmNsb3NlKCl9Y2F0Y2goYil7fX07dWcucHJvdG90eXBlLkFmPWZ1bmN0aW9uKGEpe2lmKHRoaXMuYWcmJlwiZGllXCI9PT1hLmRhdGEpdHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O2Z1bmN0aW9uIHdnKGEpe3RoaXMub2M9R2EoKStHYSgpK0dhKCk7dGhpcy5EZj1hfXdnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7Yi5yZXF1ZXN0SWQ9dGhpcy5vYztiLnJlZGlyZWN0VG89Yi5yZWRpcmVjdFRvfHx3aW5kb3cubG9jYXRpb24uaHJlZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt3aW5kb3cubG9jYXRpb249YX07d2cuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hbGcoKSYmIWtnKCl9O3dnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07dmFyIHhnPXtORVRXT1JLX0VSUk9SOlwiVW5hYmxlIHRvIGNvbnRhY3QgdGhlIEZpcmViYXNlIHNlcnZlci5cIixTRVJWRVJfRVJST1I6XCJBbiB1bmtub3duIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIixUUkFOU1BPUlRfVU5BVkFJTEFCTEU6XCJUaGVyZSBhcmUgbm8gbG9naW4gdHJhbnNwb3J0cyBhdmFpbGFibGUgZm9yIHRoZSByZXF1ZXN0ZWQgbWV0aG9kLlwiLFJFUVVFU1RfSU5URVJSVVBURUQ6XCJUaGUgYnJvd3NlciByZWRpcmVjdGVkIHRoZSBwYWdlIGJlZm9yZSB0aGUgbG9naW4gcmVxdWVzdCBjb3VsZCBjb21wbGV0ZS5cIixVU0VSX0NBTkNFTExFRDpcIlRoZSB1c2VyIGNhbmNlbGxlZCBhdXRoZW50aWNhdGlvbi5cIn07ZnVuY3Rpb24geWcoYSl7dmFyIGI9RXJyb3Iodyh4ZyxhKSxhKTtiLmNvZGU9YTtyZXR1cm4gYn07ZnVuY3Rpb24gemcoYSl7aWYoIWEud2luZG93X2ZlYXR1cmVzfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmVubmVjL1wiKXx8LTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94L1wiKSYmLTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpKSlhLndpbmRvd19mZWF0dXJlcz12b2lkIDA7YS53aW5kb3dfbmFtZXx8KGEud2luZG93X25hbWU9XCJfYmxhbmtcIik7dGhpcy5vcHRpb25zPWF9XG56Zy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChhKXtnJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChnKSxnPXZvaWQgMCk7diYmKHY9Y2xlYXJJbnRlcnZhbCh2KSk7cGcod2luZG93LFwibWVzc2FnZVwiLGUpO3BnKHdpbmRvdyxcInVubG9hZFwiLGQpO2lmKG0mJiFhKXRyeXttLmNsb3NlKCl9Y2F0Y2goYil7ay5wb3N0TWVzc2FnZShcImRpZVwiLGwpfW09az12b2lkIDB9ZnVuY3Rpb24gZShhKXtpZihhLm9yaWdpbj09PWwpdHJ5e3ZhciBiPW1iKGEuZGF0YSk7XCJyZWFkeVwiPT09Yi5hP2sucG9zdE1lc3NhZ2UoeSxsKTpcImVycm9yXCI9PT1iLmE/KGQoITEpLGMmJihjKGIuZCksYz1udWxsKSk6XCJyZXNwb25zZVwiPT09Yi5hJiYoZChiLmZvcmNlS2VlcFdpbmRvd09wZW4pLGMmJihjKG51bGwsYi5kKSxjPW51bGwpKX1jYXRjaChlKXt9fXZhciBmPW1nKCksZyxrO2lmKCF0aGlzLm9wdGlvbnMucmVsYXlfdXJsKXJldHVybiBjKEVycm9yKFwiaW52YWxpZCBhcmd1bWVudHM6IG9yaWdpbiBvZiB1cmwgYW5kIHJlbGF5X3VybCBtdXN0IG1hdGNoXCIpKTtcbnZhciBsPXFnKGEpO2lmKGwhPT1xZyh0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSljJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YyhFcnJvcihcImludmFsaWQgYXJndW1lbnRzOiBvcmlnaW4gb2YgdXJsIGFuZCByZWxheV91cmwgbXVzdCBtYXRjaFwiKSl9LDApO2Vsc2V7ZiYmKGc9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxnLnNldEF0dHJpYnV0ZShcInNyY1wiLHRoaXMub3B0aW9ucy5yZWxheV91cmwpLGcuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixnLnNldEF0dHJpYnV0ZShcIm5hbWVcIixcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGcpLGs9Zy5jb250ZW50V2luZG93KTthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt2YXIgbT13aW5kb3cub3BlbihhLHRoaXMub3B0aW9ucy53aW5kb3dfbmFtZSx0aGlzLm9wdGlvbnMud2luZG93X2ZlYXR1cmVzKTtrfHwoaz1tKTt2YXIgdj1zZXRJbnRlcnZhbChmdW5jdGlvbigpe20mJm0uY2xvc2VkJiZcbihkKCExKSxjJiYoYyh5ZyhcIlVTRVJfQ0FOQ0VMTEVEXCIpKSxjPW51bGwpKX0sNTAwKSx5PUIoe2E6XCJyZXF1ZXN0XCIsZDpifSk7b2cod2luZG93LFwidW5sb2FkXCIsZCk7b2cod2luZG93LFwibWVzc2FnZVwiLGUpfX07XG56Zy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVyblwicG9zdE1lc3NhZ2VcImluIHdpbmRvdyYmIWxnKCkmJiEoa2coKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lLyl8fHdpbmRvdy5XaW5kb3dzJiYvXm1zLWFwcHg6Ly50ZXN0KGxvY2F0aW9uLmhyZWYpKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGlQaG9uZXxpUG9kfGlQYWQpLipBcHBsZVdlYktpdCg/IS4qU2FmYXJpKS9pKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQ3JpT1MvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHdpdHRlciBmb3IgaVBob25lLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0ZCQU5cXC9GQklPUy8pfHx3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSYmIShcInVuZGVmaW5lZFwiIT09XG50eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9QaGFudG9tSlMvKSl9O3pnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicG9wdXBcIn07ZnVuY3Rpb24gQWcoYSl7YS5tZXRob2R8fChhLm1ldGhvZD1cIkdFVFwiKTthLmhlYWRlcnN8fChhLmhlYWRlcnM9e30pO2EuaGVhZGVycy5jb250ZW50X3R5cGV8fChhLmhlYWRlcnMuY29udGVudF90eXBlPVwiYXBwbGljYXRpb24vanNvblwiKTthLmhlYWRlcnMuY29udGVudF90eXBlPWEuaGVhZGVycy5jb250ZW50X3R5cGUudG9Mb3dlckNhc2UoKTt0aGlzLm9wdGlvbnM9YX1cbkFnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoeWcoXCJSRVFVRVNUX0lOVEVSUlVQVEVEXCIpKSxjPW51bGwpfXZhciBlPW5ldyBYTUxIdHRwUmVxdWVzdCxmPXRoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKSxnO29nKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpO2Uub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoYyYmND09PWUucmVhZHlTdGF0ZSl7dmFyIGE7aWYoMjAwPD1lLnN0YXR1cyYmMzAwPmUuc3RhdHVzKXt0cnl7YT1tYihlLnJlc3BvbnNlVGV4dCl9Y2F0Y2goYil7fWMobnVsbCxhKX1lbHNlIDUwMDw9ZS5zdGF0dXMmJjYwMD5lLnN0YXR1cz9jKHlnKFwiU0VSVkVSX0VSUk9SXCIpKTpjKHlnKFwiTkVUV09SS19FUlJPUlwiKSk7Yz1udWxsO3BnKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfX07aWYoXCJHRVRcIj09PWYpYSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYiksZz1udWxsO2Vsc2V7dmFyIGs9dGhpcy5vcHRpb25zLmhlYWRlcnMuY29udGVudF90eXBlO1xuXCJhcHBsaWNhdGlvbi9qc29uXCI9PT1rJiYoZz1CKGIpKTtcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiPT09ayYmKGc9amIoYikpfWUub3BlbihmLGEsITApO2E9e1wiWC1SZXF1ZXN0ZWQtV2l0aFwiOlwiWE1MSHR0cFJlcXVlc3RcIixBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uO3RleHQvcGxhaW5cIn07emEoYSx0aGlzLm9wdGlvbnMuaGVhZGVycyk7Zm9yKHZhciBsIGluIGEpZS5zZXRSZXF1ZXN0SGVhZGVyKGwsYVtsXSk7ZS5zZW5kKGcpfTtBZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEhd2luZG93LlhNTEh0dHBSZXF1ZXN0JiZcInN0cmluZ1wiPT09dHlwZW9mKG5ldyBYTUxIdHRwUmVxdWVzdCkucmVzcG9uc2VUeXBlJiYoIShcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pKSl8fG1nKCkpfTtBZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gQmcoYSl7dGhpcy5vYz1HYSgpK0dhKCkrR2EoKTt0aGlzLkRmPWF9XG5CZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiVVNFUl9DQU5DRUxMRURcIikpLGM9bnVsbCl9dmFyIGU9dGhpcyxmPVJjKGZnKSxnO2IucmVxdWVzdElkPXRoaXMub2M7Yi5yZWRpcmVjdFRvPWYuc2NoZW1lK1wiOi8vXCIrZi5ob3N0K1wiL2JsYW5rL3BhZ2UuaHRtbFwiO2ErPS9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIjthKz1qYihiKTsoZz13aW5kb3cub3BlbihhLFwiX2JsYW5rXCIsXCJsb2NhdGlvbj1ub1wiKSkmJmhhKGcuYWRkRXZlbnRMaXN0ZW5lcik/KGcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRzdGFydFwiLGZ1bmN0aW9uKGEpe3ZhciBiO2lmKGI9YSYmYS51cmwpYTp7dHJ5e3ZhciBtPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO20uaHJlZj1hLnVybDtiPW0uaG9zdD09PWYuaG9zdCYmXCIvYmxhbmsvcGFnZS5odG1sXCI9PT1tLnBhdGhuYW1lO2JyZWFrIGF9Y2F0Y2godil7fWI9ITF9YiYmKGE9cmcoYS51cmwpLGcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImV4aXRcIixcbmQpLGcuY2xvc2UoKSxhPW5ldyBnZyhudWxsLG51bGwse3JlcXVlc3RJZDplLm9jLHJlcXVlc3RLZXk6YX0pLGUuRGYucmVxdWVzdFdpdGhDcmVkZW50aWFsKFwiL2F1dGgvc2Vzc2lvblwiLGEsYyksYz1udWxsKX0pLGcuYWRkRXZlbnRMaXN0ZW5lcihcImV4aXRcIixkKSk6Yyh5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9O0JnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIGtnKCl9O0JnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07ZnVuY3Rpb24gQ2coYSl7YS5jYWxsYmFja19wYXJhbWV0ZXJ8fChhLmNhbGxiYWNrX3BhcmFtZXRlcj1cImNhbGxiYWNrXCIpO3RoaXMub3B0aW9ucz1hO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucHx8e319XG5DZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiUkVRVUVTVF9JTlRFUlJVUFRFRFwiKSksYz1udWxsKX1mdW5jdGlvbiBlKCl7c2V0VGltZW91dChmdW5jdGlvbigpe3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl09dm9pZCAwO3dhKHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnApJiYod2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucD12b2lkIDApO3RyeXt2YXIgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChmKTthJiZhLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSl9Y2F0Y2goYil7fX0sMSk7cGcod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCl9dmFyIGY9XCJmblwiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpK01hdGguZmxvb3IoOTk5OTkqTWF0aC5yYW5kb20oKSk7Ylt0aGlzLm9wdGlvbnMuY2FsbGJhY2tfcGFyYW1ldGVyXT1cIl9fZmlyZWJhc2VfYXV0aF9qc29ucC5cIitmO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpO1xub2cod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCk7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucFtmXT1mdW5jdGlvbihhKXtjJiYoYyhudWxsLGEpLGM9bnVsbCk7ZSgpfTtEZyhmLGEsYyl9O1xuZnVuY3Rpb24gRGcoYSxiLGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0cnl7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmlkPWE7ZC5hc3luYz0hMDtkLnNyYz1iO2Qub25lcnJvcj1mdW5jdGlvbigpe3ZhciBiPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGEpO251bGwhPT1iJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYik7YyYmYyh5ZyhcIk5FVFdPUktfRVJST1JcIikpfTt2YXIgZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIik7KGUmJjAhPWUubGVuZ3RoP2VbMF06ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChkKX1jYXRjaChmKXtjJiZjKHlnKFwiTkVUV09SS19FUlJPUlwiKSl9fSwwKX1DZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEwfTtDZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gRWcoYSxiLGMsZCl7SWYuY2FsbCh0aGlzLFtcImF1dGhfc3RhdHVzXCJdKTt0aGlzLkg9YTt0aGlzLmRmPWI7dGhpcy5TZz1jO3RoaXMuS2U9ZDt0aGlzLnJjPW5ldyBqZyhhLFtEYyxQXSk7dGhpcy5uYj1udWxsO3RoaXMuUmU9ITE7RmcodGhpcyl9bWEoRWcsSWYpO2g9RWcucHJvdG90eXBlO2gud2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYnx8bnVsbH07ZnVuY3Rpb24gRmcoYSl7UC5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpJiZHZyhhKTt2YXIgYj1hLnJjLmdldCgpO2ImJmIudG9rZW4/KEhnKGEsYiksYS5kZihiLnRva2VuLGZ1bmN0aW9uKGMsZCl7SWcoYSxjLGQsITEsYi50b2tlbixiKX0sZnVuY3Rpb24oYixkKXtKZyhhLFwicmVzdW1lU2Vzc2lvbigpXCIsYixkKX0pKTpIZyhhLG51bGwpfVxuZnVuY3Rpb24gS2coYSxiLGMsZCxlLGYpe1wiZmlyZWJhc2Vpby1kZW1vLmNvbVwiPT09YS5ILmRvbWFpbiYmUShcIkZpcmViYXNlIGF1dGhlbnRpY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgb24gZGVtbyBGaXJlYmFzZXMgKCouZmlyZWJhc2Vpby1kZW1vLmNvbSkuIFRvIHNlY3VyZSB5b3VyIEZpcmViYXNlLCBjcmVhdGUgYSBwcm9kdWN0aW9uIEZpcmViYXNlIGF0IGh0dHBzOi8vd3d3LmZpcmViYXNlLmNvbS5cIik7YS5kZihiLGZ1bmN0aW9uKGYsayl7SWcoYSxmLGssITAsYixjLGR8fHt9LGUpfSxmdW5jdGlvbihiLGMpe0pnKGEsXCJhdXRoKClcIixiLGMsZil9KX1mdW5jdGlvbiBMZyhhLGIpe2EucmMuY2xlYXIoKTtIZyhhLG51bGwpO2EuU2coZnVuY3Rpb24oYSxkKXtpZihcIm9rXCI9PT1hKVIoYixudWxsKTtlbHNle3ZhciBlPShhfHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksZj1lO2QmJihmKz1cIjogXCIrZCk7Zj1FcnJvcihmKTtmLmNvZGU9ZTtSKGIsZil9fSl9XG5mdW5jdGlvbiBJZyhhLGIsYyxkLGUsZixnLGspe1wib2tcIj09PWI/KGQmJihiPWMuYXV0aCxmLmF1dGg9YixmLmV4cGlyZXM9Yy5leHBpcmVzLGYudG9rZW49Y2QoZSk/ZTpcIlwiLGM9bnVsbCxiJiZ1KGIsXCJ1aWRcIik/Yz13KGIsXCJ1aWRcIik6dShmLFwidWlkXCIpJiYoYz13KGYsXCJ1aWRcIikpLGYudWlkPWMsYz1cImN1c3RvbVwiLGImJnUoYixcInByb3ZpZGVyXCIpP2M9dyhiLFwicHJvdmlkZXJcIik6dShmLFwicHJvdmlkZXJcIikmJihjPXcoZixcInByb3ZpZGVyXCIpKSxmLnByb3ZpZGVyPWMsYS5yYy5jbGVhcigpLGNkKGUpJiYoZz1nfHx7fSxjPURjLFwic2Vzc2lvbk9ubHlcIj09PWcucmVtZW1iZXImJihjPVApLFwibm9uZVwiIT09Zy5yZW1lbWJlciYmYS5yYy5zZXQoZixjKSksSGcoYSxmKSksUihrLG51bGwsZikpOihhLnJjLmNsZWFyKCksSGcoYSxudWxsKSxmPWE9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxjJiYoZis9XCI6IFwiK2MpLGY9RXJyb3IoZiksZi5jb2RlPWEsUihrLGYpKX1cbmZ1bmN0aW9uIEpnKGEsYixjLGQsZSl7UShiK1wiIHdhcyBjYW5jZWxlZDogXCIrZCk7YS5yYy5jbGVhcigpO0hnKGEsbnVsbCk7YT1FcnJvcihkKTthLmNvZGU9Yy50b1VwcGVyQ2FzZSgpO1IoZSxhKX1mdW5jdGlvbiBNZyhhLGIsYyxkLGUpe05nKGEpO2M9bmV3IGdnKGR8fHt9LHt9LGN8fHt9KTtPZyhhLFtBZyxDZ10sXCIvYXV0aC9cIitiLGMsZSl9XG5mdW5jdGlvbiBQZyhhLGIsYyxkKXtOZyhhKTt2YXIgZT1bemcsQmddO2M9aWcoYyk7XCJhbm9ueW1vdXNcIj09PWJ8fFwicGFzc3dvcmRcIj09PWI/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZCx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihjLmNlLndpbmRvd19mZWF0dXJlcz1cIm1lbnViYXI9eWVzLG1vZGFsPXllcyxhbHdheXNSYWlzZWQ9eWVzbG9jYXRpb249eWVzLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsc3RhdHVzPXllcyxoZWlnaHQ9NjI1LHdpZHRoPTYyNSx0b3A9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4uaGVpZ2h0LTYyNSk6MCkrXCIsbGVmdD1cIisoXCJvYmplY3RcIj09PXR5cGVvZiBzY3JlZW4/LjUqKHNjcmVlbi53aWR0aC02MjUpOjApLGMuY2UucmVsYXlfdXJsPXRnKGEuSC5DYiksYy5jZS5yZXF1ZXN0V2l0aENyZWRlbnRpYWw9cShhLnBjLGEpLE9nKGEsZSxcIi9hdXRoL1wiK2IsYyxkKSl9XG5mdW5jdGlvbiBHZyhhKXt2YXIgYj1QLmdldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7aWYoYil7dmFyIGM9UC5nZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTtQLnJlbW92ZShcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7UC5yZW1vdmUoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTt2YXIgZD1bQWcsQ2ddLGI9e3JlcXVlc3RJZDpiLHJlcXVlc3RLZXk6cmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaCl9LGM9bmV3IGdnKGMse30sYik7YS5SZT0hMDt0cnl7ZG9jdW1lbnQubG9jYXRpb24uaGFzaD1kb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoLyZfX2ZpcmViYXNlX3JlcXVlc3Rfa2V5PShbYS16QS16MC05XSopLyxcIlwiKX1jYXRjaChlKXt9T2coYSxkLFwiL2F1dGgvc2Vzc2lvblwiLGMsZnVuY3Rpb24oKXt0aGlzLlJlPSExfS5iaW5kKGEpKX19XG5oLnJlPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9aWcoYSk7Yy5hYi5fbWV0aG9kPVwiUE9TVFwiO3RoaXMucGMoXCIvdXNlcnNcIixjLGZ1bmN0aW9uKGEsYyl7YT9SKGIsYSk6UihiLGEsYyl9KX07aC5TZT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7TmcodGhpcyk7dmFyIGQ9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpLGU9aWcoYSk7ZS5hYi5fbWV0aG9kPVwiREVMRVRFXCI7dGhpcy5wYyhkLGUsZnVuY3Rpb24oYSxkKXshYSYmZCYmZC51aWQmJmMubmImJmMubmIudWlkJiZjLm5iLnVpZD09PWQudWlkJiZMZyhjKTtSKGIsYSl9KX07aC5vZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKStcIi9wYXNzd29yZFwiLGQ9aWcoYSk7ZC5hYi5fbWV0aG9kPVwiUFVUXCI7ZC5hYi5wYXNzd29yZD1hLm5ld1Bhc3N3b3JkO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtcbmgubmU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5vbGRFbWFpbCkrXCIvZW1haWxcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBVVFwiO2QuYWIuZW1haWw9YS5uZXdFbWFpbDtkLmFiLnBhc3N3b3JkPWEucGFzc3dvcmQ7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O2guVWU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07aC5wYz1mdW5jdGlvbihhLGIsYyl7UWcodGhpcyxbQWcsQ2ddLGEsYixjKX07XG5mdW5jdGlvbiBPZyhhLGIsYyxkLGUpe1FnKGEsYixjLGQsZnVuY3Rpb24oYixjKXshYiYmYyYmYy50b2tlbiYmYy51aWQ/S2coYSxjLnRva2VuLGMsZC5sZCxmdW5jdGlvbihhLGIpe2E/UihlLGEpOlIoZSxudWxsLGIpfSk6UihlLGJ8fHlnKFwiVU5LTk9XTl9FUlJPUlwiKSl9KX1cbmZ1bmN0aW9uIFFnKGEsYixjLGQsZSl7Yj1QYShiLGZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLmlzQXZhaWxhYmxlJiZhLmlzQXZhaWxhYmxlKCl9KTswPT09Yi5sZW5ndGg/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZSx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihiPW5ldyAoYi5zaGlmdCgpKShkLmNlKSxkPWliKGQuYWIpLGQudj1cImpzLTIuMi41XCIsZC50cmFuc3BvcnQ9Yi5CYygpLGQuc3VwcHJlc3Nfc3RhdHVzX2NvZGVzPSEwLGE9c2coKStcIi9cIithLkguQ2IrYyxiLm9wZW4oYSxkLGZ1bmN0aW9uKGEsYil7aWYoYSlSKGUsYSk7ZWxzZSBpZihiJiZiLmVycm9yKXt2YXIgYz1FcnJvcihiLmVycm9yLm1lc3NhZ2UpO2MuY29kZT1iLmVycm9yLmNvZGU7Yy5kZXRhaWxzPWIuZXJyb3IuZGV0YWlscztSKGUsYyl9ZWxzZSBSKGUsbnVsbCxiKX0pKX1cbmZ1bmN0aW9uIEhnKGEsYil7dmFyIGM9bnVsbCE9PWEubmJ8fG51bGwhPT1iO2EubmI9YjtjJiZhLmRlKFwiYXV0aF9zdGF0dXNcIixiKTthLktlKG51bGwhPT1iKX1oLnplPWZ1bmN0aW9uKGEpe0ooXCJhdXRoX3N0YXR1c1wiPT09YSwnaW5pdGlhbCBldmVudCBtdXN0IGJlIG9mIHR5cGUgXCJhdXRoX3N0YXR1c1wiJyk7cmV0dXJuIHRoaXMuUmU/bnVsbDpbdGhpcy5uYl19O2Z1bmN0aW9uIE5nKGEpe3ZhciBiPWEuSDtpZihcImZpcmViYXNlaW8uY29tXCIhPT1iLmRvbWFpbiYmXCJmaXJlYmFzZWlvLWRlbW8uY29tXCIhPT1iLmRvbWFpbiYmXCJhdXRoLmZpcmViYXNlLmNvbVwiPT09ZmcpdGhyb3cgRXJyb3IoXCJUaGlzIGN1c3RvbSBGaXJlYmFzZSBzZXJ2ZXIgKCdcIithLkguZG9tYWluK1wiJykgZG9lcyBub3Qgc3VwcG9ydCBkZWxlZ2F0ZWQgbG9naW4uXCIpO307ZnVuY3Rpb24gUmcoYSl7dGhpcy5oYz1hO3RoaXMuS2Q9W107dGhpcy5RYj0wO3RoaXMucGU9LTE7dGhpcy5GYj1udWxsfWZ1bmN0aW9uIFNnKGEsYixjKXthLnBlPWI7YS5GYj1jO2EucGU8YS5RYiYmKGEuRmIoKSxhLkZiPW51bGwpfWZ1bmN0aW9uIFRnKGEsYixjKXtmb3IoYS5LZFtiXT1jO2EuS2RbYS5RYl07KXt2YXIgZD1hLktkW2EuUWJdO2RlbGV0ZSBhLktkW2EuUWJdO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7KytlKWlmKGRbZV0pe3ZhciBmPWE7Q2IoZnVuY3Rpb24oKXtmLmhjKGRbZV0pfSl9aWYoYS5RYj09PWEucGUpe2EuRmImJihjbGVhclRpbWVvdXQoYS5GYiksYS5GYigpLGEuRmI9bnVsbCk7YnJlYWt9YS5RYisrfX07ZnVuY3Rpb24gVWcoYSxiLGMpe3RoaXMucWU9YTt0aGlzLmY9T2MoYSk7dGhpcy5vYj10aGlzLnBiPTA7dGhpcy5WYT1PYihiKTt0aGlzLlZkPWM7dGhpcy5HYz0hMTt0aGlzLmdkPWZ1bmN0aW9uKGEpe2IuaG9zdCE9PWIuT2EmJihhLm5zPWIuQ2IpO3ZhciBjPVtdLGY7Zm9yKGYgaW4gYSlhLmhhc093blByb3BlcnR5KGYpJiZjLnB1c2goZitcIj1cIithW2ZdKTtyZXR1cm4oYi5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK2IuT2ErXCIvLmxwP1wiK2Muam9pbihcIiZcIil9fXZhciBWZyxXZztcblVnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7dGhpcy5nZj0wO3RoaXMua2E9Yjt0aGlzLnpmPW5ldyBSZyhhKTt0aGlzLnpiPSExO3ZhciBjPXRoaXM7dGhpcy5yYj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yy5mKFwiVGltZWQgb3V0IHRyeWluZyB0byBjb25uZWN0LlwiKTtjLmliKCk7Yy5yYj1udWxsfSxNYXRoLmZsb29yKDNFNCkpO1RjKGZ1bmN0aW9uKCl7aWYoIWMuemIpe2MuVGE9bmV3IFhnKGZ1bmN0aW9uKGEsYixkLGssbCl7WWcoYyxhcmd1bWVudHMpO2lmKGMuVGEpaWYoYy5yYiYmKGNsZWFyVGltZW91dChjLnJiKSxjLnJiPW51bGwpLGMuR2M9ITAsXCJzdGFydFwiPT1hKWMuaWQ9YixjLkZmPWQ7ZWxzZSBpZihcImNsb3NlXCI9PT1hKWI/KGMuVGEuVGQ9ITEsU2coYy56ZixiLGZ1bmN0aW9uKCl7Yy5pYigpfSkpOmMuaWIoKTtlbHNlIHRocm93IEVycm9yKFwiVW5yZWNvZ25pemVkIGNvbW1hbmQgcmVjZWl2ZWQ6IFwiK2EpO30sZnVuY3Rpb24oYSxiKXtZZyhjLGFyZ3VtZW50cyk7XG5UZyhjLnpmLGEsYil9LGZ1bmN0aW9uKCl7Yy5pYigpfSxjLmdkKTt2YXIgYT17c3RhcnQ6XCJ0XCJ9O2Euc2VyPU1hdGguZmxvb3IoMUU4Kk1hdGgucmFuZG9tKCkpO2MuVGEuZmUmJihhLmNiPWMuVGEuZmUpO2Eudj1cIjVcIjtjLlZkJiYoYS5zPWMuVmQpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJmxvY2F0aW9uLmhyZWYmJi0xIT09bG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZmlyZWJhc2Vpby5jb21cIikmJihhLnI9XCJmXCIpO2E9Yy5nZChhKTtjLmYoXCJDb25uZWN0aW5nIHZpYSBsb25nLXBvbGwgdG8gXCIrYSk7WmcoYy5UYSxhLGZ1bmN0aW9uKCl7fSl9fSl9O1xuVWcucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5UYSxiPXRoaXMuRmY7YS5yZz10aGlzLmlkO2Euc2c9Yjtmb3IoYS5rZT0hMDskZyhhKTspO2E9dGhpcy5pZDtiPXRoaXMuRmY7dGhpcy5mYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO3ZhciBjPXtkZnJhbWU6XCJ0XCJ9O2MuaWQ9YTtjLnB3PWI7dGhpcy5mYy5zcmM9dGhpcy5nZChjKTt0aGlzLmZjLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmZjKX07VWcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4gVmd8fCFXZyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudCYmIShcIm9iamVjdFwiPT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmNocm9tZSYmd2luZG93LmNocm9tZS5leHRlbnNpb24mJiEvXmNocm9tZS8udGVzdCh3aW5kb3cubG9jYXRpb24uaHJlZikpJiYhKFwib2JqZWN0XCI9PT10eXBlb2YgV2luZG93cyYmXCJvYmplY3RcIj09PXR5cGVvZiBXaW5kb3dzLlVnKX07XG5oPVVnLnByb3RvdHlwZTtoLkJkPWZ1bmN0aW9uKCl7fTtoLmNkPWZ1bmN0aW9uKCl7dGhpcy56Yj0hMDt0aGlzLlRhJiYodGhpcy5UYS5jbG9zZSgpLHRoaXMuVGE9bnVsbCk7dGhpcy5mYyYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5mYyksdGhpcy5mYz1udWxsKTt0aGlzLnJiJiYoY2xlYXJUaW1lb3V0KHRoaXMucmIpLHRoaXMucmI9bnVsbCl9O2guaWI9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiTG9uZ3BvbGwgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5jZCgpLHRoaXMua2EmJih0aGlzLmthKHRoaXMuR2MpLHRoaXMua2E9bnVsbCkpfTtoLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIkxvbmdwb2xsIGlzIGJlaW5nIGNsb3NlZC5cIiksdGhpcy5jZCgpKX07XG5oLnNlbmQ9ZnVuY3Rpb24oYSl7YT1CKGEpO3RoaXMucGIrPWEubGVuZ3RoO0xiKHRoaXMuVmEsXCJieXRlc19zZW50XCIsYS5sZW5ndGgpO2E9S2MoYSk7YT1mYihhLCEwKTthPVhjKGEsMTg0MCk7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspe3ZhciBjPXRoaXMuVGE7Yy4kYy5wdXNoKHtKZzp0aGlzLmdmLFJnOmEubGVuZ3RoLGpmOmFbYl19KTtjLmtlJiYkZyhjKTt0aGlzLmdmKyt9fTtmdW5jdGlvbiBZZyhhLGIpe3ZhciBjPUIoYikubGVuZ3RoO2Eub2IrPWM7TGIoYS5WYSxcImJ5dGVzX3JlY2VpdmVkXCIsYyl9XG5mdW5jdGlvbiBYZyhhLGIsYyxkKXt0aGlzLmdkPWQ7dGhpcy5qYj1jO3RoaXMuT2U9bmV3IGNnO3RoaXMuJGM9W107dGhpcy5zZT1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTt0aGlzLlRkPSEwO3RoaXMuZmU9R2MoKTt3aW5kb3dbXCJwTFBDb21tYW5kXCIrdGhpcy5mZV09YTt3aW5kb3dbXCJwUlRMUENCXCIrdGhpcy5mZV09YjthPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7YS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2lmKGRvY3VtZW50LmJvZHkpe2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7dHJ5e2EuY29udGVudFdpbmRvdy5kb2N1bWVudHx8QmIoXCJObyBJRSBkb21haW4gc2V0dGluZyByZXF1aXJlZFwiKX1jYXRjaChlKXthLnNyYz1cImphdmFzY3JpcHQ6dm9pZCgoZnVuY3Rpb24oKXtkb2N1bWVudC5vcGVuKCk7ZG9jdW1lbnQuZG9tYWluPSdcIitkb2N1bWVudC5kb21haW4rXCInO2RvY3VtZW50LmNsb3NlKCk7fSkoKSlcIn19ZWxzZSB0aHJvd1wiRG9jdW1lbnQgYm9keSBoYXMgbm90IGluaXRpYWxpemVkLiBXYWl0IHRvIGluaXRpYWxpemUgRmlyZWJhc2UgdW50aWwgYWZ0ZXIgdGhlIGRvY3VtZW50IGlzIHJlYWR5LlwiO1xuYS5jb250ZW50RG9jdW1lbnQ/YS5nYj1hLmNvbnRlbnREb2N1bWVudDphLmNvbnRlbnRXaW5kb3c/YS5nYj1hLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ6YS5kb2N1bWVudCYmKGEuZ2I9YS5kb2N1bWVudCk7dGhpcy5DYT1hO2E9XCJcIjt0aGlzLkNhLnNyYyYmXCJqYXZhc2NyaXB0OlwiPT09dGhpcy5DYS5zcmMuc3Vic3RyKDAsMTEpJiYoYT0nPHNjcmlwdD5kb2N1bWVudC5kb21haW49XCInK2RvY3VtZW50LmRvbWFpbisnXCI7XFx4M2Mvc2NyaXB0PicpO2E9XCI8aHRtbD48Ym9keT5cIithK1wiPC9ib2R5PjwvaHRtbD5cIjt0cnl7dGhpcy5DYS5nYi5vcGVuKCksdGhpcy5DYS5nYi53cml0ZShhKSx0aGlzLkNhLmdiLmNsb3NlKCl9Y2F0Y2goZil7QmIoXCJmcmFtZSB3cml0aW5nIGV4Y2VwdGlvblwiKSxmLnN0YWNrJiZCYihmLnN0YWNrKSxCYihmKX19XG5YZy5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLmtlPSExO2lmKHRoaXMuQ2Epe3RoaXMuQ2EuZ2IuYm9keS5pbm5lckhUTUw9XCJcIjt2YXIgYT10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtudWxsIT09YS5DYSYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYS5DYSksYS5DYT1udWxsKX0sTWF0aC5mbG9vcigwKSl9dmFyIGI9dGhpcy5qYjtiJiYodGhpcy5qYj1udWxsLGIoKSl9O1xuZnVuY3Rpb24gJGcoYSl7aWYoYS5rZSYmYS5UZCYmYS5PZS5jb3VudCgpPCgwPGEuJGMubGVuZ3RoPzI6MSkpe2Euc2UrKzt2YXIgYj17fTtiLmlkPWEucmc7Yi5wdz1hLnNnO2Iuc2VyPWEuc2U7Zm9yKHZhciBiPWEuZ2QoYiksYz1cIlwiLGQ9MDswPGEuJGMubGVuZ3RoOylpZigxODcwPj1hLiRjWzBdLmpmLmxlbmd0aCszMCtjLmxlbmd0aCl7dmFyIGU9YS4kYy5zaGlmdCgpLGM9YytcIiZzZWdcIitkK1wiPVwiK2UuSmcrXCImdHNcIitkK1wiPVwiK2UuUmcrXCImZFwiK2QrXCI9XCIrZS5qZjtkKyt9ZWxzZSBicmVhazthaChhLGIrYyxhLnNlKTtyZXR1cm4hMH1yZXR1cm4hMX1mdW5jdGlvbiBhaChhLGIsYyl7ZnVuY3Rpb24gZCgpe2EuT2UucmVtb3ZlKGMpOyRnKGEpfWEuT2UuYWRkKGMsMSk7dmFyIGU9c2V0VGltZW91dChkLE1hdGguZmxvb3IoMjVFMykpO1pnKGEsYixmdW5jdGlvbigpe2NsZWFyVGltZW91dChlKTtkKCl9KX1cbmZ1bmN0aW9uIFpnKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e2lmKGEuVGQpe3ZhciBkPWEuQ2EuZ2IuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmFzeW5jPSEwO2Quc3JjPWI7ZC5vbmxvYWQ9ZC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXt2YXIgYT1kLnJlYWR5U3RhdGU7YSYmXCJsb2FkZWRcIiE9PWEmJlwiY29tcGxldGVcIiE9PWF8fChkLm9ubG9hZD1kLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGMoKSl9O2Qub25lcnJvcj1mdW5jdGlvbigpe0JiKFwiTG9uZy1wb2xsIHNjcmlwdCBmYWlsZWQgdG8gbG9hZDogXCIrYik7YS5UZD0hMTthLmNsb3NlKCl9O2EuQ2EuZ2IuYm9keS5hcHBlbmRDaGlsZChkKX19Y2F0Y2goZSl7fX0sTWF0aC5mbG9vcigxKSl9O3ZhciBiaD1udWxsO1widW5kZWZpbmVkXCIhPT10eXBlb2YgTW96V2ViU29ja2V0P2JoPU1veldlYlNvY2tldDpcInVuZGVmaW5lZFwiIT09dHlwZW9mIFdlYlNvY2tldCYmKGJoPVdlYlNvY2tldCk7ZnVuY3Rpb24gY2goYSxiLGMpe3RoaXMucWU9YTt0aGlzLmY9T2ModGhpcy5xZSk7dGhpcy5mcmFtZXM9dGhpcy5KYz1udWxsO3RoaXMub2I9dGhpcy5wYj10aGlzLmJmPTA7dGhpcy5WYT1PYihiKTt0aGlzLmZiPShiLmxiP1wid3NzOi8vXCI6XCJ3czovL1wiKStiLk9hK1wiLy53cz92PTVcIjtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5ocmVmJiYtMSE9PWxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZpcmViYXNlaW8uY29tXCIpJiYodGhpcy5mYis9XCImcj1mXCIpO2IuaG9zdCE9PWIuT2EmJih0aGlzLmZiPXRoaXMuZmIrXCImbnM9XCIrYi5DYik7YyYmKHRoaXMuZmI9dGhpcy5mYitcIiZzPVwiK2MpfXZhciBkaDtcbmNoLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7dGhpcy5qYj1iO3RoaXMud2c9YTt0aGlzLmYoXCJXZWJzb2NrZXQgY29ubmVjdGluZyB0byBcIit0aGlzLmZiKTt0aGlzLkdjPSExO0RjLnNldChcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIsITApO3RyeXt0aGlzLnZhPW5ldyBiaCh0aGlzLmZiKX1jYXRjaChjKXt0aGlzLmYoXCJFcnJvciBpbnN0YW50aWF0aW5nIFdlYlNvY2tldC5cIik7dmFyIGQ9Yy5tZXNzYWdlfHxjLmRhdGE7ZCYmdGhpcy5mKGQpO3RoaXMuaWIoKTtyZXR1cm59dmFyIGU9dGhpczt0aGlzLnZhLm9ub3Blbj1mdW5jdGlvbigpe2UuZihcIldlYnNvY2tldCBjb25uZWN0ZWQuXCIpO2UuR2M9ITB9O3RoaXMudmEub25jbG9zZT1mdW5jdGlvbigpe2UuZihcIldlYnNvY2tldCBjb25uZWN0aW9uIHdhcyBkaXNjb25uZWN0ZWQuXCIpO2UudmE9bnVsbDtlLmliKCl9O3RoaXMudmEub25tZXNzYWdlPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1lLnZhKWlmKGE9YS5kYXRhLGUub2IrPVxuYS5sZW5ndGgsTGIoZS5WYSxcImJ5dGVzX3JlY2VpdmVkXCIsYS5sZW5ndGgpLGVoKGUpLG51bGwhPT1lLmZyYW1lcylmaChlLGEpO2Vsc2V7YTp7SihudWxsPT09ZS5mcmFtZXMsXCJXZSBhbHJlYWR5IGhhdmUgYSBmcmFtZSBidWZmZXJcIik7aWYoNj49YS5sZW5ndGgpe3ZhciBiPU51bWJlcihhKTtpZighaXNOYU4oYikpe2UuYmY9YjtlLmZyYW1lcz1bXTthPW51bGw7YnJlYWsgYX19ZS5iZj0xO2UuZnJhbWVzPVtdfW51bGwhPT1hJiZmaChlLGEpfX07dGhpcy52YS5vbmVycm9yPWZ1bmN0aW9uKGEpe2UuZihcIldlYlNvY2tldCBlcnJvci4gIENsb3NpbmcgY29ubmVjdGlvbi5cIik7KGE9YS5tZXNzYWdlfHxhLmRhdGEpJiZlLmYoYSk7ZS5pYigpfX07Y2gucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7fTtcbmNoLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7dmFyIGE9ITE7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJm5hdmlnYXRvci51c2VyQWdlbnQpe3ZhciBiPW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQgKFswLTldezAsfVxcLlswLTldezAsfSkvKTtiJiYxPGIubGVuZ3RoJiY0LjQ+cGFyc2VGbG9hdChiWzFdKSYmKGE9ITApfXJldHVybiFhJiZudWxsIT09YmgmJiFkaH07Y2gucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeT0yO2NoLmhlYWx0aHlUaW1lb3V0PTNFNDtoPWNoLnByb3RvdHlwZTtoLkJkPWZ1bmN0aW9uKCl7RGMucmVtb3ZlKFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIil9O2Z1bmN0aW9uIGZoKGEsYil7YS5mcmFtZXMucHVzaChiKTtpZihhLmZyYW1lcy5sZW5ndGg9PWEuYmYpe3ZhciBjPWEuZnJhbWVzLmpvaW4oXCJcIik7YS5mcmFtZXM9bnVsbDtjPW1iKGMpO2Eud2coYyl9fVxuaC5zZW5kPWZ1bmN0aW9uKGEpe2VoKHRoaXMpO2E9QihhKTt0aGlzLnBiKz1hLmxlbmd0aDtMYih0aGlzLlZhLFwiYnl0ZXNfc2VudFwiLGEubGVuZ3RoKTthPVhjKGEsMTYzODQpOzE8YS5sZW5ndGgmJnRoaXMudmEuc2VuZChTdHJpbmcoYS5sZW5ndGgpKTtmb3IodmFyIGI9MDtiPGEubGVuZ3RoO2IrKyl0aGlzLnZhLnNlbmQoYVtiXSl9O2guY2Q9ZnVuY3Rpb24oKXt0aGlzLnpiPSEwO3RoaXMuSmMmJihjbGVhckludGVydmFsKHRoaXMuSmMpLHRoaXMuSmM9bnVsbCk7dGhpcy52YSYmKHRoaXMudmEuY2xvc2UoKSx0aGlzLnZhPW51bGwpfTtoLmliPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIldlYlNvY2tldCBpcyBjbG9zaW5nIGl0c2VsZlwiKSx0aGlzLmNkKCksdGhpcy5qYiYmKHRoaXMuamIodGhpcy5HYyksdGhpcy5qYj1udWxsKSl9O2guY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiV2ViU29ja2V0IGlzIGJlaW5nIGNsb3NlZFwiKSx0aGlzLmNkKCkpfTtcbmZ1bmN0aW9uIGVoKGEpe2NsZWFySW50ZXJ2YWwoYS5KYyk7YS5KYz1zZXRJbnRlcnZhbChmdW5jdGlvbigpe2EudmEmJmEudmEuc2VuZChcIjBcIik7ZWgoYSl9LE1hdGguZmxvb3IoNDVFMykpfTtmdW5jdGlvbiBnaChhKXtoaCh0aGlzLGEpfXZhciBpaD1bVWcsY2hdO2Z1bmN0aW9uIGhoKGEsYil7dmFyIGM9Y2gmJmNoLmlzQXZhaWxhYmxlKCksZD1jJiYhKERjLnVmfHwhMD09PURjLmdldChcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIpKTtiLlRnJiYoY3x8UShcIndzczovLyBVUkwgdXNlZCwgYnV0IGJyb3dzZXIgaXNuJ3Qga25vd24gdG8gc3VwcG9ydCB3ZWJzb2NrZXRzLiAgVHJ5aW5nIGFueXdheS5cIiksZD0hMCk7aWYoZClhLmVkPVtjaF07ZWxzZXt2YXIgZT1hLmVkPVtdO1ljKGloLGZ1bmN0aW9uKGEsYil7YiYmYi5pc0F2YWlsYWJsZSgpJiZlLnB1c2goYil9KX19ZnVuY3Rpb24gamgoYSl7aWYoMDxhLmVkLmxlbmd0aClyZXR1cm4gYS5lZFswXTt0aHJvdyBFcnJvcihcIk5vIHRyYW5zcG9ydHMgYXZhaWxhYmxlXCIpO307ZnVuY3Rpb24ga2goYSxiLGMsZCxlLGYpe3RoaXMuaWQ9YTt0aGlzLmY9T2MoXCJjOlwiK3RoaXMuaWQrXCI6XCIpO3RoaXMuaGM9Yzt0aGlzLlZjPWQ7dGhpcy5rYT1lO3RoaXMuTWU9Zjt0aGlzLkg9Yjt0aGlzLkpkPVtdO3RoaXMuZWY9MDt0aGlzLk5mPW5ldyBnaChiKTt0aGlzLlVhPTA7dGhpcy5mKFwiQ29ubmVjdGlvbiBjcmVhdGVkXCIpO2xoKHRoaXMpfVxuZnVuY3Rpb24gbGgoYSl7dmFyIGI9amgoYS5OZik7YS5MPW5ldyBiKFwiYzpcIithLmlkK1wiOlwiK2EuZWYrKyxhLkgpO2EuUWU9Yi5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5fHwwO3ZhciBjPW1oKGEsYS5MKSxkPW5oKGEsYS5MKTthLmZkPWEuTDthLmJkPWEuTDthLkY9bnVsbDthLkFiPSExO3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLkwmJmEuTC5vcGVuKGMsZCl9LE1hdGguZmxvb3IoMCkpO2I9Yi5oZWFsdGh5VGltZW91dHx8MDswPGImJihhLnZkPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthLnZkPW51bGw7YS5BYnx8KGEuTCYmMTAyNDAwPGEuTC5vYj8oYS5mKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyByZWNlaXZlZCBcIithLkwub2IrXCIgYnl0ZXMuICBNYXJraW5nIGNvbm5lY3Rpb24gaGVhbHRoeS5cIiksYS5BYj0hMCxhLkwuQmQoKSk6YS5MJiYxMDI0MDxhLkwucGI/YS5mKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyBzZW50IFwiK1xuYS5MLnBiK1wiIGJ5dGVzLiAgTGVhdmluZyBjb25uZWN0aW9uIGFsaXZlLlwiKTooYS5mKFwiQ2xvc2luZyB1bmhlYWx0aHkgY29ubmVjdGlvbiBhZnRlciB0aW1lb3V0LlwiKSxhLmNsb3NlKCkpKX0sTWF0aC5mbG9vcihiKSkpfWZ1bmN0aW9uIG5oKGEsYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2I9PT1hLkw/KGEuTD1udWxsLGN8fDAhPT1hLlVhPzE9PT1hLlVhJiZhLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGxvc3QuXCIpOihhLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGZhaWxlZC5cIiksXCJzLVwiPT09YS5ILk9hLnN1YnN0cigwLDIpJiYoRGMucmVtb3ZlKFwiaG9zdDpcIithLkguaG9zdCksYS5ILk9hPWEuSC5ob3N0KSksYS5jbG9zZSgpKTpiPT09YS5GPyhhLmYoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBsb3N0LlwiKSxjPWEuRixhLkY9bnVsbCxhLmZkIT09YyYmYS5iZCE9PWN8fGEuY2xvc2UoKSk6YS5mKFwiY2xvc2luZyBhbiBvbGQgY29ubmVjdGlvblwiKX19XG5mdW5jdGlvbiBtaChhLGIpe3JldHVybiBmdW5jdGlvbihjKXtpZigyIT1hLlVhKWlmKGI9PT1hLmJkKXt2YXIgZD1WYyhcInRcIixjKTtjPVZjKFwiZFwiLGMpO2lmKFwiY1wiPT1kKXtpZihkPVZjKFwidFwiLGMpLFwiZFwiaW4gYylpZihjPWMuZCxcImhcIj09PWQpe3ZhciBkPWMudHMsZT1jLnYsZj1jLmg7YS5WZD1jLnM7RmMoYS5ILGYpOzA9PWEuVWEmJihhLkwuc3RhcnQoKSxvaChhLGEuTCxkKSxcIjVcIiE9PWUmJlEoXCJQcm90b2NvbCB2ZXJzaW9uIG1pc21hdGNoIGRldGVjdGVkXCIpLGM9YS5OZiwoYz0xPGMuZWQubGVuZ3RoP2MuZWRbMV06bnVsbCkmJnBoKGEsYykpfWVsc2UgaWYoXCJuXCI9PT1kKXthLmYoXCJyZWN2ZCBlbmQgdHJhbnNtaXNzaW9uIG9uIHByaW1hcnlcIik7YS5iZD1hLkY7Zm9yKGM9MDtjPGEuSmQubGVuZ3RoOysrYylhLkZkKGEuSmRbY10pO2EuSmQ9W107cWgoYSl9ZWxzZVwic1wiPT09ZD8oYS5mKFwiQ29ubmVjdGlvbiBzaHV0ZG93biBjb21tYW5kIHJlY2VpdmVkLiBTaHV0dGluZyBkb3duLi4uXCIpLFxuYS5NZSYmKGEuTWUoYyksYS5NZT1udWxsKSxhLmthPW51bGwsYS5jbG9zZSgpKTpcInJcIj09PWQ/KGEuZihcIlJlc2V0IHBhY2tldCByZWNlaXZlZC4gIE5ldyBob3N0OiBcIitjKSxGYyhhLkgsYyksMT09PWEuVWE/YS5jbG9zZSgpOihyaChhKSxsaChhKSkpOlwiZVwiPT09ZD9QYyhcIlNlcnZlciBFcnJvcjogXCIrYyk6XCJvXCI9PT1kPyhhLmYoXCJnb3QgcG9uZyBvbiBwcmltYXJ5LlwiKSxzaChhKSx0aChhKSk6UGMoXCJVbmtub3duIGNvbnRyb2wgcGFja2V0IGNvbW1hbmQ6IFwiK2QpfWVsc2VcImRcIj09ZCYmYS5GZChjKX1lbHNlIGlmKGI9PT1hLkYpaWYoZD1WYyhcInRcIixjKSxjPVZjKFwiZFwiLGMpLFwiY1wiPT1kKVwidFwiaW4gYyYmKGM9Yy50LFwiYVwiPT09Yz91aChhKTpcInJcIj09PWM/KGEuZihcIkdvdCBhIHJlc2V0IG9uIHNlY29uZGFyeSwgY2xvc2luZyBpdFwiKSxhLkYuY2xvc2UoKSxhLmZkIT09YS5GJiZhLmJkIT09YS5GfHxhLmNsb3NlKCkpOlwib1wiPT09YyYmKGEuZihcImdvdCBwb25nIG9uIHNlY29uZGFyeS5cIiksXG5hLkxmLS0sdWgoYSkpKTtlbHNlIGlmKFwiZFwiPT1kKWEuSmQucHVzaChjKTtlbHNlIHRocm93IEVycm9yKFwiVW5rbm93biBwcm90b2NvbCBsYXllcjogXCIrZCk7ZWxzZSBhLmYoXCJtZXNzYWdlIG9uIG9sZCBjb25uZWN0aW9uXCIpfX1raC5wcm90b3R5cGUuRGE9ZnVuY3Rpb24oYSl7dmgodGhpcyx7dDpcImRcIixkOmF9KX07ZnVuY3Rpb24gcWgoYSl7YS5mZD09PWEuRiYmYS5iZD09PWEuRiYmKGEuZihcImNsZWFuaW5nIHVwIGFuZCBwcm9tb3RpbmcgYSBjb25uZWN0aW9uOiBcIithLkYucWUpLGEuTD1hLkYsYS5GPW51bGwpfVxuZnVuY3Rpb24gdWgoYSl7MD49YS5MZj8oYS5mKFwiU2Vjb25kYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCxhLkYuQmQoKSxhLkYuc3RhcnQoKSxhLmYoXCJzZW5kaW5nIGNsaWVudCBhY2sgb24gc2Vjb25kYXJ5XCIpLGEuRi5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJhXCIsZDp7fX19KSxhLmYoXCJFbmRpbmcgdHJhbnNtaXNzaW9uIG9uIHByaW1hcnlcIiksYS5MLnNlbmQoe3Q6XCJjXCIsZDp7dDpcIm5cIixkOnt9fX0pLGEuZmQ9YS5GLHFoKGEpKTooYS5mKFwic2VuZGluZyBwaW5nIG9uIHNlY29uZGFyeS5cIiksYS5GLnNlbmQoe3Q6XCJjXCIsZDp7dDpcInBcIixkOnt9fX0pKX1raC5wcm90b3R5cGUuRmQ9ZnVuY3Rpb24oYSl7c2godGhpcyk7dGhpcy5oYyhhKX07ZnVuY3Rpb24gc2goYSl7YS5BYnx8KGEuUWUtLSwwPj1hLlFlJiYoYS5mKFwiUHJpbWFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5MLkJkKCkpKX1cbmZ1bmN0aW9uIHBoKGEsYil7YS5GPW5ldyBiKFwiYzpcIithLmlkK1wiOlwiK2EuZWYrKyxhLkgsYS5WZCk7YS5MZj1iLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHl8fDA7YS5GLm9wZW4obWgoYSxhLkYpLG5oKGEsYS5GKSk7c2V0VGltZW91dChmdW5jdGlvbigpe2EuRiYmKGEuZihcIlRpbWVkIG91dCB0cnlpbmcgdG8gdXBncmFkZS5cIiksYS5GLmNsb3NlKCkpfSxNYXRoLmZsb29yKDZFNCkpfWZ1bmN0aW9uIG9oKGEsYixjKXthLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGVzdGFibGlzaGVkLlwiKTthLkw9YjthLlVhPTE7YS5WYyYmKGEuVmMoYyksYS5WYz1udWxsKTswPT09YS5RZT8oYS5mKFwiUHJpbWFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITApOnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aChhKX0sTWF0aC5mbG9vcig1RTMpKX1cbmZ1bmN0aW9uIHRoKGEpe2EuQWJ8fDEhPT1hLlVhfHwoYS5mKFwic2VuZGluZyBwaW5nIG9uIHByaW1hcnkuXCIpLHZoKGEse3Q6XCJjXCIsZDp7dDpcInBcIixkOnt9fX0pKX1mdW5jdGlvbiB2aChhLGIpe2lmKDEhPT1hLlVhKXRocm93XCJDb25uZWN0aW9uIGlzIG5vdCBjb25uZWN0ZWRcIjthLmZkLnNlbmQoYil9a2gucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7MiE9PXRoaXMuVWEmJih0aGlzLmYoXCJDbG9zaW5nIHJlYWx0aW1lIGNvbm5lY3Rpb24uXCIpLHRoaXMuVWE9MixyaCh0aGlzKSx0aGlzLmthJiYodGhpcy5rYSgpLHRoaXMua2E9bnVsbCkpfTtmdW5jdGlvbiByaChhKXthLmYoXCJTaHV0dGluZyBkb3duIGFsbCBjb25uZWN0aW9uc1wiKTthLkwmJihhLkwuY2xvc2UoKSxhLkw9bnVsbCk7YS5GJiYoYS5GLmNsb3NlKCksYS5GPW51bGwpO2EudmQmJihjbGVhclRpbWVvdXQoYS52ZCksYS52ZD1udWxsKX07ZnVuY3Rpb24gd2goYSxiLGMsZCl7dGhpcy5pZD14aCsrO3RoaXMuZj1PYyhcInA6XCIrdGhpcy5pZCtcIjpcIik7dGhpcy53Zj10aGlzLkRlPSExO3RoaXMuYWE9e307dGhpcy5wYT1bXTt0aGlzLlhjPTA7dGhpcy5VYz1bXTt0aGlzLm1hPSExO3RoaXMuJGE9MUUzO3RoaXMuQ2Q9M0U1O3RoaXMuR2I9Yjt0aGlzLlRjPWM7dGhpcy5OZT1kO3RoaXMuSD1hO3RoaXMuV2U9bnVsbDt0aGlzLlFkPXt9O3RoaXMuSWc9MDt0aGlzLm1mPSEwO3RoaXMuS2M9dGhpcy5GZT1udWxsO3loKHRoaXMsMCk7TWYudWIoKS5FYihcInZpc2libGVcIix0aGlzLnpnLHRoaXMpOy0xPT09YS5ob3N0LmluZGV4T2YoXCJmYmxvY2FsXCIpJiZMZi51YigpLkViKFwib25saW5lXCIsdGhpcy54Zyx0aGlzKX12YXIgeGg9MCx6aD0wO2g9d2gucHJvdG90eXBlO1xuaC5EYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Kyt0aGlzLklnO2E9e3I6ZCxhOmEsYjpifTt0aGlzLmYoQihhKSk7Sih0aGlzLm1hLFwic2VuZFJlcXVlc3QgY2FsbCB3aGVuIHdlJ3JlIG5vdCBjb25uZWN0ZWQgbm90IGFsbG93ZWQuXCIpO3RoaXMuU2EuRGEoYSk7YyYmKHRoaXMuUWRbZF09Yyl9O2gueGY9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS53YSgpLGY9YS5wYXRoLnRvU3RyaW5nKCk7dGhpcy5mKFwiTGlzdGVuIGNhbGxlZCBmb3IgXCIrZitcIiBcIitlKTt0aGlzLmFhW2ZdPXRoaXMuYWFbZl18fHt9O0ooIXRoaXMuYWFbZl1bZV0sXCJsaXN0ZW4oKSBjYWxsZWQgdHdpY2UgZm9yIHNhbWUgcGF0aC9xdWVyeUlkLlwiKTthPXtKOmQsdWQ6YixGZzphLHRhZzpjfTt0aGlzLmFhW2ZdW2VdPWE7dGhpcy5tYSYmQWgodGhpcyxhKX07XG5mdW5jdGlvbiBBaChhLGIpe3ZhciBjPWIuRmcsZD1jLnBhdGgudG9TdHJpbmcoKSxlPWMud2EoKTthLmYoXCJMaXN0ZW4gb24gXCIrZCtcIiBmb3IgXCIrZSk7dmFyIGY9e3A6ZH07Yi50YWcmJihmLnE9Y2UoYy5vKSxmLnQ9Yi50YWcpO2YuaD1iLnVkKCk7YS5EYShcInFcIixmLGZ1bmN0aW9uKGYpe3ZhciBrPWYuZCxsPWYucztpZihrJiZcIm9iamVjdFwiPT09dHlwZW9mIGsmJnUoayxcIndcIikpe3ZhciBtPXcoayxcIndcIik7ZWEobSkmJjA8PU5hKG0sXCJub19pbmRleFwiKSYmUShcIlVzaW5nIGFuIHVuc3BlY2lmaWVkIGluZGV4LiBDb25zaWRlciBhZGRpbmcgXCIrKCdcIi5pbmRleE9uXCI6IFwiJytjLm8uZy50b1N0cmluZygpKydcIicpK1wiIGF0IFwiK2MucGF0aC50b1N0cmluZygpK1wiIHRvIHlvdXIgc2VjdXJpdHkgcnVsZXMgZm9yIGJldHRlciBwZXJmb3JtYW5jZVwiKX0oYS5hYVtkXSYmYS5hYVtkXVtlXSk9PT1iJiYoYS5mKFwibGlzdGVuIHJlc3BvbnNlXCIsZiksXCJva1wiIT09bCYmQmgoYSxkLGUpLGIuSiYmXG5iLkoobCxrKSl9KX1oLlA9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuRmE9e2ZnOmEsbmY6ITEseWM6YixqZDpjfTt0aGlzLmYoXCJBdXRoZW50aWNhdGluZyB1c2luZyBjcmVkZW50aWFsOiBcIithKTtDaCh0aGlzKTsoYj00MD09YS5sZW5ndGgpfHwoYT1hZChhKS5BYyxiPVwib2JqZWN0XCI9PT10eXBlb2YgYSYmITA9PT13KGEsXCJhZG1pblwiKSk7YiYmKHRoaXMuZihcIkFkbWluIGF1dGggY3JlZGVudGlhbCBkZXRlY3RlZC4gIFJlZHVjaW5nIG1heCByZWNvbm5lY3QgdGltZS5cIiksdGhpcy5DZD0zRTQpfTtoLmVlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLkZhO3RoaXMubWEmJnRoaXMuRGEoXCJ1bmF1dGhcIix7fSxmdW5jdGlvbihiKXthKGIucyxiLmQpfSl9O1xuZnVuY3Rpb24gQ2goYSl7dmFyIGI9YS5GYTthLm1hJiZiJiZhLkRhKFwiYXV0aFwiLHtjcmVkOmIuZmd9LGZ1bmN0aW9uKGMpe3ZhciBkPWMucztjPWMuZHx8XCJlcnJvclwiO1wib2tcIiE9PWQmJmEuRmE9PT1iJiZkZWxldGUgYS5GYTtiLm5mP1wib2tcIiE9PWQmJmIuamQmJmIuamQoZCxjKTooYi5uZj0hMCxiLnljJiZiLnljKGQsYykpfSl9aC5PZj1mdW5jdGlvbihhLGIpe3ZhciBjPWEucGF0aC50b1N0cmluZygpLGQ9YS53YSgpO3RoaXMuZihcIlVubGlzdGVuIGNhbGxlZCBmb3IgXCIrYytcIiBcIitkKTtpZihCaCh0aGlzLGMsZCkmJnRoaXMubWEpe3ZhciBlPWNlKGEubyk7dGhpcy5mKFwiVW5saXN0ZW4gb24gXCIrYytcIiBmb3IgXCIrZCk7Yz17cDpjfTtiJiYoYy5xPWUsYy50PWIpO3RoaXMuRGEoXCJuXCIsYyl9fTtoLkxlPWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1hP0RoKHRoaXMsXCJvXCIsYSxiLGMpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvXCIsZGF0YTpiLEo6Y30pfTtcbmguQmY9ZnVuY3Rpb24oYSxiLGMpe3RoaXMubWE/RGgodGhpcyxcIm9tXCIsYSxiLGMpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvbVwiLGRhdGE6YixKOmN9KX07aC5HZD1mdW5jdGlvbihhLGIpe3RoaXMubWE/RGgodGhpcyxcIm9jXCIsYSxudWxsLGIpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvY1wiLGRhdGE6bnVsbCxKOmJ9KX07ZnVuY3Rpb24gRGgoYSxiLGMsZCxlKXtjPXtwOmMsZDpkfTthLmYoXCJvbkRpc2Nvbm5lY3QgXCIrYixjKTthLkRhKGIsYyxmdW5jdGlvbihhKXtlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShhLnMsYS5kKX0sTWF0aC5mbG9vcigwKSl9KX1oLnB1dD1mdW5jdGlvbihhLGIsYyxkKXtFaCh0aGlzLFwicFwiLGEsYixjLGQpfTtoLnlmPWZ1bmN0aW9uKGEsYixjLGQpe0VoKHRoaXMsXCJtXCIsYSxiLGMsZCl9O1xuZnVuY3Rpb24gRWgoYSxiLGMsZCxlLGYpe2Q9e3A6YyxkOmR9O24oZikmJihkLmg9Zik7YS5wYS5wdXNoKHthY3Rpb246YixJZjpkLEo6ZX0pO2EuWGMrKztiPWEucGEubGVuZ3RoLTE7YS5tYT9GaChhLGIpOmEuZihcIkJ1ZmZlcmluZyBwdXQ6IFwiK2MpfWZ1bmN0aW9uIEZoKGEsYil7dmFyIGM9YS5wYVtiXS5hY3Rpb24sZD1hLnBhW2JdLklmLGU9YS5wYVtiXS5KO2EucGFbYl0uR2c9YS5tYTthLkRhKGMsZCxmdW5jdGlvbihkKXthLmYoYytcIiByZXNwb25zZVwiLGQpO2RlbGV0ZSBhLnBhW2JdO2EuWGMtLTswPT09YS5YYyYmKGEucGE9W10pO2UmJmUoZC5zLGQuZCl9KX1oLlRlPWZ1bmN0aW9uKGEpe3RoaXMubWEmJihhPXtjOmF9LHRoaXMuZihcInJlcG9ydFN0YXRzXCIsYSksdGhpcy5EYShcInNcIixhLGZ1bmN0aW9uKGEpe1wib2tcIiE9PWEucyYmdGhpcy5mKFwicmVwb3J0U3RhdHNcIixcIkVycm9yIHNlbmRpbmcgc3RhdHM6IFwiK2EuZCl9KSl9O1xuaC5GZD1mdW5jdGlvbihhKXtpZihcInJcImluIGEpe3RoaXMuZihcImZyb20gc2VydmVyOiBcIitCKGEpKTt2YXIgYj1hLnIsYz10aGlzLlFkW2JdO2MmJihkZWxldGUgdGhpcy5RZFtiXSxjKGEuYikpfWVsc2V7aWYoXCJlcnJvclwiaW4gYSl0aHJvd1wiQSBzZXJ2ZXItc2lkZSBlcnJvciBoYXMgb2NjdXJyZWQ6IFwiK2EuZXJyb3I7XCJhXCJpbiBhJiYoYj1hLmEsYz1hLmIsdGhpcy5mKFwiaGFuZGxlU2VydmVyTWVzc2FnZVwiLGIsYyksXCJkXCI9PT1iP3RoaXMuR2IoYy5wLGMuZCwhMSxjLnQpOlwibVwiPT09Yj90aGlzLkdiKGMucCxjLmQsITAsYy50KTpcImNcIj09PWI/R2godGhpcyxjLnAsYy5xKTpcImFjXCI9PT1iPyhhPWMucyxiPWMuZCxjPXRoaXMuRmEsZGVsZXRlIHRoaXMuRmEsYyYmYy5qZCYmYy5qZChhLGIpKTpcInNkXCI9PT1iP3RoaXMuV2U/dGhpcy5XZShjKTpcIm1zZ1wiaW4gYyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmxvZyhcIkZJUkVCQVNFOiBcIitjLm1zZy5yZXBsYWNlKFwiXFxuXCIsXG5cIlxcbkZJUkVCQVNFOiBcIikpOlBjKFwiVW5yZWNvZ25pemVkIGFjdGlvbiByZWNlaXZlZCBmcm9tIHNlcnZlcjogXCIrQihiKStcIlxcbkFyZSB5b3UgdXNpbmcgdGhlIGxhdGVzdCBjbGllbnQ/XCIpKX19O2guVmM9ZnVuY3Rpb24oYSl7dGhpcy5mKFwiY29ubmVjdGlvbiByZWFkeVwiKTt0aGlzLm1hPSEwO3RoaXMuS2M9KG5ldyBEYXRlKS5nZXRUaW1lKCk7dGhpcy5OZSh7c2VydmVyVGltZU9mZnNldDphLShuZXcgRGF0ZSkuZ2V0VGltZSgpfSk7dGhpcy5tZiYmKGE9e30sYVtcInNkay5qcy5cIitcIjIuMi41XCIucmVwbGFjZSgvXFwuL2csXCItXCIpXT0xLGtnKCkmJihhW1wiZnJhbWV3b3JrLmNvcmRvdmFcIl09MSksdGhpcy5UZShhKSk7SGgodGhpcyk7dGhpcy5tZj0hMTt0aGlzLlRjKCEwKX07XG5mdW5jdGlvbiB5aChhLGIpe0ooIWEuU2EsXCJTY2hlZHVsaW5nIGEgY29ubmVjdCB3aGVuIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkL2luZz9cIik7YS5TYiYmY2xlYXJUaW1lb3V0KGEuU2IpO2EuU2I9c2V0VGltZW91dChmdW5jdGlvbigpe2EuU2I9bnVsbDtJaChhKX0sTWF0aC5mbG9vcihiKSl9aC56Zz1mdW5jdGlvbihhKXthJiYhdGhpcy51YyYmdGhpcy4kYT09PXRoaXMuQ2QmJih0aGlzLmYoXCJXaW5kb3cgYmVjYW1lIHZpc2libGUuICBSZWR1Y2luZyBkZWxheS5cIiksdGhpcy4kYT0xRTMsdGhpcy5TYXx8eWgodGhpcywwKSk7dGhpcy51Yz1hfTtoLnhnPWZ1bmN0aW9uKGEpe2E/KHRoaXMuZihcIkJyb3dzZXIgd2VudCBvbmxpbmUuXCIpLHRoaXMuJGE9MUUzLHRoaXMuU2F8fHloKHRoaXMsMCkpOih0aGlzLmYoXCJCcm93c2VyIHdlbnQgb2ZmbGluZS4gIEtpbGxpbmcgY29ubmVjdGlvbi5cIiksdGhpcy5TYSYmdGhpcy5TYS5jbG9zZSgpKX07XG5oLkNmPWZ1bmN0aW9uKCl7dGhpcy5mKFwiZGF0YSBjbGllbnQgZGlzY29ubmVjdGVkXCIpO3RoaXMubWE9ITE7dGhpcy5TYT1udWxsO2Zvcih2YXIgYT0wO2E8dGhpcy5wYS5sZW5ndGg7YSsrKXt2YXIgYj10aGlzLnBhW2FdO2ImJlwiaFwiaW4gYi5JZiYmYi5HZyYmKGIuSiYmYi5KKFwiZGlzY29ubmVjdFwiKSxkZWxldGUgdGhpcy5wYVthXSx0aGlzLlhjLS0pfTA9PT10aGlzLlhjJiYodGhpcy5wYT1bXSk7dGhpcy5RZD17fTtKaCh0aGlzKSYmKHRoaXMudWM/dGhpcy5LYyYmKDNFNDwobmV3IERhdGUpLmdldFRpbWUoKS10aGlzLktjJiYodGhpcy4kYT0xRTMpLHRoaXMuS2M9bnVsbCk6KHRoaXMuZihcIldpbmRvdyBpc24ndCB2aXNpYmxlLiAgRGVsYXlpbmcgcmVjb25uZWN0LlwiKSx0aGlzLiRhPXRoaXMuQ2QsdGhpcy5GZT0obmV3IERhdGUpLmdldFRpbWUoKSksYT1NYXRoLm1heCgwLHRoaXMuJGEtKChuZXcgRGF0ZSkuZ2V0VGltZSgpLXRoaXMuRmUpKSxhKj1NYXRoLnJhbmRvbSgpLHRoaXMuZihcIlRyeWluZyB0byByZWNvbm5lY3QgaW4gXCIrXG5hK1wibXNcIikseWgodGhpcyxhKSx0aGlzLiRhPU1hdGgubWluKHRoaXMuQ2QsMS4zKnRoaXMuJGEpKTt0aGlzLlRjKCExKX07ZnVuY3Rpb24gSWgoYSl7aWYoSmgoYSkpe2EuZihcIk1ha2luZyBhIGNvbm5lY3Rpb24gYXR0ZW1wdFwiKTthLkZlPShuZXcgRGF0ZSkuZ2V0VGltZSgpO2EuS2M9bnVsbDt2YXIgYj1xKGEuRmQsYSksYz1xKGEuVmMsYSksZD1xKGEuQ2YsYSksZT1hLmlkK1wiOlwiK3poKys7YS5TYT1uZXcga2goZSxhLkgsYixjLGQsZnVuY3Rpb24oYil7UShiK1wiIChcIithLkgudG9TdHJpbmcoKStcIilcIik7YS53Zj0hMH0pfX1oLnliPWZ1bmN0aW9uKCl7dGhpcy5EZT0hMDt0aGlzLlNhP3RoaXMuU2EuY2xvc2UoKToodGhpcy5TYiYmKGNsZWFyVGltZW91dCh0aGlzLlNiKSx0aGlzLlNiPW51bGwpLHRoaXMubWEmJnRoaXMuQ2YoKSl9O2gucWM9ZnVuY3Rpb24oKXt0aGlzLkRlPSExO3RoaXMuJGE9MUUzO3RoaXMuU2F8fHloKHRoaXMsMCl9O1xuZnVuY3Rpb24gR2goYSxiLGMpe2M9Yz9RYShjLGZ1bmN0aW9uKGEpe3JldHVybiBXYyhhKX0pLmpvaW4oXCIkXCIpOlwiZGVmYXVsdFwiOyhhPUJoKGEsYixjKSkmJmEuSiYmYS5KKFwicGVybWlzc2lvbl9kZW5pZWRcIil9ZnVuY3Rpb24gQmgoYSxiLGMpe2I9KG5ldyBLKGIpKS50b1N0cmluZygpO3ZhciBkO24oYS5hYVtiXSk/KGQ9YS5hYVtiXVtjXSxkZWxldGUgYS5hYVtiXVtjXSwwPT09cGEoYS5hYVtiXSkmJmRlbGV0ZSBhLmFhW2JdKTpkPXZvaWQgMDtyZXR1cm4gZH1mdW5jdGlvbiBIaChhKXtDaChhKTtyKGEuYWEsZnVuY3Rpb24oYil7cihiLGZ1bmN0aW9uKGIpe0FoKGEsYil9KX0pO2Zvcih2YXIgYj0wO2I8YS5wYS5sZW5ndGg7YisrKWEucGFbYl0mJkZoKGEsYik7Zm9yKDthLlVjLmxlbmd0aDspYj1hLlVjLnNoaWZ0KCksRGgoYSxiLmFjdGlvbixiLlpjLGIuZGF0YSxiLkopfWZ1bmN0aW9uIEpoKGEpe3ZhciBiO2I9TGYudWIoKS5pYztyZXR1cm4hYS53ZiYmIWEuRGUmJmJ9O3ZhciBWPXtsZzpmdW5jdGlvbigpe1ZnPWRoPSEwfX07Vi5mb3JjZUxvbmdQb2xsaW5nPVYubGc7Vi5tZz1mdW5jdGlvbigpe1dnPSEwfTtWLmZvcmNlV2ViU29ja2V0cz1WLm1nO1YuTWc9ZnVuY3Rpb24oYSxiKXthLmsuUmEuV2U9Yn07Vi5zZXRTZWN1cml0eURlYnVnQ2FsbGJhY2s9Vi5NZztWLlllPWZ1bmN0aW9uKGEsYil7YS5rLlllKGIpfTtWLnN0YXRzPVYuWWU7Vi5aZT1mdW5jdGlvbihhLGIpe2Euay5aZShiKX07Vi5zdGF0c0luY3JlbWVudENvdW50ZXI9Vi5aZTtWLnBkPWZ1bmN0aW9uKGEpe3JldHVybiBhLmsucGR9O1YuZGF0YVVwZGF0ZUNvdW50PVYucGQ7Vi5wZz1mdW5jdGlvbihhLGIpe2Euay5DZT1ifTtWLmludGVyY2VwdFNlcnZlckRhdGE9Vi5wZztWLnZnPWZ1bmN0aW9uKGEpe25ldyB1ZyhhKX07Vi5vblBvcHVwT3Blbj1WLnZnO1YuS2c9ZnVuY3Rpb24oYSl7Zmc9YX07Vi5zZXRBdXRoZW50aWNhdGlvblNlcnZlcj1WLktnO2Z1bmN0aW9uIFMoYSxiLGMpe3RoaXMuQj1hO3RoaXMuVj1iO3RoaXMuZz1jfVMucHJvdG90eXBlLks9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLksoKX07Uy5wcm90b3R5cGUudmFsPVMucHJvdG90eXBlLks7Uy5wcm90b3R5cGUubGY9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmV4cG9ydFZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLksoITApfTtTLnByb3RvdHlwZS5leHBvcnRWYWw9Uy5wcm90b3R5cGUubGY7Uy5wcm90b3R5cGUua2c9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmV4aXN0c1wiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4hdGhpcy5CLmUoKX07Uy5wcm90b3R5cGUuZXhpc3RzPVMucHJvdG90eXBlLmtnO1xuUy5wcm90b3R5cGUudz1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO2dhKGEpJiYoYT1TdHJpbmcoYSkpO1hmKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsYSk7dmFyIGI9bmV3IEsoYSksYz10aGlzLlYudyhiKTtyZXR1cm4gbmV3IFModGhpcy5CLm9hKGIpLGMsTSl9O1MucHJvdG90eXBlLmNoaWxkPVMucHJvdG90eXBlLnc7Uy5wcm90b3R5cGUuSGE9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtYZihcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLGEpO3ZhciBiPW5ldyBLKGEpO3JldHVybiF0aGlzLkIub2EoYikuZSgpfTtTLnByb3RvdHlwZS5oYXNDaGlsZD1TLnByb3RvdHlwZS5IYTtcblMucHJvdG90eXBlLkE9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmdldFByaW9yaXR5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuQSgpLksoKX07Uy5wcm90b3R5cGUuZ2V0UHJpb3JpdHk9Uy5wcm90b3R5cGUuQTtTLnByb3RvdHlwZS5mb3JFYWNoPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZm9yRWFjaFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmZvckVhY2hcIiwxLGEsITEpO2lmKHRoaXMuQi5OKCkpcmV0dXJuITE7dmFyIGI9dGhpcztyZXR1cm4hIXRoaXMuQi5VKHRoaXMuZyxmdW5jdGlvbihjLGQpe3JldHVybiBhKG5ldyBTKGQsYi5WLncoYyksTSkpfSl9O1MucHJvdG90eXBlLmZvckVhY2g9Uy5wcm90b3R5cGUuZm9yRWFjaDtcblMucHJvdG90eXBlLnRkPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZHJlblwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLk4oKT8hMTohdGhpcy5CLmUoKX07Uy5wcm90b3R5cGUuaGFzQ2hpbGRyZW49Uy5wcm90b3R5cGUudGQ7Uy5wcm90b3R5cGUubmFtZT1mdW5jdGlvbigpe1EoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubmFtZSgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2UuRGF0YVNuYXBzaG90LmtleSgpIGluc3RlYWQuXCIpO3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubmFtZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rZXkoKX07Uy5wcm90b3R5cGUubmFtZT1TLnByb3RvdHlwZS5uYW1lO1MucHJvdG90eXBlLmtleT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3Qua2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLlYua2V5KCl9O1xuUy5wcm90b3R5cGUua2V5PVMucHJvdG90eXBlLmtleTtTLnByb3RvdHlwZS5EYj1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubnVtQ2hpbGRyZW5cIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5EYigpfTtTLnByb3RvdHlwZS5udW1DaGlsZHJlbj1TLnByb3RvdHlwZS5EYjtTLnByb3RvdHlwZS5sYz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLlZ9O1MucHJvdG90eXBlLnJlZj1TLnByb3RvdHlwZS5sYztmdW5jdGlvbiBLaChhLGIpe3RoaXMuSD1hO3RoaXMuVmE9T2IoYSk7dGhpcy5lYT1uZXcgdWI7dGhpcy5FZD0xO3RoaXMuUmE9bnVsbDtifHwwPD0oXCJvYmplY3RcIj09PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5uYXZpZ2F0b3ImJndpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50fHxcIlwiKS5zZWFyY2goL2dvb2dsZWJvdHxnb29nbGUgd2VibWFzdGVyIHRvb2xzfGJpbmdib3R8eWFob28hIHNsdXJwfGJhaWR1c3BpZGVyfHlhbmRleGJvdHxkdWNrZHVja2JvdC9pKT8odGhpcy5jYT1uZXcgQWUodGhpcy5ILHEodGhpcy5HYix0aGlzKSksc2V0VGltZW91dChxKHRoaXMuVGMsdGhpcywhMCksMCkpOnRoaXMuY2E9dGhpcy5SYT1uZXcgd2godGhpcy5ILHEodGhpcy5HYix0aGlzKSxxKHRoaXMuVGMsdGhpcykscSh0aGlzLk5lLHRoaXMpKTt0aGlzLlBnPVBiKGEscShmdW5jdGlvbigpe3JldHVybiBuZXcgSmIodGhpcy5WYSx0aGlzLmNhKX0sdGhpcykpO3RoaXMudGM9bmV3IENmO3RoaXMuQmU9XG5uZXcgbmI7dmFyIGM9dGhpczt0aGlzLnpkPW5ldyBnZih7WGU6ZnVuY3Rpb24oYSxiLGYsZyl7Yj1bXTtmPWMuQmUuaihhLnBhdGgpO2YuZSgpfHwoYj1qZihjLnpkLG5ldyBVYih6ZSxhLnBhdGgsZikpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtnKFwib2tcIil9LDApKTtyZXR1cm4gYn0sWmQ6YmF9KTtMaCh0aGlzLFwiY29ubmVjdGVkXCIsITEpO3RoaXMua2E9bmV3IHFjO3RoaXMuUD1uZXcgRWcoYSxxKHRoaXMuY2EuUCx0aGlzLmNhKSxxKHRoaXMuY2EuZWUsdGhpcy5jYSkscSh0aGlzLktlLHRoaXMpKTt0aGlzLnBkPTA7dGhpcy5DZT1udWxsO3RoaXMuTz1uZXcgZ2Yoe1hlOmZ1bmN0aW9uKGEsYixmLGcpe2MuY2EueGYoYSxmLGIsZnVuY3Rpb24oYixlKXt2YXIgZj1nKGIsZSk7emIoYy5lYSxhLnBhdGgsZil9KTtyZXR1cm5bXX0sWmQ6ZnVuY3Rpb24oYSxiKXtjLmNhLk9mKGEsYil9fSl9aD1LaC5wcm90b3R5cGU7XG5oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMuSC5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK3RoaXMuSC5ob3N0fTtoLm5hbWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ILkNifTtmdW5jdGlvbiBNaChhKXthPWEuQmUuaihuZXcgSyhcIi5pbmZvL3NlcnZlclRpbWVPZmZzZXRcIikpLksoKXx8MDtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKSthfWZ1bmN0aW9uIE5oKGEpe2E9YT17dGltZXN0YW1wOk1oKGEpfTthLnRpbWVzdGFtcD1hLnRpbWVzdGFtcHx8KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIGF9XG5oLkdiPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMucGQrKzt2YXIgZT1uZXcgSyhhKTtiPXRoaXMuQ2U/dGhpcy5DZShhLGIpOmI7YT1bXTtkP2M/KGI9bmEoYixmdW5jdGlvbihhKXtyZXR1cm4gTChhKX0pLGE9cmYodGhpcy5PLGUsYixkKSk6KGI9TChiKSxhPW5mKHRoaXMuTyxlLGIsZCkpOmM/KGQ9bmEoYixmdW5jdGlvbihhKXtyZXR1cm4gTChhKX0pLGE9bWYodGhpcy5PLGUsZCkpOihkPUwoYiksYT1qZih0aGlzLk8sbmV3IFViKHplLGUsZCkpKTtkPWU7MDxhLmxlbmd0aCYmKGQ9T2godGhpcyxlKSk7emIodGhpcy5lYSxkLGEpfTtoLlRjPWZ1bmN0aW9uKGEpe0xoKHRoaXMsXCJjb25uZWN0ZWRcIixhKTshMT09PWEmJlBoKHRoaXMpfTtoLk5lPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7WWMoYSxmdW5jdGlvbihhLGQpe0xoKGIsZCxhKX0pfTtoLktlPWZ1bmN0aW9uKGEpe0xoKHRoaXMsXCJhdXRoZW50aWNhdGVkXCIsYSl9O1xuZnVuY3Rpb24gTGgoYSxiLGMpe2I9bmV3IEsoXCIvLmluZm8vXCIrYik7Yz1MKGMpO3ZhciBkPWEuQmU7ZC5TZD1kLlNkLkcoYixjKTtjPWpmKGEuemQsbmV3IFViKHplLGIsYykpO3piKGEuZWEsYixjKX1oLktiPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMuZihcInNldFwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpiLFhnOmN9KTt2YXIgZT1OaCh0aGlzKTtiPUwoYixjKTt2YXIgZT1zYyhiLGUpLGY9dGhpcy5FZCsrLGU9aGYodGhpcy5PLGEsZSxmLCEwKTt2Yih0aGlzLmVhLGUpO3ZhciBnPXRoaXM7dGhpcy5jYS5wdXQoYS50b1N0cmluZygpLGIuSyghMCksZnVuY3Rpb24oYixjKXt2YXIgZT1cIm9rXCI9PT1iO2V8fFEoXCJzZXQgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO2U9bGYoZy5PLGYsIWUpO3piKGcuZWEsYSxlKTtRaChkLGIsYyl9KTtlPVJoKHRoaXMsYSk7T2godGhpcyxlKTt6Yih0aGlzLmVhLGUsW10pfTtcbmgudXBkYXRlPWZ1bmN0aW9uKGEsYixjKXt0aGlzLmYoXCJ1cGRhdGVcIix7cGF0aDphLnRvU3RyaW5nKCksdmFsdWU6Yn0pO3ZhciBkPSEwLGU9TmgodGhpcyksZj17fTtyKGIsZnVuY3Rpb24oYSxiKXtkPSExO3ZhciBjPUwoYSk7ZltiXT1zYyhjLGUpfSk7aWYoZClCYihcInVwZGF0ZSgpIGNhbGxlZCB3aXRoIGVtcHR5IGRhdGEuICBEb24ndCBkbyBhbnl0aGluZy5cIiksUWgoYyxcIm9rXCIpO2Vsc2V7dmFyIGc9dGhpcy5FZCsrLGs9a2YodGhpcy5PLGEsZixnKTt2Yih0aGlzLmVhLGspO3ZhciBsPXRoaXM7dGhpcy5jYS55ZihhLnRvU3RyaW5nKCksYixmdW5jdGlvbihiLGQpe3ZhciBlPVwib2tcIj09PWI7ZXx8UShcInVwZGF0ZSBhdCBcIithK1wiIGZhaWxlZDogXCIrYik7dmFyIGU9bGYobC5PLGcsIWUpLGY9YTswPGUubGVuZ3RoJiYoZj1PaChsLGEpKTt6YihsLmVhLGYsZSk7UWgoYyxiLGQpfSk7Yj1SaCh0aGlzLGEpO09oKHRoaXMsYik7emIodGhpcy5lYSxhLFtdKX19O1xuZnVuY3Rpb24gUGgoYSl7YS5mKFwib25EaXNjb25uZWN0RXZlbnRzXCIpO3ZhciBiPU5oKGEpLGM9W107cmMocGMoYS5rYSxiKSxGLGZ1bmN0aW9uKGIsZSl7Yz1jLmNvbmNhdChqZihhLk8sbmV3IFViKHplLGIsZSkpKTt2YXIgZj1SaChhLGIpO09oKGEsZil9KTthLmthPW5ldyBxYzt6YihhLmVhLEYsYyl9aC5HZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7dGhpcy5jYS5HZChhLnRvU3RyaW5nKCksZnVuY3Rpb24oZCxlKXtcIm9rXCI9PT1kJiZlZyhjLmthLGEpO1FoKGIsZCxlKX0pfTtmdW5jdGlvbiBTaChhLGIsYyxkKXt2YXIgZT1MKGMpO2EuY2EuTGUoYi50b1N0cmluZygpLGUuSyghMCksZnVuY3Rpb24oYyxnKXtcIm9rXCI9PT1jJiZhLmthLm1jKGIsZSk7UWgoZCxjLGcpfSl9ZnVuY3Rpb24gVGgoYSxiLGMsZCxlKXt2YXIgZj1MKGMsZCk7YS5jYS5MZShiLnRvU3RyaW5nKCksZi5LKCEwKSxmdW5jdGlvbihjLGQpe1wib2tcIj09PWMmJmEua2EubWMoYixmKTtRaChlLGMsZCl9KX1cbmZ1bmN0aW9uIFVoKGEsYixjLGQpe3ZhciBlPSEwLGY7Zm9yKGYgaW4gYyllPSExO2U/KEJiKFwib25EaXNjb25uZWN0KCkudXBkYXRlKCkgY2FsbGVkIHdpdGggZW1wdHkgZGF0YS4gIERvbid0IGRvIGFueXRoaW5nLlwiKSxRaChkLFwib2tcIikpOmEuY2EuQmYoYi50b1N0cmluZygpLGMsZnVuY3Rpb24oZSxmKXtpZihcIm9rXCI9PT1lKWZvcih2YXIgbCBpbiBjKXt2YXIgbT1MKGNbbF0pO2Eua2EubWMoYi53KGwpLG0pfVFoKGQsZSxmKX0pfWZ1bmN0aW9uIFZoKGEsYixjKXtjPVwiLmluZm9cIj09PU8oYi5wYXRoKT9hLnpkLk9iKGIsYyk6YS5PLk9iKGIsYyk7eGIoYS5lYSxiLnBhdGgsYyl9aC55Yj1mdW5jdGlvbigpe3RoaXMuUmEmJnRoaXMuUmEueWIoKX07aC5xYz1mdW5jdGlvbigpe3RoaXMuUmEmJnRoaXMuUmEucWMoKX07XG5oLlllPWZ1bmN0aW9uKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7YT8odGhpcy5ZZHx8KHRoaXMuWWQ9bmV3IEliKHRoaXMuVmEpKSxhPXRoaXMuWWQuZ2V0KCkpOmE9dGhpcy5WYS5nZXQoKTt2YXIgYj1SYShzYShhKSxmdW5jdGlvbihhLGIpe3JldHVybiBNYXRoLm1heChiLmxlbmd0aCxhKX0sMCksYztmb3IoYyBpbiBhKXtmb3IodmFyIGQ9YVtjXSxlPWMubGVuZ3RoO2U8YisyO2UrKyljKz1cIiBcIjtjb25zb2xlLmxvZyhjK2QpfX19O2guWmU9ZnVuY3Rpb24oYSl7TGIodGhpcy5WYSxhKTt0aGlzLlBnLk1mW2FdPSEwfTtoLmY9ZnVuY3Rpb24oYSl7dmFyIGI9XCJcIjt0aGlzLlJhJiYoYj10aGlzLlJhLmlkK1wiOlwiKTtCYihiLGFyZ3VtZW50cyl9O1xuZnVuY3Rpb24gUWgoYSxiLGMpe2EmJkNiKGZ1bmN0aW9uKCl7aWYoXCJva1wiPT1iKWEobnVsbCk7ZWxzZXt2YXIgZD0oYnx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGU9ZDtjJiYoZSs9XCI6IFwiK2MpO2U9RXJyb3IoZSk7ZS5jb2RlPWQ7YShlKX19KX07ZnVuY3Rpb24gV2goYSxiLGMsZCxlKXtmdW5jdGlvbiBmKCl7fWEuZihcInRyYW5zYWN0aW9uIG9uIFwiK2IpO3ZhciBnPW5ldyBVKGEsYik7Zy5FYihcInZhbHVlXCIsZik7Yz17cGF0aDpiLHVwZGF0ZTpjLEo6ZCxzdGF0dXM6bnVsbCxFZjpHYygpLGNmOmUsS2Y6MCxnZTpmdW5jdGlvbigpe2cuZ2MoXCJ2YWx1ZVwiLGYpfSxqZTpudWxsLEFhOm51bGwsbWQ6bnVsbCxuZDpudWxsLG9kOm51bGx9O2Q9YS5PLnVhKGIsdm9pZCAwKXx8QztjLm1kPWQ7ZD1jLnVwZGF0ZShkLksoKSk7aWYobihkKSl7U2YoXCJ0cmFuc2FjdGlvbiBmYWlsZWQ6IERhdGEgcmV0dXJuZWQgXCIsZCxjLnBhdGgpO2Muc3RhdHVzPTE7ZT1EZihhLnRjLGIpO3ZhciBrPWUuQmEoKXx8W107ay5wdXNoKGMpO0VmKGUsayk7XCJvYmplY3RcIj09PXR5cGVvZiBkJiZudWxsIT09ZCYmdShkLFwiLnByaW9yaXR5XCIpPyhrPXcoZCxcIi5wcmlvcml0eVwiKSxKKFFmKGspLFwiSW52YWxpZCBwcmlvcml0eSByZXR1cm5lZCBieSB0cmFuc2FjdGlvbi4gUHJpb3JpdHkgbXVzdCBiZSBhIHZhbGlkIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsLlwiKSk6XG5rPShhLk8udWEoYil8fEMpLkEoKS5LKCk7ZT1OaChhKTtkPUwoZCxrKTtlPXNjKGQsZSk7Yy5uZD1kO2Mub2Q9ZTtjLkFhPWEuRWQrKztjPWhmKGEuTyxiLGUsYy5BYSxjLmNmKTt6YihhLmVhLGIsYyk7WGgoYSl9ZWxzZSBjLmdlKCksYy5uZD1udWxsLGMub2Q9bnVsbCxjLkomJihhPW5ldyBTKGMubWQsbmV3IFUoYSxjLnBhdGgpLE0pLGMuSihudWxsLCExLGEpKX1mdW5jdGlvbiBYaChhLGIpe3ZhciBjPWJ8fGEudGM7Ynx8WWgoYSxjKTtpZihudWxsIT09Yy5CYSgpKXt2YXIgZD1aaChhLGMpO0ooMDxkLmxlbmd0aCxcIlNlbmRpbmcgemVybyBsZW5ndGggdHJhbnNhY3Rpb24gcXVldWVcIik7U2EoZCxmdW5jdGlvbihhKXtyZXR1cm4gMT09PWEuc3RhdHVzfSkmJiRoKGEsYy5wYXRoKCksZCl9ZWxzZSBjLnRkKCkmJmMuVShmdW5jdGlvbihiKXtYaChhLGIpfSl9XG5mdW5jdGlvbiAkaChhLGIsYyl7Zm9yKHZhciBkPVFhKGMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuQWF9KSxlPWEuTy51YShiLGQpfHxDLGQ9ZSxlPWUuaGFzaCgpLGY9MDtmPGMubGVuZ3RoO2YrKyl7dmFyIGc9Y1tmXTtKKDE9PT1nLnN0YXR1cyxcInRyeVRvU2VuZFRyYW5zYWN0aW9uUXVldWVfOiBpdGVtcyBpbiBxdWV1ZSBzaG91bGQgYWxsIGJlIHJ1bi5cIik7Zy5zdGF0dXM9MjtnLktmKys7dmFyIGs9TihiLGcucGF0aCksZD1kLkcoayxnLm5kKX1kPWQuSyghMCk7YS5jYS5wdXQoYi50b1N0cmluZygpLGQsZnVuY3Rpb24oZCl7YS5mKFwidHJhbnNhY3Rpb24gcHV0IHJlc3BvbnNlXCIse3BhdGg6Yi50b1N0cmluZygpLHN0YXR1czpkfSk7dmFyIGU9W107aWYoXCJva1wiPT09ZCl7ZD1bXTtmb3IoZj0wO2Y8Yy5sZW5ndGg7ZisrKXtjW2ZdLnN0YXR1cz0zO2U9ZS5jb25jYXQobGYoYS5PLGNbZl0uQWEpKTtpZihjW2ZdLkope3ZhciBnPWNbZl0ub2Qsaz1uZXcgVShhLGNbZl0ucGF0aCk7ZC5wdXNoKHEoY1tmXS5KLFxubnVsbCxudWxsLCEwLG5ldyBTKGcsayxNKSkpfWNbZl0uZ2UoKX1ZaChhLERmKGEudGMsYikpO1hoKGEpO3piKGEuZWEsYixlKTtmb3IoZj0wO2Y8ZC5sZW5ndGg7ZisrKUNiKGRbZl0pfWVsc2V7aWYoXCJkYXRhc3RhbGVcIj09PWQpZm9yKGY9MDtmPGMubGVuZ3RoO2YrKyljW2ZdLnN0YXR1cz00PT09Y1tmXS5zdGF0dXM/NToxO2Vsc2UgZm9yKFEoXCJ0cmFuc2FjdGlvbiBhdCBcIitiLnRvU3RyaW5nKCkrXCIgZmFpbGVkOiBcIitkKSxmPTA7ZjxjLmxlbmd0aDtmKyspY1tmXS5zdGF0dXM9NSxjW2ZdLmplPWQ7T2goYSxiKX19LGUpfWZ1bmN0aW9uIE9oKGEsYil7dmFyIGM9YWkoYSxiKSxkPWMucGF0aCgpLGM9WmgoYSxjKTtiaShhLGMsZCk7cmV0dXJuIGR9XG5mdW5jdGlvbiBiaShhLGIsYyl7aWYoMCE9PWIubGVuZ3RoKXtmb3IodmFyIGQ9W10sZT1bXSxmPVFhKGIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuQWF9KSxnPTA7ZzxiLmxlbmd0aDtnKyspe3ZhciBrPWJbZ10sbD1OKGMsay5wYXRoKSxtPSExLHY7SihudWxsIT09bCxcInJlcnVuVHJhbnNhY3Rpb25zVW5kZXJOb2RlXzogcmVsYXRpdmVQYXRoIHNob3VsZCBub3QgYmUgbnVsbC5cIik7aWYoNT09PWsuc3RhdHVzKW09ITAsdj1rLmplLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKTtlbHNlIGlmKDE9PT1rLnN0YXR1cylpZigyNTw9ay5LZiltPSEwLHY9XCJtYXhyZXRyeVwiLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKTtlbHNle3ZhciB5PWEuTy51YShrLnBhdGgsZil8fEM7ay5tZD15O3ZhciBJPWJbZ10udXBkYXRlKHkuSygpKTtuKEkpPyhTZihcInRyYW5zYWN0aW9uIGZhaWxlZDogRGF0YSByZXR1cm5lZCBcIixJLGsucGF0aCksbD1MKEkpLFwib2JqZWN0XCI9PT10eXBlb2YgSSYmbnVsbCE9XG5JJiZ1KEksXCIucHJpb3JpdHlcIil8fChsPWwuZGEoeS5BKCkpKSx5PWsuQWEsST1OaChhKSxJPXNjKGwsSSksay5uZD1sLGsub2Q9SSxrLkFhPWEuRWQrKyxWYShmLHkpLGU9ZS5jb25jYXQoaGYoYS5PLGsucGF0aCxJLGsuQWEsay5jZikpLGU9ZS5jb25jYXQobGYoYS5PLHksITApKSk6KG09ITAsdj1cIm5vZGF0YVwiLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKSl9emIoYS5lYSxjLGUpO2U9W107bSYmKGJbZ10uc3RhdHVzPTMsc2V0VGltZW91dChiW2ddLmdlLE1hdGguZmxvb3IoMCkpLGJbZ10uSiYmKFwibm9kYXRhXCI9PT12PyhrPW5ldyBVKGEsYltnXS5wYXRoKSxkLnB1c2gocShiW2ddLkosbnVsbCxudWxsLCExLG5ldyBTKGJbZ10ubWQsayxNKSkpKTpkLnB1c2gocShiW2ddLkosbnVsbCxFcnJvcih2KSwhMSxudWxsKSkpKX1ZaChhLGEudGMpO2ZvcihnPTA7ZzxkLmxlbmd0aDtnKyspQ2IoZFtnXSk7WGgoYSl9fVxuZnVuY3Rpb24gYWkoYSxiKXtmb3IodmFyIGMsZD1hLnRjO251bGwhPT0oYz1PKGIpKSYmbnVsbD09PWQuQmEoKTspZD1EZihkLGMpLGI9RyhiKTtyZXR1cm4gZH1mdW5jdGlvbiBaaChhLGIpe3ZhciBjPVtdO2NpKGEsYixjKTtjLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5FZi1iLkVmfSk7cmV0dXJuIGN9ZnVuY3Rpb24gY2koYSxiLGMpe3ZhciBkPWIuQmEoKTtpZihudWxsIT09ZClmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyljLnB1c2goZFtlXSk7Yi5VKGZ1bmN0aW9uKGIpe2NpKGEsYixjKX0pfWZ1bmN0aW9uIFloKGEsYil7dmFyIGM9Yi5CYSgpO2lmKGMpe2Zvcih2YXIgZD0wLGU9MDtlPGMubGVuZ3RoO2UrKykzIT09Y1tlXS5zdGF0dXMmJihjW2RdPWNbZV0sZCsrKTtjLmxlbmd0aD1kO0VmKGIsMDxjLmxlbmd0aD9jOm51bGwpfWIuVShmdW5jdGlvbihiKXtZaChhLGIpfSl9XG5mdW5jdGlvbiBSaChhLGIpe3ZhciBjPWFpKGEsYikucGF0aCgpLGQ9RGYoYS50YyxiKTtIZihkLGZ1bmN0aW9uKGIpe2RpKGEsYil9KTtkaShhLGQpO0dmKGQsZnVuY3Rpb24oYil7ZGkoYSxiKX0pO3JldHVybiBjfVxuZnVuY3Rpb24gZGkoYSxiKXt2YXIgYz1iLkJhKCk7aWYobnVsbCE9PWMpe2Zvcih2YXIgZD1bXSxlPVtdLGY9LTEsZz0wO2c8Yy5sZW5ndGg7ZysrKTQhPT1jW2ddLnN0YXR1cyYmKDI9PT1jW2ddLnN0YXR1cz8oSihmPT09Zy0xLFwiQWxsIFNFTlQgaXRlbXMgc2hvdWxkIGJlIGF0IGJlZ2lubmluZyBvZiBxdWV1ZS5cIiksZj1nLGNbZ10uc3RhdHVzPTQsY1tnXS5qZT1cInNldFwiKTooSigxPT09Y1tnXS5zdGF0dXMsXCJVbmV4cGVjdGVkIHRyYW5zYWN0aW9uIHN0YXR1cyBpbiBhYm9ydFwiKSxjW2ddLmdlKCksZT1lLmNvbmNhdChsZihhLk8sY1tnXS5BYSwhMCkpLGNbZ10uSiYmZC5wdXNoKHEoY1tnXS5KLG51bGwsRXJyb3IoXCJzZXRcIiksITEsbnVsbCkpKSk7LTE9PT1mP0VmKGIsbnVsbCk6Yy5sZW5ndGg9ZisxO3piKGEuZWEsYi5wYXRoKCksZSk7Zm9yKGc9MDtnPGQubGVuZ3RoO2crKylDYihkW2ddKX19O2Z1bmN0aW9uIFcoKXt0aGlzLm5jPXt9O3RoaXMuUGY9ITF9Y2EoVyk7Vy5wcm90b3R5cGUueWI9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5uYyl0aGlzLm5jW2FdLnliKCl9O1cucHJvdG90eXBlLmludGVycnVwdD1XLnByb3RvdHlwZS55YjtXLnByb3RvdHlwZS5xYz1mdW5jdGlvbigpe2Zvcih2YXIgYSBpbiB0aGlzLm5jKXRoaXMubmNbYV0ucWMoKX07Vy5wcm90b3R5cGUucmVzdW1lPVcucHJvdG90eXBlLnFjO1cucHJvdG90eXBlLnVlPWZ1bmN0aW9uKCl7dGhpcy5QZj0hMH07ZnVuY3Rpb24gWChhLGIpe3RoaXMuYWQ9YTt0aGlzLnFhPWJ9WC5wcm90b3R5cGUuY2FuY2VsPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5jYW5jZWxcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLmNhbmNlbFwiLDEsYSwhMCk7dGhpcy5hZC5HZCh0aGlzLnFhLGF8fG51bGwpfTtYLnByb3RvdHlwZS5jYW5jZWw9WC5wcm90b3R5cGUuY2FuY2VsO1gucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsdGhpcy5xYSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLDEsYSwhMCk7U2godGhpcy5hZCx0aGlzLnFhLG51bGwsYSl9O1gucHJvdG90eXBlLnJlbW92ZT1YLnByb3RvdHlwZS5yZW1vdmU7XG5YLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsdGhpcy5xYSk7UmYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIixhLHRoaXMucWEsITEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIiwyLGIsITApO1NoKHRoaXMuYWQsdGhpcy5xYSxhLGIpfTtYLnByb3RvdHlwZS5zZXQ9WC5wcm90b3R5cGUuc2V0O1xuWC5wcm90b3R5cGUuS2I9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIix0aGlzLnFhKTtSZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLGEsdGhpcy5xYSwhMSk7VWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO1RoKHRoaXMuYWQsdGhpcy5xYSxhLGIsYyl9O1gucHJvdG90eXBlLnNldFdpdGhQcmlvcml0eT1YLnByb3RvdHlwZS5LYjtcblgucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIix0aGlzLnFhKTtpZihlYShhKSl7Zm9yKHZhciBjPXt9LGQ9MDtkPGEubGVuZ3RoOysrZCljW1wiXCIrZF09YVtkXTthPWM7UShcIlBhc3NpbmcgYW4gQXJyYXkgdG8gRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIHNldCgpIGlmIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGUgZXhpc3RpbmcgZGF0YSwgb3IgYW4gT2JqZWN0IHdpdGggaW50ZWdlciBrZXlzIGlmIHlvdSByZWFsbHkgZG8gd2FudCB0byBvbmx5IHVwZGF0ZSBzb21lIG9mIHRoZSBjaGlsZHJlbi5cIil9VGYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIixhLHRoaXMucWEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIiwyLGIsITApO1xuVWgodGhpcy5hZCx0aGlzLnFhLGEsYil9O1gucHJvdG90eXBlLnVwZGF0ZT1YLnByb3RvdHlwZS51cGRhdGU7ZnVuY3Rpb24gWShhLGIsYyxkKXt0aGlzLms9YTt0aGlzLnBhdGg9Yjt0aGlzLm89Yzt0aGlzLmpjPWR9XG5mdW5jdGlvbiBlaShhKXt2YXIgYj1udWxsLGM9bnVsbDthLmxhJiYoYj1vZChhKSk7YS5uYSYmKGM9cWQoYSkpO2lmKGEuZz09PVZkKXtpZihhLmxhKXtpZihcIltNSU5fTkFNRV1cIiE9bmQoYSkpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHlvdSBtYXkgb25seSBwYXNzIG9uZSBhcmd1bWVudCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKS5cIik7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBiKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSxvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHN0cmluZy5cIik7fWlmKGEubmEpe2lmKFwiW01BWF9OQU1FXVwiIT1wZChhKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgeW91IG1heSBvbmx5IHBhc3Mgb25lIGFyZ3VtZW50IHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpLlwiKTtpZihcInN0cmluZ1wiIT09XG50eXBlb2YgYyl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksb3IgZXF1YWxUbygpIG11c3QgYmUgYSBzdHJpbmcuXCIpO319ZWxzZSBpZihhLmc9PT1NKXtpZihudWxsIT1iJiYhUWYoYil8fG51bGwhPWMmJiFRZihjKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IHByaW9yaXR5LCB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpIG11c3QgYmUgYSB2YWxpZCBwcmlvcml0eSB2YWx1ZSAobnVsbCwgYSBudW1iZXIsIG9yIGEgc3RyaW5nKS5cIik7fWVsc2UgaWYoSihhLmcgaW5zdGFuY2VvZiBSZHx8YS5nPT09WWQsXCJ1bmtub3duIGluZGV4IHR5cGUuXCIpLG51bGwhPWImJlwib2JqZWN0XCI9PT10eXBlb2YgYnx8bnVsbCE9YyYmXCJvYmplY3RcIj09PXR5cGVvZiBjKXRocm93IEVycm9yKFwiUXVlcnk6IEZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKSBjYW5ub3QgYmUgYW4gb2JqZWN0LlwiKTtcbn1mdW5jdGlvbiBmaShhKXtpZihhLmxhJiZhLm5hJiZhLmlhJiYoIWEuaWF8fFwiXCI9PT1hLk5iKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBDYW4ndCBjb21iaW5lIHN0YXJ0QXQoKSwgZW5kQXQoKSwgYW5kIGxpbWl0KCkuIFVzZSBsaW1pdFRvRmlyc3QoKSBvciBsaW1pdFRvTGFzdCgpIGluc3RlYWQuXCIpO31mdW5jdGlvbiBnaShhLGIpe2lmKCEwPT09YS5qYyl0aHJvdyBFcnJvcihiK1wiOiBZb3UgY2FuJ3QgY29tYmluZSBtdWx0aXBsZSBvcmRlckJ5IGNhbGxzLlwiKTt9WS5wcm90b3R5cGUubGM9ZnVuY3Rpb24oKXt4KFwiUXVlcnkucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiBuZXcgVSh0aGlzLmssdGhpcy5wYXRoKX07WS5wcm90b3R5cGUucmVmPVkucHJvdG90eXBlLmxjO1xuWS5wcm90b3R5cGUuRWI9ZnVuY3Rpb24oYSxiLGMsZCl7eChcIlF1ZXJ5Lm9uXCIsMiw0LGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub25cIixhLCExKTtBKFwiUXVlcnkub25cIiwyLGIsITEpO3ZhciBlPWhpKFwiUXVlcnkub25cIixjLGQpO2lmKFwidmFsdWVcIj09PWEpVmgodGhpcy5rLHRoaXMsbmV3IGpkKGIsZS5jYW5jZWx8fG51bGwsZS5NYXx8bnVsbCkpO2Vsc2V7dmFyIGY9e307ZlthXT1iO1ZoKHRoaXMuayx0aGlzLG5ldyBrZChmLGUuY2FuY2VsLGUuTWEpKX1yZXR1cm4gYn07WS5wcm90b3R5cGUub249WS5wcm90b3R5cGUuRWI7XG5ZLnByb3RvdHlwZS5nYz1mdW5jdGlvbihhLGIsYyl7eChcIlF1ZXJ5Lm9mZlwiLDAsMyxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9mZlwiLGEsITApO0EoXCJRdWVyeS5vZmZcIiwyLGIsITApO2xiKFwiUXVlcnkub2ZmXCIsMyxjKTt2YXIgZD1udWxsLGU9bnVsbDtcInZhbHVlXCI9PT1hP2Q9bmV3IGpkKGJ8fG51bGwsbnVsbCxjfHxudWxsKTphJiYoYiYmKGU9e30sZVthXT1iKSxkPW5ldyBrZChlLG51bGwsY3x8bnVsbCkpO2U9dGhpcy5rO2Q9XCIuaW5mb1wiPT09Tyh0aGlzLnBhdGgpP2UuemQua2IodGhpcyxkKTplLk8ua2IodGhpcyxkKTt4YihlLmVhLHRoaXMucGF0aCxkKX07WS5wcm90b3R5cGUub2ZmPVkucHJvdG90eXBlLmdjO1xuWS5wcm90b3R5cGUuQWc9ZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGcpe2YmJihmPSExLGUuZ2MoYSxjKSxiLmNhbGwoZC5NYSxnKSl9eChcIlF1ZXJ5Lm9uY2VcIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vbmNlXCIsYSwhMSk7QShcIlF1ZXJ5Lm9uY2VcIiwyLGIsITEpO3ZhciBkPWhpKFwiUXVlcnkub25jZVwiLGFyZ3VtZW50c1syXSxhcmd1bWVudHNbM10pLGU9dGhpcyxmPSEwO3RoaXMuRWIoYSxjLGZ1bmN0aW9uKGIpe2UuZ2MoYSxjKTtkLmNhbmNlbCYmZC5jYW5jZWwuY2FsbChkLk1hLGIpfSl9O1kucHJvdG90eXBlLm9uY2U9WS5wcm90b3R5cGUuQWc7XG5ZLnByb3RvdHlwZS5HZT1mdW5jdGlvbihhKXtRKFwiUXVlcnkubGltaXQoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFF1ZXJ5LmxpbWl0VG9GaXJzdCgpIG9yIFF1ZXJ5LmxpbWl0VG9MYXN0KCkgaW5zdGVhZC5cIik7eChcIlF1ZXJ5LmxpbWl0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMuby5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvcmxpbWl0VG9MYXN0LlwiKTt2YXIgYj10aGlzLm8uR2UoYSk7ZmkoYik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYix0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXQ9WS5wcm90b3R5cGUuR2U7XG5ZLnByb3RvdHlwZS5IZT1mdW5jdGlvbihhKXt4KFwiUXVlcnkubGltaXRUb0ZpcnN0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvRmlyc3Q6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm8uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvRmlyc3Q6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9yIGxpbWl0VG9MYXN0KS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsdGhpcy5vLkhlKGEpLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdFRvRmlyc3Q9WS5wcm90b3R5cGUuSGU7XG5ZLnByb3RvdHlwZS5JZT1mdW5jdGlvbihhKXt4KFwiUXVlcnkubGltaXRUb0xhc3RcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9MYXN0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5vLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0xhc3Q6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9yIGxpbWl0VG9MYXN0KS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsdGhpcy5vLkllKGEpLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdFRvTGFzdD1ZLnByb3RvdHlwZS5JZTtcblkucHJvdG90eXBlLkJnPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoXCIka2V5XCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJGtleVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeUtleSgpIGluc3RlYWQuJyk7aWYoXCIkcHJpb3JpdHlcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIkcHJpb3JpdHlcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlQcmlvcml0eSgpIGluc3RlYWQuJyk7aWYoXCIkdmFsdWVcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIkdmFsdWVcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlWYWx1ZSgpIGluc3RlYWQuJyk7V2YoXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIiwxLGEsITEpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIik7dmFyIGI9YmUodGhpcy5vLG5ldyBSZChhKSk7ZWkoYik7cmV0dXJuIG5ldyBZKHRoaXMuayxcbnRoaXMucGF0aCxiLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeUNoaWxkPVkucHJvdG90eXBlLkJnO1kucHJvdG90eXBlLkNnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlLZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlLZXlcIik7dmFyIGE9YmUodGhpcy5vLFZkKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeUtleT1ZLnByb3RvdHlwZS5DZztZLnByb3RvdHlwZS5EZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5UHJpb3JpdHlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlQcmlvcml0eVwiKTt2YXIgYT1iZSh0aGlzLm8sTSk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlQcmlvcml0eT1ZLnByb3RvdHlwZS5EZztcblkucHJvdG90eXBlLkVnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlWYWx1ZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeVZhbHVlXCIpO3ZhciBhPWJlKHRoaXMubyxZZCk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlWYWx1ZT1ZLnByb3RvdHlwZS5FZztcblkucHJvdG90eXBlLlhkPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LnN0YXJ0QXRcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5zdGFydEF0XCIsYSx0aGlzLnBhdGgsITApO1dmKFwiUXVlcnkuc3RhcnRBdFwiLDIsYiwhMCk7dmFyIGM9dGhpcy5vLlhkKGEsYik7ZmkoYyk7ZWkoYyk7aWYodGhpcy5vLmxhKXRocm93IEVycm9yKFwiUXVlcnkuc3RhcnRBdDogU3RhcnRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gc3RhcnRBdCBvciBlcXVhbFRvKS5cIik7bihhKXx8KGI9YT1udWxsKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxjLHRoaXMuamMpfTtZLnByb3RvdHlwZS5zdGFydEF0PVkucHJvdG90eXBlLlhkO1xuWS5wcm90b3R5cGUucWQ9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuZW5kQXRcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5lbmRBdFwiLGEsdGhpcy5wYXRoLCEwKTtXZihcIlF1ZXJ5LmVuZEF0XCIsMixiLCEwKTt2YXIgYz10aGlzLm8ucWQoYSxiKTtmaShjKTtlaShjKTtpZih0aGlzLm8ubmEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lbmRBdDogRW5kaW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxjLHRoaXMuamMpfTtZLnByb3RvdHlwZS5lbmRBdD1ZLnByb3RvdHlwZS5xZDtcblkucHJvdG90eXBlLmhnPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LmVxdWFsVG9cIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5lcXVhbFRvXCIsYSx0aGlzLnBhdGgsITEpO1dmKFwiUXVlcnkuZXF1YWxUb1wiLDIsYiwhMCk7aWYodGhpcy5vLmxhKXRocm93IEVycm9yKFwiUXVlcnkuZXF1YWxUbzogU3RhcnRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO2lmKHRoaXMuby5uYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVxdWFsVG86IEVuZGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7cmV0dXJuIHRoaXMuWGQoYSxiKS5xZChhLGIpfTtZLnByb3RvdHlwZS5lcXVhbFRvPVkucHJvdG90eXBlLmhnO1xuWS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkudG9TdHJpbmdcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Zm9yKHZhciBhPXRoaXMucGF0aCxiPVwiXCIsYz1hLlk7YzxhLm4ubGVuZ3RoO2MrKylcIlwiIT09YS5uW2NdJiYoYis9XCIvXCIrZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhhLm5bY10pKSk7cmV0dXJuIHRoaXMuay50b1N0cmluZygpKyhifHxcIi9cIil9O1kucHJvdG90eXBlLnRvU3RyaW5nPVkucHJvdG90eXBlLnRvU3RyaW5nO1kucHJvdG90eXBlLndhPWZ1bmN0aW9uKCl7dmFyIGE9V2MoY2UodGhpcy5vKSk7cmV0dXJuXCJ7fVwiPT09YT9cImRlZmF1bHRcIjphfTtcbmZ1bmN0aW9uIGhpKGEsYixjKXt2YXIgZD17Y2FuY2VsOm51bGwsTWE6bnVsbH07aWYoYiYmYylkLmNhbmNlbD1iLEEoYSwzLGQuY2FuY2VsLCEwKSxkLk1hPWMsbGIoYSw0LGQuTWEpO2Vsc2UgaWYoYilpZihcIm9iamVjdFwiPT09dHlwZW9mIGImJm51bGwhPT1iKWQuTWE9YjtlbHNlIGlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiKWQuY2FuY2VsPWI7ZWxzZSB0aHJvdyBFcnJvcih6KGEsMywhMCkrXCIgbXVzdCBlaXRoZXIgYmUgYSBjYW5jZWwgY2FsbGJhY2sgb3IgYSBjb250ZXh0IG9iamVjdC5cIik7cmV0dXJuIGR9O3ZhciBaPXt9O1oudmM9d2g7Wi5EYXRhQ29ubmVjdGlvbj1aLnZjO3doLnByb3RvdHlwZS5PZz1mdW5jdGlvbihhLGIpe3RoaXMuRGEoXCJxXCIse3A6YX0sYil9O1oudmMucHJvdG90eXBlLnNpbXBsZUxpc3Rlbj1aLnZjLnByb3RvdHlwZS5PZzt3aC5wcm90b3R5cGUuZ2c9ZnVuY3Rpb24oYSxiKXt0aGlzLkRhKFwiZWNob1wiLHtkOmF9LGIpfTtaLnZjLnByb3RvdHlwZS5lY2hvPVoudmMucHJvdG90eXBlLmdnO3doLnByb3RvdHlwZS5pbnRlcnJ1cHQ9d2gucHJvdG90eXBlLnliO1ouU2Y9a2g7Wi5SZWFsVGltZUNvbm5lY3Rpb249Wi5TZjtraC5wcm90b3R5cGUuc2VuZFJlcXVlc3Q9a2gucHJvdG90eXBlLkRhO2toLnByb3RvdHlwZS5jbG9zZT1raC5wcm90b3R5cGUuY2xvc2U7XG5aLm9nPWZ1bmN0aW9uKGEpe3ZhciBiPXdoLnByb3RvdHlwZS5wdXQ7d2gucHJvdG90eXBlLnB1dD1mdW5jdGlvbihjLGQsZSxmKXtuKGYpJiYoZj1hKCkpO2IuY2FsbCh0aGlzLGMsZCxlLGYpfTtyZXR1cm4gZnVuY3Rpb24oKXt3aC5wcm90b3R5cGUucHV0PWJ9fTtaLmhpamFja0hhc2g9Wi5vZztaLlJmPUVjO1ouQ29ubmVjdGlvblRhcmdldD1aLlJmO1oud2E9ZnVuY3Rpb24oYSl7cmV0dXJuIGEud2EoKX07Wi5xdWVyeUlkZW50aWZpZXI9Wi53YTtaLnFnPWZ1bmN0aW9uKGEpe3JldHVybiBhLmsuUmEuYWF9O1oubGlzdGVucz1aLnFnO1oudWU9ZnVuY3Rpb24oYSl7YS51ZSgpfTtaLmZvcmNlUmVzdENsaWVudD1aLnVlO2Z1bmN0aW9uIFUoYSxiKXt2YXIgYyxkLGU7aWYoYSBpbnN0YW5jZW9mIEtoKWM9YSxkPWI7ZWxzZXt4KFwibmV3IEZpcmViYXNlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO2Q9UmMoYXJndW1lbnRzWzBdKTtjPWQuUWc7XCJmaXJlYmFzZVwiPT09ZC5kb21haW4mJlFjKGQuaG9zdCtcIiBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIDxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbSBpbnN0ZWFkXCIpO2N8fFFjKFwiQ2Fubm90IHBhcnNlIEZpcmViYXNlIHVybC4gUGxlYXNlIHVzZSBodHRwczovLzxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbVwiKTtkLmxifHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmxvY2F0aW9uJiZ3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJi0xIT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwczpcIikmJlEoXCJJbnNlY3VyZSBGaXJlYmFzZSBhY2Nlc3MgZnJvbSBhIHNlY3VyZSBwYWdlLiBQbGVhc2UgdXNlIGh0dHBzIGluIGNhbGxzIHRvIG5ldyBGaXJlYmFzZSgpLlwiKTtcbmM9bmV3IEVjKGQuaG9zdCxkLmxiLGMsXCJ3c1wiPT09ZC5zY2hlbWV8fFwid3NzXCI9PT1kLnNjaGVtZSk7ZD1uZXcgSyhkLlpjKTtlPWQudG9TdHJpbmcoKTt2YXIgZjshKGY9IXAoYy5ob3N0KXx8MD09PWMuaG9zdC5sZW5ndGh8fCFQZihjLkNiKSkmJihmPTAhPT1lLmxlbmd0aCkmJihlJiYoZT1lLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSksZj0hKHAoZSkmJjAhPT1lLmxlbmd0aCYmIU9mLnRlc3QoZSkpKTtpZihmKXRocm93IEVycm9yKHooXCJuZXcgRmlyZWJhc2VcIiwxLCExKSsnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIFVSTCBhbmQgdGhlIHBhdGggY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIi4nKTtpZihiKWlmKGIgaW5zdGFuY2VvZiBXKWU9YjtlbHNlIGlmKHAoYikpZT1XLnViKCksYy5MZD1iO2Vsc2UgdGhyb3cgRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIEZpcmViYXNlLkNvbnRleHQgZm9yIHNlY29uZCBhcmd1bWVudCB0byBuZXcgRmlyZWJhc2UoKVwiKTtcbmVsc2UgZT1XLnViKCk7Zj1jLnRvU3RyaW5nKCk7dmFyIGc9dyhlLm5jLGYpO2d8fChnPW5ldyBLaChjLGUuUGYpLGUubmNbZl09Zyk7Yz1nfVkuY2FsbCh0aGlzLGMsZCwkZCwhMSl9bWEoVSxZKTt2YXIgaWk9VSxqaT1bXCJGaXJlYmFzZVwiXSxraT1hYTtqaVswXWluIGtpfHwha2kuZXhlY1NjcmlwdHx8a2kuZXhlY1NjcmlwdChcInZhciBcIitqaVswXSk7Zm9yKHZhciBsaTtqaS5sZW5ndGgmJihsaT1qaS5zaGlmdCgpKTspIWppLmxlbmd0aCYmbihpaSk/a2lbbGldPWlpOmtpPWtpW2xpXT9raVtsaV06a2lbbGldPXt9O1UucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXtRKFwiRmlyZWJhc2UubmFtZSgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2Uua2V5KCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMua2V5KCl9O1UucHJvdG90eXBlLm5hbWU9VS5wcm90b3R5cGUubmFtZTtcblUucHJvdG90eXBlLmtleT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5rZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMucGF0aC5lKCk/bnVsbDp2Yyh0aGlzLnBhdGgpfTtVLnByb3RvdHlwZS5rZXk9VS5wcm90b3R5cGUua2V5O1UucHJvdG90eXBlLnc9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLmNoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKGdhKGEpKWE9U3RyaW5nKGEpO2Vsc2UgaWYoIShhIGluc3RhbmNlb2YgSykpaWYobnVsbD09PU8odGhpcy5wYXRoKSl7dmFyIGI9YTtiJiYoYj1iLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSk7WGYoXCJGaXJlYmFzZS5jaGlsZFwiLGIpfWVsc2UgWGYoXCJGaXJlYmFzZS5jaGlsZFwiLGEpO3JldHVybiBuZXcgVSh0aGlzLmssdGhpcy5wYXRoLncoYSkpfTtVLnByb3RvdHlwZS5jaGlsZD1VLnByb3RvdHlwZS53O1xuVS5wcm90b3R5cGUucGFyZW50PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnBhcmVudFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTt2YXIgYT10aGlzLnBhdGgucGFyZW50KCk7cmV0dXJuIG51bGw9PT1hP251bGw6bmV3IFUodGhpcy5rLGEpfTtVLnByb3RvdHlwZS5wYXJlbnQ9VS5wcm90b3R5cGUucGFyZW50O1UucHJvdG90eXBlLnJvb3Q9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgYT10aGlzO251bGwhPT1hLnBhcmVudCgpOylhPWEucGFyZW50KCk7cmV0dXJuIGF9O1UucHJvdG90eXBlLnJvb3Q9VS5wcm90b3R5cGUucm9vdDtcblUucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2Uuc2V0XCIsYSx0aGlzLnBhdGgsITEpO0EoXCJGaXJlYmFzZS5zZXRcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgsYSxudWxsLGJ8fG51bGwpfTtVLnByb3RvdHlwZS5zZXQ9VS5wcm90b3R5cGUuc2V0O1xuVS5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnVwZGF0ZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnVwZGF0ZVwiLHRoaXMucGF0aCk7aWYoZWEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO1EoXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfVRmKFwiRmlyZWJhc2UudXBkYXRlXCIsYSx0aGlzLnBhdGgpO0EoXCJGaXJlYmFzZS51cGRhdGVcIiwyLGIsITApO3RoaXMuay51cGRhdGUodGhpcy5wYXRoLGEsYnx8bnVsbCl9O1UucHJvdG90eXBlLnVwZGF0ZT1VLnByb3RvdHlwZS51cGRhdGU7XG5VLnByb3RvdHlwZS5LYj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIixhLHRoaXMucGF0aCwhMSk7VWYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIpO0EoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5IGZhaWxlZDogXCIrdGhpcy5rZXkoKStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7dGhpcy5rLktiKHRoaXMucGF0aCxhLGIsY3x8bnVsbCl9O1UucHJvdG90eXBlLnNldFdpdGhQcmlvcml0eT1VLnByb3RvdHlwZS5LYjtcblUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucmVtb3ZlXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UucmVtb3ZlXCIsMSxhLCEwKTt0aGlzLnNldChudWxsLGEpfTtVLnByb3RvdHlwZS5yZW1vdmU9VS5wcm90b3R5cGUucmVtb3ZlO1xuVS5wcm90b3R5cGUudHJhbnNhY3Rpb249ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLGEsITEpO0EoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDIsYiwhMCk7aWYobihjKSYmXCJib29sZWFuXCIhPXR5cGVvZiBjKXRocm93IEVycm9yKHooXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDMsITApK1wibXVzdCBiZSBhIGJvb2xlYW4uXCIpO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2UudHJhbnNhY3Rpb24gZmFpbGVkOiBcIit0aGlzLmtleSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGMmJihjPSEwKTtXaCh0aGlzLmssdGhpcy5wYXRoLGEsYnx8bnVsbCxjKX07VS5wcm90b3R5cGUudHJhbnNhY3Rpb249VS5wcm90b3R5cGUudHJhbnNhY3Rpb247XG5VLnByb3RvdHlwZS5MZz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsdGhpcy5wYXRoKTtVZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMSxhKTtBKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgudyhcIi5wcmlvcml0eVwiKSxhLG51bGwsYil9O1UucHJvdG90eXBlLnNldFByaW9yaXR5PVUucHJvdG90eXBlLkxnO1xuVS5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5wdXNoXCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucHVzaFwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5wdXNoXCIsYSx0aGlzLnBhdGgsITApO0EoXCJGaXJlYmFzZS5wdXNoXCIsMixiLCEwKTt2YXIgYz1NaCh0aGlzLmspLGM9S2YoYyksYz10aGlzLncoYyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhJiZudWxsIT09YSYmYy5zZXQoYSxiKTtyZXR1cm4gY307VS5wcm90b3R5cGUucHVzaD1VLnByb3RvdHlwZS5wdXNoO1UucHJvdG90eXBlLmpiPWZ1bmN0aW9uKCl7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3RcIix0aGlzLnBhdGgpO3JldHVybiBuZXcgWCh0aGlzLmssdGhpcy5wYXRoKX07VS5wcm90b3R5cGUub25EaXNjb25uZWN0PVUucHJvdG90eXBlLmpiO1xuVS5wcm90b3R5cGUuUD1mdW5jdGlvbihhLGIsYyl7UShcIkZpcmViYXNlUmVmLmF1dGgoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLmF1dGhXaXRoQ3VzdG9tVG9rZW4oKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuYXV0aFwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhcIixhKTtBKFwiRmlyZWJhc2UuYXV0aFwiLDIsYiwhMCk7QShcIkZpcmViYXNlLmF1dGhcIiwzLGIsITApO0tnKHRoaXMuay5QLGEse30se3JlbWVtYmVyOlwibm9uZVwifSxiLGMpfTtVLnByb3RvdHlwZS5hdXRoPVUucHJvdG90eXBlLlA7VS5wcm90b3R5cGUuZWU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLnVuYXV0aFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UudW5hdXRoXCIsMSxhLCEwKTtMZyh0aGlzLmsuUCxhKX07VS5wcm90b3R5cGUudW5hdXRoPVUucHJvdG90eXBlLmVlO1xuVS5wcm90b3R5cGUud2U9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ2V0QXV0aFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rLlAud2UoKX07VS5wcm90b3R5cGUuZ2V0QXV0aD1VLnByb3RvdHlwZS53ZTtVLnByb3RvdHlwZS51Zz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9uQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vbkF1dGhcIiwyLGIpO3RoaXMuay5QLkViKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtVLnByb3RvdHlwZS5vbkF1dGg9VS5wcm90b3R5cGUudWc7VS5wcm90b3R5cGUudGc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vZmZBdXRoXCIsMixiKTt0aGlzLmsuUC5nYyhcImF1dGhfc3RhdHVzXCIsYSxiKX07VS5wcm90b3R5cGUub2ZmQXV0aD1VLnByb3RvdHlwZS50ZztcblUucHJvdG90eXBlLldmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIixhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsMyxjLCEwKTtLZyh0aGlzLmsuUCxhLHt9LGN8fHt9LGIpfTtVLnByb3RvdHlwZS5hdXRoV2l0aEN1c3RvbVRva2VuPVUucHJvdG90eXBlLldmO1UucHJvdG90eXBlLlhmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpOyRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMSxhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDMsYywhMCk7UGcodGhpcy5rLlAsYSxjLGIpfTtcblUucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhQb3B1cD1VLnByb3RvdHlwZS5YZjtVLnByb3RvdHlwZS5ZZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwzLGMsITApO3ZhciBkPXRoaXMuay5QO05nKGQpO3ZhciBlPVt3Z10sZj1pZyhjKTtcImFub255bW91c1wiPT09YXx8XCJmaXJlYmFzZVwiPT09YT9SKGIseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpOihQLnNldChcInJlZGlyZWN0X2NsaWVudF9vcHRpb25zXCIsZi5sZCksT2coZCxlLFwiL2F1dGgvXCIrYSxmLGIpKX07VS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFJlZGlyZWN0PVUucHJvdG90eXBlLllmO1xuVS5wcm90b3R5cGUuWmY9ZnVuY3Rpb24oYSxiLGMsZCl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsNCxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsYywhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiw0LGQsITApO3AoYik/KCRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiKSxNZyh0aGlzLmsuUCxhK1wiL3Rva2VuXCIse2FjY2Vzc190b2tlbjpifSxkLGMpKTooYWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwyLGIsITEpLE1nKHRoaXMuay5QLGErXCIvdG9rZW5cIixiLGQsYykpfTtVLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoVG9rZW49VS5wcm90b3R5cGUuWmY7XG5VLnByb3RvdHlwZS5WZj1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDEsYSwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwyLGIsITApO01nKHRoaXMuay5QLFwiYW5vbnltb3VzXCIse30sYixhKX07VS5wcm90b3R5cGUuYXV0aEFub255bW91c2x5PVUucHJvdG90eXBlLlZmO1xuVS5wcm90b3R5cGUuJGY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDMsYywhMCk7TWcodGhpcy5rLlAsXCJwYXNzd29yZFwiLGEsYyxiKX07VS5wcm90b3R5cGUuYXV0aFdpdGhQYXNzd29yZD1VLnByb3RvdHlwZS4kZjtcblUucHJvdG90eXBlLnJlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5yZShhLGIpfTtVLnByb3RvdHlwZS5jcmVhdGVVc2VyPVUucHJvdG90eXBlLnJlO1UucHJvdG90eXBlLlNlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnJlbW92ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLnJlbW92ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5TZShhLGIpfTtcblUucHJvdG90eXBlLnJlbW92ZVVzZXI9VS5wcm90b3R5cGUuU2U7VS5wcm90b3R5cGUub2U9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcIm9sZFBhc3N3b3JkXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwibmV3UGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5vZShhLGIpfTtVLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZD1VLnByb3RvdHlwZS5vZTtcblUucHJvdG90eXBlLm5lPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwib2xkRW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJuZXdFbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDIsYiwhMSk7dGhpcy5rLlAubmUoYSxiKX07VS5wcm90b3R5cGUuY2hhbmdlRW1haWw9VS5wcm90b3R5cGUubmU7XG5VLnByb3RvdHlwZS5VZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO0EoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5VZShhLGIpfTtVLnByb3RvdHlwZS5yZXNldFBhc3N3b3JkPVUucHJvdG90eXBlLlVlO1UuZ29PZmZsaW5lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdvT2ZmbGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkueWIoKX07VS5nb09ubGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09ubGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkucWMoKX07XG5mdW5jdGlvbiBOYyhhLGIpe0ooIWJ8fCEwPT09YXx8ITE9PT1hLFwiQ2FuJ3QgdHVybiBvbiBjdXN0b20gbG9nZ2VycyBwZXJzaXN0ZW50bHkuXCIpOyEwPT09YT8oXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGNvbnNvbGUubG9nP0FiPXEoY29uc29sZS5sb2csY29uc29sZSk6XCJvYmplY3RcIj09PXR5cGVvZiBjb25zb2xlLmxvZyYmKEFiPWZ1bmN0aW9uKGEpe2NvbnNvbGUubG9nKGEpfSkpLGImJlAuc2V0KFwibG9nZ2luZ19lbmFibGVkXCIsITApKTphP0FiPWE6KEFiPW51bGwsUC5yZW1vdmUoXCJsb2dnaW5nX2VuYWJsZWRcIikpfVUuZW5hYmxlTG9nZ2luZz1OYztVLlNlcnZlclZhbHVlPXtUSU1FU1RBTVA6e1wiLnN2XCI6XCJ0aW1lc3RhbXBcIn19O1UuU0RLX1ZFUlNJT049XCIyLjIuNVwiO1UuSU5URVJOQUw9VjtVLkNvbnRleHQ9VztVLlRFU1RfQUNDRVNTPVo7fSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJlYmFzZTtcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQ3JlYXRlIGEgY2hpbGQgaW5zdGFuY2UgdGhhdCBwcm90b3R5cGFsbHkgaW5laHJpdHNcbiAqIGRhdGEgb24gcGFyZW50LiBUbyBhY2hpZXZlIHRoYXQgd2UgY3JlYXRlIGFuIGludGVybWVkaWF0ZVxuICogY29uc3RydWN0b3Igd2l0aCBpdHMgcHJvdG90eXBlIHBvaW50aW5nIHRvIHBhcmVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW0Jhc2VDdG9yXVxuICogQHJldHVybiB7VnVlfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuJGFkZENoaWxkID0gZnVuY3Rpb24gKG9wdHMsIEJhc2VDdG9yKSB7XG4gIEJhc2VDdG9yID0gQmFzZUN0b3IgfHwgXy5WdWVcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdmFyIHBhcmVudCA9IHRoaXNcbiAgdmFyIENoaWxkVnVlXG4gIHZhciBpbmhlcml0ID0gb3B0cy5pbmhlcml0ICE9PSB1bmRlZmluZWRcbiAgICA/IG9wdHMuaW5oZXJpdFxuICAgIDogQmFzZUN0b3Iub3B0aW9ucy5pbmhlcml0XG4gIGlmIChpbmhlcml0KSB7XG4gICAgdmFyIGN0b3JzID0gcGFyZW50Ll9jaGlsZEN0b3JzXG4gICAgQ2hpbGRWdWUgPSBjdG9yc1tCYXNlQ3Rvci5jaWRdXG4gICAgaWYgKCFDaGlsZFZ1ZSkge1xuICAgICAgdmFyIG9wdGlvbk5hbWUgPSBCYXNlQ3Rvci5vcHRpb25zLm5hbWVcbiAgICAgIHZhciBjbGFzc05hbWUgPSBvcHRpb25OYW1lXG4gICAgICAgID8gXy5jbGFzc2lmeShvcHRpb25OYW1lKVxuICAgICAgICA6ICdWdWVDb21wb25lbnQnXG4gICAgICBDaGlsZFZ1ZSA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgJ3JldHVybiBmdW5jdGlvbiAnICsgY2xhc3NOYW1lICsgJyAob3B0aW9ucykgeycgK1xuICAgICAgICAndGhpcy5jb25zdHJ1Y3RvciA9ICcgKyBjbGFzc05hbWUgKyAnOycgK1xuICAgICAgICAndGhpcy5faW5pdChvcHRpb25zKSB9J1xuICAgICAgKSgpXG4gICAgICBDaGlsZFZ1ZS5vcHRpb25zID0gQmFzZUN0b3Iub3B0aW9uc1xuICAgICAgQ2hpbGRWdWUucHJvdG90eXBlID0gdGhpc1xuICAgICAgY3RvcnNbQmFzZUN0b3IuY2lkXSA9IENoaWxkVnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIENoaWxkVnVlID0gQmFzZUN0b3JcbiAgfVxuICBvcHRzLl9wYXJlbnQgPSBwYXJlbnRcbiAgb3B0cy5fcm9vdCA9IHBhcmVudC4kcm9vdFxuICB2YXIgY2hpbGQgPSBuZXcgQ2hpbGRWdWUob3B0cylcbiAgcmV0dXJuIGNoaWxkXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vd2F0Y2hlcicpXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgZmlsdGVyUkUgPSAvW158XVxcfFtefF0vXG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuJGdldCA9IGZ1bmN0aW9uIChleHApIHtcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHApXG4gIGlmIChyZXMpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHJlcy5nZXQuY2FsbCh0aGlzLCB0aGlzKVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIHZhbHVlIGZyb20gYW4gZXhwcmVzc2lvbiBvbiB0aGlzIHZtLlxuICogVGhlIGV4cHJlc3Npb24gbXVzdCBiZSBhIHZhbGlkIGxlZnQtaGFuZFxuICogZXhwcmVzc2lvbiBpbiBhbiBhc3NpZ25tZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy4kc2V0ID0gZnVuY3Rpb24gKGV4cCwgdmFsKSB7XG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwLCB0cnVlKVxuICBpZiAocmVzICYmIHJlcy5zZXQpIHtcbiAgICByZXMuc2V0LmNhbGwodGhpcywgdGhpcywgdmFsKVxuICB9XG59XG5cbi8qKlxuICogQWRkIGEgcHJvcGVydHkgb24gdGhlIFZNXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLiRhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgdGhpcy5fZGF0YS4kYWRkKGtleSwgdmFsKVxufVxuXG4vKipcbiAqIERlbGV0ZSBhIHByb3BlcnR5IG9uIHRoZSBWTVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLiRkZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHRoaXMuX2RhdGEuJGRlbGV0ZShrZXkpXG59XG5cbi8qKlxuICogV2F0Y2ggYW4gZXhwcmVzc2lvbiwgdHJpZ2dlciBjYWxsYmFjayB3aGVuIGl0c1xuICogdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtCb29sZWFufSBbZGVlcF1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ltbWVkaWF0ZV1cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHVud2F0Y2hGblxuICovXG5cbmV4cG9ydHMuJHdhdGNoID0gZnVuY3Rpb24gKGV4cCwgY2IsIGRlZXAsIGltbWVkaWF0ZSkge1xuICB2YXIgdm0gPSB0aGlzXG4gIHZhciBrZXkgPSBkZWVwID8gZXhwICsgJyoqZGVlcCoqJyA6IGV4cFxuICB2YXIgd2F0Y2hlciA9IHZtLl91c2VyV2F0Y2hlcnNba2V5XVxuICB2YXIgd3JhcHBlZENiID0gZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgY2IuY2FsbCh2bSwgdmFsLCBvbGRWYWwpXG4gIH1cbiAgaWYgKCF3YXRjaGVyKSB7XG4gICAgd2F0Y2hlciA9IHZtLl91c2VyV2F0Y2hlcnNba2V5XSA9XG4gICAgICBuZXcgV2F0Y2hlcih2bSwgZXhwLCB3cmFwcGVkQ2IsIHtcbiAgICAgICAgZGVlcDogZGVlcCxcbiAgICAgICAgdXNlcjogdHJ1ZVxuICAgICAgfSlcbiAgfSBlbHNlIHtcbiAgICB3YXRjaGVyLmFkZENiKHdyYXBwZWRDYilcbiAgfVxuICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgd3JhcHBlZENiKHdhdGNoZXIudmFsdWUpXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHVud2F0Y2hGbiAoKSB7XG4gICAgd2F0Y2hlci5yZW1vdmVDYih3cmFwcGVkQ2IpXG4gICAgaWYgKCF3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgdm0uX3VzZXJXYXRjaGVyc1trZXldID0gbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV2YWx1YXRlIGEgdGV4dCBkaXJlY3RpdmUsIGluY2x1ZGluZyBmaWx0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy4kZXZhbCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIC8vIGNoZWNrIGZvciBmaWx0ZXJzLlxuICBpZiAoZmlsdGVyUkUudGVzdCh0ZXh0KSkge1xuICAgIHZhciBkaXIgPSBkaXJQYXJzZXIucGFyc2UodGV4dClbMF1cbiAgICAvLyB0aGUgZmlsdGVyIHJlZ2V4IGNoZWNrIG1pZ2h0IGdpdmUgZmFsc2UgcG9zaXRpdmVcbiAgICAvLyBmb3IgcGlwZXMgaW5zaWRlIHN0cmluZ3MsIHNvIGl0J3MgcG9zc2libGUgdGhhdFxuICAgIC8vIHdlIGRvbid0IGdldCBhbnkgZmlsdGVycyBoZXJlXG4gICAgcmV0dXJuIGRpci5maWx0ZXJzXG4gICAgICA/IF8uYXBwbHlGaWx0ZXJzKFxuICAgICAgICAgIHRoaXMuJGdldChkaXIuZXhwcmVzc2lvbiksXG4gICAgICAgICAgXy5yZXNvbHZlRmlsdGVycyh0aGlzLCBkaXIuZmlsdGVycykucmVhZCxcbiAgICAgICAgICB0aGlzXG4gICAgICAgIClcbiAgICAgIDogdGhpcy4kZ2V0KGRpci5leHByZXNzaW9uKVxuICB9IGVsc2Uge1xuICAgIC8vIG5vIGZpbHRlclxuICAgIHJldHVybiB0aGlzLiRnZXQodGV4dClcbiAgfVxufVxuXG4vKipcbiAqIEludGVycG9sYXRlIGEgcGllY2Ugb2YgdGVtcGxhdGUgdGV4dC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuJGludGVycG9sYXRlID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UodGV4dClcbiAgdmFyIHZtID0gdGhpc1xuICBpZiAodG9rZW5zKSB7XG4gICAgcmV0dXJuIHRva2Vucy5sZW5ndGggPT09IDFcbiAgICAgID8gdm0uJGV2YWwodG9rZW5zWzBdLnZhbHVlKVxuICAgICAgOiB0b2tlbnMubWFwKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgIHJldHVybiB0b2tlbi50YWdcbiAgICAgICAgICAgID8gdm0uJGV2YWwodG9rZW4udmFsdWUpXG4gICAgICAgICAgICA6IHRva2VuLnZhbHVlXG4gICAgICAgIH0pLmpvaW4oJycpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG4vKipcbiAqIExvZyBpbnN0YW5jZSBkYXRhIGFzIGEgcGxhaW4gSlMgb2JqZWN0XG4gKiBzbyB0aGF0IGl0IGlzIGVhc2llciB0byBpbnNwZWN0IGluIGNvbnNvbGUuXG4gKiBUaGlzIG1ldGhvZCBhc3N1bWVzIGNvbnNvbGUgaXMgYXZhaWxhYmxlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGF0aF1cbiAqL1xuXG5leHBvcnRzLiRsb2cgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgZGF0YSA9IHBhdGhcbiAgICA/IFBhdGguZ2V0KHRoaXMuX2RhdGEsIHBhdGgpXG4gICAgOiB0aGlzLl9kYXRhXG4gIGlmIChkYXRhKSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gIH1cbiAgY29uc29sZS5sb2coZGF0YSlcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxuLyoqXG4gKiBBcHBlbmQgaW5zdGFuY2UgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRhcHBlbmRUbyA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICByZXR1cm4gaW5zZXJ0KFxuICAgIHRoaXMsIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLFxuICAgIGFwcGVuZCwgdHJhbnNpdGlvbi5hcHBlbmRcbiAgKVxufVxuXG4vKipcbiAqIFByZXBlbmQgaW5zdGFuY2UgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRwcmVwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICBpZiAodGFyZ2V0Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgIHRoaXMuJGJlZm9yZSh0YXJnZXQuZmlyc3RDaGlsZCwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuJGFwcGVuZFRvKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogSW5zZXJ0IGluc3RhbmNlIGJlZm9yZSB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJGJlZm9yZSA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICByZXR1cm4gaW5zZXJ0KFxuICAgIHRoaXMsIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLFxuICAgIGJlZm9yZSwgdHJhbnNpdGlvbi5iZWZvcmVcbiAgKVxufVxuXG4vKipcbiAqIEluc2VydCBpbnN0YW5jZSBhZnRlciB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJGFmdGVyID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgaWYgKHRhcmdldC5uZXh0U2libGluZykge1xuICAgIHRoaXMuJGJlZm9yZSh0YXJnZXQubmV4dFNpYmxpbmcsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRhcHBlbmRUbyh0YXJnZXQucGFyZW50Tm9kZSwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVtb3ZlIGluc3RhbmNlIGZyb20gRE9NXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJHJlbW92ZSA9IGZ1bmN0aW9uIChjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdmFyIGluRG9jID0gdGhpcy5faXNBdHRhY2hlZCAmJiBfLmluRG9jKHRoaXMuJGVsKVxuICAvLyBpZiB3ZSBhcmUgbm90IGluIGRvY3VtZW50LCBubyBuZWVkIHRvIGNoZWNrXG4gIC8vIGZvciB0cmFuc2l0aW9uc1xuICBpZiAoIWluRG9jKSB3aXRoVHJhbnNpdGlvbiA9IGZhbHNlXG4gIHZhciBvcFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHJlYWxDYiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaW5Eb2MpIHNlbGYuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gICAgaWYgKGNiKSBjYigpXG4gIH1cbiAgaWYgKFxuICAgIHRoaXMuX2lzQmxvY2sgJiZcbiAgICAhdGhpcy5fYmxvY2tGcmFnbWVudC5oYXNDaGlsZE5vZGVzKClcbiAgKSB7XG4gICAgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2VcbiAgICAgID8gYXBwZW5kXG4gICAgICA6IHRyYW5zaXRpb24ucmVtb3ZlVGhlbkFwcGVuZFxuICAgIGJsb2NrT3AodGhpcywgdGhpcy5fYmxvY2tGcmFnbWVudCwgb3AsIHJlYWxDYilcbiAgfSBlbHNlIHtcbiAgICBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZVxuICAgICAgPyByZW1vdmVcbiAgICAgIDogdHJhbnNpdGlvbi5yZW1vdmVcbiAgICBvcCh0aGlzLiRlbCwgdGhpcywgcmVhbENiKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogU2hhcmVkIERPTSBpbnNlcnRpb24gZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcDEgLSBvcCBmb3Igbm9uLXRyYW5zaXRpb24gaW5zZXJ0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcDIgLSBvcCBmb3IgdHJhbnNpdGlvbiBpbnNlcnRcbiAqIEByZXR1cm4gdm1cbiAqL1xuXG5mdW5jdGlvbiBpbnNlcnQgKHZtLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbiwgb3AxLCBvcDIpIHtcbiAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICB2YXIgdGFyZ2V0SXNEZXRhY2hlZCA9ICFfLmluRG9jKHRhcmdldClcbiAgdmFyIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlIHx8IHRhcmdldElzRGV0YWNoZWRcbiAgICA/IG9wMVxuICAgIDogb3AyXG4gIHZhciBzaG91bGRDYWxsSG9vayA9XG4gICAgIXRhcmdldElzRGV0YWNoZWQgJiZcbiAgICAhdm0uX2lzQXR0YWNoZWQgJiZcbiAgICAhXy5pbkRvYyh2bS4kZWwpXG4gIGlmICh2bS5faXNCbG9jaykge1xuICAgIGJsb2NrT3Aodm0sIHRhcmdldCwgb3AsIGNiKVxuICB9IGVsc2Uge1xuICAgIG9wKHZtLiRlbCwgdGFyZ2V0LCB2bSwgY2IpXG4gIH1cbiAgaWYgKHNob3VsZENhbGxIb29rKSB7XG4gICAgdm0uX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbiAgcmV0dXJuIHZtXG59XG5cbi8qKlxuICogRXhlY3V0ZSBhIHRyYW5zaXRpb24gb3BlcmF0aW9uIG9uIGEgYmxvY2sgaW5zdGFuY2UsXG4gKiBpdGVyYXRpbmcgdGhyb3VnaCBhbGwgaXRzIGJsb2NrIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmZ1bmN0aW9uIGJsb2NrT3AgKHZtLCB0YXJnZXQsIG9wLCBjYikge1xuICB2YXIgY3VycmVudCA9IHZtLl9ibG9ja1N0YXJ0XG4gIHZhciBlbmQgPSB2bS5fYmxvY2tFbmRcbiAgdmFyIG5leHRcbiAgd2hpbGUgKG5leHQgIT09IGVuZCkge1xuICAgIG5leHQgPSBjdXJyZW50Lm5leHRTaWJsaW5nXG4gICAgb3AoY3VycmVudCwgdGFyZ2V0LCB2bSlcbiAgICBjdXJyZW50ID0gbmV4dFxuICB9XG4gIG9wKGVuZCwgdGFyZ2V0LCB2bSwgY2IpXG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIHNlbGVjdG9yc1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsXG4gKi9cblxuZnVuY3Rpb24gcXVlcnkgKGVsKSB7XG4gIHJldHVybiB0eXBlb2YgZWwgPT09ICdzdHJpbmcnXG4gICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgIDogZWxcbn1cblxuLyoqXG4gKiBBcHBlbmQgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICBpZiAoY2IpIGNiKClcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gYmVmb3JlIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgXy5iZWZvcmUoZWwsIHRhcmdldClcbiAgaWYgKGNiKSBjYigpXG59XG5cbi8qKlxuICogUmVtb3ZlIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlIChlbCwgdm0sIGNiKSB7XG4gIF8ucmVtb3ZlKGVsKVxuICBpZiAoY2IpIGNiKClcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5cbmV4cG9ydHMuJG9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAodGhpcy5fZXZlbnRzW2V2ZW50XSB8fCAodGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtdKSlcbiAgICAucHVzaChmbilcbiAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgMSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5cbmV4cG9ydHMuJG9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgc2VsZi4kb2ZmKGV2ZW50LCBvbilcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbiAgb24uZm4gPSBmblxuICB0aGlzLiRvbihldmVudCwgb24pXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gIHZhciBjYnNcbiAgLy8gYWxsXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGlmICh0aGlzLiRwYXJlbnQpIHtcbiAgICAgIGZvciAoZXZlbnQgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICAgIGNicyA9IHRoaXMuX2V2ZW50c1tldmVudF1cbiAgICAgICAgaWYgKGNicykge1xuICAgICAgICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC1jYnMubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICAvLyBzcGVjaWZpYyBldmVudFxuICBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gIGlmICghY2JzKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC1jYnMubGVuZ3RoKVxuICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSBudWxsXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICAvLyBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYlxuICB2YXIgaSA9IGNicy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGNiID0gY2JzW2ldXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC0xKVxuICAgICAgY2JzLnNwbGljZShpLCAxKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGFuIGV2ZW50IG9uIHNlbGYuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKi9cblxuZXhwb3J0cy4kZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICB0aGlzLl9ldmVudENhbmNlbGxlZCA9IGZhbHNlXG4gIHZhciBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gIGlmIChjYnMpIHtcbiAgICAvLyBhdm9pZCBsZWFraW5nIGFyZ3VtZW50czpcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGkpXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV1cbiAgICB9XG4gICAgaSA9IDBcbiAgICBjYnMgPSBjYnMubGVuZ3RoID4gMVxuICAgICAgPyBfLnRvQXJyYXkoY2JzKVxuICAgICAgOiBjYnNcbiAgICBmb3IgKHZhciBsID0gY2JzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGNic1tpXS5hcHBseSh0aGlzLCBhcmdzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgYnJvYWRjYXN0IGFuIGV2ZW50IHRvIGFsbCBjaGlsZHJlbiBpbnN0YW5jZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKi9cblxuZXhwb3J0cy4kYnJvYWRjYXN0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vIGlmIG5vIGNoaWxkIGhhcyByZWdpc3RlcmVkIGZvciB0aGlzIGV2ZW50LFxuICAvLyB0aGVuIHRoZXJlJ3Mgbm8gbmVlZCB0byBicm9hZGNhc3QuXG4gIGlmICghdGhpcy5fZXZlbnRzQ291bnRbZXZlbnRdKSByZXR1cm5cbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGNoaWxkLiRlbWl0LmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpXG4gICAgaWYgKCFjaGlsZC5fZXZlbnRDYW5jZWxsZWQpIHtcbiAgICAgIGNoaWxkLiRicm9hZGNhc3QuYXBwbHkoY2hpbGQsIGFyZ3VtZW50cylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBwcm9wYWdhdGUgYW4gZXZlbnQgdXAgdGhlIHBhcmVudCBjaGFpbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7Li4uKn0gYWRkaXRpb25hbCBhcmd1bWVudHNcbiAqL1xuXG5leHBvcnRzLiRkaXNwYXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudFxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50LiRlbWl0LmFwcGx5KHBhcmVudCwgYXJndW1lbnRzKVxuICAgIHBhcmVudCA9IHBhcmVudC5fZXZlbnRDYW5jZWxsZWRcbiAgICAgID8gbnVsbFxuICAgICAgOiBwYXJlbnQuJHBhcmVudFxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogTW9kaWZ5IHRoZSBsaXN0ZW5lciBjb3VudHMgb24gYWxsIHBhcmVudHMuXG4gKiBUaGlzIGJvb2trZWVwaW5nIGFsbG93cyAkYnJvYWRjYXN0IHRvIHJldHVybiBlYXJseSB3aGVuXG4gKiBubyBjaGlsZCBoYXMgbGlzdGVuZWQgdG8gYSBjZXJ0YWluIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge051bWJlcn0gY291bnRcbiAqL1xuXG52YXIgaG9va1JFID0gL15ob29rOi9cbmZ1bmN0aW9uIG1vZGlmeUxpc3RlbmVyQ291bnQgKHZtLCBldmVudCwgY291bnQpIHtcbiAgdmFyIHBhcmVudCA9IHZtLiRwYXJlbnRcbiAgLy8gaG9va3MgZG8gbm90IGdldCBicm9hZGNhc3RlZCBzbyBubyBuZWVkXG4gIC8vIHRvIGRvIGJvb2trZWVwaW5nIGZvciB0aGVtXG4gIGlmICghcGFyZW50IHx8ICFjb3VudCB8fCBob29rUkUudGVzdChldmVudCkpIHJldHVyblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50Ll9ldmVudHNDb3VudFtldmVudF0gPVxuICAgICAgKHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdIHx8IDApICsgY291bnRcbiAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudFxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG5cbi8qKlxuICogRXhwb3NlIHVzZWZ1bCBpbnRlcm5hbHNcbiAqL1xuXG5leHBvcnRzLnV0aWwgPSBfXG5leHBvcnRzLm5leHRUaWNrID0gXy5uZXh0VGlja1xuZXhwb3J0cy5jb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG5leHBvcnRzLmNvbXBpbGVyID0ge1xuICBjb21waWxlOiByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJyksXG4gIHRyYW5zY2x1ZGU6IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxufVxuXG5leHBvcnRzLnBhcnNlcnMgPSB7XG4gIHBhdGg6IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpLFxuICB0ZXh0OiByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKSxcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKSxcbiAgZGlyZWN0aXZlOiByZXF1aXJlKCcuLi9wYXJzZXJzL2RpcmVjdGl2ZScpLFxuICBleHByZXNzaW9uOiByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxufVxuXG4vKipcbiAqIEVhY2ggaW5zdGFuY2UgY29uc3RydWN0b3IsIGluY2x1ZGluZyBWdWUsIGhhcyBhIHVuaXF1ZVxuICogY2lkLiBUaGlzIGVuYWJsZXMgdXMgdG8gY3JlYXRlIHdyYXBwZWQgXCJjaGlsZFxuICogY29uc3RydWN0b3JzXCIgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UgYW5kIGNhY2hlIHRoZW0uXG4gKi9cblxuZXhwb3J0cy5jaWQgPSAwXG52YXIgY2lkID0gMVxuXG4vKipcbiAqIENsYXNzIGluZWhyaXRhbmNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGV4dGVuZE9wdGlvbnNcbiAqL1xuXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gIGV4dGVuZE9wdGlvbnMgPSBleHRlbmRPcHRpb25zIHx8IHt9XG4gIHZhciBTdXBlciA9IHRoaXNcbiAgdmFyIFN1YiA9IGNyZWF0ZUNsYXNzKFxuICAgIGV4dGVuZE9wdGlvbnMubmFtZSB8fFxuICAgIFN1cGVyLm9wdGlvbnMubmFtZSB8fFxuICAgICdWdWVDb21wb25lbnQnXG4gIClcbiAgU3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3VwZXIucHJvdG90eXBlKVxuICBTdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViXG4gIFN1Yi5jaWQgPSBjaWQrK1xuICBTdWIub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICBTdXBlci5vcHRpb25zLFxuICAgIGV4dGVuZE9wdGlvbnNcbiAgKVxuICBTdWJbJ3N1cGVyJ10gPSBTdXBlclxuICAvLyBhbGxvdyBmdXJ0aGVyIGV4dGVuc2lvblxuICBTdWIuZXh0ZW5kID0gU3VwZXIuZXh0ZW5kXG4gIC8vIGNyZWF0ZSBhc3NldCByZWdpc3RlcnMsIHNvIGV4dGVuZGVkIGNsYXNzZXNcbiAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxuICBjcmVhdGVBc3NldFJlZ2lzdGVycyhTdWIpXG4gIHJldHVybiBTdWJcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN1Yi1jbGFzcyBjb25zdHJ1Y3RvciB3aXRoIHRoZVxuICogZ2l2ZW4gbmFtZS4gVGhpcyBnaXZlcyB1cyBtdWNoIG5pY2VyIG91dHB1dCB3aGVuXG4gKiBsb2dnaW5nIGluc3RhbmNlcyBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQ2xhc3MgKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcgKyBfLmNsYXNzaWZ5KG5hbWUpICtcbiAgICAnIChvcHRpb25zKSB7IHRoaXMuX2luaXQob3B0aW9ucykgfSdcbiAgKSgpXG59XG5cbi8qKlxuICogUGx1Z2luIHN5c3RlbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwbHVnaW5cbiAqL1xuXG5leHBvcnRzLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgLy8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cywgMSlcbiAgYXJncy51bnNoaWZ0KHRoaXMpXG4gIGlmICh0eXBlb2YgcGx1Z2luLmluc3RhbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpXG4gIH0gZWxzZSB7XG4gICAgcGx1Z2luLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBEZWZpbmUgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMgb24gYSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvclxuICovXG5cbnZhciBhc3NldFR5cGVzID0gW1xuICAnZGlyZWN0aXZlJyxcbiAgJ2ZpbHRlcicsXG4gICdwYXJ0aWFsJyxcbiAgJ3RyYW5zaXRpb24nXG5dXG5cbmZ1bmN0aW9uIGNyZWF0ZUFzc2V0UmVnaXN0ZXJzIChDb25zdHJ1Y3Rvcikge1xuXG4gIC8qIEFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIHNoYXJlIHRoZSBzYW1lIHNpZ25hdHVyZTpcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gICAqIEBwYXJhbSB7Kn0gZGVmaW5pdGlvblxuICAgKi9cblxuICBhc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBDb25zdHJ1Y3Rvclt0eXBlXSA9IGZ1bmN0aW9uIChpZCwgZGVmaW5pdGlvbikge1xuICAgICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdID0gZGVmaW5pdGlvblxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICAvKipcbiAgICogQ29tcG9uZW50IHJlZ2lzdHJhdGlvbiBuZWVkcyB0byBhdXRvbWF0aWNhbGx5IGludm9rZVxuICAgKiBWdWUuZXh0ZW5kIG9uIG9iamVjdCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gZGVmaW5pdGlvblxuICAgKi9cblxuICBDb25zdHJ1Y3Rvci5jb21wb25lbnQgPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKSkge1xuICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBpZFxuICAgICAgICBkZWZpbml0aW9uID0gXy5WdWUuZXh0ZW5kKGRlZmluaXRpb24pXG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMuY29tcG9uZW50c1tpZF0gPSBkZWZpbml0aW9uXG4gICAgfVxuICB9XG59XG5cbmNyZWF0ZUFzc2V0UmVnaXN0ZXJzKGV4cG9ydHMpIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG5cbi8qKlxuICogU2V0IGluc3RhbmNlIHRhcmdldCBlbGVtZW50IGFuZCBraWNrIG9mZiB0aGUgY29tcGlsYXRpb25cbiAqIHByb2Nlc3MuIFRoZSBwYXNzZWQgaW4gYGVsYCBjYW4gYmUgYSBzZWxlY3RvciBzdHJpbmcsIGFuXG4gKiBleGlzdGluZyBFbGVtZW50LCBvciBhIERvY3VtZW50RnJhZ21lbnQgKGZvciBibG9ja1xuICogaW5zdGFuY2VzKS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxzdHJpbmd9IGVsXG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy4kbW91bnQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgaWYgKHRoaXMuX2lzQ29tcGlsZWQpIHtcbiAgICBfLndhcm4oJyRtb3VudCgpIHNob3VsZCBiZSBjYWxsZWQgb25seSBvbmNlLicpXG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKCFlbCkge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgfSBlbHNlIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gZWxcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgaWYgKCFlbCkge1xuICAgICAgXy53YXJuKCdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgc2VsZWN0b3IpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbiAgdGhpcy5fY29tcGlsZShlbClcbiAgdGhpcy5faXNDb21waWxlZCA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ2NvbXBpbGVkJylcbiAgaWYgKF8uaW5Eb2ModGhpcy4kZWwpKSB7XG4gICAgdGhpcy5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgICB0aGlzLl9pbml0RE9NSG9va3MoKVxuICAgIHJlYWR5LmNhbGwodGhpcylcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9pbml0RE9NSG9va3MoKVxuICAgIHRoaXMuJG9uY2UoJ2hvb2s6YXR0YWNoZWQnLCByZWFkeSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIE1hcmsgYW4gaW5zdGFuY2UgYXMgcmVhZHkuXG4gKi9cblxuZnVuY3Rpb24gcmVhZHkgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZVxuICB0aGlzLl9pc1JlYWR5ID0gdHJ1ZVxuICB0aGlzLl9jYWxsSG9vaygncmVhZHknKVxufVxuXG4vKipcbiAqIFRlYXJkb3duIHRoZSBpbnN0YW5jZSwgc2ltcGx5IGRlbGVnYXRlIHRvIHRoZSBpbnRlcm5hbFxuICogX2Rlc3Ryb3kuXG4gKi9cblxuZXhwb3J0cy4kZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICB0aGlzLl9kZXN0cm95KHJlbW92ZSwgZGVmZXJDbGVhbnVwKVxufVxuXG4vKipcbiAqIFBhcnRpYWxseSBjb21waWxlIGEgcGllY2Ugb2YgRE9NIGFuZCByZXR1cm4gYVxuICogZGVjb21waWxlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy4kY29tcGlsZSA9IGZ1bmN0aW9uIChlbCkge1xuICByZXR1cm4gY29tcGlsZShlbCwgdGhpcy4kb3B0aW9ucywgdHJ1ZSkodGhpcywgZWwpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIE1BWF9VUERBVEVfQ09VTlQgPSAxMFxuXG4vLyB3ZSBoYXZlIHR3byBzZXBhcmF0ZSBxdWV1ZXM6IG9uZSBmb3IgZGlyZWN0aXZlIHVwZGF0ZXNcbi8vIGFuZCBvbmUgZm9yIHVzZXIgd2F0Y2hlciByZWdpc3RlcmVkIHZpYSAkd2F0Y2goKS5cbi8vIHdlIHdhbnQgdG8gZ3VhcmFudGVlIGRpcmVjdGl2ZSB1cGRhdGVzIHRvIGJlIGNhbGxlZFxuLy8gYmVmb3JlIHVzZXIgd2F0Y2hlcnMgc28gdGhhdCB3aGVuIHVzZXIgd2F0Y2hlcnMgYXJlXG4vLyB0cmlnZ2VyZWQsIHRoZSBET00gd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gaW4gdXBkYXRlZFxuLy8gc3RhdGUuXG52YXIgcXVldWUgPSBbXVxudmFyIHVzZXJRdWV1ZSA9IFtdXG52YXIgaGFzID0ge31cbnZhciB3YWl0aW5nID0gZmFsc2VcbnZhciBmbHVzaGluZyA9IGZhbHNlXG5cbi8qKlxuICogUmVzZXQgdGhlIGJhdGNoZXIncyBzdGF0ZS5cbiAqL1xuXG5mdW5jdGlvbiByZXNldCAoKSB7XG4gIHF1ZXVlID0gW11cbiAgdXNlclF1ZXVlID0gW11cbiAgaGFzID0ge31cbiAgd2FpdGluZyA9IGZhbHNlXG4gIGZsdXNoaW5nID0gZmFsc2Vcbn1cblxuLyoqXG4gKiBGbHVzaCBib3RoIHF1ZXVlcyBhbmQgcnVuIHRoZSBqb2JzLlxuICovXG5cbmZ1bmN0aW9uIGZsdXNoICgpIHtcbiAgZmx1c2hpbmcgPSB0cnVlXG4gIHJ1bihxdWV1ZSlcbiAgcnVuKHVzZXJRdWV1ZSlcbiAgcmVzZXQoKVxufVxuXG4vKipcbiAqIFJ1biB0aGUgam9icyBpbiBhIHNpbmdsZSBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxuICovXG5cbmZ1bmN0aW9uIHJ1biAocXVldWUpIHtcbiAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgam9icyBtaWdodCBiZSBwdXNoZWRcbiAgLy8gYXMgd2UgcnVuIGV4aXN0aW5nIGpvYnNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldLnJ1bigpXG4gIH1cbn1cblxuLyoqXG4gKiBQdXNoIGEgam9iIGludG8gdGhlIGpvYiBxdWV1ZS5cbiAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xuICogcHVzaGVkIHdoZW4gdGhlIHF1ZXVlIGlzIGJlaW5nIGZsdXNoZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGpvYlxuICogICBwcm9wZXJ0aWVzOlxuICogICAtIHtTdHJpbmd8TnVtYmVyfSBpZFxuICogICAtIHtGdW5jdGlvbn0gICAgICBydW5cbiAqL1xuXG5leHBvcnRzLnB1c2ggPSBmdW5jdGlvbiAoam9iKSB7XG4gIHZhciBpZCA9IGpvYi5pZFxuICBpZiAoIWlkIHx8ICFoYXNbaWRdIHx8IGZsdXNoaW5nKSB7XG4gICAgaWYgKCFoYXNbaWRdKSB7XG4gICAgICBoYXNbaWRdID0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBoYXNbaWRdKytcbiAgICAgIC8vIGRldGVjdCBwb3NzaWJsZSBpbmZpbml0ZSB1cGRhdGUgbG9vcHNcbiAgICAgIGlmIChoYXNbaWRdID4gTUFYX1VQREFURV9DT1VOVCkge1xuICAgICAgICBfLndhcm4oXG4gICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBhbiBpbmZpbml0ZSB1cGRhdGUgbG9vcCBmb3IgdGhlICcgK1xuICAgICAgICAgICd3YXRjaGVyIHdpdGggZXhwcmVzc2lvbjogXCInICsgam9iLmV4cHJlc3Npb24gKyAnXCIuJ1xuICAgICAgICApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICAvLyBBIHVzZXIgd2F0Y2hlciBjYWxsYmFjayBjb3VsZCB0cmlnZ2VyIGFub3RoZXJcbiAgICAvLyBkaXJlY3RpdmUgdXBkYXRlIGR1cmluZyB0aGUgZmx1c2hpbmc7IGF0IHRoYXQgdGltZVxuICAgIC8vIHRoZSBkaXJlY3RpdmUgcXVldWUgd291bGQgYWxyZWFkeSBoYXZlIGJlZW4gcnVuLCBzb1xuICAgIC8vIHdlIGNhbGwgdGhhdCB1cGRhdGUgaW1tZWRpYXRlbHkgYXMgaXQgaXMgcHVzaGVkLlxuICAgIGlmIChmbHVzaGluZyAmJiAham9iLnVzZXIpIHtcbiAgICAgIGpvYi5ydW4oKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIDsoam9iLnVzZXIgPyB1c2VyUXVldWUgOiBxdWV1ZSkucHVzaChqb2IpXG4gICAgaWYgKCF3YWl0aW5nKSB7XG4gICAgICB3YWl0aW5nID0gdHJ1ZVxuICAgICAgXy5uZXh0VGljayhmbHVzaClcbiAgICB9XG4gIH1cbn0iLCIvKipcbiAqIEEgZG91Ymx5IGxpbmtlZCBsaXN0LWJhc2VkIExlYXN0IFJlY2VudGx5IFVzZWQgKExSVSlcbiAqIGNhY2hlLiBXaWxsIGtlZXAgbW9zdCByZWNlbnRseSB1c2VkIGl0ZW1zIHdoaWxlXG4gKiBkaXNjYXJkaW5nIGxlYXN0IHJlY2VudGx5IHVzZWQgaXRlbXMgd2hlbiBpdHMgbGltaXQgaXNcbiAqIHJlYWNoZWQuIFRoaXMgaXMgYSBiYXJlLWJvbmUgdmVyc2lvbiBvZlxuICogUmFzbXVzIEFuZGVyc3NvbidzIGpzLWxydTpcbiAqXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9yc21zL2pzLWxydVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBsaW1pdFxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gQ2FjaGUgKGxpbWl0KSB7XG4gIHRoaXMuc2l6ZSA9IDBcbiAgdGhpcy5saW1pdCA9IGxpbWl0XG4gIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IHVuZGVmaW5lZFxuICB0aGlzLl9rZXltYXAgPSB7fVxufVxuXG52YXIgcCA9IENhY2hlLnByb3RvdHlwZVxuXG4vKipcbiAqIFB1dCA8dmFsdWU+IGludG8gdGhlIGNhY2hlIGFzc29jaWF0ZWQgd2l0aCA8a2V5Pi5cbiAqIFJldHVybnMgdGhlIGVudHJ5IHdoaWNoIHdhcyByZW1vdmVkIHRvIG1ha2Ugcm9vbSBmb3JcbiAqIHRoZSBuZXcgZW50cnkuIE90aGVyd2lzZSB1bmRlZmluZWQgaXMgcmV0dXJuZWQuXG4gKiAoaS5lLiBpZiB0aGVyZSB3YXMgZW5vdWdoIHJvb20gYWxyZWFkeSkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7RW50cnl8dW5kZWZpbmVkfVxuICovXG5cbnAucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIGVudHJ5ID0ge1xuICAgIGtleTprZXksXG4gICAgdmFsdWU6dmFsdWVcbiAgfVxuICB0aGlzLl9rZXltYXBba2V5XSA9IGVudHJ5XG4gIGlmICh0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwubmV3ZXIgPSBlbnRyeVxuICAgIGVudHJ5Lm9sZGVyID0gdGhpcy50YWlsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5oZWFkID0gZW50cnlcbiAgfVxuICB0aGlzLnRhaWwgPSBlbnRyeVxuICBpZiAodGhpcy5zaXplID09PSB0aGlzLmxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpZnQoKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuc2l6ZSsrXG4gIH1cbn1cblxuLyoqXG4gKiBQdXJnZSB0aGUgbGVhc3QgcmVjZW50bHkgdXNlZCAob2xkZXN0KSBlbnRyeSBmcm9tIHRoZVxuICogY2FjaGUuIFJldHVybnMgdGhlIHJlbW92ZWQgZW50cnkgb3IgdW5kZWZpbmVkIGlmIHRoZVxuICogY2FjaGUgd2FzIGVtcHR5LlxuICovXG5cbnAuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlbnRyeSA9IHRoaXMuaGVhZFxuICBpZiAoZW50cnkpIHtcbiAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV3ZXJcbiAgICB0aGlzLmhlYWQub2xkZXIgPSB1bmRlZmluZWRcbiAgICBlbnRyeS5uZXdlciA9IGVudHJ5Lm9sZGVyID0gdW5kZWZpbmVkXG4gICAgdGhpcy5fa2V5bWFwW2VudHJ5LmtleV0gPSB1bmRlZmluZWRcbiAgfVxuICByZXR1cm4gZW50cnlcbn1cblxuLyoqXG4gKiBHZXQgYW5kIHJlZ2lzdGVyIHJlY2VudCB1c2Ugb2YgPGtleT4uIFJldHVybnMgdGhlIHZhbHVlXG4gKiBhc3NvY2lhdGVkIHdpdGggPGtleT4gb3IgdW5kZWZpbmVkIGlmIG5vdCBpbiBjYWNoZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJldHVybkVudHJ5XG4gKiBAcmV0dXJuIHtFbnRyeXwqfVxuICovXG5cbnAuZ2V0ID0gZnVuY3Rpb24gKGtleSwgcmV0dXJuRW50cnkpIHtcbiAgdmFyIGVudHJ5ID0gdGhpcy5fa2V5bWFwW2tleV1cbiAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVyblxuICBpZiAoZW50cnkgPT09IHRoaXMudGFpbCkge1xuICAgIHJldHVybiByZXR1cm5FbnRyeVxuICAgICAgPyBlbnRyeVxuICAgICAgOiBlbnRyeS52YWx1ZVxuICB9XG4gIC8vIEhFQUQtLS0tLS0tLS0tLS0tLVRBSUxcbiAgLy8gICA8Lm9sZGVyICAgLm5ld2VyPlxuICAvLyAgPC0tLSBhZGQgZGlyZWN0aW9uIC0tXG4gIC8vICAgQSAgQiAgQyAgPEQ+ICBFXG4gIGlmIChlbnRyeS5uZXdlcikge1xuICAgIGlmIChlbnRyeSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSBlbnRyeS5uZXdlclxuICAgIH1cbiAgICBlbnRyeS5uZXdlci5vbGRlciA9IGVudHJ5Lm9sZGVyIC8vIEMgPC0tIEUuXG4gIH1cbiAgaWYgKGVudHJ5Lm9sZGVyKSB7XG4gICAgZW50cnkub2xkZXIubmV3ZXIgPSBlbnRyeS5uZXdlciAvLyBDLiAtLT4gRVxuICB9XG4gIGVudHJ5Lm5ld2VyID0gdW5kZWZpbmVkIC8vIEQgLS14XG4gIGVudHJ5Lm9sZGVyID0gdGhpcy50YWlsIC8vIEQuIC0tPiBFXG4gIGlmICh0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwubmV3ZXIgPSBlbnRyeSAvLyBFLiA8LS0gRFxuICB9XG4gIHRoaXMudGFpbCA9IGVudHJ5XG4gIHJldHVybiByZXR1cm5FbnRyeVxuICAgID8gZW50cnlcbiAgICA6IGVudHJ5LnZhbHVlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FjaGUiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZVxuXG4vKipcbiAqIENvbXBpbGUgYSB0ZW1wbGF0ZSBhbmQgcmV0dXJuIGEgcmV1c2FibGUgY29tcG9zaXRlIGxpbmtcbiAqIGZ1bmN0aW9uLCB3aGljaCByZWN1cnNpdmVseSBjb250YWlucyBtb3JlIGxpbmsgZnVuY3Rpb25zXG4gKiBpbnNpZGUuIFRoaXMgdG9wIGxldmVsIGNvbXBpbGUgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmVcbiAqIGNhbGxlZCBvbiBpbnN0YW5jZSByb290IG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGFydGlhbFxuICogQHBhcmFtIHtCb29sZWFufSB0cmFuc2NsdWRlZFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZSAoZWwsIG9wdGlvbnMsIHBhcnRpYWwsIHRyYW5zY2x1ZGVkKSB7XG4gIHZhciBpc0Jsb2NrID0gZWwubm9kZVR5cGUgPT09IDExXG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHBhcmFtIGF0dHJpYnV0ZXMuXG4gIHZhciBwYXJhbXMgPSBvcHRpb25zLnBhcmFtQXR0cmlidXRlc1xuICB2YXIgcGFyYW1zTGlua0ZuID0gcGFyYW1zICYmICFwYXJ0aWFsICYmICF0cmFuc2NsdWRlZCAmJiAhaXNCbG9ja1xuICAgID8gY29tcGlsZVBhcmFtQXR0cmlidXRlcyhlbCwgcGFyYW1zLCBvcHRpb25zKVxuICAgIDogbnVsbFxuICAvLyBsaW5rIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSBpdHNlbGYuXG4gIC8vIGlmIHRoaXMgaXMgYSBibG9jayBpbnN0YW5jZSwgd2UgcmV0dXJuIGEgbGluayBmdW5jdGlvblxuICAvLyBmb3IgdGhlIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIGNvbnRhaW5lciwgaWYgYW55LlxuICAvLyBvcHRpb25zLl9jb250YWluZXJBdHRycyBhcmUgY29sbGVjdGVkIGR1cmluZyB0cmFuc2NsdXNpb24uXG4gIHZhciBub2RlTGlua0ZuID0gaXNCbG9ja1xuICAgID8gY29tcGlsZUJsb2NrQ29udGFpbmVyKG9wdGlvbnMuX2NvbnRhaW5lckF0dHJzLCBwYXJhbXMsIG9wdGlvbnMpXG4gICAgOiBjb21waWxlTm9kZShlbCwgb3B0aW9ucylcbiAgLy8gbGluayBmdW5jdGlvbiBmb3IgdGhlIGNoaWxkTm9kZXNcbiAgdmFyIGNoaWxkTGlua0ZuID1cbiAgICAhKG5vZGVMaW5rRm4gJiYgbm9kZUxpbmtGbi50ZXJtaW5hbCkgJiZcbiAgICBlbC50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgIGVsLmhhc0NoaWxkTm9kZXMoKVxuICAgICAgPyBjb21waWxlTm9kZUxpc3QoZWwuY2hpbGROb2Rlcywgb3B0aW9ucylcbiAgICAgIDogbnVsbFxuXG4gIC8qKlxuICAgKiBBIGNvbXBvc2l0ZSBsaW5rZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGEgYWxyZWFkeVxuICAgKiBjb21waWxlZCBwaWVjZSBvZiBET00sIHdoaWNoIGluc3RhbnRpYXRlcyBhbGwgZGlyZWN0aXZlXG4gICAqIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvbXBvc2l0ZUxpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIG9yaWdpbmFsRGlyQ291bnQgPSB2bS5fZGlyZWN0aXZlcy5sZW5ndGhcbiAgICB2YXIgcGFyZW50T3JpZ2luYWxEaXJDb3VudCA9XG4gICAgICB2bS4kcGFyZW50ICYmIHZtLiRwYXJlbnQuX2RpcmVjdGl2ZXMubGVuZ3RoXG4gICAgaWYgKHBhcmFtc0xpbmtGbikge1xuICAgICAgcGFyYW1zTGlua0ZuKHZtLCBlbClcbiAgICB9XG4gICAgLy8gY2FjaGUgY2hpbGROb2RlcyBiZWZvcmUgbGlua2luZyBwYXJlbnQsIGZpeCAjNjU3XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkoZWwuY2hpbGROb2RlcylcbiAgICAvLyBpZiB0aGlzIGlzIGEgdHJhbnNjbHVkZWQgY29tcGlsZSwgbGlua2VycyBuZWVkIHRvIGJlXG4gICAgLy8gY2FsbGVkIGluIHNvdXJjZSBzY29wZSwgYW5kIHRoZSBob3N0IG5lZWRzIHRvIGJlXG4gICAgLy8gcGFzc2VkIGRvd24uXG4gICAgdmFyIHNvdXJjZSA9IHRyYW5zY2x1ZGVkID8gdm0uJHBhcmVudCA6IHZtXG4gICAgdmFyIGhvc3QgPSB0cmFuc2NsdWRlZCA/IHZtIDogdW5kZWZpbmVkXG4gICAgLy8gbGlua1xuICAgIGlmIChub2RlTGlua0ZuKSBub2RlTGlua0ZuKHNvdXJjZSwgZWwsIGhvc3QpXG4gICAgaWYgKGNoaWxkTGlua0ZuKSBjaGlsZExpbmtGbihzb3VyY2UsIGNoaWxkTm9kZXMsIGhvc3QpXG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIGlzIGEgcGFydGlhbCBjb21waWxlLCB0aGUgbGlua2VyIGZ1bmN0aW9uXG4gICAgICogcmV0dXJucyBhbiB1bmxpbmsgZnVuY3Rpb24gdGhhdCB0ZWFyc2Rvd24gYWxsXG4gICAgICogZGlyZWN0aXZlcyBpbnN0YW5jZXMgZ2VuZXJhdGVkIGR1cmluZyB0aGUgcGFydGlhbFxuICAgICAqIGxpbmtpbmcuXG4gICAgICovXG5cbiAgICBpZiAocGFydGlhbCAmJiAhdHJhbnNjbHVkZWQpIHtcbiAgICAgIHZhciBzZWxmRGlycyA9IHZtLl9kaXJlY3RpdmVzLnNsaWNlKG9yaWdpbmFsRGlyQ291bnQpXG4gICAgICB2YXIgcGFyZW50RGlycyA9IHZtLiRwYXJlbnQgJiZcbiAgICAgICAgdm0uJHBhcmVudC5fZGlyZWN0aXZlcy5zbGljZShwYXJlbnRPcmlnaW5hbERpckNvdW50KVxuXG4gICAgICB2YXIgdGVhcmRvd25EaXJzID0gZnVuY3Rpb24gKHZtLCBkaXJzKSB7XG4gICAgICAgIHZhciBpID0gZGlycy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIGRpcnNbaV0uX3RlYXJkb3duKClcbiAgICAgICAgfVxuICAgICAgICBpID0gdm0uX2RpcmVjdGl2ZXMuaW5kZXhPZihkaXJzWzBdKVxuICAgICAgICB2bS5fZGlyZWN0aXZlcy5zcGxpY2UoaSwgZGlycy5sZW5ndGgpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiB1bmxpbmsgKCkge1xuICAgICAgICB0ZWFyZG93bkRpcnModm0sIHNlbGZEaXJzKVxuICAgICAgICBpZiAocGFyZW50RGlycykge1xuICAgICAgICAgIHRlYXJkb3duRGlycyh2bS4kcGFyZW50LCBwYXJlbnREaXJzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdHJhbnNjbHVkZWQgbGlua0ZucyBhcmUgdGVybWluYWwsIGJlY2F1c2UgaXQgdGFrZXNcbiAgLy8gb3ZlciB0aGUgZW50aXJlIHN1Yi10cmVlLlxuICBpZiAodHJhbnNjbHVkZWQpIHtcbiAgICBjb21wb3NpdGVMaW5rRm4udGVybWluYWwgPSB0cnVlXG4gIH1cblxuICByZXR1cm4gY29tcG9zaXRlTGlua0ZuXG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgYXR0cmlidXRlcyBmb3VuZCBvbiBhIFwiYmxvY2sgY29udGFpbmVyXCIgLVxuICogaS5lLiB0aGUgY29udGFpbmVyIG5vZGUgaW4gdGhlIHBhcmVudCB0ZW1wYXRlIG9mIGEgYmxvY2tcbiAqIGluc3RhbmNlLiBXZSBhcmUgb25seSBjb25jZXJuZWQgd2l0aCB2LXdpdGggYW5kXG4gKiBwYXJhbUF0dHJpYnV0ZXMgaGVyZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYXR0cnMgLSBhIG1hcCBvZiBhdHRyIG5hbWUvdmFsdWUgcGFpcnNcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtcyAtIHBhcmFtIGF0dHJpYnV0ZXMgbGlzdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVCbG9ja0NvbnRhaW5lciAoYXR0cnMsIHBhcmFtcywgb3B0aW9ucykge1xuICBpZiAoIWF0dHJzKSByZXR1cm4gbnVsbFxuICB2YXIgcGFyYW1zTGlua0ZuID0gcGFyYW1zXG4gICAgPyBjb21waWxlUGFyYW1BdHRyaWJ1dGVzKGF0dHJzLCBwYXJhbXMsIG9wdGlvbnMpXG4gICAgOiBudWxsXG4gIHZhciB3aXRoVmFsID0gYXR0cnNbY29uZmlnLnByZWZpeCArICd3aXRoJ11cbiAgdmFyIHdpdGhMaW5rRm4gPSBudWxsXG4gIGlmICh3aXRoVmFsKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBkaXJQYXJzZXIucGFyc2Uod2l0aFZhbClbMF1cbiAgICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzWyd3aXRoJ11cbiAgICB3aXRoTGlua0ZuID0gZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgdm0uX2JpbmREaXIoJ3dpdGgnLCBlbCwgZGVzY3JpcHRvciwgZGVmKSAgIFxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gYmxvY2tDb250YWluZXJMaW5rRm4gKHZtKSB7XG4gICAgLy8gZXhwbGljaXRseSBwYXNzaW5nIG51bGwgdG8gdGhlIGxpbmtlcnNcbiAgICAvLyBzaW5jZSB2LXdpdGggZG9lc24ndCBuZWVkIGEgcmVhbCBlbGVtZW50XG4gICAgaWYgKHBhcmFtc0xpbmtGbikgcGFyYW1zTGlua0ZuKHZtLCBudWxsKVxuICAgIGlmICh3aXRoTGlua0ZuKSB3aXRoTGlua0ZuKHZtLCBudWxsKVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4gYmFzZWQgb24gdGhlXG4gKiBub2RlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlTm9kZSAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdHlwZSA9IG5vZGUubm9kZVR5cGVcbiAgaWYgKHR5cGUgPT09IDEgJiYgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJykge1xuICAgIHJldHVybiBjb21waWxlRWxlbWVudChub2RlLCBvcHRpb25zKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IDMgJiYgY29uZmlnLmludGVycG9sYXRlICYmIG5vZGUuZGF0YS50cmltKCkpIHtcbiAgICByZXR1cm4gY29tcGlsZVRleHROb2RlKG5vZGUsIG9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYW4gZWxlbWVudCBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRWxlbWVudCAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKGNoZWNrVHJhbnNjbHVzaW9uKGVsKSkge1xuICAgIC8vIHVud3JhcCB0ZXh0Tm9kZVxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ19fdnVlX193cmFwJykpIHtcbiAgICAgIGVsID0gZWwuZmlyc3RDaGlsZFxuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZShlbCwgb3B0aW9ucy5fcGFyZW50LiRvcHRpb25zLCB0cnVlLCB0cnVlKVxuICB9XG4gIHZhciBsaW5rRm4sIHRhZywgY29tcG9uZW50XG4gIC8vIGNoZWNrIGN1c3RvbSBlbGVtZW50IGNvbXBvbmVudCwgYnV0IG9ubHkgb24gbm9uLXJvb3RcbiAgaWYgKCFlbC5fX3Z1ZV9fKSB7XG4gICAgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgY29tcG9uZW50ID1cbiAgICAgIHRhZy5pbmRleE9mKCctJykgPiAwICYmXG4gICAgICBvcHRpb25zLmNvbXBvbmVudHNbdGFnXVxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ2NvbXBvbmVudCcsIHRhZylcbiAgICB9XG4gIH1cbiAgaWYgKGNvbXBvbmVudCB8fCBlbC5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAvLyBjaGVjayB0ZXJtaW5hbCBkaXJlY2l0dmVzXG4gICAgbGlua0ZuID0gY2hlY2tUZXJtaW5hbERpcmVjdGl2ZXMoZWwsIG9wdGlvbnMpXG4gICAgLy8gaWYgbm90IHRlcm1pbmFsLCBidWlsZCBub3JtYWwgbGluayBmdW5jdGlvblxuICAgIGlmICghbGlua0ZuKSB7XG4gICAgICB2YXIgZGlycyA9IGNvbGxlY3REaXJlY3RpdmVzKGVsLCBvcHRpb25zKVxuICAgICAgbGlua0ZuID0gZGlycy5sZW5ndGhcbiAgICAgICAgPyBtYWtlTm9kZUxpbmtGbihkaXJzKVxuICAgICAgICA6IG51bGxcbiAgICB9XG4gIH1cbiAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSB0ZXh0YXJlYSwgd2UgbmVlZCB0byBpbnRlcnBvbGF0ZVxuICAvLyBpdHMgY29udGVudCBvbiBpbml0aWFsIHJlbmRlci5cbiAgaWYgKGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICB2YXIgcmVhbExpbmtGbiA9IGxpbmtGblxuICAgIGxpbmtGbiA9IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgIGVsLnZhbHVlID0gdm0uJGludGVycG9sYXRlKGVsLnZhbHVlKVxuICAgICAgaWYgKHJlYWxMaW5rRm4pIHJlYWxMaW5rRm4odm0sIGVsKVxuICAgIH1cbiAgICBsaW5rRm4udGVybWluYWwgPSB0cnVlXG4gIH1cbiAgcmV0dXJuIGxpbmtGblxufVxuXG4vKipcbiAqIEJ1aWxkIGEgbGluayBmdW5jdGlvbiBmb3IgYWxsIGRpcmVjdGl2ZXMgb24gYSBzaW5nbGUgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkaXJlY3RpdmVzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gZGlyZWN0aXZlc0xpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VOb2RlTGlua0ZuIChkaXJlY3RpdmVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBub2RlTGlua0ZuICh2bSwgZWwsIGhvc3QpIHtcbiAgICAvLyByZXZlcnNlIGFwcGx5IGJlY2F1c2UgaXQncyBzb3J0ZWQgbG93IHRvIGhpZ2hcbiAgICB2YXIgaSA9IGRpcmVjdGl2ZXMubGVuZ3RoXG4gICAgdmFyIGRpciwgaiwgaywgdGFyZ2V0XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZGlyID0gZGlyZWN0aXZlc1tpXVxuICAgICAgLy8gYSBkaXJlY3RpdmUgY2FuIGJlIHRyYW5zY2x1ZGVkIGlmIGl0J3Mgd3JpdHRlblxuICAgICAgLy8gb24gYSBjb21wb25lbnQncyBjb250YWluZXIgaW4gaXRzIHBhcmVudCB0ZW1wYWx0ZS5cbiAgICAgIHRhcmdldCA9IGRpci50cmFuc2NsdWRlZFxuICAgICAgICA/IHZtLiRwYXJlbnRcbiAgICAgICAgOiB2bVxuICAgICAgaWYgKGRpci5fbGluaykge1xuICAgICAgICAvLyBjdXN0b20gbGluayBmblxuICAgICAgICBkaXIuX2xpbmsodGFyZ2V0LCBlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBkaXIuZGVzY3JpcHRvcnMubGVuZ3RoXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICB0YXJnZXQuX2JpbmREaXIoZGlyLm5hbWUsIGVsLFxuICAgICAgICAgICAgZGlyLmRlc2NyaXB0b3JzW2pdLCBkaXIuZGVmLCBob3N0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHRleHROb2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7VGV4dE5vZGV9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfSB0ZXh0Tm9kZUxpbmtGblxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVUZXh0Tm9kZSAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShub2RlLmRhdGEpXG4gIGlmICghdG9rZW5zKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgZWwsIHRva2VuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgZWwgPSB0b2tlbi50YWdcbiAgICAgID8gcHJvY2Vzc1RleHRUb2tlbih0b2tlbiwgb3B0aW9ucylcbiAgICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpXG4gICAgZnJhZy5hcHBlbmRDaGlsZChlbClcbiAgfVxuICByZXR1cm4gbWFrZVRleHROb2RlTGlua0ZuKHRva2VucywgZnJhZywgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBQcm9jZXNzIGEgc2luZ2xlIHRleHQgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzVGV4dFRva2VuICh0b2tlbiwgb3B0aW9ucykge1xuICB2YXIgZWxcbiAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKVxuICB9IGVsc2Uge1xuICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaHRtbCcpXG4gICAgICBzZXRUb2tlblR5cGUoJ2h0bWwnKVxuICAgIH0gZWxzZSBpZiAodG9rZW4ucGFydGlhbCkge1xuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXBhcnRpYWwnKVxuICAgICAgc2V0VG9rZW5UeXBlKCdwYXJ0aWFsJylcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSUUgd2lsbCBjbGVhbiB1cCBlbXB0eSB0ZXh0Tm9kZXMgZHVyaW5nXG4gICAgICAvLyBmcmFnLmNsb25lTm9kZSh0cnVlKSwgc28gd2UgaGF2ZSB0byBnaXZlIGl0XG4gICAgICAvLyBzb21ldGhpbmcgaGVyZS4uLlxuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcpXG4gICAgICBzZXRUb2tlblR5cGUoJ3RleHQnKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXRUb2tlblR5cGUgKHR5cGUpIHtcbiAgICB0b2tlbi50eXBlID0gdHlwZVxuICAgIHRva2VuLmRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1t0eXBlXVxuICAgIHRva2VuLmRlc2NyaXB0b3IgPSBkaXJQYXJzZXIucGFyc2UodG9rZW4udmFsdWUpWzBdXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIHRleHROb2RlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gdG9rZW5zXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdcbiAqL1xuXG5mdW5jdGlvbiBtYWtlVGV4dE5vZGVMaW5rRm4gKHRva2VucywgZnJhZykge1xuICByZXR1cm4gZnVuY3Rpb24gdGV4dE5vZGVMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBmcmFnQ2xvbmUgPSBmcmFnLmNsb25lTm9kZSh0cnVlKVxuICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KGZyYWdDbG9uZS5jaGlsZE5vZGVzKVxuICAgIHZhciB0b2tlbiwgdmFsdWUsIG5vZGVcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICB2YWx1ZSA9IHRva2VuLnZhbHVlXG4gICAgICBpZiAodG9rZW4udGFnKSB7XG4gICAgICAgIG5vZGUgPSBjaGlsZE5vZGVzW2ldXG4gICAgICAgIGlmICh0b2tlbi5vbmVUaW1lKSB7XG4gICAgICAgICAgdmFsdWUgPSB2bS4kZXZhbCh2YWx1ZSlcbiAgICAgICAgICBpZiAodG9rZW4uaHRtbCkge1xuICAgICAgICAgICAgXy5yZXBsYWNlKG5vZGUsIHRlbXBsYXRlUGFyc2VyLnBhcnNlKHZhbHVlLCB0cnVlKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gdmFsdWVcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdm0uX2JpbmREaXIodG9rZW4udHlwZSwgbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5kZXNjcmlwdG9yLCB0b2tlbi5kZWYpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXy5yZXBsYWNlKGVsLCBmcmFnQ2xvbmUpXG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGEgbm9kZSBsaXN0IGFuZCByZXR1cm4gYSBjaGlsZExpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge05vZGVMaXN0fSBub2RlTGlzdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlTm9kZUxpc3QgKG5vZGVMaXN0LCBvcHRpb25zKSB7XG4gIHZhciBsaW5rRm5zID0gW11cbiAgdmFyIG5vZGVMaW5rRm4sIGNoaWxkTGlua0ZuLCBub2RlXG4gIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZUxpc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbm9kZSA9IG5vZGVMaXN0W2ldXG4gICAgbm9kZUxpbmtGbiA9IGNvbXBpbGVOb2RlKG5vZGUsIG9wdGlvbnMpXG4gICAgY2hpbGRMaW5rRm4gPVxuICAgICAgIShub2RlTGlua0ZuICYmIG5vZGVMaW5rRm4udGVybWluYWwpICYmXG4gICAgICBub2RlLnRhZ05hbWUgIT09ICdTQ1JJUFQnICYmXG4gICAgICBub2RlLmhhc0NoaWxkTm9kZXMoKVxuICAgICAgICA/IGNvbXBpbGVOb2RlTGlzdChub2RlLmNoaWxkTm9kZXMsIG9wdGlvbnMpXG4gICAgICAgIDogbnVsbFxuICAgIGxpbmtGbnMucHVzaChub2RlTGlua0ZuLCBjaGlsZExpbmtGbilcbiAgfVxuICByZXR1cm4gbGlua0Zucy5sZW5ndGhcbiAgICA/IG1ha2VDaGlsZExpbmtGbihsaW5rRm5zKVxuICAgIDogbnVsbFxufVxuXG4vKipcbiAqIE1ha2UgYSBjaGlsZCBsaW5rIGZ1bmN0aW9uIGZvciBhIG5vZGUncyBjaGlsZE5vZGVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8RnVuY3Rpb24+fSBsaW5rRm5zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gY2hpbGRMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBtYWtlQ2hpbGRMaW5rRm4gKGxpbmtGbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNoaWxkTGlua0ZuICh2bSwgbm9kZXMsIGhvc3QpIHtcbiAgICB2YXIgbm9kZSwgbm9kZUxpbmtGbiwgY2hpbGRyZW5MaW5rRm5cbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IDAsIGwgPSBsaW5rRm5zLmxlbmd0aDsgaSA8IGw7IG4rKykge1xuICAgICAgbm9kZSA9IG5vZGVzW25dXG4gICAgICBub2RlTGlua0ZuID0gbGlua0Zuc1tpKytdXG4gICAgICBjaGlsZHJlbkxpbmtGbiA9IGxpbmtGbnNbaSsrXVxuICAgICAgLy8gY2FjaGUgY2hpbGROb2RlcyBiZWZvcmUgbGlua2luZyBwYXJlbnQsIGZpeCAjNjU3XG4gICAgICB2YXIgY2hpbGROb2RlcyA9IF8udG9BcnJheShub2RlLmNoaWxkTm9kZXMpXG4gICAgICBpZiAobm9kZUxpbmtGbikge1xuICAgICAgICBub2RlTGlua0ZuKHZtLCBub2RlLCBob3N0KVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkcmVuTGlua0ZuKSB7XG4gICAgICAgIGNoaWxkcmVuTGlua0ZuKHZtLCBjaGlsZE5vZGVzLCBob3N0KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgcGFyYW0gYXR0cmlidXRlcyBvbiBhIHJvb3QgZWxlbWVudCBhbmQgcmV0dXJuXG4gKiBhIHBhcmFtQXR0cmlidXRlcyBsaW5rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsXG4gKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwYXJhbXNMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUGFyYW1BdHRyaWJ1dGVzIChlbCwgYXR0cnMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcmFtcyA9IFtdXG4gIHZhciBpc0VsID0gZWwubm9kZVR5cGVcbiAgdmFyIGkgPSBhdHRycy5sZW5ndGhcbiAgdmFyIG5hbWUsIHZhbHVlLCBwYXJhbVxuICB3aGlsZSAoaS0tKSB7XG4gICAgbmFtZSA9IGF0dHJzW2ldXG4gICAgaWYgKC9bQS1aXS8udGVzdChuYW1lKSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnWW91IHNlZW0gdG8gYmUgdXNpbmcgY2FtZWxDYXNlIGZvciBhIHBhcmFtQXR0cmlidXRlLCAnICtcbiAgICAgICAgJ2J1dCBIVE1MIGRvZXNuXFwndCBkaWZmZXJlbnRpYXRlIGJldHdlZW4gdXBwZXIgYW5kICcgK1xuICAgICAgICAnbG93ZXIgY2FzZS4gWW91IHNob3VsZCB1c2UgaHlwaGVuLWRlbGltaXRlZCAnICtcbiAgICAgICAgJ2F0dHJpYnV0ZSBuYW1lcy4gRm9yIG1vcmUgaW5mbyBzZWUgJyArXG4gICAgICAgICdodHRwOi8vdnVlanMub3JnL2FwaS9vcHRpb25zLmh0bWwjcGFyYW1BdHRyaWJ1dGVzJ1xuICAgICAgKVxuICAgIH1cbiAgICB2YWx1ZSA9IGlzRWwgPyBlbC5nZXRBdHRyaWJ1dGUobmFtZSkgOiBlbFtuYW1lXVxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgcGFyYW0gPSB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfVxuICAgICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UodmFsdWUpXG4gICAgICBpZiAodG9rZW5zKSB7XG4gICAgICAgIGlmIChpc0VsKSBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgICAgaWYgKHRva2Vucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgXy53YXJuKFxuICAgICAgICAgICAgJ0ludmFsaWQgcGFyYW0gYXR0cmlidXRlIGJpbmRpbmc6IFwiJyArXG4gICAgICAgICAgICBuYW1lICsgJz1cIicgKyB2YWx1ZSArICdcIicgK1xuICAgICAgICAgICAgJ1xcbkRvblxcJ3QgbWl4IGJpbmRpbmcgdGFncyB3aXRoIHBsYWluIHRleHQgJyArXG4gICAgICAgICAgICAnaW4gcGFyYW0gYXR0cmlidXRlIGJpbmRpbmdzLidcbiAgICAgICAgICApXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbS5keW5hbWljID0gdHJ1ZVxuICAgICAgICAgIHBhcmFtLnZhbHVlID0gdG9rZW5zWzBdLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhcmFtcy5wdXNoKHBhcmFtKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWFrZVBhcmFtc0xpbmtGbihwYXJhbXMsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgcGFyYW0gYXR0cmlidXRlcyB0byBhIHZtLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwYXJhbXNMaW5rRm5cbiAqL1xuXG52YXIgZGF0YUF0dHJSRSA9IC9eZGF0YS0vXG5cbmZ1bmN0aW9uIG1ha2VQYXJhbXNMaW5rRm4gKHBhcmFtcywgb3B0aW9ucykge1xuICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzWyd3aXRoJ11cbiAgcmV0dXJuIGZ1bmN0aW9uIHBhcmFtc0xpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIGkgPSBwYXJhbXMubGVuZ3RoXG4gICAgdmFyIHBhcmFtLCBwYXRoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcGFyYW0gPSBwYXJhbXNbaV1cbiAgICAgIC8vIHBhcmFtcyBjb3VsZCBjb250YWluIGRhc2hlcywgd2hpY2ggd2lsbCBiZVxuICAgICAgLy8gaW50ZXJwcmV0ZWQgYXMgbWludXMgY2FsY3VsYXRpb25zIGJ5IHRoZSBwYXJzZXJcbiAgICAgIC8vIHNvIHdlIG5lZWQgdG8gd3JhcCB0aGUgcGF0aCBoZXJlXG4gICAgICBwYXRoID0gXy5jYW1lbGl6ZShwYXJhbS5uYW1lLnJlcGxhY2UoZGF0YUF0dHJSRSwgJycpKVxuICAgICAgaWYgKHBhcmFtLmR5bmFtaWMpIHtcbiAgICAgICAgLy8gZHluYW1pYyBwYXJhbSBhdHRyaWJ0dWVzIGFyZSBib3VuZCBhcyB2LXdpdGguXG4gICAgICAgIC8vIHdlIGNhbiBkaXJlY3RseSBkdWNrIHRoZSBkZXNjcmlwdG9yIGhlcmUgYmVhY3VzZVxuICAgICAgICAvLyBwYXJhbSBhdHRyaWJ1dGVzIGNhbm5vdCB1c2UgZXhwcmVzc2lvbnMgb3JcbiAgICAgICAgLy8gZmlsdGVycy5cbiAgICAgICAgdm0uX2JpbmREaXIoJ3dpdGgnLCBlbCwge1xuICAgICAgICAgIGFyZzogcGF0aCxcbiAgICAgICAgICBleHByZXNzaW9uOiBwYXJhbS52YWx1ZVxuICAgICAgICB9LCBkZWYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBqdXN0IHNldCBvbmNlXG4gICAgICAgIHZtLiRzZXQocGF0aCwgcGFyYW0udmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgYW4gZWxlbWVudCBmb3IgdGVybWluYWwgZGlyZWN0aXZlcyBpbiBmaXhlZCBvcmRlci5cbiAqIElmIGl0IGZpbmRzIG9uZSwgcmV0dXJuIGEgdGVybWluYWwgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxudmFyIHRlcm1pbmFsRGlyZWN0aXZlcyA9IFtcbiAgJ3JlcGVhdCcsXG4gICdpZicsXG4gICdjb21wb25lbnQnXG5dXG5cbmZ1bmN0aW9uIHNraXAgKCkge31cbnNraXAudGVybWluYWwgPSB0cnVlXG5cbmZ1bmN0aW9uIGNoZWNrVGVybWluYWxEaXJlY3RpdmVzIChlbCwgb3B0aW9ucykge1xuICBpZiAoXy5hdHRyKGVsLCAncHJlJykgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2tpcFxuICB9XG4gIHZhciB2YWx1ZSwgZGlyTmFtZVxuICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGRpck5hbWUgPSB0ZXJtaW5hbERpcmVjdGl2ZXNbaV1cbiAgICBpZiAodmFsdWUgPSBfLmF0dHIoZWwsIGRpck5hbWUpKSB7XG4gICAgICByZXR1cm4gbWFrZVRlcm1pbmFsTm9kZUxpbmtGbihlbCwgZGlyTmFtZSwgdmFsdWUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBub2RlIGxpbmsgZnVuY3Rpb24gZm9yIGEgdGVybWluYWwgZGlyZWN0aXZlLlxuICogQSB0ZXJtaW5hbCBsaW5rIGZ1bmN0aW9uIHRlcm1pbmF0ZXMgdGhlIGN1cnJlbnRcbiAqIGNvbXBpbGF0aW9uIHJlY3Vyc2lvbiBhbmQgaGFuZGxlcyBjb21waWxhdGlvbiBvZiB0aGVcbiAqIHN1YnRyZWUgaW4gdGhlIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZVRlcm1pbmFsTm9kZUxpbmtGbiAoZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHZhbHVlKVswXVxuICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzW2Rpck5hbWVdXG4gIHZhciBmbiA9IGZ1bmN0aW9uIHRlcm1pbmFsTm9kZUxpbmtGbiAodm0sIGVsLCBob3N0KSB7XG4gICAgdm0uX2JpbmREaXIoZGlyTmFtZSwgZWwsIGRlc2NyaXB0b3IsIGRlZiwgaG9zdClcbiAgfVxuICBmbi50ZXJtaW5hbCA9IHRydWVcbiAgcmV0dXJuIGZuXG59XG5cbi8qKlxuICogQ29sbGVjdCB0aGUgZGlyZWN0aXZlcyBvbiBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBjb2xsZWN0RGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGF0dHJzID0gXy50b0FycmF5KGVsLmF0dHJpYnV0ZXMpXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHZhciBkaXJzID0gW11cbiAgdmFyIGF0dHIsIGF0dHJOYW1lLCBkaXIsIGRpck5hbWUsIGRpckRlZiwgdHJhbnNjbHVkZWRcbiAgd2hpbGUgKGktLSkge1xuICAgIGF0dHIgPSBhdHRyc1tpXVxuICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lXG4gICAgdHJhbnNjbHVkZWQgPVxuICAgICAgb3B0aW9ucy5fdHJhbnNjbHVkZWRBdHRycyAmJlxuICAgICAgb3B0aW9ucy5fdHJhbnNjbHVkZWRBdHRyc1thdHRyTmFtZV1cbiAgICBpZiAoYXR0ck5hbWUuaW5kZXhPZihjb25maWcucHJlZml4KSA9PT0gMCkge1xuICAgICAgZGlyTmFtZSA9IGF0dHJOYW1lLnNsaWNlKGNvbmZpZy5wcmVmaXgubGVuZ3RoKVxuICAgICAgZGlyRGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzW2Rpck5hbWVdXG4gICAgICBfLmFzc2VydEFzc2V0KGRpckRlZiwgJ2RpcmVjdGl2ZScsIGRpck5hbWUpXG4gICAgICBpZiAoZGlyRGVmKSB7XG4gICAgICAgIGRpcnMucHVzaCh7XG4gICAgICAgICAgbmFtZTogZGlyTmFtZSxcbiAgICAgICAgICBkZXNjcmlwdG9yczogZGlyUGFyc2VyLnBhcnNlKGF0dHIudmFsdWUpLFxuICAgICAgICAgIGRlZjogZGlyRGVmLFxuICAgICAgICAgIHRyYW5zY2x1ZGVkOiB0cmFuc2NsdWRlZFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29uZmlnLmludGVycG9sYXRlKSB7XG4gICAgICBkaXIgPSBjb2xsZWN0QXR0ckRpcmVjdGl2ZShlbCwgYXR0ck5hbWUsIGF0dHIudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zKVxuICAgICAgaWYgKGRpcikge1xuICAgICAgICBkaXIudHJhbnNjbHVkZWQgPSB0cmFuc2NsdWRlZFxuICAgICAgICBkaXJzLnB1c2goZGlyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBzb3J0IGJ5IHByaW9yaXR5LCBMT1cgdG8gSElHSFxuICBkaXJzLnNvcnQoZGlyZWN0aXZlQ29tcGFyYXRvcilcbiAgcmV0dXJuIGRpcnNcbn1cblxuLyoqXG4gKiBDaGVjayBhbiBhdHRyaWJ1dGUgZm9yIHBvdGVudGlhbCBkeW5hbWljIGJpbmRpbmdzLFxuICogYW5kIHJldHVybiBhIGRpcmVjdGl2ZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBjb2xsZWN0QXR0ckRpcmVjdGl2ZSAoZWwsIG5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHZhbHVlKVxuICBpZiAodG9rZW5zKSB7XG4gICAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlcy5hdHRyXG4gICAgdmFyIGkgPSB0b2tlbnMubGVuZ3RoXG4gICAgdmFyIGFsbE9uZVRpbWUgPSB0cnVlXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdmFyIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICBpZiAodG9rZW4udGFnICYmICF0b2tlbi5vbmVUaW1lKSB7XG4gICAgICAgIGFsbE9uZVRpbWUgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgZGVmOiBkZWYsXG4gICAgICBfbGluazogYWxsT25lVGltZVxuICAgICAgICA/IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShuYW1lLCB2bS4kaW50ZXJwb2xhdGUodmFsdWUpKVxuICAgICAgICAgIH1cbiAgICAgICAgOiBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2Vucywgdm0pXG4gICAgICAgICAgICB2YXIgZGVzYyA9IGRpclBhcnNlci5wYXJzZShuYW1lICsgJzonICsgdmFsdWUpWzBdXG4gICAgICAgICAgICB2bS5fYmluZERpcignYXR0cicsIGVsLCBkZXNjLCBkZWYpXG4gICAgICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSBwcmlvcml0eSBzb3J0IGNvbXBhcmF0b3JcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYVxuICogQHBhcmFtIHtPYmplY3R9IGJcbiAqL1xuXG5mdW5jdGlvbiBkaXJlY3RpdmVDb21wYXJhdG9yIChhLCBiKSB7XG4gIGEgPSBhLmRlZi5wcmlvcml0eSB8fCAwXG4gIGIgPSBiLmRlZi5wcmlvcml0eSB8fCAwXG4gIHJldHVybiBhID4gYiA/IDEgOiAtMVxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gZWxlbWVudCBpcyB0cmFuc2NsdWRlZFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxudmFyIHRyYW5zY2x1ZGVkRmxhZ0F0dHIgPSAnX192dWVfX3RyYW5zY2x1ZGVkJ1xuZnVuY3Rpb24gY2hlY2tUcmFuc2NsdXNpb24gKGVsKSB7XG4gIGlmIChlbC5ub2RlVHlwZSA9PT0gMSAmJiBlbC5oYXNBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0cikpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0cilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG52YXIgdHJhbnNjbHVkZWRGbGFnQXR0ciA9ICdfX3Z1ZV9fdHJhbnNjbHVkZWQnXG5cbi8qKlxuICogUHJvY2VzcyBhbiBlbGVtZW50IG9yIGEgRG9jdW1lbnRGcmFnbWVudCBiYXNlZCBvbiBhXG4gKiBpbnN0YW5jZSBvcHRpb24gb2JqZWN0LiBUaGlzIGFsbG93cyB1cyB0byB0cmFuc2NsdWRlXG4gKiBhIHRlbXBsYXRlIG5vZGUvZnJhZ21lbnQgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBjcmVhdGVkLFxuICogc28gdGhlIHByb2Nlc3NlZCBmcmFnbWVudCBjYW4gdGhlbiBiZSBjbG9uZWQgYW5kIHJldXNlZFxuICogaW4gdi1yZXBlYXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zY2x1ZGUgKGVsLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuX2FzQ29tcG9uZW50KSB7XG4gICAgLy8gbXV0YXRpbmcgdGhlIG9wdGlvbnMgb2JqZWN0IGhlcmUgYXNzdW1pbmcgdGhlIHNhbWVcbiAgICAvLyBvYmplY3Qgd2lsbCBiZSB1c2VkIGZvciBjb21waWxlIHJpZ2h0IGFmdGVyIHRoaXNcbiAgICBvcHRpb25zLl90cmFuc2NsdWRlZEF0dHJzID0gZXh0cmFjdEF0dHJzKGVsLmF0dHJpYnV0ZXMpXG4gICAgLy8gTWFyayBjb250ZW50IG5vZGVzIGFuZCBhdHRycyBzbyB0aGF0IHRoZSBjb21waWxlclxuICAgIC8vIGtub3dzIHRoZXkgc2hvdWxkIGJlIGNvbXBpbGVkIGluIHBhcmVudCBzY29wZS5cbiAgICB2YXIgaSA9IGVsLmNoaWxkTm9kZXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdmFyIG5vZGUgPSBlbC5jaGlsZE5vZGVzW2ldXG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSh0cmFuc2NsdWRlZEZsYWdBdHRyLCAnJylcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyAmJiBub2RlLmRhdGEudHJpbSgpKSB7XG4gICAgICAgIC8vIHdyYXAgdHJhbnNjbHVkZWQgdGV4dE5vZGVzIGluIHNwYW5zLCBiZWNhdXNlXG4gICAgICAgIC8vIHJhdyB0ZXh0Tm9kZXMgY2FuJ3QgYmUgcGVyc2lzdGVkIHRocm91Z2ggY2xvbmVzXG4gICAgICAgIC8vIGJ5IGF0dGFjaGluZyBhdHRyaWJ1dGVzLlxuICAgICAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICB3cmFwcGVyLnRleHRDb250ZW50ID0gbm9kZS5kYXRhXG4gICAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKCdfX3Z1ZV9fd3JhcCcsICcnKVxuICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSh0cmFuc2NsdWRlZEZsYWdBdHRyLCAnJylcbiAgICAgICAgZWwucmVwbGFjZUNoaWxkKHdyYXBwZXIsIG5vZGUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIGZvciB0ZW1wbGF0ZSB0YWdzLCB3aGF0IHdlIHdhbnQgaXMgaXRzIGNvbnRlbnQgYXNcbiAgLy8gYSBkb2N1bWVudEZyYWdtZW50IChmb3IgYmxvY2sgaW5zdGFuY2VzKVxuICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJykge1xuICAgIGVsID0gdGVtcGxhdGVQYXJzZXIucGFyc2UoZWwpXG4gIH1cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50ZW1wbGF0ZSkge1xuICAgIGVsID0gdHJhbnNjbHVkZVRlbXBsYXRlKGVsLCBvcHRpb25zKVxuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICBfLnByZXBlbmQoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1zdGFydCcpLCBlbClcbiAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWVuZCcpKVxuICB9XG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHRlbXBsYXRlIG9wdGlvbi5cbiAqIElmIHRoZSByZXBsYWNlIG9wdGlvbiBpcyB0cnVlIHRoaXMgd2lsbCBzd2FwIHRoZSAkZWwuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2NsdWRlVGVtcGxhdGUgKGVsLCBvcHRpb25zKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGVcbiAgdmFyIGZyYWcgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh0ZW1wbGF0ZSwgdHJ1ZSlcbiAgaWYgKCFmcmFnKSB7XG4gICAgXy53YXJuKCdJbnZhbGlkIHRlbXBsYXRlIG9wdGlvbjogJyArIHRlbXBsYXRlKVxuICB9IGVsc2Uge1xuICAgIHZhciByYXdDb250ZW50ID0gb3B0aW9ucy5fY29udGVudCB8fCBfLmV4dHJhY3RDb250ZW50KGVsKVxuICAgIGlmIChvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIGlmIChmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyB0aGlzIGlzIGEgYmxvY2sgaW5zdGFuY2Ugd2hpY2ggaGFzIG5vIHJvb3Qgbm9kZS5cbiAgICAgICAgLy8gaG93ZXZlciwgdGhlIGNvbnRhaW5lciBpbiB0aGUgcGFyZW50IHRlbXBsYXRlXG4gICAgICAgIC8vICh3aGljaCBpcyByZXBsYWNlZCBoZXJlKSBtYXkgY29udGFpbiB2LXdpdGggYW5kXG4gICAgICAgIC8vIHBhcmFtQXR0cmlidXRlcyB0aGF0IHN0aWxsIG5lZWQgdG8gYmUgY29tcGlsZWRcbiAgICAgICAgLy8gZm9yIHRoZSBjaGlsZC4gd2Ugc3RvcmUgYWxsIHRoZSBjb250YWluZXJcbiAgICAgICAgLy8gYXR0cmlidXRlcyBvbiB0aGUgb3B0aW9ucyBvYmplY3QgYW5kIHBhc3MgaXQgZG93blxuICAgICAgICAvLyB0byB0aGUgY29tcGlsZXIuXG4gICAgICAgIHZhciBjb250YWluZXJBdHRycyA9IG9wdGlvbnMuX2NvbnRhaW5lckF0dHJzID0ge31cbiAgICAgICAgdmFyIGkgPSBlbC5hdHRyaWJ1dGVzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgdmFyIGF0dHIgPSBlbC5hdHRyaWJ1dGVzW2ldXG4gICAgICAgICAgY29udGFpbmVyQXR0cnNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWVcbiAgICAgICAgfVxuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChmcmFnLCByYXdDb250ZW50KVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlcGxhY2VyID0gZnJhZy5maXJzdENoaWxkXG4gICAgICAgIF8uY29weUF0dHJpYnV0ZXMoZWwsIHJlcGxhY2VyKVxuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChyZXBsYWNlciwgcmF3Q29udGVudClcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VyXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGZyYWcpXG4gICAgICB0cmFuc2NsdWRlQ29udGVudChlbCwgcmF3Q29udGVudClcbiAgICAgIHJldHVybiBlbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlc29sdmUgPGNvbnRlbnQ+IGluc2VydGlvbiBwb2ludHMgbWltaWNraW5nIHRoZSBiZWhhdmlvclxuICogb2YgdGhlIFNoYWRvdyBET00gc3BlYzpcbiAqXG4gKiAgIGh0dHA6Ly93M2MuZ2l0aHViLmlvL3dlYmNvbXBvbmVudHMvc3BlYy9zaGFkb3cvI2luc2VydGlvbi1wb2ludHNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmF3XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZUNvbnRlbnQgKGVsLCByYXcpIHtcbiAgdmFyIG91dGxldHMgPSBnZXRPdXRsZXRzKGVsKVxuICB2YXIgaSA9IG91dGxldHMubGVuZ3RoXG4gIGlmICghaSkgcmV0dXJuXG4gIHZhciBvdXRsZXQsIHNlbGVjdCwgc2VsZWN0ZWQsIGosIG1haW5cblxuICBmdW5jdGlvbiBpc0RpcmVjdENoaWxkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZSA9PT0gcmF3XG4gIH1cblxuICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IGNvcnJlc3BvbmRpbmcgY29udGVudFxuICAvLyBmb3IgZWFjaCBvdXRsZXQuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKHJhdykge1xuICAgICAgc2VsZWN0ID0gb3V0bGV0LmdldEF0dHJpYnV0ZSgnc2VsZWN0JylcbiAgICAgIGlmIChzZWxlY3QpIHsgIC8vIHNlbGVjdCBjb250ZW50XG4gICAgICAgIHNlbGVjdGVkID0gcmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0KVxuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gYWNjb3JkaW5nIHRvIFNoYWRvdyBET00gc3BlYywgYHNlbGVjdGAgY2FuXG4gICAgICAgICAgLy8gb25seSBzZWxlY3QgZGlyZWN0IGNoaWxkcmVuIG9mIHRoZSBob3N0IG5vZGUuXG4gICAgICAgICAgLy8gZW5mb3JjaW5nIHRoaXMgYWxzbyBmaXhlcyAjNzg2LlxuICAgICAgICAgIHNlbGVjdGVkID0gW10uZmlsdGVyLmNhbGwoc2VsZWN0ZWQsIGlzRGlyZWN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgb3V0bGV0LmNvbnRlbnQgPSBzZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgICA/IHNlbGVjdGVkXG4gICAgICAgICAgOiBfLnRvQXJyYXkob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgICB9IGVsc2UgeyAvLyBkZWZhdWx0IGNvbnRlbnRcbiAgICAgICAgbWFpbiA9IG91dGxldFxuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIGZhbGxiYWNrIGNvbnRlbnRcbiAgICAgIG91dGxldC5jb250ZW50ID0gXy50b0FycmF5KG91dGxldC5jaGlsZE5vZGVzKVxuICAgIH1cbiAgfVxuICAvLyBzZWNvbmQgcGFzcywgYWN0dWFsbHkgaW5zZXJ0IHRoZSBjb250ZW50c1xuICBmb3IgKGkgPSAwLCBqID0gb3V0bGV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKG91dGxldCAhPT0gbWFpbikge1xuICAgICAgaW5zZXJ0Q29udGVudEF0KG91dGxldCwgb3V0bGV0LmNvbnRlbnQpXG4gICAgfVxuICB9XG4gIC8vIGZpbmFsbHkgaW5zZXJ0IHRoZSBtYWluIGNvbnRlbnRcbiAgaWYgKG1haW4pIHtcbiAgICBpbnNlcnRDb250ZW50QXQobWFpbiwgXy50b0FycmF5KHJhdy5jaGlsZE5vZGVzKSlcbiAgfVxufVxuXG4vKipcbiAqIEdldCA8Y29udGVudD4gb3V0bGV0cyBmcm9tIHRoZSBlbGVtZW50L2xpc3RcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8QXJyYXl9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG52YXIgY29uY2F0ID0gW10uY29uY2F0XG5mdW5jdGlvbiBnZXRPdXRsZXRzIChlbCkge1xuICByZXR1cm4gXy5pc0FycmF5KGVsKVxuICAgID8gY29uY2F0LmFwcGx5KFtdLCBlbC5tYXAoZ2V0T3V0bGV0cykpXG4gICAgOiBlbC5xdWVyeVNlbGVjdG9yQWxsXG4gICAgICA/IF8udG9BcnJheShlbC5xdWVyeVNlbGVjdG9yQWxsKCdjb250ZW50JykpXG4gICAgICA6IFtdXG59XG5cbi8qKlxuICogSW5zZXJ0IGFuIGFycmF5IG9mIG5vZGVzIGF0IG91dGxldCxcbiAqIHRoZW4gcmVtb3ZlIHRoZSBvdXRsZXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBvdXRsZXRcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRlbnRzXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0Q29udGVudEF0IChvdXRsZXQsIGNvbnRlbnRzKSB7XG4gIC8vIG5vdCB1c2luZyB1dGlsIERPTSBtZXRob2RzIGhlcmUgYmVjYXVzZVxuICAvLyBwYXJlbnROb2RlIGNhbiBiZSBjYWNoZWRcbiAgdmFyIHBhcmVudCA9IG91dGxldC5wYXJlbnROb2RlXG4gIGZvciAodmFyIGkgPSAwLCBqID0gY29udGVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShjb250ZW50c1tpXSwgb3V0bGV0KVxuICB9XG4gIHBhcmVudC5yZW1vdmVDaGlsZChvdXRsZXQpXG59XG5cbi8qKlxuICogSGVscGVyIHRvIGV4dHJhY3QgYSBjb21wb25lbnQgY29udGFpbmVyJ3MgYXR0cmlidXRlIG5hbWVzXG4gKiBpbnRvIGEgbWFwLCBhbmQgZmlsdGVyaW5nIG91dCBgdi13aXRoYCBpbiB0aGUgcHJvY2Vzcy5cbiAqIFRoZSByZXN1bHRpbmcgbWFwIHdpbGwgYmUgdXNlZCBpbiBjb21waWxlci9jb21waWxlIHRvXG4gKiBkZXRlcm1pbmUgd2hldGhlciBhbiBhdHRyaWJ1dGUgaXMgdHJhbnNjbHVkZWQuXG4gKlxuICogQHBhcmFtIHtOYW1lTm9kZU1hcH0gYXR0cnNcbiAqL1xuXG5mdW5jdGlvbiBleHRyYWN0QXR0cnMgKGF0dHJzKSB7XG4gIGlmICghYXR0cnMpIHJldHVybiBudWxsXG4gIHZhciByZXMgPSB7fVxuICB2YXIgdndpdGggPSBjb25maWcucHJlZml4ICsgJ3dpdGgnXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgbmFtZSA9IGF0dHJzW2ldLm5hbWVcbiAgICBpZiAobmFtZSAhPT0gdndpdGgpIHJlc1tuYW1lXSA9IHRydWVcbiAgfVxuICByZXR1cm4gcmVzXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVmaXggdG8gbG9vayBmb3Igd2hlbiBwYXJzaW5nIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuXG4gIHByZWZpeDogJ3YtJyxcblxuICAvKipcbiAgICogV2hldGhlciB0byBwcmludCBkZWJ1ZyBtZXNzYWdlcy5cbiAgICogQWxzbyBlbmFibGVzIHN0YWNrIHRyYWNlIGZvciB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIGRlYnVnOiBmYWxzZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBzdXBwcmVzcyB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIHNpbGVudDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgYWxsb3cgb2JzZXJ2ZXIgdG8gYWx0ZXIgZGF0YSBvYmplY3RzJ1xuICAgKiBfX3Byb3RvX18uXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBwcm90bzogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBwYXJzZSBtdXN0YWNoZSB0YWdzIGluIHRlbXBsYXRlcy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIGludGVycG9sYXRlOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSBhc3luYyByZW5kZXJpbmcuXG4gICAqL1xuXG4gIGFzeW5jOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHdhcm4gYWdhaW5zdCBlcnJvcnMgY2F1Z2h0IHdoZW4gZXZhbHVhdGluZ1xuICAgKiBleHByZXNzaW9ucy5cbiAgICovXG5cbiAgd2FybkV4cHJlc3Npb25FcnJvcnM6IHRydWUsXG5cbiAgLyoqXG4gICAqIEludGVybmFsIGZsYWcgdG8gaW5kaWNhdGUgdGhlIGRlbGltaXRlcnMgaGF2ZSBiZWVuXG4gICAqIGNoYW5nZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBfZGVsaW1pdGVyc0NoYW5nZWQ6IHRydWVcblxufVxuXG4vKipcbiAqIEludGVycG9sYXRpb24gZGVsaW1pdGVycy5cbiAqIFdlIG5lZWQgdG8gbWFyayB0aGUgY2hhbmdlZCBmbGFnIHNvIHRoYXQgdGhlIHRleHQgcGFyc2VyXG4gKiBrbm93cyBpdCBuZWVkcyB0byByZWNvbXBpbGUgdGhlIHJlZ2V4LlxuICpcbiAqIEB0eXBlIHtBcnJheTxTdHJpbmc+fVxuICovXG5cbnZhciBkZWxpbWl0ZXJzID0gWyd7eycsICd9fSddXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLmV4cG9ydHMsICdkZWxpbWl0ZXJzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGVsaW1pdGVyc1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICBkZWxpbWl0ZXJzID0gdmFsXG4gICAgdGhpcy5fZGVsaW1pdGVyc0NoYW5nZWQgPSB0cnVlXG4gIH1cbn0pIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi93YXRjaGVyJylcbnZhciB0ZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL3RleHQnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9leHByZXNzaW9uJylcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBsaW5rcyBhIERPTSBlbGVtZW50IHdpdGggYSBwaWVjZSBvZiBkYXRhLFxuICogd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBldmFsdWF0aW5nIGFuIGV4cHJlc3Npb24uXG4gKiBJdCByZWdpc3RlcnMgYSB3YXRjaGVyIHdpdGggdGhlIGV4cHJlc3Npb24gYW5kIGNhbGxzXG4gKiB0aGUgRE9NIHVwZGF0ZSBmdW5jdGlvbiB3aGVuIGEgY2hhbmdlIGlzIHRyaWdnZXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvclxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gW2FyZ11cbiAqICAgICAgICAgICAgICAgICAtIHtBcnJheTxPYmplY3Q+fSBbZmlsdGVyc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgLSBkaXJlY3RpdmUgZGVmaW5pdGlvbiBvYmplY3RcbiAqIEBwYXJhbSB7VnVlfHVuZGVmaW5lZH0gaG9zdCAtIHRyYW5zY2x1c2lvbiBob3N0IHRhcmdldFxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gRGlyZWN0aXZlIChuYW1lLCBlbCwgdm0sIGRlc2NyaXB0b3IsIGRlZiwgaG9zdCkge1xuICAvLyBwdWJsaWNcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmVsID0gZWxcbiAgdGhpcy52bSA9IHZtXG4gIC8vIGNvcHkgZGVzY3JpcHRvciBwcm9wc1xuICB0aGlzLnJhdyA9IGRlc2NyaXB0b3IucmF3XG4gIHRoaXMuZXhwcmVzc2lvbiA9IGRlc2NyaXB0b3IuZXhwcmVzc2lvblxuICB0aGlzLmFyZyA9IGRlc2NyaXB0b3IuYXJnXG4gIHRoaXMuZmlsdGVycyA9IF8ucmVzb2x2ZUZpbHRlcnModm0sIGRlc2NyaXB0b3IuZmlsdGVycylcbiAgLy8gcHJpdmF0ZVxuICB0aGlzLl9ob3N0ID0gaG9zdFxuICB0aGlzLl9sb2NrZWQgPSBmYWxzZVxuICB0aGlzLl9ib3VuZCA9IGZhbHNlXG4gIC8vIGluaXRcbiAgdGhpcy5fYmluZChkZWYpXG59XG5cbnZhciBwID0gRGlyZWN0aXZlLnByb3RvdHlwZVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIGRpcmVjdGl2ZSwgbWl4aW4gZGVmaW5pdGlvbiBwcm9wZXJ0aWVzLFxuICogc2V0dXAgdGhlIHdhdGNoZXIsIGNhbGwgZGVmaW5pdGlvbiBiaW5kKCkgYW5kIHVwZGF0ZSgpXG4gKiBpZiBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZcbiAqL1xuXG5wLl9iaW5kID0gZnVuY3Rpb24gKGRlZikge1xuICBpZiAodGhpcy5uYW1lICE9PSAnY2xvYWsnICYmIHRoaXMuZWwgJiYgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUpIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgdGhpcy5uYW1lKVxuICB9XG4gIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy51cGRhdGUgPSBkZWZcbiAgfSBlbHNlIHtcbiAgICBfLmV4dGVuZCh0aGlzLCBkZWYpXG4gIH1cbiAgdGhpcy5fd2F0Y2hlckV4cCA9IHRoaXMuZXhwcmVzc2lvblxuICB0aGlzLl9jaGVja0R5bmFtaWNMaXRlcmFsKClcbiAgaWYgKHRoaXMuYmluZCkge1xuICAgIHRoaXMuYmluZCgpXG4gIH1cbiAgaWYgKHRoaXMuX3dhdGNoZXJFeHAgJiZcbiAgICAgICh0aGlzLnVwZGF0ZSB8fCB0aGlzLnR3b1dheSkgJiZcbiAgICAgICghdGhpcy5pc0xpdGVyYWwgfHwgdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkgJiZcbiAgICAgICF0aGlzLl9jaGVja1N0YXRlbWVudCgpKSB7XG4gICAgLy8gd3JhcHBlZCB1cGRhdGVyIGZvciBjb250ZXh0XG4gICAgdmFyIGRpciA9IHRoaXNcbiAgICB2YXIgdXBkYXRlID0gdGhpcy5fdXBkYXRlID0gdGhpcy51cGRhdGVcbiAgICAgID8gZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgaWYgKCFkaXIuX2xvY2tlZCkge1xuICAgICAgICAgICAgZGlyLnVwZGF0ZSh2YWwsIG9sZFZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIDogZnVuY3Rpb24gKCkge30gLy8gbm9vcCBpZiBubyB1cGRhdGUgaXMgcHJvdmlkZWRcbiAgICAvLyB1c2UgcmF3IGV4cHJlc3Npb24gYXMgaWRlbnRpZmllciBiZWNhdXNlIGZpbHRlcnNcbiAgICAvLyBtYWtlIHRoZW0gZGlmZmVyZW50IHdhdGNoZXJzXG4gICAgdmFyIHdhdGNoZXIgPSB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd11cbiAgICAvLyB2LXJlcGVhdCBhbHdheXMgY3JlYXRlcyBhIG5ldyB3YXRjaGVyIGJlY2F1c2UgaXQgaGFzXG4gICAgLy8gYSBzcGVjaWFsIGZpbHRlciB0aGF0J3MgYm91bmQgdG8gaXRzIGRpcmVjdGl2ZVxuICAgIC8vIGluc3RhbmNlLlxuICAgIGlmICghd2F0Y2hlciB8fCB0aGlzLm5hbWUgPT09ICdyZXBlYXQnKSB7XG4gICAgICB3YXRjaGVyID0gdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddID0gbmV3IFdhdGNoZXIoXG4gICAgICAgIHRoaXMudm0sXG4gICAgICAgIHRoaXMuX3dhdGNoZXJFeHAsXG4gICAgICAgIHVwZGF0ZSwgLy8gY2FsbGJhY2tcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVycyxcbiAgICAgICAgICB0d29XYXk6IHRoaXMudHdvV2F5LFxuICAgICAgICAgIGRlZXA6IHRoaXMuZGVlcFxuICAgICAgICB9XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHdhdGNoZXIuYWRkQ2IodXBkYXRlKVxuICAgIH1cbiAgICB0aGlzLl93YXRjaGVyID0gd2F0Y2hlclxuICAgIGlmICh0aGlzLl9pbml0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgd2F0Y2hlci5zZXQodGhpcy5faW5pdFZhbHVlKVxuICAgIH0gZWxzZSBpZiAodGhpcy51cGRhdGUpIHtcbiAgICAgIHRoaXMudXBkYXRlKHdhdGNoZXIudmFsdWUpXG4gICAgfVxuICB9XG4gIHRoaXMuX2JvdW5kID0gdHJ1ZVxufVxuXG4vKipcbiAqIGNoZWNrIGlmIHRoaXMgaXMgYSBkeW5hbWljIGxpdGVyYWwgYmluZGluZy5cbiAqXG4gKiBlLmcuIHYtY29tcG9uZW50PVwie3tjdXJyZW50Vmlld319XCJcbiAqL1xuXG5wLl9jaGVja0R5bmFtaWNMaXRlcmFsID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcmVzc2lvblxuICBpZiAoZXhwcmVzc2lvbiAmJiB0aGlzLmlzTGl0ZXJhbCkge1xuICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKGV4cHJlc3Npb24pXG4gICAgaWYgKHRva2Vucykge1xuICAgICAgdmFyIGV4cCA9IHRleHRQYXJzZXIudG9rZW5zVG9FeHAodG9rZW5zKVxuICAgICAgdGhpcy5leHByZXNzaW9uID0gdGhpcy52bS4kZ2V0KGV4cClcbiAgICAgIHRoaXMuX3dhdGNoZXJFeHAgPSBleHBcbiAgICAgIHRoaXMuX2lzRHluYW1pY0xpdGVyYWwgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGRpcmVjdGl2ZSBpcyBhIGZ1bmN0aW9uIGNhbGxlclxuICogYW5kIGlmIHRoZSBleHByZXNzaW9uIGlzIGEgY2FsbGFibGUgb25lLiBJZiBib3RoIHRydWUsXG4gKiB3ZSB3cmFwIHVwIHRoZSBleHByZXNzaW9uIGFuZCB1c2UgaXQgYXMgdGhlIGV2ZW50XG4gKiBoYW5kbGVyLlxuICpcbiAqIGUuZy4gdi1vbj1cImNsaWNrOiBhKytcIlxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxucC5fY2hlY2tTdGF0ZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBleHByZXNzaW9uID0gdGhpcy5leHByZXNzaW9uXG4gIGlmIChcbiAgICBleHByZXNzaW9uICYmIHRoaXMuYWNjZXB0U3RhdGVtZW50ICYmXG4gICAgIWV4cFBhcnNlci5wYXRoVGVzdFJFLnRlc3QoZXhwcmVzc2lvbilcbiAgKSB7XG4gICAgdmFyIGZuID0gZXhwUGFyc2VyLnBhcnNlKGV4cHJlc3Npb24pLmdldFxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmNhbGwodm0sIHZtKVxuICAgIH1cbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICBoYW5kbGVyID0gXy5hcHBseUZpbHRlcnMoXG4gICAgICAgIGhhbmRsZXIsXG4gICAgICAgIHRoaXMuZmlsdGVycy5yZWFkLFxuICAgICAgICB2bVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZShoYW5kbGVyKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBmb3IgYW4gYXR0cmlidXRlIGRpcmVjdGl2ZSBwYXJhbSwgZS5nLiBsYXp5XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5wLl9jaGVja1BhcmFtID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyIHBhcmFtID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUobmFtZSlcbiAgaWYgKHBhcmFtICE9PSBudWxsKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgfVxuICByZXR1cm4gcGFyYW1cbn1cblxuLyoqXG4gKiBUZWFyZG93biB0aGUgd2F0Y2hlciBhbmQgY2FsbCB1bmJpbmQuXG4gKi9cblxucC5fdGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLl9ib3VuZCkge1xuICAgIGlmICh0aGlzLnVuYmluZCkge1xuICAgICAgdGhpcy51bmJpbmQoKVxuICAgIH1cbiAgICB2YXIgd2F0Y2hlciA9IHRoaXMuX3dhdGNoZXJcbiAgICBpZiAod2F0Y2hlciAmJiB3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgd2F0Y2hlci5yZW1vdmVDYih0aGlzLl91cGRhdGUpXG4gICAgICBpZiAoIXdhdGNoZXIuYWN0aXZlKSB7XG4gICAgICAgIHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XSA9IG51bGxcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fYm91bmQgPSBmYWxzZVxuICAgIHRoaXMudm0gPSB0aGlzLmVsID0gdGhpcy5fd2F0Y2hlciA9IG51bGxcbiAgfVxufVxuXG4vKipcbiAqIFNldCB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSB3aXRoIHRoZSBzZXR0ZXIuXG4gKiBUaGlzIHNob3VsZCBvbmx5IGJlIHVzZWQgaW4gdHdvLXdheSBkaXJlY3RpdmVzXG4gKiBlLmcuIHYtbW9kZWwuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBsb2NrIC0gcHJldmVudCB3cnRpZSB0cmlnZ2VyaW5nIHVwZGF0ZS5cbiAqIEBwdWJsaWNcbiAqL1xuXG5wLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSwgbG9jaykge1xuICBpZiAodGhpcy50d29XYXkpIHtcbiAgICBpZiAobG9jaykge1xuICAgICAgdGhpcy5fbG9ja2VkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLl93YXRjaGVyLnNldCh2YWx1ZSlcbiAgICBpZiAobG9jaykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBfLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5fbG9ja2VkID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlIiwiLy8geGxpbmtcbnZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnXG52YXIgeGxpbmtSRSA9IC9eeGxpbms6L1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwcmlvcml0eTogODUwLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmFtZSA9IHRoaXMuYXJnXG4gICAgdGhpcy51cGRhdGUgPSB4bGlua1JFLnRlc3QobmFtZSlcbiAgICAgID8geGxpbmtIYW5kbGVyXG4gICAgICA6IGRlZmF1bHRIYW5kbGVyXG4gIH1cblxufVxuXG5mdW5jdGlvbiBkZWZhdWx0SGFuZGxlciAodmFsdWUpIHtcbiAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUodGhpcy5hcmcsIHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXJnKVxuICB9XG59XG5cbmZ1bmN0aW9uIHhsaW5rSGFuZGxlciAodmFsdWUpIHtcbiAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rTlMsIHRoaXMuYXJnLCB2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rTlMsICdocmVmJylcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYWRkQ2xhc3MgPSBfLmFkZENsYXNzXG52YXIgcmVtb3ZlQ2xhc3MgPSBfLnJlbW92ZUNsYXNzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh0aGlzLmFyZykge1xuICAgIHZhciBtZXRob2QgPSB2YWx1ZSA/IGFkZENsYXNzIDogcmVtb3ZlQ2xhc3NcbiAgICBtZXRob2QodGhpcy5lbCwgdGhpcy5hcmcpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMubGFzdFZhbCkge1xuICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5sYXN0VmFsKVxuICAgIH1cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGFkZENsYXNzKHRoaXMuZWwsIHZhbHVlKVxuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsdWVcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLnZtLiRvbmNlKCdob29rOmNvbXBpbGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyAnY2xvYWsnKVxuICAgIH0pXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBTZXR1cC4gVHdvIHBvc3NpYmxlIHVzYWdlczpcbiAgICpcbiAgICogLSBzdGF0aWM6XG4gICAqICAgdi1jb21wb25lbnQ9XCJjb21wXCJcbiAgICpcbiAgICogLSBkeW5hbWljOlxuICAgKiAgIHYtY29tcG9uZW50PVwie3tjdXJyZW50Vmlld319XCJcbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbC5fX3Z1ZV9fKSB7XG4gICAgICAvLyBjcmVhdGUgYSByZWYgYW5jaG9yXG4gICAgICB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtY29tcG9uZW50JylcbiAgICAgIF8ucmVwbGFjZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAgIC8vIGNoZWNrIGtlZXAtYWxpdmUgb3B0aW9ucy5cbiAgICAgIC8vIElmIHllcywgaW5zdGVhZCBvZiBkZXN0cm95aW5nIHRoZSBhY3RpdmUgdm0gd2hlblxuICAgICAgLy8gaGlkaW5nICh2LWlmKSBvciBzd2l0Y2hpbmcgKGR5bmFtaWMgbGl0ZXJhbCkgaXQsXG4gICAgICAvLyB3ZSBzaW1wbHkgcmVtb3ZlIGl0IGZyb20gdGhlIERPTSBhbmQgc2F2ZSBpdCBpbiBhXG4gICAgICAvLyBjYWNoZSBvYmplY3QsIHdpdGggaXRzIGNvbnN0cnVjdG9yIGlkIGFzIHRoZSBrZXkuXG4gICAgICB0aGlzLmtlZXBBbGl2ZSA9IHRoaXMuX2NoZWNrUGFyYW0oJ2tlZXAtYWxpdmUnKSAhPSBudWxsXG4gICAgICAvLyBjaGVjayByZWZcbiAgICAgIHRoaXMucmVmSUQgPSBfLmF0dHIodGhpcy5lbCwgJ3JlZicpXG4gICAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9XG4gICAgICB9XG4gICAgICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGVcbiAgICAgIGlmICh0aGlzLl9jaGVja1BhcmFtKCdpbmxpbmUtdGVtcGxhdGUnKSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBleHRyYWN0IGlubGluZSB0ZW1wbGF0ZSBhcyBhIERvY3VtZW50RnJhZ21lbnRcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8uZXh0cmFjdENvbnRlbnQodGhpcy5lbCwgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIC8vIGlmIHN0YXRpYywgYnVpbGQgcmlnaHQgbm93LlxuICAgICAgaWYgKCF0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZUN0b3IodGhpcy5leHByZXNzaW9uKVxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmJ1aWxkKClcbiAgICAgICAgY2hpbGQuJGJlZm9yZSh0aGlzLnJlZilcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50KGNoaWxkKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2hlY2sgZHluYW1pYyBjb21wb25lbnQgcGFyYW1zXG4gICAgICAgIHRoaXMucmVhZHlFdmVudCA9IHRoaXMuX2NoZWNrUGFyYW0oJ3dhaXQtZm9yJylcbiAgICAgICAgdGhpcy50cmFuc01vZGUgPSB0aGlzLl9jaGVja1BhcmFtKCd0cmFuc2l0aW9uLW1vZGUnKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LWNvbXBvbmVudD1cIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgY2Fubm90IGJlICcgK1xuICAgICAgICAndXNlZCBvbiBhbiBhbHJlYWR5IG1vdW50ZWQgaW5zdGFuY2UuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIHRvIHVzZSB3aGVuIGNyZWF0aW5nXG4gICAqIHRoZSBjaGlsZCB2bS5cbiAgICovXG5cbiAgcmVzb2x2ZUN0b3I6IGZ1bmN0aW9uIChpZCkge1xuICAgIHRoaXMuY3RvcklkID0gaWRcbiAgICB0aGlzLkN0b3IgPSB0aGlzLnZtLiRvcHRpb25zLmNvbXBvbmVudHNbaWRdXG4gICAgXy5hc3NlcnRBc3NldCh0aGlzLkN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgfSxcblxuICAvKipcbiAgICogSW5zdGFudGlhdGUvaW5zZXJ0IGEgbmV3IGNoaWxkIHZtLlxuICAgKiBJZiBrZWVwIGFsaXZlIGFuZCBoYXMgY2FjaGVkIGluc3RhbmNlLCBpbnNlcnQgdGhhdFxuICAgKiBpbnN0YW5jZTsgb3RoZXJ3aXNlIGJ1aWxkIGEgbmV3IG9uZSBhbmQgY2FjaGUgaXQuXG4gICAqXG4gICAqIEByZXR1cm4ge1Z1ZX0gLSB0aGUgY3JlYXRlZCBpbnN0YW5jZVxuICAgKi9cblxuICBidWlsZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuY2FjaGVbdGhpcy5jdG9ySWRdXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHJldHVybiBjYWNoZWRcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBlbCA9IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMuZWwpXG4gICAgaWYgKHRoaXMuQ3Rvcikge1xuICAgICAgdmFyIGNoaWxkID0gdm0uJGFkZENoaWxkKHtcbiAgICAgICAgZWw6IGVsLFxuICAgICAgICB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSxcbiAgICAgICAgX2FzQ29tcG9uZW50OiB0cnVlLFxuICAgICAgICBfaG9zdDogdGhpcy5faG9zdFxuICAgICAgfSwgdGhpcy5DdG9yKVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVbdGhpcy5jdG9ySWRdID0gY2hpbGRcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVGVhcmRvd24gdGhlIGN1cnJlbnQgY2hpbGQsIGJ1dCBkZWZlcnMgY2xlYW51cCBzb1xuICAgKiB0aGF0IHdlIGNhbiBzZXBhcmF0ZSB0aGUgZGVzdHJveSBhbmQgcmVtb3ZhbCBzdGVwcy5cbiAgICovXG5cbiAgdW5idWlsZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRWTVxuICAgIGlmICghY2hpbGQgfHwgdGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyB0aGUgc29sZSBwdXJwb3NlIG9mIGBkZWZlckNsZWFudXBgIGlzIHNvIHRoYXQgd2UgY2FuXG4gICAgLy8gXCJkZWFjdGl2YXRlXCIgdGhlIHZtIHJpZ2h0IG5vdyBhbmQgcGVyZm9ybSBET00gcmVtb3ZhbFxuICAgIC8vIGxhdGVyLlxuICAgIGNoaWxkLiRkZXN0cm95KGZhbHNlLCB0cnVlKVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgY3VycmVudCBkZXN0cm95ZWQgY2hpbGQgYW5kIG1hbnVhbGx5IGRvXG4gICAqIHRoZSBjbGVhbnVwIGFmdGVyIHJlbW92YWwuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAqL1xuXG4gIHJlbW92ZTogZnVuY3Rpb24gKGNoaWxkLCBjYikge1xuICAgIHZhciBrZWVwQWxpdmUgPSB0aGlzLmtlZXBBbGl2ZVxuICAgIGlmIChjaGlsZCkge1xuICAgICAgY2hpbGQuJHJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgha2VlcEFsaXZlKSBjaGlsZC5fY2xlYW51cCgpXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGNiKSB7XG4gICAgICBjYigpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgY2FsbGJhY2sgZm9yIHRoZSBkeW5hbWljIGxpdGVyYWwgc2NlbmFyaW8sXG4gICAqIGUuZy4gdi1jb21wb25lbnQ9XCJ7e3ZpZXd9fVwiXG4gICAqL1xuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgLy8ganVzdCBkZXN0cm95IGFuZCByZW1vdmUgY3VycmVudFxuICAgICAgdGhpcy51bmJ1aWxkKClcbiAgICAgIHRoaXMucmVtb3ZlKHRoaXMuY2hpbGRWTSlcbiAgICAgIHRoaXMudW5zZXRDdXJyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNvbHZlQ3Rvcih2YWx1ZSlcbiAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICB2YXIgbmV3Q29tcG9uZW50ID0gdGhpcy5idWlsZCgpXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIGlmICh0aGlzLnJlYWR5RXZlbnQpIHtcbiAgICAgICAgbmV3Q29tcG9uZW50LiRvbmNlKHRoaXMucmVhZHlFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuc3dhcFRvKG5ld0NvbXBvbmVudClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3dhcFRvKG5ld0NvbXBvbmVudClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IHN3YXAgdGhlIGNvbXBvbmVudHMsIGRlcGVuZGluZyBvbiB0aGVcbiAgICogdHJhbnNpdGlvbiBtb2RlLiBEZWZhdWx0cyB0byBzaW11bHRhbmVvdXMuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB0YXJnZXRcbiAgICovXG5cbiAgc3dhcFRvOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmNoaWxkVk1cbiAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgdGhpcy5zZXRDdXJyZW50KHRhcmdldClcbiAgICBzd2l0Y2ggKHNlbGYudHJhbnNNb2RlKSB7XG4gICAgICBjYXNlICdpbi1vdXQnOlxuICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLnJlZiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYucmVtb3ZlKGN1cnJlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdvdXQtaW4nOlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50KVxuICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLnJlZilcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuICBcbiAgc2V0Q3VycmVudDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZFZNID0gY2hpbGRcbiAgICB2YXIgcmVmSUQgPSBjaGlsZC5fcmVmSUQgfHwgdGhpcy5yZWZJRFxuICAgIGlmIChyZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3JlZklEXSA9IGNoaWxkXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVbnNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuXG4gIHVuc2V0Q3VycmVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRWTVxuICAgIHRoaXMuY2hpbGRWTSA9IG51bGxcbiAgICB2YXIgcmVmSUQgPSAoY2hpbGQgJiYgY2hpbGQuX3JlZklEKSB8fCB0aGlzLnJlZklEXG4gICAgaWYgKHJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbcmVmSURdID0gbnVsbFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVW5iaW5kLlxuICAgKi9cblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVuYnVpbGQoKVxuICAgIC8vIGRlc3Ryb3kgYWxsIGtlZXAtYWxpdmUgY2FjaGVkIGluc3RhbmNlc1xuICAgIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5jYWNoZSkge1xuICAgICAgICB0aGlzLmNhY2hlW2tleV0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZSA9IG51bGxcbiAgICB9XG4gIH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dID0gdGhpcy5lbFxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGRlbGV0ZSB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl1cbiAgfVxuICBcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBhY2NlcHRTdGF0ZW1lbnQ6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghY2hpbGQgfHwgdGhpcy52bSAhPT0gY2hpbGQuJHBhcmVudCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnYHYtZXZlbnRzYCBzaG91bGQgb25seSBiZSB1c2VkIG9uIGEgY2hpbGQgY29tcG9uZW50ICcgK1xuICAgICAgICAnZnJvbSB0aGUgcGFyZW50IHRlbXBsYXRlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChoYW5kbGVyLCBvbGRIYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdEaXJlY3RpdmUgXCJ2LWV2ZW50czonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgK1xuICAgICAgICAnZXhwZWN0cyBhIGZ1bmN0aW9uIHZhbHVlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY2hpbGQgPSB0aGlzLmVsLl9fdnVlX19cbiAgICBpZiAob2xkSGFuZGxlcikge1xuICAgICAgY2hpbGQuJG9mZih0aGlzLmFyZywgb2xkSGFuZGxlcilcbiAgICB9XG4gICAgY2hpbGQuJG9uKHRoaXMuYXJnLCBoYW5kbGVyKVxuICB9XG5cbiAgLy8gd2hlbiBjaGlsZCBpcyBkZXN0cm95ZWQsIGFsbCBldmVudHMgYXJlIHR1cm5lZCBvZmYsXG4gIC8vIHNvIG5vIG5lZWQgZm9yIHVuYmluZCBoZXJlLlxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYSBjb21tZW50IG5vZGUgbWVhbnMgdGhpcyBpcyBhIGJpbmRpbmcgZm9yXG4gICAgLy8ge3t7IGlubGluZSB1bmVzY2FwZWQgaHRtbCB9fX1cbiAgICBpZiAodGhpcy5lbC5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgLy8gaG9sZCBub2Rlc1xuICAgICAgdGhpcy5ub2RlcyA9IFtdXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBfLnRvU3RyaW5nKHZhbHVlKVxuICAgIGlmICh0aGlzLm5vZGVzKSB7XG4gICAgICB0aGlzLnN3YXAodmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgc3dhcDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIG9sZCBub2Rlc1xuICAgIHZhciBpID0gdGhpcy5ub2Rlcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBfLnJlbW92ZSh0aGlzLm5vZGVzW2ldKVxuICAgIH1cbiAgICAvLyBjb252ZXJ0IG5ldyB2YWx1ZSB0byBhIGZyYWdtZW50XG4gICAgLy8gZG8gbm90IGF0dGVtcHQgdG8gcmV0cmlldmUgZnJvbSBpZCBzZWxlY3RvclxuICAgIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodmFsdWUsIHRydWUsIHRydWUpXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSB0byB0aGVzZSBub2RlcyBzbyB3ZSBjYW4gcmVtb3ZlIGxhdGVyXG4gICAgdGhpcy5ub2RlcyA9IF8udG9BcnJheShmcmFnLmNoaWxkTm9kZXMpXG4gICAgXy5iZWZvcmUoZnJhZywgdGhpcy5lbClcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKCFlbC5fX3Z1ZV9fKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1pZi1zdGFydCcpXG4gICAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaWYtZW5kJylcbiAgICAgIF8ucmVwbGFjZShlbCwgdGhpcy5lbmQpXG4gICAgICBfLmJlZm9yZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgICAgIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZShlbCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZVBhcnNlci5jbG9uZShlbCkpXG4gICAgICB9XG4gICAgICAvLyBjb21waWxlIHRoZSBuZXN0ZWQgcGFydGlhbFxuICAgICAgdGhpcy5saW5rZXIgPSBjb21waWxlKFxuICAgICAgICB0aGlzLnRlbXBsYXRlLFxuICAgICAgICB0aGlzLnZtLiRvcHRpb25zLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW52YWxpZCA9IHRydWVcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtaWY9XCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGNhbm5vdCBiZSAnICtcbiAgICAgICAgJ3VzZWQgb24gYW4gYWxyZWFkeSBtb3VudGVkIGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbnZhbGlkKSByZXR1cm5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIC8vIGF2b2lkIGR1cGxpY2F0ZSBjb21waWxlcywgc2luY2UgdXBkYXRlKCkgY2FuIGJlXG4gICAgICAvLyBjYWxsZWQgd2l0aCBkaWZmZXJlbnQgdHJ1dGh5IHZhbHVlc1xuICAgICAgaWYgKCF0aGlzLnVubGluaykge1xuICAgICAgICB2YXIgZnJhZyA9IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMudGVtcGxhdGUpXG4gICAgICAgIHRoaXMuY29tcGlsZShmcmFnKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH0sXG5cbiAgLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyBzaGFyZWQgaW4gdi1wYXJ0aWFsXG4gIGNvbXBpbGU6IGZ1bmN0aW9uIChmcmFnKSB7XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIC8vIHRoZSBsaW5rZXIgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgcHJlc2VudCBiZWNhdXNlXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBtaWdodCBnZXQgY2FsbGVkIGJ5IHYtcGFydGlhbCBcbiAgICB0aGlzLnVubGluayA9IHRoaXMubGlua2VyXG4gICAgICA/IHRoaXMubGlua2VyKHZtLCBmcmFnKVxuICAgICAgOiB2bS4kY29tcGlsZShmcmFnKVxuICAgIHRyYW5zaXRpb24uYmxvY2tBcHBlbmQoZnJhZywgdGhpcy5lbmQsIHZtKVxuICAgIC8vIGNhbGwgYXR0YWNoZWQgZm9yIGFsbCB0aGUgY2hpbGQgY29tcG9uZW50cyBjcmVhdGVkXG4gICAgLy8gZHVyaW5nIHRoZSBjb21waWxhdGlvblxuICAgIGlmIChfLmluRG9jKHZtLiRlbCkpIHtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuZ2V0Q29udGFpbmVkQ29tcG9uZW50cygpXG4gICAgICBpZiAoY2hpbGRyZW4pIGNoaWxkcmVuLmZvckVhY2goY2FsbEF0dGFjaClcbiAgICB9XG4gIH0sXG5cbiAgLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyBzaGFyZWQgaW4gdi1wYXJ0aWFsXG4gIHRlYXJkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnVubGluaykgcmV0dXJuXG4gICAgLy8gY29sbGVjdCBjaGlsZHJlbiBiZWZvcmVoYW5kXG4gICAgdmFyIGNoaWxkcmVuXG4gICAgaWYgKF8uaW5Eb2ModGhpcy52bS4kZWwpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q29udGFpbmVkQ29tcG9uZW50cygpXG4gICAgfVxuICAgIHRyYW5zaXRpb24uYmxvY2tSZW1vdmUodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudm0pXG4gICAgaWYgKGNoaWxkcmVuKSBjaGlsZHJlbi5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gICAgdGhpcy51bmxpbmsoKVxuICAgIHRoaXMudW5saW5rID0gbnVsbFxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICBnZXRDb250YWluZWRDb21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBzdGFydCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmdcbiAgICB2YXIgZW5kID0gdGhpcy5lbmRcbiAgICB2YXIgc2VsZkNvbXBvZW50cyA9XG4gICAgICB2bS5fY2hpbGRyZW4ubGVuZ3RoICYmXG4gICAgICB2bS5fY2hpbGRyZW4uZmlsdGVyKGNvbnRhaW5zKVxuICAgIHZhciB0cmFuc0NvbXBvbmVudHMgPVxuICAgICAgdm0uX3RyYW5zQ3BudHMgJiZcbiAgICAgIHZtLl90cmFuc0NwbnRzLmZpbHRlcihjb250YWlucylcblxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zIChjKSB7XG4gICAgICB2YXIgY3VyID0gc3RhcnRcbiAgICAgIHZhciBuZXh0XG4gICAgICB3aGlsZSAobmV4dCAhPT0gZW5kKSB7XG4gICAgICAgIG5leHQgPSBjdXIubmV4dFNpYmxpbmdcbiAgICAgICAgaWYgKGN1ci5jb250YWlucyhjLiRlbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIGN1ciA9IG5leHRcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBzZWxmQ29tcG9lbnRzXG4gICAgICA/IHRyYW5zQ29tcG9uZW50c1xuICAgICAgICA/IHNlbGZDb21wb2VudHMuY29uY2F0KHRyYW5zQ29tcG9uZW50cylcbiAgICAgICAgOiBzZWxmQ29tcG9lbnRzXG4gICAgICA6IHRyYW5zQ29tcG9uZW50c1xuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy51bmxpbmspIHRoaXMudW5saW5rKClcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGNhbGxBdHRhY2ggKGNoaWxkKSB7XG4gIGlmICghY2hpbGQuX2lzQXR0YWNoZWQpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxsRGV0YWNoIChjaGlsZCkge1xuICBpZiAoY2hpbGQuX2lzQXR0YWNoZWQpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgfVxufSIsIi8vIG1hbmlwdWxhdGlvbiBkaXJlY3RpdmVzXG5leHBvcnRzLnRleHQgICAgICAgPSByZXF1aXJlKCcuL3RleHQnKVxuZXhwb3J0cy5odG1sICAgICAgID0gcmVxdWlyZSgnLi9odG1sJylcbmV4cG9ydHMuYXR0ciAgICAgICA9IHJlcXVpcmUoJy4vYXR0cicpXG5leHBvcnRzLnNob3cgICAgICAgPSByZXF1aXJlKCcuL3Nob3cnKVxuZXhwb3J0c1snY2xhc3MnXSAgID0gcmVxdWlyZSgnLi9jbGFzcycpXG5leHBvcnRzLmVsICAgICAgICAgPSByZXF1aXJlKCcuL2VsJylcbmV4cG9ydHMucmVmICAgICAgICA9IHJlcXVpcmUoJy4vcmVmJylcbmV4cG9ydHMuY2xvYWsgICAgICA9IHJlcXVpcmUoJy4vY2xvYWsnKVxuZXhwb3J0cy5zdHlsZSAgICAgID0gcmVxdWlyZSgnLi9zdHlsZScpXG5leHBvcnRzLnBhcnRpYWwgICAgPSByZXF1aXJlKCcuL3BhcnRpYWwnKVxuZXhwb3J0cy50cmFuc2l0aW9uID0gcmVxdWlyZSgnLi90cmFuc2l0aW9uJylcblxuLy8gZXZlbnQgbGlzdGVuZXIgZGlyZWN0aXZlc1xuZXhwb3J0cy5vbiAgICAgICAgID0gcmVxdWlyZSgnLi9vbicpXG5leHBvcnRzLm1vZGVsICAgICAgPSByZXF1aXJlKCcuL21vZGVsJylcblxuLy8gY2hpbGQgdm0gZGlyZWN0aXZlc1xuZXhwb3J0cy5jb21wb25lbnQgID0gcmVxdWlyZSgnLi9jb21wb25lbnQnKVxuZXhwb3J0cy5yZXBlYXQgICAgID0gcmVxdWlyZSgnLi9yZXBlYXQnKVxuZXhwb3J0c1snaWYnXSAgICAgID0gcmVxdWlyZSgnLi9pZicpXG5cbi8vIGNoaWxkIHZtIGNvbW11bmljYXRpb24gZGlyZWN0aXZlc1xuZXhwb3J0c1snd2l0aCddICAgID0gcmVxdWlyZSgnLi93aXRoJylcbmV4cG9ydHMuZXZlbnRzICAgICA9IHJlcXVpcmUoJy4vZXZlbnRzJykiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIHRoaXMubGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnNldChlbC5jaGVja2VkLCB0cnVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBpZiAoZWwuY2hlY2tlZCkge1xuICAgICAgdGhpcy5faW5pdFZhbHVlID0gZWwuY2hlY2tlZFxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZWwuY2hlY2tlZCA9ICEhdmFsdWVcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBfLm9mZih0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcblxuICAgIC8vIGNoZWNrIHBhcmFtc1xuICAgIC8vIC0gbGF6eTogdXBkYXRlIG1vZGVsIG9uIFwiY2hhbmdlXCIgaW5zdGVhZCBvZiBcImlucHV0XCJcbiAgICB2YXIgbGF6eSA9IHRoaXMuX2NoZWNrUGFyYW0oJ2xhenknKSAhPSBudWxsXG4gICAgLy8gLSBudW1iZXI6IGNhc3QgdmFsdWUgaW50byBudW1iZXIgd2hlbiB1cGRhdGluZyBtb2RlbC5cbiAgICB2YXIgbnVtYmVyID0gdGhpcy5fY2hlY2tQYXJhbSgnbnVtYmVyJykgIT0gbnVsbFxuICAgIC8vIC0gZGVib3VuY2U6IGRlYm91bmNlIHRoZSBpbnB1dCBsaXN0ZW5lclxuICAgIHZhciBkZWJvdW5jZSA9IHBhcnNlSW50KHRoaXMuX2NoZWNrUGFyYW0oJ2RlYm91bmNlJyksIDEwKVxuXG4gICAgLy8gaGFuZGxlIGNvbXBvc2l0aW9uIGV2ZW50cy5cbiAgICAvLyBodHRwOi8vYmxvZy5ldmFueW91Lm1lLzIwMTQvMDEvMDMvY29tcG9zaXRpb24tZXZlbnQvXG4gICAgdmFyIGNwTG9ja2VkID0gZmFsc2VcbiAgICB0aGlzLmNwTG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNwTG9ja2VkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLmNwVW5sb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3BMb2NrZWQgPSBmYWxzZVxuICAgICAgLy8gaW4gSUUxMSB0aGUgXCJjb21wb3NpdGlvbmVuZFwiIGV2ZW50IGZpcmVzIEFGVEVSXG4gICAgICAvLyB0aGUgXCJpbnB1dFwiIGV2ZW50LCBzbyB0aGUgaW5wdXQgaGFuZGxlciBpcyBibG9ja2VkXG4gICAgICAvLyBhdCB0aGUgZW5kLi4uIGhhdmUgdG8gY2FsbCBpdCBoZXJlLlxuICAgICAgc2V0KClcbiAgICB9XG4gICAgXy5vbihlbCwnY29tcG9zaXRpb25zdGFydCcsIHRoaXMuY3BMb2NrKVxuICAgIF8ub24oZWwsJ2NvbXBvc2l0aW9uZW5kJywgdGhpcy5jcFVubG9jaylcblxuICAgIC8vIHNoYXJlZCBzZXR0ZXJcbiAgICBmdW5jdGlvbiBzZXQgKCkge1xuICAgICAgc2VsZi5zZXQoXG4gICAgICAgIG51bWJlciA/IF8udG9OdW1iZXIoZWwudmFsdWUpIDogZWwudmFsdWUsXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgZGlyZWN0aXZlIGhhcyBmaWx0ZXJzLCB3ZSBuZWVkIHRvXG4gICAgLy8gcmVjb3JkIGN1cnNvciBwb3NpdGlvbiBhbmQgcmVzdG9yZSBpdCBhZnRlciB1cGRhdGluZ1xuICAgIC8vIHRoZSBpbnB1dCB3aXRoIHRoZSBmaWx0ZXJlZCB2YWx1ZS5cbiAgICAvLyBhbHNvIGZvcmNlIHVwZGF0ZSBmb3IgdHlwZT1cInJhbmdlXCIgaW5wdXRzIHRvIGVuYWJsZVxuICAgIC8vIFwibG9jayBpbiByYW5nZVwiIChzZWUgIzUwNilcbiAgICB2YXIgaGFzUmVhZEZpbHRlciA9IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMucmVhZFxuICAgIHRoaXMubGlzdGVuZXIgPSBoYXNSZWFkRmlsdGVyIHx8IGVsLnR5cGUgPT09ICdyYW5nZSdcbiAgICAgID8gZnVuY3Rpb24gdGV4dElucHV0TGlzdGVuZXIgKCkge1xuICAgICAgICAgIGlmIChjcExvY2tlZCkgcmV0dXJuXG4gICAgICAgICAgdmFyIGNoYXJzT2Zmc2V0XG4gICAgICAgICAgLy8gc29tZSBIVE1MNSBpbnB1dCB0eXBlcyB0aHJvdyBlcnJvciBoZXJlXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIHJlY29yZCBob3cgbWFueSBjaGFycyBmcm9tIHRoZSBlbmQgb2YgaW5wdXRcbiAgICAgICAgICAgIC8vIHRoZSBjdXJzb3Igd2FzIGF0XG4gICAgICAgICAgICBjaGFyc09mZnNldCA9IGVsLnZhbHVlLmxlbmd0aCAtIGVsLnNlbGVjdGlvblN0YXJ0XG4gICAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgICAvLyBGaXggSUUxMC8xMSBpbmZpbml0ZSB1cGRhdGUgY3ljbGVcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20veXl4OTkwODAzL3Z1ZS9pc3N1ZXMvNTkyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgICAgaWYgKGNoYXJzT2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHNldCgpXG4gICAgICAgICAgXy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBmb3JjZSBhIHZhbHVlIHVwZGF0ZSwgYmVjYXVzZSBpblxuICAgICAgICAgICAgLy8gY2VydGFpbiBjYXNlcyB0aGUgd3JpdGUgZmlsdGVycyBvdXRwdXQgdGhlXG4gICAgICAgICAgICAvLyBzYW1lIHJlc3VsdCBmb3IgZGlmZmVyZW50IGlucHV0IHZhbHVlcywgYW5kXG4gICAgICAgICAgICAvLyB0aGUgT2JzZXJ2ZXIgc2V0IGV2ZW50cyB3b24ndCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gc2VsZi5fd2F0Y2hlci52YWx1ZVxuICAgICAgICAgICAgc2VsZi51cGRhdGUobmV3VmFsKVxuICAgICAgICAgICAgaWYgKGNoYXJzT2Zmc2V0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgdmFyIGN1cnNvclBvcyA9XG4gICAgICAgICAgICAgICAgXy50b1N0cmluZyhuZXdWYWwpLmxlbmd0aCAtIGNoYXJzT2Zmc2V0XG4gICAgICAgICAgICAgIGVsLnNldFNlbGVjdGlvblJhbmdlKGN1cnNvclBvcywgY3Vyc29yUG9zKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIDogZnVuY3Rpb24gdGV4dElucHV0TGlzdGVuZXIgKCkge1xuICAgICAgICAgIGlmIChjcExvY2tlZCkgcmV0dXJuXG4gICAgICAgICAgc2V0KClcbiAgICAgICAgfVxuXG4gICAgaWYgKGRlYm91bmNlKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyID0gXy5kZWJvdW5jZSh0aGlzLmxpc3RlbmVyLCBkZWJvdW5jZSlcbiAgICB9XG4gICAgdGhpcy5ldmVudCA9IGxhenkgPyAnY2hhbmdlJyA6ICdpbnB1dCdcbiAgICAvLyBTdXBwb3J0IGpRdWVyeSBldmVudHMsIHNpbmNlIGpRdWVyeS50cmlnZ2VyKCkgZG9lc24ndFxuICAgIC8vIHRyaWdnZXIgbmF0aXZlIGV2ZW50cyBpbiBzb21lIGNhc2VzIGFuZCBzb21lIHBsdWdpbnNcbiAgICAvLyByZWx5IG9uICQudHJpZ2dlcigpXG4gICAgLy8gXG4gICAgLy8gV2Ugd2FudCB0byBtYWtlIHN1cmUgaWYgYSBsaXN0ZW5lciBpcyBhdHRhY2hlZCB1c2luZ1xuICAgIC8vIGpRdWVyeSwgaXQgaXMgYWxzbyByZW1vdmVkIHdpdGggalF1ZXJ5LCB0aGF0J3Mgd2h5XG4gICAgLy8gd2UgZG8gdGhlIGNoZWNrIGZvciBlYWNoIGRpcmVjdGl2ZSBpbnN0YW5jZSBhbmRcbiAgICAvLyBzdG9yZSB0aGF0IGNoZWNrIHJlc3VsdCBvbiBpdHNlbGYuIFRoaXMgYWxzbyBhbGxvd3NcbiAgICAvLyBlYXNpZXIgdGVzdCBjb3ZlcmFnZSBjb250cm9sIGJ5IHVuc2V0dGluZyB0aGUgZ2xvYmFsXG4gICAgLy8galF1ZXJ5IHZhcmlhYmxlIGluIHRlc3RzLlxuICAgIHRoaXMuaGFzalF1ZXJ5ID0gdHlwZW9mIGpRdWVyeSA9PT0gJ2Z1bmN0aW9uJ1xuICAgIGlmICh0aGlzLmhhc2pRdWVyeSkge1xuICAgICAgalF1ZXJ5KGVsKS5vbih0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9uKGVsLCB0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH1cblxuICAgIC8vIElFOSBkb2Vzbid0IGZpcmUgaW5wdXQgZXZlbnQgb24gYmFja3NwYWNlL2RlbC9jdXRcbiAgICBpZiAoIWxhenkgJiYgXy5pc0lFOSkge1xuICAgICAgdGhpcy5vbkN1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXy5uZXh0VGljayhzZWxmLmxpc3RlbmVyKVxuICAgICAgfVxuICAgICAgdGhpcy5vbkRlbCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDQ2IHx8IGUua2V5Q29kZSA9PT0gOCkge1xuICAgICAgICAgIHNlbGYubGlzdGVuZXIoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBfLm9uKGVsLCAnY3V0JywgdGhpcy5vbkN1dClcbiAgICAgIF8ub24oZWwsICdrZXl1cCcsIHRoaXMub25EZWwpXG4gICAgfVxuXG4gICAgLy8gc2V0IGluaXRpYWwgdmFsdWUgaWYgcHJlc2VudFxuICAgIGlmIChcbiAgICAgIGVsLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSB8fFxuICAgICAgKGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScgJiYgZWwudmFsdWUudHJpbSgpKVxuICAgICkge1xuICAgICAgdGhpcy5faW5pdFZhbHVlID0gbnVtYmVyXG4gICAgICAgID8gXy50b051bWJlcihlbC52YWx1ZSlcbiAgICAgICAgOiBlbC52YWx1ZVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZWwudmFsdWUgPSBfLnRvU3RyaW5nKHZhbHVlKVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBpZiAodGhpcy5oYXNqUXVlcnkpIHtcbiAgICAgIGpRdWVyeShlbCkub2ZmKHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ub2ZmKGVsLCB0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH1cbiAgICBfLm9mZihlbCwnY29tcG9zaXRpb25zdGFydCcsIHRoaXMuY3BMb2NrKVxuICAgIF8ub2ZmKGVsLCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY3BVbmxvY2spXG4gICAgaWYgKHRoaXMub25DdXQpIHtcbiAgICAgIF8ub2ZmKGVsLCdjdXQnLCB0aGlzLm9uQ3V0KVxuICAgICAgXy5vZmYoZWwsJ2tleXVwJywgdGhpcy5vbkRlbClcbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbnZhciBoYW5kbGVycyA9IHtcbiAgX2RlZmF1bHQ6IHJlcXVpcmUoJy4vZGVmYXVsdCcpLFxuICByYWRpbzogcmVxdWlyZSgnLi9yYWRpbycpLFxuICBzZWxlY3Q6IHJlcXVpcmUoJy4vc2VsZWN0JyksXG4gIGNoZWNrYm94OiByZXF1aXJlKCcuL2NoZWNrYm94Jylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDgwMCxcbiAgdHdvV2F5OiB0cnVlLFxuICBoYW5kbGVyczogaGFuZGxlcnMsXG5cbiAgLyoqXG4gICAqIFBvc3NpYmxlIGVsZW1lbnRzOlxuICAgKiAgIDxzZWxlY3Q+XG4gICAqICAgPHRleHRhcmVhPlxuICAgKiAgIDxpbnB1dCB0eXBlPVwiKlwiPlxuICAgKiAgICAgLSB0ZXh0XG4gICAqICAgICAtIGNoZWNrYm94XG4gICAqICAgICAtIHJhZGlvXG4gICAqICAgICAtIG51bWJlclxuICAgKiAgICAgLSBUT0RPOiBtb3JlIHR5cGVzIG1heSBiZSBzdXBwbGllZCBhcyBhIHBsdWdpblxuICAgKi9cblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZnJpZW5kbHkgd2FybmluZy4uLlxuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5maWx0ZXJzXG4gICAgaWYgKGZpbHRlcnMgJiYgZmlsdGVycy5yZWFkICYmICFmaWx0ZXJzLndyaXRlKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdJdCBzZWVtcyB5b3UgYXJlIHVzaW5nIGEgcmVhZC1vbmx5IGZpbHRlciB3aXRoICcgK1xuICAgICAgICAndi1tb2RlbC4gWW91IG1pZ2h0IHdhbnQgdG8gdXNlIGEgdHdvLXdheSBmaWx0ZXIgJyArXG4gICAgICAgICd0byBlbnN1cmUgY29ycmVjdCBiZWhhdmlvci4nXG4gICAgICApXG4gICAgfVxuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB2YXIgdGFnID0gZWwudGFnTmFtZVxuICAgIHZhciBoYW5kbGVyXG4gICAgaWYgKHRhZyA9PT0gJ0lOUFVUJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzW2VsLnR5cGVdIHx8IGhhbmRsZXJzLl9kZWZhdWx0XG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdTRUxFQ1QnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnMuc2VsZWN0XG4gICAgfSBlbHNlIGlmICh0YWcgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVycy5fZGVmYXVsdFxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oXCJ2LW1vZGVsIGRvZXNuJ3Qgc3VwcG9ydCBlbGVtZW50IHR5cGU6IFwiICsgdGFnKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZXIuYmluZC5jYWxsKHRoaXMpXG4gICAgdGhpcy51cGRhdGUgPSBoYW5kbGVyLnVwZGF0ZVxuICAgIHRoaXMudW5iaW5kID0gaGFuZGxlci51bmJpbmRcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoZWwudmFsdWUsIHRydWUpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmIChlbC5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBlbC52YWx1ZVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgdGhpcy5lbC5jaGVja2VkID0gdmFsdWUgPT0gdGhpcy5lbC52YWx1ZVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuLi8uLi93YXRjaGVyJylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuLi8uLi9wYXJzZXJzL2RpcmVjdGl2ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgLy8gY2hlY2sgb3B0aW9ucyBwYXJhbVxuICAgIHZhciBvcHRpb25zUGFyYW0gPSB0aGlzLl9jaGVja1BhcmFtKCdvcHRpb25zJylcbiAgICBpZiAob3B0aW9uc1BhcmFtKSB7XG4gICAgICBpbml0T3B0aW9ucy5jYWxsKHRoaXMsIG9wdGlvbnNQYXJhbSlcbiAgICB9XG4gICAgdGhpcy5udW1iZXIgPSB0aGlzLl9jaGVja1BhcmFtKCdudW1iZXInKSAhPSBudWxsXG4gICAgdGhpcy5tdWx0aXBsZSA9IGVsLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKVxuICAgIHRoaXMubGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBzZWxmLm11bHRpcGxlXG4gICAgICAgID8gZ2V0TXVsdGlWYWx1ZShlbClcbiAgICAgICAgOiBlbC52YWx1ZVxuICAgICAgdmFsdWUgPSBzZWxmLm51bWJlclxuICAgICAgICA/IF8uaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlLm1hcChfLnRvTnVtYmVyKVxuICAgICAgICAgIDogXy50b051bWJlcih2YWx1ZSlcbiAgICAgICAgOiB2YWx1ZVxuICAgICAgc2VsZi5zZXQodmFsdWUsIHRydWUpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGNoZWNrSW5pdGlhbFZhbHVlLmNhbGwodGhpcylcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIGVsLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgIHZhciBtdWx0aSA9IHRoaXMubXVsdGlwbGUgJiYgXy5pc0FycmF5KHZhbHVlKVxuICAgIHZhciBvcHRpb25zID0gZWwub3B0aW9uc1xuICAgIHZhciBpID0gb3B0aW9ucy5sZW5ndGhcbiAgICB2YXIgb3B0aW9uXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXVxuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gbXVsdGlcbiAgICAgICAgPyBpbmRleE9mKHZhbHVlLCBvcHRpb24udmFsdWUpID4gLTFcbiAgICAgICAgOiB2YWx1ZSA9PSBvcHRpb24udmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKHRoaXMub3B0aW9uV2F0Y2hlcikge1xuICAgICAgdGhpcy5vcHRpb25XYXRjaGVyLnRlYXJkb3duKClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIG9wdGlvbiBsaXN0IGZyb20gdGhlIHBhcmFtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKi9cblxuZnVuY3Rpb24gaW5pdE9wdGlvbnMgKGV4cHJlc3Npb24pIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKGV4cHJlc3Npb24pWzBdXG4gIGZ1bmN0aW9uIG9wdGlvblVwZGF0ZVdhdGNoZXIgKHZhbHVlKSB7XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJydcbiAgICAgIGJ1aWxkT3B0aW9ucyhzZWxmLmVsLCB2YWx1ZSlcbiAgICAgIGlmIChzZWxmLl93YXRjaGVyKSB7XG4gICAgICAgIHNlbGYudXBkYXRlKHNlbGYuX3dhdGNoZXIudmFsdWUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybignSW52YWxpZCBvcHRpb25zIHZhbHVlIGZvciB2LW1vZGVsOiAnICsgdmFsdWUpXG4gICAgfVxuICB9XG4gIHRoaXMub3B0aW9uV2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgIHRoaXMudm0sXG4gICAgZGVzY3JpcHRvci5leHByZXNzaW9uLFxuICAgIG9wdGlvblVwZGF0ZVdhdGNoZXIsXG4gICAge1xuICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgIGZpbHRlcnM6IF8ucmVzb2x2ZUZpbHRlcnModGhpcy52bSwgZGVzY3JpcHRvci5maWx0ZXJzKVxuICAgIH1cbiAgKVxuICAvLyB1cGRhdGUgd2l0aCBpbml0aWFsIHZhbHVlXG4gIG9wdGlvblVwZGF0ZVdhdGNoZXIodGhpcy5vcHRpb25XYXRjaGVyLnZhbHVlKVxufVxuXG4vKipcbiAqIEJ1aWxkIHVwIG9wdGlvbiBlbGVtZW50cy4gSUU5IGRvZXNuJ3QgY3JlYXRlIG9wdGlvbnNcbiAqIHdoZW4gc2V0dGluZyBpbm5lckhUTUwgb24gPHNlbGVjdD4gZWxlbWVudHMsIHNvIHdlIGhhdmVcbiAqIHRvIHVzZSBET00gQVBJIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBwYXJlbnQgLSBhIDxzZWxlY3Q+IG9yIGFuIDxvcHRncm91cD5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnNcbiAqL1xuXG5mdW5jdGlvbiBidWlsZE9wdGlvbnMgKHBhcmVudCwgb3B0aW9ucykge1xuICB2YXIgb3AsIGVsXG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBvcCA9IG9wdGlvbnNbaV1cbiAgICBpZiAoIW9wLm9wdGlvbnMpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJylcbiAgICAgIGlmICh0eXBlb2Ygb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsLnRleHQgPSBlbC52YWx1ZSA9IG9wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC50ZXh0ID0gb3AudGV4dFxuICAgICAgICBlbC52YWx1ZSA9IG9wLnZhbHVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKVxuICAgICAgZWwubGFiZWwgPSBvcC5sYWJlbFxuICAgICAgYnVpbGRPcHRpb25zKGVsLCBvcC5vcHRpb25zKVxuICAgIH1cbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB0aGUgaW5pdGlhbCB2YWx1ZSBmb3Igc2VsZWN0ZWQgb3B0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBjaGVja0luaXRpYWxWYWx1ZSAoKSB7XG4gIHZhciBpbml0VmFsdWVcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLmVsLm9wdGlvbnNcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChvcHRpb25zW2ldLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSkge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgKGluaXRWYWx1ZSB8fCAoaW5pdFZhbHVlID0gW10pKVxuICAgICAgICAgIC5wdXNoKG9wdGlvbnNbaV0udmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0VmFsdWUgPSBvcHRpb25zW2ldLnZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgaW5pdFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuX2luaXRWYWx1ZSA9IHRoaXMubnVtYmVyXG4gICAgICA/IF8udG9OdW1iZXIoaW5pdFZhbHVlKVxuICAgICAgOiBpbml0VmFsdWVcbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byBleHRyYWN0IGEgdmFsdWUgYXJyYXkgZm9yIHNlbGVjdFttdWx0aXBsZV1cbiAqXG4gKiBAcGFyYW0ge1NlbGVjdEVsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBnZXRNdWx0aVZhbHVlIChlbCkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlclxuICAgIC5jYWxsKGVsLm9wdGlvbnMsIGZpbHRlclNlbGVjdGVkKVxuICAgIC5tYXAoZ2V0T3B0aW9uVmFsdWUpXG59XG5cbmZ1bmN0aW9uIGZpbHRlclNlbGVjdGVkIChvcCkge1xuICByZXR1cm4gb3Auc2VsZWN0ZWRcbn1cblxuZnVuY3Rpb24gZ2V0T3B0aW9uVmFsdWUgKG9wKSB7XG4gIHJldHVybiBvcC52YWx1ZSB8fCBvcC50ZXh0XG59XG5cbi8qKlxuICogTmF0aXZlIEFycmF5LmluZGV4T2YgdXNlcyBzdHJpY3QgZXF1YWwsIGJ1dCBpbiB0aGlzXG4gKiBjYXNlIHdlIG5lZWQgdG8gbWF0Y2ggc3RyaW5nL251bWJlcnMgd2l0aCBzb2Z0IGVxdWFsLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5mdW5jdGlvbiBpbmRleE9mIChhcnIsIHZhbCkge1xuICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICB2YXIgaSA9IGFyci5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChhcnJbaV0gPT0gdmFsKSByZXR1cm4gaVxuICB9XG4gIHJldHVybiAtMVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGFjY2VwdFN0YXRlbWVudDogdHJ1ZSxcbiAgcHJpb3JpdHk6IDcwMCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZGVhbCB3aXRoIGlmcmFtZXNcbiAgICBpZiAoXG4gICAgICB0aGlzLmVsLnRhZ05hbWUgPT09ICdJRlJBTUUnICYmXG4gICAgICB0aGlzLmFyZyAhPT0gJ2xvYWQnXG4gICAgKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHRoaXMuaWZyYW1lQmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXy5vbihzZWxmLmVsLmNvbnRlbnRXaW5kb3csIHNlbGYuYXJnLCBzZWxmLmhhbmRsZXIpXG4gICAgICB9XG4gICAgICBfLm9uKHRoaXMuZWwsICdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdEaXJlY3RpdmUgXCJ2LW9uOicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgJyArXG4gICAgICAgICdleHBlY3RzIGEgZnVuY3Rpb24gdmFsdWUuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVzZXQoKVxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB0aGlzLmhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS50YXJnZXRWTSA9IHZtXG4gICAgICB2bS4kZXZlbnQgPSBlXG4gICAgICB2YXIgcmVzID0gaGFuZGxlcihlKVxuICAgICAgdm0uJGV2ZW50ID0gbnVsbFxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgICBpZiAodGhpcy5pZnJhbWVCaW5kKSB7XG4gICAgICB0aGlzLmlmcmFtZUJpbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9uKHRoaXMuZWwsIHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5pZnJhbWVCaW5kXG4gICAgICA/IHRoaXMuZWwuY29udGVudFdpbmRvd1xuICAgICAgOiB0aGlzLmVsXG4gICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgXy5vZmYoZWwsIHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzZXQoKVxuICAgIF8ub2ZmKHRoaXMuZWwsICdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIHZJZiA9IHJlcXVpcmUoJy4vaWYnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgLy8gc2FtZSBsb2dpYyByZXVzZSBmcm9tIHYtaWZcbiAgY29tcGlsZTogdklmLmNvbXBpbGUsXG4gIHRlYXJkb3duOiB2SWYudGVhcmRvd24sXG4gIGdldENvbnRhaW5lZENvbXBvbmVudHM6IHZJZi5nZXRDb250YWluZWRDb21wb25lbnRzLFxuICB1bmJpbmQ6IHZJZi51bmJpbmQsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1wYXJ0aWFsLXN0YXJ0JylcbiAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcGFydGlhbC1lbmQnKVxuICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gOCkge1xuICAgICAgZWwuaW5uZXJIVE1MID0gJydcbiAgICB9XG4gICAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScgfHwgZWwubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIF8ucmVwbGFjZShlbCwgdGhpcy5lbmQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKHRoaXMuZW5kKVxuICAgIH1cbiAgICBfLmJlZm9yZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgICBpZiAoIXRoaXMuX2lzRHluYW1pY0xpdGVyYWwpIHtcbiAgICAgIHRoaXMuaW5zZXJ0KHRoaXMuZXhwcmVzc2lvbilcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB0aGlzLnRlYXJkb3duKClcbiAgICB0aGlzLmluc2VydChpZClcbiAgfSxcblxuICBpbnNlcnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBwYXJ0aWFsID0gdGhpcy52bS4kb3B0aW9ucy5wYXJ0aWFsc1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KHBhcnRpYWwsICdwYXJ0aWFsJywgaWQpXG4gICAgaWYgKHBhcnRpYWwpIHtcbiAgICAgIHZhciBmaWx0ZXJzID0gdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5yZWFkXG4gICAgICBpZiAoZmlsdGVycykge1xuICAgICAgICBwYXJ0aWFsID0gXy5hcHBseUZpbHRlcnMocGFydGlhbCwgZmlsdGVycywgdGhpcy52bSlcbiAgICAgIH1cbiAgICAgIHRoaXMuY29tcGlsZSh0ZW1wbGF0ZVBhcnNlci5wYXJzZShwYXJ0aWFsLCB0cnVlKSlcbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcy5lbC5fX3Z1ZV9fXG4gICAgaWYgKCF2bSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi1yZWYgc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBhIGNvbXBvbmVudCByb290IGVsZW1lbnQuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIElmIHdlIGdldCBoZXJlLCBpdCBtZWFucyB0aGlzIGlzIGEgYHYtcmVmYCBvbiBhXG4gICAgLy8gY2hpbGQsIGJlY2F1c2UgcGFyZW50IHNjb3BlIGB2LXJlZmAgaXMgc3RyaXBwZWQgaW5cbiAgICAvLyBgdi1jb21wb25lbnRgIGFscmVhZHkuIFNvIHdlIGp1c3QgcmVjb3JkIG91ciBvd24gcmVmXG4gICAgLy8gaGVyZSAtIGl0IHdpbGwgb3ZlcndyaXRlIHBhcmVudCByZWYgaW4gYHYtY29tcG9uZW50YCxcbiAgICAvLyBpZiBhbnkuXG4gICAgdm0uX3JlZklEID0gdGhpcy5leHByZXNzaW9uXG4gIH1cbiAgXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBpc09iamVjdCA9IF8uaXNPYmplY3RcbnZhciBpc1BsYWluT2JqZWN0ID0gXy5pc1BsYWluT2JqZWN0XG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcbnZhciB0cmFuc2NsdWRlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvdHJhbnNjbHVkZScpXG52YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxudmFyIHVpZCA9IDBcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFNldHVwLlxuICAgKi9cblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdWlkIGFzIGEgY2FjaGUgaWRlbnRpZmllclxuICAgIHRoaXMuaWQgPSAnX192X3JlcGVhdF8nICsgKCsrdWlkKVxuICAgIC8vIHdlIG5lZWQgdG8gaW5zZXJ0IHRoZSBvYmpUb0FycmF5IGNvbnZlcnRlclxuICAgIC8vIGFzIHRoZSBmaXJzdCByZWFkIGZpbHRlciwgYmVjYXVzZSBpdCBoYXMgdG8gYmUgaW52b2tlZFxuICAgIC8vIGJlZm9yZSBhbnkgdXNlciBmaWx0ZXJzLiAoY2FuJ3QgZG8gaXQgaW4gYHVwZGF0ZWApXG4gICAgaWYgKCF0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZmlsdGVycyA9IHt9XG4gICAgfVxuICAgIC8vIGFkZCB0aGUgb2JqZWN0IC0+IGFycmF5IGNvbnZlcnQgZmlsdGVyXG4gICAgdmFyIG9iamVjdENvbnZlcnRlciA9IF8uYmluZChvYmpUb0FycmF5LCB0aGlzKVxuICAgIGlmICghdGhpcy5maWx0ZXJzLnJlYWQpIHtcbiAgICAgIHRoaXMuZmlsdGVycy5yZWFkID0gW29iamVjdENvbnZlcnRlcl1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJzLnJlYWQudW5zaGlmdChvYmplY3RDb252ZXJ0ZXIpXG4gICAgfVxuICAgIC8vIHNldHVwIHJlZiBub2RlXG4gICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXJlcGVhdCcpXG4gICAgXy5yZXBsYWNlKHRoaXMuZWwsIHRoaXMucmVmKVxuICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBibG9jayByZXBlYXRcbiAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5lbC50YWdOYW1lID09PSAnVEVNUExBVEUnXG4gICAgICA/IHRlbXBsYXRlUGFyc2VyLnBhcnNlKHRoaXMuZWwsIHRydWUpXG4gICAgICA6IHRoaXMuZWxcbiAgICAvLyBjaGVjayBvdGhlciBkaXJlY3RpdmVzIHRoYXQgbmVlZCB0byBiZSBoYW5kbGVkXG4gICAgLy8gYXQgdi1yZXBlYXQgbGV2ZWxcbiAgICB0aGlzLmNoZWNrSWYoKVxuICAgIHRoaXMuY2hlY2tSZWYoKVxuICAgIHRoaXMuY2hlY2tDb21wb25lbnQoKVxuICAgIC8vIGNoZWNrIGZvciB0cmFja2J5IHBhcmFtXG4gICAgdGhpcy5pZEtleSA9XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFjay1ieScpIHx8XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFja2J5JykgLy8gMC4xMS4wIGNvbXBhdFxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFdhcm4gYWdhaW5zdCB2LWlmIHVzYWdlLlxuICAgKi9cblxuICBjaGVja0lmOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF8uYXR0cih0aGlzLmVsLCAnaWYnKSAhPT0gbnVsbCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRG9uXFwndCB1c2Ugdi1pZiB3aXRoIHYtcmVwZWF0LiAnICtcbiAgICAgICAgJ1VzZSB2LXNob3cgb3IgdGhlIFwiZmlsdGVyQnlcIiBmaWx0ZXIgaW5zdGVhZC4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB2LXJlZi8gdi1lbCBpcyBhbHNvIHByZXNlbnQuXG4gICAqL1xuXG4gIGNoZWNrUmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgIHRoaXMucmVmSUQgPSByZWZJRFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShyZWZJRClcbiAgICAgIDogbnVsbFxuICAgIHZhciBlbElkID0gXy5hdHRyKHRoaXMuZWwsICdlbCcpXG4gICAgdGhpcy5lbElkID0gZWxJZFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShlbElkKVxuICAgICAgOiBudWxsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIGZvciByZXBlYXRlZFxuICAgKiBpbnN0YW5jZXMuIElmIHN0YXRpYyB3ZSByZXNvbHZlIGl0IG5vdywgb3RoZXJ3aXNlIGl0XG4gICAqIG5lZWRzIHRvIGJlIHJlc29sdmVkIGF0IGJ1aWxkIHRpbWUgd2l0aCBhY3R1YWwgZGF0YS5cbiAgICovXG5cbiAgY2hlY2tDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWQgPSBfLmF0dHIodGhpcy5lbCwgJ2NvbXBvbmVudCcpXG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnZtLiRvcHRpb25zXG4gICAgaWYgKCFpZCkge1xuICAgICAgLy8gZGVmYXVsdCBjb25zdHJ1Y3RvclxuICAgICAgdGhpcy5DdG9yID0gXy5WdWVcbiAgICAgIC8vIGlubGluZSByZXBlYXRzIHNob3VsZCBpbmhlcml0XG4gICAgICB0aGlzLmluaGVyaXQgPSB0cnVlXG4gICAgICAvLyBpbXBvcnRhbnQ6IHRyYW5zY2x1ZGUgd2l0aCBubyBvcHRpb25zLCBqdXN0XG4gICAgICAvLyB0byBlbnN1cmUgYmxvY2sgc3RhcnQgYW5kIGJsb2NrIGVuZFxuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRyYW5zY2x1ZGUodGhpcy50ZW1wbGF0ZSlcbiAgICAgIHRoaXMuX2xpbmtGbiA9IGNvbXBpbGUodGhpcy50ZW1wbGF0ZSwgb3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hc0NvbXBvbmVudCA9IHRydWVcbiAgICAgIC8vIGNoZWNrIGlubGluZS10ZW1wbGF0ZVxuICAgICAgaWYgKHRoaXMuX2NoZWNrUGFyYW0oJ2lubGluZS10ZW1wbGF0ZScpICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGV4dHJhY3QgaW5saW5lIHRlbXBsYXRlIGFzIGEgRG9jdW1lbnRGcmFnbWVudFxuICAgICAgICB0aGlzLmlubGluZVRlbXBhbHRlID0gXy5leHRyYWN0Q29udGVudCh0aGlzLmVsLCB0cnVlKVxuICAgICAgfVxuICAgICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UoaWQpXG4gICAgICBpZiAoIXRva2VucykgeyAvLyBzdGF0aWMgY29tcG9uZW50XG4gICAgICAgIHZhciBDdG9yID0gdGhpcy5DdG9yID0gb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgICAgICBfLmFzc2VydEFzc2V0KEN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgICAgICAgdmFyIG1lcmdlZCA9IG1lcmdlT3B0aW9ucyhDdG9yLm9wdGlvbnMsIHt9LCB7XG4gICAgICAgICAgJHBhcmVudDogdGhpcy52bVxuICAgICAgICB9KVxuICAgICAgICBtZXJnZWQudGVtcGxhdGUgPSB0aGlzLmlubGluZVRlbXBhbHRlIHx8IG1lcmdlZC50ZW1wbGF0ZVxuICAgICAgICBtZXJnZWQuX2FzQ29tcG9uZW50ID0gdHJ1ZVxuICAgICAgICBtZXJnZWQuX3BhcmVudCA9IHRoaXMudm1cbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRyYW5zY2x1ZGUodGhpcy50ZW1wbGF0ZSwgbWVyZ2VkKVxuICAgICAgICAvLyBJbXBvcnRhbnQ6IG1hcmsgdGhlIHRlbXBsYXRlIGFzIGEgcm9vdCBub2RlIHNvIHRoYXRcbiAgICAgICAgLy8gY3VzdG9tIGVsZW1lbnQgY29tcG9uZW50cyBkb24ndCBnZXQgY29tcGlsZWQgdHdpY2UuXG4gICAgICAgIC8vIGZpeGVzICM4MjJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5fX3Z1ZV9fID0gdHJ1ZVxuICAgICAgICB0aGlzLl9saW5rRm4gPSBjb21waWxlKHRoaXMudGVtcGxhdGUsIG1lcmdlZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvIGJlIHJlc29sdmVkIGxhdGVyXG4gICAgICAgIHZhciBjdG9yRXhwID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICAgIHRoaXMuY3RvckdldHRlciA9IGV4cFBhcnNlci5wYXJzZShjdG9yRXhwKS5nZXRcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZS5cbiAgICogVGhpcyBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIEFycmF5IG11dGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8TnVtYmVyfFN0cmluZ30gZGF0YVxuICAgKi9cblxuICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgW11cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBkYXRhXG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBkYXRhID0gcmFuZ2UoZGF0YSlcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkYXRhID0gXy50b0FycmF5KGRhdGEpXG4gICAgfVxuICAgIHRoaXMudm1zID0gdGhpcy5kaWZmKGRhdGEsIHRoaXMudm1zKVxuICAgIC8vIHVwZGF0ZSB2LXJlZlxuICAgIGlmICh0aGlzLnJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbdGhpcy5yZWZJRF0gPSB0aGlzLnZtc1xuICAgIH1cbiAgICBpZiAodGhpcy5lbElkKSB7XG4gICAgICB0aGlzLnZtLiQkW3RoaXMuZWxJZF0gPSB0aGlzLnZtcy5tYXAoZnVuY3Rpb24gKHZtKSB7XG4gICAgICAgIHJldHVybiB2bS4kZWxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaWZmLCBiYXNlZCBvbiBuZXcgZGF0YSBhbmQgb2xkIGRhdGEsIGRldGVybWluZSB0aGVcbiAgICogbWluaW11bSBhbW91bnQgb2YgRE9NIG1hbmlwdWxhdGlvbnMgbmVlZGVkIHRvIG1ha2UgdGhlXG4gICAqIERPTSByZWZsZWN0IHRoZSBuZXcgZGF0YSBBcnJheS5cbiAgICpcbiAgICogVGhlIGFsZ29yaXRobSBkaWZmcyB0aGUgbmV3IGRhdGEgQXJyYXkgYnkgc3RvcmluZyBhXG4gICAqIGhpZGRlbiByZWZlcmVuY2UgdG8gYW4gb3duZXIgdm0gaW5zdGFuY2Ugb24gcHJldmlvdXNseVxuICAgKiBzZWVuIGRhdGEuIFRoaXMgYWxsb3dzIHVzIHRvIGFjaGlldmUgTyhuKSB3aGljaCBpc1xuICAgKiBiZXR0ZXIgdGhhbiBhIGxldmVuc2h0ZWluIGRpc3RhbmNlIGJhc2VkIGFsZ29yaXRobSxcbiAgICogd2hpY2ggaXMgTyhtICogbikuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFcbiAgICogQHBhcmFtIHtBcnJheX0gb2xkVm1zXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBkaWZmOiBmdW5jdGlvbiAoZGF0YSwgb2xkVm1zKSB7XG4gICAgdmFyIGlkS2V5ID0gdGhpcy5pZEtleVxuICAgIHZhciBjb252ZXJ0ZWQgPSB0aGlzLmNvbnZlcnRlZFxuICAgIHZhciByZWYgPSB0aGlzLnJlZlxuICAgIHZhciBhbGlhcyA9IHRoaXMuYXJnXG4gICAgdmFyIGluaXQgPSAhb2xkVm1zXG4gICAgdmFyIHZtcyA9IG5ldyBBcnJheShkYXRhLmxlbmd0aClcbiAgICB2YXIgb2JqLCByYXcsIHZtLCBpLCBsXG4gICAgLy8gRmlyc3QgcGFzcywgZ28gdGhyb3VnaCB0aGUgbmV3IEFycmF5IGFuZCBmaWxsIHVwXG4gICAgLy8gdGhlIG5ldyB2bXMgYXJyYXkuIElmIGEgcGllY2Ugb2YgZGF0YSBoYXMgYSBjYWNoZWRcbiAgICAvLyBpbnN0YW5jZSBmb3IgaXQsIHdlIHJldXNlIGl0LiBPdGhlcndpc2UgYnVpbGQgYSBuZXdcbiAgICAvLyBpbnN0YW5jZS5cbiAgICBmb3IgKGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG9iaiA9IGRhdGFbaV1cbiAgICAgIHJhdyA9IGNvbnZlcnRlZCA/IG9iai4kdmFsdWUgOiBvYmpcbiAgICAgIHZtID0gIWluaXQgJiYgdGhpcy5nZXRWbShyYXcpXG4gICAgICBpZiAodm0pIHsgLy8gcmV1c2FibGUgaW5zdGFuY2VcbiAgICAgICAgdm0uX3JldXNlZCA9IHRydWVcbiAgICAgICAgdm0uJGluZGV4ID0gaSAvLyB1cGRhdGUgJGluZGV4XG4gICAgICAgIGlmIChjb252ZXJ0ZWQpIHtcbiAgICAgICAgICB2bS4ka2V5ID0gb2JqLiRrZXkgLy8gdXBkYXRlICRrZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWRLZXkpIHsgLy8gc3dhcCB0cmFjayBieSBpZCBkYXRhXG4gICAgICAgICAgaWYgKGFsaWFzKSB7XG4gICAgICAgICAgICB2bVthbGlhc10gPSByYXdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uX3NldERhdGEocmF3KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gbmV3IGluc3RhbmNlXG4gICAgICAgIHZtID0gdGhpcy5idWlsZChvYmosIGksIHRydWUpXG4gICAgICAgIHZtLl9uZXcgPSB0cnVlXG4gICAgICAgIHZtLl9yZXVzZWQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdm1zW2ldID0gdm1cbiAgICAgIC8vIGluc2VydCBpZiB0aGlzIGlzIGZpcnN0IHJ1blxuICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgdm0uJGJlZm9yZShyZWYpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIGZpcnN0IHJ1biwgd2UncmUgZG9uZS5cbiAgICBpZiAoaW5pdCkge1xuICAgICAgcmV0dXJuIHZtc1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzcywgZ28gdGhyb3VnaCB0aGUgb2xkIHZtIGluc3RhbmNlcyBhbmRcbiAgICAvLyBkZXN0cm95IHRob3NlIHdobyBhcmUgbm90IHJldXNlZCAoYW5kIHJlbW92ZSB0aGVtXG4gICAgLy8gZnJvbSBjYWNoZSlcbiAgICBmb3IgKGkgPSAwLCBsID0gb2xkVm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdm0gPSBvbGRWbXNbaV1cbiAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3kodHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZmluYWwgcGFzcywgbW92ZS9pbnNlcnQgbmV3IGluc3RhbmNlcyBpbnRvIHRoZVxuICAgIC8vIHJpZ2h0IHBsYWNlLiBXZSdyZSBnb2luZyBpbiByZXZlcnNlIGhlcmUgYmVjYXVzZVxuICAgIC8vIGluc2VydEJlZm9yZSByZWxpZXMgb24gdGhlIG5leHQgc2libGluZyB0byBiZVxuICAgIC8vIHJlc29sdmVkLlxuICAgIHZhciB0YXJnZXROZXh0LCBjdXJyZW50TmV4dFxuICAgIGkgPSB2bXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdm0gPSB2bXNbaV1cbiAgICAgIC8vIHRoaXMgaXMgdGhlIHZtIHRoYXQgd2Ugc2hvdWxkIGJlIGluIGZyb250IG9mXG4gICAgICB0YXJnZXROZXh0ID0gdm1zW2kgKyAxXVxuICAgICAgaWYgKCF0YXJnZXROZXh0KSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgaXRlbS4gSWYgaXQncyByZXVzZWQgdGhlblxuICAgICAgICAvLyBldmVyeXRoaW5nIGVsc2Ugd2lsbCBldmVudHVhbGx5IGJlIGluIHRoZSByaWdodFxuICAgICAgICAvLyBwbGFjZSwgc28gbm8gbmVlZCB0byB0b3VjaCBpdC4gT3RoZXJ3aXNlLCBpbnNlcnRcbiAgICAgICAgLy8gaXQuXG4gICAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICAgIHZtLiRiZWZvcmUocmVmKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV4dEVsID0gdGFyZ2V0TmV4dC4kZWxcbiAgICAgICAgaWYgKHZtLl9yZXVzZWQpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSB2bSB3ZSBhcmUgYWN0dWFsbHkgaW4gZnJvbnQgb2ZcbiAgICAgICAgICBjdXJyZW50TmV4dCA9IGZpbmROZXh0Vm0odm0sIHJlZilcbiAgICAgICAgICAvLyB3ZSBvbmx5IG5lZWQgdG8gbW92ZSBpZiB3ZSBhcmUgbm90IGluIHRoZSByaWdodFxuICAgICAgICAgIC8vIHBsYWNlIGFscmVhZHkuXG4gICAgICAgICAgaWYgKGN1cnJlbnROZXh0ICE9PSB0YXJnZXROZXh0KSB7XG4gICAgICAgICAgICB2bS4kYmVmb3JlKG5leHRFbCwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG5ldyBpbnN0YW5jZSwgaW5zZXJ0IHRvIGV4aXN0aW5nIG5leHRcbiAgICAgICAgICB2bS4kYmVmb3JlKG5leHRFbClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdm0uX25ldyA9IGZhbHNlXG4gICAgICB2bS5fcmV1c2VkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHZtc1xuICB9LFxuXG4gIC8qKlxuICAgKiBCdWlsZCBhIG5ldyBpbnN0YW5jZSBhbmQgY2FjaGUgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRDYWNoZVxuICAgKi9cblxuICBidWlsZDogZnVuY3Rpb24gKGRhdGEsIGluZGV4LCBuZWVkQ2FjaGUpIHtcbiAgICB2YXIgbWV0YSA9IHsgJGluZGV4OiBpbmRleCB9XG4gICAgaWYgKHRoaXMuY29udmVydGVkKSB7XG4gICAgICBtZXRhLiRrZXkgPSBkYXRhLiRrZXlcbiAgICB9XG4gICAgdmFyIHJhdyA9IHRoaXMuY29udmVydGVkID8gZGF0YS4kdmFsdWUgOiBkYXRhXG4gICAgdmFyIGFsaWFzID0gdGhpcy5hcmdcbiAgICBpZiAoYWxpYXMpIHtcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZGF0YVthbGlhc10gPSByYXdcbiAgICB9IGVsc2UgaWYgKCFpc1BsYWluT2JqZWN0KHJhdykpIHtcbiAgICAgIC8vIG5vbi1vYmplY3QgdmFsdWVzXG4gICAgICBkYXRhID0ge31cbiAgICAgIG1ldGEuJHZhbHVlID0gcmF3XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHRcbiAgICAgIGRhdGEgPSByYXdcbiAgICB9XG4gICAgLy8gcmVzb2x2ZSBjb25zdHJ1Y3RvclxuICAgIHZhciBDdG9yID0gdGhpcy5DdG9yIHx8IHRoaXMucmVzb2x2ZUN0b3IoZGF0YSwgbWV0YSlcbiAgICB2YXIgdm0gPSB0aGlzLnZtLiRhZGRDaGlsZCh7XG4gICAgICBlbDogdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy50ZW1wbGF0ZSksXG4gICAgICBfYXNDb21wb25lbnQ6IHRoaXMuYXNDb21wb25lbnQsXG4gICAgICBfaG9zdDogdGhpcy5faG9zdCxcbiAgICAgIF9saW5rRm46IHRoaXMuX2xpbmtGbixcbiAgICAgIF9tZXRhOiBtZXRhLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGluaGVyaXQ6IHRoaXMuaW5oZXJpdCxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmlubGluZVRlbXBhbHRlXG4gICAgfSwgQ3RvcilcbiAgICAvLyBmbGFnIHRoaXMgaW5zdGFuY2UgYXMgYSByZXBlYXQgaW5zdGFuY2VcbiAgICAvLyBzbyB0aGF0IHdlIGNhbiBza2lwIGl0IGluIHZtLl9kaWdlc3RcbiAgICB2bS5fcmVwZWF0ID0gdHJ1ZVxuICAgIC8vIGNhY2hlIGluc3RhbmNlXG4gICAgaWYgKG5lZWRDYWNoZSkge1xuICAgICAgdGhpcy5jYWNoZVZtKHJhdywgdm0pXG4gICAgfVxuICAgIC8vIHN5bmMgYmFjayBjaGFuZ2VzIGZvciAkdmFsdWUsIHBhcnRpY3VsYXJseSBmb3JcbiAgICAvLyB0d28td2F5IGJpbmRpbmdzIG9mIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2bS4kd2F0Y2goJyR2YWx1ZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIGlmIChzZWxmLmNvbnZlcnRlZCkge1xuICAgICAgICBzZWxmLnJhd1ZhbHVlW3ZtLiRrZXldID0gdmFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnJhd1ZhbHVlLiRzZXQodm0uJGluZGV4LCB2YWwpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdm1cbiAgfSxcblxuICAvKipcbiAgICogUmVzb2x2ZSBhIGNvbnRydWN0b3IgdG8gdXNlIGZvciBhbiBpbnN0YW5jZS5cbiAgICogVGhlIHRyaWNreSBwYXJ0IGhlcmUgaXMgdGhhdCB0aGVyZSBjb3VsZCBiZSBkeW5hbWljXG4gICAqIGNvbXBvbmVudHMgZGVwZW5kaW5nIG9uIGluc3RhbmNlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cblxuICByZXNvbHZlQ3RvcjogZnVuY3Rpb24gKGRhdGEsIG1ldGEpIHtcbiAgICAvLyBjcmVhdGUgYSB0ZW1wb3JhcnkgY29udGV4dCBvYmplY3QgYW5kIGNvcHkgZGF0YVxuICAgIC8vIGFuZCBtZXRhIHByb3BlcnRpZXMgb250byBpdC5cbiAgICAvLyB1c2UgXy5kZWZpbmUgdG8gYXZvaWQgYWNjaWRlbnRhbGx5IG92ZXJ3cml0aW5nIHNjb3BlXG4gICAgLy8gcHJvcGVydGllcy5cbiAgICB2YXIgY29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcy52bSlcbiAgICB2YXIga2V5XG4gICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgXy5kZWZpbmUoY29udGV4dCwga2V5LCBkYXRhW2tleV0pXG4gICAgfVxuICAgIGZvciAoa2V5IGluIG1ldGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgbWV0YVtrZXldKVxuICAgIH1cbiAgICB2YXIgaWQgPSB0aGlzLmN0b3JHZXR0ZXIuY2FsbChjb250ZXh0LCBjb250ZXh0KVxuICAgIHZhciBDdG9yID0gdGhpcy52bS4kb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIF8uYXNzZXJ0QXNzZXQoQ3RvciwgJ2NvbXBvbmVudCcsIGlkKVxuICAgIHJldHVybiBDdG9yXG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuYmluZCwgdGVhcmRvd24gZXZlcnl0aGluZ1xuICAgKi9cblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5yZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3RoaXMucmVmSURdID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy52bXMpIHtcbiAgICAgIHZhciBpID0gdGhpcy52bXMubGVuZ3RoXG4gICAgICB2YXIgdm1cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdm0gPSB0aGlzLnZtc1tpXVxuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2FjaGUgYSB2bSBpbnN0YW5jZSBiYXNlZCBvbiBpdHMgZGF0YS5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgYW4gb2JqZWN0LCB3ZSBzYXZlIHRoZSB2bSdzIHJlZmVyZW5jZSBvblxuICAgKiB0aGUgZGF0YSBvYmplY3QgYXMgYSBoaWRkZW4gcHJvcGVydHkuIE90aGVyd2lzZSB3ZVxuICAgKiBjYWNoZSB0aGVtIGluIGFuIG9iamVjdCBhbmQgZm9yIGVhY2ggcHJpbWl0aXZlIHZhbHVlXG4gICAqIHRoZXJlIGlzIGFuIGFycmF5IGluIGNhc2UgdGhlcmUgYXJlIGR1cGxpY2F0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKi9cblxuICBjYWNoZVZtOiBmdW5jdGlvbiAoZGF0YSwgdm0pIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZVxuICAgIHZhciBpZFxuICAgIGlmIChpZEtleSkge1xuICAgICAgaWQgPSBkYXRhW2lkS2V5XVxuICAgICAgaWYgKCFjYWNoZVtpZF0pIHtcbiAgICAgICAgY2FjaGVbaWRdID0gdm1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8ud2FybignRHVwbGljYXRlIHRyYWNrLWJ5IGtleSBpbiB2LXJlcGVhdDogJyArIGlkKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIGlkID0gdGhpcy5pZFxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgIGlmIChkYXRhW2lkXSA9PT0gbnVsbCkge1xuICAgICAgICAgIGRhdGFbaWRdID0gdm1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLndhcm4oXG4gICAgICAgICAgICAnRHVwbGljYXRlIG9iamVjdHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdi1yZXBlYXQgJyArXG4gICAgICAgICAgICAnd2hlbiB1c2luZyBjb21wb25lbnRzIG9yIHRyYW5zaXRpb25zLidcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZGVmaW5lKGRhdGEsIHRoaXMuaWQsIHZtKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhY2hlW2RhdGFdKSB7XG4gICAgICAgIGNhY2hlW2RhdGFdID0gW3ZtXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FjaGVbZGF0YV0ucHVzaCh2bSlcbiAgICAgIH1cbiAgICB9XG4gICAgdm0uX3JhdyA9IGRhdGFcbiAgfSxcblxuICAvKipcbiAgICogVHJ5IHRvIGdldCBhIGNhY2hlZCBpbnN0YW5jZSBmcm9tIGEgcGllY2Ugb2YgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7VnVlfHVuZGVmaW5lZH1cbiAgICovXG5cbiAgZ2V0Vm06IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKHRoaXMuaWRLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW2RhdGFbdGhpcy5pZEtleV1dXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGFbdGhpcy5pZF1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuY2FjaGVbZGF0YV1cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgIHZhciB2bSA9IGNhY2hlZFtpXVxuICAgICAgICAvLyBzaW5jZSBkdXBsaWNhdGVkIHZtIGluc3RhbmNlcyBtaWdodCBiZSBhIHJldXNlZFxuICAgICAgICAvLyBvbmUgT1IgYSBuZXdseSBjcmVhdGVkIG9uZSwgd2UgbmVlZCB0byByZXR1cm4gdGhlXG4gICAgICAgIC8vIGZpcnN0IGluc3RhbmNlIHRoYXQgaXMgbmVpdGhlciBvZiB0aGVzZS5cbiAgICAgICAgd2hpbGUgKHZtICYmICh2bS5fcmV1c2VkIHx8IHZtLl9uZXcpKSB7XG4gICAgICAgICAgdm0gPSBjYWNoZWRbKytpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIGEgY2FjaGVkIHZtIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICovXG5cbiAgdW5jYWNoZVZtOiBmdW5jdGlvbiAodm0pIHtcbiAgICB2YXIgZGF0YSA9IHZtLl9yYXdcbiAgICBpZiAodGhpcy5pZEtleSkge1xuICAgICAgdGhpcy5jYWNoZVtkYXRhW3RoaXMuaWRLZXldXSA9IG51bGxcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBkYXRhW3RoaXMuaWRdID0gbnVsbFxuICAgICAgdm0uX3JhdyA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYWNoZVtkYXRhXS5wb3AoKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogSGVscGVyIHRvIGZpbmQgdGhlIG5leHQgZWxlbWVudCB0aGF0IGlzIGFuIGluc3RhbmNlXG4gKiByb290IG5vZGUuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYSBkZXN0cm95ZWQgdm0nc1xuICogZWxlbWVudCBjb3VsZCBzdGlsbCBiZSBsaW5nZXJpbmcgaW4gdGhlIERPTSBiZWZvcmUgaXRzXG4gKiBsZWF2aW5nIHRyYW5zaXRpb24gZmluaXNoZXMsIGJ1dCBpdHMgX192dWVfXyByZWZlcmVuY2VcbiAqIHNob3VsZCBoYXZlIGJlZW4gcmVtb3ZlZCBzbyB3ZSBjYW4gc2tpcCB0aGVtLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtDb21tZW50Tm9kZX0gcmVmXG4gKiBAcmV0dXJuIHtWdWV9XG4gKi9cblxuZnVuY3Rpb24gZmluZE5leHRWbSAodm0sIHJlZikge1xuICB2YXIgZWwgPSAodm0uX2Jsb2NrRW5kIHx8IHZtLiRlbCkubmV4dFNpYmxpbmdcbiAgd2hpbGUgKCFlbC5fX3Z1ZV9fICYmIGVsICE9PSByZWYpIHtcbiAgICBlbCA9IGVsLm5leHRTaWJsaW5nXG4gIH1cbiAgcmV0dXJuIGVsLl9fdnVlX19cbn1cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgbm9uLUFycmF5IG9iamVjdHMgdG8gYXJyYXkuXG4gKiBUaGlzIGlzIHRoZSBkZWZhdWx0IGZpbHRlciBpbnN0YWxsZWQgdG8gZXZlcnkgdi1yZXBlYXRcbiAqIGRpcmVjdGl2ZS5cbiAqXG4gKiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoICoqdGhlIGRpcmVjdGl2ZSoqIGFzIGB0aGlzYFxuICogY29udGV4dCBzbyB0aGF0IHdlIGNhbiBtYXJrIHRoZSByZXBlYXQgYXJyYXkgYXMgY29udmVydGVkXG4gKiBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG9ialRvQXJyYXkgKG9iaikge1xuICAvLyByZWdhcmRsZXNzIG9mIHR5cGUsIHN0b3JlIHRoZSB1bi1maWx0ZXJlZCByYXcgdmFsdWUuXG4gIHRoaXMucmF3VmFsdWUgPSBvYmpcbiAgaWYgKCFpc1BsYWluT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gb2JqXG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIHJlcyA9IG5ldyBBcnJheShpKVxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgcmVzW2ldID0ge1xuICAgICAgJGtleToga2V5LFxuICAgICAgJHZhbHVlOiBvYmpba2V5XVxuICAgIH1cbiAgfVxuICAvLyBgdGhpc2AgcG9pbnRzIHRvIHRoZSByZXBlYXQgZGlyZWN0aXZlIGluc3RhbmNlXG4gIHRoaXMuY29udmVydGVkID0gdHJ1ZVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcmFuZ2UgYXJyYXkgZnJvbSBnaXZlbiBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHJhbmdlIChuKSB7XG4gIHZhciBpID0gLTFcbiAgdmFyIHJldCA9IG5ldyBBcnJheShuKVxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJldFtpXSA9IGlcbiAgfVxuICByZXR1cm4gcmV0XG59IiwidmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIGVsID0gdGhpcy5lbFxuICB0cmFuc2l0aW9uLmFwcGx5KGVsLCB2YWx1ZSA/IDEgOiAtMSwgZnVuY3Rpb24gKCkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG4gIH0sIHRoaXMudm0pXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnLW1zLSddXG52YXIgY2FtZWxQcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddXG52YXIgaW1wb3J0YW50UkUgPSAvIWltcG9ydGFudDs/JC9cbnZhciBjYW1lbFJFID0gLyhbYS16XSkoW0EtWl0pL2dcbnZhciB0ZXN0RWwgPSBudWxsXG52YXIgcHJvcENhY2hlID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgZGVlcDogdHJ1ZSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgdGhpcy5zZXRQcm9wKHRoaXMuYXJnLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gY2FjaGUgb2JqZWN0IHN0eWxlcyBzbyB0aGF0IG9ubHkgY2hhbmdlZCBwcm9wc1xuICAgICAgICAvLyBhcmUgYWN0dWFsbHkgdXBkYXRlZC5cbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlKSB0aGlzLmNhY2hlID0ge31cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICAgIGlmICh2YWx1ZVtwcm9wXSAhPSB0aGlzLmNhY2hlW3Byb3BdKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlW3Byb3BdID0gdmFsdWVbcHJvcF1cbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUuY3NzVGV4dCA9IHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNldFByb3A6IGZ1bmN0aW9uIChwcm9wLCB2YWx1ZSkge1xuICAgIHByb3AgPSBub3JtYWxpemUocHJvcClcbiAgICBpZiAoIXByb3ApIHJldHVybiAvLyB1bnN1cHBvcnRlZCBwcm9wXG4gICAgLy8gY2FzdCBwb3NzaWJsZSBudW1iZXJzL2Jvb2xlYW5zIGludG8gc3RyaW5nc1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB2YWx1ZSArPSAnJ1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdmFyIGlzSW1wb3J0YW50ID0gaW1wb3J0YW50UkUudGVzdCh2YWx1ZSlcbiAgICAgICAgPyAnaW1wb3J0YW50J1xuICAgICAgICA6ICcnXG4gICAgICBpZiAoaXNJbXBvcnRhbnQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGltcG9ydGFudFJFLCAnJykudHJpbSgpXG4gICAgICB9XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiAtIGNhY2hlIHJlc3VsdFxuICogLSBhdXRvIHByZWZpeFxuICogLSBjYW1lbENhc2UgLT4gZGFzaC1jYXNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUgKHByb3ApIHtcbiAgaWYgKHByb3BDYWNoZVtwcm9wXSkge1xuICAgIHJldHVybiBwcm9wQ2FjaGVbcHJvcF1cbiAgfVxuICB2YXIgcmVzID0gcHJlZml4KHByb3ApXG4gIHByb3BDYWNoZVtwcm9wXSA9IHByb3BDYWNoZVtyZXNdID0gcmVzXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBdXRvIGRldGVjdCB0aGUgYXBwcm9wcmlhdGUgcHJlZml4IGZvciBhIENTUyBwcm9wZXJ0eS5cbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81MjM2OTJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHByZWZpeCAocHJvcCkge1xuICBwcm9wID0gcHJvcC5yZXBsYWNlKGNhbWVsUkUsICckMS0kMicpLnRvTG93ZXJDYXNlKClcbiAgdmFyIGNhbWVsID0gXy5jYW1lbGl6ZShwcm9wKVxuICB2YXIgdXBwZXIgPSBjYW1lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhbWVsLnNsaWNlKDEpXG4gIGlmICghdGVzdEVsKSB7XG4gICAgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgfVxuICBpZiAoY2FtZWwgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgcmV0dXJuIHByb3BcbiAgfVxuICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aFxuICB2YXIgcHJlZml4ZWRcbiAgd2hpbGUgKGktLSkge1xuICAgIHByZWZpeGVkID0gY2FtZWxQcmVmaXhlc1tpXSArIHVwcGVyXG4gICAgaWYgKHByZWZpeGVkIGluIHRlc3RFbC5zdHlsZSkge1xuICAgICAgcmV0dXJuIHByZWZpeGVzW2ldICsgcHJvcFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF0dHIgPSB0aGlzLmVsLm5vZGVUeXBlID09PSAzXG4gICAgICA/ICdub2RlVmFsdWUnXG4gICAgICA6ICd0ZXh0Q29udGVudCdcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZWxbdGhpcy5hdHRyXSA9IF8udG9TdHJpbmcodmFsdWUpXG4gIH1cbiAgXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDEwMDAsXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLmV4cHJlc3Npb24pXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHZtID0gdGhpcy5lbC5fX3Z1ZV9fIHx8IHRoaXMudm1cbiAgICB0aGlzLmVsLl9fdl90cmFucyA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIC8vIHJlc29sdmUgdGhlIGN1c3RvbSB0cmFuc2l0aW9uIGZ1bmN0aW9ucyBub3dcbiAgICAgIC8vIHNvIHRoZSB0cmFuc2l0aW9uIG1vZHVsZSBrbm93cyB0aGlzIGlzIGFcbiAgICAgIC8vIGphdmFzY3JpcHQgdHJhbnNpdGlvbiB3aXRob3V0IGhhdmluZyB0byBjaGVja1xuICAgICAgLy8gY29tcHV0ZWQgQ1NTLlxuICAgICAgZm5zOiB2bS4kb3B0aW9ucy50cmFuc2l0aW9uc1tpZF1cbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgbGl0ZXJhbFJFID0gL14odHJ1ZXxmYWxzZXxcXHM/KCdbXiddKid8XCJbXlwiXVwiKVxccz8pJC9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDkwMCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY2hpbGQgPSB0aGlzLnZtXG4gICAgdmFyIHBhcmVudCA9IGNoaWxkLiRwYXJlbnRcbiAgICB2YXIgY2hpbGRLZXkgPSB0aGlzLmFyZyB8fCAnJGRhdGEnXG4gICAgdmFyIHBhcmVudEtleSA9IHRoaXMuZXhwcmVzc2lvblxuXG4gICAgaWYgKHRoaXMuZWwgJiYgdGhpcy5lbCAhPT0gY2hpbGQuJGVsKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LXdpdGggY2FuIG9ubHkgYmUgdXNlZCBvbiBpbnN0YW5jZSByb290IGVsZW1lbnRzLidcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKCFwYXJlbnQpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3Ytd2l0aCBtdXN0IGJlIHVzZWQgb24gYW4gaW5zdGFuY2Ugd2l0aCBhIHBhcmVudC4nXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChsaXRlcmFsUkUudGVzdChwYXJlbnRLZXkpKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIHNldHVwIHdhdGNoZXJzIGZvciBsaXRlcmFsIGJpbmRpbmdzXG4gICAgICBpZiAoIXRoaXMuYXJnKSB7XG4gICAgICAgIF8ud2FybihcbiAgICAgICAgICAndi13aXRoIGNhbm5vdCBiaW5kIGxpdGVyYWwgdmFsdWUgYXMgJGRhdGE6ICcgK1xuICAgICAgICAgIHBhcmVudEtleVxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdmFsdWUgPSBleHBQYXJzZXIucGFyc2UocGFyZW50S2V5KS5nZXQoKVxuICAgICAgICBjaGlsZC4kc2V0KGNoaWxkS2V5LCB2YWx1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuXG4gICAgICAvLyBzaW1wbGUgbG9jayB0byBhdm9pZCBjaXJjdWxhciB1cGRhdGVzLlxuICAgICAgLy8gd2l0aG91dCB0aGlzIGl0IHdvdWxkIHN0YWJpbGl6ZSB0b28sIGJ1dCB0aGlzIG1ha2VzXG4gICAgICAvLyBzdXJlIGl0IGRvZXNuJ3QgY2F1c2Ugb3RoZXIgd2F0Y2hlcnMgdG8gcmUtZXZhbHVhdGUuXG4gICAgICB2YXIgbG9ja2VkID0gZmFsc2VcbiAgICAgIHZhciBsb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2NrZWQgPSB0cnVlXG4gICAgICAgIF8ubmV4dFRpY2sodW5sb2NrKVxuICAgICAgfVxuICAgICAgdmFyIHVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9ja2VkID0gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5wYXJlbnRXYXRjaGVyID0gbmV3IFdhdGNoZXIoXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgcGFyZW50S2V5LFxuICAgICAgICBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgaWYgKCFsb2NrZWQpIHtcbiAgICAgICAgICAgIGxvY2soKVxuICAgICAgICAgICAgY2hpbGQuJHNldChjaGlsZEtleSwgdmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgICAgXG4gICAgICAvLyBzZXQgdGhlIGNoaWxkIGluaXRpYWwgdmFsdWUgZmlyc3QsIGJlZm9yZSBzZXR0aW5nXG4gICAgICAvLyB1cCB0aGUgY2hpbGQgd2F0Y2hlciB0byBhdm9pZCB0cmlnZ2VyaW5nIGl0XG4gICAgICAvLyBpbW1lZGlhdGVseS5cbiAgICAgIGNoaWxkLiRzZXQoY2hpbGRLZXksIHRoaXMucGFyZW50V2F0Y2hlci52YWx1ZSlcblxuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgY2hpbGQsXG4gICAgICAgIGNoaWxkS2V5LFxuICAgICAgICBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgaWYgKCFsb2NrZWQpIHtcbiAgICAgICAgICAgIGxvY2soKVxuICAgICAgICAgICAgcGFyZW50LiRzZXQocGFyZW50S2V5LCB2YWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBhcmVudFdhdGNoZXIpIHtcbiAgICAgIHRoaXMucGFyZW50V2F0Y2hlci50ZWFyZG93bigpXG4gICAgICB0aGlzLmNoaWxkV2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFBhdGggPSByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKVxuXG4vKipcbiAqIEZpbHRlciBmaWx0ZXIgZm9yIHYtcmVwZWF0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaEtleVxuICogQHBhcmFtIHtTdHJpbmd9IFtkZWxpbWl0ZXJdXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YUtleVxuICovXG5cbmV4cG9ydHMuZmlsdGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzZWFyY2hLZXksIGRlbGltaXRlciwgZGF0YUtleSkge1xuICAvLyBhbGxvdyBvcHRpb25hbCBgaW5gIGRlbGltaXRlclxuICAvLyBiZWNhdXNlIHdoeSBub3RcbiAgaWYgKGRlbGltaXRlciAmJiBkZWxpbWl0ZXIgIT09ICdpbicpIHtcbiAgICBkYXRhS2V5ID0gZGVsaW1pdGVyXG4gIH1cbiAgLy8gZ2V0IHRoZSBzZWFyY2ggc3RyaW5nXG4gIHZhciBzZWFyY2ggPVxuICAgIF8uc3RyaXBRdW90ZXMoc2VhcmNoS2V5KSB8fFxuICAgIHRoaXMuJGdldChzZWFyY2hLZXkpXG4gIGlmICghc2VhcmNoKSB7XG4gICAgcmV0dXJuIGFyclxuICB9XG4gIHNlYXJjaCA9ICgnJyArIHNlYXJjaCkudG9Mb3dlckNhc2UoKVxuICAvLyBnZXQgdGhlIG9wdGlvbmFsIGRhdGFLZXlcbiAgZGF0YUtleSA9XG4gICAgZGF0YUtleSAmJlxuICAgIChfLnN0cmlwUXVvdGVzKGRhdGFLZXkpIHx8IHRoaXMuJGdldChkYXRhS2V5KSlcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gZGF0YUtleVxuICAgICAgPyBjb250YWlucyhQYXRoLmdldChpdGVtLCBkYXRhS2V5KSwgc2VhcmNoKVxuICAgICAgOiBjb250YWlucyhpdGVtLCBzZWFyY2gpXG4gIH0pXG59XG5cbi8qKlxuICogRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc29ydEtleVxuICogQHBhcmFtIHtTdHJpbmd9IHJldmVyc2VLZXlcbiAqL1xuXG5leHBvcnRzLm9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzb3J0S2V5LCByZXZlcnNlS2V5KSB7XG4gIHZhciBrZXkgPVxuICAgIF8uc3RyaXBRdW90ZXMoc29ydEtleSkgfHxcbiAgICB0aGlzLiRnZXQoc29ydEtleSlcbiAgaWYgKCFrZXkpIHtcbiAgICByZXR1cm4gYXJyXG4gIH1cbiAgdmFyIG9yZGVyID0gMVxuICBpZiAocmV2ZXJzZUtleSkge1xuICAgIGlmIChyZXZlcnNlS2V5ID09PSAnLTEnKSB7XG4gICAgICBvcmRlciA9IC0xXG4gICAgfSBlbHNlIGlmIChyZXZlcnNlS2V5LmNoYXJDb2RlQXQoMCkgPT09IDB4MjEpIHsgLy8gIVxuICAgICAgcmV2ZXJzZUtleSA9IHJldmVyc2VLZXkuc2xpY2UoMSlcbiAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gMSA6IC0xXG4gICAgfSBlbHNlIHtcbiAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gLTEgOiAxXG4gICAgfVxuICB9XG4gIC8vIHNvcnQgb24gYSBjb3B5IHRvIGF2b2lkIG11dGF0aW5nIG9yaWdpbmFsIGFycmF5XG4gIHJldHVybiBhcnIuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgYSA9IF8uaXNPYmplY3QoYSkgPyBQYXRoLmdldChhLCBrZXkpIDogYVxuICAgIGIgPSBfLmlzT2JqZWN0KGIpID8gUGF0aC5nZXQoYiwga2V5KSA6IGJcbiAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhID4gYiA/IG9yZGVyIDogLW9yZGVyXG4gIH0pXG59XG5cbi8qKlxuICogU3RyaW5nIGNvbnRhaW4gaGVscGVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hcbiAqL1xuXG5mdW5jdGlvbiBjb250YWlucyAodmFsLCBzZWFyY2gpIHtcbiAgaWYgKF8uaXNPYmplY3QodmFsKSkge1xuICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICAgIGlmIChjb250YWlucyh2YWxba2V5XSwgc2VhcmNoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCkge1xuICAgIHJldHVybiB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIFN0cmluZ2lmeSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZW50XG4gKi9cblxuZXhwb3J0cy5qc29uID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUsIGluZGVudCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICA/IHZhbHVlXG4gICAgICA6IEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCBOdW1iZXIoaW5kZW50KSB8fCAyKVxuICB9LFxuICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdhYmMnID0+ICdBYmMnXG4gKi9cblxuZXhwb3J0cy5jYXBpdGFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHJldHVybiAnJ1xuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKClcbiAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiAnYWJjJyA9PiAnQUJDJ1xuICovXG5cbmV4cG9ydHMudXBwZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgfHwgdmFsdWUgPT09IDApXG4gICAgPyB2YWx1ZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKClcbiAgICA6ICcnXG59XG5cbi8qKlxuICogJ0FiQycgPT4gJ2FiYydcbiAqL1xuXG5leHBvcnRzLmxvd2VyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgID8gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgOiAnJ1xufVxuXG4vKipcbiAqIDEyMzQ1ID0+ICQxMiwzNDUuMDBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnblxuICovXG5cbnZhciBkaWdpdHNSRSA9IC8oXFxkezN9KSg/PVxcZCkvZ1xuXG5leHBvcnRzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBzaWduKSB7XG4gIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgaWYgKCFpc0Zpbml0ZSh2YWx1ZSkgfHwgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkpIHJldHVybiAnJ1xuICBzaWduID0gc2lnbiB8fCAnJCdcbiAgdmFyIHMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSkudG9TdHJpbmcoKSxcbiAgICBpID0gcy5sZW5ndGggJSAzLFxuICAgIGggPSBpID4gMFxuICAgICAgPyAocy5zbGljZSgwLCBpKSArIChzLmxlbmd0aCA+IDMgPyAnLCcgOiAnJykpXG4gICAgICA6ICcnLFxuICAgIHYgPSBNYXRoLmFicyhwYXJzZUludCgodmFsdWUgKiAxMDApICUgMTAwLCAxMCkpLFxuICAgIGYgPSAnLicgKyAodiA8IDEwID8gKCcwJyArIHYpIDogdilcbiAgcmV0dXJuICh2YWx1ZSA8IDAgPyAnLScgOiAnJykgK1xuICAgIHNpZ24gKyBoICsgcy5zbGljZShpKS5yZXBsYWNlKGRpZ2l0c1JFLCAnJDEsJykgKyBmXG59XG5cbi8qKlxuICogJ2l0ZW0nID0+ICdpdGVtcydcbiAqXG4gKiBAcGFyYW1zXG4gKiAgYW4gYXJyYXkgb2Ygc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvXG4gKiAgdGhlIHNpbmdsZSwgZG91YmxlLCB0cmlwbGUgLi4uIGZvcm1zIG9mIHRoZSB3b3JkIHRvXG4gKiAgYmUgcGx1cmFsaXplZC4gV2hlbiB0aGUgbnVtYmVyIHRvIGJlIHBsdXJhbGl6ZWRcbiAqICBleGNlZWRzIHRoZSBsZW5ndGggb2YgdGhlIGFyZ3MsIGl0IHdpbGwgdXNlIHRoZSBsYXN0XG4gKiAgZW50cnkgaW4gdGhlIGFycmF5LlxuICpcbiAqICBlLmcuIFsnc2luZ2xlJywgJ2RvdWJsZScsICd0cmlwbGUnLCAnbXVsdGlwbGUnXVxuICovXG5cbmV4cG9ydHMucGx1cmFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cywgMSlcbiAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMVxuICAgID8gKGFyZ3NbdmFsdWUgJSAxMCAtIDFdIHx8IGFyZ3NbYXJncy5sZW5ndGggLSAxXSlcbiAgICA6IChhcmdzWzBdICsgKHZhbHVlID09PSAxID8gJycgOiAncycpKVxufVxuXG4vKipcbiAqIEEgc3BlY2lhbCBmaWx0ZXIgdGhhdCB0YWtlcyBhIGhhbmRsZXIgZnVuY3Rpb24sXG4gKiB3cmFwcyBpdCBzbyBpdCBvbmx5IGdldHMgdHJpZ2dlcmVkIG9uIHNwZWNpZmljXG4gKiBrZXlwcmVzc2VzLiB2LW9uIG9ubHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbnZhciBrZXlDb2RlcyA9IHtcbiAgZW50ZXIgICAgOiAxMyxcbiAgdGFiICAgICAgOiA5LFxuICAnZGVsZXRlJyA6IDQ2LFxuICB1cCAgICAgICA6IDM4LFxuICBsZWZ0ICAgICA6IDM3LFxuICByaWdodCAgICA6IDM5LFxuICBkb3duICAgICA6IDQwLFxuICBlc2MgICAgICA6IDI3XG59XG5cbmV4cG9ydHMua2V5ID0gZnVuY3Rpb24gKGhhbmRsZXIsIGtleSkge1xuICBpZiAoIWhhbmRsZXIpIHJldHVyblxuICB2YXIgY29kZSA9IGtleUNvZGVzW2tleV1cbiAgaWYgKCFjb2RlKSB7XG4gICAgY29kZSA9IHBhcnNlSW50KGtleSwgMTApXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gY29kZSkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbCh0aGlzLCBlKVxuICAgIH1cbiAgfVxufVxuXG4vLyBleHBvc2Uga2V5Y29kZSBoYXNoXG5leHBvcnRzLmtleS5rZXlDb2RlcyA9IGtleUNvZGVzXG5cbi8qKlxuICogSW5zdGFsbCBzcGVjaWFsIGFycmF5IGZpbHRlcnNcbiAqL1xuXG5fLmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2FycmF5LWZpbHRlcnMnKSlcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgRGlyZWN0aXZlID0gcmVxdWlyZSgnLi4vZGlyZWN0aXZlJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdHJhbnNjbHVkZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxuXG4vKipcbiAqIFRyYW5zY2x1ZGUsIGNvbXBpbGUgYW5kIGxpbmsgZWxlbWVudC5cbiAqXG4gKiBJZiBhIHByZS1jb21waWxlZCBsaW5rZXIgaXMgYXZhaWxhYmxlLCB0aGF0IG1lYW5zIHRoZVxuICogcGFzc2VkIGluIGVsZW1lbnQgd2lsbCBiZSBwcmUtdHJhbnNjbHVkZWQgYW5kIGNvbXBpbGVkXG4gKiBhcyB3ZWxsIC0gYWxsIHdlIG5lZWQgdG8gZG8gaXMgdG8gY2FsbCB0aGUgbGlua2VyLlxuICpcbiAqIE90aGVyd2lzZSB3ZSBuZWVkIHRvIGNhbGwgdHJhbnNjbHVkZS9jb21waWxlL2xpbmsgaGVyZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5cbmV4cG9ydHMuX2NvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zXG4gIGlmIChvcHRpb25zLl9saW5rRm4pIHtcbiAgICAvLyBwcmUtdHJhbnNjbHVkZWQgd2l0aCBsaW5rZXIsIGp1c3QgdXNlIGl0XG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgb3B0aW9ucy5fbGlua0ZuKHRoaXMsIGVsKVxuICB9IGVsc2Uge1xuICAgIC8vIHRyYW5zY2x1ZGUgYW5kIGluaXQgZWxlbWVudFxuICAgIC8vIHRyYW5zY2x1ZGUgY2FuIHBvdGVudGlhbGx5IHJlcGxhY2Ugb3JpZ2luYWxcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIGtlZXAgcmVmZXJlbmNlXG4gICAgdmFyIG9yaWdpbmFsID0gZWxcbiAgICBlbCA9IHRyYW5zY2x1ZGUoZWwsIG9wdGlvbnMpXG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgLy8gY29tcGlsZSBhbmQgbGluayB0aGUgcmVzdFxuICAgIGNvbXBpbGUoZWwsIG9wdGlvbnMpKHRoaXMsIGVsKVxuICAgIC8vIGZpbmFsbHkgcmVwbGFjZSBvcmlnaW5hbFxuICAgIGlmIChvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIF8ucmVwbGFjZShvcmlnaW5hbCwgZWwpXG4gICAgfVxuICB9XG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgaW5zdGFuY2UgZWxlbWVudC4gQ2FsbGVkIGluIHRoZSBwdWJsaWNcbiAqICRtb3VudCgpIG1ldGhvZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZXhwb3J0cy5faW5pdEVsZW1lbnQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgaWYgKGVsIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgIHRoaXMuX2lzQmxvY2sgPSB0cnVlXG4gICAgdGhpcy4kZWwgPSB0aGlzLl9ibG9ja1N0YXJ0ID0gZWwuZmlyc3RDaGlsZFxuICAgIHRoaXMuX2Jsb2NrRW5kID0gZWwubGFzdENoaWxkXG4gICAgdGhpcy5fYmxvY2tGcmFnbWVudCA9IGVsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kZWwgPSBlbFxuICB9XG4gIHRoaXMuJGVsLl9fdnVlX18gPSB0aGlzXG4gIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVDb21waWxlJylcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGJpbmQgYSBkaXJlY3RpdmUgdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIGRpcmVjdGl2ZSBuYW1lXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgICAtIHRhcmdldCBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzYyAtIHBhcnNlZCBkaXJlY3RpdmUgZGVzY3JpcHRvclxuICogQHBhcmFtIHtPYmplY3R9IGRlZiAgLSBkaXJlY3RpdmUgZGVmaW5pdGlvbiBvYmplY3RcbiAqIEBwYXJhbSB7VnVlfHVuZGVmaW5lZH0gaG9zdCAtIHRyYW5zY2x1c2lvbiBob3N0IGNvbXBvbmVudFxuICovXG5cbmV4cG9ydHMuX2JpbmREaXIgPSBmdW5jdGlvbiAobmFtZSwgbm9kZSwgZGVzYywgZGVmLCBob3N0KSB7XG4gIHRoaXMuX2RpcmVjdGl2ZXMucHVzaChcbiAgICBuZXcgRGlyZWN0aXZlKG5hbWUsIG5vZGUsIHRoaXMsIGRlc2MsIGRlZiwgaG9zdClcbiAgKVxufVxuXG4vKipcbiAqIFRlYXJkb3duIGFuIGluc3RhbmNlLCB1bm9ic2VydmVzIHRoZSBkYXRhLCB1bmJpbmQgYWxsIHRoZVxuICogZGlyZWN0aXZlcywgdHVybiBvZmYgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSAtIHdoZXRoZXIgdG8gcmVtb3ZlIHRoZSBET00gbm9kZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVmZXJDbGVhbnVwIC0gaWYgdHJ1ZSwgZGVmZXIgY2xlYW51cCB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBjYWxsZWQgbGF0ZXJcbiAqL1xuXG5leHBvcnRzLl9kZXN0cm95ID0gZnVuY3Rpb24gKHJlbW92ZSwgZGVmZXJDbGVhbnVwKSB7XG4gIGlmICh0aGlzLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5fY2FsbEhvb2soJ2JlZm9yZURlc3Ryb3knKVxuICB0aGlzLl9pc0JlaW5nRGVzdHJveWVkID0gdHJ1ZVxuICB2YXIgaVxuICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudC4gb25seSBuZWNlc3NhcnlcbiAgLy8gaWYgcGFyZW50IGlzIG5vdCBiZWluZyBkZXN0cm95ZWQgYXMgd2VsbC5cbiAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudFxuICBpZiAocGFyZW50ICYmICFwYXJlbnQuX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICBpID0gcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKHRoaXMpXG4gICAgcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgfVxuICAvLyBzYW1lIGZvciB0cmFuc2NsdXNpb24gaG9zdC5cbiAgdmFyIGhvc3QgPSB0aGlzLl9ob3N0XG4gIGlmIChob3N0ICYmICFob3N0Ll9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgaSA9IGhvc3QuX3RyYW5zQ3BudHMuaW5kZXhPZih0aGlzKVxuICAgIGhvc3QuX3RyYW5zQ3BudHMuc3BsaWNlKGksIDEpXG4gIH1cbiAgLy8gZGVzdHJveSBhbGwgY2hpbGRyZW4uXG4gIGkgPSB0aGlzLl9jaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMuX2NoaWxkcmVuW2ldLiRkZXN0cm95KClcbiAgfVxuICAvLyB0ZWFyZG93biBhbGwgZGlyZWN0aXZlcy4gdGhpcyBhbHNvIHRlYXJzZG93biBhbGxcbiAgLy8gZGlyZWN0aXZlLW93bmVkIHdhdGNoZXJzLiBpbnRlbnRpb25hbGx5IGNoZWNrIGZvclxuICAvLyBkaXJlY3RpdmVzIGFycmF5IGxlbmd0aCBvbiBldmVyeSBsb29wIHNpbmNlIGRpcmVjdGl2ZXNcbiAgLy8gdGhhdCBtYW5hZ2VzIHBhcnRpYWwgY29tcGlsYXRpb24gY2FuIHNwbGljZSBvbmVzIG91dFxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fZGlyZWN0aXZlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2RpcmVjdGl2ZXNbaV0uX3RlYXJkb3duKClcbiAgfVxuICAvLyB0ZWFyZG93biBhbGwgdXNlciB3YXRjaGVycy5cbiAgdmFyIHdhdGNoZXJcbiAgZm9yIChpIGluIHRoaXMuX3VzZXJXYXRjaGVycykge1xuICAgIHdhdGNoZXIgPSB0aGlzLl91c2VyV2F0Y2hlcnNbaV1cbiAgICBpZiAod2F0Y2hlcikge1xuICAgICAgd2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG4gIC8vIHJlbW92ZSByZWZlcmVuY2UgdG8gc2VsZiBvbiAkZWxcbiAgaWYgKHRoaXMuJGVsKSB7XG4gICAgdGhpcy4kZWwuX192dWVfXyA9IG51bGxcbiAgfVxuICAvLyByZW1vdmUgRE9NIGVsZW1lbnRcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmIChyZW1vdmUgJiYgdGhpcy4kZWwpIHtcbiAgICB0aGlzLiRyZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fY2xlYW51cCgpXG4gICAgfSlcbiAgfSBlbHNlIGlmICghZGVmZXJDbGVhbnVwKSB7XG4gICAgdGhpcy5fY2xlYW51cCgpXG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhbiB1cCB0byBlbnN1cmUgZ2FyYmFnZSBjb2xsZWN0aW9uLlxuICogVGhpcyBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGxlYXZlIHRyYW5zaXRpb24gaWYgdGhlcmVcbiAqIGlzIGFueS5cbiAqL1xuXG5leHBvcnRzLl9jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAvLyByZW1vdmUgcmVmZXJlbmNlIGZyb20gZGF0YSBvYlxuICB0aGlzLl9kYXRhLl9fb2JfXy5yZW1vdmVWbSh0aGlzKVxuICB0aGlzLl9kYXRhID1cbiAgdGhpcy5fd2F0Y2hlcnMgPVxuICB0aGlzLl91c2VyV2F0Y2hlcnMgPVxuICB0aGlzLl93YXRjaGVyTGlzdCA9XG4gIHRoaXMuJGVsID1cbiAgdGhpcy4kcGFyZW50ID1cbiAgdGhpcy4kcm9vdCA9XG4gIHRoaXMuX2NoaWxkcmVuID1cbiAgdGhpcy5fdHJhbnNDcG50cyA9XG4gIHRoaXMuX2RpcmVjdGl2ZXMgPSBudWxsXG4gIC8vIGNhbGwgdGhlIGxhc3QgaG9vay4uLlxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ2Rlc3Ryb3llZCcpXG4gIC8vIHR1cm4gb2ZmIGFsbCBpbnN0YW5jZSBsaXN0ZW5lcnMuXG4gIHRoaXMuJG9mZigpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBpbkRvYyA9IF8uaW5Eb2NcblxuLyoqXG4gKiBTZXR1cCB0aGUgaW5zdGFuY2UncyBvcHRpb24gZXZlbnRzICYgd2F0Y2hlcnMuXG4gKiBJZiB0aGUgdmFsdWUgaXMgYSBzdHJpbmcsIHdlIHB1bGwgaXQgZnJvbSB0aGVcbiAqIGluc3RhbmNlJ3MgbWV0aG9kcyBieSBuYW1lLlxuICovXG5cbmV4cG9ydHMuX2luaXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9uc1xuICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJG9uJywgb3B0aW9ucy5ldmVudHMpXG4gIHJlZ2lzdGVyQ2FsbGJhY2tzKHRoaXMsICckd2F0Y2gnLCBvcHRpb25zLndhdGNoKVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGNhbGxiYWNrcyBmb3Igb3B0aW9uIGV2ZW50cyBhbmQgd2F0Y2hlcnMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaFxuICovXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQ2FsbGJhY2tzICh2bSwgYWN0aW9uLCBoYXNoKSB7XG4gIGlmICghaGFzaCkgcmV0dXJuXG4gIHZhciBoYW5kbGVycywga2V5LCBpLCBqXG4gIGZvciAoa2V5IGluIGhhc2gpIHtcbiAgICBoYW5kbGVycyA9IGhhc2hba2V5XVxuICAgIGlmIChfLmlzQXJyYXkoaGFuZGxlcnMpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHJlZ2lzdGVyKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcnNbaV0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ2lzdGVyKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcnMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSGVscGVyIHRvIHJlZ2lzdGVyIGFuIGV2ZW50L3dhdGNoIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSBoYW5kbGVyXG4gKi9cblxuZnVuY3Rpb24gcmVnaXN0ZXIgKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcikge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBoYW5kbGVyXG4gIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdm1bYWN0aW9uXShrZXksIGhhbmRsZXIpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbWV0aG9kcyA9IHZtLiRvcHRpb25zLm1ldGhvZHNcbiAgICB2YXIgbWV0aG9kID0gbWV0aG9kcyAmJiBtZXRob2RzW2hhbmRsZXJdXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgdm1bYWN0aW9uXShrZXksIG1ldGhvZClcbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnVW5rbm93biBtZXRob2Q6IFwiJyArIGhhbmRsZXIgKyAnXCIgd2hlbiAnICtcbiAgICAgICAgJ3JlZ2lzdGVyaW5nIGNhbGxiYWNrIGZvciAnICsgYWN0aW9uICtcbiAgICAgICAgJzogXCInICsga2V5ICsgJ1wiLidcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCByZWN1cnNpdmUgYXR0YWNoZWQvZGV0YWNoZWQgY2FsbHNcbiAqL1xuXG5leHBvcnRzLl9pbml0RE9NSG9va3MgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJG9uKCdob29rOmF0dGFjaGVkJywgb25BdHRhY2hlZClcbiAgdGhpcy4kb24oJ2hvb2s6ZGV0YWNoZWQnLCBvbkRldGFjaGVkKVxufVxuXG4vKipcbiAqIENhbGxiYWNrIHRvIHJlY3Vyc2l2ZWx5IGNhbGwgYXR0YWNoZWQgaG9vayBvbiBjaGlsZHJlblxuICovXG5cbmZ1bmN0aW9uIG9uQXR0YWNoZWQgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZVxuICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gIGlmICh0aGlzLl90cmFuc0NwbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX3RyYW5zQ3BudHMuZm9yRWFjaChjYWxsQXR0YWNoKVxuICB9XG59XG5cbi8qKlxuICogSXRlcmF0b3IgdG8gY2FsbCBhdHRhY2hlZCBob29rXG4gKiBcbiAqIEBwYXJhbSB7VnVlfSBjaGlsZFxuICovXG5cbmZ1bmN0aW9uIGNhbGxBdHRhY2ggKGNoaWxkKSB7XG4gIGlmICghY2hpbGQuX2lzQXR0YWNoZWQgJiYgaW5Eb2MoY2hpbGQuJGVsKSkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gcmVjdXJzaXZlbHkgY2FsbCBkZXRhY2hlZCBob29rIG9uIGNoaWxkcmVuXG4gKi9cblxuZnVuY3Rpb24gb25EZXRhY2hlZCAoKSB7XG4gIHRoaXMuX2lzQXR0YWNoZWQgPSBmYWxzZVxuICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gIGlmICh0aGlzLl90cmFuc0NwbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX3RyYW5zQ3BudHMuZm9yRWFjaChjYWxsRGV0YWNoKVxuICB9XG59XG5cbi8qKlxuICogSXRlcmF0b3IgdG8gY2FsbCBkZXRhY2hlZCBob29rXG4gKiBcbiAqIEBwYXJhbSB7VnVlfSBjaGlsZFxuICovXG5cbmZ1bmN0aW9uIGNhbGxEZXRhY2ggKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5faXNBdHRhY2hlZCAmJiAhaW5Eb2MoY2hpbGQuJGVsKSkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICB9XG59XG5cbi8qKlxuICogVHJpZ2dlciBhbGwgaGFuZGxlcnMgZm9yIGEgaG9va1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBob29rXG4gKi9cblxuZXhwb3J0cy5fY2FsbEhvb2sgPSBmdW5jdGlvbiAoaG9vaykge1xuICB2YXIgaGFuZGxlcnMgPSB0aGlzLiRvcHRpb25zW2hvb2tdXG4gIGlmIChoYW5kbGVycykge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBoYW5kbGVyc1tpXS5jYWxsKHRoaXMpXG4gICAgfVxuICB9XG4gIHRoaXMuJGVtaXQoJ2hvb2s6JyArIGhvb2spXG59IiwidmFyIG1lcmdlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvbWVyZ2Utb3B0aW9uJylcblxuLyoqXG4gKiBUaGUgbWFpbiBpbml0IHNlcXVlbmNlLiBUaGlzIGlzIGNhbGxlZCBmb3IgZXZlcnlcbiAqIGluc3RhbmNlLCBpbmNsdWRpbmcgb25lcyB0aGF0IGFyZSBjcmVhdGVkIGZyb20gZXh0ZW5kZWRcbiAqIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIHRoaXMgb3B0aW9ucyBvYmplY3Qgc2hvdWxkIGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByZXN1bHQgb2YgbWVyZ2luZyBjbGFzc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zIGFuZCB0aGUgb3B0aW9ucyBwYXNzZWRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgaW4gdG8gdGhlIGNvbnN0cnVjdG9yLlxuICovXG5cbmV4cG9ydHMuX2luaXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG5cbiAgdGhpcy4kZWwgICAgICAgICAgID0gbnVsbFxuICB0aGlzLiRwYXJlbnQgICAgICAgPSBvcHRpb25zLl9wYXJlbnRcbiAgdGhpcy4kcm9vdCAgICAgICAgID0gb3B0aW9ucy5fcm9vdCB8fCB0aGlzXG4gIHRoaXMuJCAgICAgICAgICAgICA9IHt9IC8vIGNoaWxkIHZtIHJlZmVyZW5jZXNcbiAgdGhpcy4kJCAgICAgICAgICAgID0ge30gLy8gZWxlbWVudCByZWZlcmVuY2VzXG4gIHRoaXMuX3dhdGNoZXJMaXN0ICA9IFtdIC8vIGFsbCB3YXRjaGVycyBhcyBhbiBhcnJheVxuICB0aGlzLl93YXRjaGVycyAgICAgPSB7fSAvLyBpbnRlcm5hbCB3YXRjaGVycyBhcyBhIGhhc2hcbiAgdGhpcy5fdXNlcldhdGNoZXJzID0ge30gLy8gdXNlciB3YXRjaGVycyBhcyBhIGhhc2hcbiAgdGhpcy5fZGlyZWN0aXZlcyAgID0gW10gLy8gYWxsIGRpcmVjdGl2ZXNcblxuICAvLyBhIGZsYWcgdG8gYXZvaWQgdGhpcyBiZWluZyBvYnNlcnZlZFxuICB0aGlzLl9pc1Z1ZSA9IHRydWVcblxuICAvLyBldmVudHMgYm9va2tlZXBpbmdcbiAgdGhpcy5fZXZlbnRzICAgICAgICAgPSB7fSAgICAvLyByZWdpc3RlcmVkIGNhbGxiYWNrc1xuICB0aGlzLl9ldmVudHNDb3VudCAgICA9IHt9ICAgIC8vIGZvciAkYnJvYWRjYXN0IG9wdGltaXphdGlvblxuICB0aGlzLl9ldmVudENhbmNlbGxlZCA9IGZhbHNlIC8vIGZvciBldmVudCBjYW5jZWxsYXRpb25cblxuICAvLyBibG9jayBpbnN0YW5jZSBwcm9wZXJ0aWVzXG4gIHRoaXMuX2lzQmxvY2sgICAgID0gZmFsc2VcbiAgdGhpcy5fYmxvY2tTdGFydCAgPSAgICAgICAgICAvLyBAdHlwZSB7Q29tbWVudE5vZGV9XG4gIHRoaXMuX2Jsb2NrRW5kICAgID0gbnVsbCAgICAgLy8gQHR5cGUge0NvbW1lbnROb2RlfVxuXG4gIC8vIGxpZmVjeWNsZSBzdGF0ZVxuICB0aGlzLl9pc0NvbXBpbGVkICA9XG4gIHRoaXMuX2lzRGVzdHJveWVkID1cbiAgdGhpcy5faXNSZWFkeSAgICAgPVxuICB0aGlzLl9pc0F0dGFjaGVkICA9XG4gIHRoaXMuX2lzQmVpbmdEZXN0cm95ZWQgPSBmYWxzZVxuXG4gIC8vIGNoaWxkcmVuXG4gIHRoaXMuX2NoaWxkcmVuID0gW11cbiAgdGhpcy5fY2hpbGRDdG9ycyA9IHt9XG5cbiAgLy8gdHJhbnNjbHVzaW9uIHVubGluayBmdW5jdGlvbnNcbiAgdGhpcy5fY29udGFpbmVyVW5saW5rRm4gPVxuICB0aGlzLl9jb250ZW50VW5saW5rRm4gPSBudWxsXG5cbiAgLy8gdHJhbnNjbHVkZWQgY29tcG9uZW50cyB0aGF0IGJlbG9uZyB0byB0aGUgcGFyZW50LlxuICAvLyBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgdGhlbSBzbyB0aGF0IHdlIGNhbiBjYWxsXG4gIC8vIGF0dGFjaGVkL2RldGFjaGVkIGhvb2tzIG9uIHRoZW0uXG4gIHRoaXMuX3RyYW5zQ3BudHMgPSBbXVxuICB0aGlzLl9ob3N0ID0gb3B0aW9ucy5faG9zdFxuXG4gIC8vIHB1c2ggc2VsZiBpbnRvIHBhcmVudCAvIHRyYW5zY2x1c2lvbiBob3N0XG4gIGlmICh0aGlzLiRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcylcbiAgfVxuICBpZiAodGhpcy5faG9zdCkge1xuICAgIHRoaXMuX2hvc3QuX3RyYW5zQ3BudHMucHVzaCh0aGlzKVxuICB9XG5cbiAgLy8gcHJvcHMgdXNlZCBpbiB2LXJlcGVhdCBkaWZmaW5nXG4gIHRoaXMuX25ldyA9IHRydWVcbiAgdGhpcy5fcmV1c2VkID0gZmFsc2VcblxuICAvLyBtZXJnZSBvcHRpb25zLlxuICBvcHRpb25zID0gdGhpcy4kb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnMsXG4gICAgb3B0aW9ucyxcbiAgICB0aGlzXG4gIClcblxuICAvLyBzZXQgZGF0YSBhZnRlciBtZXJnZS5cbiAgdGhpcy5fZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fVxuXG4gIC8vIGluaXRpYWxpemUgZGF0YSBvYnNlcnZhdGlvbiBhbmQgc2NvcGUgaW5oZXJpdGFuY2UuXG4gIHRoaXMuX2luaXRTY29wZSgpXG5cbiAgLy8gc2V0dXAgZXZlbnQgc3lzdGVtIGFuZCBvcHRpb24gZXZlbnRzLlxuICB0aGlzLl9pbml0RXZlbnRzKClcblxuICAvLyBjYWxsIGNyZWF0ZWQgaG9va1xuICB0aGlzLl9jYWxsSG9vaygnY3JlYXRlZCcpXG5cbiAgLy8gaWYgYGVsYCBvcHRpb24gaXMgcGFzc2VkLCBzdGFydCBjb21waWxhdGlvbi5cbiAgaWYgKG9wdGlvbnMuZWwpIHtcbiAgICB0aGlzLiRtb3VudChvcHRpb25zLmVsKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBPYnNlcnZlciA9IHJlcXVpcmUoJy4uL29ic2VydmVyJylcbnZhciBEZXAgPSByZXF1aXJlKCcuLi9vYnNlcnZlci9kZXAnKVxuXG4vKipcbiAqIFNldHVwIHRoZSBzY29wZSBvZiBhbiBpbnN0YW5jZSwgd2hpY2ggY29udGFpbnM6XG4gKiAtIG9ic2VydmVkIGRhdGFcbiAqIC0gY29tcHV0ZWQgcHJvcGVydGllc1xuICogLSB1c2VyIG1ldGhvZHNcbiAqIC0gbWV0YSBwcm9wZXJ0aWVzXG4gKi9cblxuZXhwb3J0cy5faW5pdFNjb3BlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9pbml0RGF0YSgpXG4gIHRoaXMuX2luaXRDb21wdXRlZCgpXG4gIHRoaXMuX2luaXRNZXRob2RzKClcbiAgdGhpcy5faW5pdE1ldGEoKVxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIGRhdGEuIFxuICovXG5cbmV4cG9ydHMuX2luaXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAvLyBwcm94eSBkYXRhIG9uIGluc3RhbmNlXG4gIHZhciBkYXRhID0gdGhpcy5fZGF0YVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHRoaXMuX3Byb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gb2JzZXJ2ZSBkYXRhXG4gIE9ic2VydmVyLmNyZWF0ZShkYXRhKS5hZGRWbSh0aGlzKVxufVxuXG4vKipcbiAqIFN3YXAgdGhlIGlzbnRhbmNlJ3MgJGRhdGEuIENhbGxlZCBpbiAkZGF0YSdzIHNldHRlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbmV3RGF0YVxuICovXG5cbmV4cG9ydHMuX3NldERhdGEgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuICBuZXdEYXRhID0gbmV3RGF0YSB8fCB7fVxuICB2YXIgb2xkRGF0YSA9IHRoaXMuX2RhdGFcbiAgdGhpcy5fZGF0YSA9IG5ld0RhdGFcbiAgdmFyIGtleXMsIGtleSwgaVxuICAvLyB1bnByb3h5IGtleXMgbm90IHByZXNlbnQgaW4gbmV3IGRhdGFcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9sZERhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkgJiYgIShrZXkgaW4gbmV3RGF0YSkpIHtcbiAgICAgIHRoaXMuX3VucHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICAvLyBwcm94eSBrZXlzIG5vdCBhbHJlYWR5IHByb3hpZWQsXG4gIC8vIGFuZCB0cmlnZ2VyIGNoYW5nZSBmb3IgY2hhbmdlZCB2YWx1ZXNcbiAga2V5cyA9IE9iamVjdC5rZXlzKG5ld0RhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgLy8gbmV3IHByb3BlcnR5XG4gICAgICB0aGlzLl9wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIG9sZERhdGEuX19vYl9fLnJlbW92ZVZtKHRoaXMpXG4gIE9ic2VydmVyLmNyZWF0ZShuZXdEYXRhKS5hZGRWbSh0aGlzKVxuICB0aGlzLl9kaWdlc3QoKVxufVxuXG4vKipcbiAqIFByb3h5IGEgcHJvcGVydHksIHNvIHRoYXRcbiAqIHZtLnByb3AgPT09IHZtLl9kYXRhLnByb3BcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy5fcHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIC8vIG5lZWQgdG8gc3RvcmUgcmVmIHRvIHNlbGYgaGVyZVxuICAvLyBiZWNhdXNlIHRoZXNlIGdldHRlci9zZXR0ZXJzIG1pZ2h0XG4gIC8vIGJlIGNhbGxlZCBieSBjaGlsZCBpbnN0YW5jZXMhXG4gIHZhciBzZWxmID0gdGhpc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBwcm94eUdldHRlciAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5fZGF0YVtrZXldXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcbiAgICAgIHNlbGYuX2RhdGFba2V5XSA9IHZhbFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBVbnByb3h5IGEgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3VucHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIGRlbGV0ZSB0aGlzW2tleV1cbn1cblxuLyoqXG4gKiBGb3JjZSB1cGRhdGUgb24gZXZlcnkgd2F0Y2hlciBpbiBzY29wZS5cbiAqL1xuXG5leHBvcnRzLl9kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpID0gdGhpcy5fd2F0Y2hlckxpc3QubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLl93YXRjaGVyTGlzdFtpXS51cGRhdGUoKVxuICB9XG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4gIGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkLiRvcHRpb25zLmluaGVyaXQpIHtcbiAgICAgIGNoaWxkLl9kaWdlc3QoKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIGNvbXB1dGVkIHByb3BlcnRpZXMuIFRoZXkgYXJlIGVzc2VudGlhbGx5XG4gKiBzcGVjaWFsIGdldHRlci9zZXR0ZXJzXG4gKi9cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuZXhwb3J0cy5faW5pdENvbXB1dGVkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29tcHV0ZWQgPSB0aGlzLiRvcHRpb25zLmNvbXB1dGVkXG4gIGlmIChjb21wdXRlZCkge1xuICAgIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xuICAgICAgdmFyIHVzZXJEZWYgPSBjb21wdXRlZFtrZXldXG4gICAgICB2YXIgZGVmID0ge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkZWYuZ2V0ID0gXy5iaW5kKHVzZXJEZWYsIHRoaXMpXG4gICAgICAgIGRlZi5zZXQgPSBub29wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWYuZ2V0ID0gdXNlckRlZi5nZXRcbiAgICAgICAgICA/IF8uYmluZCh1c2VyRGVmLmdldCwgdGhpcylcbiAgICAgICAgICA6IG5vb3BcbiAgICAgICAgZGVmLnNldCA9IHVzZXJEZWYuc2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5zZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZWYpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgaW5zdGFuY2UgbWV0aG9kcy4gTWV0aG9kcyBtdXN0IGJlIGJvdW5kIHRvIHRoZVxuICogaW5zdGFuY2Ugc2luY2UgdGhleSBtaWdodCBiZSBjYWxsZWQgYnkgY2hpbGRyZW5cbiAqIGluaGVyaXRpbmcgdGhlbS5cbiAqL1xuXG5leHBvcnRzLl9pbml0TWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1ldGhvZHMgPSB0aGlzLiRvcHRpb25zLm1ldGhvZHNcbiAgaWYgKG1ldGhvZHMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykge1xuICAgICAgdGhpc1trZXldID0gXy5iaW5kKG1ldGhvZHNba2V5XSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIG1ldGEgaW5mb3JtYXRpb24gbGlrZSAkaW5kZXgsICRrZXkgJiAkdmFsdWUuXG4gKi9cblxuZXhwb3J0cy5faW5pdE1ldGEgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRhcyA9IHRoaXMuJG9wdGlvbnMuX21ldGFcbiAgaWYgKG1ldGFzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGFzKSB7XG4gICAgICB0aGlzLl9kZWZpbmVNZXRhKGtleSwgbWV0YXNba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBtZXRhIHByb3BlcnR5LCBlLmcgJGluZGV4LCAka2V5LCAkdmFsdWVcbiAqIHdoaWNoIG9ubHkgZXhpc3RzIG9uIHRoZSB2bSBpbnN0YW5jZSBidXQgbm90IGluICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuXG5leHBvcnRzLl9kZWZpbmVNZXRhID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBtZXRhR2V0dGVyICgpIHtcbiAgICAgIGlmIChPYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgT2JzZXJ2ZXIudGFyZ2V0LmFkZERlcChkZXApXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gbWV0YVNldHRlciAodmFsKSB7XG4gICAgICBpZiAodmFsICE9PSB2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbFxuICAgICAgICBkZXAubm90aWZ5KClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlXG52YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmNyZWF0ZShhcnJheVByb3RvKVxuXG4vKipcbiAqIEludGVyY2VwdCBtdXRhdGluZyBtZXRob2RzIGFuZCBlbWl0IGV2ZW50c1xuICovXG5cbjtbXG4gICdwdXNoJyxcbiAgJ3BvcCcsXG4gICdzaGlmdCcsXG4gICd1bnNoaWZ0JyxcbiAgJ3NwbGljZScsXG4gICdzb3J0JyxcbiAgJ3JldmVyc2UnXG5dXG4uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIGNhY2hlIG9yaWdpbmFsIG1ldGhvZFxuICB2YXIgb3JpZ2luYWwgPSBhcnJheVByb3RvW21ldGhvZF1cbiAgXy5kZWZpbmUoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICB2YXIgaW5zZXJ0ZWRcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAncHVzaCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChpbnNlcnRlZCkgb2Iub2JzZXJ2ZUFycmF5KGluc2VydGVkKVxuICAgIC8vIG5vdGlmeSBjaGFuZ2VcbiAgICBvYi5ub3RpZnkoKVxuICAgIHJldHVybiByZXN1bHRcbiAgfSlcbn0pXG5cbi8qKlxuICogU3dhcCB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXggd2l0aCBhIG5ldyB2YWx1ZVxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Kn0gLSByZXBsYWNlZCBlbGVtZW50XG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckc2V0JyxcbiAgZnVuY3Rpb24gJHNldCAoaW5kZXgsIHZhbCkge1xuICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5sZW5ndGggPSBpbmRleCArIDFcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxLCB2YWwpWzBdXG4gIH1cbilcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmVtb3ZlIHRoZSBlbGVtZW50IGF0IGdpdmVuIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5fLmRlZmluZShcbiAgYXJyYXlQcm90byxcbiAgJyRyZW1vdmUnLFxuICBmdW5jdGlvbiAkcmVtb3ZlIChpbmRleCkge1xuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICBpbmRleCA9IHRoaXMuaW5kZXhPZihpbmRleClcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSlbMF1cbiAgICB9XG4gIH1cbilcblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1ldGhvZHMiLCJ2YXIgdWlkID0gMFxudmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBBIGRlcCBpcyBhbiBvYnNlcnZhYmxlIHRoYXQgY2FuIGhhdmUgbXVsdGlwbGVcbiAqIGRpcmVjdGl2ZXMgc3Vic2NyaWJpbmcgdG8gaXQuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gRGVwICgpIHtcbiAgdGhpcy5pZCA9ICsrdWlkXG4gIHRoaXMuc3VicyA9IFtdXG59XG5cbnZhciBwID0gRGVwLnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLmFkZFN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdGhpcy5zdWJzLnB1c2goc3ViKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLnJlbW92ZVN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgaWYgKHRoaXMuc3Vicy5sZW5ndGgpIHtcbiAgICB2YXIgaSA9IHRoaXMuc3Vicy5pbmRleE9mKHN1YilcbiAgICBpZiAoaSA+IC0xKSB0aGlzLnN1YnMuc3BsaWNlKGksIDEpXG4gIH1cbn1cblxuLyoqXG4gKiBOb3RpZnkgYWxsIHN1YnNjcmliZXJzIG9mIGEgbmV3IHZhbHVlLlxuICovXG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAvLyBzdGFibGl6ZSB0aGUgc3Vic2NyaWJlciBsaXN0IGZpcnN0XG4gIHZhciBzdWJzID0gXy50b0FycmF5KHRoaXMuc3VicylcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdWJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHN1YnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlcCIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciBEZXAgPSByZXF1aXJlKCcuL2RlcCcpXG52YXIgYXJyYXlNZXRob2RzID0gcmVxdWlyZSgnLi9hcnJheScpXG52YXIgYXJyYXlLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYXJyYXlNZXRob2RzKVxucmVxdWlyZSgnLi9vYmplY3QnKVxuXG52YXIgdWlkID0gMFxuXG4vKipcbiAqIFR5cGUgZW51bXNcbiAqL1xuXG52YXIgQVJSQVkgID0gMFxudmFyIE9CSkVDVCA9IDFcblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXG4gKiB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIF9fcHJvdG9fX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b1xuICovXG5cbmZ1bmN0aW9uIHByb3RvQXVnbWVudCAodGFyZ2V0LCBzcmMpIHtcbiAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyY1xufVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBkZWZpbmluZ1xuICogaGlkZGVuIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gY29weUF1Z21lbnQgKHRhcmdldCwgc3JjLCBrZXlzKSB7XG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIF8uZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSlcbiAgfVxufVxuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcbiAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IHZhbHVlXG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gT2JzZXJ2ZXIgKHZhbHVlLCB0eXBlKSB7XG4gIHRoaXMuaWQgPSArK3VpZFxuICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gIHRoaXMuZGVwcyA9IFtdXG4gIF8uZGVmaW5lKHZhbHVlLCAnX19vYl9fJywgdGhpcylcbiAgaWYgKHR5cGUgPT09IEFSUkFZKSB7XG4gICAgdmFyIGF1Z21lbnQgPSBjb25maWcucHJvdG8gJiYgXy5oYXNQcm90b1xuICAgICAgPyBwcm90b0F1Z21lbnRcbiAgICAgIDogY29weUF1Z21lbnRcbiAgICBhdWdtZW50KHZhbHVlLCBhcnJheU1ldGhvZHMsIGFycmF5S2V5cylcbiAgICB0aGlzLm9ic2VydmVBcnJheSh2YWx1ZSlcbiAgfSBlbHNlIGlmICh0eXBlID09PSBPQkpFQ1QpIHtcbiAgICB0aGlzLndhbGsodmFsdWUpXG4gIH1cbn1cblxuT2JzZXJ2ZXIudGFyZ2V0ID0gbnVsbFxuXG52YXIgcCA9IE9ic2VydmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF0dGVtcHQgdG8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlIGZvciBhIHZhbHVlLFxuICogcmV0dXJucyB0aGUgbmV3IG9ic2VydmVyIGlmIHN1Y2Nlc3NmdWxseSBvYnNlcnZlZCxcbiAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge09ic2VydmVyfHVuZGVmaW5lZH1cbiAqIEBzdGF0aWNcbiAqL1xuXG5PYnNlcnZlci5jcmVhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKFxuICAgIHZhbHVlICYmXG4gICAgdmFsdWUuaGFzT3duUHJvcGVydHkoJ19fb2JfXycpICYmXG4gICAgdmFsdWUuX19vYl9fIGluc3RhbmNlb2YgT2JzZXJ2ZXJcbiAgKSB7XG4gICAgcmV0dXJuIHZhbHVlLl9fb2JfX1xuICB9IGVsc2UgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHZhbHVlLCBBUlJBWSlcbiAgfSBlbHNlIGlmIChcbiAgICBfLmlzUGxhaW5PYmplY3QodmFsdWUpICYmXG4gICAgIXZhbHVlLl9pc1Z1ZSAvLyBhdm9pZCBWdWUgaW5zdGFuY2VcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcih2YWx1ZSwgT0JKRUNUKVxuICB9XG59XG5cbi8qKlxuICogV2FsayB0aHJvdWdoIGVhY2ggcHJvcGVydHkgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXG4gKiBnZXR0ZXIvc2V0dGVycy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW5cbiAqIHZhbHVlIHR5cGUgaXMgT2JqZWN0LiBQcm9wZXJ0aWVzIHByZWZpeGVkIHdpdGggYCRgIG9yIGBfYFxuICogYW5kIGFjY2Vzc29yIHByb3BlcnRpZXMgYXJlIGlnbm9yZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbnAud2FsayA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIGtleSwgcHJlZml4XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgcHJlZml4ID0ga2V5LmNoYXJDb2RlQXQoMClcbiAgICBpZiAocHJlZml4ICE9PSAweDI0ICYmIHByZWZpeCAhPT0gMHg1RikgeyAvLyBza2lwICQgb3IgX1xuICAgICAgdGhpcy5jb252ZXJ0KGtleSwgb2JqW2tleV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVHJ5IHRvIGNhcmV0ZSBhbiBvYnNlcnZlciBmb3IgYSBjaGlsZCB2YWx1ZSxcbiAqIGFuZCBpZiB2YWx1ZSBpcyBhcnJheSwgbGluayBkZXAgdG8gdGhlIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtEZXB8dW5kZWZpbmVkfVxuICovXG5cbnAub2JzZXJ2ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuIE9ic2VydmVyLmNyZWF0ZSh2YWwpXG59XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcbiAqL1xuXG5wLm9ic2VydmVBcnJheSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICB2YXIgaSA9IGl0ZW1zLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5vYnNlcnZlKGl0ZW1zW2ldKVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhIHByb3BlcnR5IGludG8gZ2V0dGVyL3NldHRlciBzbyB3ZSBjYW4gZW1pdFxuICogdGhlIGV2ZW50cyB3aGVuIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC9jaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxucC5jb252ZXJ0ID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gIHZhciBvYiA9IHRoaXNcbiAgdmFyIGNoaWxkT2IgPSBvYi5vYnNlcnZlKHZhbClcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKVxuICBpZiAoY2hpbGRPYikge1xuICAgIGNoaWxkT2IuZGVwcy5wdXNoKGRlcClcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2IudmFsdWUsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gT2JzZXJ2ZXIudGFyZ2V0IGlzIGEgd2F0Y2hlciB3aG9zZSBnZXR0ZXIgaXNcbiAgICAgIC8vIGN1cnJlbnRseSBiZWluZyBldmFsdWF0ZWQuXG4gICAgICBpZiAob2IuYWN0aXZlICYmIE9ic2VydmVyLnRhcmdldCkge1xuICAgICAgICBPYnNlcnZlci50YXJnZXQuYWRkRGVwKGRlcClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsKSByZXR1cm5cbiAgICAgIC8vIHJlbW92ZSBkZXAgZnJvbSBvbGQgdmFsdWVcbiAgICAgIHZhciBvbGRDaGlsZE9iID0gdmFsICYmIHZhbC5fX29iX19cbiAgICAgIGlmIChvbGRDaGlsZE9iKSB7XG4gICAgICAgIHZhciBvbGREZXBzID0gb2xkQ2hpbGRPYi5kZXBzXG4gICAgICAgIG9sZERlcHMuc3BsaWNlKG9sZERlcHMuaW5kZXhPZihkZXApLCAxKVxuICAgICAgfVxuICAgICAgdmFsID0gbmV3VmFsXG4gICAgICAvLyBhZGQgZGVwIHRvIG5ldyB2YWx1ZVxuICAgICAgdmFyIG5ld0NoaWxkT2IgPSBvYi5vYnNlcnZlKG5ld1ZhbClcbiAgICAgIGlmIChuZXdDaGlsZE9iKSB7XG4gICAgICAgIG5ld0NoaWxkT2IuZGVwcy5wdXNoKGRlcClcbiAgICAgIH1cbiAgICAgIGRlcC5ub3RpZnkoKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBOb3RpZnkgY2hhbmdlIG9uIGFsbCBzZWxmIGRlcHMgb24gYW4gb2JzZXJ2ZXIuXG4gKiBUaGlzIGlzIGNhbGxlZCB3aGVuIGEgbXV0YWJsZSB2YWx1ZSBtdXRhdGVzLiBlLmcuXG4gKiB3aGVuIGFuIEFycmF5J3MgbXV0YXRpbmcgbWV0aG9kcyBhcmUgY2FsbGVkLCBvciBhblxuICogT2JqZWN0J3MgJGFkZC8kZGVsZXRlIGFyZSBjYWxsZWQuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkZXBzID0gdGhpcy5kZXBzXG4gIGZvciAodmFyIGkgPSAwLCBsID0gZGVwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBkZXBzW2ldLm5vdGlmeSgpXG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYW4gb3duZXIgdm0sIHNvIHRoYXQgd2hlbiAkYWRkLyRkZWxldGUgbXV0YXRpb25zXG4gKiBoYXBwZW4gd2UgY2FuIG5vdGlmeSBvd25lciB2bXMgdG8gcHJveHkgdGhlIGtleXMgYW5kXG4gKiBkaWdlc3QgdGhlIHdhdGNoZXJzLiBUaGlzIGlzIG9ubHkgY2FsbGVkIHdoZW4gdGhlIG9iamVjdFxuICogaXMgb2JzZXJ2ZWQgYXMgYW4gaW5zdGFuY2UncyByb290ICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAuYWRkVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgKHRoaXMudm1zID0gdGhpcy52bXMgfHwgW10pLnB1c2godm0pXG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIG93bmVyIHZtLiBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBvYmplY3QgaXNcbiAqIHN3YXBwZWQgb3V0IGFzIGFuIGluc3RhbmNlJ3MgJGRhdGEgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAucmVtb3ZlVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgdGhpcy52bXMuc3BsaWNlKHRoaXMudm1zLmluZGV4T2Yodm0pLCAxKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VydmVyXG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIG9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIG5ldyBwcm9wZXJ0eSB0byBhbiBvYnNlcnZlZCBvYmplY3RcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwdWJsaWNcbiAqL1xuXG5fLmRlZmluZShcbiAgb2JqUHJvdG8sXG4gICckYWRkJyxcbiAgZnVuY3Rpb24gJGFkZCAoa2V5LCB2YWwpIHtcbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm5cbiAgICB2YXIgb2IgPSB0aGlzLl9fb2JfX1xuICAgIGlmICghb2IgfHwgXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHRoaXNba2V5XSA9IHZhbFxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIG9iLmNvbnZlcnQoa2V5LCB2YWwpXG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fcHJveHkoa2V5KVxuICAgICAgICB2bS5fZGlnZXN0KClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2Iubm90aWZ5KClcbiAgICB9XG4gIH1cbilcblxuLyoqXG4gKiBTZXQgYSBwcm9wZXJ0eSBvbiBhbiBvYnNlcnZlZCBvYmplY3QsIGNhbGxpbmcgYWRkIHRvXG4gKiBlbnN1cmUgdGhlIHByb3BlcnR5IGlzIG9ic2VydmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJHNldCcsXG4gIGZ1bmN0aW9uICRzZXQgKGtleSwgdmFsKSB7XG4gICAgdGhpcy4kYWRkKGtleSwgdmFsKVxuICAgIHRoaXNba2V5XSA9IHZhbFxuICB9XG4pXG5cbi8qKlxuICogRGVsZXRlcyBhIHByb3BlcnR5IGZyb20gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwdWJsaWNcbiAqL1xuXG5fLmRlZmluZShcbiAgb2JqUHJvdG8sXG4gICckZGVsZXRlJyxcbiAgZnVuY3Rpb24gJGRlbGV0ZSAoa2V5KSB7XG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuICAgIGRlbGV0ZSB0aGlzW2tleV1cbiAgICB2YXIgb2IgPSB0aGlzLl9fb2JfX1xuICAgIGlmICghb2IgfHwgXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAob2Iudm1zKSB7XG4gICAgICB2YXIgaSA9IG9iLnZtcy5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIHZtID0gb2Iudm1zW2ldXG4gICAgICAgIHZtLl91bnByb3h5KGtleSlcbiAgICAgICAgdm0uX2RpZ2VzdCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iLm5vdGlmeSgpXG4gICAgfVxuICB9XG4pIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBjYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxudmFyIGFyZ1JFID0gL15bXlxce1xcP10rJHxeJ1teJ10qJyR8XlwiW15cIl0qXCIkL1xudmFyIGZpbHRlclRva2VuUkUgPSAvW15cXHMnXCJdK3wnW14nXSsnfFwiW15cIl0rXCIvZ1xuXG4vKipcbiAqIFBhcnNlciBzdGF0ZVxuICovXG5cbnZhciBzdHJcbnZhciBjLCBpLCBsXG52YXIgaW5TaW5nbGVcbnZhciBpbkRvdWJsZVxudmFyIGN1cmx5XG52YXIgc3F1YXJlXG52YXIgcGFyZW5cbnZhciBiZWdpblxudmFyIGFyZ0luZGV4XG52YXIgZGlyc1xudmFyIGRpclxudmFyIGxhc3RGaWx0ZXJJbmRleFxudmFyIGFyZ1xuXG4vKipcbiAqIFB1c2ggYSBkaXJlY3RpdmUgb2JqZWN0IGludG8gdGhlIHJlc3VsdCBBcnJheVxuICovXG5cbmZ1bmN0aW9uIHB1c2hEaXIgKCkge1xuICBkaXIucmF3ID0gc3RyLnNsaWNlKGJlZ2luLCBpKS50cmltKClcbiAgaWYgKGRpci5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gIH0gZWxzZSBpZiAobGFzdEZpbHRlckluZGV4ICE9PSBiZWdpbikge1xuICAgIHB1c2hGaWx0ZXIoKVxuICB9XG4gIGlmIChpID09PSAwIHx8IGRpci5leHByZXNzaW9uKSB7XG4gICAgZGlycy5wdXNoKGRpcilcbiAgfVxufVxuXG4vKipcbiAqIFB1c2ggYSBmaWx0ZXIgdG8gdGhlIGN1cnJlbnQgZGlyZWN0aXZlIG9iamVjdFxuICovXG5cbmZ1bmN0aW9uIHB1c2hGaWx0ZXIgKCkge1xuICB2YXIgZXhwID0gc3RyLnNsaWNlKGxhc3RGaWx0ZXJJbmRleCwgaSkudHJpbSgpXG4gIHZhciBmaWx0ZXJcbiAgaWYgKGV4cCkge1xuICAgIGZpbHRlciA9IHt9XG4gICAgdmFyIHRva2VucyA9IGV4cC5tYXRjaChmaWx0ZXJUb2tlblJFKVxuICAgIGZpbHRlci5uYW1lID0gdG9rZW5zWzBdXG4gICAgZmlsdGVyLmFyZ3MgPSB0b2tlbnMubGVuZ3RoID4gMSA/IHRva2Vucy5zbGljZSgxKSA6IG51bGxcbiAgfVxuICBpZiAoZmlsdGVyKSB7XG4gICAgKGRpci5maWx0ZXJzID0gZGlyLmZpbHRlcnMgfHwgW10pLnB1c2goZmlsdGVyKVxuICB9XG4gIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG59XG5cbi8qKlxuICogUGFyc2UgYSBkaXJlY3RpdmUgc3RyaW5nIGludG8gYW4gQXJyYXkgb2YgQVNULWxpa2VcbiAqIG9iamVjdHMgcmVwcmVzZW50aW5nIGRpcmVjdGl2ZXMuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBcImNsaWNrOiBhID0gYSArIDEgfCB1cHBlcmNhc2VcIiB3aWxsIHlpZWxkOlxuICoge1xuICogICBhcmc6ICdjbGljaycsXG4gKiAgIGV4cHJlc3Npb246ICdhID0gYSArIDEnLFxuICogICBmaWx0ZXJzOiBbXG4gKiAgICAgeyBuYW1lOiAndXBwZXJjYXNlJywgYXJnczogbnVsbCB9XG4gKiAgIF1cbiAqIH1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAocykge1xuXG4gIHZhciBoaXQgPSBjYWNoZS5nZXQocylcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIC8vIHJlc2V0IHBhcnNlciBzdGF0ZVxuICBzdHIgPSBzXG4gIGluU2luZ2xlID0gaW5Eb3VibGUgPSBmYWxzZVxuICBjdXJseSA9IHNxdWFyZSA9IHBhcmVuID0gYmVnaW4gPSBhcmdJbmRleCA9IDBcbiAgbGFzdEZpbHRlckluZGV4ID0gMFxuICBkaXJzID0gW11cbiAgZGlyID0ge31cbiAgYXJnID0gbnVsbFxuXG4gIGZvciAoaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGluU2luZ2xlKSB7XG4gICAgICAvLyBjaGVjayBzaW5nbGUgcXVvdGVcbiAgICAgIGlmIChjID09PSAweDI3KSBpblNpbmdsZSA9ICFpblNpbmdsZVxuICAgIH0gZWxzZSBpZiAoaW5Eb3VibGUpIHtcbiAgICAgIC8vIGNoZWNrIGRvdWJsZSBxdW90ZVxuICAgICAgaWYgKGMgPT09IDB4MjIpIGluRG91YmxlID0gIWluRG91YmxlXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4MkMgJiYgLy8gY29tbWFcbiAgICAgICFwYXJlbiAmJiAhY3VybHkgJiYgIXNxdWFyZVxuICAgICkge1xuICAgICAgLy8gcmVhY2hlZCB0aGUgZW5kIG9mIGEgZGlyZWN0aXZlXG4gICAgICBwdXNoRGlyKClcbiAgICAgIC8vIHJlc2V0ICYgc2tpcCB0aGUgY29tbWFcbiAgICAgIGRpciA9IHt9XG4gICAgICBiZWdpbiA9IGFyZ0luZGV4ID0gbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHgzQSAmJiAvLyBjb2xvblxuICAgICAgIWRpci5leHByZXNzaW9uICYmXG4gICAgICAhZGlyLmFyZ1xuICAgICkge1xuICAgICAgLy8gYXJndW1lbnRcbiAgICAgIGFyZyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAvLyB0ZXN0IGZvciB2YWxpZCBhcmd1bWVudCBoZXJlXG4gICAgICAvLyBzaW5jZSB3ZSBtYXkgaGF2ZSBjYXVnaHQgc3R1ZmYgbGlrZSBmaXJzdCBoYWxmIG9mXG4gICAgICAvLyBhbiBvYmplY3QgbGl0ZXJhbCBvciBhIHRlcm5hcnkgZXhwcmVzc2lvbi5cbiAgICAgIGlmIChhcmdSRS50ZXN0KGFyZykpIHtcbiAgICAgICAgYXJnSW5kZXggPSBpICsgMVxuICAgICAgICBkaXIuYXJnID0gXy5zdHJpcFF1b3RlcyhhcmcpIHx8IGFyZ1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDdDICYmIC8vIHBpcGVcbiAgICAgIHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAhPT0gMHg3QyAmJlxuICAgICAgc3RyLmNoYXJDb2RlQXQoaSAtIDEpICE9PSAweDdDXG4gICAgKSB7XG4gICAgICBpZiAoZGlyLmV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBleHByZXNzaW9uXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKGFyZ0luZGV4LCBpKS50cmltKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFscmVhZHkgaGFzIGZpbHRlclxuICAgICAgICBwdXNoRmlsdGVyKClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgMHgyMjogaW5Eb3VibGUgPSB0cnVlOyBicmVhayAvLyBcIlxuICAgICAgICBjYXNlIDB4Mjc6IGluU2luZ2xlID0gdHJ1ZTsgYnJlYWsgLy8gJ1xuICAgICAgICBjYXNlIDB4Mjg6IHBhcmVuKys7IGJyZWFrICAgICAgICAgLy8gKFxuICAgICAgICBjYXNlIDB4Mjk6IHBhcmVuLS07IGJyZWFrICAgICAgICAgLy8gKVxuICAgICAgICBjYXNlIDB4NUI6IHNxdWFyZSsrOyBicmVhayAgICAgICAgLy8gW1xuICAgICAgICBjYXNlIDB4NUQ6IHNxdWFyZS0tOyBicmVhayAgICAgICAgLy8gXVxuICAgICAgICBjYXNlIDB4N0I6IGN1cmx5Kys7IGJyZWFrICAgICAgICAgLy8ge1xuICAgICAgICBjYXNlIDB4N0Q6IGN1cmx5LS07IGJyZWFrICAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpID09PSAwIHx8IGJlZ2luICE9PSBpKSB7XG4gICAgcHVzaERpcigpXG4gIH1cblxuICBjYWNoZS5wdXQocywgZGlycylcbiAgcmV0dXJuIGRpcnNcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFBhdGggPSByZXF1aXJlKCcuL3BhdGgnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIGV4cHJlc3Npb25DYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxuXG52YXIgYWxsb3dlZEtleXdvcmRzID1cbiAgJ01hdGgsRGF0ZSx0aGlzLHRydWUsZmFsc2UsbnVsbCx1bmRlZmluZWQsSW5maW5pdHksTmFOLCcgK1xuICAnaXNOYU4saXNGaW5pdGUsZGVjb2RlVVJJLGRlY29kZVVSSUNvbXBvbmVudCxlbmNvZGVVUkksJyArXG4gICdlbmNvZGVVUklDb21wb25lbnQscGFyc2VJbnQscGFyc2VGbG9hdCdcbnZhciBhbGxvd2VkS2V5d29yZHNSRSA9XG4gIG5ldyBSZWdFeHAoJ14oJyArIGFsbG93ZWRLZXl3b3Jkcy5yZXBsYWNlKC8sL2csICdcXFxcYnwnKSArICdcXFxcYiknKVxuXG4vLyBrZXl3b3JkcyB0aGF0IGRvbid0IG1ha2Ugc2Vuc2UgaW5zaWRlIGV4cHJlc3Npb25zXG52YXIgaW1wcm9wZXJLZXl3b3JkcyA9XG4gICdicmVhayxjYXNlLGNsYXNzLGNhdGNoLGNvbnN0LGNvbnRpbnVlLGRlYnVnZ2VyLGRlZmF1bHQsJyArXG4gICdkZWxldGUsZG8sZWxzZSxleHBvcnQsZXh0ZW5kcyxmaW5hbGx5LGZvcixmdW5jdGlvbixpZiwnICtcbiAgJ2ltcG9ydCxpbixpbnN0YW5jZW9mLGxldCxyZXR1cm4sc3VwZXIsc3dpdGNoLHRocm93LHRyeSwnICtcbiAgJ3Zhcix3aGlsZSx3aXRoLHlpZWxkLGVudW0sYXdhaXQsaW1wbGVtZW50cyxwYWNrYWdlLCcgK1xuICAncHJvY3RlY3RlZCxzdGF0aWMsaW50ZXJmYWNlLHByaXZhdGUscHVibGljJ1xudmFyIGltcHJvcGVyS2V5d29yZHNSRSA9XG4gIG5ldyBSZWdFeHAoJ14oJyArIGltcHJvcGVyS2V5d29yZHMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8JykgKyAnXFxcXGIpJylcblxudmFyIHdzUkUgPSAvXFxzL2dcbnZhciBuZXdsaW5lUkUgPSAvXFxuL2dcbnZhciBzYXZlUkUgPSAvW1xceyxdXFxzKltcXHdcXCRfXStcXHMqOnwoJ1teJ10qJ3xcIlteXCJdKlwiKXxuZXcgfHR5cGVvZiB8dm9pZCAvZ1xudmFyIHJlc3RvcmVSRSA9IC9cIihcXGQrKVwiL2dcbnZhciBwYXRoVGVzdFJFID0gL15bQS1aYS16XyRdW1xcdyRdKihcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFsnLio/J1xcXXxcXFtcIi4qP1wiXFxdfFxcW1xcZCtcXF0pKiQvXG52YXIgcGF0aFJlcGxhY2VSRSA9IC9bXlxcdyRcXC5dKFtBLVphLXpfJF1bXFx3JF0qKFxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXFxdfFxcW1wiLio/XCJcXF0pKikvZ1xudmFyIGJvb2xlYW5MaXRlcmFsUkUgPSAvXih0cnVlfGZhbHNlKSQvXG5cbi8qKlxuICogU2F2ZSAvIFJld3JpdGUgLyBSZXN0b3JlXG4gKlxuICogV2hlbiByZXdyaXRpbmcgcGF0aHMgZm91bmQgaW4gYW4gZXhwcmVzc2lvbiwgaXQgaXNcbiAqIHBvc3NpYmxlIGZvciB0aGUgc2FtZSBsZXR0ZXIgc2VxdWVuY2VzIHRvIGJlIGZvdW5kIGluXG4gKiBzdHJpbmdzIGFuZCBPYmplY3QgbGl0ZXJhbCBwcm9wZXJ0eSBrZXlzLiBUaGVyZWZvcmUgd2VcbiAqIHJlbW92ZSBhbmQgc3RvcmUgdGhlc2UgcGFydHMgaW4gYSB0ZW1wb3JhcnkgYXJyYXksIGFuZFxuICogcmVzdG9yZSB0aGVtIGFmdGVyIHRoZSBwYXRoIHJld3JpdGUuXG4gKi9cblxudmFyIHNhdmVkID0gW11cblxuLyoqXG4gKiBTYXZlIHJlcGxhY2VyXG4gKlxuICogVGhlIHNhdmUgcmVnZXggY2FuIG1hdGNoIHR3byBwb3NzaWJsZSBjYXNlczpcbiAqIDEuIEFuIG9wZW5pbmcgb2JqZWN0IGxpdGVyYWxcbiAqIDIuIEEgc3RyaW5nXG4gKiBJZiBtYXRjaGVkIGFzIGEgcGxhaW4gc3RyaW5nLCB3ZSBuZWVkIHRvIGVzY2FwZSBpdHNcbiAqIG5ld2xpbmVzLCBzaW5jZSB0aGUgc3RyaW5nIG5lZWRzIHRvIGJlIHByZXNlcnZlZCB3aGVuXG4gKiBnZW5lcmF0aW5nIHRoZSBmdW5jdGlvbiBib2R5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpc1N0cmluZyAtIHN0ciBpZiBtYXRjaGVkIGFzIGEgc3RyaW5nXG4gKiBAcmV0dXJuIHtTdHJpbmd9IC0gcGxhY2Vob2xkZXIgd2l0aCBpbmRleFxuICovXG5cbmZ1bmN0aW9uIHNhdmUgKHN0ciwgaXNTdHJpbmcpIHtcbiAgdmFyIGkgPSBzYXZlZC5sZW5ndGhcbiAgc2F2ZWRbaV0gPSBpc1N0cmluZ1xuICAgID8gc3RyLnJlcGxhY2UobmV3bGluZVJFLCAnXFxcXG4nKVxuICAgIDogc3RyXG4gIHJldHVybiAnXCInICsgaSArICdcIidcbn1cblxuLyoqXG4gKiBQYXRoIHJld3JpdGUgcmVwbGFjZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcmF3XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gcmV3cml0ZSAocmF3KSB7XG4gIHZhciBjID0gcmF3LmNoYXJBdCgwKVxuICB2YXIgcGF0aCA9IHJhdy5zbGljZSgxKVxuICBpZiAoYWxsb3dlZEtleXdvcmRzUkUudGVzdChwYXRoKSkge1xuICAgIHJldHVybiByYXdcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcGF0aC5pbmRleE9mKCdcIicpID4gLTFcbiAgICAgID8gcGF0aC5yZXBsYWNlKHJlc3RvcmVSRSwgcmVzdG9yZSlcbiAgICAgIDogcGF0aFxuICAgIHJldHVybiBjICsgJ3Njb3BlLicgKyBwYXRoXG4gIH1cbn1cblxuLyoqXG4gKiBSZXN0b3JlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGkgLSBtYXRjaGVkIHNhdmUgaW5kZXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlIChzdHIsIGkpIHtcbiAgcmV0dXJuIHNhdmVkW2ldXG59XG5cbi8qKlxuICogUmV3cml0ZSBhbiBleHByZXNzaW9uLCBwcmVmaXhpbmcgYWxsIHBhdGggYWNjZXNzb3JzIHdpdGhcbiAqIGBzY29wZS5gIGFuZCBnZW5lcmF0ZSBnZXR0ZXIvc2V0dGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRTZXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVFeHBGbnMgKGV4cCwgbmVlZFNldCkge1xuICBpZiAoaW1wcm9wZXJLZXl3b3Jkc1JFLnRlc3QoZXhwKSkge1xuICAgIF8ud2FybihcbiAgICAgICdBdm9pZCB1c2luZyByZXNlcnZlZCBrZXl3b3JkcyBpbiBleHByZXNzaW9uOiAnXG4gICAgICArIGV4cFxuICAgIClcbiAgfVxuICAvLyByZXNldCBzdGF0ZVxuICBzYXZlZC5sZW5ndGggPSAwXG4gIC8vIHNhdmUgc3RyaW5ncyBhbmQgb2JqZWN0IGxpdGVyYWwga2V5c1xuICB2YXIgYm9keSA9IGV4cFxuICAgIC5yZXBsYWNlKHNhdmVSRSwgc2F2ZSlcbiAgICAucmVwbGFjZSh3c1JFLCAnJylcbiAgLy8gcmV3cml0ZSBhbGwgcGF0aHNcbiAgLy8gcGFkIDEgc3BhY2UgaGVyZSBiZWNhdWUgdGhlIHJlZ2V4IG1hdGNoZXMgMSBleHRyYSBjaGFyXG4gIGJvZHkgPSAoJyAnICsgYm9keSlcbiAgICAucmVwbGFjZShwYXRoUmVwbGFjZVJFLCByZXdyaXRlKVxuICAgIC5yZXBsYWNlKHJlc3RvcmVSRSwgcmVzdG9yZSlcbiAgdmFyIGdldHRlciA9IG1ha2VHZXR0ZXIoYm9keSlcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiB7XG4gICAgICBnZXQ6IGdldHRlcixcbiAgICAgIGJvZHk6IGJvZHksXG4gICAgICBzZXQ6IG5lZWRTZXRcbiAgICAgICAgPyBtYWtlU2V0dGVyKGJvZHkpXG4gICAgICAgIDogbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgZ2V0dGVyIHNldHRlcnMgZm9yIGEgc2ltcGxlIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVBhdGhGbnMgKGV4cCkge1xuICB2YXIgZ2V0dGVyLCBwYXRoXG4gIGlmIChleHAuaW5kZXhPZignWycpIDwgMCkge1xuICAgIC8vIHJlYWxseSBzaW1wbGUgcGF0aFxuICAgIHBhdGggPSBleHAuc3BsaXQoJy4nKVxuICAgIGdldHRlciA9IFBhdGguY29tcGlsZUdldHRlcihwYXRoKVxuICB9IGVsc2Uge1xuICAgIC8vIGRvIHRoZSByZWFsIHBhcnNpbmdcbiAgICBwYXRoID0gUGF0aC5wYXJzZShleHApXG4gICAgZ2V0dGVyID0gcGF0aC5nZXRcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldDogZ2V0dGVyLFxuICAgIC8vIGFsd2F5cyBnZW5lcmF0ZSBzZXR0ZXIgZm9yIHNpbXBsZSBwYXRoc1xuICAgIHNldDogZnVuY3Rpb24gKG9iaiwgdmFsKSB7XG4gICAgICBQYXRoLnNldChvYmosIHBhdGgsIHZhbClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZCBhIGdldHRlciBmdW5jdGlvbi4gUmVxdWlyZXMgZXZhbC5cbiAqXG4gKiBXZSBpc29sYXRlIHRoZSB0cnkvY2F0Y2ggc28gaXQgZG9lc24ndCBhZmZlY3QgdGhlXG4gKiBvcHRpbWl6YXRpb24gb2YgdGhlIHBhcnNlIGZ1bmN0aW9uIHdoZW4gaXQgaXMgbm90IGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIG1ha2VHZXR0ZXIgKGJvZHkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdzY29wZScsICdyZXR1cm4gJyArIGJvZHkgKyAnOycpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfLndhcm4oXG4gICAgICAnSW52YWxpZCBleHByZXNzaW9uLiAnICtcbiAgICAgICdHZW5lcmF0ZWQgZnVuY3Rpb24gYm9keTogJyArIGJvZHlcbiAgICApXG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZCBhIHNldHRlciBmdW5jdGlvbi5cbiAqXG4gKiBUaGlzIGlzIG9ubHkgbmVlZGVkIGluIHJhcmUgc2l0dWF0aW9ucyBsaWtlIFwiYVtiXVwiIHdoZXJlXG4gKiBhIHNldHRhYmxlIHBhdGggcmVxdWlyZXMgZHluYW1pYyBldmFsdWF0aW9uLlxuICpcbiAqIFRoaXMgc2V0dGVyIGZ1bmN0aW9uIG1heSB0aHJvdyBlcnJvciB3aGVuIGNhbGxlZCBpZiB0aGVcbiAqIGV4cHJlc3Npb24gYm9keSBpcyBub3QgYSB2YWxpZCBsZWZ0LWhhbmQgZXhwcmVzc2lvbiBpblxuICogYXNzaWdubWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIG1ha2VTZXR0ZXIgKGJvZHkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdzY29wZScsICd2YWx1ZScsIGJvZHkgKyAnPXZhbHVlOycpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfLndhcm4oJ0ludmFsaWQgc2V0dGVyIGZ1bmN0aW9uIGJvZHk6ICcgKyBib2R5KVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIHNldHRlciBleGlzdGVuY2Ugb24gYSBjYWNoZSBoaXQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGl0XG4gKi9cblxuZnVuY3Rpb24gY2hlY2tTZXR0ZXIgKGhpdCkge1xuICBpZiAoIWhpdC5zZXQpIHtcbiAgICBoaXQuc2V0ID0gbWFrZVNldHRlcihoaXQuYm9keSlcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIGFuIGV4cHJlc3Npb24gaW50byByZS13cml0dGVuIGdldHRlci9zZXR0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbmVlZFNldFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChleHAsIG5lZWRTZXQpIHtcbiAgZXhwID0gZXhwLnRyaW0oKVxuICAvLyB0cnkgY2FjaGVcbiAgdmFyIGhpdCA9IGV4cHJlc3Npb25DYWNoZS5nZXQoZXhwKVxuICBpZiAoaGl0KSB7XG4gICAgaWYgKG5lZWRTZXQpIHtcbiAgICAgIGNoZWNrU2V0dGVyKGhpdClcbiAgICB9XG4gICAgcmV0dXJuIGhpdFxuICB9XG4gIC8vIHdlIGRvIGEgc2ltcGxlIHBhdGggY2hlY2sgdG8gb3B0aW1pemUgZm9yIHRoZW0uXG4gIC8vIHRoZSBjaGVjayBmYWlscyB2YWxpZCBwYXRocyB3aXRoIHVudXNhbCB3aGl0ZXNwYWNlcyxcbiAgLy8gYnV0IHRoYXQncyB0b28gcmFyZSBhbmQgd2UgZG9uJ3QgY2FyZS5cbiAgLy8gYWxzbyBza2lwIGJvb2xlYW4gbGl0ZXJhbHMgYW5kIHBhdGhzIHRoYXQgc3RhcnQgd2l0aFxuICAvLyBnbG9iYWwgXCJNYXRoXCJcbiAgdmFyIHJlcyA9XG4gICAgcGF0aFRlc3RSRS50ZXN0KGV4cCkgJiZcbiAgICAvLyBkb24ndCB0cmVhdCB0cnVlL2ZhbHNlIGFzIHBhdGhzXG4gICAgIWJvb2xlYW5MaXRlcmFsUkUudGVzdChleHApICYmXG4gICAgLy8gTWF0aCBjb25zdGFudHMgZS5nLiBNYXRoLlBJLCBNYXRoLkUgZXRjLlxuICAgIGV4cC5zbGljZSgwLCA1KSAhPT0gJ01hdGguJ1xuICAgICAgPyBjb21waWxlUGF0aEZucyhleHApXG4gICAgICA6IGNvbXBpbGVFeHBGbnMoZXhwLCBuZWVkU2V0KVxuICBleHByZXNzaW9uQ2FjaGUucHV0KGV4cCwgcmVzKVxuICByZXR1cm4gcmVzXG59XG5cbi8vIEV4cG9ydCB0aGUgcGF0aFJlZ2V4IGZvciBleHRlcm5hbCB1c2VcbmV4cG9ydHMucGF0aFRlc3RSRSA9IHBhdGhUZXN0UkUiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIHBhdGhDYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxudmFyIGlkZW50UkUgPSAvXlskX2EtekEtWl0rW1xcdyRdKiQvXG5cbi8qKlxuICogUGF0aC1wYXJzaW5nIGFsZ29yaXRobSBzY29vcGVkIGZyb20gUG9seW1lci9vYnNlcnZlLWpzXG4gKi9cblxudmFyIHBhdGhTdGF0ZU1hY2hpbmUgPSB7XG4gICdiZWZvcmVQYXRoJzoge1xuICAgICd3cyc6IFsnYmVmb3JlUGF0aCddLFxuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCddXG4gIH0sXG5cbiAgJ2luUGF0aCc6IHtcbiAgICAnd3MnOiBbJ2luUGF0aCddLFxuICAgICcuJzogWydiZWZvcmVJZGVudCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJ11cbiAgfSxcblxuICAnYmVmb3JlSWRlbnQnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVJZGVudCddLFxuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXVxuICB9LFxuXG4gICdpbklkZW50Jzoge1xuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnMCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICd3cyc6IFsnaW5QYXRoJywgJ3B1c2gnXSxcbiAgICAnLic6IFsnYmVmb3JlSWRlbnQnLCAncHVzaCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50JywgJ3B1c2gnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2JlZm9yZUVsZW1lbnQnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJzAnOiBbJ2FmdGVyWmVybycsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgIFwiJ1wiOiBbJ2luU2luZ2xlUXVvdGUnLCAnYXBwZW5kJywgJyddLFxuICAgICdcIic6IFsnaW5Eb3VibGVRdW90ZScsICdhcHBlbmQnLCAnJ11cbiAgfSxcblxuICAnYWZ0ZXJaZXJvJzoge1xuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50JywgJ3B1c2gnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdpbkluZGV4Jzoge1xuICAgICcwJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdpblNpbmdsZVF1b3RlJzoge1xuICAgIFwiJ1wiOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICdlb2YnOiAnZXJyb3InLFxuICAgICdlbHNlJzogWydpblNpbmdsZVF1b3RlJywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2luRG91YmxlUXVvdGUnOiB7XG4gICAgJ1wiJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnZW9mJzogJ2Vycm9yJyxcbiAgICAnZWxzZSc6IFsnaW5Eb3VibGVRdW90ZScsICdhcHBlbmQnXVxuICB9LFxuXG4gICdhZnRlckVsZW1lbnQnOiB7XG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIHR5cGUgb2YgYSBjaGFyYWN0ZXIgaW4gYSBrZXlwYXRoLlxuICpcbiAqIEBwYXJhbSB7Q2hhcn0gY2hhclxuICogQHJldHVybiB7U3RyaW5nfSB0eXBlXG4gKi9cblxuZnVuY3Rpb24gZ2V0UGF0aENoYXJUeXBlIChjaGFyKSB7XG4gIGlmIChjaGFyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJ2VvZidcbiAgfVxuXG4gIHZhciBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApXG5cbiAgc3dpdGNoKGNvZGUpIHtcbiAgICBjYXNlIDB4NUI6IC8vIFtcbiAgICBjYXNlIDB4NUQ6IC8vIF1cbiAgICBjYXNlIDB4MkU6IC8vIC5cbiAgICBjYXNlIDB4MjI6IC8vIFwiXG4gICAgY2FzZSAweDI3OiAvLyAnXG4gICAgY2FzZSAweDMwOiAvLyAwXG4gICAgICByZXR1cm4gY2hhclxuXG4gICAgY2FzZSAweDVGOiAvLyBfXG4gICAgY2FzZSAweDI0OiAvLyAkXG4gICAgICByZXR1cm4gJ2lkZW50J1xuXG4gICAgY2FzZSAweDIwOiAvLyBTcGFjZVxuICAgIGNhc2UgMHgwOTogLy8gVGFiXG4gICAgY2FzZSAweDBBOiAvLyBOZXdsaW5lXG4gICAgY2FzZSAweDBEOiAvLyBSZXR1cm5cbiAgICBjYXNlIDB4QTA6ICAvLyBOby1icmVhayBzcGFjZVxuICAgIGNhc2UgMHhGRUZGOiAgLy8gQnl0ZSBPcmRlciBNYXJrXG4gICAgY2FzZSAweDIwMjg6ICAvLyBMaW5lIFNlcGFyYXRvclxuICAgIGNhc2UgMHgyMDI5OiAgLy8gUGFyYWdyYXBoIFNlcGFyYXRvclxuICAgICAgcmV0dXJuICd3cydcbiAgfVxuXG4gIC8vIGEteiwgQS1aXG4gIGlmICgoMHg2MSA8PSBjb2RlICYmIGNvZGUgPD0gMHg3QSkgfHxcbiAgICAgICgweDQxIDw9IGNvZGUgJiYgY29kZSA8PSAweDVBKSkge1xuICAgIHJldHVybiAnaWRlbnQnXG4gIH1cblxuICAvLyAxLTlcbiAgaWYgKDB4MzEgPD0gY29kZSAmJiBjb2RlIDw9IDB4MzkpIHtcbiAgICByZXR1cm4gJ251bWJlcidcbiAgfVxuXG4gIHJldHVybiAnZWxzZSdcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHN0cmluZyBwYXRoIGludG8gYW4gYXJyYXkgb2Ygc2VnbWVudHNcbiAqIFRvZG8gaW1wbGVtZW50IGNhY2hlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge0FycmF5fHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZVBhdGggKHBhdGgpIHtcbiAgdmFyIGtleXMgPSBbXVxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgbW9kZSA9ICdiZWZvcmVQYXRoJ1xuICB2YXIgYywgbmV3Q2hhciwga2V5LCB0eXBlLCB0cmFuc2l0aW9uLCBhY3Rpb24sIHR5cGVNYXBcblxuICB2YXIgYWN0aW9ucyA9IHtcbiAgICBwdXNoOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgICBrZXkgPSB1bmRlZmluZWRcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5ID0gbmV3Q2hhclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAga2V5ICs9IG5ld0NoYXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYXliZVVuZXNjYXBlUXVvdGUgKCkge1xuICAgIHZhciBuZXh0Q2hhciA9IHBhdGhbaW5kZXggKyAxXVxuICAgIGlmICgobW9kZSA9PT0gJ2luU2luZ2xlUXVvdGUnICYmIG5leHRDaGFyID09PSBcIidcIikgfHxcbiAgICAgICAgKG1vZGUgPT09ICdpbkRvdWJsZVF1b3RlJyAmJiBuZXh0Q2hhciA9PT0gJ1wiJykpIHtcbiAgICAgIGluZGV4KytcbiAgICAgIG5ld0NoYXIgPSBuZXh0Q2hhclxuICAgICAgYWN0aW9ucy5hcHBlbmQoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICB3aGlsZSAobW9kZSkge1xuICAgIGluZGV4KytcbiAgICBjID0gcGF0aFtpbmRleF1cblxuICAgIGlmIChjID09PSAnXFxcXCcgJiYgbWF5YmVVbmVzY2FwZVF1b3RlKCkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdHlwZSA9IGdldFBhdGhDaGFyVHlwZShjKVxuICAgIHR5cGVNYXAgPSBwYXRoU3RhdGVNYWNoaW5lW21vZGVdXG4gICAgdHJhbnNpdGlvbiA9IHR5cGVNYXBbdHlwZV0gfHwgdHlwZU1hcFsnZWxzZSddIHx8ICdlcnJvcidcblxuICAgIGlmICh0cmFuc2l0aW9uID09PSAnZXJyb3InKSB7XG4gICAgICByZXR1cm4gLy8gcGFyc2UgZXJyb3JcbiAgICB9XG5cbiAgICBtb2RlID0gdHJhbnNpdGlvblswXVxuICAgIGFjdGlvbiA9IGFjdGlvbnNbdHJhbnNpdGlvblsxXV0gfHwgbm9vcFxuICAgIG5ld0NoYXIgPSB0cmFuc2l0aW9uWzJdID09PSB1bmRlZmluZWRcbiAgICAgID8gY1xuICAgICAgOiB0cmFuc2l0aW9uWzJdXG4gICAgYWN0aW9uKClcblxuICAgIGlmIChtb2RlID09PSAnYWZ0ZXJQYXRoJykge1xuICAgICAgcmV0dXJuIGtleXNcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBhY2Nlc3NvciBzZWdtZW50IGJhc2VkIG9uIGl0cyB0eXBlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QWNjZXNzb3Ioa2V5KSB7XG4gIGlmIChpZGVudFJFLnRlc3Qoa2V5KSkgeyAvLyBpZGVudGlmaWVyXG4gICAgcmV0dXJuICcuJyArIGtleVxuICB9IGVsc2UgaWYgKCtrZXkgPT09IGtleSA+Pj4gMCkgeyAvLyBicmFja2V0IGluZGV4XG4gICAgcmV0dXJuICdbJyArIGtleSArICddJ1xuICB9IGVsc2UgeyAvLyBicmFja2V0IHN0cmluZ1xuICAgIHJldHVybiAnW1wiJyArIGtleS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCJdJ1xuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZXMgYSBnZXR0ZXIgZnVuY3Rpb24gd2l0aCBhIGZpeGVkIHBhdGguXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGF0aFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5jb21waWxlR2V0dGVyID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGJvZHkgPSAncmV0dXJuIG8nICsgcGF0aC5tYXAoZm9ybWF0QWNjZXNzb3IpLmpvaW4oJycpXG4gIHJldHVybiBuZXcgRnVuY3Rpb24oJ28nLCBib2R5KVxufVxuXG4vKipcbiAqIEV4dGVybmFsIHBhcnNlIHRoYXQgY2hlY2sgZm9yIGEgY2FjaGUgaGl0IGZpcnN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge0FycmF5fHVuZGVmaW5lZH1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGhpdCA9IHBhdGhDYWNoZS5nZXQocGF0aClcbiAgaWYgKCFoaXQpIHtcbiAgICBoaXQgPSBwYXJzZVBhdGgocGF0aClcbiAgICBpZiAoaGl0KSB7XG4gICAgICBoaXQuZ2V0ID0gZXhwb3J0cy5jb21waWxlR2V0dGVyKGhpdClcbiAgICAgIHBhdGhDYWNoZS5wdXQocGF0aCwgaGl0KVxuICAgIH1cbiAgfVxuICByZXR1cm4gaGl0XG59XG5cbi8qKlxuICogR2V0IGZyb20gYW4gb2JqZWN0IGZyb20gYSBwYXRoIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKi9cblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoKSB7XG4gIHBhdGggPSBleHBvcnRzLnBhcnNlKHBhdGgpXG4gIGlmIChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZ2V0KG9iailcbiAgfVxufVxuXG4vKipcbiAqIFNldCBvbiBhbiBvYmplY3QgZnJvbSBhIHBhdGhcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZyB8IEFycmF5fSBwYXRoXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuc2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXRoID0gZXhwb3J0cy5wYXJzZShwYXRoKVxuICB9XG4gIGlmICghcGF0aCB8fCAhXy5pc09iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgdmFyIGxhc3QsIGtleVxuICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgIGxhc3QgPSBvYmpcbiAgICBrZXkgPSBwYXRoW2ldXG4gICAgb2JqID0gb2JqW2tleV1cbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkge1xuICAgICAgb2JqID0ge31cbiAgICAgIGxhc3QuJGFkZChrZXksIG9iailcbiAgICB9XG4gIH1cbiAga2V5ID0gcGF0aFtpXVxuICBpZiAoa2V5IGluIG9iaikge1xuICAgIG9ialtrZXldID0gdmFsXG4gIH0gZWxzZSB7XG4gICAgb2JqLiRhZGQoa2V5LCB2YWwpXG4gIH1cbiAgcmV0dXJuIHRydWVcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIHRlbXBsYXRlQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBpZFNlbGVjdG9yQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcblxudmFyIG1hcCA9IHtcbiAgX2RlZmF1bHQgOiBbMCwgJycsICcnXSxcbiAgbGVnZW5kICAgOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgdHIgICAgICAgOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgY29sICAgICAgOiBbXG4gICAgMixcbiAgICAnPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD4nLFxuICAgICc8L2NvbGdyb3VwPjwvdGFibGU+J1xuICBdXG59XG5cbm1hcC50ZCA9XG5tYXAudGggPSBbXG4gIDMsXG4gICc8dGFibGU+PHRib2R5Pjx0cj4nLFxuICAnPC90cj48L3Rib2R5PjwvdGFibGU+J1xuXVxuXG5tYXAub3B0aW9uID1cbm1hcC5vcHRncm91cCA9IFtcbiAgMSxcbiAgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsXG4gICc8L3NlbGVjdD4nXG5dXG5cbm1hcC50aGVhZCA9XG5tYXAudGJvZHkgPVxubWFwLmNvbGdyb3VwID1cbm1hcC5jYXB0aW9uID1cbm1hcC50Zm9vdCA9IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddXG5cbm1hcC5nID1cbm1hcC5kZWZzID1cbm1hcC5zeW1ib2wgPVxubWFwLnVzZSA9XG5tYXAuaW1hZ2UgPVxubWFwLnRleHQgPVxubWFwLmNpcmNsZSA9XG5tYXAuZWxsaXBzZSA9XG5tYXAubGluZSA9XG5tYXAucGF0aCA9XG5tYXAucG9seWdvbiA9XG5tYXAucG9seWxpbmUgPVxubWFwLnJlY3QgPSBbXG4gIDEsXG4gICc8c3ZnICcgK1xuICAgICd4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgJyArXG4gICAgJ3htbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiICcgK1xuICAgICd4bWxuczpldj1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEveG1sLWV2ZW50c1wiJyArXG4gICAgJ3ZlcnNpb249XCIxLjFcIj4nLFxuICAnPC9zdmc+J1xuXVxuXG52YXIgdGFnUkUgPSAvPChbXFx3Ol0rKS9cbnZhciBlbnRpdHlSRSA9IC8mXFx3KzsvXG5cbi8qKlxuICogQ29udmVydCBhIHN0cmluZyB0ZW1wbGF0ZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKiBEZXRlcm1pbmVzIGNvcnJlY3Qgd3JhcHBpbmcgYnkgdGFnIHR5cGVzLiBXcmFwcGluZ1xuICogc3RyYXRlZ3kgZm91bmQgaW4galF1ZXJ5ICYgY29tcG9uZW50L2RvbWlmeS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGVTdHJpbmdcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gc3RyaW5nVG9GcmFnbWVudCAodGVtcGxhdGVTdHJpbmcpIHtcbiAgLy8gdHJ5IGEgY2FjaGUgaGl0IGZpcnN0XG4gIHZhciBoaXQgPSB0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZVN0cmluZylcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciB0YWdNYXRjaCA9IHRlbXBsYXRlU3RyaW5nLm1hdGNoKHRhZ1JFKVxuICB2YXIgZW50aXR5TWF0Y2ggPSBlbnRpdHlSRS50ZXN0KHRlbXBsYXRlU3RyaW5nKVxuXG4gIGlmICghdGFnTWF0Y2ggJiYgIWVudGl0eU1hdGNoKSB7XG4gICAgLy8gdGV4dCBvbmx5LCByZXR1cm4gYSBzaW5nbGUgdGV4dCBub2RlLlxuICAgIGZyYWcuYXBwZW5kQ2hpbGQoXG4gICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZW1wbGF0ZVN0cmluZylcbiAgICApXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgdGFnICAgID0gdGFnTWF0Y2ggJiYgdGFnTWF0Y2hbMV1cbiAgICB2YXIgd3JhcCAgID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0XG4gICAgdmFyIGRlcHRoICA9IHdyYXBbMF1cbiAgICB2YXIgcHJlZml4ID0gd3JhcFsxXVxuICAgIHZhciBzdWZmaXggPSB3cmFwWzJdXG4gICAgdmFyIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBub2RlLmlubmVySFRNTCA9IHByZWZpeCArIHRlbXBsYXRlU3RyaW5nLnRyaW0oKSArIHN1ZmZpeFxuICAgIHdoaWxlIChkZXB0aC0tKSB7XG4gICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGRcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRcbiAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgd2hpbGUgKGNoaWxkID0gbm9kZS5maXJzdENoaWxkKSB7XG4gICAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHRlbXBsYXRlQ2FjaGUucHV0KHRlbXBsYXRlU3RyaW5nLCBmcmFnKVxuICByZXR1cm4gZnJhZ1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSB0ZW1wbGF0ZSBub2RlIHRvIGEgRG9jdW1lbnRGcmFnbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gbm9kZVRvRnJhZ21lbnQgKG5vZGUpIHtcbiAgdmFyIHRhZyA9IG5vZGUudGFnTmFtZVxuICAvLyBpZiBpdHMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LFxuICAvLyBpdHMgY29udGVudCBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQuXG4gIGlmIChcbiAgICB0YWcgPT09ICdURU1QTEFURScgJiZcbiAgICBub2RlLmNvbnRlbnQgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50XG4gICkge1xuICAgIHJldHVybiBub2RlLmNvbnRlbnRcbiAgfVxuICAvLyBzY3JpcHQgdGVtcGxhdGVcbiAgaWYgKHRhZyA9PT0gJ1NDUklQVCcpIHtcbiAgICByZXR1cm4gc3RyaW5nVG9GcmFnbWVudChub2RlLnRleHRDb250ZW50KVxuICB9XG4gIC8vIG5vcm1hbCBub2RlLCBjbG9uZSBpdCB0byBhdm9pZCBtdXRhdGluZyB0aGUgb3JpZ2luYWxcbiAgdmFyIGNsb25lID0gZXhwb3J0cy5jbG9uZShub2RlKVxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgY2hpbGRcbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICB3aGlsZSAoY2hpbGQgPSBjbG9uZS5maXJzdENoaWxkKSB7XG4gICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgfVxuICByZXR1cm4gZnJhZ1xufVxuXG4vLyBUZXN0IGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIFNhZmFyaSB0ZW1wbGF0ZSBjbG9uaW5nIGJ1Z1xuLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNzc1NVxudmFyIGhhc0Jyb2tlblRlbXBsYXRlID0gXy5pbkJyb3dzZXJcbiAgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYS5pbm5lckhUTUwgPSAnPHRlbXBsYXRlPjE8L3RlbXBsYXRlPidcbiAgICAgIHJldHVybiAhYS5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RDaGlsZC5pbm5lckhUTUxcbiAgICB9KSgpXG4gIDogZmFsc2VcblxuLy8gVGVzdCBmb3IgSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBjbG9uZSBidWdcbnZhciBoYXNUZXh0YXJlYUNsb25lQnVnID0gXy5pbkJyb3dzZXJcbiAgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgICB0LnBsYWNlaG9sZGVyID0gJ3QnXG4gICAgICByZXR1cm4gdC5jbG9uZU5vZGUodHJ1ZSkudmFsdWUgPT09ICd0J1xuICAgIH0pKClcbiAgOiBmYWxzZVxuXG4vKipcbiAqIDEuIERlYWwgd2l0aCBTYWZhcmkgY2xvbmluZyBuZXN0ZWQgPHRlbXBsYXRlPiBidWcgYnlcbiAqICAgIG1hbnVhbGx5IGNsb25pbmcgYWxsIHRlbXBsYXRlIGluc3RhbmNlcy5cbiAqIDIuIERlYWwgd2l0aCBJRTEwLzExIHRleHRhcmVhIHBsYWNlaG9sZGVyIGJ1ZyBieSBzZXR0aW5nXG4gKiAgICB0aGUgY29ycmVjdCB2YWx1ZSBhZnRlciBjbG9uaW5nLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBub2RlXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciByZXMgPSBub2RlLmNsb25lTm9kZSh0cnVlKVxuICB2YXIgaSwgb3JpZ2luYWwsIGNsb25lZFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGhhc0Jyb2tlblRlbXBsYXRlKSB7XG4gICAgb3JpZ2luYWwgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylcbiAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICBjbG9uZWQgPSByZXMucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVxuICAgICAgaSA9IGNsb25lZC5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY2xvbmVkW2ldLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxuICAgICAgICAgIG9yaWdpbmFsW2ldLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICBjbG9uZWRbaV1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGhhc1RleHRhcmVhQ2xvbmVCdWcpIHtcbiAgICBpZiAobm9kZS50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICByZXMudmFsdWUgPSBub2RlLnZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdpbmFsID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpXG4gICAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICAgIGNsb25lZCA9IHJlcy5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpXG4gICAgICAgIGkgPSBjbG9uZWQubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICBjbG9uZWRbaV0udmFsdWUgPSBvcmlnaW5hbFtpXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24gYW5kIG5vcm1hbGl6ZXMgaXQgaW50byBhXG4gKiBhIERvY3VtZW50RnJhZ21lbnQgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIHBhcnRpYWwgb3IgYVxuICogaW5zdGFuY2UgdGVtcGxhdGUuXG4gKlxuICogQHBhcmFtIHsqfSB0ZW1wbGF0ZVxuICogICAgUG9zc2libGUgdmFsdWVzIGluY2x1ZGU6XG4gKiAgICAtIERvY3VtZW50RnJhZ21lbnQgb2JqZWN0XG4gKiAgICAtIE5vZGUgb2JqZWN0IG9mIHR5cGUgVGVtcGxhdGVcbiAqICAgIC0gaWQgc2VsZWN0b3I6ICcjc29tZS10ZW1wbGF0ZS1pZCdcbiAqICAgIC0gdGVtcGxhdGUgc3RyaW5nOiAnPGRpdj48c3Bhbj57e21zZ319PC9zcGFuPjwvZGl2PidcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvbmVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbm9TZWxlY3RvclxuICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudHx1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgY2xvbmUsIG5vU2VsZWN0b3IpIHtcbiAgdmFyIG5vZGUsIGZyYWdcblxuICAvLyBpZiB0aGUgdGVtcGxhdGUgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LFxuICAvLyBkbyBub3RoaW5nXG4gIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICByZXR1cm4gY2xvbmVcbiAgICAgID8gdGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpXG4gICAgICA6IHRlbXBsYXRlXG4gIH1cblxuICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgIC8vIGlkIHNlbGVjdG9yXG4gICAgaWYgKCFub1NlbGVjdG9yICYmIHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAvLyBpZCBzZWxlY3RvciBjYW4gYmUgY2FjaGVkIHRvb1xuICAgICAgZnJhZyA9IGlkU2VsZWN0b3JDYWNoZS5nZXQodGVtcGxhdGUpXG4gICAgICBpZiAoIWZyYWcpIHtcbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlLnNsaWNlKDEpKVxuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIGZyYWcgPSBub2RlVG9GcmFnbWVudChub2RlKVxuICAgICAgICAgIC8vIHNhdmUgc2VsZWN0b3IgdG8gY2FjaGVcbiAgICAgICAgICBpZFNlbGVjdG9yQ2FjaGUucHV0KHRlbXBsYXRlLCBmcmFnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vcm1hbCBzdHJpbmcgdGVtcGxhdGVcbiAgICAgIGZyYWcgPSBzdHJpbmdUb0ZyYWdtZW50KHRlbXBsYXRlKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0ZW1wbGF0ZS5ub2RlVHlwZSkge1xuICAgIC8vIGEgZGlyZWN0IG5vZGVcbiAgICBmcmFnID0gbm9kZVRvRnJhZ21lbnQodGVtcGxhdGUpXG4gIH1cblxuICByZXR1cm4gZnJhZyAmJiBjbG9uZVxuICAgID8gZXhwb3J0cy5jbG9uZShmcmFnKVxuICAgIDogZnJhZ1xufSIsInZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbnZhciByZWdleEVzY2FwZVJFID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZ1xudmFyIGNhY2hlLCB0YWdSRSwgaHRtbFJFLCBmaXJzdENoYXIsIGxhc3RDaGFyXG5cbi8qKlxuICogRXNjYXBlIGEgc3RyaW5nIHNvIGl0IGNhbiBiZSB1c2VkIGluIGEgUmVnRXhwXG4gKiBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXggKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhFc2NhcGVSRSwgJ1xcXFwkJicpXG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgaW50ZXJwb2xhdGlvbiB0YWcgcmVnZXguXG4gKlxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVSZWdleCAoKSB7XG4gIGNvbmZpZy5fZGVsaW1pdGVyc0NoYW5nZWQgPSBmYWxzZVxuICB2YXIgb3BlbiA9IGNvbmZpZy5kZWxpbWl0ZXJzWzBdXG4gIHZhciBjbG9zZSA9IGNvbmZpZy5kZWxpbWl0ZXJzWzFdXG4gIGZpcnN0Q2hhciA9IG9wZW4uY2hhckF0KDApXG4gIGxhc3RDaGFyID0gY2xvc2UuY2hhckF0KGNsb3NlLmxlbmd0aCAtIDEpXG4gIHZhciBmaXJzdENoYXJSRSA9IGVzY2FwZVJlZ2V4KGZpcnN0Q2hhcilcbiAgdmFyIGxhc3RDaGFyUkUgPSBlc2NhcGVSZWdleChsYXN0Q2hhcilcbiAgdmFyIG9wZW5SRSA9IGVzY2FwZVJlZ2V4KG9wZW4pXG4gIHZhciBjbG9zZVJFID0gZXNjYXBlUmVnZXgoY2xvc2UpXG4gIHRhZ1JFID0gbmV3IFJlZ0V4cChcbiAgICBmaXJzdENoYXJSRSArICc/JyArIG9wZW5SRSArXG4gICAgJyguKz8pJyArXG4gICAgY2xvc2VSRSArIGxhc3RDaGFyUkUgKyAnPycsXG4gICAgJ2cnXG4gIClcbiAgaHRtbFJFID0gbmV3IFJlZ0V4cChcbiAgICAnXicgKyBmaXJzdENoYXJSRSArIG9wZW5SRSArXG4gICAgJy4qJyArXG4gICAgY2xvc2VSRSArIGxhc3RDaGFyUkUgKyAnJCdcbiAgKVxuICAvLyByZXNldCBjYWNoZVxuICBjYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxufVxuXG4vKipcbiAqIFBhcnNlIGEgdGVtcGxhdGUgdGV4dCBzdHJpbmcgaW50byBhbiBhcnJheSBvZiB0b2tlbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD4gfCBudWxsfVxuICogICAgICAgICAgICAgICAtIHtTdHJpbmd9IHR5cGVcbiAqICAgICAgICAgICAgICAgLSB7U3RyaW5nfSB2YWx1ZVxuICogICAgICAgICAgICAgICAtIHtCb29sZWFufSBbaHRtbF1cbiAqICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW29uZVRpbWVdXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIGlmIChjb25maWcuX2RlbGltaXRlcnNDaGFuZ2VkKSB7XG4gICAgY29tcGlsZVJlZ2V4KClcbiAgfVxuICB2YXIgaGl0ID0gY2FjaGUuZ2V0KHRleHQpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cbiAgaWYgKCF0YWdSRS50ZXN0KHRleHQpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgdG9rZW5zID0gW11cbiAgdmFyIGxhc3RJbmRleCA9IHRhZ1JFLmxhc3RJbmRleCA9IDBcbiAgdmFyIG1hdGNoLCBpbmRleCwgdmFsdWUsIGZpcnN0LCBvbmVUaW1lLCBwYXJ0aWFsXG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgd2hpbGUgKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkge1xuICAgIGluZGV4ID0gbWF0Y2guaW5kZXhcbiAgICAvLyBwdXNoIHRleHQgdG9rZW5cbiAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IHRleHQuc2xpY2UobGFzdEluZGV4LCBpbmRleClcbiAgICAgIH0pXG4gICAgfVxuICAgIC8vIHRhZyB0b2tlblxuICAgIGZpcnN0ID0gbWF0Y2hbMV0uY2hhckNvZGVBdCgwKVxuICAgIG9uZVRpbWUgPSBmaXJzdCA9PT0gMHgyQSAvLyAqXG4gICAgcGFydGlhbCA9IGZpcnN0ID09PSAweDNFIC8vID5cbiAgICB2YWx1ZSA9IChvbmVUaW1lIHx8IHBhcnRpYWwpXG4gICAgICA/IG1hdGNoWzFdLnNsaWNlKDEpXG4gICAgICA6IG1hdGNoWzFdXG4gICAgdG9rZW5zLnB1c2goe1xuICAgICAgdGFnOiB0cnVlLFxuICAgICAgdmFsdWU6IHZhbHVlLnRyaW0oKSxcbiAgICAgIGh0bWw6IGh0bWxSRS50ZXN0KG1hdGNoWzBdKSxcbiAgICAgIG9uZVRpbWU6IG9uZVRpbWUsXG4gICAgICBwYXJ0aWFsOiBwYXJ0aWFsXG4gICAgfSlcbiAgICBsYXN0SW5kZXggPSBpbmRleCArIG1hdGNoWzBdLmxlbmd0aFxuICB9XG4gIGlmIChsYXN0SW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleClcbiAgICB9KVxuICB9XG4gIGNhY2hlLnB1dCh0ZXh0LCB0b2tlbnMpXG4gIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBsaXN0IG9mIHRva2VucyBpbnRvIGFuIGV4cHJlc3Npb24uXG4gKiBlLmcuIHRva2VucyBwYXJzZWQgZnJvbSAnYSB7e2J9fSBjJyBjYW4gYmUgc2VyaWFsaXplZFxuICogaW50byBvbmUgc2luZ2xlIGV4cHJlc3Npb24gYXMgJ1wiYSBcIiArIGIgKyBcIiBjXCInLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2Vuc1xuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnRva2Vuc1RvRXhwID0gZnVuY3Rpb24gKHRva2Vucywgdm0pIHtcbiAgcmV0dXJuIHRva2Vucy5sZW5ndGggPiAxXG4gICAgPyB0b2tlbnMubWFwKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICByZXR1cm4gZm9ybWF0VG9rZW4odG9rZW4sIHZtKVxuICAgICAgfSkuam9pbignKycpXG4gICAgOiBmb3JtYXRUb2tlbih0b2tlbnNbMF0sIHZtLCB0cnVlKVxufVxuXG4vKipcbiAqIEZvcm1hdCBhIHNpbmdsZSB0b2tlbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5cbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNpbmdsZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdFRva2VuICh0b2tlbiwgdm0sIHNpbmdsZSkge1xuICByZXR1cm4gdG9rZW4udGFnXG4gICAgPyB2bSAmJiB0b2tlbi5vbmVUaW1lXG4gICAgICA/ICdcIicgKyB2bS4kZXZhbCh0b2tlbi52YWx1ZSkgKyAnXCInXG4gICAgICA6IHNpbmdsZVxuICAgICAgICA/IHRva2VuLnZhbHVlXG4gICAgICAgIDogaW5saW5lRmlsdGVycyh0b2tlbi52YWx1ZSlcbiAgICA6ICdcIicgKyB0b2tlbi52YWx1ZSArICdcIidcbn1cblxuLyoqXG4gKiBGb3IgYW4gYXR0cmlidXRlIHdpdGggbXVsdGlwbGUgaW50ZXJwb2xhdGlvbiB0YWdzLFxuICogZS5nLiBhdHRyPVwic29tZS17e3RoaW5nIHwgZmlsdGVyfX1cIiwgaW4gb3JkZXIgdG8gY29tYmluZVxuICogdGhlIHdob2xlIHRoaW5nIGludG8gYSBzaW5nbGUgd2F0Y2hhYmxlIGV4cHJlc3Npb24sIHdlXG4gKiBoYXZlIHRvIGlubGluZSB0aG9zZSBmaWx0ZXJzLiBUaGlzIGZ1bmN0aW9uIGRvZXMgZXhhY3RseVxuICogdGhhdC4gVGhpcyBpcyBhIGJpdCBoYWNreSBidXQgaXQgYXZvaWRzIGhlYXZ5IGNoYW5nZXNcbiAqIHRvIGRpcmVjdGl2ZSBwYXJzZXIgYW5kIHdhdGNoZXIgbWVjaGFuaXNtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG52YXIgZmlsdGVyUkUgPSAvW158XVxcfFtefF0vXG5mdW5jdGlvbiBpbmxpbmVGaWx0ZXJzIChleHApIHtcbiAgaWYgKCFmaWx0ZXJSRS50ZXN0KGV4cCkpIHtcbiAgICByZXR1cm4gJygnICsgZXhwICsgJyknXG4gIH0gZWxzZSB7XG4gICAgdmFyIGRpciA9IGRpclBhcnNlci5wYXJzZShleHApWzBdXG4gICAgaWYgKCFkaXIuZmlsdGVycykge1xuICAgICAgcmV0dXJuICcoJyArIGV4cCArICcpJ1xuICAgIH0gZWxzZSB7XG4gICAgICBleHAgPSBkaXIuZXhwcmVzc2lvblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBkaXIuZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGZpbHRlciA9IGRpci5maWx0ZXJzW2ldXG4gICAgICAgIHZhciBhcmdzID0gZmlsdGVyLmFyZ3NcbiAgICAgICAgICA/ICcsXCInICsgZmlsdGVyLmFyZ3Muam9pbignXCIsXCInKSArICdcIidcbiAgICAgICAgICA6ICcnXG4gICAgICAgIGZpbHRlciA9ICd0aGlzLiRvcHRpb25zLmZpbHRlcnNbXCInICsgZmlsdGVyLm5hbWUgKyAnXCJdJ1xuICAgICAgICBleHAgPSAnKCcgKyBmaWx0ZXIgKyAnLnJlYWR8fCcgKyBmaWx0ZXIgKyAnKScgK1xuICAgICAgICAgICcuYXBwbHkodGhpcyxbJyArIGV4cCArIGFyZ3MgKyAnXSknXG4gICAgICB9XG4gICAgICByZXR1cm4gZXhwXG4gICAgfVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhZGRDbGFzcyA9IF8uYWRkQ2xhc3NcbnZhciByZW1vdmVDbGFzcyA9IF8ucmVtb3ZlQ2xhc3NcbnZhciB0cmFuc0R1cmF0aW9uUHJvcCA9IF8udHJhbnNpdGlvblByb3AgKyAnRHVyYXRpb24nXG52YXIgYW5pbUR1cmF0aW9uUHJvcCA9IF8uYW5pbWF0aW9uUHJvcCArICdEdXJhdGlvbidcblxudmFyIHF1ZXVlID0gW11cbnZhciBxdWV1ZWQgPSBmYWxzZVxuXG4vKipcbiAqIFB1c2ggYSBqb2IgaW50byB0aGUgdHJhbnNpdGlvbiBxdWV1ZSwgd2hpY2ggaXMgdG8gYmVcbiAqIGV4ZWN1dGVkIG9uIG5leHQgZnJhbWUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbCAgICAtIHRhcmdldCBlbGVtZW50XG4gKiBAcGFyYW0ge051bWJlcn0gZGlyICAgIC0gMTogZW50ZXIsIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgICAtIHRoZSBhY3R1YWwgZG9tIG9wZXJhdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGNscyAgICAtIHRoZSBjbGFzc05hbWUgdG8gcmVtb3ZlIHdoZW4gdGhlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbiBpcyBkb25lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSAtIHVzZXIgc3VwcGxpZWQgY2FsbGJhY2suXG4gKi9cblxuZnVuY3Rpb24gcHVzaCAoZWwsIGRpciwgb3AsIGNscywgY2IpIHtcbiAgcXVldWUucHVzaCh7XG4gICAgZWwgIDogZWwsXG4gICAgZGlyIDogZGlyLFxuICAgIGNiICA6IGNiLFxuICAgIGNscyA6IGNscyxcbiAgICBvcCAgOiBvcFxuICB9KVxuICBpZiAoIXF1ZXVlZCkge1xuICAgIHF1ZXVlZCA9IHRydWVcbiAgICBfLm5leHRUaWNrKGZsdXNoKVxuICB9XG59XG5cbi8qKlxuICogRmx1c2ggdGhlIHF1ZXVlLCBhbmQgZG8gb25lIGZvcmNlZCByZWZsb3cgYmVmb3JlXG4gKiB0cmlnZ2VyaW5nIHRyYW5zaXRpb25zLlxuICovXG5cbmZ1bmN0aW9uIGZsdXNoICgpIHtcbiAgLyoganNoaW50IHVudXNlZDogZmFsc2UgKi9cbiAgdmFyIGYgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0XG4gIHF1ZXVlLmZvckVhY2gocnVuKVxuICBxdWV1ZSA9IFtdXG4gIHF1ZXVlZCA9IGZhbHNlXG59XG5cbi8qKlxuICogUnVuIGEgdHJhbnNpdGlvbiBqb2IuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGpvYlxuICovXG5cbmZ1bmN0aW9uIHJ1biAoam9iKSB7XG5cbiAgdmFyIGVsID0gam9iLmVsXG4gIHZhciBkYXRhID0gZWwuX192X3RyYW5zXG4gIHZhciBjbHMgPSBqb2IuY2xzXG4gIHZhciBjYiA9IGpvYi5jYlxuICB2YXIgb3AgPSBqb2Iub3BcbiAgdmFyIHRyYW5zaXRpb25UeXBlID0gZ2V0VHJhbnNpdGlvblR5cGUoZWwsIGRhdGEsIGNscylcblxuICBpZiAoam9iLmRpciA+IDApIHsgLy8gRU5URVJcbiAgICBpZiAodHJhbnNpdGlvblR5cGUgPT09IDEpIHtcbiAgICAgIC8vIHRyaWdnZXIgdHJhbnNpdGlvbiBieSByZW1vdmluZyBlbnRlciBjbGFzc1xuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIC8vIG9ubHkgbmVlZCB0byBsaXN0ZW4gZm9yIHRyYW5zaXRpb25lbmQgaWYgdGhlcmUnc1xuICAgICAgLy8gYSB1c2VyIGNhbGxiYWNrXG4gICAgICBpZiAoY2IpIHNldHVwVHJhbnNpdGlvbkNiKF8udHJhbnNpdGlvbkVuZEV2ZW50KVxuICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvblR5cGUgPT09IDIpIHtcbiAgICAgIC8vIGFuaW1hdGlvbnMgYXJlIHRyaWdnZXJlZCB3aGVuIGNsYXNzIGlzIGFkZGVkXG4gICAgICAvLyBzbyB3ZSBqdXN0IGxpc3RlbiBmb3IgYW5pbWF0aW9uZW5kIHRvIHJlbW92ZSBpdC5cbiAgICAgIHNldHVwVHJhbnNpdGlvbkNiKF8uYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIHRyYW5zaXRpb24gYXBwbGljYWJsZVxuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gTEVBVkVcbiAgICBpZiAodHJhbnNpdGlvblR5cGUpIHtcbiAgICAgIC8vIGxlYXZlIHRyYW5zaXRpb25zL2FuaW1hdGlvbnMgYXJlIGJvdGggdHJpZ2dlcmVkXG4gICAgICAvLyBieSBhZGRpbmcgdGhlIGNsYXNzLCBqdXN0IHJlbW92ZSBpdCBvbiBlbmQgZXZlbnQuXG4gICAgICB2YXIgZXZlbnQgPSB0cmFuc2l0aW9uVHlwZSA9PT0gMVxuICAgICAgICA/IF8udHJhbnNpdGlvbkVuZEV2ZW50XG4gICAgICAgIDogXy5hbmltYXRpb25FbmRFdmVudFxuICAgICAgc2V0dXBUcmFuc2l0aW9uQ2IoZXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3AoKVxuICAgICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3AoKVxuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdXAgYSB0cmFuc2l0aW9uIGVuZCBjYWxsYmFjaywgc3RvcmUgdGhlIGNhbGxiYWNrXG4gICAqIG9uIHRoZSBlbGVtZW50J3MgX192X3RyYW5zIGRhdGEgb2JqZWN0LCBzbyB3ZSBjYW5cbiAgICogY2xlYW4gaXQgdXAgaWYgYW5vdGhlciB0cmFuc2l0aW9uIGlzIHRyaWdnZXJlZCBiZWZvcmVcbiAgICogdGhlIGNhbGxiYWNrIGlzIGZpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NsZWFudXBGbl1cbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0dXBUcmFuc2l0aW9uQ2IgKGV2ZW50LCBjbGVhbnVwRm4pIHtcbiAgICBkYXRhLmV2ZW50ID0gZXZlbnRcbiAgICB2YXIgb25FbmQgPSBkYXRhLmNhbGxiYWNrID0gZnVuY3Rpb24gdHJhbnNpdGlvbkNiIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICAgIF8ub2ZmKGVsLCBldmVudCwgb25FbmQpXG4gICAgICAgIGRhdGEuZXZlbnQgPSBkYXRhLmNhbGxiYWNrID0gbnVsbFxuICAgICAgICBpZiAoY2xlYW51cEZuKSBjbGVhbnVwRm4oKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH1cbiAgICB9XG4gICAgXy5vbihlbCwgZXZlbnQsIG9uRW5kKVxuICB9XG59XG5cbi8qKlxuICogR2V0IGFuIGVsZW1lbnQncyB0cmFuc2l0aW9uIHR5cGUgYmFzZWQgb24gdGhlXG4gKiBjYWxjdWxhdGVkIHN0eWxlc1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIDEgLSB0cmFuc2l0aW9uXG4gKiAgICAgICAgIDIgLSBhbmltYXRpb25cbiAqL1xuXG5mdW5jdGlvbiBnZXRUcmFuc2l0aW9uVHlwZSAoZWwsIGRhdGEsIGNsYXNzTmFtZSkge1xuICB2YXIgdHlwZSA9IGRhdGEuY2FjaGUgJiYgZGF0YS5jYWNoZVtjbGFzc05hbWVdXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICB2YXIgaW5saW5lU3R5bGVzID0gZWwuc3R5bGVcbiAgdmFyIGNvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gIHZhciB0cmFuc0R1cmF0aW9uID1cbiAgICBpbmxpbmVTdHlsZXNbdHJhbnNEdXJhdGlvblByb3BdIHx8XG4gICAgY29tcHV0ZWRTdHlsZXNbdHJhbnNEdXJhdGlvblByb3BdXG4gIGlmICh0cmFuc0R1cmF0aW9uICYmIHRyYW5zRHVyYXRpb24gIT09ICcwcycpIHtcbiAgICB0eXBlID0gMVxuICB9IGVsc2Uge1xuICAgIHZhciBhbmltRHVyYXRpb24gPVxuICAgICAgaW5saW5lU3R5bGVzW2FuaW1EdXJhdGlvblByb3BdIHx8XG4gICAgICBjb21wdXRlZFN0eWxlc1thbmltRHVyYXRpb25Qcm9wXVxuICAgIGlmIChhbmltRHVyYXRpb24gJiYgYW5pbUR1cmF0aW9uICE9PSAnMHMnKSB7XG4gICAgICB0eXBlID0gMlxuICAgIH1cbiAgfVxuICBpZiAodHlwZSkge1xuICAgIGlmICghZGF0YS5jYWNoZSkgZGF0YS5jYWNoZSA9IHt9XG4gICAgZGF0YS5jYWNoZVtjbGFzc05hbWVdID0gdHlwZVxuICB9XG4gIHJldHVybiB0eXBlXG59XG5cbi8qKlxuICogQXBwbHkgQ1NTIHRyYW5zaXRpb24gdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uIC0gMTogZW50ZXIsIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gdGFyZ2V0IGVsZW1lbnQncyB0cmFuc2l0aW9uIGRhdGFcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgZGF0YSwgY2IpIHtcbiAgdmFyIHByZWZpeCA9IGRhdGEuaWQgfHwgJ3YnXG4gIHZhciBlbnRlckNsYXNzID0gcHJlZml4ICsgJy1lbnRlcidcbiAgdmFyIGxlYXZlQ2xhc3MgPSBwcmVmaXggKyAnLWxlYXZlJ1xuICAvLyBjbGVhbiB1cCBwb3RlbnRpYWwgcHJldmlvdXMgdW5maW5pc2hlZCB0cmFuc2l0aW9uXG4gIGlmIChkYXRhLmNhbGxiYWNrKSB7XG4gICAgXy5vZmYoZWwsIGRhdGEuZXZlbnQsIGRhdGEuY2FsbGJhY2spXG4gICAgcmVtb3ZlQ2xhc3MoZWwsIGVudGVyQ2xhc3MpXG4gICAgcmVtb3ZlQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpXG4gICAgZGF0YS5ldmVudCA9IGRhdGEuY2FsbGJhY2sgPSBudWxsXG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA+IDApIHsgLy8gZW50ZXJcbiAgICBhZGRDbGFzcyhlbCwgZW50ZXJDbGFzcylcbiAgICBvcCgpXG4gICAgcHVzaChlbCwgZGlyZWN0aW9uLCBudWxsLCBlbnRlckNsYXNzLCBjYilcbiAgfSBlbHNlIHsgLy8gbGVhdmVcbiAgICBhZGRDbGFzcyhlbCwgbGVhdmVDbGFzcylcbiAgICBwdXNoKGVsLCBkaXJlY3Rpb24sIG9wLCBsZWF2ZUNsYXNzLCBjYilcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYXBwbHlDU1NUcmFuc2l0aW9uID0gcmVxdWlyZSgnLi9jc3MnKVxudmFyIGFwcGx5SlNUcmFuc2l0aW9uID0gcmVxdWlyZSgnLi9qcycpXG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiBkb2N1bWVudFxuXG4vKipcbiAqIEFwcGVuZCB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMuYXBwZW5kID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBhcHBseShlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIEluc2VydEJlZm9yZSB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMuYmVmb3JlID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBhcHBseShlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgIF8uYmVmb3JlKGVsLCB0YXJnZXQpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMucmVtb3ZlID0gZnVuY3Rpb24gKGVsLCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgXy5yZW1vdmUoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnkgYXBwZW5kaW5nIHRvIGFub3RoZXIgcGFyZW50IHdpdGggdHJhbnNpdGlvbi5cbiAqIFRoaXMgaXMgb25seSB1c2VkIGluIGJsb2NrIG9wZXJhdGlvbnMuXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMucmVtb3ZlVGhlbkFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogQXBwZW5kIHRoZSBjaGlsZE5vZGVzIG9mIGEgZnJhZ21lbnQgdG8gdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gYmxvY2tcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5leHBvcnRzLmJsb2NrQXBwZW5kID0gZnVuY3Rpb24gKGJsb2NrLCB0YXJnZXQsIHZtKSB7XG4gIHZhciBub2RlcyA9IF8udG9BcnJheShibG9jay5jaGlsZE5vZGVzKVxuICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGV4cG9ydHMuYmVmb3JlKG5vZGVzW2ldLCB0YXJnZXQsIHZtKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgYmxvY2sgb2Ygbm9kZXMgYmV0d2VlbiB0d28gZWRnZSBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IHN0YXJ0XG4gKiBAcGFyYW0ge05vZGV9IGVuZFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxuZXhwb3J0cy5ibG9ja1JlbW92ZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCB2bSkge1xuICB2YXIgbm9kZSA9IHN0YXJ0Lm5leHRTaWJsaW5nXG4gIHZhciBuZXh0XG4gIHdoaWxlIChub2RlICE9PSBlbmQpIHtcbiAgICBuZXh0ID0gbm9kZS5uZXh0U2libGluZ1xuICAgIGV4cG9ydHMucmVtb3ZlKG5vZGUsIHZtKVxuICAgIG5vZGUgPSBuZXh0XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBseSB0cmFuc2l0aW9ucyB3aXRoIGFuIG9wZXJhdGlvbiBjYWxsYmFjay5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uXG4gKiAgICAgICAgICAgICAgICAgIDE6IGVudGVyXG4gKiAgICAgICAgICAgICAgICAgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxudmFyIGFwcGx5ID0gZXhwb3J0cy5hcHBseSA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgdm0sIGNiKSB7XG4gIHZhciB0cmFuc0RhdGEgPSBlbC5fX3ZfdHJhbnNcbiAgaWYgKFxuICAgICF0cmFuc0RhdGEgfHxcbiAgICAhdm0uX2lzQ29tcGlsZWQgfHxcbiAgICAvLyBpZiB0aGUgdm0gaXMgYmVpbmcgbWFuaXB1bGF0ZWQgYnkgYSBwYXJlbnQgZGlyZWN0aXZlXG4gICAgLy8gZHVyaW5nIHRoZSBwYXJlbnQncyBjb21waWxhdGlvbiBwaGFzZSwgc2tpcCB0aGVcbiAgICAvLyBhbmltYXRpb24uXG4gICAgKHZtLiRwYXJlbnQgJiYgIXZtLiRwYXJlbnQuX2lzQ29tcGlsZWQpXG4gICkge1xuICAgIG9wKClcbiAgICBpZiAoY2IpIGNiKClcbiAgICByZXR1cm5cbiAgfVxuICAvLyBkZXRlcm1pbmUgdGhlIHRyYW5zaXRpb24gdHlwZSBvbiB0aGUgZWxlbWVudFxuICB2YXIganNUcmFuc2l0aW9uID0gdHJhbnNEYXRhLmZuc1xuICBpZiAoanNUcmFuc2l0aW9uKSB7XG4gICAgLy8ganNcbiAgICBhcHBseUpTVHJhbnNpdGlvbihcbiAgICAgIGVsLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgb3AsXG4gICAgICB0cmFuc0RhdGEsXG4gICAgICBqc1RyYW5zaXRpb24sXG4gICAgICB2bSxcbiAgICAgIGNiXG4gICAgKVxuICB9IGVsc2UgaWYgKFxuICAgIF8udHJhbnNpdGlvbkVuZEV2ZW50ICYmXG4gICAgLy8gc2tpcCBDU1MgdHJhbnNpdGlvbnMgaWYgcGFnZSBpcyBub3QgdmlzaWJsZSAtXG4gICAgLy8gdGhpcyBzb2x2ZXMgdGhlIGlzc3VlIG9mIHRyYW5zaXRpb25lbmQgZXZlbnRzIG5vdFxuICAgIC8vIGZpcmluZyB1bnRpbCB0aGUgcGFnZSBpcyB2aXNpYmxlIGFnYWluLlxuICAgIC8vIHBhZ2VWaXNpYmlsaXR5IEFQSSBpcyBzdXBwb3J0ZWQgaW4gSUUxMCssIHNhbWUgYXNcbiAgICAvLyBDU1MgdHJhbnNpdGlvbnMuXG4gICAgIShkb2MgJiYgZG9jLmhpZGRlbilcbiAgKSB7XG4gICAgLy8gY3NzXG4gICAgYXBwbHlDU1NUcmFuc2l0aW9uKFxuICAgICAgZWwsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBvcCxcbiAgICAgIHRyYW5zRGF0YSxcbiAgICAgIGNiXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIC8vIG5vdCBhcHBsaWNhYmxlXG4gICAgb3AoKVxuICAgIGlmIChjYikgY2IoKVxuICB9XG59IiwiLyoqXG4gKiBBcHBseSBKYXZhU2NyaXB0IGVudGVyL2xlYXZlIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uIC0gMTogZW50ZXIsIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gdGFyZ2V0IGVsZW1lbnQncyB0cmFuc2l0aW9uIGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgLSB0cmFuc2l0aW9uIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZX0gdm0gLSB0aGUgb3duZXIgdm0gb2YgdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgZGF0YSwgZGVmLCB2bSwgY2IpIHtcbiAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgdGhlIHJvb3Qgb2YgYW4gaW5zdGFuY2UsXG4gIC8vIHVzZSB0aGF0IGluc3RhbmNlIGFzIHRoZSB0cmFuc2l0aW9uIGZ1bmN0aW9uIGNvbnRleHRcbiAgdm0gPSBlbC5fX3Z1ZV9fIHx8IHZtXG4gIGlmIChkYXRhLmNhbmNlbCkge1xuICAgIGRhdGEuY2FuY2VsKClcbiAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgfVxuICBpZiAoZGlyZWN0aW9uID4gMCkgeyAvLyBlbnRlclxuICAgIGlmIChkZWYuYmVmb3JlRW50ZXIpIHtcbiAgICAgIGRlZi5iZWZvcmVFbnRlci5jYWxsKHZtLCBlbClcbiAgICB9XG4gICAgb3AoKVxuICAgIGlmIChkZWYuZW50ZXIpIHtcbiAgICAgIGRhdGEuY2FuY2VsID0gZGVmLmVudGVyLmNhbGwodm0sIGVsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuY2FuY2VsID0gbnVsbFxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgY2IoKVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gbGVhdmVcbiAgICBpZiAoZGVmLmxlYXZlKSB7XG4gICAgICBkYXRhLmNhbmNlbCA9IGRlZi5sZWF2ZS5jYWxsKHZtLCBlbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgICAgICAgb3AoKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wKClcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqIEVuYWJsZSBkZWJ1ZyB1dGlsaXRpZXMuIFRoZSBlbmFibGVEZWJ1ZygpIGZ1bmN0aW9uIGFuZFxuICogYWxsIF8ubG9nKCkgJiBfLndhcm4oKSBjYWxscyB3aWxsIGJlIGRyb3BwZWQgaW4gdGhlXG4gKiBtaW5pZmllZCBwcm9kdWN0aW9uIGJ1aWxkLlxuICovXG5cbmVuYWJsZURlYnVnKClcblxuZnVuY3Rpb24gZW5hYmxlRGVidWcgKCkge1xuXG4gIHZhciBoYXNDb25zb2xlID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnXG4gIFxuICAvKipcbiAgICogTG9nIGEgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZ1xuICAgKi9cblxuICBleHBvcnRzLmxvZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiBjb25maWcuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbVnVlIGluZm9dOiAnICsgbXNnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXZSd2ZSBnb3QgYSBwcm9ibGVtIGhlcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgZXhwb3J0cy53YXJuID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChoYXNDb25zb2xlICYmICghY29uZmlnLnNpbGVudCB8fCBjb25maWcuZGVidWcpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tWdWUgd2Fybl06ICcgKyBtc2cpXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgICAgLyoganNoaW50IGRlYnVnOiB0cnVlICovXG4gICAgICAgIGRlYnVnZ2VyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCBhc3NldCBleGlzdHNcbiAgICovXG5cbiAgZXhwb3J0cy5hc3NlcnRBc3NldCA9IGZ1bmN0aW9uICh2YWwsIHR5cGUsIGlkKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIGV4cG9ydHMud2FybignRmFpbGVkIHRvIHJlc29sdmUgJyArIHR5cGUgKyAnOiAnICsgaWQpXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYSBub2RlIGlzIGluIHRoZSBkb2N1bWVudC5cbiAqIE5vdGU6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyBzaG91bGQgd29yayBoZXJlXG4gKiBidXQgYWx3YXlzIHJldHVybnMgZmFsc2UgZm9yIGNvbW1lbnQgbm9kZXMgaW4gcGhhbnRvbWpzLFxuICogbWFraW5nIHVuaXQgdGVzdHMgZGlmZmljdWx0LiBUaGlzIGlzIGZpeGVkIGJ5eSBkb2luZyB0aGVcbiAqIGNvbnRhaW5zKCkgY2hlY2sgb24gdGhlIG5vZGUncyBwYXJlbnROb2RlIGluc3RlYWQgb2ZcbiAqIHRoZSBub2RlIGl0c2VsZi5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxudmFyIGRvYyA9XG4gIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cbmV4cG9ydHMuaW5Eb2MgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgcGFyZW50ID0gbm9kZSAmJiBub2RlLnBhcmVudE5vZGVcbiAgcmV0dXJuIGRvYyA9PT0gbm9kZSB8fFxuICAgIGRvYyA9PT0gcGFyZW50IHx8XG4gICAgISEocGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSA9PT0gMSAmJiAoZG9jLmNvbnRhaW5zKHBhcmVudCkpKVxufVxuXG4vKipcbiAqIEV4dHJhY3QgYW4gYXR0cmlidXRlIGZyb20gYSBub2RlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJcbiAqL1xuXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICBhdHRyID0gY29uZmlnLnByZWZpeCArIGF0dHJcbiAgdmFyIHZhbCA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpXG4gIGlmICh2YWwgIT09IG51bGwpIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuLyoqXG4gKiBJbnNlcnQgZWwgYmVmb3JlIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5iZWZvcmUgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldClcbn1cblxuLyoqXG4gKiBJbnNlcnQgZWwgYWZ0ZXIgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLmFmdGVyID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgaWYgKHRhcmdldC5uZXh0U2libGluZykge1xuICAgIGV4cG9ydHMuYmVmb3JlKGVsLCB0YXJnZXQubmV4dFNpYmxpbmcpXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgZWwgZnJvbSBET01cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZXhwb3J0cy5yZW1vdmUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbn1cblxuLyoqXG4gKiBQcmVwZW5kIGVsIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5wcmVwZW5kID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgaWYgKHRhcmdldC5maXJzdENoaWxkKSB7XG4gICAgZXhwb3J0cy5iZWZvcmUoZWwsIHRhcmdldC5maXJzdENoaWxkKVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfVxufVxuXG4vKipcbiAqIFJlcGxhY2UgdGFyZ2V0IHdpdGggZWxcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMucmVwbGFjZSA9IGZ1bmN0aW9uICh0YXJnZXQsIGVsKSB7XG4gIHZhciBwYXJlbnQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LnJlcGxhY2VDaGlsZChlbCwgdGFyZ2V0KVxuICB9XG59XG5cbi8qKlxuICogQ29weSBhdHRyaWJ1dGVzIGZyb20gb25lIGVsZW1lbnQgdG8gYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZyb21cbiAqIEBwYXJhbSB7RWxlbWVudH0gdG9cbiAqL1xuXG5leHBvcnRzLmNvcHlBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIGlmIChmcm9tLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgIHZhciBhdHRycyA9IGZyb20uYXR0cmlidXRlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldXG4gICAgICB0by5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBzaG9ydGhhbmQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmV4cG9ydHMub24gPSBmdW5jdGlvbiAoZWwsIGV2ZW50LCBjYikge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLm9mZiA9IGZ1bmN0aW9uIChlbCwgZXZlbnQsIGNiKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNiKVxufVxuXG4vKipcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgKGN1ciArIGNscykudHJpbSgpKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgdmFyIHRhciA9ICcgJyArIGNscyArICcgJ1xuICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgIGN1ciA9IGN1ci5yZXBsYWNlKHRhciwgJyAnKVxuICAgIH1cbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY3VyLnRyaW0oKSlcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgcmF3IGNvbnRlbnQgaW5zaWRlIGFuIGVsZW1lbnQgaW50byBhIHRlbXBvcmFyeVxuICogY29udGFpbmVyIGRpdlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXNGcmFnbWVudFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLmV4dHJhY3RDb250ZW50ID0gZnVuY3Rpb24gKGVsLCBhc0ZyYWdtZW50KSB7XG4gIHZhciBjaGlsZFxuICB2YXIgcmF3Q29udGVudFxuICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgcmF3Q29udGVudCA9IGFzRnJhZ21lbnRcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJhd0NvbnRlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxuICB9XG4gIHJldHVybiByYXdDb250ZW50XG59XG4iLCIvKipcbiAqIENhbiB3ZSB1c2UgX19wcm90b19fP1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fVxuXG4vKipcbiAqIEluZGljYXRlcyB3ZSBoYXZlIGEgd2luZG93XG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGluQnJvd3NlciA9IGV4cG9ydHMuaW5Ccm93c2VyID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdG9TdHJpbmcuY2FsbCh3aW5kb3cpICE9PSAnW29iamVjdCBPYmplY3RdJ1xuXG4vKipcbiAqIERlZmVyIGEgdGFzayB0byBleGVjdXRlIGl0IGFzeW5jaHJvbm91c2x5LiBJZGVhbGx5IHRoaXNcbiAqIHNob3VsZCBiZSBleGVjdXRlZCBhcyBhIG1pY3JvdGFzaywgc28gd2UgbGV2ZXJhZ2VcbiAqIE11dGF0aW9uT2JzZXJ2ZXIgaWYgaXQncyBhdmFpbGFibGUsIGFuZCBmYWxsYmFjayB0b1xuICogc2V0VGltZW91dCgwKS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICovXG5cbmV4cG9ydHMubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgY2FsbGJhY2tzID0gW11cbiAgdmFyIHBlbmRpbmcgPSBmYWxzZVxuICB2YXIgdGltZXJGdW5jXG4gIGZ1bmN0aW9uIGhhbmRsZSAoKSB7XG4gICAgcGVuZGluZyA9IGZhbHNlXG4gICAgdmFyIGNvcGllcyA9IGNhbGxiYWNrcy5zbGljZSgwKVxuICAgIGNhbGxiYWNrcyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3BpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvcGllc1tpXSgpXG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKVxuICAgIHZhciB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvdW50ZXIpXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0Tm9kZSwge1xuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxuICAgIH0pXG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyXG4gICAgICB0ZXh0Tm9kZS5kYXRhID0gY291bnRlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aW1lckZ1bmMgPSBzZXRUaW1lb3V0XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChjYiwgY3R4KSB7XG4gICAgdmFyIGZ1bmMgPSBjdHhcbiAgICAgID8gZnVuY3Rpb24gKCkgeyBjYi5jYWxsKGN0eCkgfVxuICAgICAgOiBjYlxuICAgIGNhbGxiYWNrcy5wdXNoKGZ1bmMpXG4gICAgaWYgKHBlbmRpbmcpIHJldHVyblxuICAgIHBlbmRpbmcgPSB0cnVlXG4gICAgdGltZXJGdW5jKGhhbmRsZSwgMClcbiAgfVxufSkoKVxuXG4vKipcbiAqIERldGVjdCBpZiB3ZSBhcmUgaW4gSUU5Li4uXG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc0lFOSA9XG4gIGluQnJvd3NlciAmJlxuICBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgOS4wJykgPiAwXG5cbi8qKlxuICogU25pZmYgdHJhbnNpdGlvbi9hbmltYXRpb24gZXZlbnRzXG4gKi9cblxuaWYgKGluQnJvd3NlciAmJiAhZXhwb3J0cy5pc0lFOSkge1xuICB2YXIgaXNXZWJraXRUcmFucyA9XG4gICAgd2luZG93Lm9udHJhbnNpdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkXG4gIHZhciBpc1dlYmtpdEFuaW0gPVxuICAgIHdpbmRvdy5vbmFuaW1hdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0YW5pbWF0aW9uZW5kICE9PSB1bmRlZmluZWRcbiAgZXhwb3J0cy50cmFuc2l0aW9uUHJvcCA9IGlzV2Via2l0VHJhbnNcbiAgICA/ICdXZWJraXRUcmFuc2l0aW9uJ1xuICAgIDogJ3RyYW5zaXRpb24nXG4gIGV4cG9ydHMudHJhbnNpdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRUcmFuc1xuICAgID8gJ3dlYmtpdFRyYW5zaXRpb25FbmQnXG4gICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgZXhwb3J0cy5hbmltYXRpb25Qcm9wID0gaXNXZWJraXRBbmltXG4gICAgPyAnV2Via2l0QW5pbWF0aW9uJ1xuICAgIDogJ2FuaW1hdGlvbidcbiAgZXhwb3J0cy5hbmltYXRpb25FbmRFdmVudCA9IGlzV2Via2l0QW5pbVxuICAgID8gJ3dlYmtpdEFuaW1hdGlvbkVuZCdcbiAgICA6ICdhbmltYXRpb25lbmQnXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL2RlYnVnJylcblxuLyoqXG4gKiBSZXNvbHZlIHJlYWQgJiB3cml0ZSBmaWx0ZXJzIGZvciBhIHZtIGluc3RhbmNlLiBUaGVcbiAqIGZpbHRlcnMgZGVzY3JpcHRvciBBcnJheSBjb21lcyBmcm9tIHRoZSBkaXJlY3RpdmUgcGFyc2VyLlxuICpcbiAqIFRoaXMgaXMgZXh0cmFjdGVkIGludG8gaXRzIG93biB1dGlsaXR5IHNvIGl0IGNhblxuICogYmUgdXNlZCBpbiBtdWx0aXBsZSBzY2VuYXJpb3MuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpbHRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmV4cG9ydHMucmVzb2x2ZUZpbHRlcnMgPSBmdW5jdGlvbiAodm0sIGZpbHRlcnMsIHRhcmdldCkge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmVzID0gdGFyZ2V0IHx8IHt9XG4gIC8vIHZhciByZWdpc3RyeSA9IHZtLiRvcHRpb25zLmZpbHRlcnNcbiAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGRlZiA9IHZtLiRvcHRpb25zLmZpbHRlcnNbZi5uYW1lXVxuICAgIF8uYXNzZXJ0QXNzZXQoZGVmLCAnZmlsdGVyJywgZi5uYW1lKVxuICAgIGlmICghZGVmKSByZXR1cm5cbiAgICB2YXIgYXJncyA9IGYuYXJnc1xuICAgIHZhciByZWFkZXIsIHdyaXRlclxuICAgIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkZXIgPSBkZWZcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhZGVyID0gZGVmLnJlYWRcbiAgICAgIHdyaXRlciA9IGRlZi53cml0ZVxuICAgIH1cbiAgICBpZiAocmVhZGVyKSB7XG4gICAgICBpZiAoIXJlcy5yZWFkKSByZXMucmVhZCA9IFtdXG4gICAgICByZXMucmVhZC5wdXNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYXJnc1xuICAgICAgICAgID8gcmVhZGVyLmFwcGx5KHZtLCBbdmFsdWVdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHJlYWRlci5jYWxsKHZtLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh3cml0ZXIpIHtcbiAgICAgIGlmICghcmVzLndyaXRlKSByZXMud3JpdGUgPSBbXVxuICAgICAgcmVzLndyaXRlLnB1c2goZnVuY3Rpb24gKHZhbHVlLCBvbGRWYWwpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICAgICAgICA/IHdyaXRlci5hcHBseSh2bSwgW3ZhbHVlLCBvbGRWYWxdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHdyaXRlci5jYWxsKHZtLCB2YWx1ZSwgb2xkVmFsKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBcHBseSBmaWx0ZXJzIHRvIGEgdmFsdWVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Kn0gb2xkVmFsXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuYXBwbHlGaWx0ZXJzID0gZnVuY3Rpb24gKHZhbHVlLCBmaWx0ZXJzLCB2bSwgb2xkVmFsKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YWx1ZSA9IGZpbHRlcnNbaV0uY2FsbCh2bSwgdmFsdWUsIG9sZFZhbClcbiAgfVxuICByZXR1cm4gdmFsdWVcbn0iLCJ2YXIgbGFuZyAgID0gcmVxdWlyZSgnLi9sYW5nJylcbnZhciBleHRlbmQgPSBsYW5nLmV4dGVuZFxuXG5leHRlbmQoZXhwb3J0cywgbGFuZylcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2VudicpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZG9tJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9maWx0ZXInKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2RlYnVnJykpIiwiLyoqXG4gKiBDaGVjayBpcyBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNSZXNlcnZlZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMClcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIEd1YXJkIHRleHQgb3V0cHV0LCBtYWtlIHN1cmUgdW5kZWZpbmVkIG91dHB1dHNcbiAqIGVtcHR5IHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnRvU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgPyAnJ1xuICAgIDogdmFsdWUudG9TdHJpbmcoKVxufVxuXG4vKipcbiAqIENoZWNrIGFuZCBjb252ZXJ0IHBvc3NpYmxlIG51bWVyaWMgbnVtYmVycyBiZWZvcmVcbiAqIHNldHRpbmcgYmFjayB0byBkYXRhXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7KnxOdW1iZXJ9XG4gKi9cblxuZXhwb3J0cy50b051bWJlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIGlzTmFOKHZhbHVlKSB8fFxuICAgIHZhbHVlID09PSBudWxsIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbidcbiAgKSA/IHZhbHVlXG4gICAgOiBOdW1iZXIodmFsdWUpXG59XG5cbi8qKlxuICogU3RyaXAgcXVvdGVzIGZyb20gYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmcgfCBmYWxzZX1cbiAqL1xuXG5leHBvcnRzLnN0cmlwUXVvdGVzID0gZnVuY3Rpb24gKHN0cikge1xuICB2YXIgYSA9IHN0ci5jaGFyQ29kZUF0KDApXG4gIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoc3RyLmxlbmd0aCAtIDEpXG4gIHJldHVybiBhID09PSBiICYmIChhID09PSAweDIyIHx8IGEgPT09IDB4MjcpXG4gICAgPyBzdHIuc2xpY2UoMSwgLTEpXG4gICAgOiBmYWxzZVxufVxuXG4vKipcbiAqIFJlcGxhY2UgaGVscGVyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IF8gLSBtYXRjaGVkIGRlbGltaXRlclxuICogQHBhcmFtIHtTdHJpbmd9IGMgLSBtYXRjaGVkIGNoYXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdG9VcHBlciAoXywgYykge1xuICByZXR1cm4gYyA/IGMudG9VcHBlckNhc2UgKCkgOiAnJ1xufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbG1pdGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNhbWVsUkUgPSAvLShcXHcpL2dcbmV4cG9ydHMuY2FtZWxpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbFJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGh5cGhlbi91bmRlcnNjb3JlL3NsYXNoIGRlbGltaXRlcmVkIG5hbWVzIGludG9cbiAqIGNhbWVsaXplZCBjbGFzc05hbWVzLlxuICpcbiAqIGUuZy4gbXktY29tcG9uZW50ID0+IE15Q29tcG9uZW50XG4gKiAgICAgIHNvbWVfZWxzZSAgICA9PiBTb21lRWxzZVxuICogICAgICBzb21lL2NvbXAgICAgPT4gU29tZUNvbXBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNsYXNzaWZ5UkUgPSAvKD86XnxbLV9cXC9dKShcXHcpL2dcbmV4cG9ydHMuY2xhc3NpZnkgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjbGFzc2lmeVJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIFNpbXBsZSBiaW5kLCBmYXN0ZXIgdGhhbiBuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkoY3R4LCBhcmd1bWVudHMpXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LWxpa2V9IGxpc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRdIC0gc3RhcnQgaW5kZXhcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmV4cG9ydHMudG9BcnJheSA9IGZ1bmN0aW9uIChsaXN0LCBzdGFydCkge1xuICBzdGFydCA9IHN0YXJ0IHx8IDBcbiAgdmFyIGkgPSBsaXN0Lmxlbmd0aCAtIHN0YXJ0XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoaSlcbiAgd2hpbGUgKGktLSkge1xuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBNaXggcHJvcGVydGllcyBpbnRvIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRvXG4gKiBAcGFyYW0ge09iamVjdH0gZnJvbVxuICovXG5cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgdG9ba2V5XSA9IGZyb21ba2V5XVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxuICogT2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMgd2hlbiB3ZSBrbm93IHRoZSB2YWx1ZVxuICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcbn1cblxuLyoqXG4gKiBTdHJpY3Qgb2JqZWN0IHR5cGUgY2hlY2suIE9ubHkgcmV0dXJucyB0cnVlXG4gKiBmb3IgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbmV4cG9ydHMuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuLyoqXG4gKiBBcnJheSB0eXBlIGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKVxufVxuXG4vKipcbiAqIERlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2VudW1lcmFibGVdXG4gKi9cblxuZXhwb3J0cy5kZWZpbmUgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZSAgICAgICAgOiB2YWwsXG4gICAgZW51bWVyYWJsZSAgIDogISFlbnVtZXJhYmxlLFxuICAgIHdyaXRhYmxlICAgICA6IHRydWUsXG4gICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICB9KVxufVxuXG4vKipcbiAqIERlYm91bmNlIGEgZnVuY3Rpb24gc28gaXQgb25seSBnZXRzIGNhbGxlZCBhZnRlciB0aGVcbiAqIGlucHV0IHN0b3BzIGFycml2aW5nIGFmdGVyIHRoZSBnaXZlbiB3YWl0IHBlcmlvZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICogQHJldHVybiB7RnVuY3Rpb259IC0gdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5cbmV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdFxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXBcbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsXG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbFxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29udGV4dCA9IHRoaXNcbiAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGlmICghdGltZW91dCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi9pbmRleCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXG4gKiBob3cgdG8gbWVyZ2UgYSBwYXJlbnQgb3B0aW9uIHZhbHVlIGFuZCBhIGNoaWxkIG9wdGlvblxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXG4gKlxuICogQWxsIHN0cmF0ZWd5IGZ1bmN0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2lnbmF0dXJlOlxuICpcbiAqIEBwYXJhbSB7Kn0gcGFyZW50VmFsXG4gKiBAcGFyYW0geyp9IGNoaWxkVmFsXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICovXG5cbnZhciBzdHJhdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbi8qKlxuICogSGVscGVyIHRoYXQgcmVjdXJzaXZlbHkgbWVyZ2VzIHR3byBkYXRhIG9iamVjdHMgdG9nZXRoZXIuXG4gKi9cblxuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xuICB2YXIga2V5LCB0b1ZhbCwgZnJvbVZhbFxuICBmb3IgKGtleSBpbiBmcm9tKSB7XG4gICAgdG9WYWwgPSB0b1trZXldXG4gICAgZnJvbVZhbCA9IGZyb21ba2V5XVxuICAgIGlmICghdG8uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdG8uJGFkZChrZXksIGZyb21WYWwpXG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHRvVmFsKSAmJiBfLmlzT2JqZWN0KGZyb21WYWwpKSB7XG4gICAgICBtZXJnZURhdGEodG9WYWwsIGZyb21WYWwpXG4gICAgfVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIERhdGFcbiAqL1xuXG5zdHJhdHMuZGF0YSA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSkge1xuICBpZiAoIXZtKSB7XG4gICAgLy8gaW4gYSBWdWUuZXh0ZW5kIG1lcmdlLCBib3RoIHNob3VsZCBiZSBmdW5jdGlvbnNcbiAgICBpZiAoIWNoaWxkVmFsKSB7XG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1RoZSBcImRhdGFcIiBvcHRpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24gJyArXG4gICAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xuICAgICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAoIXBhcmVudFZhbCkge1xuICAgICAgcmV0dXJuIGNoaWxkVmFsXG4gICAgfVxuICAgIC8vIHdoZW4gcGFyZW50VmFsICYgY2hpbGRWYWwgYXJlIGJvdGggcHJlc2VudCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgICAvLyBtZXJnZWQgcmVzdWx0IG9mIGJvdGggZnVuY3Rpb25zLi4uIG5vIG5lZWQgdG9cbiAgICAvLyBjaGVjayBpZiBwYXJlbnRWYWwgaXMgYSBmdW5jdGlvbiBoZXJlIGJlY2F1c2VcbiAgICAvLyBpdCBoYXMgdG8gYmUgYSBmdW5jdGlvbiB0byBwYXNzIHByZXZpb3VzIG1lcmdlcy5cbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRGF0YUZuICgpIHtcbiAgICAgIHJldHVybiBtZXJnZURhdGEoXG4gICAgICAgIGNoaWxkVmFsLmNhbGwodGhpcyksXG4gICAgICAgIHBhcmVudFZhbC5jYWxsKHRoaXMpXG4gICAgICApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGluc3RhbmNlIG1lcmdlLCByZXR1cm4gcmF3IG9iamVjdFxuICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgID8gY2hpbGRWYWwuY2FsbCh2bSlcbiAgICAgIDogY2hpbGRWYWxcbiAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IHBhcmVudFZhbC5jYWxsKHZtKVxuICAgICAgOiB1bmRlZmluZWRcbiAgICBpZiAoaW5zdGFuY2VEYXRhKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKGluc3RhbmNlRGF0YSwgZGVmYXVsdERhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWZhdWx0RGF0YVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVsXG4gKi9cblxuc3RyYXRzLmVsID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKSB7XG4gIGlmICghdm0gJiYgY2hpbGRWYWwgJiYgdHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ1RoZSBcImVsXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgIClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmV0ID0gY2hpbGRWYWwgfHwgcGFyZW50VmFsXG4gIC8vIGludm9rZSB0aGUgZWxlbWVudCBmYWN0b3J5IGlmIHRoaXMgaXMgaW5zdGFuY2UgbWVyZ2VcbiAgcmV0dXJuIHZtICYmIHR5cGVvZiByZXQgPT09ICdmdW5jdGlvbidcbiAgICA/IHJldC5jYWxsKHZtKVxuICAgIDogcmV0XG59XG5cbi8qKlxuICogSG9va3MgYW5kIHBhcmFtIGF0dHJpYnV0ZXMgYXJlIG1lcmdlZCBhcyBhcnJheXMuXG4gKi9cblxuc3RyYXRzLmNyZWF0ZWQgPVxuc3RyYXRzLnJlYWR5ID1cbnN0cmF0cy5hdHRhY2hlZCA9XG5zdHJhdHMuZGV0YWNoZWQgPVxuc3RyYXRzLmJlZm9yZUNvbXBpbGUgPVxuc3RyYXRzLmNvbXBpbGVkID1cbnN0cmF0cy5iZWZvcmVEZXN0cm95ID1cbnN0cmF0cy5kZXN0cm95ZWQgPVxuc3RyYXRzLnBhcmFtQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IF8uaXNBcnJheShjaGlsZFZhbClcbiAgICAgICAgPyBjaGlsZFZhbFxuICAgICAgICA6IFtjaGlsZFZhbF1cbiAgICA6IHBhcmVudFZhbFxufVxuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5cbnN0cmF0cy5kaXJlY3RpdmVzID1cbnN0cmF0cy5maWx0ZXJzID1cbnN0cmF0cy5wYXJ0aWFscyA9XG5zdHJhdHMudHJhbnNpdGlvbnMgPVxuc3RyYXRzLmNvbXBvbmVudHMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0sIGtleSkge1xuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShcbiAgICB2bSAmJiB2bS4kcGFyZW50XG4gICAgICA/IHZtLiRwYXJlbnQuJG9wdGlvbnNba2V5XVxuICAgICAgOiBfLlZ1ZS5vcHRpb25zW2tleV1cbiAgKVxuICBpZiAocGFyZW50VmFsKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwYXJlbnRWYWwpXG4gICAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICAgIHZhciBmaWVsZFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGZpZWxkID0ga2V5c1tpXVxuICAgICAgcmV0W2ZpZWxkXSA9IHBhcmVudFZhbFtmaWVsZF1cbiAgICB9XG4gIH1cbiAgaWYgKGNoaWxkVmFsKSBleHRlbmQocmV0LCBjaGlsZFZhbClcbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIEV2ZW50cyAmIFdhdGNoZXJzLlxuICpcbiAqIEV2ZW50cyAmIHdhdGNoZXJzIGhhc2hlcyBzaG91bGQgbm90IG92ZXJ3cml0ZSBvbmVcbiAqIGFub3RoZXIsIHNvIHdlIG1lcmdlIHRoZW0gYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy53YXRjaCA9XG5zdHJhdHMuZXZlbnRzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgaWYgKCFjaGlsZFZhbCkgcmV0dXJuIHBhcmVudFZhbFxuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsXG4gIHZhciByZXQgPSB7fVxuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpXG4gIGZvciAodmFyIGtleSBpbiBjaGlsZFZhbCkge1xuICAgIHZhciBwYXJlbnQgPSByZXRba2V5XVxuICAgIHZhciBjaGlsZCA9IGNoaWxkVmFsW2tleV1cbiAgICBpZiAocGFyZW50ICYmICFfLmlzQXJyYXkocGFyZW50KSkge1xuICAgICAgcGFyZW50ID0gW3BhcmVudF1cbiAgICB9XG4gICAgcmV0W2tleV0gPSBwYXJlbnRcbiAgICAgID8gcGFyZW50LmNvbmNhdChjaGlsZClcbiAgICAgIDogW2NoaWxkXVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBPdGhlciBvYmplY3QgaGFzaGVzLlxuICovXG5cbnN0cmF0cy5tZXRob2RzID1cbnN0cmF0cy5jb21wdXRlZCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIGlmICghY2hpbGRWYWwpIHJldHVybiBwYXJlbnRWYWxcbiAgaWYgKCFwYXJlbnRWYWwpIHJldHVybiBjaGlsZFZhbFxuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRWYWwpXG4gIGV4dGVuZChyZXQsIGNoaWxkVmFsKVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogRGVmYXVsdCBzdHJhdGVneS5cbiAqL1xuXG52YXIgZGVmYXVsdFN0cmF0ID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsID09PSB1bmRlZmluZWRcbiAgICA/IHBhcmVudFZhbFxuICAgIDogY2hpbGRWYWxcbn1cblxuLyoqXG4gKiBNYWtlIHN1cmUgY29tcG9uZW50IG9wdGlvbnMgZ2V0IGNvbnZlcnRlZCB0byBhY3R1YWxcbiAqIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50c1xuICovXG5cbmZ1bmN0aW9uIGd1YXJkQ29tcG9uZW50cyAoY29tcG9uZW50cykge1xuICBpZiAoY29tcG9uZW50cykge1xuICAgIHZhciBkZWZcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcG9uZW50cykge1xuICAgICAgZGVmID0gY29tcG9uZW50c1trZXldXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KGRlZikpIHtcbiAgICAgICAgZGVmLm5hbWUgPSBrZXlcbiAgICAgICAgY29tcG9uZW50c1trZXldID0gXy5WdWUuZXh0ZW5kKGRlZilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXG4gKiBDb3JlIHV0aWxpdHkgdXNlZCBpbiBib3RoIGluc3RhbnRpYXRpb24gYW5kIGluaGVyaXRhbmNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaGlsZFxuICogQHBhcmFtIHtWdWV9IFt2bV0gLSBpZiB2bSBpcyBwcmVzZW50LCBpbmRpY2F0ZXMgdGhpcyBpc1xuICogICAgICAgICAgICAgICAgICAgICBhbiBpbnN0YW50aWF0aW9uIG1lcmdlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VPcHRpb25zIChwYXJlbnQsIGNoaWxkLCB2bSkge1xuICBndWFyZENvbXBvbmVudHMoY2hpbGQuY29tcG9uZW50cylcbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB2YXIga2V5XG4gIGlmIChjaGlsZC5taXhpbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkLm1peGlucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGNoaWxkLm1peGluc1tpXSwgdm0pXG4gICAgfVxuICB9XG4gIGZvciAoa2V5IGluIHBhcmVudCkge1xuICAgIG1lcmdlKGtleSlcbiAgfVxuICBmb3IgKGtleSBpbiBjaGlsZCkge1xuICAgIGlmICghKHBhcmVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSkge1xuICAgICAgbWVyZ2Uoa2V5KVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtZXJnZSAoa2V5KSB7XG4gICAgdmFyIHN0cmF0ID0gc3RyYXRzW2tleV0gfHwgZGVmYXVsdFN0cmF0XG4gICAgb3B0aW9uc1trZXldID0gc3RyYXQocGFyZW50W2tleV0sIGNoaWxkW2tleV0sIHZtLCBrZXkpXG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBWdWUgY29uc3RydWN0b3IuXG4gKlxuICogQVBJIGNvbnZlbnRpb25zOlxuICogLSBwdWJsaWMgQVBJIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZmlleGVkIHdpdGggYCRgXG4gKiAtIGludGVybmFsIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZml4ZWQgd2l0aCBgX2BcbiAqIC0gbm9uLXByZWZpeGVkIHByb3BlcnRpZXMgYXJlIGFzc3VtZWQgdG8gYmUgcHJveGllZCB1c2VyXG4gKiAgIGRhdGEuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gVnVlIChvcHRpb25zKSB7XG4gIHRoaXMuX2luaXQob3B0aW9ucylcbn1cblxuLyoqXG4gKiBNaXhpbiBnbG9iYWwgQVBJXG4gKi9cblxuZXh0ZW5kKFZ1ZSwgcmVxdWlyZSgnLi9hcGkvZ2xvYmFsJykpXG5cbi8qKlxuICogVnVlIGFuZCBldmVyeSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgVnVlIGhhcyBhblxuICogYXNzb2NpYXRlZCBvcHRpb25zIG9iamVjdCwgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIGR1cmluZ1xuICogY29tcGlsYXRpb24gc3RlcHMgYXMgYHRoaXMuY29uc3RydWN0b3Iub3B0aW9uc2AuXG4gKlxuICogVGhlc2UgY2FuIGJlIHNlZW4gYXMgdGhlIGRlZmF1bHQgb3B0aW9ucyBvZiBldmVyeVxuICogVnVlIGluc3RhbmNlLlxuICovXG5cblZ1ZS5vcHRpb25zID0ge1xuICBkaXJlY3RpdmVzICA6IHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLFxuICBmaWx0ZXJzICAgICA6IHJlcXVpcmUoJy4vZmlsdGVycycpLFxuICBwYXJ0aWFscyAgICA6IHt9LFxuICB0cmFuc2l0aW9ucyA6IHt9LFxuICBjb21wb25lbnRzICA6IHt9XG59XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIHByb3RvdHlwZVxuICovXG5cbnZhciBwID0gVnVlLnByb3RvdHlwZVxuXG4vKipcbiAqICRkYXRhIGhhcyBhIHNldHRlciB3aGljaCBkb2VzIGEgYnVuY2ggb2ZcbiAqIHRlYXJkb3duL3NldHVwIHdvcmtcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocCwgJyRkYXRhJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgdGhpcy5fc2V0RGF0YShuZXdEYXRhKVxuICB9XG59KVxuXG4vKipcbiAqIE1peGluIGludGVybmFsIGluc3RhbmNlIG1ldGhvZHNcbiAqL1xuXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9pbml0JykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9ldmVudHMnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL3Njb3BlJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9jb21waWxlJykpXG5cbi8qKlxuICogTWl4aW4gcHVibGljIEFQSSBtZXRob2RzXG4gKi9cblxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2RhdGEnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9kb20nKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9ldmVudHMnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9jaGlsZCcpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2xpZmVjeWNsZScpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IF8uVnVlID0gVnVlIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9leHByZXNzaW9uJylcbnZhciBiYXRjaGVyID0gcmVxdWlyZSgnLi9iYXRjaGVyJylcbnZhciB1aWQgPSAwXG5cbi8qKlxuICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZmlyZXMgY2FsbGJhY2sgd2hlbiB0aGUgZXhwcmVzc2lvbiB2YWx1ZSBjaGFuZ2VzLlxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXl9IGZpbHRlcnNcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB0d29XYXlcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBkZWVwXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdXNlclxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gV2F0Y2hlciAodm0sIGV4cHJlc3Npb24sIGNiLCBvcHRpb25zKSB7XG4gIHRoaXMudm0gPSB2bVxuICB2bS5fd2F0Y2hlckxpc3QucHVzaCh0aGlzKVxuICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uXG4gIHRoaXMuY2JzID0gW2NiXVxuICB0aGlzLmlkID0gKyt1aWQgLy8gdWlkIGZvciBiYXRjaGluZ1xuICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdGhpcy5kZWVwID0gISFvcHRpb25zLmRlZXBcbiAgdGhpcy51c2VyID0gISFvcHRpb25zLnVzZXJcbiAgdGhpcy5kZXBzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAvLyBzZXR1cCBmaWx0ZXJzIGlmIGFueS5cbiAgLy8gV2UgZGVsZWdhdGUgZGlyZWN0aXZlIGZpbHRlcnMgaGVyZSB0byB0aGUgd2F0Y2hlclxuICAvLyBiZWNhdXNlIHRoZXkgbmVlZCB0byBiZSBpbmNsdWRlZCBpbiB0aGUgZGVwZW5kZW5jeVxuICAvLyBjb2xsZWN0aW9uIHByb2Nlc3MuXG4gIGlmIChvcHRpb25zLmZpbHRlcnMpIHtcbiAgICB0aGlzLnJlYWRGaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLndyaXRlRmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycy53cml0ZVxuICB9XG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlci9zZXR0ZXJcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uLCBvcHRpb25zLnR3b1dheSlcbiAgdGhpcy5nZXR0ZXIgPSByZXMuZ2V0XG4gIHRoaXMuc2V0dGVyID0gcmVzLnNldFxuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKVxufVxuXG52YXIgcCA9IFdhdGNoZXIucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0RlcH0gZGVwXG4gKi9cblxucC5hZGREZXAgPSBmdW5jdGlvbiAoZGVwKSB7XG4gIHZhciBpZCA9IGRlcC5pZFxuICBpZiAoIXRoaXMubmV3RGVwc1tpZF0pIHtcbiAgICB0aGlzLm5ld0RlcHNbaWRdID0gZGVwXG4gICAgaWYgKCF0aGlzLmRlcHNbaWRdKSB7XG4gICAgICB0aGlzLmRlcHNbaWRdID0gZGVwXG4gICAgICBkZXAuYWRkU3ViKHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICovXG5cbnAuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmJlZm9yZUdldCgpXG4gIHZhciB2bSA9IHRoaXMudm1cbiAgdmFyIHZhbHVlXG4gIHRyeSB7XG4gICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBleHByZXNzaW9uIFwiJyArXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiArICdcIjpcXG4gICAnICsgZVxuICAgICAgKVxuICAgIH1cbiAgfVxuICAvLyBcInRvdWNoXCIgZXZlcnkgcHJvcGVydHkgc28gdGhleSBhcmUgYWxsIHRyYWNrZWQgYXNcbiAgLy8gZGVwZW5kZW5jaWVzIGZvciBkZWVwIHdhdGNoaW5nXG4gIGlmICh0aGlzLmRlZXApIHtcbiAgICB0cmF2ZXJzZSh2YWx1ZSlcbiAgfVxuICB2YWx1ZSA9IF8uYXBwbHlGaWx0ZXJzKHZhbHVlLCB0aGlzLnJlYWRGaWx0ZXJzLCB2bSlcbiAgdGhpcy5hZnRlckdldCgpXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIFNldCB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSB3aXRoIHRoZSBzZXR0ZXIuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5cbnAuc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciB2bSA9IHRoaXMudm1cbiAgdmFsdWUgPSBfLmFwcGx5RmlsdGVycyhcbiAgICB2YWx1ZSwgdGhpcy53cml0ZUZpbHRlcnMsIHZtLCB0aGlzLnZhbHVlXG4gIClcbiAgdHJ5IHtcbiAgICB0aGlzLnNldHRlci5jYWxsKHZtLCB2bSwgdmFsdWUpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoY29uZmlnLndhcm5FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdFcnJvciB3aGVuIGV2YWx1YXRpbmcgc2V0dGVyIFwiJyArXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiArICdcIjpcXG4gICAnICsgZVxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByZXBhcmUgZm9yIGRlcGVuZGVuY3kgY29sbGVjdGlvbi5cbiAqL1xuXG5wLmJlZm9yZUdldCA9IGZ1bmN0aW9uICgpIHtcbiAgT2JzZXJ2ZXIudGFyZ2V0ID0gdGhpc1xuICB0aGlzLm5ld0RlcHMgPSB7fVxufVxuXG4vKipcbiAqIENsZWFuIHVwIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cblxucC5hZnRlckdldCA9IGZ1bmN0aW9uICgpIHtcbiAgT2JzZXJ2ZXIudGFyZ2V0ID0gbnVsbFxuICBmb3IgKHZhciBpZCBpbiB0aGlzLmRlcHMpIHtcbiAgICBpZiAoIXRoaXMubmV3RGVwc1tpZF0pIHtcbiAgICAgIHRoaXMuZGVwc1tpZF0ucmVtb3ZlU3ViKHRoaXMpXG4gICAgfVxuICB9XG4gIHRoaXMuZGVwcyA9IHRoaXMubmV3RGVwc1xufVxuXG4vKipcbiAqIFN1YnNjcmliZXIgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgd2hlbiBhIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAqL1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFjb25maWcuYXN5bmMgfHwgY29uZmlnLmRlYnVnKSB7XG4gICAgdGhpcy5ydW4oKVxuICB9IGVsc2Uge1xuICAgIGJhdGNoZXIucHVzaCh0aGlzKVxuICB9XG59XG5cbi8qKlxuICogQmF0Y2hlciBqb2IgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgYnkgdGhlIGJhdGNoZXIuXG4gKi9cblxucC5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KClcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fFxuICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHxcbiAgICAgIHRoaXMuZGVlcFxuICAgICkge1xuICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB2YXIgY2JzID0gdGhpcy5jYnNcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2JzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjYnNbaV0odmFsdWUsIG9sZFZhbHVlKVxuICAgICAgICAvLyBpZiBhIGNhbGxiYWNrIGFsc28gcmVtb3ZlZCBvdGhlciBjYWxsYmFja3MsXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBsb29wIGFjY29yZGluZ2x5LlxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGwgLSBjYnMubGVuZ3RoXG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgaSAtPSByZW1vdmVkXG4gICAgICAgICAgbCAtPSByZW1vdmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbnAuYWRkQ2IgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdGhpcy5jYnMucHVzaChjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbnAucmVtb3ZlQ2IgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdmFyIGNicyA9IHRoaXMuY2JzXG4gIGlmIChjYnMubGVuZ3RoID4gMSkge1xuICAgIHZhciBpID0gY2JzLmluZGV4T2YoY2IpXG4gICAgaWYgKGkgPiAtMSkge1xuICAgICAgY2JzLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfSBlbHNlIGlmIChjYiA9PT0gY2JzWzBdKSB7XG4gICAgdGhpcy50ZWFyZG93bigpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YmNyaWJlciBsaXN0LlxuICovXG5cbnAudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcbiAgICAvLyB3ZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB2bSBpZiBiZWluZyBkZXN0cm95ZWRcbiAgICAvLyB3aGljaCBjYW4gaW1wcm92ZSB0ZWFyZG93biBwZXJmb3JtYW5jZS5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHZhciBsaXN0ID0gdGhpcy52bS5fd2F0Y2hlckxpc3RcbiAgICAgIHZhciBpID0gbGlzdC5pbmRleE9mKHRoaXMpXG4gICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgIGxpc3Quc3BsaWNlKGksIDEpXG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGlkIGluIHRoaXMuZGVwcykge1xuICAgICAgdGhpcy5kZXBzW2lkXS5yZW1vdmVTdWIodGhpcylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMudm0gPSB0aGlzLmNicyA9IHRoaXMudmFsdWUgPSBudWxsXG4gIH1cbn1cblxuXG4vKipcbiAqIFJlY3J1c2l2ZWx5IHRyYXZlcnNlIGFuIG9iamVjdCB0byBldm9rZSBhbGwgY29udmVydGVkXG4gKiBnZXR0ZXJzLCBzbyB0aGF0IGV2ZXJ5IG5lc3RlZCBwcm9wZXJ0eSBpbnNpZGUgdGhlIG9iamVjdFxuICogaXMgY29sbGVjdGVkIGFzIGEgXCJkZWVwXCIgZGVwZW5kZW5jeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxuZnVuY3Rpb24gdHJhdmVyc2UgKG9iaikge1xuICB2YXIga2V5LCB2YWwsIGlcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgdmFsID0gb2JqW2tleV1cbiAgICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGkgPSB2YWwubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB0cmF2ZXJzZSh2YWxbaV0pXG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIHRyYXZlcnNlKHZhbClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaGVyIiwidmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpXG5cbnZhciBhcHAgPSBuZXcgVnVlKHJlcXVpcmUoJy4vYXBwJykpXG5cbmFwcC4kbW91bnQoZG9jdW1lbnQuYm9keSlcbiJdfQ==
