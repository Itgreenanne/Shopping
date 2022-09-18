var userInfoGlobal;

//從資料庫讀取所有可供選擇的職責名稱的選單
function DutyTypeMenu(menuId) {
    var id = '#' + menuId;
    $(id ).empty();
    $.ajax({
        url: '/ajax/AjaxUser.aspx?fn=DutyTypeMenu',
        type: "POST",
        success: function (data) {
            jsonDutyType = JSON.parse(data);
            console.log(jsonDutyType);
            var menu = '';
            menu = $(id).append($('<option>').text('請選擇').attr('value', ''));

            for (var i = 0; i < jsonDutyType.length; i++) {
                /*menu += $('<option>').text(jsonDutyType[i].dutyName).attr('value', jsonDutyType[i].dutyId);*/
                menu += '<option>' + jsonDutyType[i].dutyName+'</option>';
            }
            $(id).append(menu);
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });
}

//人員新增
function AddUser() {
    var inputUserAcount = $('#addUserAccount').val();
    var inputNickName = $('#addNickName').val();
    var userPwd = $('#userPwd').val();
    var userDutyType = $('#dutyTypeMenu').val();

    if (!inputUserAcount || !inputNickName || !userPwd || !userDutyType) {
        alert('有輸入框未填');
    } else if (inputUserAcount.length >20 || inputNickName.length >20 || userPwd.length >20) {
        alert('輸入超過20字元');   
    } else {
        $.ajax({
            url: '/ajax/AjaxUser.aspx?fn=AddUserVerify',
            type: 'POST',
            data: {
                getUserAccount: inputUserAcount,
                getNickName: inputNickName,
                getUserPwd: userPwd,
                getUserDutyType: userDutyType                
            },
            success: function (data) {
                if (data == 0) {
                    alert("新增人員成功");
                    ResetAll();
                    $("#addUserBlock").hide();
                    $("#searchUserBlock").show();
                    GetAllUser();
                } else if (data == 1) {
                    alert('已有此人員');
                } else {
                    alert('輸入資料錯誤');
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

//取得並顯示所有人員資料
function GetAllUser() {
    //請求資料
    $.ajax({
        url: '/ajax/AjaxUser.aspx?fn=GetAllUser',
        type: 'POST',
        success: function (data) {
            if (!data) {
                alert('資料錯誤');
            } else {
                var jsonResult = JSON.parse(data);
                console.log(jsonResult);
                PrintUserTable(jsonResult);
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });
}

//用職責名稱篩出人員
function GetSearchUser() {
    var userDutyType = $('#allDutyMenu').val();
    //console.log('get user ??=',userDutyType);

    if (!$('#allDutyMenu').val()) {
        alert('請選擇職責名稱');
        GetAllUser();
        //請求資料
    } else {
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=GetSearchUser',
            type: 'POST',
            data: {
                getDutyType: userDutyType
            },
            success: function (data) {

                if (!data) {
                    alert('資料錯誤');
                } else {
                    var jsonResult = JSON.parse(data);
                    //將區域變數值傳給全域變數當緩存
                    PrintUserTable(jsonResult);
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

//建立人員表格
function PrintUserTable(jsonResult) {
    $('#allUserList').html('');
    //將區域變數值傳給全域變數
    userInfoGlobal = jsonResult;
    var tableRow = '';
    tableRow = '<tr>' +
        '<th>' + '帳號' + '</th>' +
        '<th>' + '暱稱' + '</th>' +
        '<th>' + '密碼' + '</th>' +
        '<th>' + '職責名稱' + '</th>' +
        '<th>' + '設定' + '</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {

        tableRow +=
            '<tr>' +
            '<td>' + jsonResult[i].userAccount + '</td>' +
            '<td>' + jsonResult[i].userNickname + '</td>' +
            '<td>' + jsonResult[i].userPwd + '</td>' +
            '<td>' + jsonResult[i].dutyTypeId + '</td>' +            
            '<td> <button onclick="DeleteDuty(\'' + jsonResult[i].userId + '\')">' +
            '刪除' + '</button>' + ' ' +            
            '<button onclick="ModifyDutyReadBack(\'' + jsonResult[i].userId + '\')">' + '修改' + '</button>' + '</td>' +
            '</tr>';
    }

    $('#allUserList').append(tableRow);
    $('#allUserList').show();
}

//function DutyTypeMenu(menuId) {
//    var id = '#' + menuId;
//    $('#dutyTypeMenu').empty();
//    $.ajax({
//        url: '/ajax/AjaxUser.aspx?fn=DutyTypeMenu',
//        type: "POST",
//        success: function (data) {
//            jsonDutyType = JSON.parse(data);
//            console.log(jsonDutyType);
//            var menu = '';
//            menu = $('#dutyTypeMenu').append($('<option>').text('請選擇').attr('value', ''));

//            for (var i = 0; i < jsonDutyType.length; i++) {
//                menu += $('#dutyTypeMenu').append($('<option>').text(jsonDutyType[i].dutyName).attr('value', jsonDutyType[i].dutyId));
//            }
//            console.log($('#dutyTypeMenu').val());
//        },
//        error: function (err) {
//            str = JSON.stringify(err, null, 2);
//            console.log('err:');
//            console.log(err);
//            alert(str);
//        }
//    });
//}