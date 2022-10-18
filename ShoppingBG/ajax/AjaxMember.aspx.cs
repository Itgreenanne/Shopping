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

namespace ShoppingBG.ajax
{
    public partial class AjaxMember : DutyAuthority
    {
        public enum MsgType {
            /// <summary>
            /// 網路錯誤
            /// </summary>
            WrongConnect,
            /// <summary>
            /// 會員不存在
            /// </summary>
            MemberNotExisted,       
            /// <summary>
            /// 此人員已存在
            /// </summary>
            MemberExisted,
            /// <summary>
            /// 空字串或是所有選項都沒勾選
            /// </summary>
            NullEmptyInput,
            /// <summary>
            /// 身份証字號長度不對
            /// </summary>
            IdLengthIsNotRight,
            /// <summary>
            /// 電話號碼長度不對 
            /// </summary>
            TelLengthIsNotRight,
            /// <summary>
            /// 密碼長度不對 
            /// </summary>
            PwdLengthIsNotRight,
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
            /// 姓太長
            /// </summary>
            LastNameTooLong,
            /// <summary>
            /// 名太長
            /// </summary>
            FirstNameTooLong,
            /// <summary>
            /// email長度太長
            /// </summary>
            MailTooLong,
            /// <summary>
            /// Id無法被轉換成int
            /// </summary>
            IdIsNotConvToInt,
            /// <summary>
            /// 會員資料修改成功
            /// </summary>
            MemberModified
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string fnSelected = Request.QueryString["fn"];
            switch (fnSelected)
            {
                case "GetAllMember":
                    GetAllMember();
                    break;
                case "DeleteMember":
                    DeleteMember();
                    break;
                case "GetSearchMemberById":
                    GetSearchMemberById();
                    break;                    
                case "ModifyMember":
                    ModifyMember();
                    break;
            }
        }

