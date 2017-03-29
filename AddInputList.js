/**
 * AddInputListJs
 * 
 * @note
 * Add input element to input list. Further, get data,delete data.
 * 
 * @varsion 1.0.1
 * @auther kenji uehara
 * @date 2017-3-24 | 2017-3-29
 * 
 * @param param
 * - parent_slt : Wrapper element of TABLE element.
 * - row_slt : 
 * - def_ent : Default entity.
 * - fields : The class and name attribute of the value to be obtained from the TR element.
 * - sort_field
 */
var AddInputList =function(param){
	
	
	this.param = param;
	
	this.par; // TABLE element.(jQuery object)
	
	var self=this; // Instance of myself.

	/**
	 * initialized.
	 */
	this.constract=function(){
		
		// If Param property is empty, set a value.
		var param = _setParamIfEmpty(this.param);
		
		// Get TABLE element as jQuery object.
		self.par = $(param.parent_slt);
		
		// Set default sort no.
		self.param.def_ent[param.sort_field] = 1;

		
		this.param = param;
			
	}
	
	// If Param property is empty, set a value.
	function _setParamIfEmpty(param){
		
		if(param == undefined){
			param = {};
		}
	
		if(param['parent_slt'] == undefined){
			throw new Error("Please set a 'parent_slt'");
		}
	
		if(param['row_slt'] == undefined){
			param['row_slt'] = 'tr';
		}
	
		if(param['def_ent'] == undefined){
			throw new Error("Please set a 'def_ent'");
		}
	
		if(param['sort_field'] == undefined){
			param['sort_field'] = 'sort_no';
		}
		

		
		if(param['fields'] == undefined){
			var fields = [];
			for(var f in param['def_ent']){
				fields.push(f);
			}
			param['fields'] = fields;
		}
		
		return param;
	}
	
	
	
	/**
	 * Add row of input element.
	 */
	this.addRow = function(){
		
		var param = self.param;
		var par = self.par;
		var row_slt = param.row_slt;
		var sort_field = param.sort_field;
		
		var max_sort_no = _getMaxSortNo();
		
		// Get first row element.
		var first_row = par.find(row_slt).eq(0);
		
		if(!first_row[0]){
			throw new Error("Fail get first row.(" + param.parent_slt + ':row_slt=' + row_slt + ")" );
		}
		
		// Add row to last,And get it row again.
		par.append(first_row[0].outerHTML);
		var newRow = par.find(row_slt).eq(-1);
		console.log('newRow');//■■■□□□■■■□□□■■■□□□)
		console.log(newRow);//■■■□□□■■■□□□■■■□□□)
		
		// Set default value to new row.
		for(var field in param.def_ent){
			var valElm = _findInParentEx(newRow,field);
			
			if(!valElm[0]){
				throw new Error("Not find '" + field + "' elements from new row." );
			}
			console.log('valElm');//■■■□□□■■■□□□■■■□□□)
			console.log(valElm);//■■■□□□■■■□□□■■■□□□)
			var def_val = param.def_ent[field];
			_setValueEx(valElm,def_val);
		}

		// Set a next sort no;
		var sortNoElm = _findInParentEx(newRow,sort_field);
		console.log('sortNoElm');//■■■□□□■■■□□□■■■□□□)
		console.log(sortNoElm);//■■■□□□■■■□□□■■■□□□)
		var next_sort_no = max_sort_no + 1;
		_setValueEx(sortNoElm,next_sort_no);
		

	}
	
	
	
	
	
	/**
	 * Get data from the selected TR element.
	 */
	this.getData = function(){
		
		var param = self.param;
		var row_slt = param.row_slt;
		var sort_field = param.sort_field;
		var data = [];
		var fields = param.fields;
		
		// Get TR elements from selected only.
		var trs = self.par.find(row_slt);
		trs.each(function(){
			var tr = $(this);
			
			// Get entity data  from TR elements.
			var ent = {}; // entity
			
			// Get sort no.
			ent[sort_field] = _getValueByField(tr,sort_field);
	
			// Get entity.
			for(var i in fields){
				var field = fields[i];
	
				// Get value within TR element by the field.
				var v = _getValueByField(tr,field);
				ent[field] = v
			}
			data.push(ent);
			
		});
		

		return data;
		
	}

	
	
	/**
	 * set data.
	 * @param data : It is set to element.
	 */
	this.setData = function(data){
		var param = self.param;
		var par = self.par;
		var row_slt = param.row_slt;
		var sort_field = param.sort_field;
		
		self.reset();
		
		var after2 = false;
		
		for(var i in data){
			var ent = data[i];
			
			if(after2==true){
				self.addRow();
			}
			
			var newRow = par.find(row_slt).eq(-1);
			_setEntityToRow(newRow,ent);
			
			after2 =true;
		}
	}
	
	
	/**
	 * Reset input elements.
	 * Return to the beginning.
	 */
	this.reset = function(){
		
		var param = self.param;
		var par = self.par;
		var row_slt = param.row_slt;
		
		// Get HTML of first row element.
		var first_row = par.find(row_slt).eq(0);
		
		if(!first_row[0]){
			throw new Error("Fail get first row.(" + param.parent_slt + ':row_slt=' + row_slt + ")" );
		}
		
		var row_html = first_row[0].outerHTML;
		
		// Reset.
		par.html(row_html);
		
		// Set defaut entity.
		first_row = par.find(row_slt).eq(0);
		_setEntityToRow(first_row,param.def_ent);
		
	}
	
	
	
	
	
	/**
	 * Set entity to row element.
	 * @param row : Row element.
	 * @param ent : Entity.
	 */
	function _setEntityToRow(row,ent){
		
		for(var field in ent){
			var v = ent[field];
			_setValueByField(row,field,v);
		}
	}
	
	
	
	
	/**
	 * Get max sort no from data.
	 * @returns Max sort no.
	 */
	function _getMaxSortNo(){
		
		var sort_field = self.param.sort_field;
		
		var max_sort_no = 0;
		var data = self.getData();
		
		for(var i in data){
			var ent = data[i];
			var sort_no = ent[sort_field];
			sort_no = sort_no * 1;
			if(max_sort_no < sort_no){
				max_sort_no = sort_no;
			}
		}

		return max_sort_no;
	}
	
	
	
	
	
	
	
	/**
	 * Set value by the field.
	 * 
	 * @note
	 * Find the element that matches the field from the parent element and get its value.
	 * The field is class attribute or name attribute.
	 * 
	 * @param parElm : parent element.
	 * @param field 
	 */
	function _setValueByField(parElm,field,v){
		
		var elm = _findInParentEx(parElm,field);
		if(elm[0]){
			v = _setValueEx(elm,v);
		}
	}
	
	
	
	
	
	/**
	 * 要素の種類を問わずに値をセットする
	 * @param elm 要素(jQueryオブジェクト）
	 * @pramm v 値
	 * @version 1.0
	 */
	function _setValueEx(elm,v){
		
		var tagName = elm.get(0).tagName; // 入力要素のタグ名を取得する
		
		// 値を入力フォームにセットする。
		if(tagName == 'INPUT' || tagName == 'SELECT'){
			
			// type属性を取得
			var typ = elm.attr('type');
			
			if(typ=='checkbox'){
				if(v ==0 || v==null || v==''){
					elm.prop("checked",false);
				}else{
					elm.prop("checked",true);
				}
				
			}
			
			else if(typ=='radio'){
				var f = elm.attr('name');
				var parElm = elm.parent();
				var opElm = parElm.find("[name='" + f + "'][value='" + v + "']");
				if(opElm[0]){
					opElm.prop("checked",true);
				}
	
			}
			
			else{
				
				if(typeof v == 'string'){
					v = v.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
				}
				
				elm.val(v);
			}
	
			
		}
		
		// テキストエリア用のセット
		else if(tagName == 'TEXTAREA'){
	
			if(v!="" && v!=undefined){
				v=v.replace(/<br>/g,"\r");
				
				if(typeof v == 'string'){
					v = v.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
				}
			}
	
			elm.val(v);
			
		}
		
		// IMGタグへのセット
		else if(tagName == 'IMG'){
			// IMG要素用の入力フォームセッター
			elm.attr('src',v);
			
		}
		
		// audioタグへのセット
		else if(tagName == 'AUDIO'){
			elm.attr('src',v);
			
			
		}else{
			if(typeof v == 'string'){
				if(v!="" && v!=undefined){
					v=v.replace(/<br>/g,"\r");
					if(typeof v == 'string'){
						v = v.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					}
					v = v.replace(/\r\n|\n\r|\r|\n/g,'<br>');// 改行コートをBRタグに変換する
				}
			}
			
			elm.html(v);
		}
	
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Get value by the field.
	 * 
	 * @note
	 * Find the element that matches the field from the parent element and get its value.
	 * The field is class attribute or name attribute.
	 * 
	 * @param parElm : parent element.
	 * @param field 
	 * @returns Value in element.
	 */
	function _getValueByField(parElm,field){
		var v = undefined;
		var elm = _findInParentEx(parElm,field);
		if(elm[0]){
			v = _getValueEx(elm);
		}
		return v;
	}
	
	
	/**
	 * Get value from elements regardless of tag type.
	 * @param elm : Value element.
	 * @returns Value from value element.
	 */
	function _getValueEx(elm){
		
		var v = undefined;
		var tagName = elm.prop("tagName"); 
		
		if(tagName == 'INPUT' || tagName == 'SELECT' || tagName=='TEXTAREA'){
			
			var typ = elm.attr('type');

			if(typ=='checkbox'){
				
				v = 0;
				if(elm.prop('checked')){
					v = 1;
				}
				
			}
			
			else if(typ=='radio'){
				var opElm = form.find("[name='" + f + "']:checked");
				v = 0;
				if(opElm[0]){
					v = opElm.val();
				}
	
			}
			
			else{
				v = elm.val();

			}
			
		}else{
			v = elm.html();
		}
		return v;
	}
	
	
	
	/**
	 * Search for matched elements from the parent element regardless of class attribute, name attribute, id attribute.
	 * @param parElm : parent element.
	 * @param field : class, or name attribute
	 * @returns element.
	 */
	function _findInParentEx(parElm,field){
		var elm = parElm.find('.' + field);
		if(!elm[0]){
			elm = parElm.find("[name='" + field + "']");
		}else if(!elm[0]){
			elm = parElm.find('#' + field);
		}
		return elm;
	}
	
	
	// Check empty.
	function _empty(v){
		if(v == null || v == '' || v=='0'){
			return true;
		}else{
			if(typeof v == 'object'){
				if(Object.keys(v).length == 0){
					return true;
				}
			}
			return false;
		}
	}
	
	

	// call constractor method.
	this.constract();
}