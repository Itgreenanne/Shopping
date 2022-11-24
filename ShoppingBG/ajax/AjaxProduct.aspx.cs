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


namespace ShoppingBG.ajax
{
    public partial class AjaxProduct : DutyAuthority
    {
        public static JObject oldProductInfo = new JObject();
        WriteLog writeLog = new WriteLog();
        public enum ProductMsg
        {
            /// <summary>
            /// 網路錯誤
            /// </summary>
            WrongConnection,
            /// <summary>
            /// 沒有任何輸入
            /// </summary>
            NullEmptyInput,
            /// <summary>
            /// 標題字串太長
            /// </summary>
            TitleToolongString,
            /// <summary>
            /// 詳情字串太長
            /// </summary>
            DetailToolongString,
            /// <summary>
            /// 單價不是int型式或>0
            /// </summary>
            PriceIsNotIntOrPositive,
            /// <summary>
            /// 數量不是int型式或 >= 0
            /// </summary>
            QtnIsNotIntOrPositive,
            /// <summary>
            /// 產品類別不是int型式
            /// </summary>
            IdIsNotConvToInt,
            /// <summary>
            /// 產品id不是int型式
            /// </summary>
            ProductIdIsNotConvToInt,
            /// <summary>
            /// 產品已新增
            /// </summary>
            WellAdded,
            /// <summary>
            /// 產品不存在
            /// </summary>
            ProductNotExisted,
            /// <summary>
            /// 產品資料已被修改
            /// </summary>
            ProductModified
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            string fnselected = Request.QueryString["fn"];
            switch (fnselected)
            {
                case "ProductTypeMenu":
                    ProductTypeMenu();
                    break;

                case "AddProduct":
                    AddProduct();
                    break;

                case "GetAllProduct":
                    GetAllProduct();
                    break;

                case "GetSearchProduct":
                    GetSearchProduct();
                    break;

                case "DeleteProduct":
                    DeleteProduct();
                    break;

                case "GetSearchProductById":
                    GetSearchProductById();
                    break;

                case "ModifyProduct":
                    ModifyProduct();
                    break;
            }
        }

        /// <summary>
        /// 從DB讀取全部職責名稱到下拉選單
        /// </summary>
        private void ProductTypeMenu()
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllProType ", conn);
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
                        JObject productInfo = new JObject();
                        productInfo.Add("ProTypeId", Convert.ToInt16(reader["f_id"]));
                        productInfo.Add("ProTypeName", reader["f_name"].ToString());
                        resultArray.Add(productInfo);
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

        /// <summary>
        /// 產品新增
        /// </summary>
        private void AddProduct()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            ProductMsg msgValue = ProductMsg.WrongConnection;
            string apiProductPic = Request.Form["getProductPic"];
            string apiProductTitle = Request.Form["getProductTitle"];
            string unitPrice = Request.Form["getUnitPrice"];
            int apiUnitPrice = 0;
            bool priceIsConvToInt = int.TryParse(Request.Form["getUnitPrice"], out apiUnitPrice);
            string qtn = Request.Form["getInventoryQtn"];
            int apiInventoryQtn = 0;
            bool qtnIsConvToInt = int.TryParse(Request.Form["getInventoryQtn"], out apiInventoryQtn);
            string proType = Request.Form["getProType"];
            int apiProductTypeId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getProType"], out apiProductTypeId);
            string apiProductDetail = Request.Form["getProductDetail"].ToString();


