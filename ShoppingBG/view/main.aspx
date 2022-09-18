<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Main.aspx.cs" Inherits="ShoppingBG.view.Main" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>後台主頁</title>
    <link rel="stylesheet" href="/css/Main.css" />
    <link rel="stylesheet" href="/css/MainDuty.css" />
    <link rel="stylesheet" href="/css/MainUser.css" />

</head>
<script src="/js/jquery-2.1.4.js"></script>
<script type="text/javascript" src="/js/Main.js"> </script>
<script type="text/javascript" src="/js/MainDuty.js"> </script>
<script type="text/javascript" src="/js/MainUser.js"> </script>

<body>          
      <div id="overlay"></div>
       <div class="frontColorBar">
           <div class="frontColorBarTitle">Shopping後台管理系統</div> 
           <div class="loginState" id="loginAccount" ></div>
           <div><a href="#"  class="logout" id="logout">登出</a></div>
       </div>
       <div class="menuBox">
            <ul class="drop-down-menu">
                <li><a href="#">職責</a>
                    <ul >
                        <li class="menuItem"><a  href="#" id="itemAddDuty">職責新增</a></li>
                        <li class="menuItem"><a  href="#" id="itemSearchDuty">職責查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">人員</a>
                    <ul>
                        <li class="menuItem"><a href="#" id="itemAddUser">人員新增</a></li>
                        <li class="menuItem"><a href="#" id="itemSearchUser">人員查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">產品類別</a>
                    <ul>
                        <li class="menuItem"><a href="#">產品類別新增</a></li>
                        <li class="menuItem"><a href="#">產品類別查詢</a></li>
                    </ul>
                </li>
                <li><a href="#">產品</a>
                    <ul>
                        <li class="menuItem"><a href="#">產品新增</a></li>
                        <li class="menuItem"><a href="#">產品查詢</a></li>
                    </ul>
                </li>
                <li class="menuItem"><a href="#" id="searchOrder">訂單查詢</a></li>
                <li class="menuItem"><a href="#">操作紀錄查詢</a></li>
            </ul>


           
       </div> 
       <div class="contentBox"> 
            <div class="addDutyBlock" id="addDutyBlock">
                <p class="dutyBlockTitle">職責新增</p>
                <div class="inputBlock">
                    <label for="addDutyName" class="labelAddDutyName"">職責名稱: </label>
                    <input type="text" class="addDutyName" id="inputDutyName" autocomplete="off" oninput="NoSpaceKey('inputDutyName')" value=""/><br/>
                </div>
                <div class="chkAddDutyBlock">
                     <label for="manageDuty">職責管理</label>
                     <input name="chkDutyType"type="checkbox" class="chkAddDuty" id="manageDuty" value="1"/>
                </div>
                <div class="chkAddDutyBlock">
                     <label for="manageUser">人員管理</label>
                     <input name="chkDutyType"type="checkbox" class="chkAddDuty" id="manageUser" value="1"/>
                </div> 
                <div class="chkAddDutyBlock">
                     <label for="manageProductType">產品類別管理</label>
                     <input name="chkDutyType" type="checkbox" class="chkAddDuty" id="manageProductType" value="1"/>
                </div><br/>
                <div class="chkAddDutyBlock">
                     <label for="manageProduct">產品管理</label>
                     <input name="chkDutyType" type="checkbox" class="chkAddDuty" id="manageProduct" value="1"/>
                </div>
                <div class="chkAddDutyBlock">
                     <label for="manageOrder">訂單管理</label>
                     <input name="chkDutyType" type="checkbox" class="chkAddDuty" id="manageOrder" value="1"/>
                </div> 
                <div class="chkAddDutyBlock">
                     <label for="manageRecord">操作紀錄管理</label>
                     <input name="chkDutyType" type="checkbox" class="chkAddDuty" id="manageRecord" value="1"/><br/>
                </div> 
                     <button class="btnAddDuty" id="dutyConfirm" onclick="AddDuty()">確定</button>
                     <div class="message" id="megAddDuty"></div>
                              
            </div>
            <div class="searchDutyBlock" id="searchDutyBlock">
                <p class="dutyBlockTitle">職責查詢</p>
                <div class="inputSearchDutyBlock">
                    <label for="searchDutyName">請輸入欲查詢職責名稱:</label>
                    <input type="text" class="searchDutyName" id="searchDutyName" autocomplete="off" oninput="NoSpaceKey('searchDutyName')" value=""/>
                    <button class="btnSearchDuty" onclick="GetSearchDutyByName()">確定</button>
                    <button class="btnSearchDuty" onclick="ClearSearchDuty()">清除</button>
                </div>
                <br/><table class="dutyTable" id="allDutyList"></table>
            </div>

           <div class="addUserBlock" id="addUserBlock">
                <p class="userBlockTitle">人員新增</p>
                    <div class="addUserInputblock">
                        <label for="addUserAccount" class="labelAddUserName">帳號： </label>
                        <input type="text" class="userInfo" id="addUserAccount" autocomplete="off" oninput="NoSpaceKey('addUserAccount')" value=""/><br/>
                    </div>
                    <div class="addUserInputblock">
                        <label for="addNickName" class="labelUserInfo">暱稱： </label>
                        <input type="text" class="userInfo" id="addNickName" autocomplete="off" oninput="NoSpaceKey('addNickName')" value=""/><br/>
                    </div>
                    <div class="addUserInputblock">
                        <label for="addNickName" class="labelUserInfo">密碼： </label>
                        <input type="password" class="userInfo" id="userPwd" value="" autocomplete="off" /><br/>
                    </div>                
                    <div class="addUserInputblock">
                        <label for="dutyType" class="labelDutyType">職責名稱： </label>
                        <select name="dutyType" class="dutyTypeMenu" id="dutyTypeMenu" value=""></select><br/>
                    </div>
                    <button class="btnAddUser" id="btnUserConfirm" onclick="AddUser()">確定</button>                
           </div>
           <div class="searchUserBlock" id="searchUserBlock">
                <p class="dutyBlockTitle">人員查詢</p>
                <div class="DutyTypeInputblock">
                        <label for="dutyType" class="labelDutyType">職責名稱： </label>
                        <select name="dutyType" class="searchDutyTypeMenu" id="allDutyMenu" value=""></select>
                        <button class="btnSearchUser" onclick="GetSearchUser()">確定</button>
                </div>           
                <br/><table class="userTable" id="allUserList"></table>
           </div>
       </div>
            
       <div class="modifyDutyBlock" id="modifyDutyBlock">
            <p class="modifyDuty">職責修改</p>
                <div class="modifyDutyInputBlock">
                    <label for="modifyDutyName" class="labelModifyDutyName"">職責名稱: </label>
                    <input type="text" class="modifyDutyNameInput" id="modifyDutyName" autocomplete="off" oninput="NoSpaceKey('modifyDutyName')" value=""/><br/>
                </div>
                <div class="chkModifyDutyBox">
                    <div class="chkModifyDutyBlock">
                        <label for="manageDutyMod">職責管理</label>
                        <input name="chkDutyType"type="checkbox" class="chkModifyDuty" id="manageDutyMod" value="1"/>
                    </div>
                    <div class="chkModifyDutyBlock">
                        <label for="manageUserMod">人員管理</label>
                        <input name="chkDutyType"type="checkbox" class="chkModifyDuty" id="manageUserMod" value="1"/>
                    </div> 
                    <div class="chkModifyDutyBlock">
                        <label for="manageProductType">產品類別管理</label>
                        <input name="chkDutyType" type="checkbox" class="chkModifyDuty" id="manageProductTypeMod" value="1"/>
                    </div><br/>
                    <div class="chkModifyDutyBlock">
                        <label for="manageProduct">產品管理</label>
                        <input name="chkDutyType" type="checkbox" class="chkModifyDuty" id="manageProductMod" value="1"/>
                    </div>
                    <div class="chkModifyDutyBlock">
                        <label for="manageOrder">訂單管理</label>
                        <input name="chkDutyType" type="checkbox" class="chkModifyDuty" id="manageOrderMod" value="1"/>
                    </div> 
                    <div class="chkModifyDutyBlock">
                        <label for="manageRecord">操作紀錄管理</label>
                        <input name="chkDutyType" type="checkbox" class="chkModifyDuty" id="manageRecordMod" value="1"/><br/>
                    </div>
                </div>
                <div class="btnModifyBlock">
                    <button class="btnModifyDuty" id="ModifyDutyConfirm" onclick="ModifyDuty()">確定</button>
                    <button class="btnModifyDuty" id="ModifyDutyCancel" onclick="CancelDutyModifyBlock()">取消</button>
                </div>
            
       </div>    
</body>
</html>
