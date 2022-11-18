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
using System.Globalization;

namespace ShoppingBG.ajax
{
    public partial class AjaxOrder : DutyAuthority
    {
        /// <summary>
        /// 各項驗証的訊息以及搜尋DB後要傳到前端的結果訊息
        /// </summary>
        public enum MsgType {
            /// <summary>
            /// 網路錯誤
            /// </summary>
            WrongConnect,
            /// <summary>
            /// 輸入是空字串
            /// </summary>
            NullEmptyInput,
            /// <summary>
            /// 輸入字串長度錯誤
            /// </summary>
            WrongInputLength,
            /// <summary>
            /// 訂單不存在
            /// </summary>
            OrderNotExisted,
            /// <summary>
            /// id不是整數型態
            /// </summary>
            IdIsNotInt,
            /// <summary>
            /// 產品細項不存在
            /// </summary>
            OrderItemNotExisted
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            string fnselected = Request.QueryString["fn"];
            switch (fnselected)
            {
                case "GetSearchOrderByIdNoOrOrderNo":
                    GetSearchOrderByIdNoOrOrderNo();
                    break;

                case "GetSearchOrderItemByOrderId":
                    GetSearchOrderItemByOrderId();
                    break;

                case "GetSearchOrderByDate":
                    GetSearchOrderByDate();
                    break;

                case "GetSearchOrderForMonth":
                    GetSearchOrderForMonth();
                    break;

                case "GetSearchOrderForYear":
                    GetSearchOrderForYear();
                    break;
            }
        }

        /// <summary>
        /// 用身份証字號或訂單編號搜尋訂單
        /// </summary>
        private void GetSearchOrderByIdNoOrOrderNo() {
            MsgType msgValue = MsgType.WrongConnect;
            string inputString = Request.Form["getString"];
            ///////string timeFormat = "yyyy/MM/dd HH:mm:ss";

            if (string.IsNullOrEmpty(inputString))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else if (inputString.Length != 10 && inputString.Length != 20)
            {
                msgValue = MsgType.WrongInputLength;
                Response.Write((int)msgValue);
            }
            else
            { 
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchOrderByIdNoOrOrderNo", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@input", inputString));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject orderInfo = new JObject();
                            orderInfo.Add("orderId", Convert.ToInt16(reader["f_id"]));
                            orderInfo.Add("orderNumber", reader["f_orderNumber"].ToString());
                            orderInfo.Add("totalPrice",Convert.ToInt32(reader["f_totalPrice"]));
                            orderInfo.Add("discount", Convert.ToInt32(reader["f_discount"]));
                            orderInfo.Add("payment", Convert.ToInt32(reader["f_payment"]));
                            orderInfo.Add("clientId", Convert.ToInt16(reader["f_clientId"]));
                            orderInfo.Add("idNumber", reader["f_idNumber"].ToString());
                            orderInfo.Add("lastname", reader["f_lastname"].ToString());
                            orderInfo.Add("firstname", reader["f_firstname"].ToString());
                            orderInfo.Add("gender", Convert.ToInt16(reader["f_gender"]));
                            orderInfo.Add("birth", reader["f_birthday"].ToString());
                            orderInfo.Add("mail", reader["f_mail"].ToString());
                            orderInfo.Add("phone", reader["f_phone"].ToString());
                            orderInfo.Add("address", reader["f_address"].ToString());
                            DateTime strTime = DateTime.Parse(reader["f_createTime"].ToString());                            
                            orderInfo.Add("createTime", String.Format("{0:yyyy/MM/dd HH:mm:ss}", strTime));
                            resultArray.Add(orderInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.OrderNotExisted;
                        Response.Write((int)msgValue);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    logger.Error(ex);
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
        }

