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
	json_str+='])';
	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_complete( result){
	//push to showlist  start
	showList_back.push( new LBitmapData( result["back"]));
	showList_back.push( new LBitmapData( result["home_title"]));
	showList_back.push( new LBitmapData( result["home_btn_star"]));
	showList_back.push( new LBitmapData( result["background_board"]));
	showList_back.push( new LBitmapData( result["btn_login"]));

	//push to showlist  part1
	showList_part1.push( new LBitmapData( result["game_blackboard"]));
	showList_part1.push( new LBitmapData( result["btn_nor"]));
	showList_part1.push( new LBitmapData( result["btn_right"]));
	showList_part1.push( new LBitmapData( result["btn_error"]));
	build_background();
}
function build_background(){
//showlist to append show
	back_Bitmap = new LBitmap( showList_back[0]);
	back_Bitmap.scaleX = global_width/showList_back[0].width;
	back_Bitmap.scaleY = global_height/showList_back[0].height;
	back_layer.addChild( back_Bitmap);

	title_Bitmap = new LBitmap( showList_back[1]);
	title_Bitmap.scaleX = global_width/showList_back[1].width*0.85;
	title_Bitmap.scaleY = global_height/showList_back[1].height*0.14;
	title_Bitmap.x = global_width*0.07;
	title_Bitmap.y = global_height*0.23;
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

	btn_login_Bitmap = new LBitmap( showList_back[4]);
	btn_login_Bitmap.scaleX = global_width/showList_back[4].width*0.32;		//w
	btn_login_Bitmap.scaleY = global_height/showList_back[4].height*0.11;	//h
	btn_login_Bitmap.x = global_width*0.35;		//xi
	btn_login_Bitmap.y = global_height*0.64;	//yi
	back_layer.addChild( btn_login_Bitmap);
	//##############################################################################################
}
function startPart1(){
	back_layer.removeChild( btn_login_Bitmap);
	back_layer.removeChild( background_board_Bitmap);

	game_blackboard_Bitmap = new LBitmap( showList_part1[0]);
	game_blackboard_Bitmap.scaleX = global_width/showList_part1[0].width*0.88;		//w
	game_blackboard_Bitmap.scaleY = global_height/showList_part1[0].height*0.27;	//h
	game_blackboard_Bitmap.x = global_width*0.05;		//xi
	game_blackboard_Bitmap.y = global_height*0.15;	//yi
	back_layer.addChild( game_blackboard_Bitmap);

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

//add option mouse event listener


}

function startPart2(){
	back_layer.removeChild( game_blackboard_Bitmap);
	back_layer.removeChild( option1);
	back_layer.removeChild( option2);
	back_layer.removeChild( option3);
	back_layer.removeChild( option4);
}





































function display_global_now(){
	if( ( statusA !=4 || statusB !=4) && mark_collide == 1){
		statusB = 4;
		statusA = 4;
	}
	if( sum_x == 24){
		statusA = 3;
	}

	if( start_game == 0 && white_layer.y != 50){
		back_layer.visible = false;
		white_layer.y = 50;
		point_white = 0;
		white_layer.addEventListener( LEvent.ENTER_FRAME, display_white_now);
	}else{
		if( back_layer.visible == false && start_game == 1){
			back_layer.visible = true;
			white_layer.removeAllChild();
			white_layer.removeEventListener( LEvent.ENTER_FRAME, display_white_now);
			sound.play( 0, Infinity);
		}
	}
}
function display_white_now(){
	point_white ++;
	if(point_white < parseInt( preStart_json['s'])){
		point_white = parseInt( preStart_json['s']);
	}
	if(point_white > parseInt( preStart_json['t'])){
		point_white = parseInt( preStart_json['s']);
	}
	var now_showBitmap = new LBitmap( showListA[ point_white]);
	white_layer.removeAllChild();
	white_layer.addChild( now_showBitmap);
}

//==============================
function sms (str) {
  var min = str.split(':')[0];
  var sed = str.split(':')[1];
  var ans =(min * 60 + sed) * 1000;
  return ans;
}
function controller_frame(){
	if( start_game == 1){
		startPart1();
		start_game = 0;
	}
	if( start_game == 2){
		startPart2();
		start_game = 0;
	}
	if( start_game == 3){
		startPart3();
		start_game = 0;
	}
	if( start_game == 4){
		startPart4();
		start_game = 0;
	}
}
//###########%%%%%%%================================MAIN START=================#####################%%%%%%%%%
function main(){
	$(" #mylegend").width( global_width);
	$(" #mylegend").height( global_height);
	$(" #mylegend").css( "margin", "0 auto");
	back_layer = new LSprite();
	addChild( back_layer);
//	back_layer.visible = false;
	back_layer.addEventListener( LEvent.ENTER_FRAME, controller_frame);
	load_images( load_complete);  //load 1back->2A->3B
}
//=======================================DATA============
showList_back = new Array();
showList_part1 = new Array();
start_game = 0;		// 0:not start or starting  1 :start_part1 now  2:start part2now
//=======================================DATA END ===========
