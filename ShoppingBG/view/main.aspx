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
    <link rel="stylesheet" href="/css/MainUser.css" />
    <link rel="stylesheet" href="/css/MainProduct.css" />
    <link rel="stylesheet" href="/css/MainMember.css" />
    <link rel="stylesheet" href="/css/MainOrder.css" />




</head>
<script src="/js/jquery-2.1.4.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script type="text/javascript" src="/js/Main.js"> </script>
<script type="text/javascript" src="/js/MainDuty.js"> </script>
<script type="text/javascript" src="/js/MainUser.js"> </script>
<script type="text/javascript" src="/js/MainProduct.js"> </script>
<script type="text/javascript" src="/js/MainMember.js"> </script>
<script type="text/javascript" src="/js/MainOrder.js"> </script>
<script type="text/javascript" src="/js/MainOperationRecord.js"> </script>


<body>          
      <div id="overlay"></div>
       <div class="frontColorBar">
           <div class="frontColorBarTitle">Shopping後台管理系統</div> 
           <div class="loginState" id="loginAccount" ></div>
           <div><a href="#"  class="logout" id="logout">登出</a></div>
       </div>
       <div class="menuBox">
            <ul class="drop-down-menu">
                <li><a href="#" id="duty">職責</a>
                    <ul >
                        <li class="menuItem"><a  href="#" id="itemAddDuty">職責新增</a></li>
                        <li class="menuItem"><a  href="#" id="itemSearchDuty">職責查詢</a></li>
                    </ul>
                </li>
                <li><a href="#" id="user">人員</a>
                    <ul>
                        <li class="menuItem"><a href="#" id="itemAddUser">人員新增</a></li>
                        <li class="menuItem"><a href="#" id="itemSearchUser">人員查詢</a></li>
                    </ul>
                </li>
                <li><a href="#" id="productType">產品類別</a>
                    <ul>
                        <li class="menuItem"><a href="#">產品類別新增</a></li>
                        <li class="menuItem"><a href="#">產品類別查詢</a></li>
                    </ul>
                </li>
                <li><a href="#" id="product">產品</a>
                    <ul>
                        <li class="menuItem"><a href="#" id="itemAddProduct">產品新增</a></li>
                        <li class="menuItem"><a href="#" id="itemSearchProduct">產品查詢</a></li>
                    </ul>
                </li>
                <li class="menuItem"><a href="#" id="searchMember">會員查詢</a></li>
                <%--<li class="menuItem"><a href="#" id="searchOrder">訂單查詢</a></li>--%>
                   <li><a href="#" id="order">訂單</a>
                    <ul>
                        <li class="menuItem"><a href="#" id="itemOrderReport">報表</a></li>
                        <li class="menuItem"><a href="#" id="itemSearchOrder">訂單查詢</a></li>
                    </ul>
                </li>
                <li class="menuItem"><a href="#" id="operationRecord">操作紀錄查詢</a></li>
            </ul>           
       </div>
    
       <div class="contentBox">           
            <div class="addDutyBlock" id="addDutyBlock">
                <p class="dutyBlockTitle">職責新增</p>
                <div class="inputBlock">
                    <label for="addDutyName" class="labelAddDutyName"">職責名稱： </label>
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
                    <label for="searchDutyName">請輸入欲查詢職責名稱：</label>
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
                        <input type="text" class="userInfo" id="userPwd" value="" autocomplete="off" /><br/>
                    </div>                
                    <div class="addUserInputblock">
                        <label for="dutyType" class="labelDutyType">職責名稱： </label>
                        <select name="dutyType" class="dutyTypeMenu" id="dutyTypeMenu"></select><br/>
                    </div>
                    <button class="btnAddUser" id="btnUserConfirm" onclick="AddUser()">確定</button>                
           </div>

            <div class="searchUserBlock" id="searchUserBlock">
                <p class="dutyBlockTitle">人員查詢</p>
                <div class="DutyTypeInputblock">
                        <label for="searchDutyName">請輸入帳號名稱:</label>
                        <input type="text" class="searchUserAccount" id="searchUserAccount" autocomplete="off" oninput="NoSpaceKey('searchUserAccount')" value=""/>
                        <label for="dutyType" class="labUserSearchDutyType">職責名稱： </label>
                        <select name="dutyType" class="searchDutyTypeMenu" id="allDutyMenu"></select>
                        <button class="btnSearchUser" onclick="GetSearchUser()">確定</button>
                        <button class="btnSearchUser" onclick="ClearSearchUser()">清除</button>
                </div>
                <br/><table class="userTable" id="allUserList"></table>
           </div>       

            <div class="addProductBlock" id="addProductBlock">
                <p class="productBlockTitle">產品新增</p>
                     <div class="addProductInputblock">
                        <label for="addProductTitle" class="labelAddProductTitle">圖片路徑： </label>
                        <input type="text" class="productPic" id="addProductPic" autocomplete="off" value=""/><br/>
                    </div>
                    <div class="addProductInputblock">
                        <label for="addProductTitle" class="labelAddProductTitle">標題： </label>
                        <input type="text" class="productInfo" id="addProductTitle" autocomplete="off" value=""/><br/>
                    </div>
                    <div class="addProductInputblock">
                        <label for="addUnitPrice" class="labelProductInfo">單價： </label>
                        <input type="text" class="productInfo" id="addUnitPrice" autocomplete="off" oninput="NoSpaceKey('addUnitPrice')" value=""/><span class="ntd">元</span><br/>
                    </div>
                    <div class="addProductInputblock">
                        <label for="addInventoryQtn" class="labelInventoryQtn">庫存數量： </label>
                        <input type="text" class="inventoryQtn" id="inventoryQtn" autocomplete="off" oninput="NoSpaceKey('inventoryQtn')" value="" /><br/>
                    </div>                
                    <div class="addProductInputblock">
                        <label for="productType" class="labelProductType">產品類別： </label>
                        <select name="productType" class="productTypeMenu" id="productTypeMenu"></select><br/>
                    </div>
                    <div class="detainInputblock">
                        <label for="addProductDetail" class="labelProductDetail">產品詳情： </label>
                        <textarea class="detailInfo" id="productDetail"></textarea><br/>
                    </div> 
                    <button class="btnAddProduct" id="btnProductConfirm" onclick="AddProduct()">確定</button>                
           </div>

            <div class="searchUserBlock" id="searchProductBlock">
                    <p class="productBlockTitle">產品查詢</p>
                    <div class="productTypeInputblock">
                        <label for="searchProductTitle">請輸入標題關鍵字：</label>
                        <input type="text" class="searchProductTitle" id="searchProductTitle" autocomplete="off" oninput="NoSpaceKey('searchProductTitle')" value=""/>
                        <label for="productType" class="labSearchProductType">產品類別： </label>
                        <select name="productType" class="searchProductTypeMenu" id="allProductTypeMenu"></select>
                        <button class="btnSearchProduct" onclick="GetSearchProduct()">確定</button>
                        <button class="btnSearchProduct" onclick="ClearSearchProduct()">清除</button>
                    </div>
                    <br/><table class="productTable" id="allProductList"></table>
       </div>
       
            <div class="searchMemberBlock" id="searchMemberBlock">
                    <p class="memberBlockTitle">會員查詢</p>
                    <div class="memberInputblock">
                        <label for="searchMemberTitle">請輸入會員身份証字號：</label>
                        <input type="text" class="searchMemberTitle" id="searchMemberIdNo" autocomplete="off" oninput="NoSpaceKey('searchMemberIdNo')" value=""/>
                        <button class="btnSearchMember" onclick="GetSearchMember()">確定</button>
                        <button class="btnSearchMember" onclick="ClearSearchMember()">清除</button>
                    </div>
                    <br/><table class="memberTable" id="allMemberList"></table>
            </div>

                <div class="searchOrderBlock" id="orderReportBlock">
                    <p class="dutyBlockTitle">報表</p>
                    <div class="DutyTypeInputblock">
                        <label for="startDateForOrder">訂單建立時間起日：</label>
                        <input type="date" class="orderReportDateInput" id="startDateForOrder" onchange="NoLaterThanEndDate(this.value)" />
                        <label for="endDateForOrder" class="labUserSearchDutyType">訂單建立時間迄日： </label>
                        <input type="date" class="orderReportDateInput" id="endDateForOrder" onchange="NoEarlierThanStartDate(this.value)"/>
                        <button class="btnSearchUser" onclick="GetSearchOrderReport()">確定</button>
                        <button class="btnSearchUser" onclick="ClearOrderReport()">清除</button>
                    </div>
                        <div class="rangeOption">
                            <br/><div class="labelForRange">選擇訂單加總區間</div>
                            <div class="timeRangeInput">
                                <span>當日</span>
                                <input name="chkRange"type="radio" class="chkRange" id="chkDayRange" value="1"/>
                                <span>當月</span>
                                <input name="chkRange"type="radio" class="chkRange" id="chkMonthRange" value="2"/>
                                <span>當年</span>
                                <input name="chkRange"type="radio" class="chkRange" id="chkYearRange" value="3"/><br/>
                            </div>                         
                            <button class="btnSearchUser" onclick="GetSearchOrderForSpecificRange()">確定</button>
                            <button class="btnSearchUser" onclick="ClearOrderReport()">清除</button>
                        </div>                        
                    <table class="orderTable" id="orderReportList"></table>
                    <div class="chartBox">
                        <canvas id="chart"></canvas>
                    </div>
                </div>

             <div class="searchOrderBlock" id="operationRecordtBlock">
                    <p class="dutyBlockTitle">操作紀錄查詢</p>
                    <div class="DutyTypeInputblock">
                        <label for="startDateForOrder">紀錄建立時間起日：</label>
                        <input type="date" class="orderReportDateInput" id="startDateForRecord" onchange="NoLaterThanEndDate(this.value)" />
                        <label for="endDateForOrder" class="labUserSearchDutyType">紀錄建立時間迄日： </label>
                        <input type="date" class="orderReportDateInput" id="endDateForRecord" onchange="NoEarlierThanStartDate(this.value)"/>
                        <button class="btnSearchUser" onclick="GetSearchAllOperationRecord()">確定</button>
                        <button class="btnSearchUser" onclick="ClearRecord()">清除</button>
                    </div>
                    <table class="orderTable" id="operationRecordList"></table>
             </div>







            <div class="searchOrderBlock" id="searchOrderBlock">
                <p class="orderBlockTitle">訂單查詢</p>
                <div class="orderInputblock">
                        <label for="searchOrderByNum">輸入訂單編號或會員身份証字號：</label>
                        <input type="text" class="searchOrderByNum" id="searchOrderByNum" autocomplete="off" oninput="NoSpaceKey('searchOrderByNum')" value=""/>                        
                        <button class="btnSearchOrder" onclick="GetSearchpOrder()">確定</button>
                        <button class="btnSearchOrder" onclick="ClearSearchOrder()">清除</button>
                </div>
                <br/><table class="orderTable" id="allOrderList"></table>
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

            <div class="modifyUserBlock" id="modifyUserBlock">
            <p class="modifyUser">人員修改</p>
            <div class="modifyUserInputBlock">
                 <label for="modifyUserAccount" class="labelUserInfo"">帳號： </label>
                    <span class="modifyUserAccount" id="modifyUserAccount"></span><br/>
            </div>
            <div class="modifyUserInputBox">
                <div class="modifyUserInputBlock">
                    <label for="addNickname" class="labelUserInfo">暱稱： </label>
                    <input type="text" class="modifyNickname" id="modifyNickname" autocomplete="off" oninput="NoSpaceKey('modifyNickname')" value=""/><br/>
                </div>
                <div class="modifyUserInputBlock">
                    <label for="modifyUserPwd" class="labelUserInfo">密碼： </label>
                    <input type="text" class="modifyUserPwd" id="modifyUserPwd" autocomplete="off" oninput="PasswordVarify()" value=""/><br/>
                </div>                
                <div class="modifyUserInputBlock">
                    <label for="modifyDutyMenu" class="labelUserInfo">職責名稱： </label>
                    <select name="dutyType" class="modifyDutyMenu" id="modifyDutyMenu"></select><br/>
                </div>
            </div>
                <div class="btnModifyBlock">
                    <button class="btnModifyUser" id="ModifyUserConfirm" onclick="ModifyUser()">確定</button>
                    <button class="btnModifyUser" id="ModifyUserCancel" onclick="CancelUserModifyBlock()">取消</button>
                </div>            
      </div>

            <div class="modifyProductBlock" id="modifyProductBlock">
            <p class="modifyProduct">產品修改</p>
            <div class="modifyProductInputBlock">
                 <label for="modifyProductPicPath" class="labelProduct">圖片： </label>
                 <input type="text" class="modifyProductPicPath" id="modifyProductPicPath" autocomplete="off" value="" /><br/>
            </div>
            <div class="modifyProductInputBlock">
                 <label for="modifyProductTitle" class="labelProduct">標題： </label>
                 <input type="text" class="modifyProductTitle" id="modifyProductTitle" autocomplete="off" value="" /><br/>
            </div>
            <div class="modifyProductInputBox">
                <div class="modifyProductInputBlock">
                    <label for="modifyUnitPrice" class="labelProduct">單價： </label>
                    <input type="text" class="modifyUnitPrice" id="modifyUnitPrice" autocomplete="off" oninput="NoSpaceKey('modifyUnitPrice')" value=""/><br/>
                </div>
                <div class="modifyProductInputBlock">
                    <label for="modifyUserPwd" class="labelProduct">庫存數量： </label>
                    <input type="text" class="modifyQtn" id="modifyQtn" autocomplete="off" value=""/><br/>
                </div>                
                <div class="modifyProductInputBlock">
                    <label for="modifyProductType" class="labelProduct">產品類別： </label>
                    <select name="productType" class="modifyProductType" id="modifyProductType"></select><br/>
                </div>
                <div class="modifyProductInputBlock">
                        <label for="modifyProductDetail" class="labelProduct">產品詳情： </label>
                        <textarea class="modifyDetailInfo" id="modifyProductDetail"></textarea><br/>
                </div> 
            </div>
                <div class="btnModifyBlock">
                    <button class="btnModifyProduct" id="ModifyProductConfirm" onclick="ModifyProduct()">確定</button>
                    <button class="btnModifyProduct" id="ModifyProductCancel" onclick="CancelProductModifyBlock()">取消</button>
                </div>            
      </div>

            <div class="modifyMemberBlock" id="modifyMemberBlock">
            <span class="modifyMember">會員修改</span>
             <div class="inputBlock">
                <div class="modifyMemberIdNo">
                    <label for="idNoShown">ID： </label>
                    <span class="idNoShown" id="idNoShown" ></span>
                </div>
                <div class="modifyMemberBox">
                    <label for="modifyPhone">聯絡電話：</label>                   
                    <input type="text" class="modifyPhone" id="modifyPhone" autocomplete="off" oninput="NoSpaceKey('modifyPhone')" value=""/>
                </div>
                <div class="modifyMemberBox">
                    <label for="modifyPwd">密碼：</label>                   
                    <input type="text" class="modifyPwd" id="modifyPwd" autocomplete="off" oninput="NoSpaceKey('modifyPwd')" value=""/>
                </div>
                <div class="modifyMemberBox">
                     <label for="lastNameInput">姓：</label>
                     <input type="text" class="lastNameInput" id="lastNameInput" autocomplete="off" oninput="NoSpaceKey('lastNameInput')" value="" />
                </div >
                <div class="modifyMemberBox">
                    <label for="lastNameInput">名：</label>
                    <input type="text" class="firstNameInput" id="firstNameInput" autocomplete="off" oninput="NoSpaceKey('firstNameInput')" value=""/>                  
                </div>
                <div class="modifyGender">                
                    <label class="modifyGenderTitle">性別：</label>
                    <div class="genderSelect">
                        <label for="modifyFemale">女</label>
                        <input name="radModifyGender"type="radio" class="radModifyFemale" id="radModifyFemale" value="2"/>
                        <label for="modifyMale">男</label>
                        <input name="radModifyGender"type="radio" class="radModifyMale" id="radModifyMale" value="1"/>
                        <label for="modifyOther">其他</label>
                        <input name="radModifyGender"type="radio" class="radModifyOther" id="radModifyOther" value="3"/>
                    </div>
                </div>             
                <div class="modifyMemberBox">
                    <label for="lastNameInput">生日：</label>                   
                    <input name="modifyYear"type="date" class="inputBirth" id="inputBirth" value=""/>                   
                </div>               
                <div class="modifyMemberBox">
                    <label for="modifyMail">E-mail：</label>                   
                    <input type="text" class="modifyMail" id="modifyMail" autocomplete="off" oninput="NoSpaceKey('modifyMail')" value=""/>                  
                </div>                
                <div class="modifyMemberBox">
                    <label for="modifyAddress">住址：</label>                   
                    <input type="text" class="modifyAddress" id="modifyAddress" autocomplete="off" oninput="NoSpaceKey('modifyAddress')" value=""/>
                </div>
                <div class="modifyMemberBox">
                    <label for="modifyPoints">點數：</label>
                    <input type="text" class="modifyPoints" id="modifyPoints" autocomplete="off" oninput="NoSpaceKey('modifyPoints')" value=""/>
                </div>
                <div class="modifyMemberBox">
                    <label for="modifyLevel">等級：</label>
                    <input type="text" class="modifyLevel" id="modifyLevel" autocomplete="off" oninput="NoSpaceKey('modifyLevel')" value=""/>
                </div>
            </div>
            <div class="btnModifyBlock">
                    <button class="btnModifyUser" id="ModifyMemberConfirm" onclick="ModifyMember()">確定</button>
                    <button class="btnModifyUser" id="ModifyMemberCancel" onclick="CancelMemberModifyBlock()">取消</button>
            </div>
          </div>           


            <div class="orderItemBlock" id="orderItemBlock">
                <span class="orderItemTitle">訂單細項</span>
                <div class="tableBlock">
                    <table class="orderItemTable" id="orderItemTable"></table>
                </div>
                <div class="balanceBlock">                        
                    <div class="labelInPreviewOrder">總額：</div>
                    <div class="resultInPreviewOrder" id="totalInOrderItem"></div><br/>                        
               </div>
                <button class="btnOrderItemLeave" id="backToOrderSearch" onclick ="CloseOrderItem()">確定</button>
            </div>

   

    
</body>
</html>
