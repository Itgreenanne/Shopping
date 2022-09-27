using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ShoppingBG.models
{
    /// <summary>
    /// 職責刪除的結果
    /// </summary>
    public class DeleteDutyResult
    {
        public int Result { get; set; }
        public List<DutyInfo> DutyArray { get; set; }
    }

}