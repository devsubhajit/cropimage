/* This code tree of functions are only recomanded for www.logomakr.com 's special plugin LOGO CROP and edit
 * Concept by Ryan Moore 
 * Author : Subhajit Das 
 *          subahjit@matrixnmedia.com / dascorp@live.in
 * Author's Comment : for any support in this functionality, mail here
 * Follow Readme.md document
 * all 600 will be 600 and 500 will be 500
 */

$(document).ready(function () {
    initialize();
});

function openEditor() {
    $(".popupContainer").addClass("showpopup");
    /*
     * First position should be in center
     */
    var cropimgWidth = $("#cropimage").width();
    var cropimgHeight = $("#cropimage").height();
    var xpos = (cropimgWidth - 200) / 2;
    var ypos = (cropimgHeight - 200) / 2;
    if (cropimgHeight < 200) {
        ypos = (200 - cropimgHeight) / 2;
    }
    $(".elementResizable").css({
        left: xpos + 'px', //(cropimgWidth / 2 - 100) + 'px',
        top: ypos + 'px' //(cropimgHeight / 2 - 100) + 'px',
    });
    $("#foreGroundPhoto").css({
        transform: "translateX(-" + xpos + "px) translateY(-" + ypos + "px)"
    });
    // cropEditor();
    $("body").css({
        overflow: 'hidden'
    });
};

function closeEditor() {
    $(".popupContainer").removeClass("showpopup");
    $("body").css({
        overflow: 'auto'
    });
}

/* Structure :: 
 * Main container follows three child container
 * 1. main image container
 * 2. overlay section
 * 3. jQuery UI section (that holds dragging and resizing)
 * Another container section where the cropped image is going to be placed
 * -------------------- Functions ------
 * 1. crop function
 * 2. erase function
 * 3. foreground image moving function to maintain the placement
 */
