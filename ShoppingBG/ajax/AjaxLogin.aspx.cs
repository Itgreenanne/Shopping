using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;

namespace ShoppingBG.ajax
{
    public partial class ajaxLogin : System.Web.UI.Page
    {
        //用enum新增登入狀態
        public enum msgType
        {
            //summary
            //輸入正確
            //summary
            correctLogin,
            //summary
            //輸入錯誤
            //summary
            wrongLogin,
            //summary
            //空字串請重新輸入
            NullEmptyInput
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            LoginVerify();
        }
               
        ///登入帳密驗証
        private void LoginVerify() 
        {
            int msgValue;           
            string apiGetId = Request.Form["getId"];
            string apiGetPwd = Request.Form["getPwd"];
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand(string.Empty, conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "beginningSP";
            //cmd.Connection = conn;

            try
            {
                conn.Open(); //開啟資料庫
                Console.WriteLine(conn.ServerVersion);
                Console.WriteLine(conn.State);
                if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty(apiGetPwd))
                {
                    msgValue = (int)msgType.NullEmptyInput;
                    Response.Write(msgValue);
                } else {
                    cmd.Parameters.Add("@id", SqlDbType.NVarChar,20).Value=apiGetId;
                    
                    cmd.ExecuteNonQuery();
                    SqlParameter retValParam = cmd.Parameters.Add("@idVerify", SqlDbType.NVarChar, 20);
                    retValParam.Direction = ParameterDirection.Output;
                    Console.Write("取得的輸出資料: " + retValParam.Value);
                }

            } catch(Exception ex) {
                Console.WriteLine(ex);
                throw ex.GetBaseException();
            }
            finally {
                conn.Close();
                conn.Dispose();
            }            
                //if (apiGetId == correctId && apiGetPwd == correctPwd)
                //{
                //    msgValue = (int)msgType.correctLogin;
                //} else {
                //    msgValue = (int)msgType.wrongLogin;
                //}
                //Response.Write(msgValue);
        }
    }
}