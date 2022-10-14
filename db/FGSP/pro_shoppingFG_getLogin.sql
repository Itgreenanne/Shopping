USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingFG_getLogin @idNo CHAR(10), @pwd NVARCHAR(20)
AS
BEGIN

SELECT 0 AS result, f_id, f_idNumber, f_firstname, f_lastname, f_mail, f_phone, f_points, f_level FROM t_frontendUser WITH(ROWLOCK) WHERE f_idNumber = @idNo AND f_pwd = @pwd

END
