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
    console.log(jsonResult);
    $('#operationRecordList').html('');
    var typeArr = ['', '職責', '人員', '產品', '會員', '訂單'];
    var functionType = ['', '新增', '刪除', '修改'];
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
             
        var operationDetail = DataConversionList(jsonResult[i].function, jsonResult[i].type, jsonResult[i].before, jsonResult[i].after);

        tableRow +=
            '<tr>' +
            '<td class="dataIdColumn">' + jsonResult[i].userAccount + '</td>' +
            '<td class="typeColumn">' + (typeArr[(jsonResult[i].type)]) + '</td>' +
            '<td class="functionColumn">' + (functionType[(jsonResult[i].function)]) + '</td>' +
            operationDetail +
            '<td class="createTimeForRecord">' + jsonResult[i].createTime + '</td>' +
            '</tr>';    
    }

    $('#operationRecordList').append(tableRow);
    $('#operationRecordList').show();
}

//資料種類轉換函式的選單
//functionIndex=3為修改，其餘新增刪除function=1和=2 則共用資料解析函式
// 1: 職責，2: 人員，3: 產品，4: 會員
function DataConversionList(functionIndex, dataTypeIndex, beforeObj, afterObj) {
    if (functionIndex == 3)
    {
        switch (dataTypeIndex) {
            case 1:
                return DutyDataParsedForModify(beforeObj, afterObj);
                break;
            case 2:
                return UserDataParsedForModify(beforeObj, afterObj);
                break;
            case 3:
                return ProductDataParsedForModify(beforeObj, afterObj);
                break;
            case 4:
                return MemberDataParsedForModify(beforeObj, afterObj);
                break;
        }
    } else
    {
        switch (dataTypeIndex) {
            case 1:
                return DutyDataParsedForAddAndDelete(afterObj);
                break;
            case 2:
                return UserDataParsedForAddAndDelete(afterObj);
                break;
            case 3:
                return ProductDataParsedForAddAndDelete(afterObj);
                break;
            case 4:
                return MemberDataParsedForAddAndDelete(afterObj);
                break;
        }
    }
}

//職責修改前後欄位內容轉為中文，chk box的0與1改為'無'與'有'，並在有差異的資料以紅色字顯示
function DutyDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(1);

    var dataRow = '<td class="beforeAndAfterColumn">';
    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonBeforeObj, jsonAfterObj)
    {
        var newKey = keyMap[key];
        //將欄位名稱根據KeyMapping匹配後改為中文 並將有英文名稱的舊欄位刪除
        if (newKey) {
            jsonBeforeObj[newKey] = jsonBeforeObj[key];
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonBeforeObj[key];
            delete jsonAfterObj[key];
        }

        //將before跟 after 的chk box value改為中文
        jsonBeforeObj[newKey] = GetMarkInChinese(jsonBeforeObj[newKey]);
        jsonAfterObj[newKey] = GetMarkInChinese(jsonAfterObj[newKey]);        

        //將before欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色       
        dataRow += CompareAndColorData(newKey, jsonAfterObj[newKey], jsonBeforeObj[newKey]);
    }

    dataRow += '</td><td class="beforeAndAfterColumn">';

     //將after欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色
    for (var newKey in jsonBeforeObj, jsonAfterObj)
    {
        dataRow += CompareAndColorData(newKey, jsonBeforeObj[newKey], jsonAfterObj[newKey]);
    }

    dataRow += '</td>';
    return dataRow;
}

//職責新增與刪改後欄位內容轉為中文，chk box的true與false改為'無'與'有'
function DutyDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(1);
    var dataRow = '<td class="beforeAndAfterColumn"></td><td class="beforeAndAfterColumn">';

    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonAfterObj) {
        var newKey = keyMap[key];
        //將欄位名稱根據上面陣列匹配後改為中文
        if (newKey) {
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonAfterObj[key];
        }

        //將before跟 after 的chk box value改為中文
        jsonAfterObj[newKey] = GetMarkInChinese(jsonAfterObj[newKey]);
        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }  

    dataRow += '</td>';
    return dataRow;
}

