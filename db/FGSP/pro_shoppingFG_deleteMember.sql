USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingFG_deleteMember @memberId INT
AS 
BEGIN

DELETE FROM t_frontendUser WHERE f_id=@memberId

SELECT f_id, f_idNumber, f_firstname, f_lastname, f_gender, f_birthday, f_pwd, f_mail, f_phone, f_address, f_points, f_level
FROM t_frontendUser WITH(ROWLOCK)

END