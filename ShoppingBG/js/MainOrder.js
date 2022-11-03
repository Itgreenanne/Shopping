
//輸入訂單編號或會員身份証字號來搜尋訂單
function GetSearchpOrder() {
    var inputString = $('#searchOrderByNum').val();
    console.log('輸入字元長度', inputString.length);

    if (!inputString) {
        alert('請輸入搜尋字串');

    } else if ((inputString.length != 10) && (inputString.length != 20)) {
        alert('輸入字元長度錯誤');
        $('#searchOrderByNum').val(''); 

        //請求資料
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
