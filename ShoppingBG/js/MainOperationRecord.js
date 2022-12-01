//讀取所有操作紀錄資料
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

        //接收資料解析完後的函數，此變數代表'修改'資料解析完後的before跟after資料，新增跟刪除只有after欄位資料
        var beforeAndAfterDataColumn = DataConversionList(jsonResult[i].function, jsonResult[i].type, jsonResult[i].before,
            jsonResult[i].after);

        tableRow +=
            '<tr>' +
            '<td class="dataIdColumn">' + jsonResult[i].userAccount + '</td>' +
            '<td class="typeColumn">' + (typeArr[(jsonResult[i].type)]) + '</td>' +
            '<td class="functionColumn">' + (functionType[(jsonResult[i].function)]) + '</td>' +
            beforeAndAfterDataColumn +
            '<td class="createTimeForRecord">' + jsonResult[i].createTime + '</td>' +
            '</tr>';    
    }

    $('#operationRecordList').append(tableRow);
    $('#operationRecordList').show();
}

//資料種類轉換函式的選單
//functionIndex=3為修改，其餘新增刪除functionIndex=1和=2 則共用資料解析函式
// 1: 職責，2: 人員，3: 產品，4: 會員
function DataConversionList(functionIndex, dataTypeIndex, beforeObj, afterObj) {
    //修改資料的選項
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
    }
    //新增與刪除資料
    else
    {
        switch (dataTypeIndex) {
            case 1:
                return DutyDataParsedForAddAndDelete(beforeObj, afterObj);
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

//職責修改前後欄位內容轉為中文，chk box的0與1改為'無'與'有'，
//並在有差異的資料以紅色字顯示，並以html元素顯示
function DutyDataParsedForModify(beforeObj, afterObj) {
    console.log(beforeObj);
    console.log(afterObj);
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
    //var keyMap = KeyMapping(1);

    //將before跟 after 的key跟chk的value改為中文
    for (var key in jsonBeforeObj, jsonAfterObj)
    {
        //將before跟 after 的chk box value改為中文
        jsonBeforeObj[key] = GetMarkInChinese(jsonBeforeObj[key]);
        jsonAfterObj[key] = GetMarkInChinese(jsonAfterObj[key]);           
    }

    dataRow = OperationDetailTableData(1, jsonBeforeObj, jsonAfterObj);
    return dataRow;
}

//將before與after的資料以html元素顯示，只有function是修改才會用到此函式
function OperationDetailTableData(dataType, obj1, obj2) {
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
    var keyMap = KeyMapping(dataType);
    console.log(obj1);
    console.log(obj2);
   

    //判斷obj1或obj2是否為空字串 如果是的話 就不要跑進去回圈
    if (obj1) {
        var before = '';
        var obj = obj1;
        for (var key in obj) {
            console.log(obj[key]);
            var newKey = keyMap[key];

            if (newKey) {
                obj[newKey] = obj[key];
            }
            if (obj2) {
                if (obj[key] != obj2[key]) {

                    if (key == 'userPwd') {
                        obj[newKey] = '*********';
                    }
                    before += '<font style="color: red">' + newKey + ': ' + obj[newKey] + '</font></br>';

                } else {
                    if (key == 'userPwd') {
                        obj[newKey] = '*********';
                    }
                    before += newKey + ': ' + obj[newKey] + '</br>';
                }
            } else {
                after = '';
                if (key == 'userPwd') {
                    obj[newKey] = '*********';
                }
                before += newKey + ': ' + obj[newKey] + '</br>';
            }
        }        
    }
    if (obj2) {
        var after = '';
        var obj = obj2;
        for (var key in obj) {

            var newKey = keyMap[key];

            if (newKey) {
                obj[newKey] = obj[key];
            }
            if (obj1) {
                if (obj[key] != obj1[key]) {

                    if (key == 'userPwd') {
                        obj[newKey] = '*********';
                    }
                    after += '<font style="color: red">' + newKey + ': ' + obj[newKey] + '</font></br>';

                } else {
                    if (key == 'userPwd') {
                        obj[newKey] = '*********';
                    }
                    after += newKey + ': ' + obj[newKey] + '</br>';
                }
            } else {
                before = '';
                if (key == 'userPwd') {
                    obj[newKey] = '*********';
                }
                after += newKey + ': ' + obj[newKey] + '</br>';
            }
        }
    }

    return '<td>' + before + '</td><td>' + after + '</td>';
}



//職責新增與刪改後欄位內容轉為中文，chk box的true與false改為'無'與'有'
function DutyDataParsedForAddAndDelete(beforeObj, afterObj) {
    if (beforeObj) {
        var jsonBeforeObj = JSON.parse(beforeObj);
        for (var key in jsonBeforeObj) {
            //將before 的chk box value改為中文
            jsonBeforeObj[key] = GetMarkInChinese(jsonBeforeObj[key]);
        }
    }
    if (afterObj) {
        var jsonAfterObj = JSON.parse(afterObj);
        for (var key in jsonAfterObj) {
            //將after 的chk box value改為中文
            jsonAfterObj[key] = GetMarkInChinese(jsonAfterObj[key]);
        }
    }    
    dataRow = OperationDetailTableData(1, jsonBeforeObj, jsonAfterObj);
    return dataRow;
}


////職責新增與刪改後欄位內容轉為中文，chk box的true與false改為'無'與'有'
//function DutyDataParsedForAddAndDelete(afterObj) {
//    var jsonAfterObj = JSON.parse(afterObj);
//    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
//    var keyMap = KeyMapping(1);
//    var dataRow = '<td class="beforeAndAfterColumn"></td><td class="beforeAndAfterColumn">';

//    //將before跟 after 的key跟chk的value改為中文
//    for (var key in jsonAfterObj) {
//        var newKey = keyMap[key];
//        //將欄位名稱根據上面陣列匹配後改為中文
//        if (newKey) {
//            jsonAfterObj[newKey] = jsonAfterObj[key];
//            delete jsonAfterObj[key];
//        }

//        //將before跟 after 的chk box value改為中文
//        jsonAfterObj[newKey] = GetMarkInChinese(jsonAfterObj[newKey]);
//        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
//    }  

//    dataRow += '</td>';
//    return dataRow;
//}

//將人員資料輸出改為中文，並在有差異的資料以紅色字顯示
//並以html元素顯示
function UserDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員    

    dataRow = OperationDetailTableData(2, jsonBeforeObj, jsonAfterObj);
    return dataRow;
}

//人員新增與刪改後欄位內容轉為中文，人員密碼只顯示****
function UserDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
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
            jsonAfterObj[newKey] = '*********';
        }

        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }

    dataRow += '</td>';
    return dataRow;
}

