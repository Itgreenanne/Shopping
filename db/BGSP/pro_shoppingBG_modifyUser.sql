USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_modifyUser @userId INT, @userNickname NVARCHAR(20), @userPwd NVARCHAR(20), @dutyTypeId INT
AS
BEGIN

UPDATE t_backendUser WITH(ROWLOCK)
SET f_nickname=@userNickname, f_pwd=@userPwd, f_typeId=@dutyTypeId, f_updateTime = GETDATE()
WHERE f_id=@userId
SELECT 1 AS result

END