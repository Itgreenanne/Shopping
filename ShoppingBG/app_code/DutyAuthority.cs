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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;


namespace ShoppingBG.app_code
{
    public class DutyAuthority : System.Web.UI.Page
    {
        public enum DutyAuthorityMsg
        {
            /// <summary>
            /// 使用者資料沒有被改變
            /// </summary>
            UserInfoIsChanged,
            /// <summary>
            /// 太久沒使用網頁Session使用者資料過期變null
            /// </summary>
            SessionIsNull
        }

        protected void Page_Init(object sender, EventArgs e)
        {
            ajax.WriteLog writeLog = new ajax.WriteLog();

            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            if (Session["userInfo"] == null)
            {
                JObject msgReturn = new JObject();
                msgReturn.Add("result", Convert.ToInt16(DutyAuthorityMsg.SessionIsNull));
                Response.Write(msgReturn);
                Response.End();
            }

            UserInfoCompare userInfoCompare = new UserInfoCompare();
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchUserInfo", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                //session的userInfo與db來比較
                cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));

                SqlDataReader reader = cmd.ExecuteReader();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        userInfoCompare.UserId = Convert.ToInt16(reader["f_id"]);
                        userInfoCompare.Account = reader["f_account"].ToString();
                        userInfoCompare.Pwd = reader["f_pwd"].ToString();
                        userInfoCompare.TypeId = Convert.ToInt16(reader["f_typeId"]);
                        userInfoCompare.DutyId = Convert.ToInt16(reader["f_dutyId"]);
                        userInfoCompare.DutyName = reader["f_name"].ToString();
                        userInfoCompare.MangDuty = Convert.ToInt16(reader["f_manageDuty"]);
                        userInfoCompare.MangUser = Convert.ToInt16(reader["f_manageUser"]);
                        userInfoCompare.MangProType = Convert.ToInt16(reader["f_manageProductType"]);
                        userInfoCompare.MangProduct = Convert.ToInt16(reader["f_manageProduct"]);
                        userInfoCompare.MangOrder = Convert.ToInt16(reader["f_manageOrder"]);
                        userInfoCompare.MangRecord = Convert.ToInt16(reader["f_manageRecord"]);
                    }
                }

                if ( userInfoCompare.Pwd != userInfo.Pwd
                    || userInfoCompare.DutyName != userInfo.DutyName || userInfoCompare.MangDuty != userInfo.MangDuty
                    || userInfoCompare.MangUser != userInfo.MangUser || userInfoCompare.MangProType != userInfo.MangProType
                    || userInfoCompare.MangProduct != userInfo.MangProduct || userInfoCompare.MangOrder != userInfo.MangOrder
                    || userInfoCompare.MangRecord != userInfo.MangRecord)
                {
                    JObject msgReturn = new JObject();
                    msgReturn.Add("result", Convert.ToInt16(DutyAuthorityMsg.UserInfoIsChanged));
                    Response.Write(msgReturn);
                    Response.End();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                writeLog.Bglogger(ex.Message);
            }
            finally
            {
                conn.Close();
                conn.Dispose();
            }
        }
    }
}



//if (reader.HasRows)
//{
//    while (reader.Read())
//    {
//        int result = Convert.ToInt16(reader["result"]);
//        if (result == 0)
//        {
//            msgValue = MsgTypeInit.UserInfoUnchanged;
//            break;
//        }
//        else
//        {
//            msgValue = MsgTypeInit.UserInfoChanged;
//        }
//    }
//}

//msgInit = (int)msgValue;