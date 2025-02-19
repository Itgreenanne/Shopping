﻿using System;
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
using System.Diagnostics;
using NLog;


namespace ShoppingBG.ajax
{
     public partial class AjaxDuty : DutyAuthority
    {
        /// <summary>
        /// 新增職責訊息
        /// </summary>
        public enum MsgType
        {
            /// <summary>
            /// 新增成功
            /// </summary>
            WellAdded,
            /// <summary>
            /// 此職責已存在
            /// </summary>
            DutyExisted,
            /// <summary>
            /// 空字串或是所有選項都沒勾選
            /// </summary>
            NullEmptyInput,
            /// <summary>
            /// 字串長度超過限制
            /// </summary>
            ToolongString,
            /// <summary>
            /// 職責不存在
            /// </summary>
            DutyNotExisted,
            /// <summary>
            /// 職責修改成功
            /// </summary>
            DutyModified,
            /// <summary>
            /// 職責已有人員使用中
            /// </summary>
            DutyUsed,
            /// <summary>
            /// Exception
            /// </summary>
            Exception
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            //JObject aa = new JObject();
            string fnSelected = Request.QueryString["fn"];
            switch (fnSelected)
            {
                case "AddDutyVerify":
                    AddDutyVerify();
                    break;

                case "GetAllDuty":
                    GetAllDuty();
                    break;

                case "GetSearchDutyByNmae":
                    GetSearchDutyByNmae();
                    break;

                case "GetSearchDutyById":
                    GetSearchDutyById();
                    break;

                case "DeleteDuty":
                    DeleteDuty();
                    break;

                case "ModifyDuty":
                    ModifyDuty();
                    break;
            }
        }

        ///新增職責到資料庫
        private void AddDutyVerify()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            MsgType msgValue = MsgType.WellAdded;
            string apiGetDutyName = Request.Form["getDutyName"];
            bool apiMangDuty = Convert.ToBoolean(Request.Form["getMangDuty"]);
            bool apiMangUser = Convert.ToBoolean(Request.Form["getMangUser"]);
            bool apiMangProType = Convert.ToBoolean(Request.Form["getMangProType"]);
            bool apiMangProduct = Convert.ToBoolean(Request.Form["getMangProduct"]);
            bool apiMangMember = Convert.ToBoolean(Request.Form["getMangMember"]);
            bool apiMangOrder = Convert.ToBoolean(Request.Form["getMangOrder"]);
            bool apiMangRecord = Convert.ToBoolean(Request.Form["getMangRecord"]);


