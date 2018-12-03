//define learning parameters

var LEARNING_RATE;	
const BATCH_SIZE = 1000;
const TRAIN_BATCHES = 50;//need to choose
const TEST_BATCH_SIZE = 1000;
var model;
var epochs;
var curr_epoch;
var paused=false;
var test_prediction_number=1;
var test_prediction_index_number=0;
var user;
var current_inner_index;
var current_outer_index;
var current_loss = 0;
var current_accuracy = 0;


async function Pause(){
	/**
    * pause training process and save the current model on user's s3 bucket.
    *
    */
	paused=true;
	//documented in order to prevent not necessary put requests
	
	var bucket = get_current_user();
	var model_name = localStorage.getItem('model_name');
        var sent = await model.save(tf.io.browserHTTPRequest(
	  'https://hhqx3yeg4k.execute-api.eu-central-1.amazonaws.com/dev/first-endpoint',
	   {headers :{
		   'bucket-name': bucket,
		   'model-name': model_name,
		   'loss': current_loss,
		   'accuracy': current_accuracy,
		   'epochs': curr_epoch
	   }})
	);
	//await model.save('downloads://my-model-1');
	
	current_model_index = localStorage.getItem("model_number");
	index_of_loss_Values=0;
	index_of_acc_Values=0;
	first_epoch = false;
	document.getElementById('Pause_btn').setAttribute('class','invisible');
	document.getElementById('Resume_btn').setAttribute('class','visible');	
}

function create_and_compile_model(){
	/**
    * creating and loading a new network.
    *
    */
	model = tf.sequential();
	//set learning rate to the user's choice
	LEARNING_RATE=Number(learning_rate);	
	//create the model based on the user input
	for(let i=0; i<counter ;i++){
		switch(Number(layerslist[i].type)){
		case Layer_type.CONV:
			if(i==0){
				model.add(tf.layers.conv2d({
					inputShape: [32,32,3],
					kernelSize: Number(layerslist[i].conv.kernelsize),
					filters: Number(layerslist[i].conv.filters),
					strides: Number(layerslist[i].conv.strides),
					activation: 'relu',
					kernelInitializer: 'VarianceScaling'
					}));
			}
			else{
				model.add(tf.layers.conv2d({
					kernelSize: Number(layerslist[i].conv.kernelsize),
					filters: Number(layerslist[i].conv.filters),
					strides: Number(layerslist[i].conv.strides),
					activation: 'relu',
					kernelInitializer: 'VarianceScaling'
					}));
			}
				break;
		case Layer_type.POOL:
			if(layerslist[i].pool.type==0){
				model.add(tf.layers.maxPooling2d({
					poolSize: [Number(layerslist[i].pool.poolSize),Number(layerslist[i].pool.poolSize)],
					strides: [Number(layerslist[i].pool.strides),Number(layerslist[i].pool.strides)]
				}));
			}
			if(layerslist[i].pool.type==1){
				model.add(tf.layers.averagePooling2d({
					poolSize: [Number(layerslist[i].pool.poolSize),Number(layerslist[i].pool.poolSize)],
					strides: [Number(layerslist[i].pool.strides),Number(layerslist[i].pool.strides)]
				}));
			}
			break;
		case Layer_type.FLAT:
			model.add(tf.layers.flatten());
			break;
		case Layer_type.DENSE:
			model.add(tf.layers.dense({units: Number(layerslist[i].dense.units),kernelInitializer: 'VarianceScaling',activation: layerslist[i].dense.act}));
			break;
		case Layer_type.B_NORM:
			try{
			model.add(tf.layers.batchNormalization());
			}
			catch(err){
				console.log("B_NORM")
			}
			break;
		case Layer_type.DROPOUT:
			try{
				model.add(tf.layers.dropout({rate: Number(layerslist[i].dropout.rate)}));
			}
			catch(err){
				console.log("DROPOUT")
			}
			break;		
		default:
			console.log("something went wrong "+layerslist[i].type);
			break;
		}
	}
	const optimizer = tf.train.sgd(LEARNING_RATE);
	model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
	curr_epoch=0;
}

async function Upload_keras_model() {
	/**
        * upload keras model.
        *
        */
	//var filepath = document.getElementById("uploadfile").value;
	var filepath = document.getElementById("fileInput").files[0].name;
	console.log(filepath);
	if(filepath.substr(-5) != ".json"){
		window.alert("Unsupported type of file")
		return;
	}
	try{
	model = await tf.loadModel(filepath);
	}
	catch(err){
       window.alert(err);
	}
}

async function getTestBatch(i) {
	/**
        * get the test batch.
        * 
        */
	var data = new CIFAR10(50+(i%10)); //create the tensors of the relevant batch
	await data.load();
	return data.nextBatch();
}

