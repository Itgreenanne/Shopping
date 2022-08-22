using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ShoppingBG.view
{
    public partial class default1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (Session["typeId"] != null) {
                loginState.Text = "Session was created successfully";
            } else {
                loginState.Text = "Sesson was not created";
            }
        }
    }
}