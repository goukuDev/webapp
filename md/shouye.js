import './../scss/shouye.scss';
import search from './search.js';
import myajax from './myajax.js';
import car from './car.js';
import fl from './fl.js';
import mine from './mine.js';
import shouye from './shouye.js';
export default{
	loadHeader(){
		$('#header').load('view/shouye.html #shouyeHeader',function(){
			//点击进入搜索框
			$('.box').on('tap',function(){
				search.loadHeader();
				$('')
				search.loadContent();
				$('#footer').css('display','none')
			})
			//点击购物车
			$('#shouyeHeader .rt').on('tap',function(){
				car.loadHeader();
				car.loadContent();
				$('#footer').css('display','none')
			})
			//搜索框内容的请求
			var obj={
				type:"get",
				url:"http://list.mogujie.com/module/mget?code=sketch%2ChotWord&callback=?",
			}
			myajax.myajax(obj,function(data){
				$('.box .find').html(data.data.sketch.data.query)
			})
		})
	},
	loadContent(){
		$('#content').load('view/shouye.html #shouyeContent',function(){
			//轮播图及其功能
		    var obj={
		    	type:"get",
				url:"http://mce.mogucdn.com/jsonp/multiget/3?pids=51822%2C51827%2C41119%2C51833%2C51836%2C4604&callback=?"
		    }
		   myajax.myajax(obj,function(data){
//		   		console.log(data.data)
		   		//轮播图
		   		var obja=data.data[51822].list
//		   		console.log(obja)
		   		for(var item of obja){
		   			$('#banner-swiper').append('<div class="swiper-slide banner-slide"><a href="'+item.link+'"><img src="'+item.image_800+'" alt="" /></a></div>')
		   		}
		   		//实例化一个轮播图
				var swiper = new Swiper('#banner', {
			        pagination: '.swiper-pagination',
			        autoplayDisableOnInteraction:false,
			        autoplay:2000,
			        loop:true
			    });
			    
			    //轮播图下面
			    var objb=data.data[51827].list
//			    console.log(objb)
			    for(var item of objb){
		   			$('.berbox').append('<a href="'+item.link+'" class="a">'+
					'<p class="top">'+item.title+'</p>'+
					'<p class="ctn">'+item.description+'</p>'+
					'<img src="'+item.image+'" alt="" />'+
				'</a>')
		   		}
			    
			    //抢购
			    var objc=data.data[41119].list[0]
//			    console.log(objc.time)
//			    console.log(objc)
			    setInterval(function(){
				    	var time=Number(objc.time--)
				    	var h=parseInt(time/3600);
				    	if(h>=10){
				    		h=h
				    	}else{
				    		h='0'+h;
				    	}
				    	var min=parseInt(time/60-parseInt(time/3600)*60);
				    	if(min>=10){
				    		min=min
				    	}else{
				    		min='0'+min
				    	}
				    	var s=parseInt(time-parseInt(time/60)*60);
				    	if(s>=10){
				    		s=s
				    	}else{
				    		s='0'+s
				    	}
				    	$('.lt').html('<p class="wd">'+objc.title+'.'+objc.viceTitle+'</p>'+
							'<span>'+h+'</span>&nbsp:'+
							'<span>'+min+'</span>&nbsp:'+
							'<span>'+s+'</span>')
			    
			    },1000);
			    $('.qg .top').append('<div class="rt">'+
			    	'<a href="'+objc.moreLink+'">'
						+objc.moreTitle+
						'<b class="iconfont">&#xe63a;</b>'+
					'</a>'+
			    '</div>')
			    
			    for(var item of objc.list){
			    	$('#btm-wrapper').append('<div class="swiper-slide btm-swiper swiper-slide-active">'+
			    			'<a href="'+item.listUrl+'">'+
				            	'<img src="'+item.img+'" alt="" />'+
				            	'<p>'+item.title+'</p>'+
				            	'<p>￥'+item.salePrice+
				            		'<span>'+item.price+'</span> '+
				            	'</p>'+
				            '</a>'+
			            '</div>')
			    }
			    var swiper1 = new Swiper('.btm .btm-container', {
			        slidesPerView:3.4,
			        spaceBetween:10,
			        freeMode: true
			    });
			    //促销直达
			    var objd=data.data[51833].list;
//			    console.log(objd)
			    	$('.zd').append('<div class="ct">'+
								'<div class="zlt"><a href="'+objd[0].link+'">'+
									'<p>'+objd[0].title+'</p>'+
									'<p>'+objd[0].viceTitle+'</p>'+
									'<img src="'+objd[0].image+'" alt="" />'+
								'</a></div>'+
								'<div class="zrt">'+
										'<a href="'+objd[1].link+'">'+
											'<p>'+objd[1].title+'</p>'+
											'<p>'+objd[1].viceTitle+'</p>'+
											'<img src="'+objd[1].image+'" alt="" />'+
										'</a>'+
										'<a href="'+objd[2].link+'">'+
											'<p>'+objd[2].title+'</p>'+
											'<p>'+objd[2].viceTitle+'</p>'+
											'<img src="'+objd[2].image+'" alt="" />'+
										'</a>'+
								'</div>'+
							'</div>'+
							'<div class="bm">'+
								'<div><a href="'+objd[3].link+'">'+
									'<p>'+objd[3].title+'</p>'+
									'<p>'+objd[3].viceTitle+'</p>'+
									'<img src="'+objd[3].image+'" alt="" />'+
								'</a></div>'+
								'<div><a href="'+objd[4].link+'">'+
									'<p>'+objd[4].title+'</p>'+
									'<p>'+objd[4].viceTitle+'</p>'+
									'<img src="'+objd[4].image+'" alt="" />'+
								'</a></div>'+
								'<div><a href="'+objd[5].link+'">'+
									'<p>'+objd[5].title+'</p>'+
									'<p>'+objd[5].viceTitle+'</p>'+
									'<img src="'+objd[5].image+'" alt="" />'+
								'</a></div>'+
							'</div>')
			    	
			    	
			    	//hot-market
			    	var obje=data.data[51836].list;
//			    	console.log(obje)
			    	for(var item of obje){
			    		$('.hmbm').append('<div><a href="'+item.link+'"><img src="'+item.image+'" alt="" /><span>'+item.title+'</span></a></div>')
			    	}
		   })
		})
		
			//猜你喜欢
			var objx={
				type:"get",
				url:"https://list.mogujie.com/search?cKey=h5-shopping&fcid=&pid=9750&searchTag=&sort=pop&page=1&_version=61&_=1501118982433&callback=?"
			}
			myajax.myajax(objx,function(data){
				var obj=data.result.wall.docs
//				console.log(obj);
				for(var item in obj){
					$('.cxctn').append('<div class="cxbox">'+
						'<a href="'+obj[item].clientUrl+'">'+
							'<img src="'+obj[item].img+'" alt="" class="imgb"/>'+
//							'<img src="'+obj[item].lefttop_taglist[0].img+'" class="imgs">'+
							'<div class="ds"></div>'+
							'<div class="dp">'+
								'<span class="sl">￥'+obj[item].price+'</span>'+
								'<span class="sr iconfont">'+obj[item].cfav+'&#xe684;</span>'+
							'</div>'+
						'</a>'+
					'</div>');
					for(var items of obj[item].props){
						$('.ds').eq(item).append('<span>'+items+'</span>')
					}
				}
			})
	}
	
}