async function nextTrainBatch(BATCH_SIZE,i) {
	/**
        * get one of the train batches.
        *
        */
	var data = new CIFAR10(i); //create the tensors of the relevant batch
	await data.load();
	return data.nextBatch();
}

async function train() { 
	/**
        * train the model and save the weights on S3 user's bucekt.
        *
        */
	document.getElementById('Pause_btn').setAttribute('class','visible');
	//create validation data
	var testBatch;
	var TestBatchImages;
	var TestBatchLabels;
	var validationData;
	for(let ii=0;ii<Number(epochs_);ii++){
		for (let i = 0; i < TRAIN_BATCHES; i++) {
			//set validation data every 5 train batches
			if(i%5 == 0){
				testBatch = await getTestBatch(i/5);
				TestBatchImages = testBatch.zs;
				TestBatchLabels = testBatch.ys;
				validationData = [TestBatchImages, TestBatchLabels];
			}
			const batch = await nextTrainBatch(BATCH_SIZE,i);
			for (let j=0 ; j < Math.floor(BATCH_SIZE/64);j++){
				//var t0 = performance.now(); remove comment if want to count time of train of one batch
				if(paused==true){
					current_outer_index = i;
					current_inner_index = j;
					return 0;
				}
				const BatchImages = batch.zs.slice([64*j,0,0,0],[64,32,32,3]);
				const BatchLabels =  batch.ys.slice([64*j,0],[64,10]);
				const history = await model.fit(
									BatchImages, BatchLabels,
									{batchSize: 64,validationData,epochs: 1}
								);	
				const loss = history.history.loss[0];
				const accuracy = history.history.acc[0];
				current_loss = loss;
				current_accuracy = accuracy;
				
				//free some gpu memory
				tf.dispose([BatchImages,BatchLabels]);
				
				// Plot loss + accuracy.
				if(j == 4 || j == 9 || j == 14){
				document.getElementById("plot_area").setAttribute("class","visible");
				plotLosses(loss);
				plotAcc(accuracy);
				}	
				// models_stats[current_model_index].j=j;
				// models_stats[current_model_index].i=i;
				// models_stats[current_model_index].loss=loss;
				// models_stats[current_model_index].acc=accuracy;
				
				//var t1 = performance.now(); remove comment if want to count time of train of one batch
				//window.alert((t1 - t0)/1000 + " seconds"); remove comment if want to count time of train of one batch
			}
			//free some gpu memory
			tf.dispose([batch]);
			if(i%5 == 4){
				tf.dispose([validationData,testBatch]);
			}
			//wait for the next frame
			await tf.nextFrame();
		}
		curr_epoch++;
		epochs--;
	}
	var bucket = localStorage.getItem('user');
	var model_name = localStorage.getItem('model_name');
	var sent = await model.save(tf.io.browserHTTPRequest(
		'https://hhqx3yeg4k.execute-api.eu-central-1.amazonaws.com/dev/first-endpoint',
		{headers :{
			'bucket-name': bucket,
			'model-name': model_name,
			'loss': current_loss,
			'accuracy': current_accuracy,
			'epochs': curr_epoch
		}})
		);
	console.log(bucket);
	console.log(model_name);
	//await model.save('downloads://my-model-1');
}

async function showPredictions() {
	/**
    * test the model and show predictions using test set.
    *
    */
	var pics = new CIFAR10(50);
	await pics.load();
	batch = pics.nextBatch();
	const output = model.predict(batch.zs);
	const labels = Array.from(batch.ys.argMax(1).dataSync());
	const predictions = Array.from(output.argMax(1).dataSync());
	draw_prediction(batch,predictions,labels,50,0);
}

async function cifar10_train() {
	try{
		create_and_compile_model();
	}
	catch(err){
		window.alert("Error was occured while building the model. Please refresh your browser and try again");
		window.alert(err);
		return;
	}
	window.alert("Model created successfully");
	await train();
	showPredictions();
}

function test_prediction(num){
	if(num==0){
		test_prediction_number=1;
		test_prediction_index_number=0;
	}
	if(num==1){
		test_prediction_number=10;
		test_prediction_index_number=0;
	}
	if(num==2){
		test_prediction_number=100;
		test_prediction_index_number=0;
	}
	if(num==3){
		test_prediction_number=1000;
		test_prediction_index_number=0;
	}
}

async function predict(num) {	
	try{
		remove("show_predictions");
	}
	finally{
		var prediction_space1 = document.createElement("div");
		prediction_space1.setAttribute("id","show_predictions");
		var string = "predictions"+num;
		var prediction_space2=document.getElementById(string);
		prediction_space2.appendChild(prediction_space);
	}
	var pics = new CIFAR10(50);
	await pics.load();
	batch = pics.nextBatch();
	const output = model.predict(batch.zs);
	const labels = Array.from(batch.ys.argMax(1).dataSync());
	const predictions = Array.from(output.argMax(1).dataSync());
	draw_prediction(batch,predictions,labels,test_prediction_number,test_prediction_index_number);
	test_prediction_index_number=(test_prediction_index_number+test_prediction_number)%1000;
}

