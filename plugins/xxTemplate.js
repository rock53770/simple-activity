
;(function (window, document) {
	var xxTPL = function (tpl) {
		//处理特殊字符 单引号' 反斜杠\ 换行\n 回车\r 行分隔符u2028 段落分隔符u2029
		var escapes = {//对应处理
			"'": "'",
			'\\':'\\',
			'\r':'r',
			'\n':'n',
			'\u2028':'u2028',
			'\u2029':'u2029'
		};
		//匹配特殊字符
		var escapeReg = /\\|'|\r|\n|\u2028|\u2029/g;
		//其实就是阻止反斜杠被转义
		var escapeChar = function(m){
			return '\\'+ escapes[m];
		}
		//设置插值、插入表达式对应的正则可配
		var settings = {
			eval:/<%=([\s\S]+?)%>/g, //插值
			inter:/<%([\s\S]+?)%>/g, //插入js语句
		}
		//抄袭underscore，优化replace
		var index = 0;
		var matcher = RegExp([
			(settings.eval).source,
			(settings.inter).source
		].join("|")+"|$", "g");//|$的目的是在replace的时候，offset获取到字符串的结束位置的索引
		//字符首部
		var code = "var __t;var __p = '';\n __p+='";
		//字符串替换
		tpl.replace(matcher,function(match,eval,inter,offset){
			code+=tpl.slice(index, offset).replace(escapeReg, escapeChar);//不是模板字符的字符串走常规匹配
			index = offset+match.length;//tpl截取后,index改为这次模板字符匹配结束后的索引值

			if(eval){//如果匹配到插值
				code += "'+ ((__t=("+eval+"))==null?'':__t) +'";
			}else if(inter){//如果匹配到js语句
				code += "';\n "+ inter +"\n __p+='";
			}

			return code;
		})
		//字符结尾处
		code += "';\n return __p";

		//声明函数,这个函数体里的内容会根据模板动态修改
		var fn = new Function("data", code);//这样声明的函数的最后一个参数是个字符串，它包含整个函数体的代码

		//声明渲染函数，为了链式调用，所以使用this
		var render = function (data) {
			return fn.apply(this, [data]);
		}
		return render;
	};

	window.xxTPL = xxTPL;
	

})(window, document);