        /// <summary>
        /// 列出所有會員
        /// </summary>
        private void GetAllMember() {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingFG_getAllMember ", conn);
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
                        JObject memberInfo = new JObject();
                        memberInfo.Add("memberId", Convert.ToInt16(reader["f_id"]));
                        memberInfo.Add("idNumber", reader["f_idNumber"].ToString());
                        memberInfo.Add("lastname", reader["f_lastname"].ToString());
                        memberInfo.Add("firstname", reader["f_firstname"].ToString());
                        memberInfo.Add("gender", Convert.ToInt16(reader["f_gender"]));
                        memberInfo.Add("birth", reader["f_birthday"].ToString());
                        memberInfo.Add("pwd", reader["f_pwd"].ToString());
                        memberInfo.Add("mail", reader["f_mail"].ToString());
                        memberInfo.Add("phone", reader["f_phone"].ToString());
                        memberInfo.Add("address", reader["f_address"].ToString());
                        memberInfo.Add("points", Convert.ToInt32(reader["f_points"]));
                        memberInfo.Add("level", Convert.ToInt16(reader["f_level"]));
                        resultArray.Add(memberInfo);
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
        /// 刪除會員
        /// </summary>
        private void DeleteMember() {
            int apiMemberId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getMemberId"], out apiMemberId);
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingFG_deleteMember", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            if (idIsConvToInt)
            {
                try
                {
                    cmd.Parameters.Add(new SqlParameter("@memberId", apiMemberId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();
                    
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject memberInfo = new JObject();
                            memberInfo.Add("memberId", Convert.ToInt16(reader["f_id"]));
                            memberInfo.Add("idNumber", reader["f_idNumber"].ToString());
                            memberInfo.Add("lastname", reader["f_lastname"].ToString());
                            memberInfo.Add("firstname", reader["f_firstname"].ToString());
                            memberInfo.Add("gender", Convert.ToInt16(reader["f_gender"]));
                            memberInfo.Add("birth", reader["f_birthday"].ToString());
                            memberInfo.Add("pwd", reader["f_pwd"].ToString());
                            memberInfo.Add("mail", reader["f_mail"].ToString());
                            memberInfo.Add("phone", reader["f_phone"].ToString());
                            memberInfo.Add("address", reader["f_address"].ToString());
                            memberInfo.Add("points", Convert.ToInt32(reader["f_points"]));
                            memberInfo.Add("level", Convert.ToInt16(reader["f_level"]));
                            resultArray.Add(memberInfo);
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
        }

        /// <summary>
        /// 會員修改視窗中用來搜尋選中會員的資料
        /// </summary>
        private void GetSearchMemberById()
        {
            MsgType msgValue = MsgType.WrongConnect;
            int apiGetId = Int32.Parse((Request.Form["getMemberId"]));
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchMemberById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@memberId", apiGetId));
                SqlDataReader reader = cmd.ExecuteReader();
                JObject memberInfo = new JObject();
                //JArray resultArray = new JArray();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        memberInfo.Add("memberId", Convert.ToInt16(reader["f_id"]));
                        memberInfo.Add("idNumber", reader["f_idNumber"].ToString());
                        memberInfo.Add("lastname", reader["f_lastname"].ToString());
                        memberInfo.Add("firstname", reader["f_firstname"].ToString());
                        memberInfo.Add("gender", Convert.ToInt16(reader["f_gender"]));
                        memberInfo.Add("birth", reader["f_birthday"].ToString());
                        memberInfo.Add("pwd", reader["f_pwd"].ToString());
                        memberInfo.Add("mail", reader["f_mail"].ToString());
                        memberInfo.Add("phone", reader["f_phone"].ToString());
                        memberInfo.Add("address", reader["f_address"].ToString());
                        memberInfo.Add("points", Convert.ToInt32(reader["f_points"]));
                        memberInfo.Add("level", Convert.ToInt16(reader["f_level"]));
                        //resultArray.Add(memberInfo);
                    }
                    Response.Write(memberInfo);
                }
                else
                {
                    msgValue = MsgType.MemberNotExisted;
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

        /// <summary>
        /// 修改會員資料
        /// </summary>
        private void ModifyMember()
        {
            MsgType msgValue = MsgType.WrongConnection;
            string tel = Request.Form["getTel"];
            string pwd = Request.Form["getPwd"];
            string gender = Request.Form["getGender"];
            string lastName = Request.Form["getLastName"];
            string firstName = Request.Form["getFirstname"];
            string birth = Request.Form["getBirth"];
            string mail = Request.Form["getMail"];
            string address = Request.Form["getAddress"];
            int apiId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getId"], out apiId);
            int apiLevel = 0;
            bool levelIsConvToInt = int.TryParse(Request.Form["getLevel"], out apiLevel);
            int apiPoints = 0;
            bool pointsIsConvToInt = int.TryParse(Request.Form["getPoints"], out apiPoints);


            //空字串驗証
            if (string.IsNullOrEmpty(tel) || string.IsNullOrEmpty(pwd) || string.IsNullOrEmpty(gender)
                || string.IsNullOrEmpty(lastName) || string.IsNullOrEmpty(firstName)
                || string.IsNullOrEmpty(birth) || string.IsNullOrEmpty(mail))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else if (tel.Length != 10)
            {
                msgValue = MsgType.TelLengthIsNotRight;
                Response.Write((int)msgValue);
            }
            else if (pwd.Length < 8 && pwd.Length > 20)
            {
                msgValue = MsgType.PwdLengthIsNotRight;
                Response.Write((int)msgValue);
            }
            else if (lastName.Length > 20)
            {
                msgValue = MsgType.LastNameTooLong;
                Response.Write((int)msgValue);
            }
            else if (firstName.Length > 20)
            {
                msgValue = MsgType.FirstNameTooLong;
                Response.Write((int)msgValue);
            }
            else if (mail.Length > 40)
            {
                msgValue = MsgType.MailTooLong;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingFG_modifyMember", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@id", apiId));
                    cmd.Parameters.Add(new SqlParameter("@tel", tel));
                    cmd.Parameters.Add(new SqlParameter("@pwd", pwd));
                    cmd.Parameters.Add(new SqlParameter("@gender", gender));
                    cmd.Parameters.Add(new SqlParameter("@lastName", lastName));
                    cmd.Parameters.Add(new SqlParameter("@firstName", firstName));
                    cmd.Parameters.Add(new SqlParameter("@birth", birth));
                    cmd.Parameters.Add(new SqlParameter("@mail", mail));
                    cmd.Parameters.Add(new SqlParameter("@address", address));
                    cmd.Parameters.Add(new SqlParameter("@level", apiLevel));
                    cmd.Parameters.Add(new SqlParameter("@points", apiPoints));
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此會員帳號存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int result = Convert.ToInt16(reader["result"]);
                            msgValue = MsgType.MemberModified;
                           
                        }
                    }

                    Response.Write((int)msgValue);
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
}