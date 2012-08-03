<div class="single-wrap">
    <header class="single-header">

        <div class="item-thumb">
            {{#if image}}
                <img src="{{domainUri image}}" />
            {{else}}
                <img src="img/defaults/default-event.png" />
            {{/if}}
        </div>

        <article class="item-content">
            <h1 class="item-title">{{name}}</h1>
            <ul class="item-details">
                <li>{{location.address}}</li>
                <li>
                    <ul class="category">
                        <li>Food</li>
                        <li>Retail</li>
                    </ul>
                </li>
            </ul>
        </article> <!-- .item-content -->

    </header> <!-- .single-header -->

    <nav class="single-place-nav">
        <ul>
            <li class="active" id="place-nav-info">Info</li>
            <li id="place-nav-events">Events</li>
            <li id="place-nav-specials">Specials</li>
        </ul>
    </nav>

    <section class="single-content">

        <article class="place-info">
            <ul class="item-details">
                <li>
                    <span class="detail-title">Hours:</span><br />
                    Mon-Fri 3pm-10pm &#149; Sat 5pm-7pm &#149; Sun Closed
                </li>
                <li><a href="http://coolwebsite.com">Website</a></li>
            </ul>

            <nav class="action-list">
                <ul>
                    {{#if phone}}
                    <li><a href="tel:{{phone}}">Call</a></li>
                    {{/if}}
                    {{#if is_geolocated}}
                    <li><a href="">Directions</a></li>
                    {{/if}}
                    {{#if fb_id}}
                    <li><a href="http://facebook.com/{{fb_id}}"><img src="../img/icons/facebook.png" alt="facebook" /></a></li>
                    {{/if}}
                    {{#if twitter_id}}
                    <li><a href=""><img src="../img/icons/twitter.png" alt="twitter" /></a></li>
                    {{/if}}
                </ul>
            </nav>

            <div id="singleMapCanvas">
                <img src="http://2d-code.co.uk/images/qr-map.jpg" />
            </div>

            <p>{{description}}</p>

        </article> <!-- .place-info -->

        <article class="place-events">
            <ul class="feed">
                <!-- Event feed items here -->
                <li>asdasd</li>
                <li>asdasd</li>
                <li>asdasd</li>
                <li>asdasd</li>
                <li>asdasd</li>
            </ul>
        </article>

        <article class="place-specials">
            <ul class="feed">
                <!-- Special feed items here -->    
                <li>ukhliojl</li>
                <li>ukhliojl</li>
                <li>ukhliojl</li>
                <li>ukhliojl</li>
            </ul>
        </article>
    </section>

</div>