var baseurl = window.location.pathname;
var baseurlwhlanguage = baseurl.substring(4, baseurl.length);

// redirect people to rocket.chat/docs if they try and browse the GitHub pages version
if(location.hostname == "teamforus.github.io" && location.href.indexOf('?noredirect') == -1) {
  location="https://help.forus.io" + location.pathname
}

function scroll_toc(path) {
  //path = path.indexOf(base) == 0? path.substring(base.length) : path.substring(1);
  var path = baseurl.split('/');

  for( var i = path.length-1; i--;){
    if ( path[i] === baseurl.split('/')[1]) path.splice(i, 1);
    if ( path[i] === '') path.splice(i, 1);
  }
  path.pop(); 

  if(path[path.length - 1] == '/') {
    path = path.substring(0, path.length - 1);
  }

  path = '.' + path.join(' .');

  $('.active').removeClass('active');

  if(path.length > 1) {
    $(path).addClass('active');

    while(path.lastIndexOf(' ') > -1) {
      path = path.substring(0, path.lastIndexOf(' '));
      $(path).addClass('active');
    }
  }
}

function addAnchors(path) {

  return $("h2, h3, h4, h5, h6").each(function(i, el) {
    var $el, icon, id;
    $el = $(el);
    id = $el.attr('id');
    icon = `<img src="${path}images/icons/link.svg">`;
    if (id) {
      return $el.prepend($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
    }
  });
}

$(document).ready(function() {

  scroll_toc(window.location.pathname);

  var path = (location.hostname == "rocketchat.github.io" || location.hostname == "rocket.chat") ? '/docs/' : '/';

  console.log(location);


  if(location.pathname !== '/' && location.pathname !== '/nijmegen/'){

    var app = new senna.App();

    app.setBasePath(path);
    addAnchors(path);
    $('table:not(.table-wrapper table)').wrap( "<div class='table-wrapper'></div>" );


    app.addSurfaces('content');
    app.addRoutes(new senna.Route(/.*/, senna.HtmlScreen));

    app.on('startNavigate', function(event) {
      scroll_toc(event.path);

    });

    app.on('endNavigate', function(event) {
      addAnchors(path);
      $('table:not(.table-wrapper table)').wrap( "<div class='table-wrapper'></div>" );

      var hash = event.path.indexOf('#');
      if (hash !== -1) {
        location.hash = path.substr(hash);
      }
      else {
        $('#content').scrollTop(0);
      }
    });
  }
});
