/*
author:linjie
modified date : 2016/4/5
*/


(function(window) {
	function TreeLight(option) {
		this.nodes = [];
		this.lighting = false;
		this.timeout = option.timeout || 500;
	}

	TreeLight.prototype.preOrder = function(ele) { /* 前序 */
		this.nodes.push(ele);
		if (ele.firstElementChild) {
			this.preOrder(ele.firstElementChild);
		}
		if (ele.lastElementChild) {
			this.preOrder(ele.lastElementChild);
		}
	}

	TreeLight.prototype.inOrder = function(ele) { /* 中序 */
		if (ele.firstElementChild) {
			this.inOrder(ele.firstElementChild);
		}
		this.nodes.push(ele);
		if (ele.lastElementChild) {
			this.inOrder(ele.lastElementChild);
		}
	}

	TreeLight.prototype.postOrder = function(ele) { /* 后序 */
		if (ele.firstElementChild) {
			this.postOrder(ele.firstElementChild);
		}
		if (ele.lastElementChild) {
			this.postOrder(ele.lastElementChild);
		}
		this.nodes.push(ele);
	}

	TreeLight.prototype.lighter = function(ele) {
		var len = this.nodes.length,
			i = 0,
			that = this,
			timeout;
		if (len < 1) {
			return;
		}
		if (!this.lighting) {
			this.lighting = true;
			ele.className = 'active';
			timeout = window.setInterval(function() {
				console.log(i);
				if (i > len - 1) {
					that.nodes[i - 1].style.background = "transparent";
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
		treelight = new TreeLight(option);


	var pre_btn = document.getElementById('preorder');
	addEvent(pre_btn, 'click', function() {
		treelight.preOrder(root);
		treelight.lighter(pre_btn);
	});

	var in_btn = document.getElementById('inorder');
	addEvent(in_btn, 'click', function() {
		treelight.inOrder(root);
		treelight.lighter(in_btn);
	});

	var post_btn = document.getElementById('postorder');
	addEvent(post_btn, 'click', function() {
		treelight.postOrder(root);
		treelight.lighter(post_btn);
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