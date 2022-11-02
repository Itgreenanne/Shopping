using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 職責資訊
    /// </summary>
    public class DutyInfo
    {
        /// <summary>
        /// 職責id
        /// </summary>
        public int dutyId { get; set; }
        /// <summary>
        /// 職責名稱
        /// </summary>
        public string dutyName { get; set; }
        /// <summary>
        /// 職責管理
        /// </summary>
        public int mangDuty { get; set; }
        /// <summary>
        /// 人員管理
        /// </summary>
        public int mangUser { get; set; }
        /// <summary>
        /// 產品類別管理
        /// </summary>
        public int mangProType { get; set; }
        /// <summary>
        /// 產品管理
        /// </summary>
        public int mangProduct { get; set; }
        /// <summary>
        /// 訂單管理
        /// </summary>
        public int mangOrder { get; set; }
        /// <summary>
        /// 操作紀錄管理
        /// </summary>
        public int mangRecord { get; set; }
    }
}