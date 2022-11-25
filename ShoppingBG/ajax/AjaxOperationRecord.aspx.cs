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
using System.Collections;
using Newtonsoft.Json;
using ShoppingBG.app_code;
using NLog;

namespace ShoppingBG.ajax
{
    public partial class AjaxOperationRecord : DutyAuthority
    {
        public enum MsgType {
            /// <summary>
            /// 新增成功
            /// </summary>
            WellAdded,
            /// <summary>
            /// 操作種類沒被轉成整數
            /// </summary>
            FunctionTypeNotConInt,
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string fnSelected = Request.QueryString["fn"];
            switch (fnSelected)            
            {
                case "GetSearchAllOperationRecord":
                    GetSearchAllOperationRecord();
                    break;
                case "GetSearchOperationRecordByDate":
                    GetSearchOperationRecordByDate();
                    break;
                case "GetSearchOperationRecordByFunction":
                    GetSearchOperationRecordByFunction();
                    break;
            }

        }

        /// <summary>
        /// 搜尋所有操作紀錄資料
        /// </summary>
        private void GetSearchAllOperationRecord() 
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllOperationRecord", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此紀錄存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject recordInfo = new JObject();
                        recordInfo.Add("userAccount", reader["f_account"].ToString());
                        recordInfo.Add("type", Convert.ToInt16(reader["f_type"]));
                        recordInfo.Add("function", Convert.ToInt16(reader["f_function"]));
                        recordInfo.Add("before", reader["f_before"].ToString());
                        recordInfo.Add("after", reader["f_after"].ToString());                       
                        recordInfo.Add("createTime", String.Format("{0:yyyy/MM/dd HH:mm:ss}", DateTime.Parse(reader["f_createTime"].ToString())));
                        resultArray.Add(recordInfo);
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
        /// 搜尋起迄日間的操作紀錄資料
        /// </summary>
        private void GetSearchOperationRecordByDate()
        {
            string startDate = Request.Form["getStartDate"];
            string endDate = Request.Form["getEndDate"];
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getOperationRecordByDate", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@startDate", startDate));
                cmd.Parameters.Add(new SqlParameter("@endDate", endDate));
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此紀錄存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject recordInfo = new JObject();
                        recordInfo.Add("userAccount", reader["f_account"].ToString());
                        recordInfo.Add("type", Convert.ToInt16(reader["f_type"]));
                        recordInfo.Add("function", Convert.ToInt16(reader["f_function"]));
                        recordInfo.Add("before", reader["f_before"].ToString());
                        recordInfo.Add("after", reader["f_after"].ToString());
                        DateTime strTime = DateTime.Parse(reader["f_createTime"].ToString());
                        recordInfo.Add("createTime", String.Format("{0:yyyy/MM/dd HH:mm:ss}", strTime));
                        resultArray.Add(recordInfo);
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
        /// 以操作功能來搜尋操作紀錄
        /// </summary>
        private void GetSearchOperationRecordByFunction()
        {
            MsgType msgValue = MsgType.WellAdded;
            int functionType = 0;
            bool functionTypeIsConInt = int.TryParse(Request.Form["getFunctionType"], out functionType);

            if (!functionTypeIsConInt) {
                msgValue = MsgType.FunctionTypeNotConInt;
                Response.Write((int)msgValue);
            }
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getOperationRecordByFunction", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();
            
            try
            {
                cmd.Parameters.Add(new SqlParameter("@functionType", functionType));
                SqlDataReader reader = cmd.ExecuteReader();
                JArray resultArray = new JArray();

                //判斷是否有此紀錄存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        JObject recordInfo = new JObject();
                        recordInfo.Add("userAccount", reader["f_account"].ToString());
                        recordInfo.Add("type", Convert.ToInt16(reader["f_type"]));
                        recordInfo.Add("function", Convert.ToInt16(reader["f_function"]));
                        recordInfo.Add("before", reader["f_before"].ToString());
                        recordInfo.Add("after", reader["f_after"].ToString());
                        DateTime strTime = DateTime.Parse(reader["f_createTime"].ToString());
                        recordInfo.Add("createTime", String.Format("{0:yyyy/MM/dd HH:mm:ss}", strTime));
                        resultArray.Add(recordInfo);
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
            ExceptionAlert exp = new ExceptionAlert() {
                ErrorIndex = "error",
                ErrorMessage = message
            };            
            Response.Write(JsonConvert.SerializeObject(exp));
        }
    }
}