            //if (string.IsNullOrEmpty(apiGetDutyName) ||
            //    ((!apiMangDuty) && (apiMangUser == false) &&
            //    (apiMangProType == false) && (apiMangProduct == false) &&
            //    (apiMangOrder == false) && (apiMangRecord == false)))
            //{
            //空字串驗証
            if (string.IsNullOrEmpty(apiGetDutyName))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
                //字串長度驗証
            }
            else if (apiGetDutyName.Length > 20)
            {
                msgValue = MsgType.ToolongString;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_addDuty", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
                    cmd.Parameters.Add(new SqlParameter("@mangDuty", apiMangDuty));
                    cmd.Parameters.Add(new SqlParameter("@mangUser", apiMangUser));
                    cmd.Parameters.Add(new SqlParameter("@mangProType", apiMangProType));
                    cmd.Parameters.Add(new SqlParameter("@mangProduct", apiMangProduct));
                    cmd.Parameters.Add(new SqlParameter("@mangMember", apiMangMember));
                    cmd.Parameters.Add(new SqlParameter("@mangOrder", apiMangOrder));
                    cmd.Parameters.Add(new SqlParameter("@mangRecord", apiMangRecord));
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此職責存在
                    //if (reader.HasRows)
                    //{
                        while (reader.Read())
                        {
                            int result = Convert.ToInt16(reader["result"]);
                            if (result == 0)
                            {
                                msgValue = MsgType.DutyExisted;
                                break;
                            }
                            else
                            {
                                msgValue = MsgType.WellAdded;
                            }
                        }
                    //}

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

        /////新增職責到資料庫
        //private void AddDutyVerify()
        //{
        //    MsgType msgValue = MsgType.WellAdded;
        //    string apiGetDutyName = Request.Form["getDutyName"];
        //    bool apiMangDuty = Convert.ToBoolean(Request.Form["getMangDuty"]);
        //    bool apiMangUser = Convert.ToBoolean(Request.Form["getMangUser"]);
        //    bool apiMangProType = Convert.ToBoolean(Request.Form["getMangProType"]);
        //    bool apiMangProduct = Convert.ToBoolean(Request.Form["getMangProduct"]);
        //    bool apiMangOrder = Convert.ToBoolean(Request.Form["getMangOrder"]);
        //    bool apiMangRecord = Convert.ToBoolean(Request.Form["getMangRecord"]);


        //    //if (string.IsNullOrEmpty(apiGetDutyName) ||
        //    //    ((!apiMangDuty) && (apiMangUser == false) &&
        //    //    (apiMangProType == false) && (apiMangProduct == false) &&
        //    //    (apiMangOrder == false) && (apiMangRecord == false)))
        //    //{
        //    //空字串驗証
        //    if (string.IsNullOrEmpty(apiGetDutyName))
        //    {
        //        msgValue = MsgType.NullEmptyInput;
        //        Response.Write((int)msgValue);
        //        //字串長度驗証
        //    }
        //    else if (apiGetDutyName.Length > 20)
        //    {
        //        msgValue = MsgType.ToolongString;
        //        Response.Write((int)msgValue);
        //    }
        //    else
        //    {
        //        string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
        //        SqlConnection conn = new SqlConnection(strConnString);
        //        SqlCommand cmd = new SqlCommand("pro_shoppingBG_addDuty", conn);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        conn.Open();

        //        try
        //        {
        //            cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
        //            cmd.Parameters.Add(new SqlParameter("@mangDuty", apiMangDuty));
        //            cmd.Parameters.Add(new SqlParameter("@mangUser", apiMangUser));
        //            cmd.Parameters.Add(new SqlParameter("@mangProType", apiMangProType));
        //            cmd.Parameters.Add(new SqlParameter("@mangProduct", apiMangProduct));
        //            cmd.Parameters.Add(new SqlParameter("@mangOrder", apiMangOrder));
        //            cmd.Parameters.Add(new SqlParameter("@mangRecord", apiMangRecord));
        //            SqlDataReader reader = cmd.ExecuteReader();

        //            //判斷是否有此職責存在
        //            if (reader.HasRows)
        //            {
        //                while (reader.Read())
        //                {
        //                    int result = Convert.ToInt16(reader["result"]);
        //                    if (result == 0)
        //                    {
        //                        msgValue = MsgType.DutyExisted;
        //                        break;
        //                    }
        //                    else
        //                    {
        //                        msgValue = MsgType.WellAdded;
        //                    }
        //                }
        //            }

        //            Response.Write((int)msgValue);
        //        }
        //        catch (Exception ex)
        //        {
        //            Console.WriteLine(ex);
        //            logger.Error(ex);
        //            throw ex.GetBaseException();
        //        }
        //        finally
        //        {
        //            conn.Close();
        //            conn.Dispose();
        //        }
        //    }
        //}

        /// <summary>
        /// 從資料庫讀取全部職責資料
        /// </summary>
        private void GetAllDuty()
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllDuty", conn);
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
                        dutyinfo.Add("dutyId", Convert.ToInt16(reader["f_id"]));
                        dutyinfo.Add("dutyName", reader["f_name"].ToString());
                        dutyinfo.Add("mangDuty", Convert.ToInt16(reader["f_manageDuty"]));
                        dutyinfo.Add("mangUser", Convert.ToInt16(reader["f_manageUser"]));
                        dutyinfo.Add("mangProType", Convert.ToInt16(reader["f_manageProductType"]));
                        dutyinfo.Add("mangProduct", Convert.ToInt16(reader["f_manageProduct"]));
                        dutyinfo.Add("mangMember", Convert.ToInt16(reader["f_manageMember"]));
                        dutyinfo.Add("mangOrder", Convert.ToInt16(reader["f_manageOrder"]));
                        dutyinfo.Add("mangRecord", Convert.ToInt16(reader["f_manageRecord"]));
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
        /// 查詢並讀取輸入職責
        /// </summary>
        private void GetSearchDutyByNmae()
        {
            MsgType msgValue = MsgType.WellAdded;
            string apiGetDutyName = Request.Form["getDutyName"];

            if (string.IsNullOrEmpty(apiGetDutyName))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchDutyByName ", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject dutyinfo = new JObject();
                            dutyinfo.Add("dutyId",Convert.ToInt16(reader["f_id"]));
                            dutyinfo.Add("dutyName", reader["f_name"].ToString());
                            dutyinfo.Add("mangDuty", Convert.ToInt16(reader["f_manageDuty"]));
                            dutyinfo.Add("mangUser", Convert.ToInt16(reader["f_manageUser"]));
                            dutyinfo.Add("mangProType", Convert.ToInt16(reader["f_manageProductType"]));
                            dutyinfo.Add("mangProduct", Convert.ToInt16(reader["f_manageProduct"]));
                            dutyinfo.Add("mangMember", Convert.ToInt16(reader["f_manageMember"]));
                            dutyinfo.Add("mangOrder", Convert.ToInt16(reader["f_manageOrder"]));
                            dutyinfo.Add("mangRecord", Convert.ToInt16(reader["f_manageRecord"]));
                            resultArray.Add(dutyinfo);
                        }
                        Response.Write(resultArray);
                    }
                    //DutyInfo dutyinfo = new DutyInfo();
                    //JObject dutyResult = new JObject();

