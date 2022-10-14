USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getAllProType 
AS 
BEGIN

	SELECT f_id, f_name FROM t_productType WITH(NOLOCK)

END