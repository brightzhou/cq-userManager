/*纳税人识别号校验*/
function nsrsbhValidate(id) {
	var val = $(id).val();
	var re = new RegExp("^[a-zA-Z0-9\-]{15,20}$");
	var num = /^\d{15,20}$/;
	if (val=== "") return false;
	if (num.test(val) || re.test(val)) return true;
	return false;
}