//將人員資料輸出改為中文，並在有差異的資料以紅色字顯示
function UserDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(2);
    var dataRow = '<td class="beforeAndAfterColumn">';

    //將json key改為KeyMapping裡的的中文名稱 並刪除英文名稱的舊欄位
    for (var key in jsonBeforeObj, jsonAfterObj)
    {
        var newKey = keyMap[key];

        //將欄位名稱根據上面陣列匹配後改為中文
        if (newKey) {
            jsonBeforeObj[newKey] = jsonBeforeObj[key];
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonBeforeObj[key];
            delete jsonAfterObj[key];
        }

        if (jsonBeforeObj[newKey] != jsonAfterObj[newKey]) {
            if (newKey == '人員密碼') {
                jsonBeforeObj[newKey] = '****';
            }
            dataRow += '<font style="color: red">' + newKey + ': ' + jsonBeforeObj[newKey] + '</font></br>';

        } else {
            dataRow += newKey + ': ' + jsonBeforeObj[newKey] + '</br>';
        }
    }

    dataRow += '</td><td class="beforeAndAfterColumn">';

    //將after欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色
    for (var newKey in jsonBeforeObj, jsonAfterObj) {
    
        if (jsonBeforeObj[newKey] != jsonAfterObj[newKey]) {
            if (newKey == '人員密碼') {
                jsonAfterObj[newKey] = '****';
            }
            dataRow += '<font style="color: red">' + newKey + ': ' + jsonAfterObj[newKey] + '</font></br>';

        } else {
            dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
        }
    }

    dataRow += '</td>';
    return dataRow;
}

//人員新增與刪改後欄位內容轉為中文，人員密碼只顯示****
function UserDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(2);
    var dataRow = '<td class="beforeAndAfterColumn"></td><td class="beforeAndAfterColumn">';

    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonAfterObj) {
        var newKey = keyMap[key];
        //將欄位名稱根據上面陣列匹配後改為中文
        if (newKey) {
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonAfterObj[key];
        }

        if (newKey == '人員密碼') {
            jsonAfterObj[newKey] = '****';
        }

        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }

    dataRow += '</td>';
    return dataRow;
}

//將產品資料輸出改為中文
function ProductDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(3);
    var dataRow = '<td class="beforeAndAfterColumn">';

    //將json key改為上面物件的中文名稱
    for (var key in jsonBeforeObj, jsonAfterObj) {

        var newKey = keyMap[key];

        if (newKey) {
            jsonBeforeObj[newKey] = jsonBeforeObj[key];
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonBeforeObj[key];
            delete jsonAfterObj[key];
        }

        //詳情如有換行符號\n 在表格顯示時也執行換行
        if (newKey == '詳情') {
            jsonBeforeObj[newKey] = jsonBeforeObj[newKey].replaceAll('\n', '</br>');
            jsonAfterObj[newKey] = jsonAfterObj[newKey].replaceAll('\n', '</br>');
        }

        dataRow += CompareAndColorData(newKey, jsonAfterObj[newKey], jsonBeforeObj[newKey]);
    }

    dataRow += '</td><td class="beforeAndAfterColumn">';

    //將after欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色
    for (var newKey in jsonBeforeObj, jsonAfterObj) {

        dataRow += CompareAndColorData(newKey, jsonBeforeObj[newKey], jsonAfterObj[newKey]);
    }

    dataRow += '</td>';
    return dataRow;
}

//產品新增與刪改後欄位內容轉為中文，人員密碼只顯示****
function ProductDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(3);
    var dataRow = '<td class="beforeAndAfterColumn"></td><td class="beforeAndAfterColumn">';

    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonAfterObj) {
        var newKey = keyMap[key];
        //將欄位名稱根據上面陣列匹配後改為中文
        if (newKey) {
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonAfterObj[key];
        }

        //詳情如有換行符號\n 在表格顯示時也執行換行
        if (newKey == '詳情') {
            jsonAfterObj[newKey] = jsonAfterObj[newKey].replaceAll('\n', '</br>');
        }

        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }

    dataRow += '</td>';
    return dataRow;
}

