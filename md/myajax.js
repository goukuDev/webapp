export default{
	myajax(obj,callback){
		$.ajax({
			type:"get",
			url:obj.url,
			data:obj.data,
			dataType:obj.dataType,
			success:function(data){
				callback(data);
			}
		});
	}
}
