//當網頁文件就緒的時候，可以開始執行裡面的函式
$(document).ready(function () {
    BlockClear();
    $.ajax({
        url: '/ajax/AjaxMain.aspx',
        type: 'POST',
        success: function (data) {
            console.log('login=', data);
            if (!data) {
                alert('資料錯誤');
            } else {
                var jsonResult = JSON.parse(data);
                if(jsonResult['sessionIsNull'] === null) {
                    alert('即將被登出');
                    window.location.href = "/view/LoginPage.aspx";
                } else {
                    var userInfo = JSON.parse(data);
                    $('#loginAccount').text(userInfo['account']);
                    DutyAuthorization(userInfo);
                }
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });

    //選單滑動
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

    //選取主頁上的內容
    $('.menuItem > a').click(function (event) {
        event.preventDefault();
        BlockClear();

        var selectedId = $(event.target).attr('id');
        switch (selectedId) {
            case 'itemAddDuty':
                $('#addDutyBlock').show();
                break;
            case 'itemSearchDuty':
                $('#searchDutyBlock').show();
                GetAllDuty();
                break;
            case 'itemAddUser':
                DutyMenuForAddUser();
                $('#addUserBlock').show();
                break;
            case 'itemSearchUser':
                GetAllUser();
                $('#searchUserBlock').show();
                break;
        }
    });       
       

    
    ////選取主頁上的內容
    //$('.menuItem > a').click(function (event) {
    //    event.preventDefault();
    //    BlockClear();
    //    var selectedId = $(event.target).attr('id');
    //    switch (selectedId) {
    //        case 'itemAddDuty':
    //            $('#addDutyBlock').show();
    //            break;
    //        case 'itemSearchDuty':
    //            $('#searchDutyBlock').show();
    //            GetAllDuty();
    //            break;
    //        case 'itemAddUser':
    //            DutyMenuForAddUser();
    //            $('#addUserBlock').show();
    //            break;
    //        case 'itemSearchUser':
    //            GetAllUser();
    //            $('#searchUserBlock').show();
    //            break;

    //    }
    //});
    //登出
    $('#logout').click(function (event) {
        window.location.href = '/view/LoginPage.aspx';
    });

    //畫面清除
    function BlockClear() {
        $('#overlay').hide();
        $('#addDutyBlock').hide();
        $('#searchDutyBlock').hide();
        $('#allDutyList').hide();
        $('#modifyDutyBlock').hide();
        $('#addUserBlock').hide();
        $('#searchUserBlock').hide();
        $('#allUserList').hide();
        $('#modifyUserBlock').hide();
    }
})

//讀取職責權限來隱藏或顯示工作內容
function DutyAuthorization(userInfo) {
    $('#duty').hide();
    $('#user').hide();
    $('#productType').hide();
    $('#product').hide();
    $('#searchOrder').hide();
    $('#operationRecord').hide();

    if (userInfo.mangDuty == 1) {
        $('#duty').show();
    }
    if (userInfo.mangUser == 1) {
        $('#user').show();
    }
    if (userInfo.mangProType == 1) {
        $('#productType').show();
    }
    if (userInfo.mangProduct == 1) {
        $('#product').show();
    }
    if (userInfo.mangOrder == 1) {
        $('#searchOrder').show();
    }
    if (userInfo.mangRecord == 1) {
        $('#operationRecord').show();
    }
}


//不能輸入空白鍵
function NoSpaceKey(inputName) {
    var id = '#' + inputName;
    var inputText = $(id).val();
    inputText = inputText.replace(/\s/g, '');
    $(id).val(inputText);
}