USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getAllUser 
AS 
BEGIN
SELECT f_id, f_name FROM t_duty
SELECT TA.f_id, TA.f_account, TA.f_nickname, TA.f_pwd, TA.f_typeId, TB.f_name
FROM t_backendUser AS TA left join t_duty AS TB WITH(NOLOCK) ON TA.f_typeId = TB.f_id

END