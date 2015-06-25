/*
	layer:
		back,layerA,layerB,layerWhite[base!]
		[base layer never visible!]
	status:
		statusB,statusA,start_game
	json:
		statusB_json,statusA_json,preStart_json
	3: last success
*/


function load_images( load_char_C){
	var json_str = "([";
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.png"},';
	json_str += '{"name":"'+'home_title'+'","path":'+'"images/home_title.png"},';
	json_str += '{"name":"'+'home_btn_star'+'","path":'+'"images/home_btn_star.png"},';
	json_str += '{"name":"'+'background_board'+'","path":'+'"images/background_board.png"},';
	json_str += '{"name":"'+'btn_login'+'","path":'+'"images/btn_login.png"},';
	json_str += '{"name":"'+'game_blackboard'+'","path":'+'"images/game_blackboard.png"},';
	json_str += '{"name":"'+'btn_error'+'","path":'+'"images/btn_error.png"},';
	json_str += '{"name":"'+'btn_right'+'","path":'+'"images/btn_right.png"},';
	json_str += '{"name":"'+'btn_nor'+'","path":'+'"images/btn_nor.png"},';
	json_str += '{"name":"'+'btn_nor_error'+'","path":'+'"images/btn_nor_error.png"},';
	json_str += '{"name":"'+'btn_nor_right'+'","path":'+'"images/btn_nor_right.png"},';
	json_str += '{"name":"'+'btn_sel_error'+'","path":'+'"images/btn_sel_error.png"},';
	json_str += '{"name":"'+'btn_sel_right'+'","path":'+'"images/btn_sel_right.png"},';
	json_str += '{"name":"'+'game_paper'+'","path":'+'"images/game_paper.png"},';
	json_str += '{"name":"'+'login_background'+'","path":'+'"images/login_background.png"},';
	json_str += '{"name":"'+'btn_login2'+'","path":'+'"images/btn_login2.png"},';
	json_str += '{"name":"'+'input_netid'+'","path":'+'"images/input_netid.png"},';
	json_str += '{"name":"'+'input_password'+'","path":'+'"images/input_password.png"},';
	json_str += '{"name":"'+'input_number'+'","path":'+'"images/input_number.png"},';
	json_str += '{"name":"'+'puzzle_background'+'","path":'+'"images/puzzle_background.png"},';
	json_str += '{"name":"'+'btn_OK'+'","path":'+'"images/btn_OK.png"},';
	json_str += '{"name":"'+'btn_right2'+'","path":'+'"images/btn_right2.png"},';
	json_str += '{"name":"'+'btn_error2'+'","path":'+'"images/btn_error2.png"},';
	json_str += '{"name":"'+'background_flash'+'","path":'+'"images/background_flash.png"},';
	json_str += '{"name":"'+'background_foot'+'","path":'+'"images/background_foot.png"},';
	json_str += '{"name":"'+'result'+'","path":'+'"images/background_result.png"},';
	json_str += '{"name":"'+'btn_foucs'+'","path":'+'"images/btn_focus.png"},';
	json_str += '{"name":"'+'btn_share'+'","path":'+'"images/btn_share.png"},';
	json_str += '{"name":"'+'share'+'","path":'+'"images/share.png"},';
	json_str += '{"name":"'+'puzzle_tips'+'","path":'+'"images/puzzle_tips.png"},';
	json_str += '{"name":"'+'choose_title'+'","path":'+'"images/choose_title.png"},';
	json_str += '{"name":"'+'judgment_title'+'","path":'+'"images/judgment_title.png"},';
	json_str += '{"name":"'+'puzzle_title'+'","path":'+'"images/puzzle_title.png"},';
	json_str += '{"name":"'+'memory_title'+'","path":'+'"images/memory_title.png"},';
	json_str+='])';

	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	back_layer.addChild( loadingLayer);
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C
	);
}