//將產品修改前後資料輸出轉為中文並以html元素顯示
function ProductDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);


    //將json key改為上面物件的中文名稱
    for (var key in jsonBeforeObj, jsonAfterObj) {       

        //詳情如有換行符號\n 在表格顯示時也執行換行
        if (key == 'productDetail') {
            jsonBeforeObj[key] = jsonBeforeObj[key].replaceAll('\n', '</br>');
            jsonAfterObj[key] = jsonAfterObj[key].replaceAll('\n', '</br>');
        }      
    }

    dataRow = OperationDetailTableData(3, jsonBeforeObj, jsonAfterObj);
    return dataRow;
}

//產品新增與刪改後欄位內容轉為中文並以html元素顯示
function ProductDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
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
        if (key == 'productDetail') {
            jsonAfterObj[key] = jsonAfterObj[key].replaceAll('\n', '</br>');
        }

        dataRow += newKey + ': ' + jsonAfterObj[newKey] + '</br>';
    }

    dataRow += '</td>';
    return dataRow;
}

//將會員資料輸出改為中文並以html元素顯示
function MemberDataParsedForModify(beforeObj, afterObj) {
    var jsonBeforeObj = JSON.parse(beforeObj);
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員

    //將json key改為上面物件的中文名稱
    for (var key in jsonBeforeObj, jsonAfterObj) {

        //將資料庫會員性別欄位由數字轉中文：1 = M，2 = F，3 = O
        if (key == 'gender')
        {
           jsonBeforeObj[key] = GetGender(jsonBeforeObj[key]);
           jsonAfterObj[key] = GetGender(jsonAfterObj[key]);
        }
    }

    dataRow = OperationDetailTableData(4, jsonBeforeObj, jsonAfterObj);
    return dataRow;
}

//會員新增與刪改後欄位內容轉為中文
function MemberDataParsedForAddAndDelete(afterObj) {
    var jsonAfterObj = JSON.parse(afterObj);
    //到KeyMapping函式取得中文的欄位名，1: 職責，2: 人員，3: 產品，4: 會員
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
    switch (dataType) {
        case 1:            
            return {
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
            return {
                'userAccount': '帳號',
                'userNickname': '暱稱',
                'userPwd': '人員密碼',
                'dutyName': '職責名稱',
            };
            break;
        case 3:
            return {
                'productPic': '圖片',
                'productTitle': '標題',
                'productUnitPrice': '單價',
                'productQtn': '庫存數量',
                'productDetail': '詳情',
                'productTypeName': '產品類別'
            };
            break;
        case 4:
            return {
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