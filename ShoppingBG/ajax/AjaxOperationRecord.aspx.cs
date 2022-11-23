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

namespace ShoppingBG.ajax
{
    public partial class AjaxOperationRecord : DutyAuthority
    {
        WriteLog writeLog = new WriteLog();
        protected void Page_Load(object sender, EventArgs e)
        {
            string fnSelected = Request.QueryString["fn"];
            switch (fnSelected)            
            {
                case "GetSearchAllOperationRecord":
                    GetSearchAllOperationRecord();
                    break;
            }

        }

        /// <summary>
        /// 搜尋所有操作紀錄資料
        /// </summary>
        private void GetSearchAllOperationRecord() {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
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
                        recordInfo.Add("id", Convert.ToInt32(reader["f_id"]));
                        recordInfo.Add("dataId", Convert.ToInt32(reader["f_dataId"]));
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