/**
 * html转码
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function htmlEncode(str){  
	if(!str) return '';
	return str.replace(/&/g,'&amp;')
		.replace(/</g,'&lt;')
		.replace(/>/g,'&gt;')
		.replace(/ /g,'&nbsp;')
		.replace(/\'/g,'&#39;')
		.replace(/\"/g,'&quot;');
}
/**
 * html解码
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function htmlDecode (str){  
	if(!str) return '';
	return str.replace(/&amp;/g,"&")
		.replace(/&lt;/g,'<')
		.replace(/&gt;/g,'>')
		.replace(/&nbsp;/g,' ')
		.replace(/&#39;/g,'\'')
		.replace(/&quot;/g,'\"');
}

/**
 * 计算字符串文字数量(拉丁中日韩字符)
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function wordCount(data) {
	var pattern = /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
	var m = data.match(pattern);
	var count = 0;
	if(m === null) return count;
	for(var i = 0; i < m.length; i++) {
		if(m[i].charCodeAt(0) >= 0x4E00) {
			count += m[i].length;
		} else {
			count += 1;
		}
	}
	return count;
}

/**
 * 过滤html标签选取前n个字符作为简介,大于第n个则加...
 * @param  {[type]} str [description]
 * @param  {[type]} n   [description]
 * @return {[type]}     [description]
 */
function getContentSummary(marked,str,n){
	let replaceHtmlTags=str=>str.replace(/<\s*\/?\s*\w+[\S\s]*?>/g,''),//过滤掉html标签
		pattern=/^[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+/,
		ret='',count=0,m;
	str=replaceHtmlTags(marked(htmlDecode(str)));

	while(str.length){
		if((m=str.match(pattern))){//拉丁文字
			count++;
			ret+=m[0];
			str=str.substr(m[0].length);
		} else {
			if(str.charCodeAt(0)>=0x4E00){//中日韩文字
				count++;
			}
			ret+=str.charAt(0);
			str=str.substr(1);
		}
		if(count>n){
			ret+='...';
			break;
		}
	}
	return ret;	
}

/**
 * 到目前为止的时间
 * @param  {[type]} ints [description]
 * @return {[type]}       [description]
 */
function soFarDateString(ints){
	let oDate=new Date(ints*1000),
		cDate=new Date(),
		times=cDate-oDate,
		y=oDate.getFullYear(),
		M=oDate.getMonth(),
		d=('0'+oDate.getDate()).slice(-2),
		h=('0'+oDate.getHours()).slice(-2),
		m=('0'+oDate.getMinutes()).slice(-2),
		s=('0'+oDate.getSeconds()).slice(-2),
		sec=1000,
		min=sec*60,
		hour=min*60,
		day=hour*24,
		division=0,
		ret='';

	//xx年前
	if((division=cDate.getFullYear()-y)>0){
		if(division==1){
			return `去年${M+1}月${d}日 ${h}:${m}:${s}`
		} else {
			return `${y}/${M+1}/${d} ${h}:${m}:${s}`;
		}
	}
	//xx月前
	if((division=cDate.getMonth()-M)>0){
		if(division==1){
			return `上个月${d}日 ${h}:${m}:${s}`;
		} else {
			return `${y}/${M+1}/${d} ${h}:${m}:${s}`;
		}
	}
	//xx天前
	if((division=cDate.getDate()-d)>0){
		if(division==1){
			return `昨天 ${h}:${m}:${s}`;
		} else if(division==2){
			return `前天 ${h}:${m}:${s}`;
		} else {
			return `${y}/${M+1}/${d} ${h}:${m}:${s}`;
		}
	}
	//当天则显示 xx小时, xx分钟, xx秒前
	if((division=Math.floor(times/hour))>0){
		return division+'小时前'
		// ret+=division+'小时前';
		// times-=division*hour;
	}
	if((division=Math.floor(times/min))>0){
		return division+'分钟前';
		// ret+=division+'分钟前';
		// times-=division*min;
	}
	if((division=Math.floor(times/sec))>0){
		return division+'秒前'
		// ret+=division+'秒前';
	}
	return '刚刚';
	// return ret;
}

module.exports={
	htmlEncode,
	htmlDecode,
	wordCount,
	getContentSummary,
	soFarDateString
};