                    ////判斷是否有此職責存在
                    //if (reader.HasRows)
                    //{
                    //    while (reader.Read()) {                            
                    //        dutyinfo.DutyName = reader["f_name"].ToString();
                    //        dutyinfo.MangDuty = Convert.ToInt16(reader["f_manageDuty"]);
                    //        dutyinfo.MangUser = Convert.ToInt16(reader["f_manageUser"]);
                    //        dutyinfo.MangProType = Convert.ToInt16(reader["f_manageProductType"]);
                    //        dutyinfo.MangProduct = Convert.ToInt16(reader["f_manageProduct"]);
                    //        dutyinfo.MangOrder = Convert.ToInt16(reader["f_manageOrder"]);
                    //        dutyinfo.MangRecord = Convert.ToInt16(reader["f_manageRecord"]);
                    //        dutyResult.Add("dutyName", dutyinfo.DutyName);
                    //        dutyResult.Add("mangDuty", dutyinfo.MangDuty);
                    //        dutyResult.Add("mangUser", dutyinfo.MangUser);
                    //        dutyResult.Add("mangProType", dutyinfo.MangProType);
                    //        dutyResult.Add("mangProduct", dutyinfo.MangProduct);
                    //        dutyResult.Add("mangOrder", dutyinfo.MangOrder);
                    //        dutyResult.Add("mangRecord", dutyinfo.MangRecord);                            
                    //    }

                    else
                    {
                        msgValue = MsgType.DutyNotExisted;
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

        private void GetSearchDutyById()
        {
            MsgType msgValue = MsgType.WellAdded;
            int apiGetId = Int32.Parse((Request.Form["getDutyId"]));
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchDutyById", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@dutyId", apiGetId));
                SqlDataReader reader = cmd.ExecuteReader();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    JObject dutyInfo = new JObject();

