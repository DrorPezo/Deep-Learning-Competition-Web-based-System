/**
 * @user interface
 * @authors: Dror Pezo <Drorpezo@campus.technion.ac.il>
 * 			 Yonatan Barak <>	 
 * @version: 1.6
 */

//Some global variables
var counter=0;
const layerslist=[];
var learning_rate;
var user;
var model_num = 0;
var model_name;
var models_stats=[];

//Variable for enumerating layer types
var Layer_type={
	CONV : 0,
	POOL : 1,
	FLAT : 2,
	DENSE : 3,
	B_NORM : 4,
	DROPOUT : 5,
}

function conv(){
    /**
    * Creating basic convolution layer 
    *
    */
	this.kernelsize=0;
	this.filters=0;
	this.strides=1;
}

function pool(){
    /**
    * Creating basic pooling layer 
    *
    */
	this.poolSize=1;
	this.strides=1;
	this.type = 0;
}

function dense(){
    /**
    * Creating basic dense layer 
    *
    */
	this.act="softmax";
	this.units=10;
}

function dropout(){
    /**
    * Creating basic dropout layer 
    *
    */
	this.rate=1;
}

function remove(id) {
    /**
    * Removing element by id.
    *
    * @param {String} id - The ID of the element.
    */
	var elem = document.getElementById(id);
	return elem.parentNode.removeChild(elem);
}

