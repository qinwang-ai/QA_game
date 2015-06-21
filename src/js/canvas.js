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


function load_back_images( imgs_count, load_char_C){
	var json_str = "([";
	json_str += '{"name":"'+'back'+'","path":'+'"images/back.png"},';
	json_str += '{"name":"'+'home_title'+'","path":'+'"images/home_title.png"},';
	json_str += '{"name":"'+'home_btn_star'+'","path":'+'"images/home_btn_star.png"},';
	json_str+='])';
	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_back_complete( result){
	//push to showlist
	showList_back.push( new LBitmapData( result["back"]));
	showList_back.push( new LBitmapData( result["home_title"]));
	showList_back.push( new LBitmapData( result["home_btn_star"]));
	//display background

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
	start_Bitmap.scaleX = global_width/showList_back[2].width*0.77;		//x
	start_Bitmap.scaleY = global_height/showList_back[2].height*0.26;	//y
	start_Bitmap.x = global_width*0.15;		//xi
	start_Bitmap.y = global_height*0.56;	//yi
	start_layer.addChild( start_Bitmap);
	back_layer.addChild( start_layer);
	start_layer.addEventListener( LMouseEvent.MOUSE_DOWN, startgame);
}
function startgame( event){
	back_layer.removeChild( start_layer);
	back_layer.removeChild( title_Bitmap);
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

function load_char_imagesA( pre, imgs_count, load_char_C){
	var json_str = "([";
	for (var i = 0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = pre+'_'+str + '.png';
		json_str += '{"name":"'+str+'","path":'+'"images/'+pre+'/'+str+'"},';
	}
	json_str+='])';
	var imgs_DATA = eval(json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

function load_char_imagesB( pre, imgs_count, load_char_C){
	var json_str = "([";
	for (var i = 0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = pre+'_'+str + '.png';
		json_str += '{"name":"'+str+'","path":'+'"images/'+pre+'/'+str+'"},';
	}
	json_str+='])';
	var imgs_DATA = eval( json_str);
	loadingLayer = new LoadingSample3();
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer.setProgress(progress)},load_char_C);
}

//==============================
function sms (str) {
  var min = str.split(':')[0];
  var sed = str.split(':')[1];
  var ans =(min * 60 + sed) * 1000;
  return ans;
}
roll_Array = new Array();
flag_again = new Array();
sum_x  =0;
function roll_finger(){
	var phore_T =  1.5*1000+10;
	var pre_phore_T = 1.5*1000+100;
	sound_current = Math.floor(sound.data.currentTime*1000);
	for( var x in gesture_json){
		var x_t = sms( gesture_json[x].time);
		if ( sound_current < x_t-phore_T && sound_current>x_t - pre_phore_T&& flag_again[ gesture_json[ x].index]===undefined){
			sum_x ++;
			var rolling_Bitmap = new LBitmap( showList_finger[ gesture_json[ x].type]);
			now_index = gesture_json[ x].index;
			roll_layer.addChild( rolling_Bitmap);
	 		roll_Array.push( rolling_Bitmap);
			flag_again[ gesture_json[ x].index] = true;
			break;
		}
		//console.log( gesture_json[x].time);
	}
	if( roll_Array.length > 0 ){
		for( var x in roll_Array){
			roll_Array[x].x -= 20;
		}
		if( roll_Array[0].x < -950){
			roll_layer.removeChild( roll_Array[0]);
			roll_Array.shift();
		}

	}
}

var blood_Bitmap_nowAX = 107;
var blood_Bitmap_nowAY = 86;

var blood_Bitmap_nowBX = 560;
var blood_Bitmap_nowBY = 86;
function building_blood(){
	// blood
	blood_layer = new LSprite();
	blood_Bitmap = new LBitmap( showList_back[2]);
	blood_layer.addChild( blood_Bitmap);
	back_layer.addChild( blood_layer);
	blood_layer.x = 90;
	blood_layer.y = 70;
//A
	blood_Bitmap_nowA = new LBitmap( showList_blood[ blood_A]);
	blood_Bitmap_nowA.x = blood_Bitmap_nowAX;
	blood_Bitmap_nowA.y = blood_Bitmap_nowAY;
	blood_Bitmap_nowA.scaleX = -1;
	back_layer.addChild( blood_Bitmap_nowA);
//B
	blood_Bitmap_nowB = new LBitmap( showList_blood[ blood_B]);
	blood_Bitmap_nowB.x = blood_Bitmap_nowBX;
	blood_Bitmap_nowB.y = blood_Bitmap_nowBY;
//	blood_Bitmap_nowB.scaleY = -1;
	back_layer.addChild( blood_Bitmap_nowB);
	//blood ----------------end
}
// include rolling-----------------------------------------------------BACK IMAGE BUILD
bwTT_isw = 0;
function load_char_completeA(result){
	imglistA = result;
	load_char_imagesB( "Hyd", imgs_countB, load_char_completeB);		//load B after load A COMPLETE
	game_initA( imgs_countA);
}

function load_char_completeB(result){
	imglistB = result;
	game_initB( imgs_countB);
	white_layer.addEventListener( LEvent.ENTER_FRAME, display_global_now); //load all images complete
}
//========================================LOAD END==============

//=======================================DATA============
showListA = new Array();
showListB = new Array();
showList_back = new Array();
showList_blood = new Array();
showList_finger = new Array();
imglistA = {};
imglistB = {};
ko_music = 0;
forward_width = 40;					//forward attack width
//imgs_countA = 230;
imgs_countA = 230;
imgs_countB = 650;
init_margin_leftA = -100;
init_margin_leftB = 300;
A_layer_margin_Top = 25;//85;
B_layer_margin_Top = 0;//60;
A_attacking_times_MAX = 30;
B_attacking_times_MAX = 30;
blood_A = 9;
blood_B = 9;
imgs_back_count = 2;
mark_collide = 0;					//collide mark
statusA = -1;		//-1:start 0:prepare 1:true 2:attack 3:success 4:failure
statusB = -1;		//-1:start 0:prepare 1:true 2:attack 3:success 4:failure
start_game = 0;		// 0 not start  1:start
//=======================================DATA END ===========

function game_initA( imgs_count){
	// imglist->showList->now_showbitmap
	for(var i=0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Asu_"+str + '.png';
		showListA.push( new LBitmapData( imglistA[ str]));
	}

	//display_char
	char_layerA = new LSprite();
	back_layer.addChild( char_layerA);
	char_layerA.x = init_margin_leftA;
	char_layerA.y = A_layer_margin_Top;
	display_charA( imgs_count);
}

function game_initB( imgs_count){
	// imglist->showList->now_showbitmap
	for(var i=0;i<=imgs_count;i++){
		var str = i.toString();
		if(i<10)str = '0'+str;
		if(i<100)str = '0'+str;
		str = "Hyd_"+str + '.png';
		showListB.push( new LBitmapData( imglistB[ str]));
	}
	//display_char
	char_layerB = new LSprite();
	back_layer.addChild( char_layerB);
	char_layerB.x = init_margin_leftB;
	char_layerB.y = B_layer_margin_Top;
	display_charB( imgs_count);
}
//###########%%%%%%%================================MAIN START=================#####################%%%%%%%%%
function main(){
	$(" #mylegend").width( global_width);
	$(" #mylegend").height( global_height);
	$(" #mylegend").css( "margin", "0 auto");
	back_layer = new LSprite();
	addChild( back_layer);
//	back_layer.visible = false;
	load_back_images( imgs_back_count, load_back_complete);  //load 1back->2A->3B
}
//================================================end=================

//================================================display char=========
function display_char_nowA(){
	char_layerA.removeAllChild();
	var now_showBitmap = new LBitmap( showListA[ point_A]);
	char_layerA.addChild( now_showBitmap);
	point_A ++;
	if( statusA == -1){
		if( point_A < parseInt( statusA_json['start'][r_num_A]['s'])-2){
			point_A = parseInt( statusA_json['start'][r_num_A]['s'])-2;
		}
		if(point_A > parseInt( statusA_json['start'][r_num_A]['t'])){
			point_A = parseInt( statusA_json['start'][r_num_A]['s']);
		}
	}

	if( statusA == 0){
		char_layerA.x = init_margin_leftA;
		if(point_A < parseInt( statusA_json['prepare']['s'])){
			point_A = parseInt( statusA_json['prepare']['s']);
		}
		if(point_A > parseInt( statusA_json['prepare']['t'])){
			point_A = parseInt( statusA_json['prepare']['s']);
		}
	}
	// finger ok
	if( statusA == 1){
		if(point_A < parseInt( statusA_json['true'][r_num_A]['s'])){
			point_A = parseInt( statusA_json['true'][r_num_A]['s']);
		}
		if(point_A > parseInt( statusA_json['true'][r_num_A]['t'])){
			if( A_attacking != 1 && point_A == parseInt( statusA_json['true'][r_num_A]['t'])+1){
				statusA = 0;
			}
			point_A = parseInt( statusA_json['true'][r_num_A]['s']);
		}
		// attack done
		if( A_attacking == 1){
			if( A_attacking_times == A_attacking_times_MAX)
			{
				A_attacking = 0;
				statusA = 0;
				statusB = 0;
			}else
				A_attacking_times ++;
		}
	}
	//forwarding attack
	if( statusA == 2){
		if( point_A == parseInt( statusA_json['attack'][r_num_A]['t'])+1){
			A_attacking_times = 0;
			A_attacking = 1;
			statusA = 1;
			statusB = 4;
			sub_blood_B();
			r_num_B = Math.floor(Math.random()*2);
		}else{
			if( point_A < parseInt( statusA_json['attack'][r_num_A]['s'])){
				point_A = parseInt( statusA_json['attack'][r_num_A]['s']);
			}

			if( point_A > parseInt( statusA_json['attack'][r_num_A]['t'])){
				point_A = parseInt( statusA_json['attack'][r_num_A]['s']);
			}
			char_layerA.x +=forward_width;
		}
	}

	//success
	if( statusA == 3){					//special detail
		if(point_A < parseInt( statusA_json['success'][r_num_A]['s'])){
			if( final_A_success == 1 && r_num_A == 1){
				if( point_A > parseInt( statusA_json['success'][r_num_A]['t2']))
					point_A = parseInt( statusA_json['success'][r_num_A]['t2']);
			}else
				point_A = parseInt( statusA_json['success'][r_num_A]['s']);
		}
		if(point_A > parseInt( statusA_json['success'][r_num_A]['t'])){
			if( final_A_success == 1 && r_num_A == 1){
				if( point_A == parseInt( statusA_json['success'][r_num_A]['t'])+1)
					point_A = parseInt( statusA_json['success'][r_num_A]['s2']);
			}
			else
				point_A = parseInt( statusA_json['success'][r_num_A]['s']);
		}
		back_layer.removeChild( blood_Bitmap_nowB);
		statusB = 4;
		final_A_success = 1;
		r_num_B = 0;		//SUCCESS_ POSITION
		if( ko_music != 1){
			sound.close();
			ko_Bitmap.visible = true;
			sound_ok.play();
			ko_music = 1;
		}
	}
	//failure
	if( statusA == 4){					//special detail
		if(point_A < parseInt( statusA_json[ 'failure'][r_num_A][ 's'])){
			point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 's']);
		}
		if(point_A > parseInt( statusA_json[ 'failure'][r_num_A][ 't'])){
			if( point_A == parseInt( statusA_json[ 'failure'][ r_num_A]['t']) + 1 && mark_collide == 1){
				statusB = 0;
				statusA = 0;
				mark_collide = 0;
			}

			if( point_A == parseInt( statusA_json[ 'failure'][ r_num_A]['t']) + 1 && final_B_success == 1){
				point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 't']);
			}else
				point_A = parseInt( statusA_json[ 'failure'][r_num_A][ 's']);
		}
	}
}
function display_charA(){
	point_A = 0;
	final_A_success = 0;
	A_attacking = 0;
	A_start = 0;
	r_num_A = Math.floor(Math.random()*2);
	r_num_A = 1;
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowA);
}

