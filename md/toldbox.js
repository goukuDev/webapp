export default{
	dl(word,time){
		setTimeout(function(){
  			$('#mineContent .block').html(word)
  			$('#mineContent .block').css('display','block')
				setTimeout(function(){
		  			$('#mineContent .block').css('display','none')
		  		},time)
  		},200)
	},
	zc(word,time){
		setTimeout(function(){
  			$('#rejustContent .block').html(word)
  			$('#rejustContent .block').css('display','block')
				setTimeout(function(){
		  			$('#rejustContent .block').css('display','none')
		  		},time)
  		},200)
	}
}
