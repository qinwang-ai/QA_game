function load_puzzle_images(){
	var json_str = "([";

    for ( var i = 1;i<=9;i++){
        var str = "img"+puzzle_type+i.toString();
        var str_src = puzzle_type.toString()+'/'+puzzle_type.toString()+'_'+i.toString()+'.png';
	    json_str += '{"name":"'+str+'","path":'+'"images/puzzle/'+str_src+'"},';
    }
	json_str+='])';

	var imgs_DATA = eval( json_str);
	loadingLayer2 = new LoadingSample3();
//	back_layer.addChild( loadingLayer2);
	LLoadManage.load( imgs_DATA, function ( progress){
		loadingLayer2.setProgress(progress)},PushPart4_game
	);
}

function PushPart4_game( result){
    for ( var i = 1;i<=9;i++){
        var str = "img"+puzzle_type+i.toString();
//    	showList_puzzle.push( new LBitmapData( result[ str]));
    	showList_puzzle[ puzzle_order.indexOf( i)] = ( new LBitmapData( result[ str]));
    }
    puzzle_game();
}

function puzzle_game(){
    xi = 0.070;
    yi = 0.226;
    w = 0.284;
    h = 0.160;
    for(var i = 1;i<=9;i++){
        var img_layer = new LSprite();
    	var img_Bitmap = new LBitmap( showList_puzzle[i-1]);
    	img_layer.x = global_width*xi;		//xi
    	img_layer.y = global_height*yi;	//yi
    	img_Bitmap.scaleX = global_width/img_Bitmap.width*w;		//w
    	img_Bitmap.scaleY = global_height/img_Bitmap.height*h;	//h
    	img_layer.addChild( img_Bitmap);
//        puzzle_img_layers.push( img_layer);
        back_layer.addChild( img_layer);
        xi += w;
        if(xi > 0.638){
            xi = 0.070;
            yi += h;
        }
        img_layer.addEventListener( LMouseEvent.MOUSE_DOWN, clickPicture);
        img_layer.name = puzzle_order[ i-1];
    }
}

clickA = 0;
clickB = 0;
function clickPicture(i){
    //console.log( i.currentTarget.name, 'click');
    if( clickA == 0){
        clickA = i.currentTarget;
    }else{
        if( clickB == 0){
            clickB = i.currentTarget;
            swap();
        }
    }
}
function swap(){
    x = clickA.x;
    y = clickA.y;
    clickA.x = clickB.x;
    clickA.y = clickB.y;
    clickB.x = x;
    clickB.y = y;

    clickA = 0;
    clickB = 0;
}

function cmp(a,b){
    if( a.y==b.y){
        return a.x-b.x;
    }
    return a.y-b.y;
}
function calculate_answer(){
	btnOK_layer.mouseEnabled = false;
    var sortArray = new Array();
    // back_layer last 9 chlid is these layers
    for(var i = back_layer.childList.length-9;i<=back_layer.childList.length-1;i++){
       sortArray.push( back_layer.childList[i]);
    }
    sortArray.sort( cmp);
    answer = '';
    for( x in sortArray){
        answer += sortArray[x].name;
    }
//    console.log( answer);
	submitanswerToserver();
}