// -------- this section is for ready function ---------
$(".elementResizable").draggable({
    containment: "parent",
    drag: function () {
        var xValue = $(this).css('left');
        var yValue = $(this).css('top');
        $("#foreGroundPhoto").css({
            transform: "translateX(-" + xValue + ") translateY(-" + yValue + ")"
        });
    }
}).resizable({
    containment: "parent",
    aspectRatio: true,
    resize: function () {
        var xValue = $(this).css('left');
        var yValue = $(this).css('top');
        $("#foreGroundPhoto").css({
            transform: "translateX(-" + xValue + ") translateY(-" + yValue + ")"
        });
    }
});
var cropFlags = function () {
    this.round = false;
    this.ratio = false;
    this.eraser = false;
    this.brush = 10;
    this.brusShape = 'round';
    this.brushElem = document.createElement('div');
    this.brushElem.id = 'brushElem';
    this.colorTool = false;
    this.colorPallet = false;
    this.changeRound = function (value) {
        this.round = value;
        if (value === true) {
            $(".cropViewBox").css({
                borderRadius: '100%'
            });
        } else {
            $(".cropViewBox").removeAttr('style');
        }
    };
    this.changeRatio = function (value) {
        this.ratio = value;
    };
    this.resizable = function (value) {
        $(".elementResizable").css({
            width: 200 + 'px',
            height: 200 + 'px'
        });
        $(".elementResizable").resizable("destroy").resizable({
            aspectRatio: value,
            containment: "parent",
            resize: function () {
                var xValue = $(this).css('left');
                var yValue = $(this).css('top');
                $("#foreGroundPhoto").css({
                    transform: "translateX(-" + xValue + ") translateY(-" + yValue +
                        ")"
                });
            }
        });
    };
    this.activateEraser = function (value) {
        this.eraser = value;
        var overDiv = document.getElementById("overDiv");
        if (value === true) {
            this.brushElem.style.width = (this.brush * 2) + 'px';
            this.brushElem.style.height = (this.brush * 2) + 'px';
            if (this.brusShape === 'round') {
                this.brushElem.style.borderRadius = '100%';
            }
            document.getElementById("cropContain").appendChild(this.brushElem);
            overDiv.style.zIndex = 2;

        } else {
            if ($('#brushElem').length !== 0) {
                document.getElementById("cropContain").removeChild(this.brushElem);
            }
            overDiv.style.zIndex = 0;

        }

    };
    this.activeScale = function (value) {
        if (value === true) {
            $("#brushScale").removeClass('inActive');
        } else {
            $("#brushScale").addClass('inActive');
        }
    }
    this.changeBrushSize = function (value) {
        this.brush = value;
        this.brushElem.style.width = (this.brush * 2) + 'px';
        this.brushElem.style.height = (this.brush * 2) + 'px';
    };
    this.changeBrusShape = function (shape) {
        this.brusShape = shape;
    };
    this.activateColorPicker = function (value) {
        this.colorTool = value;
        if (value === true) {
            $("#overDiv").css({
                cursor: 'crosshair'
            });
            $(".colorPallet").removeClass('inActive');
        } else {
            $("#overDiv").css({
                cursor: 'auto'
            });
            $(".colorPallet").addClass('inActive');
        }
    };
    this.allColorPicker = function (value) {
        this.colorPallet = value;
        var palletCnt = document.getElementById('colorBoxCont');
        if (value === true) {
            /*
            create color pallet
            */

            var palletSrc = document.getElementById('colorSrc');
            var palletCanvas = document.createElement('canvas');
            var palletCtx = palletCanvas.getContext('2d');
            palletCanvas.id = 'palletCanvas';
            palletCanvas.width = palletSrc.width;
            palletCanvas.height = palletSrc.height;

            var swidth = palletSrc.naturalWidth;
            var sheight = palletSrc.naturalHeight;

            palletCtx.drawImage(palletSrc, 0, 0, swidth, sheight, 0, 0, palletSrc.width, palletSrc.height);
            palletCnt.appendChild(palletCanvas);

            palletCanvas.onclick = function (e) {
                var mainCanvas = document.getElementById('cropped');
                var mainCtx = mainCanvas.getContext('2d');

                var canvasOffset = $(palletCanvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
                var imageData = palletCtx.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
                var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
                var hexColor = '#' + dColor.toString(16);
                if (dColor === 0) {
                    hexColor = '#000000';
                }

                var image = new Image();
                image.onload = function () {
                    mainCtx.beginPath();
                    mainCtx.fillStyle = hexColor;
                    mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
                    mainCtx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
                };
                image.src = flag.dataUrl;
            }
        } else {
            var palletCanvas = document.getElementById('palletCanvas');
            palletCnt.removeChild(palletCanvas);
        }
    };
};
var flag = new cropFlags();

$("#circle").change(function (event) {
    if ($(this).is(':checked')) {
        flag.changeRound(true);
        flag.resizable(true);
    } else {
        flag.changeRound(false);
        flag.resizable(true);
    }
});
$("input[name='tools']").change(function () {
    if ($("#erasor").is(':checked')) {
        flag.activateEraser(true);
        flag.activeScale(true);
    } else {
        flag.activateEraser(false);
        flag.activeScale(false);
    }

    // ----------- Color Picker 
    if ($("#clPicker").is(':checked')) {
        // --- activate color picker 
        flag.activateColorPicker(true);
    } else {
        // --- deactivate color picker
        flag.activateColorPicker(false);
    }

});
// --------- all color picker 
$("#colorPallet").change(function () {
    if ($(this).is(':checked')) {
        flag.allColorPicker(true);
    } else {
        flag.allColorPicker(false);
    }
});
//  show crop tools and canvas editer
$("#undoimage").click(function () {
    //$("#cropConfirm").click();
    $("#cropContain").removeClass('active');
    $(".erasersTool").removeClass('active');
    $(".cropTool").show();
    //  deactive all tools, uncheck all radio buttons
    $("input:radio[name='tools']").each(function (i) {
        this.checked = false;
    });
    $(".colorPallet").addClass('inActive');
    if ($("#colorPallet").is(':checked')) {
        $("#colorPallet").click();
    }
    flag.activeScale(false);
    $(".elementResizable").css({
        opacity: 1
    });
    $("#cropContain").removeAttr('style');
    $("#cropContain").empty();
    // adding image attr value stored in flag
    $(".editorHolder").css({
        // height: (flag.imgHeight + 220) + 'px'
        height: (600 + 220) + 'px'
    });
    $(".canvasArea").css({
        // height: (flag.imgHeight + 40) + 'px'
        height: (600 + 40) + 'px'
    });
});
// diametre
$("#brushScale .scaleRange").change(function () {
    var thisVlaue = $(this).val();
    flag.changeBrushSize(thisVlaue);
});

window.onload = function () {
   
    $("#loader").addClass('inActive');

    (function () {
        //initialize();
        /*
         * Provide logo source
         */
        var staticLogoSize = 500;
        var sourceImg = $('#selectedLogo').attr('src');
        $("#cropimage").attr('src', sourceImg);
        /*
         * Canvas sections 
         * Create canvas and its attributes
         */
        var croppedContainer = document.getElementById("cropContain");
        var canvas = document.createElement("canvas");
        canvas.id = "cropped";
        canvas.style.border = "1px solid #000";
        var context = canvas.getContext("2d");
        /*
         * create div overlay for erasor and brusher 
         */
        var overDiv = document.createElement('div');
        overDiv.id = 'overDiv';
        /*
         * Image source and its attributes
         */
        var imgSrc = document.getElementById("cropimage");
        var imgWidth, imgHeight, margTop, margLeft;

        // var imgWidth = imgSrc.width;
        // var imgHeight = imgSrc.height;
        // Natural width of image
        var actualWidth = imgSrc.naturalWidth;
        var actualHeight = imgSrc.naturalHeight;
        /*
         * Movable image
         */
        $("#foreGroundPhoto").attr('src', $(imgSrc).attr('src'));
        // $("#foreGroundPhoto").width(imgWidth);
        // $("#foreGroundPhoto").height(imgHeight);

        /* Lets stylize the section
         * These fields are dynammic as per the image perspective  
         */
        if (actualWidth > actualHeight) {
            imgWidth = 600;
            imgHeight = (actualHeight * 600) / actualWidth; //imgSrc.height;
            let marginToVMiddle = (imgWidth - imgHeight) / 2;
            margTop = marginToVMiddle;
            margLeft = 0;

            $("#cropimage").css({
                marginTop: marginToVMiddle + 'px',
                width: imgWidth + 'px',
                height: 'auto'
            });
            $("#foreGroundPhoto").css({
                margin: marginToVMiddle + 20 + 'px 20px 20px'
                // margin:'20px'
            });
            $("#foreGroundPhoto").width(imgWidth);
            $("#foreGroundPhoto").height(imgHeight);

            $(".editorHolder").css({
                width: (imgWidth + 80) + 'px',
                // height: (imgHeight + 220) + 'px'
                height: (imgWidth + 220) + 'px'
            });
            $(".canvasArea").css({
                width: (imgWidth + 40) + 'px',
                //height: (imgHeight + 40) + 'px'
                height: (imgWidth + 40) + 'px'
            });

        } else {
            imgHeight = 600;
            imgWidth = (actualWidth * 600) / actualHeight; //imgSrc.width;

            let marginToHMiddle = (imgHeight - imgWidth) / 2;
            margTop = 0;
            margLeft = marginToHMiddle + 20;
            // console.log(' margLeft ', margLeft);
            $("#cropimage").css({
                marginLeft: marginToHMiddle + 'px',
                width: 'auto',
                height: imgHeight + 'px'
            });
            $("#foreGroundPhoto").css({
                margin: '20px 20px 20px ' + margLeft + 'px'
            });
            $("#foreGroundPhoto").width(imgWidth);
            $("#foreGroundPhoto").height(imgHeight);

            $(".editorHolder").css({
                width: (imgHeight + 80) + 'px',
                // height: (imgHeight + 220) + 'px'
                height: (imgHeight + 220) + 'px'
            });
            $(".canvasArea").css({
                width: (imgHeight + 40) + 'px',
                //height: (imgHeight + 40) + 'px'
                height: (imgHeight + 40) + 'px'
            });

        }


        // -------- back up image storage
        // var redrawCanvas = document.createElement('img');
        // redrawCanvas.id="redrawCanvas";



        $("#cropConfirm").click(function () {
            /*
             * Cropping area from jQuery UI
             * These section need to be genereated from click event
             */
            //--- adding imgWidth and imgHeight to flag
            flag.imgWidth = imgWidth;
            flag.imgHeight = imgHeight;
            flag.marginTop = margTop;
            flag.marginLeft = margLeft;

            var cropperArea = $(".elementResizable");
            var viewWidth = parseInt($(cropperArea).css("width"));
            var viewHeight = parseInt($(cropperArea).css("height"));

            canvas.width = staticLogoSize; //viewWidth;
            canvas.height = staticLogoSize; //viewHeight;

            // get overDiv's width and height
            overDiv.style.width = (staticLogoSize + 20) + 'px';
            overDiv.style.height = (staticLogoSize + 20) + 'px';

            var viewX = parseInt($(cropperArea).css("left")) - flag.marginLeft;
            var viewY = parseInt($(cropperArea).css("top")) - flag.marginTop;
            var sx = ((viewX * actualWidth) / imgWidth) - 20;
            var sy = ((viewY * actualHeight) / imgHeight) - 20;

            var swidth = (viewWidth * actualWidth) / imgWidth;
            var sheight = (viewHeight * actualHeight) / imgHeight;

            // checking flag
            if (flag.round === true) {
                // context.arc(viewWidth / 2, viewWidth / 2, viewWidth / 2, 0, Math.PI * 2, true);
                context.arc(staticLogoSize / 2, staticLogoSize / 2, staticLogoSize / 2, 0, Math.PI * 2, true);
                context.clip();
            }
            //context.drawImage(imgSrc,sx, sy, swidth, sheight, 0, 0, viewWidth, viewHeight);
            //context.drawImage(imgSrc, sx, sy, swidth, sheight, 0, 0, staticLogoSize, staticLogoSize);
            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Mac') != -1 && navigator.vendor.indexOf('Apple') != -1) {
                console.log('Safari on mac os');
                let crpTop = parseInt($(cropperArea).css('top'));
                let crpLeft = parseInt($(cropperArea).css('left'));
                if(crpTop< flag.marginTop && crpLeft > flag.marginLeft){
                    let dy = (((flag.marginTop - crpTop)* staticLogoSize)/viewHeight)+35;
                    context.drawImage(imgSrc,viewX-20,viewY,viewWidth,viewHeight,0,dy,staticLogoSize, staticLogoSize);
                }else if(crpLeft< flag.marginLeft && crpTop > flag.marginTop){
                    let dx = (((flag.marginLeft - crpLeft)*staticLogoSize)/viewWidth)+20;
                    context.drawImage(imgSrc,viewX-20,viewY-20,viewWidth,viewHeight,dx,0,staticLogoSize, staticLogoSize);
                }else if(crpLeft< flag.marginLeft && crpTop < flag.marginTop){
                    let dy = (((flag.marginTop - crpTop)* staticLogoSize)/viewHeight)+35;
                    let dx = (((flag.marginLeft - crpLeft)*staticLogoSize)/viewWidth)+20;
                    context.drawImage(imgSrc,viewX-20,viewY,viewWidth,viewHeight,dx,dy,staticLogoSize, staticLogoSize);
                }
                else{
                    context.drawImage(imgSrc,viewX-20,viewY-20,viewWidth,viewHeight,0,0,staticLogoSize, staticLogoSize);
                }
                // let dy = ((70 - crpTop) * 500) / sheight;
                // let dx = ((20 - crpLeft) * 500) / swidth;
                // if (crpTop > 70 && crpLeft > 20) {
                //     context.drawImage(imgSrc, sx, sy, swidth, sheight, 0, 0, staticLogoSize, staticLogoSize);
                // } else if (crpTop < 70 && crpLeft > 20) {
                //     // let dy = ((70 - crpTop) * 500) / sheight;
                //     context.drawImage(imgSrc, sx, sy, swidth, sheight, 0, dy, staticLogoSize, staticLogoSize);
                // } else if (crpTop > 70 && crpLeft < 20) {
                //     // let dx = ((20 - crpLeft) * 500) / swidth;
                //     context.drawImage(imgSrc, sx, sy, swidth, sheight, dx, 0, staticLogoSize, staticLogoSize);
                // } else {

                //     context.drawImage(imgSrc, sx, sy, swidth, sheight, dx, dy, staticLogoSize, staticLogoSize);
                // }
                


            } else {
                context.drawImage(imgSrc, sx, sy, swidth, sheight, 0, 0, staticLogoSize, staticLogoSize);
                // var conObject= {
                //     sx:sx,
                //     sy:sy,
                //     swidth:swidth,
                //     sheight:sheight
                // };
                // console.log('conObject', conObject);

                // context.drawImage(imgSrc, 200, 100, 200, 200, 0, 0, staticLogoSize, staticLogoSize);
            }
            // context.drawImage(imgSrc, sx, sy, swidth, sheight, 20, 72, staticLogoSize, staticLogoSize);
            // img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight
            // s = source
            // d = destination
            // econtext.clearRect(0,0,20,20); //x,y, widht, height
            $(croppedContainer).empty();
            croppedContainer.appendChild(canvas);
            croppedContainer.appendChild(overDiv);
            // show the canvas and eraser tools
            $("#cropContain").addClass('active');
            // adding staticlogosize class to parent
            $(".editorHolder").css({
                height: (staticLogoSize + 220) + 'px'
            });
            $(".canvasArea").css({
                height: (staticLogoSize + 40) + 'px'
            });

            $(".erasersTool").addClass('active');
            $(".cropTool").hide();
            // making opacity 0 of the cropping area that need to be revert back when clicked on undo button
            $(".elementResizable").css({
                opacity: 0
            });
            flag.dataUrl = canvas.toDataURL();
            flag.cropped = true;
        });

        var erase = false; // erase flag
        function init() {
            overDiv.addEventListener('mousedown', mouseDown, false);
            document.getElementById("cropContain").addEventListener('mouseup', mouseUp, false);
            overDiv.addEventListener('mousemove', mouseMove, false);
            /* Event listne on overDiv, not on canvas for smooth brush tool
             *
             */
        }

        function mouseDown(e) {
            erase = true;
            /* Pick color and set background
             * in this case color will be picked and redraw the canvas with a rect or arc that will have a fill color of selected
             * Also this little code is conditional, if user selects colorPicker tool, 
             * flag.colorTool === true{}
             */
            if (flag.colorTool === true) {
                var canvasOffset = $(canvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
                var imageData = context.getImageData(canvasX, canvasY, 1, 1);
                var pixel = imageData.data;
                var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
                var hexColor = '#' + dColor.toString(16);
                if (dColor === 0) {
                    hexColor = '#000000';
                }

                var image = new Image();
                image.onload = function () {
                    context.beginPath();
                    context.fillStyle = hexColor;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
                };
                image.src = flag.dataUrl;
            }
        }

        function eraseArc(x, y) {
            context.beginPath();
            context.arc(x + 5, y + 5, 10, 0, 2 * Math.PI);
            context.stroke();
        }

        function clearArc(context, x, y, radius) {
            context.save();
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
            context.fill();
            context.restore();
        }

        function mouseMove(e) {
            if (flag.eraser === true) {
                var parentOffLeft = $("#cropContain").offset().left;
                var parentOffTop = $("#cropContain").offset().top;
                var startX = e.pageX - (this.offsetLeft + parentOffLeft);
                var startY = e.pageY - (this.offsetTop + parentOffTop);
                // --------- get canvas and container width and height 
                var cparentWidth = $("#cropContain").width();
                var cparentHeight = $("#cropContain").height();

                var eraseX = startX - 10;
                var eraseY = startY - 10;

                flag.brushElem.style.left = ((startX + ((cparentWidth - (canvas.width + 20)) / 2)) - flag.brush) + 'px';
                flag.brushElem.style.top = ((startY + ((cparentHeight - (canvas.height + 20)) / 2)) - flag.brush) + 'px';
                if (erase) {
                    if (flag.brusShape === 'round') {
                        clearArc(context, eraseX, eraseY, flag.brush);

                    } else {
                        context.clearRect(eraseX - flag.brush, eraseY - flag.brush, flag.brush * 2, flag.brush * 2);
                    }
                    // context.clearRect(startX, startY, 20, 20);
                    /* Canvas widht and height has been increased by 20px 
                     * New eraseX and eraseY are added for this task
                     */
                    flag.dataUrl = canvas.toDataURL();
                } else {
                    return false;
                }
            }
        }

        function mouseUp() {
            erase = false;
        }
        init();

        /* confirm click
         * 
         */
        $("#confirmEdit").click(function () {
            if (flag.cropped === true) {
                $("#undoimage").click();
                var imgSrc = canvas.toDataURL();
                $("#selectedLogo").attr('src', imgSrc);
                $(".popupContainer").removeClass("showpopup");
                $("body").css({
                    overflow: 'auto'
                });
                flag.cropped = false;
                // ----- store in stored container 
                setTimeout(function () {
                    storeIcons();
                }, 1000);
            } else {
                /* modal open 
                 * you have not cropped anything, please crop and confirm
                 */
                $("#commonAlert-body").html('You have not cropped anything, please crop and confirm.');
                $("#commonModalBtn").click();
            }
        });
    })();
};
var iconsAttr;

function storeIcons() {
    iconsAttr = [];
    var imgSrcOut = document.getElementById('selectedLogo');
    var swidthOut = imgSrcOut.naturalWidth;
    var sheightOut = imgSrcOut.naturalWidth;
    var storeCont = document.getElementById('storeContainer');
    $("input:checkbox[name='ossm']").each(function () {
        var thisName = $(this).attr('id');
        var thisSize = parseInt($(this).attr('data-size'));
        iconsAttr.push({
            'name': thisName,
            'size': thisSize
        });
    });
    /*  for loop in iconsAttr 
     *  multiple canvas create with multiple dimention
     *  one same class 'output'  for same css definition
     */
    $(storeCont).empty();
    for (var i = 0; i < iconsAttr.length; i++) {
        var canvasStore = document.createElement('canvas');
        canvasStore.id = 'canvasStore' + i;
        canvasStore.setAttribute('class', 'storedIcon');
        canvasStore.width = iconsAttr[i].size * 2;
        canvasStore.height = iconsAttr[i].size * 2;
        var contextOut = canvasStore.getContext('2d');
        contextOut.drawImage(imgSrcOut, 0, 0, swidthOut, sheightOut, 0, 0, iconsAttr[i].size * 2, iconsAttr[i].size * 2);
        canvasStore.style.width = iconsAttr[i].size + 'px';
        storeCont.appendChild(canvasStore);

    }
};

function downloadIcons() {
    // console.log(iconsAttr);
    var outputCont = document.getElementById('outContainer');
    $(outputCont).empty();
    var storedItems = document.getElementsByClassName('storedIcon');
    var icnonsLength = storedItems.length;
    for (var i = 0; i < icnonsLength; i++) {
        var iconSrc = storedItems[i];

        var srcWidth = iconSrc.width;
        var srcHeight = iconSrc.height;

        var outWidth = parseInt(iconSrc.style.width);
        var outHeight = outWidth * srcHeight / srcWidth;

        var canvasOut = document.createElement('canvas');
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('class', 'outputClick');

        canvasOut.id = 'canvasOut' + i;
        var outctx = canvasOut.getContext('2d');

        canvasOut.width = outWidth;
        canvasOut.height = outHeight;

        outctx.drawImage(iconSrc, 0, 0, srcWidth, srcHeight, 0, 0, outWidth, outHeight);
        outputCont.appendChild(canvasOut);

        var imgageData = canvasOut.toDataURL("image/png"); //$("#outputimage").attr
        // Now browser starts downloading it instead of just showing it
        var newImage = imgageData.replace(/^data:image\/png/, "data:application/octet-stream");
        $(downloadAnchor).attr("download", iconsAttr[i].name + ".png").attr("href", newImage);
        if (iconsAttr[i].name === 'favico') {
            $(downloadAnchor).attr("download", iconsAttr[i].name + ".ico").attr("href", newImage);
        }
        if(iconsAttr[i].name === 'instagram'){
            $(downloadAnchor).attr("download", iconsAttr[i].name + ".jpeg").attr("href", newImage);
        }
        if(iconsAttr[i].name === 'extrajpg'){
            $(downloadAnchor).attr("download", "Extra-JPEG-Icon.jpeg").attr("href", newImage);
        }
        outputCont.appendChild(downloadAnchor);

        // $.ajax({
        //     url:"process.php",
        //     // send the base64 post parameter
        //     data:{
        //       logoid:123456,
        //       name: iconsAttr[i].name,
        //       base64: imgageData
        //     },
        //     // important POST method !
        //     type:"post",
        //     complete:function(response){
        //       console.log(response.responseText);
        //       $(downloadAnchor).attr("href", response.responseText);
        //     }
        //   });

    }
    // for (var i = 0; i < $(".outputClick").length; i++) {
    //     $(".outputClick")[i].click();
    // }
    // outputCont.appendChild(downloadAnchor);
    setTimeout(function () {
        for (var i = 0; i < $(".outputClick").length; i++) {
            $(".outputClick")[i].click();
        }
        $("#loader").addClass('inActive');
    }, 1000);
}
// ----------- touch support 
function touchHandler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent({
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup"
        }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    // event.preventDefault();
}

function initialize() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}