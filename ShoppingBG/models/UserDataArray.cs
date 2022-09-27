using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    public class UserDataArray
    {   
        /// <summary>
        /// 人員id
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 人員帳號
        /// </summary>
        public string UserAccount { get; set; }
        /// <summary>
        /// 人員暱稱
        /// </summary>
        public string UserNickname { get; set; }
        /// <summary>
        /// 人員密碼
        /// </summary>
        public string UserPwd { get; set; }
        /// <summary>
        /// 職責id
        /// </summary>
        public int DutyTypeId { get; set; }
        /// <summary>
        /// 職責名稱
        /// </summary>
        public string DutyName { get; set; }
    }
}