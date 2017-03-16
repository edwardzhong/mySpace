	let returnUrl='';
	let matchs=location.href.match(/returnUrl=([^=?&]+)/);
	if(matchs){
		returnUrl=decodeURIComponent(matchs[1]);
	}
	$('#login').on('click',async event=>{
		let email=$('#email').val().trim();
		let password=$('#password').val().trim();
		if(!email||!password){
			alert('值不能为空！');
			return;
		}
		try{
			let data= await $.post('/login',{email:email,password:password});
			if(data.status==0){
				location.href=returnUrl?returnUrl:'/';
			} else {
				alert(data.msg);
			}
			
		} catch(err){
			console.log(err)
			alert(err.responseText);
		}
	});
	$('#register').on('click', async (event) => {
	    let [name, email, password] = [$('#rName').val().trim(), $('#rEmail').val().trim(), $('#rPassword').val().trim()];
	    if (!name || !email || !password) {
	        alert('值不能为空！');
	        return;
	    }
	    try{
		    let data = await $.post('/register',{
		    	name:name,
		    	email:email,
		    	password:password
		    });
		    if(data.status==0){
		    	alert('注册成功！');
		    	location.href='/';
		    } else {
		    	alert('注册失败！');
		    }
		    
	    } catch(err){
	    	console.log(err);
	    	alert(err.message);
	    }
	});

	let $main=$('.main'),
		divs=$main.children('div'),
		firstLoad=true;
	function selectHash(hash){
		if (location.hash.substr(1) != hash) {//同步hash
            location.hash = hash;
            return;
        }
        let args=hash.split('/');
        let actionName=args[0];
        if (!actionName || !(actionName in Actions)) {
            selectHash('login');
        } else {
            Actions[actionName].apply(this,args);
            firstLoad=false;
        }
	}
	let Actions={
		login:function(){
			if(firstLoad){
				divs.last().hide();
				divs.first().show();
				$main.css({height:'300px'});
				return;
			}
			divs.last().hide().css('opacity','0.3');
			divs.first().show().animate({opacity:1}, 600,'swing');
			$main.animate({height:'300px'}, 400,'swing');
		},
		register:function(){
			if(firstLoad){
				divs.first().hide();
				divs.last().show();
				$main.css({height:'340px'});
				return;
			}
			divs.first().hide().css('opacity','0.3');
			divs.last().show().animate({opacity:1}, 600);
			$main.animate({height:'340px'}, 400);
		}
	};

	$(window).on('hashchange', function(e) {
        selectHash(location.hash.replace('#', ''));
    });
    selectHash(location.hash.substr(1));
