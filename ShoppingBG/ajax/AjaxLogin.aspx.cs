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

        //登入帳密驗証
        private void LoginVerify()
        {
            int msgValue;
            string apiGetId = Request.Form["getId"];
            string apiGetPwd = Request.Form["getPwd"];




            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("beginningSP ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();
            try
            {
                if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty(apiGetPwd))
                {
                    msgValue = (int)msgType.NullEmptyInput;
                    Response.Write(msgValue);
                }
                else
                {
                    //將登入頁輸入的帳號與密碼傳至beginningSP
                    cmd.Parameters.Add(new SqlParameter("@id",apiGetId));
                    cmd.Parameters.Add(new SqlParameter("@pwd", apiGetPwd));
                    //設定接收從beginningSP傳回的正確帳號跟密碼
                    SqlParameter correctId = new SqlParameter("@correctId", SqlDbType.NVarChar,20);
                    correctId.Direction = ParameterDirection.Output;
                    SqlParameter random = new SqlParameter("@random", SqlDbType.Int);
                    random.Direction = ParameterDirection.Output;

                    cmd.Parameters.Add(correctId);
                    cmd.Parameters.Add(random);


                    //執行beginningSP
                    cmd.ExecuteNonQuery();
                    Console.WriteLine(correctId.Value);
                    Console.WriteLine(random.Value);



                    if (correctId.Value!=System.DBNull.Value)
                    {
                        msgValue = (int)msgType.correctLogin;
                    } else {
                        msgValue = (int)msgType.wrongLogin;
                    }

                    Response.Write(msgValue);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex.GetBaseException();
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }
    }
}

///備用
//private void LoginVerify()
//{
//    int msgValue;
//    string apiGetId = Request.Form["getId"];
//    string apiGetPwd = Request.Form["getPwd"];




//    string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
//    SqlConnection conn = new SqlConnection(strConnString);
//    SqlCommand cmd = new SqlCommand("beginningSP ", conn);
//    cmd.CommandType = CommandType.StoredProcedure;
//    conn.Open();
//    try
//    {
//        if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty(apiGetPwd))
//        {
//            msgValue = (int)msgType.NullEmptyInput;
//            Response.Write(msgValue);
//        }
//        else
//        {
//            //將登入頁輸入的帳號與密碼傳至beginningSP
//            cmd.Parameters.Add(new SqlParameter("@id", apiGetId));
//            cmd.Parameters.Add(new SqlParameter("@pwd", apiGetPwd));
//            //設定接收從beginningSP傳回的正確帳號跟密碼
//            SqlParameter correctId = new SqlParameter("@correctId", SqlDbType.NVarChar, 20);
//            SqlParameter correctPwd = new SqlParameter("@correctPwd", SqlDbType.NVarChar, 20);
//            correctId.Direction = ParameterDirection.Output;
//            correctPwd.Direction = ParameterDirection.Output;
//            cmd.Parameters.Add(correctId);
//            cmd.Parameters.Add(correctPwd);
//            //執行beginningSP
//            cmd.ExecuteNonQuery();
//            Console.WriteLine(correctId.Value);
//            Console.WriteLine(correctPwd.Value);

//            if (correctId.Value != System.DBNull.Value && correctPwd.Value != System.DBNull.Value)
//            {
//                msgValue = (int)msgType.correctLogin;
//            }
//            else
//            {
//                msgValue = (int)msgType.wrongLogin;
//            }

//            Response.Write(msgValue);
//        }
//    }
//    catch (Exception ex)
//    {
//        Console.WriteLine(ex);
//        throw ex.GetBaseException();
//    }
//    finally
//    {
//        conn.Close();
//        conn.Dispose();
//    }
//}