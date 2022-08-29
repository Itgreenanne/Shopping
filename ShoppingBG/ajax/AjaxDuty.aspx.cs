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
    public partial class AjaxDuty : System.Web.UI.Page
    {
        /// <summary>
        /// 新增職責訊息
        /// </summary>
        public enum MsgType
        {
            /// <summary>
            /// 新增成功
            /// </summary>
            WellAdded,
            /// <summary>
            /// 此職責已存在
            /// </summary>
            DutyExisted,
            /// <summary>
            /// 空字串或是所有選項都沒勾選
            /// </summary>
            NullEmptyInput
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            AddDutyVerify();
        }

        //新增職責到資料庫
        private void AddDutyVerify()
        {
            MsgType msgValue = MsgType.WellAdded;
            string apiGetDutyName = Request.Form["getDutyName"];
            bool apiMangDuty = Convert.ToBoolean(Request.Form["getMangDuty"]);
            bool apiMangUser = Convert.ToBoolean(Request.Form["getMangUser"]);
            bool apiMangProType = Convert.ToBoolean(Request.Form["getMangProType"]);
            bool apiMangProduct = Convert.ToBoolean(Request.Form["getMangProduct"]);
            bool apiMangOrder = Convert.ToBoolean(Request.Form["getMangOrder"]);
            bool apiMangRecord = Convert.ToBoolean(Request.Form["getMangRecord"]);


            if (string.IsNullOrEmpty(apiGetDutyName) ||
                ((apiMangDuty == false) && (apiMangUser == false) &&
                (apiMangProType == false) && (apiMangProduct == false) &&
                (apiMangOrder == false) && (apiMangRecord == false)))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("addDutySP ", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    //將登入頁輸入的帳號與密碼傳至beginningSP
                    cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
                    cmd.Parameters.Add(new SqlParameter("@mangDuty", apiMangDuty));
                    cmd.Parameters.Add(new SqlParameter("@mangUser", apiMangUser));
                    cmd.Parameters.Add(new SqlParameter("@mangProType", apiMangProType));
                    cmd.Parameters.Add(new SqlParameter("@mangProduct", apiMangProduct));
                    cmd.Parameters.Add(new SqlParameter("@mangOrder", apiMangOrder));
                    cmd.Parameters.Add(new SqlParameter("@mangRecord", apiMangRecord));
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int a = Convert.ToInt16(reader.Read());
                            if (a== 0) {
                                msgValue = MsgType.DutyExisted;
                                break;
                            } else {
                                msgValue = MsgType.WellAdded;
                            }
                        }
                    }

                    Response.Write((int)msgValue);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    throw ex.GetBaseException();//
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();

                }
            }
        }
    }
}





//private void AddDutyVerify()
//{
//    MsgType msgValue = MsgType.WellAdded;
//    string apiGetDutyName = Request.Form["getDutyName"];
//    string apiMangDuty = Request.Form["getMangDuty"];
//    string apiMangUser = Request.Form["getMangUser"];
//    string apiMangProType = Request.Form["getMangProType"];
//    string apiMangProduct = Request.Form["getMangProduct"];
//    string apiMangOrder = Request.Form["getMangOrder"];
//    string apiMangRecord = Request.Form["getMangRecord"];

//    if (string.IsNullOrEmpty(apiGetDutyName) ||
//        (string.IsNullOrEmpty(apiMangDuty) && string.IsNullOrEmpty(apiMangUser) &&
//        string.IsNullOrEmpty(apiMangProType) && string.IsNullOrEmpty(apiMangProduct)
//        && string.IsNullOrEmpty(apiMangOrder) && string.IsNullOrEmpty(apiMangRecord)))
//    {
//        msgValue = MsgType.NullEmptyInput;
//        Response.Write((int)msgValue);
//    }
//    else
//    {
//        string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
//        SqlConnection conn = new SqlConnection(strConnString);
//        SqlCommand cmd = new SqlCommand("addDutySP ", conn);
//        cmd.CommandType = CommandType.StoredProcedure;
//        conn.Open();

//        try
//        {
//            //將登入頁輸入的帳號與密碼傳至beginningSP
//            cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
//            cmd.Parameters.Add(new SqlParameter("@mangDuty", apiMangDuty));
//            cmd.Parameters.Add(new SqlParameter("@mangUser", apiMangUser));
//            cmd.Parameters.Add(new SqlParameter("@mangProType", apiMangProType));
//            cmd.Parameters.Add(new SqlParameter("@mangProduct", apiMangProduct));
//            cmd.Parameters.Add(new SqlParameter("@mangOrder", apiMangOrder));
//            cmd.Parameters.Add(new SqlParameter("@mangRecord", apiMangRecord));
//            SqlDataReader reader = cmd.ExecuteReader();

//            //判斷是否有此職責存在
//            if (reader.HasRows)
//            {
//                while (reader.Read())
//                {
//                    string getDutyname = reader["f_name"].ToString();
//                    if (getDutyname == apiGetDutyName)
//                    {
//                        msgValue = MsgType.DutyExisted;
//                        break;
//                    }
//                    else
//                    {
//                        msgValue = MsgType.WellAdded;
//                    }
//                }
//            }

//            Response.Write((int)msgValue);
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine(ex);
//            throw ex.GetBaseException();
//        }
//        finally
//        {
//            conn.Close();
//            conn.Dispose();

//        }
//    }
//}
