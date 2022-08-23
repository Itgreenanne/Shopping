using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ShoppingBG.view
{
   
    public partial class main : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        /// <summary>
        /// 秀出帳號
        /// </summary>
        /// <returns></returns>
        public string DisplayLogin()
        {
            string str;
            if (Session["account"] != null)
            {
                str = Session["account"].ToString();
            } else {
                str = "??";
            }
            return str;
        }
        //如何session 而不是隨便一個函式執行session session過期

        //session 過期 回到登入畫面



        //當session是null時就表示?? 使用timeout屬性???? 

        //當session是null時 用response.write()傳js跳轉回登入畫面
        

    }
}