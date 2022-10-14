USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_delDuty @dutyName NVARCHAR(20)
AS 
BEGIN

	DELETE FROM t_duty WHERE f_name=@dutyName

	SELECT f_name, f_manageDuty, f_manageUser, f_manageProductType,
		f_manageProduct, f_manageOrder, f_manageRecord, f_createTime 
	FROM t_duty WITH(NOLOCK)


END