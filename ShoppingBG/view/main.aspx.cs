using Newtonsoft.Json.Linq;
using ShoppingBG.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ShoppingBG.view
{
   
    public partial class Main : System.Web.UI.Page
    {        
        protected void Page_Load(object sender, EventArgs e)
        {
            HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            HttpContext.Current.Response.Cache.SetNoServerCaching();
            HttpContext.Current.Response.Cache.SetNoStore();

            if (Session["userInfo"] == null)
            {
                Server.Transfer("LoginPage.aspx");
            }
        }
    }
}