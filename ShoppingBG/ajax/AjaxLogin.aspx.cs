using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
///using System.Web.Configuration;

namespace Shopping.ajax
{
    public partial class ajaxLogin : System.Web.UI.Page
    {
        //用enum新增登入狀態
        public enum msgType
        {
            //summary
            //輸入正確
            //summary
            correctLogin,
            //summary
            //輸入錯誤
            //summary
            wrongLogin,
            //summary
            //空字串請重新輸入
            NullEmptyInput
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            LoginVerify();
        }
               
        ///登入帳密驗証
        private void LoginVerify() 
        {
            var a = string.IsNullOrEmpty(null);
            int msgValue;            
            string correctId = WebConfigurationManager.AppSettings["loginId"];
            string correctPwd = WebConfigurationManager.AppSettings["loginPwd"];
            string apiGetId = Request.Form["getId"];
            string apiGetPwd = Request.Form["getPwd"];

            if (string.IsNullOrEmpty(apiGetId) || string.IsNullOrEmpty(apiGetPwd))
            {
                msgValue = (int)msgType.NullEmptyInput;
                Response.Write(msgValue);
            } else {
                if (apiGetId == correctId && apiGetPwd == correctPwd)
                {
                    msgValue = (int)msgType.correctLogin;
                } else {
                    msgValue = (int)msgType.wrongLogin;
                }
                Response.Write(msgValue);
            }

        }



    }
}