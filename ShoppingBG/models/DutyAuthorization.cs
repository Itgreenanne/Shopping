using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 權限管理
    /// </summary>
    public class DutyAuthorization
    {
        /// <summary>
        /// 存放目前登入人員的帳密
        /// </summary>
        public Object UserInfo { get; set; }
        /// <summary>
        /// 存放目前職責資料
        /// </summary>
        public Object DutyInfo { get; set; }
        /// <summary>
        /// 存放登入狀態的訊息
        /// </summary>
        public Object ResultMsg { get; set; }

    }
}