async function continue_training(current_epoch, epochs_number) { 
	document.getElementById('Pause_btn').setAttribute('class','visible');
	document.getElementById('Resume_btn').setAttribute('class','invisible');
	//create validation data
	var testBatch;
	var TestBatchImages;
	var TestBatchLabels;
	var validationData;
	var loss=0;
	var accuracy=0;
	for(let ii=current_epoch;ii<epochs_number;ii++){
		for (i=0; i < TRAIN_BATCHES; i++) {
			//set validation data every 5 train batches
			if(i%5 == 0){
				testBatch = await getTestBatch(i/5);
				TestBatchImages = testBatch.zs;
				TestBatchLabels = testBatch.ys;
				validationData = [TestBatchImages, TestBatchLabels];
			}
			const batch = await nextTrainBatch(BATCH_SIZE,i);
			for (j=0; j < Math.floor(BATCH_SIZE/64);j++){
				//var t0 = performance.now(); remove comment if want to count time of train of one batch
				if(paused==true){
					return 0;
				}
				const BatchImages = batch.zs.slice([64*j,0,0,0],[64,32,32,3]);
				const BatchLabels =  batch.ys.slice([64*j,0],[64,10]);
				const history = await model.fit(
									BatchImages, BatchLabels,
									{batchSize: 64,validationData,epochs: 1}
								);	
				loss = history.history.loss[0];
				accuracy = history.history.acc[0];
				
				//free some gpu memory
				tf.dispose([BatchImages,BatchLabels]);
				
				// Plot loss + accuracy.
				if(j == 4 || j == 9 || j == 14){
					console.log(loss);
					plotLosses(loss);
					plotAcc(accuracy);
				}
				//var t1 = performance.now(); remove comment if want to count time of train of one batch
				//window.alert((t1 - t0)/1000 + " seconds"); remove comment if want to count time of train of one batch
				// models_stats[current_model_index].j=j;
				// models_stats[current_model_index].i=i;
				// models_stats[current_model_index].loss=loss;
				// models_stats[current_model_index].acc=accuracy;
			}
			//free some gpu memory
			tf.dispose([batch]);
			if(i%5 == 4){
				tf.dispose([validationData,testBatch]);
			}
			//wait for the next frame
			await tf.nextFrame();
		}
		curr_epoch++;
		epochs--;
	}
	var bucket = get_current_user();
	var model_name = localStorage.getItem('model_name');
	var sent = await model.save(tf.io.browserHTTPRequest(
		'https://hhqx3yeg4k.execute-api.eu-central-1.amazonaws.com/dev/first-endpoint',
		{headers :{
			'bucket-name': bucket,
			'model-name': model_name,
			'loss': current_loss,
			'accuracy': current_accuracy,
			'epochs': curr_epoch
		}})
		);
	//var models_stats_JSON = JSON.stringify(models_stats);
	
	//save also models_stats_JSON(JSON file)
	
	console.log(bucket);
	console.log(model_name);
}

async function Resume_training() {
	try{
		document.getElementById("Continue_Training_visability").setAttribute("class","invisible");
	}
	finally{
		paused=false;
		clear_predictions();
		test_prediction_number=1000;
		await continue_training(curr_epoch,curr_epoch+epochs);
		showPredictions();
	}
}

//This function is used to load continue_training page
async function Load_model() {
	var model_n = localStorage.getItem('model_name');
	var bucket_name =  get_current_user();
	var model_files=JSON.parse(get_model(bucket_name, model_n));
	var model = await tf.loadModel(model_files[0],model_files[1]);
	//var pre_trained_model = await tf.loadModel(model_files[0]);
	//model = tf.model({inputs: pre_trained_model.inputs, outputs: pre_trained_model.layers[2].output});
	//console.log(model);
	document.getElementById('username_space').innerHTML=localStorage.getItem('user');
	let summary = get_model_summary(model);
	document.getElementById("model_summary").innerHTML = summary;
}

function Load_build_model_page() {
	document.getElementById('username_space').innerHTML=localStorage.getItem('user');
	current_model_index = localStorage.getItem("model_number");
}

function get_model_summary(model) {
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
}

function Set_continue_training(){
	
	var epochs_number=Number(document.getElementById("epochs_number").value);
	epochs=epochs_number;
	curr_epoch=localStorage.getItem("current_epoch");
	console.log(curr_epoch);
	Resume_training();
}


