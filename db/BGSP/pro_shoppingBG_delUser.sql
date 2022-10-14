USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_delUser @userId INT
AS 
BEGIN

	DELETE FROM t_backendUser WHERE f_id=@userId

	SELECT TA.f_id, TA.f_account, TA.f_nickname, TA.f_pwd, TB.f_name
	FROM t_backendUser AS TA left join t_duty AS TB WITH(NOLOCK) ON TA.f_typeId = TB.f_id


END