function load_complete( result){
	//push to showlist  start
	showList_back.push( new LBitmapData( result["back"]));
	showList_back.push( new LBitmapData( result["home_title"]));
	showList_back.push( new LBitmapData( result["home_btn_star"]));
	showList_back.push( new LBitmapData( result["background_board"]));
	showList_back.push( new LBitmapData( result["btn_login"]));

	//login_background
	showList_back.push( new LBitmapData( result["login_background"]));
	showList_back.push( new LBitmapData( result["btn_login2"]));
	showList_back.push( new LBitmapData( result["input_netid"]));
	showList_back.push( new LBitmapData( result["input_password"]));
	showList_back.push( new LBitmapData( result["input_number"]));


	//push to showlist  part1
	showList_part1.push( new LBitmapData( result["game_blackboard"]));
	showList_part1.push( new LBitmapData( result["btn_nor"]));
	showList_part1.push( new LBitmapData( result["btn_right"]));
	showList_part1.push( new LBitmapData( result["btn_error"]));
	showList_part1.push( new LBitmapData( result["choose_title"]));

	//push to showlist  part2
	showList_part2.push( new LBitmapData( result["btn_nor_right"]));
	showList_part2.push( new LBitmapData( result["btn_nor_error"]));
	showList_part2.push( new LBitmapData( result["btn_sel_right"]));
	showList_part2.push( new LBitmapData( result["btn_sel_error"]));
	showList_part2.push( new LBitmapData( result["judgment_title"]));

	//push to showlist  part3
	showList_part3.push( new LBitmapData( result["game_paper"]));
	showList_part3.push( new LBitmapData( result["memory_title"]));

	//push to showlist PART4
	showList_part4.push( new LBitmapData( result["puzzle_background"]));
	showList_part4.push( new LBitmapData( result["puzzle_tips"]));
	showList_part4.push( new LBitmapData( result["btn_OK"]));
	showList_part4.push( new LBitmapData( result["btn_right2"]));
	showList_part4.push( new LBitmapData( result["btn_error2"]));
	showList_part4.push( new LBitmapData( result["puzzle_title"]));

	//push to showlist game_over

	showList_over.push( new LBitmapData( result["background_flash"]));
	showList_over.push( new LBitmapData( result["background_foot"]));
	showList_over.push( new LBitmapData( result["btn_foucs"]));
	showList_over.push( new LBitmapData( result["btn_share"]));
	showList_over.push( new LBitmapData( result["share"]));


	build_background();
}
function build_background(){
//showlist to append show
	back_Bitmap = new LBitmap( showList_back[0]);
	back_Bitmap.scaleX = global_width/showList_back[0].width;
	back_Bitmap.scaleY = global_height/showList_back[0].height;
	back_layer.addChild( back_Bitmap);

	title_Bitmap = new LBitmap( showList_back[1]);
	title_Bitmap.scaleX = global_width/showList_back[1].width*0.85;		//w
	title_Bitmap.scaleY = global_height/showList_back[1].height*0.14;	//h
	title_Bitmap.x = global_width*0.07; //xi
	title_Bitmap.y = global_height*0.23; //yi
	back_layer.addChild( title_Bitmap);

	start_layer = new LSprite();
	start_Bitmap = new LBitmap( showList_back[2]);
	start_Bitmap.scaleX = global_width/showList_back[2].width*0.77;		//w
	start_Bitmap.scaleY = global_height/showList_back[2].height*0.26;	//h
	start_Bitmap.x = global_width*0.15;		//xi
	start_Bitmap.y = global_height*0.56;	//yi
	start_layer.addChild( start_Bitmap);
	back_layer.addChild( start_layer);
	start_layer.addEventListener( LMouseEvent.MOUSE_DOWN, gameintro);
}
function gameintro( event){
	back_layer.removeChild( start_layer);
	back_layer.removeChild( title_Bitmap);
	background_board_Bitmap = new LBitmap( showList_back[3]);
	background_board_Bitmap.scaleX = global_width/showList_back[3].width*0.9;		//w
	background_board_Bitmap.scaleY = global_height/showList_back[3].height*0.41;	//h
	background_board_Bitmap.x = global_width*0.07;		//xi
	background_board_Bitmap.y = global_height*0.2;	//yi
	back_layer.addChild( background_board_Bitmap);

	btn_login_layer = new LSprite();
	back_layer.addChild( btn_login_layer);
	btn_login_layer.x = global_width*0.35;		//xi
	btn_login_layer.y = global_height*0.64;	//yi
	btn_login_Bitmap = new LBitmap( showList_back[4]);
	btn_login_Bitmap.scaleX = global_width/showList_back[4].width*0.32;		//w
	btn_login_Bitmap.scaleY = global_height/showList_back[4].height*0.11;	//h
	btn_login_layer.addChild( btn_login_Bitmap);
	btn_login_layer.addEventListener( LMouseEvent.MOUSE_DOWN, gamelogin);
	//##############################################################################################
}
function gamelogin(){
	back_layer.removeChild( btn_login_layer);
	back_layer.removeChild( background_board_Bitmap);

	login_background_Bitmap = new LBitmap( showList_back[5]);
	login_background_Bitmap.scaleX = global_width/showList_back[5].width*1;		//w
	login_background_Bitmap.scaleY = global_height/showList_back[5].height*0.54;	//h
	login_background_Bitmap.x = global_width*0;		//xi
	login_background_Bitmap.y = global_height*0.19;	//yi
	back_layer.addChild( login_background_Bitmap);

//btn_Login
	btn_login2_layer = new LSprite();
	back_layer.addChild( btn_login2_layer);
	btn_login2_Bitmap = new LBitmap( showList_back[6]);
	btn_login2_Bitmap.scaleX = global_width/showList_back[6].width*0.34;		//w
	btn_login2_Bitmap.scaleY = global_height/showList_back[6].height*0.10;	//h
	btn_login2_layer.x = global_width*0.30;		//xi
	btn_login2_layer.y = global_height*0.60;	//yi
	btn_login2_layer.addChild( btn_login2_Bitmap);
	btn_login2_layer.addEventListener( LMouseEvent.MOUSE_DOWN, check_auth);

//form
	//bitmap
	login_input_Bitmap1 = new LBitmap( showList_back[7]);
	login_input_Bitmap1.scaleX = global_width/showList_back[7].width*0.83;		//w
	login_input_Bitmap1.scaleY = global_height/showList_back[7].height*0.06;	//h
	login_input_Bitmap1.x = global_width*0.08;		//xi
	login_input_Bitmap1.y = global_height*0.26;	//yi
	back_layer.addChild( login_input_Bitmap1);

	login_input_Bitmap2 = new LBitmap( showList_back[8]);
	login_input_Bitmap2.scaleX = global_width/showList_back[8].width*0.83;		//w
	login_input_Bitmap2.scaleY = global_height/showList_back[8].height*0.06;	//h
	login_input_Bitmap2.x = global_width*0.08;		//xi
	login_input_Bitmap2.y = global_height*0.35;	//yi
	back_layer.addChild( login_input_Bitmap2);

	login_input_Bitmap3 = new LBitmap( showList_back[9]);
	login_input_Bitmap3.scaleX = global_width/showList_back[9].width*0.83;		//w
	login_input_Bitmap3.scaleY = global_height/showList_back[9].height*0.06;	//h
	login_input_Bitmap3.x = global_width*0.08;		//xi
	login_input_Bitmap3.y = global_height*0.44;	//yi
	back_layer.addChild( login_input_Bitmap3);
	//text

	net_id = new LTextField();
	psw = new LTextField();
	phone = new LTextField();
	net_id.x = Math.round( global_width*0.32);
	net_id.y = Math.round( global_height*0.28);
	psw.x = Math.round( global_width*0.32);
	psw.y = Math.round( global_height*0.36);
	phone.x = Math.round( global_width*0.32);
	phone.y = Math.round( global_height*0.45);
	net_id.text = '12';
	psw.text = '123';
	phone.text = '1234';

	var inputLayer1 = new LSprite();
	var inputLayer2 = new LSprite();
	var inputLayer3 = new LSprite();
	inputLayer1.graphics.drawRect(0,"#000000",[0, -global_height*0.008, global_width*0.6, global_height*0.05]);
	inputLayer2.graphics.drawRect(0,"#000000",[0, -global_height*0.008, global_width*0.6, global_height*0.05]);
	inputLayer3.graphics.drawRect(0,"#000000",[0,-global_height*0.008, global_width*0.6, global_height*0.05]);
	net_id.setType(LTextFieldType.INPUT, inputLayer1);
	psw.setType(LTextFieldType.INPUT, inputLayer2);
	phone.setType(LTextFieldType.INPUT, inputLayer3);
	psw.displayAsPassword = true;
	net_id.size = global_width*0.05;
	psw.size = global_width*0.05;
	phone.size = global_width*0.05;

	back_layer.addChild( net_id);
	back_layer.addChild( psw);
	back_layer.addChild( phone);
}
function check_auth(){
	console.log('login');
	/*
	$.post( Ajax_URL,{NetId:net_id.text,Psw:psw.text,Phone:phone.text},function(result){

 	});
	*/
	start_game = 1;
}
//#############################################PART1
function startPart1(){
	back_layer.removeChild( login_background_Bitmap);
	back_layer.removeChild( btn_login2_layer);
	back_layer.removeChild( net_id);
	back_layer.removeChild( psw);
	back_layer.removeChild( phone);
	back_layer.removeChild( login_input_Bitmap1);
	back_layer.removeChild( login_input_Bitmap2);
	back_layer.removeChild( login_input_Bitmap3);
	build_part1();
//add option mouse event listener
	choose_title_Bitmap = new LBitmap( showList_part1[4]);
	choose_title_Bitmap.x = global_width*0.05;		//xi
	choose_title_Bitmap.y = global_height*0.07;	//yi
	choose_title_Bitmap.scaleX = global_width/showList_part1[4].width*0.5;		//w
	choose_title_Bitmap.scaleY = global_height/showList_part1[4].height*0.02;	//h

	back_layer.addChild( choose_title_Bitmap);
	option1.addEventListener( LMouseEvent.MOUSE_DOWN, part1o1check);
	option2.addEventListener( LMouseEvent.MOUSE_DOWN, part1o2check);
	option3.addEventListener( LMouseEvent.MOUSE_DOWN, part1o3check);
	option4.addEventListener( LMouseEvent.MOUSE_DOWN, part1o4check);
}
function build_part1(){
	game_blackboard_Bitmap = new LBitmap( showList_part1[0]);
	game_blackboard_Bitmap.scaleX = global_width/showList_part1[0].width*0.88;		//w
	game_blackboard_Bitmap.scaleY = global_height/showList_part1[0].height*0.27;	//h
	game_blackboard_Bitmap.x = global_width*0.05;		//xi
	game_blackboard_Bitmap.y = global_height*0.15;	//yi
	back_layer.addChild( game_blackboard_Bitmap);

//four layer
	option1 = new LSprite();
	option2 = new LSprite();
	option3 = new LSprite();
	option4 = new LSprite();

	back_layer.addChild( option1);
	back_layer.addChild( option2);
	back_layer.addChild( option3);
	back_layer.addChild( option4);

	option1.x = global_width*0.05;		//xi
	option1.y = global_height*0.45;	//yi
	option2.x = global_width*0.52;		//xi
	option2.y = global_height*0.45;	//yi
	option3.x = global_width*0.05;		//xi
	option3.y = global_height*0.57;	//yi
	option4.x = global_width*0.52;		//xi
	option4.y = global_height*0.57;	//yi

//four bitmap

//A
	btn_nor_Bitmap = new LBitmap( showList_part1[1]);
	btn_nor_Bitmap.scaleX = global_width/showList_part1[1].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part1[1].height*0.09;	//h
	option1.addChild( btn_nor_Bitmap);
//B
	btn_nor_Bitmap = new LBitmap( showList_part1[1]);
	btn_nor_Bitmap.scaleX = global_width/showList_part1[1].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part1[1].height*0.09;	//h
	option2.addChild( btn_nor_Bitmap);
//c
	btn_nor_Bitmap = new LBitmap( showList_part1[1]);
	btn_nor_Bitmap.scaleX = global_width/showList_part1[1].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part1[1].height*0.09;	//h
	option3.addChild( btn_nor_Bitmap);

//d
	btn_nor_Bitmap = new LBitmap( showList_part1[1]);
	btn_nor_Bitmap.scaleX = global_width/showList_part1[1].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part1[1].height*0.09;	//h
	option4.addChild( btn_nor_Bitmap);

//question text
	question_text = new LTextField();
	question_text.x = global_width*0.13;
	question_text.y = global_height*0.24;
	question_text.text = '345';
	back_layer.addChild( question_text);
	question_text.color = "#FFF";
	question_text.size = global_width*0.06;


//four text field
	field1 = new LTextField();
	field2 = new LTextField();
	field3 = new LTextField();
	field4 = new LTextField();

	//field1.size = global_width/
	field1.x = global_width*0.07;		//xi
	field1.y = global_height*0.47;		//yi

	field2.x = global_width*0.54;		//xi
	field2.y = global_height*0.47;		//yi

	field3.x = global_width*0.07;		//xi
	field3.y = global_height*0.59;		//yi

	field4.x = global_width*0.54;		//xi
	field4.y = global_height*0.59;		//yi
	field1.text = "132";
	field2.text = "132";
	field3.text = "132";
	field4.text = "132";

	field1.color = "#FFF";
	field2.color = "#FFF";
	field3.color = "#FFF";
	field4.color = "#FFF";

	back_layer.addChild(field1);
	back_layer.addChild(field2);
	back_layer.addChild(field3);
	back_layer.addChild(field4);
}

