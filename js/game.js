function Game(canvas) {
  this.started = false;
  this.num_lines = 2;
  this.scale = 1;
  this.alpha = 1;
  this.fade1 = 0;
  this.fade2 = 0;
  this.resized = true;
  this.start_time = 0;
  this.stage = 1;
  console.log('start loading...')
  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  
  //Canvas size
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  console.log("canvas: "+window.innerWidth+", "+window.innerHeight)
  //

  this.font_size = Math.round(this.canvas.width/8);
  this.scaled_width = (this.canvas.width/this.scale)/2;
  this.scaled_height = (this.canvas.height/this.scale)/2;

  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;
  
  var src = null;

  /*
  //https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q=music&category=Music&format=5&orderby=viewCount
  //https://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=jsonc
  //https://gdata.youtube.com/feeds/api/users/disney/uploads?v=2&alt=jsonc
  //https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q=music&category=Music&format=6&orderby=viewCount
  $.ajax({
    url: "https://gdata.youtube.com/feeds/api/users/DisneyJuniorUK/uploads?v=2&alt=jsonc",
    dataType: "json"
  }).done(function(data) {
    //alert('We are going to get a random video from a list of '+total+' videos from Disney');
    var total = data.data.items.length;
    //var id = data.feed.entry[0].id.$t.slice(data.feed.entry[0].id.$t.indexOf('video:') + 6);
    //var i = Math.round(Math.floor((Math.random()*10)));
    var i = Math.round(Math.random()*total);  
    console.log('items: '+total+', sorted:'+i)  
    //alert('i:'+i);
    //alert(i);
    var id = data.data.items[i].id;
    alert(id);
  
  var videos = Array("P0-MnVHHN6k","8MqgzPRmf8M","RxEob-v8rIw","WvqmAkbQvGU","9b6puXlbB6Y","cv4hPHQb8q4","GtUD2pv4vu4","zEIW473JXSg","7F6utRdt7no","hGoGyDtxkXM","xwULagPK-L4","nOOVb6hctM4","8cUKTiorb6w","6umzWF8pbL8","zMcOyuBeus8","csiZSFPvKlg","yQ-dU1LI4Fs","GMAILkCK7p4","dJ4Nnr0MXKY","IkVUfTOBHlE","37C_ool9gtM");
  var total = videos.length;
  var i = Math.round(Math.random()*total);
  var id = videos[i];
  //id = "GtUD2pv4vu4";
  //id = "Zb9KnXNYCiQ";
  //id = "SyrO83x7g-E";
  //id = "Ymwe4DB_HsU";
  //id = "-3y-6LDArp0";
  //id = "RxEob-v8rIw";
  id = "zEIW473JXSg";
  
  this.videoId = id;
  
  $.ajax({
    url: "http://www.youtube.com/get_video_info?video_id="+id,
    dataType: "text"
  }).done(function(data) {
    data = data.replace('url%3D', '');
    data = decodeURIComponent((data+'').replace(/\+/g, '%20'));
    var vars = [], hash;
    var hashes = data.slice(data.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = unescape(hash[1]);
    }
    src = vars["url_encoded_fmt_stream_map"];
    if(typeof(src) == "undefined"){
      if(Modernizr.video.ogg)
        src = "video/BigBuckBunny_640x360.ogv";
      else if(Modernizr.video.h264)
        src = "video/BigBuckBunny_640x360.mp4";
    }else if(!Modernizr.video.ogg && Modernizr.video.h264){
      src = "video/BigBuckBunny_640x360.mp4";
    }
  */

    if(Modernizr.video.ogg)
      src = "video/BigBuckBunny_640x360.ogv";
    else if(Modernizr.video.h264)
      src = "video/BigBuckBunny_640x360.mp4";
    else if(!Modernizr.video.ogg && Modernizr.video.h264)
      src = "video/BigBuckBunny_640x360.mp4";

    console.log('Video src: '+src);

    this.assets = Array({
        type: "video",
        src: src,
        slug: "video"
      },{
        type: "audio",
        src: "audio/final/drip",
        slug: "drip"
      },{
        type: "audio",
        src: "audio/final/twang2",
        slug: "twang"
      },{
        type: "audio",
        src: "audio/final/chimes",
        slug: "chimes"
      }
    );
    
    this.items_to_load = this.assets.length;
    loadAssets(this, this.assets);

    console.log(this.loaded_items+' assets loaded');

  //});

}

