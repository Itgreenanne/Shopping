using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 從資料庫讀取的產品類別資訊
    /// </summary>
    public class ProductTypeInfo
    {
        /// <summary>
        /// 產品類別id
        /// </summary>
        public int ProTypeId { get; set; }
        /// <summary>
        /// 產品類別名稱
        /// </summary>
        public string ProTypeName { get; set; }
    }
}