function part1o1check(event){
	console.log(event);
}
function part1o2check(event){
	console.log(event);
}
function part1o3check(event){
	console.log(event);
}
function part1o4check(event){
	console.log(event);
}

//#############################################PART2
function startPart2(){
	back_layer.removeChild( option1);
	back_layer.removeChild( option2);
	back_layer.removeChild( option3);
	back_layer.removeChild( option4);
	back_layer.removeChild( field1);
	back_layer.removeChild( field2);
	back_layer.removeChild( field3);
	back_layer.removeChild( field4);
	back_layer.removeChild( choose_title_Bitmap);


	option1 = new LSprite();
	option2 = new LSprite();

	back_layer.addChild( option1);
	back_layer.addChild( option2);

	option1.x = global_width*0.29;		//xi
	option1.y = global_height*0.45;	//yi
	option2.x = global_width*0.29;		//xi
	option2.y = global_height*0.57;	//yi

	judgment_title_Bitmap = new LBitmap( showList_part2[4]);
	judgment_title_Bitmap.x = global_width*0.05;		//xi
	judgment_title_Bitmap.y = global_height*0.07;	//yi
	judgment_title_Bitmap.scaleX = global_width/showList_part2[4].width*0.5;		//w
	judgment_title_Bitmap.scaleY = global_height/showList_part2[4].height*0.02;	//h
	back_layer.addChild( judgment_title_Bitmap);

//bitmap
//A
	btn_nor_Bitmap = new LBitmap( showList_part2[0]);
	btn_nor_Bitmap.scaleX = global_width/showList_part2[0].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part2[0].height*0.09;	//h
	option1.addChild( btn_nor_Bitmap);
//B
	btn_nor_Bitmap = new LBitmap( showList_part2[1]);
	btn_nor_Bitmap.scaleX = global_width/showList_part2[1].width*0.44;		//w
	btn_nor_Bitmap.scaleY = global_height/showList_part2[1].height*0.09;	//h
	option2.addChild( btn_nor_Bitmap);


//add option mouse event listener
	option1.addEventListener( LMouseEvent.MOUSE_DOWN, part2o1check);
	option2.addEventListener( LMouseEvent.MOUSE_DOWN, part2o2check);
}
function part2o1check(){

}
function part2o2check(){

}

