USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingFG_getAllMember
AS 
BEGIN

SELECT f_id, f_idNumber, f_firstname, f_lastname, f_gender, f_birthday, f_pwd, f_mail, f_phone, f_address, f_points, f_level
FROM t_frontendUser WITH(ROWLOCK)

END