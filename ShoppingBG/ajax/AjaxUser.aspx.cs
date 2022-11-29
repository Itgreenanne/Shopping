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
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using ShoppingBG.app_code;
using System.Diagnostics;
using NLog;



namespace ShoppingBG.ajax
{
    public partial class AjaxUser : DutyAuthority
    {
         /// <summary>
        /// 新增人員各函式回傳訊息
        /// </summary>
        public enum MsgType
        {
            /// <summary>
            /// 新增人員成功
            /// </summary>
            WellAdded,
            /// <summary>
            /// 此人員已存在
            /// </summary>
            UserExisted,
            /// <summary>
            /// 空字串或是所有選項都沒勾選
            /// </summary>
            NullEmptyInput,
            /// <summary>
            /// 帳號字串長度超過限制
            /// </summary>
            AccountToolongString,
            /// <summary>
            /// 暱稱字串長度超過限制 
            /// </summary>
            NicknameToolongString,
            /// <summary>
            /// 密碼字串長度超過限制 
            /// </summary>
            PwdToolongString,
            /// <summary>
            /// 人員不存在
            /// </summary>
            UserNotExisted,
            /// <summary>
            /// 人員修改成功
            /// </summary>
            UserModified,
            /// <summary>
            /// 網路錯誤
            /// </summary>
            WrongConnection,
            /// <summary>
            /// Id無法被轉換成int
            /// </summary>
            IdIsNotConvToInt
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string fnSelected = Request.QueryString["fn"];
            switch (fnSelected)
            {
                case "DutyTypeMenu":
                    DutyTypeMenu();
                    break;

                case "AddUserVerify":
                    AddUserVerify();
                    break;


                case "GetAllUser":
                    GetAllUser();
                    break;

                case "GetSearchUser":
                    GetSearchUser();
                    break;

                case "DeleteUser":
                    DeleteUser();
                    break;

                case "GetSearchUserById":
                    GetSearchUserById();
                    break;

                case "ModifyUser":
                    ModifyUser(GetSearchUserById());
                    break;
            }
        }

        
        /// <summary>
        /// 從DB讀取全部職責名稱到下拉選單
        /// </summary>
        private void DutyTypeMenu()
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllDuty ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此職責名稱存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject dutyinfo = new JObject();
                        dutyinfo.Add("DutyId", Convert.ToInt16(reader["f_id"]));
                        dutyinfo.Add("DutyName", reader["f_name"].ToString());
                        resultArray.Add(dutyinfo);
                    }
                }
                Response.Write(resultArray);
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
        /// <summary>
        /// 新增人員
        /// </summary>
        private void AddUserVerify()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            MsgType msgValue = MsgType.WrongConnection;
            string apiUserAccount = Request.Form["getUserAccount"];
            string apiNickname = Request.Form["getNickname"];
            string apiUserPwd = Request.Form["getUserPwd"];
            int apiUserDutyId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getUserDutyId"], out apiUserDutyId);
            //空字串驗証
            if (string.IsNullOrEmpty(apiUserAccount) || string.IsNullOrEmpty(apiNickname)
                || string.IsNullOrEmpty(apiUserPwd))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
                //字串長度驗証
            }
            else if (apiUserAccount.Length > 20)
            {
                msgValue = MsgType.AccountToolongString;
                Response.Write((int)msgValue);
            }
            else if (apiNickname.Length > 20)
            {
                msgValue = MsgType.NicknameToolongString;
                Response.Write((int)msgValue);
            }
            else if (apiUserPwd.Length > 20)
            {
                msgValue = MsgType.PwdToolongString;
                Response.Write((int)msgValue);
            }
            else if (!idIsConvToInt)
            {
                msgValue = MsgType.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_AddUser", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@userAccount", apiUserAccount));
                    cmd.Parameters.Add(new SqlParameter("@nickname", apiNickname));
                    cmd.Parameters.Add(new SqlParameter("@userPwd", apiUserPwd));
                    cmd.Parameters.Add(new SqlParameter("@dutyTypeId", apiUserDutyId));
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此人員帳號存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int result = Convert.ToInt16(reader["result"]);
                            if (result == 0)
                            {
                                msgValue = MsgType.UserExisted;
                                break;
                            }
                            else
                            {
                                msgValue = MsgType.WellAdded;
                            }
                        }
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
        /// 從資料庫讀取全部人員資料
        /// </summary>
        private void GetAllUser()
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllUser", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();
            try
            {
                //從Command取得資料存入dataAdapter
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                //創一個dataset的記憶體資料集
                DataSet ds = new DataSet();
                //將dataAdapter資料存入dataset
                adapter.Fill(ds);
                DataTable dt = new DataTable();                
                dt = ds.Tables[0];
                UserDutyCombo userDutyCombo = new UserDutyCombo();
                List<DutyInfoForMenu> dutyArray = new List<DutyInfoForMenu>();
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow row = dt.Rows[i];
                    DutyInfoForMenu dutyInfoForMenu = new DutyInfoForMenu()
                    {
                        DutyId = Convert.ToInt16(row.ItemArray[0]),
                        DutyName = row.ItemArray[1].ToString()
                    };
                    dutyArray.Add(dutyInfoForMenu);
                }
                ///讀取人員表格
                dt = ds.Tables[1];
                List<UserDataArray> userArray = new List<UserDataArray>();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow row = dt.Rows[i];
                    UserDataArray userdata = new UserDataArray()
                    {
                        UserId = Convert.ToInt16(row.ItemArray[0]),
                        UserAccount = row.ItemArray[1].ToString(),
                        UserNickname = row.ItemArray[2].ToString(),
                        UserPwd = row.ItemArray[3].ToString(),
                        DutyTypeId = Convert.ToInt16(row.ItemArray[4]),
                        DutyName = row.ItemArray[5].ToString()
                    };
                    userArray.Add(userdata);
                }
                userDutyCombo.DutyInfoArray = dutyArray;
                userDutyCombo.UserDataArray = userArray;
                Response.Write(JsonConvert.SerializeObject(userDutyCombo));
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

        /// <summary>
        /// 人員查詢
        /// </summary>
        private void GetSearchUser()
        {
            MsgType msgValue = MsgType.WrongConnection;
            string apiUserAccount = Request.Form["getUserAccount"];
            int apiDutyId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getDutyId"], out apiDutyId);

            if (string.IsNullOrEmpty(apiUserAccount) && apiDutyId == 0)
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            //字串長度驗証
            else if (apiUserAccount.Length > 20)
            {
                msgValue = MsgType.AccountToolongString;
                Response.Write((int)msgValue);
            }
            else if (!idIsConvToInt)
            {
                msgValue = MsgType.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                //如果帳號無輸入，但職責id有輸入
                //if (apiUserAccount == "") apiUserAccount = "noEntry";
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchUser", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    //if(!string.IsNullOrEmpty(apiUserAccount) && apiDutyId != 0)
                    cmd.Parameters.Add(new SqlParameter("@userAccount", apiUserAccount));
                    cmd.Parameters.Add(new SqlParameter("@dutyId", apiDutyId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject userInfo = new JObject();
                            userInfo.Add("UserId", Convert.ToInt16(reader["f_id"]));
                            userInfo.Add("UserAccount", reader["f_account"].ToString());
                            userInfo.Add("UserNickname", reader["f_nickname"].ToString());
                            userInfo.Add("DutyId", Convert.ToInt16(reader["f_typeId"]));
                            userInfo.Add("DutyName", reader["f_name"].ToString());
                            resultArray.Add(userInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.UserNotExisted;
                        Response.Write((int)msgValue);
                    }
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
        /// 刪除人員
        /// </summary>
        private void DeleteUser()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            int apiUserId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getUserId"], out apiUserId);
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_delUser ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            if (idIsConvToInt)
            {
                try
                {
                    cmd.Parameters.Add(new SqlParameter("@currentUserId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@userId", apiUserId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject userData = new JObject();
                            userData.Add("UserId", Convert.ToInt16(reader["f_id"]));
                            userData.Add("UserAccount", reader["f_account"].ToString());
                            userData.Add("UserNickname", reader["f_nickname"].ToString());
                            userData.Add("UserPwd", reader["f_pwd"].ToString());
                            userData.Add("DutyName", reader["f_name"].ToString());
                            resultArray.Add(userData);
                        }
                    }
                    Response.Write(resultArray);
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
        /// 人員修改視窗中用來搜尋選中人員的資料
        /// </summary>
        private JObject GetSearchUserById()
        {
            MsgType msgValue = MsgType.WrongConnection;
            int apiUserId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getUserId"], out apiUserId);

            if (!idIsConvToInt)
            {
                msgValue = MsgType.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchUserById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", apiUserId));
                    //從Command取得資料存入dataAdapter
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    //創一個dataset的記憶體資料集
                    DataSet ds = new DataSet();
                    //將dataAdapter資料存入dataset
                    adapter.Fill(ds);
                    DataTable dt = new DataTable();
                    ///讀取職責表格
                    dt = ds.Tables[0];
                    UserDutyCombo userDutyCombo = new UserDutyCombo();
                    List<DutyInfoForMenu> dutyArray = new List<DutyInfoForMenu>();
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow row = dt.Rows[i];
                        DutyInfoForMenu dutyInfoForMenu = new DutyInfoForMenu()
                        {
                            DutyId = Convert.ToInt16(row.ItemArray[0]),
                            DutyName = row.ItemArray[1].ToString()
                        };
                        dutyArray.Add(dutyInfoForMenu);
                    }
                    ///讀取人員表格
                    dt = ds.Tables[1];
                    List<UserDataArray> userArray = new List<UserDataArray>();
                    JObject userInfo = new JObject();
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow row = dt.Rows[i];
                        UserDataArray userdata = new UserDataArray()
                        {
                            UserId = Convert.ToInt16(row.ItemArray[0]),
                            UserAccount = row.ItemArray[1].ToString(),
                            UserNickname = row.ItemArray[2].ToString(),
                            UserPwd = row.ItemArray[3].ToString(),
                            DutyTypeId = Convert.ToInt16(row.ItemArray[4]),
                            DutyName = row.ItemArray[5].ToString()
                        }; userArray.Add(userdata);

                        userInfo.Add("userNickname", row.ItemArray[2].ToString());
                        userInfo.Add("userPwd", row.ItemArray[3].ToString());
                        userInfo.Add("dutyName", row.ItemArray[5].ToString());
                    }
                    userDutyCombo.UserDataArray = userArray;
                    userDutyCombo.DutyInfoArray = dutyArray;
                    Response.Write(JsonConvert.SerializeObject(userDutyCombo));
                    return userInfo;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    Bglogger(ex.Message);
                    return (JObject)false;
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
            return (JObject)false;
        }

        /// <summary>
        /// 將人員修改資料存入DB
        /// </summary>
        private void ModifyUser(JObject oldUserInfo)
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            MsgType msgValue = MsgType.WrongConnection;
            int apiUserId = 0;
            bool userIdIsConvToInt = int.TryParse(Request.Form["getUserId"], out apiUserId);
            string apiNickname = Request.Form["getNickname"];
            string apiUserPwd = Request.Form["getUserPwd"];
            string apiDutyName = Request.Form["getDutyName"];
            int apiUserDutyId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getUserDutyId"], out apiUserDutyId);
            //空字串驗証
            if (string.IsNullOrEmpty(apiNickname) || string.IsNullOrEmpty(apiUserPwd) || string.IsNullOrEmpty(apiDutyName))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
                //字串長度驗証
            }
            else if (apiNickname.Length > 20)
            {
                msgValue = MsgType.NicknameToolongString;
                Response.Write((int)msgValue);
            }
            else if (apiUserPwd.Length > 20)
            {
                msgValue = MsgType.PwdToolongString;
                Response.Write((int)msgValue);
            }
            else if (!idIsConvToInt)
            {
                msgValue = MsgType.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else if (!userIdIsConvToInt)
            {
                msgValue = MsgType.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                JObject newUserInfo = new JObject();
              
                newUserInfo.Add("userNickname", apiNickname);
                newUserInfo.Add("userPwd", apiUserPwd);
                newUserInfo.Add("dutyName", apiDutyName);             

                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_modifyUser", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@currentUserId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@userId", apiUserId));
                    cmd.Parameters.Add(new SqlParameter("@userNickname", apiNickname));
                    cmd.Parameters.Add(new SqlParameter("@userPwd", apiUserPwd));
                    cmd.Parameters.Add(new SqlParameter("@dutyTypeId", apiUserDutyId));
                    cmd.Parameters.Add(new SqlParameter("@before", JsonConvert.SerializeObject(oldUserInfo)));
                    cmd.Parameters.Add(new SqlParameter("@after", JsonConvert.SerializeObject(newUserInfo)));
                    SqlDataReader reader = cmd.ExecuteReader();
                    Response.Clear();

                    //判斷是否有此人員帳號存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            msgValue = MsgType.UserModified;
                        }
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