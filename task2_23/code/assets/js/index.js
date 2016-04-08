/*
author:linjie
modified date : 2016/4/8
*/

(function(window) {
	function TreeLight(option) {
		this.nodes = [];
		this.lighting = false; // 是否运行中
		this.timeout = option.timeout || 500; // 设置时间
		this.flag = 0; // 是否找到元素
		this.last = 0; // 上次找到的元素
	}

	TreeLight.prototype.findText = function(ele, text) { // 查找p元素下的内容
		if (ele.innerHTML == text) {
			return true;
		}
		return false;
	}

	TreeLight.prototype.DFS = function(ele, text) { /* 深度优先 */
		this.nodes.push(ele);
		if (ele.children) {
			for (var i = 0; i < ele.children.length; i++) {

				if (ele.children[i].nodeName.toLowerCase() == 'div') {
					if (text) {
						if (!this.flag) {
							this.DFS(ele.children[i], text);
						}
					} else {
						this.DFS(ele.children[i]);
					}
				}

				if (text && ele.children[i].nodeName.toLowerCase() == 'p') {
					if (this.findText(ele.children[i], text)) {
						this.flag = 1;
						return;
					}
				}
			}
		}
	}

	TreeLight.prototype.BFS = function(ele, text) { /* 广度优先 */
		var stack = [],
			item,
			that = this;

		that.nodes.push(ele);
		if (text) {
			if (find_p_ele(ele))
				return;
		}

		//先将第一层节点放入栈
		for (var i = 0, len = ele.children.length; i < len; i++) {
			if (ele.children[i].nodeName.toLowerCase() == 'div') {
				stack.push(ele.children[i]);
				that.nodes.push(ele.children[i]);
				if (text) {
					if (find_p_ele(ele.children[i])) {
						return;
					}
				}
			}
		}

		while (stack.length) {
			item = stack.shift();

			if (item.children && item.children.length) {
				for (var i = 0, len = item.children.length; i < len; i++) {
					if (item.children[i].nodeName.toLowerCase() == 'div') {
						stack.push(item.children[i]);
						that.nodes.push(item.children[i]);
						if (text) {
							if (find_p_ele(item.children[i])) {
								return;
							}
						}
					}
				}
			}
		}

		function find_p_ele(ele) { /* 不能像深度搜索一样，必须找到一个节点后搜索其子节点 */
			if (ele.children && ele.children.length) {
				for (var i = 0, len = ele.children.length; i < len; i++) {
					if (text && ele.children[i].nodeName.toLowerCase() == 'p') {
						if (that.findText(ele.children[i], text)) {
							that.flag = 1;
							return true;
						}
						return false;
					}
				}
			}

		}
	}

	TreeLight.prototype.lighter = function(ele, text, tips) {
		var len = this.nodes.length,
			i = 0,
			that = this,
			timeout;
		if (len < 1) {
			return;
		}
		if (!this.lighting) {
			if (this.last) { /* 上次找到的元素使之透明 */
				this.last.style.background = "transparent";
				this.last = 0;
			}
			this.lighting = true;
			ele.className = 'active';
			timeout = window.setInterval(function() {
				if (i > len - 1) {
					if (that.flag && text) { /* 搜索且找到元素 */
						that.last = that.nodes[i - 1];
					} else if (text) { /* 搜索但找不到元素 */
						that.nodes[i - 1].style.background = "transparent";
						tips.innerHTML = '没有' + text;
					} else { /* 普通遍历 */
						that.nodes[i - 1].style.background = "transparent";
					}
					that.flag = 0;
					that.nodes = [];
					that.lighting = false;
					ele.className = '';
					clearInterval(timeout);
				} else if (i >= 1) {
					that.nodes[i - 1].style.background = "transparent";
					that.nodes[i].style.background = "#ff7f66";
					i++;
				} else {
					that.nodes[i].style.background = "#ff7f66";
					i++;
				}
			}, that.timeout);
		}
	}

	window.TreeLight = TreeLight;
})(window);

(function() {
	var root = document.getElementById('root'),
		option = {
			"timeout": 800
		},
		treelight = new TreeLight(option),
		text,
		tips = document.getElementById('tips');


	var depthfirst = document.getElementById('depthfirst'); /* 深度优先遍历 */
	addEvent(depthfirst, 'click', function() {
		treelight.DFS(root);
		treelight.lighter(depthfirst);
	});

	var breadthfirst = document.getElementById('breadthfirst'); /* 广度优先遍历 */
	addEvent(breadthfirst, 'click', function() {
		treelight.BFS(root);
		treelight.lighter(breadthfirst);
	});


	var dfs = document.getElementById('dfs'); /* 深度优先搜索 */
	addEvent(dfs, 'click', function() {
		text = document.getElementsByClassName('search-input')[0].value.trim();
		if (text != '') {
			treelight.DFS(root, text);
			treelight.lighter(dfs, text, tips)

		} else {
			tips.innerHTML = '请输入搜索文字';
		}
	});

	var bfs = document.getElementById('bfs'); /* 广度优先搜索 */
	addEvent(bfs, 'click', function() {
		text = document.getElementsByClassName('search-input')[0].value.trim();
		if (text != '') {
			treelight.BFS(root, text);
			treelight.lighter(bfs, text, tips)
		} else {
			tips.innerHTML = '请输入搜索文字';
		}
	});

})();

/*添加事件到对象*/
function addEvent(obj, sType, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(sType, fn, false); //用于 Mozilla系列
	} else {
		obj.attachEvent('on' + sType, fn);
	}
};