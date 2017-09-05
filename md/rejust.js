import './../scss/rejust.scss';
import mine from './mine.js'
import toldbox from './toldbox.js'
export default{
	loadHeader(){
        $('#header').load('view/rejust.html #rejustHeader',function(){
            $('#rejustHeader .left').on('tap',function(){
            	mine.loadHeader();
				mine.loadContent();
				$('#footer').css('display','none')
            })
        })
    },
    loadContent(){
        $('#content').load('view/rejust.html #rejustContent',function(){
	          $('.rejustbox .zc').on('tap',function(){
		          	var username=$('.rejustbox .int1').val();
		          	var pwd=$('.rejustbox .int2').val(); 
		          	if(username==''||pwd==''){
		          		toldbox.zc('请输入完整信息',3200)
		          	}else{
		          		if(String(localStorage.getItem('username'))!=username){
		          			var username=$('.rejustbox .int1').val();
			          		var pwd=$('.rejustbox .int2').val(); 
		          			localStorage.setItem('username',username)
		          			localStorage.setItem('pwd',pwd)
		          			$('.rejustbox .int1').val('');
		          			$('.rejustbox .int2').val(''); 
		          			toldbox.zc('注册成功',3200)
		          		}else{
		          			if(localStorage.getItem('username')==username){
		          				toldbox.zc('用户名重名',3200)
		          				$('.rejustbox .int1').val('');
		          				$('.rejustbox .int2').val(''); 
		          			}
		          		}
		          	}
		          	
	          		

	          		
	
	          })
          
         
        })
    }
}