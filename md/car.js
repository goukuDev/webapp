import './../scss/car.scss';
import shouye from './shouye.js';
import footer from './footer.js';
import Fl from './fl.js';

export default{
    loadHeader(fl){
        $('#header').load('view/car.html #carHeader',function(){
            $('#carHeader .left').on('tap',function(){
            	if(fl=='fl'){
            		Fl.loadHeader();
					Fl.loadContent();
					footer.loadFooter(1);
					$('#footer').css('display','block')
            	}else{
            		shouye.loadHeader();
					shouye.loadContent();
					footer.loadFooter(0);
					$('#footer').css('display','block')
            	}
            	
            })
        })
    },
    loadContent(){
        $('#content').load('view/car.html #carContent',function(){
          $('#carContent .btn').on('tap',function(){
          	shouye.loadHeader();
			shouye.loadContent();
			footer.loadFooter(0);
			$('#footer').css('display','block')
          })
        })
    }
}