            ///空字串驗証
            if (string.IsNullOrEmpty(apiProductPic) || string.IsNullOrEmpty(apiProductTitle) || string.IsNullOrEmpty(unitPrice) ||
                string.IsNullOrEmpty(qtn) || string.IsNullOrEmpty(proType) ||
                string.IsNullOrEmpty(apiProductDetail))
            {
                msgValue = ProductMsg.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else if (apiProductTitle.Length > 100)
            {
                msgValue = ProductMsg.TitleToolongString;
                Response.Write((int)msgValue);
            }
            else if (apiProductDetail.Length > 3000)
            {
                msgValue = ProductMsg.DetailToolongString;
                Response.Write((int)msgValue);
            }
            else if (!priceIsConvToInt || apiUnitPrice <= 0)
            {
                msgValue = ProductMsg.PriceIsNotIntOrPositive;
                Response.Write((int)msgValue);
            }
            else if (!qtnIsConvToInt || apiInventoryQtn < 0)
            {
                msgValue = ProductMsg.QtnIsNotIntOrPositive;
                Response.Write((int)msgValue);
            }
            else if (!idIsConvToInt)
            {
                msgValue = ProductMsg.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["ShoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_addProduct", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@productPic", apiProductPic));
                    cmd.Parameters.Add(new SqlParameter("@productTitle", apiProductTitle));
                    cmd.Parameters.Add(new SqlParameter("@unitPrice", apiUnitPrice));
                    cmd.Parameters.Add(new SqlParameter("@qtn", apiInventoryQtn));
                    cmd.Parameters.Add(new SqlParameter("@productTypeId", apiProductTypeId));
                    cmd.Parameters.Add(new SqlParameter("@detail", apiProductDetail));
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int result = Convert.ToInt16(reader["result"]);
                            msgValue = ProductMsg.WellAdded;
                        }
                        Response.Write((int)msgValue);
                    }
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

        /// <summary>
        /// 產品查詢
        ///</summary>
        private void GetAllProduct()
        {
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_getAllProduct", conn);
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
                ///讀取產品類別表格
                dt = ds.Tables[0];
                ProductTypeCombo productTypeCombo = new ProductTypeCombo();
                List<ProductTypeInfo> productTypeArray = new List<ProductTypeInfo>();
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow row = dt.Rows[i];
                    ProductTypeInfo productTypeInfo = new ProductTypeInfo()
                    {
                        ProTypeId = Convert.ToInt16(row.ItemArray[0]),
                        ProTypeName = row.ItemArray[1].ToString()
                    };
                    productTypeArray.Add(productTypeInfo);
                }
                ///讀取產品表格
                dt = ds.Tables[1];
                List<ProductInfo> productInfoArray = new List<ProductInfo>();

                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    DataRow row = dt.Rows[i];
                    ProductInfo productInfo = new ProductInfo()
                    {
                        ProductId = Convert.ToInt16(row.ItemArray[0]),
                        ProductPic = row.ItemArray[1].ToString(),
                        ProductTitle = row.ItemArray[2].ToString(),
                        ProductUnitPrice = Convert.ToInt32(row.ItemArray[3]),
                        ProductQtn = Convert.ToInt16(row.ItemArray[4]),
                        ProductTypeId = Convert.ToInt16(row.ItemArray[5]),
                        ProductDetail = row.ItemArray[6].ToString(),
                        ProductTypeName = row.ItemArray[7].ToString()
                    };
                    productInfoArray.Add(productInfo);
                }
                productTypeCombo.ProductTypeArray = productTypeArray;
                productTypeCombo.ProductInfoArray = productInfoArray;
                Response.Write(JsonConvert.SerializeObject(productTypeCombo));
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

