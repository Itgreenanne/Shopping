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
            MemberNotExisted
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
                case "GetSearchDutyByIdNo":
                    GetSearchDutyByIdNo();
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
                        memberInfo.Add("points", Convert.ToInt16(reader["f_points"]));
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
                            memberInfo.Add("points", Convert.ToInt16(reader["f_points"]));
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
                        memberInfo.Add("points", Convert.ToInt16(reader["f_points"]));
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
        /// 用身份証字號搜尋會員
        /// </summary>
        private void GetSearchDutyByIdNo() {
            MsgType msgValue = MsgType.WrongConnect;
            string apiGetIdNo = Request.Form["getIdNo"];
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchMemberByIdNo", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@idNo", apiGetIdNo));
                SqlDataReader reader = cmd.ExecuteReader();
                JObject memberInfo = new JObject();
                JArray resultArray = new JArray();
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
                        memberInfo.Add("points", Convert.ToInt16(reader["f_points"]));
                        memberInfo.Add("level", Convert.ToInt16(reader["f_level"]));
                        resultArray.Add(memberInfo);
                    }
                    Response.Write(resultArray);
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
    }
}