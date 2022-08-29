<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Main.aspx.cs" Inherits="ShoppingBG.view.Main" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>後台主頁</title>
    <link rel="stylesheet" href="/css/Main.css">
    <link rel="stylesheet" href="/css/MainDuty.css">

</head>
<script src="/js/jquery-2.1.4.js"></script>
<script type="text/javascript" src="/js/Main.js"> </script>
<script type="text/javascript" src="/js/MainDuty.js"> </script>
<body>          
        <div class="frontColorBar">
           <div class="frontColorBarTitle">Shopping後台管理系統</div> 
           <div class="loginState" id="loginAccount" ></div>
           <div><a href="#"  class="logout" id="logout">登出</a></div>
       </div>
       <div class="menuBox">
            <ul class="drop-down-menu">
                <li><a href="#">職責</a>
                    <ul>
                        <li ><a id="itemAddDuty" href="#">職責新增</a></li>
                        <li id="itemSearchDuty"><a href="#">職責查詢</a></li>
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
            <div class="addDutyBlock" id="addDutyBlock">
                <p class="addDuty">職責新增</p>               
                <label for="addDutyName">職責名稱: </label>
                <input type:"text" class="addDutyName" id="inputDutyName" oninput="NoSpaceKey('inputDutyName')" value="111"/>                
                <div class="chkAddDutyBlock">
                     <label for="manageDuty">職責管理</label>
                     <input name="chkDutyType"type="checkbox" id="manageDuty" value="1"/>
                     <label for="manageUser">人員管理</label>
                     <input name="chkDutyType"type="checkbox" id="manageUser" value="1"/>
                     <label for="manageProductType">產品類別管理</label>
                     <input name="chkDutyType" type="checkbox" id="manageProductType" value="1"/><br/>
                     <label for="manageProduct">產品管理</label>
                     <input name="chkDutyType" type="checkbox" id="manageProduct" value="1"/>
                     <label for="manageOrder">訂單管理</label>
                     <input name="chkDutyType" type="checkbox" id="manageOrder" value="1"/>
                     <label for="manageRecord">操作紀錄管理</label>
                     <input name="chkDutyType" type="checkbox" id="manageRecord" value="1"/><br/>
                     <button class="btnAddDuty" id="dutyConfirm" onclick="getDataAddDuty()">確定</button>
                     <div class="message" id="message"></div>
                </div>               
            </div>
            <div class="searchDutyBlock" id="searchDutyBlock">
                <p class="addDuty">查詢職責</p>
            </div>
      
    
</body>
</html>
