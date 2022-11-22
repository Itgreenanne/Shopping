
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
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
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
//列印起迄日的表格
function PrintOperationRecord(jsonResult) {
    $('#operationRecordList').html('');

    var tableRow = '';
    tableRow = '<tr>' +
        '<th>訂單代號</th>' +
        '<th>總價</th>' +
        '<th>折扣</th>' +
        '<th>付款金額</th>' +
        '<th>會員身份証字號</th>' +
        '<th>訂單建立時間</th>' +
        '</tr>';

    for (var i = jsonResult.length - 1; i >= 0; i--) {
        tableRow +=
            '<tr>' +
            '<td class="orderNoColumn">' + jsonResult[i].orderNumber + '</td>' +
            '<td class="totalPriceColumn">' + jsonResult[i].totalPrice + '</td>' +
            '<td class="discountColumn">' + jsonResult[i].discount + '</td>' +
            '<td class="paymentColumn">' + jsonResult[i].payment + '</td>' +
            '<td class="idNoColumn">' + jsonResult[i].idNumber.toUpperCase() + '</td>' +
            '<td class="timeColumn">' + jsonResult[i].createTime + '</td>' +
            '</tr>';
    }

    $('#orderReportList').append(tableRow);
    $('#orderReportList').show();
}