function changetype(j,i,k){
	var data_value="layer_data_" + i;
	var spcae_value="space_" + i;
	if(k != 0){
		remove(data_value);
		remove(spcae_value);
	}
	var layer_id="layer" + i;
	var layer_ = document.getElementById(layer_id);
	var row = document.createElement("div");
	row.setAttribute("class","row");
	row.setAttribute("id",data_value);
	var btn_options = ["Convolution","Pooling","Flatten","Dense","Batch Normalization","Dropout"];
	var btn_id="layer_button_" + i;
	var btn = document.getElementById(btn_id);
	btn.innerHTML=btn_options[j];
	if(j==0)
	{
		var col1 = document.createElement("div");
		col1.setAttribute("class","col");
		var col2 = document.createElement("div");
		col2.setAttribute("class","col");
		var col3 = document.createElement("div");
		col3.setAttribute("class","col");
		var col4 = document.createElement("div");
		col4.setAttribute("class","col");
		var col5 = document.createElement("div");
		col5.setAttribute("class","col");
		var col6 = document.createElement("div");
		col6.setAttribute("class","col");
		var input_box1 = document.createElement("input");
		var input_box2 = document.createElement("input");
		var input_box3 = document.createElement("input");
		var string1 = "kernelsize" + i;
		var string2 = "strides" + i;
		var string3 = "filters" + i;
		input_box1.setAttribute("id",string1);
		input_box2.setAttribute("id",string2);
		input_box3.setAttribute("id",string3);
		col1.innerHTML = "Kernel size:";
		col3.innerHTML = "Numer of filters:";
		col5.innerHTML = "Numer of strides:";			
		col2.appendChild(input_box1);
		col4.appendChild(input_box2);
		col6.appendChild(input_box3);
		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		row.appendChild(col4);
		row.appendChild(col5);
		row.appendChild(col6);
	}
	if(j==1)
	{
		var col1 = document.createElement("div");
		col1.setAttribute("class","col-sm-2");
		var col2 = document.createElement("div");
		col2.setAttribute("class","col-sm-2");
		var col3 = document.createElement("div");
		col3.setAttribute("class","col-sm-2");
		var col4 = document.createElement("div");
		col4.setAttribute("class","col-sm-2");
		var col5 = document.createElement("div");
		col5.setAttribute("class","col-sm-2");
		var col6 = document.createElement("div");
		col6.setAttribute("class","col-sm-2");
		var input_box1 = document.createElement("input");
		var input_box2 = document.createElement("input");
		var pool_act_box = document.createElement("select");
		var pool_act_array = ["Max","Avrage"];
		for (var ii = 0; ii < pool_act_array.length; ii++) 
		{
			var option = document.createElement("option");
			option.value = ii;
			option.text = pool_act_array[ii];
			pool_act_box.appendChild(option);
		}
		var string1 = "type" + i;
		var string2 = "strides" + i;
		var string3 = "filters" + i;
		pool_act_box.setAttribute("id",string1);
		input_box1.setAttribute("id",string2);
		input_box2.setAttribute("id",string3);
		col1.innerHTML = "Type:";
		col3.innerHTML = "Numer of filters:";
		col5.innerHTML = "Numer of strides:";			
		col2.appendChild(pool_act_box);
		col4.appendChild(input_box1);
		col6.appendChild(input_box2);
		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		row.appendChild(col4);
		row.appendChild(col5);
		row.appendChild(col6);
	}
	if(j==2)
	{
		//do nothing
	}
	if(j==3)
	{
		var col1 = document.createElement("div");
		col1.setAttribute("class","col-sm-2");
		var col2 = document.createElement("div");
		col2.setAttribute("class","col-sm-2");
		var col3 = document.createElement("div");
		col3.setAttribute("class","col-sm-2");
		var col4 = document.createElement("div");
		col4.setAttribute("class","col-sm-2");
		var input_box1 = document.createElement("input");
		var dense_act_box = document.createElement("select");
		var dense_act_array = ["softmax","sigmoid","relu"];
		for (var ii = 0; ii < dense_act_array.length; ii++) 
		{
			var option = document.createElement("option");
			option.value = ii;
			option.text = dense_act_array[ii];
			dense_act_box.appendChild(option);
		}
		var string1 = "type" + i;
		var string2 = "units" + i;
		dense_act_box.setAttribute("id",string1);
		input_box1.setAttribute("id",string2);
		col1.innerHTML = "Type:";
		col3.innerHTML = "Numer of units:";			
		col2.appendChild(dense_act_box);
		col4.appendChild(input_box1);
		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		row.appendChild(col4);
	}
	if(j==4)
	{
		//do nothing
	}
	if (j==5)
	{
		var col1 = document.createElement("div");
		col1.setAttribute("class","col-sm-2");
		var col2 = document.createElement("div");
		col2.setAttribute("class","col-sm-2");
		var input_box = document.createElement("input");
		var string = "rate" + i;
		input_box.setAttribute("id",string);
		col1.innerHTML = "Rate:";		
		col2.appendChild(input_box);
		row.appendChild(col1);
		row.appendChild(col2);	
	}
	layer_.appendChild(row);
	var space1=document.createElement("div");
	space1.setAttribute("class","invisible");
	space1.setAttribute("id",spcae_value);
	var space2=document.createElement("p");
	space2.innerHTML="1";
	space1.appendChild(space2);
	layer_.appendChild(space1);
}

function createLayer(i){
	var base=document.getElementById("layers");
	base.style.opacity = "0.7";
	var container = document.createElement("div");
	var bg_color = ["container-fluid bg-light","container-fluid bg-white"];
	container.setAttribute("class",bg_color[(i+1)%2]);
	var container_id = "layer" + i;
	container.setAttribute("id",container_id);	
	var row1 = document.createElement("div");
	row1.setAttribute("class","row");
	var headline = "Layer " + i;
	var col1 = document.createElement("div");
	col1.setAttribute("class","col");
	col1.innerHTML = headline.bold();
	row1.appendChild(col1);	
	var dropdown = document.createElement("div");
	dropdown.setAttribute("class","dropdown");
	var dropdown_btn = document.createElement("div");
	dropdown_btn.setAttribute("class","btn btn-secondary dropdown-toggle");
	dropdown_btn.setAttribute("type","button");
	var btn_id = "layer_button_" + i;
	dropdown_btn.setAttribute("id",btn_id);
	dropdown_btn.setAttribute("data-toggle","dropdown");
	dropdown_btn.setAttribute("aria-haspopup","true");
	dropdown_btn.setAttribute("aria-expanded","false");
	var dropdown_options = ["Convolution","Pooling","Flatten","Dense","Batch Normalization","Dropout"];
	dropdown_btn.innerHTML = dropdown_options[0];
	dropdown.appendChild(dropdown_btn);
	var dropdown_menu = document.createElement("div");
	dropdown_menu.setAttribute("class","dropdown-menu");
	dropdown_menu.setAttribute("aria-labelledby",btn_id);		
	for(let ii=0; ii<dropdown_options.length; ii++){
		var option = document.createElement("button");
		option.setAttribute("class","dropdown-item");
		option.setAttribute("type","button");
		option.innerHTML=dropdown_options[ii];
		option.addEventListener("click",function(){changetype(ii,i,1);});
		dropdown_menu.appendChild(option);
	}
	dropdown.appendChild(dropdown_menu);
	var space =  document.createElement("div");
	space_id= "space_"+i;
	space.setAttribute("id",space_id);
	space.setAttribute("class","invisible");
	container.appendChild(row1);
	container.appendChild(dropdown);
	container.appendChild(space);
	base.appendChild(container);
	changetype(0,i,0);
	changetype(0,i,1);
}

