/**
 * 表格校验
 * @param grid grid对象
 * @returns {Boolean}校验结果
 */
function validateGrid(grid) {
  grid.validate();
  if (grid.isValid() == false) {
    var error = grid.getCellErrors()[0];
    mini.alert(error.errorText, "提示信息", function() {
      grid.beginEditCell(error.record, error.column);
    });
    return false;
  }
  return true;
}

/* 是否英文+数字 */
function isEnglishAndNumber(v) {
  var re = new RegExp("^[0-9a-zA-Z\_]+$");
  if (re.test(v)) return true;
  return false;
}
/* 是否汉字 */
function isChinese(v) {
  var re = new RegExp("^[\u4e00-\u9fa5]+$");
  if (re.test(v)) return true;
  return false;
}

//判断是否英文+数字
function onEnglishAndNumberValidation(e) {
  if (e.isValid) {
    if (isEnglishAndNumber(e.value) == false) {
      e.errorText = "必须输入英文+数字";
      e.isValid = false;
    }
  }
}

/** ========公共校验方法========= */
var vcity = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外"
};



/*自定义vtype:电话号码*/
mini.VTypes["dhhmErrorText"] = "请输入数字和“-”";
mini.VTypes["dhhm"] = function(v) {
  var re = new RegExp("^[0-9\-]{0,20}$");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:14位整数，两位小数金额*/
mini.VTypes["double14ErrorText"] = "请输入最大14位整数2位小数";
mini.VTypes["double14"] = function(v) {
  var re = new RegExp("^(([-]?[0-9]{1,14}[.]{1}[0-9]{1,2})$|([-]?[0-9]{1,14})$)");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:10位整数*/
mini.VTypes["int10ErrorText"] = "请输入最大10位整数";
mini.VTypes["int10"] = function(v) {
  if (parseFloat(v) <= 0) {
    return false;
  }
  var re = new RegExp("^([0-9]{1,10}$)");
  if (re.test(v)) return true;
  return false;
}

/*自定义vtype:非特殊字符,如果为null 不再校验，如果想检验不能为空，请加上 required="true" */
mini.VTypes["specialCharErrorText"] = "不能输入特殊字符";
mini.VTypes["specialChar"] = function(v) {
    if (!v) {
      return true;
    }
    var re = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9_\(\)$#@!\-]+$");
    if (re.test(v)) {
      return true;
    }
    return false;
  }
  /*自定义vtype:如果不为空再开始校验是否为float*/
mini.VTypes["allowNullFloatErrorText"] = "请输入数字";
mini.VTypes["allowNullFloat"] = function(v) {
  if (!v) {
    return true;
  }
  var e = parseFloat(String(v).replace(/,/g, ""));
  return isNaN(e) ? false : true;
}

/*自定义vtype:16位整数，两位小数金额*/
mini.VTypes["double16ErrorText"] = "请输入最大16位整数2位小数";
mini.VTypes["double16"] = function(v) {
  var re = new RegExp("^(([-]?[0-9]{1,16}[.]{1}[0-9]{1,2})$|([-]?[0-9]{1,16})$)");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:12位整数，4位小数金额*/
mini.VTypes["double12ErrorText"] = "请输入最大12位整数4位小数";
mini.VTypes["double12"] = function(v) {
  var re = new RegExp("^(([-]?[0-9]{1,12}[.]{1}[0-9]{1,4})$|([-]?[0-9]{1,12})$)");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:邮政编码*/
mini.VTypes["yzbmErrorText"] = "请输入0～9数字，长度为6位";
mini.VTypes["yzbm"] = function(v) {
  var re = new RegExp("^[0-9]{6}$");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:证件号码*/
mini.VTypes["zjhmErrorText"] = "请输入数字、字母或-，长度为20位";
mini.VTypes["zjhm"] = function(v) {
  var re = new RegExp("^([0-9A-Za-z]|[-]){0,20}$");
  if (!v || re.test(v)) return true;
  return false;
}

/*自定义vtype:身份证件号码*/
mini.VTypes["sfzjhmErrorText"] = "请输入正确的身份证号码。";
mini.VTypes["sfzjhm"] = function(v) {
  //是否为空
  if (v === '') {
    return false;
  }
  //检验位的检测
  if (checkParity(v) === false) {
    return false;
  }
  //校验长度，类型
  if (isCardNo(v) === false) {
    return false;
  }
  //检查省份
  if (checkProvince(v) === false) {
    return false;
  }
  //校验生日
  if (checkBirthday(v) === false) {
    return false;
  }
  return true;
}

/*自定义vtype:组织机构代码*/
mini.VTypes["zzjgdmErrorText"] = "组织机构代码必须为9位数字字母，字母为半角大写。";
mini.VTypes["zzjgdm"] = function(v) {
  if (!v) {
    return true;
  }
  var reg = /^[A-Z0-9]{9}$/;
  if (reg.test(v) === false) {
    return false;
  }
  return true;
}



//校验身份证的js  使用方法：（<input class="mini-textbox" onvalidation="onIDCardsValidation" />）
onIDCardsValidation = function(e) {
  if (e.isValid) {
    card = e.value;
    //是否为空
    if (card === '') {
      e.errorText = "身份证号码不能为空";
      e.isValid = false;
      return false;
    }
    //检验位的检测
    if (checkParity(card) === false) {
      e.errorText = "身份证号码错误";
      e.isValid = false;
      return false;
    }
    //校验长度，类型
    if (isCardNo(card) === false) {
      e.errorText = "身份证最后一位数字有误";
      e.isValid = false;
      return false;
    }
    //检查省份
    if (checkProvince(card) === false) {
      e.errorText = "身份证省份填写有误";
      e.isValid = false;
      return false;
    }
    //校验生日
    if (checkBirthday(card) === false) {
      e.errorText = "身份证生日填写有误";
      e.isValid = false;
      return false;
    }

    return true;
  }
};
//如果不是使用sui，就使用该方法进行校验，card为需要校验的身份证号
idCardsValidation = function(card) {
  var errorText = "";
  //是否为空
  if (card === '') {
    errorText = "身份证号码不能为空";
    return errorText;
  }
  //检验位的检测
  if (checkParity(card) === false) {
    errorText = "身份证号码错误";
    return errorText;
  }
  //校验长度，类型
  if (isCardNo(card) === false) {
    errorText = "身份证最后一位数字有误";
    return errorText;
  }
  //检查省份
  if (checkProvince(card) === false) {
    errorText = "身份证省份填写有误";
    return errorText;
  }
  //校验生日
  if (checkBirthday(card) === false) {
    errorText = "身份证生日填写有误";
    return errorText;
  }
  return errorText;
}


//检查号码是否符合规范，包括长度，类型
isCardNo = function(card) {
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
  if (reg.test(card) === false) {
    return false;
  }
  return true;
};

//取身份证前两位,校验省份
checkProvince = function(card) {
  var province = card.substr(0, 2);
  if (vcity[province] == undefined) {
    return false;
  }
  return true;
};

//组织机构证证件号码规则校验,9位数字字母，字母为半角大写
checkZzjg = function(zzjg) {
  var reg = /^[A-Z0-9]{9}$/;
  if (reg.test(zzjg) === false) {
    return false;
  }
  return true;
};

//检查生日是否正确
checkBirthday = function(card) {
  var len = card.length;
  //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == '15') {
    var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    var arr_data = card.match(re_fifteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date('19' + year + '/' + month + '/' + day);
    return verifyBirthday('19' + year, month, day, birthday);
  }
  //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == '18') {
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    var arr_data = card.match(re_eighteen);
    var year = arr_data[2];
    var month = arr_data[3];
    var day = arr_data[4];
    var birthday = new Date(year + '/' + month + '/' + day);
    return verifyBirthday(year, month, day, birthday);
  }
  return false;
};

//校验日期
verifyBirthday = function(year, month, day, birthday) {
  var now = new Date();
  var now_year = now.getFullYear();
  //年月日是否合理
  if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
    //判断年份的范围（3岁到100岁之间)
    var time = now_year - year;
    if (time >= 3 && time <= 100) {
      return true;
    }
    return false;
  }
  return false;
};

//校验位的检测
checkParity = function(card) {
  //15位转18位
  card = changeFivteenToEighteen(card);
  var len = card.length;
  if (len == '18') {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0,
      i, valnum;
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    valnum = arrCh[cardTemp % 11];
    if (valnum == card.substr(17, 1)) {
      return true;
    }
    return false;
  }
  return false;
};

//15位转18位身份证号
changeFivteenToEighteen = function(card) {
  if (card.length == '15') {
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var cardTemp = 0,
      i;
    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
    for (i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    card += arrCh[cardTemp % 11];
    return card;
  }
  return card;
};