Game.prototype.init = function(){
  this.video.pause();
  //IMAGE SIZE
  /*
  if((window.innerHeight <= 80)||(window.innerWidth <= 230)){
    this.context.scale(0.05,0.05);
    this.scale = 0.05;
  }else if((window.innerHeight <= 95)||(window.innerWidth <= 230)){
    this.context.scale(0.1,0.1);
    this.scale = 0.2;
  }else if((window.innerHeight <= 150)||(window.innerWidth <= 330)){
    this.context.scale(0.2,0.2);
    this.scale = 0.2;
  }else if((window.innerHeight <= 300)||(window.innerWidth <= 430)){
    this.context.scale(0.5,0.5);
    this.scale = 0.5;
  }else if((window.innerHeight <= 400)||(window.innerWidth <= 530)){
    this.context.scale(0.6,0.6);
    this.scale = 0.6;
  }else if((window.innerHeight <= 500)||(window.innerWidth <= 630)){
    this.context.scale(0.8,0.8);
    this.scale = 0.8;
  }else{
    this.context.scale(1,1);
    this.scale = 1;
  }
  */

  this.loaded = true;
  this.pieces = new Array();
  this.holders = new Array();
  this.placed_pieces = new Array();
  this.moving = true;
  this.selected = null;
  this.over = null;
  this.is_over = false;

  this.img_width = this.video.videoWidth;
  this.img_height = this.video.videoHeight;
  this.num_pieces = this.num_lines * this.num_lines;
  this.piece_width = this.img_width / this.num_lines;
  this.piece_height = this.img_height / this.num_lines;
  console.log('size: '+this.img_width+','+this.img_height);

  if(this.resized)
    this.apply_scale();
  
  //y = window.innerHeight*1.2/this.video.videoHeight
  
  //x = this.video.videoWidth/(this.video.videoWidth*/window.innerWidth);
  //y = this.video.videoHeight/(this.video.videoHeight*150/yy);
  
  //alert(s);
  //var s = Math.min(x,y);
  //alert(s);
  //this.context.scale(s,s);
  //this.scale = s;

  console.log('scale: '+this.scale)

  this.remaining_time = this.num_pieces*(10/this.stage);
  this.time_to_complete = this.remaining_time;
  this.clock_interval = null;
  this.mouse = new Mouse(this);

  this.auto_snap = true;

  this.placeHolders();
  this.placePieces();
  
  this.video.play();
}

Game.prototype.placePieces = function(){
  for(i=0; i<this.num_pieces; i++){
    x = Math.floor(Math.random()*this.canvas.width/this.scale);
    y = Math.floor(Math.random()*this.canvas.height/this.scale);
    temp = new Piece(
      i+1,
      this,
      this.piece_width,
      this.piece_height,
      x,
      y,
      new Point2D(this.x,this.y),
      new Point2D(this.holders[i].x,this.holders[i].y),
      this.holders[i],
      true,
      false
    );
    this.pieces.push(temp);
    console.log('pieces array length>>'+this.pieces.length);
  }
  if(this.chimes.currentTime != 0)
    this.chimes.currentTime = 0;
  this.chimes.play();
}

Game.prototype.placeHolders = function(){
  var pieces = 1;
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
  offsety += 40;
  for(var i = 0; i < this.num_lines; ++i) {
    for(var j = 0; j < this.num_lines; ++j) {
      temp = new Holder(
        pieces,
        this,
        j*this.piece_width+offsetx+this.piece_width/2,
        i*this.piece_height+offsety+this.piece_height/2,
        i,
        j,
        false
      );
      this.holders.push(temp);
      console.log('holders array length>>'+this.holders.length+' '+temp.x+','+temp.y);
      pieces++;
    }
  }
}

