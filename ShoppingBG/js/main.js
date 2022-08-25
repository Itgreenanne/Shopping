//當網頁文件就緒的時候，可以開始執行裡面的函式
$(document).ready(function () {
    $.ajax({
        url: '/ajax/AjaxMain.aspx',
        type: 'POST',
        success: function (data) {
            //console.log(data);
            //console.log(JSON.parse(data));
            if (JSON.parse(data)['SessionIsNull'] === null) {
                alert('即將被登出');
                window.location.href = "/view/LoginPage.aspx";
            } else {                
                $('#loginAccount').html(JSON.parse(data)['Account']);
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });

	$('.drop-down-menu > li > a').click(function (event) {
		event.preventDefault();	
		//所有的大選項移除class
		$('.drop-down-menu > li > a').removeClass('active');
		//鼠標按鍵的地方加上class
		$(this).addClass('active');
		//滑出所選之子選單
		$('.drop-down-menu > li> ul').slideUp(500);
		//其他選單則上滑
		$(this).siblings('ul').slideDown(500);
    });

    $('#logout').click(function (event) {
        $.ajax({
            url: '/ajax/AjaxLogout.aspx',
            type: 'POST',
            success: function (data) {
                //收到session is null的值然後跳轉回登入頁面
                console.log(data);

                if (data === null) {                    
                    window.location.href = "/view/LoginPage.aspx";
                }
            }
        })
    });
})

////當網頁文件就緒的時候，可以開始執行裡面的函式
//$(document).ready(function () {
//	$(function () {
//		var strAccount = <% = LoginAccount() %>;
//		if (strAccount != null) {
//			("#loginAccount").html(strAccount);
//		} else {
//			alert("即將被登出並回到登入畫面");
//			window.location.href = "/view/loginPage.aspx";
//		}
//	});

//	/*$('.drop-down-menu > li > a').click(function (event) {
//		//event.preventDefault();	
//		//所有的大選項移除class
//		$('.drop-down-menu > li > a').removeClass('active');
//		//鼠標按鍵的地方加上class
//		$(this).addClass('active');
//		//滑出所選之子選單
//		$('.drop-down-menu > li> ul').slideUp(500);
//		//其他選單則上滑
//		$(this).siblings('ul').slideDown(500);
//	});*/
//})