//######################################################PART3
function startPart3(){
	back_layer.removeChild( game_blackboard_Bitmap);
	back_layer.removeChild( option1);
	back_layer.removeChild( option2);
	back_layer.removeChild( field1);
	back_layer.removeChild( field2);
	back_layer.removeChild( question_text);
	back_layer.removeChild( judgment_title_Bitmap);


	//bitmap
	gamepaper_Bitmap = new LBitmap( showList_part3[0]);
	gamepaper_Bitmap.scaleX = global_width/showList_part3[0].width*0.91;//w
	gamepaper_Bitmap.scaleY = global_height/showList_part3[0].height*0.57;//h
	gamepaper_Bitmap.x = global_width*0.04;		//xi
	gamepaper_Bitmap.y = global_height*0.14;	//yi
	back_layer.addChild( gamepaper_Bitmap);

	memory_title_Bitmap = new LBitmap( showList_part3[1]);
	memory_title_Bitmap.x = global_width*0.05;		//xi
	memory_title_Bitmap.y = global_height*0.07;	//yi
	memory_title_Bitmap.scaleX = global_width/showList_part3[1].width*0.5;		//w
	memory_title_Bitmap.scaleY = global_height/showList_part3[1].height*0.02;	//h
	back_layer.addChild( memory_title_Bitmap);

	//text
	game_text = new LTextField()
	game_text.text = 'readtext';
	game_text.x = global_width*0.15;
	game_text.y = global_height*0.35;
	game_text.color = "#DF9D00";

	back_layer.addChild( game_text);
	setTimeout( 'startPart3_write()', Read_TIME);
}
function startPart3_write(){
	back_layer.removeChild( game_text);
	back_layer.removeChild( gamepaper_Bitmap);
	build_part1();
	//add option mouse event listener
	option1.addEventListener( LMouseEvent.MOUSE_DOWN, part3o1check);
	option2.addEventListener( LMouseEvent.MOUSE_DOWN, part3o2check);
	option3.addEventListener( LMouseEvent.MOUSE_DOWN, part3o3check);
	option4.addEventListener( LMouseEvent.MOUSE_DOWN, part3o4check);
}
function part3o1check(event){

}

