<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="Shopping.temp.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>後台登入</title>
    <link rel="stylesheet" href="/css/backendLogin.css">
</head>
<body>
    
        <div class="frontColorBar">Shopping後台管理系統</div>
        <div class="loginGrayBox">
            <div class="grayBoxName">登入後台管理系統</div>
            <div class="userAndPwd" >
                <label for="username">帳號</label><br/>
                <input type="text" class="backendLoginInput" size=26 /><br /><br/>
                <label for="pwd">密碼</label><br/>
                <input type="password" class="backendLoginInput" size=26/>
            </div>
            <div class="submit">
                <input type="submit" value="登入"/>
            </div>
        </div>
        
    
</body>
</html>
