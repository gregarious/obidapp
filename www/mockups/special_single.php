<?php
$feed_page="specials";
require('partials/single_head.php');
?>

      <header class="single-header">
        <div class="item-thumb">
          <img src="../img/defaults/default-special.png" />
            <div class="item-action">
            Add to calendar
          </div>
        </div>
        <section class="item-content">
          <h1 class="single-title">Special title</h1>
          <ul class="item-details">
            <li>at Place Name</li>
            <li>13 Available &bull; expires June 30</li>
            <li>         
              <!-- Loop through tags here -->
              <ul class="category">
                <li>food</li>
                <li>pizza</li>
                <li>beer</li>
                <li>tennis</li>
              </ul>
            </li>
          </ul> <!-- .item-details -->

        </section> <!-- .item-content -->

      </header> <!-- .single-header -->

      <article class="single-content">
        <div id="mapCanvas">
          <!-- Map generated here, clicking it opens Google Maps directions -->
        </div>
        <p>Description<br />
          Minim kale chips terry richardson, delectus photo booth scenester yr chambray quinoa Austin nulla. Synth occaecat put a bird on it mumblecore veniam. Nisi non mlkshk etsy. Whatever deserunt lomo, lo-fi gastropub craft beer direct trade. Assumenda ennui accusamus carles. Enim you probably haven't heard of them odio, cray brooklyn fugiat street art next level single-origin coffee put a bird on it iphone stumptown brunch banksy. Irure viral sustainable, messenger bag post-ironic street art ullamco cupidatat consectetur.
        </p>
      </article>

      <footer id="special-status">
        <!-- Displays Grab it, Use it, or Used. Button's class is changed accordingly -->
        <div class="grab-it action-btn"><a>Grab it!</a></div>
      </footer>
      
<?php require('partials/footer.php'); ?>