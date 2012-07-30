<?php 
$feed_page="events";
require('partials/single_head.php'); ?>

      <header class="single-header">

        <div class="item-thumb">
          <img src="https://lh6.googleusercontent.com/-lyccgEbCDf4/TymnvcO73fI/AAAAAAAAAXo/OVJYm97nzD0/w132-h132-n/slides-SS-beehive.jpg" />
            <div class="item-action">
	          Add to calendar
	        </div>
        </div>

        <article class="item-content">
          <h1 class="item-title">Single event title</h1>
            <ul class="item-details">
                <li>May 31, 10pm - June 1, 12pm</li>
                <li>at <a href="place_single.template.html"> Event Place name</a></li> <!-- omit if there is no name -->
                <li>777 Coolest Ave.</li>
                <li>
                    <!-- Loop through tags here -->
                    <ul class="category">
                        <li>food</li>
                        <li>pizza</li>
                        <li>beer</li>
                        <li>tennis</li>
                    </ul>
                </li>
            </ul>
        </article> <!-- .item-content -->

      </header> <!-- .single-header -->

      <section class="single-content">

        <div id="mapCanvas">
          <!-- Static map image here, clicking it opens Google Maps directions -->
          <img src="http://telecom-it.net/images/uploads/images/GMap.gif" />
        </div>
                
        <!-- If Facebook and/or Twitter -->
        <div class="social">
          <div class="facebook">
              <!-- <img src="../img/icons/facebook.png" /> -->
              Facebook
          </div>
          <div class="twitter">
            <!-- <img src="../img/icons/twitter.png" /> -->
            @sammsiyo
          </div>
        </div> <!-- .social -->

        <p class="description">Minim kale chips terry richardson, delectus photo booth scenester yr chambray quinoa Austin nulla. Synth occaecat put a bird on it mumblecore veniam. Nisi non mlkshk etsy. Whatever deserunt lomo, lo-fi gastropub craft beer direct trade. Assumenda ennui accusamus carles. Enim you probably haven't heard of them odio, cray brooklyn fugiat street art next level single-origin coffee put a bird on it iphone stumptown brunch banksy. Irure viral sustainable, messenger bag post-ironic street art ullamco cupidatat consectetur.
        </p>

        
      </section>
      
<?php require('partials/footer.php'); ?>