function display_char_nowB(){
	char_layerB.removeAllChild();
	var now_showBitmap = new LBitmap( showListB[ point_B]);
	now_showBitmap.scaleX = -1;
	char_layerB.addChild( now_showBitmap);
	point_B ++;
	if( statusB == -1){
		if( point_B < parseInt( statusB_json['start'][r_num_B]['s'])-2){
			point_B = parseInt( statusB_json['start'][r_num_B]['s'])-2;
		}
		if(point_B > parseInt( statusB_json['start'][r_num_B]['t'])){
			point_B = parseInt( statusB_json['start'][r_num_B]['s']);
		}
	}

	if( statusB == 0){
		char_layerB.x = init_margin_leftB;
		if(point_B < parseInt( statusB_json['prepare']['s'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
		if(point_B > parseInt( statusB_json['prepare']['t'])){
			point_B = parseInt( statusB_json['prepare']['s']);
		}
	}
	// finger ok
	if( statusB == 1){
		if(point_B < parseInt( statusB_json['true'][r_num_B]['s'])){
			point_B = parseInt( statusB_json['true'][r_num_B]['s']);
		}
		if(point_B > parseInt( statusB_json['true'][r_num_B]['t'])){
			if( B_attacking != 1 && point_B == parseInt( statusB_json['true'][r_num_B]['t'])+1){
				statusB = 0;
			}
			point_B = parseInt( statusB_json['true'][r_num_B]['s']);
		}
		if( B_attacking == 1){
			if( B_attacking_times == B_attacking_times_MAX)
			{
				B_attacking = 0;
				statusB = 0;
				statusA = 0;
			}else
				B_attacking_times ++;
		}
	}
	//forwarding attack
	if( statusB == 2){
		if( point_B == parseInt( statusB_json['attack'][r_num_B]['t'])+1){
			B_attacking_times = 0;
			B_attacking = 1;
			statusB = 1;
			statusA = 4;
			sub_blood_A();
			r_num_A = Math.floor(Math.random()*2);
		}else{
			if( point_B < parseInt( statusB_json['attack'][r_num_B]['s'])){
				point_B = parseInt( statusB_json['attack'][r_num_B]['s']);
			}

			if( point_B > parseInt( statusB_json['attack'][r_num_B]['t'])){
				point_B = parseInt( statusB_json['attack'][r_num_B]['s']);
			}
			char_layerB.x -=forward_width;
		}
	}

	//success
	if( statusB == 3){					//special detail
		if(point_B < parseInt( statusB_json['success'][r_num_B]['s'])){
			point_B = parseInt( statusB_json['success'][r_num_B]['s']);
		}
		if(point_B > parseInt( statusB_json['success'][r_num_B]['t'])){
			if( point_B == parseInt( statusB_json['success'][r_num_B]['t'])+1)
				point_B = parseInt( statusB_json['success'][r_num_B]['t']-2);
			else
				point_B = parseInt( statusB_json['success'][r_num_B]['s']);
		}
		back_layer.removeChild( blood_Bitmap_nowA);
		statusA = 4;
		final_B_success = 1;
		r_num_A = 1;
		if( ko_music != 1){
			ko_music = 1;
			ko_Bitmap.visible = true;
			sound.close();
			sound_ok.play();
		}
	}
	//failure
	if( statusB == 4){					//special detail
		if(point_B < parseInt( statusB_json[ 'failure'][r_num_B][ 's'])){
			point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 's']);
		}
		if(point_B > parseInt( statusB_json[ 'failure'][r_num_B][ 't'])){
			if( point_B == parseInt( statusB_json[ 'failure'][ r_num_B][ 't']) + 1 && mark_collide == 1){
				statusB = 0;
				statusA = 0;
				mark_collide = 0;
			}
			if( point_B == parseInt( statusB_json[ 'failure'][ r_num_B]['t']) + 1 && final_A_success == 1){
							point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 't']);
			}else
				point_B = parseInt( statusB_json[ 'failure'][r_num_B][ 's']);
		}
	}
}
function display_charB(){
	point_B = 0;
	final_B_success = 0;
	B_attacking = 0;
	B_start = 0;
	r_num_B = Math.floor(Math.random()*2);
	back_layer.addEventListener( LEvent.ENTER_FRAME, display_char_nowB);
}
function game_over(){

}
function sub_blood_B(){
	blood_B --;
	back_layer.removeChild( blood_Bitmap_nowB);
	blood_Bitmap_nowB = new LBitmap( showList_blood[ blood_B]);
	back_layer.addChild( blood_Bitmap_nowB);
	blood_Bitmap_nowB.x = blood_Bitmap_nowBX;
	blood_Bitmap_nowB.y = blood_Bitmap_nowBY;
}

function sub_blood_A(){
	blood_A --;
	back_layer.removeChild( blood_Bitmap_nowA);
	blood_Bitmap_nowA = new LBitmap( showList_blood[ blood_A]);
	back_layer.addChild( blood_Bitmap_nowA);
	blood_Bitmap_nowA.x = blood_Bitmap_nowAX;
	blood_Bitmap_nowA.y = blood_Bitmap_nowAY;
	blood_Bitmap_nowA.scaleX = -1;
}
