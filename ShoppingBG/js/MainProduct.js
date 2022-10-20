var globalProductData;

//從資料庫讀取所有可供選擇的產品類別名稱的選單
function ProductTypeMenu() {
    $.ajax({
        url: '/ajax/AjaxProduct.aspx?fn=ProductTypeMenu',
        type: "POST",
        success: function (data) {
            var jsonProductType = JSON.parse(data);

            if (jsonProductType) {
                if (RepeatedStuff(jsonProductType)) {
                    return;
                } else {
                    ProductTypeMenuPrint('productTypeMenu', jsonProductType);
                }
            } else {
                alert('資料錯誤');
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });
}

//產品類別下拉選單列印
function ProductTypeMenuPrint(menuId, productType) {
    var id = '#' + menuId;
    //$(id).empty();
    var menu = '';
    menu = '<option value=\'0\'>請選擇</option>';

    for (var i = 0; i < productType.length; i++) {
        /*menu += $('<option>').text(jsonDutyType[i].dutyName).attr('value', jsonDutyType[i].dutyId);*/
        menu += '<option value=\'' + productType[i].ProTypeId + '\'>' + productType[i].ProTypeName + '</option>';
    }
    $(id).html(menu);
}

//產品新增
function AddProduct() {
    var inputProductPic = $('#addProductPic').val();
    var inputProductTitle = $('#addProductTitle').val();
    var inputUnitPrice = $('#addUnitPrice').val();
    var inventoryQtn = $('#inventoryQtn').val();
    var productType = $('#productTypeMenu').val();
    var productDetail = $('#productDetail').val();

    if (!inputProductPic || !inputProductTitle || !inputUnitPrice || !inventoryQtn || !productType || !productDetail) {
        alert('有輸入框未填');
    } else if (inputProductTitle.length > 100) {
        alert('標題輸入超過100字元');
    } else if (productDetail.length > 3000) {
        alert('詳情輸入超過3000字元');
    } else if (isNaN(inputUnitPrice) || inputUnitPrice <= 0) {
        alert('請重新輸入單價');
    } else if (isNaN(inventoryQtn) || inventoryQtn < 0) {
        alert('請重新輸入數量');
    } else {
        $.ajax({
            url: '/ajax/AjaxProduct.aspx?fn=AddProduct',
            type: 'POST',
            data: {
                getProductPic: inputProductPic,
                getProductTitle: inputProductTitle,
                getUnitPrice: inputUnitPrice,
                getInventoryQtn: inventoryQtn,
                getProType: productType,
                getProductDetail: productDetail
            },
            success: function (data) {

                if (data) {                    
                    if (RepeatedStuff(data)) {
                        return;
                    } else {
                        switch (data) {
                            case '2':
                                alert('標題輸入超過100字元');
                                break;
                            case '3':
                                alert('詳情輸入超過3000字元');
                                break;
                            case '4':
                                alert('型別錯誤');
                                break;
                            case '5':
                                alert('型別錯誤');
                                break;
                            case '6':
                                alert('型別錯誤');
                                break;
                            case '8':
                                alert("新增產品成功");
                                ResetAll();
                                $('#addProductBlock').hide();
                                $('#searchProductBlock').show();
                                GetAllProduct();
                                break;
                            default:
                                alert('資料錯誤');
                        }
                    }
                } else {
                    alert('資料錯誤');
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

//取得並顯示所有產品資料
function GetAllProduct() {
    //請求資料
    $.ajax({
        url: '/ajax/AjaxProduct.aspx?fn=GetAllProduct',
        type: 'POST',
        success: function (data) {
            var jsonResult = JSON.parse(data);

            if (jsonResult) {
                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    ProductTypeMenuPrint('allProductTypeMenu', jsonResult.ProductTypeArray);
                    PrintProductTable(jsonResult.ProductInfoArray);
                }
            } else {
                alert('資料錯誤');
            }
        },
        error: function (err) {
            str = JSON.stringify(err, null, 2);
            console.log('err:');
            console.log(err);
            alert(str);
        }
    });
}

//清空查詢產品的輸入框
function ClearSearchProduct() {
    $('#searchProductTitle').val('');
    $('#allProductTypeMenu').val('');
    GetAllProduct();
}

//產品查詢
function GetSearchProduct() {
    var productTitle = $('#searchProductTitle').val();
    var productTypeId = $('#allProductTypeMenu').val();

    if (!productTitle && productTypeId == 0) {
        alert('請選擇標題或選擇產品類別');
        GetAllProduct();
    } else if (productTitle.length > 100) {
        alert('標題輸入超過100字元');
    } else {
        $.ajax({
            url: '/ajax/AjaxProduct.aspx?fn=GetSearchProduct',
            type: 'POST',
            data: {
                getProductTitle: productTitle,
                getTypeId: productTypeId
            },
            success: function (data) {
                if (data) {
                    console.log(data);
                    var jsonResult = JSON.parse(data);
                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 0) {
                        alert('空字串');
                    } else if (jsonResult == 2) {
                        alert('標題輸入超過100字元');
                    } else if (jsonResult == 6) {
                        alert('id型別錯誤');
                    } else {
                        PrintProductTable(jsonResult);
                    }
                } else {
                    alert('資料錯誤');
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

function CancelProductModifyBlock() {
    $('#modifyProductBlock').hide();
    $('#overlay').hide();
}

function DeleteProduct(ProductId) {
    var deleteOrNot = confirm('確定要刪除這項產品嗎?');
    if (deleteOrNot) {
        $.ajax({
            url: '/ajax/AjaxProduct.aspx?fn=DeleteProduct',
            type: 'POST',
            data: {
                getProductId: ProductId
            },
            success: function (data) {
                if (data) {
                    var jsonResult = JSON.parse(data);

                    if (RepeatedStuff(jsonResult)) {
                        return;
                    } else if (jsonResult == 6) {
                        alert('id型別錯誤');
                    } else {
                        PrintProductTable(jsonResult);
                    }
                } else {
                    alert('資料錯誤');
                }
            },
            error: function (err) {
                str = JSON.stringify(err, null, 2);
                console.log('err:');
                console.log(err);
                alert(str);
            }
        });
    }

}

//彈跳人員修改視窗的內容
function ModifyProductBlock(productId) {
    $('#modifyProductPicPath').val('');
    $('#modifyProductTitle').val('');
    $('#modifyUnitPrice').val('');
    $('#modifyQtn').val('');
    $('#modifyProductDetail').val('');
    $('#overlay').show();
    $('#modifyProductBlock').show();
    $.ajax({
        url: '/ajax/AjaxProduct.aspx?fn=GetSearchProductById',
        type: 'POST',
        data: {
            getProductId: productId
        },
        success: function (data) {
            if (data) {
                var jsonResult = JSON.parse(data);
                console.log('modifyproductblock', jsonResult);
                var productArray = jsonResult.ProductInfoArray[0];

                if (RepeatedStuff(jsonResult)) {
                    return;
                } else {
                    //顯示跟選擇列資料一樣的資料
                    $('#modifyProductPicPath').val(productArray.ProductPic);
                    $('#modifyProductTitle').val(productArray.ProductTitle);
                    $('#modifyUnitPrice').val(productArray.ProductUnitPrice);
                    $('#modifyQtn').val(productArray.ProductQtn);
                    ProductTypeMenuPrint('modifyProductType', jsonResult.ProductTypeArray);
                    $('#modifyProductType').val(productArray.ProductTypeId);
                    $('#modifyProductDetail').val(productArray.ProductDetail);
                    globalProductData = productArray;
                    $('#modifyProductBlock').show();
                }
            } else {
                alert('資料錯誤');
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

function ModifyProduct() {
    var inputProductPicPath = $('#modifyProductPicPath').val();
    var inputProductTitle = $('#modifyProductTitle').val();
    var inputUnitPrice = $('#modifyUnitPrice').val();
    var inventoryQtn = $('#modifyQtn').val();
    var productTypeId = $('#modifyProductType').val();
    var productDetail = $('#modifyProductDetail').val();
    productData = globalProductData;
    console.log(inputProductTitle);
    console.log(inputUnitPrice);
    console.log(inventoryQtn);
    console.log(productTypeId);
    console.log(productDetail);

    if (inputProductPicPath == productData.ProductPic && inputProductTitle == productData.ProductTitle && inputUnitPrice == productData.ProductUnitPrice
        && inventoryQtn == productData.ProductQtn && productTypeId == productData.ProductTypeId && productDetail == productData.ProductDetail) {
        alert('資料完全沒有修改');
    } else if (!inputProductTitle || !inputUnitPrice || !inventoryQtn || productTypeId == 0 || !productDetail) {
        alert('有輸入框未填');
    } else if (inputProductTitle.length > 100) {
        alert('標題輸入超過100字元');
    } else if (productDetail.length > 3000) {
        alert('詳情輸入超過20字元');
    } else if (isNaN(inputUnitPrice) || inputUnitPrice <= 0) {
        alert('請重新輸入單價');
    } else if (isNaN(inventoryQtn) || inventoryQtn < 0) {
        alert('請重新輸入數量');
    } else {
        $.ajax({
            url: '/ajax/AjaxProduct.aspx?fn=ModifyProduct',
            type: 'POST',
            data: {
                getProductId: productData.ProductId,
                getProductPicPath: inputProductPicPath,
                getProductTitle: inputProductTitle,
                getUnitPrice: inputUnitPrice,
                getInventoryQtn: inventoryQtn,
                getProType: productTypeId,
                getProductDetail: productDetail
            },
            success: function (data) {
                if (data) {
                    if (RepeatedStuff(data)) {
                        return;
                    } else if (data == 10) {
                        alert("產品修改成功");
                        $('#modifyProductBlock').hide();
                        $('#overlay').hide();
                    } else {
                        alert('資料錯誤');
                    }
                }
                },
                error: function (err) {
                    str = JSON.stringify(err, null, 2);
                    console.log('err:');
                    console.log(err);
                    alert(str);
                }            
        });
        GetAllProduct();
    }
}

//建立產品表格
function PrintProductTable(jsonResult) {
    $('#allProductList').html('');
    console.log('table=',jsonResult);

    var tableRow = '';
    tableRow = '<tr>' +
        '<th>產品圖片</th>' +
        '<th>標題</th>' +
        '<th>單價</th>' +
        '<th>庫存數量</th>' +
        '<th>產品類別</th>' +
        '<th>產品詳情</th>' +
        '<th>設定</th>' +
        '</tr>';

    for (var i = 0; i < jsonResult.length; i++) {
        tableRow +=
            '<tr>' +
            '<td><img src="/image/'+ jsonResult[i].ProductPic + '" width="20%"></td>'+
            '<td class="productTitle">' + jsonResult[i].ProductTitle + '</td>' +
            '<td>' + jsonResult[i].ProductUnitPrice + '</td>' +
            '<td>' + jsonResult[i].ProductQtn + '</td>' +
            '<td class="productType">' + jsonResult[i].ProductTypeName + '</td>' +
            '<td style="text-align: left;">' + jsonResult[i].ProductDetail + '</td>' +
            '<td> <button onclick="DeleteProduct(\'' + jsonResult[i].ProductId + '\')">' +
            '刪除' + '</button>' + ' ' +
            '<button onclick="ModifyProductBlock(\'' + jsonResult[i].ProductId + '\')">修改</button></td>' +
            '</tr>';
    }

    $('#allProductList').append(tableRow);
    $('#allProductList').show();
}
