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
using NLog;

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
            UserInfo userInfo = new UserInfo();

            //後端空字串驗証
            if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty(apiGetPwd))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);

                //字串長度是否有超過限制驗証
            }
            else if (apiGetId.Length > 20 || apiGetPwd.Length > 20)
            {
                msgValue = MsgType.ToolongString;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getLogin", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    //將登入頁輸入的帳號與密碼傳至beginningSP
                    cmd.Parameters.Add(new SqlParameter("@userAccount", apiGetId));
                    cmd.Parameters.Add(new SqlParameter("@pwd", apiGetPwd));
                    SqlDataReader reader = cmd.ExecuteReader();
                    if(reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            userInfo.UserId = Convert.ToInt16(reader["f_userId"]);
                            userInfo.Account = reader["f_account"].ToString();
                            userInfo.Nickname = reader["f_nickname"].ToString();
                            userInfo.Pwd = reader["f_pwd"].ToString();
                            userInfo.TypeId = Convert.ToInt16(reader["f_typeId"]);
                            userInfo.DutyId = Convert.ToInt16(reader["f_dutyId"]);
                            userInfo.DutyName = reader["f_name"].ToString();
                            userInfo.MangDuty = Convert.ToInt16(reader["f_manageDuty"]);
                            userInfo.MangUser = Convert.ToInt16(reader["f_manageUser"]);
                            userInfo.MangProType = Convert.ToInt16(reader["f_manageProductType"]);
                            userInfo.MangProduct = Convert.ToInt16(reader["f_manageProduct"]);
                            userInfo.MangMember = Convert.ToInt16(reader["f_manageMember"]);
                            userInfo.MangOrder = Convert.ToInt16(reader["f_manageOrder"]);
                            userInfo.MangRecord = Convert.ToInt16(reader["f_manageRecord"]);
                            userInfo.UserIp = GetIp();
                        }
                        Session["userInfo"] = userInfo;
                        msgValue = MsgType.CorrectLogin;
                    }                  
                    Response.Write((int)msgValue);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    Bglogger(ex.Message);
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
        }

        /// <summary>
        /// 取得用戶端的ip
        /// </summary>
        /// <returns></returns>
        public string GetIp()
        {
            string ip =
            HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            return ip;
        }

        /// <summary>
        /// 後端寫入exception log
        /// </summary>
        /// <param name="message"></param>
        private void Bglogger(string message)
        {
            Logger logger = LogManager.GetLogger("bGLogger");
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;

            if (Session["userInfo"] != null)
            {
                logger.Error("{userId}{userIp}{errorMessage}", userInfo.UserId, userInfo.UserIp, message);
            }
            else
            {
                logger.Error("{errorMessage}", message);
            }
            ExceptionAlert exp = new ExceptionAlert()
            {
                ErrorIndex = "error",
                ErrorMessage = message
            };
            Response.Write(JsonConvert.SerializeObject(exp));
        }
    }
}