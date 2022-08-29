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
        public enum LogoutType
        {
            /// <summary>
            /// 登入逾期
            /// </summary>
            RunOutTime,
            /// <summary>
            /// Session裡的值不存在
            /// </summary>
            ValueNotExist,
            /// <summary>
            /// 手動登出
            /// </summary>
            Manual
        }
        protected void Page_Load(object sender, EventArgs e)
        {
            LogoutType logoutTypeValue = LogoutType.ValueNotExist;

            if (Session.Timeout == 20)
            {
                logoutTypeValue = LogoutType.RunOutTime;
            }
            else if (Session["userInfo"] == null)
            {
                logoutTypeValue = LogoutType.ValueNotExist;
            } //else if(manual)<---手動登出需要從js收到一個值來判斷

            Response.Write((int)logoutTypeValue);


            //UserInfo userInfo = (UserInfo)Session["userInfo"];
            //JObject result = new JObject();
            //Session.Abandon();            
            //Session.RemoveAll();




            //if (Session["userInfo.Account"] == null)
            //{
            //    result.Add("SessionIsNull", null);
            //    Response.Write(result);
            //}
        }
    }
}