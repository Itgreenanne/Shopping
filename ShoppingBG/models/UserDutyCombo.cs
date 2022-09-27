using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    public class UserDutyCombo
    {    
        /// <summary>
         /// 只有職責id與職責名稱的職責資料
         /// </summary>
        public List<DutyInfoForMenu> DutyInfoArray { get; set; }
        /// <summary>
        ///人員表格資料+職責名稱
        /// </summary>
        public List<UserDataArray> UserDataArray { get; set; }       
    }
}