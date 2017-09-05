import './../scss/mine.scss';
import shouye from './shouye.js'
import rejust from './rejust.js'
import footer from './footer.js'
import toldbox from './toldbox.js'
export default{
	loadHeader(){
        $('#header').load('view/mine.html #mineHeader',function(){
            $('#mineHeader .left').on('tap',function(){
            	shouye.loadHeader();
				shouye.loadContent();
				footer.loadFooter(0)
				$('#footer').css('display','block')
            })
        })
    },
    loadContent(){
        $('#content').load('view/mine.html #mineContent',function(){
        	
        	$('.minebox .dl').on('tap',function(){
        		var username=$('.minebox .int1').val();
	          	var pwd=$('.minebox .int2').val(); 
	          	if(username==''||pwd==''){
	          		toldbox.dl('请输入完整信息',3200)
	          	}else{
	          		if(String(localStorage.getItem('username'))!=username){
	          			/*var username=$('.minebox .int1').val();
		          		var pwd=$('.minebox .int2').val(); 
	          			localStorage.setItem('username',username)
	          			localStorage.setItem('pwd',pwd)
	          			$('.minebox .int1').val('');
	          			$('.minebox .int2').val(''); 
	          			toldbox.tb('注册成功',3200)*/
	          			toldbox.dl('用户名输入错误',3200)
	          			$('.minebox .int1').val('');
	          			$('.minebox .int2').val('');
	          		}else{
	          			if(localStorage.getItem('pwd')!=pwd){
	          				/*toldbox.tb('用户名重名',3200)
	          				$('.minebox .int1').val('');
	          				$('.minebox .int2').val(''); */
	          				toldbox.dl('密码有误',3200)
	          				$('.minebox .int2').val('');
	          			}else{
	          				toldbox.dl('登录成功',1200)
	          				$('.minebox .int1').val('');
	          				$('.minebox .int2').val('');
	          				setTimeout(function(){
	          					shouye.loadHeader();
								shouye.loadContent();
								footer.loadFooter(0)
								$('#footer').css('display','block')
	          				},1000)
	          			}
	          		}
	          	}
        	})
          	$('.dlp .zczh').on('tap',function(){
          		rejust.loadHeader();
				rejust.loadContent();
				$('#footer').css('display','none')
          	})
        })
    }
}