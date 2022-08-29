//不能輸入空白鍵
function NoSpaceKey(inputDutyName) {
    var inputText = $('#inputDutyName').val();
    inputText = inputText.replace(/\s/g, '');
    $('#inputDutyName').val(inputText);
}

$("#itemAddDuty").click(function (event) {
    $("#addDutyBlock").show();
});

$("#itemSearchDuty").click(function (event) {
    $("#searchDutyBlock").show();
});

//新增職責傳資料至後端
function getDataAddDuty() {
    var inputDutyName = $('#inputDutyName').val();
    var manageDuty = $('#manageDuty').is(':checked');
    var manageUser = $('#manageUser').is(':checked');
    var manageProductType = $('#manageProductType').is(':checked');
    var manageProduct = $('#manageProduct').is(':checked');
    var manageOrder = $('#manageOrder').is(':checked');
    var manageRecord = $('#manageRecord').is(':checked');
    var check = $("input[name='chkDutyType']:checked").length;
    $('#message').html('');

    if ((!inputDutyName) || check == 0) {
        $('#message').html('請檢查是否名稱沒輸入或是所有選項都沒勾選');
    } else {
        $.ajax({
            url: '/ajax/AjaxDuty.aspx',
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
                    $('#message').html('新增職責成功');
                    $("#addDutyBlock").hide();
                    $("#searchDutyBlock").show();
                } else if (data == 1) {
                    $('#message').html('已有此職責');
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