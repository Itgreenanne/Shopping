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
    public partial class AddDuty : System.Web.UI.Page
    {
        public enum msgType
        {
            /// <summary>
            /// 新增成功
            /// </summary>
            wellAdded,
            /// <summary>
            /// 此職責已存在
            /// </summary>
            dutyExisted,
            /// <summary>
            /// 空字串或是所有選項都沒勾選
            /// </summary>
            nullEmptyInput
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            AddDutyVerify();
        }

        //新增職責到資料庫
        private void AddDutyVerify()
        {
            msgType msgValue = msgType.wellAdded;
            string apiGetDutyName = Request.Form["getDutyName"];
            string apiIfAddUser = Request.Form["ifAddUser"];
            string apiIfMangProduct = Request.Form["ifMangProduct"];
            string apiIfcanMangOrder = Request.Form["ifMangOrder"];
            string apiIfCustomerServe = Request.Form["ifCustomerServe"];

            if (string.IsNullOrEmpty(apiGetDutyName) ||
                (string.IsNullOrEmpty(apiIfAddUser) && string.IsNullOrEmpty(apiIfMangProduct) &&
                string.IsNullOrEmpty(apiIfcanMangOrder) && string.IsNullOrEmpty(apiIfCustomerServe)))
            {
                msgValue = msgType.nullEmptyInput;
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
                    cmd.Parameters.Add(new SqlParameter("@addUser", apiIfAddUser));
                    cmd.Parameters.Add(new SqlParameter("@mangProduct", apiIfMangProduct));
                    cmd.Parameters.Add(new SqlParameter("@mangOrder", apiIfcanMangOrder));
                    cmd.Parameters.Add(new SqlParameter("@customerServe", apiIfCustomerServe));
                    SqlDataReader reader = cmd.ExecuteReader();
                    
                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            string getDutyname = reader["f_name"].ToString();
                            if (getDutyname == apiGetDutyName)
                            {
                                msgValue = msgType.dutyExisted;
                                break;
                            } else {
                                msgValue = msgType.wellAdded;
                            }
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