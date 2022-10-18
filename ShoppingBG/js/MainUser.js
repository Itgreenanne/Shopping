var globalUserData;
var oldUserPwd;

//從資料庫讀取所有可供選擇的職責名稱的選單
function DutyMenuForAddUser() {
    $.ajax({
        url: '/ajax/AjaxUser.aspx?fn=DutyTypeMenu',
        type: "POST",
        success: function (data) {

            if (data) {
                var jsonResult = JSON.parse(data);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    DutyMenu('dutyTypeMenu', jsonResult);
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
}

//職責下拉選單列印
function DutyMenu(menuId, jsonDutyType) {
    var id = '#' + menuId;
    //$(id).empty();
    var menu = '';
    menu = '<option value=\'0\'>請選擇</option>';

    for (var i = 0; i < jsonDutyType.length; i++) {
        /*menu += $('<option>').text(jsonDutyType[i].dutyName).attr('value', jsonDutyType[i].dutyId);*/
        menu += '<option value=\'' + jsonDutyType[i].DutyId + '\'>' + jsonDutyType[i].DutyName + '</option>';
    }
    $(id).html(menu);
}

//人員新增
function AddUser() {
    var inputUserAcount = $('#addUserAccount').val();
    var inputNickname = $('#addNickName').val();
    var userPwd = $('#userPwd').val();
    var dutyId = $('#dutyTypeMenu').val();

    if (!inputUserAcount || !inputNickname || !userPwd || !dutyId) {
        alert('有輸入框未填');
    } else if (inputUserAcount.length > 20) {
        alert('帳號輸入超過20字元');
    } else if (inputNickname.length > 20) {
        alert('暱稱輸入超過20字元');
    } else if (userPwd.length > 20) {
        alert('密碼輸入超過20字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxUser.aspx?fn=AddUserVerify',
            type: 'POST',
            data: {
                getUserAccount: inputUserAcount,
                getNickname: inputNickname,
                getUserPwd: userPwd,
                getUserDutyId: dutyId
            },
            success: function (data) {
                if (data) {
                    if (RepeatedStuff(data)) {
                        return;
                    }
                    switch (data) {
                        case '0':
                            alert("新增人員成功");
                            ResetAll();
                            $("#addUserBlock").hide();
                            $("#searchUserBlock").show();
                            GetAllUser();
                            break;
                        case '1':
                            alert('已有此人員帳號');
                            break;
                        case '3':
                            alert('帳號輸入超過20字元');
                            break;
                        case '4':
                            alert('暱稱輸入超過20字元');
                            break;
                        case '5':
                            alert('密碼輸入超過20字元');
                            break;
                        case '9':
                            alert('id型別錯誤');
                            break;
                        default:
                            alert('資料錯誤');
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
            if (data) {
                var jsonResult = JSON.parse(data);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    DutyMenu('allDutyMenu', jsonResult.DutyInfoArray);
                    PrintUserTable(jsonResult.UserDataArray);
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
}

//清空查詢人員的輸入框
function ClearSearchUser() {
    $('#searchUserAccount').val('');
    $('#allDutyMenu').val('');
    GetAllUser();
}

//用職責名稱篩出人員
function GetSearchUser() {
    var userAccount = $('#searchUserAccount').val();
    var dutyId = $('#allDutyMenu').val();

    if (!userAccount && dutyId == 0) {
        alert('請選擇帳號或選擇職責名稱');
        GetAllUser();
    } else if (userAccount.length > 20) {
        alert('帳號輸入超過20字元');    
    } else {
        $.ajax({
            url: '/ajax/AjaxUser.aspx?fn=GetSearchUser',
            type: 'POST',
            data: {
                getUserAccount: userAccount,
                getDutyId: dutyId
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 2) {
                        alert('空字串');
                    } else if (jsonResult == 3) {
                        alert('帳號輸入超過20字元');
                    } else if (jsonResult == 9) {
                        alert('id型別錯誤');
                    } else {
                        PrintUserTable(jsonResult);
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
        })
    }
}


//刪除人員
function DeleteUser(userId) {
    var deleteOrNot = confirm('確定要刪除此位人員嗎?');    
    if (deleteOrNot) {
        $.ajax({
            url: '/ajax/AjaxUser.aspx?fn=DeleteUser',
            type: 'POST',
            data: {
                getUserId: userId
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 9) {
                        alert('id型別錯誤');
                    } else {
                        PrintUserTable(jsonResult);
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
    }
}

//彈跳人員修改視窗的內容
function ModifyUserBlock(userId) {
    $('#modifyUserPwd').val('');
    $('#modifyNickname').val('');
    $('#overlay').show();
    $('#modifyUserBlock').show();
    $.ajax({
        url: '/ajax/AjaxUser.aspx?fn=GetSearchUserById',
        type: 'POST',
        data: {
            getUserId: userId
        },
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    //顯示跟選擇列資料一樣的資料                
                    $('#modifyUserAccount').text(jsonResult.UserDataArray[0].UserAccount);
                    $('#modifyNickname').val(jsonResult.UserDataArray[0].UserNickname);
                    $('#modifyUserPwd').val('************************************');
                    DutyMenu('modifyDutyMenu', jsonResult.DutyInfoArray);
                    $('#modifyDutyMenu').val(jsonResult.UserDataArray[0].DutyTypeId);
                    globalUserData = jsonResult.UserDataArray[0];
                    oldUserPwd = jsonResult.UserDataArray[0].UserPwd;
                    $('#modifyUserBlock').show();
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
    })
}

//人員修改視窗的密碼判斷
function PasswordVarify() {
    globalUserData.UserPwd = $('#modifyUserPwd').val();
}

//人員修改
function ModifyUser() {
    var inputNickname = $('#modifyNickname').val();
    /*var userPwd = userData[0].UserPwd;*/
    var userPwd = globalUserData.UserPwd;
    var dutyId = $('#modifyDutyMenu').val();   

    if (inputNickname == globalUserData.UserNickname && userPwd == oldUserPwd && dutyId == globalUserData.DutyTypeId) {
        alert('資料完全沒有修改');
    } else if (!inputNickname || !userPwd || dutyId == 0) {
        alert('有輸入框未填');
    } else if (inputNickname.length > 20) {
        alert('暱稱輸入超過20字元');
    } else if (userPwd.length > 20) {
        alert('密碼輸入超過20字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxUser.aspx?fn=ModifyUser',
            type: 'POST',
            data: {
                getUserId: globalUserData.UserId,
                getNickName: inputNickname,
                getUserPwd: userPwd,
                getUserDutyId: dutyId
            },
            success: function (data) {
                if (data) {
                    if (RepeatedStuff(data)) {
                        return;
                    } else if (data == 7) {
                        alert("人員修改成功");
                        $('#modifyUserBlock').hide();
                        $('#overlay').hide();
                    } else if (data == 1) {
                        alert('已有此人員帳號');
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
        GetAllUser();
    }
}

//人員修改彈跳視窗取消
function CancelUserModifyBlock() {
    $('#modifyUserBlock').hide();
    $('#overlay').hide();
}

//建立人員表格
function PrintUserTable(jsonResult) {

    $('#allUserList').html('');
    
    var tableRow = '';
    tableRow = '<tr>' +
        '<th>帳號</th>' +
        '<th>暱稱</th>' +       
        '<th>職責名稱</th>' +
        '<th>設定</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {
        tableRow +=
            '<tr>' +
            '<td>' + jsonResult[i].UserAccount + '</td>' +
            '<td>' + jsonResult[i].UserNickname + '</td>' +            
            '<td>' + jsonResult[i].DutyName + '</td>' +
            '<td> <button onclick="DeleteUser(\'' + jsonResult[i].UserId + '\')">' +
            '刪除' + '</button>' + ' ' +
            '<button onclick="ModifyUserBlock(\'' + jsonResult[i].UserId + '\')">修改</button></td>' +
            '</tr>';
    }

    $('#allUserList').append(tableRow);
    $('#allUserList').show();
}