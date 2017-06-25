/**
 * mysql tool page
 */
	$('#btn').on('click',async ()=>{
		let txt=$.trim($('textarea').val());
		if(!txt){return;}
		$('#table').empty();
		try{
			let data=await submitForm(txt);
			$('#table').html(renderArr(data.ret));
		} catch(err){
			console.log(err);
			$('#table').html(renderObj(err));
		}
		
	});

	// 绑定回车
	$(document).keydown(event=>{
		if(event.keyCode==13){
			$('#btn').trigger('click');
		}
	});

	// 提交表单
	function submitForm(val){
		return new Promise((resolve,reject)=>{
			$.ajax({
				type:'post',
				data:{cmd:val },
				url:'/sql',
				dataType:'json'
			})
			.done(resolve)
			.error(reject);
		});
	}

	// 渲染数组
	function renderArr(arr){
		if(!arr)return;
		if(!Array.isArray(arr)) return renderObj(arr);
		let html='';

		~function createHtml(rows){
			let [ths,trs,index]=['','',0];
			let {keys, values, entries} = Object;
			// 遍历数组
			for(let [i,row] of rows.entries()){
				if(row instanceof Array){//数组嵌套数组，递归调用
					createHtml(row);
					index=0;
					continue;
				}
				let td='';
				for(let [key,value] of entries(row)){
					if(typeof value =='function') continue;
					if(index==0){ths+=`<th>${key}</th>`;}
					td+=`<td>${value}</td>`;
				}
				index++;
				trs+=`<tr>${td}</tr>`;
			}
			html+= `<table><thead><tr>${ths?ths:'<th>not results</th>'}</tr></thead><tbody>${trs}</tbody></table>`;
		}(arr);

		return html;
	}

	// 渲染对象
	function renderObj(obj){
		if(!obj)return;
		if(Array.isArray(obj))return renderArr(obj);
		let [ths,tds]=['',''];
		for(let [key,value] of Object.entries(obj)){
			if(typeof value =='function') continue;
			ths+=`<th>${key}</th>`;
			tds+=`<td>${value}</td>`;
		}
		return `<table><thead><tr>${ths}</tr></thead><tbody><tr>${tds}</tr></tbody></table>`;
	}
