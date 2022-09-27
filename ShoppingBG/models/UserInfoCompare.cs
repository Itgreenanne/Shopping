using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 登入的使用者資訊
    /// </summary>
    public class UserInfoCompare
    {
        /// <summary>
        /// 使用者id
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 使用者帳號
        /// </summary>
        public string Account { get; set; }
        /// <summary>
        /// 使用者暱稱
        /// </summary>
        public string Nickname { get; set; }
        /// <summary>
        /// 使用者密碼
        /// </summary>
        public string Pwd { get; set; }
        /// <summary>
        /// 職責類別id
        /// </summary>
        public int TypeId { get; set; }
        /// <summary>
        /// t_duty中的職責id
        /// </summary>
        public int DutyId { get; set; }
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