function removeLayer(i){
   /**
   * removing layer i from network.
   *
   * @param {String} i - layer number.
   */
	var layer_id = "layer" + i;
	remove(layer_id);
}

//adding new layer to network
function AddNewLayer(){
    /**
    * adding new layer to network.
    *
    */
	newlayer = new Layer();
	counter++;
	layerslist.push(newlayer);
	createLayer(counter);
}

//removing last layer from network
function DeleteLastLayer(){
	/**
    * deleting the last layer from metwork.
    *
    */
	if(counter>1)
	{
	removeLayer(counter);
	counter--;
	layerslist.pop();
	}
}

function Layer() {
    this.type = Layer_type.CONV;
	this.conv = new conv();
	this.pool = new pool();
	this.dense = new dense();
	this.dropout = new dropout();
	this.counter = counter;
}

function update_values_and_train(){
	learning_rate=document.getElementById("learning_rate").value;
	if(isNaN(learning_rate) || learning_rate<=0 || learning_rate>=1){
		window.alert("learning rate must be in range (0,1)");
		return;
	}
	epochs_=document.getElementById("epochs").value;
	if(isNaN(epochs_) || epochs_<=0){
		window.alert("epochs must be a positive number");
		return;
	}
	if (Number.isInteger(Number(epochs_))==false){
		window.alert("epochs must be integer");
		return;
	}
	if(counter==0){
		window.alert("Not enough layers");
		return;
	}
	
	for (var i = 0; i < counter; i++) { 
		var layer_btn_id = "layer_button_" + (i+1);
		var layertype = document.getElementById(layer_btn_id).innerHTML;
		if(layertype == "Convolution"){
			layerslist[i].type=Layer_type.CONV;
			var string1 = "kernelsize" + (i+1);
			var string2 = "strides" + (i+1);
			var string3 = "filters" + (i+1);
			layerslist[i].conv.kernelsize = document.getElementById(string1).value;
			layerslist[i].conv.filters = document.getElementById(string2).value;
			layerslist[i].conv.strides = document.getElementById(string3).value;
			if(isNaN(layerslist[i].conv.kernelsize) || layerslist[i].conv.kernelsize<1 || layerslist[i].conv.kernelsize> 31){
				window.alert("kernel size must be a number in range [1,31]");
				return;
				}
			if(isNaN(layerslist[i].conv.filters) || layerslist[i].conv.filters<1){
				window.alert("filters must be a number");
				return;
				}
			if(isNaN(layerslist[i].conv.strides) || layerslist[i].conv.strides<1 || layerslist[i].conv.strides>31){
				window.alert("strides must be a number");
				return;
				}
		}
		if(layertype == "Pooling"){
			layerslist[i].type=Layer_type.POOL;
			var string1 = "type" + (i+1);
			var string2 = "strides" + (i+1);
			var string3 = "filters" + (i+1);
			layerslist[i].pool.type = document.getElementById(string1).value;
			layerslist[i].pool.strides = document.getElementById(string2).value;
			layerslist[i].pool.filters = document.getElementById(string3).value;
			if(isNaN(layerslist[i].pool.filters) || layerslist[i].pool.filters<1 || layerslist[i].pool.filters>31){
				window.alert("filters must be a number");
				return;
			}
			if(isNaN(layerslist[i].pool.strides) || layerslist[i].pool.strides<1 || layerslist[i].pool.strides>31){
				window.alert("strides must be a number");
				return;
			}
		}
		if(layertype == "Dense"){
			layerslist[i].type = Layer_type.DENSE;
			var string1 = "type" + (i+1);
			var string2 = "units" + (i+1);
			var actions_array = ["softmax","sigmoid","relu"];
			layerslist[i].dense.act = actions_array[document.getElementById(string1).value];
			layerslist[i].dense.units = document.getElementById(string2).value;
			if(isNaN(layerslist[i].dense.units) || layerslist[i].dense.units<1){
				window.alert("units must be a number");
				return;				
			}
			if(layerslist[i].dense.units!=10 && i+1 == layerslist.length){
				window.alert("last layer should have 10 units");
				return;
			}
		}
		if(layertype == "Flatten"){
			layerslist[i].type=Layer_type.FLAT;
		}
		if(layertype == "Batch Normalization")
		{
			layerslist[i].type=Layer_type.B_NORM;
		}
		if(layertype == "Dropout")
		{
			layerslist[i].type = Layer_type.DROPOUT;
			var string = "rate" + (i+1);
			layerslist[i].dropout.rate = document.getElementById(string).innerHTML;
			if(isNaN(layerslist[i].dropout.rate) || layerslist[i].dropout.rate > 1 || layerslist[i].dropout.rate < 0){
				window.alert("rate must be in range (0,1)");
				return;				
			}
		}
	}
	cifar10_train();
}

