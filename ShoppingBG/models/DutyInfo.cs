using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 
    /// </summary>
    public class DutyInfo
    {
        /// <summary>
        /// 職責名稱
        /// </summary>
        public string DutyName { get; set; }
        /// <summary>
        /// 職責管理
        /// </summary>
        public int MangDuty { get; set; }
        /// <summary>
        /// 人員管理
        /// </summary>
        public int MangUser { get; set; }
        /// <summary>
        /// 產品類別管理
        /// </summary>
        public int MangProType { get; set; }
        /// <summary>
        /// 產品管理
        /// </summary>
        public int MangProduct { get; set; }
        /// <summary>
        /// 訂單管理
        /// </summary>
        public int MangOrder { get; set; }
        /// <summary>
        /// 操作紀錄管理
        /// </summary>
        public int MangRecord { get; set; }
    }
}