        /// <summary>
        /// 使用orderId在訂單細項表格來尋找訂購的產品
        /// /// </summary>
        private void GetSearchOrderItemByOrderId() {
            MsgType msgValue = MsgType.WrongConnect;
            int apiOrderId = 0;
            bool orderIdIsInt = int.TryParse(Request.Form["getOrderId"], out apiOrderId);

            if (!orderIdIsInt)
            {
                msgValue = MsgType.IdIsNotInt;
                Response.Write((int)msgValue);
            }
            else {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchOrderItemByOrderId", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@orderId", apiOrderId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject orderItemInfo = new JObject();
                            orderItemInfo.Add("OrderItemId", Convert.ToInt16(reader["f_id"]));
                            orderItemInfo.Add("OrderId", Convert.ToInt32(reader["f_orderId"]));
                            orderItemInfo.Add("ProductId", Convert.ToInt32(reader["f_productId"]));
                            orderItemInfo.Add("ProductTitle",reader["f_productTitle"].ToString());
                            orderItemInfo.Add("QtnForBuy", Convert.ToInt32(reader["f_number"]));
                            orderItemInfo.Add("ProductUnitPrice", Convert.ToInt32(reader["f_unitPrice"]));                            
                            resultArray.Add(orderItemInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.OrderItemNotExisted;
                        Response.Write((int)msgValue);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    logger.Error(ex);
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }

        }

        /// <summary>
        /// 搜尋選擇期間的訂單資料
        /// </summary>
        private void GetSearchOrderByDate() {
            MsgType msgValue = MsgType.WrongConnect;
            string startDate = Request.Form["getStartDate"];
            string endDate = Request.Form["getEndDate"];
            if (string.IsNullOrEmpty(startDate) || string.IsNullOrEmpty(endDate))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getOrderByDate", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@startDate", startDate));
                    cmd.Parameters.Add(new SqlParameter("@endDate", endDate));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject orderInfo = new JObject();
                            orderInfo.Add("orderId", Convert.ToInt16(reader["f_id"]));
                            orderInfo.Add("orderNumber", reader["f_orderNumber"].ToString());
                            orderInfo.Add("totalPrice", Convert.ToInt32(reader["f_totalPrice"]));
                            orderInfo.Add("discount", Convert.ToInt32(reader["f_discount"]));
                            orderInfo.Add("payment", Convert.ToInt32(reader["f_payment"]));
                            orderInfo.Add("idNumber", reader["f_idNumber"].ToString());
                            DateTime strTime = DateTime.Parse(reader["f_createTime"].ToString());
                            orderInfo.Add("createTime", String.Format("{0:yyyy/MM/dd HH:mm:ss}", strTime));
                            resultArray.Add(orderInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.OrderNotExisted;
                        Response.Write((int)msgValue);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    logger.Error(ex);
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
        }

        /// <summary>
        /// 搜尋當月所有訂單 並以日為單位加總總價、折扣、付款金額
        ///</summary>
        private void GetSearchOrderForMonth()
        {
            MsgType msgValue = MsgType.WrongConnect;
            string startDate = Request.Form["getStartDate"];
            string endDate = Request.Form["getEndDate"];

            if (string.IsNullOrEmpty(startDate) || string.IsNullOrEmpty(endDate))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getOrderForMonth", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@startDate", startDate));
                    cmd.Parameters.Add(new SqlParameter("@endDate", endDate));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject orderInfo = new JObject();
                            orderInfo.Add("sumTotalPrice", Convert.ToInt32(reader["sumTotalPrice"]));
                            orderInfo.Add("sumDiscount", Convert.ToInt32(reader["sumDiscount"]));
                            orderInfo.Add("payment", Convert.ToInt32(reader["sumPayment"]));
                            DateTime strTime = DateTime.Parse(reader["rangeTime"].ToString());
                            orderInfo.Add("createTime", String.Format("{0:yyyy-MM-dd}", strTime));
                            orderInfo.Add("orderQtn", Convert.ToInt32(reader["orderQtn"]));
                            resultArray.Add(orderInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.OrderNotExisted;
                        Response.Write((int)msgValue);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    logger.Error(ex);
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
        }

        /// <summary>
        /// 或搜尋當年所有訂單，並月為單位加總總價、折扣、付款金額
        /// </summary>
        private void GetSearchOrderForYear() {
            MsgType msgValue = MsgType.WrongConnect;
            string startDate = Request.Form["getStartDate"];
            string endDate = Request.Form["getEndDate"];

            if (string.IsNullOrEmpty(startDate) || string.IsNullOrEmpty(endDate))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getOrderForYear", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@startDate", startDate));
                    cmd.Parameters.Add(new SqlParameter("@endDate", endDate));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject orderInfo = new JObject();
                            orderInfo.Add("sumTotalPrice", Convert.ToInt32(reader["sumTotalPrice"]));
                            orderInfo.Add("sumDiscount", Convert.ToInt32(reader["sumDiscount"]));
                            orderInfo.Add("payment", Convert.ToInt32(reader["sumPayment"]));
                            DateTime strTime = DateTime.Parse(reader["rangeTime"].ToString());
                            orderInfo.Add("createTime", String.Format("{0:yyyy-MM}", strTime));
                            orderInfo.Add("orderQtn", Convert.ToInt32(reader["orderQtn"]));
                            resultArray.Add(orderInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = MsgType.OrderNotExisted;
                        Response.Write((int)msgValue);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    logger.Error(ex);
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