//gets label number and return it's corresponding label as a string
function get_type(i) {
	if (i==0)
		return "airplane";
	else if (i==1)
		return "car";
	else if (i==2)
		return "bird";
	else if (i==3)
		return "cat";
	else if (i==4)
		return "deer";
	else if (i==5)
		return "dog";
	else if (i==6)
		return "frog";
	else if (i==7)
		return "horse";
	else if (i==8)
		return "ship";
	else if (i==9)
		return "truck";
	else if (i==10)
		return "none";
	else
		return "";
}
// async function that gets the test batch for the printing of the pictures,
// predictions of the model and the actual labels to print wether the prediction
// was correct or not.
async function draw_prediction(batch, predictions, labels,num_of_pics,start_index){
	var drawing_place = document.getElementById("show_predictions");
	var row1;
	var row2;
	for(let i=0;i<num_of_pics; i++){
		var string_row1 = "row1" + (i%5);
		var string_row2 = "row2" + (i%5);
		if(i%5 == 0){
			row1 = document.createElement("div");
			row1.setAttribute("class","row");
			row1.setAttribute("id",string_row1);	
			row2 = document.createElement("div");
			row2.setAttribute("class","row");
			row2.setAttribute("id",string_row2);				
		}
		//get data of the relevant image and put it on a canvas element
		var tf2pic=batch.xs.reshape([1000,32,32,3]).slice([i+start_index,0,0,0],[1,32,32,3]).reshape([32,32,3]);
		var c = document.createElement("canvas");
		c.setAttribute("width","32");
		c.setAttribute("height","32");
		const imgRequest=tf.toPixels(tf2pic,c);
		const [imgResponse]=await Promise.all([imgRequest]);
		
		//get the label and print it's correctness
		var guess = document.createElement("p");
		var string1 = get_type(Number(predictions[i+start_index]));
		var string2 = "(" + get_type(Number(labels[i+start_index]));
		if(string1 == "" || string2 == "("){ //if an error was occured:
			console.log("there was a problem with some of the input data");
			return;
		}
		else if(predictions[i+start_index]==labels[i+start_index]){//if the guess was correct
			string2+= ") - correct";
			guess.setAttribute("style","color:#007000");
		}
		else{//if the guess wasn't correct
			string2+= ") - incorrect";
			guess.setAttribute("style","color:#e60000");
		}
		var guess_text = document.createTextNode(string1+string2);
		guess.appendChild(guess_text);
		col1 = document.createElement("div");
		col1.setAttribute("class","col");
		col2 = document.createElement("div");
		col2.setAttribute("class","col");			
		col1.appendChild(guess);
		col2.appendChild(c);
		row1.appendChild(col1);
		row2.appendChild(col2);
		if((i+1)%5 == 0){
			drawing_place.appendChild(row1);
			drawing_place.appendChild(row2);
		}
	}
}

