import './../scss/search.scss';
import shouye from './shouye.js';


export default{
	loadHeader(){
		$('#header').load('view/search.html #searchHeader',function(){
			//点击后返回首页
			$('.left').on('tap',function(){
				shouye.loadHeader();
				shouye.loadContent();
				$('#footer').css('display','block')
			});
			//请求搜索框数据
			$.ajax({
				type:"get",
				url:"http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?",
				success:function(data){
					$('.box').append('<input type="text" placeholder="'+data.data.sketch.data.query+'" class="find"/>')
				}
			})
		})
	},
	loadContent(){
		$('#content').load('view/search.html #searchContent',function(){
			//显示搜索记录
			if(String(localStorage.getItem('history'))=='null'){
				$('.scont').append('<span class="sh">暂无历史搜索</span>')
			}else{
				$('.scont').append('<span class="sh hs">'+localStorage.getItem('history')+'</span>')
			}
			//点击后清空历史记录
			$('.srt').on('tap',function(){
				localStorage.clear()
			})
			//请求热搜数据
			$.ajax({
				type:'get',
				url:"http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?",
				success:function(res){
					var obj=res.data.hotWord.data
					console.log(obj)
					for(var item of obj){
						$('.hot .cont').append('<a href="'+item.link+'"style=color:'+item.color+'>'+item.frontword+'</a>')
					}
					
				}
			});
		})
	}
}
