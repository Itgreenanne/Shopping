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
    public partial class AjaxMain : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //UserInfo userInfo = Session["userInfo"] != null ? (UserInfo)Session["userInfo"] : null;

            /*UserInfo userInfo = new UserInfo()
            {
                Account = "Anne",
                TypeId = 1
            };*/
            UserInfo userInfo = (UserInfo)Session["userInfo"];             
            JObject result = new JObject();

            if (userInfo != null)
            {
                result.Add("Account", userInfo.Account);
                result.Add("TypeId", userInfo.TypeId);
            } else {
                result.Add("SessionIsNull",null);
            }

            Response.Write(result);

        }
    }
}