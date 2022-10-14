USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getSearchDuty @dutyName NVARCHAR(20)
AS 
BEGIN

SELECT f_name, f_manageDuty, f_manageUser, f_manageProductType,
	f_manageProduct, f_manageOrder, f_manageRecord, f_createTime 
	FROM t_duty WITH(NOLOCK) WHERE f_name=@dutyName  

END