//畫面清除
function BlockClear() {
    $("#addDutyBlock").hide();
    $("#searchDutyBlock").hide();
    $("#allDutyList").hide();
}

//不能輸入空白鍵
function NoSpaceKey(inputDutyName) {
    var inputText = $('#inputDutyName').val();
    inputText = inputText.replace(/\s/g, '');
    $('#inputDutyName').val(inputText);
}

function ResetAll() {    
    $("input[type='text']").val('');
    $('input[type=checkbox]').prop('checked', 0);
}

//新增職責傳資料至後端
function AddDuty() {
    var inputDutyName = $('#inputDutyName').val();
    var manageDuty = $('#manageDuty').is(':checked');
    var manageUser = $('#manageUser').is(':checked');
    var manageProductType = $('#manageProductType').is(':checked');
    var manageProduct = $('#manageProduct').is(':checked');
    var manageOrder = $('#manageOrder').is(':checked');
    var manageRecord = $('#manageRecord').is(':checked');
    $('#megAddDuty').text('');

    if (!inputDutyName) {
        $('#megAddDuty').text('請輸入職責名稱');
    } else if (inputDutyName.length > 20) {
        $('#megAddDuty').text('輸入超過20字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=AddDutyVerify',
            type: 'POST',
            data: {
                getDutyName: inputDutyName,
                getMangDuty: manageDuty,
                getMangUser: manageUser,
                getMangProType: manageProductType,
                getMangProduct: manageProduct,
                getMangOrder: manageOrder,
                getMangRecord: manageRecord
            },
            success: function (data) {
                console.log(data);

                if (data == 0) {
                    alert("新增職責成功");
                    ResetAll();
                    $("#addDutyBlock").hide();
                    $("#searchDutyBlock").show();
                    GetAllDuty();
                } else if (data == 1) {
                    $('#megAddDuty').text('已有此職責');
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

//取得並顯示所有職責資料
function GetAllDuty() {
    
    //畫面初始化
    $('#megSearchDuty').text('');
    $('#allDutyList').text('');
    //請求資料
    $.ajax({
        url: '/ajax/AjaxDuty.aspx?fn=GetAllDuty',
        type: 'POST',
        success: function (data) {
            //console.log(data);
            if (!data) {
                alert('資料錯誤');
            } else {
                PrintTable(data);              
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });
    ResetAll();
}

function ClearSearchDuty() {
    $('#searchDutyName').val('');
    GetAllDuty();
}

//
function GetSerachDuty() {
    
    //清空表格
    $('#allDutyList').html('');
    var inputDutyName = $('#searchDutyName').val();
    $('#megSearchDuty').text('');

    if (!inputDutyName) {
        alert('請輸入職責名稱');
        GetAllDuty();

    } else if (inputDutyName.length > 20) {
        alert('輸入超過20字元');
        GetAllDuty();

        //請求資料
    } else {
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=GetSerachDuty',
            type: 'POST',
            data: {
                getDutyName: inputDutyName
            },
            success: function (data) {
                if (!data) {
                    alert('資料錯誤');
                } else {
                    //console.log(data);
                    if (data == 4) {
                        PrintTable(data);
                    } else {                        
                        PrintTable(data);                        
                    }
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

function DeleteDuty(obj) {
    var deleteOrNot = confirm('確定要刪除此筆職責嗎?');
    
    if (deleteOrNot) {
        //取到obj所在元素的祖父輩元素裡的第一個欄位值
        var dutyNameInput = $(obj).closest('tr').find('td:eq(0)').html();
        console.log(dutyNameInput);        
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=DeleteDuty',
            type: 'POST',
            data: {
                dutyName: dutyNameInput
            },
            success: function (data) {
                if (!data) {
                   alert('資料錯誤');
                } else {
                    $('#allDutyList').text('');
                    PrintTable(data);
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

//建立表格
function PrintTable(data) {
    var tableRow = '';   
    var jsonResult = JSON.parse(data, function (key, value) {
        //如有此表格職責則打V
        if (value === 0) {
            return value = '';
        } else if (value === 1) {
            return value = 'V';
        } else return value;

    });
    tableRow = '<tr>' +
        '<th>' + '職責名稱' + '</th>' +
        '<th>' + '職責管理' + '</th>' +
        '<th>' + '人員管理' + '</th>' +
        '<th>' + '產品類別管理' + '</th>' +
        '<th>' + '產品管理' + '</th>' +
        '<th>' + '訂單管理' + '</th>' +
        '<th>' + '操作紀錄管理' + '</th>' +
        '<th>' + '設定' + '</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {
        tableRow +=
            '<tr>' + 
            '<td>' +  jsonResult[i].dutyName + '</td>' + 
            '<td>' + jsonResult[i].mangDuty + '</td>' +
            '<td>' + jsonResult[i].mangUser + '</td>' +
            '<td>' + jsonResult[i].mangProType + '</td>' +
            '<td>' + jsonResult[i].mangProduct + '</td>' +
            '<td>' + jsonResult[i].mangOrder + '</td>' +
            '<td>' + jsonResult[i].mangRecord + '</td>' +
            '<td>' + '<button onclick="DeleteDuty(this)">' +
            '刪除' + '</button>' + ' ' + '<button>' + '修改' + '</button>' + '</td>' +
            '</tr>'; 
    }    
    $('#allDutyList').append(tableRow);
    $('#allDutyList').show();
}