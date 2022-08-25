using Newtonsoft.Json.Linq;
using ShoppingBG.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ShoppingBG.ajax
{
    public partial class AjaxLogout : System.Web.UI.Page
    {
        public enum logoutType
        {
            /// <summary>
            /// 登入逾期
            /// </summary>
            runOutTime,
            /// <summary>
            /// Session裡的值不存在
            /// </summary>
            valueNotExist,
            /// <summary>
            /// 手動登出
            /// </summary>
            manual
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            logoutType logoutTypeValue= logoutType.valueNotExist;

            if (Session.Timeout == 20)
            {
                logoutTypeValue = logoutType.runOutTime;
            }
            else if (Session["userInfo"] == null) {
                logoutTypeValue = logoutType.valueNotExist;
            } //else if(manual)<---手動登出需要從js收到一個值來判斷

            Response.Write((int)logoutTypeValue);

            //Session.Abandon();
            //Session.RemoveAll();
            //UserInfo userInfo = (UserInfo)Session["userInfo"];
            //JObject result = new JObject();            
            //if (userInfo == null)
            //{
            //    result.Add("SessionIsNull", null);
            //    Response.Write(result);
            //}
        }
    }
}