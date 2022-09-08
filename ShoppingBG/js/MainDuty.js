var dutyInfoGlobal;
var dataIndex;

//畫面清除
function BlockClear() {
    $("#addDutyBlock").hide();
    $("#searchDutyBlock").hide();
    $("#allDutyList").hide();
    $("#modifyDutyBlock").hide();
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
    //請求資料
    $.ajax({
        url: '/ajax/AjaxDuty.aspx?fn=GetAllDuty',
        type: 'POST',
        success: function (data) {            
            if (!data) {
                alert('資料錯誤');
            } else {
                var jsonResult = JSON.parse(data);                
                PrintDutyTable(jsonResult);
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

//清空查詢職責的輸入框
function ClearSearchDuty() {
    $('#searchDutyName').val('');
    GetAllDuty();
}

//輸入職責名稱查詢職責
function GetSerachDuty() {
    
    //清空表格
    //$('#allDutyList').html('');
    var inputDutyName = $('#searchDutyName').val();    

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
                    var jsonResult = JSON.parse(data);
                    PrintDutyTable(jsonResult);
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

//刪除職責
function DeleteDuty(dutyInfoIndex) {
    var deleteOrNot = confirm('確定要刪除此筆職責嗎?');
    
    if (deleteOrNot) {        
        var dutyNameInput = dutyInfoGlobal[dutyInfoIndex].dutyName;

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
                    $('#allDutyList').html('');
                    var jsonResult = JSON.parse(data);
                    PrintDutyTable(jsonResult);
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

//修改職責(從前端讀選擇列的資料)
function ModifyDutyReadFront(dutyInfoIndex) {
    dataIndex = dutyInfoIndex;
    //dataIndex = temp;
    //禁能職責查詢與表格的div
    $('#allDutyList *').prop('disabled', true);
    $('#searchDutyBlock *').prop('disabled', true);
    //重置所有checkbox
    $('.chkModifyDuty').prop('checked', false);
    
    var dutyInfo = dutyInfoGlobal[dutyInfoIndex];   
    //顯示跟選擇列資料一樣的資料
    $('#modifyDutyName').val(dutyInfo.dutyName);
    if (dutyInfo.mangDuty == 1) {
        $('#manageDutyMod').prop('checked', true);
    }
    if (dutyInfo.mangUser == 1) {
        $('#manageUserMod').prop('checked', true);
    }
    if (dutyInfo.mangProType == 1) {
        $('#manageProductTypeMod').prop('checked', true);
    }
    if (dutyInfo.mangProduct == 1) {
        $('#manageProductMod').prop('checked', true);
    }
    if (dutyInfo.mangOrder == 1) {
        $('#manageOrderMod').prop('checked', true);
    }
    if (dutyInfo.mangRecord == 1) {
        $('#manageRecordMod').prop('checked', true);
    }
    $('#modifyDutyBlock').show();          
}

function ModifyDutyReadBack(dutyInfoIndex) {
    var inputDutyName = dutyInfoGlobal[dutyInfoIndex].dutyName;    
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
                var jsonResult= JSON.parse(data);
                console.log(jsonResult);
                console.log(jsonResult[0].dutyName);
                $('#allDutyList *').prop('disabled', true);
                $('#searchDutyBlock *').prop('disabled', true);
                //重置所有checkbox
                $('.chkModifyDuty').prop('checked', false);
                //顯示跟選擇列資料一樣的資料                
                $('#modifyDutyName').val(jsonResult[0].dutyName);

                if (jsonResult.mangDuty == 1) {
                    $('#manageDutyMod').prop('checked', true);
                }
                if (jsonResult.mangUser == 1) {
                    $('#manageUserMod').prop('checked', true);
                }
                if (jsonResult.mangProType == 1) {
                    $('#manageProductTypeMod').prop('checked', true);
                }
                if (jsonResult.mangProduct == 1) {
                    $('#manageProductMod').prop('checked', true);
                }
                if (jsonResult.mangOrder == 1) {
                    $('#manageOrderMod').prop('checked', true);
                }
                if (jsonResult.mangRecord == 1) {
                    $('#manageRecordMod').prop('checked', true);
                }
                $('#modifyDutyBlock').show();          
                
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

function ModifyDuty() {
    var dutyInfo = dutyInfoGlobal[dataIndex]; 
    var inputDutyName = $('#modifyDutyName').val();
    var manageDuty = $('#manageDutyMod').is(':checked');
    var manageUser = $('#manageUserMod').is(':checked');
    var manageProductType = $('#manageProductTypeMod').is(':checked');
    var manageProduct = $('#manageProductMod').is(':checked');
    var manageOrder = $('#manageOrderMod').is(':checked');
    var manageRecord = $('#manageRecordMod').is(':checked');

    if (inputDutyName == dutyInfo.dutyName && manageDuty == dutyInfo.mangDuty && manageUser == dutyInfo.mangUser
        && manageProductType == dutyInfo.mangProType && manageProduct == dutyInfo.mangProduct
        && manageOrder == dutyInfo.mangOrder && manageRecord == dutyInfo.mangRecord) {
        alert('資料完全沒有修改');

    } else {
        
    }
}

function CancelDutyModifyBlock() {    
    $('#modifyDutyBlock').hide();
    //致能職責查詢與表格的div
    $('#allDutyList *').prop('disabled', false);
    $('#searchDutyBlock *').prop('disabled', false);  
}


//建立職責表格   (20220906: 後面再看PrintTable)
//data = []
function PrintDutyTable(jsonResult) {
    $('#allDutyList').html('');       
    var dutyInfoForTable = [];
    
    for (var i = 0; i < jsonResult.length; i++) {
        var temp = {};

        $.each(jsonResult[i], function (key, value) {            
            temp[key] = value;

            if (temp[key] === 0) {
                temp[key] = '';
            } else if (temp[key] === 1) {
                temp[key] = 'V';
            } else return temp[key];

        });

        dutyInfoForTable[i] = temp;
    }
    
    //將區域變數值傳給全域變數
    dutyInfoGlobal = jsonResult;
    var tableRow = '';
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

    for (var i = 0; i < dutyInfoForTable.length; i++) {
        tableRow +=
            '<tr>' +
        '<td>' + dutyInfoForTable[i].dutyName + '</td>' +
        '<td>' + dutyInfoForTable[i].mangDuty + '</td>' +
        '<td>' + dutyInfoForTable[i].mangUser + '</td>' +
        '<td>' + dutyInfoForTable[i].mangProType + '</td>' +
        '<td>' + dutyInfoForTable[i].mangProduct + '</td>' +
        '<td>' + dutyInfoForTable[i].mangOrder + '</td>' +
        '<td>' + dutyInfoForTable[i].mangRecord + '</td>' +
        '<td> <button onclick="DeleteDuty(\'' + i + '\')">' +
            '刪除' + '</button>' + ' ' +
        '<button onclick="ModifyDutyReadFront(\'' + i + '\')">' + '修改(前)' + '</button>' +' '+
        '<button onclick="ModifyDutyReadBack(\'' + i + '\')">' + '修改(後)' + '</button>' + '</td>' +
            '</tr>';
    }
    $('#allDutyList').append(tableRow);
    $('#allDutyList').show();
}



//$.ajax({
//    url: '/ajax/AjaxDuty.aspx?fn=ModifyDuty',
//    type: 'POST',
//    data: {
//        getDutyName: inputDutyName,
//        getMangDuty: manageDuty,
//        getMangUser: manageUser,
//        getMangProType: manageProductType,
//        getMangProduct: manageProduct,
//        getMangOrder: manageOrder,
//        getMangRecord: manageRecord
//    },
//    success: function (data) {

//        if (!data) {
//            alert('資料錯誤');
//        } else {
//            var jsonResult = JSON.parse(data);
//            PrintDutyTable(jsonResult);
//        }
//    },
//    error: function (err) {
//        str = JSON.stringify(err, null, 2);
//        console.log('err:');
//        console.log(err);
//        alert(str);
//    }
//});