	/**
	 * [Accordion二级菜单组件]
	 * @param {[string]} el       [容器对象]
	 * @param {[boolean]} multiple [是否折叠]
	 * @author zhouqy
	 * @ var accordion = new Accordion($('#menuList'), false);
	 * accordion.init(".parentMenu");
	 */
	function Accordion(el, multiple) {
		this.el = el || {};
		this.multiple = multiple || false;
	}

	Accordion.prototype.eventMenuClick = function(cls) {
		var that = this;
		return this.el.find(cls).on('click', {
			el: that.el,
			multiple: that.multiple
		}, that.dropdown);
	}

	Accordion.prototype.init = function(pcls) {
		this.eventMenuClick(pcls);
	}

	Accordion.prototype.renderMenuList = function(data) {
		data.push({});
		var html = "";
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i].pid == undefined && data[i].url !== null) {
				html += "<a class=\"menu-1\" href=" + data[i].url + " target=\"accountCenter\">" + data[i].menuName + "</a>";
			}
			if (data[i].url == null) {
				html += "<a class=\"menu-1 parentMenu\">" + data[i].menuName + "</a><ul class=\"sub-menu\">";
				i++;
				while (!!data[i].pid) {
					html += "<a class=\"menu-2\" href=" + data[i].url + " target=\"accountCenter\">" + data[i].menuName + "</a>";
					i++;
				}
				html += "</ul>";
			}
		}
		return html;
	}

	Accordion.prototype.dropdown = function(e) {
		var $el = e.data.el;
		var $this = $(this);
		var $next = $this.next();
		$next.slideToggle();
		// $this.parent().toggleClass('open');
		if (!e.data.multiple) {
			$el.find('.sub-menu').not($next).slideUp();
		};
	}