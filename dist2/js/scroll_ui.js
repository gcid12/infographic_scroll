(function ($) {

	// Init ScrollMagic
    var controller = new ScrollMagic.Controller();

    // get all slides
	var slides = ["#slide01", "#slide02", "#slide03"];

	// get all headers in slides that trigger animation
	var headers = ["#slide01 header", "#slide02 header", "#slide03 header"];

	// get all break up sections
	var breakSections = ["#cb01", "#cb02", "#cb03"];

	// number of loaded images for preloader progress 
	var loadedCount = 0; //current number of images loaded
	var imagesToLoad = $('.bcg').length; //number of slides with .bcg container
	var loadingProgress = 0; //timeline progress - starts at 0

	$('.bcg').imagesLoaded({
	    background: true
	  }
	).progress( function( instance, image ) {
		loadProgress();
	});

	function loadProgress(imgLoad, image)
	{
	 	//one more image has been loaded
		loadedCount++;

		loadingProgress = (loadedCount/imagesToLoad);

		//console.log(loadingProgress);

		// GSAP timeline for our progress bar
		TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});

	}

	//progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
	var progressTl = new TimelineMax({paused:true,onUpdate:progressUpdate,onComplete:loadComplete});

	progressTl
		//tween the progress bar width
		.to($('.progress span'), 1, {width:100, ease:Linear.easeNone});

	//as the progress bar witdh updates and grows we put the precentage loaded in the screen
	function progressUpdate()
	{
		//the percentage loaded based on the tween's progress
		loadingProgress = Math.round(progressTl.progress() * 100);
		//we put the percentage in the screen
		$(".txt-perc").text(loadingProgress + '%');

	}

	function loadComplete() {

		// preloader out
		var preloaderOutTl = new TimelineMax();

		preloaderOutTl
			.to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
			.to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
			.set($('body'), {className: '-=is-loading'})
			.set($('#intro'), {className: '+=is-loaded'})
			.to($('#preloader'), 0.7, {yPercent: 100, ease:Power4.easeInOut})
			.set($('#preloader'), {className: '+=is-hidden'})
			.from($('#intro .title'), 1, {autoAlpha: 0, ease:Power1.easeOut}, '-=0.2')
			.from($('#intro p'), 0.7, {autoAlpha: 0, ease:Power1.easeOut}, '+=0.2')

			.from($('.scroll-hint'), 0.3, {y: -20, autoAlpha: 0, ease:Power1.easeOut}, '+=0.1');

		return preloaderOutTl;
	}

	// Enable ScrollMagic only for desktop, disable on touch and mobile devices
	if (!Modernizr.touch) {

		// SCENE 1
		// create scenes for each of the headers
		headers.forEach(function (header, index) {
		    
		    // number for highlighting scenes
			var num = index+1;

		    // make scene
		    var headerScene = new ScrollMagic.Scene({
		        triggerElement: header, // trigger CSS animation when header is in the middle of the viewport 
		        offset: -95 // offset triggers the animation 95 earlier then middle of the viewport, adjust to your liking
		    })
		    .setClassToggle('#slide0'+num, 'is-active') // set class to active slide
		    //.addIndicators() // add indicators (requires plugin), use for debugging
		    .addTo(controller);
		});

	    // SCENE 2
	    // change color of the nav for dark content blocks
	    breakSections.forEach(function (breakSection, index) {
		    
		    // number for highlighting scenes
			var breakID = $(breakSection).attr('id');

		    // make scene
		    var breakScene = new ScrollMagic.Scene({
		        triggerElement: breakSection, // trigger CSS animation when header is in the middle of the viewport 
		        triggerHook: 0.75
		    })
		    .setClassToggle('#'+breakID, 'is-active') // set class to active slide
		    .on("enter", function (event) {
			    $('nav').attr('class','is-light');
			})
		    .addTo(controller);
		});

	    // SCENE 3
	    // change color of the nav back to dark
		slides.forEach(function (slide, index) {

			var slideScene = new ScrollMagic.Scene({
		        triggerElement: slide // trigger CSS animation when header is in the middle of the viewport
		    })
		    .on("enter", function (event) {
			    $('nav').removeAttr('class');
			})
		    .addTo(controller);
	    });

	    // SCENE 4 - parallax effect on each of the slides with bcg
	    // move bcg container when slide gets into the view
		slides.forEach(function (slide, index) {

			var $bcg = $(slide).find('.bcg');

			var slideParallaxScene = new ScrollMagic.Scene({
		        triggerElement: slide, 
		        triggerHook: 1,
		        duration: "100%"
		    })
		    .setTween(TweenMax.from($bcg, 1, {y: '-40%', autoAlpha: 0.3, ease:Power0.easeNone}))
		    .addTo(controller);
	    });

	    // SCENE 5 - parallax effect on the intro slide
	    // move bcg container when intro gets out of the the view

	    var introTl = new TimelineMax();

	    introTl
	    	.to($('#intro header, .scroll-hint'), 0.2, {autoAlpha: 0, ease:Power1.easeNone})
	    	//.to($('#intro .bcg'), 1.4, {y: '20%', ease:Power1.easeOut}, '-=0.2')
	    	.to($('#intro'), 0.7, {autoAlpha: 0.5, ease:Power1.easeNone}, 0);

		var introScene = new ScrollMagic.Scene({
	        triggerElement: '#intro', 
	        triggerHook: 0,
	        duration: "100%"
	    })
	    .setTween(introTl)
	    .addTo(controller);

	    // SCENE 6 - pin the first section
	    // and update text



	    var pinScene01Tl = new TimelineMax();

	    pinScene01Tl

            .set('#slide01 .navbar-header',{css:{position:"fixed",top:"0px",left:"50px",opacity:0.9}})
            .set('#slide01 .partners',{css:{position:"fixed",width:"400px",top:"20px",right:"50px",opacity:0.9}})

            .set('#slide01 .categories',{css:{position:"fixed",top:"10px"}})

            .set('#slide01 .box-1',{css:{"flex-grow":40}})
            .set('#slide01 .diagram-container',{css:{position:"absolute",left:"5", width:"500px",height:"250px", opacity:1}})
            .set('#slide01 .box-2',{css:{"flex-grow":1}})
            .set('#slide01 .box-3',{css:{"flex-grow":20}})


            .set('#slide01 .tag-1a',{css:{position:"absolute",top:"54%",left:"30%",opacity:0}})
            .set('#slide01 .tag-4a',{css:{position:"absolute",top:"85%",left:"30%",opacity:0}})
            .set('#slide01 .tag-2a',{css:{position:"absolute",top:"75%",left:"90%",opacity:0}})
            .set('#slide01 .tag-3a',{css:{position:"absolute",top:"87%",left:"77%",opacity:0}})
            .set('#slide01 .tag-5a',{css:{position:"absolute",top:"115%",left:"30%",opacity:0}})
            .set('#slide01 .tag-6a',{css:{position:"absolute",top:"135%",left:"30%",opacity:0}})
            .set('#slide01 .tag-7a',{css:{position:"absolute",top:"155%",left:"30%",opacity:0}})


            .set('#slide01 .image1',{css:{display:"block",position:"absolute",top:"0%",left:"20%",opacity:0.9}})
            .set('#slide01 .image1b',{css:{display:"block",position:"absolute",top:"0%",left:"20%",opacity:0}})
			//2-4
			.set('#slide01 .image2',{css:{display:"block",position:"absolute",top:"30%",left:"87%",width:"34%",height:"100%",opacity:0.9}})
			.set('#slide01 .image2b',{css:{display:"block",position:"absolute",top:"30%",left:"87%",width:"34%",height:"100%",opacity:0}})

			//3-2
			.set('#slide01 .image3',{css:{display:"block",position:"absolute",top:"30%",left:"70%",width:"34%",height:"100%",opacity:0.9}})
			.set('#slide01 .image3b',{css:{display:"block",position:"absolute",top:"30%",left:"70%",width:"34%",height:"100%",opacity:0}})

			//4-3
			.set('#slide01 .image4',{css:{display:"block",position:"absolute",top:"30%",left:"20%",opacity:0.9}})
            .set('#slide01 .image4b',{css:{display:"block",position:"absolute",top:"30%",left:"20%",opacity:0}})


			.set('#slide01 .image5',{css:{display:"block",position:"absolute",top:"60%",left:"20%",opacity:0.9}})
            .set('#slide01 .image5b',{css:{display:"block",position:"absolute",top:"60%",left:"20%",opacity:0}})

            .set('#slide01 .image6',{css:{display:"block",position:"absolute",top:"80%",left:"20%",opacity:0.9}})
            .set('#slide01 .image6b',{css:{display:"block",position:"absolute",top:"80%",left:"20%",opacity:0}})

            .set('#slide01 .image7',{css:{display:"block",position:"absolute",top:"100%",left:"20%",opacity:0.9}})
            .set('#slide01 .image7b',{css:{display:"block",position:"absolute",top:"100%",left:"20%",opacity:0}})

            //.set('#slide01 .category-box-7',{css:{opacity:0}})

            // .to($('#slide01 .image7b'), 0, {css:{opacity:0.3}}, 0)
            // .to($('#slide01 .image6b'), 0.2, {css:{opacity:0.3}}, 0.3)
            // .to($('#slide01 .image5b'), 0.3, {css:{opacity:0.3}}, 0.6)
            // .to($('#slide01 .image4b'), 0.4, {css:{opacity:0.3}}, 1)
            // .to($('#slide01 .image3b'), 0.5, {css:{opacity:0.3}}, 1.3)
            // .to($('#slide01 .image2b'), 0.6, {css:{opacity:0.3}}, 1.6)
            // .to($('#slide01 .image1b'), 0.7, {css:{opacity:0.3}}, 2)

			//Diagram moves


            .to($('#slide01 .diagram-container'), 1, {css:{position:"relative",top:"40px",left:"-30px",width:"300px",height:"250px", opacity:1}})
            .to($('#slide01 .box-3'), 0.5, {css:{"flex-grow":1, opacity:0}},'-=1')
            .to($('#slide01 .box-1'), 0, {css:{"flex-grow":1, opacity:1}})
            .to($('#slide01 .box-2'), 0, {css:{"flex-grow":20, opacity:1}})




            //.set('#slide01 .navbar-header',1,{css:{position:"absolute",top:"-30px",left:"100px",opacity:1}})
            //.set('#slide01 .partners',{css:{position:"absolute",width:"400px",top:"0px",right:"50px",opacity:0.9}})

            //ON 7  INFRASTRUCTURE
            .fromTo($('#slide01 .category-box-7'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image7b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-7a'), 3, {css:{opacity:1}})
            //OFF 7
            .fromTo($('#slide01 .category-box-7'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 6  PROVISIONING
            .fromTo($('#slide01 .category-box-6'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image6b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-6a'), 3, {css:{opacity:1}})
            //OFF 6
            .fromTo($('#slide01 .category-box-6'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


			//ON 5  RUNTIME
            .fromTo($('#slide01 .category-box-5'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image5b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-5a'), 3, {css:{opacity:1}})
            //OFF 5
            .fromTo($('#slide01 .category-box-5'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 4  ORC
            .fromTo($('#slide01 .category-box-4'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image4b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-4a'), 3, {css:{opacity:1}})
            //OFF 4
            .fromTo($('#slide01 .category-box-4'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 3  PLATFORM
            .fromTo($('#slide01 .category-box-3'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image3b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-3a'), 3, {css:{opacity:1}})
            //OFF 3
            .fromTo($('#slide01 .category-box-3'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 2  OBSERVABILITY
            .fromTo($('#slide01 .category-box-2'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image2b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-2a'), 3, {css:{opacity:1}})
            //OFF 2
            .fromTo($('#slide01 .category-box-2'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 1A
            .fromTo($('#slide01 .category-box-1a'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .fromTo($('#slide01 .image1b'), 4, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=1')
            .to($('#slide01 .tag-1a'), 3, {css:{opacity:1}})

            //OFF 1A
            .fromTo($('#slide01 .category-box-1a'), 1, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 1B
            .fromTo($('#slide01 .category-box-1b'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .to($('#slide01 .tag-1a'), 3, {css:{opacity:1}},'-=1')
            //OFF 1B
            .fromTo($('#slide01 .category-box-1b'), 1, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //ON 1C
            .fromTo($('#slide01 .category-box-1c'), 1, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn})
            .to($('#slide01 .tag-1c'), 3, {css:{opacity:1}},'-=1')
            //OFF 1B
            .fromTo($('#slide01 .category-box-1c'), 2, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})


            //.to($('#slide01 .bcg2'), 0.5, {css:{"flex-grow":1, opacity:1}},'-=1')

            .to($('#slide01 .itag'), 0.5, {css:{opacity:0}})
            .to($('#slide01 .diagram-container'),4,{css:{position:"absolute",left:"5", top:"-20px", width:"500px",height:"250px", opacity:1}})
            .to($('#slide01 .box-3'), 0.5, {css:{"flex-grow":20, opacity:1}},'-=1')
            .to($('#slide01 .box-1'), 0.5, {css:{"flex-grow":40, opacity:1}},'-=1')
            .to($('#slide01 .box-2'), 0.5, {css:{"flex-grow":1, opacity:0}},'-=1')

            .to($('#slide01 .footer2'), 3, {css:{opacity:1}},'+=10')



            // //ON 1A
            // .fromTo($('#slide01 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0')
            // .fromTo($('#slide01 .image1b'), 1.5, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.5')
            // //.to($('#slide01 .tag-1a'), 0.4, {css:{opacity:0.9}},'-=1')
            // //.fromTo($('#slide01 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
            // .fromTo($('#slide01 .category-box-1a'), 0, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn},'-=2')
            // //OFF 1A
            // .fromTo($('#slide01 h1'), 0.6, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut}, '+=1')
            // //.fromTo($('#slide01 section'), 0.6, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut}, '-=0.5')
            // .fromTo($('#slide01 .category-box-1a'), 0, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut})
            // .fromTo($('#slide01 .image1a'), 2, {y: '0'}, {y: 0, autoAlpha: 0, ease:Power1.easeOut}, '-=1')
            // //ON1B
            // .fromTo($('#slide01 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0')
            // .fromTo($('#slide01 .image1b'), 1.5, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.5')
            // //.to($('#slide01 .tag-1a'), 0.4, {css:{opacity:0.9}},'-=1')
            // //.fromTo($('#slide01 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
            // .fromTo($('#slide01 .category-box-1b'), 0, {y: '0'}, {y: 0, autoAlpha: 1, ease:Power1.easeIn},'-=2')






	    var pinScene01 = new ScrollMagic.Scene({
	        triggerElement: '#slide01', 
	        triggerHook: 0,
	        duration: "200%"
	    })
	    .setPin("#slide01")
	    .setTween(pinScene01Tl)
	    .addTo(controller);


        function getData(){
            $.ajax({
                type: 'GET',
                url: 'datatest/data.json',
                data: { get_param: 'value' },
                success: function (data) {

                	//The categories
                    for (var i in data.children){

                        var category =data.children[i];
                        var boxClass= ".category-box-"+category.key ;

                        var element = $('<h2>')
                            .addClass('category')
                            .text(category.name);
						$(boxClass).append(element);

                        var companiesClass= "companies-"+category.key ;
                        var companies = $('<div>')
                            .addClass(companiesClass + " companies");
                        $(boxClass).append(companies);

                        //The Subcategories
						for(var c in category.children){
							var subCategory = category.children[c];

                            var boxItemsClass= "box-items"+category.key+"-"+c ;

                            var boxitems = $('<div>')
                                .addClass(boxItemsClass)
                            	.addClass('box-items');
                            $("."+companiesClass).append(boxitems);

                            var element = $('<h4>')
                                .addClass(" subcategory ")
								.addClass(" subcategory-"+category.key)
                                .text(subCategory.name);
                            $(boxitems).append(element);



                            for(var m in subCategory.items){

                                var company = subCategory.items[m];
                                var companyItem= "item-"+category.key+'-'+c+'-'+m;
																var companyTooltip= "tooltip-"+category.key+'-'+c+'-'+m;

														//<div class="c-tooltip">Hover over me
															//<span class="c-tooltiptext">Tooltip text</span>
															//</div>

                                var item=$('<div>')
                                    .addClass('item')
                                    .addClass(companyItem+" c-tooltip")
                                    .attr("style","display:inline-block");
                                $("."+boxItemsClass).append(item);


                                var image =$('<h4>')
                                    .addClass('company')
                                    .attr('style',"background-image:url('"+company.logo+"')")
                                    .attr("data-placement","top")
                                    .attr("title", company.productname);
                                $("."+companyItem).append(image);

                                var name =$('<div>')
                                    .addClass('company-name')
                                    .text(company.productname)
                                $("."+companyItem).append(name);



								//The tooltip container
									var tooltip =$('<span>')
										.addClass(companyTooltip+" c-tooltiptext");
									$("."+companyItem).append(tooltip);



								//The tooltip content`

										//The image
										var image2 =$('<img>')
											.addClass('companyLogo')
											.attr('src',company.logo);
											$(tooltip).append(image2);


										//The text content
										var content =$('<div>')
                                            .addClass(companyTooltip+"_content")
                                            .addClass(" content");
											$(tooltip).append(content);

											var companyContent = "."+companyTooltip+"_content";

											//Twitter
											var social =$('<i>')
												.addClass("fa fa-twitter right")
												.attr("href",company.twitter);
											$(companyContent).append(social);

											//Github Stars
											var stars =$('<a>')
												.addClass("label right")
												.attr("href", company.github)
                                                .text(company.ghstars);
											$(companyContent).append(stars);

											//Github
											var social =$('<i>')
												.addClass("fa fa-github right")
												.attr("href", company.twitter);
											$(stars).append(social);

											//OSS

											if(company.oss){
                                                var oss =$('<span>')
                                                    .addClass("label right")
                                                    .text("OSS");
                                                $(companyContent).append(oss);
											}

											//The Product
											var productName =$('<h5>')
												.text(company.productname);
											$(companyContent).append(productName);

											//The Company Name
											var companyName =$('<p>')
												.text(company.company);
											$(companyContent).append(companyName);

											//Description
											var description =$('<p>')
                                                .text(company.brief);
											$(companyContent).append(description);

														}
										}

										}

                }

            });

        }
				getData();



            // SCENE 7 - pin the second section
	    // and update text

	    var pinScene02Tl = new TimelineMax();

	    pinScene02Tl
	    	.to($('#slide02 h1'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
	    	.to($('#slide02 section'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
	    	.set($('#slide02 h1'), {text: "Call to action here"})
	    	.set($('#slide02 p'), {text: "details here"})
	    	.to($('#slide02 .bcg'), 0.6, {scale: 1.2, transformOrigin: '0% 0%', ease:Power0.easeNone})
            .to($('#slide01 .contact'), 0, {css:{opacity:0}},0)
            .set($('#slide02 .contact'), {css:{opacity:0}})
	    	.fromTo($('#slide02 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
	    	.fromTo($('#slide02 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
	    	.set($('#slide02 h1'), {autoAlpha: 1}, '+=2.5');

	    var pinScene02 = new ScrollMagic.Scene({
	        triggerElement: '#slide02', 
	        triggerHook: 0,
	        duration: "300%"
	    })
	    .setPin("#slide02")
	    .setTween(pinScene02Tl)
	    .addTo(controller);

	    // change behaviour of controller to animate scroll instead of jump
		controller.scrollTo(function (newpos) {
			TweenMax.to(window, 1, {scrollTo: {y: newpos}, ease:Power1.easeInOut});
		});

		//  bind scroll to anchor links
		$(document).on("click", "a[href^='#']", function (e) {
			var id = $(this).attr("href");
			if ($(id).length > 0) {
				e.preventDefault();

				// trigger scroll
				controller.scrollTo(id);

					// if supported by the browser we can even update the URL.
				if (window.history && window.history.pushState) {
					history.pushState("", document.title, id);
				}
			}
		});


    }

}(jQuery));