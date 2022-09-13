var dutyInfoGlobal=[];
var dataIndex;

//畫面清除
function BlockClear() {
    $('#overlay').hide();
    $('#addDutyBlock').hide();
    $('#searchDutyBlock').hide();
    $('#allDutyList').hide();
    $('#modifyDutyBlock').hide();
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
                //將區域變數值傳給全域變數當緩存
                dutyInfoGlobal = JSON.parse(data);
                console.log('global=', dutyInfoGlobal);
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

//清空查詢職責的輸入框
function ClearSearchDuty() {
    $('#searchDutyName').val('');
    GetAllDuty();
}

//輸入職責名稱查詢職責
function GetSearchDutyByName() {
    
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
            url: '/ajax/AjaxDuty.aspx?fn=GetSerachDutyByNmae',
            type: 'POST',
            data: {
                getDutyName: inputDutyName
            },
            success: function (data) {

                if (!data) {
                    alert('資料錯誤');
                } else {
                    var jsonResult = JSON.parse(data);
                    //將區域變數值傳給全域變數當緩存
                    dutyInfoGlobal = JSON.parse(data);
                    console.log('global=', dutyInfoGlobal);
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
function DeleteDuty(dutyId) {
    var deleteOrNot = confirm('確定要刪除此筆職責嗎?');
    console.log(dutyId);
    
    if (deleteOrNot) { 
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=DeleteDuty',
            type: 'POST',
            data: {
                getDutyId: dutyId
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
function ModifyDutyReadFront(dutyId) {
    var index;    
    //修改職責的div跳出時的遮罩
    $('#overlay').show();        
    //重置所有checkbox
    $('.chkModifyDuty').prop('checked', false);

    //用dutyId找到index
    for (var i = 0; i < dutyInfoGlobal.length; i++) {
        if (dutyInfoGlobal[i].dutyId == dutyId) index = i;
    }
    
    //將index值存入緩存
    dataIndex = index;
    //顯示跟選擇列資料一樣的資料
    $('#modifyDutyName').val(dutyInfoGlobal[index].dutyName);
    if (dutyInfoGlobal[index].mangDuty == 1) {
        $('#manageDutyMod').prop('checked', true);
    }
    if (dutyInfoGlobal[index].mangUser == 1) {
        $('#manageUserMod').prop('checked', true);
    }
    if (dutyInfoGlobal[index].mangProType == 1) {
        $('#manageProductTypeMod').prop('checked', true);
    }
    if (dutyInfoGlobal[index].mangProduct == 1) {
        $('#manageProductMod').prop('checked', true);
    }
    if (dutyInfoGlobal[index].mangOrder == 1) {
        $('#manageOrderMod').prop('checked', true);
    }
    if (dutyInfoGlobal[index].mangRecord == 1) {
        $('#manageRecordMod').prop('checked', true);
    }
    $('#modifyDutyBlock').show();    
}

function ModifyDutyReadBack(dutyId) {
    $.ajax({
        url: '/ajax/AjaxDuty.aspx?fn=GetSerachDutyById',
        type: 'POST',
        data: {
            getDutyId: dutyId
        },
        success: function (data) {

            if (!data ||data == 4) {
                alert('資料錯誤');
            } else {
                var jsonResult = JSON.parse(data);
                //for ModifyDuty()裡的變數dutyInfo
                dutyInfoGlobal[dataIndex] = jsonResult[0];
                //重置所有checkbox
                $('.chkModifyDuty').prop('checked', false);
                //顯示跟選擇列資料一樣的資料                
                $('#modifyDutyName').val(jsonResult[0].dutyName);

                if (jsonResult[0].mangDuty == 1) {
                    $('#manageDutyMod').prop('checked', true);
                }
                if (jsonResult[0].mangUser == 1) {
                    $('#manageUserMod').prop('checked', true);
                }
                if (jsonResult[0].mangProType == 1) {
                    $('#manageProductTypeMod').prop('checked', true);
                }
                if (jsonResult[0].mangProduct == 1) {
                    $('#manageProductMod').prop('checked', true);
                }
                if (jsonResult[0].mangOrder == 1) {
                    $('#manageOrderMod').prop('checked', true);
                }
                if (jsonResult[0].mangRecord == 1) {
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

//修改職責
function ModifyDuty() {
    console.warn('dutyInfoGlobal[dataIndex=]', dutyInfoGlobal[dataIndex]);
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
    } else if (!inputDutyName) {
        alert('請輸入職責名稱');        
    } else if (inputDutyName.length > 20) {
        alert('輸入超過20字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxDuty.aspx?fn=ModifyDuty',
            type: 'POST',
            data: {
                getdutyId: dutyInfo.dutyId,
                getDutyName: inputDutyName,
                getMangDuty: manageDuty,
                getMangUser: manageUser,
                getMangProType: manageProductType,
                getMangProduct: manageProduct,
                getMangOrder: manageOrder,
                getMangRecord: manageRecord
            },
            success: function (data) {

                if (data == 5) {
                    alert("修改職責成功");                    
                    $('#modifyDutyBlock').hide();
                    $('#overlay').hide();
                } else if (data == 1) {
                    alert('已有此職責名稱');                    
                }
            },
            error: function (err) {
                str = JSON.stringify(err, null, 2);
                console.log('err:');
                console.log(err);
                alert(str);
            }
        });
        GetAllDuty();
    }
}

//修改職責彈跳視窗取消
function CancelDutyModifyBlock() {
    $('#modifyDutyBlock').hide();
    $('#overlay').hide();    
}


//建立職責表格   (20220906: 後面再看PrintTable)
//data = []
function PrintDutyTable(jsonResult) {
    console.log('printtable()=',jsonResult);
    $('#allDutyList').html('');
    //將區域變數值傳給全域變數
    //dutyInfoGlobal = jsonResult;    
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

    for (var i = 0; i < jsonResult.length; i++) {
        FillMarks(jsonResult[i], 'mangDuty');
        FillMarks(jsonResult[i], 'mangUser');
        FillMarks(jsonResult[i], 'mangProType');
        FillMarks(jsonResult[i], 'mangProduct');
        FillMarks(jsonResult[i], 'mangOrder');
        FillMarks(jsonResult[i], 'mangRecord');
        tableRow +=
            '<tr>' +
            '<td>' + jsonResult[i].dutyName + '</td>' +
            '<td>' + jsonResult[i].mangDuty + '</td>' +
            '<td>' + jsonResult[i].mangUser + '</td>' +
            '<td>' + jsonResult[i].mangProType + '</td>' +
            '<td>' + jsonResult[i].mangProduct + '</td>' +
            '<td>' + jsonResult[i].mangOrder + '</td>' +
            '<td>' + jsonResult[i].mangRecord + '</td>' +         
            '<td> <button onclick="DeleteDuty(\'' + jsonResult[i].dutyId + '\')">' +
            '刪除' + '</button>' + ' ' +
            '<button onclick="ModifyDutyReadFront(\'' + jsonResult[i].dutyId + '\')">' + '修改(前)' + '</button>' + ' ' +
            '<button onclick="ModifyDutyReadBack(\'' + jsonResult[i].dutyId + '\')">' + '修改(後)' + '</button>' + '</td>' +
            '</tr>';
    }
    
    $('#allDutyList').append(tableRow);
    $('#allDutyList').show();
}

//將chkbox的0與1轉換成''與V
function FillMarks(jsondata, key) {
    if (jsondata[key] === 0) {
        jsondata[key] = ' ';
    } else if (jsondata[key] === 1) {
        jsondata[key] = 'V';
    }
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


   //for (var i = 0; i < jsonResult.length; i++) {
    //    var temp = {};

    //    $.each(jsonResult[i], function (key, value) {
    //        temp[key] = value;

    //        if (temp[key] === 0) {
    //            temp[key] = '';
    //        } else if (temp[key] === 1) {
    //            temp[key] = 'V';
    //        } else return temp[key];

    //    });

    //    dutyInfoForTable[i] = temp;
    //    tableRow +=
    //        '<tr>' +
    //    '<td>' + dutyInfoForTable[i].dutyName + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangDuty + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangUser + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangProType + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangProduct + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangOrder + '</td>' +
    //    '<td>' + dutyInfoForTable[i].mangRecord + '</td>' +