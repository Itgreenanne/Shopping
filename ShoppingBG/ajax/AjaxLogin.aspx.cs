using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Shopping.ajax
{
    public partial class ajaxLogin : System.Web.UI.Page
    {


        protected void Page_Load(object sender, EventArgs e)
        {
            string CorrectId = "12";
            string CorrectPwd = "ab";
            string GetId = Request.Form["getId"];
            string GetPwd = Request.Form["getPwd"];

            Response.Write(GetId);
            Response.Write(GetPwd);
            if (GetId == CorrectId && GetPwd == CorrectPwd)
            {
                Response.Write("帳號跟密碼正確!");
            }
            else
            {
                Response.Write("帳號跟密碼錯誤!");
            }            
        }
    }
}