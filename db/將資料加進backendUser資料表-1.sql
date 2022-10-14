/****** SSMS 中 SelectTopNRows 命令的指令碼  ******/
USE ShoppingBG

--INSERT INTO t_duty (f_name, f_manageDuty, f_manageUser, f_manageProductType, f_manageProduct, f_manageOrder, f_manageRecord)--
--VALUES ('你好嗎',1,1,1,1,1,1)

--UPDATE t_duty
--SET f_manageRecord=1, f_updateTime = GETDATE()
--WHERE f_id=1

--UPDATE t_backendUser
--SET f_pwd='55', f_updateTime = GETDATE()
--WHERE f_id=2

--UPDATE t_duty
--SET f_name='我很好', f_manageDuty=1, f_updateTime = GETDATE()
--WHERE f_id=1

--INSERT INTO t_backendUser(f_account,f_nickname,f_pwd,f_typeId)
--VALUES ('1','3232','1',1);

INSERT INTO t_productType (f_name, f_detail)
VALUES('Clothes','H2O')

--DELETE  FROM t_productType WHERE f_id=3;

--declare @a nvarchar(100)
--set @a='DF'
--SELECT * FROM t_product WHERE f_title LIKE '%'+@a+'%'


--delete  FROM t_backendUser


--UPDATE t_backendUser
--SET f_pwd='22', f_updateTime = GETDATE()
--WHERE f_id=3

