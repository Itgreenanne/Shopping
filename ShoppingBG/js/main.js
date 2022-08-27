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

    $("#addDutyBlock").hide();

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

    //新增職責
    $("#itemAddDuty").click(function (event) {
        $("#addDutyBlock").show();       
    });    

    //登出
    $('#logout').click(function (event) {
        window.location.href = "/view/LoginPage.aspx";        
    });  
 
})

//不能輸入空白鍵
function NoSpaceKey(inputDutyName) {
    var inputText = $('#inputDutyName').val();
    inputText = inputText.replace(/\s/g, '');
    $('#inputDutyName').val(inputText);
}

//新增職責傳資料至後端
function getDataAddDuty() {
    var inputDutyNameJs = $('#inputDutyName').val();
    var canAddUserJs = $('#canAddUser').is(':checked');
    var canMangProductJs = $('#canMangProduct').is(':checked');
    var canMangOrderJs = $('#canMangOrder').is(':checked');
    var customerServeJs = $('#customerServe').is(':checked');
    var check = $("input[name='chkDutyType']:checked").length;
    $('#message').html('');    
    
    if ((!inputDutyNameJs) || check == 0) {
        $('#message').html('請檢查是否名稱沒輸入或是所有選項都沒勾選');
    } else {
        $.ajax({
            url: '/ajax/AddDuty.aspx',
            type: 'POST',
            data: {
                getDutyName: inputDutyNameJs, ifAddUser: canAddUserJs,
                ifMangProduct: canMangProductJs, ifMangOrder: canMangOrderJs,
                ifCustomerServe: customerServeJs
            },
            success: function (data) {
                console.log(data);

                if (data == 0) {
                    $('#message').html('新增職責成功');
                } else if (data == 1) {
                    $('#message').html('已有此職責');
                }
            },
            error: function (err) {
                str = JSON.stringify(err, null, 2);
                console.log('err:');
                console.log(err);
                alert(str);
            }
        })
    }
}





    
 //logout測試 跳轉的順序

//$('#logout').click(function (event) {

//    $.ajax({
//        url: '/ajax/AjaxLogout.aspx',
//        type: 'POST'
//    });
//    window.location.href = "/view/LoginPage.aspx";
//});

//空白輸入與所有checkbox都沒勾的條件式
//if ((!inputDutyNameJs) || ($("input[name='chkDutyType']").each(function () {
    //    $("input[name='chkDutyType']").attr('checked', false) }))) { 
    //    $('#message').html('請檢查是否名稱沒輸入或是所有選項都沒勾選');
    //}




 



   