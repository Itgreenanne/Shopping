USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_delProduct @productId INT
AS 
BEGIN

	DELETE FROM t_product WHERE f_id=@productId

	SELECT TA.f_id, TA.f_picturePath, TA.f_title, TA.f_unitprice, TA.f_quantity, TA.f_typeId, TA.f_detail, TB.f_name
	FROM t_product AS TA left join t_productType AS TB WITH(NOLOCK) ON TA.f_typeId = TB.f_id


END