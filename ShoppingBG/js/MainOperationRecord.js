//搜尋全部操作紀錄
function GetSearchAllOperationRecord() { 
        $.ajax({
            url: '/ajax/AjaxOperationRecord.aspx?fn=GetSearchAllOperationRecord',
            type: 'POST',         
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    if (RepeatedStuff(jsonResult)) {
                        return;                    
                    } else {
                        PrintOperationRecord(jsonResult);
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

//搜尋起迄日間的操作紀錄
function GetSearchOperationRecordByDate() {
    var startDate = $('#startDateForRecord').val();
    var endDate = $('#endDateForRecord').val();

    if (!startDate || !endDate) {
        alert('請選擇日期');
    } else {
    $.ajax({
        url: '/ajax/AjaxOperationRecord.aspx?fn=GetSearchOperationRecordByDate',
        type: 'POST',
        data: {
            getStartDate: startDate,
            getEndDate: endDate
        },
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);
                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    PrintOperationRecord(jsonResult);
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

//起日不能晚於迄日的檢查
function NoLaterThanEndDate(dateString) {
    startDate = dateString;
    startTime = TimeStringToNumber(dateString);
    endDate = $('#endDateForRecord').val();
    endTime = TimeStringToNumber(endDate);

    if (startTime > endTime) {
        startDate = endDate;
        alert('起日需早於迄日');
        $('#startDateForRecord').val(endDate);
    }
}

//迄日不能早於起日的檢查
function NoEarlierThanStartDate(dateString) {
    endDate = dateString;
    endTime = TimeStringToNumber(dateString);
    startDate = $('#startDateForRecord').val();
    startTime = TimeStringToNumber(startDate);

    if (endTime < startTime) {
        endDate = startDate;
        alert('迄日需晚於起日');
        $('#endDateForRecord').val(startDate);
    }
}

//以操作功能來搜尋操作紀錄
function GetSearchOperationRecordByFunction() {
    var functionType = $('#functionMenu').val();
    if (functionType != 0) {
        $.ajax({
            url: '/ajax/AjaxOperationRecord.aspx?fn=GetSearchOperationRecordByFunction',
            type: 'POST',
            data: {
                getFunctionType: functionType
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else {
                        PrintOperationRecord(jsonResult);
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


//清除輸入日期框及表格
function ClearRecord() {
    $('#startDateForRecord').val('');
    $('#endDateForRecord').val('');
    $('#operationRecordList').html('');
    $('#functionMenu').val(0);
}

//列印起迄日期間操作紀錄的表格
function PrintOperationRecord(jsonResult) {
    $('#operationRecordList').html('');
    var typeArr = ['職責', '人員', '產品', '會員', '訂單'];
    var functionType = ['新增', '刪除', '修改'];
    var tableRow = '';
    tableRow = '<tr>' +
        '<th>人員帳號</th>' +
        '<th>資料種類</th>' +
        '<th>操作種類</th>' +
        '<th>修改前</th>' +
        '<th>修改後</th>' +
        '<th>操作紀錄寫入時間</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {

        console.log(jsonResult[i].after);

        var beforeData = jsonResult[i].before;
        var afterData = DataConversionList(jsonResult[i].type, jsonResult[i].after);

        //if ((jsonResult[i].function) == 3) {
        //    var beforeData = DataConversionList(jsonResult[i].type, jsonResult[i].before);
        //    var afterData = DataConversionList(jsonResult[i].type, jsonResult[i].after);
        //} else {
        //    var beforeData = jsonResult[i].before;
        //    var afterData = jsonResult[i].after;
        //}

        tableRow +=
            '<tr>' +
            '<td class="dataIdColumn">' + jsonResult[i].userAccount + '</td>' +
            '<td class="typeColumn">' + typeArr[(jsonResult[i].type) + 1] + '</td>' +
            '<td class="functionColumn">' + functionType[(jsonResult[i].function) + 1] + '</td>' +
            '<td class="beforeColumn">' + beforeData + '</td>' +
            '<td class="afterColumn">' + afterData + '</td>' +
            '<td class="createTimeForRecord">' + jsonResult[i].createTime + '</td>' +
            '</tr>';    
    }

    $('#operationRecordList').append(tableRow);
    $('#operationRecordList').show();
}

//資料種類轉換函式的選單
function DataConversionList(index, data) {
    switch (index){
        case 1:
            return DutyDataConverted(data);
            break;
        case 2:
            return UserDataConverted(data);
            break;
        case 3:
            return ProductDataConverted(data);
            break;
        case 4:
            return MemberDataConverted(data);
            break;
    }
}


//將職責資料輸出改為中文，chk box的0與1改為'無'與'有'
function DutyDataConverted(data) {
    var jsonData = JSON.parse(data);
    console.log(data);
    var keyMap = {
        'dutyName': '職責名稱',
        'mangDuty': '職責管理',
        'mangUser': '人員管理',
        'mangProType': '產品類別管理',
        'mangProduct': '產品管理',
        'mangOrder': '訂單管理',
        'mangRecord': '操作紀錄管理'
    };

    //將json key改為上面物件的中文名稱
    for (var key in jsonData) {
        var newKey = keyMap[key];
        if (newKey) {
            jsonData[newKey] = jsonData[key];
            delete jsonData[key];
        }
        if (jsonData[newKey] == 0) {
            jsonData[newKey] = '無';
        } else if (jsonData[newKey] == 1) {
            jsonData[newKey] = '有';
        }
    }

    var stringData = JSON.stringify(jsonData);
    stringData = stringData.replaceAll('\"', '');
    stringData = stringData.replace('{', '');
    stringData = stringData.replace('}', '');
    stringData = stringData.replaceAll(',', '<br>');
    return stringData;
}

//將人員資料輸出改為中文
function UserDataConverted(data) {
    var jsonData = JSON.parse(data);

    var keyMap = {
        'userNickname': '暱稱',
        'userPwd': '人員密碼',
        'dutyName': '職責名稱',
    };

    //將json key改為上面物件的中文名稱
    for (var key in jsonData) {
        if (key == 'userPwd') {
            jsonData[key] = '****';
        }
        var newKey = keyMap[key];
        if (newKey) {
            jsonData[newKey] = jsonData[key];
            delete jsonData[key];
        }
    }

    var stringData = JSON.stringify(jsonData);
    stringData = stringData.replaceAll('\"', '');
    stringData = stringData.replace('{', '');
    stringData = stringData.replace('}', '');
    stringData = stringData.replaceAll(',', '<br>');
    return stringData;
}

//將產品資料輸出改為中文
function ProductDataConverted(data) {
    var jsonData = JSON.parse(data);

    var keyMap = {
        'productPic': '圖片',
        'productTitle': '標題',
        'productUnitPrice': '單價',
        'productQtn': '庫存數量',
        'productDetail': '詳情',
        'productTypeName': '產品類別'
    };

    //將json key改為上面物件的中文名稱
    for (var key in jsonData) {
        var newKey = keyMap[key];
        if (newKey) {
            jsonData[newKey] = jsonData[key];
            delete jsonData[key];
        }
    }

    var stringData = JSON.stringify(jsonData);
    stringData = stringData.replaceAll('\"', '');
    stringData = stringData.replace('{', '');
    stringData = stringData.replace('}', '');
    stringData = stringData.replace('\\t', '');
    stringData = stringData.replaceAll('\\', ' ');
    stringData = stringData.replaceAll(',', '<br>');
    return stringData;
}

//將會員資料輸出改為中文
function MemberDataConverted(data) {
    var jsonData = JSON.parse(data);

    //Object.entries(jsonData).forEach(([key, value]) => {
    //    if (key == 'gender')
    //    {
    //        if (value == 1) {
    //            jsonData[key] = '男';
    //        } else if (value == 2) {
    //            jsonData[key] = '女';
    //        } else {
    //            jsonData[key] = '其他';
    //        }
    //    }
    //});

    var keyMap = {
        'tel': '聯絡電話',
        'pwd': '密碼',
        'lastName': '姓',
        'firstName': '名',
        'gender': '性別',
        'birth': '生日',
        'mail': 'E-mail',
        'address': '住址',
        'points': '點數',
        'level': '等級'
    };

    //將json key改為上面物件的中文名稱
    for (var key in jsonData) {
        if (key == 'gender') {
            if (jsonData[key] == 1) {
                jsonData[key] = '男';
            } else if (jsonData[key] == 2) {
                jsonData[key] = '女';
            } else {
                jsonData[key] = '其他';
            }
        }
        var newKey = keyMap[key];
        if (newKey) {
            jsonData[newKey] = jsonData[key];
            delete jsonData[key];
        }
    }

    var stringData = JSON.stringify(jsonData);
    stringData = stringData.replaceAll('\"', '');
    stringData = stringData.replace('{', '');
    stringData = stringData.replace('}', '');
    stringData = stringData.replaceAll(',', '<br>');
    return stringData;
}