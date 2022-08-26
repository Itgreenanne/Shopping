using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;

namespace ShoppingBG.view
{   
    public partial class LoginPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //int a = 0;
             Session.Abandon();
             Session.RemoveAll();
            //if (Session["userInfo"] == null) 
            //    a = 4;
        }
    }
}

