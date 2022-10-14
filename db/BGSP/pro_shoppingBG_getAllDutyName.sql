USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getAllDutyName 
AS 
BEGIN

	SELECT f_name FROM t_duty WITH(NOLOCK)

END