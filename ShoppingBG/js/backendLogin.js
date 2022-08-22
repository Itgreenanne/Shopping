//驗証帳密
function LoginVerify() {
    var loginIdInput = $('#txbGetId').val();
    var loginPwdInput = $('#txbGetPwd').val();
    $('#message').html('');

    if (!loginIdInput || !loginPwdInput) {
        $('#message').html('請輸入帳號密碼');
    } else {
        $.ajax({
            url: '/ajax/AjaxLogin.aspx',
            type: 'POST',
            data: { getId: loginIdInput, getPwd: loginPwdInput },
            success: function (data) {
                console.log(data);

                if (data == 0) {
                    window.location.href = "/view/default1.aspx";
                } else if (data == 1) {
                    $('#message').html('請輸入帳號密碼');
                } else if(data == 2) {
                    $('#message').html('請輸入帳號密碼');
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

//不能輸入空白鍵
function NoSpaceKey() {
    var loginIdInput = $('#txbGetId').val();
    loginIdInput = loginIdInput.replace(/\s/g, '');
    $('#txbGetId').val(loginIdInput);
}