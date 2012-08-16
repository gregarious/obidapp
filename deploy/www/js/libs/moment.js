// moment.js
// version : 1.7.0
// author : Tim Wood
// license : MIT
// momentjs.com

(function(e,t){function _(e,t,n){this._d=e,this._isUTC=!!t,this._a=e._a||null,e._a=null,this._lang=n||!1}function D(e){var t=this._data={},n=e.years||e.y||0,r=e.months||e.M||0,i=e.weeks||e.w||0,s=e.days||e.d||0,o=e.hours||e.h||0,u=e.minutes||e.m||0,a=e.seconds||e.s||0,f=e.milliseconds||e.ms||0;this._milliseconds=f+a*1e3+u*6e4+o*36e5,this._days=s+i*7,this._months=r+n*12,t.milliseconds=f%1e3,a+=P(f/1e3),t.seconds=a%60,u+=P(a/60),t.minutes=u%60,o+=P(u/60),t.hours=o%24,s+=P(o/24),s+=i*7,t.days=s%30,r+=P(s/30),t.months=r%12,n+=P(r/12),t.years=n,this._lang=!1}function P(e){return e<0?Math.ceil(e):Math.floor(e)}function H(e,t){var n=e+"";while(n.length<t)n="0"+n;return n}function B(e,t,n){var r=t._milliseconds,i=t._days,s=t._months,o;r&&e._d.setTime(+e+r*n),i&&e.date(e.date()+i*n),s&&(o=e.date(),e.date(1).month(e.month()+s*n).date(Math.min(o,e.daysInMonth())))}function j(e){return Object.prototype.toString.call(e)==="[object Array]"}function F(e,t){var n=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),i=0,s;for(s=0;s<n;s++)~~e[s]!==~~t[s]&&i++;return i+r}function I(t,n){var r,i;for(r=1;r<7;r++)t[r]=t[r]==null?r===2?1:0:t[r];return t[7]=n,i=new e(0),n?(i.setUTCFullYear(t[0],t[1],t[2]),i.setUTCHours(t[3],t[4],t[5],t[6])):(i.setFullYear(t[0],t[1],t[2]),i.setHours(t[3],t[4],t[5],t[6])),i._a=t,i}function q(e,t){var r,i,s=[];!t&&a&&(t=require("./lang/"+e));for(r=0;r<f.length;r++)t[f[r]]=t[f[r]]||o.en[f[r]];for(r=0;r<12;r++)i=n([2e3,r]),s[r]=new RegExp("^"+(t.months[r]||t.months(i,""))+"|^"+(t.monthsShort[r]||t.monthsShort(i,"")).replace(".",""),"i");return t.monthsParse=t.monthsParse||s,o[e]=t,t}function R(e){var t=typeof e=="string"&&e||e&&e._lang||null;return t?o[t]||q(t):n}function U(e){return A[e]?"'+("+A[e]+")+'":e.replace(p,"").replace(/\\?'/g,"\\'")}function z(e){return R().longDateFormat[e]||e}function W(e){var t="var a,b;return '"+e.replace(c,U)+"';",n=Function;return new n("t","v","o","p","m",t)}function X(e){return L[e]||(L[e]=W(e)),L[e]}function V(e,t){function r(r,i){return n[r].call?n[r](e,t):n[r][i]}var n=R(e);while(h.test(t))t=t.replace(h,z);return L[t]||(L[t]=W(t)),L[t](e,r,n.ordinal,H,n.meridiem)}function $(e){switch(e){case"DDDD":return g;case"YYYY":return y;case"S":case"SS":case"SSS":case"DDD":return m;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return b;case"Z":case"ZZ":return w;case"T":return E;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return v;default:return new RegExp(e.replace("\\",""))}}function J(e,t,n,r){var i;switch(e){case"M":case"MM":n[1]=t==null?0:~~t-1;break;case"MMM":case"MMMM":for(i=0;i<12;i++)if(R().monthsParse[i].test(t)){n[1]=i;break}break;case"D":case"DD":case"DDD":case"DDDD":t!=null&&(n[2]=~~t);break;case"YY":t=~~t,n[0]=t+(t>70?1900:2e3);break;case"YYYY":n[0]=~~Math.abs(t);break;case"a":case"A":r.isPm=(t+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":n[3]=~~t;break;case"m":case"mm":n[4]=~~t;break;case"s":case"ss":n[5]=~~t;break;case"S":case"SS":case"SSS":n[6]=~~(("0."+t)*1e3);break;case"Z":case"ZZ":r.isUTC=!0,i=(t+"").match(N),i&&i[1]&&(r.tzh=~~i[1]),i&&i[2]&&(r.tzm=~~i[2]),i&&i[0]==="+"&&(r.tzh=-r.tzh,r.tzm=-r.tzm)}}function K(e,t){var n=[0,0,1,0,0,0,0],r={tzh:0,tzm:0},i=t.match(c),s,o;for(s=0;s<i.length;s++)o=($(i[s]).exec(e)||[])[0],e=e.replace($(i[s]),""),J(i[s],o,n,r);return r.isPm&&n[3]<12&&(n[3]+=12),r.isPm===!1&&n[3]===12&&(n[3]=0),n[3]+=r.tzh,n[4]+=r.tzm,I(n,r.isUTC)}function Q(e,t){var n,r=e.match(d)||[],i,s=99,o,u,a;for(o=0;o<t.length;o++)u=K(e,t[o]),i=V(new _(u),t[o]).match(d)||[],a=F(r,i),a<s&&(s=a,n=u);return n}function G(t){var n="YYYY-MM-DDT",r;if(S.exec(t)){for(r=0;r<4;r++)if(T[r][1].exec(t)){n+=T[r][0];break}return w.exec(t)?K(t,n+" Z"):K(t,n)}return new e(t)}function Y(e,t,n,r,i){var s=i.relativeTime[e];return typeof s=="function"?s(t||1,!!n,e,r):s.replace(/%d/i,t||1)}function Z(e,t,n){var r=i(Math.abs(e)/1e3),s=i(r/60),o=i(s/60),u=i(o/24),a=i(u/365),f=r<45&&["s",r]||s===1&&["m"]||s<45&&["mm",s]||o===1&&["h"]||o<22&&["hh",o]||u===1&&["d"]||u<=25&&["dd",u]||u<=45&&["M"]||u<345&&["MM",i(u/30)]||a===1&&["y"]||["yy",a];return f[2]=t,f[3]=e>0,f[4]=n,Y.apply({},f)}function et(e,t){n.fn[e]=function(e){var n=this._isUTC?"UTC":"";return e!=null?(this._d["set"+n+t](e),this):this._d["get"+n+t]()}}function tt(e){n.duration.fn[e]=function(){return this._data[e]}}function nt(e,t){n.duration.fn["as"+e]=function(){return+this/t}}var n,r="1.7.0",i=Math.round,s,o={},u="en",a=typeof module!="undefined"&&module.exports,f="months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),l=/^\/?Date\((\-?\d+)/i,c=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?)/g,h=/(LT|LL?L?L?)/g,p=/(^\[)|(\\)|\]$/g,d=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,v=/\d\d?/,m=/\d{1,3}/,g=/\d{3}/,y=/\d{1,4}/,b=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,w=/Z|[\+\-]\d\d:?\d\d/i,E=/T/i,S=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,x="YYYY-MM-DDTHH:mm:ssZ",T=[["HH:mm:ss.S",/T\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],N=/([\+\-]|\d\d)/gi,C="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),k={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},L={},A={M:"(a=t.month()+1)",MMM:'v("monthsShort",t.month())',MMMM:'v("months",t.month())',D:"(a=t.date())",DDD:"(a=new Date(t.year(),t.month(),t.date()),b=new Date(t.year(),0,1),a=~~(((a-b)/864e5)+1.5))",d:"(a=t.day())",dd:'v("weekdaysMin",t.day())',ddd:'v("weekdaysShort",t.day())',dddd:'v("weekdays",t.day())',w:"(a=new Date(t.year(),t.month(),t.date()-t.day()+5),b=new Date(a.getFullYear(),0,4),a=~~((a-b)/864e5/7+1.5))",YY:"p(t.year()%100,2)",YYYY:"p(t.year(),4)",a:"m(t.hours(),t.minutes(),!0)",A:"m(t.hours(),t.minutes(),!1)",H:"t.hours()",h:"t.hours()%12||12",m:"t.minutes()",s:"t.seconds()",S:"~~(t.milliseconds()/100)",SS:"p(~~(t.milliseconds()/10),2)",SSS:"p(t.milliseconds(),3)",Z:'((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(a/60),2)+":"+p(~~a%60,2)',ZZ:'((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(10*a/6),4)'},O="DDD w M D d".split(" "),M="M D H h m s w".split(" ");while(O.length)s=O.pop(),A[s+"o"]=A[s]+"+o(a)";while(M.length)s=M.pop(),A[s+s]="p("+A[s]+",2)";A.DDDD="p("+A.DDD+",3)",n=function(r,i){if(r===null||r==="")return null;var s,o;return n.isMoment(r)?new _(new e(+r._d),r._isUTC,r._lang):(i?j(i)?s=Q(r,i):s=K(r,i):(o=l.exec(r),s=r===t?new e:o?new e(+o[1]):r instanceof e?r:j(r)?I(r):typeof r=="string"?G(r):new e(r)),new _(s))},n.utc=function(e,t){return j(e)?new _(I(e,!0),!0):(typeof e=="string"&&!w.exec(e)&&(e+=" +0000",t&&(t+=" Z")),n(e,t).utc())},n.unix=function(e){return n(e*1e3)},n.duration=function(e,t){var r=n.isDuration(e),i=typeof e=="number",s=r?e._data:i?{}:e,o;return i&&(t?s[t]=e:s.milliseconds=e),o=new D(s),r&&(o._lang=e._lang),o},n.humanizeDuration=function(e,t,r){return n.duration(e,t===!0?null:t).humanize(t===!0?!0:r)},n.version=r,n.defaultFormat=x,n.lang=function(e,t){var r;if(!e)return u;(t||!o[e])&&q(e,t);if(o[e]){for(r=0;r<f.length;r++)n[f[r]]=o[e][f[r]];n.monthsParse=o[e].monthsParse,u=e}},n.langData=R,n.isMoment=function(e){return e instanceof _},n.isDuration=function(e){return e instanceof D},n.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(e){var t=e%10;return~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th"}}),n.fn=_.prototype={clone:function(){return n(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this._d.toString()},toDate:function(){return this._d},toArray:function(){var e=this;return[e.year(),e.month(),e.date(),e.hours(),e.minutes(),e.seconds(),e.milliseconds(),!!this._isUTC]},isValid:function(){return this._a?!F(this._a,(this._a[7]?n.utc(this):this).toArray()):!isNaN(this._d.getTime())},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(e){return V(this,e?e:n.defaultFormat)},add:function(e,t){var r=t?n.duration(+t,e):n.duration(e);return B(this,r,1),this},subtract:function(e,t){var r=t?n.duration(+t,e):n.duration(e);return B(this,r,-1),this},diff:function(e,t,r){var s=this._isUTC?n(e).utc():n(e).local(),o=(this.zone()-s.zone())*6e4,u=this._d-s._d-o,a=this.year()-s.year(),f=this.month()-s.month(),l=this.date()-s.date(),c;return t==="months"?c=a*12+f+l/30:t==="years"?c=a+(f+l/30)/12:c=t==="seconds"?u/1e3:t==="minutes"?u/6e4:t==="hours"?u/36e5:t==="days"?u/864e5:t==="weeks"?u/6048e5:u,r?c:i(c)},from:function(e,t){return n.duration(this.diff(e)).lang(this._lang).humanize(!t)},fromNow:function(e){return this.from(n(),e)},calendar:function(){var e=this.diff(n().sod(),"days",!0),t=this.lang().calendar,r=t.sameElse,i=e<-6?r:e<-1?t.lastWeek:e<0?t.lastDay:e<1?t.sameDay:e<2?t.nextDay:e<7?t.nextWeek:r;return this.format(typeof i=="function"?i.apply(this):i)},isLeapYear:function(){var e=this.year();return e%4===0&&e%100!==0||e%400===0},isDST:function(){return this.zone()<n([this.year()]).zone()||this.zone()<n([this.year(),5]).zone()},day:function(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return e==null?t:this.add({d:e-t})},startOf:function(e){switch(e.replace(/s$/,"")){case"year":this.month(0);case"month":this.date(1);case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return this},endOf:function(e){return this.startOf(e).add(e.replace(/s?$/,"s"),1).subtract("ms",1)},sod:function(){return this.clone().startOf("day")},eod:function(){return this.clone().endOf("day")},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return n.utc([this.year(),this.month()+1,0]).date()},lang:function(e){return e===t?R(this):(this._lang=e,this)}};for(s=0;s<C.length;s++)et(C[s].toLowerCase(),C[s]);et("year","FullYear"),n.duration.fn=D.prototype={weeks:function(){return P(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(e){var t=+this,n=this.lang().relativeTime,r=Z(t,!e,this.lang());return e&&(r=(t<=0?n.past:n.future).replace(/%s/i,r)),r},lang:n.fn.lang};for(s in k)k.hasOwnProperty(s)&&(nt(s,k[s]),tt(s.toLowerCase()));nt("Weeks",6048e5),a&&(module.exports=n),typeof ender=="undefined"&&(this.moment=n),typeof define=="function"&&define.amd&&define("moment",[],function(){return n})}).call(this,Date)