        private void GetSearchProduct()
        {
            ProductMsg msgValue = ProductMsg.WrongConnection;
            string apiProductTitle = Request.Form["getProductTitle"];
            int apiProTypeId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getTypeId"], out apiProTypeId);

            if (string.IsNullOrEmpty(apiProductTitle) && apiProTypeId == 0)
            {
                msgValue = ProductMsg.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            //字串長度驗証
            else if (apiProductTitle.Length > 100)
            {
                msgValue = ProductMsg.TitleToolongString;
                Response.Write((int)msgValue);
            }
            else if (!idIsConvToInt)
            {
                msgValue = ProductMsg.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchProduct", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    //if(!string.IsNullOrEmpty(apiUserAccount) && apiDutyId != 0)
                    cmd.Parameters.Add(new SqlParameter("@productTitle", apiProductTitle));
                    cmd.Parameters.Add(new SqlParameter("@proTypeId", apiProTypeId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject productInfo = new JObject();
                            productInfo.Add("ProductId", Convert.ToInt16(reader["f_id"]));
                            productInfo.Add("ProductPic", reader["f_picturePath"].ToString());
                            productInfo.Add("ProductTitle", reader["f_title"].ToString());
                            productInfo.Add("ProductUnitPrice", Convert.ToInt32(reader["f_unitprice"]));
                            productInfo.Add("ProductQtn", Convert.ToInt16(reader["f_quantity"]));
                            productInfo.Add("ProductTypeId", Convert.ToInt16(reader["f_typeId"]));
                            productInfo.Add("ProductDetail", reader["f_detail"].ToString());
                            productInfo.Add("ProductTypeName", reader["f_name"].ToString());
                            resultArray.Add(productInfo);
                        }
                        Response.Write(resultArray);
                    }
                    else
                    {
                        msgValue = ProductMsg.ProductNotExisted;
                        Response.Write((int)msgValue);
                    }
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

        /// <summary>
        /// 刪除產品
        /// </summary>
        protected void DeleteProduct()
        {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            ProductMsg msgValue = ProductMsg.WellAdded;
            int apiProductId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getProductId"], out apiProductId);
            string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
            SqlConnection conn = new SqlConnection(strConnString);
            SqlCommand cmd = new SqlCommand("pro_shoppingBG_delProduct", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            conn.Open();

            if (idIsConvToInt)
            {
                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@productId", apiProductId));
                    SqlDataReader reader = cmd.ExecuteReader();
                    JArray resultArray = new JArray();

                    //判斷是否有此職責存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            JObject productInfo = new JObject();
                            productInfo.Add("ProductId", Convert.ToInt16(reader["f_id"]));
                            productInfo.Add("ProductPic", reader["f_picturePath"].ToString());
                            productInfo.Add("ProductTitle", reader["f_title"].ToString());
                            productInfo.Add("ProductUnitPrice", Convert.ToInt32(reader["f_unitprice"]));
                            productInfo.Add("ProductQtn", Convert.ToInt16(reader["f_quantity"]));
                            productInfo.Add("ProductTypeId", Convert.ToInt16(reader["f_typeId"]));
                            productInfo.Add("ProductDetail", reader["f_detail"].ToString());
                            productInfo.Add("ProductTypeName", reader["f_name"].ToString());
                            resultArray.Add(productInfo);
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
            else
            {
                msgValue = ProductMsg.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
        }

        /// <summary>
        /// 產品修改視窗中用來搜尋選中產品的資料
        /// </summary>
        protected void GetSearchProductById() {
            ProductMsg msgValue = ProductMsg.WrongConnection;
            int apiProductId = 0;
            bool idIsConvToInt = int.TryParse(Request.Form["getProductId"], out apiProductId);

            if (!idIsConvToInt)
            {
                msgValue = ProductMsg.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_getSearchProductById", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@productId", apiProductId));
                    //從Command取得資料存入dataAdapter
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    //創一個dataset的記憶體資料集
                    DataSet ds = new DataSet();
                    //將dataAdapter資料存入dataset
                    adapter.Fill(ds);
                    DataTable dt = new DataTable();
                    ///讀取產品類別表格
                    dt = ds.Tables[0];
                    ProductTypeCombo productTypeCombo = new ProductTypeCombo();
                    List<ProductTypeInfo> productTypeArray = new List<ProductTypeInfo>();
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow row = dt.Rows[i];
                        ProductTypeInfo productTypeInfo = new ProductTypeInfo()
                        {
                            ProTypeId = Convert.ToInt16(row.ItemArray[0]),
                            ProTypeName = row.ItemArray[1].ToString()
                        };
                        productTypeArray.Add(productTypeInfo);
                    }
                    ///讀取產品表格
                    dt = ds.Tables[1];
                    List<ProductInfo> productInfoArray = new List<ProductInfo>();
                    JObject productData = new JObject();
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        DataRow row = dt.Rows[i];
                        ProductInfo productInfo = new ProductInfo()
                        {
                            ProductId = Convert.ToInt16(row.ItemArray[0]),
                            ProductPic = row.ItemArray[1].ToString(),
                            ProductTitle = row.ItemArray[2].ToString(),
                            ProductUnitPrice = Convert.ToInt32(row.ItemArray[3]),
                            ProductQtn = Convert.ToInt16(row.ItemArray[4]),
                            ProductTypeId = Convert.ToInt16(row.ItemArray[5]),
                            ProductDetail = row.ItemArray[6].ToString(),
                            ProductTypeName = row.ItemArray[7].ToString()
                        };
                        productInfoArray.Add(productInfo);
                        productData.Add("productPic", row.ItemArray[1].ToString());
                        productData.Add("productTitle", row.ItemArray[2].ToString());
                        productData.Add("productUnitPrice", Convert.ToInt32(row.ItemArray[3]));
                        productData.Add("productQtn", Convert.ToInt16(row.ItemArray[4]));
                        productData.Add("productDetail", row.ItemArray[6].ToString());
                        productData.Add("productTypeName", row.ItemArray[7].ToString());
                    }
                    productTypeCombo.ProductTypeArray = productTypeArray;
                    productTypeCombo.ProductInfoArray = productInfoArray;
                    oldProductInfo = productData;
                    Response.Write(JsonConvert.SerializeObject(productTypeCombo));
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

        /// <summary>
        /// 將產品修改資料存入DB
        /// </summary>
        protected void ModifyProduct() {
            UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;
            ProductMsg msgValue = ProductMsg.WrongConnection;
            string productId = Request.Form["getProductId"];
            int apiProductId = 0;
            bool productIdIsConvToInt = int.TryParse(Request.Form["getProductId"], out apiProductId);
            string apiProductPicPath = Request.Form["getProductPicPath"];
            string apiProductTitle = Request.Form["getProductTitle"];
            int apiUnitPrice = 0;
            bool priceIsConvToInt = int.TryParse(Request.Form["getUnitPrice"], out apiUnitPrice);
            int apiInventoryQtn = 0;
            bool qtnIsConvToInt = int.TryParse(Request.Form["getInventoryQtn"], out apiInventoryQtn);
            string proTypeName = Request.Form["getProTypeName"];
            int apiProductTypeId = 0;
            bool typeIdIsConvToInt = int.TryParse(Request.Form["getProType"], out apiProductTypeId);
            string apiProductDetail = Request.Form["getProductDetail"].ToString();


            ///空字串驗証
            if (string.IsNullOrEmpty(apiProductTitle) || string.IsNullOrEmpty(proTypeName) ||
                string.IsNullOrEmpty(apiProductDetail))
            {
                msgValue = ProductMsg.NullEmptyInput;
                Response.Write((int)msgValue);
            }
            else if (apiProductTitle.Length > 100)
            {
                msgValue = ProductMsg.TitleToolongString;
                Response.Write((int)msgValue);
            }
            else if (apiProductDetail.Length > 3000)
            {
                msgValue = ProductMsg.DetailToolongString;
                Response.Write((int)msgValue);
            }
            else if (!priceIsConvToInt || apiUnitPrice <= 0)
            {
                msgValue = ProductMsg.PriceIsNotIntOrPositive;
                Response.Write((int)msgValue);
            }
            else if (!qtnIsConvToInt || apiInventoryQtn < 0)
            {
                msgValue = ProductMsg.QtnIsNotIntOrPositive;
                Response.Write((int)msgValue);
            }
            else if (!productIdIsConvToInt)
            {
                msgValue = ProductMsg.ProductIdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else if (!typeIdIsConvToInt)
            {
                msgValue = ProductMsg.IdIsNotConvToInt;
                Response.Write((int)msgValue);
            }
            else
            {
                JObject newproductInfo = new JObject();
                JObject afterObj = new JObject();
                JObject beforeObj = new JObject();
                newproductInfo.Add("productPic", apiProductPicPath);
                newproductInfo.Add("productTitle", apiProductTitle);
                newproductInfo.Add("productUnitPrice", apiUnitPrice);
                newproductInfo.Add("productQtn", apiInventoryQtn);
                newproductInfo.Add("productDetail", apiProductDetail);
                newproductInfo.Add("productTypeName", proTypeName);
                IEnumerator<KeyValuePair<String, JToken>> oldObjEnum = oldProductInfo.GetEnumerator();
                IEnumerator<KeyValuePair<String, JToken>> newObjEnum = newproductInfo.GetEnumerator();

                while (oldObjEnum.MoveNext())
                {
                    KeyValuePair<String, JToken> pair = oldObjEnum.Current;
                    JToken jt;

                    if (newproductInfo.TryGetValue(pair.Key, out jt))
                    {
                        JTokenEqualityComparer cmp = new JTokenEqualityComparer();
                        JToken oldItem = oldProductInfo.GetValue(pair.Key);
                        JToken newItem = newproductInfo.GetValue(pair.Key);

                        if (cmp.GetHashCode(oldItem) != cmp.GetHashCode(newItem))
                        {
                            Console.WriteLine("add " + pair.Key + ": " + newItem + " to result.");
                            afterObj.Add(pair.Key, newItem);
                            beforeObj.Add(pair.Key, oldItem);
                        }
                    }
                }

                Debug.WriteLine("old = " + oldProductInfo);
                Debug.WriteLine("new = " + newproductInfo);
                Debug.WriteLine("result = " + afterObj);
                Debug.WriteLine("result = " + beforeObj);

                string strConnString = WebConfigurationManager.ConnectionStrings["shoppingBG"].ConnectionString;
                SqlConnection conn = new SqlConnection(strConnString);
                SqlCommand cmd = new SqlCommand("pro_shoppingBG_modifyProduct", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                conn.Open();

                try
                {
                    cmd.Parameters.Add(new SqlParameter("@userId", userInfo.UserId));
                    cmd.Parameters.Add(new SqlParameter("@productId", apiProductId));
                    cmd.Parameters.Add(new SqlParameter("@productPicPath", apiProductPicPath));
                    cmd.Parameters.Add(new SqlParameter("@productTitle", apiProductTitle));
                    cmd.Parameters.Add(new SqlParameter("@unitPrice", apiUnitPrice));
                    cmd.Parameters.Add(new SqlParameter("@qtn", apiInventoryQtn));
                    cmd.Parameters.Add(new SqlParameter("@productTypeId", apiProductTypeId));
                    cmd.Parameters.Add(new SqlParameter("@detail", apiProductDetail));
                    cmd.Parameters.Add(new SqlParameter("@before", JsonConvert.SerializeObject( beforeObj)));
                    cmd.Parameters.Add(new SqlParameter("@after", JsonConvert.SerializeObject(afterObj)));
                    SqlDataReader reader = cmd.ExecuteReader();

                    //判斷是否有此人員帳號存在
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            msgValue = ProductMsg.ProductModified;
                        }
                    }

                    Response.Write((int)msgValue);
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
}

   