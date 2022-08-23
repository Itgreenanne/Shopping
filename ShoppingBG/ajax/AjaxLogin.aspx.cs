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
        //public string loginState { get; set; }
        //用enum新增登入狀態
        public enum msgType
        {
            ///summary
            ///輸入正確
            ///summary
            correctLogin,
            ///summary
            ///輸入錯誤
            ///summary
            wrongLogin,
            ///summary
            ///空字串請重新輸入
            NullEmptyInput
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            LoginVerify();
        }

        ///登入帳密驗証
        private void LoginVerify()
        {
            msgType msgValue = msgType.wrongLogin;
            string apiGetId = Request.Form["getId"];
            string apiGetPwd = Request.Form["getPwd"];

            if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty (apiGetPwd)) {
                msgValue = msgType.NullEmptyInput;
                Response.Write((int)msgValue);
            } else {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("beginningSP ", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    //將登入頁輸入的帳號與密碼傳至beginningSP
                    cmd.Parameters.Add(new SqlParameter("@id", apiGetId));
                    cmd.Parameters.Add(new SqlParameter("@pwd", apiGetPwd));
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows) {
                        while (reader.Read()) {
                            Session["typeId"] = reader["f_typeId"];
                            Session["account"] = reader["f_account"];
                        }
                        msgValue = msgType.correctLogin;
                        Response.Write((int)msgValue);
                    }

                    Response.Write((int)msgValue);
                }
                catch (Exception ex) {
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

