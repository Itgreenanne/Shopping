USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_modifyProduct @productId INT, @productPicPath NVARCHAR(100), @productTitle NVARCHAR(100), @unitPrice INT, @qtn INT, @productTypeId INT, @detail NVARCHAR(3000)
AS
BEGIN

UPDATE t_product WITH(ROWLOCK)
SET f_picturePath=@productPicPath, f_title=@productTitle ,f_unitprice= @unitPrice, f_quantity=@qtn, f_typeId=@productTypeId, f_detail=@detail, f_updateTime = GETDATE()
WHERE f_id=@productId
SELECT 1 AS result

END