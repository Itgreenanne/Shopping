USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getAllDuty 
AS 
BEGIN

	SELECT f_id, f_name, f_manageDuty, f_manageUser, f_manageProductType,	
	f_manageProduct, f_manageOrder, f_manageRecord, f_createTime 
	FROM t_duty WITH(NOLOCK)


END