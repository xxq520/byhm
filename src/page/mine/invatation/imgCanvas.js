export default function(obj){

    let bg = $(obj).find('.proxy_bg');
   
    let can = document.createElement('canvas');
    let cxt = can.getContext('2d');
    let b = 2;
    can.width = bg.width()*b;
    can.height = bg.height()*b;
  
      var image = new Image();

    	image.src = can.toDataURL("image/png");
      return image;
      console.log(can.toDataURL("image/png"))
};

