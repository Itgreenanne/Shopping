
//獲取今日日期的字串
function getTodayString() {
    var today = new Date();
    console.log(today);
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

//開啟報表畫面
function OpenReportBlock() {
    //$('#startDateForOrder').attr('max', today);
    //$('#endDateForOrder').attr('max', today);
    if (myChart !== undefined) {
        myChart.destroy();
    }
    $('#orderReportList').html('');
    $('#startDateForOrder').val('');
    $('#endDateForOrder').val('')
    $("input[name=chkRange]").prop('checked', false);
}


////設定日期輸入的max date是昨天
//function OpenReportBlock() {
//    //var today = new Date();
//    var yesterday = new Date();
//    console.log(yesterday);
//    yesterday.setDate(yesterday.getDate() - 1);
//    var dd = yesterday.getDate();
//    var mm = yesterday.getMonth() + 1; //January is 0!
//    var yyyy = yesterday.getFullYear();

//    if (dd < 10) {
//        dd = '0' + dd
//    }
//    if (mm < 10) {
//        mm = '0' + mm
//    }

//    yesterday = yyyy + '-' + mm + '-' + dd;
//    $('#startDateForOrder').attr('max', yesterday);
//    $('#endDateForOrder').attr('max', yesterday);
//}

//將讀到的起迄日傳送到後端讀取此期間的訂單總價資料
function GetSearchOrderReport() {
    var startDate = $('#startDateForOrder').val();
    var endDate = $('#endDateForOrder').val();
    var startTime = TimeFormatForCompare(startDate);
    var endTime = TimeFormatForCompare(endDate);

    if (!startDate || !endDate) {
        alert('請選擇日期');
    } else if (startTime > endTime) {
        alert('起日晚於迄日，請重新選擇日期');
        $('#startDateForOrder').val(endDate);    
    } else {
        $.ajax({
            url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderByDate',
            type: 'POST',
            data: {
                getStartDate: startDate,
                getEndDate: endDate
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    console.log(jsonResult);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
                    } else {
                        PrintOrderTableForReport(jsonResult);
                        PrintChartForReport(jsonResult);
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

function TimeFormatForCompare(timsString) {
    var formatArr = timsString.split("-");
    var jsTime = new Date(formatArr[0], formatArr[1], formatArr[2]);
    var timeFormat = jsTime.getTime();
    return timeFormat;
}

function PrintOrderTableForReport(jsonResult) {
    $('#orderReportList').html('');

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

var myChart = undefined;

function PrintChartForReport(jsonResult)
{
    var xvalues = [];
    var yvalues = [];

    for (var i = 0; i < jsonResult.length; i++) {
        var dataObject = jsonResult[i];
        xvalues.push(jsonResult[i].createTime);
        yvalues.push(dataObject['payment']);
    }

    if (myChart !== undefined) {
        myChart.destroy();
    }

    var ctx =$('#chart').html('');
    myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: xvalues,
            datasets: [{
                label: 'Sales',
                data: yvalues,
                borderColor: 'rgb(0, 191, 255)',
                backgroundColor: 'rgb(135, 206, 250)',
                borderWidth: 3
            }]
        },
    });
}

//選擇訂單報告區間：當日、當月、當年
function GetSearchOrderForSpecificRange() {

    $("input[type=radio]:checked").each(function () {
        timeRange = $(this).val();
    });

    switch (timeRange) {
        case '1':
            DayRange();
            break;

        case '2':
            MonthRange();
            break;

        case '3':
            YearRange();
            break;
    }
}

//搜尋當日所有訂單
function DayRange() {

    if (myChart !== undefined) {
        myChart.destroy();
    }

    var today = getTodayString();

    if (!today) {
        alert('輸入期間為空字串');
    } else {
        $.ajax({
            url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderByDate',
            type: 'POST',
            data: {
                getStartDate: today,
                getEndDate: today
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    console.log(jsonResult);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
                    } else {
                        PrintDayOrderTableForReport(jsonResult);
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

//搜尋當月所有訂單
function MonthRange() {
    var today = getTodayString();  
    var afterTrimDay = today.slice(0, 8);
    var beginDate = afterTrimDay + '01';

    if (!today || !beginDate) {
        alert('輸入期間為空字串');
    } else {
        $.ajax({
            url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderForMonth',
            type: 'POST',
            data: {
                getendDate: today,
                getStartDate: beginDate
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
                    } else {                       
                        PrintMonthAndYearOrderTable(jsonResult);
                        PrintChartForReport(jsonResult);
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

function PrintDayOrderTableForReport(jsonResult) {
    $('#orderReportList').html('');

    var tableRow = '';
    var allTotalPrice = 0, allDiscount = 0, allPayment = 0;
    var today = getTodayString();
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
        allTotalPrice += jsonResult[i].totalPrice;
        allDiscount += jsonResult[i].discount;
        allPayment += jsonResult[i].payment;
    }

    tableRow +=
        '<tr class="rowOfTotal">' +
        '<td>總和</td >' +
        '<td>' + allTotalPrice + '</td>' +
        '<td>' + allDiscount + '</td>' +
        '<td>' + allPayment + '</td>' +
        '<td colspan="2">' + today + '</td>' +
        '</tr>';

    $('#orderReportList').append(tableRow);
    $('#orderReportList').show();
}

function PrintMonthAndYearOrderTable(jsonResult) {
    $('#orderReportList').html('');

    var allSumTotalPrice = 0, allSumDiscount = 0, allPayment = 0, allOrderQtn = 0;  
    var dayOrMonth = '日';
    var monthOrYear = '月';

    //判斷時間區間的字串createTime是年的話，表格head列印月
    //如果是月的話，表格head列印日
    for (var i = 0; i < jsonResult.length; i++) {
        console.log('jsonResult[i].createTime', jsonResult[i].createTime);
        if ((jsonResult[i].createTime).length < 8) {
            dayOrMonth = '月';
            monthOrYear = '年';
            break;
        }
    }

    var tableRow = '';
    tableRow = '<tr >' +
        '<th>訂單日期</th>' +
        '<th>訂單' + dayOrMonth + '總額</th > ' +
        '<th>折扣日' + dayOrMonth + '總和</th>' +
        '<th>付款金額' + dayOrMonth + '總和</th>' +
        '<th>訂單數量</th>' +
        '</tr>';

    for (var i = jsonResult.length - 1; i >= 0; i--) {
        tableRow +=
            '<tr>' +
            '<td class="timeColumn">' + jsonResult[i].createTime + '</td>' +
            '<td class="totalPriceColumn">' + jsonResult[i].sumTotalPrice + '</td>' +
            '<td class="discountColumn">' + jsonResult[i].sumDiscount + '</td>' +
            '<td class="paymentColumn">' + jsonResult[i].payment + '</td>' +
            '<td class="paymentColumn">' + jsonResult[i].orderQtn + '</td>' +          
            '</tr>';
        allSumTotalPrice += jsonResult[i].sumTotalPrice;
        allSumDiscount += jsonResult[i].sumDiscount;
        allPayment += jsonResult[i].payment;
        allOrderQtn += jsonResult[i].orderQtn;
    }

    tableRow +=
        '<tr class="rowOfTotal">' +
        '<td>' + monthOrYear + '總和</td >' +
        '<td>' + allSumTotalPrice + '</td>' +
        '<td>' + allSumDiscount + '</td>' +
        '<td>' + allPayment + '</td>' +
        '<td>' + allOrderQtn + '</td>' +
        '</tr>';

    $('#orderReportList').append(tableRow);
    $('#orderReportList').show();
}


//清除輸入日期
function ClearOrderReport() {
    $('#startDateForOrder').val('');
    $('#endDateForOrder').val('');
    $("input[name=chkRange]").prop('checked', false);
    $('#orderReportList').html('');
    myChart.destroy();
}

//輸入訂單編號或會員身份証字號來搜尋訂單
function GetSearchpOrder() {
    var inputString = $('#searchOrderByNum').val();
    console.log('輸入字元長度', inputString.length);

    if (!inputString) {
        alert('請輸入搜尋字串');

    } else if ((inputString.length != 10) && (inputString.length != 20)) {
        alert('輸入字元長度錯誤');
        $('#searchOrderByNum').val(''); 

    } else {
        $.ajax({
            url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderByIdNoOrOrderNo',
            type: 'POST',
            data: {
                getString: inputString
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);
                    console.log(jsonResult);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
                    } else {
                        PrintOrderTable(jsonResult);
                        $('#searchOrderByNum').val('');
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

//搜尋當年所有訂單
function YearRange() {
    var today = getTodayString();
    var afterTrimDay = today.slice(0, 5);
    var beginDate = afterTrimDay + '01' + '-' + '01';
    console.log(beginDate);

    if (!today || !beginDate) {
        alert('輸入期間為空字串');
    } else {
        $.ajax({
            url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderForYear',
            type: 'POST',
            data: {
                getendDate: today,
                getStartDate: beginDate
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 3) {
                        alert('找不到訂單');
                    } else {
                        console.log('year', jsonResult);
                        //for (var i = 0; i < jsonResult.length; i++) {
                        //    jsonResult[i].createTime = jsonResult[i].createTime.slice(0, 7);
                        //}
                        PrintMonthAndYearOrderTable(jsonResult);
                    
                        console.log('after substring', jsonResult);
                        PrintChartForReport(jsonResult);
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

function ClearSearchOrder() {
    $('#allOrderList').html('');
}

function PrintOrderTable(jsonResult) {
    $('#allOrderList').html('');

    var tableRow = '';
    tableRow = '<tr>' +
        '<th>訂單代號</th>' +
        '<th>總價</th>' +
        '<th>折扣</th>' +
        '<th>付款金額</th>' +
        '<th>客戶編號</th>' +
        '<th>身份証字號</th>' +
        '<th>姓</th>' +
        '<th>名</th>' +
        //'<th>性別</th>' +
        //'<th>生日</th>' +
        //'<th>Email</th>' +
        //'<th>聯絡電話</th>' +
        //'<th>住址</th>' +
        '<th>訂單建立時間</th>' +
        '<th>細項</th>' +
        '</tr>';

    for (var i = jsonResult.length - 1; i >= 0 ; i--) {
        tableRow +=
            '<tr>' +
            '<td class="orderNoColumn">' + jsonResult[i].orderNumber + '</td>' +
            '<td class="totalPriceColumn">' + jsonResult[i].totalPrice + '</td>' +
            '<td>' + jsonResult[i].discount + '</td>' +
            '<td class="paymentColumn">' + jsonResult[i].payment + '</td>' +
            '<td>' + jsonResult[i].clientId + '</td>' +
            '<td class="idNoColumn">' + jsonResult[i].idNumber.toUpperCase() + '</td>' +
            '<td>' + jsonResult[i].lastname + '</td>' +
            '<td>' + jsonResult[i].firstname + '</td>' +
            //'<td>' + GetGender(jsonResult[i].gender) + '</td>' +
            //'<td class="birthColumn">' + jsonResult[i].birth + '</td>' +
            //'<td class="mailColumn">' + jsonResult[i].mail + '</td>' +
            //'<td class="phoneColumn">' + jsonResult[i].phone + '</td>' +
            //'<td>' + jsonResult[i].address + '</td>' +
            '<td class="timeColumn">' + jsonResult[i].createTime + '</td>' +           
            '<td><button onclick="OpenOrderItemBlock(\'' + jsonResult[i].orderId + '\')">查看</button></td>' +
            '</tr>';
    }

    $('#allOrderList').append(tableRow);
    $('#allOrderList').show();
}

function OpenOrderItemBlock(orderId) {
    $('#overlay').show();
    $('#orderItemBlock').show();
    $.ajax({
        url: '/ajax/AjaxOrder.aspx?fn=GetSearchOrderItemByOrderId',
        type: 'POST',
        data: {
            getOrderId: orderId
        },
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);
                console.log('orderItem',jsonResult);

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else if (jsonResult == 4) {
                    alert('id不是整數');
                } else if (jsonResult == 5) {
                    alert('訂單細項不存在');
                } else {
                    PrintOrderItemTable(jsonResult);                    
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

function CloseOrderItem() {
    $('#overlay').hide();
    $('#orderItemBlock').hide();
}

function PrintOrderItemTable(orderItem) {
    console.log('訂單細項表格', orderItem);
    $('#orderItemTable').html('');
    var tableRow = '';
    tableRow = '<tr>' +
        '<th>' + '項次' + '</th>' +
        '<th>' + '產品標題' + '</th>' +
        '<th>' + '數量' + '</th>' +
        '<th>' + '單價' + '</th>' +
        '<th>' + '小計' + '</th>' +
        '</tr>';

    total = 0;
    for (var i = 0; i < orderItem.length; i++) {
            tableRow +=
                '<tr>' +
                '<td>' + (i+1) + '</td>' +
                '<td class="productTitleColumn">' + orderItem[i].ProductTitle + '</td>' +
                '<td>' + orderItem[i].QtnForBuy + '</td>' +
                '<td class="unitPriceColumn">' + orderItem[i].ProductUnitPrice + '</td>' +
                '<td class="subTotalColumn">' + orderItem[i].QtnForBuy * orderItem[i].ProductUnitPrice + '</td>' +
                '</tr>';
            total += orderItem[i].QtnForBuy * orderItem[i].ProductUnitPrice;                    
    }

    $('#orderItemTable').append(tableRow);
    $('#orderItemTable').show();
    $('#totalInOrderItem').text(total);
}
