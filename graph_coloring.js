
var canvas = document.getElementById("canvas");
var context=canvas.getContext('2d');
var json=Object;
var vertex_number=-1;
var vertex_list=[];

function graphColor(){
	var colors=['#00FFFF','#0000FF','#FFD700','#DC143C','#A9A9A9','#FF1493']
	if(vertex_number!=-1){
		var check=[];
		for(var i=0;i<=vertex_number;i++){
			check[i]=-1;
		}
		fillColor(vertex_list[0][0],vertex_list[0][1],colors[0]);
		check[0]=0;

		for(var j=1;j<vertex_list.length;j++){
			if(check[j]==-1){
				var temp=json[j];
				var c=[];
				for(var k=0;k<temp.length;k++){
					if(check[temp[k]]!=-1){
						c.push(check[temp[k]]);
					}
				}
			}
			var flag_1=0;
			for(var i=0;i<colors.length && flag_1==0;i++){
					if(isInArray(i, c)==false){
						fillColor(vertex_list[j][0],vertex_list[j][1],colors[i]);
						check[j]=i
						flag_1=1;
					}
			}
			if(flag_1==0){
				alert('Maximum number of color is 6 !!! please redraw')
			}
		}	
	}
}
function fillColor(x,y,color_index){
	context.beginPath(); 		
	context.arc(x,y,16,0,2*Math.PI);
	context.fillStyle=color_index;
	context.fill();
	context.closePath();
			
}
function clearScreen(){
	
	context.clearRect(0,0,canvas.width,canvas.height);
	json={};
	vertex_number=-1;
	vertex_list=[];
}


function circle(){
	canvas.onmousedown=circleDown;
	function circleDown(event){
		var temp=[];
		var startX= event.x;
 		var startY=event.y;
 		fillColor(startX,startY,'black');
		temp.push(startX);
		temp.push(startY);
		vertex_list.push(temp);
		context.font="15px Georgia";
		context.fillStyle = '#FF6A6A';
		vertex_number++;
		context.fillText(vertex_number,startX+20,startY+2);
		json[vertex_number]=[];
		
	}
	
}
function line(){
	canvas.onmousedown=lineDown;
	function lineDown(event){
		startX=event.clientX - canvas.getBoundingClientRect().left; 
		startY=event.clientY - canvas.getBoundingClientRect().top;
 		canvas.onmousedown=lineDown2;
 		function lineDown2(event){
 					var endX=event.clientX - canvas.getBoundingClientRect().left; 
					var endY=event.clientY - canvas.getBoundingClientRect().top;
					var start_index;
		 			var end_index;
		 			var flag=0;
		 			for(var i=0;i<vertex_list.length;i++){
		 				var x=vertex_list[i][0];
		 				var y=vertex_list[i][1];
		 				var dx1=startX-x;
		 				var dy1=startY-y;
		 				var dx2=endX-x;
		 				var dy2=endY-y;
		 				
		 				if((dx1 * dx1 ) + (dy1 * dy1) < 256){
		 					start_index=i;
		 					flag++;
		 				}
		 				if((dx2 * dx2 ) + (dy2 * dy2) < 256){
		 					end_index=i;
		 					flag++;
		 				}
		 			}
		 			if(flag==2){
		 				json[start_index].push(end_index);
		 				json[end_index].push(start_index);
		 			}else{
		 				alert("This is not a valid edge!! draw a proper edge");
		 				 return canvas.onmousedown=lineDown;

		 			}
					context.beginPath();
		 			context.moveTo(startX,startY);
		 			context.lineTo(endX,endY);
		 			context.stroke();
		 			context.closePath();

		 			canvas.onmousedown=lineDown;
		}
	}
}
function check_connectivity(){
	function bsf(graph,start,path){
		var result=[start];
		var queue=[];
		var list=[]
		list=graph[start];
		
		while(true){
			for(var i=0;i<list.length;i++){
				if(isInArray(list[i], result)==false){
					result.push(list[i]);
					queue.push(list[i]);
				}
					
			}
			if(queue.length>0){
				x=queue.shift();
				list=json[x];
			}else{
				return result;
			}
		}
	}
	coloring(bsf(json,0,[]));

}
function isInArray(value, array) {
  		return array.indexOf(value) > -1;
}
function coloring(color_list){
	var flag=0;
	for(var i=0;i<vertex_list.length;i++){
		if(isInArray(i, color_list)==false){
			flag=1;
			x=vertex_list[i][0];
			y=vertex_list[i][1];
			fillColor(x,y,'#FF6A6A');
		}
	}
	if(flag==1){
		alert('The graph is not connected graph');
	}else{
		alert('The graph is a connected graph');
	}

}