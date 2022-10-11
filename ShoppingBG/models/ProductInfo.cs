using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 從資料庫讀取的產品資料
    /// </summary>
    public class ProductInfo
    {   
        /// <summary>
        /// 產品id
        /// </summary>
        public int ProductId { get; set; }
        /// <summary>
        /// 產品標題
        /// </summary>
        public string ProductPic { get; set; }
        public string ProductTitle { get; set; }
        /// <summary>
        /// 產品單價
        /// </summary>
        public int ProductUnitPrice { get; set; }
        /// <summary>
        /// 產品數量
        /// </summary>
        public int ProductQtn { get; set; }
        /// <summary>
        /// 產品類別id
        /// </summary>
        public int ProductTypeId { get; set; }
        /// <summary>
        /// 產品詳情
        /// </summary>
        public string ProductDetail { get; set; }
        /// <summary>
        /// 產品類別名稱
        /// </summary>
        public string ProductTypeName { get; set; }
    }
}