                    while (reader.Read())
                    {
                        dutyInfo.Add("dutyId", Convert.ToInt16(reader["f_id"]));
                        dutyInfo.Add("dutyName", reader["f_name"].ToString());
                        dutyInfo.Add("mangDuty", Convert.ToInt16(reader["f_manageDuty"]));
                        dutyInfo.Add("mangUser", Convert.ToInt16(reader["f_manageUser"]));
                        dutyInfo.Add("mangProType", Convert.ToInt16(reader["f_manageProductType"]));
                        dutyInfo.Add("mangProduct", Convert.ToInt16(reader["f_manageProduct"]));
                        dutyInfo.Add("mangMember", Convert.ToInt16(reader["f_manageMember"]));
                        dutyInfo.Add("mangOrder", Convert.ToInt16(reader["f_manageOrder"]));
                        dutyInfo.Add("mangRecord", Convert.ToInt16(reader["f_manageRecord"]));
                    }

                    Response.Write(dutyInfo);                
                }
                else
                {
                    msgValue = MsgType.DutyNotExisted;
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

        /// <summary>
        /// 刪除職責
        /// </summary>
        private void DeleteDuty()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            MsgType msgValue = MsgType.WellAdded;
            int apiGetId = Int32.Parse((Request.Form["getDutyId"]));
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_delDuty ", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            try
            {
                cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                cmd.Parameters.Add(new SqlParameter("@dutyId", apiGetId));
                SqlDataReader reader = cmd.ExecuteReader();
                //JArray resultArray = new JArray();
                DeleteDutyResult deleteDutyResult = new DeleteDutyResult();
                List<DutyInfo> dutyInfoResult = new List<DutyInfo>();

                //判斷是否有此職責存在
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        int result = Convert.ToInt16(reader["result"]);

                        if (result == 0)
                        {
                            //JObject dutyinfo = new JObject();
                            //dutyinfo.Add("dutyId", Convert.ToInt16(reader["f_id"]));
                            //dutyinfo.Add("dutyName", reader["f_name"].ToString());
                            //dutyinfo.Add("mangDuty", Convert.ToInt16(reader["f_manageDuty"]));
                            //dutyinfo.Add("mangUser", Convert.ToInt16(reader["f_manageUser"]));
                            //dutyinfo.Add("mangProType", Convert.ToInt16(reader["f_manageProductType"]));
                            //dutyinfo.Add("mangProduct", Convert.ToInt16(reader["f_manageProduct"]));
                            //dutyinfo.Add("mangOrder", Convert.ToInt16(reader["f_manageOrder"]));
                            //dutyinfo.Add("mangRecord", Convert.ToInt16(reader["f_manageRecord"]));
                            //resultArray.Add(dutyinfo);
                            DutyInfo dutyInfo = new DutyInfo()
                            {
                                dutyName = reader["f_name"].ToString(),
                                mangDuty = Convert.ToInt16(reader["f_manageDuty"]),
                                mangOrder = Convert.ToInt16(reader["f_manageOrder"]),
                                mangMember = Convert.ToInt16(reader["f_manageMember"]),
                                mangProduct = Convert.ToInt16(reader["f_manageProduct"]),
                                mangProType = Convert.ToInt16(reader["f_manageProductType"]),
                                mangRecord = Convert.ToInt16(reader["f_manageRecord"]),
                                mangUser = Convert.ToInt16(reader["f_manageUser"]),
                                dutyId= Convert.ToInt16(reader["f_id"])
                            };
                            dutyInfoResult.Add(dutyInfo);
                        }
                        else if (result == 1)
                        {
                            msgValue = MsgType.DutyUsed;
                            deleteDutyResult.Result = (int)msgValue;
                            break;
                        }
                    }
                    deleteDutyResult.DutyArray = dutyInfoResult;
                    Response.Write(JsonConvert.SerializeObject(deleteDutyResult));
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

        /// <summary>
        /// 修改職責
        /// </summary>
        private void ModifyDuty()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            MsgType msgValue = MsgType.WellAdded;
            int apiGetId= Int32.Parse((Request.Form["getDutyId"]));
            string apiGetDutyName = Request.Form["getDutyName"];
            bool apiMangDuty = Convert.ToBoolean(Request.Form["getMangDuty"]);
            bool apiMangUser = Convert.ToBoolean(Request.Form["getMangUser"]);
            bool apiMangProType = Convert.ToBoolean(Request.Form["getMangProType"]);
            bool apiMangProduct = Convert.ToBoolean(Request.Form["getMangProduct"]);
            bool apiMangMember = Convert.ToBoolean(Request.Form["getMangMember"]);
            bool apiMangOrder = Convert.ToBoolean(Request.Form["getMangOrder"]);
            bool apiMangRecord = Convert.ToBoolean(Request.Form["getMangRecord"]);          

            //空字串驗証
            if (string.IsNullOrEmpty(apiGetDutyName))
            {
                msgValue = MsgType.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else if (apiGetDutyName.Length > 20)
            {
                msgValue = MsgType.ToolongString;
                Response.Write((int)msgValue);
            }
            else
            { 
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_modifyDuty", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@dutyId", apiGetId));
                    cmd.Parameters.Add(new SqlParameter("@dutyName", apiGetDutyName));
                    cmd.Parameters.Add(new SqlParameter("@mangDuty", apiMangDuty));
                    cmd.Parameters.Add(new SqlParameter("@mangUser", apiMangUser));
                    cmd.Parameters.Add(new SqlParameter("@mangProType", apiMangProType));
                    cmd.Parameters.Add(new SqlParameter("@mangProduct", apiMangProduct));
                    cmd.Parameters.Add(new SqlParameter("@mangMember", apiMangMember));
                    cmd.Parameters.Add(new SqlParameter("@mangOrder", apiMangOrder));
                    cmd.Parameters.Add(new SqlParameter("@mangRecord", apiMangRecord));                    
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int result = Convert.ToInt16(reader["result"]);
                            if (result == 0)
                            {
                                msgValue = MsgType.DutyExisted;
                                break;                                
                            }
                            else
                            {
                                msgValue = MsgType.DutyModified;
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


//JObject newDutyInfo = new JObject();
//JObject afterObj = new JObject();
//JObject beforeObj = new JObject();
//newDutyInfo.Add("dutyName", apiGetDutyName);
//newDutyInfo.Add("mangDuty", Convert.ToInt16(apiMangDuty));
//newDutyInfo.Add("mangUser", Convert.ToInt16(apiMangUser));
//newDutyInfo.Add("mangProType", Convert.ToInt16(apiMangProType));
//newDutyInfo.Add("mangProduct", Convert.ToInt16(apiMangProduct));
//newDutyInfo.Add("mangOrder", Convert.ToInt16(apiMangOrder));
//newDutyInfo.Add("mangRecord", Convert.ToInt16(apiMangRecord));

////get 
//IEnumerator<KeyValuePair<String, JToken>> oldObjEnum = oldDutyInfo.GetEnumerator();
//IEnumerator<KeyValuePair<String, JToken>> newObjEnum = newDutyInfo.GetEnumerator();

//while (oldObjEnum.MoveNext())
//{
//    KeyValuePair<String, JToken> pair = oldObjEnum.Current;
//    //暫時的value存在jt
//    JToken jt;

//    if (newDutyInfo.TryGetValue(pair.Key, out jt))
//    {
//        JTokenEqualityComparer cmp = new JTokenEqualityComparer();
//        JToken oldItem = oldDutyInfo.GetValue(pair.Key);
//        JToken newItem = newDutyInfo.GetValue(pair.Key);

//        if (cmp.GetHashCode(oldItem) != cmp.GetHashCode(newItem))
//        {
//            afterObj.Add(pair.Key, newItem);
//            beforeObj.Add(pair.Key, oldItem);
//        }
//    }
//}

//Debug.WriteLine("old = " + oldDutyInfo);
//Debug.WriteLine("new = " + newDutyInfo);
//Debug.WriteLine("result = " + afterObj);
//Debug.WriteLine("result = " + beforeObj);