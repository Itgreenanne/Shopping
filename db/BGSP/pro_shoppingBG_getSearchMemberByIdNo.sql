USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getSearchMemberByIdNo @idNo CHAR(10)
AS 
BEGIN

SELECT f_id, f_idNumber, f_firstname, f_lastname, f_gender, f_birthday, f_pwd, f_mail, f_phone, f_address, f_points, f_level
FROM t_frontendUser WITH(ROWLOCK) WHERE f_idNumber = @idNo

END