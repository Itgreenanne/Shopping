USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getSearchProductById @productId INT
AS 
BEGIN

SELECT f_id, f_name FROM t_productType

SELECT TA.f_id, TA.f_picturePath, TA.f_title, TA.f_unitprice, TA.f_quantity, TA.f_typeId, TA.f_detail, TB.f_name
FROM t_product AS TA left join t_productType AS TB WITH(NOLOCK) ON TA.f_typeId = TB.f_id WHERE TA.f_id = @productId

END