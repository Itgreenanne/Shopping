USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getSearchUserInfo @userId INT
AS
BEGIN

SELECT TA.f_id, TA.f_account, TA.f_pwd, TA.f_typeId, TB.f_id AS f_dutyId, TB.f_name, TB.f_manageDuty, TB.f_manageUser, TB.f_manageProductType, TB.f_manageProduct, TB.f_manageOrder, TB.f_manageRecord
FROM t_backendUser AS TA left join t_duty AS TB WITH(NOLOCK) ON TA.f_typeId = TB.f_id WHERE TA.f_id = @userId

END