Game.prototype.render = function() {
  //bg
  this.context.fillStyle = "rgba(0, 0, 0, 1)";
  this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
  
  this.draw_bg();

  //this.draw_menu();

  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      var t = setTimeout("game.init();", 1500);
      //this.init();
    }else{
      this.draw_loading();
    }
  }
  else{
    //HOLDERS
    for(var i = 0; i < this.holders.length; i++){
      holder = this.holders[i];
      holder.draw();
    }
  
    //PIECES
    var not_placed = new Array();
    var over = false;
    for(var i = 0; i < this.pieces.length; i++){
      piece = this.pieces[i];
      if(!over && piece.mouse_is_over())
        over = true;
      if(!piece.placed)
        not_placed.push(piece);
      else if(piece != this.selected)
        piece.draw();
        
      if(!this.selected){
        if((!this.over)||(this.over.id < piece.id)||(piece.mouse_is_over())){
          if(piece.mouse_is_over() && !piece.placed){
            this.over = piece;
          }
        }
      }
        
    }
    for(var i = 0; i < not_placed.length; i++){
      not_placed[i].draw();
    }
    if(this.selected)
      this.selected.draw();
  
    if(!over)
      this.over = null;
    
    //move
    if((this.selected != null)&&(this.selected.moveble)){
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }

    //REMAINING TIME
    this.draw_remaining();

    //Game Over
    if(this.remaining_time <= 0){
      this.remaining_time = 0;
      window.m.pauseGame();
      if(confirm('Timeup! Try again')){
        this.is_over = false;
        this.init();
        window.m.startGame();
      }
    }
    else{
      if(this.is_over){
        window.m.pauseGame();
        $('#stage').html("Stage "+this.stage+" completed!");
        $('#pieces').html(this.num_lines*this.num_lines+" pieces in "+(this.time_to_complete-this.remaining_time)+"s");
        $('#modal-success').modal();
        /*
        if(confirm('Yes, you did it! Try the next level')){
          this.is_over = false;
          this.num_lines++;
          this.init();
          window.m.startGame();
        }
        */
      }else{
        if(this.num_pieces == this.placed_pieces.length){
          this.is_over = true;
        }
      }
    }
  }

  //DEBUG
  /*
  if(this.debug){
    document.getElementById('mx').value = this.mouse.x;
    document.getElementById('my').value = this.mouse.y;
  
    document.getElementById('hx').value = this.holders[0].x;
    document.getElementById('hy').value = this.holders[0].y;
    document.getElementById('hx2').value = this.holders[1].x;
    document.getElementById('hy2').value = this.holders[1].y;
  
    document.getElementById('moving').value = this.mouse.moving;
    if(this.over)
      document.getElementById('over').value = this.over.id;
    else
      document.getElementById('over').value = "";
    if(this.selected)
      document.getElementById('selected').value = this.selected.id;
    else
      document.getElementById('selected').value = "";
  
    document.getElementById('p').value = this.num_pieces;
    document.getElementById('l').value = this.num_lines;
    document.getElementById('pw').value = this.piece_width;
    document.getElementById('ph').value = this.piece_height;
  
    document.getElementById('pp').value = this.placed_pieces.length;
  }
  */

}

Game.prototype.draw_bg = function() {
  if(!this.scale) this.scale = 1;
  this.context.fillStyle = "rgba(125, 125, 125, 1)";
  this.context.fillRect(0,0,this.canvas.width/this.scale,this.canvas.height/this.scale);
  //puzzle images
  var offsetx = (this.canvas.width/this.scale)/2-(this.img_width)/2;
  var offsety = (this.canvas.height/this.scale)/2-(this.img_height)/2;
  offsety += 40;
  this.context.globalAlpha = 0.2;
  this.context.drawImage(this.video, offsetx, offsety, this.img_width, this.img_height);
}

Game.prototype.draw_remaining = function() {
  this.fade1 = this.fade1+(0.010*this.alpha);
  if(this.fade1 >= 0.6)
    this.alpha = -1;
  else if(this.fade1 <= 0.2)
    this.alpha = 1;
  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.strokeStyle = "rgba(0, 0, 0, 0.5)";
  this.context.lineWidth = 2;
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.fillText(game.remaining_time, this.scaled_width, this.scaled_height);
}

Game.prototype.draw_loading = function() {
  this.fade1 = this.fade1+0.025;
  if(this.fade1 >= 1)
    this.fade1 = 0;
  this.fade2 = 1-this.fade1;
  
  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade2+")";
  this.context.strokeStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.lineWidth = 5;
  this.context.strokeText("LOADING", this.scaled_width, this.scaled_height);
  this.context.fillText("LOADING", this.scaled_width, this.scaled_height);
  //console.log('loading...');
}

////////////////////////////////////////

Game.prototype.apply_scale = function(){  
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  console.log("window: " + window.innerWidth + ", " + window.innerHeight + " | video: "+this.img_width+", "+this.img_height);
  
  if(window.innerWidth <= this.img_width + (this.piece_width/2)){
    var w = ((this.img_width + (this.piece_width)) + this.canvas.width)/2;
    this.scale = this.canvas.width/w;
  }
  else if(window.innerHeight <= this.img_height + (this.piece_height/2)){
    var h = ((this.img_height + (this.piece_height*1.5))+160 + this.canvas.height)/2;
    this.scale = this.canvas.height/h;
  }else{
    this.scale = 1;
  }
  this.context.scale(this.scale,this.scale);
  console.log('scale: '+this.scale);  
  this.resized = false;
}

Game.prototype.clockTick = function() {
  this.remaining_time--;
}

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
}

Game.prototype.nextStage = function() {
  this.is_over = false;
  this.stage++;
  this.num_lines++;
  this.init();
  window.m.startGame();
}

/*
Game.prototype.loop = function(){
  var instance = this;
  instance.interval = requestAnimationFrame(instance.draw(), instance.canvas);
}
*/
