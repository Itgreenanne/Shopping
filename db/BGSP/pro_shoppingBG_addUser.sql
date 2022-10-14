USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_addUser @userAccount NVARCHAR(20), @nickName NVARCHAR(20), @userPwd NVARCHAR(20), @dutyTypeId INT
AS
BEGIN

IF NOT EXISTS (SELECT f_account FROM t_backendUser WHERE f_account = @userAccount)
BEGIN

INSERT INTO t_backendUser(f_account,f_nickname,f_pwd,f_typeId)
VALUES(@userAccount, @nickName, @userPwd, @dutyTypeId)
SELECT 1 AS result 

END

ELSE 
BEGIN

SELECT 0 AS result 

END

END