var index_of_loss_Values=0;
var graph2d_loss;
var container_loss;
var dataset_loss;
const options_loss = {
		start: 0,
		end: 150,
		showCurrentTime: false,
};

function plotLosses(loss){
	var title = document.getElementById('losstitle');
	$(title).show();
	var newObject_loss = {x: index_of_loss_Values, y: loss};
	if(index_of_loss_Values==0){
		container_loss = document.getElementById('plot_loss_graph');
		dataset_loss = new vis.DataSet();
		dataset_loss.add(newObject_loss);
		index_of_loss_Values+=1;
		graph2d_loss = new vis.Graph2d(container_loss, dataset_loss, options_loss);
		graph2d_loss.fit();
		var progress_bar = document.getElementById('train_progress');
		progress_bar.setAttribute("class","visible");
	}
	else{
		dataset_loss.add(newObject_loss);
		graph2d_loss.redraw();
		graph2d_loss.fit();
		graph2d_loss.moveTo(index_of_loss_Values);
		index_of_loss_Values+=1;
	}
	var progress_bar = document.getElementById('train_progress_val');
	var percents = (index_of_loss_Values)/1.5;
	var style="width: " + percents +"%;";
	progress_bar.setAttribute("style",style);
	progress_bar.setAttribute("aria-valuenow",percents);
	document.getElementById('train_progress_txt').innerHTML = (index_of_loss_Values)/1.5 +"% completed";
}

var index_of_acc_Values=0;
var graph2d_acc;
var container_acc;
var dataset_acc;
const options_acc = {
		start: 0,
		end: 150,
		showCurrentTime: false
};
function plotAcc(acc){
	var title = document.getElementById('acctitle');
	$(title).show();
	var newObject_acc = {x: index_of_acc_Values, y: acc};
	if(index_of_acc_Values==0){
		container_acc = document.getElementById('plot_acc_graph');
		dataset_acc = new vis.DataSet();
		dataset_acc.add(newObject_acc);
		index_of_acc_Values+=1;
		graph2d_acc = new vis.Graph2d(container_acc, dataset_acc, options_acc);
		graph2d_acc.fit();
		
	}
	else{
		dataset_acc.add(newObject_acc);
		graph2d_acc.redraw();
		graph2d_acc.fit();
		graph2d_acc.moveTo(index_of_acc_Values);
		index_of_acc_Values+=1;
	}
}

