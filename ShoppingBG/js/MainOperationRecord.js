
//搜尋全部操作紀錄
function GetSearchAllOperationRecord() {
    //var startDate = $('#startDateForRecord').val();
    //var endDate = $('#endDateForRecord').val();

    //if (!startDate || !endDate) {
    //    alert('請選擇日期');
    //} else {
        $.ajax({
            url: '/ajax/AjaxOperationRecord.aspx?fn=GetSearchAllOperationRecord',
            type: 'POST',
            //data: {
            //    getStartDate: startDate,
            //    getEndDate: endDate
            //},
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
   /* }*/
}


//清除輸入日期框及表格
function ClearRecord() {
    $('#startDateForRecord').val('');
    $('#endDateForRecord').val('');
    $('#operationRecordList').html('');
}

//列印起迄日期間操作紀錄的表格
function PrintOperationRecord(jsonResult) {
    $('#operationRecordList').html('');

    var tableRow = '';
    tableRow = '<tr>' +
        '<th>資料id</th>' +
        '<th>資料種類</th>' +
        '<th>操作種類</th>' +
        '<th>修改前</th>' +
        '<th>修改後</th>' +
        '<th>操作紀錄寫入時間</th>' +
        '</tr>';

    for (var i = jsonResult.length - 1; i >= 0; i--) {
        console.log(jsonResult);
        var typeArr = ['職責', '人員', '產品', '會員', '訂單'];
        var functionType = ['新增', '刪除', '修改'];

        if ((jsonResult[i].function) == 3) {
            var beforeData = dataConversionList(jsonResult[i].type, jsonResult[i].before);
            var afterData = dataConversionList(jsonResult[i].type, jsonResult[i].after);
        } else {
            var beforeData = jsonResult[i].before;
            var afterData = jsonResult[i].after;
        }

        tableRow +=
            '<tr>' +
            '<td class="dataIdColumn">' + jsonResult[i].dataId + '</td>' +
            '<td class="typeColumn">' + typeArr[(jsonResult[i].type)-1] + '</td>' +
            '<td class="functionColumn">' + functionType[(jsonResult[i].function)-1] + '</td>' +
            '<td class="beforeColumn">' + beforeData + '</td>' +
            '<td class="afterColumn">' + afterData + '</td>' +
            '<td class="timeColumn">' + jsonResult[i].createTime + '</td>' +
            '</tr>';    
    }

    $('#operationRecordList').append(tableRow);
    $('#operationRecordList').show();
}

//資料種類轉換函式的選單
function dataConversionList(index, data) {
    switch (index){
        case 1:
            return dutyDataConverted(data);
            break;
        case 2:
            return;
    }
}



function dutyDataConverted(data) {
    var jsonData = JSON.parse(data);

    Object.entries(jsonData).forEach(([key, value]) => {
        if (value == 0) {
            jsonData[key] = '無';
        } else if (value == 1) {
            jsonData[key] = '有';
        }
    });

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
    }

    var stringData = JSON.stringify(jsonData);
    stringData = stringData.replaceAll('\"', '');
    stringData = stringData.replace('{', '');
    stringData = stringData.replace('}', '');
    stringData = stringData.replace(',', '<br>');
    return stringData;
}