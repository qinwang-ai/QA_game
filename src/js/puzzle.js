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
    	showList_puzzle.push( new LBitmapData( result[ str]));
    }
    puzzle_game();
}

function puzzle_game(){
    xi = 0.08;
    yi = 0.22;
    w = 0.26;
    h = 0.16;
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
        xi += 0.29;
        if(xi > 0.66){
            xi = 0.08;
            yi += 0.16;
        }
        img_layer.addEventListener( LMouseEvent.MOUSE_DOWN, clickPicture);
        img_layer.name = i.toString();
    }
}

clickA = 0;
clickB = 0;
function clickPicture(i){
    //console.log( i.currentTarget.name, 'click');
    if( clickA == 0){
        clickA = i.currentTarget.name;
    }else{
        if( clickB == 0){
            clickB = i.currentTarget.name;
            swap();
        }
    }
}
function swap(){
    layerA = back_layer.getChildByName( clickA);
    layerB = back_layer.getChildByName( clickB);

    x = layerA.x;
    y = layerA.y;
    layerA.x = layerB.x;
    layerA.y = layerB.y;
    layerB.x = x;
    layerB.y = y;


    clickA = 0;
    clickB = 0;
}