function part3o2check(event){

}

function part3o3check(event){

}

function part3o4check(event){

}




//##############################################PART4
function startPart4(){
	back_layer.removeChild( option1);
	back_layer.removeChild( option2);
	back_layer.removeChild( option3);
	back_layer.removeChild( option4);
	back_layer.removeChild( field1);
	back_layer.removeChild( field2);
	back_layer.removeChild( field3);
	back_layer.removeChild( field4);
	back_layer.removeChild( game_blackboard_Bitmap);
	back_layer.removeChild( memory_title_Bitmap);

//puzzle
	puzzle_Bitmap = new LBitmap( showList_part4[0]);
	puzzle_Bitmap.scaleX = global_width/showList_part4[0].width*0.906;		//w
	puzzle_Bitmap.scaleY = global_height/showList_part4[0].height*0.571;	//h
	puzzle_Bitmap.x = global_width*0.045; //xi
	puzzle_Bitmap.y = global_height*0.156; //yi
	back_layer.addChild( puzzle_Bitmap);

//title
	puzzle_title_Bitmap = new LBitmap( showList_part4[5]);
	puzzle_title_Bitmap.x = global_width*0.05;		//xi
	puzzle_title_Bitmap.y = global_height*0.07;	//yi
	puzzle_title_Bitmap.scaleX = global_width/showList_part4[5].width*0.5;		//w
	puzzle_title_Bitmap.scaleY = global_height/showList_part4[5].height*0.02;	//h
	back_layer.addChild( puzzle_title_Bitmap);

//tips
	puzzle_tips_Bitmap = new LBitmap( showList_part4[1]);
	puzzle_tips_Bitmap.scaleX = global_width/showList_part4[1].width*0.84;		//w
	puzzle_tips_Bitmap.scaleY = global_height/showList_part4[1].height*0.02;	//h
	puzzle_tips_Bitmap.x = global_width*0.06; //xi
	puzzle_tips_Bitmap.y = global_height*0.74; //yi
	back_layer.addChild( puzzle_tips_Bitmap);

//btn
	btnOK_layer = new LSprite();
	btnOK_layer.x = global_width*0.39; //xi
	btnOK_layer.y = global_height*0.8; //yi
	back_layer.addChild( btnOK_layer);
	btnOK_Bitmap = new LBitmap( showList_part4[2]);
	btnOK_Bitmap.scaleX = global_width/showList_part4[2].width*0.20;		//w
	btnOK_Bitmap.scaleY = global_height/showList_part4[2].height*0.12;	//h
	btnOK_layer.addChild( btnOK_Bitmap);
	btnOK_layer.addEventListener( LMouseEvent.MOUSE_DOWN, submitanswer);

}
function game_over(){
	//remove
	back_layer.removeChild( btnOK_Bitmap);
	back_layer.removeChild( puzzle_Bitmap);
	back_layer.removeChild( puzzle_tips_Bitmap);
	back_layer.removeChild( puzzle_title_Bitmap);

	//add

	question_text.text = 'gameover';
	btn_foucs_layer = new LSprite();
	btn_foucs_layer.x = global_width*0.53; //xi
	btn_foucs_layer.y = global_height*0.66; //yi

	btn_share_layer = new LSprite();
	btn_share_layer.x = global_width*0.07; //xi
	btn_share_layer.y = global_height*0.66; //yi

	btn_foucs_Bitmap = new LBitmap( showList_over[2]);
	btn_foucs_Bitmap.scaleX = global_width/showList_over[2].width*0.38;		//w
	btn_foucs_Bitmap.scaleY = global_height/showList_over[2].height*0.08;	//h
	btn_foucs_layer.addChild( btn_foucs_Bitmap);

	btn_share_Bitmap = new LBitmap( showList_over[3]);
	btn_share_Bitmap.scaleX = global_width/showList_over[3].width*0.39;		//w
	btn_share_Bitmap.scaleY = global_height/showList_over[3].height*0.08;	//h
	btn_share_layer.addChild( btn_share_Bitmap);

	back_layer.addChild( btn_foucs_layer);
	back_layer.addChild( btn_share_layer);

//addEventListener
//	btn_foucs_layer.addEventListener( LMouseEvent.MOUSE_DOWN, fou)
	btn_share_layer.addEventListener( LMouseEvent.MOUSE_DOWN, game_share);
}

