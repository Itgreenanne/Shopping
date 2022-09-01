//畫面清除
function BlockClear() {
    $("#addDutyBlock").hide();
    $("#searchDutyBlock").hide();
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

//$("#itemAddDuty").click(function (event) {
//    blockClear();
//    $("#addDutyBlock").show();
//});

//$("#itemSearchDuty").click(function (event) {
//    blockClear();
//    $("#searchDutyBlock").show();
//});

//新增職責傳資料至後端
function getDataAddDuty() {
    var inputDutyName = $('#inputDutyName').val();
    var manageDuty = $('#manageDuty').is(':checked');
    var manageUser = $('#manageUser').is(':checked');
    var manageProductType = $('#manageProductType').is(':checked');
    var manageProduct = $('#manageProduct').is(':checked');
    var manageOrder = $('#manageOrder').is(':checked');
    var manageRecord = $('#manageRecord').is(':checked');
    //var check = $("input[name='chkDutyType']:checked").length;
    $('#megAddDuty').html('');

    if (!inputDutyName) {
        $('#megAddDuty').html('請輸入職責名稱');
    } else if (inputDutyName.length > 20) {
        $('#megAddDuty').html('輸入超過20字元');
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
                } else if (data == 1) {
                    $('#megAddDuty').html('已有此職責');
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


//查詢職責傳資料至後端
function getSerachDuty() {
    $.ajax({
        url: '/ajax/AjaxDuty.aspx?fn=SearchDutyVerify',
        type: 'POST',
        success: function (data) {   
            
            jsonResult = JSON.parse(data);
            console.log(jsonResult);
            $('#allDutyList').append(
                    '<tr>' +
                    '<td>' + jsonResult.Name + '</td>' +
                    '<td>' + jsonResult.ManageDuty + '</td>' +
                    '<td>' + jsonResult.ManageUser + '</td>' +
                    '<td>' + jsonResult.ManageProductType + '</td>' +
                    '<td>' + jsonResult.ManageProduct + '</td>' +
                    '<td>' + jsonResult.ManageOrder + '</td>' +
                    '<td>' + jsonResult.ManageRecord + '</td>' +
                    '</tr>');
            
            //$('#allDutyList').text(jsonResult.Name+
            //    jsonResult.ManageDuty+
            //    jsonResult.ManageUser+
            //    jsonResult.ManageProductType+
            //    jsonResult.ManageProduct+
            //    jsonResult.ManageOrder+
            //    jsonResult.ManageRecord
            //);
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            //console.log(err);
            alert(str);
        }
    })
    var inputDutyName = $('#searchDutyName').val();
    $('#megSearchDuty').html('');

    //if (!inputDutyName) {
    //    $('#megSearchDuty').html('請輸入職責名稱');
    //} else {
    //    $.ajax({
    //        url: '/ajax/AjaxDuty.aspx/SearchDutyVerify',
    //        type: 'POST',
    //        //data: {
    //        //    getDutyName: inputDutyName                
    //        //},
    //        success: function (data) {
    //            console.log(data);

    //            if (data == 0) {
    //                $('#megSearchDuty').html('新增職責成功');
    //                $("#addDutyBlock").hide();
    //                $("#searchDutyBlock").show();
    //            } else if (data == 1) {
    //                $('#megSearchDuty').html('已有此職責');
    //            }
    //        },
    //        error: function (err) {
    //            str = JSON.stringify(err, null, 2);
    //            console.log('err:');
    //            console.log(err);
    //            alert(str);
    //        }
    //    })
    //}
}