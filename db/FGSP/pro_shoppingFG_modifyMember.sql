USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingFG_modifyMember @id INT, @tel CHAR(10), @pwd NVARCHAR(20), @gender TINYINT, @lastName NVARCHAR(20),  @firstName NVARCHAR(20), @birth CHAR(10),
@mail VARCHAR(40), @address NVARCHAR(200), @level TINYINT, @points BIGINT
AS
BEGIN

UPDATE t_frontendUser WITH(ROWLOCK)
SET f_firstname = @firstName, f_lastname = @lastName, f_gender = @gender, f_birthday = @birth, f_pwd = @pwd, f_mail = @mail, 
f_phone = @tel, f_address = @address, f_points = @points, f_level = @level, f_updateTime = GETDATE()
WHERE f_id=@id
SELECT 1 AS result

END