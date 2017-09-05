import './../scss/footer.scss';
import car from './car.js';
import fl from './fl.js';
import mine from './mine.js';
import shouye from './shouye.js';

export default{
	loadFooter(indexx){
		
		$('#footer').load('view/footer.html #Footer',function(){
			$('.lists li').eq(indexx).addClass('active').siblings().removeClass('active');
			$('.lists li').on('tap',function(){
				var index=$(this).index();
				$(this).addClass('active').siblings().removeClass('active');
				switch(index){
					case 0: 
					shouye.loadHeader();
					shouye.loadContent();
					break;
					case 1: 
					fl.loadHeader();
					fl.loadContent();
					break;
					case 2: 
					car.loadHeader();
					car.loadContent();
					$('#footer').css('display','none')
					break;
					case 3: 
					mine.loadHeader();
					mine.loadContent();
					$('#footer').css('display','none')
					default:
					break;
				}
			})
			
		})
	}
}
