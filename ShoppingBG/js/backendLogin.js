//var testId = '12';
//var testPwd = '12';

//驗証帳號密碼
function LoginVerify() {
    var loginIdInput = $('#txbGetId').val();
    var loginPwdInput = $('#txbGetPwd').val();
    $('#wrongMessage').html('');

    $.ajax({
        url: '/ajax/AjaxLogin.aspx',
        type: 'POST',
        data: { getId: loginIdInput, getPwd:loginPwdInput },
        success: function (data) {
            console.log(data);
            $('#wrongMessage').html(data);

            
        },
        error: function (err) {
            //str = JSON.stringify(err);
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    })

    //if (loginIdInput.toLowerCase() === testId && loginPwdInput === testPwd){
    //    //window.location.href = "/view/main.aspx";
     
    //} else {
    //     $('#wrongMessage').html('帳號或密碼錯誤');
    //}   
}

//不能輸入空白鍵
function NoSpaceKey() {
    var loginIdInput = $('#txbGetId').val();
    loginIdInput = loginIdInput.replace(/\s/g, '');    
    $('#txbGetId').val(loginIdInput);   
}