function update_username(num){
	/**
    * register a new usr or login to exist user.
    *
    * @param {String} num - 0 - to register a new user, 1 - to login to exist user.
    */
	var type = 0;
	var username=document.getElementById('uname').value;
	var password = document.getElementById('password').value;
	var hashed_password = (CryptoJS.SHA256(password)).toString();
	var username_tosend = username.toLowerCase();
	//console.log("username :" + username +" password: " + hashed_password);
	if (username == ''){
		window.alert("Please enter your username");
		returnl
	}
	if(password.length < 6){
		window.alert("Please enter at least 6 letters password")
	}

	if(num==0){
		//if num = 0 then register a new user
		var confirm = document.getElementById('confirm').value;
		var hashed_confirm = (CryptoJS.SHA256(confirm)).toString();
		var confirmation_from_server;
		var exist;
		if(password != confirm){
			window.alert("Password confirmation was wrong.");
			return;
		}
		else{
			//checks if user's bucket already exist. If bucket hasn't created, create a new one by
			//sending post request.
			exist = bucket_exists(username_tosend);
			console.log(exist);
			if(exist == 0){
				$.when(
					$.ajax({
					url: 'https://esipjny9dg.execute-api.eu-central-1.amazonaws.com/prod/',
					dataType: 'json',
					type: 'post',
					contentType: 'application/json',
					data: JSON.stringify( { "username": username_tosend, "password": hashed_password} ),
					processData: false,
					success: function( data, textStatus, jQxhr ){
						confirmation_from_server = data;
						console.log( JSON.stringify( confirmation_from_server ) );
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.log( errorThrown );
						return;
					}
					})
				).done(function(x){
					console.log("User created successfully");
					//setCookie("user", username, 1);
					localStorage.setItem("user", username);
					window.location="successfully_sign_up.html";
					});
			}
			else{
				window.alert("User already exists. Please choose another name.");
				return;
			}
		}
	}
	//need to check if user really exists
	if(num==1){
		//if num = 1 then login to exist user
		exist = bucket_exists(username_tosend);
		console.log(exist == 1);
		var correct;
		if(exist == 1){
			$.when(
				$.ajax({
				url: 'https://6p6grspj2l.execute-api.eu-central-1.amazonaws.com/prod/',
				dataType: 'json',
				type: 'post',
				contentType: 'application/json',
				data: JSON.stringify( { "username": username_tosend, "password": hashed_password } ),
				processData: false,
				success: function( data, textStatus, jQxhr ){
					correct = data;
					console.log( correct );
				},
				error: function( jqXhr, textStatus, errorThrown ){
					console.log( errorThrown );
					return;
				}
			})
			).done(function(x){
				//setCookie("user", username, 1);
				if(correct == false){
					window.alert("Incorrect Password");
					return;
				}
				localStorage.setItem("user", username);
				//show_user_data(username);
				window.location="dashboard.html";
				if(models){
					console.log(models);
				}
			});
		}
		else{
			window.alert("User does not exists");
			return;
		}
	}
}

function clear_predictions(){
	remove("show_predictions");
	var predictions_area=document.getElementById("predictions_area");
	var show_predictions=document.createElement("div");
	show_predictions.setAttribute("id","show_predictions");
	predictions_area.appendChild(show_predictions);
}

function get_current_user(){
	return localStorage.getItem('user');
}

function bucket_exists(username){
	/**
    * checking if a bucket exist in S3 database according the username.
	* returns 0 if user does not exist, 1 if exist and -1 on error.
    *
    * @param {String} username - username.
    */
	username = username.toLowerCase();
	var d;
	$.when($.ajax({
		url: 'https://lt1o0pgbid.execute-api.eu-central-1.amazonaws.com/prod/',
		dataType: 'json',
		type: 'post',
		async: false,
		beforeSend: function(xhr){
			xhr.withCredentials = true;
		 },
		contentType: 'application/json',
		data: JSON.stringify( { "username": username } ),
		processData: false,
		success: function( data, textStatus, jQxhr ){
			d = data;
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.log( errorThrown );
			d = -1;
		}
	})).done(function(x){
		console.log(d);
	});
	return d;
}

function create_new_model(){
	var table = document.getElementById("models_table");
	model_name = document.getElementById("modelname").value;
	//setCookie("model_name", model_name,1);
	localStorage.setItem("model_name", model_name);
	//localStorage.setItem("model_number",model_num);	
	
	//date of creation to save
	var d = new Date();
	var full_date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
	
	var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);
   	cell1.innerHTML = ++model_num;
	cell2.innerHTML = model_name;
	cell3.innerHTML = full_date;
	cell4.innerHTML = "0";
	cell5.innerHTML = "0";
	cell6.innerHTML = '';
	cell7.innerHTML = '';
	
	var new_obj = {date:full_date, acc:0, loss:0 ,i:0 , j:0};
	models_stats.push(new_obj);
	var models_stats_JSON = JSON.stringify(models_stats);
	//save models_stats_JSON to the array in the bucket
	window.location = "build_model.html";
}

