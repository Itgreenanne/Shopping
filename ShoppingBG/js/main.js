//當網頁文件就緒的時候，可以開始執行裡面的函式
$(document).ready(function () {  
	$('.drop-down-menu > li > a').click(function (event) {
		//event.preventDefault();	
		//所有的大選項移除class
		$('.drop-down-menu > li > a').removeClass('active');
		//鼠標按鍵的地方加上class
		$(this).addClass('active');
		//滑出所選之子選單
		$('.drop-down-menu > li> ul').slideUp(500);
		//其他選單則上滑
		$(this).siblings('ul').slideDown(500);
	});
})