//將會員資料輸出改為中文
function MemberDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(4);
    var dataRow = '<td class="beforeAndAfterColumn">';

    //將json key改為上面物件的中文名稱
    for (var key in jsonBeforeObj, jsonAfterObj) {

        var newKey = keyMap[key];

        //將資料庫會員性別欄位由數字轉中文：1 = M，2 = F，3 = O
        if (key == 'gender')
        {
           jsonBeforeObj[key] = GetGender(jsonBeforeObj[key]);
           jsonAfterObj[key] = GetGender(jsonAfterObj[key]);
        }

        if (newKey) {
            jsonBeforeObj[newKey] = jsonBeforeObj[key];
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonBeforeObj[key];
            delete jsonAfterObj[key];
        }

        dataRow += CompareAndColorData(newKey, jsonAfterObj[newKey], jsonBeforeObj[newKey]);
    }

    dataRow += '</td><td class="beforeAndAfterColumn">';

    //將after欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色
    for (var newKey in jsonBeforeObj, jsonAfterObj) {

        dataRow += CompareAndColorData(newKey, jsonBeforeObj[newKey], jsonAfterObj[newKey]);
    }

    dataRow += '</td>'
    return dataRow;
}

//會員新增與刪改後欄位內容轉為中文
function MemberDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    var keyMap = KeyMapping(4);
    var dataRow = '<td class="beforeAndAfterColumn"></td><td class="beforeAndAfterColumn">';

    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonAfterObj) {
        var newKey = keyMap[key];

        //將資料庫會員性別欄位由數字轉中文：1 = M，2 = F，3 = O
        if (key == 'gender') {
            jsonAfterObj[key] = GetGender(jsonAfterObj[key]);
        }
        //將欄位名稱根據上面陣列匹配後改為中文
        if (newKey) {
            jsonAfterObj[newKey] = jsonAfterObj[key];
            delete jsonAfterObj[key];
        }       

        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }

    dataRow += '</td>';
    return dataRow;
}

//將before跟after欄位有變更的資料文字變紅色，沒變更的資料則還是顯示黑色
function CompareAndColorData(newKey, obj1, obj2) {

    var dataProcessed;
    //資料裡有換行符號就換行

    if (obj1 != obj2) {
        dataProcessed = '<font style="color: red">' + newKey + ': ' + obj2 + '</font></br>';

    } else {
        dataProcessed = newKey + ': ' + obj2 + '</br>';
    }
    return dataProcessed;
}

//將before跟 after 的chk box value改為中文
function GetMarkInChinese(obj) {
    if (obj == 0) {
        return '無';
    } else if (obj == 1) {
        return '有';
    } else {
        return obj;
    }
}


//將資料的各英文欄位名稱轉為中文欄位名稱的物件
// 1: 職責，2: 人員，3: 產品，4: 會員
function KeyMapping(dataType) {
    var data = {};
    switch (dataType) {
        case 1:            
            return data = {
                'dutyName': '職責名稱',
                'mangDuty': '職責管理',
                'mangUser': '人員管理',
                'mangProType': '產品類別管理',
                'mangProduct': '產品管理',
                'mangOrder': '訂單管理',
                'mangRecord': '操作紀錄管理'
            };
            break;
        case 2:
            return data = {
                'userAccount': '帳號',
                'userNickname': '暱稱',
                'userPwd': '人員密碼',
                'dutyName': '職責名稱',
            };
            break;
        case 3:
            return data = {
                'productPic': '圖片',
                'productTitle': '標題',
                'productUnitPrice': '單價',
                'productQtn': '庫存數量',
                'productDetail': '詳情',
                'productTypeName': '產品類別'
            };
            break;
        case 4:
            return data = {
                'idNo': '身份証字號',
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
            break;
    }
}


////將資料庫會員性別欄位由數字轉中文：1=男，2=女，3=其他
//function GetGenderInChinese(obj) {
//    if (obj == 1) {
//        return '男';
//    } else if (obj == 2) {
//        return'女';
//    } else {
//        return'其他';
//    }   
//}



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