function show_name(){
	var p = document.getElementById("m_name");
	p.appendChild("Build and train" + model_name);
}

function hello_user(){
	/**
    * loading user's dashboard
    *
    */
    var curr_user = localStorage.getItem("user");
    
	document.getElementById("hello_user").innerHTML = "Hello " + curr_user +"! Here are your models";
	//console.log(tmp);
	//models = tmp;
	// upload the models data from cloud
	var models_stats = JSON.parse(get_user_models(curr_user));	
	var table = document.getElementById("models_table");
	var len = Object.keys(models_stats.models).length;
	
	for(var i=0; i < len; i++){
		var row = document.createElement("tr");
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var cell4 = row.insertCell(3);
		var cell5 = row.insertCell(4);
		var cell6 = row.insertCell(5);
		var cell7 = row.insertCell(6);
		cell1.innerHTML = ++model_num;
		cell2.innerHTML = models_stats.models[i].model_name;
		cell3.innerHTML = models_stats.models[i].date;
		cell4.innerHTML = models_stats.models[i].accuracy; 
		cell5.innerHTML = models_stats.models[i].loss;
		
		var button_continue_training = document.createElement("button");
		button_continue_training.innerHTML = "continue training";
		button_continue_training.setAttribute("class","btn btn-success")
		button_continue_training.setAttribute("id", models_stats.models[i].model_name);
		button_continue_training.addEventListener("click",function(){
			var m_name = $(this).attr('id');
			localStorage.setItem("model_name" ,m_name);
			//window.location = "continue_training.html";
		});
		cell6.appendChild(button_continue_training);
		cell7.innerHTML = '';
		table.appendChild(row);
	}
	document.getElementById('username_space').innerHTML=localStorage.getItem("user");
}

function get_user_models(user_name){
	/**
    * retrives all user models from database.
    *
    * @param {String} user_name - user name.
    */
	user_name = user_name.toLowerCase();
	var ret;
	$.when($.ajax({
		//crossOrigin: true,
		url: 'https://267ef660md.execute-api.eu-central-1.amazonaws.com/prod/',
		dataType:'json',
		type: 'post',
		async: false,
		contentType: 'application/json',
		data: JSON.stringify( { "bucket_name": user_name} ),
		processData: false,
		success: function( data, textStatus, jQxhr ){
			ret = JSON.stringify( data );
			//setCookie("models", ret, 1);
			//localStorage.setItem("models", ret);
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.log( errorThrown );
			return;
		}
	})).done(function(x){
		//console.log(ret);
	});
	return ret;
}

function get_model(bucket, model){
	/**
    * retrives all user models from database.
    *
    * @param {String} bucket - user name.
	* @param {String} model - model name.
    */

	var ret;
	$.when($.get("https://jm4i2wvi7l.execute-api.eu-central-1.amazonaws.com/prod/", 
		{bucket_name: bucket, model_name: model} , 
		function(data){
		// Display the returned data in browser
			//ret = data;
			localStorage.setItem('ret', data);
	}).done(function(x){
		console.log(ret);
	}));
	ret = localStorage.getItem('ret');
	return ret;
}

function get_model_summery() {
let html = "";
model.summary(50, // line length
              undefined,
              (line) => {
                 html += "<br>" + line;
              });
	return html+"<br><br>";
}

async function continue_training_load(){
	await Load_model();
	document.getElementById('username_space').innerHTML=localStorage.getItem('user');
	let summary = get_model_summery();
	document.getElementById("model_summary").innerHTML = summary;
}

function Set_continue_training(){
	var epochs_number=Number(document.getElementById("epochs_number").value);
	Resume_training(/*epochs_number*/);
}

//last line




