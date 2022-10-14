USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingFG_addMember @idNo char(10), @tel char(10), @pwd NVARCHAR(20), @gender tinyint, @lastName NVARCHAR(20),  @firstName NVARCHAR(20), @birth CHAR(10),
@mail varchar(40), @address nvarchar(200)
AS
BEGIN

IF NOT EXISTS (SELECT f_idNumber FROM t_frontendUser WHERE f_idNumber = @idNo)
BEGIN

INSERT INTO t_frontendUser(f_idNumber,f_firstname,f_lastname,f_gender, f_birthday, f_pwd, f_mail, f_phone, f_address, f_poINTs, f_level, f_balance)
VALUES(@idNo, @firstName, @lastName, @gender, @birth, @pwd, @mail, @tel, @address, 0, 0, 0)
SELECT 1 AS result

END

ELSE 
BEGIN

SELECT 0 AS result 

END

END