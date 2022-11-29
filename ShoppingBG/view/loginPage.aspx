<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="LoginPage.aspx.cs" Inherits="ShoppingBG.view.LoginPage" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>後台登入</title>
    <link rel="stylesheet" href="/css/BackendLogin.css"/>
</head>
    <script type="text/javascript" src="/js/BackendLogin.js"> </script>
    <script src="/js/jquery-2.1.4.js"></script>
<body>
    <form id="Form1" runat="server">
       <div class="frontColorBar">
           <div class="frontColorBarTitle">Shopping後台管理系統</div>
       </div>
       <div class="loginGrayBox">
            <div class="grayBoxName">登入後台管理系統</div>
            <div class="grayBoxContainer" >
                <p>帳號</p>
                <input type="text" class="grayBoxInput" id="txbGetId" oninput="NoSpaceNoSmallerthanKey(txbGetId)" value="1"/>
                <p>密碼</p>
                <input type="password" class="grayBoxInput" id="txbGetPwd"  value="1"/><br/>
                <div id="message"></div>
            </div>
            <input type="button" class="login" id="btnLogin" runat="server" onclick="LoginVerify()" value="登入"/>
           
       </div>
    </form>
</body>
</html>
