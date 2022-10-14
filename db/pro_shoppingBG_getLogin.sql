USE ShoppingBG
GO
CREATE PROCEDURE pro_shoppingBG_getLogin @id NVARCHAR(20), @pwd NVARCHAR(20)
AS
BEGIN
SELECT f_typeId,f_account FROM t_backendUser WITH (NOLOCK) WHERE f_account=@id AND f_pwd=@pwd

END