function game_share(){
	//remove
	back_layer.removeAllChild();
	//add
	back_Bitmap = new LBitmap( showList_over[4]);
	back_Bitmap.scaleX = global_width/showList_over[4].width;
	back_Bitmap.scaleY = global_height/showList_over[4].height;
	back_layer.addChild( back_Bitmap);
}





















































































//==============================

//controller_frame

function controller_frame(){
	if( start_game == 1){
		start_game = 0;
		startPart1();
	}
	if( start_game == 2){
		start_game = 0;
		startPart2();
	}
	if( start_game == 3){
		start_game = 0;
		startPart3();
	}
	if( start_game == 4){
		start_game = 0;
		startPart4();
    	setTimeout( "load_puzzle_images()", 500);
	}
	if( start_game == 5){
		start_game = 0;
		game_over();
	}
}
//###########%%%%%%%================================MAIN START=================#####################%%%%%%%%%
function main(){
	$(" #mylegend").width( global_width);
	$(" #mylegend").height( global_height);
	$(" #mylegend").css( "margin", "0 auto");
	back_layer = new LSprite();
	addChild( back_layer);
//	back_layer.addEventListener( LEvent.ENTER_FRAME, controller_frame);
	setInterval( "controller_frame()", 500);
	load_images( load_complete);  //load 1back->2A->3B
}
//=======================================DATA============
showList_back = new Array();
showList_part1 = new Array();
showList_part2 = new Array();
showList_part3 = new Array();
showList_part4 = new Array();
showList_over = new Array();
showList_puzzle = new Array();
puzzle_str_seq = '123456';
puzzle_type = '1';
start_game = 0;		// 0:not start or starting  1 :start_part1 now  2:start part2now
Ajax_URL = 'l';
Read_TIME = 1000;//milliseconds
//=======================================DATA END ===========
