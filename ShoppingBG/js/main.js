//當網頁文件就緒的時候，可以開始執行裡面的函式
$(document).ready(function () {
    BlockClear();
    $.ajax({
        url: '/ajax/AjaxMain.aspx',
        type: 'POST',
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    if (jsonResult['sessionIsNull'] === null) {
                        alert('即將被登出');
                        window.location.href = "/view/LoginPage.aspx";
                    } else {
                        $('#loginAccount').text(jsonResult['account']);
                        DutyAuthorization(jsonResult);
                    }
                }
            } else {
                alert('資料錯誤');
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });

    //if (!data) {
    //    var jsonResult = JSON.parse(data);
    //    console.log('dataafterjson', data);
    //    if (RepeatedStuff(jsonResult)) {
    //        return;
    //    } else {
    //        if (jsonResult['sessionIsNull'] === null) {
    //            alert('即將被登出');
    //            window.location.href = "/view/LoginPage.aspx";
    //        } else {
    //            $('#loginAccount').text(jsonResult['account']);
    //            DutyAuthorization(jsonResult);
    //        }
    //    }
    //} else {
    //    alert('資料錯誤');
    //}

    

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
                ResetAll();
                $('#addDutyBlock').show();
                break;
            case 'itemSearchDuty':
                ResetAll();
                GetAllDuty();
                $('#searchDutyBlock').show();                
                break;
            case 'itemAddUser':
                ResetAll();
                DutyMenuForAddUser();
                $('#addUserBlock').show();
                break;
            case 'itemSearchUser':
                GetAllUser();
                $('#searchUserBlock').show();
                break;
            case 'itemAddProduct':
                ResetAll();
                ProductTypeMenu();
                $('#addProductBlock').show();
                break;
            case 'itemSearchProduct':
                ResetAll();
                GetAllProduct();
                $('#searchProductBlock').show();
                break;

            case 'searchMember':
                ResetAll();
                GetAllMember();
                $('#searchMemberBlock').show();
                break;
        }
    });

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
        $('#addProductBlock').hide();
        $('#searchProductBlock').hide();
        $('#modifyProductBlock').hide();
        $('#searchOrderBlock').hide();
        $('#searchMemberBlock').hide();
        $('#modifyMemberBlock').hide();
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

//重覆的東西
function RepeatedStuff(data) {
    if (data && data['result'] == 0) {
        alert('即將被登出');
        window.location.href = "/view/LoginPage.aspx";
        return true;
    }
    return false;    
}

function ResetAll() {
    $("input[type='text']").val('');
    $("input[type='password']").val('');
    $('input[type=checkbox]').prop('checked', 0);
    $('textarea').val('');
}