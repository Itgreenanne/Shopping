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

namespace ShoppingBG.ajax
{
    public partial class AjaxUser : System.Web.UI.Page
    {
        /// <summary>
        /// 新增人員各函式回傳訊息
        /// </summary>
        public enum MsgType {
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
            /// 字串長度超過限制
            /// </summary>
            ToolongString,
            /// <summary>
            /// 人員不存在
            /// </summary>
            UserNotExisted,
            /// <summary>
            /// 人員修改成功
            /// </summary>
            UserModified
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
            }

        }
        /// <summary>
        /// 從DB讀取全部職責名稱到下拉選單
        /// </summary>
        private void DutyTypeMenu() {
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
                        dutyinfo.Add("dutyId", Convert.ToInt16(reader["f_id"]));
                        dutyinfo.Add("dutyName", reader["f_name"].ToString());
                        resultArray.Add(dutyinfo);
                    }
                }
                Response.Write(resultArray);
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
        /// <summary>
        /// 新增人員
        /// </summary>
        private void AddUserVerify() {
            MsgType msgValue = MsgType.WellAdded;
            string apiUserAccount = Request.Form["getUserAccount"];
            string apiNickName = Request.Form["getNickName"];
            string apiUserPwd = Request.Form["getUserPwd"];
            int apiUserDutyType = Convert.ToInt16(Request.Form["getUserDutyType"]);

            //空字串驗証
            if (string.IsNullOrEmpty(apiUserAccount) || string.IsNullOrEmpty(apiNickName)
                || string.IsNullOrEmpty(apiUserPwd))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
                //字串長度驗証
            }
            else if (apiUserAccount.Length > 20 || apiNickName.Length > 20 || apiUserPwd.Length > 20)
            {
                msgValue = MsgType.ToolongString;
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
                    cmd.Parameters.Add(new SqlParameter("@userAccount", apiUserAccount));
                    cmd.Parameters.Add(new SqlParameter("@nickName", apiNickName));
                    cmd.Parameters.Add(new SqlParameter("@userPwd", apiUserPwd));
                    cmd.Parameters.Add(new SqlParameter("@dutyTypeId", apiUserDutyType));                    
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此職責存在
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
                    //99
                    //throw ex.GetBaseException();
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
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllUser ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject dutyinfo = new JObject();                        
                        dutyinfo.Add("userAccount", reader["f_account"].ToString());
                        dutyinfo.Add("userNickname", reader["f_nickname"].ToString());
                        dutyinfo.Add("userPwd", reader["f_pwd"].ToString());
                        dutyinfo.Add("dutyTypeId", reader["f_name"].ToString());
                        resultArray.Add(dutyinfo);
                    }
                }
                Response.Write(resultArray);
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

        private void GetSearchUser()
        {
            MsgType msgValue = MsgType.WellAdded;
            int apiDutyType = Convert.ToInt16(Request.Form["getDutyType"]);


            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchDutyByName ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@dutyId", apiDutyType));
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject dutyinfo = new JObject();
                        dutyinfo.Add("dutyId", Convert.ToInt16(reader["f_id"]));
                        dutyinfo.Add("dutyName", reader["f_name"].ToString());
                        dutyinfo.Add("mangDuty", Convert.ToInt16(reader["f_manageDuty"]));
                        dutyinfo.Add("mangUser", Convert.ToInt16(reader["f_manageUser"]));
                        dutyinfo.Add("mangProType", Convert.ToInt16(reader["f_manageProductType"]));
                        dutyinfo.Add("mangProduct", Convert.ToInt16(reader["f_manageProduct"]));
                        dutyinfo.Add("mangOrder", Convert.ToInt16(reader["f_manageOrder"]));
                        dutyinfo.Add("mangRecord", Convert.ToInt16(reader["f_manageRecord"]));
                        resultArray.Add(dutyinfo);
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