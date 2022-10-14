//從DB取得所有會員資料
function GetAllMember() {
    $.ajax({
        url: '/ajax/AjaxMember.aspx?fn=GetAllMember',
        type: 'POST',
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);
                console.log('allmember=',jsonResult);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    //DutyMenu('allDutyMenu', jsonResult.DutyInfoArray);
                    PrintMemberTable(jsonResult);
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

function GetSearchMember() {   
    var inputIdNo = $('#searchMemberIdNo').val();

    if (!inputIdNo) {
        alert('請輸入身份証字號');
        GetAllMember();

    } else if (inputIdNo.length != 10) {
        alert('身份証字號輸入字元長度錯誤');
        GetAllMember();

        //請求資料
    } else {
        $.ajax({
            url: '/ajax/AjaxMember.aspx?fn=GetSearchDutyByIdNo',
            type: 'POST',
            data: {
                getIdNo: inputIdNo
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    console.log(jsonResult);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else {
                        //將區域變數值傳給全域變數當緩存
                        PrintMemberTable(jsonResult);
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

//刪除會員
function DeleteMember(memberId) {
    var deleteOrNot = confirm('確定要刪除此會員嗎?');

    if (deleteOrNot) {
        $.ajax({
            url: '/ajax/AjaxMember.aspx?fn=DeleteMember',
            type: 'POST',
            data: {
                getMemberId: memberId
            },
            success: function (data) {
                if (data) {
                    var jsonResult = (JSON.parse(data));

                    if (RepeatedStuff(jsonResult)) {
                        return;                  
                    } else {
                        PrintMemberTable(jsonResult);
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

//彈跳會員修改視窗的內容
function ModifyMemberBlock(memberId) {
    $('#overlay').show();
    $.ajax({
        url: '/ajax/AjaxMember.aspx?fn=GetSearchMemberById',
        type: 'POST',
        data: {
            getMemberId: memberId
        },
        success: function (data) {
            if (data) {
                var jsonResult = (JSON.parse(data));

                if (RepeatedStuff(data)) {
                    return;
                } else if (data == 1) {
                    alert('資料錯誤');
                } else {
                    //for ModifyDuty()裡的變數dutyInfo
                    dataId = memberId;
                    //重置所有checkbox
                    var jsonResult = JSON.parse(data);
                    console.log(jsonResult);
                    //顯示跟選擇列資料一樣的資料
                    $('#idNoShown').text(jsonResult.idNumber.toUpperCase());
                    $('#lastNameInput').val(jsonResult.lastname);
                    $('#firstNameInput').val(jsonResult.firstname);
                    $('#modifyPhone').val(jsonResult.phone);
                    $('#modifyPwd').val(jsonResult.pwd);
                    $('#modifyMail').val(jsonResult.mail);
                    $('#modifyAddress').val(jsonResult.address);
                    $('#inputBirth').val(jsonResult.birth);
                    
                    if (jsonResult.gender == 1) {
                        $("#radModifyMale").prop('checked', true);
                    } else if (jsonResult.gender == 2) {
                        $("#radModifyFemale").prop('checked', true);
                    } else {
                        $("#radModifyOther").prop('checked', true);
                    }

                    $('#modifyLevel').val(jsonResult.level);
                    $('#modifyPoints').val(jsonResult.points);
                    $('#modifyMemberBlock').show();
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

var dataId;

//會員修改彈跳視窗取消
function CancelMemberModifyBlock() {
    $('#modifyMemberBlock').hide();
    $('#overlay').hide();
}

//會員修改資料儲存到DB
function ModifyMember() {
    var tel = $('#modifyPhone').val();
    var lastname = $('#lastNameInput').val();
    var firstname = $('#firstNameInput').val();
    var pwd = $('#modifyPwd').val();
    var mail = $('#modifyMail').val();
    var address = $('#modifyAddress').val();
    //var birthYear = $('#inputBirthYear').val();
    //var birthMonth = $('#inputBirthMonth').val();
    //var birthDay = $('#inputBirthDay').val();
    var birth = $('#inputBirth').val();
    var gender = '';
    $("input[type=radio]:checked").each(function () {
        gender = $(this).val();
    });
    var level = $('#modifyLevel').val();
    var points = $('#modifyPoints').val();

    if (!tel || !pwd || !lastname || !firstname || !mail ||
        !birth || !gender || !level || !points) {
        alert('有輸入框未填');  
    } else if (tel.length != 10) {
        alert('電話號碼輸入長度錯誤');
    } else if (lastname.length > 20) {
        alert('姓輸入超過20字元');
    } else if (firstname.length > 20) {
        alert('名輸入超過20字元');
    } else if (mail.length > 40) {
        alert('email輸入超過40字元');
    } else if (pwd.length < 8 && pwd.length > 20) {
        alert('密碼輸入要8-20字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxMember.aspx?fn=ModifyMember',
            type: 'POST',
            data: {
                getId: dataId,
                getTel: tel,
                getPwd: pwd,
                getGender: gender,
                getLastName: lastname,
                getFirstname: firstname,
                getBirth: birth,
                getMail: mail,
                getAddress: address,
                getLevel: level,
                getPoints: points
            },
            success: function (data) {
                console.log(data);
                if (data) {
                    switch (data) {
                        case '14':
                            alert("修改會員資料成功");
                            $('#modifyMemberBlock').hide();                        
                            $('#overlay').hide();
                            GetAllMember();
                            break;
                        case '1':
                            alert('已有此人員帳號');
                            break;
                        case '3':
                            alert('身份証字號輸入長度錯誤');
                            break;
                        case '4':
                            alert('電話號碼輸入長度錯誤');
                            break;
                        case '5':
                            alert('密碼長度不對');
                            break;
                        case '9':
                            alert('姓太長');
                            break;
                        case '10':
                            alert('名太長');
                            break;
                        case '11':
                            alert('email長度太長');
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

//建立會員表格
function PrintMemberTable(jsonResult) {

    $('#allMemberList').html('');

    var tableRow = '';
    tableRow = '<tr>' +
        '<th>身份証字號</th>' +
        '<th>姓</th>' +
        '<th>名</th>' +
        '<th>性別</th>' +
        '<th>生日</th>' +
        '<th>密碼</th>' +
        '<th>Email</th>' +
        '<th>聯絡電話</th>' +
        '<th>住址</th>' +
        '<th>點數</th>' +
        '<th>等級</th>' +
        '<th>設定</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {
        tableRow +=
            '<tr>' +
            '<td>' + jsonResult[i].idNumber.toUpperCase() + '</td>' +
            '<td>' + jsonResult[i].lastname + '</td>' +
            '<td>' + jsonResult[i].firstname + '</td>' +
            '<td>' + GetGender(jsonResult[i].gender) + '</td>' +
            '<td>' + jsonResult[i].birth + '</td>' +
            '<td>' + jsonResult[i].pwd + '</td>' +
            '<td>' + jsonResult[i].mail + '</td>' +
            '<td>' + jsonResult[i].phone + '</td>' +
            '<td>' + jsonResult[i].address + '</td>' +
            '<td>' + jsonResult[i].points + '</td>' +
            '<td>' + jsonResult[i].level + '</td>' +
            '<td> <button onclick="DeleteMember(\'' + jsonResult[i].memberId + '\')">' +
            '刪除' + '</button>' + ' ' +
            '<button onclick="ModifyMemberBlock(\'' + jsonResult[i].memberId + '\')">修改</button></td>' +
            '</tr>';
    }

    $('#allMemberList').append(tableRow);
    $('#allMemberList').show();
}

//將DB性別欄位的數字轉成F,M,O
function GetGender(gender) {

    if (gender == 1) {
        return 'M';
    } else if (gender == 2) {
        return 'F';
    } else if (gender == 3){
        return 'O';
    }
}



////彈跳會員修改視窗的內容
//function ModifyMemberBlock(memberId) {
//    $('#overlay').show();
//    $.ajax({
//        url: '/ajax/AjaxMember.aspx?fn=GetSearchMemberById',
//        type: 'POST',
//        data: {
//            getMemberId: memberId
//        },
//        success: function (data) {
//            if (data) {
//                var jsonResult = (JSON.parse(data));

//                if (RepeatedStuff(data)) {
//                    return;
//                } else if (data == 1) {
//                    alert('資料錯誤');
//                } else {
//                    //for ModifyDuty()裡的變數dutyInfo
//                    dataId = memberId;
//                    //重置所有checkbox
//                    var jsonResult = JSON.parse(data);
//                    console.log(jsonResult);
//                    //顯示跟選擇列資料一樣的資料
//                    $('#idNoShown').text(jsonResult.idNumber.toUpperCase());
//                    $('#lastNameInput').val(jsonResult.lastname);
//                    $('#firstNameInput').val(jsonResult.firstname);
//                    $('#modifyPhone').val(jsonResult.phone);
//                    $('#modifyPwd').val(jsonResult.pwd);
//                    $('#modifyMail').val(jsonResult.mail);
//                    $('#modifyAddress').val(jsonResult.address);
//                    $('#inputBirthYear').val(jsonResult.birth.slice(0, 4));
//                    $('#inputBirthMonth').val(jsonResult.birth.slice(4, 6));
//                    $('#inputBirthDay').val(jsonResult.birth.slice(6, 8));
//                    if (jsonResult.gender == 1) {
//                        $("#radModifyMale").prop('checked', true);
//                    } else if (jsonResult.gender == 2) {
//                        $("#radModifyFemale").prop('checked', true);
//                    } else {
//                        $("#radModifyOther").prop('checked', true);
//                    }

//                    $('#modifyLevel').val(jsonResult.level);
//                    $('#modifyPoints').val(jsonResult.points);
//                    $('#modifyMemberBlock').show();
//                }
//            } else {
//                alert('資料錯誤');
//            }
//        },
//        error: function (err) {
//            str = JSON.stringify(err, null, 2);
//            console.log('err:');
//            console.log(err);
//            alert(str);
//        }
//    })
//}