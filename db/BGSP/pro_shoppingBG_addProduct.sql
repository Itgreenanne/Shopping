USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_addProduct @productPic NVARCHAR(100), @productTitle NVARCHAR(100), @unitPrice INT, @qtn INT, @productTypeId INT, @detail NVARCHAR(3000)
AS
BEGIN

INSERT INTO t_product(f_picturePath, f_title,f_unitprice, f_quantity, f_typeId, f_detail)
VALUES( @productPic, @productTitle, @unitPrice, @qtn , @productTypeId, @detail)
SELECT 1 AS result

END