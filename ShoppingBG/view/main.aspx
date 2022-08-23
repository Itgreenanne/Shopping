<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="main.aspx.cs" Inherits="ShoppingBG.view.main" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>後台主頁</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<script src="/js/jquery-2.1.4.js"></script>
<script type="text/javascript" src="/js/main.js"> </script>    
<body>          
        <div class="frontColorBar">
           <div class="frontColorBarTitle">Shopping後台管理系統</div> 
           <div class="loginState" ><%=DisplayLogin()%></div>
           <div class="logout" >登出</div>
       </div>
       <div class="menuBox">
            <ul class="drop-down-menu">
                <li><a href="#">職責</a>
                    <ul>
                        <li><a href="#">職責新增</a></li>
                        <li><a href="#">職責查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">人員</a>
                    <ul>
                        <li><a href="#">人員新增</a></li>
                        <li><a href="#">人員查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">產品類別</a>
                    <ul>
                        <li><a href="#">產品類別新增</a></li>
                        <li><a href="#">產品類別查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">產品</a>
                    <ul>
                        <li><a href="#">產品新增</a></li>
                        <li><a href="#">產品查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">訂單查詢</a></li>
                <li><a href="#">操作紀錄查詢</a></li>
            </ul>
       </div>
    
</body>
</html>
