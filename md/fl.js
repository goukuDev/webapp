import './../scss/fl.scss';
import car from './car.js';
import myajax from './myajax.js';

export default{
    loadHeader(){
        $('#header').load('view/fl.html #flHeader',function(){
            $('#flHeader .rt').on('tap',function(){
            	car.loadHeader('fl');
				car.loadContent();
				$('#footer').css('display','none')
            })
        })
    },
    loadContent(){
        $('#content').load('view/fl.html #flContent',function(){
        	var obj={
        		url:"http://mce.mogucdn.com/jsonp/multiget/3?pids=41789%2C4604&callback=?",
        		type:"get",
        	}
        	//ajax请求左边数据
          	myajax.myajax(obj,function(data){
          		var add=data.data[41789].list
          		console.log(add)
          		for(var item of add){
          			$('#flContent .left').append('<div idt='+item.maitKey+'  idb='+item.miniWallkey+'>'+
							'<p>'+item.title+'</p>'+
						'</div>')
          		}
          		
          		
          		//点击右边选项后会从上面的ajax中获取数据用于下面
          		$('#flContent .left div').on('tap',function(){
          			//点击开始后先清空原来的数据
          			$('.right .top').html('');
	          		var index=$(this).index();
	          		$(this).addClass("dl").siblings().removeClass("dl");
	          		//点击后调出右边上面数据
	          		var idt=$(this).attr('idt')
	          		console.log(idt)
	          		var obja={		        		url:"http://mce.mogujie.com/jsonp/makeup/3?pid="+idt+"&_=1501216757071&callback=?",
		        		type:"get",
		        	}
		          	myajax.myajax(obja,function(data){
		          		var oj=data.data.categoryNavigation.list
		          		for(var item of oj){
		          			$('.right .top').append('<a href="'+item.link+'">'+
								'<img src="'+item.image+'" alt="" />'+
								'<span>'+item.title+'</span>'+
							'</a>')
		          		}
		          	})
		          	//点击后调出右边上面数据
		          	var idb=$(this).attr('idb')
		          	console.log(idb)
		          	var objb={		        		url:"https://list.mogujie.com/search?cKey=h5-cube&fcid="+idb+"&page=1&_version=1&pid=&q=&_=1501229961360&callback=?",
		        		type:"get",
		        	}
		          	//点击开始后先清空原来的数据
		          	$('.right .cent').html('')
		          	$('.right .btm').html('')
		          	myajax.myajax(objb,function(data){
		          		console.log(data.result.wall.docs)
		          		//生成排序列表
		          		var lists=data.result.sortFilter
		          		for(var item of lists){
		          			$('.right .cent').append('<a href="javascript:;"><span>'+item.title+'</span></a>')
		          		}
		          		//生成内容区
		          		var words=data.result.wall.docs
		          		for(var item of words){
		          			if(item.title !== undefined){
		          				$('.right .btm').append('<a href="'+item.link+'">'+
									'<img src="'+item.img+'" alt="" />'+
									'<p class="buy">已售'+item.sale+'</p>'+
									'<p class="msg">'+item.title+'</p>'+
									'<div>'+
										'<span>￥'+item.price+'</span>'+
										'<span>'+item.cfav+'<b class="iconfont">&#xe684;</b></span>'+
									'</div>'+
								'</a>')
		          			}
		          		}
		          	})
	          	})
        	})  	
        
        	//刷新出现右上面的图案
        	var obja={		        		
        		url:"http://mce.mogujie.com/jsonp/makeup/3?pid=41888&_=1501216757071&callback=?",
        		type:"get",
        	}
          	myajax.myajax(obja,function(data){
          		var oj=data.data.categoryNavigation.list
          		for(var item of oj){
          			$('.right .top').append('<a href="'+item.link+'">'+
						'<img src="'+item.image+'" alt="" />'+
						'<span>'+item.title+'</span>'+
					'</a>')
          		}
          	})
          	//刷新出现下面的图案
          	var objb={		        						url:"https://list.mogujie.com/search?cKey=h5-cube&fcid=10062603&page=1&_version=1&pid=&q=&_=1501229961360&callback=?",
		        		type:"get",
		        	}
          	myajax.myajax(objb,function(data){
          		console.log(data.result.wall.docs)
          		//生成排序列表
          		var lists=data.result.sortFilter
          		for(var item of lists){
          			$('.right .cent').append('<a href="javascript:;"><span>'+item.title+'</span></a>')
          		}
          		//生成内容区
          		var words=data.result.wall.docs
          		console.log(words)
          		for(var item of words){
          			if(item.title !== undefined){
          				$('.right .btm').append('<a href="'+item.link+'">'+
							'<img src="'+item.img+'" alt="" />'+
							'<p class="buy">已售'+item.sale+'</p>'+
							'<p class="msg">'+item.title+'</p>'+
							'<div>'+
								'<span>￥'+item.price+'</span>'+
								'<span>'+item.cfav+'<b class="iconfont">&#xe684;</b></span>'+
							'</div>'+
						'</a>')
          			}
          		}
          	})
          	
          	
          	
          	
          	
          	
          		
          		
        });
          	
          	
          	
          	
          	
        
    }
}
