$(document).ready(function(){
	app.c.init();
	app.v.init();
});

/////////////////////////////////////////////////////

app={m:{},v:{},c:{}};

/////////////////////////////////////////////////////

app.m.worldMap=false;
app.m.mapOptions=false;
app.m.sortableOptions={
	axis:"y"
}

/////////////////////////////////////////////////////

app.c.init=function(){
	app.c.initBounds();
	var dg=_.keys(app.m.digraphs);
	for (var i=0;i<dg.length;i++){app.m.countryData[dg[i]]=0;}
	app.c.reload();

	app.m.mapOptions={
		backgroundColor:"rgb(221,19,80)",
	    series: {
	      regions: [{
	        values: app.m.countryData,
	        attribute:"fill",
	        scale: ['#ffffff', '#000000']
	      }]
	  	}
	  };

};

app.c.initBounds=function(){
	app.m.bounds=davis.quickBox(0,0,$(document).innerWidth(),$(document).innerHeight()/2);
};


app.c.update=function(){
	var collection=[];
	$("li").each(function(){
		collection.push($(this).attr("id"));
	})
	console.log(collection);
	$.post('php/vote.php',
			{'list':collection},
			function(data,success){
				console.log(data);
				console.log(success);
			});
};

app.c.reload=function(){
	$.ajax({
		url:'php/read.php',
		data:{},
		dataType:'json',
		success:function(data,success){
		console.log(success);
		if (success=='success'){
			for (var i=0;i<data.length;i++){
				temp=data;
				console.log(data[i].country+" "+data[i].count);
				app.m.countryData[data[i].country]=data[i].count;
			}
		}
    	if (app.m.worldMap==false){app.m.worldMap=$('#world-map').vectorMap(app.m.mapOptions);}
	}
	});
	app.v.injectSortableOptions();
};

/////////////////////////////////////////////////////

app.v.init=function(){
	$("body").html(app.v.layout());
	//console.log(app.m.mapOptions);
    app.v.injectSortableOptions();
    $("ul#sortable").sortable(app.m.sortableOptions);
    $("input#vote").click(function(){
    	app.c.update();
    	app.c.reload();
    });
    $("input#reload").click(function(){
    	app.c.reload();
    });
};

app.v.injectSortableOptions=function(){
	var collection=_.sample(_.keys(app.m.countryData),3);
	var d="";
	for (var i=0;i<collection.length;i++){
		d+="<li id='"+collection[i]+"'>"+app.m.digraphs[collection[i]]+"</li>";
	}
	$("ul#sortable").html(d);
};

app.v.layout=function(){
	var d="";
 	d+="<div id='world-map' style='width: "+app.m.bounds.width+"px; height: "+app.m.bounds.height+"px'></div>";
 	d+="<div id='sort'>";
 	d+="<h2>sort these, best to worst.</h2>";
 		d+="<ul id='sortable'>";
 		d+="</ul>";
 	d+="</div>";
 	d+="<div class='button-wrapper'><input type='button' id='vote' value='vote'></input></div>";
 	d+="<div class='button-wrapper'><input type='button' id='reload' value='load another set'></input></div>";
	return d;
};