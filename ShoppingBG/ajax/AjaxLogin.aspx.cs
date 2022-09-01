using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using ShoppingBG.models;

namespace ShoppingBG.ajax
{
    public partial class AjaxLogin : System.Web.UI.Page
    {
        public enum MsgType
        {
            ///summary
            ///輸入正確
            ///summary
            CorrectLogin,
            ///summary
            ///輸入錯誤
            ///summary
            WrongLogin,
            ///summary
            ///空字串請重新輸入
            NullEmptyInput,
            /// <summary>
            /// f
            /// </summary>
            ToolongString
            
        }

        protected void Page_Load(object sender, EventArgs e)
        {
           LoginVerify();
        }

        ///登入帳密驗証
        private void LoginVerify()
        {            
            MsgType msgValue = MsgType.WrongLogin;
            string apiGetId = Request.Form["getId"];
            string apiGetPwd = Request.Form["getPwd"];
            //string apiGetId = "0123456789012334568787878787878787";
            //string apiGetPwd = "1212121212121";

            //後端空字串驗証
            if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty (apiGetPwd)) {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);

            //字串長度是否有超過限制驗証
            } else if (apiGetId.Length > 20 || apiGetPwd.Length > 20) {
                msgValue = MsgType.ToolongString;
                Response.Write((int)msgValue);
            } else {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_login", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try {
                    //將登入頁輸入的帳號與密碼傳至beginningSP
                    cmd.Parameters.Add(new SqlParameter("@id", apiGetId));
                    cmd.Parameters.Add(new SqlParameter("@pwd", apiGetPwd));
                    SqlDataReader reader = cmd.ExecuteReader();
                    UserInfo userInfo = new UserInfo();

                    if (reader.HasRows) {  
                        while (reader.Read()) {
                            userInfo.Account = reader["f_account"].ToString();
                            userInfo.TypeId= Convert.ToInt16(reader["f_typeId"]);
                        }
                        Session["userInfo"] = userInfo;                        
                        msgValue = MsgType.CorrectLogin;
                        Response.Write((int)msgValue);
                    }

                    Response.Write((int)msgValue);
                } catch (Exception ex) {
                    Console.WriteLine(ex);
                    throw ex.GetBaseException();
                } finally {
                    conn.Close();
                    conn.Dispose();                    
                }
            }
        }
    }
}