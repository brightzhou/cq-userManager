var findHtml = "<div id=\"findPassword\">\
  <div class=\"find-password-title\">\
    <h3>找回密码</h3>\
  </div>\
  <div id=\"findPasswordForm\" class=\"find-password-form\">\
    <table cellpadding=\"0\" cellspacing=\"0\">\
      <tr>\
        <td style=\"width: 10%\"><img src=\"../../images/phone-icon.png\"></td>\
        <td style=\"width: 80%\">您可以通过手机找回密码</td>\
        <td style=\"width: 30%\">\
          <a href=\"javascript:phoneFind()\" id=\"phoneFind\" class=\"btn-blue\" type=\"button\">手机找回</a>\
        </td>\
      </tr>\
      <!--<tr>\
        <td style=\"width: 10%\"><img src=\"../../images/mail-icon.png\"></td>\
        <td style=\"width: 80%\">您可以通过绑定的邮箱地址找回密码</td>\
        <td style=\"width: 30%\">\
          <a href=\"javascript:emailFind()\" id=\"mailFind\" class=\"btn-blue\" type=\"button\">邮箱找回</a>\
        </td>\
      </tr>-->\
    </table>\
  </div>\
</div>";

var setUpPasswordHtml = "<div id=\"setUpPassword\">\
    <img class=\"bg-right\" src=\"../../images/modifyPassword.png\">\
    <div class=\"setUp-password-title\">\
      <h3>重新设置密码</h3>\
    </div>\
    <div id=\"setUpPasswordForm\" class=\"setUp-password-form\">\
      <table>\
      <tr>\
          <td width=\"70\">\
            <label for=\"code\">验证码</label>\
          </td>\
          <td>\
            <input id=\"code\" name=\"code\" class=\"mini-textbox\" onvalidation=\"onPwdValidation\" vtype=\"required\" style=\"width: 240px;\" emptyText=\"请输入验证码\" />\
          <a id=\"verificationCode\" class=\"mini-button\" type=\"button\" onclick=\"getVerificationCode\">重新发送</a>\
          </td>\
          <td id=\"code_error\" class=\"validation-error-text\"></td>\
        </tr>\
        <tr>\
          <td>\
            <label for=\"newPassword\">新密码</label>\
          </td>\
          <td>\
            <input id=\"newPassword\" name=\"newPassword\" class=\"mini-password\" onvalidation=\"onPwdValidation\" vtype=\"required;minLength:8;englishAndNum\" style=\"width: 240px;\" />\
          </td>\
          <td id=\"newPassword_error\" class=\"validation-error-text\"></td>\
        </tr>\
        <tr>\
          <td>\
            <label for=\"passwordAgain\">再次输入</label>\
          </td>\
          <td>\
            <input id=\"passwordAgain\" class=\"mini-password\" vtype=\"required;newdiffer\" style=\"width: 240px;\" onvalidation=\"onPwdValidation\"/>\
          </td>\
          <td id=\"passwordAgain_error\" class=\"validation-error-text\"></td>\
        </tr>\
        <tr>\
          <td></td>\
          <td>\
            <input value=\"确  定\" id=\"confirmSetUp\" class=\"btn-blue\" type=\"button\" onclick=\"confirmSetUp()\"/>\
          </td>\
          <td></td>\
        </tr>\
      </table>\
    </div>\
  </div>";